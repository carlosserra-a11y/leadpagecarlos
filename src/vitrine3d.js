/* Vitrine 3D (three.js): um notebook e um celular modelados só com código, mostrando os projetos.
   - Notebook com teclado (teclas instanciadas), trackpad, dobradiça e tampa que abre na entrada.
   - A tela mostra a captura da página inteira do projeto e rola por ela; a troca de projeto é um crossfade.
   - Celular ao lado com a versão mobile do mesmo projeto.
   - Segue o mouse de leve, flutua parado e muda de ângulo com a rolagem (topo → projetos).
   Empacotado por ferramentas/build-vitrine.mjs em lib/vitrine3d.min.js (script clássico, global Vitrine3D). */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, InstancedMesh, Object3D, PlaneGeometry, BoxGeometry,
  MeshPhysicalMaterial, MeshStandardMaterial, MeshBasicMaterial, ShaderMaterial, CanvasTexture, TextureLoader,
  SRGBColorSpace, ACESFilmicToneMapping, PMREMGenerator, DirectionalLight, AmbientLight, PointLight, Color,
  LinearFilter, ClampToEdgeWrapping
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const SCREEN_W = 2.96, SCREEN_H = 1.85;             // tela 16:10
const PHONE_W = 0.7, PHONE_H = 1.515;               // tela 390:844

/* tela que mistura duas capturas (crossfade) e mostra só uma janela da página, que rola */
function screenMaterial() {
  return new ShaderMaterial({
    uniforms: {
      tA: { value: null }, tB: { value: null },
      rA: { value: [0, 1] }, rB: { value: [0, 1] },   // [offset, repeat] no eixo vertical
      uMix: { value: 0 }, uBright: { value: 1 }
    },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: `
      uniform sampler2D tA; uniform sampler2D tB; uniform vec2 rA; uniform vec2 rB; uniform float uMix; uniform float uBright;
      varying vec2 vUv;
      void main(){
        vec3 a = texture2D(tA, vec2(vUv.x, rA.x + vUv.y * rA.y)).rgb;
        vec3 b = texture2D(tB, vec2(vUv.x, rB.x + vUv.y * rB.y)).rgb;
        gl_FragColor = vec4(mix(a, b, uMix) * uBright, 1.0);
        #include <colorspace_fragment>
      }`,
    toneMapped: false
  });
}

function shadowTexture() {                            // sombra de contato: um degradê radial suave
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d"), r = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  r.addColorStop(0, "rgba(0,0,0,.75)"); r.addColorStop(.55, "rgba(0,0,0,.35)"); r.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = r; g.fillRect(0, 0, 256, 256);
  return new CanvasTexture(c);
}
function logoTexture() {                              // monograma na tampa
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = "#000"; g.fillRect(0, 0, 256, 256);
  g.fillStyle = "#fff"; g.font = "600 120px Geist, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText("cs", 128, 136);
  return new CanvasTexture(c);
}

