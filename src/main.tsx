import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "@/App"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { I18nProvider } from "@/contexts/I18nContext"
import "@/index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/*
     * I18nProvider est placé au-dessus de ErrorBoundary pour que le contexte
     * de langue reste disponible même quand ErrorBoundary affiche l'écran de repli.
     */}
    <I18nProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </I18nProvider>
  </StrictMode>,
)
