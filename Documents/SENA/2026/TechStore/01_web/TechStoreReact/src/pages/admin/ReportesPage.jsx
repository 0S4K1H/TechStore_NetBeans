import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangleIcon,
  BarChart3Icon,
  DollarSignIcon,
  Loader2Icon,
  PackageIcon,
  ShoppingCartIcon,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { pedidosApi, productosApi, ticketsApi } from '@/lib/api'
import { formatCurrency } from '@/lib/format'

const ESTADO_LABELS = {
  pendiente: 'Pendiente',
  preparacion: 'Preparación',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

const CHART_COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)']

const TICKET_LABELS = { abierto: 'Abierto', en_proceso: 'En proceso', cerrado: 'Cerrado' }

const LOW_STOCK_THRESHOLD = 5

function groupBy(items, keyFn) {
  const map = new Map()
  for (const item of items) {
    const key = keyFn(item)
    map.set(key, (map.get(key) ?? 0) + 1)
  }
  return map
}

export function ReportesPage() {
  const [productos, setProductos] = useState(null)
  const [pedidos, setPedidos] = useState(null)
  const [tickets, setTickets] = useState(null)

  useEffect(() => {
    productosApi.list().then(setProductos).catch(() => setProductos([]))
    pedidosApi.list().then(setPedidos).catch(() => setPedidos([]))
    ticketsApi.list().then(setTickets).catch(() => setTickets([]))
  }, [])

  const loading = productos === null || pedidos === null || tickets === null

  const kpis = useMemo(() => {
    if (loading) return null
    const activos = productos.filter((p) => p.activo === 1)
    const ingresos = pedidos.filter((p) => p.estado !== 'cancelado').reduce((sum, p) => sum + Number(p.total ?? 0), 0)
    return {
      productos: activos.length,
      pedidos: pedidos.length,
      ingresos,
      ticketsAbiertos: tickets.filter((t) => t.estado !== 'cerrado').length,
    }
  }, [loading, productos, pedidos, tickets])

  const pedidosPorEstado = useMemo(() => {
    if (loading) return []
    const counts = groupBy(pedidos, (p) => p.estado)
    return Object.keys(ESTADO_LABELS).map((estado) => ({
      estado: ESTADO_LABELS[estado],
      total: counts.get(estado) ?? 0,
    }))
  }, [loading, pedidos])

  const ticketsPorEstado = useMemo(() => {
    if (loading) return []
    const counts = groupBy(tickets, (t) => t.estado)
    return Object.keys(TICKET_LABELS)
      .map((estado) => ({ name: TICKET_LABELS[estado], value: counts.get(estado) ?? 0 }))
      .filter((entry) => entry.value > 0)
  }, [loading, tickets])

  const productosPorCategoria = useMemo(() => {
    if (loading) return []
    const counts = groupBy(
      productos.filter((p) => p.activo === 1),
      (p) => p.categoria
    )
    return Array.from(counts.entries()).map(([categoria, total]) => ({ categoria, total }))
  }, [loading, productos])

  const stockBajo = useMemo(() => {
    if (loading) return []
    return productos
      .filter((p) => p.activo === 1 && p.stock < LOW_STOCK_THRESHOLD)
      .sort((a, b) => a.stock - b.stock)
  }, [loading, productos])

  if (loading) {
    return (
      <div className="text-muted-foreground flex min-h-[50vh] items-center justify-center gap-2 text-sm">
        <Loader2Icon className="size-4 animate-spin" />
        Calculando métricas...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="border-border/70 rounded-2xl border p-6"
      >
        <Badge variant="secondary" className="text-primary mb-2">
          Reportes
        </Badge>
        <h1 className="text-xl font-semibold">Métricas operativas de TechStore</h1>
        <p className="text-muted-foreground text-sm">Calculadas en tiempo real a partir de la base de datos.</p>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="py-5">
          <CardContent className="space-y-2 px-5">
            <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
              <PackageIcon className="size-4.5" />
            </div>
            <p className="text-2xl font-semibold">{kpis.productos}</p>
            <p className="text-sm font-medium">Productos activos</p>
          </CardContent>
        </Card>
        <Card className="py-5">
          <CardContent className="space-y-2 px-5">
            <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
              <ShoppingCartIcon className="size-4.5" />
            </div>
            <p className="text-2xl font-semibold">{kpis.pedidos}</p>
            <p className="text-sm font-medium">Pedidos totales</p>
          </CardContent>
        </Card>
        <Card className="py-5">
          <CardContent className="space-y-2 px-5">
            <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
              <DollarSignIcon className="size-4.5" />
            </div>
            <p className="text-2xl font-semibold">{formatCurrency(kpis.ingresos)}</p>
            <p className="text-sm font-medium">Ingresos (no cancelados)</p>
          </CardContent>
        </Card>
        <Card className="py-5">
          <CardContent className="space-y-2 px-5">
            <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
              <AlertTriangleIcon className="size-4.5" />
            </div>
            <p className="text-2xl font-semibold">{kpis.ticketsAbiertos}</p>
            <p className="text-sm font-medium">Tickets abiertos</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="py-5">
          <CardHeader className="px-5">
            <CardTitle className="text-base">Pedidos por estado</CardTitle>
          </CardHeader>
          <CardContent className="h-72 px-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pedidosPorEstado}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="estado" tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} fill="var(--color-chart-1)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="py-5">
          <CardHeader className="px-5">
            <CardTitle className="text-base">Productos activos por categoría</CardTitle>
          </CardHeader>
          <CardContent className="h-72 px-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productosPorCategoria}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="categoria" tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} fill="var(--color-chart-2)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="py-5">
          <CardHeader className="px-5">
            <CardTitle className="text-base">Tickets por estado</CardTitle>
          </CardHeader>
          <CardContent className="flex h-72 items-center justify-center px-5">
            {ticketsPorEstado.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ticketsPorEstado} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                    {ticketsPorEstado.map((entry, index) => (
                      <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-popover)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm">Sin tickets registrados.</p>
            )}
          </CardContent>
        </Card>

        <Card className="py-5">
          <CardHeader className="px-5">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3Icon className="size-4" />
              Stock bajo (menos de {LOW_STOCK_THRESHOLD} unidades)
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-72 space-y-2 overflow-y-auto px-5">
            {stockBajo.length === 0 ? (
              <p className="text-muted-foreground text-sm">Todo el inventario tiene stock saludable.</p>
            ) : (
              stockBajo.map((producto) => (
                <div key={producto.idProducto} className="flex items-center justify-between text-sm">
                  <span className="truncate">{producto.nombre}</span>
                  <Badge variant={producto.stock === 0 ? 'destructive' : 'warning'}>{producto.stock} und.</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
