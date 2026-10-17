// Gera o pôster da katana (a imagem que aparece antes do 3D, ou no lugar dele em aparelhos sem GPU).
// Usa a mesma pose do site (const POSE em js/app.js), com fundo transparente, em 900 e 1400 px (AVIF e WebP).
// Uso:  node ferramentas/poster.mjs   (precisa de: npm install; npx playwright install chromium)
//       PLAYWRIGHT=/caminho/playwright CHROME=/caminho/chromium node ferramentas/poster.mjs   (para usar um já instalado)
import { readFileSync, mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const sharp = require("sharp");
const { chromium } = require(process.env.PLAYWRIGHT || "playwright");

const pose = readFileSync(join(RAIZ, "js/app.js"), "utf8").match(/const POSE = (\{[^}]*\});/)[1];
const TIPOS = { ".html": "text/html", ".js": "application/javascript" };
const srv = createServer((req, res) => {
  const f = join(RAIZ, decodeURIComponent(new URL(req.url, "http://x").pathname));
  let corpo;
  try { corpo = readFileSync(f); } catch { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": TIPOS[extname(f)] || "application/octet-stream" }); res.end(corpo);
});
await new Promise(ok => srv.listen(0, "127.0.0.1", ok));
const porta = srv.address().port;

const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1400, height: 1400 } });
await page.goto(`http://127.0.0.1:${porta}/ferramentas/poster.html?pose=${encodeURIComponent(JSON.stringify(Function(`return ${pose}`)()))}`);
await page.waitForFunction(() => document.title === "pronto");
await page.waitForTimeout(1200);
const png = await page.screenshot({ omitBackground: true });
await browser.close(); srv.close();

mkdirSync(join(RAIZ, "assets/katana"), { recursive: true });
for (const w of [900, 1400]) {
  const img = sharp(png).resize(w);
  await img.clone().webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(join(RAIZ, `assets/katana/katana-${w}.webp`));
  await img.clone().avif({ quality: 60, effort: 6 }).toFile(join(RAIZ, `assets/katana/katana-${w}.avif`));
}
console.log(`Pôster gerado em assets/katana/ com a pose ${pose}`);
