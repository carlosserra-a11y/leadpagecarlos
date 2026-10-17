// Atualiza o <head> depois de mudar textos ou o script inline:
//  1. grava as URLs das fontes do Google (Space Grotesk, Geist e JetBrains Mono) no script inline e no <noscript>;
//  2. recalcula o hash SHA-256 de cada script inline e grava na política de segurança (CSP).
// Uso:  node ferramentas/cabecalho.mjs      (não precisa de npm install)
//       node ferramentas/cabecalho.mjs --verificar   (só confere, para o CI)
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ler = f => readFileSync(join(RAIZ, f), "utf8");

// 1. fontes ---------------------------------------------------------------
const FONTES = ["https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400..700&family=Geist:wght@300..700&family=JetBrains+Mono:wght@400..700&display=swap"];

let html = ler("index.html");
html = html.replace(/\/\*FONTES\*\/[\s\S]*?\/\*FIM\*\//, `/*FONTES*/${JSON.stringify(FONTES)}/*FIM*/`);
const amp = u => u.replace(/&/g, "&amp;");
html = html.replace(/<noscript>(?:<!--NOSCRIPT-->|<link rel="stylesheet" href="https:\/\/fonts[^]*?)<\/noscript>/,
  `<noscript>${FONTES.map(f => `<link rel="stylesheet" href="${amp(f)}">`).join("")}</noscript>`);

// 2. hashes da CSP --------------------------------------------------------
function comHashes(doc) {
  const hashes = [...doc.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map(m => `'sha256-${createHash("sha256").update(m[1], "utf8").digest("base64")}'`);
  return doc.replace(/(script-src 'self')((?: 'sha256-[^']*')*)/, `$1 ${hashes.join(" ")}`);
}
// --verificar (usado no CI): não grava nada; falha se a CSP não bate com os scripts inline
// (um hash velho faz o navegador bloquear o script do <head>, e a página perde fontes e a classe "js")
if (process.argv.includes("--verificar")) {
  const erros = [["index.html", comHashes(html), ler("index.html")], ["404.html", comHashes(ler("404.html")), ler("404.html")]]
    .filter(([, certo, atual]) => certo !== atual).map(([f]) => f);
  if (erros.length) { console.error(`CSP ou fontes desatualizadas em: ${erros.join(", ")}. Rode: node ferramentas/cabecalho.mjs`); process.exit(1); }
  console.log("CSP e fontes em dia");
} else {
  writeFileSync(join(RAIZ, "index.html"), comHashes(html));
  writeFileSync(join(RAIZ, "404.html"), comHashes(ler("404.html")));
  console.log("Fontes e hashes da CSP atualizados em index.html e 404.html");
}
