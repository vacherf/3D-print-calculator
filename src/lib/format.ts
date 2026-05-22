/** Helpers de formatage à la française (euros, kWh…). */

const eurosFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const numberFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 3,
})

export function formatEuros(value: number): string {
  return eurosFormatter.format(Number.isFinite(value) ? value : 0)
}

export function formatKwh(value: number): string {
  return `${numberFormatter.format(Number.isFinite(value) ? value : 0)} kWh`
}
