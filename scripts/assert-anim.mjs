import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = "C:/Users/KAUSHA~1/AppData/Local/Temp/kauxync-previews";
const browser = await chromium.launch();
const results = [];
const errors = [];

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => localStorage.setItem("kauxync-theme", "light"));
const page = await ctx.newPage();
page.on("pageerror", (e) => errors.push(`pageerror: ${String(e).slice(0, 150)}`));
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

// Ticker
results.push(`ticker rows: ${await page.locator(".ticker-row").count()} (expect 2)`);
results.push(`ticker text: ${(await page.locator(".ticker-row").first().innerText()).slice(0, 60)}`);
results.push(`ticker animating: ${await page.locator(".ticker-track").evaluate((el) => getComputedStyle(el).animationName)}`);
await page.screenshot({ path: `${OUT}/anim-ticker.png` });

// Reveal variants present
results.push(`data-reveal values: ${await page.evaluate(() => [...new Set([...document.querySelectorAll("[data-reveal]")].map((e) => e.getAttribute("data-reveal")))].join(","))}`);

// Scroll to trigger all reveals, then check mid-scroll screenshot shows blur/scale states
await page.evaluate(async () => {
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, 1400);
});
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/anim-midscroll.png` });
await page.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y <= h; y += 300) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await page.waitForFunction(
  () => [...document.querySelectorAll("[data-reveal]")].every((el) => parseFloat(getComputedStyle(el).opacity) >= 0.99),
  { timeout: 8000 },
).catch(() => errors.push("reveals incomplete"));
results.push("all reveals visible: yes");

// Magnetic buttons
results.push(`magnetic wrappers: ${await page.locator("main .hero-in a.btn").evaluateAll((btns) => btns.map((b) => b.parentElement?.parentElement?.className).join(" | "))}`);
await page.hover("main .hero-in a.btn >> nth=0");
await page.waitForTimeout(400);
results.push(`magnetic transform on hover: ${await page.locator("main .hero-in a.btn >> nth=0").evaluate((el) => el.parentElement?.style.transform || "(none)")}`);

// Overflow
results.push(`overflow: ${await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)}`);
await ctx.close();
await browser.close();
console.log(results.join("\n"));
console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "no page errors");
