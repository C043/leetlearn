import { describe, expect, it } from "vitest";
import { matchesAnswer, normalizeAnswer } from "@/content/exercises/answer";

describe("normalizeAnswer", () => {
  it.each([
    ["  True ", "true"],
    ["right - left + 1", "right-left+1"],
    ["O(n log n)", "nlogn"],
    ["o(N)", "n"],
    ["O(n²)", "n^2"],
    ["O(n³)", "n^3"],
    ["n**2", "n^2"],
    ['"ball"', "ball"],
    ["'ball'", "ball"],
    ["`pop`", "pop"],
    ["[1, 2]", "[1,2]"],
  ])("%j -> %j", (input, expected) => {
    expect(normalizeAnswer(input)).toBe(expected);
  });

  it("keeps an empty quoted string, so \"\" can be an answer", () => {
    expect(normalizeAnswer('""')).toBe('""');
    expect(normalizeAnswer("''")).toBe("''");
  });

  it("only unwraps O(...) when it wraps the whole answer", () => {
    expect(normalizeAnswer("o(1) + o(2)")).toBe("o(1)+o(2)");
    expect(normalizeAnswer("O(log(n))")).toBe("log(n)");
    expect(normalizeAnswer("max(a, b)")).toBe("max(a,b)");
  });

  it("only drops quotes when they wrap the whole answer", () => {
    expect(normalizeAnswer('"a" + "b"')).toBe('"a"+"b"');
  });
});

describe("matchesAnswer", () => {
  it("accepts any listed answer, ignoring case, spacing and big-O wrapping", () => {
    expect(matchesAnswer("o(N LOG N)", ["O(n log n)"])).toBe(true);
    expect(matchesAnswer("n^2", ["O(n²)"])).toBe(true);
    expect(matchesAnswer("<=", ["<", "<="])).toBe(true);
    expect(matchesAnswer("[1,2]", ["[1, 2]"])).toBe(true);
  });

  it("rejects different answers", () => {
    expect(matchesAnswer("O(n)", ["O(1)"])).toBe(false);
    expect(matchesAnswer("<", [">"])).toBe(false);
    expect(matchesAnswer("2", ["20"])).toBe(false);
  });

  it("never accepts an empty or whitespace-only answer", () => {
    expect(matchesAnswer("", [""])).toBe(false);
    expect(matchesAnswer("   ", [" "])).toBe(false);
  });

  it('accepts "" for an empty-string answer but not an empty input', () => {
    expect(matchesAnswer('""', ['""', "''"])).toBe(true);
    expect(matchesAnswer("''", ['""', "''"])).toBe(true);
  });
});
