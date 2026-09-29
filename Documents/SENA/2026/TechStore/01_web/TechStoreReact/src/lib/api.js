import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, { method = 'GET', body } = {}) {
  try {
    const response = await client.request({
      url: path,
      method,
      data: body,
    })

    if (response.status === 204) return null
    if (response.data == null || response.data === '') return null

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0
      const payload = error.response?.data
      const message =
        (payload && typeof payload === 'object' && 'error' in payload && payload.error) ||
        error.message ||
        `Error ${status}`
      throw new ApiError(message, status)
    }

    throw error
  }
}

function resource(basePath) {
  return {
    list: (q) => request(`${basePath}${q ? `?q=${encodeURIComponent(q)}` : ''}`),
    get: (id) => request(`${basePath}/${encodeURIComponent(id)}`),
    create: (data) => request(basePath, { method: 'POST', body: data }),
    update: (id, data) => request(`${basePath}/${encodeURIComponent(id)}`, { method: 'PUT', body: data }),
    remove: (id) => request(`${basePath}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  }
}

export const authApi = {
  login: (identifier, password) => request('/auth/login', { method: 'POST', body: { identifier, password } }),
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  session: () => request('/auth/session'),
}

export const productosApi = resource('/productos')
export const proveedoresApi = resource('/proveedores')
export const usuariosApi = resource('/usuarios')
export const ticketsApi = resource('/tickets')

export const pedidosApi = {
  ...resource('/pedidos'),
  items: (id) => request(`/pedidos/${encodeURIComponent(id)}/items`),
  timeline: (id) => request(`/pedidos/${encodeURIComponent(id)}/timeline`),
}

export const carritosApi = {
  ...resource('/carritos'),
  items: (id) => request(`/carritos/${encodeURIComponent(id)}/items`),
  addItem: (id, idProducto, cantidad = 1) =>
    request(`/carritos/${encodeURIComponent(id)}/items`, { method: 'POST', body: { idProducto, cantidad } }),
  updateItem: (id, idProducto, cantidad) =>
    request(`/carritos/${encodeURIComponent(id)}/items/${encodeURIComponent(idProducto)}`, {
      method: 'PUT',
      body: { cantidad },
    }),
  removeItem: (id, idProducto) =>
    request(`/carritos/${encodeURIComponent(id)}/items/${encodeURIComponent(idProducto)}`, { method: 'DELETE' }),
  checkout: (id, data) => request(`/carritos/${encodeURIComponent(id)}/checkout`, { method: 'POST', body: data }),
}
