/* Zanpakutō em 3D (three.js), modelada só com código: nenhum arquivo de modelo externo.
   - Lâmina com a seção de uma katana de verdade (fio, ji, shinogi, shinogi-ji, mune), curvatura (sori)
     e ponta (kissaki) com fukura; o hamon (linha de têmpera) é desenhado por shader no próprio aço.
   - Habaki de latão, tsuba mokko com dois hitsu-ana, seppa, fuchi e kashira.
   - Cabo com same (pele de raia) por baixo e ito trançado em 3D (fitas em X), menuki dos dois lados.
   - Corrente de seis elos no pomo, o último quebrado, sempre pendurada para baixo.
   Empacotado por ferramentas/build-katana.mjs em lib/katana3d.min.js (script clássico, global Katana3D). */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, InstancedMesh, BufferGeometry, Float32BufferAttribute,
  Shape, Path, ExtrudeGeometry, MeshPhysicalMaterial, MeshStandardMaterial, MeshBasicMaterial, CylinderGeometry,
  TorusGeometry, BoxGeometry, SphereGeometry, CanvasTexture, RepeatWrapping, SRGBColorSpace, ACESFilmicToneMapping,
  PMREMGenerator, Color, DirectionalLight, PointLight, AmbientLight, BackSide, Object3D, Points, PointsMaterial,
  AdditiveBlending
} from "three";

const L = 3.3;                 // comprimento da lâmina
const KISSAKI = 0.11;          // fração da lâmina ocupada pela ponta
const sori = s => 0.22 * s * s;

