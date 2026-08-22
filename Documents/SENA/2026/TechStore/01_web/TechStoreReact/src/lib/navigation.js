import {
  BarChart3,
  LayoutDashboard,
  Package,
  ShoppingCart,
  ShoppingBag,
  Users,
  Truck,
  LifeBuoy,
} from 'lucide-react'

import { canAccessModule } from './access'

export const NAVIGATION = [
  {
    path: 'dashboard',
    label: 'Inicio',
    icon: LayoutDashboard,
    group: 'Operación',
    description: 'Centro de control TechStore.',
  },
  {
    path: 'productos',
    label: 'Productos',
    icon: Package,
    group: 'Comercial',
    description: 'Inventario, búsqueda y pricing.',
  },
  {
    path: 'pedidos',
    label: 'Pedidos',
    icon: ShoppingCart,
    group: 'Comercial',
    description: 'Órdenes, estados y seguimiento.',
  },
  {
    path: 'carritos',
    label: 'Carritos',
    icon: ShoppingBag,
    group: 'Comercial',
    description: 'Preventa y consolidación.',
  },
  {
    path: 'tickets',
    label: 'Tickets',
    icon: LifeBuoy,
    group: 'Comercial',
    description: 'Incidencias y trazabilidad.',
  },
  {
    path: 'usuarios',
    label: 'Usuarios',
    icon: Users,
    group: 'Operación',
    description: 'Perfiles y autenticación.',
  },
  {
    path: 'proveedores',
    label: 'Proveedores',
    icon: Truck,
    group: 'Operación',
    description: 'Origen del inventario.',
  },
  {
    path: 'reportes',
    label: 'Reportes',
    icon: BarChart3,
    group: 'Operación',
    description: 'Métricas e indicadores del negocio.',
  },
]

export function getVisibleNavigation(role) {
  return NAVIGATION.filter((item) => canAccessModule(role, item.path))
}

export function getVisibleNavigationGroups(role) {
  const visible = getVisibleNavigation(role)
  const groups = []
  for (const item of visible) {
    let group = groups.find((entry) => entry.title === item.group)
    if (!group) {
      group = { title: item.group, items: [] }
      groups.push(group)
    }
    group.items.push(item)
  }
  return groups
}
