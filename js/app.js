/* =========================================================================
   PORTFÓLIO CARLOS SERRA · versão 3.0
   Script clássico (sem módulos) para o site abrir com dois cliques no
   index.html, sem servidor. Os dados ficam em js/dados.js.
   Regra de ouro: tudo começa visível; as animações só refinam.
   ========================================================================= */
(function () {
"use strict";

/* ---------- utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const html = document.documentElement;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const norm = s => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer: fine)").matches;
let animOn = false;                 // vira true quando GSAP + ScrollTrigger carregam (depois da primeira pintura)
const ONLINE = /^https?:$/.test(location.protocol);
const SITE_URL = "https://carlosserra-a11y.github.io/leadpagecarlos/";
const PAGES = n => `https://${CONFIG.github}.github.io/${n}/`;
const REPO = n => `https://github.com/${CONFIG.github}/${n}`;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento: segue sem lembrar */ } }
};
const arrow = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
const arrowR = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
const isTyping = t => t && (/^(input|textarea|select)$/i.test(t.tagName) || t.isContentEditable);
const lenis = () => window.__lenis;

/* ---------- idioma (PT/EN) ---------- */
let lang = (() => {
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "pt" || q === "en") return q;
  const s = store.get("lang");
  if (s === "pt" || s === "en") return s;
  return CONFIG.idioma === "en" ? "en" : "pt";
})();
const U = () => UI[lang];
const PT_DOC = { title: document.title, desc: $('meta[name="description"]').content };
const parseAttr = el => el.dataset.i18nAttr.split(";").map(p => p.split(":"));
$$("[data-i18n]").forEach(el => { el._pt = el.innerHTML; });
$$("[data-i18n-attr]").forEach(el => { el._ptAttr = {}; parseAttr(el).forEach(([a]) => { el._ptAttr[a] = el.getAttribute(a); }); });
const CREDIT = {
  pt: "Imagens de <i>Bleach: Thousand-Year Blood War</i> © Tite Kubo/Shueisha, TV TOKYO, dentsu, Pierrot. Fan art sem fins comerciais e sem vínculo com os detentores dos direitos.",
  en: "Images from <i>Bleach: Thousand-Year Blood War</i> © Tite Kubo/Shueisha, TV TOKYO, dentsu, Pierrot. Non-commercial fan art, not affiliated with the rights holders."
};

let shownLang = "pt";                 // o HTML já vem em português
function applyStatic() {
  html.lang = lang === "en" ? "en" : "pt-BR";
  if (lang !== shownLang) $$("[data-i18n]").forEach(el => {
    const k = el.dataset.i18n;
    el.innerHTML = lang === "en" && EN[k] != null ? EN[k] : el._pt;
    if (el.classList.contains("scramble")) { el.dataset.text = el.textContent; el.setAttribute("aria-label", el.textContent); }
  });
  if (lang !== shownLang) $$("[data-i18n-attr]").forEach(el => parseAttr(el).forEach(([a, k]) => {
    el.setAttribute(a, lang === "en" && EN[k] != null ? EN[k] : el._ptAttr[a]);
  }));
  shownLang = lang;
  document.title = lang === "en" ? EN.docTitle : PT_DOC.title;
  $('meta[name="description"]').content = lang === "en" ? EN.docDesc : PT_DOC.desc;
  $("#langTxt").textContent = U().langBtn;
  if (html.classList.contains("has-imgs")) $("#credit").innerHTML = CREDIT[lang];
}
function setLang(l) {
  lang = l; store.set("lang", l);
  applyStatic();
  fillPanels(); renderArchive(); renderSkillMap(); renderContact();
  if ($("#caseDialog").open) openCase(current, true);
  window.ScrollTrigger?.refresh();
}

/* ---------- hero: nome em letras ---------- */
let chi = 0;
$$(".hero h1 .word").forEach(w => {
  w.innerHTML = [...w.textContent].map(ch => `<span class="ch" style="--i:${chi++}">${esc(ch)}</span>`).join("");
});
$(".hero h1").classList.add("split");      // a entrada das letras é CSS (css/style.css, "abertura e entrada do hero")

/* ---------- cenas desenhadas em código (valem quando não há imagens oficiais) ---------- */
let seed = 1;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
(function cityScene() {
  function city(s, minH, maxH, spire, wMin, wMax, extra) {
    seed = s; let x = -40, d = "M-40 600", rim = "";
    while (x < 1640) {
      const w = wMin + rnd() * (wMax - wMin), h = minH + rnd() * (maxH - minH), top = 600 - h;
      d += ` L${x.toFixed(1)} ${top.toFixed(1)}`; rim += ` M${x.toFixed(1)} ${top.toFixed(1)}`;
      if (rnd() < spire) {
        const mid = x + w / 2, tip = top - h * (.35 + rnd() * .7);
        d += ` L${(mid - w * .18).toFixed(1)} ${top.toFixed(1)} L${(mid - 1.5).toFixed(1)} ${(top - h * .2).toFixed(1)} L${mid.toFixed(1)} ${tip.toFixed(1)} L${(mid + 1.5).toFixed(1)} ${(top - h * .2).toFixed(1)} L${(mid + w * .18).toFixed(1)} ${top.toFixed(1)}`;
        rim += ` L${mid.toFixed(1)} ${tip.toFixed(1)}`;
      }
      d += ` L${(x + w).toFixed(1)} ${top.toFixed(1)}`; rim += ` L${(x + w).toFixed(1)} ${top.toFixed(1)}`;
      x += w;
    }
    if (extra) d += extra;
    return { d: d + " L1640 600 Z", rim };
  }
  const far = city(11, 90, 260, .55, 18, 54);
  const mid = city(29, 40, 170, .3, 30, 90, " M1060 600 L1060 300 L1090 300 L1100 90 L1106 10 L1112 90 L1122 300 L1150 300 L1150 600 Z");
  $("#farCity").setAttribute("d", far.d);
  $("#midCity").setAttribute("d", mid.d);
  $("#midRim").setAttribute("d", mid.rim);
  seed = 5;
  $("#beams").innerHTML = Array.from({ length: 7 }, () => {
    const x = 200 + rnd() * 1300, w = 2 + rnd() * 10;
    return `<rect x="${x.toFixed(0)}" y="0" width="${w.toFixed(1)}" height="560" fill="url(#beam)"/>`;
  }).join("");
})();

const idle = fn => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 200));
idle(function speedLines() {      // linhas de velocidade da faixa de tinta (fora da primeira tela: desenha no ócio)
  seed = 17;
  $("#speedLines").innerHTML = Array.from({ length: 64 }, () => {
    const a = rnd() * Math.PI * 2, r0 = 150 + rnd() * 140, r1 = 1100;
    const x0 = 800 + Math.cos(a) * r0, y0 = 380 + Math.sin(a) * r0, x1 = 800 + Math.cos(a) * r1, y1 = 380 + Math.sin(a) * r1;
    return `<line x1="${x0.toFixed(0)}" y1="${y0.toFixed(0)}" x2="${x1.toFixed(0)}" y2="${y1.toFixed(0)}" stroke-width="${(1 + rnd() * 7).toFixed(1)}"/>`;
  }).join("");
});

