import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2Icon } from 'lucide-react'

import { ProductCard } from '@/components/ProductCard'
import { StoreHeader } from '@/components/StoreHeader'
import { CATEGORIAS } from '@/lib/categorias'
import { productosApi } from '@/lib/api'
import { normalize } from '@/lib/normalize'
import { esNuevo } from '@/lib/productMeta'
import { useFavorites } from '@/providers/FavoritesProvider'

export function CatalogoPage() {
  const [products, setProducts] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const favorites = useFavorites()

  const categoria = searchParams.get('categoria') ?? 'todas'
  const marca = searchParams.get('marca') ?? 'todas'
  const query = searchParams.get('q') ?? ''
  const soloFavoritos = searchParams.get('favoritos') === '1'
  const soloNuevos = searchParams.get('nuevo') === '1'

  useEffect(() => {
    productosApi
      .list()
      .then((data) => setProducts((data ?? []).filter((p) => p.activo === 1)))
      .catch(() => setProducts([]))
  }, [])

  const marcas = useMemo(() => {
    if (!products) return []
    return [...new Set(products.map((p) => p.proveedor).filter(Boolean))].sort()
  }, [products])

  const filtered = useMemo(() => {
    if (!products) return []
    return products.filter((item) => {
      const matchesCategoria = categoria === 'todas' || item.categoria === categoria
      const matchesMarca = marca === 'todas' || item.proveedor === marca
      const matchesQuery = !query.trim() || normalize(item.nombre).includes(normalize(query))
      const matchesFavoritos = !soloFavoritos || favorites.isFavorite(item.idProducto)
      const matchesNuevo = !soloNuevos || esNuevo(item.fechaCreacion)
      return matchesCategoria && matchesMarca && matchesQuery && matchesFavoritos && matchesNuevo
    })
  }, [products, categoria, marca, query, soloFavoritos, soloNuevos, favorites])

  function setCategoria(next) {
    const params = new URLSearchParams(searchParams)
    if (next === 'todas') params.delete('categoria')
    else params.set('categoria', next)
    setSearchParams(params)
  }

  function setMarca(next) {
    const params = new URLSearchParams(searchParams)
    if (next === 'todas') params.delete('marca')
    else params.set('marca', next)
    setSearchParams(params)
  }

  return (
    <main className="bg-background min-h-screen">
      <StoreHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">
            {soloFavoritos ? 'Tus favoritos' : soloNuevos ? 'Novedades' : 'Productos'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {query ? `Resultados para "${query}"` : 'Catálogo completo, conectado a la base de datos real.'}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
          <aside className="space-y-1">
            <button
              type="button"
              onClick={() => setCategoria('todas')}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm ${categoria === 'todas' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            >
              Todas
            </button>
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategoria(cat.value)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${categoria === cat.value ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                <cat.icon className="size-4 shrink-0" />
                {cat.label}
              </button>
            ))}

            {marcas.length > 0 ? (
              <>
                <p className="text-muted-foreground mt-4 mb-1 px-3 text-xs font-semibold tracking-wide uppercase">Marca</p>
                <button
                  type="button"
                  onClick={() => setMarca('todas')}
                  className={`block w-full rounded-md px-3 py-2 text-left text-sm ${marca === 'todas' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  Todas
                </button>
                {marcas.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMarca(m)}
                    className={`block w-full rounded-md px-3 py-2 text-left text-sm ${marca === m ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  >
                    {m}
                  </button>
                ))}
              </>
            ) : null}
          </aside>

          <section>
            {products === null ? (
              <div className="text-muted-foreground flex items-center justify-center gap-2 py-16 text-sm">
                <Loader2Icon className="size-4 animate-spin" />
                Cargando...
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-muted-foreground py-16 text-center text-sm">
                {soloFavoritos ? 'Aún no marcaste productos como favoritos.' : 'No hay productos que coincidan.'}
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((item) => (
                  <ProductCard key={item.idProducto} producto={item} imageClassName="h-40" />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
