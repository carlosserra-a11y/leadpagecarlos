# Prompt completo · LeadPage do Carlos Serra (versão 3.0)

Prompt para recriar e melhorar todo o projeto em qualquer IA de código (Claude, Lovable, v0, Cursor, Bolt).

> Esta pasta já é a versão 3.0 construída a partir deste prompt. Diferenças conscientes: os scripts são clássicos (não módulos ES)
> para o site abrir com dois cliques no `index.html`; o atalho `/` vai para a busca do arquivo e a paleta abre com Ctrl K.
Copie tudo o que está dentro do bloco abaixo. Antes, coloque as imagens na pasta `assets/bleach/`
com os nomes da tabela "IMAGENS" do prompt.

---

```text
############################################################################
#  LEADPAGE · CARLOS SERRA · VERSÃO 3.0
############################################################################

PAPEL
Você é um diretor de arte e desenvolvedor front-end sênior, especialista em portfólios de
desenvolvedores que viram entrevista de emprego e em sites com narrativa de rolagem (scrollytelling)
de nível Awwwards. Escreva todo o texto em português do Brasil, direto e em voz ativa.

OBJETIVO
Criar a versão 3.0 da landing page de portfólio de Carlos Serra, desenvolvedor full stack júnior de
Palhoça/SC. Ela tem um só trabalho: em 30 segundos um recrutador entende quem ele é, vê provas do
que ele sabe fazer e entra em contato. A estética de anime chama atenção; o conteúdo convence.

PÚBLICO
1. Recrutadores de RH: leem rápido, procuram disponibilidade, stack e contato.
2. Tech leads: abrem o código e querem ver decisões técnicas, testes e qualidade.
3. Pequenos negócios da Grande Florianópolis: querem ver sites que vendem.

============================================================================
1. DADOS REAIS (use exatamente estes; não invente números)
============================================================================
PERFIL
- Nome: Carlos Serra · 24 anos · Palhoça/SC · GitHub: github.com/carlosserra-a11y
- Função: Desenvolvedor Full Stack Júnior · Status: disponível para estágio ou vaga júnior
  (presencial, híbrido ou remoto)
- Formação: Análise e Desenvolvimento de Sistemas, FMP (Faculdade Municipal de Palhoça), 2ª fase
- Stack: HTML, CSS, JavaScript, TypeScript, React 19, Vite, Tailwind 4, Node.js, Express 5, SQLite,
  three.js, WebGL/GLSL, GSAP + ScrollTrigger, Lenis, Google Gemini API, node:test
- Contatos num objeto CONFIG no topo do script: email, linkedin, whatsapp, curriculo (PDF), foto.
  Campo vazio some da página.

NÚMEROS (todos verificáveis no GitHub)
- 19 repositórios públicos · 18 publicados no GitHub Pages
- 47 dias do primeiro commit (20/08/2026) ao primeiro sistema com banco de dados (06/10/2026)
- 15 arquivos de testes automatizados · 5 negócios reais da região com site feito por ele
- 3 versões do mesmo site, cada uma melhor que a anterior (Smartech 1 → 3)
- Linguagem principal por repositório: HTML 11 · JavaScript 5 · TypeScript 2 · sem código 1

OS 5 MELHORES REPOSITÓRIOS (estudos de caso)
1. Figaro's Pizzaria 2.0 (repo Figarus-2.0) · Pizzaria · Palhoça/SC · Full stack · kanji 炎
   Contexto: 57 sabores salgados, 14 doces, combos; pedidos bagunçados no WhatsApp; dono sem painel.
   Construí: montador de pizza (até 3 sabores, pizza desenhada em fatias); checkout com CEP, taxa por
   bairro e resumo no WhatsApp; Express + SQLite com histórico de pedidos e de mudanças no cardápio;
   painel do desenvolvedor com aviso sonoro de pedido; pizza 3D em código que se abre em leque.
   Decisões: senha em scrypt + código de primeiro acesso; preço de vários sabores pela média
   (configurável); um único laço de animação que dorme, com queda para 2D; testes de API e preço.
   Stack: Node.js, Express 5, SQLite, three.js, Lenis, node:test
2. São Cristóvão 3.0 (repo sao-cristovao-3.0) · Hamburgueria · Palhoça/SC · React + TS · kanji 層
   Balão de fala: "Quero 2 Cristóvão Bacon e uma Coca"
   Contexto: loja vende pelo iFood; cliente se perdia sem saber o que pedir para quantas pessoas.
   Construí: burger que se desmonta com a rolagem (sequência de quadros em canvas, funciona no
   iPhone); cardápio em abas e filtro "para quantas pessoas"; atendente de IA que monta o carrinho;
   carrinho que vira resumo copiável para o iFood.
   Decisões: iFood não aceita carrinho externo, por isso o resumo; o site não coleta dados pessoais
   (LGPD); link do iFood validado; Gemini com chave, atendente local sem servidor; 10 arquivos de teste.
   Stack: React 19, TypeScript, Vite 8, Tailwind 4, Express, Gemini
3. Smartech 3.0 (repo smartech-3.0) · Coifas industriais UV-C · Florianópolis · 3D + IA · kanji 光
   Contexto: produto técnico difícil de explicar; cliente precisa calcular vazão antes do orçamento.
   Construí: showroom 3D com Raio-X, cortes, hotspots e fichas técnicas; calculadora NBR 14518
   (vazão, duto, exaustor, lâmpadas); guia em áudio (Gemini TTS); consultor técnico com IA.
   Decisões: materiais já transparentes para o Raio-X não recompilar shader; ordem de renderização
   fixa; CDN com versão fixa e SRI; regras da calculadora em funções puras com testes.
   Stack: three.js, GSAP, Gemini API, JavaScript, node:test
4. Ingrid Lima (repo ingrid-market) · Vídeomaker mobile e social media · WebGL · kanji 眼
   Contexto: precisava de um site que chamasse atenção e levasse ao WhatsApp.
   Construí: olho realista só com shader, sem imagem; segue o mouse, pisca, cochila; mergulho na
   pupila com visor de câmera; portfólio com 9 vídeos verticais.
   Decisões: vídeos sob demanda (máx. 2 tocando) e economia de dados; WebGL adaptativo que pausa fora
   da tela; olho em CSS como plano B; testado em 375, 961 e 1440 px.
   Stack: WebGL, GLSL, GSAP 3.13, JavaScript, sem build
5. CS Store (repo csiphone) · Loja de iPhones · Palhoça/SC · Tailwind · kanji 店
   Construí: showroom 3D, catálogo, calculadora de troca (Trade-In), loja física, avaliações e FAQ.
   Stack: HTML, Tailwind CSS, JavaScript

ARQUIVO COMPLETO (19 repositórios; link "Ao vivo" = https://carlosserra-a11y.github.io/<repo>/)
Sistemas completos: Figarus-2.0, sao-cristovao-3.0, s-o-cristovao, Figaros-Pizzaria
Sites para negócios: ingrid-market, smartech-3.0, smartech-2.0, smartech, csiphone
Faculdade: Exercício 1 (apresentação pessoal com vídeo), Exercício 2 (Conheça Florianópolis),
  Exercício 3 (página temática Jujutsu Kaisen), Trabalho-web
Primeiros passos: pizzaria (Pizzaria do Michelangelo), paginacomimagem, meu-primeiro-site
  (descrição "boa sorte carlos"), hello-word-versao-2 (Alunos de ADS), curriculumprogramador,
  Curriculum-programador (vazio, sem link ao vivo)

TRAJETÓRIA
20 ago primeiro commit · 27 ago várias páginas · 03 set primeiro site de negócio · 17 set exercícios
da FMP · 01 out CS Store · 05–07 out Smartech 1→3 · 06 out Figaro's full stack · 11 out São
Cristóvão 3.0 em TypeScript · 16 out shader WebGL da Ingrid

============================================================================
2. IDENTIDADE VISUAL · "Bleach: Thousand-Year Blood War"
============================================================================
DOIS LADOS
- Quincy (padrão): azul-noite e branco frio dos uniformes do Wandenreich.
- Shinigami (modo Bankai, botão e tecla B): preto e vermelho.
Proporção: 70% preto/azul-noite · 20% branco frio · 10% vermelho (só onde há "corte" ou ação).

TOKENS DE COR
--void #05060a · --night #0b0e1c · --night-2 #121733 · --night-3 #1a2146 · --line #232a47
--snow #eef2fb · --frost #a3b4d8 · --blood #e3132f · --rim #ff3b5c · --paper #f2efe6 · --sumi #0b0b0d
Modo Bankai redefine os tokens para tons de vermelho escuro (#0d0507, #1a080c, #3a141c).

TIPOGRAFIA (Google Fonts)
Big Shoulders Display 900 (títulos em caixa alta) · Shippori Mincho B1 (subtítulos e japonês) ·
Yuji Syuku (kanji em pincel) · Zen Kaku Gothic New (texto) · IBM Plex Mono (rótulos e números)

GRAFISMOS
- Cartão de título em cada seção: kanji em pincel na vertical + título + corte vermelho.
  斬 corte (hero) · 要 essencial · 記録 registro · 書庫 arquivo · 道 caminho · 技 técnica · 型 forma ·
  学 estudo · 縁 laço
- Selo vermelho (hanko) com 斬 como logo.
- Ensō com texto em órbita que gira com a rolagem.
- Coluna japonesa vertical com selo: 「千年の時を超え、コードで斬る。」
- Retícula (halftone), linhas de velocidade, balões de fala, bordas de quadro inclinadas.
- Grão de papel sobre a página inteira (SVG feTurbulence, opacidade 6%).

============================================================================
3. IMAGENS (as referências do anime, usadas como cenas com paralaxe)
============================================================================
Coloque em assets/bleach/. Use versões grandes (mínimo 1920 px no lado maior), converta para
AVIF + WebP com JPG de reserva e gere 3 tamanhos (640, 1280, 1920) para srcset.

| Arquivo                     | Imagem                                                   | Onde entra |
|-----------------------------|----------------------------------------------------------|------------|
| poster-noite.webp           | Pôster azul-noite, Quincy de branco com contorno magenta  | Hero (modo Quincy) |
| poster-sangue.webp          | Pôster preto e vermelho com coluna de texto vertical       | Hero (modo Bankai) |
| manga-tinta.webp            | Quadro do mangá em preto e branco, tinta pesada            | Transição para a página de mangá e fundo do diálogo |
| yhwach-horizonte.webp       | Líder do Wandenreich com céu de faixa vermelha             | Trajetória (cena presa na tela) |
| wandenreich-exercito.webp   | Exército de uniformes brancos em azul frio                 | Contato |

COMO USAR CADA UMA
a) Hero · poster-noite (padrão) e poster-sangue (Bankai)
   - Imagem em tela cheia atrás do conteúdo, com object-fit: cover e foco à direita, para o texto
     ficar à esquerda sobre um degradê escuro (90deg, #05060a 0% → transparente 65%).
   - Paralaxe em 3 profundidades a partir da MESMA imagem: camada de fundo (imagem inteira, desfoque
     de 2px, sobe 15% da rolagem), camada do meio (mesma imagem recortada com máscara radial nos
     personagens, sobe 30%) e camada da frente (partículas e tinta, sobe 60%). O mouse move as camadas
     em sentidos opostos (máx. 24 px).
   - Ao rolar, a imagem dá zoom de 1.0 a 1.15 e escurece até 60%.
   - Modo Bankai: troca para poster-sangue com um corte diagonal vermelho (clip-path em 0,6 s),
     clarão com 卍解 e tela tremendo.
   - Na abertura, a imagem entra de 1.25 a 1.0 de escala enquanto a tela se parte no corte vermelho.
b) Transição para os projetos · manga-tinta
   - Faixa de largura total entre o resumo (escuro) e a página de mangá (papel). Ao rolar, a imagem
     é revelada por uma máscara de pincel (SVG que cresce com a rolagem) e se transforma em tinta
     chapada que "pinta" a tela até virar o papel da seção seguinte.
   - Também aparece com 8% de opacidade e mix-blend-mode: multiply no fundo do diálogo do caso.
c) Trajetória · yhwach-horizonte
   - Seção com a imagem presa na tela (position: sticky) à direita no computador; os marcos da
     linha do tempo rolam à esquerda. Conforme a lâmina vermelha desce, a imagem faz zoom lento
     (Ken Burns de 1.0 a 1.2) e a faixa vermelha do céu ganha brilho.
   - No celular, a imagem vira uma faixa de 40vh no topo da seção, com paralaxe vertical simples.
d) Contato · wandenreich-exercito
   - Fundo da seção de contato, tingido de azul frio (filtro duotone #05060a → #a3b4d8), com o
     título "Vamos construir juntos?" por cima. A imagem desliza na horizontal com a rolagem
     (de -5% a 5%), como uma câmera passando pela tropa. No modo Bankai, o duotone vira vermelho.

REGRAS PARA AS IMAGENS
- Todas com alt descritivo em português; decorativas com alt="" e aria-hidden.
- Carregamento: a do hero com fetchpriority="high"; as outras com loading="lazy" e decoding="async".
- Placeholder borrado (LQIP de 24 px em base64) enquanto a imagem carrega.
- Uma chave CONFIG.imagensOficiais (true/false). Com false, o site usa a versão desenhada em código
  (cidade de torres em SVG, lua, ensō, tinta) e nenhuma imagem do anime é carregada.
- Crédito no rodapé: "Imagens de Bleach: Thousand-Year Blood War © Tite Kubo/Shueisha, TV TOKYO,
  dentsu, Pierrot. Fan art sem fins comerciais e sem vínculo com os detentores dos direitos."
- Peso total das imagens abaixo de 1,2 MB na primeira visita.

============================================================================
4. MELHORIAS EM TODAS AS INTERFACES
============================================================================
NAVEGAÇÃO
- Barra fixa que some ao rolar para baixo e volta ao rolar para cima; indicador vermelho que desliza
  até a seção ativa.
- Celular: menu em tela cheia com os kanji de cada seção, abrindo com um corte diagonal.
- Botões: Bankai (tecla B), PT/EN (tradução completa em um objeto de textos) e "Currículo".
- Paleta de comandos (Ctrl+K ou /): ir para seção, abrir projeto, copiar e-mail, alternar Bankai.

HERO
- Selo "Disponível para estágio ou vaga júnior" com ponto verde pulsando.
- Nome gigante dividido em letras que sobem uma a uma; corte vermelho atravessa o nome.
- Frase de valor, 3 botões magnéticos (Ver projetos, Falar comigo, GitHub) e 3 números com
  contagem animada.
- Indicador "Role" e coluna japonesa vertical com selo.

FICHA PARA RECRUTADORES (resumo de 30 s)
- Ficha de identificação com foto (linha de scanner passando), nome, idade, função, base, formação e
  status.
- Quatro blocos: quem sou, o que entrego, stack, o que procuro.
- Botão "Copiar resumo" que copia um texto pronto para colar no ATS ou no e-mail.
- Faixa com os 4 números principais.

PÁGINA DE MANGÁ (os 5 melhores repositórios)
- Quadros com bordas inclinadas, lidos da direita para a esquerda, com o número do quadro.
- Cada quadro mostra uma captura de tela real do projeto (gere com Playwright a partir do link ao
  vivo, 1280×800, em WebP) dentro de uma moldura de mangá com retícula, e o kanji do projeto por cima.
- Ao passar o mouse: linhas de velocidade seguem o cursor, a captura dá zoom leve e toca uma prévia
  em vídeo sem som (MP4 de 6 s, carregado só no hover).
- Ao entrar na tela, cada quadro é "entintado" (faixa preta passa por cima) na ordem de leitura; o
  balão de fala salta.
- Botão "Estudo de caso" abre um diálogo com: contexto, o que construí, decisões técnicas, stack,
  links, galeria de capturas e botões "anterior/próximo". Cada caso tem link direto (#caso-figaros).

ARQUIVO (19 repositórios)
- Barra de linguagens por repositório.
- Filtros por categoria, busca (atalho /), ordenação (mais recentes, nome, categoria) e alternância
  lista/grade.
- Selos DESTAQUE e NOVO; links "Ao vivo" e "Código".
- Quando publicado, busca repositórios novos na API do GitHub e os adiciona com o selo NOVO
  (com cache de 1 hora no localStorage dentro de try/catch).
- Estado vazio útil: "Nenhum projeto para 'x'. Tente react, 3D ou pizza."

TRAJETÓRIA
- Linha do tempo com lâmina vermelha que desce com a rolagem e a imagem yhwach-horizonte presa ao
  lado (ver seção 3c). Cada marco acende quando a lâmina passa por ele.

HABILIDADES COM PROVA
- Cartões por área (front-end, back-end, 3D e animação, IA, qualidade, ferramentas) com inclinação
  3D e brilho que segue o mouse.
- Mapa interativo: passar o mouse numa habilidade acende os projetos que a usam.
- Nada de barras de porcentagem.

MÉTODO E FORMAÇÃO
- 4 passos (entender o negócio, desenhar, construir com testes, publicar e melhorar) com barras que
  se desenham na rolagem.
- Cartão da graduação com barra de progresso do curso (2ª fase) e lista do que está estudando.

CONTATO
- Fundo wandenreich-exercito (ver seção 3d), título gigante com contorno.
- Copiar e-mail (navigator.clipboard com reserva de seleção), LinkedIn, WhatsApp e currículo em PDF.
- Formulário curto (nome, e-mail, mensagem) enviado pelo Formspree, com validação, mensagens de erro
  ligadas aos campos (aria-describedby) e confirmação "Mensagem enviada".

GLOBAL
- Rolagem suave com Lenis integrada ao ScrollTrigger; barra de progresso de leitura no topo.
- Cursor de reiatsu (só em mouse), botões magnéticos, títulos que se decodificam em katakana.
- "Licht Regen": flechas de luz caindo em canvas (modo Quincy) e reiatsu vermelho subindo (Bankai),
  máximo de 80 partículas, densidade de pixels limitada a 2, pausa com a aba escondida.
- Página 404 no mesmo tema ("Esta página foi cortada") e favicon com o selo 斬.
- Imagem de compartilhamento (og.png 1200×630) com o nome, o selo e o fundo do hero.
- Contador de visitas sem cookies (GoatCounter).

============================================================================
5. QUALIDADE OBRIGATÓRIA
============================================================================
- Estrutura: index.html, 404.html, assets/bleach/, assets/projetos/, css/, js/ (módulos ES),
  sem etapa de build, pronto para GitHub Pages.
- Bibliotecas de CDN com versão fixa: gsap 3.12.5 + ScrollTrigger, lenis 1.1.13.
- Tudo começa visível: as animações só refinam. Sem JavaScript, sem as bibliotecas ou com
  prefers-reduced-motion, a página fica completa e parada (sem paralaxe, sem cursor, sem partículas).
- Acessibilidade: HTML semântico, "Pular para o conteúdo", foco visível, ordem de títulos correta,
  contraste AA, diálogo com <dialog> e foco devolvido ao botão.
- Responsivo de 360 a 1920 px, sem rolagem horizontal; testado em 375, 768, 1280 e 1440 px.
- Desempenho: Lighthouse 90+ em todas as categorias no celular; LCP < 2,5 s; CLS < 0,05.
- SEO: title, description, Open Graph, Twitter Card, JSON-LD Person, sitemap.xml e robots.txt.
- Texto sem clichês ("apaixonado por tecnologia") e sem números inventados.

ENTREGA
Todos os arquivos do site, um README com como publicar no GitHub Pages e como editar o CONFIG e os
projetos, e uma lista do que foi testado.
```

---

## Checklist para usar o prompt

1. Baixe as 5 imagens em alta resolução (mínimo 1920 px) e salve em `assets/bleach/` com os nomes da tabela.
2. Preencha e-mail, LinkedIn, WhatsApp, currículo e foto no `CONFIG`.
3. Cole o prompt na IA e peça uma seção por vez se a resposta ficar cortada.
4. Publique no GitHub Pages e teste no celular antes de mandar para empresas.
