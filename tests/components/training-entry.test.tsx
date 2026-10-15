import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PatternPath from "@/components/duolingo/PatternPath";
import ProblemModal from "@/components/duolingo/ProblemModal";
import { ProblemModalProvider } from "@/components/duolingo/ProblemModalProvider";
import { pathProblems, problemView } from "../helpers/fixtures";

const router = vi.hoisted(() => ({ refresh: vi.fn(), push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/lib/chime", () => ({ playChime: vi.fn(), unlockAudio: vi.fn() }));

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

function openModal(overrides = {}) {
  render(<ProblemModal problem={problemView(overrides)} onClose={vi.fn()} onStreakExtended={vi.fn()} />);
}

const trainLink = () => screen.queryByRole("link", { name: /train · 10 exercises/i });

describe("Train button in the problem modal", () => {
  it("links a solved problem to its training session", () => {
    openModal({ isSolved: true, hasExercises: true });
    expect(trainLink()).toHaveAttribute("href", "/train/valid-palindrome");
    expect(screen.queryByText("Solve it once to unlock training")).toBeNull();
  });

  it("is locked until the problem is solved, and says why", () => {
    openModal({ isSolved: false, hasExercises: true });
    expect(trainLink()).toBeNull();
    expect(screen.getByText("Solve it once to unlock training")).toBeInTheDocument();
  });

  it("is absent for a problem without exercises", () => {
    openModal({ isSolved: true, hasExercises: false });
    expect(trainLink()).toBeNull();
    expect(screen.queryByText("Solve it once to unlock training")).toBeNull();
  });

  it("shows a mastered badge only for mastered problems", () => {
    openModal({ isSolved: true, hasExercises: true, mastered: true });
    expect(screen.getByText("mastered")).toBeInTheDocument();
  });

  it("shows no mastered badge otherwise", () => {
    openModal({ isSolved: true, hasExercises: true, mastered: false });
    expect(screen.queryByText("mastered")).toBeNull();
  });
});

describe("mastered nodes on the path", () => {
  function renderPath(problems = pathProblems(3)) {
    render(
      <ProblemModalProvider>
        <PatternPath problems={problems} />
      </ProblemModalProvider>,
    );
  }
  const node = (n: number) => screen.getByRole("button", { name: new RegExp(`^${n}\\. `) });

  it("turns a solved, mastered problem violet and labels it", () => {
    const problems = pathProblems(3);
    problems[0] = { ...problems[0], mastered: true };
    renderPath(problems);
    expect(node(1)).toHaveAccessibleName("1. Problem 1 (mastered)");
    expect(node(1).className).toContain("bg-violet-500");
    expect(node(2)).toHaveAccessibleName("2. Problem 2 (completed)");
    expect(node(2).className).toContain("bg-amber-400");
  });

  it("never shows an unsolved problem as mastered", () => {
    const problems = pathProblems(0);
    problems[0] = { ...problems[0], mastered: true };
    renderPath(problems);
    expect(node(1)).toHaveAccessibleName("1. Problem 1 (available)");
    expect(node(1).className).not.toContain("bg-violet-500");
  });
});
