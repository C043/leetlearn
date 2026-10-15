import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PatternPath from "@/components/duolingo/PatternPath";
import { ProblemModalProvider, useProblemModal } from "@/components/duolingo/ProblemModalProvider";
import ReviewList from "@/components/review/ReviewList";
import { jsonResponse, pathProblems, problemView, streakView } from "../helpers/fixtures";

const router = vi.hoisted(() => ({ refresh: vi.fn(), push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/lib/chime", () => ({ playChime: vi.fn(), unlockAudio: vi.fn() }));

beforeEach(() => {
  router.refresh.mockReset();
});

function renderPath(problems = pathProblems(2)) {
  return render(
    <ProblemModalProvider>
      <PatternPath problems={problems} />
    </ProblemModalProvider>,
  );
}

const node = (n: number) => screen.getByRole("button", { name: new RegExp(`^${n}\\. `) });

describe("PatternPath nodes", () => {
  it("renders the 10 problems in order", () => {
    renderPath();
    const nodes = screen.getAllByRole("button");
    expect(nodes).toHaveLength(10);
    expect(nodes.map((b) => b.getAttribute("aria-label")!.split(" (")[0])).toEqual(
      Array.from({ length: 10 }, (_, i) => `${i + 1}. Problem ${i + 1}`),
    );
  });

  it("labels each node with its state", () => {
    renderPath(pathProblems(2));
    expect(node(1)).toHaveAccessibleName("1. Problem 1 (completed)");
    expect(node(2)).toHaveAccessibleName("2. Problem 2 (completed)");
    expect(node(3)).toHaveAccessibleName("3. Problem 3 (available)");
    for (let n = 4; n <= 10; n++) expect(node(n)).toHaveAccessibleName(`${n}. Problem ${n} (locked)`);
  });

  it("disables locked nodes and says what unlocks them", () => {
    renderPath(pathProblems(0));
    expect(node(1)).toBeEnabled();
    expect(node(2)).toBeDisabled();
    expect(node(2)).toHaveAttribute("title", "Locked — solve #1 first");
    expect(node(10)).toHaveAttribute("title", "Locked — solve #9 first");
  });

  it("keeps solved nodes clickable so they can be re-solved", () => {
    renderPath(pathProblems(3));
    expect(node(1)).toBeEnabled();
    expect(node(1)).toHaveAttribute("title", "Problem 1");
  });

  it("points 'Start' at the first available unsolved problem only", () => {
    renderPath(pathProblems(4));
    const starts = screen.getAllByText("Start");
    expect(starts).toHaveLength(1);
    expect(within(starts[0].closest("li")!).getByRole("button")).toBe(node(5));
  });

  it("shows no 'Start' once the path is complete", () => {
    renderPath(pathProblems(10));
    expect(screen.queryByText("Start")).toBeNull();
    expect(screen.getAllByRole("button").every((b) => b.getAttribute("aria-label")!.endsWith("(completed)"))).toBe(true);
  });

  it("marks solves that took longer than 15 minutes", () => {
    const problems = pathProblems(3);
    problems[1] = { ...problems[1], solvedUnder15Min: false };
    renderPath(problems);
    const slow = screen.getAllByTitle("Took longer than 15 minutes");
    expect(slow).toHaveLength(1);
    expect(node(2)).toContainElement(slow[0]);
  });

  it("does not mark unsolved problems as slow", () => {
    renderPath(pathProblems(0));
    expect(screen.queryByTitle("Took longer than 15 minutes")).toBeNull();
  });

  it("uses a crown for the available Hard problem", () => {
    renderPath(pathProblems(9));
    expect(node(10).querySelector(".lucide-crown")).not.toBeNull();
  });

  it("uses a star for an available Easy or Medium problem, a lock and a check otherwise", () => {
    renderPath(pathProblems(2));
    expect(node(3).querySelector(".lucide-star")).not.toBeNull();
    expect(node(4).querySelector(".lucide-lock")).not.toBeNull();
    expect(node(1).querySelector(".lucide-check")).not.toBeNull();
  });

  it("snakes the nodes left and right", () => {
    renderPath();
    const offsets = screen.getAllByRole("listitem").map((li) => li.style.transform);
    expect(offsets.slice(0, 9)).toEqual([0, 48, 76, 48, 0, -48, -76, -48, 0].map((x) => `translateX(${x}px)`));
  });
});

describe("opening problems", () => {
  it("opens the modal for an available problem", async () => {
    renderPath(pathProblems(0));
    await userEvent.click(node(1));
    expect(screen.getByRole("dialog", { name: "Problem 1" })).toBeInTheDocument();
  });

  it("does nothing when a locked problem is clicked", async () => {
    renderPath(pathProblems(0));
    await userEvent.click(node(5));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows exactly one modal: opening another problem replaces the first", async () => {
    const reviewItem = problemView({ id: "r1", title: "Review Me", inReview: true, isSolved: true });
    render(
      <ProblemModalProvider>
        <PatternPath problems={pathProblems(3)} />
        <ReviewList problems={[reviewItem]} nextRotation="2026-10-17T00:00:00.000Z" />
      </ProblemModalProvider>,
    );
    await userEvent.click(node(1));
    expect(screen.getByRole("dialog", { name: "Problem 1" })).toBeInTheDocument();

    // Pressing the review card goes "through" the backdrop in real life; here we call it directly
    await userEvent.click(screen.getByRole("button", { name: /Review Me/ }), { pointerEventsCheck: 0 });
    const dialogs = screen.getAllByRole("dialog");
    expect(dialogs).toHaveLength(1);
    expect(dialogs[0]).toHaveAccessibleName("Review Me");
  });

  it("starts the replacement modal fresh (timer and errors reset)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ error: "Problem is locked" }, 409)));
    let api!: ReturnType<typeof useProblemModal>;
    function Grab() {
      api = useProblemModal();
      return null;
    }
    render(
      <ProblemModalProvider>
        <Grab />
      </ProblemModalProvider>,
    );
    act(() => api.openProblem(problemView({ id: "a", title: "First" })));
    await userEvent.click(screen.getByRole("button", { name: /Yes, solved/ }));
    expect(await screen.findByText("Problem is locked")).toBeInTheDocument();

    act(() => api.openProblem(problemView({ id: "b", title: "Second" })));
    expect(screen.getByRole("dialog", { name: "Second" })).toBeInTheDocument();
    expect(screen.queryByText("Problem is locked")).toBeNull();
  });
});

describe("ProblemModalProvider", () => {
  it("throws a helpful error when used outside the provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    function Orphan() {
      useProblemModal();
      return null;
    }
    expect(() => render(<Orphan />)).toThrow("useProblemModal must be used inside ProblemModalProvider");
  });

  it("closes the modal and celebrates after the first solve of the day", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ streakExtended: true, streak: streakView({ current: 7 }) })),
    );
    renderPath(pathProblems(0));
    await userEvent.click(node(1));
    await userEvent.click(screen.getByRole("button", { name: /Yes, solved/ }));

    const celebration = await screen.findByRole("dialog", { name: "day streak!" });
    expect(celebration).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Problem 1" })).toBeNull();
    expect(router.refresh).toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes without a celebration on later solves", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ streakExtended: false, streak: streakView() })));
    renderPath(pathProblems(0));
    await userEvent.click(node(1));
    await userEvent.click(screen.getByRole("button", { name: /No, it took/ }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});
