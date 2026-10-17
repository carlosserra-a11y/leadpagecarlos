// Gera o pôster da vitrine 3D (a imagem do topo no celular e em aparelhos sem GPU, e a que aparece antes do 3D carregar).
// Desenha o notebook e o celular parados, com fundo transparente, em 900 e 1400 px (AVIF e WebP).
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

const TIPOS = { ".html": "text/html", ".js": "application/javascript", ".webp": "image/webp" };
const srv = createServer((req, res) => {
  const f = join(RAIZ, decodeURIComponent(new URL(req.url, "http://x").pathname));
  let corpo;
  try { corpo = readFileSync(f); } catch { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": TIPOS[extname(f)] || "application/octet-stream" }); res.end(corpo);
});
await new Promise(ok => srv.listen(0, "127.0.0.1", ok));

const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.goto(`http://127.0.0.1:${srv.address().port}/ferramentas/poster.html`);
await page.waitForFunction(() => document.title === "pronto", null, { timeout: 60000 });
const png = await page.screenshot({ omitBackground: true });
await browser.close(); srv.close();

mkdirSync(join(RAIZ, "assets/vitrine"), { recursive: true });
for (const w of [900, 1400]) {
  const img = sharp(png).resize(w);
  await img.clone().webp({ quality: 80, alphaQuality: 90, effort: 6 }).toFile(join(RAIZ, `assets/vitrine/vitrine-${w}.webp`));
  await img.clone().avif({ quality: 55, effort: 6 }).toFile(join(RAIZ, `assets/vitrine/vitrine-${w}.avif`));
}
console.log("Pôster gerado em assets/vitrine/");