export function mountVitrine(canvas, opts = {}) {
  const still = !!opts.still;
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: !!opts.poster });
  renderer.setPixelRatio(opts.poster ? 1 : Math.min(devicePixelRatio || 1, 1.75));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const pm = new PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  pm.dispose();
  const camera = new PerspectiveCamera(28, 1, 0.1, 100);

  // ---------- materiais ----------
  const alu = new MeshPhysicalMaterial({ color: "#3a3f48", metalness: 0.92, roughness: 0.34, clearcoat: 0.3, clearcoatRoughness: 0.4 });
  const aluDark = new MeshStandardMaterial({ color: "#1b1e24", metalness: 0.6, roughness: 0.55 });
  const keyMat = new MeshStandardMaterial({ color: "#121419", metalness: 0.2, roughness: 0.65 });
  const glassBlack = new MeshPhysicalMaterial({ color: "#050608", metalness: 0, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05 });
  const pad = new MeshPhysicalMaterial({ color: "#2c3038", metalness: 0.5, roughness: 0.22, clearcoat: 0.6 });
  const glare = new MeshPhysicalMaterial({ color: "#000", metalness: 0, roughness: 0.04, transparent: true, opacity: 0.12, depthWrite: false });

  // ---------- notebook ----------
  const laptop = new Group();
  const base = new Mesh(new RoundedBoxGeometry(3.2, 0.12, 2.2, 4, 0.05), alu);
  base.position.y = 0.06; laptop.add(base);
  const well = new Mesh(new PlaneGeometry(2.86, 1.08), aluDark);
  well.rotation.x = -Math.PI / 2; well.position.set(0, 0.1205, -0.38); laptop.add(well);
  // teclas: 4 fileiras de 14 e a fileira de baixo com a barra de espaço
  const keyGeo = new RoundedBoxGeometry(0.168, 0.03, 0.16, 2, 0.02);
  const keys = new InstancedMesh(keyGeo, keyMat, 4 * 14 + 8);
  const o = new Object3D(); let k = 0;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) {
    o.position.set(-1.3 + c * 0.2, 0.128, -0.82 + r * 0.2); o.updateMatrix(); keys.setMatrixAt(k++, o.matrix);
  }
  for (const c of [0, 1, 2, 3, 10, 11, 12, 13]) { o.position.set(-1.3 + c * 0.2, 0.128, -0.02); o.updateMatrix(); keys.setMatrixAt(k++, o.matrix); }
  laptop.add(keys);
  const space = new Mesh(new RoundedBoxGeometry(1.16, 0.03, 0.16, 2, 0.02), keyMat);
  space.position.set(-0.0, 0.128, -0.02); laptop.add(space);
  const track = new Mesh(new RoundedBoxGeometry(1.15, 0.006, 0.7, 2, 0.003), pad);
  track.position.set(0, 0.121, 0.62); laptop.add(track);

  const lid = new Group(); lid.position.set(0, 0.12, -1.08); laptop.add(lid);
  const lidBody = new Mesh(new RoundedBoxGeometry(3.2, 2.1, 0.06, 4, 0.03), alu);
  lidBody.position.set(0, 1.05, 0); lid.add(lidBody);
  const front = new Mesh(new PlaneGeometry(3.14, 2.04), glassBlack);
  front.position.set(0, 1.05, 0.0305); lid.add(front);
  const scr = screenMaterial();
  const screen = new Mesh(new PlaneGeometry(SCREEN_W, SCREEN_H), scr);
  screen.position.set(0, 1.08, 0.031); lid.add(screen);
  const glass = new Mesh(new PlaneGeometry(3.14, 2.04), glare);
  glass.position.set(0, 1.05, 0.033); lid.add(glass);
  const logo = new Mesh(new PlaneGeometry(0.34, 0.34), new MeshBasicMaterial({ alphaMap: logoTexture(), transparent: true, color: "#9aa3b2", opacity: 0.55 }));
  logo.position.set(0, 1.05, -0.0305); logo.rotation.y = Math.PI; lid.add(logo);
  const hinge = new Mesh(new RoundedBoxGeometry(2.6, 0.07, 0.08, 2, 0.03), aluDark);
  hinge.position.set(0, 0.13, -1.08); laptop.add(hinge);

  // ---------- celular ----------
  const phone = new Group();
  const pBody = new Mesh(new RoundedBoxGeometry(0.78, 1.6, 0.07, 6, 0.11), alu);
  phone.add(pBody);
  const pFront = new Mesh(new RoundedBoxGeometry(0.76, 1.58, 0.002, 6, 0.001), glassBlack);
  pFront.position.z = 0.036; phone.add(pFront);
  const pScr = screenMaterial();
  const pScreen = new Mesh(new PlaneGeometry(PHONE_W, PHONE_H), pScr);
  pScreen.position.z = 0.0375; phone.add(pScreen);
  const island = new Mesh(new RoundedBoxGeometry(0.2, 0.05, 0.004, 2, 0.02), new MeshBasicMaterial({ color: "#000" }));
  island.position.set(0, 0.7, 0.039); phone.add(island);
  phone.position.set(2.35, 0.82, 1.0); phone.rotation.set(-0.06, -0.52, 0.03);

  const shadow = new Mesh(new PlaneGeometry(5.2, 3.6), new MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false, opacity: 0.85 }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.set(0.3, 0.001, 0.1);

  const rig = new Group(); rig.add(laptop, phone, shadow);
  const pivot = new Group(); pivot.add(rig); scene.add(pivot);
  rig.position.set(-0.3, -0.9, 0);

  // ---------- luzes ----------
  scene.add(new AmbientLight("#ffffff", 0.25));
  const key = new DirectionalLight("#ffffff", 1.6); key.position.set(-3, 6, 5); scene.add(key);
  const rim = new PointLight(new Color(opts.accent || "#5b8cff"), 14, 14, 1.4); rim.position.set(3.5, 2.5, -3); scene.add(rim);

  // ---------- telas: texturas e troca ----------
  const loader = new TextureLoader(), cache = new Map();
  const load = url => {
    if (!cache.has(url)) cache.set(url, new Promise(ok => loader.load(url, t => {
      t.colorSpace = SRGBColorSpace; t.minFilter = LinearFilter; t.generateMipmaps = false;
      t.wrapS = t.wrapT = ClampToEdgeWrapping; t.anisotropy = 4; ok(t);
    }, undefined, () => ok(null))));
    return cache.get(url);
  };
  const screens = opts.screens || [];
  const S = { project: -1, target: 0, mix: 1, cur: 0, scrollA: 0, fading: false, scroll: 0, auto: !still, mode: 0, open: still ? 1 : 0,
              mx: 0, my: 0, tx: 0, ty: 0, visible: true, raf: 0, t0: performance.now(), last: performance.now(), skip: false, ready: false };
  const winOf = t => (t ? Math.min(1, (t.image.width / 1.6) / t.image.height) : 1);   // fração visível da página na tela
  const setWin = (slot, t, scroll) => { const rep = winOf(t); scr.uniforms[slot].value = [(1 - rep) * (1 - scroll), rep]; };
  async function show(i) {
    const s = screens[i]; if (!s) return;
    const [d, m] = await Promise.all([load(s.desk), load(s.mob)]);
    if (i !== S.target) return;
    if (S.ready) {                                      // o atual vai para A e o novo entra em B, em crossfade
      scr.uniforms.tA.value = scr.uniforms.tB.value; pScr.uniforms.tA.value = pScr.uniforms.tB.value;
      S.scrollA = S.cur; S.mix = 0; S.fading = true; S.fadeT0 = performance.now();
    } else { scr.uniforms.tA.value = d; pScr.uniforms.tA.value = m; S.mix = 1; }
    scr.uniforms.tB.value = d; pScr.uniforms.tB.value = m;
    S.project = i;
    if (!S.ready) { S.ready = true; draw(performance.now()); opts.onReady?.(); }
    kick();
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const fit = Math.max(6.8 / camera.aspect, 4.4);   // o conjunto inteiro cabe na largura e na altura
    camera.position.set(0, 1.2, fit / (2 * Math.tan((camera.fov * Math.PI) / 360)) * (opts.zoom ?? 1));
    camera.lookAt(0, 0.1, 0);
    camera.updateProjectionMatrix();
    draw(performance.now());
  }

  const ease = t => 1 - Math.pow(1 - t, 3);
  function draw(now) {
    const t = (now - S.t0) / 1000, idle = still ? 0 : 1;
    if (!still) S.open = Math.min(1, t / 1.4);
    S.mx += (S.tx - S.mx) * 0.06; S.my += (S.ty - S.my) * 0.06;
    if (S.fading) { S.mix = Math.min(1, (now - S.fadeT0) / 600); if (S.mix >= 1) S.fading = false; }   // crossfade de 0,6 s

    // tampa abre na entrada (de 25° a 104°)
    const open = 0.44 + (1.815 - 0.44) * ease(S.open);
    lid.rotation.x = Math.PI / 2 - open;
    // ângulo: no topo, três quartos; nos projetos, mais de frente para a tela ser lida
    const m = S.mode;
    pivot.rotation.y = (-0.5 + m * 0.22) + S.mx * 0.22 + Math.sin(t * 0.4) * 0.03 * idle;
    pivot.rotation.x = (0.1 - m * 0.04) - S.my * 0.08;
    pivot.position.y = Math.sin(t * 0.8) * 0.04 * idle;

    // a página rola dentro da tela: sozinha no topo, pela rolagem nos projetos
    const sc = m > 0.5 || !S.auto ? S.scroll : (Math.sin(t * 0.18 - Math.PI / 2) + 1) / 2;
    S.cur = sc;
    setWin("rB", scr.uniforms.tB.value, sc); setWin("rA", scr.uniforms.tA.value, S.scrollA);
    scr.uniforms.uMix.value = pScr.uniforms.uMix.value = S.mix;
    renderer.render(scene, camera);
  }
  function frame(now) {
    S.raf = 0;
    S.skip = !S.skip;                                   // parado há 3 s: 30 quadros por segundo bastam
    if (!(now - S.last > 3000 && !S.fading && S.open >= 1 && S.skip)) draw(now);
    if (!still && S.visible && !document.hidden) S.raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (still) return draw(performance.now()); if (!S.raf) S.raf = requestAnimationFrame(frame); };
  const touch = () => { S.last = performance.now(); kick(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  const onVis = () => { if (!document.hidden) kick(); };
  document.addEventListener("visibilitychange", onVis);
  resize();
  S.target = 0; show(0);

  return {
    project(i) { if (i === S.target && S.project === i) return; S.target = i; show(i); touch(); },
    scroll(p) { S.scroll = Math.max(0, Math.min(1, p)); touch(); },
    mode(p) { S.mode = Math.max(0, Math.min(1, p)); touch(); },
    pointer(nx, ny) { if (still) return; S.tx = nx; S.ty = ny; touch(); },
    visible(on) { S.visible = on; if (on) kick(); },
    dispose() { cancelAnimationFrame(S.raf); ro.disconnect(); document.removeEventListener("visibilitychange", onVis); renderer.dispose(); }
  };
}
