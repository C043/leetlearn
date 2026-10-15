import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const alias = { "@": fileURLToPath(new URL("./src", import.meta.url)) };
const esbuild = { jsx: "automatic" as const };

/**
 * Four suites, run in order by scripts/test.sh:
 *  - unit:       pure logic, no I/O
 *  - components: React components and browser code in jsdom
 *  - db:         services, API routes and pages against a real Postgres (DATABASE_URL)
 *  - e2e:        HTTP against a built `next start` server (E2E_BASE_URL)
 */
export default defineConfig({
  resolve: { alias },
  esbuild,
  test: {
    projects: [
      {
        resolve: { alias },
        esbuild,
        test: {
          name: "unit",
          environment: "node",
          include: ["tests/unit/**/*.test.{ts,tsx}"],
        },
      },
      {
        resolve: { alias },
        esbuild,
        test: {
          name: "components",
          environment: "jsdom",
          include: ["tests/components/**/*.test.{ts,tsx}"],
          setupFiles: ["tests/setup/components.ts"],
        },
      },
      {
        resolve: { alias },
        esbuild,
        test: {
          name: "db",
          environment: "node",
          include: ["tests/db/**/*.test.{ts,tsx}"],
          setupFiles: ["tests/setup/db.ts"],
          // One shared database: files must run one after another
          pool: "forks",
          poolOptions: { forks: { singleFork: true } },
          testTimeout: 30_000,
          hookTimeout: 60_000,
        },
      },
      {
        resolve: { alias },
        esbuild,
        test: {
          name: "e2e",
          environment: "node",
          include: ["tests/e2e/**/*.test.ts"],
          pool: "forks",
          poolOptions: { forks: { singleFork: true } },
          testTimeout: 30_000,
          hookTimeout: 60_000,
        },
      },
    ],
  },
});
