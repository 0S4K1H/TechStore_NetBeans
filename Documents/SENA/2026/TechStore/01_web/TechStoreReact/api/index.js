const now = () => new Date().toISOString()
const addDays = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const initialState = () => ({
  usuarios: [
    {
      idUsuario: 'USR001',
      username: 'mateo',
      passwordDemo: '12345',
      rol: 'administrador',
      nombre: 'Mateo Gonzalez',
      email: 'mateo@techstore.com',
      ciudad: 'Armenia',
      activo: 1,
    },
    {
      idUsuario: 'USR002',
      username: 'cliente',
      passwordDemo: '12345',
      rol: 'cliente',
      nombre: 'Cliente TechStore',
      email: 'cliente@techstore.com',
      ciudad: 'Bogota',
      activo: 1,
    },
    {
      idUsuario: 'USR003',
      username: 'empleado',
      passwordDemo: '12345',
      rol: 'empleado',
      nombre: 'Ana Torres',
      email: 'ana@techstore.com',
      ciudad: 'Medellin',
      activo: 1,
    },
  ],
  proveedores: [
    { idProveedor: 'PRV001', nombre: 'ASUS Colombia', email: 'contacto@asus.co' },
    { idProveedor: 'PRV002', nombre: 'HP Mayorista', email: 'ventas@hp.co' },
    { idProveedor: 'PRV003', nombre: 'Lenovo Partner', email: 'canal@lenovo.co' },
    { idProveedor: 'PRV004', nombre: 'Samsung Store', email: 'b2b@samsung.co' },
  ],
  productos: [
    {
      idProducto: 'PROD001',
      codigoInv: 'LAP-ASUS-001',
      idProveedor: 'PRV001',
      proveedor: 'ASUS Colombia',
      nombre: 'ASUS ROG Strix G16',
      categoria: 'laptop',
      precio: 6800000,
      stock: 8,
      activo: 1,
      fechaCreacion: now(),
    },
    {
      idProducto: 'PROD002',
      codigoInv: 'LAP-ASUS-002',
      idProveedor: 'PRV001',
      proveedor: 'ASUS Colombia',
      nombre: 'ASUS TUF Gaming F15',
      categoria: 'laptop',
      precio: 4200000,
      stock: 12,
      activo: 1,
      fechaCreacion: now(),
    },
    {
      idProducto: 'PROD003',
      codigoInv: 'LAP-HP-001',
      idProveedor: 'PRV002',
      proveedor: 'HP Mayorista',
      nombre: 'HP Pavilion 15',
      categoria: 'laptop',
      precio: 2950000,
      stock: 6,
      activo: 1,
      fechaCreacion: now(),
    },
    {
      idProducto: 'PROD004',
      codigoInv: 'IMP-HP-001',
      idProveedor: 'PRV002',
      proveedor: 'HP Mayorista',
      nombre: 'HP OfficeJet Pro 9010',
      categoria: 'periferico',
      precio: 690000,
      stock: 4,
      activo: 1,
      fechaCreacion: now(),
    },
    {
      idProducto: 'PROD005',
      codigoInv: 'MOV-SAM-001',
      idProveedor: 'PRV004',
      proveedor: 'Samsung Store',
      nombre: 'Samsung Galaxy A55',
      categoria: 'movil',
      precio: 1850000,
      stock: 14,
      activo: 1,
      fechaCreacion: now(),
    },
    {
      idProducto: 'PROD006',
      codigoInv: 'ACC-LEN-001',
      idProveedor: 'PRV003',
      proveedor: 'Lenovo Partner',
      nombre: 'Lenovo ThinkPad Mouse',
      categoria: 'accesorio',
      precio: 145000,
      stock: 20,
      activo: 1,
      fechaCreacion: now(),
    },
  ],
  pedidos: [
    {
      idPedido: 'PED001',
      idUsuarioCliente: 'USR002',
      cliente: 'Cliente TechStore',
      nombreCliente: 'Cliente TechStore',
      emailCliente: 'cliente@techstore.com',
      telefono: '3001234567',
      direccion: 'Calle 10 #20-30',
      ciudad: 'Bogota',
      transportadora: 'Servientrega',
      subtotal: 1850000,
      costoEnvio: 15000,
      descuento: 0,
      total: 1865000,
      estado: 'preparacion',
      prioridad: 'media',
      metodoPago: 'PSE',
      nota: 'Entrega en horario de oficina',
      fechaCreacion: now(),
    },
  ],
  pedidoItems: {
    PED001: [
      {
        idDetalle: 'DET001',
        idProducto: 'PROD005',
        nombreProducto: 'Samsung Galaxy A55',
        cantidad: 1,
        precioUnitario: 1850000,
        subtotal: 1850000,
      },
    ],
  },
  pedidoTimeline: {
    PED001: [
      { idEvento: 'EVT001', descripcion: 'Pedido recibido por TechStore.', fechaEvento: now() },
      { idEvento: 'EVT002', descripcion: 'Pedido en preparacion.', fechaEvento: now() },
    ],
  },
  carritos: [{ idCarrito: 'CAR001', idUsuario: 'USR002', usuario: 'Cliente TechStore', estado: 'activo', fechaCreacion: now() }],
  carritoItems: { CAR001: [] },
  tickets: [
    {
      idTicket: 'TCK001',
      idUsuarioCliente: 'USR002',
      cliente: 'Cliente TechStore',
      asunto: 'Consulta de garantia',
      mensaje: 'Quiero conocer el proceso de garantia de un producto.',
      estado: 'abierto',
      fechaCreacion: now(),
    },
  ],
})