idle(function armyScene() {        // tropa de uniformes brancos, em fileiras com perspectiva
  seed = 33;
  const defs = `<defs><symbol id="fig" viewBox="-20 -110 40 112" overflow="visible">
    <path d="M-15 0 L-11 -58 Q-14 -76 0 -84 Q14 -76 11 -58 L15 0 Z" fill="#eef2fb"/>
    <path d="M0 -84 Q14 -76 11 -58 L15 0 L4 0 Z" fill="#a3b4d8"/>
    <circle cx="0" cy="-92" r="8.5" fill="#eef2fb"/>
    <path d="M-9 -96 Q0 -108 9 -96 L9 -90 L-9 -90 Z" fill="#c9d6ff"/>
    <path d="M-4 -60 L4 -60 L0 -20 Z" fill="#05060a" opacity=".55"/>
  </symbol></defs>`;
  let g = "";
  for (let r = 0; r < 7; r++) {
    const t = r / 6, s = .4 + t * 1.1, y = 300 + Math.pow(t, 1.35) * 640, gap = 34 + s * 36, op = (.22 + t * .7).toFixed(2);
    let row = "";
    for (let x = -60 + rnd() * gap; x < 1860; x += gap * (.85 + rnd() * .3)) {
      row += `<use href="#fig" x="${(x).toFixed(0)}" y="${(y + rnd() * 10).toFixed(0)}" width="${(40 * s).toFixed(1)}" height="${(112 * s).toFixed(1)}" transform="translate(${(-20 * s).toFixed(1)} ${(-110 * s).toFixed(1)})"/>`;
    }
    g += `<g opacity="${op}">${row}</g>`;
  }
  $("#armyArt").innerHTML = defs + `<rect width="1800" height="900" fill="#05060a"/><rect y="230" width="1800" height="140" fill="#1a2146" opacity=".55"/>` + g;
});

/* ---------- imagens oficiais (opcional: CONFIG.imagensOficiais) ---------- */
let MAN = null;
const bleachPicture = (name, { sizes = "100vw", priority = false, cls = "" } = {}) => {
  const base = `assets/bleach/${name}`, m = MAN && MAN[name];
  const pr = priority ? ' fetchpriority="high" loading="eager"' : ' loading="lazy"';
  if (!m) return `<img class="${cls}" src="${base}.webp" alt="" decoding="async"${pr}>`;
  const ss = ext => m.w.map(w => `${base}-${w}.${ext} ${w}w`).join(", ");
  const mid = m.w[Math.min(1, m.w.length - 1)];
  return `<picture><source type="image/avif" srcset="${ss("avif")}" sizes="${sizes}"><source type="image/webp" srcset="${ss("webp")}" sizes="${sizes}">` +
    `<img class="${cls}" src="${base}-${mid}.jpg" srcset="${ss("jpg")}" sizes="${sizes}" width="${m.width}" height="${m.height}" alt="" decoding="async"${pr} style="background:url('${m.lqip}') center/cover"></picture>`;
};
const bleachSrc = (name, w) => (MAN && MAN[name] ? `assets/bleach/${name}-${MAN[name].w.includes(w) ? w : MAN[name].w[MAN[name].w.length - 1]}.webp` : `assets/bleach/${name}.webp`);
function whenLoaded(img, ok, fail) {
  if (!img) return;
  if (img.complete && img.naturalWidth) return ok();
  img.addEventListener("load", ok, { once: true });
  img.addEventListener("error", fail, { once: true });
}
let altLoaded = false;
function loadBankaiPoster() {
  if (altLoaded || !html.classList.contains("has-imgs")) return;
  altLoaded = true;
  $$(".l-img").forEach(l => {
    const d = document.createElement("div");
    d.className = "alt"; d.style.cssText = "position:absolute;inset:0";
    d.innerHTML = bleachPicture("poster-sangue");
    l.appendChild(d);
  });
}
function setupImages() {
  html.classList.add("has-imgs");
  $("#credit").innerHTML = CREDIT[lang];
  const layers = $$(".l-img");
  const giveUp = () => {               // a imagem não veio: volta para a cena em código
    html.classList.remove("has-imgs");
    layers.forEach(l => { l.innerHTML = ""; l.classList.remove("ready"); });
    $("#credit").innerHTML = lang === "en" ? EN.foot2 : $("#credit")._pt;
    console.info("[portfólio] Imagens oficiais não encontradas em assets/bleach/. Usando a cena desenhada em código.");
  };
  layers.forEach((l, i) => { l.innerHTML = bleachPicture("poster-noite", { priority: i === 0 }); });
  if (MAN && MAN["poster-noite"]) layers.forEach(l => l.classList.add("ready"));   // LQIP já aparece
  whenLoaded($(".l-img-back img"), () => layers.forEach(l => l.classList.add("ready")), giveUp);

  const inkImg = $(".ink-img");
  inkImg.addEventListener("load", () => inkImg.classList.add("ready"), { once: true });
  inkImg.setAttribute("href", bleachSrc("manga-tinta", 1280));
  $(".case-box").style.setProperty("--manga-bg", `url("${bleachSrc("manga-tinta", 640)}")`);

  $("#hzZoom").insertAdjacentHTML("beforeend", bleachPicture("yhwach-horizonte", { sizes: "(max-width: 900px) 100vw, 42vw" }));
  const hz = $("#hzZoom img"); whenLoaded(hz, () => hz.classList.add("ready"), () => hz.remove());

  $("#armyMove").insertAdjacentHTML("beforeend", bleachPicture("wandenreich-exercito"));
  const ar = $("#armyMove img"); whenLoaded(ar, () => ar.classList.add("ready"), () => ar.remove());
}
if (CONFIG.imagensOficiais) {
  const s = document.createElement("script");
  s.src = "assets/bleach/imagens.js";
  s.onload = () => { MAN = window.BLEACH || null; setupImages(); };
  s.onerror = () => setupImages();
  document.head.appendChild(s);
}

/* ---------- foto (opcional) ---------- */
if (CONFIG.foto) $("#idPhoto").insertAdjacentHTML("afterbegin", `<img src="${esc(CONFIG.foto)}" alt="Foto de Carlos Serra" width="400" height="500">`);

/* ---------- página de mangá ---------- */
const cs = c => (lang === "en" && c.en ? Object.assign({}, c, c.en) : c);
$("#page").innerHTML = CASES.map((c, i) => `
  <article class="panel${c.ink ? " ink" : ""}" data-i="${i}">
    <div class="panel-in">
      <span class="flash-ink" aria-hidden="true"></span>
      <span class="num"><b>${i + 1}</b><span class="p-tag"></span></span>
      <figure class="shot">
        <img src="assets/projetos/${c.shot}-1-640.webp" srcset="assets/projetos/${c.shot}-1-640.webp 640w, assets/projetos/${c.shot}-1-1280.webp 1280w"
          sizes="(max-width: 699px) 92vw, (max-width: 1099px) 46vw, 600px" width="1280" height="800" loading="lazy" decoding="async" alt="">
        <span class="sk" aria-hidden="true">${c.k}</span>
        <span class="play" aria-hidden="true"><i></i><span class="p-pv"></span></span>
      </figure>
      <span class="pk${c.red ? " red" : ""}" aria-hidden="true">${c.k}</span>
      ${c.bubble ? '<p class="bubble"></p>' : ""}
      <div class="body">
        <p class="client"></p>
        <h3>${esc(c.name)}</h3>
        <p class="pitch"></p>
        <div class="chips">${c.stack.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div>
        <div class="acts">
          <button class="open" type="button" data-case="${i}"><span class="p-cb"></span> ${arrowR}</button>
          <a class="p-lv" href="${PAGES(c.repo)}" target="_blank" rel="noopener"></a>
          <a class="p-cd" href="${REPO(c.repo)}" target="_blank" rel="noopener"></a>
        </div>
      </div>
    </div>
  </article>`).join("");
