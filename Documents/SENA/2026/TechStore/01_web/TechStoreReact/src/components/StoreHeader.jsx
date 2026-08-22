import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  ChevronDownIcon,
  HeadphonesIcon,
  HeartIcon,
  MenuIcon,
  PhoneIcon,
  SearchIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  TruckIcon,
  UserRoundIcon,
} from 'lucide-react'

import { BrandMark } from '@/components/BrandMark'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { CATEGORIAS } from '@/lib/categorias'
import { isInternalRole } from '@/lib/access'
import { productosApi } from '@/lib/api'
import { useAuth } from '@/providers/AuthProvider'
import { useCart } from '@/providers/CartProvider'
import { useFavorites } from '@/providers/FavoritesProvider'

// Solo secciones con datos reales detrás. "Ofertas" y "Blog" quedan fuera: no hay
// sistema de descuentos ni de contenido en la base de datos para sostenerlas.
const NAV_LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/productos', label: 'Productos' },
  { to: '/productos?nuevo=1', label: 'Novedades' },
]

const navLinkClass = ({ isActive }) =>
  [
    'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all',
    isActive
      ? 'bg-primary/12 text-primary ring-1 ring-primary/20'
      : 'text-white/70 hover:bg-white/5 hover:text-white',
  ].join(' ')

export function StoreHeader() {
  const { session, signOut } = useAuth()
  const { count, total } = useCart()
  const favorites = useFavorites()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [brands, setBrands] = useState([])
  const signedInAsInternal = session ? isInternalRole(session.role) : false
  const isCliente = session?.role === 'cliente'

  useEffect(() => {
    productosApi
      .list()
      .then((data) => {
        const activos = (data ?? []).filter((p) => p.activo === 1)
        setBrands([...new Set(activos.map((p) => p.proveedor).filter(Boolean))].sort())
      })
      .catch(() => setBrands([]))
  }, [])

  function handleSearch(event) {
    event.preventDefault()
    navigate(query.trim() ? `/productos?q=${encodeURIComponent(query.trim())}` : '/productos')
  }

  return (
    <header className="relative isolate text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[26rem] bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_42%),linear-gradient(180deg,#050B17_0%,#08162F_64%,transparent_100%)]" />

      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(6,12,24,0.92)] shadow-[0_24px_70px_rgba(2,8,23,0.45)] backdrop-blur-xl">
          <div className="hidden items-center justify-between border-b border-white/10 px-5 py-2 text-xs text-white/70 sm:flex">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <TruckIcon className="size-3.5" /> Envíos a todo Colombia
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheckIcon className="size-3.5" /> Garantía de 12 meses
              </span>
            </div>
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <HeadphonesIcon className="size-3.5" /> Soporte 24/7
              </span>
              <span className="flex items-center gap-1.5">
                <PhoneIcon className="size-3.5" /> (601) 123 4567
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-4 sm:px-5 lg:gap-6">
            <NavLink to="/" className="flex shrink-0 items-center" aria-label="TechStore">
              <BrandMark featured className="shrink-0" />
            </NavLink>

            <form onSubmit={handleSearch} className="relative min-w-0 flex-1">
              <SearchIcon className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar productos, categorías..."
                className="h-12 rounded-full border-white/10 bg-white/95 pl-11 text-slate-900 shadow-sm placeholder:text-slate-500 focus-visible:ring-cyan-400/60"
              />
            </form>

            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
              <ThemeToggle className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white" />

              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-left hover:bg-white/5 sm:flex"
                    >
                      <UserRoundIcon className="size-5" />
                      <span className="leading-tight">
                        <span className="block text-xs font-medium">Mi cuenta</span>
                        <span className="block truncate text-[11px] text-white/60">
                          {session.name.split(' ')[0]}
                        </span>
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <div className="px-2 py-1.5">
                      <p className="truncate text-sm font-medium">{session.name}</p>
                      <p className="text-muted-foreground truncate text-xs">{session.role}</p>
                    </div>
                    {isCliente ? (
                      <>
                        <DropdownMenuItem asChild>
                          <NavLink to="/mis-pedidos">Mis pedidos</NavLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <NavLink to="/soporte">Soporte</NavLink>
                        </DropdownMenuItem>
                      </>
                    ) : null}
                    {signedInAsInternal ? (
                      <DropdownMenuItem asChild>
                        <NavLink to="/app/dashboard">Panel interno</NavLink>
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem onSelect={signOut} variant="destructive">
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <NavLink to="/login" className="hidden items-center gap-1.5 rounded-full px-3 py-2 hover:bg-white/5 sm:flex">
                  <UserRoundIcon className="size-5" />
                  <span className="leading-tight">
                    <span className="block text-xs font-medium">Mi cuenta</span>
                    <span className="block text-[11px] text-white/60">Iniciar sesión</span>
                  </span>
                </NavLink>
              )}

              <NavLink
                to="/productos?favoritos=1"
                className="hidden items-center gap-1.5 rounded-full px-3 py-2 hover:bg-white/5 sm:flex"
              >
                <span className="relative">
                  <HeartIcon className="size-5" />
                  {favorites.count > 0 ? (
                    <Badge className="absolute -top-2 -right-2 size-4 justify-center rounded-full p-0 text-[9px]">
                      {favorites.count}
                    </Badge>
                  ) : null}
                </span>
                <span className="leading-tight">
                  <span className="block text-xs font-medium">Favoritos</span>
                  <span className="block text-[11px] text-white/60">{favorites.count}</span>
                </span>
              </NavLink>

              <NavLink to="/carrito" className="flex items-center gap-1.5 rounded-full px-3 py-2 hover:bg-white/5">
                <span className="relative">
                  <ShoppingCartIcon className="size-5" />
                  {count > 0 ? (
                    <Badge className="absolute -top-2 -right-2 size-4 justify-center rounded-full p-0 text-[9px]">
                      {count}
                    </Badge>
                  ) : null}
                </span>
                <span className="hidden leading-tight sm:block">
                  <span className="block text-xs font-medium">Carrito</span>
                  <span className="block text-[11px] text-white/60">
                    {total > 0 ? `$${total.toLocaleString('es-CO')}` : '$0'} COP
                  </span>
                </span>
              </NavLink>
            </div>
          </div>

          <div className="border-t border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-1 overflow-x-auto px-4 py-3 sm:px-5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="mr-2 shrink-0 rounded-full bg-primary px-4 shadow-[0_12px_24px_rgba(14,165,233,0.22)]">
                    <MenuIcon className="size-4" />
                    Todas las categorías
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52">
                  {CATEGORIAS.map((cat) => (
                    <DropdownMenuItem key={cat.value} asChild>
                      <NavLink to={`/productos?categoria=${cat.value}`}>
                        <cat.icon className="size-4" />
                        {cat.label}
                      </NavLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {NAV_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
                  {link.label}
                </NavLink>
              ))}

              {brands.length > 0 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex shrink-0 items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white">
                    Marcas
                    <ChevronDownIcon className="size-3.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52">
                    {brands.map((brand) => (
                      <DropdownMenuItem key={brand} asChild>
                        <NavLink to={`/productos?marca=${encodeURIComponent(brand)}`}>{brand}</NavLink>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}

              <NavLink to="/soporte" className={navLinkClass}>
                Contacto
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
