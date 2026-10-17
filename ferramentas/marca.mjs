// Gera os ícones da marca carlos@serra a partir de assets/favicon.svg:
// favicon-32.png, icon-180.png (Apple) e icon-192.png. Uso: node ferramentas/marca.mjs (precisa de: npm install)
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const sharp = createRequire(import.meta.url)("sharp");
const svg = readFileSync(join(RAIZ, "assets/favicon.svg"));

// o ícone da Apple não aceita transparência nem cantos próprios: fundo cheio
const cheio = Buffer.from(String(svg).replace('rx="11"', 'rx="0"'));
for (const [arq, w, fonte] of [["favicon-32.png", 32, svg], ["icon-192.png", 192, svg], ["icon-180.png", 180, cheio]]) {
  await sharp(fonte, { density: 72 * w / 48 * 2 }).resize(w, w).png({ compressionLevel: 9 }).toFile(join(RAIZ, "assets", arq));
}
console.log("Ícones gerados em assets/");
