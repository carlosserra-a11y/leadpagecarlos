// Depois do `vite build`: copia a ilha para onde o site estático a carrega.
//   dist/prism-hero.min.js -> ../lib/prism-hero.min.js
//   dist/prism-hero.css    -> ../css/prism-hero.css
import { readFile, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const app = fileURLToPath(new URL("..", import.meta.url))
const pkg = JSON.parse(await readFile(app + "package.json", "utf8"))
const v = n => String(pkg.dependencies[n]).replace(/^\^|~/, "")

const banner =
  `/*! prism-hero.min.js · gerado por app/ (npm run build), não edite à mão.\n` +
  ` * React ${v("react")} e ReactDOM (MIT) · three.js ${v("three")} (MIT) · @react-three/fiber ${v("@react-three/fiber")} (MIT)\n` +
  ` * @react-three/drei ${v("@react-three/drei")} (MIT) · motion ${v("motion")} (MIT) · lucide-react ${v("lucide-react")} (ISC) */\n`

const js = await readFile(app + "dist/prism-hero.min.js", "utf8")
const css = await readFile(app + "dist/prism-hero.css", "utf8")
await writeFile(app + "../lib/prism-hero.min.js", banner + js)
await writeFile(app + "../css/prism-hero.css", "/* gerado por app/ (npm run build), não edite à mão */\n" + css)

const kb = s => (Buffer.byteLength(s) / 1024).toFixed(0) + " KB"
console.log(`lib/prism-hero.min.js ${kb(js)} · css/prism-hero.css ${kb(css)}`)
