const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' })

export function formatCurrency(value) {
  const number = Number(value ?? 0)
  return currencyFormatter.format(Number.isFinite(number) ? number : 0)
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : dateFormatter.format(date)
}
