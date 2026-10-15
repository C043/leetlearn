import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProblemModal from "@/components/duolingo/ProblemModal";
import { jsonResponse, problemView, streakView } from "../helpers/fixtures";

const router = vi.hoisted(() => ({ refresh: vi.fn(), push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/lib/chime", () => ({ playChime: vi.fn(), unlockAudio: vi.fn() }));

const fetchMock = vi.fn<typeof fetch>();
let onClose: ReturnType<typeof vi.fn>;
let onStreakExtended: ReturnType<typeof vi.fn>;

beforeEach(() => {
  router.refresh.mockReset();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  onClose = vi.fn();
  onStreakExtended = vi.fn();
});

function open(overrides = {}) {
  const problem = problemView(overrides);
  render(<ProblemModal problem={problem} onClose={onClose} onStreakExtended={onStreakExtended} />);
  return problem;
}

const yes = () => screen.getByRole("button", { name: "Yes, solved in under 15 minutes" });
const no = () => screen.getByRole("button", { name: "No, it took longer than 15 minutes" });

describe("ProblemModal content", () => {
  it("is an accessible dialog titled after the problem", () => {
    open();
    expect(screen.getByRole("dialog", { name: "Valid Palindrome" })).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Two Pointers · #1")).toBeInTheDocument();
    expect(screen.getByText("easy")).toBeInTheDocument();
    expect(screen.getByText("Solved in under 15 minutes?")).toBeInTheDocument();
  });

  it("links to LeetCode, the explanation and the video", () => {
    open();
    const leetcode = screen.getByRole("link", { name: /open on leetcode/i });
    expect(leetcode).toHaveAttribute("href", "https://leetcode.com/problems/valid-palindrome/");
    expect(leetcode).toHaveAttribute("target", "_blank");
    expect(leetcode).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: /explanation/i })).toHaveAttribute("href", "/solutions/valid-palindrome");
    const video = screen.getByRole("link", { name: /video/i });
    expect(video).toHaveAttribute("href", expect.stringContaining("youtube.com"));
    expect(video).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows the review badge only for problems in review", () => {
    open({ inReview: true });
    expect(screen.getByText("review")).toBeInTheDocument();
  });

  it("hides the review badge and the last-solved line for a fresh problem", () => {
    open();
    expect(screen.queryByText("review")).toBeNull();
    expect(screen.queryByText(/last solved/i)).toBeNull();
  });

  it.each([
    [true, "under 15 min"],
    [false, "over 15 min"],
  ])("shows when it was last solved (under 15: %s)", (solvedUnder15Min, label) => {
    open({ isSolved: true, solvedUnder15Min, lastSolvedAt: "2024-05-01T10:00:00.000Z" });
    expect(screen.getByText(new RegExp(`Last solved .*${label}`))).toBeInTheDocument();
  });

  it("includes the 15-minute timer", () => {
    open();
    expect(screen.getByRole("button", { name: /start 15:00 timer/i })).toBeInTheDocument();
  });
});

describe("closing", () => {
  it("closes on Escape", () => {
    open();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ignores other keys", () => {
    open();
    fireEvent.keyDown(window, { key: "Enter" });
    fireEvent.keyDown(window, { key: "x" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes from the close button", async () => {
    open();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when the backdrop is clicked, but not when the dialog itself is", async () => {
    open();
    await userEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("dialog").parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("stops listening for Escape once unmounted", () => {
    const { unmount } = render(
      <ProblemModal problem={problemView()} onClose={onClose} onStreakExtended={onStreakExtended} />,
    );
    unmount();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("submitting a solve", () => {
  it.each([
    ["yes", true],
    ["no", false],
  ])("posts %s with the device time zone", async (which, flag) => {
    fetchMock.mockResolvedValue(jsonResponse({ streakExtended: false }));
    open({ id: "abc-123" });
    await userEvent.click(which === "yes" ? yes() : no());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/problems/abc-123/solve");
    expect(init).toMatchObject({ method: "POST", headers: { "Content-Type": "application/json" } });
    expect(JSON.parse(init!.body as string)).toEqual({
      solvedUnder15Min: flag,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  });

  it("refreshes the page data and closes on success", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ streakExtended: false }));
    open();
    await userEvent.click(yes());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(router.refresh).toHaveBeenCalled();
    expect(onStreakExtended).not.toHaveBeenCalled();
  });

  it("hands the new streak over for the celebration on the first solve of the day", async () => {
    const streak = streakView({ current: 4 });
    fetchMock.mockResolvedValue(jsonResponse({ streakExtended: true, streak }));
    open();
    await userEvent.click(yes());
    await waitFor(() => expect(onStreakExtended).toHaveBeenCalledWith(streak));
  });

  it("does not celebrate when the server says extended but sends no streak", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ streakExtended: true }));
    open();
    await userEvent.click(yes());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onStreakExtended).not.toHaveBeenCalled();
  });

  it("disables both answers while the request is in flight", async () => {
    let resolve!: (r: Response) => void;
    fetchMock.mockReturnValue(new Promise((r) => (resolve = r)));
    open();
    await userEvent.click(yes());
    expect(yes()).toBeDisabled();
    expect(no()).toBeDisabled();
    // A second click while busy must not send another request
    await userEvent.click(no());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    resolve(jsonResponse({ streakExtended: false }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("shows the server's error and stays open", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: "Problem is locked" }, 409));
    open();
    await userEvent.click(yes());
    expect(await screen.findByText("Problem is locked")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    expect(router.refresh).not.toHaveBeenCalled();
    expect(yes()).toBeEnabled();
  });

  it("shows the status code when the error response isn't JSON", async () => {
    fetchMock.mockResolvedValue(new Response("<html>Bad gateway</html>", { status: 502 }));
    open();
    await userEvent.click(no());
    expect(await screen.findByText("Request failed (502)")).toBeInTheDocument();
  });

  it("shows a network failure and lets the user retry", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    open();
    await userEvent.click(yes());
    expect(await screen.findByText("Failed to fetch")).toBeInTheDocument();

    fetchMock.mockResolvedValue(jsonResponse({ streakExtended: false }));
    await userEvent.click(yes());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(screen.queryByText("Failed to fetch")).toBeNull();
  });
});
