/* =========================================================================
   PORTFÓLIO CARLOS SERRA · versão 8.0 · carlos@serra
   Script clássico (sem módulos): abre com dois cliques no index.html.
   Tudo começa visível; carregamento, animação e 3D entram por cima e saem sozinhos.
   ========================================================================= */
(function () {
"use strict";

/* ---------- utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const html = document.documentElement;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer: fine)").matches;
const saveData = !!(navigator.connection && navigator.connection.saveData);
const ONLINE = /^https?:$/.test(location.protocol);
const SITE_URL = "https://carlosserra-a11y.github.io/leadpagecarlos/";
const PAGES = n => `https://${CONFIG.github}.github.io/${n}/`;
const REPO = n => `https://github.com/${CONFIG.github}/${n}`;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento: segue sem lembrar */ } }
};
const idle = fn => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 200));
const ic = id => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;
const lenis = () => window.__lenis;
// link externo; `sr` completa o nome para leitores de tela sem trocar o texto visível (ex.: "Site no ar · Smartech 3.0")
const ext = (href, label, cls = "tlink", sr = "") =>
  `<a class="${cls}" href="${href}" target="_blank" rel="noopener noreferrer">${label}${sr ? `<span class="sr-only"> · ${esc(sr)}</span>` : ""}${ic("i-out")}</a>`;
const pad = (n, l = 2) => String(n).padStart(l, "0");
const GLYPHS = "<>/\\{}[]=+*#$%&_;:01ABCDEFX";
const glyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
const fold = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
// posição da rolagem guardada no evento: quem anima a cada quadro lê daqui (ler scrollY no meio do quadro pode forçar layout)
let SY = scrollY;
addEventListener("scroll", () => { SY = scrollY; }, { passive: true });

