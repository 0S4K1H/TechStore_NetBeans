import { useEffect, useState } from 'react'

import { usuariosApi } from '@/lib/api'

export function useClientes() {
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    usuariosApi
      .list()
      .then((usuarios) => setClientes((usuarios ?? []).filter((u) => u.rol === 'cliente')))
      .catch(() => setClientes([]))
  }, [])

  return clientes
}
