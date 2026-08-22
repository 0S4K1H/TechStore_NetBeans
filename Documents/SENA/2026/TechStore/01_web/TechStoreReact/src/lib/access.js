import { normalize } from './normalize'

export const ROLES = {
  ADMIN: 'administrador',
  EMPLEADO: 'empleado',
  CLIENTE: 'cliente',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.EMPLEADO]: 'Empleado comercial',
  [ROLES.CLIENTE]: 'Cliente',
}

const ROLE_ALIASES = {
  administrador: ROLES.ADMIN,
  admin: ROLES.ADMIN,
  empleado: ROLES.EMPLEADO,
  'empleado comercial': ROLES.EMPLEADO,
  cliente: ROLES.CLIENTE,
  'cliente registrado': ROLES.CLIENTE,
}

const INTERNAL_ROLES = [ROLES.ADMIN, ROLES.EMPLEADO]

export function normalizeRole(role) {
  return ROLE_ALIASES[normalize(role)] ?? null
}

export function isInternalRole(role) {
  return INTERNAL_ROLES.includes(normalizeRole(role))
}

export function isAdmin(role) {
  return normalizeRole(role) === ROLES.ADMIN
}

// Which roles can reach each /app/* module. Missing key = nobody internal-specific, deny by default.
export const MODULE_ACCESS = {
  dashboard: [ROLES.ADMIN, ROLES.EMPLEADO],
  productos: [ROLES.ADMIN, ROLES.EMPLEADO],
  pedidos: [ROLES.ADMIN, ROLES.EMPLEADO],
  carritos: [ROLES.ADMIN, ROLES.EMPLEADO],
  tickets: [ROLES.ADMIN, ROLES.EMPLEADO],
  usuarios: [ROLES.ADMIN],
  proveedores: [ROLES.ADMIN],
  reportes: [ROLES.ADMIN],
}

export function canAccessModule(role, moduleKey) {
  const allowed = MODULE_ACCESS[moduleKey]
  if (!allowed) return false
  return allowed.includes(normalizeRole(role))
}

export function getLandingPath(role) {
  return isInternalRole(role) ? '/app/dashboard' : '/'
}