const state = globalThis.__techstoreState ?? initialState()
globalThis.__techstoreState = state

function send(res, status, data, headers = {}) {
  res.statusCode = status
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value)
  }
  if (status === 204) {
    res.end()
    return
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=')
        if (index === -1) return [part, '']
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))]
      })
  )
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}')
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

function nextId(prefix, items, field) {
  const max = items.reduce((value, item) => {
    const numeric = Number(String(item[field] ?? '').replace(/\D/g, ''))
    return Number.isFinite(numeric) ? Math.max(value, numeric) : value
  }, 0)
  return `${prefix}${String(max + 1).padStart(3, '0')}`
}

function currentUser(req) {
  const cookies = parseCookies(req.headers.cookie)
  return state.usuarios.find((usuario) => usuario.idUsuario === cookies.techstore_session && usuario.activo === 1) ?? null
}

function publicUser(usuario) {
  if (!usuario) return null
  const { passwordDemo, ...safe } = usuario
  return safe
}

function searchable(items, q, fields) {
  if (!q) return items
  const value = String(q).toLowerCase()
  return items.filter((item) => fields.some((field) => String(item[field] ?? '').toLowerCase().includes(value)))
}

function providerName(idProveedor) {
  return state.proveedores.find((proveedor) => proveedor.idProveedor === idProveedor)?.nombre ?? ''
}

function userName(idUsuario) {
  return state.usuarios.find((usuario) => usuario.idUsuario === idUsuario)?.nombre ?? ''
}

function withProvider(producto) {
  return { ...producto, proveedor: providerName(producto.idProveedor) || producto.proveedor || '' }
}

function normalizePath(req) {
  const url = new URL(req.url, `https://${req.headers.host ?? 'techstore.local'}`)
  const pathname = url.pathname.replace(/^\/api\/?/, '/')
  return { parts: pathname.split('/').filter(Boolean), query: url.searchParams }
}

function listResource(name, q, fields) {
  return searchable(state[name], q, fields)
}

