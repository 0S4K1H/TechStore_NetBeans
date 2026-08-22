import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { LifeBuoyIcon, Loader2Icon, PackageIcon, ShoppingCartIcon, TruckIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getVisibleNavigationGroups } from '@/lib/navigation'
import { pedidosApi, productosApi, proveedoresApi, ticketsApi } from '@/lib/api'
import { useAuth } from '@/providers/AuthProvider'

export function DashboardPage() {
  const { session } = useAuth()
  const groups = getVisibleNavigationGroups(session?.role)
  const [counts, setCounts] = useState(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([productosApi.list(), pedidosApi.list(), proveedoresApi.list(), ticketsApi.list()])
      .then(([productos, pedidos, proveedores, tickets]) => {
        if (cancelled) return
        setCounts({
          productos: productos?.length ?? 0,
          pedidos: pedidos?.length ?? 0,
          proveedores: proveedores?.length ?? 0,
          ticketsAbiertos: (tickets ?? []).filter((t) => t.estado !== 'cerrado').length,
        })
      })
      .catch(() => {
        if (!cancelled) setCounts({ productos: 0, pedidos: 0, proveedores: 0, ticketsAbiertos: 0 })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const stats = [
    { icon: PackageIcon, label: 'Productos activos', value: counts?.productos, detail: 'Catálogo con equipos, accesorios y periféricos.' },
    { icon: ShoppingCartIcon, label: 'Pedidos registrados', value: counts?.pedidos, detail: 'Órdenes con estado y trazabilidad visibles.' },
    { icon: TruckIcon, label: 'Proveedores activos', value: counts?.proveedores, detail: 'Abastecimiento organizado por origen.' },
    { icon: LifeBuoyIcon, label: 'Tickets abiertos', value: counts?.ticketsAbiertos, detail: 'Incidencias que aún requieren respuesta.' },
  ]

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="border-border/70 rounded-2xl border p-6 sm:p-8"
      >
        <Badge variant="secondary" className="text-primary mb-3">
          Resumen operativo
        </Badge>
        <h1 className="max-w-2xl text-xl font-semibold text-balance sm:text-2xl">
          Hola {session?.name?.split(' ')[0] ?? 'de nuevo'}, esto es lo que pasa hoy en TechStore.
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
          Productos, pedidos, usuarios y soporte centralizados en una sola plataforma con acceso
          por rol.
        </p>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.28 }}
          >
            <Card className="py-5">
              <CardContent className="space-y-2 px-5">
                <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
                  <stat.icon className="size-4.5" />
                </div>
                <p className="text-2xl font-semibold">
                  {counts === null ? <Loader2Icon className="size-5 animate-spin" /> : stat.value}
                </p>
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-muted-foreground text-xs">{stat.detail}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {groups.map((group, groupIndex) => (
        <section key={group.title} className="space-y-3">
          <div>
            <Badge variant="secondary" className="text-primary mb-1">
              {group.title}
            </Badge>
            <h2 className="text-lg font-semibold">Accesos rápidos</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.08 + index * 0.05, duration: 0.28 }}
              >
                <NavLink to={`/app/${item.path}`}>
                  <Card className="hover:border-primary/50 h-full py-5 transition-colors">
                    <CardContent className="space-y-2 px-5">
                      <item.icon className="text-primary size-5" />
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
