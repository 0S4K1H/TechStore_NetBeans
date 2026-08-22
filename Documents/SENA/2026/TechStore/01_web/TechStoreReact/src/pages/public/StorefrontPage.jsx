import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { CreditCardIcon, HeadphonesIcon, ShieldCheckIcon, TruckIcon } from 'lucide-react'

import { ProductCard } from '@/components/ProductCard'
import { StoreFooter } from '@/components/StoreFooter'
import { StoreHeader } from '@/components/StoreHeader'
import { StorefrontAtmosphere } from '@/components/StorefrontAtmosphere'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assetUrl } from '@/lib/assetPath'
import { CATEGORIAS } from '@/lib/categorias'
import { productosApi } from '@/lib/api'

const MotionNavLink = motion.create(NavLink)

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const STAGGER_GRID = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const SLIDES = [
  {
    tag: 'Stock verificado',
    titleLead: 'Tecnología premium',
    titleHighlight: 'sin fricción',
    description: 'Catálogo real, navegación clara y una compra guiada para decidir más rápido y con confianza.',
  },
  {
    tag: 'Selección curada',
    titleLead: 'Portátiles, gaming',
    titleHighlight: 'y componentes',
    description: 'Encuentra equipos para trabajo, estudio o juego sin perder tiempo entre opciones dispersas.',
  },
  {
    tag: 'Compra segura',
    titleLead: 'Del catálogo al pedido',
    titleHighlight: 'en pocos pasos',
    description: 'Explora, compara y continúa tu compra con una experiencia limpia de principio a fin.',
  },
]

const TRUST_ITEMS = [
  { icon: TruckIcon, title: 'Stock real', description: 'Siempre actualizado' },
  { icon: ShieldCheckIcon, title: 'Garantía oficial', description: 'Hasta 12 meses' },
  { icon: CreditCardIcon, title: 'Pagos seguros', description: 'Métodos confiables' },
  { icon: HeadphonesIcon, title: 'Soporte 24/7', description: 'Te acompañamos' },
]

export function StorefrontPage() {
  const [slide, setSlide] = useState(0)
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) {
      return undefined
    }
    const id = window.setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000)
    return () => window.clearInterval(id)
  }, [reduceMotion])

  useEffect(() => {
    productosApi
      .list()
      .then((data) => {
        const activos = (data ?? []).filter((p) => p.activo === 1)
        setProducts(activos.slice(0, 6))
        setBrands([...new Set(activos.map((p) => p.proveedor).filter(Boolean))])
      })
      .catch(() => {
        setProducts([])
        setBrands([])
      })
  }, [])

  const current = SLIDES[slide]

  return (
    <main className="bg-background relative isolate overflow-x-hidden">
      <StorefrontAtmosphere />

      <div className="relative z-10">
        <StoreHeader />

        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="relative min-h-[380px] overflow-hidden rounded-2xl bg-[#08162F] sm:min-h-[420px]">
            <motion.img
              src={assetUrl('images/hero-collage.png')}
              alt="Portátil, PC, audífonos y mouse TechStore"
              className="absolute inset-0 z-10 size-full object-cover object-right"
              initial={{ scale: 1.08 }}
              animate={reduceMotion ? undefined : { scale: [1.08, 1.15, 1.08] }}
              transition={reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute inset-0 z-30 bg-gradient-to-r from-[#08162F] via-[#08162F]/75 to-transparent" />

            <div className="relative z-40 flex h-full min-h-[380px] flex-col justify-center p-8 sm:min-h-[420px] sm:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="max-w-lg space-y-4"
                >
                  <Badge>{current.tag}</Badge>
                  <h1 className="text-3xl leading-tight font-semibold text-balance text-white sm:text-4xl">
                    {current.titleLead} <span className="text-primary">{current.titleHighlight}</span>
                  </h1>
                  <p className="text-base text-white/70">{current.description}</p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg">
                      <NavLink to="/productos">Explorar catálogo</NavLink>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                      <a href="#categorias">Ver categorías</a>
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex gap-1.5">
                {SLIDES.map((s, index) => (
                  <button
                    key={s.titleHighlight}
                    type="button"
                    onClick={() => setSlide(index)}
                    className={`h-1.5 rounded-full transition-all ${index === slide ? 'bg-primary w-6' : 'w-1.5 bg-white/25'}`}
                    aria-label={`Ir a slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card border-border/70 mt-4 grid grid-cols-2 gap-4 rounded-2xl border p-4 shadow-sm sm:grid-cols-4">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <item.icon className="text-primary size-5 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="text-muted-foreground truncate text-xs">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="categorias" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-lg font-semibold">Compra por categoría</h2>
            <NavLink to="/productos" className="text-primary text-sm font-medium">
              Ver todas →
            </NavLink>
          </div>
          <motion.div
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
            variants={STAGGER_GRID}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {CATEGORIAS.map((cat) => (
              <MotionNavLink
                key={cat.value}
                to={`/productos?categoria=${cat.value}`}
                variants={FADE_UP}
                whileHover={{ y: -4 }}
                className="border-border/70 group overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/50"
              >
                <div className="bg-[#050B17]">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="h-24 w-full object-contain p-2 transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm font-medium">{cat.label}</p>
                  <span className="text-primary text-xs">Ver más →</span>
                </div>
              </MotionNavLink>
            ))}
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-lg font-semibold">Selección destacada</h2>
            <NavLink to="/productos" className="text-primary text-sm font-medium">
              Ver catálogo completo →
            </NavLink>
          </div>
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
            variants={STAGGER_GRID}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {products.map((item) => (
              <motion.div key={item.idProducto} variants={FADE_UP} whileHover={{ y: -4 }}>
                <ProductCard producto={item} imageClassName="h-28" />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {brands.length > 0 ? (
          <section id="marcas" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <h2 className="mb-4 text-lg font-semibold">Marcas que ya conoces</h2>
            <motion.div
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
              variants={STAGGER_GRID}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {brands.map((brand) => (
                <MotionNavLink
                  key={brand}
                  to={`/productos?marca=${encodeURIComponent(brand)}`}
                  variants={FADE_UP}
                  whileHover={{ y: -4 }}
                  className="border-border/70 bg-card hover:border-primary/50 rounded-xl border py-6 text-center text-sm font-medium transition-colors"
                >
                  {brand}
                </MotionNavLink>
              ))}
            </motion.div>
          </section>
        ) : null}

        <StoreFooter />
      </div>
    </main>
  )
}
