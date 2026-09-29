import { ShoppingCartIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { EntityCrudPage } from '@/components/admin/EntityCrudPage'
import { useClientes } from '@/hooks/useClientes'
import { pedidosApi } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/format'

const EMPTY = {
  idUsuarioCliente: '',
  nombreCliente: '',
  emailCliente: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  transportadora: '',
  subtotal: '',
  costoEnvio: '0',
  descuento: '0',
  total: '',
  estado: 'pendiente',
  prioridad: 'media',
  metodoPago: '',
  nota: '',
}

const ESTADO_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'preparacion', label: 'Preparación' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' },
]

const PRIORIDAD_OPTIONS = [
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
]

const ESTADO_VARIANT = {
  pendiente: 'warning',
  preparacion: 'warning',
  enviado: 'secondary',
  entregado: 'success',
  cancelado: 'destructive',
}

export function PedidosPage() {
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
    { name: 'nombreCliente', label: 'Nombre del cliente', required: true },
    { name: 'emailCliente', label: 'Correo del cliente', type: 'email' },
    { name: 'telefono', label: 'Teléfono' },
    { name: 'ciudad', label: 'Ciudad' },
    { name: 'direccion', label: 'Dirección', span: 2 },
    { name: 'transportadora', label: 'Transportadora' },
    { name: 'metodoPago', label: 'Método de pago' },
    { name: 'subtotal', label: 'Subtotal (COP)', type: 'number', required: true },
    { name: 'costoEnvio', label: 'Costo de envío (COP)', type: 'number' },
    { name: 'descuento', label: 'Descuento (COP)', type: 'number' },
    { name: 'total', label: 'Total (COP)', type: 'number', required: true },
    { name: 'estado', label: 'Estado', type: 'select', options: ESTADO_OPTIONS },
    { name: 'prioridad', label: 'Prioridad', type: 'select', options: PRIORIDAD_OPTIONS },
    { name: 'nota', label: 'Nota', type: 'textarea', span: 2 },
  ]

  const columns = [
    { key: 'idPedido', label: 'ID', className: 'text-muted-foreground' },
    { key: 'cliente', label: 'Cliente', className: 'font-medium', render: (item) => item.cliente ?? item.nombreCliente },
    { key: 'estado', label: 'Estado', render: (item) => <Badge variant={ESTADO_VARIANT[item.estado] ?? 'secondary'}>{item.estado}</Badge> },
    { key: 'prioridad', label: 'Prioridad', render: (item) => <Badge variant="outline">{item.prioridad}</Badge> },
    { key: 'total', label: 'Total', render: (item) => formatCurrency(item.total) },
    { key: 'fechaCreacion', label: 'Fecha', render: (item) => formatDate(item.fechaCreacion) },
  ]

  return (
    <EntityCrudPage
      api={pedidosApi}
      idField="idPedido"
      entityLabel="pedido"
      title="Gestión de pedidos"
      description="Órdenes, estados y seguimiento conectados a la API del proyecto."
      icon={ShoppingCartIcon}
      columns={columns}
      fields={fields}
      emptyFormValue={EMPTY}
      toFormValue={(item) => ({
        ...item,
        subtotal: String(item.subtotal ?? ''),
        costoEnvio: String(item.costoEnvio ?? '0'),
        descuento: String(item.descuento ?? '0'),
        total: String(item.total ?? ''),
      })}
      serialize={(value) => ({
        ...value,
        subtotal: Number(value.subtotal) || 0,
        costoEnvio: Number(value.costoEnvio) || 0,
        descuento: Number(value.descuento) || 0,
        total: Number(value.total) || 0,
      })}
    />
  )
}