function fillPanels() {
  $$(".panel").forEach((p, i) => {
    const c = cs(CASES[i]), u = U();
    $(".p-tag", p).textContent = c.tag;
    $(".shot img", p).alt = `${u.shotAlt} ${c.name}`;
    $(".p-pv", p).textContent = u.preview;
    const b = $(".bubble", p); if (b) b.textContent = c.bubble;
    $(".client", p).textContent = c.client;
    $(".pitch", p).textContent = c.pitch;
    $(".p-cb", p).textContent = u.caseBtn;
    $(".p-lv", p).textContent = u.live; $(".p-lv", p).setAttribute("aria-label", u.liveOf(c.name));
    $(".p-cd", p).textContent = u.code; $(".p-cd", p).setAttribute("aria-label", u.codeOf(c.name));
  });
}
/* linhas de velocidade seguem o mouse; prévia em vídeo só no hover */
const saveData = !!(navigator.connection && navigator.connection.saveData);
$$(".panel").forEach(p => {
  p.addEventListener("pointermove", e => {
    const r = p.getBoundingClientRect();
    p.style.setProperty("--sx", `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
    p.style.setProperty("--sy", `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
  });
  if (!finePointer || reduce || saveData) return;
  const shot = $(".shot", p), c = CASES[+p.dataset.i];
  let v = null;
  p.addEventListener("pointerenter", () => {
    if (!v) {
      v = document.createElement("video");
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = "none";
      v.setAttribute("aria-hidden", "true");
      v.innerHTML = `<source src="assets/projetos/${c.shot}.webm" type="video/webm"><source src="assets/projetos/${c.shot}.mp4" type="video/mp4">`;
      v.addEventListener("playing", () => v.classList.add("on"));
      v.lastElementChild.addEventListener("error", () => { v.remove(); v = null; });
      shot.insertBefore(v, shot.querySelector(".sk"));
    }
    const pr = v.play(); if (pr && pr.catch) pr.catch(() => {});
  });
  p.addEventListener("pointerleave", () => { if (v) { v.pause(); v.classList.remove("on"); } });
});

/* ---------- diálogo do estudo de caso ---------- */
const dlg = $("#caseDialog");
let current = 0, lastBtn = null;
function openCase(i, keepFocus) {
  current = (i + CASES.length) % CASES.length;
  const c = cs(CASES[current]), u = U(), sh = `assets/projetos/${c.shot}`;
  const prev = CASES[(current - 1 + CASES.length) % CASES.length], next = CASES[(current + 1) % CASES.length];
  $("#caseKanji").textContent = c.k;
  $("#caseCount").textContent = `${current + 1} / ${CASES.length}`;
  $("#caseMain").innerHTML = `
    <div><p class="mono" style="color:var(--frost)">${esc(c.client)} · ${esc(c.tag)}</p><h3 id="caseTitle">${esc(c.name)}</h3></div>
    <div><h4>${u.gallery}</h4>
      <div class="gallery">
        <figure class="g-a"><img src="${sh}-1-1280.webp" width="1280" height="800" alt="${esc(`${u.shotAlt} ${c.name}, ${u.shotDesk}`)}" loading="lazy" decoding="async"><figcaption>${u.shotDesk}</figcaption></figure>
        <figure class="g-mob"><img src="${sh}-mob.webp" width="390" height="844" alt="${esc(`${u.shotAlt} ${c.name}, ${u.shotMob}`)}" loading="lazy" decoding="async"><figcaption>${u.shotMob}</figcaption></figure>
        <figure class="g-b"><img src="${sh}-2-1280.webp" width="1280" height="800" alt="${esc(`${u.shotAlt} ${c.name}, ${u.shotScroll}`)}" loading="lazy" decoding="async"><figcaption>${u.shotScroll}</figcaption></figure>
      </div>
    </div>
    <div><h4>${u.ctx}</h4><p>${esc(c.ctx)}</p></div>
    <div><h4>${u.did}</h4><ul>${c.did.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div><h4>${u.dec}</h4><ul>${c.dec.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div><h4>${u.stack}</h4><div class="chips">${c.stack.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>
    <div class="case-links">
      <a class="btn primary" href="${PAGES(c.repo)}" target="_blank" rel="noopener">${u.liveFull} ${arrow}</a>
      <a class="btn" href="${REPO(c.repo)}" target="_blank" rel="noopener">${u.codeFull} ${arrow}</a>
    </div>
    <nav class="case-nav" aria-label="${u.prev} / ${u.next}">
      <button type="button" data-go="-1"><small>← ${u.prev}</small>${esc(prev.name)}</button>
      <button type="button" data-go="1"><small>${u.next} →</small>${esc(next.name)}</button>
    </nav>`;
  if (!dlg.open) {
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    $("#caseClose").focus();
    lenis()?.stop();
    if (animOn) gsap.fromTo(".case-box", { y: 30, opacity: 0, clipPath: "inset(0 0 100% 0)" }, { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: .6, ease: "expo.out" });
  } else if (!keepFocus) {
    $("#caseTitle").setAttribute("tabindex", "-1"); $("#caseTitle").focus();
  }
  $(".case-box").scrollTop = 0;
  if (history.replaceState) history.replaceState(null, "", `#caso-${CASES[current].slug}`);
}
$("#page").addEventListener("click", e => {
  const b = e.target.closest("[data-case]"); if (!b) return;
  lastBtn = b; openCase(+b.dataset.case);
});
$("#caseMain").addEventListener("click", e => {
  const b = e.target.closest("[data-go]"); if (!b) return;
  openCase(current + +b.dataset.go);
});
const closeCase = () => { dlg.close ? dlg.close() : dlg.removeAttribute("open"); };
$("#caseClose").addEventListener("click", closeCase);
dlg.addEventListener("click", e => { if (e.target === dlg) closeCase(); });
dlg.addEventListener("close", () => {
  lenis()?.start();
  if (history.replaceState && /^#caso-/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
  (lastBtn || $(`.panel[data-i="${current}"] .open`))?.focus();
  lastBtn = null;
});
dlg.addEventListener("keydown", e => {
  if (isTyping(e.target)) return;
  if (e.key === "ArrowRight") openCase(current + 1);
  if (e.key === "ArrowLeft") openCase(current - 1);
});
function caseFromHash() {
  const m = location.hash.match(/^#caso-(.+)$/); if (!m) return;
  const i = CASES.findIndex(c => c.slug === m[1]);
  if (i > -1) openCase(i);
}
addEventListener("hashchange", caseFromHash);

/* ---------- arquivo: linguagens, filtros, ordem, lista/grade, busca ---------- */
const state = { cat: "todos", q: "", sort: "recentes", view: store.get("view") === "grade" ? "grade" : "lista" };
let repos = REPOS.slice();
const FEATURED = new Set(CASES.map(c => c.repo));
const MESES = { pt: ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"], en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] };
const fmtDate = iso => { const [y, m, d] = iso.split("-"); return lang === "en" ? `${MESES.en[+m - 1]} ${+d}, ${y}` : `${d} ${MESES.pt[+m - 1]} ${y}`; };
const rt = r => (lang === "en" && r.te ? r.te : r.t);
const rd = r => (lang === "en" && r.de ? r.de : r.d);
const langName = l => l || U().noCode;

function renderLangbar() {
  const counts = {};
  repos.forEach(r => { counts[r.l] = (counts[r.l] || 0) + 1; });
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  $("#langbar").innerHTML = `
    <p class="mono muted">${U().langTitle}</p>
    <div class="bar" role="img" aria-label="${esc(entries.map(([k, n]) => `${langName(k)}: ${n}`).join(", "))}">${entries.map(([k, n]) => `<i style="--c:${LANG_COLOR[k] || "#888"};width:${(n / repos.length * 100).toFixed(2)}%"></i>`).join("")}</div>
    <ul>${entries.map(([k, n]) => `<li><i style="--c:${LANG_COLOR[k] || "#888"}"></i><b>${esc(langName(k))}</b> ${n}</li>`).join("")}</ul>`;
}
function renderFilters() {
  const counts = repos.reduce((a, r) => (a[r.c] = (a[r.c] || 0) + 1, a), {});
  const opts = [["todos", U().all, repos.length], ...Object.entries(CATS[lang]).map(([k, v]) => [k, v, counts[k] || 0])];
  $("#filters").innerHTML = opts.map(([k, label, n]) => `<button type="button" data-cat="${k}" aria-pressed="${state.cat === k}">${esc(label)}<small>${n}</small></button>`).join("");
  $("#repoTotal").textContent = repos.length;
}
function renderRegistry() {
  const q = norm(state.q.trim());
  const order = Object.keys(CATS.pt);
  const list = repos.filter(r => (state.cat === "todos" || r.c === state.cat) &&
      (!q || q.split(/\s+/).every(w => norm([r.n, r.t, r.te, r.d, r.de, r.l, r.tags, CATS.pt[r.c], CATS.en[r.c]].join(" ")).includes(w))))
    .sort((a, b) => state.sort === "nome" ? rt(a).localeCompare(rt(b), lang) :
      state.sort === "categoria" ? (order.indexOf(a.c) - order.indexOf(b.c)) || b.at.localeCompare(a.at) :
      b.at.localeCompare(a.at));
  const u = U(), reg = $("#registry");
  reg.classList.toggle("grid", state.view === "grade");
  reg.innerHTML = list.length ? list.map(r => `
    <article class="row">
      <time datetime="${r.at}">${fmtDate(r.at)}</time>
      <h3>${esc(rt(r))}${FEATURED.has(r.n) ? `<span class="star">${u.featured}</span>` : ""}${r.isNew ? `<span class="new">${u.isNew}</span>` : ""}<small>${esc(r.n)}</small></h3>
      <p>${esc(rd(r))}</p>
      <span class="lang">${r.l ? `<i style="--c:${LANG_COLOR[r.l] || "#888"}"></i>${esc(r.l)}` : '<span class="muted">—</span>'}</span>
      <div class="acts">
        ${r.pages ? `<a href="${PAGES(r.n)}" target="_blank" rel="noopener" aria-label="${esc(u.liveOf(rt(r)))}">${u.live}</a>` : ""}
        <a href="${REPO(r.n)}" target="_blank" rel="noopener" aria-label="${esc(u.codeOf(rt(r)))}">${u.code}</a>
      </div>
    </article>`).join("") : `<p class="empty">${esc(u.empty(state.q.trim()))}</p>`;
  $("#resultCount").textContent = u.results(list.length);
}
function renderArchive() { renderLangbar(); renderFilters(); renderRegistry(); }
function syncView() { $$(".view button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.view === state.view))); }
$("#filters").addEventListener("click", e => {
  const b = e.target.closest("button[data-cat]"); if (!b) return;
  state.cat = b.dataset.cat; renderFilters(); renderRegistry();
  if (animOn) gsap.from("#registry .row", { x: -20, opacity: 0, duration: .4, stagger: .03, ease: "power2.out" });
  window.ScrollTrigger?.refresh();
});
$("#sort").addEventListener("change", e => { state.sort = e.target.value; renderRegistry(); });
$(".view").addEventListener("click", e => {
  const b = e.target.closest("button[data-view]"); if (!b) return;
  state.view = b.dataset.view; store.set("view", state.view); syncView(); renderRegistry(); window.ScrollTrigger?.refresh();
});
$("#q").addEventListener("input", e => { state.q = e.target.value; renderRegistry(); });

function mergeRepos(data) {
  const known = new Set(repos.map(r => r.n.toLowerCase()).concat(String(CONFIG.repoDoSite || "").toLowerCase()));
  const extra = data.filter(g => !g.fork && !known.has(g.name.toLowerCase())).map(g => ({
    n: g.name, t: g.name.replace(/[-_]/g, " "), d: g.description || UI.pt.newDesc, de: g.description || UI.en.newDesc, l: g.language || "",
    c: g.language === "TypeScript" ? "sistema" : "negocio", at: (g.pushed_at || g.created_at || "").slice(0, 10), pages: !!g.has_pages, tags: "", isNew: true }));
  if (!extra.length) return;
  repos = extra.concat(repos);
  renderArchive();
  $("#archiveNote").insertAdjacentHTML("beforeend", ` <span class="muted">${esc(U().apiNote(extra.length))}</span>`);
}
if (CONFIG.buscarRepos && ONLINE) {
  const KEY = `gh-repos:${CONFIG.github}`;
  let cached = null;
  try { cached = JSON.parse(store.get(KEY) || "null"); } catch (e) { cached = null; }
  if (cached && Date.now() - cached.t < 36e5 && Array.isArray(cached.data)) mergeRepos(cached.data);
  else fetch(`https://api.github.com/users/${CONFIG.github}/repos?per_page=100&sort=pushed`)
    .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(data => {
      const slim = data.map(g => ({ name: g.name, description: g.description, language: g.language, fork: g.fork, pushed_at: g.pushed_at, created_at: g.created_at, has_pages: g.has_pages }));
      store.set(KEY, JSON.stringify({ t: Date.now(), data: slim }));
      mergeRepos(slim);
    }).catch(() => { /* sem rede ou limite da API: fica a lista do arquivo */ });
}

/* ---------- mapa de habilidades ---------- */
const SKILL_EN = { gemini: "Gemini AI", sec: "Security / LGPD" };
const skillName = id => { const s = SKILLS.find(x => x[0] === id); return lang === "en" && SKILL_EN[id] ? SKILL_EN[id] : s[1]; };
let pinned = null;
function renderSkillMap() {
  $("#smSkills").innerHTML = SKILLS.map(([id]) => `<button type="button" data-s="${id}" aria-pressed="${pinned === id}">${esc(skillName(id))}</button>`).join("");
  $("#smProjects").innerHTML = SKILL_PROJECTS.map((p, i) => `<li data-p="${i}"><b>${esc(p.name)}</b><span>${esc(p.s.map(skillName).join(" · "))}</span></li>`).join("");
  lightSkill(pinned, true);
}
function lightSkill(id, quiet) {
  const lis = $$("#smProjects li"), bts = $$("#smSkills button");
  lis.forEach(li => { const on = !!id && SKILL_PROJECTS[+li.dataset.p].s.includes(id); li.classList.toggle("on", on); li.classList.toggle("dim", !!id && !on); });
  bts.forEach(b => { b.classList.toggle("on", b.dataset.s === id); b.classList.remove("dim"); });
  if (!quiet) $("#smOut").textContent = id ? U().smUses(skillName(id), SKILL_PROJECTS.filter(p => p.s.includes(id)).map(p => p.name)) : "";
}
function lightProject(i) {
  const p = SKILL_PROJECTS[i];
  $$("#smProjects li").forEach(li => { li.classList.toggle("on", +li.dataset.p === i); li.classList.toggle("dim", +li.dataset.p !== i); });
  $$("#smSkills button").forEach(b => { b.classList.toggle("on", p.s.includes(b.dataset.s)); b.classList.toggle("dim", !p.s.includes(b.dataset.s)); });
  $("#smOut").textContent = U().smProj(p.name, p.s.map(skillName));
}
const smSkills = $("#smSkills"), smProjects = $("#smProjects");
smSkills.addEventListener("pointerover", e => { const b = e.target.closest("button"); if (b) lightSkill(b.dataset.s); });
smSkills.addEventListener("focusin", e => { const b = e.target.closest("button"); if (b) lightSkill(b.dataset.s); });
smSkills.addEventListener("pointerleave", () => lightSkill(pinned));
smSkills.addEventListener("focusout", e => { if (!smSkills.contains(e.relatedTarget)) lightSkill(pinned); });
smSkills.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  pinned = pinned === b.dataset.s ? null : b.dataset.s;
  $$("#smSkills button").forEach(x => x.setAttribute("aria-pressed", String(x.dataset.s === pinned)));
  lightSkill(pinned || b.dataset.s);
});
smProjects.addEventListener("pointerover", e => { const li = e.target.closest("li"); if (li) lightProject(+li.dataset.p); });
smProjects.addEventListener("pointerleave", () => lightSkill(pinned));

/* ---------- copiar (área de transferência com reserva de seleção) ---------- */
function copyText(text) {
  return new Promise((ok, fail) => {
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;left:0;top:0;opacity:0";
      (dlg.open ? dlg : document.body).appendChild(ta); ta.select();
      let done = false; try { done = document.execCommand("copy"); } catch (e) { done = false; }
      ta.remove(); done ? ok() : fail();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, fallback);
    else fallback();
  });
}
const briefText = () => {
  const url = ONLINE ? location.origin + location.pathname : SITE_URL;
  let extra = "";
  if (CONFIG.email) extra += `\n${U().email}: ${CONFIG.email}`;
  if (CONFIG.linkedin) extra += `\nLinkedIn: ${CONFIG.linkedin}`;
  return U().brief(url, extra);
};
function copyBrief(out) {
  copyText(briefText()).then(() => { if (out) out.textContent = U().briefCopied; }, () => { if (out) out.textContent = briefText(); });
}
$("#copyBrief").addEventListener("click", () => copyBrief($("#briefOut")));
function copyEmail() {
  const out = $("#copyOut");
  copyText(CONFIG.email).then(() => { out.textContent = U().copied(CONFIG.email); }, () => { out.textContent = U().copyFail(CONFIG.email); });
}

/* ---------- contato a partir do CONFIG ---------- */
const actions = $("#contactActions"), ghBtn = actions.firstElementChild;
function renderContact() {
  const u = U();
  $$("[data-dyn]", actions).forEach(n => n.remove());
  $$("[data-dyn]", $("#contactList")).forEach(n => n.remove());
  const add = (h, where = "beforeend") => actions.insertAdjacentHTML(where, h);
  ghBtn.classList.toggle("primary", !CONFIG.email);
  if (CONFIG.email) {
    add(`<button class="btn primary magnet" type="button" data-dyn data-copy-email>${u.copyEmail}</button>`, "afterbegin");
    $("#contactList").insertAdjacentHTML("afterbegin", `<div data-dyn><span>${u.email}</span><b style="user-select:all">${esc(CONFIG.email)}</b></div>`);
  }
  if (CONFIG.linkedin) {
    add(`<a class="btn magnet" data-dyn href="${esc(CONFIG.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
    $("#contactList").insertAdjacentHTML("beforeend", `<div data-dyn><span>LinkedIn</span><a href="${esc(CONFIG.linkedin)}" target="_blank" rel="noopener">${esc(CONFIG.linkedin.replace(/^https?:\/\/(www\.)?/, ""))}</a></div>`);
  }
  if (CONFIG.whatsapp) add(`<a class="btn magnet" data-dyn href="https://wa.me/${esc(CONFIG.whatsapp.replace(/\D/g, ""))}" target="_blank" rel="noopener">WhatsApp</a>`);
  if (CONFIG.curriculo) add(`<a class="btn magnet" data-dyn href="${esc(CONFIG.curriculo)}" target="_blank" rel="noopener">${u.cvPdf}</a>`);
}
actions.addEventListener("click", e => { if (e.target.closest("[data-copy-email]")) copyEmail(); });
if (CONFIG.curriculo) { const cv = $("#cvBtn"); cv.href = CONFIG.curriculo; cv.hidden = false; }

/* formulário: Formspree; sem ele, abre o e-mail com a mensagem pronta */
(function form() {
  const f = $("#cform");
  if (!CONFIG.formspree && !CONFIG.email) return;
  f.hidden = false;
  const fields = [["fNome", "eNome", v => v.trim().length >= 2, "errName"], ["fEmail", "eEmail", v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), "errEmail"], ["fMsg", "eMsg", v => v.trim().length >= 10, "errMsg"]];
  const check = (id, err, ok, key) => {
    const el = $("#" + id), good = ok(el.value);
    el.setAttribute("aria-invalid", String(!good));
    $("#" + err).textContent = good ? "" : U()[key];
    return good;
  };
  fields.forEach(([id, err, ok, key]) => $("#" + id).addEventListener("blur", () => { if ($("#" + id).value) check(id, err, ok, key); }));
  f.addEventListener("submit", e => {
    e.preventDefault();
    const out = $("#fOut"); out.className = "form-out";
    const bad = fields.filter(x => !check(...x));
    if (bad.length) { out.textContent = U().fixErrors; out.classList.add("bad"); $("#" + bad[0][0]).focus(); return; }
    const nome = $("#fNome").value.trim(), email = $("#fEmail").value.trim(), msg = $("#fMsg").value.trim();
    if (!CONFIG.formspree) {
      location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(`Contato pelo portfólio · ${nome}`)}&body=${encodeURIComponent(`${msg}\n\n${nome} · ${email}`)}`;
      out.textContent = U().mailOpened; out.classList.add("ok");
      return;
    }
    const btn = $("#fSend"); btn.disabled = true; out.textContent = U().sending;
    const endpoint = /^https?:/.test(CONFIG.formspree) ? CONFIG.formspree : `https://formspree.io/f/${CONFIG.formspree}`;
    fetch(endpoint, { method: "POST", body: new FormData(f), headers: { Accept: "application/json" } })
      .then(r => { if (!r.ok) throw new Error(r.status); f.reset(); out.textContent = U().sent; out.classList.add("ok"); })
      .catch(() => { out.textContent = U().sendFail; out.classList.add("bad"); })
      .finally(() => { btn.disabled = false; });
  });
})();