async function handleAuth(req, res, action) {
  if (req.method === 'GET' && action === 'session') {
    const usuario = currentUser(req)
    if (!usuario) return send(res, 401, { error: 'Sesion no activa.' })
    return send(res, 200, publicUser(usuario))
  }

  if (req.method === 'POST' && action === 'logout') {
    return send(res, 200, { ok: true }, { 'Set-Cookie': 'techstore_session=; Path=/; Max-Age=0; SameSite=Lax' })
  }

  if (req.method === 'POST' && action === 'login') {
    const body = await readBody(req)
    const identifier = String(body.identifier ?? '').toLowerCase()
    const password = String(body.password ?? '')
    const usuario = state.usuarios.find(
      (item) =>
        item.activo === 1 &&
        (String(item.username).toLowerCase() === identifier || String(item.email).toLowerCase() === identifier) &&
        item.passwordDemo === password
    )
    if (!usuario) return send(res, 401, { error: 'Credenciales no reconocidas.' })
    return send(res, 200, publicUser(usuario), {
      'Set-Cookie': `techstore_session=${encodeURIComponent(usuario.idUsuario)}; Path=/; SameSite=Lax`,
    })
  }

  if (req.method === 'POST' && action === 'register') {
    const body = await readBody(req)
    if (!body.username || !body.email || !body.password || !body.nombre) {
      return send(res, 400, { error: 'Completa usuario, correo, nombre y contrasena.' })
    }
    const exists = state.usuarios.some(
      (item) =>
        String(item.username).toLowerCase() === String(body.username).toLowerCase() ||
        String(item.email).toLowerCase() === String(body.email).toLowerCase()
    )
    if (exists) return send(res, 409, { error: 'El usuario o correo ya existe.' })
    const usuario = {
      idUsuario: nextId('USR', state.usuarios, 'idUsuario'),
      username: body.username,
      passwordDemo: body.password,
      rol: 'cliente',
      nombre: body.nombre,
      email: body.email,
      ciudad: body.ciudad ?? '',
      activo: 1,
    }
    state.usuarios.push(usuario)
    return send(res, 201, publicUser(usuario), {
      'Set-Cookie': `techstore_session=${encodeURIComponent(usuario.idUsuario)}; Path=/; SameSite=Lax`,
    })
  }

  return send(res, 404, { error: 'Ruta de autenticacion no encontrada.' })
}

async function handleUsuarios(req, res, id, q) {
  if (req.method === 'GET' && !id) return send(res, 200, searchable(state.usuarios.map(publicUser), q, ['nombre', 'username', 'email', 'rol']))
  if (req.method === 'GET') {
    const usuario = state.usuarios.find((item) => item.idUsuario === id)
    return usuario ? send(res, 200, publicUser(usuario)) : send(res, 404, { error: 'Usuario no encontrado.' })
  }
  if (req.method === 'POST') {
    const body = await readBody(req)
    const usuario = {
      idUsuario: nextId('USR', state.usuarios, 'idUsuario'),
      username: body.username,
      passwordDemo: body.passwordDemo || body.password || '12345',
      rol: body.rol || 'cliente',
      nombre: body.nombre,
      email: body.email,
      ciudad: body.ciudad ?? '',
      activo: Number(body.activo ?? 1),
    }
    state.usuarios.push(usuario)
    return send(res, 201, publicUser(usuario))
  }
  if (req.method === 'PUT') {
    const index = state.usuarios.findIndex((item) => item.idUsuario === id)
    if (index === -1) return send(res, 404, { error: 'Usuario no encontrado.' })
    const body = await readBody(req)
    state.usuarios[index] = {
      ...state.usuarios[index],
      ...body,
      passwordDemo: body.passwordDemo || state.usuarios[index].passwordDemo,
      activo: Number(body.activo ?? state.usuarios[index].activo),
    }
    return send(res, 200, publicUser(state.usuarios[index]))
  }
  if (req.method === 'DELETE') {
    state.usuarios = state.usuarios.filter((item) => item.idUsuario !== id)
    return send(res, 204)
  }
  return send(res, 405, { error: 'Metodo no permitido.' })
}