/* CONFIG: links só https://, e-mail e telefone validados */
const safeUrl = (u, rel) => {
  const v = String(u || "").trim();
  if (/^https:\/\/[^\s"'<>]+$/i.test(v)) return v;
  if (rel && /^(?!\/\/)[\w./-]+$/.test(v) && !/^[a-z]+:/i.test(v)) return v;
  return "";
};
CONFIG.linkedin = safeUrl(CONFIG.linkedin);
CONFIG.curriculo = safeUrl(CONFIG.curriculo, true);
CONFIG.whatsapp = String(CONFIG.whatsapp || "").replace(/\D/g, "");
CONFIG.email = /^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(String(CONFIG.email || "").trim()) ? CONFIG.email.trim() : "";

const FEATURED = CASES.map((c, i) => i).filter(i => CASES[i].featured);
const OTHERS = CASES.map((c, i) => i).filter(i => !CASES[i].featured);

/* =========================================================================
   TELA DE CARREGAMENTO: o nome se decodifica enquanto a página carrega.
   O progresso segue tarefas de verdade (fontes, imagens, cena 3D), com tempo
   mínimo e máximo; qualquer tecla, clique ou toque pula.
   ========================================================================= */
let entered = !html.classList.contains("intro");
const onEnter = [];
const whenEntered = fn => (entered ? fn() : onEnter.push(fn));
const intro = (function () {
  const tasks = { fonts: 0, page: 0, scene: 0 };
  const api = { done(k) { tasks[k] = 1; } };
  if (entered) return api;
  const box = $("#loader"), num = $("#ldNum"), bar = $("#ldBar"), logs = $$("#ldLog li");
  const letters = $$("#ldName span").filter(s => !s.classList.contains("sp"));
  const finals = letters.map(s => s.textContent);
  const MIN = 1500, MAX = 2700;                        // ms desde o início da navegação
  let shown = 0, out = false, last = 0, prev = performance.now();
  html.classList.add("ld-js");
  try { sessionStorage.setItem("cs-intro", "1"); } catch (e) { /* sem sessão: mostra de novo */ }
  function frame(now) {
    if (out) return;
    // prazo final: mesmo num aparelho travado (poucos quadros por segundo), a página nunca fica presa
    if (now > MAX + 700) return leave();
    const dt = Math.min(250, now - prev); prev = now;
    const weight = tasks.fonts * 30 + tasks.page * 40 + tasks.scene * 30;
    const floor = (now / MAX) * 100;                   // o tempo também empurra o contador
    let target = Math.min(94, Math.max(weight * 0.94, floor));   // 100 só quando tudo terminou (e passou o tempo mínimo)
    const ready = tasks.fonts && tasks.page && tasks.scene && now > MIN;
    if (ready || now > MAX) target = 100;
    shown += Math.max(dt * 0.02, (target - shown) * (1 - Math.exp(-dt / 160)));   // pelo tempo, não pelo número de quadros
    shown = Math.min(shown, target);
    num.textContent = pad(Math.round(shown), 3);
    bar.style.transform = `scaleX(${shown / 100})`;
    logs.forEach((li, i) => li.classList.toggle("ok", !![tasks.fonts, tasks.page, tasks.scene][i]));
    if (now - last > 45) {                             // ~22 trocas por segundo nas letras ainda cifradas
      last = now;
      letters.forEach((el, i) => {
        const solved = shown >= ((i + 1) / letters.length) * 96;
        el.textContent = solved ? finals[i] : glyph();
        el.classList.toggle("on", solved);
        el.classList.toggle("x", !solved && Math.random() < 0.3);
      });
    }
    if (shown >= 99.5) return leave();
    requestAnimationFrame(frame);
  }
  function leave() {
    if (out) return;
    out = true;
    letters.forEach((el, i) => { el.textContent = finals[i]; el.classList.add("on"); el.classList.remove("x"); });
    num.textContent = "100"; bar.style.transform = "scaleX(1)";
    SKIP.forEach(t => removeEventListener(t, skip));
    box.classList.add("sai");
    setTimeout(() => {
      html.classList.add("entrou"); entered = true;
      onEnter.splice(0).forEach(fn => { try { fn(); } catch (e) { /* uma falha não trava o resto */ } });
    }, 220);
    setTimeout(() => { html.classList.remove("intro", "ld-js"); box.hidden = true; }, 1000);
  }
  // pula com qualquer tecla, clique, toque ou rolagem (a página não fica travada embaixo da tela de carregamento)
  const SKIP = ["keydown", "pointerdown", "wheel", "touchstart"];
  const skip = e => { if (e.type === "keydown" && /^(Shift|Control|Alt|Meta)$/.test(e.key)) return; leave(); };
  SKIP.forEach(t => addEventListener(t, skip, { passive: true }));
  (document.fonts?.ready || Promise.resolve()).then(() => api.done("fonts"), () => api.done("fonts"));
  if (document.readyState === "complete") api.done("page");
  else addEventListener("load", () => api.done("page"), { once: true });
  requestAnimationFrame(frame);
  setTimeout(leave, Math.max(0, MAX + 900 - performance.now()));   // garantia extra, caso os quadros parem
  return api;
})();

/* ---------- texto que se decodifica (efeito "scramble"): letras aleatórias até chegar no texto certo ---------- */
function scramble(el, text, dur = 420) {
  if (el._scr) cancelAnimationFrame(el._scr);
  el._final = text;
  if (reduce) { el.textContent = text; el._scr = 0; return; }
  const t0 = performance.now(), n = text.length;
  const tick = now => {
    const p = Math.min(1, (now - t0) / dur);
    let s = "";
    for (let i = 0; i < n; i++) { const c = text[i]; s += c === " " || i < p * n ? c : glyph(); }
    el.textContent = s;
    el._scr = p < 1 ? requestAnimationFrame(tick) : 0;
  };
  el._scr = requestAnimationFrame(tick);
}
const stopScramble = el => { if (el._scr) { cancelAnimationFrame(el._scr); el._scr = 0; el.textContent = el._final; } };
if (finePointer && !reduce) document.addEventListener("pointerover", e => {
  const a = e.target.closest?.("[data-scramble]");
  if (!a || a.contains(e.relatedTarget)) return;
  const t = $("[data-i18n]", a) || a;
  scramble(t, t._scr ? t._final : t.textContent.trim(), 380);
});

/* ---------- idioma ---------- */
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
let shownLang = "pt";
let prism = null;                                        // topo em 3D (PrismHero), quando entra
const isMac = /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform || navigator.platform || "");
function applyStatic() {
  html.lang = lang === "en" ? "en" : "pt-BR";
  if (lang !== shownLang) {
    $$("[data-i18n]").forEach(el => { if (el._scr) stopScramble(el); const k = el.dataset.i18n; el.innerHTML = lang === "en" && EN[k] != null ? EN[k] : el._pt; delete el.dataset.split; });
    $$("[data-i18n-attr]").forEach(el => parseAttr(el).forEach(([a, k]) => el.setAttribute(a, lang === "en" && EN[k] != null ? EN[k] : el._ptAttr[a])));
    shownLang = lang;
  }
  document.title = lang === "en" ? EN.docTitle : PT_DOC.title;
  $('meta[name="description"]').content = lang === "en" ? EN.docDesc : PT_DOC.desc;
  $("#langTxt").textContent = U().langBtn;
  $("#cmdKey").textContent = U().cmdKey(isMac ? "⌘" : "Ctrl");
  const reply = lang === "en" ? CONFIG.respostaEn : CONFIG.resposta;
  $$(".js-reply").forEach(el => { el.textContent = reply || ""; el.hidden = !reply; });
}
function setLang(l) {
  lang = l; store.set("lang", l);
  applyStatic(); renderProjs(); renderOthers(); renderIndex(); wireContact(); renderTerm(true); updatePreview(); recheckForm();
  prism?.update(prismProps());
  if (dlg.open) openCase(current, true);
  if (window.ScrollTrigger) { animProjs(); ScrollTrigger.refresh(); }
  measureProjs(); syncScroll();
}
$("#langBtn").addEventListener("click", () => setLang(lang === "en" ? "pt" : "en"));

/* ---------- contato: WhatsApp, e-mail, telefone, LinkedIn, currículo ---------- */
function phoneTxt() {
  if (CONFIG.telefone) return CONFIG.telefone;
  const n = CONFIG.whatsapp.replace(/^55/, "");
  return n.length === 11 ? `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}` : `+${CONFIG.whatsapp}`;
}
const waUrl = (text = U().waMsg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
function wireContact() {
  $$(".js-wa").forEach(a => { if (CONFIG.whatsapp) a.href = waUrl(); else (a.closest("li") || a).hidden = true; });
  $$(".js-phone").forEach(el => { el.textContent = CONFIG.whatsapp ? phoneTxt() : ""; });
  $$(".js-mail").forEach(a => { if (CONFIG.email) a.href = `mailto:${CONFIG.email}`; else a.closest("p, li")?.setAttribute("hidden", ""); });
  if (CONFIG.curriculo) { const cv = $("#cvBtn"); cv.href = CONFIG.curriculo; cv.hidden = false; }
  if (CONFIG.linkedin) {
    $("#inBtn").href = CONFIG.linkedin; $("#inCh").hidden = false;
    $("#inFootA").href = CONFIG.linkedin; $("#inFoot").hidden = false;
  }
}

/* ---------- copiar, avisos, vCard ---------- */
const toast = $("#toast"); let toastT = 0;
function announce(msg) {
  toast.textContent = msg; toast.classList.add("on");
  clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove("on"), 2800);
}
function copyText(text) {
  return new Promise((ok, fail) => {
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;left:0;top:0;opacity:0";
      ($("dialog[open]") || document.body).appendChild(ta); ta.select();
      let done = false; try { done = document.execCommand("copy"); } catch (e) { done = false; }
      ta.remove(); done ? ok() : fail();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, fallback);
    else fallback();
  });
}
const copyEmail = () => CONFIG.email && copyText(CONFIG.email).then(() => announce(U().copied(CONFIG.email)), () => announce(U().copyFail(CONFIG.email)));
document.addEventListener("click", e => {
  if (e.target.closest("[data-copy='email']")) copyEmail();
  if (e.target.closest("[data-vcard]")) saveVcard();
});
const briefText = () => {
  const url = ONLINE ? location.origin + location.pathname : SITE_URL;
  let extra = "";
  if (CONFIG.email) extra += `\nE-mail: ${CONFIG.email}`;
  if (CONFIG.whatsapp) extra += `\nWhatsApp: ${phoneTxt()} · https://wa.me/${CONFIG.whatsapp}`;
  if (CONFIG.linkedin) extra += `\nLinkedIn: ${CONFIG.linkedin}`;
  return U().brief(url, extra);
};
const copyBrief = () => copyText(briefText()).then(() => announce(U().briefCopied), () => announce(U().copyFail("…")));
$("#copyBrief").addEventListener("click", copyBrief);
function saveVcard() {
  const lines = ["BEGIN:VCARD", "VERSION:3.0", "N:Serra;Carlos;;;", "FN:Carlos Serra",
    `TITLE:${lang === "en" ? "Junior Full Stack Developer" : "Desenvolvedor Full Stack Júnior"}`,
    CONFIG.whatsapp && `TEL;TYPE=CELL:+${CONFIG.whatsapp}`, CONFIG.email && `EMAIL;TYPE=INTERNET:${CONFIG.email}`,
    `URL:${SITE_URL}`, `URL:https://github.com/${CONFIG.github}`, CONFIG.linkedin && `URL:${CONFIG.linkedin}`,
    "ADR;TYPE=HOME:;;;Palhoça;SC;;Brasil", "END:VCARD"].filter(Boolean);
  const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/vcard;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = "carlos-serra.vcf"; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  announce(U().vcardDone);
}
// diálogos: showModal/close quando existem; sem suporte a <dialog>, um "open" simples que também avisa o "close"
const NO_DIALOG = typeof window.HTMLDialogElement !== "function";
if (NO_DIALOG) html.classList.add("no-dialog");
const showDlg = d => { if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", ""); };
const closeDlg = d => {
  if (!d.open && !d.hasAttribute("open")) return;
  if (typeof d.close === "function") d.close();
  else { d.removeAttribute("open"); d.dispatchEvent(new Event("close")); }
};
if (NO_DIALOG) addEventListener("keydown", e => { if (e.key === "Escape") $$("dialog[open]").forEach(closeDlg); });
// volta o foco para quem abriu o diálogo (se ainda existir); sem isso, cai no plano B
const restoreFocus = (el, planB) => {
  const t = el && el.isConnected && el !== document.body ? el : planB;
  t?.focus?.({ preventScroll: !!(el && el.isConnected) });
};
// abre um link externo numa aba nova a partir de um clique (sem window.opener)
function openExternal(url) {
  const a = document.createElement("a");
  a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
  document.body.appendChild(a); a.click(); a.remove();
}

/* =========================================================================
   PROJETOS EM DESTAQUE · estudo de caso: desafio → o que eu fiz → como conferir
   ========================================================================= */
const cs = c => (lang === "en" && c.en ? Object.assign({}, c, c.en) : c);
const tagsHtml = c => `<div class="tags">${c.stack.map(s => `<span class="tag">${esc(s)}</span>`).join("")}</div>`;
function evoHtml(c) {
  if (!c.evo) return "";
  const u = U();
  return `<div class="evo"><p class="evo-k">${u.evo}</p><ol>${c.evo.map(e => `
      <li><a href="${PAGES(e.repo)}" target="_blank" rel="noopener noreferrer">
        <img src="assets/projetos/${e.shot}-1-640.webp" width="640" height="400" loading="lazy" decoding="async" alt="">
        <span class="v"><span class="sr-only">${esc(c.name.replace(/ \d\.\d$/, ""))} </span>${e.v}${e.repo === c.repo ? `<em>${u.now}</em>` : ""}</span>
        <span class="d">${esc(lang === "en" ? e.de : e.d)}</span></a></li>`).join("")}</ol></div>`;
}
const caseActs = (c, i, u) => `<div class="case-acts">
    <button class="btn btn-line btn-sm" type="button" data-case="${i}">${u.openCase}<span class="sr-only"> · ${esc(c.name)}</span>${ic("i-arrow")}</button>
    ${ext(PAGES(c.repo), u.live, "tlink", c.name)}
    ${ext(REPO(c.repo), u.code, "tlink", c.name)}
  </div>`;
function renderProjs() {
  const u = U();
  $("#projs").innerHTML = FEATURED.map((i, n) => {
    const c = cs(CASES[i]), sh = `assets/projetos/${c.shot}`;
    return `
    <article class="proj" id="p-${c.slug}" data-i="${i}" data-n="${n}" aria-labelledby="pt-${c.slug}">
      <span class="proj-big" aria-hidden="true">${pad(n + 1)}</span>
      <div class="wrap proj-in">
        <div class="proj-info">
          <p class="proj-idx"><b>${pad(n + 1)}</b><span>${esc(c.client)}</span><span class="proj-kind">${esc(c.tag)}</span></p>
          <h3 id="pt-${c.slug}">${esc(c.name)}</h3>
          <p class="proj-pitch">${esc(c.pitch)}</p>
          <dl class="cfile">
            <div><dt>${u.challenge}</dt><dd>${esc(c.ctx)}</dd></div>
            <div><dt>${u.built}</dt><dd><ul>${c.did.slice(0, 3).map(x => `<li>${esc(x)}</li>`).join("")}</ul></dd></div>
            <div><dt>${u.verify}</dt><dd><span class="ok" aria-hidden="true">✓</span> ${esc(c.proof)}</dd></div>
          </dl>
          ${tagsHtml(c)}
          ${caseActs(c, i, u)}
          ${evoHtml(c)}
        </div>
        <div class="proj-media">
          <div class="browser">
            <div class="browser-bar"><i></i><i></i><i></i><span>${CONFIG.github}.github.io/${esc(c.repo)}</span></div>
            <div class="browser-view"><img class="long" src="${sh}-longa.webp" width="960" height="1700" loading="lazy" decoding="async" alt="${esc(`${u.shotAlt} ${c.name}`)}"></div>
          </div>
          <div class="phone"><img src="${sh}-mob.webp" width="390" height="844" loading="lazy" decoding="async" alt=""></div>
        </div>
      </div>
    </article>`;
  }).join("");
}

/* ---------- outros clientes ---------- */
function renderOthers() {
  const u = U();
  $("#others").innerHTML = OTHERS.map(i => {
    const c = cs(CASES[i]), sh = `assets/projetos/${c.shot}`;
    return `<article class="other">
      <a class="other-shot" href="${PAGES(c.repo)}" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true" data-cursor>
        <img src="${sh}-1-640.webp" srcset="${sh}-1-640.webp 640w, ${sh}-1-1280.webp 1280w" sizes="(max-width: 760px) 92vw, 600px" width="1280" height="800" loading="lazy" decoding="async" alt=""></a>
      <p class="proj-idx"><span>${esc(c.client)}</span><span class="proj-kind">${esc(c.tag)}</span></p>
      <h3>${esc(c.name)}</h3>
      <p>${esc(c.pitch)}</p>
      ${tagsHtml(c)}
      ${caseActs(c, i, u)}
    </article>`;
  }).join("");
}

/* =========================================================================
   ARQUIVO: todos os repositórios, com filtro e prévia da tela que segue o mouse
   ========================================================================= */
let extra = [];
const MESES = { pt: ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"], en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] };
const fmtDate = iso => {
  const [y, m, d] = String(iso || "").split("-");
  if (!y || !m || !d || !MESES.pt[+m - 1]) return "—";
  return lang === "en" ? `${MESES.en[+m - 1]} ${+d}, ${y}` : `${d} ${MESES.pt[+m - 1]} ${y}`;
};
// repositório → captura (dos casos e das versões anteriores) e → índice do caso, para o botão "Detalhes"
const SHOT = {}, CASE_OF = {};
CASES.forEach((c, i) => { SHOT[c.repo.toLowerCase()] = c.shot; CASE_OF[c.repo.toLowerCase()] = i; (c.evo || []).forEach(e => { SHOT[e.repo.toLowerCase()] = e.shot; }); });
const FILTERS = {
  all: () => true,
  clientes: r => r.c === "negocio" || r.c === "sistema",
  "3d": r => /\b(three|3d|webgl|shader)\b/.test(r.tags || ""),
  ia: r => /\b(ia|ai|gemini)\b/.test(r.tags || ""),
  react: r => /\b(react|typescript)\b/.test(r.tags || "") || r.l === "TypeScript",
  back: r => /\b(node|express|sqlite)\b/.test(r.tags || ""),
  estudos: r => r.c === "fmp" || r.c === "inicio"
};
let filter = "all", showAll = false;
const allRepos = () => {
  const seen = new Set();
  return extra.concat(REPOS).filter(r => { const k = r.n.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => String(b.at).localeCompare(String(a.at)));
};
function renderFilters() {
  const u = U(), list = allRepos();
  $("#filters").innerHTML = Object.keys(FILTERS).map(k => {
    const n = list.filter(FILTERS[k]).length;
    return n || k === "all" ? `<button type="button" data-filter="${k}" aria-pressed="${k === filter}">${esc(u.filters[k])} <span>${n}</span></button>` : "";
  }).join("");
}
function renderIndex(animate) {
  const u = U(), list = allRepos(), rows = list.filter(FILTERS[filter] || FILTERS.all);
  const LIMIT = 8, view = showAll ? rows : rows.slice(0, LIMIT);
  const hadFocus = $("#filters").contains(document.activeElement);
  renderFilters();
  if (hadFocus) $(`#filters [data-filter="${filter}"]`)?.focus();
  $("#idxCount").textContent = `(${list.length})`;
  $("#idxList").innerHTML = view.length ? view.map((r, n) => {
    const k = r.n.toLowerCase(), shot = SHOT[k], ci = CASE_OF[k];
    const name = lang === "en" && r.te ? r.te : r.t;
    return `<li${animate ? ` class="in" style="--i:${n}"` : ""}${shot ? ` data-peek="assets/projetos/${shot}-1-640.webp"` : ""}>
      <time class="ix-date" datetime="${esc(r.at)}">${fmtDate(r.at)}</time>
      <div class="ix-name"><b>${esc(name)}</b>${r.isNew ? `<span class="new-badge">${u.newRepo}</span>` : ""}<p>${esc(lang === "en" && r.de ? r.de : r.d)}</p></div>
      <span class="ix-type">${esc(u.kinds[r.c] || u.kinds.inicio)}</span>
      <span class="ix-acts">${ci != null ? `<button type="button" data-case="${ci}">${u.caseBtn}<span class="sr-only"> · ${esc(name)}</span></button>` : ""}${r.pages ? ext(PAGES(r.n), u.live, "", name) : ""}${ext(REPO(r.n), u.code, "", name)}</span>
    </li>`;
  }).join("") : `<li class="index-empty">${u.idxEmpty}</li>`;
  const more = $("#idxMore");
  more.hidden = rows.length <= LIMIT;
  $("#idxMoreT").textContent = showAll ? u.idxLess : u.idxMore(rows.length);
  more.querySelector("svg").style.transform = showAll ? "rotate(180deg)" : "";
}
$("#filters").addEventListener("click", e => {
  const b = e.target.closest("[data-filter]"); if (!b || b.dataset.filter === filter) return;
  filter = b.dataset.filter; showAll = false; renderIndex(true);
  window.ScrollTrigger?.refresh(); measure(); measureProjs();
});
$("#idxMore").addEventListener("click", () => {
  showAll = !showAll; renderIndex(showAll);
  if (!showAll) $("#index").scrollIntoView({ block: "start" });
  window.ScrollTrigger?.refresh(); measure(); measureProjs();
});
if (CONFIG.buscarRepos && ONLINE) {               // repositórios novos (cache de 1 hora)
  const KEY = `gh-repos:${CONFIG.github}`;
  const merge = data => {
    const known = new Set(REPOS.map(r => r.n.toLowerCase()).concat(String(CONFIG.repoDoSite).toLowerCase()));
    extra = data.filter(g => g && g.name && !g.fork && !known.has(g.name.toLowerCase())).map(g => ({
      n: g.name, t: g.name.replace(/[-_]/g, " "), d: g.description || UI.pt.newDesc, de: g.description || UI.en.newDesc,
      at: String(g.pushed_at || g.created_at || "").slice(0, 10), pages: !!g.has_pages, isNew: true, c: "inicio", tags: "" }));
    if (extra.length) renderIndex();
  };
  let cached = null;
  try { cached = JSON.parse(store.get(KEY) || "null"); } catch (e) { cached = null; }
  if (cached && Date.now() - cached.t < 36e5 && Array.isArray(cached.data)) merge(cached.data);
  else addEventListener("load", () => idle(() => fetch(`https://api.github.com/users/${CONFIG.github}/repos?per_page=100&sort=pushed`)
    .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(data => {
      if (!Array.isArray(data)) return;
      const slim = data.map(g => ({ name: g.name, description: g.description, fork: g.fork, pushed_at: g.pushed_at, created_at: g.created_at, has_pages: g.has_pages }));
      store.set(KEY, JSON.stringify({ t: Date.now(), data: slim })); merge(slim);
    }).catch(() => { /* sem rede ou limite da API: fica a lista do arquivo */ })), { once: true });
}

/* ---------- detalhes do projeto (diálogo) ---------- */
const dlg = $("#caseDialog");
let current = 0, lastBtn = null, caseOpener = null;
function openCase(i, keep) {
  current = (i + CASES.length) % CASES.length;
  const c = cs(CASES[current]), u = U(), sh = `assets/projetos/${c.shot}`;
  const prev = CASES[(current - 1 + CASES.length) % CASES.length], next = CASES[(current + 1) % CASES.length];
  $("#caseMain").innerHTML = `
    <div><p class="label">${esc(c.client)} · ${esc(c.tag)}</p><h3 id="caseTitle">${esc(c.name)}</h3></div>
    <p class="proj-pitch">${esc(c.pitch)}</p>
    <div class="case-gal">
      <img class="d" src="${sh}-1-1280.webp" width="1280" height="800" alt="${esc(`${u.shotAlt} ${c.name} · ${u.shotDesk}`)}" loading="lazy" decoding="async">
      <img class="m" src="${sh}-mob.webp" width="390" height="844" alt="${esc(`${u.shotAlt} ${c.name} · ${u.shotMob}`)}" loading="lazy" decoding="async">
    </div>
    <div class="case-cols">
      <div><h4>${u.challenge}</h4><p>${esc(c.ctx)}</p></div>
      <div><h4>${u.verify}</h4><p>${esc(c.proof)}</p></div>
      <div><h4>${u.built}</h4><ul>${c.did.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
      <div><h4>${u.dec}</h4><ul>${c.dec.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    </div>
    ${evoHtml(c)}
    <div><h4>${u.stack}</h4>${tagsHtml(c)}</div>
    <div class="case-links">
      ${ext(PAGES(c.repo), u.liveFull, "btn btn-solid")}
      ${ext(REPO(c.repo), u.codeFull, "btn btn-line")}
    </div>
    <nav class="case-nav" aria-label="${u.prev} / ${u.next}">
      <button type="button" data-go="-1"><small>← ${u.prev}</small>${esc(prev.name)}</button>
      <button type="button" data-go="1"><small>${u.next} →</small>${esc(next.name)}</button>
    </nav>`;
  if (!dlg.open) {
    caseOpener = lastBtn || document.activeElement;
    showDlg(dlg);
    $("#caseClose").focus();
    lenis()?.stop();
  } else if (!keep) { $("#caseTitle").setAttribute("tabindex", "-1"); $("#caseTitle").focus(); }
  $(".case-box").scrollTop = 0;
  if (history.replaceState) history.replaceState(null, "", `#caso-${CASES[current].slug}`);
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-case]"); if (b) { lastBtn = b; openCase(+b.dataset.case); }
});
$("#caseMain").addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) openCase(current + +b.dataset.go); });
const closeCase = () => closeDlg(dlg);
$("#caseClose").addEventListener("click", closeCase);
dlg.addEventListener("click", e => { if (e.target === dlg) closeCase(); });
dlg.addEventListener("close", () => {
  lenis()?.start();
  if (history.replaceState && /^#caso-/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
  // volta para quem abriu; se foi redesenhado (troca de idioma), para o botão do mesmo projeto.
  // Aberto por link direto (#caso-…), ninguém abriu: o foco fica onde o navegador deixar.
  const opener = caseOpener; caseOpener = null; lastBtn = null;
  if (opener && opener !== document.body) restoreFocus(opener, $(`[data-case="${current}"]`));
});
dlg.addEventListener("keydown", e => {
  if (/^(input|textarea)$/i.test(e.target.tagName) || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  if (e.key === "ArrowRight") openCase(current + 1);
  if (e.key === "ArrowLeft") openCase(current - 1);
});
function caseFromHash() {
  const m = location.hash.match(/^#caso-([\w-]+)$/); if (!m) return;
  const i = CASES.findIndex(c => c.slug === m[1]); if (i > -1) whenEntered(() => openCase(i));
}
addEventListener("hashchange", caseFromHash);

/* =========================================================================
   FORMULÁRIO: monta a mensagem e manda pelo WhatsApp ou pelo e-mail (ou Formspree)
   ========================================================================= */
const form = $("#cform");
const fval = name => { const el = form.querySelector(`[name="${name}"]:checked`) || form.elements[name]; return el && el.value != null ? String(el.value).trim() : ""; };
function composeMsg() {
  const u = U(), m = u.msg, o = m.opts, about = fval("assunto");
  const lines = [m.hi(fval("nome"), fval("empresa")), `${m.about}: ${o[about] || about}`];
  if (about === "projeto") {
    const extra = [["tipo", m.type], ["prazo", m.when], ["orcamento", m.budget]].map(([k, l]) => (fval(k) ? `${l}: ${o[fval(k)]}` : "")).filter(Boolean);
    if (extra.length) lines.push(extra.join(" · "));
  }
  lines.push("", fval("mensagem") || "…");
  if (fval("email")) lines.push("", `${m.email}: ${fval("email")}`);
  lines.push("", m.sign);
  return lines.join("\n");
}
let prevRaf = 0, recheckForm = () => {};
function updatePreview() {
  $("#fProj").hidden = fval("assunto") !== "projeto";
  $("#fPreview").textContent = composeMsg();
}
form.addEventListener("input", () => { if (!prevRaf) prevRaf = requestAnimationFrame(() => { prevRaf = 0; updatePreview(); }); });
form.addEventListener("change", updatePreview);
(function formSend() {
  if (!CONFIG.formspree && !CONFIG.email && !CONFIG.whatsapp) { form.hidden = true; return; }
  if (!CONFIG.whatsapp) $("#fSendWa").hidden = true;
  if (!CONFIG.email && !CONFIG.formspree) $("#fSendMail").hidden = true;
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const fields = [
    ["fNome", "eNome", v => v.trim().length >= 2, "errName"],
    ["fEmail", "eEmail", v => !v.trim() || emailOk(v.trim()), "errEmail"],
    ["fMsg", "eMsg", v => v.trim().length >= 10, "errMsg"]
  ];
  const check = (id, err, ok, key) => { const el = $("#" + id), good = ok(el.value); el.setAttribute("aria-invalid", String(!good)); $("#" + err).textContent = good ? "" : U()[key]; return good; };
  // confere ao sair do campo quando ele tem texto ou já estava com erro (apagar o e-mail opcional limpa o erro)
  fields.forEach(x => $("#" + x[0]).addEventListener("blur", () => { const el = $("#" + x[0]); if (el.value || el.getAttribute("aria-invalid") === "true") check(...x); }));
  recheckForm = () => { fields.forEach(x => { if ($("#" + x[0]).getAttribute("aria-invalid") === "true") check(...x); }); const o = $("#fOut"); o.textContent = ""; o.className = "form-out"; };
  let via = "wa";
  $$('button[type="submit"]', form).forEach(b => b.addEventListener("click", () => { via = b.value; }));
  form.addEventListener("submit", e => {
    e.preventDefault();
    via = e.submitter?.value || via;
    const out = $("#fOut"); out.className = "form-out"; out.textContent = "";
    if (form.elements._gotcha.value) return;                 // robô preencheu o campo escondido
    const bad = fields.filter(x => !check(...x));
    if (bad.length) { out.textContent = U().fixErrors; out.classList.add("bad"); $("#" + bad[0][0]).focus(); return; }
    const msg = composeMsg(), nome = fval("nome"), email = fval("email");
    if (via === "wa" && CONFIG.whatsapp) {
      openExternal(waUrl(msg));
      out.textContent = U().waOpened; out.classList.add("ok"); return;
    }
    if (!CONFIG.formspree || !email) {
      if (!CONFIG.email) { $("#eEmail").textContent = U().needEmail; $("#fEmail").setAttribute("aria-invalid", "true"); $("#fEmail").focus(); return; }
      location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(U().mailSubject(nome))}&body=${encodeURIComponent(msg)}`;
      out.textContent = U().mailOpened; out.classList.add("ok"); return;
    }
    const btn = $("#fSendMail"); btn.disabled = true; out.textContent = U().sending;
    const id = String(CONFIG.formspree).replace(/^https:\/\/formspree\.io\/f\//, "").replace(/\W/g, "");
    const data = new FormData(form); data.set("mensagem", msg); data.set("_replyto", email);
    fetch(`https://formspree.io/f/${id}`, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(r => { if (!r.ok) throw new Error(r.status); form.reset(); updatePreview(); out.textContent = U().sent; out.classList.add("ok"); })
      .catch(() => { out.textContent = U().sendFail; out.classList.add("bad"); })
      .finally(() => { btn.disabled = false; });
  });
})();

/* =========================================================================
   CABEÇALHO, SEÇÃO ATIVA, BARRA DO CELULAR, PROGRESSO, NAVEGAÇÃO DOS PROJETOS
   ========================================================================= */
const top = $("#top"), hero = $(".hero"), work = $("#projetos");
let lastY = scrollY, maxS = 1, heroH = 1, workTop = 0, workEnd = 1, rows = [];
const measure = () => {
  maxS = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  heroH = hero.offsetHeight || 1;
  workTop = work.offsetTop;
  workEnd = workTop + work.offsetHeight;
};
function measureProjs() {
  rows = $$(".proj").map(el => ({ i: +el.dataset.i, n: +el.dataset.n, el, top: el.getBoundingClientRect().top + scrollY, h: el.offsetHeight || 1 }));
}
let measRaf = 0;
const remeasure = () => { if (!measRaf) measRaf = requestAnimationFrame(() => { measRaf = 0; measure(); measureProjs(); }); };
measure(); addEventListener("resize", remeasure);
if (window.ResizeObserver) new ResizeObserver(remeasure).observe(document.body);
const bar = $("#progress"), pnav = $("#pnav"), desktop = matchMedia("(min-width: 1024px)");
const activeRow = mid => { let r = rows[0]; for (const row of rows) if (mid >= row.top) r = row; return r; };
let pnavN = -1;
function syncScroll() {
  const y = scrollY, mid = y + innerHeight / 2;
  top.classList.toggle("solid", y > 40);
  if (Math.abs(y - lastY) > 4) { top.classList.toggle("hide", y > lastY && y > 400 && !dlg.open && !cmd.open); lastY = y; }
  bar.style.transform = `scaleX(${Math.min(1, y / maxS)})`;
  // 01/03: aparece do primeiro ao último projeto em destaque
  const r = activeRow(mid), first = rows[0], lastR = rows[rows.length - 1];
  const inWork = desktop.matches && first && mid > first.top + innerHeight * 0.1 && mid < lastR.top + lastR.h - innerHeight * 0.2;
  pnav.classList.toggle("on", !!inWork);
  if (inWork && r) {
    if (r.n !== pnavN) { pnavN = r.n; $("#pnavI").textContent = pad(r.n + 1); $("#pnavName").textContent = cs(CASES[r.i]).name; }
    $("#pnavBar").style.transform = `scaleX(${Math.max(0, Math.min(1, (mid - r.top) / r.h))})`;
  }
  syncVitrine();
}
addEventListener("scroll", syncScroll, { passive: true });
top.addEventListener("focusin", () => top.classList.remove("hide"));
const goTo = (el, offset = -70) => {
  if (!el) return;
  const l = lenis();
  if (l) l.scrollTo(el, { offset, duration: 1.1 });
  else scrollTo({ top: el.getBoundingClientRect().top + scrollY + offset, behavior: reduce ? "auto" : "smooth" });
};
pnav.addEventListener("click", e => {
  const b = e.target.closest("[data-pgo]"); if (!b || !rows.length) return;
  const r = activeRow(scrollY + innerHeight / 2), n = Math.max(0, Math.min(rows.length - 1, (r ? r.n : 0) + +b.dataset.pgo));
  goTo(rows[n].el, 0);
});
(function spy() {
  const links = $$(".nav a"), byId = { projetos: "#projetos", outros: "#outros", stack: "#stack", sobre: "#sobre", contato: "#contato" };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => (a.getAttribute("href") === byId[e.target.id] ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["inicio", "projetos", "outros", "stack", "sobre", "contato"].forEach(id => { const s = document.getElementById(id); s && io.observe(s); });
})();
(function dock() {
  const d = $("#dock"); let after = false, atContact = false;
  const sync = () => d.classList.toggle("on", after && !atContact);
  new IntersectionObserver(([e]) => { after = !e.isIntersecting; sync(); }, { rootMargin: "0px 0px -40% 0px" }).observe(hero);
  new IntersectionObserver(([e]) => { atContact = e.isIntersecting; sync(); }, { threshold: .05 }).observe($("#contato"));
})();

/* =========================================================================
   VITRINE 3D: notebook e celular mostrando os projetos (three.js em lib/vitrine3d.min.js)
   Só no computador, com GPU de verdade e o site servido por http(s) (as capturas viram textura).
   Sem isso, o topo mostra o pôster e cada projeto mostra a moldura do navegador em HTML.
   ========================================================================= */
let vitrine = null;
function hasGPU() {
  try {
    const c = document.createElement("canvas"), gl = window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"));
    if (!gl) return false;
    const q = location.search;
    const lose = () => gl.getExtension("WEBGL_lose_context")?.loseContext();
    if (/[?&]3d=1\b/.test(q)) { lose(); return true; }
    if (/[?&]3d=0\b/.test(q)) { lose(); return false; }
    const ex = gl.getExtension("WEBGL_debug_renderer_info");
    const name = String(gl.getParameter(ex ? ex.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    lose();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
  } catch (e) { return false; }
}
function loadScript(src) { return new Promise((ok, fail) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = fail; document.head.appendChild(s); }); }
// a vitrine e o topo 3D trazem cada um o seu three.js; sem isto o segundo avisa "Multiple instances of Three.js"
const load3D = src => { try { delete window.__THREE__; } catch (e) { /* nada */ } return loadScript(src); };
let gpu = null;
const realGPU = () => { if (gpu === null) gpu = hasGPU(); return gpu; };
function syncVitrine() {
  if (!vitrine) return;
  const y = scrollY, mid = y + innerHeight / 2;
  // com o cristal no topo, o notebook só aparece quando os projetos chegam
  const crystal = html.classList.contains("prism");
  const on = desktop.matches && mid < workEnd - innerHeight * 0.15 && (!crystal || mid > workTop + innerHeight * 0.15);
  html.classList.toggle("v3d-on", on);
  vitrine.visible(on);
  if (!on) return;
  vitrine.mode(crystal ? 1 : y / (heroH * 0.8));
  // projeto ativo: o que estiver no meio da tela; a página rola na tela conforme você atravessa o projeto
  const r = activeRow(mid);
  if (!r) return;
  vitrine.project(r.n);
  vitrine.scroll((mid - r.top) / r.h);
}
if (CONFIG.vitrine3d && ONLINE && !saveData && !reduce && desktop.matches && realGPU()) {
  const start = () => load3D("lib/vitrine3d.min.js").then(() => {
    vitrine = window.Vitrine3D.mountVitrine($("#vitrine"), {
      accent: "#4f7cff", zoom: 0.84,
      screens: FEATURED.map(i => ({ desk: `assets/projetos/${CASES[i].shot}-longa.webp`, mob: `assets/projetos/${CASES[i].shot}-mob.webp` })),
      onReady: () => { html.classList.add("v3d", "v3d-ready"); measure(); measureProjs(); syncVitrine(); window.ScrollTrigger?.refresh(); if (window.ScrollTrigger) animProjs(); }
    });
  }).catch(() => { /* sem 3D: fica o pôster e as molduras em HTML */ });
  addEventListener("load", () => idle(start), { once: true });
  desktop.addEventListener("change", () => { syncVitrine(); if (window.ScrollTrigger) { animProjs(); ScrollTrigger.refresh(); } });
}

/* =========================================================================
   TOPO EM 3D: PrismHero, o cristal que refrata o nome (React + three.js em lib/prism-hero.min.js; código em app/)
   Só com GPU de verdade, sem "reduzir movimento", sem economia de dados, sem rede lenta e sem aparelho muito fraco.
   A altura do topo fica reservada desde já e o topo em HTML segura a tela até o 3D desenhar o primeiro quadro.
   Erro no WebGL ou aparelho lento demais: volta para o topo em HTML.
   ========================================================================= */
function prismProps() {
  const t = (s, r = hero) => $(s, r).textContent.trim().replace(/\s+/g, " ");
  const wa = $(".ctas .js-wa", hero);
  return {
    headline: CONFIG.nome, title: t("#h-nome"),
    eyebrow: t(".role [data-i18n]"), description: t(".lede"),
    meta: [t(".status"), ...$$(".stats div", hero).map(d => `${d.querySelector("dd").dataset.count || t("dd", d)} ${t("dt", d)}`)],
    work: { label: t('[data-i18n="ctaWork"]'), href: "#projetos" },
    chat: { label: t('[data-i18n="ctaWa"]'), href: wa.hidden ? `mailto:${CONFIG.email}` : wa.href, aria: `${t('[data-i18n="ctaWa"]')} (${U().newTab})` },
    hud: { place: "Palhoça · SC · BR", coords: "27°38′S 48°40′W", tz: "BRT", build: `v8.0 · ${lang === "en" ? EN.hudBuild : $(".hud-ver [data-i18n]").textContent}` },
    play: entered
  };
}
(function prismHero() {
  const net = navigator.connection || {};
  const fraco = /2g|3g/.test(net.effectiveType || "") || (navigator.hardwareConcurrency || 4) < 4 || (navigator.deviceMemory || 8) < 4;
  if (!CONFIG.topo3d || reduce || saveData || fraco || !realGPU()) { intro.done("scene"); return; }
  const box = document.createElement("div");
  box.className = "prism-mount";
  hero.appendChild(box);
  html.classList.add("prism");
  let dead = false;
  const off = () => {
    if (dead) return;
    dead = true;
    try { prism?.unmount(); } catch (e) { /* já desmontado */ }
    prism = null; box.remove();
    hero.classList.remove("prism-ready"); hero.setAttribute("aria-labelledby", "h-nome");
    html.classList.remove("prism");
    intro.done("scene");
    measure(); measureProjs(); syncVitrine(); window.ScrollTrigger?.refresh();
  };
  // perder o contexto do WebGL (driver, aba em segundo plano no celular) = volta para o topo em HTML
  box.addEventListener("webglcontextlost", () => setTimeout(off), true);
  const css = new Promise((ok, fail) => {
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = "css/prism-hero.css"; l.onload = ok; l.onerror = fail;
    document.head.appendChild(l);
  });
  Promise.all([css, load3D("lib/prism-hero.min.js")]).then(() => {
    if (dead) return;
    prism = window.PrismIsland.mount(box, prismProps(), {
      onReady: () => { if (dead) return; hero.classList.add("prism-ready"); hero.setAttribute("aria-labelledby", "h-prism"); intro.done("scene"); },
      onFail: () => setTimeout(off),
      checkSpeed: !/[?&]3d=1\b/.test(location.search)
    });
    whenEntered(() => prism?.update(prismProps()));      // a entrada do texto espera a tela de carregamento sair
  }).catch(off);
  setTimeout(() => intro.done("scene"), 2400);            // a tela de carregamento não espera o 3D para sempre
})();

/* =========================================================================
   DETALHES VIVOS: relógio de Palhoça, terminal do topo, contadores
   ========================================================================= */
(function clock() {
  let fmt;
  try { fmt = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }); }
  catch (e) { return; }
  const long = $$(".js-clock"), short = $$(".js-clock-short");
  const tick = () => {
    if (document.hidden) return;
    const s = fmt.format(new Date());
    long.forEach(el => { el.textContent = s; });
    short.forEach(el => { el.textContent = s.slice(0, 5); });
  };
  tick(); setInterval(tick, 1000);
})();
let termT = 0;
function renderTerm(instant) {
  const body = $("#termBody"); if (!body) return;
  clearTimeout(termT);
  const lines = U().term, P = '<span class="p">carlos@serra:~$</span> ';
  const done = n => lines.slice(0, n).map(([c, o]) => `${P}${esc(c)}\n<span class="o">${esc(o)}</span>\n`).join("");
  if (instant || reduce) { body.innerHTML = `${done(lines.length)}${P}<i class="caret"></i>`; return; }
  let li = 0, ci = 0;
  const step = () => {
    if (li >= lines.length) { body.innerHTML = `${done(lines.length)}${P}<i class="caret"></i>`; return; }
    const cmdTxt = lines[li][0];
    if (ci <= cmdTxt.length) {
      body.innerHTML = `${done(li)}${P}${esc(cmdTxt.slice(0, ci))}<i class="caret"></i>`;
      ci++; termT = setTimeout(step, ci === 1 ? 380 : 38 + Math.random() * 40);
    } else { li++; ci = 0; termT = setTimeout(step, 260); }
  };
  step();
}
function countUp() {
  if (reduce) return;
  $$(".stats dd[data-count]").forEach(dd => {
    const to = +dd.dataset.count, t0 = performance.now(), D = 1300;
    const tick = now => { const p = Math.min(1, (now - t0) / D); dd.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
}

/* =========================================================================
   ATALHOS (Ctrl K / ⌘K): ir para seções e ações rápidas, filtrando pelo texto
   ========================================================================= */
const cmd = $("#cmd");
(function palette() {
  const input = $("#cmdInput"), list = $("#cmdList");
  let items = [], sel = 0, opener = null;
  const go = id => () => goTo(document.getElementById(id), id === "inicio" ? 0 : -70);
  const all = () => {
    const c = U().cmd;
    return [
      { g: c.go, t: c.top, i: "i-up", run: go("inicio") },
      { g: c.go, t: c.work, i: "i-chev", run: go("projetos"), k: "01" },
      { g: c.go, t: c.idx, i: "i-chev", run: go("outros"), k: "02" },
      { g: c.go, t: c.stack, i: "i-chev", run: go("stack"), k: "03" },
      { g: c.go, t: c.about, i: "i-chev", run: go("sobre"), k: "04" },
      { g: c.go, t: c.contact, i: "i-chev", run: go("contato"), k: "05" },
      CONFIG.whatsapp && { g: c.act, t: c.wa, i: "i-wa", run: () => openExternal(waUrl()) },
      CONFIG.email && { g: c.act, t: c.mail, i: "i-copy", run: copyEmail },
      { g: c.act, t: c.vcard, i: "i-user", run: saveVcard },
      { g: c.act, t: c.brief, i: "i-copy", run: copyBrief },
      { g: c.act, t: c.lang, i: "i-cmd", run: () => setLang(lang === "en" ? "pt" : "en"), k: lang === "en" ? "PT" : "EN" },
      { g: c.act, t: c.gh, i: "i-gh", run: () => openExternal(`https://github.com/${CONFIG.github}`) },
      { g: c.act, t: c.code, i: "i-gh", run: () => openExternal(REPO(CONFIG.repoDoSite)) }
    ].filter(Boolean);
  };
  function draw() {
    const q = fold(input.value.trim());
    items = all().filter(x => !q || fold(`${x.g} ${x.t}`).includes(q));
    sel = Math.min(sel, Math.max(0, items.length - 1));
    // a lista só tem grupos (com nome) e opções; "nada encontrado" vai para a região de aviso logo abaixo
    const groups = [];
    items.forEach((x, n) => { let g = groups[groups.length - 1]; if (!g || g.name !== x.g) groups.push(g = { name: x.g, list: [] }); g.list.push([x, n]); });
    list.innerHTML = groups.map((g, gi) => `<div role="group" aria-labelledby="cmdg-${gi}"><div class="g" id="cmdg-${gi}" role="presentation">${esc(g.name)}</div>${
      g.list.map(([x, n]) => `<div role="option" id="cmd-${n}" data-n="${n}" aria-selected="${n === sel}">${ic(x.i)}<span>${esc(x.t)}</span>${x.k ? `<small>${esc(x.k)}</small>` : ""}</div>`).join("")}</div>`).join("");
    $("#cmdEmpty").textContent = items.length ? "" : U().cmd.none;
    if (items.length) input.setAttribute("aria-activedescendant", `cmd-${sel}`); else input.removeAttribute("aria-activedescendant");
  }
  const move = d => { if (!items.length) return; sel = (sel + d + items.length) % items.length; draw(); $(`#cmd-${sel}`)?.scrollIntoView({ block: "nearest" }); };
  const run = n => { const x = items[n]; if (!x) return; closeDlg(cmd); setTimeout(x.run, 60); };
  function open() {
    if (cmd.open) return;
    opener = document.activeElement;
    input.value = ""; sel = 0; draw();
    showDlg(cmd);
    input.focus(); lenis()?.stop();
  }
  cmd.addEventListener("close", () => { if (!dlg.open) lenis()?.start(); restoreFocus(opener, $("#cmdBtn")); opener = null; });
  cmd.addEventListener("click", e => { if (e.target === cmd) closeDlg(cmd); const o = e.target.closest('[role="option"]'); if (o) run(+o.dataset.n); });
  input.addEventListener("input", () => { sel = 0; draw(); });
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Enter") { e.preventDefault(); run(sel); }
  });
  $("#cmdBtn").addEventListener("click", open);
  addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (cmd.open) closeDlg(cmd); else if (!dlg.open) open();
    }
  });
})();

/* =========================================================================
   MOUSE: luz e coordenadas do topo, cartões da stack, cursor com anel, botões com atração,
   prévia do arquivo e a marca gigante do rodapé
   ========================================================================= */
if (finePointer && !reduce) {
  let raf = 0, ev = null;
  const hx = $("#hudX"), hy = $("#hudY"), mark = $("#footMark");
  document.addEventListener("pointermove", e => {
    ev = e;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const nx = ev.clientX / innerWidth, ny = ev.clientY / innerHeight;
      vitrine?.pointer(nx * 2 - 1, ny * 2 - 1);
      if (scrollY < heroH) {
        hero.style.setProperty("--mx", `${(nx * 100).toFixed(1)}%`); hero.style.setProperty("--my", `${(ev.clientY + scrollY) / heroH * 100}%`);
        hx.textContent = pad(Math.round(ev.clientX), 4); hy.textContent = pad(Math.round(ev.clientY), 4);
      }
      const r = mark.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) { mark.style.setProperty("--fx", `${ev.clientX - r.left}px`); mark.style.setProperty("--fy", `${ev.clientY - r.top}px`); }
      grid.pointer(ev.clientX, ev.clientY);
    });
  }, { passive: true });
  document.addEventListener("pointermove", e => {
    const card = e.target.closest?.(".skill"); if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - r.left}px`); card.style.setProperty("--y", `${e.clientY - r.top}px`);
  }, { passive: true });
  // cursor: um anel que segue o mouse (o cursor normal continua), cresce sobre links e vira "Abrir site" nas capturas
  const cur = $("#cursor"), peek = $("#peek"), peekImg = $("#peekImg");
  let tx = -100, ty = -100, x = -100, y = -100, px = -400, py = -400, craf = 0, peekOn = false;
  const loop = () => {
    x += (tx - x) * .24; y += (ty - y) * .24;
    cur.style.transform = `translate3d(${x}px,${y}px,0)`;
    if (peekOn) { px += (tx + 24 - px) * .16; py += (ty - 90 - py) * .16; peek.style.transform = `translate3d(${px}px,${py}px,0)`; }
    craf = Math.abs(tx - x) + Math.abs(ty - y) + (peekOn ? Math.abs(tx + 24 - px) + Math.abs(ty - 90 - py) : 0) > .4 ? requestAnimationFrame(loop) : 0;
  };
  html.classList.add("cursor-on");
  document.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    tx = e.clientX; ty = e.clientY;
    const t = e.target.closest ? e.target : null;
    const over = t?.closest("[data-cursor]");
    cur.classList.toggle("tag", !!over);
    cur.classList.toggle("link", !over && !!t?.closest('a, button, label.chip, [role="option"], summary, input, textarea'));
    const li = t?.closest("#idxList li[data-peek]");
    if (li) { if (peekImg.getAttribute("src") !== li.dataset.peek) peekImg.src = li.dataset.peek; if (!peekOn) { px = tx + 24; py = ty - 90; } peekOn = true; peek.classList.add("on"); }
    else if (peekOn) { peekOn = false; peek.classList.remove("on"); }
    if (!craf) craf = requestAnimationFrame(loop);
  }, { passive: true });
  document.addEventListener("pointerdown", () => cur.classList.add("press"));
  document.addEventListener("pointerup", () => cur.classList.remove("press"));
  document.documentElement.addEventListener("pointerleave", () => html.classList.remove("cursor-on"));
  document.documentElement.addEventListener("pointerenter", () => html.classList.add("cursor-on"));
  $$(".magnet").forEach(b => {
    b.addEventListener("pointermove", e => {
      const r = b.getBoundingClientRect(), dx = (e.clientX - r.left - r.width / 2) / r.width, dy = (e.clientY - r.top - r.height / 2) / r.height;
      b.style.transform = `translate(${dx * 14}px,${dy * 10}px)`;
    });
    b.addEventListener("pointerleave", () => { b.style.transform = ""; });
  });
}

/* =========================================================================
   FUNDO VIVO: grade de pontos com parallax na rolagem e uma onda passando.
   Perto do mouse os pontos viram código (e piscam); um clique solta uma onda.
   ========================================================================= */
const grid = (function () {
  const c = $("#bgGrid"), g = c.getContext("2d");
  if (!g) return { pointer() {} };
  const GAP = finePointer ? 30 : 36, R = 170, STEP = finePointer ? 33 : 50;   // ~30 quadros por segundo no computador, ~20 no celular
  let w = 0, h = 0, dpr = 1, mx = -999, my = -999, raf = 0, lastT = 0, running = false, rip = null;
  const size = () => { dpr = Math.min(devicePixelRatio || 1, 1.5); w = innerWidth; h = innerHeight; c.width = w * dpr; c.height = h * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const hash = (a, b) => { const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return s - Math.floor(s); };
  const BLUE = "rgb(143,176,255)", GREY = "rgb(232,236,242)";
  function draw(t) {
    g.globalAlpha = 1;
    g.clearRect(0, 0, w, h);
    // o cristal 3D cobre a tela inteira no topo: nada para desenhar
    if (html.classList.contains("prism") && hero.classList.contains("prism-ready") && SY < heroH - innerHeight) return;
    if (!entered) return;                              // a tela de carregamento cobre tudo
    const off = reduce ? 0 : (SY * 0.3) % GAP, time = reduce ? 0 : t / 1000, flick = Math.floor(time * 7);
    const rr = rip ? (t - rip.t) * 0.55 : -1, rLife = rip ? Math.max(0, 1 - (t - rip.t) / 1300) : 0;
    if (rip && !rLife) rip = null;
    g.font = `500 11px "JetBrains Mono", ui-monospace, monospace`; g.textAlign = "center"; g.textBaseline = "middle";
    for (let y = -GAP; y < h + GAP; y += GAP) {
      const yy = y - off;
      for (let x = GAP / 2; x < w; x += GAP) {
        const dx = x - mx, dy = yy - my, d = Math.sqrt(dx * dx + dy * dy), near = Math.max(0, 1 - d / R);
        const ring = rip ? Math.max(0, 1 - Math.abs(Math.hypot(x - rip.x, yy - rip.y) - rr) / 26) * rLife : 0;
        const wave = 0.5 + 0.5 * Math.sin(x * 0.011 + yy * 0.007 - time * 0.9);
        if (near > 0.18) {
          const k = hash(x, y + flick * 0.37);
          g.fillStyle = BLUE; g.globalAlpha = Math.min(1, 0.18 + near * 0.62);
          g.fillText(GLYPHS[(k * GLYPHS.length) | 0], x + (d ? dx / d : 0) * near * 5, yy + (d ? dy / d : 0) * near * 5);
          continue;
        }
        const s = 1.2 + near * 1.6 + ring * 1.6, lit = near > 0.02 || ring > 0.05;
        g.fillStyle = lit ? BLUE : GREY;
        g.globalAlpha = lit ? Math.min(1, 0.12 + near * 0.6 + ring * 0.6) : 0.05 + wave * 0.07;
        g.fillRect(x - s / 2, yy - s / 2, s, s);
      }
    }
  }
  function frame(t) {
    raf = 0;
    if (t - lastT > STEP) { draw(t); lastT = t; }
    if (running && !document.hidden) raf = requestAnimationFrame(frame);
  }
  const start = () => { if (!running) { running = true; if (!raf) raf = requestAnimationFrame(frame); } };
  size(); draw(0);
  addEventListener("resize", () => { size(); draw(performance.now()); });
  if (reduce) addEventListener("scroll", () => draw(0), { passive: true });
  else {
    addEventListener("load", () => idle(start), { once: true });
    document.addEventListener("visibilitychange", () => { if (!document.hidden && running && !raf) raf = requestAnimationFrame(frame); });
    if (finePointer) document.addEventListener("pointerdown", e => {
      if (e.target.closest?.("a, button, input, textarea, label, dialog, .paper")) return;
      rip = { x: e.clientX, y: e.clientY, t: performance.now() };
    });
  }
  return { pointer(x, y) { mx = x; my = y; } };
})();

/* ---------- assinatura no console, para quem abre as ferramentas do navegador ---------- */
try {
  console.log(`%c
   ___  ___  ___ ___ ___ ___ ___ ___ ___ ___ ___
  carlos@serra:~$ whoami
  > Carlos Serra · desenvolvedor full stack júnior
  > ${SITE_URL}
  > procurando um dev? ${CONFIG.email || ""}
`, "color:#8fb0ff;font:12px/1.5 ui-monospace,monospace");
} catch (e) { /* sem console */ }

/* ---------- montagem inicial ---------- */
applyStatic();
wireContact();
renderProjs();
renderOthers();
renderIndex();
updatePreview();
measureProjs();
caseFromHash();
renderTerm(true);
whenEntered(() => { renderTerm(); countUp(); });

/* =========================================================================
   ANIMAÇÕES DE ROLAGEM (GSAP + ScrollTrigger + Lenis, em lib/), depois da pintura.
   Sem as bibliotecas ou com "reduzir movimento", a página fica completa e parada.
   ========================================================================= */
if (!reduce) whenEntered(() => requestAnimationFrame(() => setTimeout(() => {
  loadScript("lib/gsap.min.js").then(() => loadScript("lib/ScrollTrigger.min.js"))
    .then(() => (finePointer ? loadScript("lib/lenis.min.js").catch(() => null) : null))
    .then(setupAnim).catch(() => { /* sem GSAP: página parada */ });
}, 0)));

// títulos: cada palavra sobe de dentro de uma máscara
function splitWords(el) {
  if (el.dataset.split === lang) return;
  el.dataset.split = lang;
  el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w"><span>${esc(w)}</span></span>`).join(" ");
}

