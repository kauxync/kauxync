import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PROJECT_ROOT = path.resolve(ROOT, "..");
const OUT_LOGO = path.join(ROOT, "public", "logo");
const OUT_ICONS = path.join(ROOT, "public", "icons");
const PREVIEW_DIR = path.join(process.env.TEMP || ROOT, "kauxync-previews");

// Official sources provided by Kauxync (see repo root):
//   kauxync-white.svg -> black artwork, for light backgrounds
//   kauxync-dark.svg   -> white artwork, for dark backgrounds
const SRC_LIGHT_ART = path.join(PROJECT_ROOT, "kauxync-white.svg");
const SRC_DARK_ART = path.join(PROJECT_ROOT, "kauxync-dark.svg");

for (const file of [SRC_LIGHT_ART, SRC_DARK_ART]) {
  if (!fs.existsSync(file)) {
    console.error(`Missing logo source: ${file}`);
    process.exit(1);
  }
}

fs.mkdirSync(OUT_LOGO, { recursive: true });
fs.mkdirSync(OUT_ICONS, { recursive: true });
fs.mkdirSync(PREVIEW_DIR, { recursive: true });

const read = (file) => fs.readFileSync(file, "utf8");

/** Strip root width/height/background so the viewBox drives sizing. */
function clean(svg) {
  return svg
    .replace(/(<svg\b[^>]*?)\swidth="[^"]*"/, "$1")
    .replace(/(<svg\b[^>]*?)\sheight="[^"]*"/, "$1")
    .replace(/\sstyle="background:[^"]*"/, "")
    .trimEnd();
}

function innerContent(svg) {
  return svg
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "");
}

const lightArt = read(SRC_LIGHT_ART);
const darkArt = read(SRC_DARK_ART);

// ---------- 1. Theme wordmarks (SVG only) ----------
fs.writeFileSync(path.join(OUT_LOGO, "kauxync-white.svg"), clean(lightArt) + "\n");
fs.writeFileSync(path.join(OUT_LOGO, "kauxync-dark.svg"), clean(darkArt) + "\n");
console.log("wrote logo/kauxync-white.svg, logo/kauxync-dark.svg");

// ---------- 2. Favicon set derived from the full official logo ----------
const [lvx, lvy, lvw, lvh] = (lightArt.match(/viewBox="([^"]+)"/)?.[1] ?? "150 360 730 40")
  .split(/\s+/)
  .map(Number);
const logoInner = innerContent(lightArt);

function faviconSvg(size, { rounded = true } = {}) {
  const logoWidth = size * 0.86;
  const scale = logoWidth / lvw;
  const logoHeight = lvh * scale;
  const tx = (size - logoWidth) / 2 - lvx * scale;
  const ty = (size - logoHeight) / 2 - lvy * scale;
  const radius = rounded ? Math.round(size * 0.22) : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="#ffffff"/>
  <g transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${scale.toFixed(6)})">${logoInner}</g>
