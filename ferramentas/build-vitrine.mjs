// Empacota src/vitrine3d.js + só as partes do three.js que ela usa em lib/vitrine3d.min.js
// (script clássico, funciona até abrindo o index.html com dois cliques).
// Uso:  cd ferramentas && npm install && npm run vitrine
import { build } from "esbuild";
import { statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const saida = join(RAIZ, "lib/vitrine3d.min.js");
await build({
  entryPoints: [join(RAIZ, "src/vitrine3d.js")],
  nodePaths: [join(RAIZ, "ferramentas/node_modules")],
  bundle: true, minify: true, format: "iife", globalName: "Vitrine3D",
  target: ["es2020"], outfile: saida, legalComments: "eof",
  banner: { js: "/* Vitrine 3D · Carlos Serra · three.js (MIT) empacotado com esbuild */" }
});
console.log(`lib/vitrine3d.min.js: ${(statSync(saida).size / 1024).toFixed(0)} KB`);
