import { useId } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NumberFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  /** Texte d'aide affiché sous le champ. */
  hint?: string
  /** Suffixe affiché à droite du champ (ex. « g », « € », « h »). */
  unit?: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

/**
 * Champ numérique étiqueté et réutilisable. Convertit la saisie en nombre et
 * affiche une unité optionnelle ainsi qu'un texte d'aide.
 */
export function NumberField({
  label,
  value,
  onChange,
  hint,
  unit,
  min = 0,
  max,
  step = 1,
  disabled = false,
}: NumberFieldProps) {
  const id = useId()

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : ""}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          className={unit ? "pr-12" : undefined}
        />
        {unit ? (
          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm">
            {unit}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p className="text-muted-foreground text-xs leading-snug">{hint}</p>
      ) : null}
    </div>
  )
}
