import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => localStorage.setItem("kauxync-theme", "dark"));
const page = await ctx.newPage();
await page.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
await page.evaluate(async () => {
  document.documentElement.style.scrollBehavior = "auto";
  const h = document.body.scrollHeight;
  for (let y = 0; y <= h; y += 300) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
});
await page.waitForFunction(
  () => [...document.querySelectorAll("[data-reveal]")].every((el) => parseFloat(getComputedStyle(el).opacity) >= 0.99),
  { timeout: 8000 },
);

const section = page.locator('section[aria-label="Contribution graph"]');
console.log("section:", (await section.count()) === 1);
console.log("total:", await section.locator("p.font-display").first().innerText().catch(() => "MISSING"));
console.log("cells:", await section.locator("div.grid span[title]").count());
console.log(
  "levels:",
  await section.locator("div.grid span[title]").evaluateAll((els) => [...new Set(els.map((e) => e.className))].join(" | ")),
);
await section.screenshot({ path: "C:/Users/KAUSHA~1/AppData/Local/Temp/kauxync-previews/v6-contrib.png" });
await ctx.close();
await browser.close();
