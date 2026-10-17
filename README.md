# carlos@serra · Portfólio de Carlos Serra

<img src="assets/marca/logo.svg" width="56" height="56" alt="Logo carlos@serra: hexágono aberto com o prompt de terminal">

Site pessoal de **Carlos Serra**, desenvolvedor full stack júnior em Palhoça/SC (ADS · FMP).
Versão 8: marca `carlos@serra`, tela de carregamento com o nome, topo com detalhes de terminal, projetos como estudos de caso,
arquivo com filtros, contato que monta a mensagem e atalhos de teclado.

**No ar:** https://carlosserra-a11y.github.io/leadpagecarlos/

![Topo do site](assets/og.png)

- E-mail: carlosserraap55@gmail.com
- WhatsApp: (48) 99617-0281
- GitHub: https://github.com/carlosserra-a11y

## Organização da página

Na ordem em que um recrutador procura:

| Seção | Conteúdo |
| --- | --- |
| Carregamento | Na primeira visita da sessão, o nome se decodifica enquanto a página carrega (contador 0 → 100); qualquer tecla pula |
| Topo | Nome, cargo, disponibilidade, uma frase do que eu faço, botões (projetos e WhatsApp), e-mail, números (clientes reais, sites no ar, repositórios) e uma moldura com local, hora e coordenadas |
| Projetos em destaque | Figaro's 2.0, São Cristóvão 3.0 e Smartech 3.0 como estudos de caso: desafio, o que eu fiz, como conferir, stack, links e evolução 1.0 → 3.0. Uma barra `01 / 03` acompanha a leitura |
| Outros clientes e arquivo | Ingrid Lima e CS Store, e o arquivo com todos os repositórios: filtros (clientes, 3D, IA, React, back-end, estudos) e prévia da tela seguindo o mouse; repositórios novos entram sozinhos pela API do GitHub |
| Stack | Seis áreas, cada uma com o projeto que comprova |
| Sobre | Retrato, bio, ficha, resumo para recrutador (copiar), salvar contato (.vcf) e trajetória |
| Contato | Canais (WhatsApp, e-mail com copiar, GitHub, LinkedIn quando houver, salvar contato), QR code para abrir o WhatsApp no celular, hora local, e um formulário que monta a mensagem (vaga ou projeto, tipo, prazo, orçamento) e envia pelo WhatsApp ou pelo e-mail, com prévia |
| Rodapé | Chamada para conversar, mapa do site, contatos, projetos no ar, status com relógio, assinatura de terminal e a marca gigante que acende com o mouse |

Também: versão em inglês (botão EN), atalhos com **Ctrl K / ⌘K** (ir para seções, copiar e-mail, abrir WhatsApp, trocar idioma), detalhes de cada projeto com link direto (`#caso-figaros`, `#caso-ingrid`…), barra fixa de contato no celular e página 404 própria.

## Interação e 3D

- **Topo em 3D (PrismHero):** um cristal facetado com transmissão de verdade e dispersão cromática, refratando o nome desenhado atrás dele, iluminado nas cores da marca. Atrás, uma grade de pontos em shader acende perto do mouse e solta uma onda no clique. Gira devagar, segue o mouse e acelera com a rolagem (o topo fica preso na tela por uma altura e uma barra mostra o progresso). Componente React em `app/src/components/ui/prism-hero.tsx`.
- **Vitrine 3D:** um notebook e um celular modelados só com código em `src/vitrine3d.js` (teclado com teclas instanciadas, tampa que abre quando os projetos chegam, a logo na tampa, reflexos de estúdio). A tela mostra a página inteira de cada projeto e rola por ela conforme você atravessa o projeto; a troca entre projetos é um "glitch" curto que termina num crossfade. Segue o mouse de leve.
- **Fundo vivo:** uma grade de pontos que anda com a rolagem (parallax) e tem uma onda passando; perto do mouse os pontos viram caracteres de código, e um clique solta uma onda.
- **Microinterações:** texto que se decodifica (menu, rótulos), anel que segue o cursor, botões com atração, imagens que se abrem por máscara, contadores e terminal digitando no topo.
- **Rolagem:** camadas do topo em velocidades diferentes, faixa da stack que acelera e muda de sentido com a rolagem, palavras enormes em contorno passando no fundo das seções, títulos que sobem palavra por palavra, trajetória que se preenche.
- **Mouse:** luz do topo que segue o cursor, cartões da stack com luz no ponto do mouse, etiqueta "Abrir site" nos projetos, botões com leve atração.

## Decisões técnicas

