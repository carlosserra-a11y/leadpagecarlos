# 斬 Portfólio · Carlos Serra · versão 4.0

Landing page de portfólio do Carlos Serra, desenvolvedor full stack júnior em Palhoça/SC (ADS · FMP · 2ª fase).
Tema inspirado em *Bleach: Thousand-Year Blood War* (fan art, sem vínculo com os detentores dos direitos).

**No ar:** https://carlosserra-a11y.github.io/leadpagecarlos/
**Código:** https://github.com/carlosserra-a11y/leadpagecarlos

Não precisa instalar nada: dá dois cliques no `index.html` e abre.

## Novidades da versão 4.0

- **Contato em destaque:** WhatsApp **(48) 99617-0281** no hero, na ficha, no cartão de contato, no rodapé, na barra e na paleta de comandos,
  sempre com mensagem pronta. No celular, uma **barra fixa com WhatsApp e GitHub** aparece depois do hero. Botão **Salvar contato** (vCard).
- **GitHub em destaque:** ícone na barra de navegação, botão no hero, na ficha, no contato e no rodapé.
- **Identidade Bleach mais forte:**
  - zanpakutō no hero que sai da bainha, com brilho percorrendo a lâmina;
  - borboletas do inferno (jigokuchō) batendo as asas;
  - cortes **Getsuga Tenshō** entre as seções;
  - nomes de zanpakutō nos cartões de habilidade (斬月, 流刃若火, 千本桜, 鏡花水月, 氷輪丸, 侘助);
  - faixa de **referências visuais** com as imagens do anime em duotone de mangá.
- **Bankai mais forte:** onda de choque, um Getsuga Tenshō atravessando a tela e aviso "卍解 · Bankai ativado".
- **Novas animações de rolagem:**
  - katana de progresso na lateral (computador): a lâmina sai da bainha conforme a leitura avança;
  - títulos revelados por um corte vermelho;
  - a espada do hero gira com a rolagem;
  - a faixa de referências inclina com a velocidade;
  - os números contam ao aparecer.
- **Animações de botões:** brilho de lâmina no hover, reiatsu pulsando no botão principal e onda de reiatsu no clique.
- **Segurança:**
  - GSAP, ScrollTrigger e Lenis hospedados no próprio site (`lib/`), sem scripts de terceiros;
  - política de segurança de conteúdo (CSP) com hash do único script inline;
  - links externos com `noopener noreferrer`;
  - links do `CONFIG` validados (só `https://`);
  - `referrer` restrito;
  - `.well-known/security.txt`.

## Arquivos

| Arquivo / pasta | O que é |
| --- | --- |
| `index.html` | A página (estrutura e textos em português) |
| `404.html` | Página de erro no mesmo tema: “Esta página foi cortada” |
| `css/style.css` | Todo o visual: cores, fontes, layout e animações em CSS |
| `js/dados.js` | **O que você edita:** `CONFIG`, os 5 estudos de caso, os 19 repositórios, o mapa de habilidades e os textos em inglês |
| `js/app.js` | O funcionamento (sem módulos, para abrir com dois cliques) |
| `lib/` | GSAP 3.12.5, ScrollTrigger e Lenis 1.1.13 hospedados no próprio site |
| `assets/referencias/` | As 5 imagens de referência de Bleach usadas na faixa de referências |
| `.well-known/security.txt` | Onde relatar falhas de segurança |
| `assets/projetos/` | Capturas reais dos 5 projetos (computador, celular e mais abaixo na página) e prévias em vídeo de 6 s |
| `assets/arte/` | Ensō, tinta e pincel pré-desenhados (leves e rápidos) |
| `assets/bleach/` | Lugar das imagens do anime, opcional (veja o `LEIA-ME.md` de lá) |
| `assets/og.png` | Imagem de compartilhamento 1200×630 (LinkedIn, WhatsApp) |
| `ferramentas/` | `imagens.mjs` (converte as imagens do anime) e `cabecalho.mjs` (fontes e CSP, veja abaixo) |
| `PROMPT.md` | O prompt da versão 3.0, para reusar em qualquer IA |
| `IDENTIDADE.md` | Guia da identidade visual |
| `sitemap.xml`, `robots.txt` | Para o Google encontrar o site |

## O que tem na página

