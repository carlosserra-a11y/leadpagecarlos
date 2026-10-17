/* Só para `npm run dev`: mostra o demo original do componente (o site usa src/island.tsx). */
import "./dev.css"
import * as React from "react"
import { createRoot } from "react-dom/client"
import PrismHeroDemo from "@/components/prism-hero-demo"

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="prism-island">
      <PrismHeroDemo />
    </div>
  </React.StrictMode>
)
