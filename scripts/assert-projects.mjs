import { chromium } from "playwright";

const browser = await chromium.launch();
const results = [];

// Desktop: /projects content + nav
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem("kauxync-theme", "light"));
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
  results.push(`h1: ${await page.locator("h1").innerText()}`);
  results.push(`card title: ${await page.locator("article h2").first().innerText()}`);
  results.push(`status: ${await page.locator("article").first().innerText().then((t) => t.includes("LIVE") ? "LIVE present" : "LIVE missing")}`);
  results.push(`tech chips: ${await page.locator("article ul li").allInnerTexts().then((t) => t.join(" | "))}`);
  results.push(`links: ${await page.locator("article a").evaluateAll((as) => as.map((a) => a.textContent.trim() + "->" + a.getAttribute("href")).join(" ; "))}`);
  results.push(`desktop nav: ${await page.locator('nav[aria-label="Primary"] a').allInnerTexts().then((t) => t.join(", "))}`);
  results.push(`hamburger visible @1440: ${await page.locator('button[aria-label="Open menu"]').isVisible()}`);
  results.push(`page title: ${await page.title()}`);
  await ctx.close();
}

// Mobile: hamburger menu opens with 3 links, no overflow
{
  const ctx = await browser.newContext({ viewport: { width: 320, height: 800 } });
  await ctx.addInitScript(() => localStorage.setItem("kauxync-theme", "light"));
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  results.push(`home @320 overflow: ${overflow}`);
  results.push(`hamburger visible @320: ${await page.locator('button[aria-label="Open menu"]').isVisible()}`);
  await page.click('button[aria-label="Open menu"]');
  results.push(`menu links open: ${await page.locator('nav[aria-label="Mobile"] a').allInnerTexts().then((t) => t.join(", "))}`);
  await page.keyboard.press("Escape");
  results.push(`menu after Escape: ${await page.locator('nav[aria-label="Mobile"]').count() === 0 ? "closed" : "STILL OPEN"}`);
  await ctx.close();
}

await browser.close();
console.log(results.join("\n"));
