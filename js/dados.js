/* =========================================================================
   DADOS DO PORTFÓLIO · edite aqui. O resto do site se monta sozinho.
   ========================================================================= */

/* ----- CONFIGURAÇÃO: campos vazios somem da página ----- */
var CONFIG = {
  github: "carlosserra-a11y",
  repoDoSite: "leadpagecarlos", // repositório deste portfólio: não aparece como "NOVO" no arquivo
  email: "",            // ex.: "seuemail@gmail.com"   → botão "Copiar e-mail" e envio do formulário por e-mail
  linkedin: "",         // ex.: "https://www.linkedin.com/in/seu-perfil"
  whatsapp: "",         // só números com DDI e DDD, ex.: "5548999999999"
  curriculo: "",        // link do PDF do currículo → botão "Currículo" na barra e no contato
  foto: "",             // ex.: "assets/foto.jpg" → entra na ficha no lugar do "CS"
  formspree: "",        // código do formulário do formspree.io, ex.: "xyzabcd" → formulário envia direto
  goatcounter: "",      // código do goatcounter.com, ex.: "carlosserra" → contador de visitas sem cookies
  imagensOficiais: false, // true = usa as imagens do anime da pasta assets/bleach/ (veja o LEIA-ME de lá)
  buscarRepos: true,    // com o site no ar, busca repositórios novos na API do GitHub
  idioma: "pt"          // idioma inicial: "pt" ou "en"
};

/* ----- Os 5 melhores repositórios (estudos de caso) -----
   slug = id do link direto (#caso-slug) e nome das capturas em assets/projetos/ */
