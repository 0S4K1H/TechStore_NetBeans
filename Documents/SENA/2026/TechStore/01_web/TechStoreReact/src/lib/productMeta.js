const NUEVO_DIAS = 30

export function esNuevo(fechaCreacion) {
  if (!fechaCreacion) return false
  const dias = (Date.now() - new Date(fechaCreacion).getTime()) / (1000 * 60 * 60 * 24)
  return dias <= NUEVO_DIAS
}
