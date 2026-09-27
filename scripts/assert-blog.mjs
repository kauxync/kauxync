import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch();
const results = [];

async function grab(url, viewport, theme = "light") {
  const ctx = await browser.newContext({ viewport });
  await ctx.addInitScript(([k, v]) => localStorage.setItem(k, v), ["kauxync-theme", theme]);
  const page = await ctx.newPage();
  const res = await page.goto(url, { waitUntil: "networkidle" });
  return { ctx, page, status: res?.status() };
}

// Blog index
{
  const { ctx, page, status } = await grab(`${BASE}/blog`, { width: 1440, height: 900 });
  results.push(`GET /blog -> ${status}`);
  results.push(`h1: ${await page.locator("h1").innerText()}`);
  results.push(`posts: ${await page.locator("ul a h2").allInnerTexts().then((t) => t.join(" | "))}`);
  results.push(`dates: ${await page.locator("ul time").allInnerTexts().then((t) => t.join(" | "))}`);
  results.push(`nav: ${await page.locator('nav[aria-label="Primary"] a').allInnerTexts().then((t) => t.join(", "))}`);
  results.push(`title: ${await page.title()}`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  results.push(`/blog overflow @1440: ${overflow}`);
  await ctx.close();
}

// Post page
{
  const { ctx, page, status } = await grab(`${BASE}/blog/building-kauxync`, { width: 1440, height: 900 });
  results.push(`GET /blog/building-kauxync -> ${status}`);
  results.push(`h1: ${await page.locator("h1").innerText()}`);
  results.push(`h2s in article: ${await page.locator("article h2").allInnerTexts().then((t) => t.join(" | "))}`);
  results.push(`blockquote: ${await page.locator("article blockquote").count()}`);
  results.push(`title: ${await page.title()}`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  results.push(`post overflow @1440: ${overflow}`);
  await ctx.close();
}

// Unknown slug -> 404
{
  const { ctx, status } = await grab(`${BASE}/blog/does-not-exist`, { width: 1440, height: 900 });
  results.push(`GET /blog/does-not-exist -> ${status} (expect 404)`);
  await ctx.close();
}

// Mobile: blog index + menu with 4 links, no overflow
{
  const { ctx, page } = await grab(`${BASE}/blog`, { width: 320, height: 800 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  results.push(`/blog overflow @320: ${overflow}`);
  await page.click('button[aria-label="Open menu"]');
  results.push(`menu: ${await page.locator('nav[aria-label="Mobile"] a').allInnerTexts().then((t) => t.join(", "))}`);
  await ctx.close();
}

// Sitemap
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/sitemap.xml`, { waitUntil: "networkidle" });
  const xml = await page.locator("body").innerText();
  results.push(`sitemap has /blog: ${xml.includes("/blog")}`);
  results.push(`sitemap has post: ${xml.includes("/blog/building-kauxync")}`);
  await ctx.close();
}

await browser.close();
console.log(results.join("\n"));
