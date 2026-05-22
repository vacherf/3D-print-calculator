import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useI18nContext } from "@/contexts/i18n"
import {
  getPrinter,
  PRINTER_BRANDS,
  PRINTERS,
  type PrinterId,
} from "@/lib/printers"

interface PrinterSelectorProps {
  value: PrinterId
  onChange: (id: PrinterId) => void
}

/** Liste déroulante de sélection de l'imprimante, regroupée par marque. */
export function PrinterSelector({ value, onChange }: PrinterSelectorProps) {
  const { t } = useI18nContext()
  const selected = getPrinter(value)

  return (
    <div className="grid gap-1.5">
      <Label htmlFor="printer">{t.printerSelector.label}</Label>
      <Select value={value} onValueChange={(v) => onChange(v as PrinterId)}>
        <SelectTrigger id="printer" className="w-full">
          <SelectValue placeholder={t.printerSelector.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {PRINTER_BRANDS.map((brand) => (
            <SelectGroup key={brand}>
              {/* Les marques d'imprimantes sont des noms propres — non traduits. */}
              <SelectLabel>{brand}</SelectLabel>
              {PRINTERS.filter((p) => p.brand === brand).map((printer) => (
                <SelectItem key={printer.id} value={printer.id}>
                  {printer.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      <p className="text-muted-foreground text-xs leading-snug">
        {selected.id === "custom"
          ? t.printerSelector.hintCustom
          : t.printerSelector.hintEstimated(selected.avgPowerW)}
      </p>
    </div>
  )
}
