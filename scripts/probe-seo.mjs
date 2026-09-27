const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const routes = ["/", "/projects", "/blog", "/blog?page=2", "/blog/building-kauxync", "/blog/operators-and-expressions", "/no-such-page"];
const out = [];

for (const route of routes) {
  const res = await fetch(`${BASE}${route}`);
  const html = await res.text();
  const pick = (re) => {
    const m = html.match(re);
    return m ? m[1].slice(0, 90) : "MISSING";
  };
  out.push(`--- ${route} -> ${res.status}`);
  out.push(`  title: ${pick(/<title>(.*?)<\/title>/)}`);
  out.push(`  description: ${pick(/<meta name="description" content="([^"]*)"/)}`);
  out.push(`  canonical: ${pick(/<link rel="canonical" href="([^"]*)"/)}`);
  out.push(`  og:title: ${pick(/<meta property="og:title" content="([^"]*)"/)}`);
  out.push(`  og:image: ${pick(/<meta property="og:image" content="([^"]*)"/)}`);
  out.push(`  og:url: ${pick(/<meta property="og:url" content="([^"]*)"/)}`);
  out.push(`  twitter: ${pick(/<meta name="twitter:card" content="([^"]*)"/)}`);
  out.push(`  robots: ${pick(/<meta name="robots" content="([^"]*)"/)}`);
  out.push(`  h1 count: ${(html.match(/<h1/g) || []).length}`);
  out.push(`  json-ld: ${(html.match(/application\/ld\+json/g) || []).length}`);
  out.push(`  noindex: ${html.includes("noindex")}`);
}

for (const f of ["/robots.txt", "/sitemap.xml", "/manifest.webmanifest", "/blog/rss.xml", "/llms.txt"]) {
  const res = await fetch(`${BASE}${f}`);
  const text = await res.text();
  out.push(`${f} -> ${res.status} (${text.length} chars, ${res.headers.get("content-type")})`);
}

console.log(out.join("\n"));
