import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ReviewList from "@/components/review/ReviewList";
import { ProblemModalProvider } from "@/components/duolingo/ProblemModalProvider";
import type { ProblemView } from "@/lib/types";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }) }));

const problem = (id: string, title: string, extra: Partial<ProblemView> = {}): ProblemView => ({
  id,
  slug: id,
  title,
  leetcodeUrl: `https://leetcode.com/problems/${id}/`,
  videoUrl: "https://www.youtube.com/results?search_query=x",
  difficulty: "MEDIUM",
  order: 3,
  isSolved: true,
  solvedUnder15Min: true,
  lastSolvedAt: "2026-09-01T10:00:00.000Z",
  unlocked: true,
  inReview: true,
  patternName: "Two Pointers",
  hasExercises: false,
  mastered: false,
  ...extra,
});

const nextRotation = "2026-10-17T00:00:00.000Z";

function renderList(problems: ProblemView[]) {
  return render(
    <ProblemModalProvider>
      <ReviewList problems={problems} nextRotation={nextRotation} />
    </ProblemModalProvider>,
  );
}

describe("ReviewList", () => {
  it("lists every problem in the queue with its path", () => {
    renderList([problem("a", "Two Sum"), problem("b", "3Sum", { patternName: "Hashing" })]);
    expect(screen.getByRole("button", { name: /Two Sum/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /3Sum/ })).toHaveAccessibleName(/Hashing/);
  });

  it("flags problems that took over 15 minutes last time", () => {
    renderList([problem("a", "Slow One", { solvedUnder15Min: false }), problem("b", "Fast One")]);
    expect(screen.getAllByLabelText(/over 15 minutes/i)).toHaveLength(1);
  });

  it("opens the problem modal when a problem is tapped", async () => {
    renderList([problem("a", "Two Sum")]);
    await userEvent.click(screen.getByRole("button", { name: /Two Sum/ }));
    expect(screen.getByRole("dialog", { name: "Two Sum" })).toBeInTheDocument();
  });

  it("shows an empty state with the next refresh", () => {
    renderList([]);
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument();
    expect(screen.getByText(/next refresh/i)).toBeInTheDocument();
  });
});
