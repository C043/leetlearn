import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ReviewTile from "@/components/review/ReviewTile";

const nextRotation = "2026-10-17T00:00:00.000Z";

describe("ReviewTile", () => {
  it("links to the review page", () => {
    render(<ReviewTile count={2} nextRotation={nextRotation} />);
    expect(screen.getByRole("link", { name: /review/i })).toHaveAttribute("href", "/review");
  });

  it("shows how many problems are waiting", () => {
    render(<ReviewTile count={3} nextRotation={nextRotation} />);
    expect(screen.getByText(/3 to review/i)).toBeInTheDocument();
  });

  it("says all caught up and when the next refresh is when the queue is empty", () => {
    render(<ReviewTile count={0} nextRotation={nextRotation} />);
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument();
    expect(screen.getByText(/next refresh/i)).toBeInTheDocument();
  });
});
