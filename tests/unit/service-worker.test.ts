import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";
import { beforeEach, describe, expect, it, vi } from "vitest";

const SOURCE = readFileSync(join(__dirname, "..", "..", "public", "sw.js"), "utf8");
const ORIGIN = "https://leetlearn.test";

type Listener = (event: Record<string, unknown>) => void;

/** A minimal in-memory Cache Storage. */
function createCaches() {
  const stores = new Map<string, Map<string, Response>>();
  const open = vi.fn(async (name: string) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name)!;
    const key = (r: Request | string) => (typeof r === "string" ? new URL(r, ORIGIN).href : r.url);
    return {
      addAll: vi.fn(async (urls: string[]) => {
        for (const u of urls) store.set(key(u), new Response(`cached ${u}`));
      }),
      put: vi.fn(async (r: Request | string, res: Response) => void store.set(key(r), res)),
    };
  });
  const match = vi.fn(async (r: Request | string) => {
    const k = typeof r === "string" ? new URL(r, ORIGIN).href : r.url;
    for (const store of stores.values()) if (store.has(k)) return store.get(k)!.clone();
    return undefined;
  });
  return {
    stores,
    api: {
      open,
      match,
      keys: vi.fn(async () => [...stores.keys()]),
      delete: vi.fn(async (name: string) => stores.delete(name)),
    },
  };
}

function loadWorker() {
  const listeners = new Map<string, Listener>();
  const caches = createCaches();
  const showNotification = vi.fn(async () => {});
  const clients = { claim: vi.fn(async () => {}), matchAll: vi.fn(async () => [] as unknown[]), openWindow: vi.fn() };
  const fetchMock = vi.fn<(req: Request) => Promise<Response>>();
  const self = {
    addEventListener: (type: string, fn: Listener) => listeners.set(type, fn),
    skipWaiting: vi.fn(),
    location: new URL(ORIGIN),
    registration: { showNotification },
    clients,
  };
  vm.runInNewContext(SOURCE, { self, caches: caches.api, fetch: fetchMock, URL, Response, Request, Promise, console });

  /** Dispatch an event and wait for whatever it passed to waitUntil/respondWith. */
  async function dispatch(type: string, event: Record<string, unknown> = {}) {
    let waited: Promise<unknown> | undefined;
    let responded: Promise<Response> | undefined;
    listeners.get(type)!({
      ...event,
      waitUntil: (p: Promise<unknown>) => (waited = p),
      respondWith: (p: Promise<Response>) => (responded = p),
    });
    await waited;
    return { responded: responded ? await responded : undefined, didRespond: responded !== undefined };
  }

  return { listeners, caches, showNotification, clients, fetchMock, self, dispatch };
}

const request = (path: string, { mode, ...init }: Omit<RequestInit, "mode"> & { mode?: "navigate" } = {}) => {
  const req = new Request(new URL(path, ORIGIN), init);
  // The Request constructor refuses mode "navigate"; only browsers create those
  if (mode) Object.defineProperty(req, "mode", { value: mode });
  return req;
};

const tick = () => new Promise((r) => setTimeout(r, 0));

let sw: ReturnType<typeof loadWorker>;
beforeEach(() => {
  sw = loadWorker();
});

describe("lifecycle", () => {
  it("registers install, activate, fetch, push and notificationclick handlers", () => {
    expect([...sw.listeners.keys()].sort()).toEqual(["activate", "fetch", "install", "notificationclick", "push"]);
  });

  it("pre-caches the offline page and icon on install, and activates immediately", async () => {
    await sw.dispatch("install");
    expect(sw.self.skipWaiting).toHaveBeenCalled();
    expect(await sw.caches.api.match("/offline.html")).toBeDefined();
    expect(await sw.caches.api.match("/icon-192.png")).toBeDefined();
  });

  it("deletes caches from older versions on activate and claims open pages", async () => {
    await sw.caches.api.open("leetlearn-v0");
    await sw.caches.api.open("something-else");
    await sw.dispatch("install");
    await sw.dispatch("activate");
    expect([...sw.caches.stores.keys()]).toEqual(["leetlearn-v1"]);
    expect(sw.clients.claim).toHaveBeenCalled();
  });
});

