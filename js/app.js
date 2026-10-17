/* =========================================================================
   PORTFÓLIO CARLOS SERRA · versão 5.0
   Script clássico (sem módulos): abre com dois cliques no index.html.
   Tudo começa visível; animação e 3D entram depois da primeira pintura.
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
function applyStatic() {
  html.lang = lang === "en" ? "en" : "pt-BR";
  if (lang !== shownLang) {
    $$("[data-i18n]").forEach(el => { const k = el.dataset.i18n; el.innerHTML = lang === "en" && EN[k] != null ? EN[k] : el._pt; });
    $$("[data-i18n-attr]").forEach(el => parseAttr(el).forEach(([a, k]) => el.setAttribute(a, lang === "en" && EN[k] != null ? EN[k] : el._ptAttr[a])));
    shownLang = lang;
  }
  document.title = lang === "en" ? EN.docTitle : PT_DOC.title;
  $('meta[name="description"]').content = lang === "en" ? EN.docDesc : PT_DOC.desc;
  $("#langTxt").textContent = U().langBtn;
}
function setLang(l) {
  lang = l; store.set("lang", l);
  applyStatic(); renderCases(); renderGrid(); renderMore(); wireContact();
  if ($("#caseDialog").open) openCase(current, true);
  window.ScrollTrigger?.refresh();
}
$("#langBtn").addEventListener("click", () => setLang(lang === "en" ? "pt" : "en"));

/* ---------- contato: WhatsApp, e-mail, telefone ---------- */
function phoneTxt() {
  if (CONFIG.telefone) return CONFIG.telefone;
  const n = CONFIG.whatsapp.replace(/^55/, "");
  return n.length === 11 ? `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}` : `+${CONFIG.whatsapp}`;
}
const waUrl = () => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(U().waMsg)}`;
function wireContact() {
  $$(".js-wa").forEach(a => { if (CONFIG.whatsapp) a.href = waUrl(); else a.hidden = true; });
  $$(".js-phone").forEach(el => { el.textContent = CONFIG.whatsapp ? phoneTxt() : ""; });
  $$(".js-mail").forEach(a => { if (CONFIG.email) a.href = `mailto:${CONFIG.email}`; else a.closest("li, p")?.setAttribute("hidden", ""); });
  if (CONFIG.curriculo) { const cv = $("#cvBtn"); cv.href = CONFIG.curriculo; cv.hidden = false; }
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
      ($("#caseDialog").open ? $("#caseDialog") : document.body).appendChild(ta); ta.select();
      let done = false; try { done = document.execCommand("copy"); } catch (e) { done = false; }
      ta.remove(); done ? ok() : fail();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, fallback);
    else fallback();
  });
}
document.addEventListener("click", e => {
  const c = e.target.closest("[data-copy='email']");
  if (c && CONFIG.email) copyText(CONFIG.email).then(() => announce(U().copied(CONFIG.email)), () => announce(U().copyFail(CONFIG.email)));
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
$("#copyBrief").addEventListener("click", () => copyText(briefText()).then(() => announce(U().briefCopied), () => announce(U().copyFail("…"))));
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

/* ---------- trabalhos selecionados ---------- */
const cs = c => (lang === "en" && c.en ? Object.assign({}, c, c.en) : c);
const saveData = !!(navigator.connection && navigator.connection.saveData);
function renderCases() {
  const u = U();
  $("#cases").innerHTML = CASES.map((c0, i) => {
    const c = cs(c0), sh = `assets/projetos/${c.shot}`;
    return `
    <article class="case" id="caso-${c.slug}-row" data-i="${i}">
      <div class="case-info">
        <p class="case-idx"><b>${String(i + 1).padStart(2, "0")}</b>${esc(c.client)}</p>
        <h3>${esc(c.name)}</h3>
        <p class="case-pitch">${esc(c.pitch)}</p>
        <ul class="case-did">${c.did.slice(0, 3).map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        <div class="tags">${c.stack.map(s => `<span class="tag">${esc(s)}</span>`).join("")}</div>
        <div class="case-acts">
          <button class="btn btn-line btn-sm" type="button" data-case="${i}">${u.caseBtn}${ic("i-arrow")}</button>
          <a class="tlink" href="${PAGES(c.repo)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(u.liveOf(c.name))}">${u.live}${ic("i-out")}</a>
          <a class="tlink" href="${REPO(c.repo)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(u.codeOf(c.name))}">${u.code}${ic("i-out")}</a>
        </div>
      </div>
      <div class="case-media">
        <div class="browser" data-layer="browser">
          <div class="browser-bar"><i></i><i></i><i></i><span>${CONFIG.github}.github.io/${esc(c.repo)}</span></div>
          <div class="browser-view" data-video="${sh}">
            <img src="${sh}-1-640.webp" srcset="${sh}-1-640.webp 640w, ${sh}-1-1280.webp 1280w" sizes="(max-width: 900px) 92vw, 660px" width="1280" height="800" loading="lazy" decoding="async" alt="${esc(`${u.shotAlt} ${c.name}`)}">
          </div>
        </div>
        <div class="phone" data-layer="phone"><img src="${sh}-mob.webp" width="390" height="844" loading="lazy" decoding="async" alt=""></div>
      </div>
    </article>`;
  }).join("");
  if (finePointer && !reduce && !saveData) $$(".case").forEach(row => {
    const view = $(".browser-view", row); let v = null;
    row.addEventListener("pointerenter", () => {
      if (!v) {
        v = document.createElement("video");
        v.muted = true; v.loop = true; v.playsInline = true; v.preload = "none"; v.setAttribute("aria-hidden", "true");
        v.innerHTML = `<source src="${view.dataset.video}.webm" type="video/webm"><source src="${view.dataset.video}.mp4" type="video/mp4">`;
        v.addEventListener("playing", () => v.classList.add("on"));
        v.lastElementChild.addEventListener("error", () => { v.remove(); v = null; });
        view.appendChild(v);
      }
      const p = v.play(); if (p && p.catch) p.catch(() => {});
    });
    row.addEventListener("pointerleave", () => { if (v) { v.pause(); v.classList.remove("on"); } });
  });
}

/* ---------- estudo de caso (diálogo) ---------- */
const dlg = $("#caseDialog");
let current = 0, lastBtn = null;
function openCase(i, keep) {
  current = (i + CASES.length) % CASES.length;
  const c = cs(CASES[current]), u = U(), sh = `assets/projetos/${c.shot}`;
  const prev = CASES[(current - 1 + CASES.length) % CASES.length], next = CASES[(current + 1) % CASES.length];
  $("#caseMain").innerHTML = `
    <div><p class="label"><span class="num">${String(current + 1).padStart(2, "0")}</span>${esc(c.client)}</p><h3 id="caseTitle">${esc(c.name)}</h3></div>
    <div class="case-gal">
      <img class="d" src="${sh}-1-1280.webp" width="1280" height="800" alt="${esc(`${u.shotAlt} ${c.name} · ${u.shotDesk}`)}" loading="lazy" decoding="async">
      <img class="m" src="${sh}-mob.webp" width="390" height="844" alt="${esc(`${u.shotAlt} ${c.name} · ${u.shotMob}`)}" loading="lazy" decoding="async">
    </div>
    <div><h4>${u.ctx}</h4><p>${esc(c.ctx)}</p></div>
    <div><h4>${u.did}</h4><ul>${c.did.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div><h4>${u.dec}</h4><ul>${c.dec.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div><h4>${u.stack}</h4><div class="tags">${c.stack.map(s => `<span class="tag">${esc(s)}</span>`).join("")}</div></div>
    <div class="case-links">
      <a class="btn btn-solid" href="${PAGES(c.repo)}" target="_blank" rel="noopener noreferrer">${u.liveFull}${ic("i-out")}</a>
      <a class="btn btn-line" href="${REPO(c.repo)}" target="_blank" rel="noopener noreferrer">${u.codeFull}${ic("i-out")}</a>
    </div>
    <nav class="case-nav" aria-label="${u.prev} / ${u.next}">
      <button type="button" data-go="-1"><small>← ${u.prev}</small>${esc(prev.name)}</button>
      <button type="button" data-go="1"><small>${u.next} →</small>${esc(next.name)}</button>
    </nav>`;
  if (!dlg.open) {
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    $("#caseClose").focus();
    lenis()?.stop();
  } else if (!keep) { $("#caseTitle").setAttribute("tabindex", "-1"); $("#caseTitle").focus(); }
  $(".case-box").scrollTop = 0;
  if (history.replaceState) history.replaceState(null, "", `#caso-${CASES[current].slug}`);
}
$("#cases").addEventListener("click", e => { const b = e.target.closest("[data-case]"); if (b) { lastBtn = b; openCase(+b.dataset.case); } });
$("#caseMain").addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) openCase(current + +b.dataset.go); });
const closeCase = () => { dlg.close ? dlg.close() : dlg.removeAttribute("open"); };
$("#caseClose").addEventListener("click", closeCase);
dlg.addEventListener("click", e => { if (e.target === dlg) closeCase(); });
dlg.addEventListener("close", () => {
  lenis()?.start();
  if (history.replaceState && /^#caso-/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
  (lastBtn || $(`.case[data-i="${current}"] [data-case]`))?.focus(); lastBtn = null;
});
dlg.addEventListener("keydown", e => {
  if (/^(input|textarea)$/i.test(e.target.tagName)) return;
  if (e.key === "ArrowRight") openCase(current + 1);
  if (e.key === "ArrowLeft") openCase(current - 1);
});
function caseFromHash() {
  const m = location.hash.match(/^#caso-(.+)$/); if (!m) return;
  const i = CASES.findIndex(c => c.slug === m[1]); if (i > -1) openCase(i);
}
addEventListener("hashchange", caseFromHash);

/* ---------- todos os projetos ---------- */
let cat = "todos", extra = [];
const MESES = { pt: ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"], en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] };
const fmtDate = iso => { const [y, m, d] = iso.split("-"); return lang === "en" ? `${MESES.en[+m - 1]} ${+d}, ${y}` : `${d} ${MESES.pt[+m - 1]} ${y}`; };
function renderGrid() {
  const u = U(), list = PROJECTS.filter(p => cat === "todos" || p.c === cat);
  const counts = PROJECTS.reduce((a, p) => (a[p.c] = (a[p.c] || 0) + 1, a), {});
  const opts = [["todos", u.all, PROJECTS.length], ...["sistema", "negocio", "inicio", "fmp"].filter(k => counts[k]).map(k => [k, u.cats[k], counts[k]])];
  $("#filters").innerHTML = opts.map(([k, l, n]) => `<button type="button" data-cat="${k}" aria-pressed="${cat === k}">${esc(l)}<small>${n}</small></button>`).join("");
  $("#grid").innerHTML = list.map(p => {
    const sh = `assets/projetos/${p.shot}`;
    return `<article class="card">
      <a class="card-shot" href="${PAGES(p.repo)}" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">
        <img src="${sh}-1-640.webp" width="640" height="400" loading="lazy" decoding="async" alt=""><span class="card-cat">${esc(u.cats[p.c])}</span></a>
      <h3>${esc(p.t)}</h3>
      <p>${esc(lang === "en" ? p.de : p.d)}</p>
      <div class="tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      <div class="card-acts">
        <a href="${PAGES(p.repo)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(u.liveOf(p.t))}">${u.live}${ic("i-out")}</a>
        <a href="${REPO(p.repo)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(u.codeOf(p.t))}">${u.code}${ic("i-out")}</a>
      </div>
    </article>`;
  }).join("");
}
$("#filters").addEventListener("click", e => {
  const b = e.target.closest("[data-cat]"); if (!b) return;
  cat = b.dataset.cat; renderGrid();
  if (window.gsap && !reduce) gsap.from("#grid .card", { y: 24, opacity: 0, duration: .5, stagger: .04, ease: "power3.out" });
  window.ScrollTrigger?.refresh();
});
function renderMore() {
  const u = U(), shown = new Set(PROJECTS.map(p => p.repo.toLowerCase()).concat(String(CONFIG.repoDoSite).toLowerCase()));
  const rest = extra.concat(REPOS).filter(r => !shown.has(r.n.toLowerCase())).sort((a, b) => b.at.localeCompare(a.at));
  $("#moreCount").textContent = rest.length;
  $("#moreList").innerHTML = rest.map(r => `<li>
      <time datetime="${r.at}">${fmtDate(r.at)}</time>
      <div><b>${esc(lang === "en" && r.te ? r.te : r.t)}</b>${r.isNew ? `<span class="new-badge">${u.newRepo}</span>` : ""}<p>${esc(lang === "en" && r.de ? r.de : r.d)}</p></div>
      <span class="card-acts">${r.pages ? `<a href="${PAGES(r.n)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(u.liveOf(r.t))}">${u.live}${ic("i-out")}</a>` : ""}<a href="${REPO(r.n)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(u.codeOf(r.t))}">${u.code}${ic("i-out")}</a></span>
    </li>`).join("");
}
if (CONFIG.buscarRepos && ONLINE) {               // repositórios novos (cache de 1 hora)
  const KEY = `gh-repos:${CONFIG.github}`;
  const merge = data => {
    const known = new Set(REPOS.map(r => r.n.toLowerCase()).concat(PROJECTS.map(p => p.repo.toLowerCase()), String(CONFIG.repoDoSite).toLowerCase()));
    extra = data.filter(g => !g.fork && !known.has(g.name.toLowerCase())).map(g => ({
      n: g.name, t: g.name.replace(/[-_]/g, " "), d: g.description || UI.pt.newDesc, de: g.description || UI.en.newDesc,
      at: (g.pushed_at || g.created_at || "").slice(0, 10), pages: !!g.has_pages, isNew: true }));
    if (extra.length) renderMore();
  };
  let cached = null;
  try { cached = JSON.parse(store.get(KEY) || "null"); } catch (e) { cached = null; }
  if (cached && Date.now() - cached.t < 36e5 && Array.isArray(cached.data)) merge(cached.data);
  else fetch(`https://api.github.com/users/${CONFIG.github}/repos?per_page=100&sort=pushed`)
    .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(data => {
      const slim = data.map(g => ({ name: g.name, description: g.description, fork: g.fork, pushed_at: g.pushed_at, created_at: g.created_at, has_pages: g.has_pages }));
      store.set(KEY, JSON.stringify({ t: Date.now(), data: slim })); merge(slim);
    }).catch(() => { /* sem rede ou limite da API: fica a lista do arquivo */ });
}

/* ---------- formulário: Formspree, ou o e-mail com a mensagem pronta ---------- */
(function form() {
  const f = $("#cform");
  if (!CONFIG.formspree && !CONFIG.email) { f.hidden = true; return; }
  const fields = [["fNome", "eNome", v => v.trim().length >= 2, "errName"], ["fEmail", "eEmail", v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), "errEmail"], ["fMsg", "eMsg", v => v.trim().length >= 10, "errMsg"]];
  const check = (id, err, ok, key) => { const el = $("#" + id), good = ok(el.value); el.setAttribute("aria-invalid", String(!good)); $("#" + err).textContent = good ? "" : U()[key]; return good; };
  fields.forEach(x => $("#" + x[0]).addEventListener("blur", () => { if ($("#" + x[0]).value) check(...x); }));
  f.addEventListener("submit", e => {
    e.preventDefault();
    const out = $("#fOut"); out.className = "form-out";
    const bad = fields.filter(x => !check(...x));
    if (bad.length) { out.textContent = U().fixErrors; out.classList.add("bad"); $("#" + bad[0][0]).focus(); return; }
    const nome = $("#fNome").value.trim(), email = $("#fEmail").value.trim(), msg = $("#fMsg").value.trim();
    if (!CONFIG.formspree) {
      location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(U().mailSubject(nome))}&body=${encodeURIComponent(`${msg}\n\n${nome} · ${email}`)}`;
      out.textContent = U().mailOpened; out.classList.add("ok"); return;
    }
    const btn = $("#fSend"); btn.disabled = true; out.textContent = U().sending;
    const id = String(CONFIG.formspree).replace(/^https:\/\/formspree\.io\/f\//, "").replace(/\W/g, "");
    fetch(`https://formspree.io/f/${id}`, { method: "POST", body: new FormData(f), headers: { Accept: "application/json" } })
      .then(r => { if (!r.ok) throw new Error(r.status); f.reset(); out.textContent = U().sent; out.classList.add("ok"); })
      .catch(() => { out.textContent = U().sendFail; out.classList.add("bad"); })
      .finally(() => { btn.disabled = false; });
  });
})();

/* ---------- cabeçalho, seção ativa, barra do celular, progresso ---------- */
const top = $("#top");
let lastY = scrollY, maxS = 1, heroH = 1;
const measure = () => { maxS = Math.max(1, document.documentElement.scrollHeight - innerHeight); heroH = $(".hero").offsetHeight || 1; };
measure(); addEventListener("resize", measure);
if (window.ResizeObserver) new ResizeObserver(measure).observe(document.body);
const bar = $("#progress");
function onScroll() {
  const y = scrollY;
  top.classList.toggle("solid", y > 40);
  if (Math.abs(y - lastY) > 4) top.classList.toggle("hide", y > lastY && y > 400 && !dlg.open);
  lastY = y;
  bar.style.transform = `scaleX(${Math.min(1, y / maxS)})`;
  katana?.scroll(Math.min(1, y / heroH));
}
addEventListener("scroll", onScroll, { passive: true });
top.addEventListener("focusin", () => top.classList.remove("hide"));
(function spy() {
  const links = $$(".nav a"), map = new Map(links.map(a => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.removeAttribute("aria-current"));
    map.get(e.target.id)?.setAttribute("aria-current", "true");
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["inicio", "trabalhos", "projetos", "processo", "trajetoria", "sobre", "contato"].forEach(id => { const s = document.getElementById(id); s && io.observe(s); });
})();
(function dock() {
  const d = $("#dock"); let after = false, atContact = false;
  const sync = () => d.classList.toggle("on", after && !atContact);
  new IntersectionObserver(([e]) => { after = !e.isIntersecting; sync(); }, { rootMargin: "0px 0px -40% 0px" }).observe($(".hero"));
  new IntersectionObserver(([e]) => { atContact = e.isIntersecting; sync(); }, { threshold: .1 }).observe($("#contato"));
})();

/* contadores do hero */
if (!reduce) $$("[data-count]").forEach(el => {
  const end = +el.dataset.count, t0 = performance.now() + 500, dur = 1300;
  el.textContent = "0";
  (function step(now) {
    const t = Math.min(1, Math.max(0, (now - t0) / dur));
    el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(step);
  })(performance.now());
});

/* ---------- zanpakutō 3D (three.js empacotado em lib/katana3d.min.js) ---------- */
let katana = null;
const stage = $("#katanaStage");
/* só com GPU de verdade: em renderização por software (SwiftShader, llvmpipe) o 3D trava a página, então fica o SVG.
   ?3d=1 na URL força o 3D para testes */
function hasGPU() {
  try {
    const c = document.createElement("canvas"), gl = window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"));
    if (!gl) return false;
    if (/[?&]3d=1\b/.test(location.search)) return true;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const name = String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
  } catch (e) { return false; }
}
function loadScript(src) { return new Promise((ok, fail) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = fail; document.head.appendChild(s); }); }
if (CONFIG.katana3d && !saveData && hasGPU()) {
  const start = () => loadScript("lib/katana3d.min.js").then(() => {
    katana = window.Katana3D.mountKatana($("#katana3d"), { still: reduce, rotZ: -0.82, zoom: 0.8 });
    requestAnimationFrame(() => stage.classList.add("ready"));
    katana.scroll(Math.min(1, scrollY / heroH));
    if (html.classList.contains("bankai")) katana.bankai(true);
  }).catch(() => { /* sem 3D: fica o desenho em SVG */ });
  addEventListener("load", () => idle(start), { once: true });
}
if (finePointer) $(".hero").addEventListener("pointermove", e => {
  katana?.pointer(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1);
}, { passive: true });

/* ---------- modo Bankai (botão no rodapé ou tecla B) ---------- */
const bankaiBtn = $("#bankai");
function toggleBankai() {
  const on = bankaiBtn.getAttribute("aria-pressed") !== "true";
  bankaiBtn.setAttribute("aria-pressed", String(on));
  html.classList.toggle("bankai", on);
  katana?.bankai(on);
  announce(on ? U().bankaiOn : U().bankaiOff);
}
bankaiBtn.addEventListener("click", toggleBankai);
addEventListener("keydown", e => {
  if (e.ctrlKey || e.metaKey || e.altKey || dlg.open) return;
  if (/^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable) return;
  if (e.key.toLowerCase() === "b") toggleBankai();
});

/* ---------- montagem inicial ---------- */
applyStatic();
wireContact();
renderCases();
renderGrid();
renderMore();
caseFromHash();

/* =========================================================================
   ANIMAÇÕES DE ROLAGEM (GSAP + ScrollTrigger + Lenis, em lib/), depois da pintura.
   Sem as bibliotecas ou com "reduzir movimento", a página fica completa e parada.
   ========================================================================= */
if (!reduce) requestAnimationFrame(() => setTimeout(() => {
  loadScript("lib/gsap.min.js").then(() => loadScript("lib/ScrollTrigger.min.js"))
    .then(() => (finePointer ? loadScript("lib/lenis.min.js").catch(() => null) : null))
    .then(setupAnim).catch(() => { /* sem GSAP: página parada */ });
}, 0));

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
      if (dlg.open) l.stop();
      document.addEventListener("click", e => {
        const a = e.target.closest('a[href^="#"]'); if (!a) return;
        const id = a.getAttribute("href"); if (id.length < 2) return;
        const t = document.querySelector(id); if (!t) return;
        e.preventDefault(); l.scrollTo(t, { offset: id === "#inicio" ? 0 : -72, duration: 1.3 });
        if (id === "#conteudo") { t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); }
      });
    } catch (err) { /* rolagem nativa */ }
  }
  const later = [], q = fn => later.push(fn);

  /* parallax: cada camada com a própria velocidade (data-speed) */
  $$("[data-speed]").forEach(el => {
    const sp = parseFloat(el.dataset.speed) || 0;
    gsap.to(el, { yPercent: sp * 100, ease: "none", scrollTrigger: { trigger: el.closest("section"), start: "top top", end: "bottom top", scrub: true } });
  });
  /* no celular o hero é alto (foto em cima): o texto não esmaece enquanto ainda está sendo lido */
  if (matchMedia("(min-width: 901px)").matches) gsap.to(".hero-copy", { y: -60, opacity: .35, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".katana-stage", { yPercent: -16, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* títulos e textos de seção entram de baixo, uma vez */
  q(() => $$(".sec-head, .about-copy > *, .stack, .clients-in").forEach(el => gsap.from(el, { y: 36, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } })));

  /* trabalhos: o navegador e o celular andam em velocidades diferentes (profundidade) */
  q(() => $$(".case").forEach(row => {
    const media = $(".case-media", row);
    gsap.fromTo($(".browser", row), { yPercent: 6 }, { yPercent: -6, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo($(".phone", row), { yPercent: 22 }, { yPercent: -22, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(media, { clipPath: "inset(12% 8% 12% 8% round 10px)", opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: row, start: "top 80%" } });
    gsap.from($$(".case-info > *", row), { y: 24, opacity: 0, duration: .8, stagger: .06, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 78%" } });
  }));

  /* grade de projetos e passos */
  q(() => {
    ScrollTrigger.batch("#grid .card", { start: "top 92%", once: true, onEnter: b => gsap.from(b, { y: 40, opacity: 0, duration: .8, stagger: .07, ease: "power3.out" }) });
    gsap.from(".steps li", { y: 30, opacity: 0, duration: .8, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".steps", start: "top 85%" } });
    gsap.from(".stack-rows div", { x: -20, opacity: 0, duration: .6, stagger: .05, ease: "power3.out", scrollTrigger: { trigger: ".stack-rows", start: "top 85%" } });
    gsap.from(".channels li", { y: 24, opacity: 0, duration: .7, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".channels", start: "top 88%" } });
  });

  /* trajetória: no computador, a trilha anda na horizontal enquanto a seção fica presa */
  q(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const track = $("#track"), wrap = $("#trackWrap");
      const dist = () => Math.max(0, track.scrollWidth - wrap.clientWidth + 40);
      gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: ".journey", start: "top top", end: () => `+=${dist()}`, pin: true, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1 } });
    });
    mm.add("(max-width: 900px)", () => {
      gsap.from("#track li", { x: -20, opacity: 0, duration: .6, stagger: .06, ease: "power3.out", scrollTrigger: { trigger: "#track", start: "top 85%" } });
    });
  });

  const run = () => { const fn = later.shift(); if (!fn) { ScrollTrigger.refresh(); return; } fn(); idle(run); };
  idle(run);
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  addEventListener("load", () => ScrollTrigger.refresh());
}
})();
