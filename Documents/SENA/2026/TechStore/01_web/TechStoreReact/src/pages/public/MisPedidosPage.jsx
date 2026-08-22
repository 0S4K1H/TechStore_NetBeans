import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CheckIcon, ClockIcon, Loader2Icon, PackageIcon } from 'lucide-react'

import { StoreHeader } from '@/components/StoreHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency, formatDate } from '@/lib/format'
import { pedidosApi } from '@/lib/api'

const ESTADO_VARIANT = {
  pendiente: 'warning',
  preparacion: 'warning',
  enviado: 'secondary',
  entregado: 'success',
  cancelado: 'destructive',
}

const ESTADO_STEPS = ['pendiente', 'preparacion', 'enviado', 'entregado']

function OrderDetail({ pedido, onClose }) {
  const [items, setItems] = useState([])
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pedido) return
    setLoading(true)
    Promise.all([pedidosApi.items(pedido.idPedido), pedidosApi.timeline(pedido.idPedido)])
      .then(([itemsData, timelineData]) => {
        setItems(itemsData ?? [])
        setTimeline(timelineData ?? [])
      })
      .catch(() => {
        setItems([])
        setTimeline([])
      })
      .finally(() => setLoading(false))
  }, [pedido])

  const activeStep = ESTADO_STEPS.indexOf(pedido?.estado)

  return (
    <Dialog open={Boolean(pedido)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Pedido {pedido?.idPedido}</DialogTitle>
          <DialogDescription>{pedido?.direccion}, {pedido?.ciudad}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-muted-foreground flex items-center justify-center gap-2 py-8 text-sm">
            <Loader2Icon className="size-4 animate-spin" />
            Cargando...
          </div>
        ) : (
          <div className="space-y-6">
            {pedido?.estado !== 'cancelado' ? (
              <div className="flex items-center justify-between">
                {ESTADO_STEPS.map((step, index) => (
                  <div key={step} className="flex flex-1 flex-col items-center gap-1.5">
                    <div
                      className={`flex size-7 items-center justify-center rounded-full text-xs font-medium ${
                        index <= activeStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index < activeStep ? <CheckIcon className="size-3.5" /> : index + 1}
                    </div>
                    <span className="text-muted-foreground text-center text-[10px] capitalize">{step}</span>
                  </div>
                ))}
              </div>
            ) : (
              <Badge variant="destructive">Pedido cancelado</Badge>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">Productos</p>
              {items.map((item) => (
                <div key={item.idDetalle} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.cantidad} × {item.nombreProducto}
                  </span>
                  <span>{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              <div className="border-border/70 flex items-center justify-between border-t pt-2 text-sm font-semibold">
                <span>Total</span>
                <span>{formatCurrency(pedido?.total)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Seguimiento</p>
              <div className="space-y-2">
                {timeline.map((evento) => (
                  <div key={evento.idEvento} className="flex items-start gap-2 text-sm">
                    <ClockIcon className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
                    <div>
                      <p>{evento.descripcion}</p>
                      <p className="text-muted-foreground text-xs">{formatDate(evento.fechaEvento)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function MisPedidosPage() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    pedidosApi
      .list()
      .then((data) => setPedidos(data ?? []))
      .catch(() => setPedidos([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="bg-background min-h-screen">
      <StoreHeader />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="mb-6 text-xl font-semibold">Mis pedidos</h1>
        {loading ? (
          <div className="text-muted-foreground flex items-center justify-center gap-2 py-16 text-sm">
            <Loader2Icon className="size-4 animate-spin" />
            Cargando pedidos...
          </div>
        ) : pedidos.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-3 py-16 text-center text-sm">
            <PackageIcon className="size-8" />
            Todavía no tienes pedidos. Explora el catálogo y realiza tu primera compra.
            <Button asChild size="sm">
              <NavLink to="/">Ir al catálogo</NavLink>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {pedidos.map((pedido) => (
              <Card key={pedido.idPedido} className="cursor-pointer py-4" onClick={() => setSelected(pedido)}>
                <CardContent className="flex items-center justify-between px-5">
                  <div>
                    <p className="font-semibold">{pedido.idPedido}</p>
                    <p className="text-muted-foreground text-sm">{formatDate(pedido.fechaCreacion)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{formatCurrency(pedido.total)}</span>
                    <Badge variant={ESTADO_VARIANT[pedido.estado] ?? 'secondary'}>{pedido.estado}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <OrderDetail pedido={selected} onClose={() => setSelected(null)} />
    </main>
  )
}
