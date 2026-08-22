import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { authApi } from '@/lib/api'
import { normalizeRole } from '@/lib/access'
import { normalize } from '@/lib/normalize'

const AuthContext = createContext(null)

function toSession(usuario) {
  if (!usuario) return null
  return {
    id: usuario.idUsuario,
    name: usuario.nombre,
    role: normalizeRole(usuario.rol) ?? normalize(usuario.rol),
    username: usuario.username,
    email: usuario.email,
    ciudad: usuario.ciudad,
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const requestIdRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    const requestId = ++requestIdRef.current
    authApi
      .session()
      .then((usuario) => {
        if (!cancelled && requestId === requestIdRef.current) {
          setSession(toSession(usuario))
        }
      })
      .catch(() => {
        if (!cancelled && requestId === requestIdRef.current) {
          setSession(null)
        }
      })
      .finally(() => {
        if (!cancelled && requestId === requestIdRef.current) {
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      loading,
      async signIn(identifier, password) {
        const requestId = ++requestIdRef.current
        const usuario = await authApi.login(identifier, password)
        const nextSession = toSession(usuario)
        if (requestId === requestIdRef.current) {
          setSession(nextSession)
        }
        return nextSession
      },
      async signUp(data) {
        const requestId = ++requestIdRef.current
        const usuario = await authApi.register(data)
        const nextSession = toSession(usuario)
        if (requestId === requestIdRef.current) {
          setSession(nextSession)
        }
        return nextSession
      },
      async signOut() {
        ++requestIdRef.current
        setSession(null)
        try {
          await authApi.logout()
        } catch {
          // La sesión local ya se limpió; un fallo de red aquí no debe bloquear el cierre de sesión.
        }
      },
    }),
    [session, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
