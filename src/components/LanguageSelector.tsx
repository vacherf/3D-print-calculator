/**
 * Sélecteur de langue de l'interface.
 *
 * Affiche un menu déroulant compact (drapeau + code FR / EN / ES / DE) dans
 * l'en-tête, à côté du bouton de bascule de thème. Les drapeaux sont des SVG
 * fournis par `country-flag-icons` (les emojis-drapeaux ne s'affichent pas
 * sous Windows).
 */

import FR from "country-flag-icons/react/3x2/FR"
import GB from "country-flag-icons/react/3x2/GB"
import ES from "country-flag-icons/react/3x2/ES"
import DE from "country-flag-icons/react/3x2/DE"
import type { ComponentType } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { SUPPORTED_LOCALES, type Locale } from "@/locales"

interface LanguageSelectorProps {
  /** Locale actuellement active. */
  locale: Locale
  /** Libellé accessible du sélecteur (traduit par le parent). */
  ariaLabel: string
  /** Callback appelé quand l'utilisateur change de langue. */
  onChange: (locale: Locale) => void
}

/**
 * Drapeaux indexés par code pays ISO. On importe uniquement les drapeaux
 * réellement utilisés (tree-shaking) — ajouter une langue = importer son
 * drapeau et l'enregistrer ici.
 */
const FLAGS: Record<
  string,
  ComponentType<{ title?: string; className?: string }> | undefined
> = { FR, GB, ES, DE }

/** Drapeau SVG d'un pays, ou rien si le code est inconnu. */
function Flag({ country, label }: { country: string; label: string }) {
  const FlagIcon = FLAGS[country]
  if (!FlagIcon) return null
  // `rounded-[2px]` arrondit légèrement les coins ; `h-3.5` cale la hauteur sur le texte.
  return <FlagIcon title={label} className="h-3.5 w-auto shrink-0 rounded-[2px]" />
}

/** Sélecteur compact (drapeau + code à 2 lettres) pour la bascule de langue. */
export function LanguageSelector({
  locale,
  ariaLabel,
  onChange,
}: LanguageSelectorProps) {
  const active = SUPPORTED_LOCALES.find((l) => l.code === locale)

  return (
    <Select value={locale} onValueChange={(v) => onChange(v as Locale)}>
      <SelectTrigger
        className="h-9 w-[5rem] gap-1.5"
        aria-label={ariaLabel}
        title={ariaLabel}
      >
        {active && <Flag country={active.country} label={active.labelNative} />}
        <span className="font-medium">{locale.toUpperCase()}</span>
      </SelectTrigger>
      <SelectContent align="end">
        {SUPPORTED_LOCALES.map(({ code, labelNative, country }) => (
          <SelectItem key={code} value={code}>
            <Flag country={country} label={labelNative} />
            <span className="ml-2 font-medium">{code.toUpperCase()}</span>
            <span className="text-muted-foreground ml-2">{labelNative}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
