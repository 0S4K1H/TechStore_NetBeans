import { ArrowRightIcon, DatabaseIcon, ExternalLinkIcon, ShieldCheckIcon, StoreIcon } from 'lucide-react'

import { BrandMark } from '../../components/BrandMark'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'

const baseUrl = 'https://techstore-tau-azure.vercel.app'

const webLinks = [
  { label: 'Abrir tienda', href: `${baseUrl}/#/`, description: 'Vista principal del cliente y catálogo comercial.' },
  { label: 'Panel administrador', href: `${baseUrl}/#/app/dashboard`, description: 'Gestión interna protegida por rol.' },
  { label: 'Productos', href: `${baseUrl}/#/app/productos`, description: 'Inventario, precios y disponibilidad.' },
  { label: 'Proveedores', href: `${baseUrl}/#/app/proveedores`, description: 'Origen del inventario y abastecimiento.' },
]

const apiLinks = [
  { label: 'Estado API', href: `${baseUrl}/api/health` },
  { label: 'Productos', href: `${baseUrl}/api/productos` },
  { label: 'Usuarios', href: `${baseUrl}/api/usuarios` },
  { label: 'Proveedores', href: `${baseUrl}/api/proveedores` },
  { label: 'Carritos', href: `${baseUrl}/api/carritos` },
  { label: 'Pedidos', href: `${baseUrl}/api/pedidos` },
  { label: 'Tickets', href: `${baseUrl}/api/tickets` },
]

function LinkCard({ item }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-300/[0.06]"
    >
      <span className="flex items-center justify-between gap-4">
        <span>
          <span className="block text-base font-semibold text-white">{item.label}</span>
          <span className="mt-2 block text-sm leading-6 text-slate-400">{item.description}</span>
        </span>
        <ExternalLinkIcon className="size-5 shrink-0 text-cyan-300 transition group-hover:translate-x-1" />
      </span>
    </a>
  )
}

function ApiLink({ item }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-4 rounded-xl border border-cyan-300/12 bg-slate-950/45 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-300/45 hover:bg-cyan-300/10"
    >
      <span>{item.label}</span>
      <span className="font-mono text-xs text-cyan-300">{item.href.replace(baseUrl, '')}</span>
    </a>
  )
}

export function EntregaPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020812] px-5 py-8 text-white sm:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,180,255,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(20,184,166,0.13),transparent_28%),linear-gradient(135deg,#020812_0%,#061528_50%,#020812_100%)]" />
      <div className="pointer-events-none absolute -left-24 top-20 h-[28rem] w-[28rem] rounded-full border border-cyan-300/10 blur-sm" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-[24rem] w-[24rem] rounded-full border border-sky-300/10 blur-sm" />

      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-5">
            <BrandMark featured />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Entrega publica del proyecto</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                TechStore listo para revision web y API
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Acceso centralizado para validar la tienda, el panel administrativo y los servicios REST desplegados en Vercel.
              </p>
            </div>
          </div>

          <Card className="border-cyan-300/15 bg-cyan-300/[0.055] text-white lg:w-80">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="size-5 text-cyan-300" />
                <span className="font-semibold">Credenciales de prueba</span>
              </div>
              <div className="rounded-2xl bg-black/20 p-4 font-mono text-sm">
                <p>Usuario: mateo</p>
                <p>Clave: 12345</p>
                <p>Rol: administrador</p>
              </div>
              <Button asChild className="w-full">
                <a href={`${baseUrl}/#/login`} target="_blank" rel="noreferrer">
                  Iniciar sesion <ArrowRightIcon className="size-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <StoreIcon className="size-5 text-cyan-300" />
              <h2 className="text-xl font-semibold">Recorrido visual</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {webLinks.map((item) => (
                <LinkCard key={item.href} item={item} />
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <DatabaseIcon className="size-5 text-cyan-300" />
              <h2 className="text-xl font-semibold">Servicios REST</h2>
            </div>
            <div className="space-y-3">
              {apiLinks.map((item) => (
                <ApiLink key={item.href} item={item} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
