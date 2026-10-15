import { describe, expect, it } from "vitest";
import { PATH_COLORS, nextPathOrder, pathColor } from "@/lib/path-tiles";

describe("pathColor", () => {
  it("gives neighbouring paths different colors", () => {
    for (let order = 1; order < 16; order++) {
      expect(pathColor(order)).not.toEqual(pathColor(order + 1));
    }
  });

  it("cycles through the palette starting at path 1", () => {
    expect(pathColor(1)).toBe(PATH_COLORS[0]);
    expect(pathColor(PATH_COLORS.length + 1)).toBe(PATH_COLORS[0]);
  });

  it.each([0, -3])("never returns undefined for the odd order %j", (order) => {
    expect(pathColor(order)).toBeDefined();
  });
});

describe("nextPathOrder", () => {
  const p = (order: number, solved: number, total = 10) => ({ id: `${order}`, name: `P${order}`, order, solved, total });

  it("is the first path that still has unsolved problems", () => {
    expect(nextPathOrder([p(1, 10), p(2, 4), p(3, 0)])).toBe(2);
  });

  it("is null when every path is complete or there are none", () => {
    expect(nextPathOrder([p(1, 10), p(2, 10)])).toBeNull();
    expect(nextPathOrder([])).toBeNull();
  });
});
