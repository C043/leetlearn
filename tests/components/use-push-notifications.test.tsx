import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { jsonResponse } from "../helpers/fixtures";

type Permission = "default" | "granted" | "denied";

interface FakeSub {
  endpoint: string;
  toJSON: () => unknown;
  unsubscribe: ReturnType<typeof vi.fn>;
}

/** Browser push plumbing with knobs for each branch of the hook. */
function setupBrowser({
  userAgent = "Mozilla/5.0 (X11; Linux x86_64) Chrome/130",
  platform = "Linux x86_64",
  maxTouchPoints = 0,
  standalone = false,
  serviceWorker = true,
  pushManager = true,
  notification = true,
  permission = "default" as Permission,
  requestResult = "granted" as Permission,
  registration = true,
  existingSub = false,
} = {}) {
  const sub: FakeSub = {
    endpoint: "https://push.example/sub-1",
    toJSON: () => ({ endpoint: "https://push.example/sub-1", keys: { p256dh: "k", auth: "a" } }),
    unsubscribe: vi.fn(async () => true),
  };
  const pm = {
    current: existingSub ? sub : null,
    getSubscription: vi.fn(async () => pm.current),
    // Typed so tests can read back the options the hook passed
    subscribe: vi.fn<(options: PushSubscriptionOptionsInit) => Promise<FakeSub>>(async () => {
      pm.current = sub;
      return sub;
    }),
  };
  const reg = { pushManager: pm };
  const sw = {
    getRegistration: vi.fn(async () => (registration ? reg : undefined)),
    ready: Promise.resolve(reg),
  };

  const nav = navigator as unknown as Record<string, unknown>;
  for (const [k, v] of Object.entries({ userAgent, platform, maxTouchPoints, standalone })) {
    Object.defineProperty(nav, k, { value: v, configurable: true });
  }
  if (serviceWorker) Object.defineProperty(nav, "serviceWorker", { value: sw, configurable: true });
  else delete nav.serviceWorker;

  const win = window as unknown as Record<string, unknown>;
  if (pushManager) win.PushManager = function PushManager() {};
  else delete win.PushManager;
  const N = { permission, requestPermission: vi.fn(async () => ((N.permission = requestResult), requestResult)) };
  if (notification) win.Notification = N;
  else delete win.Notification;
  window.matchMedia = vi.fn((q: string) => ({ matches: standalone && q.includes("standalone") })) as never;

  return { sub, pm, sw, Notification: N };
}

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.resetModules(); // the hook keeps a once-per-load "synced" flag
  fetchMock.mockReset().mockResolvedValue(jsonResponse({ ok: true }));
  vi.stubGlobal("fetch", fetchMock);
});

async function mountHook(key = "AQID_-8") {
  const { usePushNotifications } = await import("@/lib/use-push-notifications");
  const hook = renderHook(() => usePushNotifications(key));
  await waitFor(() => expect(hook.result.current.status).not.toBe("loading"));
  return hook;
}

