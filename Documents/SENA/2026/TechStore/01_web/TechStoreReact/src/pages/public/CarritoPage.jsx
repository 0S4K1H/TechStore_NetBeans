import { NavLink, useNavigate } from 'react-router-dom'
import { Loader2Icon, MinusIcon, PlusIcon, ShoppingCartIcon, TrashIcon } from 'lucide-react'

import { ProductImage } from '@/components/ProductImage'
import { StoreHeader } from '@/components/StoreHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import { useCart } from '@/providers/CartProvider'

const ENVIO = 15000

export function CarritoPage() {
  const { items, loading, total, updateItem, removeItem } = useCart()
  const navigate = useNavigate()

  return (
    <main className="bg-background min-h-screen">
      <StoreHeader />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-xl font-semibold">Carrito de compras</h1>

        {loading ? (
          <div className="text-muted-foreground flex items-center justify-center gap-2 py-16 text-sm">
            <Loader2Icon className="size-4 animate-spin" />
            Cargando...
          </div>
        ) : items.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-3 py-16 text-center text-sm">
            <ShoppingCartIcon className="size-8" />
            Tu carrito está vacío.
            <Button asChild size="sm">
              <NavLink to="/productos">Ir al catálogo</NavLink>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {items.map((item) => (
                <Card key={item.idProducto} className="py-4">
                  <CardContent className="flex items-center gap-4 px-5">
                    <ProductImage
                      idProducto={item.idProducto}
                      categoria={item.categoria}
                      nombre={item.nombreProducto}
                      className="size-16 shrink-0 rounded-lg overflow-hidden"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.nombreProducto}</p>
                      <p className="text-muted-foreground text-sm">{formatCurrency(item.precioUnitario)} c/u</p>
                    </div>
                    <div className="border-border/70 flex items-center rounded-md border">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => updateItem(item.idProducto, Math.max(1, item.cantidad - 1))}
                      >
                        <MinusIcon className="size-3.5" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.cantidad}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => updateItem(item.idProducto, item.cantidad + 1)}
                      >
                        <PlusIcon className="size-3.5" />
                      </Button>
                    </div>
                    <p className="w-28 text-right font-semibold">{formatCurrency(item.subtotal)}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => removeItem(item.idProducto)}
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="h-fit py-5">
              <CardContent className="space-y-3 px-5">
                <p className="font-semibold">Resumen del pedido</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span>{formatCurrency(ENVIO)}</span>
                </div>
                <div className="border-border/70 flex justify-between border-t pt-3 font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(total + ENVIO)}</span>
                </div>
                <Button className="w-full" onClick={() => navigate('/checkout')}>
                  Finalizar compra
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
