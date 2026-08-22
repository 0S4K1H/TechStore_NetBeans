import { NavLink } from 'react-router-dom'

import { BrandMark } from '@/components/BrandMark'
import { CATEGORIAS } from '@/lib/categorias'

export function StoreFooter() {
  return (
    <footer className="bg-[#08162F] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <BrandMark small />
          </div>
          <p className="mt-4 text-sm text-white/60">Plataforma comercial y operativa para TechStore.</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Categorías</h3>
          <div className="space-y-2 text-sm text-white/60">
            {CATEGORIAS.map((cat) => (
              <NavLink key={cat.value} to={`/productos?categoria=${cat.value}`} className="block hover:text-white">
                {cat.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Ayuda</h3>
          <div className="space-y-2 text-sm text-white/60">
            <NavLink to="/soporte" className="block hover:text-white">
              Soporte
            </NavLink>
            <NavLink to="/mis-pedidos" className="block hover:text-white">
              Mis pedidos
            </NavLink>
            <NavLink to="/productos?favoritos=1" className="block hover:text-white">
              Favoritos
            </NavLink>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50 sm:px-6">
        © 2026 TechStore
      </div>
    </footer>
  )
}
