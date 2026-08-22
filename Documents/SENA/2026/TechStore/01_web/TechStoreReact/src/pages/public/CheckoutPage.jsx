import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { CheckIcon, Loader2Icon } from 'lucide-react'

import { StoreHeader } from '@/components/StoreHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/format'
import { useCart } from '@/providers/CartProvider'

const ENVIO = 15000
const METODOS_PAGO = [
  { value: 'Tarjeta de crédito/débito', label: 'Tarjeta de crédito/débito' },
  { value: 'PSE', label: 'PSE' },
  { value: 'Transferencia', label: 'Transferencia bancaria' },
  { value: 'Contraentrega', label: 'Pago contraentrega' },
]

const EMPTY = { telefono: '', direccion: '', ciudad: '', metodoPago: METODOS_PAGO[0].value, nota: '' }

export function CheckoutPage() {
  const { items, total, checkout } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [pedido, setPedido] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    const result = await checkout({ ...form, costoEnvio: ENVIO })
    setSubmitting(false)
    if (result) setPedido(result)
  }

  if (pedido) {
    return (
      <main className="bg-background min-h-screen">
        <StoreHeader />
        <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
          <div className="bg-success/15 text-success mx-auto mb-4 flex size-14 items-center justify-center rounded-full">
            <CheckIcon className="size-7" />
          </div>
          <h1 className="text-xl font-semibold">¡Pedido realizado con éxito!</h1>
          <Card className="mt-6 py-5 text-left">
            <CardContent className="space-y-2 px-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pedido</span>
                <span className="font-medium">{pedido.idPedido}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total pagado</span>
                <span className="font-medium">{formatCurrency(pedido.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Método de pago</span>
                <span className="font-medium">{pedido.metodoPago}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entrega estimada</span>
                <span className="font-medium">{pedido.fechaEstimada}</span>
              </div>
            </CardContent>
          </Card>
          <Button asChild className="mt-6 w-full">
            <NavLink to="/mis-pedidos">Ver mis pedidos</NavLink>
          </Button>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="bg-background min-h-screen">
        <StoreHeader />
        <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
          <p className="text-muted-foreground">Tu carrito está vacío.</p>
          <Button asChild className="mt-4">
            <NavLink to="/productos">Ir al catálogo</NavLink>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-background min-h-screen">
      <StoreHeader />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-xl font-semibold">Finalizar compra</h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
            <Card className="py-5">
              <CardContent className="space-y-4 px-5">
                <p className="font-semibold">Información de envío</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" required value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input id="ciudad" required value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input id="direccion" required value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="py-5">
              <CardContent className="space-y-4 px-5">
                <p className="font-semibold">Método de pago</p>
                <Select value={form.metodoPago} onValueChange={(v) => setForm({ ...form, metodoPago: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METODOS_PAGO.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="space-y-1.5">
                  <Label htmlFor="nota">Nota (opcional)</Label>
                  <Textarea id="nota" value={form.nota} onChange={(e) => setForm({ ...form, nota: e.target.value })} />
                </div>
              </CardContent>
            </Card>
          </form>

          <Card className="h-fit py-5">
            <CardContent className="space-y-3 px-5">
              <p className="font-semibold">Resumen del pedido</p>
              {items.map((item) => (
                <div key={item.idProducto} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate">
                    {item.cantidad} × {item.nombreProducto}
                  </span>
                  <span className="shrink-0">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              <div className="border-border/70 flex justify-between border-t pt-3 text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span>{formatCurrency(ENVIO)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total + ENVIO)}</span>
              </div>
              <Button type="submit" form="checkout-form" className="w-full" disabled={submitting}>
                {submitting ? <Loader2Icon className="size-4 animate-spin" /> : null}
                Confirmar pedido
              </Button>
              <p className="text-muted-foreground text-center text-xs">Pago 100% seguro</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