var CASES = [
  { slug:"figaros", k:"炎", ink:true, name:"Figaro's Pizzaria 2.0", repo:"Figarus-2.0", shot:"figarus",
    client:"Pizzaria · Palhoça/SC", tag:"Full stack",
    pitch:"Cardápio enorme e pedidos bagunçados no WhatsApp viraram um site com montador de pizza, checkout por CEP, banco de dados e painel do dono.",
    stack:["Node.js","Express 5","SQLite","three.js","Lenis","node:test"],
    ctx:"A Figaro's tem 57 sabores salgados, 14 pizzas doces, calzones, lasanhas, esfihas e combos. Os pedidos chegavam por WhatsApp, sem padrão, e o dono não tinha onde mudar preço ou horário.",
    did:["Montador de pizza: tamanho, até 3 sabores com a pizza desenhada em fatias, borda e observações","Checkout com busca de endereço pelo CEP, taxa por bairro, troco e resumo enviado ao WhatsApp da loja","Servidor Express + SQLite com o histórico de todos os pedidos e de todas as mudanças no cardápio","Painel do desenvolvedor para cadastrar sabores, mudar preços e horários e ver os pedidos chegando com aviso sonoro","Pizza 3D feita em código (three.js): as fatias caem no lugar e se abrem em leque com a rolagem"],
    dec:["Senha guardada com scrypt e código de configuração no primeiro acesso, para ninguém criar a conta antes do dono","Preço de pizza com vários sabores pela média dos sabores, numa regra configurável","Um único laço de animação que dorme quando nada se mexe; sem WebGL ou com “reduzir movimento”, cai sozinho para 2D","Testes da API e das regras de preço com node:test"],
    en:{ client:"Pizzeria · Palhoça, Brazil", tag:"Full stack",
      pitch:"A huge menu and messy WhatsApp orders became a site with a pizza builder, ZIP-code checkout, a database and an owner dashboard.",
      ctx:"Figaro's has 57 savory flavors, 14 sweet pizzas, calzones, lasagnas, esfihas and combos. Orders arrived on WhatsApp with no standard, and the owner had nowhere to change prices or opening hours.",
      did:["Pizza builder: size, up to 3 flavors drawn as slices, crust and notes","Checkout with address lookup by ZIP code, delivery fee per neighborhood, change and a summary sent to the store's WhatsApp","Express + SQLite server keeping the history of every order and every menu change","Developer dashboard to add flavors, change prices and hours and watch orders arrive with a sound alert","3D pizza built in code (three.js): slices drop into place and fan out on scroll"],
      dec:["Password stored with scrypt and a setup code on first access, so nobody can create the account before the owner","Multi-flavor pizza price uses the average of the flavors, in a configurable rule","A single animation loop that sleeps when nothing moves; without WebGL or with “reduce motion” it falls back to 2D","API and pricing rules tested with node:test"] } },

  { slug:"sao-cristovao", k:"層", name:"São Cristóvão 3.0", repo:"sao-cristovao-3.0", shot:"saocristovao",
    bubble:"“Quero 2 Cristóvão Bacon e uma Coca”",
    client:"Hamburgueria · Palhoça/SC", tag:"React + TS",
    pitch:"Cardápio digital com burger que se desmonta na rolagem e um atendente de IA que entende o pedido escrito do jeito que o cliente fala.",
    stack:["React 19","TypeScript","Vite 8","Tailwind 4","Express","Gemini"],
    ctx:"A loja vende pelo iFood, mas o cliente se perdia entre o cardápio e o app sem saber o que pedir para quantas pessoas.",
    did:["Hero com o burger em tela cheia controlado pela rolagem (sequência de quadros em canvas, funciona no iPhone)","Cardápio em abas, filtro “para quantas pessoas” nos combos e busca com contagem por aba","Atendente que entende frases como “combo para casal”, monta o carrinho e leva ao checkout","Carrinho persistente que vira um resumo copiável para pedir no iFood"],
    dec:["O iFood não aceita carrinho vindo de outro site, então o carrinho vira resumo copiável","O site não coleta nome, telefone, endereço nem pagamento: menos risco e menos LGPD","Link do iFood validado (só https e domínios do iFood); configuração da loja num arquivo só","Com GEMINI_API_KEY quem responde é o Gemini; sem servidor, um atendente local responde sozinho","10 arquivos de testes: pedidos, horários, consentimento e headers de segurança"],
    en:{ client:"Burger joint · Palhoça, Brazil", tag:"React + TS", bubble:"“I want 2 Cristóvão Bacon and a Coke”",
      pitch:"Digital menu with a burger that comes apart on scroll and an AI assistant that understands orders written the way customers talk.",
      ctx:"The store sells through iFood, but customers got lost between the menu and the app, unsure what to order for how many people.",
      did:["Full-screen burger hero driven by scroll (canvas frame sequence, works on iPhone)","Tabbed menu, “for how many people” filter on combos and search with per-tab counts","Assistant that understands phrases like “combo for a couple”, fills the cart and goes to checkout","Persistent cart that becomes a copyable summary to order on iFood"],
      dec:["iFood doesn't accept carts from other sites, so the cart becomes a copyable summary","The site collects no name, phone, address or payment: less risk and less LGPD (Brazil's GDPR) exposure","iFood link validated (https and iFood domains only); store settings in a single file","With GEMINI_API_KEY Gemini answers; without a server, a local assistant answers on its own","10 test files: orders, opening hours, consent and security headers"] } },

  { slug:"smartech", k:"光", red:true, name:"Smartech 3.0", repo:"smartech-3.0", shot:"smartech",
    client:"Coifas industriais UV-C · Florianópolis", tag:"3D + IA",
    pitch:"Um produto técnico difícil de explicar virou um showroom 3D com Raio-X, calculadora pela norma e um consultor com IA.",
    stack:["three.js","GSAP","Gemini API","JavaScript","node:test"],
    ctx:"A Smartech fabrica coifas em inox com lâmpadas UV-C. Foto não mostra o que tem dentro, e o cliente precisa calcular vazão e exaustor antes de pedir orçamento.",
    did:["Showroom 3D com modo Raio-X, vistas em corte, hotspots clicáveis e ficha técnica de cada peça","Calculadora em tempo real pela NBR 14518: vazão, diâmetro do duto, potência do exaustor e lâmpadas UV-C","Guia em áudio sobre a física da ozonólise (Gemini TTS ou voz do navegador)","Consultor técnico com Gemini e busca do Google; sem o servidor, responde por uma base local"],
    dec:["Materiais já nascem transparentes com opacidade 1, assim a troca para Raio-X não recompila shader","Ordem de renderização fixa entre carcaça e peças internas para o Raio-X não piscar","Bibliotecas de CDN com versão fixa e verificação SRI; um único arquivo de configuração","Regras da calculadora em funções puras, com testes"],
    en:{ client:"UV-C industrial hoods · Florianópolis", tag:"3D + AI",
      pitch:"A technical product that was hard to explain became a 3D showroom with X-ray mode, a standards-based calculator and an AI consultant.",
      ctx:"Smartech builds stainless-steel kitchen hoods with UV-C lamps. Photos don't show what's inside, and customers must size airflow and exhaust fans before asking for a quote.",
      did:["3D showroom with X-ray mode, cutaway views, clickable hotspots and a spec sheet for each part","Real-time calculator following NBR 14518: airflow, duct diameter, fan power and UV-C lamps","Audio guide on the physics of ozonolysis (Gemini TTS or the browser's voice)","Technical consultant with Gemini and Google Search; without the server it answers from a local knowledge base"],
      dec:["Materials start transparent with opacity 1, so switching to X-ray doesn't recompile shaders","Fixed render order between the housing and inner parts so the X-ray doesn't flicker","CDN libraries pinned to exact versions with SRI checks; a single config file","Calculator rules as pure functions, with tests"] } },

  { slug:"ingrid", k:"眼", ink:true, name:"Ingrid Lima", repo:"ingrid-market", shot:"ingrid",
    client:"Vídeomaker mobile e social media", tag:"WebGL",
    pitch:"Landing page cujo herói é um olho realista feito só com shader: segue o mouse, pisca e guia a rolagem até o WhatsApp.",
    stack:["WebGL","GLSL","GSAP 3.13","JavaScript","Sem build"],
    ctx:"Uma profissional de vídeo precisava de um site que chamasse atenção logo de cara e transformasse visita em contato no WhatsApp.",
    did:["Olho realista desenhado inteiramente em WebGL: íris com fibras, pele com relevo e delineado, sem nenhuma imagem","Segue o mouse e o dedo, pisca sozinho, reage ao clique e cochila quando ninguém mexe","Mergulho guiado pela rolagem com visor de câmera (REC, cronômetro e foco) dentro da pupila","Portfólio com 9 vídeos verticais e player em tela cheia"],
    dec:["Vídeos só carregam quando aparecem, no máximo 2 tocam juntos e respeitam a economia de dados","O WebGL limita a densidade de pixels, reduz a resolução se o aparelho não acompanhar e pausa fora da tela","Sem WebGL entra um olho feito em CSS, no mesmo estilo","Testado em 375, 961 e 1440 px, sem rolagem horizontal e sem erros no console"],
    en:{ client:"Mobile videomaker and social media", tag:"WebGL",
      pitch:"A landing page whose hero is a realistic eye made only with a shader: it follows the mouse, blinks and guides the scroll to WhatsApp.",
      ctx:"A video professional needed a site that grabbed attention right away and turned visits into WhatsApp contacts.",
      did:["Realistic eye drawn entirely in WebGL: fibrous iris, textured skin and eyeliner, no images at all","Follows mouse and finger, blinks on its own, reacts to clicks and dozes off when idle","Scroll-driven dive with a camera viewfinder (REC, timer and focus) inside the pupil","Portfolio with 9 vertical videos and a full-screen player"],
      dec:["Videos load only when visible, at most 2 play at once and data-saver is respected","WebGL caps pixel density, lowers resolution if the device can't keep up and pauses off-screen","Without WebGL a CSS eye takes over, in the same style","Tested at 375, 961 and 1440 px, with no horizontal scroll and no console errors"] } },

  { slug:"cs-store", k:"店", name:"CS Store", repo:"csiphone", shot:"csstore",
    client:"Loja de iPhones · Palhoça/SC", tag:"Tailwind",
    pitch:"Loja de iPhones novos e seminovos com showroom 3D, catálogo, calculadora de troca e atendimento direto no WhatsApp.",
    stack:["HTML","Tailwind CSS","JavaScript","three.js"],
    ctx:"A loja precisava de um site que passasse confiança para vender aparelhos caros, mostrar o catálogo e simular a troca do celular antigo.",
    did:["Showroom 3D interativo e catálogo de iPhones","Calculadora CS Trade-In para simular a troca","Seções de loja física, avaliações e FAQ","Menu mobile e animações que entram ao rolar"],
    dec:["Paleta própria em Tailwind (grafite, titânio e dourado) configurada no tema","Animações por IntersectionObserver, leves e sem biblioteca","Site de um arquivo só, publicado no GitHub Pages"],
    en:{ client:"iPhone store · Palhoça, Brazil", tag:"Tailwind",
      pitch:"New and pre-owned iPhone store with a 3D showroom, catalog, trade-in calculator and direct WhatsApp support.",
      ctx:"The store needed a site that built trust to sell expensive devices, showed the catalog and simulated trading in an old phone.",
      did:["Interactive 3D showroom and iPhone catalog","CS Trade-In calculator to simulate a trade","Sections for the physical store, reviews and FAQ","Mobile menu and scroll-in animations"],
      dec:["Custom Tailwind palette (graphite, titanium and gold) set in the theme","Animations via IntersectionObserver, lightweight and library-free","Single-file site published on GitHub Pages"] } }
];

