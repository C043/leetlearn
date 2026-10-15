import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BackToPaths from "@/components/duolingo/BackToPaths";

describe("BackToPaths", () => {
  it("links back to the path selection", () => {
    render(<BackToPaths />);
    expect(screen.getByRole("link", { name: /back to paths/i })).toHaveAttribute("href", "/");
  });
});
