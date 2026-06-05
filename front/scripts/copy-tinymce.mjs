// TinyMCE self-hosted asset'lerini public/tinymce'e kopyalar (build/dev öncesi).
// Böylece API anahtarı / bulut CDN gerekmez; production'da da ücretsiz çalışır.
import { cp, rm, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const src = path.resolve("node_modules/tinymce");
const dest = path.resolve("public/tinymce");

if (!existsSync(src)) {
  console.error("tinymce node_modules'te bulunamadı. `npm install` çalıştır.");
  process.exit(1);
}

await rm(dest, { recursive: true, force: true });
await mkdir(dest, { recursive: true });
await cp(src, dest, { recursive: true });

console.log("✓ TinyMCE asset'leri public/tinymce'e kopyalandı.");