/* ---------- Licht Regen: flechas de luz (Quincy) / reiatsu subindo (Bankai) ---------- */
const licht = (() => {
  const cv = $("#licht"); if (reduce || !cv.getContext) return { set() {} };
  const ctx = cv.getContext("2d");
  let w, h, dpr, parts = [], bankai = false, running = true, mx = -1e4, my = -1e4, vel = 0, lastY = scrollY;
  const N = () => Math.round(Math.min(80, innerWidth * innerHeight / 18000));
  function size() { dpr = Math.min(2, devicePixelRatio || 1); w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr; }
  function spawn(p = {}, anywhere) {
    p.x = Math.random() * w * 1.3 - w * .15; p.y = anywhere ? Math.random() * h : (bankai ? h + 20 : -40 * dpr);
    p.len = (14 + Math.random() * 34) * dpr; p.v = (1.2 + Math.random() * 2.4) * dpr; p.a = .1 + Math.random() * .35; p.r = (.6 + Math.random() * 1.6) * dpr; p.s = Math.random() * 6.28;
    return p;
  }
  function init() { size(); parts = Array.from({ length: N() }, () => spawn({}, true)); }
  addEventListener("scroll", () => { vel += Math.abs(scrollY - lastY) * .015; lastY = scrollY; }, { passive: true });
  addEventListener("pointermove", e => { mx = e.clientX * dpr; my = e.clientY * dpr; }, { passive: true });
  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    vel *= .92;
    const boost = 1 + Math.min(5, vel);
    for (const p of parts) {
      if (!bankai) {
        const dx = -.28, dy = 1;
        p.x += dx * p.v * boost; p.y += dy * p.v * boost;
        const g = ctx.createLinearGradient(p.x, p.y, p.x - dx * p.len, p.y - dy * p.len);
        g.addColorStop(0, `rgba(238,242,251,${p.a})`); g.addColorStop(1, "rgba(181,204,255,0)");
        ctx.strokeStyle = g; ctx.lineWidth = p.r * .8; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - dx * p.len, p.y - dy * p.len); ctx.stroke();
        if (p.y > h + 40 || p.x < -60) spawn(p);
      } else {
        p.s += .03; p.y -= p.v * .7 * boost; p.x += Math.sin(p.s) * .5 * dpr;
        const ddx = p.x - mx, ddy = p.y - my, d = Math.hypot(ddx, ddy), R = 130 * dpr;
        if (d < R) { const f = (1 - d / R) * 3; p.x += ddx / (d + 1) * f; p.y += ddy / (d + 1) * f; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 1.3, 0, 6.283);
        ctx.fillStyle = `rgba(227,19,47,${p.a + .2})`; ctx.shadowBlur = 10 * dpr; ctx.shadowColor = "#e3132f"; ctx.fill(); ctx.shadowBlur = 0;
        if (p.y < -20) spawn(p);
      }
    }
    requestAnimationFrame(tick);
  }
  addEventListener("resize", init);
  document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) requestAnimationFrame(tick); });
  init(); requestAnimationFrame(tick);
  return { set(v) { bankai = v; parts.forEach(p => spawn(p, true)); } };
})();

