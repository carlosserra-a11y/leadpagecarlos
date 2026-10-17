// Regrava o QR code do contato (o que abre o WhatsApp) dentro do index.html, a partir do número em js/dados.js.
// Uso:  node ferramentas/qr.mjs   (precisa de: npm install)
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const QR = createRequire(import.meta.url)("qrcode");
const dados = readFileSync(join(RAIZ, "js/dados.js"), "utf8");
const numero = (dados.match(/whatsapp:\s*"(\d+)"/) || [])[1];
if (!numero) throw new Error("Número do WhatsApp não encontrado em js/dados.js");

const svg = await QR.toString(`https://wa.me/${numero}`, { type: "svg", errorCorrectionLevel: "M", margin: 0 });
const box = svg.match(/viewBox="([^"]+)"/)[1];
const caminho = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map(m => m[1]).find(d => !/^M0 0h\d+v\d+H0z$/.test(d));
let html = readFileSync(join(RAIZ, "index.html"), "utf8");
html = html.replace(/<svg class="qr" viewBox="[^"]*" shape-rendering="crispEdges"><path stroke="currentColor" d="[^"]*"\/><\/svg>/,
  `<svg class="qr" viewBox="${box}" shape-rendering="crispEdges"><path stroke="currentColor" d="${caminho}"/></svg>`);
writeFileSync(join(RAIZ, "index.html"), html);
console.log(`QR code de https://wa.me/${numero} gravado no index.html`);
