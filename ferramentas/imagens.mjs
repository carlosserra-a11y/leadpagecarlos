// Converte as imagens de assets/bleach/originais/ para o site:
// 3 tamanhos (640, 1280, 1920) em AVIF, WebP e JPG + placeholder borrado (LQIP de 24 px)
// e gera assets/bleach/imagens.js, que o site lê quando CONFIG.imagensOficiais = true.
// Uso:  cd ferramentas && npm install && npm run imagens
import sharp from "sharp";
import { readdir, writeFile, stat } from "node:fs/promises";
import { join, parse, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIG = join(RAIZ, "assets/bleach/originais");
const SAIDA = join(RAIZ, "assets/bleach");
const NOMES = ["poster-noite", "poster-sangue", "manga-tinta", "yhwach-horizonte", "wandenreich-exercito"];
const LARGURAS = [640, 1280, 1920];
const kb = n => `${(n / 1024).toFixed(0)} KB`;

const arquivos = (await readdir(ORIG)).filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f));
const manifesto = {};
for (const nome of NOMES) {
  const arq = arquivos.find(f => parse(f).name.toLowerCase() === nome);
  if (!arq) { console.warn(`⚠ Falta ${nome}.jpg (ou .png/.webp) em assets/bleach/originais/`); continue; }
  const img = sharp(join(ORIG, arq)).rotate();
  const { width, height } = await img.metadata();
  if (width < 1920 && height < 1920) console.warn(`⚠ ${arq} tem ${width}×${height}. O ideal é no mínimo 1920 px no lado maior.`);
  const larguras = LARGURAS.filter(w => w <= width);
  if (!larguras.length) larguras.push(width);
  for (const w of larguras) {
    const r = img.clone().resize({ width: w, withoutEnlargement: true });
    await r.clone().avif({ quality: 50, effort: 6 }).toFile(join(SAIDA, `${nome}-${w}.avif`));
    await r.clone().webp({ quality: 72 }).toFile(join(SAIDA, `${nome}-${w}.webp`));
    await r.clone().jpeg({ quality: 76, mozjpeg: true, progressive: true }).toFile(join(SAIDA, `${nome}-${w}.jpg`));
  }
  // cópia simples sem número, usada quando o imagens.js não existir
  await img.clone().resize({ width: Math.min(1280, width) }).webp({ quality: 72 }).toFile(join(SAIDA, `${nome}.webp`));
  const lqip = await img.clone().resize({ width: 24 }).blur(1).webp({ quality: 40 }).toBuffer();
  manifesto[nome] = { w: larguras, width, height, lqip: `data:image/webp;base64,${lqip.toString("base64")}` };
  console.log(`✓ ${nome}: ${larguras.join(", ")} px`);
}

await writeFile(join(SAIDA, "imagens.js"),
  `/* Gerado por ferramentas/imagens.mjs. Não edite à mão. */\nwindow.BLEACH = ${JSON.stringify(manifesto, null, 2)};\n`);

// peso estimado da primeira visita: pôster do hero em AVIF 1280 (o resto carrega sob demanda)
const primeira = manifesto["poster-noite"] ? (await stat(join(SAIDA, `poster-noite-${Math.min(1280, Math.max(...manifesto["poster-noite"].w))}.avif`))).size : 0;
let total = 0;
for (const n of Object.keys(manifesto)) total += (await stat(join(SAIDA, `${n}-${manifesto[n].w.includes(1280) ? 1280 : manifesto[n].w[0]}.avif`))).size;
console.log(`\nPrimeira tela (pôster do hero): ${kb(primeira)} · todas as imagens em 1280 px (AVIF): ${kb(total)}`);
if (total > 1.2 * 1024 * 1024) console.warn("⚠ Passou de 1,2 MB. Reduza a qualidade ou recorte as imagens.");
console.log("Pronto. Agora mude CONFIG.imagensOficiais para true em js/dados.js.");
