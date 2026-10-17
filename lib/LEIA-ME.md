# Bibliotecas hospedadas no próprio site

| Arquivo | Versão | Licença |
| --- | --- | --- |
| `gsap.min.js`, `ScrollTrigger.min.js` | GSAP 3.12.5 | Standard "no charge" license · https://gsap.com/standard-license |
| `lenis.min.js` | Lenis 1.1.13 | MIT |
| `vitrine3d.min.js` | three.js r169 (MIT) + `src/vitrine3d.js` | MIT (three.js) · código da vitrine do próprio autor |

GSAP e Lenis foram copiados sem alteração dos pacotes oficiais do npm. `vitrine3d.min.js` é gerado por
`ferramentas/build-vitrine.mjs` (esbuild) e só inclui as partes do three.js que a vitrine usa.
Tudo fica aqui (e não num CDN) para a página não executar scripts de terceiros.