/* ---------- modo Bankai (botão ou tecla B) ---------- */
const bankaiBtn = $("#bankai"), flash = $("#flash");
function toggleBankai() {
  const on = bankaiBtn.getAttribute("aria-pressed") !== "true";
  if (on) loadBankaiPoster();
  bankaiBtn.setAttribute("aria-pressed", String(on));
  html.classList.toggle("bankai", on);
  licht.set(on);
  if (on && animOn) {
    gsap.timeline()
      .fromTo(flash.querySelector(".flash-cut"), { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: .25, ease: "power4.in" })
      .fromTo(flash, { opacity: 1 }, { opacity: 0, duration: 1, ease: "power2.out" }, ">")
      .fromTo(flash.querySelector("span"), { scale: 1.3 }, { scale: 1, duration: 1, ease: "expo.out" }, "<")
      .set(flash.querySelector(".flash-cut"), { opacity: 0 }, "<")
      .fromTo("main", { x: -10 }, { x: 0, duration: .55, ease: "elastic.out(1,.25)" }, "<");
  }
}
bankaiBtn.addEventListener("click", toggleBankai);

/* ---------- navegação: some ao descer, volta ao subir, indicador, menu ---------- */
const nav = $("#nav"), navInd = $("#navInd"), navLinks = $$("#navList a");
let activeLink = null;
function moveInd() {
  if (!activeLink || !activeLink.offsetWidth) { navInd.classList.remove("on"); return; }
  navInd.style.width = `${activeLink.offsetWidth}px`;
  navInd.style.transform = `translateX(${activeLink.offsetLeft}px)`;
  navInd.classList.add("on");
}
(function spy() {
  const map = new Map(navLinks.map(a => [a.getAttribute("href").slice(1), a]));
  const ids = ["topo", "resumo", "destaques", "arquivo", "trajetoria", "arsenal", "metodo", "formacao", "contato"];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.removeAttribute("aria-current"));
    activeLink = map.get(e.target.id) || null;
    activeLink?.setAttribute("aria-current", "true");
    moveInd();
  }), { rootMargin: "-45% 0px -50% 0px" });
  ids.forEach(id => { const s = document.getElementById(id); s && io.observe(s); });
  addEventListener("resize", moveInd);
  document.fonts?.ready.then(moveInd);
})();
let lastScroll = scrollY, menuOpen = false;
addEventListener("scroll", () => {
  const y = scrollY, d = y - lastScroll;
  if (!menuOpen && Math.abs(d) > 4) nav.classList.toggle("hide", d > 0 && y > 160);
  lastScroll = y;
}, { passive: true });
nav.addEventListener("focusin", () => nav.classList.remove("hide"));

