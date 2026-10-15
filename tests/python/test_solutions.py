"""
Runs every Python reference solution against edge cases and, where feasible,
a brute-force oracle on seeded random inputs.

Usage: python3 tests/python/test_solutions.py <solutions.json> [slug ...]
(the JSON comes from tests/python/export-code.ts)
"""

import json
import signal
import sys
import time
import traceback

import cases_arrays  # noqa: F401  (registers cases)
import cases_lists  # noqa: F401
import cases_structures  # noqa: F401
import cases_trees  # noqa: F401
import cases_search  # noqa: F401
from harness import CASES

TIMEOUT_SECONDS = 20


def on_timeout(signum, frame):
    raise TimeoutError(f"took longer than {TIMEOUT_SECONDS}s (infinite loop?)")


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    solutions = json.load(open(sys.argv[1]))
    only = set(sys.argv[2:])
    sys.setrecursionlimit(10_000)
    signal.signal(signal.SIGALRM, on_timeout)

    failures = []
    missing = sorted(set(solutions) - set(CASES))
    orphaned = sorted(set(CASES) - set(solutions))
    failures += [(slug, "no test case for this solution") for slug in missing]
    failures += [(slug, "test case matches no solution") for slug in orphaned]

    passed = 0
    for slug, code in solutions.items():
        if only and slug not in only or slug not in CASES:
            continue
        check, node_class = CASES[slug]
        started = time.perf_counter()
        signal.alarm(TIMEOUT_SECONDS)
        try:
            from harness import load

            check(load(code, node_class))
            passed += 1
            status = "\033[32m✓\033[0m"
        except Exception:
            failures.append((slug, traceback.format_exc(limit=-3)))
            status = "\033[31m×\033[0m"
        finally:
            signal.alarm(0)
        print(f" {status} {slug} \033[2m{(time.perf_counter() - started) * 1000:.0f}ms\033[0m")

    print()
    for slug, detail in failures:
        print(f"\033[31mFAIL\033[0m {slug}\n{detail}")
    total = len(only) if only else len(solutions)
    print(f"Solutions  {passed} passed, {len(failures)} failed ({total} total)")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
