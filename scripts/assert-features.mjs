import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = "C:/Users/KAUSHA~1/AppData/Local/Temp/kauxync-previews";
const browser = await chromium.launch();
const results = [];
const errors = [];

async function page404() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem("kauxync-theme", "light"));
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`404 pageerror: ${String(e).slice(0, 120)}`));
  const res = await page.goto(`${BASE}/no-such-page`, { waitUntil: "networkidle" });
  results.push(`GET /no-such-page -> ${res?.status()} (expect 404)`);
  results.push(`404 h1: ${await page.locator("h1").innerText().catch(() => "MISSING")}`);
  await page.screenshot({ path: `${OUT}/feat-404.png` });
  await ctx.close();
}

async function rssManifest() {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/blog/rss.xml`, { waitUntil: "domcontentloaded" });
  const xml = await page.locator("body").innerText();
  results.push(`rss items: ${(xml.match(/<item>/g) || []).length} (expect 2)`);
  results.push(`rss titles: ${xml.includes("Building Kauxync") && xml.includes("Minimal Stack")}`);
  await page.goto(`${BASE}/manifest.webmanifest`, { waitUntil: "domcontentloaded" });
  const man = JSON.parse(await page.locator("body").innerText());
  results.push(`manifest: name=${man.short_name} icons=${man.icons.length} display=${man.display}`);
  await ctx.close();
}

async function palette() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem("kauxync-theme", "light"));
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`palette pageerror: ${String(e).slice(0, 120)}`));
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  results.push(`palette trigger visible: ${await page.locator('button[aria-label="Open command palette"]').isVisible()}`);
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(300);
  results.push(`dialog open via Ctrl+K: ${await page.locator('div[role="dialog"]').count() === 1}`);
  await page.fill('input[aria-label="Search commands"]', "blog");
  await page.waitForTimeout(200);
  results.push(`filter "blog": ${await page.locator('div[role="dialog"] ul button').allInnerTexts().then((t) => t.join(" | "))}`);
  await page.screenshot({ path: `${OUT}/feat-palette.png` });
  await page.keyboard.press("Enter");
  await page.waitForURL("**/blog", { timeout: 5000 }).catch(() => null);
  results.push(`enter navigates to: ${page.url()}`);
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(200);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  results.push(`escape closes: ${await page.locator('div[role="dialog"]').count() === 0}`);
  await ctx.close();
}

async function blogUx() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem("kauxync-theme", "light"));
  const page = await ctx.newPage();
  await page.goto(`${BASE}/blog/building-kauxync`, { waitUntil: "networkidle" });
  results.push(`progress bar: ${await page.locator("div.fixed.inset-x-0.top-0").count() === 1}`);
  results.push(`h2 ids: ${await page.locator("article h2[id]").evaluateAll((els) => els.map((e) => e.id).join(", "))}`);
  results.push(`TOC links: ${await page.locator('nav[aria-label="Table of contents"] a').allInnerTexts().then((t) => t.join(" | "))}`);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  results.push(`progress at bottom: ${await page.evaluate(() => document.querySelector("div.fixed.inset-x-0.top-0 > div")?.style.transform)}`);
  await page.screenshot({ path: `${OUT}/feat-post.png`, fullPage: false });
  await ctx.close();
}

async function activity() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem("kauxync-theme", "light"));
  const page = await ctx.newPage();
  await page.goto(`${BASE}/projects`, { waitUntil: "networkidle" });
  const section = page.locator('section[aria-label="Open-source activity"]');
  results.push(`activity section rendered: ${await section.count() === 1}`);
  if (await section.count() === 1) {
    results.push(`activity rows: ${await section.locator("ul li").count()}`);
    results.push(`first row: ${(await section.locator("ul li").first().innerText()).slice(0, 90).replace(/\n/g, " ")}`);
  }
  await ctx.close();
}

await page404();
await rssManifest();
await palette();
await blogUx();
await activity();
await browser.close();
console.log(results.join("\n"));
console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "no page errors");
