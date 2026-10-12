/**
 * Captures a screenshot of every project's live site into /public/previews.
 *
 *   npm run previews                       # all projects that have `live` + `preview`
 *   npm run previews -- darts qowa         # only paths whose file name contains one of these
 *
 * Uses the Edge/Chrome already installed on the machine (no browser download).
 * Override with BROWSER=chrome (or msedge, the default).
 */
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(root, "src/data/portfolio.json"), "utf8"));
const filters = process.argv.slice(2).map((f) => f.toLowerCase());

const targets = data.projects.filter(
  (p) =>
    p.live &&
    p.preview &&
    (filters.length === 0 || filters.some((f) => p.preview.toLowerCase().includes(f)))
);

if (targets.length === 0) {
  console.log("No matching projects with both `live` and `preview` set.");
  process.exit(0);
}

const PRELOADER_SELECTORS = ".loading, .preloader, #preloader, #loader, #loading";

const browser = await chromium.launch({ channel: process.env.BROWSER || "msedge" });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});

let failed = 0;
for (const project of targets) {
  const out = join(root, "public", project.preview);
  mkdirSync(dirname(out), { recursive: true });
  const page = await context.newPage();
  try {
    console.log(`→ ${project.title}  ${project.live}`);
    // "commit" = response received. Heavy sites can take very long to reach
    // DOMContentLoaded, so the rest is best-effort rather than a hard failure.
    await page.goto(project.live, { waitUntil: "commit", timeout: 60_000 });
    await page.waitForLoadState("domcontentloaded", { timeout: 30_000 }).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    // Some sites wait for a `load` event that never fires (a stuck third-party
    // request) and keep a full-screen preloader on top. Hide the usual suspects.
    // Nudge scripts that initialise on `load` (sliders, reveal animations).
    await page.evaluate(() => window.dispatchEvent(new Event("load"))).catch(() => {});
    await page.addStyleTag({
      content: `${PRELOADER_SELECTORS} { display: none !important; }`,
    });
    // Extra settle time for splash screens / entrance animations (SETTLE_MS=10000 to lengthen).
    await page.waitForTimeout(Number(process.env.SETTLE_MS) || 3000);
    await page.screenshot({ path: out, type: "jpeg", quality: 80 });
    console.log(`  saved ${project.preview}`);
  } catch (err) {
    failed++;
    console.error(`  FAILED: ${err.message.split("\n")[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
process.exit(failed ? 1 : 0);