// projetos: refeito quando o idioma troca (os blocos são redesenhados)
let projCtx = null;
function animProjs(lazy) {
  projCtx?.revert();
  projCtx = gsap.context(() => {});
  const ctx = projCtx, add = row => { if (row.isConnected && ctx === projCtx) ctx.add(() => animRow(row)); };
  $$(".proj").forEach(row => (lazy ? lazy(() => add(row)) : add(row)));
}
function animRow(row) {
  gsap.from($$(".proj-info > *", row), { y: 26, opacity: 0, duration: .8, stagger: .05, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 70%" } });
  gsap.from($$(".cfile > div", row), { x: -14, opacity: 0, duration: .6, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 55%" } });
  const big = $(".proj-big", row);
  if (big && big.offsetParent) gsap.fromTo(big, { yPercent: 30 }, { yPercent: -30, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } });
  const evo = $(".evo ol", row);
  if (evo) {
    gsap.fromTo(evo, { "--evo-line": 0 }, { "--evo-line": 1, duration: 1.1, ease: "power2.out", scrollTrigger: { trigger: evo, start: "top 92%" } });
    gsap.from($$("li", evo), { y: 18, opacity: 0, duration: .7, stagger: .12, ease: "power3.out", scrollTrigger: { trigger: evo, start: "top 92%" } });
  }
  // sem 3D: a página inteira rola dentro da moldura do navegador, e o celular anda em outra camada
  if (html.classList.contains("v3d") && desktop.matches) return;
  const media = $(".proj-media", row), view = $(".browser-view", row), img = $(".long", row);
  gsap.fromTo(media, { clipPath: "inset(12% 8% 12% 8% round 14px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: row, start: "top 75%" } });
  gsap.to(img, { y: () => -Math.max(0, img.offsetHeight - view.clientHeight), ease: "none",
    scrollTrigger: { trigger: row, start: "top 75%", end: "bottom 25%", scrub: .4, invalidateOnRefresh: true } });
  gsap.fromTo($(".phone", row), { yPercent: 16 }, { yPercent: -16, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } });
}

function setupAnim() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  html.classList.add("anim");
  if (window.Lenis) {
    try {
      const l = new Lenis({ lerp: .1, smoothWheel: true });
      window.__lenis = l; html.classList.add("lenis");
      l.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(t => l.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
      if (dlg.open || cmd.open) l.stop();
      document.addEventListener("click", e => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = e.target.closest('a[href^="#"]'); if (!a) return;
        const id = a.getAttribute("href"); if (id.length < 2 || /^#caso-/.test(id)) return;
        let t = null; try { t = document.querySelector(id); } catch (err) { return; }
        if (!t) return;
        e.preventDefault(); l.scrollTo(t, { offset: id === "#inicio" ? 0 : -70, duration: 1.3 });
        if (id === "#conteudo" || id === "#inicio") {
          const f = id === "#conteudo" ? t : (hero.classList.contains("prism-ready") && $("#h-prism")) || $("#h-nome");
          f.setAttribute("tabindex", "-1"); f.focus({ preventScroll: true });
        }
      });
    } catch (err) { /* rolagem nativa */ }
  }
  const later = [], q = fn => later.push(fn);

  /* topo: camadas em velocidades diferentes enquanto ele sai da tela */
  gsap.to(".hero-copy", { y: -90, opacity: .2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero-visual", { y: 60, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero-glow", { opacity: 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "center top", end: "bottom top", scrub: true } });

  /* faixa da stack: passa sem parar, acelera (e muda de sentido) com a rolagem e para com o mouse em cima */
  (function marquee() {
    const track = $("#marquee"); track.innerHTML += track.innerHTML;
    let x = 0, boost = 0, dir = 1, py = SY, seen = false, hold = false, half = track.scrollWidth / 2;
    new IntersectionObserver(([e]) => { seen = e.isIntersecting; }).observe(track);
    if (window.ResizeObserver) new ResizeObserver(() => { half = track.scrollWidth / 2; }).observe(track);
    track.parentElement.addEventListener("pointerenter", () => { hold = true; });
    track.parentElement.addEventListener("pointerleave", () => { hold = false; });
    gsap.ticker.add((t, dt) => {
      const v = SY - py; py = SY;
      if (v) dir = v > 0 ? 1 : -1;
      boost += (Math.min(Math.abs(v), 80) * 0.18 - boost) * 0.08;
      if (!seen || hold || !half) return;
      x -= (0.45 + boost) * dir * (dt / 16.7);
      if (x <= -half) x += half; if (x > 0) x -= half;
      track.style.transform = `translate3d(${x}px,0,0)`;
    });
  })();

  /* palavras enormes em contorno passando no fundo das seções */
  $$(".bg-word").forEach(el => gsap.fromTo(el, { xPercent: 8 }, { xPercent: -28, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));

  /* títulos: palavras sobem de uma máscara; rótulos em código se decodificam */
  $$(".split").forEach(el => q(() => {
    splitWords(el);
    gsap.from($$(".w > span", el), { yPercent: 110, duration: .9, stagger: .035, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  }));
  q(() => $$(".label").forEach(el => ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => {
    const t = $("[data-i18n]", el) || (el.dataset.i18n ? el : el.lastElementChild); if (t && !t._scr) scramble(t, t.textContent.trim(), 700);
  } })));
  q(() => $$(".sec-lede, .con-meta").forEach(el => gsap.from(el, { y: 20, opacity: 0, duration: .8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } })));
  animProjs(q);

  /* outros clientes: a imagem anda dentro da moldura e a moldura se abre */
  q(() => $$(".other-shot").forEach(a => {
    gsap.fromTo(a, { clipPath: "inset(10% 6% 10% 6% round 12px)" }, { clipPath: "inset(0% 0% 0% 0% round 12px)", duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: a, start: "top 85%" } });
    gsap.fromTo($("img", a), { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: a, start: "top bottom", end: "bottom top", scrub: true } });
  }));
  q(() => gsap.from("#index .index-head > *, #index .index-cols", { y: 24, opacity: 0, duration: .8, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: "#index", start: "top 85%" } }));
  q(() => ScrollTrigger.create({ trigger: "#idxList", start: "top 88%", once: true, onEnter: () => $$("#idxList li").forEach((li, n) => { li.style.setProperty("--i", n); li.classList.add("in"); }) }));

  /* stack: cartões entram em sequência */
  q(() => ScrollTrigger.batch(".skill", { start: "top 90%", once: true, onEnter: b => gsap.from(b, { y: 40, opacity: 0, duration: .8, stagger: .07, ease: "power3.out" }) }));

  /* sobre: retrato com parallax por dentro da moldura; a trajetória se preenche com a rolagem */
  q(() => {
    gsap.fromTo(".portrait picture", { yPercent: 6 }, { yPercent: -4, ease: "none", scrollTrigger: { trigger: ".portrait", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(".portrait", { clipPath: "inset(14% 14% 14% 14% round 20px)" }, { clipPath: "inset(0% 0% 0% 0% round 20px)", duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: ".portrait", start: "top 85%" } });
    gsap.from(".facts div", { y: 16, opacity: 0, duration: .6, stagger: .05, ease: "power3.out", scrollTrigger: { trigger: ".facts", start: "top 90%" } });
    gsap.fromTo(".tl", { "--fill": 0 }, { "--fill": 1, ease: "none", scrollTrigger: { trigger: ".tl", start: "top 80%", end: "bottom 50%", scrub: true } });
    const lis = $$(".tl li");
    lis.forEach((li, n) => ScrollTrigger.create({ trigger: ".tl", start: () => `top+=${n * 4}% 78%`, onEnter: () => li.classList.add("on"), onLeaveBack: () => li.classList.remove("on") }));
    gsap.from(lis, { y: 20, opacity: 0, duration: .7, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".tl", start: "top 88%" } });
  });

  /* contato: canais em sequência, o formulário sobe */
  q(() => {
    gsap.from(".channels .ch", { y: 26, opacity: 0, duration: .7, stagger: .07, ease: "power3.out", scrollTrigger: { trigger: ".channels", start: "top 88%" } });
    gsap.from(".brief", { y: 40, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: ".brief", start: "top 90%" } });
  });

  /* rodapé: pergunta, colunas e a marca gigante subindo letra por letra */
  q(() => {
    gsap.from(".foot-cta > *", { y: 30, opacity: 0, duration: .9, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: ".foot-cta", start: "top 90%" } });
    gsap.from(".foot-col", { y: 24, opacity: 0, duration: .7, stagger: .07, ease: "power3.out", scrollTrigger: { trigger: ".foot-cols", start: "top 92%" } });
    // a marca sobe de dentro de uma máscara (inteira, para a luz que segue o mouse continuar funcionando)
    gsap.fromTo("#footMark", { clipPath: "inset(0 0 100% 0)", y: 60 }, { clipPath: "inset(0 0 -10% 0)", y: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: "#footMark", start: "top 98%" } });
  });

  const run = () => { const fn = later.shift(); if (!fn) { ScrollTrigger.refresh(); measure(); measureProjs(); return; } fn(); idle(run); };
  idle(run);
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  addEventListener("load", () => { ScrollTrigger.refresh(); measure(); measureProjs(); });
}
})();