describe("detecting the current state", () => {
  it("asks iPhone users in a Safari tab to install the app first", async () => {
    setupBrowser({ userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari" });
    expect((await mountHook()).result.current.status).toBe("install");
  });

  it("detects iPadOS, which reports itself as a Mac", async () => {
    setupBrowser({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari", platform: "MacIntel", maxTouchPoints: 5 });
    expect((await mountHook()).result.current.status).toBe("install");
  });

  it("does not mistake a desktop Mac for an iPad", async () => {
    setupBrowser({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari", platform: "MacIntel", maxTouchPoints: 0 });
    expect((await mountHook()).result.current.status).toBe("off");
  });

  it("works on iOS once launched from the Home Screen", async () => {
    setupBrowser({ userAgent: "Mozilla/5.0 (iPhone) Safari", standalone: true });
    expect((await mountHook()).result.current.status).toBe("off");
  });

  it.each([
    { serviceWorker: false },
    { pushManager: false },
    { notification: false },
  ])("is unsupported without the Push API pieces (%j)", async (missing) => {
    setupBrowser(missing);
    expect((await mountHook()).result.current.status).toBe("unsupported");
  });

  it("reports a blocked permission", async () => {
    setupBrowser({ permission: "denied" });
    expect((await mountHook()).result.current.status).toBe("denied");
  });

  it("is unavailable without a registered service worker (dev server)", async () => {
    setupBrowser({ registration: false });
    expect((await mountHook()).result.current.status).toBe("unavailable");
  });

  it("is off without a subscription", async () => {
    setupBrowser({ permission: "granted" });
    expect((await mountHook()).result.current.status).toBe("off");
  });

  it("is off when a subscription exists but permission was reset", async () => {
    setupBrowser({ permission: "default", existingSub: true });
    expect((await mountHook()).result.current.status).toBe("off");
  });

  it("is on with a subscription and permission, and re-syncs it to the server once per page load", async () => {
    setupBrowser({ permission: "granted", existingSub: true });
    expect((await mountHook()).result.current.status).toBe("on");
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/push/subscribe");
    expect(JSON.parse(init!.body as string)).toEqual({
      subscription: { endpoint: "https://push.example/sub-1", keys: { p256dh: "k", auth: "a" } },
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    // A second component using the hook on the same page doesn't re-send
    const { usePushNotifications } = await import("@/lib/use-push-notifications");
    const second = renderHook(() => usePushNotifications("AQID_-8"));
    await waitFor(() => expect(second.result.current.status).toBe("on"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("stays on even if the background re-sync fails", async () => {
    setupBrowser({ permission: "granted", existingSub: true });
    fetchMock.mockRejectedValue(new TypeError("offline"));
    expect((await mountHook()).result.current.status).toBe("on");
  });

  it("falls back to unsupported if detection throws", async () => {
    const { sw } = setupBrowser();
    sw.getRegistration.mockRejectedValue(new Error("SecurityError"));
    expect((await mountHook()).result.current.status).toBe("unsupported");
  });
});

describe("enable", () => {
  it("subscribes with the VAPID key decoded from base64url and saves it", async () => {
    const { pm } = setupBrowser();
    const { result } = await mountHook("AQID_-8");
    await act(() => result.current.enable());

    expect(result.current).toMatchObject({ status: "on", busy: false, error: null });
    const options = pm.subscribe.mock.calls[0][0] as { userVisibleOnly: boolean; applicationServerKey: Uint8Array };
    expect(options.userVisibleOnly).toBe(true);
    expect([...options.applicationServerKey]).toEqual([1, 2, 3, 255, 239]);
    expect(fetchMock).toHaveBeenCalledWith("/api/push/subscribe", expect.objectContaining({ method: "POST" }));
  });

  it("decodes a real 65-byte P-256 public key", async () => {
    const { pm } = setupBrowser();
    const key = "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM";
    const { result } = await mountHook(key);
    await act(() => result.current.enable());
    const bytes = (pm.subscribe.mock.calls[0][0] as { applicationServerKey: Uint8Array }).applicationServerKey;
    expect(bytes).toHaveLength(65);
    expect(bytes[0]).toBe(4); // uncompressed point marker
  });

  it("reuses an existing browser subscription", async () => {
    const { pm } = setupBrowser({ permission: "default", existingSub: true });
    const { result } = await mountHook();
    await act(() => result.current.enable());
    expect(pm.subscribe).not.toHaveBeenCalled();
    expect(result.current.status).toBe("on");
  });

  it.each<[Permission, string]>([
    ["denied", "denied"],
    ["default", "off"],
  ])("handles the permission prompt answered %s", async (answer, status) => {
    const { pm } = setupBrowser({ requestResult: answer });
    const { result } = await mountHook();
    await act(() => result.current.enable());
    expect(result.current.status).toBe(status);
    expect(pm.subscribe).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("is unavailable when the service worker went away", async () => {
    const { sw } = setupBrowser();
    const { result } = await mountHook();
    sw.getRegistration.mockResolvedValue(undefined as never);
    await act(() => result.current.enable());
    expect(result.current.status).toBe("unavailable");
  });

  it("reports when the server refuses to save the subscription", async () => {
    setupBrowser();
    fetchMock.mockResolvedValue(jsonResponse({ error: "Invalid push subscription" }, 400));
    const { result } = await mountHook();
    await act(() => result.current.enable());
    expect(result.current).toMatchObject({ status: "off", busy: false, error: "Couldn't save the subscription" });
  });

  it("reports a failed subscribe call", async () => {
    const { pm } = setupBrowser();
    pm.subscribe.mockRejectedValue(new Error("Registration failed - push service error"));
    const { result } = await mountHook();
    await act(() => result.current.enable());
    expect(result.current.error).toBe("Registration failed - push service error");
  });

  it("is busy while working", async () => {
    const { Notification } = setupBrowser();
    let answer!: (p: Permission) => void;
    Notification.requestPermission.mockReturnValue(new Promise((r) => (answer = r)));
    const { result } = await mountHook();
    let pending!: Promise<void>;
    act(() => void (pending = result.current.enable()));
    expect(result.current.busy).toBe(true);
    await act(async () => {
      answer("default");
      await pending;
    });
    expect(result.current.busy).toBe(false);
  });
});

describe("disable", () => {
  it("removes the subscription on the server and in the browser", async () => {
    const { sub } = setupBrowser({ permission: "granted", existingSub: true });
    const { result } = await mountHook();
    fetchMock.mockClear();
    await act(() => result.current.disable());
    expect(fetchMock).toHaveBeenCalledWith("/api/push/subscribe", expect.objectContaining({ method: "DELETE" }));
    expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as string)).toEqual({ endpoint: sub.endpoint });
    expect(sub.unsubscribe).toHaveBeenCalled();
    expect(result.current.status).toBe("off");
  });

  it("just turns off when there is nothing to remove", async () => {
    setupBrowser({ permission: "granted" });
    const { result } = await mountHook();
    await act(() => result.current.disable());
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.status).toBe("off");
  });

  it("reports a failure and stays on", async () => {
    setupBrowser({ permission: "granted", existingSub: true });
    const { result } = await mountHook();
    fetchMock.mockRejectedValue(new Error("offline"));
    await act(() => result.current.disable());
    expect(result.current).toMatchObject({ status: "on", error: "offline", busy: false });
  });
});