- **Abertura**: a tela se parte num corte vermelho com 斬 (uma vez por sessão).
- **Hero como pôster**: nome que sobe letra por letra, paralaxe em camadas, ensō que gira com a rolagem, coluna japonesa com selo e 3 números com contagem.
- **Ficha para recrutadores** com o botão **Copiar resumo** (texto pronto para colar no e-mail ou no ATS).
- **Faixa de tinta**: um pincel revela a cena e o papel sobe até virar a página de mangá.
- **Os 5 melhores projetos como página de mangá** (direita para a esquerda), com **captura real** de cada site, **prévia em vídeo** ao passar o mouse e **estudo de caso** com galeria, decisões técnicas e botões anterior/próximo. Cada caso tem link direto: `#caso-figaros`, `#caso-sao-cristovao`, `#caso-smartech`, `#caso-ingrid`, `#caso-cs-store`.
- **Arquivo com os 19 repositórios**: barra de linguagens, filtros, busca, ordenação, lista ou grade e links “Ao vivo” e “Código”. No ar, busca repositórios novos na API do GitHub (com cache de 1 hora).
- **Trajetória** com a lâmina vermelha que desce, marcos que acendem e o horizonte preso ao lado.
- **Habilidades com prova** e **mapa de habilidades**: passe o mouse numa habilidade e os projetos que a usam acendem.
- **Método**, **formação** e **contato** com a tropa ao fundo, botões a partir do `CONFIG` e **formulário**.
- **PT/EN**: botão “EN” na barra (ou `?lang=en` no link).
- **Modo Bankai**: botão ou tecla **B**.
- **Paleta de comandos**: **Ctrl K** (ou ⌘K no Mac). **/** vai direto para a busca do arquivo.
- **Celular**: menu em tela cheia com os kanji de cada seção.

## 1. Abrir no seu computador

1. Baixe o projeto (no GitHub: **Code → Download ZIP**, ou `git clone`).
2. Dê dois cliques no `index.html`.

## 2. Preencher seus dados (importante!)

Abra `js/dados.js` em qualquer editor (VS Code, Bloco de Notas) e procure `var CONFIG`:

```js
var CONFIG = {
  github: "carlosserra-a11y",
  repoDoSite: "leadpagecarlos",
  email: "",          // → botão "Copiar e-mail" e envio do formulário
  linkedin: "",       // ex.: "https://www.linkedin.com/in/seu-perfil"
  whatsapp: "5548996170281",  // só números com DDI e DDD
  telefone: "(48) 99617-0281", // como o número aparece escrito
  curriculo: "",      // link do PDF → botão "Currículo" na barra e no contato
  foto: "",           // ex.: "assets/foto.jpg" → entra na ficha no lugar do "CS"
  formspree: "",      // código do formspree.io → o formulário envia direto
  goatcounter: "",    // código do goatcounter.com → contador de visitas sem cookies
  imagensOficiais: false,
  buscarRepos: true,
  idioma: "pt"
};
```

**Campo vazio some da página.** Campo preenchido aparece sozinho.

- **Formulário**: sem `formspree` e sem `email`, ele fica escondido. Só com `email`, abre o aplicativo de e-mail com a mensagem pronta. Com `formspree` (crie grátis em formspree.io e copie o código depois de `/f/`), envia direto e mostra “Mensagem enviada”.
- **Contador de visitas**: crie uma conta grátis no goatcounter.com e coloque o código (o nome antes de `.goatcounter.com`).

## 3. Publicar no GitHub Pages

Este projeto já está no repositório `leadpagecarlos`. Para conferir ou ligar o site:

1. No GitHub, abra o repositório → **Settings → Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch → main → / (root)** e salve.
3. Em 1 ou 2 minutos o site fica no ar em **https://carlosserra-a11y.github.io/leadpagecarlos/**.

Coloque esse link no LinkedIn, no currículo e na bio do GitHub.

## 4. Editar projetos e textos

Tudo em `js/dados.js`:

- **Estudos de caso:** `var CASES`. `ctx` é o contexto, `did` o que você construiu e `dec` as decisões técnicas. A tradução fica em `en:{...}`.
- **Lista completa:** `var REPOS`. Cada linha é um repositório (`c` é a categoria: `sistema`, `negocio`, `fmp` ou `inicio`; `de` é a descrição em inglês).
- **Mapa de habilidades:** `var SKILLS` e `var SKILL_PROJECTS`.
- **Textos em inglês:** `var EN` (o português está no próprio `index.html`).

**Depois de mudar textos ou o script do `<head>`, rode `node ferramentas/cabecalho.mjs`.** Ele:

- monta as fontes japonesas só com os caracteres usados (o site carrega rápido);
- recalcula o hash da política de segurança (CSP). Sem isso, um kanji novo pode aparecer em outra fonte, e um script do `<head>` alterado seria bloqueado pelo navegador.

## 5. Imagens do anime (opcional)

O site já vem completo com tudo desenhado em código. Para usar as 5 imagens de referência como cenas com paralaxe,
siga o `assets/bleach/LEIA-ME.md` (salvar as imagens, rodar `npm run imagens` na pasta `ferramentas` e mudar `imagensOficiais` para `true`).
O crédito no rodapé muda sozinho.

## O que foi testado (versão 4.0)

- Larguras **375, 768, 1280 e 1440 px**: sem rolagem horizontal e sem erros no console.
- Abrindo com dois cliques (`file://`), com a CSP ligada: tudo funciona, inclusive as animações.
- **Teclado:** Bankai (B), paleta (Ctrl K), busca (/), estudo de caso (setas e Esc devolvendo o foco).
- **Navegação:** link direto `#caso-ingrid`, menu do celular, barra fixa do celular aparecendo depois do hero.
- **Idioma:** inglês completo.
- **Sem animação:** "reduzir movimento" e sem JavaScript (o conteúdo, o WhatsApp e o GitHub continuam funcionando).
- **Lighthouse** (servidor local, sem HTTPS e sem compressão):
  - computador: desempenho 92, acessibilidade 100, SEO 100, CLS 0,003;
  - celular: acessibilidade 100 e SEO 100. O desempenho variou bastante no dia do teste: a versão 3.0, medida nas mesmas condições, também caiu de 87–90 para 60–62, e a 4.0 ficou em 55–58.
  - A nota de boas práticas só perde pontos por falta de HTTPS, que o GitHub Pages já oferece.

## Checklist antes de mandar para empresas

- [x] WhatsApp e GitHub no site
- [ ] Preencher `email` e `linkedin` no `CONFIG` (e `curriculo`, se tiver o PDF)
- [ ] Colocar uma foto profissional (`foto` no `CONFIG`)
- [ ] Conferir se o nome “Carlos Serra” está certo (e o sobrenome completo, se quiser)
- [ ] Ligar o GitHub Pages e testar no celular
- [ ] Colocar uma descrição em cada repositório do GitHub
- [ ] Fixar os 5 projetos em destaque no seu perfil do GitHub (**Customize your pins**)
- [ ] Criar o README de perfil (repositório `carlosserra-a11y/carlosserra-a11y`) com o link do portfólio
