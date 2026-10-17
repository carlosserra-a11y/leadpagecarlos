# Bibliotecas hospedadas no próprio site

| Arquivo | Versão | Licença |
| --- | --- | --- |
| `gsap.min.js`, `ScrollTrigger.min.js` | GSAP 3.12.5 | Standard "no charge" license · https://gsap.com/standard-license |
| `lenis.min.js` | Lenis 1.1.13 | MIT |
| `vitrine3d.min.js` | three.js r169 (MIT) + `src/vitrine3d.js` | MIT (three.js) · código da vitrine do próprio autor |
| `prism-hero.min.js` | React 19, ReactDOM, three.js r186, @react-three/fiber 9, @react-three/drei 10, motion 14, lucide-react + `app/src` | MIT (lucide-react: ISC) · versões exatas no cabeçalho do arquivo e em `app/package-lock.json` |

GSAP e Lenis foram copiados sem alteração dos pacotes oficiais do npm. `vitrine3d.min.js` é gerado por
`ferramentas/build-vitrine.mjs` (esbuild) e só inclui as partes do three.js que a vitrine usa.
`prism-hero.min.js` é gerado por `cd app && npm run build` (Vite) junto com `css/prism-hero.css`; não edite à mão.
Tudo fica aqui (e não num CDN) para a página não executar scripts de terceiros.
