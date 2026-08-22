import { NavLink } from 'react-router-dom'
import { CompassIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/AuthProvider'
import { getLandingPath } from '@/lib/access'

export function NotFoundPage() {
  const { session } = useAuth()
  const homePath = session ? getLandingPath(session.role) : '/'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="bg-muted text-muted-foreground flex size-16 items-center justify-center rounded-full">
        <CompassIcon className="size-8" />
      </div>
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">Error 404</p>
        <h1 className="text-2xl font-semibold text-balance">No encontramos esa página</h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          La ruta que buscas no existe o fue movida. Verifica el enlace o vuelve al punto de partida.
        </p>
      </div>
      <Button asChild>
        <NavLink to={homePath}>Volver al inicio</NavLink>
      </Button>
    </main>
  )
}
