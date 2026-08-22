import { createContext, useContext, useEffect, useState } from 'react'

// ponytail: favoritos solo en localStorage, no sincroniza entre dispositivos ni tiene backend.
// Upgrade path: tabla favoritos + endpoint /api/favoritos si se necesita persistencia real por cuenta.
const STORAGE_KEY = 'techstore.favoritos.v1'
const FavoritesContext = createContext(null)

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState(readStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [ids])

  function toggle(idProducto) {
    setIds((current) =>
      current.includes(idProducto) ? current.filter((id) => id !== idProducto) : [...current, idProducto]
    )
  }

  function isFavorite(idProducto) {
    return ids.includes(idProducto)
  }

  return (
    <FavoritesContext.Provider value={{ ids, count: ids.length, toggle, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider')
  return context
}
