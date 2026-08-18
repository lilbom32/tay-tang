// Headless smoke test: walks the core screens, exercises the one
// interaction per screen that matters (script expand, checklist toggle,
// handbook filter), and fails loudly on any console/page error.
// Requires the dev server already running (npm run dev) on PORT below.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", ".smoke-output");
const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:5173";

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const results = [];

async function checkPage(page, route, label, viewport) {
  await page.setViewportSize(viewport);
  const pageErrors = [];
  const onConsole = (msg) => {
    if (msg.type() === "error") pageErrors.push(msg.text());
  };
  page.on("console", onConsole);
  page.on("pageerror", (err) => pageErrors.push("pageerror: " + err.message));
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, `${label}.png`), fullPage: true });
  page.off("console", onConsole);
  results.push({ route, label, viewport, errors: pageErrors });
}

const page = await browser.newPage();

await checkPage(page, "/", "home-desktop", { width: 1280, height: 800 });
await checkPage(page, "/lich-trinh", "itinerary-desktop", { width: 1280, height: 800 });
await checkPage(page, "/lich-trinh/ngay-1", "day1-desktop", { width: 1280, height: 1400 });

await page.goto(BASE + "/lich-trinh/ngay-1", { waitUntil: "networkidle" });
await page.locator('.touchpoint-head[role="button"]').first().click();
await page.waitForTimeout(150);
results.push({
  label: "day1-script-expand-visible",
  ok: await page.locator(".tp-script").first().isVisible(),
});
const checkbox = page.locator(".checklist input[type=checkbox]").first();
await checkbox.click();
results.push({ label: "day1-checkbox-toggle", ok: await checkbox.isChecked() });

await checkPage(page, "/diem-den", "destinations-desktop", { width: 1280, height: 800 });
await checkPage(page, "/diem-den/potala", "potala-desktop", { width: 1280, height: 1000 });
await checkPage(page, "/cam-nang", "handbook-desktop", { width: 1280, height: 1400 });

await page.goto(BASE + "/cam-nang", { waitUntil: "networkidle" });
await page.locator('.filter-tabs button:has-text("MOT & Rủi Ro")').click();
await page.waitForTimeout(150);
results.push({
  label: "handbook-filter-switches",
  ok: (await page.locator("h2:has-text('10 Quy Tắc Vàng')").count()) === 0,
});

await checkPage(page, "/dieu-hanh", "ops-desktop", { width: 1280, height: 900 });
await checkPage(page, "/", "home-mobile", { width: 390, height: 844 });
await checkPage(page, "/lich-trinh/ngay-1", "day1-mobile", { width: 390, height: 1600 });

await browser.close();

fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(results, null, 2));

const failures = results.filter((r) => (r.errors && r.errors.length > 0) || r.ok === false);
console.log(JSON.stringify(results, null, 2));
if (failures.length > 0) {
  console.error(`SMOKE FAILED: ${failures.length} issue(s)`);
  process.exit(1);
}
console.log("SMOKE OK");
