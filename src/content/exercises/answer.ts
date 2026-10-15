/**
 * Canonical form of a typed answer, so formatting differences don't count as mistakes:
 * case and whitespace are ignored, `²`/`³`/`**` become `^`, wrapping quotes are dropped
 * (but `""` stays, so an empty string can be an answer), and big-O may be written
 * with or without `O(...)` ("O(n log n)" == "nlogn").
 */
export function normalizeAnswer(answer: string): string {
  let normalized = answer
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/\*\*/g, "^");
  // Only when the quotes wrap the whole answer: `"a"+"b"` keeps its quotes
  const quoted = normalized.match(/^(["'`])(.+)\1$/);
  if (quoted && !quoted[2].includes(quoted[1])) normalized = quoted[2];
  // Only when O( is closed by the final ): `o(1)+o(n)` stays as it is
  if (normalized.startsWith("o(") && normalized.endsWith(")") && closesAtEnd(normalized, 1)) {
    normalized = normalized.slice(2, -1);
  }
  return normalized;
}

/** True if the parenthesis at `open` is closed by the last character. */
function closesAtEnd(text: string, open: number): boolean {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")" && --depth === 0) return i === text.length - 1;
  }
  return false;
}

export function matchesAnswer(input: string, answers: string[]): boolean {
  const normalized = normalizeAnswer(input);
  return normalized !== "" && answers.some((a) => normalizeAnswer(a) === normalized);
}
