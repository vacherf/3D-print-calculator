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
 * Composant de classe qui intercepte les erreurs JavaScript non capturées
 * survenant dans l'arbre React enfant et affiche un écran de repli clair
 * en français plutôt qu'un écran blanc.
 *
 * Placement : autour de `<App />` dans `main.tsx` pour couvrir toute l'interface.
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
      <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
              Une erreur inattendue s'est produite
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              L'application a rencontré un problème et n'a pas pu s'afficher
              correctement. Vos données saisies sont sauvegardées : cliquez sur
              «&nbsp;Réessayer&nbsp;» pour relancer l'interface.
            </p>

            {/* Détail technique dépliable — utile pour le débogage */}
            <details className="group">
              <summary className="cursor-pointer select-none text-xs text-muted-foreground hover:text-foreground transition-colors">
                Détails techniques
              </summary>
              <div className="mt-2 rounded-md bg-muted px-3 py-2 font-mono text-xs break-all">
                <span className="font-semibold">{this.state.errorName}</span>
                {this.state.errorMessage ? (
                  <span> : {this.state.errorMessage}</span>
                ) : null}
              </div>
            </details>
          </CardContent>

          <CardFooter>
            <Button onClick={this.handleReload} className="w-full sm:w-auto">
              <RefreshCw aria-hidden="true" />
              Réessayer
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
}
