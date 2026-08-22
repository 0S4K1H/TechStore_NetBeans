import { useEffect, useState } from 'react'
import { PackageIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { EntityCrudPage } from '@/components/admin/EntityCrudPage'
import { productosApi, proveedoresApi } from '@/lib/api'
import { formatCurrency } from '@/lib/format'

const CATEGORIAS = [
  { value: 'laptop', label: 'Laptop' },
  { value: 'movil', label: 'Móvil' },
  { value: 'accesorio', label: 'Accesorio' },
  { value: 'componente', label: 'Componente' },
  { value: 'periferico', label: 'Periférico' },
]

const EMPTY = {
  idProducto: '',
  codigoInv: '',
  idProveedor: '',
  nombre: '',
  categoria: 'laptop',
  precio: '',
  stock: '',
  activo: '1',
}

export function ProductosPage() {
  const [proveedores, setProveedores] = useState([])

  useEffect(() => {
    proveedoresApi.list().then(setProveedores).catch(() => setProveedores([]))
  }, [])

  const fields = [
    {
      name: 'idProveedor',
      label: 'Proveedor',
      type: 'select',
      required: true,
      options: proveedores.map((p) => ({ value: p.idProveedor, label: p.nombre })),
    },
    { name: 'nombre', label: 'Nombre', required: true, span: 2 },
    { name: 'categoria', label: 'Categoría', type: 'select', required: true, options: CATEGORIAS },
    {
      name: 'activo',
      label: 'Estado',
      type: 'select',
      options: [
        { value: '1', label: 'Activo' },
        { value: '0', label: 'Inactivo' },
      ],
    },
    { name: 'precio', label: 'Precio (COP)', type: 'number', required: true },
    { name: 'stock', label: 'Stock', type: 'number', required: true },
    { name: 'codigoInv', label: 'Código de inventario', hint: 'Vacío = se genera automáticamente.' },
  ]

  const columns = [
    { key: 'nombre', label: 'Nombre', className: 'font-medium' },
    { key: 'proveedor', label: 'Proveedor', className: 'text-muted-foreground' },
    {
      key: 'categoria',
      label: 'Categoría',
      render: (item) => <Badge variant="outline">{item.categoria}</Badge>,
    },
    { key: 'stock', label: 'Stock' },
    { key: 'precio', label: 'Precio', render: (item) => formatCurrency(item.precio) },
    {
      key: 'activo',
      label: 'Estado',
      render: (item) => <Badge variant={item.activo === 1 ? 'success' : 'outline'}>{item.activo === 1 ? 'Activo' : 'Inactivo'}</Badge>,
    },
  ]

  return (
    <EntityCrudPage
      api={productosApi}
      idField="idProducto"
      entityLabel="producto"
      title="Catálogo de productos"
      description="Inventario, precios y disponibilidad conectados a la base de datos real."
      icon={PackageIcon}
      columns={columns}
      fields={fields}
      emptyFormValue={EMPTY}
      toFormValue={(item) => ({
        ...item,
        activo: String(item.activo),
        precio: String(item.precio),
        stock: String(item.stock),
      })}
      serialize={(value) => ({
        ...value,
        activo: Number(value.activo),
        precio: Number(value.precio) || 0,
        stock: Number(value.stock) || 0,
      })}
    />
  )
}