const mmenu = $("#mmenu"), menuBtn = $("#menuBtn");
function openMenu() {
  menuOpen = true; nav.classList.remove("hide");
  mmenu.hidden = false; mmenu.classList.add("closed");
  requestAnimationFrame(() => requestAnimationFrame(() => mmenu.classList.remove("closed")));
  menuBtn.setAttribute("aria-expanded", "true");
  html.classList.add("menu-open");
  $("main").inert = true; $("footer").inert = true;
  lenis()?.stop();
  setTimeout(() => $("a", mmenu)?.focus(), 60);
}
function closeMenu(focusBtn) {
  if (!menuOpen) return;
  menuOpen = false;
  mmenu.classList.add("closed");
  menuBtn.setAttribute("aria-expanded", "false");
  html.classList.remove("menu-open");
  $("main").inert = false; $("footer").inert = false;
  lenis()?.start();
  setTimeout(() => { if (!menuOpen) mmenu.hidden = true; }, reduce ? 0 : 600);
  if (focusBtn) menuBtn.focus();
}
menuBtn.addEventListener("click", () => (menuOpen ? closeMenu(true) : openMenu()));
mmenu.addEventListener("click", e => { if (e.target.closest("a")) closeMenu(false); });
addEventListener("resize", () => { if (menuOpen && innerWidth > 980) closeMenu(false); });

/* ---------- paleta de comandos (Ctrl K) ---------- */
const pal = $("#palette"), palQ = $("#palQ"), palList = $("#palList");
let palItems = [], palSel = 0;
const SECTIONS = [["topo", "斬", "Início", "Top"], ["resumo", "要", "Resumo", "Summary"], ["destaques", "記録", "Destaques", "Highlights"], ["arquivo", "書庫", "Projetos", "Projects"],
  ["trajetoria", "道", "Trajetória", "Journey"], ["arsenal", "技", "Habilidades", "Skills"], ["metodo", "型", "Método", "Method"], ["formacao", "学", "Formação", "Education"], ["contato", "縁", "Contato", "Contact"]];
function goTo(id) {
  const t = document.getElementById(id); if (!t) return;
  if (lenis()) lenis().scrollTo(t, { offset: -64, duration: 1.2 });
  else t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
}
function commands() {
  const p = U().pal, list = [];
  SECTIONS.forEach(([id, k, pt, en]) => list.push({ k, label: `${p.go} ${lang === "en" ? en : pt}`, tag: p.sec, run: () => goTo(id) }));
  CASES.forEach((c, i) => list.push({ k: c.k, label: `${p.open}: ${c.name}`, tag: p.case, run: () => { lastBtn = $(`.panel[data-i="${i}"] .open`); openCase(i); } }));
  list.push({ k: "写", label: p.brief, tag: p.act, run: () => copyBrief($("#briefOut")) });
  if (CONFIG.email) list.push({ k: "@", label: p.copy, tag: p.act, run: () => { goTo("contato"); copyEmail(); } });
  if (CONFIG.curriculo) list.push({ k: "履", label: p.cv, tag: p.act, run: () => window.open(CONFIG.curriculo, "_blank", "noopener") });
  list.push({ k: "解", label: p.bankai, tag: "B", run: toggleBankai });
  list.push({ k: "語", label: p.lang, tag: p.act, run: () => setLang(lang === "en" ? "pt" : "en") });
  list.push({ k: "探", label: p.search, tag: "/", run: focusSearch });
  list.push({ k: "⌂", label: p.gh, tag: p.act, run: () => window.open(`https://github.com/${CONFIG.github}`, "_blank", "noopener") });
  return list;
}
function renderPal() {
  const words = norm(palQ.value).split(/\s+/).filter(Boolean);
  palItems = commands().filter(c => words.every(w => norm(c.label).includes(w)));
  palSel = Math.min(palSel, Math.max(0, palItems.length - 1));
  palList.innerHTML = palItems.length ? palItems.map((c, i) => `<li role="option" id="pal-${i}" data-i="${i}" aria-selected="${i === palSel}"><span class="pk" aria-hidden="true">${esc(c.k)}</span><b>${esc(c.label)}</b><small>${esc(c.tag)}</small></li>`).join("")
    : `<li class="none" role="option" aria-disabled="true" aria-selected="false">${U().pal.none}</li>`;
  palQ.setAttribute("aria-activedescendant", palItems.length ? `pal-${palSel}` : "");
}
function selPal(i) {
  if (!palItems.length) return;
  palSel = (i + palItems.length) % palItems.length;
  $$("li", palList).forEach(li => li.setAttribute("aria-selected", String(+li.dataset.i === palSel)));
  palQ.setAttribute("aria-activedescendant", `pal-${palSel}`);
  $(`#pal-${palSel}`)?.scrollIntoView({ block: "nearest" });
}
function runPal(i) {
  const c = palItems[i]; if (!c) return;
  pal.close();
  setTimeout(c.run, 30);
}
function openPal() {
  if (pal.open) return;
  if (dlg.open) closeCase();
  if (menuOpen) closeMenu(false);
  palQ.value = ""; palSel = 0; renderPal();
  pal.showModal(); lenis()?.stop(); palQ.focus();
}
pal.addEventListener("close", () => lenis()?.start());
pal.addEventListener("click", e => { if (e.target === pal) pal.close(); });
palQ.addEventListener("input", () => { palSel = 0; renderPal(); });
palQ.addEventListener("keydown", e => {
  if (e.key === "ArrowDown") { e.preventDefault(); selPal(palSel + 1); }
  else if (e.key === "ArrowUp") { e.preventDefault(); selPal(palSel - 1); }
  else if (e.key === "Home") { e.preventDefault(); selPal(0); }
  else if (e.key === "End") { e.preventDefault(); selPal(palItems.length - 1); }
  else if (e.key === "Enter") { e.preventDefault(); runPal(palSel); }
});
palList.addEventListener("pointermove", e => { const li = e.target.closest("li[data-i]"); if (li && +li.dataset.i !== palSel) selPal(+li.dataset.i); });
palList.addEventListener("click", e => { const li = e.target.closest("li[data-i]"); if (li) runPal(+li.dataset.i); });
$("#cmdBtn").addEventListener("click", openPal);

