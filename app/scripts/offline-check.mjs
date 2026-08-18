// One-off verification: load the production build once online (so the
// service worker installs + precaches), then flip the browser context
// offline and confirm a previously-visited screen still renders.
import { chromium } from "playwright";

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:4173";

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

await page.goto(BASE + "/lich-trinh/ngay-1", { waitUntil: "networkidle" });
await page.waitForFunction(() =>
  navigator.serviceWorker?.controller !== null && navigator.serviceWorker?.controller !== undefined
, { timeout: 15000 }).catch(() => null);

// give the SW a moment to finish precaching after activation
await page.waitForTimeout(1500);

const swState = await page.evaluate(async () => {
  const reg = await navigator.serviceWorker.getRegistration();
  return {
    hasRegistration: !!reg,
    controller: !!navigator.serviceWorker.controller,
    cacheNames: await caches.keys(),
  };
});
console.log("SW state after first load:", JSON.stringify(swState));

await context.setOffline(true);
await page.reload({ waitUntil: "networkidle" }).catch((e) => console.log("reload error:", e.message));
await page.waitForTimeout(500);

const title = await page.locator("h1").first().textContent().catch(() => null);
const touchpointCount = await page.locator(".touchpoint").count().catch(() => 0);

console.log("Offline reload — h1:", title, "| touchpoints visible:", touchpointCount);

await context.setOffline(false);
await browser.close();

if (!title || touchpointCount === 0) {
  console.error("OFFLINE CHECK FAILED");
  process.exit(1);
}
console.log("OFFLINE CHECK OK");
