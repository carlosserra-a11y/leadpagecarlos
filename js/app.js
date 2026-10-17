/* =========================================================================
   PORTFÓLIO CARLOS SERRA · versão 6.0
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
const ext = (href, label, cls = "tlink", aria = "") =>
  `<a class="${cls}" href="${href}" target="_blank" rel="noopener noreferrer"${aria ? ` aria-label="${esc(aria)}"` : ""}>${label}${ic("i-out")}</a>`;

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
  applyStatic(); renderCases(); renderOthers(); renderMore(); wireContact();
  if (dlg.open) openCase(current, true);
  if (window.ScrollTrigger) { animCases(); ScrollTrigger.refresh(); }
}
$("#langBtn").addEventListener("click", () => setLang(lang === "en" ? "pt" : "en"));

/* ---------- contato: WhatsApp, e-mail, telefone, LinkedIn, currículo ---------- */
function phoneTxt() {
  if (CONFIG.telefone) return CONFIG.telefone;
  const n = CONFIG.whatsapp.replace(/^55/, "");
  return n.length === 11 ? `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}` : `+${CONFIG.whatsapp}`;
}
const waUrl = () => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(U().waMsg)}`;
function wireContact() {
  $$(".js-wa").forEach(a => { if (CONFIG.whatsapp) a.href = waUrl(); else a.hidden = true; });
  $$(".js-phone").forEach(el => { el.textContent = CONFIG.whatsapp ? phoneTxt() : ""; });
  $$(".js-mail").forEach(a => { if (CONFIG.email) a.href = `mailto:${CONFIG.email}`; else a.closest("p, li")?.setAttribute("hidden", ""); });
  if (CONFIG.curriculo) { const cv = $("#cvBtn"); cv.href = CONFIG.curriculo; cv.hidden = false; }
  if (CONFIG.linkedin) { const li = $("#inBtn"); li.href = CONFIG.linkedin; li.hidden = false; }
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
      (dlg.open ? dlg : document.body).appendChild(ta); ta.select();
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

/* ---------- projetos em destaque ---------- */
const cs = c => (lang === "en" && c.en ? Object.assign({}, c, c.en) : c);
function evoHtml(c) {
  if (!c.evo) return "";
  const u = U();
  return `<div class="evo"><p class="evo-k">${u.evo}</p><ol>${c.evo.map(e => `
      <li><a href="${PAGES(e.repo)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(u.versionOf(c.name.replace(/ \d\.\d$/, ""), e.v))}">
        <img src="assets/projetos/${e.shot}-1-640.webp" width="640" height="400" loading="lazy" decoding="async" alt="">
        <span class="v">${e.v}${e.repo === c.repo ? `<em>${u.now}</em>` : ""}</span>
        <span class="d">${esc(lang === "en" ? e.de : e.d)}</span></a></li>`).join("")}</ol></div>`;
}
function renderCases() {
  const u = U();
  $("#cases").innerHTML = FEATURED.map((i, n) => {
    const c = cs(CASES[i]), sh = `assets/projetos/${c.shot}`;
    return `
    <article class="case" id="caso-${c.slug}-row" data-i="${i}">
      <div class="case-card">
        <div class="case-info">
          <p class="case-idx"><b>${String(n + 1).padStart(2, "0")}</b>${esc(c.client)}</p>
          <h3>${esc(c.name)}</h3>
          <p class="case-pitch">${esc(c.pitch)}</p>
          <ul class="case-did">${c.did.slice(0, 3).map(x => `<li>${esc(x)}</li>`).join("")}</ul>
          <p class="case-proof"><span>${u.check}</span>${esc(c.proof)}</p>
          <div class="tags">${c.stack.map(s => `<span class="tag">${esc(s)}</span>`).join("")}</div>
          <div class="case-acts">
            <button class="btn btn-line btn-sm" type="button" data-case="${i}">${u.details}${ic("i-arrow")}</button>
            ${ext(PAGES(c.repo), u.live, "tlink", u.liveOf(c.name))}
            ${ext(REPO(c.repo), u.code, "tlink", u.codeOf(c.name))}
          </div>
        </div>
        <div class="case-media">
          <div class="browser">
            <div class="browser-bar"><i></i><i></i><i></i><span>${CONFIG.github}.github.io/${esc(c.repo)}</span></div>
            <div class="browser-view"><img class="long" src="${sh}-longa.webp" width="960" height="1700" loading="lazy" decoding="async" alt="${esc(`${u.shotAlt} ${c.name}`)}"></div>
          </div>
          <div class="phone"><img src="${sh}-mob.webp" width="390" height="844" loading="lazy" decoding="async" alt=""></div>
          ${evoHtml(c)}
        </div>
      </div>
    </article>`;
  }).join("");
}

/* ---------- outros projetos ---------- */
function renderOthers() {
  const u = U();
  $("#others").innerHTML = OTHERS.map(i => {
    const c = cs(CASES[i]), sh = `assets/projetos/${c.shot}`;
    return `<article class="other">
      <a class="other-shot" href="${PAGES(c.repo)}" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true" data-cursor>
        <img src="${sh}-1-640.webp" srcset="${sh}-1-640.webp 640w, ${sh}-1-1280.webp 1280w" sizes="(max-width: 760px) 92vw, 600px" width="1280" height="800" loading="lazy" decoding="async" alt=""></a>
      <p class="case-idx">${esc(c.client)}</p>
      <h3>${esc(c.name)}</h3>
      <p>${esc(c.pitch)}</p>
      <div class="tags">${c.stack.map(s => `<span class="tag">${esc(s)}</span>`).join("")}</div>
      <div class="case-acts">
        <button class="btn btn-line btn-sm" type="button" data-case="${i}">${u.details}${ic("i-arrow")}</button>
        ${ext(PAGES(c.repo), u.live, "tlink", u.liveOf(c.name))}
        ${ext(REPO(c.repo), u.code, "tlink", u.codeOf(c.name))}
      </div>
    </article>`;
  }).join("");
}

/* ---------- detalhes do projeto (diálogo) ---------- */
const dlg = $("#caseDialog");
let current = 0, lastBtn = null;
function openCase(i, keep) {
  current = (i + CASES.length) % CASES.length;
  const c = cs(CASES[current]), u = U(), sh = `assets/projetos/${c.shot}`;
  const prev = CASES[(current - 1 + CASES.length) % CASES.length], next = CASES[(current + 1) % CASES.length];
  $("#caseMain").innerHTML = `
    <div><p class="label">${esc(c.client)}</p><h3 id="caseTitle">${esc(c.name)}</h3></div>
    <div class="case-gal">
      <img class="d" src="${sh}-1-1280.webp" width="1280" height="800" alt="${esc(`${u.shotAlt} ${c.name} · ${u.shotDesk}`)}" loading="lazy" decoding="async">
      <img class="m" src="${sh}-mob.webp" width="390" height="844" alt="${esc(`${u.shotAlt} ${c.name} · ${u.shotMob}`)}" loading="lazy" decoding="async">
    </div>
    <div><h4>${u.ctx}</h4><p>${esc(c.ctx)}</p></div>
    <div><h4>${u.did}</h4><ul>${c.did.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div><h4>${u.dec}</h4><ul>${c.dec.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div><h4>${u.check}</h4><p>${esc(c.proof)}</p></div>
    ${evoHtml(c)}
    <div><h4>${u.stack}</h4><div class="tags">${c.stack.map(s => `<span class="tag">${esc(s)}</span>`).join("")}</div></div>
    <div class="case-links">
      ${ext(PAGES(c.repo), u.liveFull, "btn btn-solid")}
      ${ext(REPO(c.repo), u.codeFull, "btn btn-line")}
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
document.addEventListener("click", e => {
  const b = e.target.closest("[data-case]"); if (b) { lastBtn = b; openCase(+b.dataset.case); }
});
$("#caseMain").addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) openCase(current + +b.dataset.go); });
const closeCase = () => { dlg.close ? dlg.close() : dlg.removeAttribute("open"); };
$("#caseClose").addEventListener("click", closeCase);
dlg.addEventListener("click", e => { if (e.target === dlg) closeCase(); });
dlg.addEventListener("close", () => {
  lenis()?.start();
  if (history.replaceState && /^#caso-/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
  (lastBtn || $(`[data-case="${current}"]`))?.focus(); lastBtn = null;
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

/* ---------- exercícios e primeiros passos (o resto dos repositórios) ---------- */
let extra = [];
const MESES = { pt: ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"], en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] };
const fmtDate = iso => { const [y, m, d] = iso.split("-"); return lang === "en" ? `${MESES.en[+m - 1]} ${+d}, ${y}` : `${d} ${MESES.pt[+m - 1]} ${y}`; };
const shownRepos = () => new Set(CASES.flatMap(c => [c.repo, ...(c.evo || []).map(e => e.repo)]).concat(CONFIG.repoDoSite).map(n => String(n).toLowerCase()));
function renderMore() {
  const u = U(), shown = shownRepos();
  const rest = extra.concat(REPOS).filter(r => !shown.has(r.n.toLowerCase())).sort((a, b) => b.at.localeCompare(a.at));
  $("#moreCount").textContent = rest.length;
  $("#moreList").innerHTML = rest.map(r => `<li>
      <time datetime="${r.at}">${fmtDate(r.at)}</time>
      <div><b>${esc(lang === "en" && r.te ? r.te : r.t)}</b>${r.isNew ? `<span class="new-badge">${u.newRepo}</span>` : ""}<p>${esc(lang === "en" && r.de ? r.de : r.d)}</p></div>
      <span class="more-acts">${r.pages ? ext(PAGES(r.n), u.live, "", u.liveOf(r.t)) : ""}${ext(REPO(r.n), u.code, "", u.codeOf(r.t))}</span>
    </li>`).join("");
}
if (CONFIG.buscarRepos && ONLINE) {               // repositórios novos (cache de 1 hora)
  const KEY = `gh-repos:${CONFIG.github}`;
  const merge = data => {
    const known = new Set([...shownRepos(), ...REPOS.map(r => r.n.toLowerCase())]);
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
let lastY = scrollY, maxS = 1, heroH = 1, heroPinned = false;
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
  if (!heroPinned) katana?.scroll(Math.min(1, y / heroH));
}
addEventListener("scroll", onScroll, { passive: true });
top.addEventListener("focusin", () => top.classList.remove("hide"));
(function spy() {
  const links = $$(".nav a"), byId = { projetos: "#projetos", outros: "#projetos", sobre: "#sobre", contato: "#contato" };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => (a.getAttribute("href") === byId[e.target.id] ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["inicio", "projetos", "outros", "sobre", "contato"].forEach(id => { const s = document.getElementById(id); s && io.observe(s); });
})();
(function dock() {
  const d = $("#dock"); let after = false, atContact = false;
  const sync = () => d.classList.toggle("on", after && !atContact);
  new IntersectionObserver(([e]) => { after = !e.isIntersecting; sync(); }, { rootMargin: "0px 0px -40% 0px" }).observe($(".hero"));
  new IntersectionObserver(([e]) => { atContact = e.isIntersecting; sync(); }, { threshold: .1 }).observe($("#contato"));
})();

/* ---------- zanpakutō 3D (three.js empacotado em lib/katana3d.min.js) ---------- */
let katana = null;
const stage = $("#katanaStage");
// a mesma pose do pôster (ferramentas/poster.mjs): o 3D assume o lugar da imagem sem pular
const POSE = { rz: -0.86, ry: -0.3, rx: 0.14, x: 0.09, y: -1.0, zoom: 0.81 };
/* só com GPU de verdade: em renderização por software (SwiftShader, llvmpipe) o 3D trava a página,
   então fica o pôster. ?3d=1 na URL força o 3D para testes */
function hasGPU() {
  try {
    const c = document.createElement("canvas"), gl = window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"));
    if (!gl) return false;
    if (/[?&]3d=1\b/.test(location.search)) return true;
    const ex = gl.getExtension("WEBGL_debug_renderer_info");
    const name = String(gl.getParameter(ex ? ex.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
  } catch (e) { return false; }
}
function loadScript(src) { return new Promise((ok, fail) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = fail; document.head.appendChild(s); }); }
if (CONFIG.katana3d && !saveData && hasGPU()) {
  const start = () => loadScript("lib/katana3d.min.js").then(() => {
    katana = window.Katana3D.mountKatana($("#katana3d"), { still: reduce, pose: POSE });
    requestAnimationFrame(() => stage.classList.add("ready"));
    katana.scroll(heroPinned ? 0 : Math.min(1, scrollY / heroH));
    if (html.classList.contains("bankai")) katana.bankai(true);
  }).catch(() => { /* sem 3D: fica o pôster */ });
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

/* ---------- etiqueta "Abrir site" que segue o cursor e botão com atração ---------- */
if (finePointer && !reduce) {
  const tag = $("#cursorTag"); let tx = -100, ty = -100, x = -100, y = -100, raf = 0;
  const loop = () => { x += (tx - x) * .22; y += (ty - y) * .22; tag.style.transform = `translate3d(${x + 14}px,${y + 14}px,0)`; raf = Math.abs(tx - x) + Math.abs(ty - y) > .3 ? requestAnimationFrame(loop) : 0; };
  document.addEventListener("pointermove", e => {
    const over = e.target.closest?.("[data-cursor]");
    tag.classList.toggle("on", !!over);
    if (!over) return;
    tx = e.clientX; ty = e.clientY;
    if (!tag.dataset.seen) { x = tx; y = ty; tag.dataset.seen = "1"; }
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  document.addEventListener("pointerleave", () => tag.classList.remove("on"));
  $$(".magnet").forEach(b => {
    b.addEventListener("pointermove", e => {
      const r = b.getBoundingClientRect(), dx = (e.clientX - r.left - r.width / 2) / r.width, dy = (e.clientY - r.top - r.height / 2) / r.height;
      b.style.transform = `translate(${dx * 12}px,${dy * 10}px)`;
    });
    b.addEventListener("pointerleave", () => { b.style.transform = ""; });
  });
}

/* ---------- montagem inicial ---------- */
applyStatic();
wireContact();
renderCases();
renderOthers();
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

// títulos: cada palavra sobe de dentro de uma máscara
function splitWords(el) {
  if (el.dataset.split === lang) return;
  el.dataset.split = lang;
  el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w"><span>${esc(w)}</span></span>`).join(" ");
}

// projetos em destaque: refeito quando o idioma troca (os cartões são redesenhados)
let caseCtx = null;
function animCases() {
  caseCtx?.revert();
  caseCtx = gsap.context(() => {
    const stacked = matchMedia("(min-width: 1024px) and (min-height: 760px)").matches;
    const rows = $$(".case");
    rows.forEach((row, n) => {
      const view = $(".browser-view", row), img = $(".long", row);
      // a captura da página inteira rola dentro da moldura do navegador
      gsap.to(img, { y: () => -Math.max(0, img.offsetHeight - view.clientHeight), ease: "none",
        scrollTrigger: { trigger: row, start: stacked ? "top 60%" : "top 85%", end: stacked ? "bottom top" : "bottom 15%", scrub: .4, invalidateOnRefresh: true } });
      gsap.fromTo($(".phone", row), { yPercent: 14 }, { yPercent: -14, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } });
      const evo = $(".evo ol", row);
      if (evo) {
        gsap.fromTo(evo, { "--line": 0 }, { "--line": 1, duration: 1.1, ease: "power2.out", scrollTrigger: { trigger: evo, start: "top 92%" } });
        gsap.from($$("li", evo), { y: 18, opacity: 0, duration: .7, stagger: .12, ease: "power3.out", scrollTrigger: { trigger: evo, start: "top 92%" } });
      }
      gsap.from($$(".case-info > *", row), { y: 24, opacity: 0, duration: .8, stagger: .05, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 70%" } });
      // o anterior recua quando o próximo sobe por cima
      const next = rows[n + 1];
      if (stacked && next) gsap.to($(".case-card", row), { scale: .93, opacity: .35, ease: "none", scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } });
    });
  });
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
      if (dlg.open) l.stop();
      document.addEventListener("click", e => {
        const a = e.target.closest('a[href^="#"]'); if (!a) return;
        const id = a.getAttribute("href"); if (id.length < 2) return;
        const t = document.querySelector(id); if (!t) return;
        e.preventDefault(); l.scrollTo(t, { offset: id === "#inicio" ? 0 : id === "#projetos" ? 0 : -68, duration: 1.3 });
        if (id === "#conteudo") { t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); }
      });
    } catch (err) { /* rolagem nativa */ }
  }
  const later = [], q = fn => later.push(fn);
  const mm = gsap.matchMedia();

  /* topo: no computador fica preso enquanto os projetos sobem por cima, cortando a tela na diagonal.
     Camadas em velocidades diferentes: texto 1.0, retrato 0.6, katana 0.35 (e ela sai das costas) */
  mm.add("(min-width: 1024px)", () => {
    heroPinned = true;
    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ".hero", start: "top top", end: "+=100%", pin: true, pinSpacing: false, scrub: true,
      onUpdate: st => katana?.scroll(st.progress) } });
    tl.to(".hero-copy", { y: -220, opacity: .15 }, 0)
      .to(".hero-photo", { y: -110, scale: .94, transformOrigin: "50% 100%" }, 0)
      .to(".katana-stage", { y: -60 }, 0)
      .to(".hero-glow", { opacity: .35, scale: 1.15 }, 0);
    return () => { heroPinned = false; };
  });
  mm.add("(max-width: 1023px)", () => {
    gsap.to(".hero-photo", { y: -40, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  });
  // o fio vermelho do corte se desenha quando a seção entra
  gsap.fromTo(".work", { "--draw": 0 }, { "--draw": 1, ease: "none", scrollTrigger: { trigger: ".work", start: "top bottom", end: "top 35%", scrub: true } });

  /* títulos: palavras sobem de uma máscara, uma vez */
  q(() => $$(".split").forEach(el => {
    splitWords(el);
    gsap.from($$(".w > span", el), { yPercent: 110, duration: .9, stagger: .035, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  }));
  q(() => $$(".sec-head .label, .sec-lede").forEach(el => gsap.from(el, { y: 20, opacity: 0, duration: .8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } })));

  q(animCases);

  /* outros projetos: a imagem anda dentro da moldura */
  q(() => $$(".other-shot img").forEach(img => gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } })));

  /* sobre: ficha e stack em sequência; a linha do tempo se preenche com a rolagem */
  q(() => {
    gsap.from(".facts div, .stack-rows div", { y: 16, opacity: 0, duration: .6, stagger: .05, ease: "power3.out", scrollTrigger: { trigger: ".facts", start: "top 88%" } });
    gsap.fromTo(".tl", { "--fill": 0 }, { "--fill": 1, ease: "none", scrollTrigger: { trigger: ".tl", start: "top 70%", end: "bottom 55%", scrub: true } });
    $$(".tl li").forEach(li => ScrollTrigger.create({ trigger: li, start: "top 70%", onEnter: () => li.classList.add("on"), onLeaveBack: () => li.classList.remove("on") }));
    gsap.from(".tl li", { x: -14, opacity: 0, duration: .7, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".tl", start: "top 85%" } });
  });

  /* contato */
  q(() => {
    gsap.from(".big-mail, .con-acts", { y: 24, opacity: 0, duration: .8, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".big-mail", start: "top 92%" } });
    gsap.from(".cform", { y: 30, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: ".cform", start: "top 90%" } });
  });

  const run = () => { const fn = later.shift(); if (!fn) { ScrollTrigger.refresh(); return; } fn(); idle(run); };
  idle(run);
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  addEventListener("load", () => ScrollTrigger.refresh());
}
})();
