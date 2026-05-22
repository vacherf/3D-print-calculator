import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useI18nContext } from "@/contexts/i18n"

interface Props {
  children: ReactNode
}

interface State {
  /** L'arbre enfant a-t-il levé une erreur ? */
  hasError: boolean
  /** Nom de l'erreur capturée (ex. « TypeError »). */
  errorName: string
  /** Message de l'erreur capturée. */
  errorMessage: string
}

/**
 * Composant fonctionnel d'écran de repli, traduit via le contexte i18n.
 *
 * Séparé du composant de classe `ErrorBoundary` pour pouvoir utiliser
 * le hook `useI18nContext`. Le contexte est disponible car `I18nProvider`
 * est monté au-dessus de `ErrorBoundary` dans `main.tsx`.
 */
function ErrorFallback({
  errorName,
  errorMessage,
  onReload,
}: {
  errorName: string
  errorMessage: string
  onReload: () => void
}) {
  const { t } = useI18nContext()

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-destructive">
            <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
            {t.errorBoundary.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {t.errorBoundary.description}
          </p>

          {/* Détail technique dépliable — utile pour le débogage */}
          <details className="group">
            <summary className="cursor-pointer select-none text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t.errorBoundary.detailsLabel}
            </summary>
            <div className="mt-2 rounded-md bg-muted px-3 py-2 font-mono text-xs break-all">
              <span className="font-semibold">{errorName}</span>
              {errorMessage ? (
                <span> : {errorMessage}</span>
              ) : null}
            </div>
          </details>
        </CardContent>

        <CardFooter>
          <Button onClick={onReload} className="w-full sm:w-auto">
            <RefreshCw aria-hidden="true" />
            {t.errorBoundary.retryButton}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

/**
 * Composant de classe qui intercepte les erreurs JavaScript non capturées
 * survenant dans l'arbre React enfant et affiche un écran de repli clair
 * plutôt qu'un écran blanc.
 *
 * L'écran de repli (`ErrorFallback`) est un composant fonctionnel séparé
 * afin de pouvoir consommer le contexte i18n (les hooks ne peuvent pas être
 * appelés dans un composant de classe).
 *
 * Placement : à l'intérieur de `<I18nProvider>` dans `main.tsx`, afin que
 * le contexte de langue reste disponible lors de l'affichage du fallback.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      errorName: "",
      errorMessage: "",
    }
  }

  /**
   * Appelé lors du rendu quand une erreur est levée dans l'arbre enfant.
   * Met à jour le state pour déclencher l'affichage de l'écran de repli.
   */
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorName: error.name ?? "Erreur",
      errorMessage: error.message ?? "Aucun détail disponible.",
    }
  }

  /**
   * Appelé après le rendu de l'écran de repli.
   * Permet d'accéder à l'objet `error` et à `errorInfo.componentStack`.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Journalisation dans la console pour faciliter le débogage.
    console.error(
      "[ErrorBoundary] Erreur capturée dans l'arbre React :",
      error,
      errorInfo.componentStack,
    )
  }

  /** Recharge la page. Les données persistées dans le localStorage sont conservées. */
  private handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <ErrorFallback
        errorName={this.state.errorName}
        errorMessage={this.state.errorMessage}
        onReload={this.handleReload}
      />
    )
  }
}
