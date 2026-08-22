import { ShoppingBagIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { EntityCrudPage } from '@/components/admin/EntityCrudPage'
import { useClientes } from '@/hooks/useClientes'
import { carritosApi } from '@/lib/api'
import { formatDate } from '@/lib/format'

const EMPTY = { idUsuario: '', estado: 'activo' }

const ESTADO_OPTIONS = [
  { value: 'activo', label: 'Activo' },
  { value: 'cerrado', label: 'Cerrado' },
]

export function CarritosPage() {
  const clientes = useClientes()

  const fields = [
    {
      name: 'idUsuario',
      label: 'Cliente',
      type: 'select',
      required: true,
      span: 2,
      options: clientes.map((c) => ({ value: c.idUsuario, label: `${c.nombre} (${c.username})` })),
    },
    { name: 'estado', label: 'Estado', type: 'select', options: ESTADO_OPTIONS },
  ]

  const columns = [
    { key: 'idCarrito', label: 'ID', className: 'text-muted-foreground' },
    { key: 'usuario', label: 'Cliente', className: 'font-medium' },
    { key: 'estado', label: 'Estado', render: (item) => <Badge variant={item.estado === 'activo' ? 'success' : 'outline'}>{item.estado}</Badge> },
    { key: 'fechaCreacion', label: 'Creado', render: (item) => formatDate(item.fechaCreacion) },
  ]

  return (
    <EntityCrudPage
      api={carritosApi}
      idField="idCarrito"
      entityLabel="carrito"
      title="Carritos de compra"
      description="Preventa y consolidación, conectado a la base de datos real."
      icon={ShoppingBagIcon}
      columns={columns}
      fields={fields}
      emptyFormValue={EMPTY}
    />
  )
}
