/* Zanpakutō em 3D (three.js), modelada só com código: nenhum arquivo de modelo externo.
   Lâmina negra com curvatura (sori) e ponta (kissaki), faixa de têmpera (hamon) prateada,
   habaki, tsuba oval, cabo com trançado em losangos (tsuka-ito) e corrente no pomo.
   Empacotado por ferramentas/build-katana.mjs em lib/katana3d.min.js (script clássico). */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Shape, ShapeGeometry, ExtrudeGeometry,
  MeshPhysicalMaterial, MeshStandardMaterial, MeshBasicMaterial, CylinderGeometry, TorusGeometry, BoxGeometry,
  SphereGeometry, CanvasTexture, RepeatWrapping, SRGBColorSpace, ACESFilmicToneMapping, PMREMGenerator,
  Color, DirectionalLight, PointLight, AmbientLight, BackSide, Float32BufferAttribute
} from "three";

const BLADE = 3.3;                       // comprimento da lâmina
const sori = x => 0.24 * Math.pow(x / BLADE, 2);   // curvatura
const width = t => 0.18 - 0.04 * t;      // a lâmina afina até a ponta

function bladeShapes() {
  const N = 48, xEnd = BLADE - 0.3;
  const ha = [], mune = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, x = t * xEnd, c = sori(x), w = width(t);
    ha.push([x, c - w / 2]); mune.push([x, c + w / 2]);
  }
  const tip = [BLADE, sori(BLADE) + width(1) * 0.28];
  const blade = new Shape();
  blade.moveTo(ha[0][0], ha[0][1]);
  ha.forEach(([x, y]) => blade.lineTo(x, y));
  const [hx, hy] = ha[N];
  blade.quadraticCurveTo(BLADE - 0.03, hy + 0.01, tip[0], tip[1]);   // o fio sobe até a ponta
  blade.lineTo(mune[N][0], mune[N][1]);                                // yokote
  for (let i = N; i >= 0; i--) blade.lineTo(mune[i][0], mune[i][1]);
  blade.closePath();

  // hamon: faixa ondulada ao longo do fio, nos dois lados da lâmina
  const hamon = new Shape();
  hamon.moveTo(ha[0][0], ha[0][1]);
  ha.forEach(([x, y]) => hamon.lineTo(x, y));
  hamon.quadraticCurveTo(BLADE - 0.03, hy + 0.01, tip[0], tip[1] - 0.005);
  for (let i = N; i >= 0; i--) {
    const t = i / N, [x, y] = ha[i], w = width(t);
    hamon.lineTo(x, y + w * (0.3 + 0.07 * Math.sin(t * 38) + 0.03 * Math.sin(t * 91)));
  }
  hamon.closePath();
  return { blade, hamon };
}