async function handleProveedores(req, res, id, q) {
  if (req.method === 'GET' && !id) return send(res, 200, listResource('proveedores', q, ['idProveedor', 'nombre', 'email']))
  if (req.method === 'GET') {
    const item = state.proveedores.find((proveedor) => proveedor.idProveedor === id)
    return item ? send(res, 200, item) : send(res, 404, { error: 'Proveedor no encontrado.' })
  }
  if (req.method === 'POST') {
    const body = await readBody(req)
    const item = { idProveedor: body.idProveedor || nextId('PRV', state.proveedores, 'idProveedor'), nombre: body.nombre, email: body.email ?? '' }
    state.proveedores.push(item)
    return send(res, 201, item)
  }
  if (req.method === 'PUT') {
    const index = state.proveedores.findIndex((proveedor) => proveedor.idProveedor === id)
    if (index === -1) return send(res, 404, { error: 'Proveedor no encontrado.' })
    state.proveedores[index] = { ...state.proveedores[index], ...(await readBody(req)) }
    return send(res, 200, state.proveedores[index])
  }
  if (req.method === 'DELETE') {
    state.proveedores = state.proveedores.filter((proveedor) => proveedor.idProveedor !== id)
    return send(res, 204)
  }
  return send(res, 405, { error: 'Metodo no permitido.' })
}

async function handleProductos(req, res, id, q) {
  if (req.method === 'GET' && !id) {
    return send(res, 200, searchable(state.productos.map(withProvider), q, ['nombre', 'categoria', 'codigoInv', 'proveedor']))
  }
  if (req.method === 'GET') {
    const item = state.productos.find((producto) => producto.idProducto === id)
    return item ? send(res, 200, withProvider(item)) : send(res, 404, { error: 'Producto no encontrado.' })
  }
  if (req.method === 'POST') {
    const body = await readBody(req)
    const item = {
      idProducto: nextId('PROD', state.productos, 'idProducto'),
      codigoInv: body.codigoInv || `INV-${Date.now()}`,
      idProveedor: body.idProveedor,
      proveedor: providerName(body.idProveedor),
      nombre: body.nombre,
      categoria: body.categoria,
      precio: Number(body.precio ?? 0),
      stock: Number(body.stock ?? 0),
      activo: Number(body.activo ?? 1),
      fechaCreacion: now(),
    }
    state.productos.push(item)
    return send(res, 201, withProvider(item))
  }
  if (req.method === 'PUT') {
    const index = state.productos.findIndex((producto) => producto.idProducto === id)
    if (index === -1) return send(res, 404, { error: 'Producto no encontrado.' })
    const body = await readBody(req)
    state.productos[index] = {
      ...state.productos[index],
      ...body,
      proveedor: providerName(body.idProveedor ?? state.productos[index].idProveedor),
      precio: Number(body.precio ?? state.productos[index].precio),
      stock: Number(body.stock ?? state.productos[index].stock),
      activo: Number(body.activo ?? state.productos[index].activo),
    }
    return send(res, 200, withProvider(state.productos[index]))
  }
  if (req.method === 'DELETE') {
    state.productos = state.productos.filter((producto) => producto.idProducto !== id)
    return send(res, 204)
  }
  return send(res, 405, { error: 'Metodo no permitido.' })
}

async function handleTickets(req, res, id, q) {
  if (req.method === 'GET' && !id) return send(res, 200, searchable(state.tickets, q, ['cliente', 'asunto', 'mensaje', 'estado']))
  if (req.method === 'POST') {
    const usuario = currentUser(req)
    const body = await readBody(req)
    const idUsuarioCliente = body.idUsuarioCliente || usuario?.idUsuario || 'USR002'
    const item = {
      idTicket: nextId('TCK', state.tickets, 'idTicket'),
      idUsuarioCliente,
      cliente: userName(idUsuarioCliente),
      asunto: body.asunto,
      mensaje: body.mensaje,
      estado: body.estado || 'abierto',
      fechaCreacion: now(),
    }
    state.tickets.push(item)
    return send(res, 201, item)
  }
  if (req.method === 'PUT') {
    const index = state.tickets.findIndex((ticket) => ticket.idTicket === id)
    if (index === -1) return send(res, 404, { error: 'Ticket no encontrado.' })
    state.tickets[index] = { ...state.tickets[index], ...(await readBody(req)) }
    return send(res, 200, state.tickets[index])
  }
  if (req.method === 'DELETE') {
    state.tickets = state.tickets.filter((ticket) => ticket.idTicket !== id)
    return send(res, 204)
  }
  return send(res, 405, { error: 'Metodo no permitido.' })
}

