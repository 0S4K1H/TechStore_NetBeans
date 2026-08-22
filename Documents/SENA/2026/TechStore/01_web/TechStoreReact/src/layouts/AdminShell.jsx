import { AnimatePresence, motion } from 'framer-motion'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowLeftIcon, LogOutIcon, UserRoundIcon } from 'lucide-react'

import { BrandMark } from '@/components/BrandMark'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { getVisibleNavigationGroups } from '@/lib/navigation'
import { useAuth } from '@/providers/AuthProvider'

function initialsOf(name) {
  return String(name ?? 'TS')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function AdminShell() {
  const { session, signOut } = useAuth()
  const location = useLocation()
  const groups = getVisibleNavigationGroups(session?.role)
  const currentNav = groups.flatMap((g) => g.items).find((item) => location.pathname.startsWith(`/app/${item.path}`))

  return (
    <div className="bg-background flex min-h-screen">
      <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border hidden w-64 shrink-0 flex-col border-r lg:flex">
        <div className="flex items-center gap-3 px-5 py-5">
          <BrandMark small className="h-11 w-auto" />
          <div className="min-w-0">
            <p className="text-muted-foreground truncate text-[11px] tracking-wide uppercase">
              Panel interno
            </p>
            <p className="truncate text-sm font-semibold">Administración protegida</p>
          </div>
        </div>

        <NavLink
          to="/"
          className="text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground mx-3 mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm"
        >
          <ArrowLeftIcon className="size-4" />
          Volver a la tienda
        </NavLink>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2" aria-label="Navegación principal">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="text-muted-foreground px-3 pb-1.5 text-[11px] font-medium tracking-wide uppercase">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={`/app/${item.path}`}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                      )
                    }
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-sidebar-border border-t p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="hover:bg-sidebar-accent flex w-full items-center gap-2.5 rounded-md p-2 text-left transition-colors"
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initialsOf(session?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{session?.name ?? 'Invitado TechStore'}</p>
                  <p className="text-muted-foreground truncate text-xs">{session?.role ?? 'Acceso local'}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={signOut} variant="destructive">
                <LogOutIcon className="size-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-background/95 border-border sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3 lg:hidden">
            <BrandMark small />
            <span className="truncate text-sm font-semibold">TechStore</span>
          </div>

          <div className="hidden min-w-0 lg:block">
            <p className="truncate text-sm font-semibold">{currentNav?.label ?? 'Panel interno'}</p>
            <p className="text-muted-foreground truncate text-xs">
              {currentNav?.description ?? 'Área administrativa protegida'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Avatar className="size-8 lg:hidden">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                <UserRoundIcon className="size-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <nav
          className="border-border flex gap-1 overflow-x-auto border-b px-3 py-2 lg:hidden"
          aria-label="Navegación principal móvil"
        >
          {groups
            .flatMap((g) => g.items)
            .map((item) => (
              <NavLink
                key={item.path}
                to={`/app/${item.path}`}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap',
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )
                }
              >
                <item.icon className="size-3.5" />
                {item.label}
              </NavLink>
            ))}
        </nav>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
