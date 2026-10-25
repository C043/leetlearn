import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import StreakButton from "@/components/streak/StreakButton";
import StreakCelebration from "@/components/streak/StreakCelebration";
import StreakWeek from "@/components/streak/StreakWeek";
import AppHeader from "@/components/duolingo/AppHeader";
import { streakView } from "../helpers/fixtures";

// The reminder panel has its own tests; keep the popover tests independent of push support
vi.mock("@/components/streak/ReminderSettings", () => ({
  default: ({ prefs }: { prefs: { reminderHour: number } }) => <p>reminders at {prefs.reminderHour}</p>,
}));

const prefs = { reminderHour: 20, vapidPublicKey: "pub" };

describe("StreakWeek", () => {
  it("shows the 7 days with weekday letters computed in UTC from the date", () => {
    // 2024-05-04 is a Saturday
    render(<StreakWeek week={streakView().week} />);
    const days = screen.getAllByRole("listitem");
    expect(days.map((d) => d.textContent)).toEqual(["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"]);
  });

  it("does not shift letters in time zones west of UTC", () => {
    const original = process.env.TZ;
    process.env.TZ = "America/Los_Angeles";
    try {
      render(<StreakWeek week={streakView().week} />);
      expect(screen.getAllByRole("listitem")[0].textContent).toBe("Sa");
    } finally {
      process.env.TZ = original;
    }
  });

  it("fills active days and rings today", () => {
    render(<StreakWeek week={streakView().week} />);
    const circles = screen.getAllByRole("listitem").map((li) => li.querySelectorAll("span")[1]);
    expect(circles.map((c) => c.className.includes("bg-orange-500"))).toEqual([false, false, false, false, true, true, true]);
    expect(circles.map((c) => c.className.includes("ring-2"))).toEqual([false, false, false, false, false, false, true]);
  });
});

describe("StreakButton", () => {
  it("shows the current streak, orange once today is done", () => {
    render(<StreakButton streak={streakView({ current: 12, doneToday: true })} prefs={prefs} />);
    const button = screen.getByRole("button", { name: "12 day streak" });
    expect(button).toHaveTextContent("12");
    expect(button.className).toContain("text-orange-500");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("is grey until something is solved today", () => {
    render(<StreakButton streak={streakView({ doneToday: false, atRisk: true })} prefs={prefs} />);
    expect(screen.getByRole("button", { name: /day streak/ }).className).toContain("text-zinc-400");
  });

  it.each([
    [{ doneToday: true, atRisk: false }, "You've extended your streak today. See you tomorrow!"],
    [{ doneToday: false, atRisk: true }, "Solve a problem today to keep your streak alive!"],
    [{ doneToday: false, atRisk: false, current: 0 }, "Solve a problem to start a new streak."],
  ])("opens a panel with the right message for %j", async (state, message) => {
    render(<StreakButton streak={streakView(state)} prefs={prefs} />);
    await userEvent.click(screen.getByRole("button", { name: /day streak/ }));
    const panel = screen.getByRole("dialog", { name: "Streak" });
    expect(within(panel).getByText(message)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /day streak/ })).toHaveAttribute("aria-expanded", "true");
  });

  it.each([
    [1, "Longest streak · 1 day"],
    [0, "Longest streak · 0 days"],
    [42, "Longest streak · 42 days"],
  ])("pluralizes the longest streak (%i)", async (longest, text) => {
    render(<StreakButton streak={streakView({ longest })} prefs={prefs} />);
    await userEvent.click(screen.getByRole("button", { name: /day streak/ }));
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("includes the week and the reminder settings", async () => {
    render(<StreakButton streak={streakView()} prefs={{ ...prefs, reminderHour: 9 }} />);
    await userEvent.click(screen.getByRole("button", { name: /day streak/ }));
    const panel = screen.getByRole("dialog");
    expect(within(panel).getAllByRole("listitem")).toHaveLength(7);
    expect(within(panel).getByText("reminders at 9")).toBeInTheDocument();
  });

  it("toggles closed from the button", async () => {
    render(<StreakButton streak={streakView()} prefs={prefs} />);
    const button = screen.getByRole("button", { name: /day streak/ });
    await userEvent.click(button);
    await userEvent.click(button);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on Escape and on a click outside, but not on a click inside", async () => {
    render(
      <div>
        <p>outside</p>
        <StreakButton streak={streakView()} prefs={prefs} />
      </div>,
    );
    const button = screen.getByRole("button", { name: /day streak/ });

    await userEvent.click(button);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();

    await userEvent.click(button);
    fireEvent.mouseDown(screen.getByRole("dialog"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByText("outside"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("StreakCelebration", () => {
  it("ticks up from yesterday's number to today's", () => {
    vi.useFakeTimers();
    render(<StreakCelebration streak={streakView({ current: 5 })} onClose={() => {}} />);
    expect(screen.getByText("4")).toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(450));
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.queryByText("4")).toBeNull();
  });

  it("never shows a negative number", () => {
    render(<StreakCelebration streak={streakView({ current: 0 })} onClose={() => {}} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it.each([
    [1, "You started a streak!"],
    [2, "Streak extended!"],
    [7, "1 week strong!"],
    [14, "2 weeks strong!"],
    [21, "3 weeks strong!"],
    [100, "Legendary. Absolutely legendary."],
    [700, "Legendary. Absolutely legendary."], // 100s beat weeks
    [99, "Streak extended!"],
  ])("celebrates day %i with %j", (current, headline) => {
    render(<StreakCelebration streak={streakView({ current })} onClose={() => {}} />);
    expect(screen.getByText(headline)).toBeInTheDocument();
  });

  it("is a full-screen dialog with the week, focused on Continue", () => {
    render(<StreakCelebration streak={streakView()} onClose={() => {}} />);
    expect(screen.getByRole("dialog", { name: "day streak!" })).toHaveAttribute("aria-modal", "true");
    expect(screen.getAllByRole("listitem")).toHaveLength(7);
    expect(screen.getByRole("button", { name: "Continue" })).toHaveFocus();
  });

  it("closes from Continue and from Escape", async () => {
    const onClose = vi.fn();
    render(<StreakCelebration streak={streakView()} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});

describe("AppHeader", () => {
  it("links home and shows the streak", () => {
    render(<AppHeader streak={streakView({ current: 9 })} prefs={prefs} />);
    expect(screen.getByRole("link", { name: "LeetLearn" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: "9 day streak" })).toBeInTheDocument();
  });

  it("links to the stats page", () => {
    render(<AppHeader streak={streakView()} prefs={prefs} />);
    expect(screen.getByRole("link", { name: "Stats" })).toHaveAttribute("href", "/stats");
  });

  it("highlights the stats icon on the stats page", () => {
    render(<AppHeader streak={streakView()} prefs={prefs} onStats />);
    expect(screen.getByRole("link", { name: "Stats" })).toHaveAttribute("aria-current", "page");
  });
});