async function handlePedidos(req, res, parts, q) {
  const id = parts[1]
  const sub = parts[2]
  if (req.method === 'GET' && id && sub === 'items') return send(res, 200, state.pedidoItems[id] ?? [])
  if (req.method === 'GET' && id && sub === 'timeline') return send(res, 200, state.pedidoTimeline[id] ?? [])
  if (req.method === 'GET' && !id) return send(res, 200, searchable(state.pedidos, q, ['idPedido', 'cliente', 'estado', 'ciudad']))
  if (req.method === 'POST') {
    const body = await readBody(req)
    const idUsuarioCliente = body.idUsuarioCliente || currentUser(req)?.idUsuario || 'USR002'
    const item = {
      idPedido: nextId('PED', state.pedidos, 'idPedido'),
      idUsuarioCliente,
      cliente: userName(idUsuarioCliente),
      nombreCliente: body.nombreCliente || userName(idUsuarioCliente),
      emailCliente: body.emailCliente ?? '',
      telefono: body.telefono ?? '',
      direccion: body.direccion ?? '',
      ciudad: body.ciudad ?? '',
      transportadora: body.transportadora ?? 'Coordinadora',
      subtotal: Number(body.subtotal ?? 0),
      costoEnvio: Number(body.costoEnvio ?? 0),
      descuento: Number(body.descuento ?? 0),
      total: Number(body.total ?? 0),
      estado: body.estado ?? 'pendiente',
      prioridad: body.prioridad ?? 'media',
      metodoPago: body.metodoPago ?? '',
      nota: body.nota ?? '',
      fechaCreacion: now(),
    }
    state.pedidos.push(item)
    state.pedidoItems[item.idPedido] = []
    state.pedidoTimeline[item.idPedido] = [{ idEvento: nextId('EVT', [], 'idEvento'), descripcion: 'Pedido registrado.', fechaEvento: now() }]
    return send(res, 201, item)
  }
  if (req.method === 'PUT') {
    const index = state.pedidos.findIndex((pedido) => pedido.idPedido === id)
    if (index === -1) return send(res, 404, { error: 'Pedido no encontrado.' })
    const body = await readBody(req)
    state.pedidos[index] = { ...state.pedidos[index], ...body, total: Number(body.total ?? state.pedidos[index].total) }
    return send(res, 200, state.pedidos[index])
  }
  if (req.method === 'DELETE') {
    state.pedidos = state.pedidos.filter((pedido) => pedido.idPedido !== id)
    delete state.pedidoItems[id]
    delete state.pedidoTimeline[id]
    return send(res, 204)
  }
  return send(res, 405, { error: 'Metodo no permitido.' })
}

function cartItems(idCarrito) {
  return (state.carritoItems[idCarrito] ?? []).map((item) => {
    const producto = state.productos.find((p) => p.idProducto === item.idProducto)
    const precioUnitario = producto?.precio ?? 0
    return {
      idProducto: item.idProducto,
      nombreProducto: producto?.nombre ?? item.idProducto,
      categoria: producto?.categoria ?? 'accesorio',
      cantidad: item.cantidad,
      precioUnitario,
      subtotal: precioUnitario * item.cantidad,
    }
  })
}

