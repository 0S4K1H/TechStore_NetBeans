import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { carritosApi } from '@/lib/api'
import { useAuth } from '@/providers/AuthProvider'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { session } = useAuth()
  const [cartId, setCartId] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const isCliente = session?.role === 'cliente'

  const ensureCart = useCallback(async () => {
    if (!isCliente) return null
    const carritos = await carritosApi.list()
    const activo = (carritos ?? []).find((c) => c.estado === 'activo')
    if (activo) return activo.idCarrito
    const creado = await carritosApi.create({ estado: 'activo' })
    return creado.idCarrito
  }, [isCliente])

  const refresh = useCallback(async () => {
    if (!isCliente) {
      setItems([])
      setCartId(null)
      return
    }
    setLoading(true)
    try {
      const id = await ensureCart()
      setCartId(id)
      const data = id ? await carritosApi.items(id) : []
      setItems(data ?? [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [isCliente, ensureCart])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function addItem(idProducto, cantidad = 1) {
    if (!isCliente) {
      toast.error('Inicia sesión como cliente para agregar productos al carrito.')
      return false
    }
    try {
      const id = cartId ?? (await ensureCart())
      setCartId(id)
      const data = await carritosApi.addItem(id, idProducto, cantidad)
      setItems(data ?? [])
      toast.success('Producto agregado al carrito.')
      return true
    } catch (err) {
      toast.error(err.message || 'No fue posible agregar el producto.')
      return false
    }
  }

  async function updateItem(idProducto, cantidad) {
    try {
      const data = await carritosApi.updateItem(cartId, idProducto, cantidad)
      setItems(data ?? [])
    } catch (err) {
      toast.error(err.message || 'No fue posible actualizar la cantidad.')
    }
  }

  async function removeItem(idProducto) {
    try {
      const data = await carritosApi.removeItem(cartId, idProducto)
      setItems(data ?? [])
    } catch (err) {
      toast.error(err.message || 'No fue posible quitar el producto.')
    }
  }

  async function checkout(data) {
    try {
      const pedido = await carritosApi.checkout(cartId, data)
      setItems([])
      await refresh()
      toast.success(`Pedido ${pedido.idPedido} creado correctamente.`)
      return pedido
    } catch (err) {
      toast.error(err.message || 'No fue posible completar la compra.')
      return null
    }
  }

  const total = items.reduce((sum, item) => sum + Number(item.subtotal ?? 0), 0)
  const count = items.reduce((sum, item) => sum + Number(item.cantidad ?? 0), 0)

  const value = { items, loading, total, count, addItem, updateItem, removeItem, checkout, refresh }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
