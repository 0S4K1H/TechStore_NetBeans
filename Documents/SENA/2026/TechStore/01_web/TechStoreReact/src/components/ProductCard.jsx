import { NavLink } from 'react-router-dom'
import { HeartIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

import { ProductImage } from '@/components/ProductImage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'
import { useCart } from '@/providers/CartProvider'
import { useFavorites } from '@/providers/FavoritesProvider'
import { esNuevo } from '@/lib/productMeta'

export function ProductCard({ producto, imageClassName = 'h-32' }) {
  const cart = useCart()
  const favorites = useFavorites()
  const favorito = favorites.isFavorite(producto.idProducto)
  const reduceMotion = useReducedMotion()

  return (
    <div className="border-border/70 group relative overflow-hidden rounded-xl border bg-card transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(2,8,23,0.18)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cyan-400/10 via-cyan-400/0 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
      <motion.button
        type="button"
        onClick={() => favorites.toggle(producto.idProducto)}
        className="bg-background/80 absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-full backdrop-blur"
        aria-label={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        whileTap={reduceMotion ? undefined : { scale: 0.85 }}
      >
        <motion.span
          className="inline-flex"
          animate={reduceMotion ? undefined : { scale: favorito ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <HeartIcon className={favorito ? 'size-4 fill-destructive text-destructive' : 'text-muted-foreground size-4'} />
        </motion.span>
      </motion.button>

      {esNuevo(producto.fechaCreacion) ? <Badge className="absolute top-2 left-2 z-10">Nuevo</Badge> : null}

      <NavLink to={`/productos/${producto.idProducto}`} className="block">
        <ProductImage
          idProducto={producto.idProducto}
          categoria={producto.categoria}
          nombre={producto.nombre}
          className={imageClassName}
        />
      </NavLink>

      <div className="space-y-1.5 p-4">
        <NavLink to={`/productos/${producto.idProducto}`}>
          <p className="line-clamp-1 font-semibold hover:underline">{producto.nombre}</p>
        </NavLink>
        <p className="text-primary font-semibold">{formatCurrency(producto.precio)}</p>
        <Button
          type="button"
          size="sm"
          className="mt-1 w-full"
          disabled={producto.stock < 1}
          onClick={() => cart.addItem(producto.idProducto, 1)}
        >
          {producto.stock < 1 ? 'Sin stock' : 'Agregar al carrito'}
        </Button>
      </div>
    </div>
  )
}
