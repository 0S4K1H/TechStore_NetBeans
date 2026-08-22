import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { HeadphonesIcon, Loader2Icon, PhoneIcon, SendIcon } from 'lucide-react'
import { toast } from 'sonner'

import { StoreHeader } from '@/components/StoreHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatDate } from '@/lib/format'
import { ticketsApi } from '@/lib/api'
import { useAuth } from '@/providers/AuthProvider'

const ESTADO_VARIANT = { abierto: 'destructive', en_proceso: 'warning', cerrado: 'success' }

export function SoportePage() {
  const { session } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [sending, setSending] = useState(false)

  function refresh() {
    if (!session) {
      setLoading(false)
      return
    }
    setLoading(true)
    ticketsApi
      .list()
      .then((data) => setTickets(data ?? []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false))
  }

  useEffect(refresh, [session])

  async function handleSubmit(event) {
    event.preventDefault()
    setSending(true)
    try {
      await ticketsApi.create({ asunto, mensaje })
      toast.success('Ticket enviado. Te responderemos pronto.')
      setAsunto('')
      setMensaje('')
      refresh()
    } catch (err) {
      toast.error(err.message || 'No fue posible enviar el ticket.')
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="bg-background min-h-screen">
      <StoreHeader />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="mb-2 text-xl font-semibold">Contacto y soporte</h1>
        <div className="text-muted-foreground flex flex-wrap gap-5 text-sm">
          <span className="flex items-center gap-1.5">
            <PhoneIcon className="size-4" /> (601) 123 4567
          </span>
          <span className="flex items-center gap-1.5">
            <HeadphonesIcon className="size-4" /> Soporte 24/7
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-4xl gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-2">
        {session ? (
          <Card className="h-fit py-6">
            <CardContent className="space-y-4 px-6">
              <div>
                <p className="font-semibold">Nuevo ticket</p>
                <p className="text-muted-foreground text-sm">Cuéntanos qué necesitas y te responderemos pronto.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="asunto">Asunto</Label>
                  <Input id="asunto" required value={asunto} onChange={(e) => setAsunto(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="mensaje">Mensaje</Label>
                  <Textarea id="mensaje" required rows={5} value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
                </div>
                <Button type="submit" disabled={sending} className="w-full">
                  {sending ? <Loader2Icon className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
                  Enviar ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-fit py-6">
            <CardContent className="space-y-3 px-6">
              <p className="font-semibold">Crear un ticket</p>
              <p className="text-muted-foreground text-sm">Inicia sesión para enviar un ticket y ver tu historial.</p>
              <Button asChild className="w-full">
                <NavLink to="/login">Iniciar sesión</NavLink>
              </Button>
            </CardContent>
          </Card>
        )}

        {session ? (
          <div className="space-y-3">
            <p className="font-semibold">Mis tickets</p>
            {loading ? (
              <div className="text-muted-foreground flex items-center justify-center gap-2 py-10 text-sm">
                <Loader2Icon className="size-4 animate-spin" />
                Cargando...
              </div>
            ) : tickets.length === 0 ? (
              <p className="text-muted-foreground text-sm">Aún no has creado ningún ticket.</p>
            ) : (
              tickets.map((ticket) => (
                <Card key={ticket.idTicket} className="py-4">
                  <CardContent className="space-y-1 px-5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{ticket.asunto}</p>
                      <Badge variant={ESTADO_VARIANT[ticket.estado] ?? 'secondary'}>{ticket.estado}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{ticket.mensaje}</p>
                    <p className="text-muted-foreground text-xs">{formatDate(ticket.fechaCreacion)}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : null}
      </div>
    </main>
  )
}
