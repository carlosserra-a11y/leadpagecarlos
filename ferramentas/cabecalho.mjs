// Atualiza o <head> depois de mudar textos ou o script inline:
//  1. monta as URLs das fontes do Google, com as japonesas só com os caracteres usados no site (parâmetro text=);
//  2. recalcula o hash SHA-256 de cada script inline e grava na política de segurança (CSP).
// Uso:  node ferramentas/cabecalho.mjs      (não precisa de npm install)
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ler = f => readFileSync(join(RAIZ, f), "utf8");

// 1. fontes ---------------------------------------------------------------
const textos = ["index.html", "js/dados.js", "js/app.js"].map(ler).join("");
const base = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join("") +
  "ÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜàáâãäçèéêëìíîïñòóôõöùúûüºª©«»“”‘’–—·…→←↑↓✕×•";
const extras = [...textos].filter(c => c.codePointAt(0) > 0x7f && !/\p{Extended_Pictographic}/u.test(c));
const chars = [...new Set([...base, ...extras])].sort().join("");
const LATINAS = "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=IBM+Plex+Mono:wght@400;500&display=swap";
const JAPONESAS = "https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@600;800&family=Yuji+Syuku&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap&text=" + encodeURIComponent(chars);

let html = ler("index.html");
html = html.replace(/\/\*FONTES\*\/[\s\S]*?\/\*FIM\*\//, `/*FONTES*/${JSON.stringify([LATINAS, JAPONESAS])}/*FIM*/`);
const amp = u => u.replace(/&/g, "&amp;");
html = html.replace(/<noscript>(?:<!--NOSCRIPT-->|<link rel="stylesheet" href="https:\/\/fonts[^]*?)<\/noscript>/,
  `<noscript><link rel="stylesheet" href="${amp(LATINAS)}"><link rel="stylesheet" href="${amp(JAPONESAS)}"></noscript>`);

// 2. hashes da CSP --------------------------------------------------------
function comHashes(doc) {
  const hashes = [...doc.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map(m => `'sha256-${createHash("sha256").update(m[1], "utf8").digest("base64")}'`);
  return doc.replace(/(script-src 'self')((?: 'sha256-[^']*')*)/, `$1 ${hashes.join(" ")}`);
}
writeFileSync(join(RAIZ, "index.html"), comHashes(html));
writeFileSync(join(RAIZ, "404.html"), comHashes(ler("404.html")));
console.log(`Fontes: ${extras.length ? new Set(extras).size : 0} caracteres especiais · hashes da CSP atualizados em index.html e 404.html`);
