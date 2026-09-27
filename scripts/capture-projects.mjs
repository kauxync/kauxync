import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = "C:/Users/KAUSHA~1/AppData/Local/Temp/kauxync-previews/shots";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const shots = [
  { theme: "light", w: 1440, h: 900 },
  { theme: "dark", w: 1440, h: 900 },
  { theme: "light", w: 320, h: 800 },
];
const issues = [];

for (const { theme, w, h } of shots) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(([k, v]) => localStorage.setItem(k, v), ["kauxync-theme", theme]);
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    const html = document.documentElement;
    html.style.scrollBehavior = "auto";
    const height = document.body.scrollHeight;
    for (let y = 0; y <= height; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    html.style.scrollBehavior = "";
  });
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll("[data-reveal]")].every(
        (el) => parseFloat(getComputedStyle(el).opacity) >= 0.99,
      ),
    { timeout: 6000 },
  ).catch(() => issues.push(`${theme} ${w}: reveals incomplete`));
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 0) issues.push(`${theme} ${w}: overflow +${overflow}`);
  const file = path.join(OUT, `projects-${theme}-${w}.png`);
  await page.screenshot({ path: file, fullPage: true });
  await page.screenshot({ path: file, fullPage: true });
  await ctx.close();
  console.log(`shot projects ${theme} ${w}px`);
}

{
  const ctx = await browser.newContext({ viewport: { width: 320, height: 800 } });
  await ctx.addInitScript(() => localStorage.setItem("kauxync-theme", "light"));
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
  await page.click('button[aria-label="Open menu"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, "projects-menu-320.png") });
  await ctx.close();
  console.log("shot menu open 320px");
}

await browser.close();
console.log(issues.length ? `ISSUES:\n${issues.join("\n")}` : "clean");