function focusSearch() {
  goTo("arquivo");
  setTimeout(() => $("#q").focus({ preventScroll: true }), lenis() ? 900 : 300);
}

/* ---------- atalhos de teclado ---------- */
addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.open ? pal.close() : openPal(); return; }
  if (e.key === "Escape" && menuOpen) { closeMenu(true); return; }
  if (e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target) || dlg.open || pal.open) return;
  if (e.key === "/") { e.preventDefault(); focusSearch(); }
  else if (e.key.toLowerCase() === "b") toggleBankai();
});
$("#langBtn").addEventListener("click", () => setLang(lang === "en" ? "pt" : "en"));

/* ---------- barra de progresso + paralaxe do hero ---------- */
const INTRO = html.classList.contains("intro-on"), T0 = performance.now();
const introZoom = { v: INTRO ? 1.25 : 1 };   // a imagem assenta de 1,25 para 1 enquanto a abertura se parte
(function loop() {
  const bar = $("#progress"), hero = $(".hero"), dark = $("#heroDark");
  const layers = $$("#scene .layer");
  let px = 0, py = 0, tx = 0, ty = 0, hh = 1, m = 1;
  const measure = () => { hh = hero.offsetHeight || 1; m = document.documentElement.scrollHeight - innerHeight; };  // medir fora do laço evita reflow a cada quadro
  measure();
  addEventListener("resize", measure);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(document.body);
  if (!reduce) addEventListener("pointermove", e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
  let lastY = -1, lastZ = 0;
  function frame() {
    requestAnimationFrame(frame);
    if (introZoom.v > 1) {
      const t = Math.max(0, (performance.now() - T0) / 1000 - .52) / 1.6;
      introZoom.v = t >= 1 ? 1 : 1.25 - .25 * (1 - Math.pow(2, -10 * t));
    }
    const y = scrollY, moving = Math.abs(tx - px) + Math.abs(ty - py) > .0005;
    if (y === lastY && !moving && introZoom.v === lastZ) return;   // nada mudou: não toca no estilo
    lastZ = introZoom.v;
    if (y !== lastY) bar.style.transform = `scaleX(${m > 0 ? Math.min(1, y / m) : 0})`;
    lastY = y;
    if (!reduce && y < hh * 1.2) {
      const p = Math.min(1, y / hh);
      px += (tx - px) * .06; py += (ty - py) * .06;
      for (const l of layers) {
        const d = +l.dataset.depth || 0;
        if (l.classList.contains("l-img")) {          // imagem: sobe 15% / 30% da rolagem, mouse em sentidos opostos (máx. 24 px), zoom 1 → 1,15
          const s = +l.dataset.mx || 1, z = (1 + .15 * p) * introZoom.v;
          l.style.transform = `translate3d(${(px * 48 * s).toFixed(2)}px, ${(scrollY * d + py * 24 * s).toFixed(2)}px, 0) scale(${z.toFixed(4)})`;
        } else {
          const s = +l.dataset.mx || -1;
          l.style.transform = `translate3d(${(px * d * 90 * s).toFixed(2)}px, ${(scrollY * d - py * d * 50).toFixed(2)}px, 0)`;
        }
      }
      dark.style.opacity = (p * .6).toFixed(3);
    }
  }
  requestAnimationFrame(frame);
})();

/* ---------- cursor de reiatsu, botões magnéticos e cartões com inclinação ---------- */
if (finePointer && !reduce) {
  const c = $("#cursor"), dot = $("#cursorDot");
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  html.classList.add("has-cursor");
  addEventListener("pointermove", e => { x = e.clientX; y = e.clientY; c.classList.add("on"); dot.classList.add("on"); dot.style.transform = `translate(${x}px,${y}px)`; }, { passive: true });
  (function follow() { cx += (x - cx) * .18; cy += (y - cy) * .18; c.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(follow); })();
  document.addEventListener("pointerover", e => c.classList.toggle("big", !!e.target.closest("a,button,.panel,input,textarea,select,label")));
  document.addEventListener("pointerleave", () => { c.classList.remove("on"); dot.classList.remove("on"); });
  document.addEventListener("pointermove", e => {
    const b = e.target.closest(".magnet");
    $$(".magnet.pull").forEach(m => { if (m !== b) { m.classList.remove("pull"); m.style.transform = ""; } });
    if (!b) return;
    const r = b.getBoundingClientRect();
    b.classList.add("pull");
    b.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * .25).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * .35).toFixed(1)}px)`;
  });
  $$(".tilt").forEach(t => {
    t.addEventListener("pointermove", e => {
      const r = t.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
      t.style.transform = `perspective(900px) rotateX(${((.5 - ny) * 8).toFixed(2)}deg) rotateY(${((nx - .5) * 10).toFixed(2)}deg)`;
      t.style.setProperty("--gx", `${(nx * 100).toFixed(1)}%`); t.style.setProperty("--gy", `${(ny * 100).toFixed(1)}%`);
    });
    t.addEventListener("pointerleave", () => { t.style.transform = ""; });
  });
}

/* ---------- títulos que se decodificam em katakana ---------- */
function scramble(el) {
  const final = el.dataset.text || el.textContent;
  el.dataset.text = final;
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン斬千血戦";
  let f = 0; const total = 26;
  (function step() {
    if (el.dataset.text !== final) return;              // idioma mudou no meio
    el.textContent = [...final].map((ch, i) => (ch === " " ? " " : (i < (f / total) * final.length ? ch : chars[(Math.random() * chars.length) | 0]))).join("");
    if (++f <= total) requestAnimationFrame(step); else el.textContent = final;
  })();
}

/* ---------- contadores do hero (JavaScript simples, sem esperar o GSAP) ---------- */
if (!reduce) $$("[data-count]").forEach(el => {
  const end = +el.dataset.count, delay = (INTRO ? 1.1 : .35) * 1000, dur = 1400;
  el.textContent = "0";
  const t0 = performance.now() + delay;
  (function step(now) {
    const t = Math.min(1, Math.max(0, (now - t0) / dur));
    el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(step);
  })(performance.now());
});

/* ---------- montagem inicial ---------- */
applyStatic();
fillPanels();
syncView();
renderArchive();
renderSkillMap();
renderContact();

/* ---------- contador de visitas sem cookies (GoatCounter) ---------- */
if (CONFIG.goatcounter && ONLINE) {
  const s = document.createElement("script");
  s.async = true; s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = `https://${CONFIG.goatcounter}.goatcounter.com/count`;
  document.body.appendChild(s);
}

/* =========================================================================
   ROLAGEM SUAVE (Lenis) + ANIMAÇÕES (GSAP + ScrollTrigger)
   Sem as bibliotecas ou com "reduzir movimento", a página fica completa e parada.
   ========================================================================= */
const LIBS = ["https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js", "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js", "https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"];
const loadScript = src => new Promise((ok, fail) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = fail; document.head.appendChild(s); });
if (!reduce) requestAnimationFrame(() => setTimeout(() => {
  loadScript(LIBS[0]).then(() => loadScript(LIBS[1]))
    .then(() => (finePointer ? loadScript(LIBS[2]).catch(() => { /* sem Lenis: rolagem nativa */ }) : null))   // no toque a rolagem nativa já é a melhor
    .then(setupAnim)
    .catch(() => { /* sem GSAP: a página fica completa e parada */ });
}, 0));

