const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const out = [];
const flag = (id, severity, detail) => out.push(`[${severity}] ${id}: ${detail}`);

async function status(method, path, body) {
  const res = await fetch(`${BASE}${path}`, { method, redirect: "manual", body });
  const text = await res.text().catch(() => "");
  return { status: res.status, headers: res.headers, text };
}

// 1. Security headers + cookies on primary routes
for (const p of ["/", "/blog", "/projects", "/blog/rss.xml", "/manifest.webmanifest"]) {
  const r = await status("GET", p);
  const h = r.headers;
  const missing = [
    ["x-content-type-options", "nosniff"],
    ["x-frame-options", "DENY"],
    ["referrer-policy", null],
    ["strict-transport-security", null],
  ].filter(([k]) => !h.get(k));
  flag(`HEADERS ${p}`, missing.length ? "MEDIUM" : "OK", missing.length ? `missing ${missing.map((m) => m[0]).join(",")}` : `${r.status} all present`);
  flag(`COOKIES ${p}`, h.get("set-cookie") ? "LOW" : "OK", h.get("set-cookie") ?? "no set-cookie");
  flag(`POWERED-BY ${p}`, h.get("x-powered-by") ? "LOW" : "OK", h.get("x-powered-by") ?? "absent");
}

// 2. HTTP method probing (expect 405/404, never 200 with side effects)
for (const [m, p] of [["POST", "/"], ["PUT", "/blog"], ["DELETE", "/projects"], ["POST", "/blog/rss.xml"], ["POST", "/llms.txt"], ["PATCH", "/sitemap.xml"]]) {
  const r = await status(m, p, "x=1");
  flag(`METHOD ${m} ${p}`, r.status === 200 ? "HIGH" : "OK", `-> ${r.status}`);
}

// 3. Sensitive path disclosure
for (const p of ["/.env", "/.env.local", "/package.json", "/package-lock.json", "/.git/HEAD", "/.git/config", "/server/app/page.js", "/_next/static/chunks/does-not-exist.js", "/api", "/admin", "/wp-login.php", "/.well-known/change-password"]) {
  const r = await status("GET", p);
  const leak = r.status === 200 && !p.startsWith("/.well-known");
  flag(`PATH ${p}`, leak ? "HIGH" : "OK", `-> ${r.status}`);
}

// 4. Traversal + odd slugs (expect 404, no 500, no content)
for (const p of ["/blog/..%2f..%2fetc%2fpasswd", "/blog/....//....//etc", "/blog/%2e%2e/%2e%2e/package.json", "/blog/<script>alert(1)</script>", "/blog/%00", "/blog/a-minimal-stack-for-shipping-fast%00.md"]) {
  const r = await status("GET", encodeURI(p).replace(/%25/g, "%"));
  const reflected = r.text.includes("alert(1)") || r.text.includes("passwd");
  flag(`TRAVERSAL ${p.slice(0, 40)}`, r.status === 500 || reflected ? "HIGH" : "OK", `-> ${r.status}${reflected ? " REFLECTED!" : ""}`);
}

// 5. Query reflection / XSS sinks (?page= reflected anywhere?)
for (const p of ["/blog?page=<script>alert(1)</script>", "/blog?page=999999999999999999999", "/blog?page=-5", "/blog?page=1.5", "/?q=<img src=x onerror=alert(1)>"]) {
  const r = await status("GET", p);
  const reflected = r.text.includes("<script>alert(1)</script>") || r.text.includes("<img src=x onerror");
  flag(`XSS ${p.slice(0, 45)}`, reflected ? "CRITICAL" : "OK", `-> ${r.status}${reflected ? " REFLECTED!" : ""}`);
}

// 6. Content-type correctness
{
  const rss = await status("GET", "/blog/rss.xml");
  flag("RSS-CTYPE", (rss.headers.get("content-type") || "").includes("rss+xml") ? "OK" : "LOW", rss.headers.get("content-type") ?? "missing");
  const llms = await status("GET", "/llms.txt");
  flag("LLMS-CTYPE", (llms.headers.get("content-type") || "").includes("text/plain") ? "OK" : "LOW", llms.headers.get("content-type") ?? "missing");
  const manifest = await status("GET", "/manifest.webmanifest");
  try {
    const j = JSON.parse(manifest.text);
    flag("MANIFEST", j.icons?.length >= 2 && j.start_url === "/" ? "OK" : "LOW", `icons=${j.icons?.length} start=${j.start_url}`);
  } catch { flag("MANIFEST", "MEDIUM", "invalid JSON"); }
}

// 7. Mixed content / upgrade intent
{
  const r = await status("GET", "/");
  const httpLinks = [...r.text.matchAll(/href="http:\/\/(?!localhost)[^"]*"/g)].map((m) => m[0]);
  flag("MIXED-CONTENT", httpLinks.length ? "MEDIUM" : "OK", httpLinks.length ? httpLinks.slice(0, 3).join(" ") : "no http:// links");
}

console.log(out.join("\n"));
const bad = out.filter((l) => /CRITICAL|HIGH|MEDIUM/.test(l) && !l.includes("-> 200") || /REFLECTED|missing|invalid/.test(l));
console.log(`\nattention items: ${bad.length}`);
