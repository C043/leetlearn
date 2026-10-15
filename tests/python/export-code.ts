/**
 * Writes every Python reference solution to a JSON file ({ slug: code }) so the
 * Python harness can exec them. Usage: tsx tests/python/export-code.ts <out.json>
 */
import { writeFileSync } from "node:fs";
import { PATTERNS } from "../../src/content";
import { getCode } from "../../src/content/solutions";

const out = process.argv[2];
if (!out) throw new Error("usage: tsx tests/python/export-code.ts <out.json>");

const code = Object.fromEntries(
  PATTERNS.flatMap((p) => p.problems.map((q) => [q.slug, getCode(q.slug)!])),
);
writeFileSync(out, JSON.stringify(code, null, 2));
console.log(`exported ${Object.keys(code).length} solutions to ${out}`);
