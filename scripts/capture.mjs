import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = "C:/Users/KAUSHA~1/AppData/Local/Temp/kauxync-previews/shots";
const OG = "D:/kauxync/kauxync/public/og/og.png";
const STORAGE_KEY = "kauxync-theme";

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.dirname(OG), { recursive: true });

const VIEWPORTS = [
  { w: 320, h: 800 },
  { w: 375, h: 812 },
  { w: 768, h: 1024 },
  { w: 1024, h: 768 },
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 },
];

const browser = await chromium.launch();
const issues = [];

async function newPage(theme, viewport) {
  const ctx = await browser.newContext({ viewport });
  await ctx.addInitScript(
    ([k, v]) => localStorage.setItem(k, v),
    [STORAGE_KEY, theme],
  );
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  return { ctx, page };
}

async function revealAll(page) {
  await page.evaluate(async () => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    html.style.scrollBehavior = prev;
  });
  let ok = true;
  try {
    await page.waitForFunction(
      () =>
        [...document.querySelectorAll("[data-reveal]")].every(
          (el) => parseFloat(getComputedStyle(el).opacity) >= 0.99,
        ),
      { timeout: 6000 },
    );
  } catch {
    ok = false;
  }
  const state = await page.evaluate(() => ({
    hidden: document.querySelectorAll("[data-reveal]:not(.is-visible)").length,
    opacities: [...document.querySelectorAll("[data-reveal]")].map((el) =>
      getComputedStyle(el).opacity,
    ),
  }));
  if (!ok || state.hidden > 0) {
    issues.push(
      `viewport ${page.viewportSize().width}px: reveal failed (hidden=${state.hidden}, op=${state.opacities.join(",")})`,
    );
  }
}

async function overflowOf(page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

for (const theme of ["light", "dark"]) {
  for (const { w, h } of VIEWPORTS) {
    const { ctx, page } = await newPage(theme, { width: w, height: h });
    await revealAll(page);
    const overflow = await overflowOf(page);
    if (overflow > 0) issues.push(`${theme} ${w}px: horizontal overflow +${overflow}px`);
    const file = path.join(OUT, `${theme}-${w}.png`);
    await page.screenshot({ path: file, fullPage: true });
    await page.screenshot({ path: file, fullPage: true });
    await ctx.close();
    console.log(`shot ${theme} ${w}px${overflow > 0 ? ` OVERFLOW +${overflow}` : ""}`);
  }
}

{
  const { ctx, page } = await newPage("light", { width: 1200, height: 630 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: OG });
  await ctx.close();
  console.log(`og written: ${OG}`);
}

await browser.close();
console.log(issues.length ? `ISSUES:\n${issues.join("\n")}` : "no horizontal overflow at any width");
