// Takes desktop and mobile screenshots of a live URL and, optionally, uploads
// them to the site's media store so they can be pasted into a project gallery.
//
// Runs inside the Puppeteer container; see README.md.
//
//   node capture.mjs --url https://korede.com.tr --out /out --name korede
//   node capture.mjs --url https://korede.com.tr --out /out --upload
//
// Uploading needs SITE_URL, ADMIN_USERNAME and ADMIN_PASSWORD in the
// environment. Credentials are never accepted as arguments.

import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import puppeteer from "puppeteer";

const VIEWPORTS = [
  { label: "desktop", width: 1440, height: 900, deviceScaleFactor: 2, isMobile: false },
  { label: "mobile", width: 390, height: 844, deviceScaleFactor: 3, isMobile: true },
];

function parseArgs(argv) {
  const args = { out: "/out", wait: 1500, full: false, upload: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--full") args.full = true;
    else if (arg === "--upload") args.upload = true;
    else if (arg.startsWith("--")) {
      args[arg.slice(2)] = argv[i + 1];
      i += 1;
    }
  }
  args.wait = Number(args.wait) || 0;
  return args;
}

/** "https://korede.com.tr/urunler" -> "korede-com-tr" */
function nameFromUrl(url) {
  return new URL(url).hostname.replace(/^www\./, "").replace(/[^a-z0-9]+/gi, "-");
}

async function capture(url, { out, name, wait, full }) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const files = [];

  try {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport(viewport);
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60_000 });
      if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait));
      }

      const path = join(out, `${name}-${viewport.label}.webp`);
      await page.screenshot({ path, type: "webp", quality: 88, fullPage: full });
      await page.close();

      files.push(path);
      console.log(`${viewport.label.padEnd(7)} ${viewport.width}x${viewport.height}  ${path}`);
    }
  } finally {
    await browser.close();
  }

  return files;
}

async function login(site) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    throw new Error("ADMIN_USERNAME ve ADMIN_PASSWORD tanımlı değil.");
  }

  const res = await fetch(`${site}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    throw new Error(`Giriş başarısız (HTTP ${res.status}).`);
  }
  return (await res.json()).accessToken;
}

async function upload(site, token, path) {
  const body = new FormData();
  const file = await readFile(path);
  body.append("file", new Blob([file], { type: "image/webp" }), path.split("/").pop());

  const res = await fetch(`${site}/api/admin/uploads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  if (!res.ok) {
    throw new Error(`Yükleme başarısız (HTTP ${res.status}): ${path}`);
  }
  return (await res.json()).location;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.url) {
    console.error("Kullanım: node capture.mjs --url https://site.com [--out /out] [--name ad] [--full] [--upload]");
    process.exit(1);
  }

  const name = args.name || nameFromUrl(args.url);
  await mkdir(args.out, { recursive: true });

  const files = await capture(args.url, { out: args.out, name, wait: args.wait, full: args.full });

  if (!args.upload) return;

  const site = (process.env.SITE_URL || "").replace(/\/$/, "");
  if (!site) {
    throw new Error("SITE_URL tanımlı değil; yükleme yapılamaz.");
  }

  console.log(`\nYükleniyor: ${site}`);
  const token = await login(site);
  for (const path of files) {
    console.log(`  ${await upload(site, token, path)}`);
  }
  console.log("\nÜstteki adresleri admin panelde proje galerisine yapıştırabilirsin.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
