import { useRef, useState } from "react"
import { FileUp, Loader2, Box, AlertCircle } from "lucide-react"

import { NumberField } from "@/components/NumberField"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useI18nContext } from "@/contexts/i18n"
import { getFilament } from "@/lib/filaments"
import {
  analyzeStl,
  estimateFilamentGrams,
  estimatePrintHours,
  StlParseError,
  type StlAnalysis,
} from "@/lib/stl"
import type { UseCalculator } from "@/hooks/useCalculator"

const DEFAULT_INFILL = 15

/** Correspondance locale courte → BCP-47 (pour les métriques STL). */
const LOCALE_BCP47 = { fr: "fr-FR", en: "en-US" } as const

/**
 * Importe un fichier STL, en analyse la géométrie et pré-remplit la quantité
 * de filament et la durée d'impression du calculateur.
 */
export function StlImporter({ calculator }: { calculator: UseCalculator }) {
  const { state, setField } = calculator
  const { t, locale } = useI18nContext()
  const inputRef = useRef<HTMLInputElement>(null)

  const [fileName, setFileName] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<StlAnalysis | null>(null)
  const [infill, setInfill] = useState(DEFAULT_INFILL)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  /** Formate un nombre selon la locale active avec un nombre de décimales fixe. */
  function formatNum(value: number, digits = 1): string {
    return value.toLocaleString(LOCALE_BCP47[locale], {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
  }

  /** Calcule masse + durée et les pousse dans le calculateur. */
  function applyEstimates(result: StlAnalysis, infillPercent: number) {
    const density = getFilament(state.filamentId).density
    const { grams, extrudedVolumeCm3 } = estimateFilamentGrams(result, {
      density,
      infillPercent,
    })
    setField("filamentGrams", Math.round(grams))
    setField(
      "printHours",
      Math.round(estimatePrintHours(extrudedVolumeCm3) * 4) / 4,
    )
  }

  async function handleFile(file: File) {
    setLoading(true)
    setError(null)
    try {
      const buffer = await file.arrayBuffer()
      const result = analyzeStl(buffer)
      setAnalysis(result)
      setFileName(file.name)
      setInfill(DEFAULT_INFILL)
      applyEstimates(result, DEFAULT_INFILL)
    } catch (err) {
      setAnalysis(null)
      setFileName(null)
      setError(
        err instanceof StlParseError
          ? err.message
          : t.stlImporter.errorGeneric,
      )
    } finally {
      setLoading(false)
    }
  }

  function handleInfillChange(value: number) {
    const clamped = Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0
    setInfill(clamped)
    if (analysis) applyEstimates(analysis, clamped)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Box className="size-5 text-primary" />
          {t.stlImporter.cardTitle}
        </CardTitle>
        <CardDescription>{t.stlImporter.cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Zone de dépôt / sélection */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            const file = e.dataTransfer.files?.[0]
            if (file) handleFile(file)
          }}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-input hover:bg-accent"
          }`}
        >
          {loading ? (
            <Loader2 className="size-6 animate-spin text-primary" />
          ) : (
            <FileUp className="text-muted-foreground size-6" />
          )}
          <span className="text-sm font-medium">
            {fileName ?? t.stlImporter.dropZoneIdle}
          </span>
          <span className="text-muted-foreground text-xs">
            {t.stlImporter.dropZoneFormats}
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".stl,model/stl,application/sla"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = "" // permet de réimporter le même fichier
          }}
        />

        {error ? (
          <p className="text-destructive flex items-center gap-2 text-sm">
            <AlertCircle className="size-4" />
            {error}
          </p>
        ) : null}

        {analysis ? (
          <>
            {/* Géométrie mesurée */}
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <Metric label={t.stlImporter.metricDimensions}>
                {formatNum(analysis.bounds.x, 0)} ×{" "}
                {formatNum(analysis.bounds.y, 0)} ×{" "}
                {formatNum(analysis.bounds.z, 0)} mm
              </Metric>
              <Metric label={t.stlImporter.metricVolume}>
                {formatNum(analysis.volumeCm3)} cm³
              </Metric>
              <Metric label={t.stlImporter.metricSurface}>
                {formatNum(analysis.surfaceAreaCm2)} cm²
              </Metric>
              <Metric label={t.stlImporter.metricTriangles}>
                {analysis.triangleCount.toLocaleString(LOCALE_BCP47[locale])}
              </Metric>
            </dl>

            <NumberField
              label={t.stlImporter.infillLabel}
              value={infill}
              onChange={handleInfillChange}
              unit="%"
              step={5}
              max={100}
              hint={t.stlImporter.infillHint}
            />

            <p className="text-muted-foreground text-xs leading-relaxed">
              {t.stlImporter.infillNote}
            </p>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

function Metric({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-muted/40 rounded-lg px-3 py-2">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="font-semibold tabular-nums">{children}</dd>
    </div>
  )
}