describe("fetch", () => {
  it.each(["POST", "PUT", "PATCH", "DELETE"])("ignores %s requests", async (method) => {
    const { didRespond } = await sw.dispatch("fetch", { request: request("/patterns/1", { method }) });
    expect(didRespond).toBe(false);
  });

  it("never intercepts API calls (solve, push, settings must hit the server)", async () => {
    const { didRespond } = await sw.dispatch("fetch", { request: request("/api/problems/x/solve", { mode: "navigate" }) });
    expect(didRespond).toBe(false);
  });

  it("ignores cross-origin requests", async () => {
    const req = new Request("https://cdn.example.com/x.png");
    const { didRespond } = await sw.dispatch("fetch", { request: req });
    expect(didRespond).toBe(false);
  });

  it("leaves non-navigation, non-static GETs to the browser", async () => {
    const { didRespond } = await sw.dispatch("fetch", { request: request("/some/data.json") });
    expect(didRespond).toBe(false);
  });

  it.each(["/_next/static/chunks/app.js", "/icon-512.png", "/icon.svg", "/favicon.ico"])(
    "serves %s cache-first and caches it after the first network hit",
    async (path) => {
      sw.fetchMock.mockResolvedValue(new Response("asset", { status: 200 }));
      const first = await sw.dispatch("fetch", { request: request(path) });
      expect(await first.responded!.text()).toBe("asset");
      await tick();

      sw.fetchMock.mockClear();
      const second = await sw.dispatch("fetch", { request: request(path) });
      expect(await second.responded!.text()).toBe("asset");
      expect(sw.fetchMock).not.toHaveBeenCalled();
    },
  );

  it("does not cache failed static responses", async () => {
    sw.fetchMock.mockResolvedValue(new Response("nope", { status: 404 }));
    await sw.dispatch("fetch", { request: request("/_next/static/missing.js") });
    await tick();
    expect(await sw.caches.api.match(request("/_next/static/missing.js"))).toBeUndefined();
  });

  it("loads pages from the network first so progress is always live", async () => {
    await sw.caches.api.open("leetlearn-v1").then((c) => c.put(request("/patterns/1"), new Response("stale")));
    sw.fetchMock.mockResolvedValue(new Response("fresh", { status: 200 }));
    const { responded } = await sw.dispatch("fetch", { request: request("/patterns/1", { mode: "navigate" }) });
    expect(await responded!.text()).toBe("fresh");
    await tick();
    expect(await (await sw.caches.api.match(request("/patterns/1")))!.text()).toBe("fresh");
  });

  it("falls back to the last cached copy of a page when offline", async () => {
    await sw.caches.api.open("leetlearn-v1").then((c) => c.put(request("/patterns/2"), new Response("cached page")));
    sw.fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    const { responded } = await sw.dispatch("fetch", { request: request("/patterns/2", { mode: "navigate" }) });
    expect(await responded!.text()).toBe("cached page");
  });

  it("falls back to the offline page for a never-visited page", async () => {
    await sw.dispatch("install");
    sw.fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    const { responded } = await sw.dispatch("fetch", { request: request("/solutions/never-seen", { mode: "navigate" }) });
    expect(await responded!.text()).toBe("cached /offline.html");
  });

  it("does not cache error pages", async () => {
    sw.fetchMock.mockResolvedValue(new Response("oops", { status: 500 }));
    const { responded } = await sw.dispatch("fetch", { request: request("/patterns/3", { mode: "navigate" }) });
    expect(responded!.status).toBe(500);
    await tick();
    expect(await sw.caches.api.match(request("/patterns/3"))).toBeUndefined();
  });
});

describe("push", () => {
  const pushEvent = (data: unknown) => ({
    data:
      data === undefined
        ? null
        : {
            json: () => (typeof data === "string" ? JSON.parse(data) : data),
            text: () => (typeof data === "string" ? data : JSON.stringify(data)),
          },
  });

  it("shows the notification from the payload", async () => {
    await sw.dispatch("push", pushEvent({ title: "🔥 Streak", body: "Solve one", url: "/patterns/3", tag: "streak-reminder" }));
    expect(sw.showNotification).toHaveBeenCalledWith("🔥 Streak", expect.objectContaining({
      body: "Solve one",
      tag: "streak-reminder",
      renotify: true,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url: "/patterns/3" },
    }));
  });

  it("always shows a notification, even with no payload (iOS revokes permission otherwise)", async () => {
    await sw.dispatch("push", pushEvent(undefined));
    expect(sw.showNotification).toHaveBeenCalledWith("LeetLearn", expect.objectContaining({
      body: "Keep your streak alive today!",
      tag: "streak",
      data: { url: "/" },
    }));
  });

  it("shows plain-text payloads that aren't JSON as the body", async () => {
    await sw.dispatch("push", pushEvent("not { json"));
    expect(sw.showNotification).toHaveBeenCalledWith("LeetLearn", expect.objectContaining({ body: "not { json" }));
  });

  it("fills in defaults for an empty JSON object", async () => {
    await sw.dispatch("push", pushEvent({}));
    expect(sw.showNotification).toHaveBeenCalledWith("LeetLearn", expect.objectContaining({
      body: "Keep your streak alive today!",
      data: { url: "/" },
    }));
  });

  it("falls back to defaults for empty-string fields", async () => {
    await sw.dispatch("push", pushEvent({ title: "", body: "", url: "", tag: "" }));
    expect(sw.showNotification).toHaveBeenCalledWith("LeetLearn", expect.objectContaining({ tag: "streak" }));
  });
});

describe("notificationclick", () => {
  const clickEvent = (url?: string) => ({
    notification: { close: vi.fn(), data: url === undefined ? undefined : { url } },
  });

  it("focuses an open LeetLearn window and navigates it to the target", async () => {
    const navigate = vi.fn();
    const win = { url: `${ORIGIN}/patterns/1`, focus: vi.fn(async () => ({ navigate })) };
    sw.clients.matchAll.mockResolvedValue([{ url: "https://other.site/", focus: vi.fn() }, win]);
    const event = clickEvent("/patterns/4");
    await sw.dispatch("notificationclick", event);
    expect(event.notification.close).toHaveBeenCalled();
    expect(win.focus).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(`${ORIGIN}/patterns/4`);
    expect(sw.clients.openWindow).not.toHaveBeenCalled();
  });

  it("opens a new window when none is open", async () => {
    await sw.dispatch("notificationclick", clickEvent("/solutions/3sum"));
    expect(sw.clients.openWindow).toHaveBeenCalledWith(`${ORIGIN}/solutions/3sum`);
  });

  it("opens the home page when the notification carries no URL", async () => {
    await sw.dispatch("notificationclick", clickEvent());
    expect(sw.clients.openWindow).toHaveBeenCalledWith(`${ORIGIN}/`);
  });

  it("does not crash when focusing returns null (window closed meanwhile)", async () => {
    const win = { url: `${ORIGIN}/`, focus: vi.fn(async () => null) };
    sw.clients.matchAll.mockResolvedValue([win]);
    await expect(sw.dispatch("notificationclick", clickEvent("/"))).resolves.toBeDefined();
  });
});
