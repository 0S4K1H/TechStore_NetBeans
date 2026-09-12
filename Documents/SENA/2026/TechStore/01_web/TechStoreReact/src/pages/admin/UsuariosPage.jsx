import { UsersIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { EntityCrudPage } from '@/components/admin/EntityCrudPage'
import { usuariosApi } from '@/lib/api'
import { ROLE_LABELS } from '@/lib/access'

const EMPTY = {
  idUsuario: '',
  username: '',
  passwordDemo: '',
  rol: 'cliente',
  nombre: '',
  email: '',
  ciudad: '',
  activo: '1',
}

const ROL_OPTIONS = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'empleado', label: 'Empleado comercial' },
  { value: 'administrador', label: 'Administrador' },
]

const fields = [
  { name: 'nombre', label: 'Nombre completo', required: true, span: 2 },
  {
    name: 'username',
    label: 'Nombre de usuario',
    required: true,
    hint: 'Debe ser único. El ID interno se genera automáticamente en la base de datos.',
  },
  { name: 'rol', label: 'Rol', type: 'select', required: true, options: ROL_OPTIONS },
  { name: 'email', label: 'Correo', type: 'email', required: true },
  { name: 'ciudad', label: 'Ciudad' },
  {
    name: 'passwordDemo',
    label: 'Contraseña',
    type: 'password',
    hint: 'Al editar, déjala en blanco para no cambiarla.',
  },
  {
    name: 'activo',
    label: 'Estado',
    type: 'select',
    options: [
      { value: '1', label: 'Activo' },
      { value: '0', label: 'Inactivo' },
    ],
  },
]

const columns = [
  { key: 'nombre', label: 'Nombre', className: 'font-medium' },
  { key: 'username', label: 'Usuario', className: 'text-muted-foreground' },
  { key: 'rol', label: 'Rol', render: (item) => <Badge variant="outline">{ROLE_LABELS[item.rol] ?? item.rol}</Badge> },
  { key: 'email', label: 'Correo' },
  { key: 'ciudad', label: 'Ciudad' },
  {
    key: 'activo',
    label: 'Estado',
    render: (item) => <Badge variant={item.activo === 1 ? 'success' : 'outline'}>{item.activo === 1 ? 'Activo' : 'Inactivo'}</Badge>,
  },
]

export function UsuariosPage() {
  return (
    <EntityCrudPage
      api={usuariosApi}
      idField="idUsuario"
      entityLabel="usuario"
      title="Usuarios y autenticación"
      description="Perfiles de cliente, empleado y administrador conectados a la base de datos real."
      icon={UsersIcon}
      columns={columns}
      fields={fields}
      emptyFormValue={EMPTY}
      toFormValue={(item) => ({ ...item, activo: String(item.activo), passwordDemo: '' })}
      serialize={(value) => ({ ...value, activo: Number(value.activo) })}
    />
  )
}