/* ----- Arquivo completo (dados reais dos repositórios) -----
   c = categoria: sistema, negocio, fmp ou inicio · de = descrição em inglês */
var CATS = {
  pt:{ sistema:"Sistemas completos", negocio:"Sites para negócios", fmp:"Faculdade", inicio:"Primeiros passos" },
  en:{ sistema:"Full systems", negocio:"Business sites", fmp:"College", inicio:"First steps" }
};
var LANG_COLOR = { JavaScript:"#f1e05a", TypeScript:"#3178c6", HTML:"#e34c26", "": "#5b6280" };
var REPOS = [
  { n:"ingrid-market", t:"Ingrid Lima · Vídeomaker", d:"Landing page com olho realista em WebGL que guia a rolagem e portfólio em vídeo vertical.", de:"Landing page with a realistic WebGL eye that guides the scroll and a vertical video portfolio.", l:"JavaScript", c:"negocio", at:"2026-10-16", pages:true, tags:"webgl shader gsap landing" },
  { n:"Figarus-2.0", t:"Figaro's Pizzaria 2.0", d:"Visual “Futurismo Quente”: tema escuro, vidro, brilho de brasa e animações ao rolar. Pedidos, banco de dados e painel.", de:"“Warm Futurism” look: dark theme, glass, ember glow and scroll animations. Orders, database and dashboard.", l:"JavaScript", c:"sistema", at:"2026-10-14", pages:true, tags:"node express sqlite three 3d pizza" },
  { n:"sao-cristovao-3.0", t:"São Cristóvão 3.0", d:"Cardápio digital com hero guiado pela rolagem, abas e atendente de pedidos com IA.", de:"Digital menu with a scroll-driven hero, tabs and an AI ordering assistant.", l:"TypeScript", c:"sistema", at:"2026-10-11", pages:true, tags:"react typescript vite tailwind gemini ia ai burger" },
  { n:"s-o-cristovao", t:"São Cristóvão Burger", d:"Primeira versão: smash burgers, carrinho persistente, assistente gastronômico e estúdio de imagens com Gemini.", de:"First version: smash burgers, persistent cart, food assistant and an image studio with Gemini.", l:"TypeScript", c:"sistema", at:"2026-10-08", pages:true, tags:"react typescript gemini ia ai burger" },
  { n:"Figaros-Pizzaria", t:"Figaro's Pizzaria", d:"Cardápio completo, montador de pizza, checkout com CEP, SQLite e painel do desenvolvedor com senha.", de:"Full menu, pizza builder, ZIP-code checkout, SQLite and a password-protected developer dashboard.", l:"JavaScript", c:"sistema", at:"2026-10-08", pages:true, tags:"node express sqlite three 3d pizza" },
  { n:"smartech-3.0", t:"Smartech 3.0", d:"Showroom 3D de coifas UV-C (Raio-X, corte e ficha técnica), calculadora NBR 14518, guia de áudio e consultor com IA.", de:"3D showroom for UV-C hoods (X-ray, cutaway and spec sheet), NBR 14518 calculator, audio guide and AI consultant.", l:"JavaScript", c:"negocio", at:"2026-10-07", pages:true, tags:"three 3d gsap gemini ia ai calculadora calculator" },
  { n:"smartech-2.0", t:"Smartech 2.0", d:"Site institucional sem build: temas claro e escuro, calculadora testável e GSAP com bibliotecas verificadas por SRI.", de:"No-build company site: light and dark themes, testable calculator and GSAP with SRI-verified libraries.", l:"JavaScript", c:"negocio", at:"2026-10-06", pages:true, tags:"gsap three calculadora calculator" },
  { n:"smartech", t:"Smartech Coifas", d:"Primeira versão do site da Smartech: coifas industriais e tecnologia UV-C.", de:"First version of the Smartech site: industrial hoods and UV-C technology.", l:"HTML", c:"negocio", at:"2026-10-05", pages:true, tags:"tailwind institucional" },
  { n:"csiphone", t:"CS Store", d:"Loja de iPhones em Palhoça com showroom 3D, catálogo, calculadora de troca e FAQ.", de:"iPhone store in Palhoça with a 3D showroom, catalog, trade-in calculator and FAQ.", l:"HTML", c:"negocio", at:"2026-10-01", pages:true, tags:"tailwind loja store ecommerce 3d" },
  { n:"Exerc-cio-3-P-gina-tem-tica-completa", t:"Página temática completa", te:"Full theme page", d:"Exercício da FMP: página completa sobre o anime Jujutsu Kaisen.", de:"FMP exercise: a full page about the anime Jujutsu Kaisen.", l:"HTML", c:"fmp", at:"2026-09-17", pages:true, tags:"exercicio exercise anime" },
  { n:"Exerc-cio-2-P-gina-de-divulga-o-de-um-lugar", t:"Conheça Florianópolis", te:"Discover Florianópolis", d:"Exercício da FMP: página de divulgação de um lugar.", de:"FMP exercise: a page promoting a place.", l:"HTML", c:"fmp", at:"2026-09-17", pages:true, tags:"exercicio exercise turismo travel" },
  { n:"Exerc-cio-1-P-gina-de-apresenta-o-pessoal", t:"Apresentação pessoal", te:"Personal introduction", d:"Exercício da FMP: apresentação com vídeo de fundo em loop.", de:"FMP exercise: an introduction page with a looping background video.", l:"HTML", c:"fmp", at:"2026-09-17", pages:true, tags:"exercicio exercise video" },
  { n:"pizzaria", t:"Pizzaria do Michelangelo", d:"Primeiro site para um negócio: fundo animado, cardápio e seção sobre.", de:"First site for a business: animated background, menu and an about section.", l:"HTML", c:"inicio", at:"2026-09-03", pages:true, tags:"pizza" },
  { n:"paginacomimagem", t:"Página com imagem", te:"Page with images", d:"Três páginas ligadas entre si, com imagem e link para o currículo publicado.", de:"Three linked pages with images and a link to the published résumé.", l:"HTML", c:"inicio", at:"2026-08-27", pages:true, tags:"html" },
  { n:"Trabalho-web", t:"Trabalho web", te:"Web assignment", d:"Trabalho de faculdade com navegação entre três páginas.", de:"College assignment with navigation between three pages.", l:"HTML", c:"fmp", at:"2026-08-27", pages:true, tags:"html exercicio exercise" },
  { n:"meu-primeiro-site", t:"Meu primeiro site", te:"My first site", d:"TechNova: o primeiro site, com menu fixo e rolagem suave. Descrição do repositório: “boa sorte carlos”.", de:"TechNova: the very first site, with a fixed menu and smooth scrolling. Repo description: “boa sorte carlos” (good luck, Carlos).", l:"HTML", c:"inicio", at:"2026-08-20", pages:true, tags:"html css" },
  { n:"hello-word-versao-2", t:"Alunos de ADS", te:"ADS students", d:"Página sobre o curso de Análise e Desenvolvimento de Sistemas e o perfil dos alunos.", de:"Page about the Systems Analysis and Development course and its students.", l:"HTML", c:"inicio", at:"2026-08-20", pages:true, tags:"html ads" },
  { n:"curriculumprogramador", t:"Currículo (HTML)", te:"Résumé (HTML)", d:"Modelo de currículo em HTML e CSS, publicado no GitHub Pages.", de:"Résumé template in HTML and CSS, published on GitHub Pages.", l:"HTML", c:"inicio", at:"2026-08-20", pages:true, tags:"curriculo resume" },
  { n:"Curriculum-programador", t:"Curriculum-programador", d:"Repositório criado para o currículo; ainda vazio.", de:"Repository created for the résumé; still empty.", l:"", c:"inicio", at:"2026-08-20", pages:false, tags:"curriculo resume" }
];

