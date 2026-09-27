import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = "C:/Users/KAUSHA~1/AppData/Local/Temp/kauxync-previews";
const browser = await chromium.launch();
const errors = [];

for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(([k, v]) => localStorage.setItem(k, v), ["kauxync-theme", theme]);
  const page = await ctx.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`${theme}: ${msg.text().slice(0, 160)}`);
  });
  page.on("pageerror", (err) => errors.push(`${theme} pageerror: ${String(err).slice(0, 160)}`));
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const canvas = await page.evaluate(() => {
    const c = document.querySelector("#top canvas");
    return c ? { w: c.width, h: c.height } : null;
  });
  console.log(`${theme} hero canvas:`, JSON.stringify(canvas));
  await page.screenshot({ path: `${OUT}/redesign-hero-${theme}.png` });
  // scroll through for reveal check
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
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
  ).catch(() => errors.push(`${theme}: reveals incomplete`));
  await page.screenshot({ path: `${OUT}/redesign-full-${theme}.png`, fullPage: true });
  await page.screenshot({ path: `${OUT}/redesign-full-${theme}.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`${theme} overflow: ${overflow}`);
  await ctx.close();
}

await browser.close();
console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "no console errors");
