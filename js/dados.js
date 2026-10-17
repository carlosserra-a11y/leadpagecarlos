/* =========================================================================
   DADOS DO PORTFÓLIO · edite aqui. O resto do site se monta sozinho.
   Depois de mudar textos, rode:  node ferramentas/cabecalho.mjs
   ========================================================================= */

/* ----- CONFIGURAÇÃO: campos vazios somem da página ----- */
var CONFIG = {
  nome: "Carlos Serra",
  github: "carlosserra-a11y",
  repoDoSite: "leadpagecarlos",    // repositório deste portfólio: não aparece como "novo" na lista
  email: "carlosserraap55@gmail.com",
  whatsapp: "5548996170281",       // só números, com DDI e DDD
  telefone: "(48) 99617-0281",     // como o número aparece escrito
  linkedin: "",                    // ex.: "https://www.linkedin.com/in/seu-perfil"
  curriculo: "",                   // link do PDF do currículo
  formspree: "",                   // código do formspree.io; vazio = o formulário abre o seu e-mail com a mensagem pronta
  buscarRepos: true,               // com o site no ar, busca repositórios novos na API do GitHub
  vitrine3d: true,                 // notebook e celular em 3D mostrando os projetos (sem GPU fica a imagem estática)
  topo3d: true,                    // topo com o cristal 3D (PrismHero, React); sem GPU fica o topo em HTML
  idioma: "pt"
};

/* ----- Projetos com detalhes -----
   featured = aparece em "Projetos em destaque" (os outros vão para "Outros projetos").
   slug = id do link direto (#caso-slug); shot = nome das capturas em assets/projetos/
   (shot-1-640/1280.webp, shot-mob.webp e, nos destaques, shot-longa.webp, a página inteira).
   proof = como dá para conferir; evo = versões anteriores do mesmo cliente. */