</svg>
`;
}

const faviconSvgSource = faviconSvg(64);
fs.writeFileSync(path.join(OUT_ICONS, "favicon.svg"), faviconSvgSource);

const pngJobs = [
  { size: 16, rounded: true },
  { size: 32, rounded: true },
  { size: 48, rounded: true },
  { size: 192, rounded: true },
  { size: 512, rounded: true },
  { size: 180, rounded: false }, // apple-touch-icon: full bleed
];

const icoParts = [];
for (const job of pngJobs) {
  const svg = faviconSvg(job.size, { rounded: job.rounded });
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  if (job.rounded && job.size <= 48) {
    icoParts.push({ size: job.size, data: buf });
  }
  const name =
    job.size === 180 ? "apple-touch-icon.png" : `favicon-${job.size}x${job.size}.png`;
  fs.writeFileSync(path.join(OUT_ICONS, name), buf);
}

// favicon.ico = PNG-encoded entries (16 + 32 + 48)
function buildIco(parts) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(parts.length, 4);
  let offset = 6 + 16 * parts.length;
  const entries = [];
  for (const { size, data } of parts) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...parts.map((p) => p.data)]);
}

fs.writeFileSync(path.join(OUT_ICONS, "favicon.ico"), buildIco(icoParts));
console.log("wrote favicon.svg, favicon-{16,32,48,192,512}.png, apple-touch-icon.png, favicon.ico");

// ---------- 4. Visual previews (for review) ----------
async function preview(name, svg, background) {
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  const meta = await sharp(png).metadata();
  const pad = 24;
  await sharp({
    create: {
      width: meta.width + pad * 2,
      height: meta.height + pad * 2,
      channels: 4,
      background,
    },
  })
    .composite([{ input: png, top: pad, left: pad }])
    .png()
    .toFile(path.join(PREVIEW_DIR, name));
}

const wordLight = fs.readFileSync(path.join(OUT_LOGO, "kauxync-white.svg"), "utf8");
const wordDark = fs.readFileSync(path.join(OUT_LOGO, "kauxync-dark.svg"), "utf8");
await preview("word-light-on-light.png", wordLight, "#f7f7f5");
await preview("word-dark-on-dark.png", wordDark, "#08080a");
await preview("favicon-64.png", faviconSvg(64), "#d9d9d9");
console.log(`previews written to ${PREVIEW_DIR}`);

// ---------- 5. Per-post OG images (1200x630, brutalist dark cards) ----------
const matter = require("gray-matter");
const OUT_OG = path.join(ROOT, "public", "og");
const POSTS_DIR = path.join(ROOT, "content", "blog");
fs.mkdirSync(OUT_OG, { recursive: true });

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapTitle(title, maxChars = 26, maxLines = 3) {
  const words = String(title).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  const sliced = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    sliced[maxLines - 1] = `${sliced[maxLines - 1].slice(0, maxChars - 1)}…`;
  }
  return sliced;
}

function formatOgDate(iso) {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  return date
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase();
}

const darkVb = (darkArt.match(/viewBox="([^"]+)"/)?.[1] ?? "150 360 730 40")
  .split(/\s+/)
  .map(Number);
const [dvx, dvy, dvw] = darkVb;
const logoScale = 240 / dvw;
const logoInnerDark = innerContent(darkArt);

function postOgSvg({ title, date }) {
  const lines = wrapTitle(title);
  const startY = 300 - ((lines.length - 1) * 88) / 2;
  const titleText = lines
    .map(
      (line, i) =>
        `<text x="88" y="${startY + i * 88}" font-size="72" font-weight="bold" fill="#f4f4f5">${escapeXml(line)}</text>`,
    )
    .join("\n    ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" font-family="Arial, Helvetica, sans-serif">
  <rect width="1200" height="630" fill="#0a0a0b"/>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#f4f4f5" stroke-opacity="0.25" stroke-width="2"/>
  <text x="88" y="122" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="27" font-weight="bold" letter-spacing="6" fill="#a1a1aa">KAUXYNC — BLOG</text>
  <g transform="translate(${(1112 - 240).toFixed(1)} 92) scale(${logoScale.toFixed(4)}) translate(${-dvx} ${-dvy})">${logoInnerDark}</g>
  <rect x="88" y="152" width="96" height="8" fill="#2dd4bf"/>
  ${titleText}
  <text x="88" y="548" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="26" letter-spacing="3" fill="#a1a1aa">${escapeXml(formatOgDate(date))}</text>
  <text x="1112" y="548" text-anchor="end" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="26" letter-spacing="3" fill="#2dd4bf">KAUXYNC.IN</text>
</svg>
`;
}

const postFiles = fs.existsSync(POSTS_DIR)
  ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
  : [];
for (const file of postFiles) {
  const slug = file.replace(/\.mdx?$/, "");
  const { data } = matter(fs.readFileSync(path.join(POSTS_DIR, file), "utf8"));
  const svg = postOgSvg({ title: data.title ?? slug, date: data.date ?? "" });
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT_OG, `blog-${slug}.png`));
}
console.log(`wrote ${postFiles.length} post OG images to public/og`);
