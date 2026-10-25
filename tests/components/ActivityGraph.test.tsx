import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ActivityGraph from "@/components/stats/ActivityGraph";
import { buildHeatmap } from "@/lib/stats";

// 2024-05-08 is a Wednesday
const heatmap = buildHeatmap(
  [
    { day: "2024-05-01", solves: 1 },
    { day: "2024-05-08", solves: 4 },
  ],
  "2024-05-08",
);

describe("ActivityGraph", () => {
  it("totals the solves of the last year", () => {
    render(<ActivityGraph heatmap={heatmap} />);
    expect(screen.getByText("5 solves in the last year")).toBeInTheDocument();
  });

  it("uses the singular for a single solve", () => {
    render(<ActivityGraph heatmap={buildHeatmap([{ day: "2024-05-08", solves: 1 }], "2024-05-08")} />);
    expect(screen.getByText("1 solve in the last year")).toBeInTheDocument();
  });

  it("draws one square per day up to today, shaded by level", () => {
    const { container } = render(<ActivityGraph heatmap={heatmap} />);
    // 52 full weeks plus Sun-Wed of this one
    expect(container.querySelectorAll("[data-day]")).toHaveLength(52 * 7 + 4);
    expect(screen.getByTitle("4 solves on Wed, May 8, 2024")).toHaveAttribute("data-level", "4");
    expect(screen.getByTitle("1 solve on Wed, May 1, 2024")).toHaveAttribute("data-level", "1");
    expect(screen.getByTitle("No solves on Thu, May 2, 2024")).toHaveAttribute("data-level", "0");
  });

  it("labels months and weekdays", () => {
    render(<ActivityGraph heatmap={heatmap} />);
    for (const label of ["Jun", "Dec", "Jan", "May", "Mon", "Wed", "Fri"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("shows a less-to-more legend", () => {
    render(<ActivityGraph heatmap={heatmap} />);
    expect(screen.getByText("Less")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
  });
});