- **Sem framework e sem build para o site.** HTML, CSS e JavaScript clássicos: abre com dois cliques no `index.html` e publica direto no GitHub Pages.
- **React só onde precisa ("ilha").** O topo em 3D é um componente React + TypeScript + Tailwind no padrão shadcn, em `app/`. O build gera `lib/prism-hero.min.js` (script clássico, sem módulos) e `css/prism-hero.css`, que o `js/app.js` carrega. O topo em HTML continua no `index.html`: é o que aparece sem JavaScript, sem GPU de verdade, em economia de dados, em rede lenta, com "reduzir movimento" e enquanto o 3D carrega. A altura já fica reservada, então a troca não empurra a página; se o WebGL falhar ou o aparelho não passar de ~22 quadros por segundo, o site volta sozinho para o topo em HTML.
- **3D que não atrapalha.** A vitrine só carrega depois da página, no computador, com GPU de verdade e o site servido por http(s). No celular, sem GPU, em economia de dados, sem JavaScript ou com "reduzir movimento", aparece o pôster (gerado pelo próprio modelo) e cada projeto mostra a moldura do navegador em HTML com a página rolando. `?3d=1` na URL força o 3D para testes (e `?3d=0` desliga).
- **Tela de carregamento que não atrapalha.** Decidida por um script no `<head>` antes da primeira pintura: só na primeira visita da sessão, nunca com "reduzir movimento" e nunca sem JavaScript. Tem tempo mínimo e máximo (cerca de 1,5 a 2,7 s) e uma animação em CSS que a tira da frente em 4 s se algum script falhar. `?intro=1` força e `?intro=0` desliga.
- **Segurança.** Nenhum script de CDN (tudo em `lib/`), CSP com o hash do único script inline, links externos com `noopener noreferrer` e links do `CONFIG` validados.
- **Qualidade verificada a cada push** (`.github/workflows/qualidade.yml`): HTML válido, CSP em dia com o script inline, links sem erro, a parte em React compilando e Lighthouse com orçamento (`.lighthouserc.json`).
- **Funciona sem JavaScript, ao imprimir e em navegadores antigos.** Sem script, o topo, os projetos e os contatos aparecem completos (o que depende de script some); a impressão sai em preto no branco com os links escritos; sem suporte a `<dialog>`, os detalhes abrem numa camada fixa.

Medido localmente com Lighthouse 12 (com a tela de carregamento ativa): desempenho 94 no celular e 100 no computador; acessibilidade e SEO 100. Antes de publicar, três revisões de código independentes (JavaScript, HTML/CSS/acessibilidade e a parte 3D) procuraram bugs; o que acharam foi corrigido.

## Estrutura

```
index.html            página
404.html              página de erro
css/style.css         estilos
js/dados.js           textos, contatos, projetos e traduções (edite aqui)
js/app.js             comportamento, fundo animado, vitrine e animações
src/vitrine3d.js      modelo 3D do notebook e do celular (fonte)
app/                  parte em React (Vite + TypeScript + Tailwind + shadcn): o topo em 3D
  src/components/ui/  componentes no padrão shadcn (prism-hero.tsx)
  src/island.tsx      liga o PrismHero ao site (textos, botões, ícones lucide, volta para o HTML)
  src/index.css       Tailwind v4 e tokens do shadcn com as cores do site
css/prism-hero.css    CSS da ilha (gerado)
lib/                  GSAP, ScrollTrigger, Lenis, a vitrine e o topo 3D já montados
assets/marca/         logo carlos@serra (SVG); assets/favicon.svg e os PNG são os ícones
assets/foto/          retrato recortado (AVIF/WebP com transparência)
assets/vitrine/       pôster da vitrine 3D
assets/projetos/      capturas dos projetos (inclusive a página inteira dos destaques)
ferramentas/          scripts de manutenção (Node)
```

## Como editar

1. Contatos, projetos e textos ficam em `js/dados.js`. Campos vazios do `CONFIG` (ex.: `linkedin`, `curriculo`, `resposta`) somem da página.
2. Depois de mudar o script inline do `index.html` ou as fontes, atualize a CSP:
   ```
   node ferramentas/cabecalho.mjs
   ```
3. Ferramentas (precisam de `cd ferramentas && npm install` e, para as que tiram foto da tela, `npx playwright install chromium`):
   ```
   npm run marca    # ícones a partir de assets/favicon.svg
   npm run og       # assets/og.png, a imagem de compartilhamento (molde em ferramentas/og.html)
   npm run qr       # QR code do contato, a partir do número do WhatsApp em js/dados.js
   ```
4. Depois de mexer na vitrine (`src/vitrine3d.js`):
   ```
   cd ferramentas && npm install && npx playwright install chromium
   npm run vitrine && npm run poster
   ```
5. Depois de mexer no topo 3D (`app/`):
   ```
   cd app && npm install
   npm run dev      # demonstração do componente em http://localhost:5173
   npm run build    # confere os tipos, gera e copia lib/prism-hero.min.js e css/prism-hero.css
   ```
   Para adicionar outro componente do shadcn: `cd app && npx shadcn@latest add <nome>` (vai para `src/components/ui/`).

## Publicação

GitHub Pages a partir da branch `main`, pasta raiz. Cada push na `main` publica em um ou dois minutos.