async function handleCarritos(req, res, parts, q) {
  const id = parts[1]
  const sub = parts[2]
  const detailId = parts[3]

  if (req.method === 'GET' && id && sub === 'items') return send(res, 200, cartItems(id))
  if (req.method === 'POST' && id && sub === 'items') {
    const body = await readBody(req)
    const items = state.carritoItems[id] ?? []
    const current = items.find((item) => item.idProducto === body.idProducto)
    if (current) current.cantidad += Number(body.cantidad ?? 1)
    else items.push({ idProducto: body.idProducto, cantidad: Number(body.cantidad ?? 1) })
    state.carritoItems[id] = items
    return send(res, 200, cartItems(id))
  }
  if (req.method === 'PUT' && id && sub === 'items') {
    const body = await readBody(req)
    const items = state.carritoItems[id] ?? []
    const current = items.find((item) => item.idProducto === detailId)
    if (current) current.cantidad = Number(body.cantidad ?? 1)
    return send(res, 200, cartItems(id))
  }
  if (req.method === 'DELETE' && id && sub === 'items') {
    state.carritoItems[id] = (state.carritoItems[id] ?? []).filter((item) => item.idProducto !== detailId)
    return send(res, 200, cartItems(id))
  }
  if (req.method === 'POST' && id && sub === 'checkout') {
    const body = await readBody(req)
    const items = cartItems(id)
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const carrito = state.carritos.find((item) => item.idCarrito === id)
    const pedido = {
      idPedido: nextId('PED', state.pedidos, 'idPedido'),
      idUsuarioCliente: carrito?.idUsuario ?? currentUser(req)?.idUsuario ?? 'USR002',
      cliente: userName(carrito?.idUsuario ?? currentUser(req)?.idUsuario ?? 'USR002'),
      nombreCliente: userName(carrito?.idUsuario ?? currentUser(req)?.idUsuario ?? 'USR002'),
      emailCliente: currentUser(req)?.email ?? '',
      telefono: body.telefono ?? '',
      direccion: body.direccion ?? '',
      ciudad: body.ciudad ?? '',
      transportadora: 'Coordinadora',
      subtotal,
      costoEnvio: Number(body.costoEnvio ?? 0),
      descuento: 0,
      total: subtotal + Number(body.costoEnvio ?? 0),
      estado: 'pendiente',
      prioridad: 'media',
      metodoPago: body.metodoPago ?? '',
      nota: body.nota ?? '',
      fechaCreacion: now(),
      fechaEstimada: addDays(4),
    }
    state.pedidos.push(pedido)
    state.pedidoItems[pedido.idPedido] = items.map((item, index) => ({ ...item, idDetalle: `DET${String(index + 1).padStart(3, '0')}` }))
    state.pedidoTimeline[pedido.idPedido] = [{ idEvento: 'EVT001', descripcion: 'Pedido registrado.', fechaEvento: now() }]
    state.carritoItems[id] = []
    return send(res, 201, pedido)
  }

  if (req.method === 'GET' && !id) return send(res, 200, searchable(state.carritos, q, ['idCarrito', 'usuario', 'estado']))
  if (req.method === 'POST') {
    const body = await readBody(req)
    const idUsuario = body.idUsuario || currentUser(req)?.idUsuario || 'USR002'
    const item = { idCarrito: nextId('CAR', state.carritos, 'idCarrito'), idUsuario, usuario: userName(idUsuario), estado: body.estado ?? 'activo', fechaCreacion: now() }
    state.carritos.push(item)
    state.carritoItems[item.idCarrito] = []
    return send(res, 201, item)
  }
  if (req.method === 'PUT') {
    const index = state.carritos.findIndex((carrito) => carrito.idCarrito === id)
    if (index === -1) return send(res, 404, { error: 'Carrito no encontrado.' })
    state.carritos[index] = { ...state.carritos[index], ...(await readBody(req)) }
    return send(res, 200, state.carritos[index])
  }
  if (req.method === 'DELETE') {
    state.carritos = state.carritos.filter((carrito) => carrito.idCarrito !== id)
    delete state.carritoItems[id]
    return send(res, 204)
  }
  return send(res, 405, { error: 'Metodo no permitido.' })
}

export default async function handler(req, res) {
  try {
    const { parts, query } = normalizePath(req)
    const resource = parts[0]
    const id = parts[1]
    const q = query.get('q') ?? ''

    if (!resource || resource === 'health') return send(res, 200, { status: 'ok', project: 'TechStore', time: now() })
    if (resource === 'auth') return handleAuth(req, res, id)
    if (resource === 'usuarios') return handleUsuarios(req, res, id, q)
    if (resource === 'proveedores') return handleProveedores(req, res, id, q)
    if (resource === 'productos') return handleProductos(req, res, id, q)
    if (resource === 'tickets') return handleTickets(req, res, id, q)
    if (resource === 'pedidos') return handlePedidos(req, res, parts, q)
    if (resource === 'carritos') return handleCarritos(req, res, parts, q)

    return send(res, 404, { error: 'Endpoint no encontrado.' })
  } catch (error) {
    return send(res, 500, { error: error.message || 'Error interno del servidor.' })
  }
}
