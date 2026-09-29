import { TruckIcon } from 'lucide-react'

import { EntityCrudPage } from '@/components/admin/EntityCrudPage'
import { proveedoresApi } from '@/lib/api'

const EMPTY = { idProveedor: '', nombre: '', email: '' }

const fields = [
  { name: 'nombre', label: 'Nombre', required: true, span: 2 },
  { name: 'email', label: 'Correo de contacto', type: 'email' },
  { name: 'idProveedor', label: 'ID proveedor', hint: 'Vacío = se genera automáticamente.' },
]

const columns = [
  { key: 'idProveedor', label: 'ID', className: 'text-muted-foreground' },
  { key: 'nombre', label: 'Nombre', className: 'font-medium' },
  { key: 'email', label: 'Correo' },
]

export function ProveedoresPage() {
  return (
    <EntityCrudPage
      api={proveedoresApi}
      idField="idProveedor"
      entityLabel="proveedor"
      title="Proveedores y abastecimiento"
      description="Origen del inventario conectado a la API del proyecto."
      icon={TruckIcon}
      columns={columns}
      fields={fields}
      emptyFormValue={EMPTY}
    />
  )
}