function itoTexture() {                  // tsuka-ito: losangos de seda carmim sobre preto
  const c = document.createElement("canvas"); c.width = 512; c.height = 128;
  const g = c.getContext("2d");
  g.fillStyle = "#0c0c0e"; g.fillRect(0, 0, 512, 128);
  for (let i = 0; i < 8; i++) {
    const x = i * 64;
    g.fillStyle = "#8f0f22";
    g.beginPath(); g.moveTo(x, 64); g.lineTo(x + 32, 8); g.lineTo(x + 64, 64); g.lineTo(x + 32, 120); g.closePath(); g.fill();
    g.fillStyle = "#c81a33";
    g.beginPath(); g.moveTo(x + 8, 64); g.lineTo(x + 32, 20); g.lineTo(x + 56, 64); g.lineTo(x + 32, 108); g.closePath(); g.fill();
    g.fillStyle = "#e7dccb";                                         // samegawa aparecendo no centro
    g.beginPath(); g.moveTo(x + 24, 64); g.lineTo(x + 32, 50); g.lineTo(x + 40, 64); g.lineTo(x + 32, 78); g.closePath(); g.fill();
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace; t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(1, 1); t.anisotropy = 4;
  return t;
}

function studioEnvironment(renderer) {   // estúdio feito em código: reflexos nítidos sem baixar HDR
  const env = new Scene();
  const room = new SphereGeometry(20, 32, 16);
  const cols = [], top = new Color("#5a6072"), bottom = new Color("#0a0a0d");
  const pos = room.attributes.position;
  for (let i = 0; i < pos.count; i++) { const k = (pos.getY(i) + 20) / 40; const c = bottom.clone().lerp(top, k); cols.push(c.r, c.g, c.b); }
  room.setAttribute("color", new Float32BufferAttribute(cols, 3));
  env.add(new Mesh(room, new MeshBasicMaterial({ vertexColors: true, side: BackSide })));
  const panel = (w, h, x, y, z, ry, color, k) => {
    const m = new Mesh(new BoxGeometry(w, h, 0.1), new MeshBasicMaterial({ color: new Color(color).multiplyScalar(k) }));
    m.position.set(x, y, z); m.rotation.y = ry; env.add(m);
  };
  panel(16, 2.6, 0, 9, -5, 0, "#ffffff", 9);       // softbox comprida: o brilho que corre pela lâmina
  panel(4, 12, -11, 2, 2, Math.PI / 2, "#dfe6ff", 5);
  panel(10, 1.4, 0, -6, 6, 0, "#c9d2e6", 2.5);   // rebatedor de baixo: o fio aparece também na parte de baixo
  panel(3, 8, 11, 0, -3, -Math.PI / 2, "#ff2a45", 2.6);   // luz de contorno carmim
  const pm = new PMREMGenerator(renderer);
  const tex = pm.fromScene(env, 0.035).texture;
  pm.dispose();
  return tex;
}

export function mountKatana(canvas, opts = {}) {
  const mobile = matchMedia("(max-width: 760px)").matches;
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: !mobile, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 1.75));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  scene.environment = studioEnvironment(renderer);
  const camera = new PerspectiveCamera(26, 1, 0.1, 50);
  camera.position.set(0, 0, 9);

  // ---------- materiais ----------
  const steel = new MeshPhysicalMaterial({ color: "#2a2e38", metalness: 1, roughness: 0.26, clearcoat: 0.8, clearcoatRoughness: 0.15 });
  const edge = new MeshPhysicalMaterial({ color: "#eef1f6", metalness: 0.85, roughness: 0.16, emissive: new Color("#ff1f3d"), emissiveIntensity: 0 });
  const edgeBase = new Color("#eef1f6");
  const brass = new MeshStandardMaterial({ color: "#b48a4a", metalness: 1, roughness: 0.32 });
  const iron = new MeshStandardMaterial({ color: "#1d1b1c", metalness: 0.85, roughness: 0.45 });
  const crimson = new MeshStandardMaterial({ color: "#a3122a", metalness: 0.4, roughness: 0.35, emissive: new Color("#ff1f3d"), emissiveIntensity: 0 });
  const ito = new MeshStandardMaterial({ map: itoTexture(), roughness: 0.85, metalness: 0.05 });

  // ---------- peças ----------
  const sword = new Group();
  const { blade, hamon } = bladeShapes();
  const depth = 0.028, bevel = 0.013;
  const bladeGeo = new ExtrudeGeometry(blade, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 32, steps: 1 });
  bladeGeo.translate(0, 0, -depth / 2);
  sword.add(new Mesh(bladeGeo, steel));
  const hamonGeo = new ShapeGeometry(hamon, 32);
  const zFace = depth / 2 + bevel + 0.0015;
  const h1 = new Mesh(hamonGeo, edge); h1.position.z = zFace; sword.add(h1);
  const h2 = new Mesh(hamonGeo, edge); h2.position.z = -zFace; h2.rotation.y = Math.PI; h2.scale.x = -1; sword.add(h2);

  const habaki = new Mesh(new BoxGeometry(0.16, 0.22, 0.09), brass); habaki.position.set(0.02, 0, 0); sword.add(habaki);
  const tsuba = new Mesh(new CylinderGeometry(0.36, 0.36, 0.05, 64), iron);
  tsuba.rotation.z = Math.PI / 2; tsuba.scale.set(1, 1, 0.78); tsuba.position.x = -0.09; sword.add(tsuba);
  const rim = new Mesh(new TorusGeometry(0.36, 0.014, 10, 80), crimson);
  rim.rotation.y = Math.PI / 2; rim.scale.set(0.78, 1, 1); rim.position.x = -0.09; sword.add(rim);
  const seppa = new Mesh(new CylinderGeometry(0.15, 0.15, 0.03, 32), brass);
  seppa.rotation.z = Math.PI / 2; seppa.position.x = -0.135; sword.add(seppa);
  const tsukaLen = 1.05;
  const tsuka = new Mesh(new CylinderGeometry(0.085, 0.095, tsukaLen, 40, 1, true), ito);
  tsuka.rotation.z = Math.PI / 2; tsuka.scale.set(1, 1, 0.78); tsuka.position.x = -0.15 - tsukaLen / 2; sword.add(tsuka);
  ito.map.repeat.set(1, 4);
  const kashira = new Mesh(new CylinderGeometry(0.088, 0.075, 0.08, 32), iron);
  kashira.rotation.z = Math.PI / 2; kashira.scale.set(1, 1, 0.78); kashira.position.x = -0.15 - tsukaLen - 0.04; sword.add(kashira);

  // corrente no pomo (como a da Tensa Zangetsu), balança de leve
  const chain = new Group(); chain.position.set(kashira.position.x - 0.05, 0, 0);
  const linkGeo = new TorusGeometry(0.045, 0.011, 8, 20);
  const links = [];
  for (let i = 0; i < 6; i++) {
    const l = new Mesh(linkGeo, iron);
    l.position.set(-0.07 * i, -0.02 * i * i * 0.4, 0);
    l.rotation.x = i % 2 ? Math.PI / 2 : 0; l.rotation.z = Math.PI / 2;
    chain.add(l); links.push(l);
  }
  sword.add(chain);

  sword.position.x = -1.0;                 // pivô no meio da espada (do pomo à ponta)
  const pivot = new Group(); pivot.add(sword); scene.add(pivot);

  // ---------- luzes ----------
  scene.add(new AmbientLight("#ffffff", 0.45));
  const key = new DirectionalLight("#ffffff", 2.6); key.position.set(3, 5, 6); scene.add(key);
  const rimLight = new PointLight("#ff2340", 6, 12, 1.6); rimLight.position.set(-2, -1.5, -2.5); scene.add(rimLight);
  const glint = new PointLight("#ffffff", 0, 3.2, 2); glint.position.set(0, 0.6, 1.1); scene.add(glint);

  // ---------- estado ----------
  const S = { mx: 0, my: 0, tx: 0, ty: 0, scroll: 0, bankai: 0, bankaiT: 0, intro: opts.still ? 1 : 0, visible: true, raf: 0, t0: performance.now() };
  const base = { rz: opts.rotZ ?? -0.82, ry: -0.35, rx: 0.18 };

  function resize() {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // enquadramento: a espada inteira cabe na largura e na altura do canvas
    const fit = Math.max(5.2 / camera.aspect, 3.4);
    camera.position.z = fit / (2 * Math.tan((camera.fov * Math.PI) / 360)) * 1.12 * (opts.zoom ?? 1);
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  const easeOut = t => 1 - Math.pow(1 - t, 4);
  function frame(now) {
    S.raf = 0;
    const t = (now - S.t0) / 1000;
    if (!opts.still) S.intro = Math.min(1, t / 1.6);
    const e = easeOut(S.intro);
    S.mx += (S.tx - S.mx) * 0.06; S.my += (S.ty - S.my) * 0.06;
    S.bankai += (S.bankaiT - S.bankai) * 0.08;
    const idle = opts.still ? 0 : 1;

    // desembainhar: a espada desliza ao longo do próprio eixo e gira para a pose
    pivot.position.set(-1.2 * (1 - e) + S.mx * 0.15, -0.45 * (1 - e) + Math.sin(t * 0.9) * 0.04 * idle - S.scroll * 0.6, 0);
    pivot.rotation.z = base.rz + (1 - e) * 0.5 + S.scroll * 0.55 + S.my * 0.08;
    pivot.rotation.y = base.ry + S.mx * 0.45 + Math.sin(t * 0.5) * 0.08 * idle + S.scroll * 1.1;
    pivot.rotation.x = base.rx - S.my * 0.25;
    links.forEach((l, i) => { l.rotation.y = Math.sin(t * 1.6 + i * 0.6) * 0.25 * idle; });

    // brilho que percorre a lâmina a cada poucos segundos
    const cycle = (t % 5.5) / 1.4;
    glint.intensity = cycle < 1 ? Math.sin(cycle * Math.PI) * 9 : 0;
    glint.position.x = -1 + cycle * 3.6;

    // Bankai: fio e anel acendem em carmim, contorno mais forte
    edge.emissiveIntensity = S.bankai * 1.6;
    crimson.emissiveIntensity = S.bankai * 1.2;
    rimLight.intensity = 6 + S.bankai * 22;
    steel.color.setRGB(0.165 + S.bankai * 0.12, 0.18 - S.bankai * 0.05, 0.22 - S.bankai * 0.06);
    edge.color.copy(edgeBase).lerp(crimson.color, S.bankai * 0.6);

    renderer.render(scene, camera);
    if (!opts.still && S.visible && !document.hidden) S.raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!S.raf) S.raf = requestAnimationFrame(frame); };
  const io = new IntersectionObserver(([en]) => { S.visible = en.isIntersecting; if (S.visible) kick(); });
  io.observe(canvas);
  const onVis = () => { if (!document.hidden) kick(); };
  document.addEventListener("visibilitychange", onVis);
  kick();

  return {
    pointer(nx, ny) { S.tx = nx; S.ty = ny; if (opts.still) kick(); },
    scroll(p) { S.scroll = p; if (opts.still) kick(); },
    bankai(on) { S.bankaiT = on ? 1 : 0; if (opts.still) { S.bankai = S.bankaiT; kick(); } else kick(); },
    dispose() { cancelAnimationFrame(S.raf); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); renderer.dispose(); }
  };
}
