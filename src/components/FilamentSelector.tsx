import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useI18nContext } from "@/contexts/i18n"
import { FILAMENTS, getFilament, type FilamentId } from "@/lib/filaments"

interface FilamentSelectorProps {
  value: FilamentId
  onChange: (id: FilamentId) => void
}

/** Liste déroulante de sélection du type de filament. */
export function FilamentSelector({ value, onChange }: FilamentSelectorProps) {
  const { t } = useI18nContext()
  const selected = getFilament(value)

  return (
    <div className="grid gap-1.5">
      <Label htmlFor="filament">{t.filamentSelector.label}</Label>
      <Select value={value} onValueChange={(v) => onChange(v as FilamentId)}>
        <SelectTrigger id="filament" className="w-full">
          <SelectValue placeholder={t.filamentSelector.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {FILAMENTS.map((filament) => (
            <SelectItem key={filament.id} value={filament.id}>
              {/* Les noms de filaments (PLA, PETG…) sont des noms techniques invariants — non traduits. */}
              {filament.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-muted-foreground text-xs leading-snug">
        {/* La description du filament sélectionné est un nom de référence technique — non traduite. */}
        {selected.description}
      </p>
    </div>
  )
}