var CASES = [
  { slug:"figaros", name:"Figaro's Pizzaria 2.0", repo:"Figarus-2.0", shot:"figarus",
    featured:true,
    proof:"API e regras de preço testadas com node:test",
    evo:[{ v:"1.0", repo:"Figaros-Pizzaria", shot:"figaros1", d:"Cardápio, montador de pizza, checkout por CEP e painel com senha.", de:"Menu, pizza builder, ZIP-code checkout and a password-protected dashboard." },
         { v:"2.0", repo:"Figarus-2.0", shot:"figarus", d:"Visual novo, pizza 3D em código, histórico de pedidos e testes.", de:"New look, a 3D pizza built in code, order history and tests." }],
    client:"Pizzaria · Palhoça/SC", tag:"Full stack",
    pitch:"Cardápio enorme e pedidos bagunçados no WhatsApp viraram um site com montador de pizza, checkout por CEP, banco de dados e painel do dono.",
    stack:["Node.js","Express 5","SQLite","three.js","Lenis","node:test"],
    ctx:"A Figaro's tem 57 sabores salgados, 14 pizzas doces, calzones, lasanhas, esfihas e combos. Os pedidos chegavam por WhatsApp, sem padrão, e o dono não tinha onde mudar preço ou horário.",
    did:["Montador de pizza: tamanho, até 3 sabores com a pizza desenhada em fatias, borda e observações","Checkout com busca de endereço pelo CEP, taxa por bairro, troco e resumo enviado ao WhatsApp da loja","Servidor Express + SQLite com o histórico de todos os pedidos e de todas as mudanças no cardápio","Painel do desenvolvedor para cadastrar sabores, mudar preços e horários e ver os pedidos chegando com aviso sonoro","Pizza 3D feita em código (three.js): as fatias caem no lugar e se abrem em leque com a rolagem"],
    dec:["Senha guardada com scrypt e código de configuração no primeiro acesso, para ninguém criar a conta antes do dono","Preço de pizza com vários sabores pela média dos sabores, numa regra configurável","Um único laço de animação que dorme quando nada se mexe; sem WebGL ou com “reduzir movimento”, cai sozinho para 2D","Testes da API e das regras de preço com node:test"],
    en:{ proof:"API and pricing rules tested with node:test", client:"Pizzeria · Palhoça, Brazil", tag:"Full stack",
      pitch:"A huge menu and messy WhatsApp orders became a site with a pizza builder, ZIP-code checkout, a database and an owner dashboard.",
      ctx:"Figaro's has 57 savory flavors, 14 sweet pizzas, calzones, lasagnas, esfihas and combos. Orders arrived on WhatsApp with no standard, and the owner had nowhere to change prices or opening hours.",
      did:["Pizza builder: size, up to 3 flavors drawn as slices, crust and notes","Checkout with address lookup by ZIP code, delivery fee per neighborhood, change and a summary sent to the store's WhatsApp","Express + SQLite server keeping the history of every order and every menu change","Developer dashboard to add flavors, change prices and hours and watch orders arrive with a sound alert","3D pizza built in code (three.js): slices drop into place and fan out on scroll"],
      dec:["Password stored with scrypt and a setup code on first access, so nobody can create the account before the owner","Multi-flavor pizza price uses the average of the flavors, in a configurable rule","A single animation loop that sleeps when nothing moves; without WebGL or with “reduce motion” it falls back to 2D","API and pricing rules tested with node:test"] } },

  { slug:"sao-cristovao", name:"São Cristóvão 3.0", repo:"sao-cristovao-3.0", shot:"saocristovao",
    featured:true,
    proof:"10 arquivos de teste no repositório",
    evo:[{ v:"1.0", repo:"s-o-cristovao", shot:"saocristovao1", d:"Smash burgers, carrinho persistente e estúdio de imagens com Gemini.", de:"Smash burgers, a persistent cart and an image studio with Gemini." },
         { v:"3.0", repo:"sao-cristovao-3.0", shot:"saocristovao", d:"React 19 + TypeScript, burger na rolagem e atendente que monta o pedido.", de:"React 19 + TypeScript, a scroll-driven burger and an assistant that builds the order." }],
    client:"Hamburgueria · Palhoça/SC", tag:"React + TS",
    pitch:"Cardápio digital com burger que se desmonta na rolagem e um atendente de IA que entende o pedido escrito do jeito que o cliente fala.",
    stack:["React 19","TypeScript","Vite 8","Tailwind 4","Express","Gemini"],
    ctx:"A loja vende pelo iFood, mas o cliente se perdia entre o cardápio e o app sem saber o que pedir para quantas pessoas.",
    did:["Hero com o burger em tela cheia controlado pela rolagem (sequência de quadros em canvas, funciona no iPhone)","Cardápio em abas, filtro “para quantas pessoas” nos combos e busca com contagem por aba","Atendente que entende frases como “combo para casal”, monta o carrinho e leva ao checkout","Carrinho persistente que vira um resumo copiável para pedir no iFood"],
    dec:["O iFood não aceita carrinho vindo de outro site, então o carrinho vira resumo copiável","O site não coleta nome, telefone, endereço nem pagamento: menos risco e menos LGPD","Link do iFood validado (só https e domínios do iFood); configuração da loja num arquivo só","Com GEMINI_API_KEY quem responde é o Gemini; sem servidor, um atendente local responde sozinho","10 arquivos de testes: pedidos, horários, consentimento e headers de segurança"],
    en:{ proof:"10 test files in the repository", client:"Burger joint · Palhoça, Brazil", tag:"React + TS",
      pitch:"Digital menu with a burger that comes apart on scroll and an AI assistant that understands orders written the way customers talk.",
      ctx:"The store sells through iFood, but customers got lost between the menu and the app, unsure what to order for how many people.",
      did:["Full-screen burger hero driven by scroll (canvas frame sequence, works on iPhone)","Tabbed menu, “for how many people” filter on combos and search with per-tab counts","Assistant that understands phrases like “combo for a couple”, fills the cart and goes to checkout","Persistent cart that becomes a copyable summary to order on iFood"],
      dec:["iFood doesn't accept carts from other sites, so the cart becomes a copyable summary","The site collects no name, phone, address or payment: less risk and less LGPD (Brazil's GDPR) exposure","iFood link validated (https and iFood domains only); store settings in a single file","With GEMINI_API_KEY Gemini answers; without a server, a local assistant answers on its own","10 test files: orders, opening hours, consent and security headers"] } },

  { slug:"smartech", name:"Smartech 3.0", repo:"smartech-3.0", shot:"smartech",
    featured:true,
    proof:"Regras da calculadora em funções puras, com testes",
    evo:[{ v:"1.0", repo:"smartech", shot:"smartech1", d:"Site institucional com Tailwind explicando a tecnologia UV-C.", de:"Company site in Tailwind explaining the UV-C technology." },
         { v:"2.0", repo:"smartech-2.0", shot:"smartech2", d:"Sem build, temas claro e escuro, calculadora testável e SRI.", de:"No build step, light and dark themes, a testable calculator and SRI." },
         { v:"3.0", repo:"smartech-3.0", shot:"smartech", d:"Showroom 3D com Raio-X, calculadora NBR 14518 e consultor com IA.", de:"3D showroom with X-ray mode, NBR 14518 calculator and an AI consultant." }],
    client:"Coifas industriais UV-C · Florianópolis", tag:"3D + IA",
    pitch:"Um produto técnico difícil de explicar virou um showroom 3D com Raio-X, calculadora pela norma e um consultor com IA.",
    stack:["three.js","GSAP","Gemini API","JavaScript","node:test"],
    ctx:"A Smartech fabrica coifas em inox com lâmpadas UV-C. Foto não mostra o que tem dentro, e o cliente precisa calcular vazão e exaustor antes de pedir orçamento.",
    did:["Showroom 3D com modo Raio-X, vistas em corte, hotspots clicáveis e ficha técnica de cada peça","Calculadora em tempo real pela NBR 14518: vazão, diâmetro do duto, potência do exaustor e lâmpadas UV-C","Guia em áudio sobre a física da ozonólise (Gemini TTS ou voz do navegador)","Consultor técnico com Gemini e busca do Google; sem o servidor, responde por uma base local"],
    dec:["Materiais já nascem transparentes com opacidade 1, assim a troca para Raio-X não recompila shader","Ordem de renderização fixa entre carcaça e peças internas para o Raio-X não piscar","Bibliotecas de CDN com versão fixa e verificação SRI; um único arquivo de configuração","Regras da calculadora em funções puras, com testes"],
    en:{ proof:"Calculator rules as pure functions, with tests", client:"UV-C industrial hoods · Florianópolis", tag:"3D + AI",
      pitch:"A technical product that was hard to explain became a 3D showroom with X-ray mode, a standards-based calculator and an AI consultant.",
      ctx:"Smartech builds stainless-steel kitchen hoods with UV-C lamps. Photos don't show what's inside, and customers must size airflow and exhaust fans before asking for a quote.",
      did:["3D showroom with X-ray mode, cutaway views, clickable hotspots and a spec sheet for each part","Real-time calculator following NBR 14518: airflow, duct diameter, fan power and UV-C lamps","Audio guide on the physics of ozonolysis (Gemini TTS or the browser's voice)","Technical consultant with Gemini and Google Search; without the server it answers from a local knowledge base"],
      dec:["Materials start transparent with opacity 1, so switching to X-ray doesn't recompile shaders","Fixed render order between the housing and inner parts so the X-ray doesn't flicker","CDN libraries pinned to exact versions with SRI checks; a single config file","Calculator rules as pure functions, with tests"] } },

  { slug:"ingrid", name:"Ingrid Lima", repo:"ingrid-market", shot:"ingrid",
    featured:false, proof:"Testado em 375, 961 e 1440 px, sem erros no console",
    client:"Vídeomaker mobile e social media", tag:"WebGL",
    pitch:"Landing page cujo herói é um olho realista feito só com shader: segue o mouse, pisca e guia a rolagem até o WhatsApp.",
    stack:["WebGL","GLSL","GSAP 3.13","JavaScript","Sem build"],
    ctx:"Uma profissional de vídeo precisava de um site que chamasse atenção logo de cara e transformasse visita em contato no WhatsApp.",
    did:["Olho realista desenhado inteiramente em WebGL: íris com fibras, pele com relevo e delineado, sem nenhuma imagem","Segue o mouse e o dedo, pisca sozinho, reage ao clique e cochila quando ninguém mexe","Mergulho guiado pela rolagem com visor de câmera (REC, cronômetro e foco) dentro da pupila","Portfólio com 9 vídeos verticais e player em tela cheia"],
    dec:["Vídeos só carregam quando aparecem, no máximo 2 tocam juntos e respeitam a economia de dados","O WebGL limita a densidade de pixels, reduz a resolução se o aparelho não acompanhar e pausa fora da tela","Sem WebGL entra um olho feito em CSS, no mesmo estilo","Testado em 375, 961 e 1440 px, sem rolagem horizontal e sem erros no console"],
    en:{ proof:"Tested at 375, 961 and 1440 px, no console errors", client:"Mobile videomaker and social media", tag:"WebGL",
      pitch:"A landing page whose hero is a realistic eye made only with a shader: it follows the mouse, blinks and guides the scroll to WhatsApp.",
      ctx:"A video professional needed a site that grabbed attention right away and turned visits into WhatsApp contacts.",
      did:["Realistic eye drawn entirely in WebGL: fibrous iris, textured skin and eyeliner, no images at all","Follows mouse and finger, blinks on its own, reacts to clicks and dozes off when idle","Scroll-driven dive with a camera viewfinder (REC, timer and focus) inside the pupil","Portfolio with 9 vertical videos and a full-screen player"],
      dec:["Videos load only when visible, at most 2 play at once and data-saver is respected","WebGL caps pixel density, lowers resolution if the device can't keep up and pauses off-screen","Without WebGL a CSS eye takes over, in the same style","Tested at 375, 961 and 1440 px, with no horizontal scroll and no console errors"] } },

  { slug:"cs-store", name:"CS Store", repo:"csiphone", shot:"csstore",
    featured:false, proof:"Site de um arquivo só, publicado no GitHub Pages",
    client:"Loja de iPhones · Palhoça/SC", tag:"Tailwind",
    pitch:"Loja de iPhones novos e seminovos com showroom 3D, catálogo, calculadora de troca e atendimento direto no WhatsApp.",
    stack:["HTML","Tailwind CSS","JavaScript","three.js"],
    ctx:"A loja precisava de um site que passasse confiança para vender aparelhos caros, mostrar o catálogo e simular a troca do celular antigo.",
    did:["Showroom 3D interativo e catálogo de iPhones","Calculadora CS Trade-In para simular a troca","Seções de loja física, avaliações e FAQ","Menu mobile e animações que entram ao rolar"],
    dec:["Paleta própria em Tailwind (grafite, titânio e dourado) configurada no tema","Animações por IntersectionObserver, leves e sem biblioteca","Site de um arquivo só, publicado no GitHub Pages"],
    en:{ proof:"Single-file site published on GitHub Pages", client:"iPhone store · Palhoça, Brazil", tag:"Tailwind",
      pitch:"New and pre-owned iPhone store with a 3D showroom, catalog, trade-in calculator and direct WhatsApp support.",
      ctx:"The store needed a site that built trust to sell expensive devices, showed the catalog and simulated trading in an old phone.",
      did:["Interactive 3D showroom and iPhone catalog","CS Trade-In calculator to simulate a trade","Sections for the physical store, reviews and FAQ","Mobile menu and scroll-in animations"],
      dec:["Custom Tailwind palette (graphite, titanium and gold) set in the theme","Animations via IntersectionObserver, lightweight and library-free","Single-file site published on GitHub Pages"] } }
];

