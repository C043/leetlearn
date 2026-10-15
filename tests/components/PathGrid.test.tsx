import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PathGrid from "@/components/duolingo/PathGrid";
import type { PatternSummary } from "@/lib/types";

const p = (order: number, solved: number, total = 10): PatternSummary => ({
  id: `id-${order}`,
  name: `Pattern ${order}`,
  order,
  solved,
  total,
});

describe("PathGrid", () => {
  it("renders one tile per path that links to the path", () => {
    render(<PathGrid patterns={[p(1, 10), p(2, 3), p(3, 0)]} />);
    const tiles = screen.getAllByRole("link");
    expect(tiles).toHaveLength(3);
    expect(tiles.map((t) => t.getAttribute("href"))).toEqual(["/patterns/1", "/patterns/2", "/patterns/3"]);
    expect(within(tiles[1]).getByText("Pattern 2")).toBeInTheDocument();
  });

  it("puts the path number before the name, on the same line", () => {
    render(<PathGrid patterns={[p(7, 0)]} />);
    const heading = within(screen.getByRole("link")).getByRole("heading");
    expect(heading).toHaveTextContent(/^7\s*Pattern 7$/);
  });

  it("shows each path's progress", () => {
    render(<PathGrid patterns={[p(1, 3)]} />);
    const tile = screen.getByRole("link", { name: /Pattern 1/ });
    expect(within(tile).getByText("3/10")).toBeInTheDocument();
    expect(within(tile).getByRole("progressbar")).toHaveAttribute("aria-valuenow", "30");
  });

  it("marks finished paths as complete", () => {
    render(<PathGrid patterns={[p(1, 10), p(2, 9)]} />);
    expect(screen.getByRole("link", { name: /Pattern 1/ })).toHaveAccessibleName(/complete/i);
    expect(screen.getByRole("link", { name: /Pattern 2/ })).not.toHaveAccessibleName(/complete/i);
  });

  it("flags only the next path to work on", () => {
    render(<PathGrid patterns={[p(1, 10), p(2, 4), p(3, 0)]} />);
    expect(within(screen.getByRole("link", { name: /Pattern 2/ })).getByText(/continue/i)).toBeInTheDocument();
    expect(within(screen.getByRole("link", { name: /Pattern 3/ })).queryByText(/continue/i)).toBeNull();
  });

  it("survives a path without problems", () => {
    render(<PathGrid patterns={[p(1, 0, 0)]} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });
});
