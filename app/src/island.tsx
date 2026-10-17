/* "Ilha" React do portfólio: o PrismHero (cristal 3D) no topo do site estático.
   O build gera lib/prism-hero.min.js (script clássico, global PrismIsland) e css/prism-hero.css.
   O js/app.js decide se a ilha entra (GPU de verdade, sem "reduzir movimento", sem economia de dados),
   chama PrismIsland.mount() e, enquanto isso, o topo em HTML continua no lugar. */
import "./index.css"
import * as React from "react"
import * as THREE from "three"
import { createRoot } from "react-dom/client"
import { useFrame, useThree } from "@react-three/fiber"
import { ArrowRight, MessageCircle } from "lucide-react"
import { PrismHero } from "@/components/ui/prism-hero"

export interface IslandProps {
  /** Nome desenhado dentro da cena (o cristal refrata). */
  headline: string
  /** Mesmo texto, como h1 de verdade para leitores de tela e buscadores. */
  title: string
  eyebrow: string
  description: string
  meta: string[]
  work: { label: string; href: string }
  chat: { label: string; href: string; aria: string }
  /** Detalhes da moldura (HUD): lugar, coordenadas, fuso e versão. */
  hud: { place: string; coords: string; tz: string; build: string }
  /** false segura a entrada do texto (a tela de carregamento do site ainda está aberta). */
  play: boolean
}

export interface IslandEvents {
  /** Primeiro quadro desenhado: hora de trocar o topo em HTML pelo 3D. */
  onReady?: () => void
  /** Erro no WebGL ou quadros lentos demais: o site volta para o topo em HTML. */
  onFail?: (reason: string) => void
  /** false = não desiste em aparelho lento (o site passa false com ?3d=1, para testes). */
  checkSpeed?: boolean
}

const DISPLAY_FONT = "'Space Grotesk', Geist, 'Helvetica Neue', Arial, sans-serif"
const ACCENT = "#4f7cff"

/**
 * Mora dentro do Canvas (via sceneChildren) para saber quando o primeiro quadro saiu
 * e medir o ritmo dos quadros. Mediana acima de ~45 ms (menos de 22 fps) = aparelho sem fôlego.
 */
function FrameWatch({ onReady, onSlow, onFail }: { onReady: () => void; onSlow?: () => void; onFail: (reason: string) => void }) {
  const frames = React.useRef(0)
  const deltas = React.useRef<number[]>([])
  const done = React.useRef(false)
  const gl = useThree((state) => state.gl)

  // o three só registra no console quando um shader não compila; aqui isso vira "volta para o topo em HTML"
  React.useEffect(() => {
    gl.debug.onShaderError = () => onFail("shader")
    return () => {
      gl.debug.onShaderError = null
    }
  }, [gl, onFail])

  useFrame((_, delta) => {
    if (done.current) return
    const n = ++frames.current
    if (n === 2) onReady()
    // descarta os primeiros quadros (compilação dos shaders) e mede os 90 seguintes
    if (n <= 30 || !onSlow) return
    deltas.current.push(delta)
    if (deltas.current.length < 90) return
    done.current = true
    const sorted = [...deltas.current].sort((a, b) => a - b)
    if (sorted[sorted.length >> 1] > 0.045) onSlow?.()
  })

  return null
}

/* -------------------------------------------------------------------------- */
/*  Fundo: grade de pontos que acende perto do mouse e solta uma onda no clique */
/* -------------------------------------------------------------------------- */

