import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export function useEntityCrud(api, { entityLabel = 'registro' } = {}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  const refresh = useCallback(
    async (q = query) => {
      setLoading(true)
      setError('')
      try {
        const data = await api.list(q)
        setItems(data ?? [])
      } catch (err) {
        setError(err.message || `No fue posible cargar ${entityLabel}s.`)
      } finally {
        setLoading(false)
      }
    },
    [api, entityLabel, query]
  )

  useEffect(() => {
    refresh(query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handle = window.setTimeout(() => refresh(query), 250)
    return () => window.clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  async function create(data) {
    try {
      await api.create(data)
      toast.success(`${entityLabel} creado correctamente.`)
      await refresh(query)
      return true
    } catch (err) {
      toast.error(err.message || `No fue posible crear ${entityLabel}.`)
      return false
    }
  }

  async function update(id, data) {
    try {
      await api.update(id, data)
      toast.success(`${entityLabel} actualizado correctamente.`)
      await refresh(query)
      return true
    } catch (err) {
      toast.error(err.message || `No fue posible actualizar ${entityLabel}.`)
      return false
    }
  }

  async function remove(id) {
    try {
      await api.remove(id)
      toast.success(`${entityLabel} eliminado correctamente.`)
      await refresh(query)
      return true
    } catch (err) {
      toast.error(err.message || `No fue posible eliminar ${entityLabel}.`)
      return false
    }
  }

  return { items, loading, error, query, setQuery, refresh, create, update, remove }
}
