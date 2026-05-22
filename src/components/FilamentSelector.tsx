import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FILAMENTS, getFilament, type FilamentId } from "@/lib/filaments"

interface FilamentSelectorProps {
  value: FilamentId
  onChange: (id: FilamentId) => void
}

/** Liste déroulante de sélection du type de filament. */
export function FilamentSelector({ value, onChange }: FilamentSelectorProps) {
  const selected = getFilament(value)

  return (
    <div className="grid gap-1.5">
      <Label htmlFor="filament">Type de filament</Label>
      <Select value={value} onValueChange={(v) => onChange(v as FilamentId)}>
        <SelectTrigger id="filament" className="w-full">
          <SelectValue placeholder="Choisir un filament" />
        </SelectTrigger>
        <SelectContent>
          {FILAMENTS.map((filament) => (
            <SelectItem key={filament.id} value={filament.id}>
              {filament.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-muted-foreground text-xs leading-snug">
        {selected.description}
      </p>
    </div>
  )
}
