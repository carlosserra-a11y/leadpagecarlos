// Gera assets/og.png (1200×630), a imagem que aparece quando o link do site é compartilhado.
// Uso:  node ferramentas/og.mjs   (precisa de: npm install; npx playwright install chromium)
//       PLAYWRIGHT=/caminho/playwright CHROME=/caminho/chromium node ferramentas/og.mjs   (para usar um já instalado)
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const sharp = require("sharp");
const { chromium } = require(process.env.PLAYWRIGHT || "playwright");

const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, proxy });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(join(RAIZ, "ferramentas/og.html")).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot();
await browser.close();
await sharp(png).png({ compressionLevel: 9, palette: false }).toFile(join(RAIZ, "assets/og.png"));
console.log("assets/og.png gerado");