const DOT_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const DOT_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec2 uSize;
  uniform vec3 uRipple;
  uniform vec3 uColor;
  uniform vec3 uBase;
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - 0.5) * uSize;
    float g = 0.3;
    vec2 id = floor(p / g);
    vec2 c = (id + 0.5) * g;
    vec2 f = p - c;
    float d = length(c - uPointer);
    float lit = 1.0 - smoothstep(0.0, 2.2, d);
    float wave = 0.5 + 0.5 * sin(c.x * 0.9 + c.y * 0.7 - uTime * 0.8);
    float t = uTime - uRipple.z;
    float ring = 0.0;
    if (t > 0.0 && t < 2.4) {
      float rd = length(c - uRipple.xy);
      ring = (1.0 - smoothstep(0.0, 0.42, abs(rd - t * 3.4))) * (1.0 - t / 2.4);
    }
    float rad = 0.018 + lit * 0.022 + ring * 0.02;
    float dotA = 1.0 - smoothstep(rad * 0.45, rad, length(f));
    float edge = smoothstep(0.0, 0.18, vUv.x) * (1.0 - smoothstep(0.82, 1.0, vUv.x)) * smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.8, 1.0, vUv.y));
    float a = clamp(dotA * (0.07 + wave * 0.07 + lit * 0.6 + ring * 0.65) * mix(0.35, 1.0, edge), 0.0, 1.0);
    vec3 col = mix(uBase, uColor, clamp(lit * 1.3 + ring, 0.0, 1.0));
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`

function DotField({ color = ACCENT, z = -4.5, onFail }: { color?: string; z?: number; onFail: (reason: string) => void }) {
  const { camera, viewport } = useThree()
  const vp = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, z))
  const size = React.useRef({ w: vp.width, h: vp.height })
  const target = React.useRef(new THREE.Vector2(99, 99))
  // relógio próprio: o do R3F volta a zero quando o topo sai e volta para a tela (frameloop "never" → "always")
  const clock = React.useRef(0)

  React.useEffect(() => {
    size.current = { w: vp.width, h: vp.height }
  }, [vp.width, vp.height])

  // o material é criado uma vez e entra na cena como objeto pronto: assim os uniforms escritos aqui
  // são os mesmos que o shader lê (passados como prop, o R3F copiaria os valores numéricos)
  const material = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: DOT_VERT,
        fragmentShader: DOT_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2(99, 99) },
          uSize: { value: new THREE.Vector2(1, 1) },
          uRipple: { value: new THREE.Vector3(0, 0, -10) },
          uColor: { value: new THREE.Color(ACCENT) },
          uBase: { value: new THREE.Color("#d1dbf0") },
        },
      }),
    []
  )
  const uniforms = material.uniforms
  React.useEffect(() => () => material.dispose(), [material])
  React.useEffect(() => {
    uniforms.uColor.value.set(color)
  }, [uniforms, color])

  React.useEffect(() => {
    const toWorld = (e: PointerEvent) =>
      new THREE.Vector2(
        (e.clientX / window.innerWidth - 0.5) * size.current.w,
        (0.5 - e.clientY / window.innerHeight) * size.current.h
      )
    const onMove = (e: PointerEvent) => target.current.copy(toWorld(e))
    const onDown = (e: PointerEvent) => {
      const el = e.target as Element | null
      if (el?.closest?.("a, button, input, textarea")) return
      const w = toWorld(e)
      uniforms.uRipple.value.set(w.x, w.y, clock.current)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
    }
  }, [uniforms])

  useFrame((_, delta) => {
    try {
      clock.current += Math.min(delta, 0.1)
      uniforms.uTime.value = clock.current
      uniforms.uSize.value.set(size.current.w, size.current.h)
      uniforms.uPointer.value.lerp(target.current, Math.min(1, delta * 6))
    } catch (e) {
      onFail(e instanceof Error ? e.message : "quadro")
    }
  })

  return (
    <mesh position={[0, 0, z]} renderOrder={-2}>
      <planeGeometry args={[vp.width, vp.height]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

/* -------------------------------------------------------------------------- */
/*  Moldura de detalhes (HUD): cantos, lugar e hora, posição do mouse, versão   */
/* -------------------------------------------------------------------------- */

function Hud({ hud }: { hud: IslandProps["hud"] }) {
  const [time, setTime] = React.useState("--:--:--")
  const x = React.useRef<HTMLElement>(null)
  const y = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    let fmt: Intl.DateTimeFormat
    try {
      fmt = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    } catch {
      return
    }
    const tick = () => {
      if (!document.hidden) setTime(fmt.format(new Date()))
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  React.useEffect(() => {
    let raf = 0
    let ev: PointerEvent | null = null
    const onMove = (e: PointerEvent) => {
      ev = e
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        if (!ev) return
        if (x.current) x.current.textContent = String(Math.round(ev.clientX)).padStart(4, "0")
        if (y.current) y.current.textContent = String(Math.round(ev.clientY)).padStart(4, "0")
      })
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const corner = "absolute h-4 w-4 border-[rgba(143,176,255,0.45)]"
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-[calc(70px+0.8rem)] right-5 bottom-4 left-5 font-[family-name:var(--font-mono)] text-[10.5px] leading-none tracking-[0.08em] text-[#667085] uppercase"
    >
      <i className={`${corner} top-0 left-0 border-t border-l`} />
      <i className={`${corner} top-0 right-0 border-t border-r`} />
      <i className={`${corner} bottom-0 left-0 border-b border-l`} />
      <i className={`${corner} right-0 bottom-0 border-r border-b`} />
      <p className="absolute top-1 right-7 hidden gap-5 sm:flex">
        <span>{hud.place}</span>
        <span className="hidden lg:inline">{hud.coords}</span>
        <span>
          <b className="font-medium text-[#c7cdd8] tabular-nums">{time}</b> {hud.tz}
        </span>
      </p>
      <p className="absolute bottom-1 left-7 hidden lg:block">
        x <b ref={x} className="font-medium text-[#c7cdd8] tabular-nums">0000</b> · y{" "}
        <b ref={y} className="font-medium text-[#c7cdd8] tabular-nums">0000</b>
      </p>
      <p className="absolute right-7 bottom-1 hidden lg:block">{hud.build}</p>
    </div>
  )
}

class Guard extends React.Component<
  { onFail: (reason: string) => void; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    this.props.onFail(error instanceof Error ? error.message : "erro")
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

const btn =
  "inline-flex h-11 items-center gap-2 rounded-full px-7 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] no-underline transition-[transform,background-color,border-color] duration-300 hover:-translate-y-0.5 [&_svg]:size-4 [&_svg]:shrink-0"

function Island({ p, ev }: { p: IslandProps; ev: Required<IslandEvents> }) {
  const onSlow = ev.checkSpeed ? () => ev.onFail("lento") : undefined
  return (
    <Guard onFail={ev.onFail}>
      <div className="prism-island">
        <h1 id="h-prism" className="sr-only">
          {p.title}
        </h1>
        <PrismHero
          eyebrow={p.eyebrow}
          headline={p.headline}
          description={p.description}
          meta={p.meta}
          dispersion={0.48}
          tint="#f4f7ff"
          background="#0a0c10"
          foreground="#e8ecf2"
          accent={ACCENT}
          // estúdio frio, nas cores da marca: branco azulado, azul claro, cobalto e branco
          envColors={["#f2f6ff", "#8fb0ff", "#4f7cff", "#ffffff"]}
          displayFont={DISPLAY_FONT}
          topInset
          play={p.play}
          // mesma coluna do cabeçalho do site (.wrap: 1240px e 20px de margem)
          contentClassName="px-[max(20px,calc((100%_-_1240px)/2_+_20px))]"
          className="h-[200vh]!"
          overlay={<Hud hud={p.hud} />}
          action={
            <a href={p.work.href} className={`${btn} bg-primary text-white hover:bg-accent`}>
              {p.work.label}
              <ArrowRight aria-hidden="true" />
            </a>
          }
          secondaryAction={
            <a
              href={p.chat.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={p.chat.aria}
              className={`${btn} border border-border text-foreground hover:border-accent hover:bg-white/5`}
            >
              <MessageCircle aria-hidden="true" />
              {p.chat.label}
            </a>
          }
          sceneChildren={
            <>
              <DotField onFail={ev.onFail} />
              <FrameWatch onReady={ev.onReady} onSlow={onSlow} onFail={ev.onFail} />
            </>
          }
        />
      </div>
    </Guard>
  )
}

export function mount(el: HTMLElement, props: IslandProps, events: IslandEvents = {}) {
  let ready = false
  let failed = false
  const ev: Required<IslandEvents> = {
    onReady: () => {
      if (ready || failed) return
      ready = true
      events.onReady?.()
    },
    onFail: (reason) => {
      if (failed) return
      failed = true
      events.onFail?.(reason)
    },
    checkSpeed: events.checkSpeed ?? true,
  }
  const root = createRoot(el)
  root.render(<Island p={props} ev={ev} />)
  return {
    update(next: IslandProps) {
      props = next
      if (!failed) root.render(<Island p={props} ev={ev} />)
    },
    unmount() {
      root.unmount()
    },
  }
}