/* ----- Mapa de habilidades: quais projetos usam cada habilidade ----- */
var SKILLS = [
  ["js","JavaScript"],["ts","TypeScript"],["react","React 19"],["tailwind","Tailwind"],["node","Node.js"],["express","Express"],
  ["sqlite","SQLite"],["three","three.js"],["webgl","WebGL / GLSL"],["gsap","GSAP"],["lenis","Lenis"],["gemini","Gemini IA"],["tests","node:test"],["sec","Segurança / LGPD"]
];
var SKILL_PROJECTS = [
  { name:"Figaro's Pizzaria 2.0", repo:"Figarus-2.0", s:["js","node","express","sqlite","three","lenis","tests","sec"] },
  { name:"São Cristóvão 3.0", repo:"sao-cristovao-3.0", s:["ts","react","tailwind","node","express","gemini","tests","sec"] },
  { name:"Smartech 3.0", repo:"smartech-3.0", s:["js","three","gsap","gemini","tests","sec"] },
  { name:"Ingrid Lima", repo:"ingrid-market", s:["js","webgl","gsap","lenis"] },
  { name:"CS Store", repo:"csiphone", s:["js","tailwind","three"] },
  { name:"Figaro's Pizzaria", repo:"Figaros-Pizzaria", s:["js","node","express","sqlite","three"] },
  { name:"São Cristóvão Burger", repo:"s-o-cristovao", s:["ts","react","gemini"] },
  { name:"Smartech 2.0", repo:"smartech-2.0", s:["js","gsap","three","tests","sec"] }
];

