import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckIcon, Loader2Icon, PencilIcon, PlusIcon, SearchIcon, TrashIcon, XIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EntityFormFields } from '@/components/admin/EntityFormFields'
import { useEntityCrud } from '@/hooks/useEntityCrud'

export function EntityCrudPage({
  api,
  idField,
  entityLabel,
  title,
  description,
  icon: Icon,
  columns,
  fields,
  emptyFormValue,
  canWrite = true,
  toFormValue,
  serialize,
}) {
  const { items, loading, error, query, setQuery, create, update, remove } = useEntityCrud(api, { entityLabel })
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formValue, setFormValue] = useState(emptyFormValue)
  const [saving, setSaving] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  function openCreate() {
    setEditingId(null)
    setFormValue(emptyFormValue)
    setSheetOpen(true)
  }

  function openEdit(item) {
    setEditingId(item[idField])
    setFormValue(toFormValue ? toFormValue(item) : item)
    setSheetOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    const payload = serialize ? serialize(formValue) : formValue
    const ok = editingId ? await update(editingId, payload) : await create(payload)
    setSaving(false)
    if (ok) setSheetOpen(false)
  }

  async function handleDelete(id) {
    setDeletingId(id)
    await remove(id)
    setDeletingId(null)
    setConfirmDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="border-border/70 flex flex-col gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          {Icon ? (
            <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
              <Icon className="size-5" />
            </div>
          ) : null}
          <div>
            <h1 className="text-lg font-semibold sm:text-xl">{title}</h1>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar..."
              className="pl-9"
            />
          </div>
          {canWrite ? (
            <Button onClick={openCreate}>
              <PlusIcon className="size-4" />
              Nuevo
            </Button>
          ) : null}
        </div>
      </motion.section>

      <section className="border-border/70 overflow-hidden rounded-2xl border">
        {loading ? (
          <div className="text-muted-foreground flex items-center justify-center gap-2 p-10 text-sm">
            <Loader2Icon className="size-4 animate-spin" />
            Cargando...
          </div>
        ) : error ? (
          <div className="text-destructive p-10 text-center text-sm">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.className}>
                    {column.label}
                  </TableHead>
                ))}
                {canWrite ? <TableHead className="w-24 text-right">Acciones</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item[idField]}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.render ? column.render(item) : item[column.key]}
                    </TableCell>
                  ))}
                  {canWrite ? (
                    <TableCell className="text-right">
                      {confirmDeleteId === item[idField] ? (
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="destructive"
                            className="size-7"
                            disabled={deletingId === item[idField]}
                            onClick={() => handleDelete(item[idField])}
                          >
                            {deletingId === item[idField] ? (
                              <Loader2Icon className="size-3.5 animate-spin" />
                            ) : (
                              <CheckIcon className="size-3.5" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-7"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            <XIcon className="size-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="size-7" onClick={() => openEdit(item)}>
                            <PencilIcon className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive size-7"
                            onClick={() => setConfirmDeleteId(item[idField])}
                          >
                            <TrashIcon className="size-3.5" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!loading && !error && !items.length ? (
          <div className="text-muted-foreground p-10 text-center text-sm">
            No hay coincidencias{query ? ` para "${query}"` : ''}.
          </div>
        ) : null}
      </section>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingId ? `Editar ${entityLabel}` : `Nuevo ${entityLabel}`}</SheetTitle>
            <SheetDescription>
              {editingId ? 'Actualiza los datos y guarda los cambios.' : 'Completa los datos para crear el registro.'}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-6">
            <EntityFormFields fields={fields} value={formValue} onChange={setFormValue} />
          </form>

          <SheetFooter>
            <Button type="submit" onClick={handleSubmit} disabled={saving}>
              {saving ? <Loader2Icon className="size-4 animate-spin" /> : null}
              {editingId ? 'Guardar cambios' : 'Crear registro'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export function StatusBadge({ value, map }) {
  const variant = map?.[String(value).toLowerCase()] ?? 'secondary'
  return <Badge variant={variant}>{value}</Badge>
}
