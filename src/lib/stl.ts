/**
 * Analyse de fichiers STL pour pré-remplir le calculateur.
 *
 * Un fichier STL décrit un maillage de triangles (en millimètres). On en tire :
 *  - le volume solide du maillage (méthode des tétraèdres signés) ;
 *  - la surface totale (somme des aires des triangles) ;
 *  - la boîte englobante (dimensions X/Y/Z).
 *
 * Ces grandeurs purement géométriques servent ensuite à *estimer* la masse de
 * filament et la durée d'impression — voir `estimateFilamentGrams` et
 * `estimatePrintHours`. Ces estimations restent approximatives : seul un slicer
 * réel tient compte des parois exactes, supports, jupes, vitesses, etc.
 */

export interface StlAnalysis {
  /** Nombre de triangles du maillage. */
  triangleCount: number
  /** Volume du maillage solide, en cm³. */
  volumeCm3: number
  /** Surface totale du maillage, en cm². */
  surfaceAreaCm2: number
  /** Dimensions de la boîte englobante, en mm. */
  bounds: { x: number; y: number; z: number }
}

/** Erreur levée quand le contenu ne ressemble pas à un STL exploitable. */
export class StlParseError extends Error {}

/**
 * Détecte un STL binaire : après l'en-tête de 80 octets, un entier 32 bits
 * donne le nombre de triangles, et la taille du fichier doit valoir
 * exactement 84 + 50 × nbTriangles.
 */
function isBinaryStl(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 84) return false
  const triangleCount = new DataView(buffer).getUint32(80, true)
  return buffer.byteLength === 84 + triangleCount * 50
}

/** Accumulateur de géométrie partagé par les deux parseurs. */
class GeometryAccumulator {
  triangleCount = 0
  private volume6 = 0 // 6 × volume signé, divisé à la fin
  surfaceArea = 0
  private min = { x: Infinity, y: Infinity, z: Infinity }
  private max = { x: -Infinity, y: -Infinity, z: -Infinity }

  addTriangle(
    ax: number, ay: number, az: number,
    bx: number, by: number, bz: number,
    cx: number, cy: number, cz: number,
  ) {
    this.triangleCount++

    // Volume signé du tétraèdre (origine, a, b, c) × 6 = a · (b × c).
    this.volume6 +=
      ax * (by * cz - bz * cy) +
      ay * (bz * cx - bx * cz) +
      az * (bx * cy - by * cx)

    // Aire du triangle = ‖(b − a) × (c − a)‖ / 2.
    const ux = bx - ax, uy = by - ay, uz = bz - az
    const vx = cx - ax, vy = cy - ay, vz = cz - az
    const nx = uy * vz - uz * vy
    const ny = uz * vx - ux * vz
    const nz = ux * vy - uy * vx
    this.surfaceArea += Math.hypot(nx, ny, nz) / 2

    this.expandBounds(ax, ay, az)
    this.expandBounds(bx, by, bz)
    this.expandBounds(cx, cy, cz)
  }

  private expandBounds(x: number, y: number, z: number) {
    if (x < this.min.x) this.min.x = x
    if (y < this.min.y) this.min.y = y
    if (z < this.min.z) this.min.z = z
    if (x > this.max.x) this.max.x = x
    if (y > this.max.y) this.max.y = y
    if (z > this.max.z) this.max.z = z
  }

  finalize(): StlAnalysis {
    if (this.triangleCount === 0) {
      throw new StlParseError("Aucun triangle trouvé dans le fichier STL.")
    }
    const volumeMm3 = Math.abs(this.volume6) / 6
    return {
      triangleCount: this.triangleCount,
      volumeCm3: volumeMm3 / 1000, // 1 cm³ = 1000 mm³
      surfaceAreaCm2: this.surfaceArea / 100, // 1 cm² = 100 mm²
      bounds: {
        x: this.max.x - this.min.x,
        y: this.max.y - this.min.y,
        z: this.max.z - this.min.z,
      },
    }
  }
}

