/**
 * Sélecteur de langue de l'interface.
 *
 * Affiche un menu déroulant compact (codes FR / EN) dans l'en-tête,
 * à côté du bouton de bascule de thème.
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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

/** Sélecteur compact (code à 2 lettres) pour la bascule de langue. */
export function LanguageSelector({
  locale,
  ariaLabel,
  onChange,
}: LanguageSelectorProps) {
  return (
    <Select value={locale} onValueChange={(v) => onChange(v as Locale)}>
      <SelectTrigger
        className="h-9 w-[4.5rem]"
        aria-label={ariaLabel}
        title={ariaLabel}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {SUPPORTED_LOCALES.map(({ code, labelNative }) => (
          <SelectItem key={code} value={code}>
            {labelNative}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