/* ----- Textos em inglês (o português está no próprio HTML) ----- */
var EN = {
  docTitle:"Carlos Serra · Junior Full Stack Developer",
  docDesc:"Carlos Serra, junior full stack developer in Palhoça, Brazil. Sites and systems with React, TypeScript, Node.js, SQLite, three.js and AI (Gemini). 19 public projects on GitHub.",
  skip:"Skip to content", navLabel:"Sections", langLabel:"PT · Ler em português", cmdLabel:"Open command palette (Ctrl K)", menu:"Menu", cv:"Résumé",
  nav1:"Summary", nav2:"Highlights", nav3:"Projects", nav4:"Journey", nav5:"Skills", nav6:"Contact", nav7:"Method", nav8:"Education",
  status:"Available for an internship or junior role", role:"Junior Full Stack Developer · Palhoça, Brazil",
  lede:"I build sites and systems for real businesses: menus that take orders, <em>dashboards backed by a database</em>, 3D showrooms and AI assistants.",
  cta1:"See projects", cta2:"Get in touch", m1:"public repositories on GitHub", m2:"days from my first “hello world” to my first system with a database", m3:"automated test files", scroll:"Scroll",
  resK:"For recruiters · a 30-second read", resT:"The essentials",
  idN:"Name", idA:"Age", idAv:"24", idF:"Role", idFv:"Junior Full Stack", idB:"Based in", idE:"Education", idEv:"Systems Analysis · FMP · 2nd term", idS:"Status", idSv:"Available",
  copyBrief:"Copy summary",
  b1k:"Who I am", b1t:"I learn fast and ship everything", b1p:"I started coding in August 2026. In eight weeks I went from plain HTML to systems with a server, database, tests and AI.",
  b2k:"What I deliver", b2t:"End-to-end projects", b2l:"<li>Responsive, accessible front-end</li><li>Node.js + Express APIs</li><li>Database and admin dashboard</li><li>3D, animation and AI when they help the business</li>",
  b3k:"Main stack", b3p:"React 19, Vite, Tailwind 4, Express 5, SQLite, three.js, GSAP and Google Gemini. Tests with <code>node:test</code>.",
  b4k:"What I'm looking for", b4t:"Internship or junior role", b4p:"A team where I deliver from week one, get code review and grow in front-end or full stack. On-site, hybrid or remote.",
  n1:"real businesses in Greater Florianópolis with a site built by me", n2:"projects published and live on GitHub Pages", n3:"versions of the same site, each better than the last (Smartech 1 → 3)", n4:"languages on GitHub: HTML, JavaScript and TypeScript",
  desK:"Case studies · the 5 best repositories", desT:"Featured projects", desP:"Each panel is a real business problem and what I built to solve it. Open the case study to see the technical decisions.", desH:"Read it like manga: right to left",
  caseClose:"Close case study",
  arqK:"Full archive", arqK2:"repositories", arqT:"All projects", arqP:"From the first site to the latest, exercises included. You can follow the progress line by line.",
  filterLabel:"Filter by category", sortLabel:"Sort", sort1:"Most recent", sort2:"Name", sort3:"Category", viewLabel:"View mode", view1:"List", view2:"Grid",
  searchLabel:"Search projects", searchPh:"Search: react, 3D, pizza…", arqNote:"Public repositories from", arqDate:"October 2026",
  trajK:"August → October 2026", trajT:"Two months of growth", trajP:"My first repository is called “meu-primeiro-site” (my first site), and its description is “boa sorte carlos” (good luck, Carlos). Seven weeks later I had a system with a database, tests and a password-protected dashboard.",
  t1d:"Aug 20, 2026", t1t:"First commit", t1p:"“meu-primeiro-site” (TechNova), an HTML résumé and “ADS students”: hand-written HTML and CSS, fixed menu and smooth scrolling.",
  t2d:"Aug 27, 2026", t2t:"Multiple pages and images", t2p:"Navigation between pages, images and links between projects published on GitHub Pages.",
  t3d:"Sep 3, 2026", t3t:"First site for a business", t3p:"“Pizzaria do Michelangelo”: animated background, menu and an about section. The Figaro's repository was born the same day.",
  t4d:"Sep 17, 2026", t4t:"FMP exercises", t4p:"Personal introduction with a background video, a page promoting Florianópolis and a full theme page about Jujutsu Kaisen.",
  t5d:"Oct 1, 2026", t5t:"Tailwind and a real store", t5p:"CS Store, an iPhone shop in Palhoça: 3D showroom, catalog, trade-in calculator and FAQ.",
  t6d:"Oct 5–7, 2026", t6t:"Smartech 1.0 → 3.0 in three days", t6p:"3D showroom with three.js, X-ray mode, a calculator following the NBR 14518 standard, an audio guide and a Gemini technical consultant.",
  t7d:"Oct 6, 2026", t7t:"Real full stack", t7p:"Figaro's Pizzaria: Express server, SQLite with order history, a developer dashboard with scrypt passwords and a 3D pizza built in code.",
  t8d:"Oct 11, 2026", t8t:"TypeScript, React 19 and AI ordering", t8p:"São Cristóvão 3.0: an assistant that builds the order, cookie notice (LGPD), security headers and 10 test files.",
  t9d:"Oct 16, 2026", t9t:"WebGL shader from scratch", t9p:"Ingrid Lima: a realistic eye drawn only with a shader that follows the mouse, blinks and guides the scroll. No images.",
  arsK:"Skills with proof", arsT:"Technical arsenal", arsP:"No made-up percentage bars. Every skill points to the project where it shows up.",
  a1h:"Front-end", a1:"<dt>Semantic HTML and modern CSS</dt><dd>Grid, design tokens, light and dark themes. Seen in <a href=\"https://github.com/carlosserra-a11y/smartech-3.0\" target=\"_blank\" rel=\"noopener\">Smartech 3.0</a></dd><dt>React 19 + TypeScript + Vite</dt><dd>Components, cart state, tabs. Seen in <a href=\"https://github.com/carlosserra-a11y/sao-cristovao-3.0\" target=\"_blank\" rel=\"noopener\">São Cristóvão 3.0</a></dd><dt>Tailwind CSS</dt><dd>Seen in <a href=\"https://github.com/carlosserra-a11y/csiphone\" target=\"_blank\" rel=\"noopener\">CS Store</a> and São Cristóvão</dd>",
  a2h:"Back-end", a2:"<dt>Node.js + Express 5</dt><dd>REST API, compression, static files. Seen in <a href=\"https://github.com/carlosserra-a11y/Figarus-2.0\" target=\"_blank\" rel=\"noopener\">Figaro's 2.0</a></dd><dt>SQLite</dt><dd>Order history and menu change log</dd><dt>Authentication</dt><dd>scrypt passwords and a first-access code for the admin dashboard</dd>",
  a3h:"3D and animation", a3:"<dt>three.js and WebGL</dt><dd>Models built in code, Fresnel X-ray, an eye shader. Seen in <a href=\"https://github.com/carlosserra-a11y/ingrid-market\" target=\"_blank\" rel=\"noopener\">Ingrid Lima</a></dd><dt>GSAP + ScrollTrigger, Lenis</dt><dd>Scroll-driven animation, pinned sections</dd><dt>Performance</dt><dd>Single animation loop, pausing off-screen, automatic 2D fallback</dd>",
  a4h:"Artificial intelligence", a4:"<dt>Google Gemini API</dt><dd>An assistant that builds orders and a technical consultant with Google Search</dd><dt>Gemini TTS</dt><dd>Audio guide with the browser's voice as a fallback</dd><dt>Plan B without AI</dt><dd>Without an API key, the site answers from a local knowledge base</dd>",
  a5h:"Quality and security", a5:"<dt>Automated tests</dt><dd>15 test files with <code>node:test</code>: prices, orders, opening hours, consent</dd><dt>LGPD and headers</dt><dd>Cookie notice, CSP, validation of external links</dd><dt>Accessibility</dt><dd>Keyboard navigation, “reduce motion”, AA contrast</dd>",
  a6h:"Tools", a6:"<dt>Git and GitHub</dt><dd>19 repositories, continuous publishing on GitHub Pages</dd><dt>esbuild, Vite and npm</dt><dd>Bundling the 3D code, React and libraries</dd><dt>AI in the workflow</dt><dd>I use coding assistants with review and tests before shipping</dd>",
  smT:"Skill map", smP:"Hover (or focus with the keyboard) a skill to light up the projects that use it. Click to pin it.", smSkills:"Skills",
  metK:"How I work", metT:"From brief to live site",
  s1t:"Understand the business", s1p:"Before opening the editor: what the client sells, how orders arrive and what goes wrong today.",
  s2t:"Design the solution", s2p:"Visual identity, color and type tokens and the shortest path to an order or a contact.",
  s3t:"Build with tests", s3p:"Pricing and ordering rules become pure functions with tests. The visuals never break the rules.",
  s4t:"Ship and improve", s4p:"Live on GitHub Pages, measuring performance. Then a 2.0 and a 3.0 with what I learned.",
  eduK:"Education", eduT:"I study and I build", eduC:"Associate degree in technology · in progress", eduH:"Systems Analysis and Development (ADS)", eduS:"FMP · Faculdade Municipal de Palhoça · Palhoça, Brazil", eduM:"2nd term of the program", eduL:"Studying now",
  eduList:"<li>Relational databases and data modeling</li><li>Programming logic and data structures</li><li>Automated testing and good Git practices</li><li>Technical English for documentation</li>",
  conK:"Contact", conT:"Shall we build <span class=\"out\">together?</span>", conP:"I'm looking for my first internship or junior role. If your team needs someone who learns fast and ships complete projects, reach out.", conGh:"See my GitHub",
  fT:"Send a message", fN:"Name", fE:"Email", fM:"Message", fS:"Send message",
  cCity:"City", cFmt:"Work format", cFmtV:"On-site, hybrid or remote",
  foot1:"© 2026 Carlos Serra · Hand-built with HTML, CSS and JavaScript",
  foot2:"Theme inspired by <i>Bleach: Thousand-Year Blood War</i> · original fan art drawn in code, not affiliated with the rights holders.",
  footCmd:"commands", footSearch:"search",
  palLabel:"Command palette", palPh:"What do you want to do?", palCmds:"Commands", palFoot:"↑ ↓ to choose · Enter to run"
};