/* ---------- lâmina: anéis de 6 pontos ao longo do comprimento, uma faixa por faceta ---------- */
function bladeRing(s) {
  const yc = sori(s);
  let w = 0.175 - 0.045 * s, tS = 0.046 - 0.016 * s, tM = 0.03 - 0.01 * s;
  let yMune = yc + w / 2, yEdge = yc - w / 2;
  if (s > 1 - KISSAKI) {                          // fukura: o fio sobe em curva até encontrar a mune
    const u = (s - (1 - KISSAKI)) / KISSAKI, f = Math.sqrt(Math.max(0, 1 - u * u));
    w *= f; tS *= f; tM *= f; yEdge = yMune - w;
  }
  const ys = yEdge + 0.7 * w, ym = yMune - 0.07 * w;
  return [[yEdge, 0], [ys, tS / 2], [ym, tM / 2], [yMune, 0], [ym, -tM / 2], [ys, -tS / 2]];
}
function bladeGeometry() {
  const N = 120, pos = [], uv = [], idx = [];
  // aBlade.y: 0→1 do fio ao shinogi no ji (onde fica o hamon); 2 = shinogi-ji; 3 = mune
  const facets = [[0, 1, "ji"], [1, 2, 2], [2, 3, 3], [3, 4, 3], [4, 5, 2], [5, 0, "ji-"]];
  for (const [a, b, kind] of facets) {
    const base = pos.length / 3;
    for (let i = 0; i <= N; i++) {
      const s = i / N, r = bladeRing(s), x = s * L;
      pos.push(x, r[a][0], r[a][1], x, r[b][0], r[b][1]);
      if (kind === "ji") uv.push(s, 0, s, 1);
      else if (kind === "ji-") uv.push(s, 1, s, 0);
      else uv.push(s, kind, s, kind);
    }
    for (let i = 0; i < N; i++) {
      const p = base + i * 2;
      idx.push(p, p + 2, p + 1, p + 1, p + 2, p + 3);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("aBlade", new Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
// hamon (notare suave + nioi) e brilho do Bankai, injetados no material físico do three
function withHamon(mat, uniforms) {
  mat.onBeforeCompile = sh => {
    sh.uniforms.uBankai = uniforms.uBankai;
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nattribute vec2 aBlade;\nvarying vec2 vBlade;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvBlade = aBlade;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec2 vBlade;\nuniform float uBankai;")
      .replace("#include <lights_physical_fragment>", `
        float hz = 0.0, nioi = 0.0;
        if (vBlade.y < 1.5) {
          float s = vBlade.x;
          float hl = 0.44 + 0.07 * sin(s * 47.0) + 0.035 * sin(s * 129.0 + 1.7) + 0.018 * sin(s * 281.0);
          hl = mix(hl, 0.7, smoothstep(0.86, 0.93, s));
          hz = 1.0 - smoothstep(hl - 0.03, hl + 0.03, vBlade.y);
          nioi = exp(-pow((vBlade.y - hl) / 0.02, 2.0));
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.86, 0.88, 0.92), hz * 0.95) + vec3(0.25) * nioi;
          roughnessFactor = mix(roughnessFactor, 0.13, hz);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.95, 0.12, 0.2), uBankai * hz * 0.55);
          totalEmissiveRadiance += vec3(1.0, 0.1, 0.18) * uBankai * (hz * 0.35 + nioi * 1.4);
        } else if (vBlade.y < 2.5) {
          roughnessFactor = 0.17;
        }
        #include <lights_physical_fragment>`);
  };
  return mat;
}

/* ---------- ito: fita em meia volta (helicoidal) em volta de um cilindro de raio 1 ---------- */
function ribbonGeometry(dir, pitch, width, lift) {
  const M = 22, pos = [], idx = [];
  const prof = [[-width / 2, 0.004], [0, 0.016], [width / 2, 0.004]];
  for (let j = 0; j <= M; j++) {
    const th = -Math.PI / 2 + (j / M) * Math.PI, k = j / M;
    const xc = dir > 0 ? k * pitch : pitch - k * pitch;
    for (const [dx, h] of prof) {
      const r = 1 + h + lift;
      pos.push(xc + dx, r * Math.sin(th), r * Math.cos(th));
    }
  }
  for (let j = 0; j < M; j++) for (let c = 0; c < 2; c++) {
    const a = j * 3 + c, b = a + 3;
    idx.push(a, a + 1, b, a + 1, b + 1, b);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

function samegawaTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const g = c.getContext("2d");
  g.fillStyle = "#808080"; g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * 128, y = Math.random() * 128, r = 1 + Math.random() * 2.2;
    g.fillStyle = `rgb(${200 + Math.random() * 55 | 0},${200 + Math.random() * 55 | 0},${200 + Math.random() * 55 | 0})`;
    g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  const t = new CanvasTexture(c); t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(6, 2);
  return t;
}

function mokkoShape(ry, rz) {                     // tsuba de quatro lóbulos, com os dois hitsu-ana
  const sh = new Shape(), N = 120;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2, k = 0.9 + 0.1 * Math.pow(Math.abs(Math.cos(2 * t)), 0.6);
    const x = Math.cos(t) * rz * k, y = Math.sin(t) * ry * k;
    i ? sh.lineTo(x, y) : sh.moveTo(x, y);
  }
  for (const side of [-1, 1]) {
    const h = new Path(), cx = side * rz * 0.5;
    h.absellipse(cx, 0, 0.032, 0.085, 0, Math.PI * 2, false, 0);
    sh.holes.push(h);
  }
  return sh;
}

function studioEnvironment(renderer) {            // estúdio feito em código: reflexos nítidos sem baixar HDR
  const env = new Scene();
  const room = new SphereGeometry(20, 32, 16);
  const cols = [], top = new Color("#6b7286"), bottom = new Color("#0c0c10");
  const pos = room.attributes.position;
  for (let i = 0; i < pos.count; i++) { const k = (pos.getY(i) + 20) / 40; const c = bottom.clone().lerp(top, k); cols.push(c.r, c.g, c.b); }
  room.setAttribute("color", new Float32BufferAttribute(cols, 3));
  env.add(new Mesh(room, new MeshBasicMaterial({ vertexColors: true, side: BackSide })));
  const panel = (w, h, x, y, z, ry, color, k) => {
    const m = new Mesh(new BoxGeometry(w, h, 0.1), new MeshBasicMaterial({ color: new Color(color).multiplyScalar(k) }));
    m.position.set(x, y, z); m.rotation.y = ry; env.add(m);
  };
  panel(18, 2.2, 0, 9, -4, 0, "#ffffff", 10);           // softbox comprida: o reflexo que corre pela lâmina
  panel(4, 12, -11, 2, 2, Math.PI / 2, "#dfe6ff", 4);
  panel(12, 1.2, 0, -6, 6, 0, "#c9d2e6", 2.2);          // rebatedor de baixo: o fio aparece dos dois lados
  panel(3, 9, 11, 0, -3, -Math.PI / 2, "#ff2a45", 3);   // contorno carmim
  const pm = new PMREMGenerator(renderer);
  const tex = pm.fromScene(env, 0.03).texture;
  pm.dispose();
  return tex;
}

export function mountKatana(canvas, opts = {}) {
  const mobile = matchMedia("(max-width: 760px)").matches;
  const still = !!opts.still;
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: !!opts.poster });
  renderer.setPixelRatio(opts.poster ? 1 : Math.min(devicePixelRatio || 1, mobile ? 1.5 : 1.75));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  scene.environment = studioEnvironment(renderer);
  const camera = new PerspectiveCamera(24, 1, 0.1, 60);

  // ---------- materiais ----------
  const U = { uBankai: { value: 0 } };
  const steel = withHamon(new MeshPhysicalMaterial({ color: "#2b2f38", metalness: 1, roughness: 0.24, clearcoat: 0.6, clearcoatRoughness: 0.1 }), U);
  const brass = new MeshPhysicalMaterial({ color: "#e0bd74", metalness: 1, roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.2 });
  const iron = new MeshStandardMaterial({ color: "#1b1a1c", metalness: 0.8, roughness: 0.42 });
  const lacquer = new MeshPhysicalMaterial({ color: "#7d0f1f", metalness: 0.2, roughness: 0.3, clearcoat: 1, emissive: new Color("#ff1f3d"), emissiveIntensity: 0 });
  const silk = new MeshPhysicalMaterial({ color: "#7a1020", roughness: 0.62, metalness: 0, sheen: 1, sheenColor: new Color("#ff6b7d"), sheenRoughness: 0.45, emissive: new Color("#ff1f3d"), emissiveIntensity: 0 });
  const same = new MeshStandardMaterial({ color: "#e6dfcf", roughness: 0.6, bumpMap: samegawaTexture(), bumpScale: 0.6 });

  // ---------- peças (eixo da espada = x; a lâmina vai de 0 a L) ----------
  const sword = new Group();
  sword.add(new Mesh(bladeGeometry(), steel));

  const habaki = new Mesh(new BoxGeometry(0.13, 0.19, 0.07), brass); habaki.position.set(0.065, 0, 0); sword.add(habaki);
  const seppaGeo = new CylinderGeometry(0.13, 0.13, 0.012, 48); seppaGeo.rotateZ(Math.PI / 2); seppaGeo.scale(1, 1, 0.8);
  for (const x of [-0.008, -0.082]) { const m = new Mesh(seppaGeo, brass); m.position.x = x; sword.add(m); }
  const tsubaGeo = new ExtrudeGeometry(mokkoShape(0.37, 0.31), { depth: 0.04, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 12 });
  tsubaGeo.translate(0, 0, -0.02); tsubaGeo.rotateY(Math.PI / 2);
  const tsuba = new Mesh(tsubaGeo, iron); tsuba.position.x = -0.045; sword.add(tsuba);
  const rimGeo = new ExtrudeGeometry(mokkoShape(0.385, 0.325), { depth: 0.012, bevelEnabled: false, curveSegments: 12 });
  rimGeo.translate(0, 0, -0.006); rimGeo.rotateY(Math.PI / 2);
  const rim = new Mesh(rimGeo, lacquer); rim.position.x = -0.045; sword.add(rim);   // filete laqueado em volta

  const T0 = -0.088, TL = 0.98, RY = 0.084, RZ = 0.066;     // cabo: início, comprimento e raios (oval)
  const ovalCyl = (r0, r1, len, mat, x) => {
    const g = new CylinderGeometry(r0, r1, len, 48, 1); g.rotateZ(Math.PI / 2); g.scale(1, 1, RZ / RY);
    const m = new Mesh(g, mat); m.position.x = x; sword.add(m); return m;
  };
  ovalCyl(RY + 0.006, RY + 0.006, 0.05, iron, T0 - 0.025);                        // fuchi
  ovalCyl(RY - 0.004, RY - 0.004, TL, same, T0 - 0.05 - TL / 2);                  // same
  ovalCyl(RY + 0.004, RY + 0.012, 0.07, iron, T0 - 0.05 - TL - 0.035);           // kashira
  const cap = new Mesh(new SphereGeometry(RY + 0.012, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), iron);
  cap.rotation.z = Math.PI / 2; cap.scale.set(1, 0.35, RZ / RY); cap.position.x = T0 - 0.05 - TL - 0.07; sword.add(cap);

  // ito: meias voltas alternando frente e costas, fitas A e B se cruzando em X
  const P = 0.14, turns = Math.floor((TL - 0.04) / P), x0 = T0 - 0.07 - turns * P;
  const ribA = new InstancedMesh(ribbonGeometry(1, P, 0.1, 0.004), silk, turns);
  const ribB = new InstancedMesh(ribbonGeometry(-1, P, 0.1, 0), silk, turns);
  const o = new Object3D();
  for (let k = 0; k < turns; k++) {
    o.position.set(x0 + k * P, 0, 0); o.rotation.set(k % 2 ? Math.PI : 0, 0, 0); o.scale.set(1, RY - 0.004, RZ - 0.004);
    o.updateMatrix(); ribA.setMatrixAt(k, o.matrix); ribB.setMatrixAt(k, o.matrix);
  }
  sword.add(ribA, ribB);
  const menukiGeo = new SphereGeometry(1, 24, 12);
  for (const side of [-1, 1]) {                                                 // menuki de latão, um de cada lado
    const m = new Mesh(menukiGeo, brass);
    m.scale.set(0.075, 0.022, 0.014); m.position.set(T0 - 0.05 - TL * 0.42, 0, side * (RZ + 0.008)); sword.add(m);
  }

  // corrente: seis elos, o último aberto; o grupo é girado a cada quadro para ficar sempre pendurado
  const chain = new Group(); chain.position.x = T0 - 0.05 - TL - 0.11; sword.add(chain);
  const linkGeo = new TorusGeometry(0.042, 0.01, 8, 28), brokenGeo = new TorusGeometry(0.042, 0.01, 8, 28, Math.PI * 1.45);
  const links = [];
  for (let i = 0; i < 6; i++) {
    const l = new Mesh(i === 5 ? brokenGeo : linkGeo, iron);
    l.position.y = -0.066 * i; l.rotation.y = i % 2 ? Math.PI / 2 : 0; l.rotation.z = Math.PI / 2;
    chain.add(l); links.push(l);
  }

  sword.position.x = -1.0;                       // pivô perto do meio da espada (do pomo à ponta)
  const along = new Group(); along.add(sword);   // desliza ao longo do próprio eixo (desembainhar)
  const pivot = new Group(); pivot.add(along); scene.add(pivot);

  // reiatsu do Bankai: partículas carmim subindo pela lâmina (só aparecem com o Bankai ligado)
  const NP = mobile ? 36 : 64, pp = new Float32Array(NP * 3), seed = new Float32Array(NP);
  for (let i = 0; i < NP; i++) seed[i] = Math.random();
  const pgeo = new BufferGeometry(); pgeo.setAttribute("position", new Float32BufferAttribute(pp, 3));
  const pmat = new PointsMaterial({ color: "#ff3550", size: 0.035, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const reiatsu = new Points(pgeo, pmat); reiatsu.frustumCulled = false; sword.add(reiatsu);

  // ---------- luzes ----------
  scene.add(new AmbientLight("#ffffff", 0.35));
  const key = new DirectionalLight("#ffffff", 2.4); key.position.set(3, 5, 6); scene.add(key);
  const rimLight = new PointLight("#ff2340", 7, 12, 1.6); rimLight.position.set(-2, -1.5, -2.5); scene.add(rimLight);
  const glint = new PointLight("#ffffff", 0, 3.2, 2); glint.position.set(0, 0.6, 1.1); scene.add(glint);

  // ---------- estado ----------
  const pose = Object.assign({ rz: -0.74, ry: -0.32, rx: 0.16, x: 0, y: 0, zoom: 1 }, opts.pose);
  const S = { mx: 0, my: 0, tx: 0, ty: 0, scroll: 0, bankai: 0, bankaiT: 0, intro: still ? 1 : 0, visible: true, raf: 0,
              t0: performance.now(), last: performance.now(), skip: false };

  function resize() {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const fit = Math.max(5.0 / camera.aspect, 5.0);
    camera.position.set(0, 0, fit / (2 * Math.tan((camera.fov * Math.PI) / 360)) * pose.zoom);
    camera.updateProjectionMatrix();
    if (still || !S.raf) draw(performance.now());
  }

  const easeOut = t => 1 - Math.pow(1 - t, 4);
  function draw(now) {
    const t = (now - S.t0) / 1000;
    if (!still) S.intro = Math.min(1, t / 1.1);
    const e = easeOut(S.intro), idle = still ? 0 : 1;
    S.mx += (S.tx - S.mx) * 0.07; S.my += (S.ty - S.my) * 0.07;
    S.bankai += (S.bankaiT - S.bankai) * 0.08;
    U.uBankai.value = S.bankai;

    // entrada: a espada sai das costas subindo pelo próprio eixo; a rolagem continua o movimento
    along.position.x = 0.7 * (1 - e) - S.scroll * 0.55;
    pivot.position.set(pose.x, pose.y + Math.sin(t * 0.8) * 0.03 * idle, 0);
    pivot.rotation.z = pose.rz + S.scroll * 0.14 + S.my * 0.05;
    pivot.rotation.y = pose.ry + S.mx * 0.1 + Math.sin(t * 0.45) * 0.05 * idle + S.scroll * 0.5;
    pivot.rotation.x = pose.rx - S.my * 0.08;
    chain.rotation.z = -pivot.rotation.z + Math.sin(t * 1.3) * 0.08 * idle;
    links.forEach((l, i) => { l.rotation.x = Math.sin(t * 1.7 + i * 0.7) * 0.18 * idle; });

    // brilho que percorre a lâmina a cada poucos segundos
    const cyc = (t % 6) / 1.5;
    glint.intensity = idle && cyc < 1 ? Math.sin(cyc * Math.PI) * 8 : 0;
    glint.position.x = -1 + cyc * 3.6;

    // Bankai
    lacquer.emissiveIntensity = S.bankai * 1.1;
    silk.emissiveIntensity = S.bankai * 0.25;
    rimLight.intensity = 7 + S.bankai * 22;
    pmat.opacity = S.bankai * 0.9;
    if (S.bankai > 0.01) {
      for (let i = 0; i < NP; i++) {
        const k = (seed[i] + t * (0.12 + seed[i] * 0.1)) % 1, s = (seed[i] * 7.31) % 1;
        pp[i * 3] = s * L; pp[i * 3 + 1] = sori(s) + 0.12 + k * 0.5; pp[i * 3 + 2] = (seed[i] - 0.5) * 0.2 + Math.sin(t + i) * 0.02;
      }
      pgeo.attributes.position.needsUpdate = true;
    }
    renderer.render(scene, camera);
  }
  function frame(now) {
    S.raf = 0;
    // parado há mais de 3 s: 30 quadros por segundo bastam para a flutuação
    S.skip = !S.skip;
    if (!(now - S.last > 3000 && S.intro >= 1 && S.bankai === S.bankaiT && S.skip)) draw(now);
    if (!still && S.visible && !document.hidden) S.raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (still) return draw(performance.now()); if (!S.raf) S.raf = requestAnimationFrame(frame); };
  const touch = () => { S.last = performance.now(); kick(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  const io = new IntersectionObserver(([en]) => { S.visible = en.isIntersecting; if (S.visible) kick(); });
  io.observe(canvas);
  const onVis = () => { if (!document.hidden) kick(); };
  document.addEventListener("visibilitychange", onVis);
  resize(); kick();

  return {
    pointer(nx, ny) { if (still) return; S.tx = nx; S.ty = ny; touch(); },
    scroll(p) { S.scroll = p; touch(); },
    bankai(on) {
      S.bankaiT = on ? 1 : 0;
      if (still) S.bankai = S.bankaiT;
      touch();
    },
    dispose() {
      cancelAnimationFrame(S.raf); ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis); renderer.dispose();
    }
  };
}
