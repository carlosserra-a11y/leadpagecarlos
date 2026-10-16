# 斬 Portfólio · Carlos Serra · versão 3.0

Landing page de portfólio do Carlos Serra, desenvolvedor full stack júnior em Palhoça/SC (ADS · FMP · 2ª fase).
Tema inspirado em *Bleach: Thousand-Year Blood War* (fan art, sem vínculo com os detentores dos direitos).

**No ar:** https://carlosserra-a11y.github.io/leadpagecarlos/
**Código:** https://github.com/carlosserra-a11y/leadpagecarlos

Não precisa instalar nada: dá dois cliques no `index.html` e abre.

## Arquivos

| Arquivo / pasta | O que é |
| --- | --- |
| `index.html` | A página (estrutura e textos em português) |
| `404.html` | Página de erro no mesmo tema: “Esta página foi cortada” |
| `css/style.css` | Todo o visual: cores, fontes, layout e animações em CSS |
| `js/dados.js` | **O que você edita:** `CONFIG`, os 5 estudos de caso, os 19 repositórios, o mapa de habilidades e os textos em inglês |
| `js/app.js` | O funcionamento (sem módulos, para abrir com dois cliques) |
| `assets/projetos/` | Capturas reais dos 5 projetos (computador, celular e mais abaixo na página) e prévias em vídeo de 6 s |
| `assets/arte/` | Ensō, tinta e pincel pré-desenhados (leves e rápidos) |
| `assets/bleach/` | Lugar das imagens do anime, opcional (veja o `LEIA-ME.md` de lá) |
| `assets/og.png` | Imagem de compartilhamento 1200×630 (LinkedIn, WhatsApp) |
| `ferramentas/` | Script que converte as imagens do anime para AVIF, WebP e JPG |
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
  whatsapp: "",       // só números com DDI e DDD, ex.: "5548999999999"
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

Se escrever **kanji ou kana novos**, acrescente-os ao parâmetro `text=` da fonte japonesa no `<head>` do `index.html`
(a fonte vem só com os caracteres usados, para o site carregar rápido).

## 5. Imagens do anime (opcional)

O site já vem completo com tudo desenhado em código. Para usar as 5 imagens de referência como cenas com paralaxe,
siga o `assets/bleach/LEIA-ME.md` (salvar as imagens, rodar `npm run imagens` na pasta `ferramentas` e mudar `imagensOficiais` para `true`).
O crédito no rodapé muda sozinho.

## O que foi testado

- Larguras **375, 768, 1280 e 1440 px**: sem rolagem horizontal e sem erros no console.
- **Teclado**: Bankai (B), paleta (Ctrl K, setas, Enter, Esc), busca (/), estudo de caso (setas ← → e Esc devolvendo o foco ao botão).
- **Link direto** `#caso-ingrid` abre o estudo de caso certo; menu do celular abre, trava o fundo e leva à seção.
- **Inglês**: título, textos, filtros, datas e estudos de caso trocam juntos.
- **Reduzir movimento**: sem abertura, sem paralaxe, sem partículas, página completa e parada. **Sem JavaScript**: todo o conteúdo aparece.
- **Imagens oficiais** (com imagens de teste): pôster do hero, troca no Bankai, faixa de tinta, horizonte e contato. A primeira visita baixa só o pôster do hero; o do Bankai só carrega quando o modo é ligado.
- **Lighthouse** (servidor local, sem compressão nem HTTPS): celular desempenho 87–90, acessibilidade 100, SEO 100, LCP ≈ 2,4 s, CLS ≈ 0; computador desempenho 99.
  No GitHub Pages (com HTTPS e compressão) a nota de boas práticas deve subir, porque aqui ela só perdeu pontos por falta de HTTPS.

## Checklist antes de mandar para empresas

- [ ] Preencher `email` e `linkedin` no `CONFIG` (e `curriculo`, se tiver o PDF)
- [ ] Colocar uma foto profissional (`foto` no `CONFIG`)
- [ ] Conferir se o nome “Carlos Serra” está certo (e o sobrenome completo, se quiser)
- [ ] Ligar o GitHub Pages e testar no celular
- [ ] Colocar uma descrição em cada repositório do GitHub
- [ ] Fixar os 5 projetos em destaque no seu perfil do GitHub (**Customize your pins**)
- [ ] Criar o README de perfil (repositório `carlosserra-a11y/carlosserra-a11y`) com o link do portfólio