/* ----- Textos montados pelo JavaScript ----- */
var UI = {
  pt:{
    caseBtn:"Estudo de caso", live:"Ao vivo", code:"Código", liveFull:"Ver ao vivo", codeFull:"Código no GitHub", preview:"Prévia",
    ctx:"Contexto", did:"O que eu construí", dec:"Decisões técnicas", stack:"Stack", gallery:"Capturas", prev:"Anterior", next:"Próximo",
    shotAlt:"Captura de tela do site", shotDesk:"Computador · 1280 px", shotMob:"Celular · 390 px", shotScroll:"Mais abaixo na página",
    all:"Todos", langTitle:"Linguagem principal por repositório", noCode:"Sem código", featured:"DESTAQUE", isNew:"NOVO",
    empty:q => `Nenhum projeto para “${q}”. Tente react, 3D ou pizza.`, results:n => `${n} ${n === 1 ? "projeto" : "projetos"} na lista`,
    apiNote:n => `Atualizado agora pela API do GitHub (+${n}).`, newDesc:"Projeto novo no GitHub.",
    liveOf:t => `Ver ${t} ao vivo`, codeOf:t => `Código de ${t} no GitHub`,
    copyEmail:"Copiar e-mail", copied:x => `Copiado: ${x}`, copyFail:x => `Selecione e copie: ${x}`, briefCopied:"Resumo copiado. É só colar no e-mail ou no ATS.",
    cvPdf:"Currículo em PDF", email:"E-mail",
    smUses:(s, list) => list.length ? `${s}: ${list.join(", ")}` : `${s}: nenhum projeto em destaque`, smProj:(p, list) => `${p}: ${list.join(", ")}`,
    errName:"Escreva seu nome.", errEmail:"Escreva um e-mail válido, como nome@empresa.com.", errMsg:"Escreva uma mensagem com pelo menos 10 caracteres.",
    sending:"Enviando…", sent:"Mensagem enviada. Obrigado! Respondo pelo e-mail que você informou.", sendFail:"Não foi possível enviar agora. Tente de novo ou use o e-mail ao lado.",
    mailOpened:"Abrimos o seu aplicativo de e-mail com a mensagem pronta.", fixErrors:"Corrija os campos destacados.",
    langBtn:"EN",
    pal:{ go:"Ir para", open:"Abrir caso", copy:"Copiar e-mail", bankai:"Alternar modo Bankai", lang:"Read in English", gh:"Abrir GitHub", search:"Buscar no arquivo", brief:"Copiar resumo para recrutador", cv:"Abrir currículo", none:"Nenhum comando encontrado", sec:"Seção", act:"Ação", case:"Caso" },
    brief:(url, extra) => `Carlos Serra · Desenvolvedor Full Stack Júnior · Palhoça/SC · 24 anos
Disponível para estágio ou vaga júnior (presencial, híbrido ou remoto).
Formação: Análise e Desenvolvimento de Sistemas, FMP (Faculdade Municipal de Palhoça), 2ª fase.
Stack: JavaScript, TypeScript, React 19, Vite, Tailwind 4, Node.js, Express 5, SQLite, three.js, WebGL, GSAP, Google Gemini API, node:test.
Números: 19 repositórios públicos, 18 sites publicados, 15 arquivos de testes automatizados, 5 negócios reais com site feito por mim.
Destaques: Figaro's Pizzaria 2.0 (Express + SQLite + painel), São Cristóvão 3.0 (React + TypeScript + IA), Smartech 3.0 (3D + calculadora NBR 14518).
Portfólio: ${url}
GitHub: https://github.com/carlosserra-a11y${extra}`
  },
  en:{
    caseBtn:"Case study", live:"Live", code:"Code", liveFull:"See it live", codeFull:"Code on GitHub", preview:"Preview",
    ctx:"Context", did:"What I built", dec:"Technical decisions", stack:"Stack", gallery:"Screenshots", prev:"Previous", next:"Next",
    shotAlt:"Screenshot of the site", shotDesk:"Desktop · 1280 px", shotMob:"Mobile · 390 px", shotScroll:"Further down the page",
    all:"All", langTitle:"Main language per repository", noCode:"No code", featured:"FEATURED", isNew:"NEW",
    empty:q => `No projects for “${q}”. Try react, 3D or pizza.`, results:n => `${n} ${n === 1 ? "project" : "projects"} listed`,
    apiNote:n => `Just updated from the GitHub API (+${n}).`, newDesc:"New project on GitHub.",
    liveOf:t => `See ${t} live`, codeOf:t => `${t} source code on GitHub`,
    copyEmail:"Copy email", copied:x => `Copied: ${x}`, copyFail:x => `Select and copy: ${x}`, briefCopied:"Summary copied. Paste it into an email or your ATS.",
    cvPdf:"Résumé (PDF)", email:"Email",
    smUses:(s, list) => list.length ? `${s}: ${list.join(", ")}` : `${s}: no featured project`, smProj:(p, list) => `${p}: ${list.join(", ")}`,
    errName:"Please enter your name.", errEmail:"Please enter a valid email, like name@company.com.", errMsg:"Please write a message with at least 10 characters.",
    sending:"Sending…", sent:"Message sent. Thank you! I'll reply to the email you provided.", sendFail:"Couldn't send right now. Try again or use the email next to it.",
    mailOpened:"Your email app was opened with the message ready.", fixErrors:"Please fix the highlighted fields.",
    langBtn:"PT",
    pal:{ go:"Go to", open:"Open case", copy:"Copy email", bankai:"Toggle Bankai mode", lang:"Ler em português", gh:"Open GitHub", search:"Search the archive", brief:"Copy recruiter summary", cv:"Open résumé", none:"No matching command", sec:"Section", act:"Action", case:"Case" },
    brief:(url, extra) => `Carlos Serra · Junior Full Stack Developer · Palhoça, Brazil · 24 years old
Available for an internship or junior role (on-site, hybrid or remote).
Education: Systems Analysis and Development (ADS), FMP – Faculdade Municipal de Palhoça, 2nd term.
Stack: JavaScript, TypeScript, React 19, Vite, Tailwind 4, Node.js, Express 5, SQLite, three.js, WebGL, GSAP, Google Gemini API, node:test.
Numbers: 19 public repositories, 18 published sites, 15 automated test files, 5 real businesses with a site built by me.
Highlights: Figaro's Pizzaria 2.0 (Express + SQLite + dashboard), São Cristóvão 3.0 (React + TypeScript + AI), Smartech 3.0 (3D + NBR 14518 calculator).
Portfolio: ${url}
GitHub: https://github.com/carlosserra-a11y${extra}`
  }
};
