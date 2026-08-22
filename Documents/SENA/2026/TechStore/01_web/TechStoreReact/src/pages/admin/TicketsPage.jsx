import { LifeBuoyIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { EntityCrudPage } from '@/components/admin/EntityCrudPage'
import { useClientes } from '@/hooks/useClientes'
import { ticketsApi } from '@/lib/api'
import { formatDate } from '@/lib/format'

const EMPTY = { idUsuarioCliente: '', asunto: '', mensaje: '', estado: 'abierto' }

const ESTADO_OPTIONS = [
  { value: 'abierto', label: 'Abierto' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'cerrado', label: 'Cerrado' },
]

const ESTADO_VARIANT = { abierto: 'destructive', en_proceso: 'warning', cerrado: 'success' }

export function TicketsPage() {
  const clientes = useClientes()

  const fields = [
    {
      name: 'idUsuarioCliente',
      label: 'Cliente',
      type: 'select',
      required: true,
      span: 2,
      options: clientes.map((c) => ({ value: c.idUsuario, label: `${c.nombre} (${c.username})` })),
    },
    { name: 'asunto', label: 'Asunto', required: true, span: 2 },
    { name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true, span: 2 },
    { name: 'estado', label: 'Estado', type: 'select', options: ESTADO_OPTIONS, hint: 'Solo aplica al editar.' },
  ]

  const columns = [
    { key: 'idTicket', label: 'ID', className: 'text-muted-foreground' },
    { key: 'cliente', label: 'Cliente', className: 'font-medium' },
    { key: 'asunto', label: 'Asunto' },
    { key: 'estado', label: 'Estado', render: (item) => <Badge variant={ESTADO_VARIANT[item.estado] ?? 'secondary'}>{item.estado}</Badge> },
    { key: 'fechaCreacion', label: 'Creado', render: (item) => formatDate(item.fechaCreacion) },
  ]

  return (
    <EntityCrudPage
      api={ticketsApi}
      idField="idTicket"
      entityLabel="ticket"
      title="Tickets de soporte"
      description="Incidencias y trazabilidad, conectado a la base de datos real."
      icon={LifeBuoyIcon}
      columns={columns}
      fields={fields}
      emptyFormValue={EMPTY}
    />
  )
}
