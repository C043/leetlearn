import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReminderSettings from "@/components/streak/ReminderSettings";
import type { PushStatus } from "@/lib/use-push-notifications";
import { jsonResponse } from "../helpers/fixtures";

const push = vi.hoisted(() => ({
  state: { status: "on" as PushStatus, busy: false, error: null as string | null, enable: vi.fn(), disable: vi.fn() },
}));
vi.mock("@/lib/use-push-notifications", () => ({ usePushNotifications: () => push.state }));

const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => {
  push.state = { status: "on", busy: false, error: null, enable: vi.fn(), disable: vi.fn() };
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

const renderSettings = (reminderHour = 20) =>
  render(<ReminderSettings prefs={{ reminderHour, vapidPublicKey: "pub" }} />);

describe("status hints", () => {
  it.each<[PushStatus, RegExp]>([
    ["install", /Add to Home Screen/],
    ["unsupported", /doesn't support push notifications/],
    ["unavailable", /served over HTTPS/],
    ["denied", /Notifications are blocked/],
  ])("explains the %s state and offers no controls", (status, hint) => {
    push.state.status = status;
    renderSettings();
    expect(screen.getByText(hint)).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("combobox")).toBeNull();
  });

  it("shows a spinner while detecting", () => {
    push.state.status = "loading";
    const { container } = renderSettings();
    expect(container.querySelector(".animate-spin")).not.toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("turning reminders on", () => {
  it("offers a button that enables push", async () => {
    push.state.status = "off";
    renderSettings();
    await userEvent.click(screen.getByRole("button", { name: /turn on reminders/i }));
    expect(push.state.enable).toHaveBeenCalledTimes(1);
  });

  it("disables the button while busy", () => {
    push.state = { ...push.state, status: "off", busy: true };
    renderSettings();
    expect(screen.getByRole("button", { name: /turn on reminders/i })).toBeDisabled();
  });

  it("shows errors from the push hook", () => {
    push.state = { ...push.state, status: "off", error: "Couldn't save the subscription" };
    renderSettings();
    expect(screen.getByText("Couldn't save the subscription")).toBeInTheDocument();
  });
});

describe("when reminders are on", () => {
  it("offers every hour from 6:00 up to the 22:00 last call, preselecting the saved one", () => {
    renderSettings(19);
    const select = screen.getByRole("combobox");
    const values = [...(select as HTMLSelectElement).options].map((o) => Number(o.value));
    expect(values).toEqual(Array.from({ length: 17 }, (_, i) => i + 6));
    expect(select).toHaveValue("19");
    expect(screen.getByText(/last call/i)).toBeInTheDocument();
  });

  it("saves a new hour", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ reminderHour: 8 }));
    renderSettings(20);
    await userEvent.selectOptions(screen.getByRole("combobox"), "8");
    expect(fetchMock).toHaveBeenCalledWith("/api/streak/settings", expect.objectContaining({ method: "PATCH" }));
    expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as string)).toEqual({ reminderHour: 8 });
    expect(screen.getByRole("combobox")).toHaveValue("8");
  });

  it("reverts the hour when the server rejects it", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: "bad" }, 400));
    renderSettings(20);
    await userEvent.selectOptions(screen.getByRole("combobox"), "7");
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveValue("20"));
  });

  it("reverts the hour when offline", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    renderSettings(21);
    await userEvent.selectOptions(screen.getByRole("combobox"), "6");
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveValue("21"));
  });

  it("sends a test notification and confirms it", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ sent: 1, failed: 0 }));
    renderSettings();
    await userEvent.click(screen.getByRole("button", { name: "Send test" }));
    expect(fetchMock).toHaveBeenCalledWith("/api/push/test", { method: "POST" });
    expect(await screen.findByRole("button", { name: "Sent!" })).toBeInTheDocument();
  });

  it("disables Send test while sending", async () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    renderSettings();
    await userEvent.click(screen.getByRole("button", { name: "Send test" }));
    expect(screen.getByRole("button", { name: "Send test" })).toBeDisabled();
  });

  it("shows the server's reason when the test fails", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: "No device received it." }, 502));
    renderSettings();
    await userEvent.click(screen.getByRole("button", { name: "Send test" }));
    expect(await screen.findByText("No device received it.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send test" })).toBeEnabled();
  });

  it("shows a generic message when the test can't reach the server", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    renderSettings();
    await userEvent.click(screen.getByRole("button", { name: "Send test" }));
    expect(await screen.findByText("Couldn't send a test")).toBeInTheDocument();
  });

  it("turns reminders off", async () => {
    renderSettings();
    await userEvent.click(screen.getByRole("button", { name: /turn off/i }));
    expect(push.state.disable).toHaveBeenCalledTimes(1);
  });
});
