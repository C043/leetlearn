import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import manifest from "@/app/manifest";
import nextConfig from "../../next.config";

const scheduler = vi.hoisted(() => ({ startReviewScheduler: vi.fn() }));
vi.mock("@/lib/scheduler", () => scheduler);

const root = join(__dirname, "..", "..");

/** Width and height from a PNG's IHDR chunk. */
function pngSize(path: string) {
  const buf = readFileSync(path);
  expect(buf.subarray(1, 4).toString("ascii")).toBe("PNG");
  return `${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)}`;
}

describe("web app manifest", () => {
  const m = manifest();

  it("is installable as a standalone app rooted at /", () => {
    expect(m.name).toBe("LeetLearn");
    expect(m.short_name).toBe("LeetLearn");
    expect(m.display).toBe("standalone");
    expect(m.start_url).toBe("/");
    expect(m.scope).toBe("/");
    expect(m.theme_color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(m.background_color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("has both an 'any' and a 'maskable' 512px icon (required for install on Android)", () => {
    const icons = m.icons ?? [];
    expect(icons.some((i) => i.sizes === "512x512" && i.purpose === "any")).toBe(true);
    expect(icons.some((i) => i.sizes === "512x512" && i.purpose === "maskable")).toBe(true);
    expect(icons.some((i) => i.sizes === "192x192")).toBe(true);
  });

  it("only references icons that exist in public/ at the declared size", () => {
    for (const icon of m.icons ?? []) {
      const file = join(root, "public", icon.src);
      expect(existsSync(file), icon.src).toBe(true);
      expect(icon.type).toBe("image/png");
      expect(pngSize(file), icon.src).toBe(icon.sizes);
    }
  });
});

describe("next.config headers", () => {
  it("serves the service worker as uncached JavaScript so updates roll out immediately", async () => {
    const rules = await nextConfig.headers!();
    const sw = rules.find((r) => r.source === "/sw.js");
    expect(sw).toBeDefined();
    const headers = Object.fromEntries(sw!.headers.map((h) => [h.key.toLowerCase(), h.value]));
    expect(headers["content-type"]).toMatch(/^application\/javascript/);
    expect(headers["cache-control"]).toContain("no-cache");
    expect(headers["cache-control"]).toContain("no-store");
  });

  it("does not apply the no-cache rule to anything but /sw.js", async () => {
    const rules = await nextConfig.headers!();
    expect(rules.map((r) => r.source)).toEqual(["/sw.js"]);
  });
});

describe("public assets referenced by the service worker", () => {
  it("include the offline page and notification icon it pre-caches", () => {
    const sw = readFileSync(join(root, "public", "sw.js"), "utf8");
    expect(sw).toContain('"/offline.html"');
    expect(existsSync(join(root, "public", "offline.html"))).toBe(true);
    expect(existsSync(join(root, "public", "icon-192.png"))).toBe(true);
  });
});

describe("instrumentation register()", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    scheduler.startReviewScheduler.mockReset();
  });

  it("starts the scheduler in the Node.js runtime", async () => {
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    const { register } = await import("@/instrumentation");
    await register();
    expect(scheduler.startReviewScheduler).toHaveBeenCalledTimes(1);
  });

  it.each(["edge", ""])("does nothing in the %j runtime (cron can't run there)", async (runtime) => {
    vi.stubEnv("NEXT_RUNTIME", runtime);
    const { register } = await import("@/instrumentation");
    await register();
    expect(scheduler.startReviewScheduler).not.toHaveBeenCalled();
  });
});