/* ----- Todos os repositórios públicos (a lista "Exercícios e primeiros passos" mostra os que não aparecem acima) ----- */
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

/* ----- Textos em inglês (o português está no próprio HTML) ----- */
var EN = {
  docTitle:"Carlos Serra · Junior Full Stack Developer",
  docDesc:"Carlos Serra, junior full stack developer in Palhoça, Brazil. Websites and systems for real businesses with React, TypeScript, Node.js, SQLite and three.js. Open to internships and junior roles.",
  skip:"Skip to content", navLabel:"Sections", langLabel:"PT · Ler em português", ghLabel:"GitHub (opens in a new tab)", topWa:"Get in touch",
  nav1:"Projects", nav2:"Stack", nav3:"About", nav4:"Contact",
  status:"Open to internships and junior roles · Palhoça, Brazil",
  role:"Junior Full Stack Developer",
  lede:"I build websites and systems for real businesses: WhatsApp ordering, dashboards backed by a database and 3D showcases. I study Systems Analysis and Development at FMP.",
  ctaWork:"See projects", ctaWa:"Message on WhatsApp", copyEmail:"Copy email",
  s1:"real clients", s2:"live sites", s3:"public repositories", cue:"Scroll to see the projects",
  workK:"Featured projects", workT:"Three real clients, from request to live site",
  workP:"Every project is published and open source. As you scroll, the screen shows the real site.",
  caseClose:"Close project details",
  moreK:"Other projects", moreH:"Two more clients, different challenges", moreT:"Exercises and first steps",
  stackT:"What I use, with proof", stackP:"Each area points to a project where you can open the code and check.",
  seeIn:"See it in", sk2:"Node.js, Express 5, SQLite, REST APIs, scrypt password hashing", sk3t:"3D and animation", sk4t:"Applied AI",
  sk4:"Gemini API (text and voice), with a local fallback when there's no key", sk5t:"Quality",
  sk5:"node:test, accessibility, CSP, Lighthouse and automated checks on GitHub Actions", thisSite:"this site", sk6t:"Tools", seeAll:"19 repositories",
  aboutK:"About", aboutT:"I learn by building for real clients", cap:"Systems Analysis · FMP · Palhoça, Brazil",
  aboutP1:"I study Systems Analysis and Development at FMP in Palhoça, Brazil. I started coding in August 2026 and since then I've built websites and systems that 5 local businesses use: menus that take WhatsApp orders, a dashboard with login and a database, a 3D showcase.",
  aboutP2:"I like to understand how the business works before opening the editor. I want to join a team where I get code review and grow in front-end or full stack.",
  f1:"Based in", f2:"Education", f2v:"Systems Analysis, FMP (2nd term)", f3:"Work format", f3v:"On-site, hybrid or remote", f4:"Languages", f4v:"Portuguese, technical English",
  copyBrief:"Copy recruiter summary", vcard:"Save contact", cv:"Résumé (PDF)",
  tlT:"Journey · 2026",
  t1d:"Aug 20", t1t:"First commit", t1p:"An HTML résumé and a page for my ADS classmates.",
  t2d:"Oct 1", t2t:"First real store", t2p:"CS Store: iPhone catalog, 3D showroom and trade-in calculator.",
  t3d:"Oct 5–7", t3p:"Three versions in three days, up to the 3D showroom with X-ray mode.",
  t4d:"Oct 6", t4t:"First system with a database", t4p:"Figaro's 2.0: Express, SQLite and an owner dashboard with login.",
  t5d:"Oct 11", t5t:"React + TypeScript + AI", t5p:"São Cristóvão 3.0: an assistant that builds the order, and 10 test files.",
  conK:"Contact", conT:"Let's talk", conP:"I'm available for an internship or a junior role. WhatsApp is the fastest way to reach me.",
  fT:"Or leave a message", fN:"Name", fE:"Your email", fM:"Message", fS:"Send message",
  foot1:"Carlos Serra · junior full stack developer", foot2:"© 2026 · hand-built with HTML, CSS, JavaScript and three.js", footCode:"Source of this site", toTop:"Back to top ↑",
  dockLabel:"Quick contact", openSite:"Open site"
};

