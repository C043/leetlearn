import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProblemTimer from "@/components/duolingo/ProblemTimer";

const chime = vi.hoisted(() => ({ playChime: vi.fn(), unlockAudio: vi.fn() }));
vi.mock("@/lib/chime", () => chime);

const MIN = 60_000;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2024-05-10T12:00:00Z"));
  chime.playChime.mockReset();
  chime.unlockAudio.mockReset();
});

const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));
const start = () => fireEvent.click(screen.getByRole("button", { name: /start 15:00 timer/i }));
const clock = () => screen.getByText(/^\d+:\d\d$|Time's up!/).textContent;
const progress = () => Number(screen.getByRole("progressbar").getAttribute("aria-valuenow"));

describe("ProblemTimer", () => {
  it("starts idle, with nothing ticking", () => {
    render(<ProblemTimer />);
    expect(screen.getByRole("button", { name: /start 15:00 timer/i })).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).toBeNull();
    advance(20 * MIN);
    expect(chime.playChime).not.toHaveBeenCalled();
  });

  it("unlocks audio from the Start click (browsers block sound without a gesture)", () => {
    render(<ProblemTimer />);
    start();
    expect(chime.unlockAudio).toHaveBeenCalledTimes(1);
  });

  it("counts down from 15:00", () => {
    render(<ProblemTimer />);
    start();
    expect(clock()).toBe("15:00");
    expect(progress()).toBe(0);
    advance(1000);
    expect(clock()).toBe("14:59");
    advance(59_000);
    expect(clock()).toBe("14:00");
    advance(7.5 * MIN);
    expect(clock()).toBe("6:30");
    expect(progress()).toBe(57);
  });

  it("rounds partial seconds up so it never shows 0:00 early", () => {
    render(<ProblemTimer />);
    start();
    advance(15 * MIN - 750);
    expect(clock()).toBe("0:01");
  });

  it("rings exactly once at 15 minutes and shows Time's up", () => {
    render(<ProblemTimer />);
    start();
    advance(15 * MIN - 1);
    expect(chime.playChime).not.toHaveBeenCalled();
    advance(1);
    expect(chime.playChime).toHaveBeenCalledTimes(1);
    advance(250);
    expect(clock()).toBe("Time's up!");
    expect(progress()).toBe(100);
    advance(30 * MIN);
    expect(chime.playChime).toHaveBeenCalledTimes(1);
    expect(progress()).toBe(100);
  });

  it("resets to idle mid-run without ringing later", () => {
    render(<ProblemTimer />);
    start();
    advance(5 * MIN);
    fireEvent.click(screen.getByRole("button", { name: "Reset timer" }));
    expect(screen.getByRole("button", { name: /start 15:00 timer/i })).toBeInTheDocument();
    advance(20 * MIN);
    expect(chime.playChime).not.toHaveBeenCalled();
  });

  it("restarts a full 15 minutes after time is up", () => {
    render(<ProblemTimer />);
    start();
    advance(15 * MIN + 250);
    fireEvent.click(screen.getByRole("button", { name: "Restart timer" }));
    expect(clock()).toBe("15:00");
    advance(15 * MIN);
    expect(chime.playChime).toHaveBeenCalledTimes(2);
  });

  it("never rings after the modal (and the timer) is closed", () => {
    const { unmount } = render(<ProblemTimer />);
    start();
    advance(10 * MIN);
    unmount();
    advance(10 * MIN);
    expect(chime.playChime).not.toHaveBeenCalled();
  });

  it("keeps correct time when the tab was throttled (computes from the start time)", () => {
    render(<ProblemTimer />);
    start();
    // Jump the clock without running intermediate ticks, like a backgrounded tab
    vi.setSystemTime(Date.now() + 10 * MIN);
    advance(250);
    expect(clock()).toBe("5:00");
  });
});
