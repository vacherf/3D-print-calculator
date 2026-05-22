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

/** Formate un nombre à la française avec un nombre de décimales fixe. */
function fr(value: number, digits = 1): string {
  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/**
 * Importe un fichier STL, en analyse la géométrie et pré-remplit la quantité
 * de filament et la durée d'impression du calculateur.
 */
export function StlImporter({ calculator }: { calculator: UseCalculator }) {
  const { state, setField } = calculator
  const inputRef = useRef<HTMLInputElement>(null)

  const [fileName, setFileName] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<StlAnalysis | null>(null)
  const [infill, setInfill] = useState(DEFAULT_INFILL)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

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
          : "Impossible de lire ce fichier STL.",
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
          Importer un fichier STL
        </CardTitle>
        <CardDescription>
          Analyse le modèle 3D pour estimer automatiquement la matière et la
          durée. Sélectionnez d'abord votre filament ci-dessous.
        </CardDescription>
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
            {fileName ?? "Cliquez ou glissez un fichier .STL ici"}
          </span>
          <span className="text-muted-foreground text-xs">
            Formats STL ASCII et binaire pris en charge
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
              <Metric label="Dimensions">
                {fr(analysis.bounds.x, 0)} × {fr(analysis.bounds.y, 0)} ×{" "}
                {fr(analysis.bounds.z, 0)} mm
              </Metric>
              <Metric label="Volume">{fr(analysis.volumeCm3)} cm³</Metric>
              <Metric label="Surface">{fr(analysis.surfaceAreaCm2)} cm²</Metric>
              <Metric label="Triangles">
                {analysis.triangleCount.toLocaleString("fr-FR")}
              </Metric>
            </dl>

            <NumberField
              label="Taux de remplissage estimé"
              value={infill}
              onChange={handleInfillChange}
              unit="%"
              step={5}
              max={100}
              hint="Ajustez selon votre réglage de slicer : la matière et la durée sont recalculées."
            />

            <p className="text-muted-foreground text-xs leading-relaxed">
              Estimation indicative (modèle coque + remplissage). Supports, purge
              et réglages fins ne sont pas pris en compte — vérifiez avec votre
              slicer pour un devis précis.
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
