import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { Loader2Icon, MinusIcon, PlusIcon } from 'lucide-react'

import { ProductImage } from '@/components/ProductImage'
import { StoreHeader } from '@/components/StoreHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { categoriaLabel } from '@/lib/categorias'
import { productosApi } from '@/lib/api'
import { formatCurrency } from '@/lib/format'
import { useCart } from '@/providers/CartProvider'

export function ProductoDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cart = useCart()
  const [producto, setProducto] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => {
    setProducto(null)
    setNotFound(false)
    productosApi
      .get(id)
      .then(setProducto)
      .catch(() => setNotFound(true))
  }, [id])

  if (notFound) {
    return (
      <main className="bg-background min-h-screen">
        <StoreHeader />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <p className="text-muted-foreground">Producto no encontrado.</p>
          <Button asChild className="mt-4">
            <NavLink to="/productos">Volver al catálogo</NavLink>
          </Button>
        </div>
      </main>
    )
  }

  if (!producto) {
    return (
      <main className="bg-background min-h-screen">
        <StoreHeader />
        <div className="text-muted-foreground flex items-center justify-center gap-2 py-24 text-sm">
          <Loader2Icon className="size-4 animate-spin" />
          Cargando...
        </div>
      </main>
    )
  }

  return (
    <main className="bg-background min-h-screen">
      <StoreHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <nav className="text-muted-foreground mb-6 text-sm">
          <NavLink to="/productos" className="hover:text-foreground">
            Productos
          </NavLink>
          <span className="mx-2">/</span>
          <NavLink to={`/productos?categoria=${producto.categoria}`} className="hover:text-foreground">
            {categoriaLabel(producto.categoria)}
          </NavLink>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <ProductImage
            idProducto={producto.idProducto}
            categoria={producto.categoria}
            nombre={producto.nombre}
            className="border-border/70 aspect-square overflow-hidden rounded-2xl border"
          />

          <div className="space-y-5">
            <div>
              <Badge variant="outline" className="mb-2">
                {categoriaLabel(producto.categoria)}
              </Badge>
              <h1 className="text-2xl font-semibold">{producto.nombre}</h1>
              <p className="text-muted-foreground text-sm">Vendido por {producto.proveedor}</p>
            </div>

            <p className="text-primary text-3xl font-semibold">{formatCurrency(producto.precio)}</p>

            <Badge variant={producto.stock > 0 ? 'success' : 'destructive'}>
              {producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Sin stock'}
            </Badge>

            <div className="flex items-center gap-3">
              <div className="border-border/70 flex items-center rounded-md border">
                <Button type="button" variant="ghost" size="icon" onClick={() => setCantidad((c) => Math.max(1, c - 1))}>
                  <MinusIcon className="size-3.5" />
                </Button>
                <span className="w-10 text-center text-sm">{cantidad}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setCantidad((c) => Math.min(producto.stock, c + 1))}
                >
                  <PlusIcon className="size-3.5" />
                </Button>
              </div>

              <Button
                type="button"
                size="lg"
                disabled={producto.stock < 1}
                onClick={async () => {
                  const ok = await cart.addItem(producto.idProducto, cantidad)
                  if (ok) navigate('/carrito')
                }}
              >
                Agregar al carrito
              </Button>
            </div>

            <div className="border-border/70 grid grid-cols-2 gap-4 border-t pt-5 text-sm">
              <div>
                <p className="text-muted-foreground">Código</p>
                <p className="font-medium">{producto.codigoInv}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Categoría</p>
                <p className="font-medium">{categoriaLabel(producto.categoria)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
