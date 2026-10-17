/* "Ilha" React do portfólio: o PrismHero (cristal 3D) no topo do site estático.
   O build gera lib/prism-hero.min.js (script clássico, global PrismIsland) e css/prism-hero.css.
   O js/app.js decide se a ilha entra (GPU de verdade, sem "reduzir movimento", sem economia de dados),
   chama PrismIsland.mount() e, enquanto isso, o topo em HTML continua no lugar. */
import "./index.css"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { useFrame } from "@react-three/fiber"
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
}

export interface IslandEvents {
  /** Primeiro quadro desenhado: hora de trocar o topo em HTML pelo 3D. */
  onReady?: () => void
  /** Erro no WebGL ou quadros lentos demais: o site volta para o topo em HTML. */
  onFail?: (reason: string) => void
  /** false = não desiste em aparelho lento (o site passa false com ?3d=1, para testes). */
  checkSpeed?: boolean
}

const DISPLAY_FONT = "Geist, 'Helvetica Neue', Arial, sans-serif"

/**
 * Mora dentro do Canvas (via sceneChildren) para saber quando o primeiro quadro saiu
 * e medir o ritmo dos quadros. Mediana acima de ~45 ms (menos de 22 fps) = aparelho sem fôlego.
 */
function FrameWatch({ onReady, onSlow }: { onReady: () => void; onSlow?: () => void }) {
  const frames = React.useRef(0)
  const deltas = React.useRef<number[]>([])
  const done = React.useRef(false)

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
          dispersion={0.42}
          tint="#f4f7ff"
          background="#0a0c10"
          foreground="#e8ecf2"
          accent="#4f7cff"
          displayFont={DISPLAY_FONT}
          topInset
          // mesma coluna do cabeçalho do site (.wrap: 1240px e 20px de margem)
          contentClassName="px-[max(20px,calc((100%_-_1240px)/2_+_20px))]"
          className="h-[200vh]!"
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
          sceneChildren={<FrameWatch onReady={ev.onReady} onSlow={onSlow} />}
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