function parseBinary(buffer: ArrayBuffer): StlAnalysis {
  const view = new DataView(buffer)
  const count = view.getUint32(80, true)
  const acc = new GeometryAccumulator()

  let offset = 84
  for (let i = 0; i < count; i++) {
    offset += 12 // on saute la normale (3 floats), recalculée au besoin
    const v: number[] = []
    for (let j = 0; j < 9; j++) {
      v.push(view.getFloat32(offset, true))
      offset += 4
    }
    offset += 2 // attribut « byte count »
    acc.addTriangle(v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8])
  }
  return acc.finalize()
}

function parseAscii(buffer: ArrayBuffer): StlAnalysis {
  const text = new TextDecoder().decode(buffer)
  const acc = new GeometryAccumulator()
  const vertexRe = /vertex\s+(-?[\d.eE+]+)\s+(-?[\d.eE+]+)\s+(-?[\d.eE+]+)/g

  const coords: number[] = []
  let match: RegExpExecArray | null
  while ((match = vertexRe.exec(text)) !== null) {
    coords.push(
      Number.parseFloat(match[1]),
      Number.parseFloat(match[2]),
      Number.parseFloat(match[3]),
    )
    if (coords.length === 9) {
      acc.addTriangle(
        coords[0], coords[1], coords[2],
        coords[3], coords[4], coords[5],
        coords[6], coords[7], coords[8],
      )
      coords.length = 0
    }
  }
  return acc.finalize()
}

/** Analyse un fichier STL (ASCII ou binaire) et renvoie sa géométrie. */
export function analyzeStl(buffer: ArrayBuffer): StlAnalysis {
  if (buffer.byteLength < 15) {
    throw new StlParseError("Fichier trop petit pour être un STL valide.")
  }
  return isBinaryStl(buffer) ? parseBinary(buffer) : parseAscii(buffer)
}

export interface MassEstimateOptions {
  /** Densité du filament, en g/cm³. */
  density: number
  /** Taux de remplissage, en % (0–100). */
  infillPercent: number
  /**
   * Épaisseur de paroi pleine (parois + dessus/dessous), en mm.
   * Défaut ≈ 1,2 mm (3 périmètres d'une buse 0,4 mm).
   */
  wallThicknessMm?: number
}

export interface MassEstimate {
  /** Masse estimée de filament, en grammes. */
  grams: number
  /** Volume réellement extrudé (coque + remplissage), en cm³. */
  extrudedVolumeCm3: number
}

/**
 * Estime la masse de filament à partir de la géométrie.
 *
 * Modèle « coque + remplissage » : on traite une couche pleine sur toute la
 * surface (coque), le reste du volume étant rempli au taux choisi. Plus réaliste
 * qu'un simple « volume × remplissage », qui ignore les parois. Reste une
 * approximation (supports, purge et chevauchements non comptés).
 */
export function estimateFilamentGrams(
  analysis: StlAnalysis,
  { density, infillPercent, wallThicknessMm = 1.2 }: MassEstimateOptions,
): MassEstimate {
  const wallCm = wallThicknessMm / 10
  const shellVolume = Math.min(
    analysis.surfaceAreaCm2 * wallCm,
    analysis.volumeCm3,
  )
  const coreVolume = Math.max(analysis.volumeCm3 - shellVolume, 0)
  const extrudedVolumeCm3 = shellVolume + coreVolume * (infillPercent / 100)
  return {
    grams: extrudedVolumeCm3 * density,
    extrudedVolumeCm3,
  }
}

/**
 * Estime (très grossièrement) la durée d'impression à partir du volume extrudé
 * et d'un débit volumétrique typique d'imprimante FDM (~10 mm³/s).
 */
export function estimatePrintHours(
  extrudedVolumeCm3: number,
  volumetricFlowMm3PerS = 10,
): number {
  const extrudedMm3 = extrudedVolumeCm3 * 1000
  return extrudedMm3 / volumetricFlowMm3PerS / 3600
}