/* ----- Textos montados pelo JavaScript ----- */
var UI = {
  pt:{
    details:"Detalhes do projeto", live:"Site no ar", code:"Código", liveFull:"Ver ao vivo", codeFull:"Código no GitHub",
    ctx:"Contexto", did:"O que eu fiz", dec:"Decisões técnicas", stack:"Stack", check:"Como conferir", evo:"Evolução", prev:"Anterior", next:"Próximo",
    shotAlt:"Captura de tela do site", shotDesk:"Computador", shotMob:"Celular", now:"atual",
    newRepo:"novo", newDesc:"Projeto novo no GitHub.", newTab:"abre em nova aba",
    liveOf:t => `Ver ${t} no ar`, codeOf:t => `Código de ${t} no GitHub`, versionOf:(t, v) => `${t} ${v} no ar`,
    copied:x => `Copiado: ${x}`, copyFail:x => `Selecione e copie: ${x}`, briefCopied:"Resumo copiado. É só colar no e-mail ou no ATS.",
    vcardDone:"Contato salvo. Abra o arquivo para adicionar à agenda.",
    waMsg:"Olá, Carlos! Vi seu portfólio e quero conversar sobre uma oportunidade.",
    errName:"Escreva seu nome.", errEmail:"Escreva um e-mail válido, como nome@empresa.com.", errMsg:"Escreva uma mensagem com pelo menos 10 caracteres.",
    sending:"Enviando…", sent:"Mensagem enviada. Obrigado!", sendFail:"Não foi possível enviar agora. Tente pelo WhatsApp ou pelo e-mail acima.",
    mailOpened:"Abri o seu aplicativo de e-mail com a mensagem pronta.", fixErrors:"Corrija os campos destacados.",
    mailSubject:n => `Contato pelo portfólio · ${n}`, langBtn:"EN",
    brief:(url, extra) => `Carlos Serra · Desenvolvedor Full Stack Júnior · Palhoça/SC
Disponível para estágio ou vaga júnior (presencial, híbrido ou remoto).
Formação: Análise e Desenvolvimento de Sistemas, FMP (Faculdade Municipal de Palhoça), 2ª fase.
Stack: JavaScript, TypeScript, React 19, Vite, Tailwind, Node.js, Express 5, SQLite, three.js, WebGL, GSAP, Gemini API, node:test.
Números: 5 clientes reais, 9 sites no ar, 19 repositórios públicos.
Destaques: Figaro's Pizzaria 2.0 (Express + SQLite + painel), São Cristóvão 3.0 (React + TypeScript + IA), Smartech 3.0 (3D + calculadora NBR 14518).
Portfólio: ${url}
GitHub: https://github.com/carlosserra-a11y${extra}`
  },
  en:{
    details:"Project details", live:"Live site", code:"Code", liveFull:"See it live", codeFull:"Code on GitHub",
    ctx:"Context", did:"What I built", dec:"Technical decisions", stack:"Stack", check:"How to verify", evo:"Evolution", prev:"Previous", next:"Next",
    shotAlt:"Screenshot of the site", shotDesk:"Desktop", shotMob:"Mobile", now:"current",
    newRepo:"new", newDesc:"New project on GitHub.", newTab:"opens in a new tab",
    liveOf:t => `See ${t} live`, codeOf:t => `${t} source code on GitHub`, versionOf:(t, v) => `${t} ${v} live`,
    copied:x => `Copied: ${x}`, copyFail:x => `Select and copy: ${x}`, briefCopied:"Summary copied. Paste it into an email or your ATS.",
    vcardDone:"Contact saved. Open the file to add it to your contacts.",
    waMsg:"Hi Carlos! I saw your portfolio and would like to talk about an opportunity.",
    errName:"Please enter your name.", errEmail:"Please enter a valid email, like name@company.com.", errMsg:"Please write a message with at least 10 characters.",
    sending:"Sending…", sent:"Message sent. Thank you!", sendFail:"Couldn't send right now. Try WhatsApp or the email above.",
    mailOpened:"Your email app was opened with the message ready.", fixErrors:"Please fix the highlighted fields.",
    mailSubject:n => `Portfolio contact · ${n}`, langBtn:"PT",
    brief:(url, extra) => `Carlos Serra · Junior Full Stack Developer · Palhoça, Brazil
Available for an internship or junior role (on-site, hybrid or remote).
Education: Systems Analysis and Development (ADS), FMP – Faculdade Municipal de Palhoça, 2nd term.
Stack: JavaScript, TypeScript, React 19, Vite, Tailwind, Node.js, Express 5, SQLite, three.js, WebGL, GSAP, Gemini API, node:test.
Numbers: 5 real clients, 9 live sites, 19 public repositories.
Highlights: Figaro's Pizzaria 2.0 (Express + SQLite + dashboard), São Cristóvão 3.0 (React + TypeScript + AI), Smartech 3.0 (3D + NBR 14518 calculator).
Portfolio: ${url}
GitHub: https://github.com/carlosserra-a11y${extra}`
  }
};