function setupAnim() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  animOn = true;
  html.classList.add("anim");

  if (window.Lenis) {
    try {
      const l = new Lenis({ lerp: .1, smoothWheel: true });
      window.__lenis = l;
      html.classList.add("lenis");
      l.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(t => l.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      if (dlg.open || pal.open || menuOpen) l.stop();     // chegou com um diálogo ou o menu aberto
      document.addEventListener("click", e => {
        const a = e.target.closest('a[href^="#"]'); if (!a) return;
        const id = a.getAttribute("href"); if (id.length < 2) return;
        const t = document.querySelector(id); if (!t) return;
        e.preventDefault(); l.scrollTo(t, { offset: -64, duration: 1.4 });
        if (id === "#conteudo") { t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); }
      });
    } catch (err) { /* sem rolagem suave: segue a nativa */ }
  }

  /* O que fica abaixo da dobra é montado em blocos no ócio do navegador, para não travar a abertura */
  const later = [];
  const queue = fn => later.push(fn);

  /* o giro: ensō e texto em órbita giram com a rolagem da página inteira */
  gsap.to("#enso", { rotate: 360, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1.2 } });
  gsap.to("#orbit", { rotate: -540, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: .6 } });
  gsap.to(".hero-copy", { yPercent: -14, opacity: .35, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  queue(() => {
  /* faixa acelera com a rolagem */
  const track = $(".marquee .track");
  ScrollTrigger.create({ trigger: ".marquee", start: "top bottom", end: "bottom top",
    onUpdate: s => { track.style.animationDuration = `${Math.max(8, 40 - Math.abs(s.getVelocity()) / 60)}s`; } });

  });
  /* cartões de título (um bloco por cartão) */
  $$(".chap-head").forEach(h => queue(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: h, start: "top 82%" } });
    tl.from(h.querySelector(".chap-kanji"), { yPercent: -30, opacity: .15, duration: 1, ease: "expo.out" })
      .from(h.querySelector(".cut"), { scaleX: 0, duration: 1.1, ease: "expo.out" }, "<.1")
      .from(h.querySelectorAll(".chap-title > :not(.cut)"), { y: 24, opacity: 0, duration: .8, stagger: .08, ease: "power3.out" }, "<");
    const s = h.querySelector(".scramble"); if (s) tl.add(() => scramble(s), "<.1");
    gsap.to(h.querySelector(".chap-kanji"), { yPercent: 25, ease: "none", scrollTrigger: { trigger: h, start: "top bottom", end: "bottom top", scrub: true } });
  }));
  queue(() => {
  /* ficha e números */
  gsap.from(".id-card", { x: -40, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".dossier", start: "top 85%" } });
  gsap.from(".brief article", { y: 40, opacity: 0, duration: .9, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: ".dossier", start: "top 85%" } });
  gsap.from(".numbers div", { y: 30, opacity: 0, duration: .8, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".numbers", start: "top 90%" } });

  });
  queue(() => {
  /* faixa de tinta: o pincel revela a cena e o papel sobe até virar a página de mangá */
  gsap.timeline({ scrollTrigger: { trigger: "#tinta", start: "top 85%", end: "bottom 30%", scrub: .8 } })
    .fromTo("#tinta .reveal", { attr: { width: 0 } }, { attr: { width: 1600 }, ease: "power1.inOut", duration: 1 })
    .fromTo("#tinta .ink-art, #tinta .ink-img", { scale: 1.15, transformOrigin: "50% 50%" }, { scale: 1, ease: "none", duration: 1.6 }, 0)
    .fromTo("#tinta .paper", { y: 760 }, { y: -170, ease: "power2.in", duration: 1 }, .75);

  });
  /* mangá: cada quadro é "entintado" na ordem de leitura; o balão salta (um bloco por quadro) */
  $$(".panel").forEach((p, i) => queue(() => {
    const fl = p.querySelector(".flash-ink");
    gsap.timeline({ scrollTrigger: { trigger: p, start: "top 85%" } })
      .from(p, { y: 60, rotate: i % 2 ? 1.5 : -1.5, opacity: 0, duration: 1, ease: "expo.out" })
      .fromTo(fl, { scaleX: 0, transformOrigin: "right" }, { scaleX: 1, duration: .35, ease: "power3.in" }, "<")
      .set(fl, { transformOrigin: "left" })
      .to(fl, { scaleX: 0, duration: .5, ease: "power3.out" });
    gsap.fromTo(p.querySelector(".pk"), { yPercent: -20, rotate: -6 }, { yPercent: 20, rotate: 4, ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: true } });
    const bub = p.querySelector(".bubble");
    if (bub) gsap.from(bub, { scale: 0, transformOrigin: "20% 100%", duration: .7, ease: "back.out(2.4)", scrollTrigger: { trigger: p, start: "top 60%" } });
  }));
  queue(() => {
  /* arquivo */
  gsap.from(".langbar .bar i", { scaleX: 0, duration: 1.2, stagger: .12, ease: "expo.out", scrollTrigger: { trigger: ".langbar", start: "top 88%" } });
  ScrollTrigger.batch("#registry .row", { start: "top 94%", once: true, onEnter: b => gsap.from(b, { x: -30, opacity: 0, duration: .6, stagger: .05, ease: "power3.out" }) });

  });
  queue(() => {
  /* trajetória: a lâmina desce, os marcos acendem e o horizonte faz zoom lento */
  gsap.fromTo("#tlFill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: "#timeline", start: "top 65%", end: "bottom 65%", scrub: true } });
  $$(".tl-item").forEach(it => ScrollTrigger.create({ trigger: it, start: "top 65%", onEnter: () => it.classList.add("lit"), onLeaveBack: () => it.classList.remove("lit") }));
  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", () => {
    gsap.fromTo("#hzZoom", { scale: 1 }, { scale: 1.2, ease: "none", scrollTrigger: { trigger: ".journey-grid", start: "top 70%", end: "bottom 40%", scrub: true } });
    gsap.fromTo(".hz-glow", { opacity: .3 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: ".journey-grid", start: "top 70%", end: "bottom 40%", scrub: true } });
  });
  mm.add("(max-width: 900px)", () => {
    gsap.fromTo("#hzZoom", { yPercent: -8, scale: 1.18 }, { yPercent: 8, scale: 1.18, ease: "none", scrollTrigger: { trigger: "#horizon", start: "top bottom", end: "bottom top", scrub: true } });
  });

  });
  queue(() => {
  /* arsenal, mapa, método e formação */
  gsap.from(".arm", { y: 50, opacity: 0, duration: .9, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".arsenal", start: "top 85%" } });
  $$(".arm .k").forEach(k => gsap.to(k, { rotate: 25, yPercent: 30, ease: "none", scrollTrigger: { trigger: k.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));
  gsap.from(".skillmap", { y: 40, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: ".skillmap", start: "top 88%" } });
  gsap.from(".step .bar", { scaleX: 0, duration: 1, stagger: .18, ease: "expo.out", scrollTrigger: { trigger: ".steps", start: "top 85%" } });
  gsap.from(".meter .track i", { width: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".meter", start: "top 90%" } });

  });
  queue(() => {
  /* contato: a câmera passa pela tropa */
  gsap.fromTo("#armyMove", { xPercent: -5 }, { xPercent: 5, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".contact .big-k", { rotate: -35, scale: .7, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom bottom", scrub: true } });
  gsap.from(".contact h2", { y: 70, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".contact", start: "top 75%" } });

  });
  const idleRun = () => {
    const fn = later.shift(); if (!fn) { ScrollTrigger.refresh(); return; }
    fn(); idle(idleRun);
  };
  idle(idleRun);
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  addEventListener("load", () => ScrollTrigger.refresh());
}

caseFromHash();
})();
