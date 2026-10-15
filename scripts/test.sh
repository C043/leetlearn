#!/bin/sh
# Runs every test suite in order and stops at the first failure.
# Meant for the `tests` container (docker-compose.test.yml); DATABASE_URL must
# point at a disposable database because it gets reset.
set -eu

: "${DATABASE_URL:?DATABASE_URL must point at a disposable test database}"
E2E_PORT="${E2E_PORT:-3100}"

step() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }

step "Typecheck"
# Generates the route types (e.g. LayoutProps) that `next build` would otherwise create
npx next typegen
npx tsc --noEmit
npx tsc --noEmit -p tests/tsconfig.json

step "Lint"
npx eslint .

step "Database schema"
npx prisma db push --skip-generate --force-reset --accept-data-loss

step "Unit tests"
npx vitest run --project unit

step "Component tests"
npx vitest run --project components

step "Database, API and page tests"
npx vitest run --project db

step "Python reference solutions"
SOLUTIONS_JSON="$(mktemp -d)/solutions.json"
npx tsx tests/python/export-code.ts "$SOLUTIONS_JSON"
python3 tests/python/test_solutions.py "$SOLUTIONS_JSON"

step "Production build"
npx next build

step "End-to-end tests against next start"
npx prisma db push --skip-generate --force-reset --accept-data-loss
npx prisma db seed
NODE_ENV=production npx next start -p "$E2E_PORT" >/tmp/next.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

i=0
until wget -q -O /dev/null "http://127.0.0.1:$E2E_PORT/manifest.webmanifest"; do
  i=$((i + 1))
  if [ "$i" -gt 60 ] || ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "next start did not come up:"; cat /tmp/next.log; exit 1
  fi
  sleep 1
done

E2E_BASE_URL="http://127.0.0.1:$E2E_PORT" npx vitest run --project e2e

step "All test suites passed"
