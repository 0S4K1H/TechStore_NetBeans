(function () {
  const STORAGE_KEY = "techstore-state-v4";
  const APP_VERSION = 4;
  const SHIPPING_COST = 25000;
  const STATUS_FLOW = ["pendiente", "preparacion", "enviado", "entregado"];
  const CATEGORY_NAMES = {
    laptop: "Laptops",
    movil: "Moviles",
    accesorio: "Accesorios",
    componente: "Componentes",
    periferico: "Perifericos"
  };
  const CATEGORY_ICONS = {
    laptop: "fa-laptop",
    movil: "fa-mobile-screen",
    accesorio: "fa-headphones",
    componente: "fa-memory",
    periferico: "fa-display"
  };
  const PRIMARY_CUSTOMER_ID = "u_cliente";
  const PRIMARY_CUSTOMER_NAME = "Cliente TechStore";
  const PRIMARY_CUSTOMER_EMAIL = "cliente@techstore.com";
  const PRIMARY_CUSTOMER_CITY = "Bogota";
  const OWNER_USER_ID = "u_admin";
  const OWNER_NAME = "Mateo Cardenas";
  const OWNER_EMAIL = "mateo@techstore.com";
  const OWNER_CITY = "Bogota";

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function formatDateISO(dateValue) {
    return [
      dateValue.getFullYear(),
      pad(dateValue.getMonth() + 1),
      pad(dateValue.getDate())
    ].join("-");
  }

  function formatDateTimeISO(dateValue) {
    return formatDateISO(dateValue) + "T" + [pad(dateValue.getHours()), pad(dateValue.getMinutes()), pad(dateValue.getSeconds())].join(":");
  }

  function addDays(dateText, days) {
    const dateValue = new Date(dateText + "T12:00:00");
    dateValue.setDate(dateValue.getDate() + days);
    return formatDateISO(dateValue);
  }

  function stripUser(user) {
    return {
      userId: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email,
      city: user.city,
      lastOrderCode: ""
    };
  }

  function defaultUsers() {
    return [
      {
        id: PRIMARY_CUSTOMER_ID,
        username: "cliente",
        password: "12345",
        role: "cliente",
        name: PRIMARY_CUSTOMER_NAME,
        email: PRIMARY_CUSTOMER_EMAIL,
        city: PRIMARY_CUSTOMER_CITY
      },
      {
        id: "u_empleado",
        username: "empleado",
        password: "12345",
        role: "empleado",
        name: "Ana Torres",
        email: "ana@techstore.demo",
        city: "Bogota"
      },
      {
        id: OWNER_USER_ID,
        username: "admin",
        password: "12345",
        role: "administrador",
        name: OWNER_NAME,
        email: OWNER_EMAIL,
        city: OWNER_CITY
      }
    ];
  }

  function defaultInventory() {
    return [
      { id: "p1", code: "INV-1001", name: "Laptop Lenovo IdeaPad", category: "laptop", price: 2300000, stock: 12, active: true },
      { id: "p2", code: "INV-1002", name: "Smartphone Galaxy A55", category: "movil", price: 1480000, stock: 9, active: true },
      { id: "p3", code: "INV-1003", name: "Teclado mecanico RGB", category: "accesorio", price: 220000, stock: 14, active: true },
      { id: "p4", code: "INV-1004", name: "Audifonos inalambricos", category: "accesorio", price: 310000, stock: 10, active: true },
      { id: "p5", code: "INV-1005", name: "Tarjeta grafica RTX 4060", category: "componente", price: 1850000, stock: 3, active: true },
      { id: "p6", code: "INV-1006", name: "Monitor Samsung 24 pulgadas", category: "periferico", price: 650000, stock: 5, active: true },
      { id: "p7", code: "INV-1007", name: "Disco SSD 1TB", category: "componente", price: 420000, stock: 16, active: true },
      { id: "p8", code: "INV-1008", name: "Mouse gaming", category: "periferico", price: 70000, stock: 22, active: true },
      { id: "p9", code: "INV-1009", name: "Impresora HP LaserJet", category: "periferico", price: 820000, stock: 2, active: false }
    ];
  }

  function defaultTickets() {
    return [
      {
        code: "TK-440210",
        customerUserId: PRIMARY_CUSTOMER_ID,
        customerName: PRIMARY_CUSTOMER_NAME,
        subject: "Seguimiento pedido TS-458120",
        message: "Necesito confirmar si el pedido llega hoy.",
        status: "abierto",
        createdAt: "2026-02-26T16:10:00"
      }
    ];
  }

  function defaultOrders() {
    return [
      {
        code: "TS-903218",
        customerUserId: PRIMARY_CUSTOMER_ID,
        customerName: PRIMARY_CUSTOMER_NAME,
        customerEmail: PRIMARY_CUSTOMER_EMAIL,
        phone: "3001234567",
        address: "Calle 80 # 15-22",
        city: "Bogota",
        date: "2026-03-03",
        eta: "2026-03-07",
        carrier: "TechExpress",
        subtotal: 1880000,
        shipping: 25000,
        discount: 25000,
        total: 1880000,
        status: "preparacion",
        priority: "alta",
        employee: "Carlos Ruiz",
        payment: "Billetera digital",
        note: "Llamar antes de entregar",
        items: [
          { productId: "p5", name: "Tarjeta grafica RTX 4060", category: "componente", qty: 1, price: 1850000 },
          { productId: "p8", name: "Mouse gaming", category: "periferico", qty: 1, price: 70000 }
        ],
        timeline: [
          { time: "2026-03-03T09:12:00", text: "Pago aprobado y pedido registrado." },
          { time: "2026-03-03T13:40:00", text: "Pedido confirmado por bodega." },
          { time: "2026-03-04T08:20:00", text: "Pedido en preparacion para despacho." }
        ]
      },
      {
        code: "TS-458120",
        customerUserId: PRIMARY_CUSTOMER_ID,
        customerName: PRIMARY_CUSTOMER_NAME,
        customerEmail: PRIMARY_CUSTOMER_EMAIL,
        phone: "3001234567",
        address: "Calle 12 #45-67",
        city: "Bogota",
        date: "2026-02-24",
        eta: "2026-02-27",
        carrier: "TechExpress",
        subtotal: 3170000,
        shipping: 0,
        discount: 0,
        total: 3170000,
        status: "enviado",
        priority: "alta",
        employee: "Ana Torres",
        payment: "Tarjeta credito",
        note: "Entregar en recepcion",
        items: [
          { productId: "p1", name: "Laptop Lenovo IdeaPad", category: "laptop", qty: 1, price: 2300000 },
          { productId: "p3", name: "Teclado mecanico RGB", category: "accesorio", qty: 1, price: 220000 },
          { productId: "p6", name: "Monitor Samsung 24 pulgadas", category: "periferico", qty: 1, price: 650000 }
        ],
        timeline: [
          { time: "2026-02-24T09:15:00", text: "Pago aprobado y pedido registrado." },
          { time: "2026-02-24T13:00:00", text: "Pedido confirmado por bodega." },
          { time: "2026-02-25T08:40:00", text: "Pedido despachado hacia centro logistico." },
          { time: "2026-02-26T07:20:00", text: "Pedido en ruta para entrega." }
        ]
      },
      {
        code: "TS-120044",
        customerUserId: PRIMARY_CUSTOMER_ID,
        customerName: PRIMARY_CUSTOMER_NAME,
        customerEmail: PRIMARY_CUSTOMER_EMAIL,
        phone: "3001234567",
        address: "Cra 18 # 90-11",
        city: "Bogota",
        date: "2026-02-10",
        eta: "2026-02-13",
        carrier: "EnviaTech",
        subtotal: 650000,
        shipping: 25000,
        discount: 25000,
        total: 650000,
        status: "entregado",
        priority: "baja",
        employee: "Luisa Gomez",
        payment: "Tarjeta debito",
        note: "",
        items: [
          { productId: "p6", name: "Monitor Samsung 24 pulgadas", category: "periferico", qty: 1, price: 650000 }
        ],
        timeline: [
          { time: "2026-02-10T10:18:00", text: "Pago aprobado y pedido registrado." },
          { time: "2026-02-10T15:52:00", text: "Pedido despachado." },
          { time: "2026-02-11T08:00:00", text: "Pedido en camino." },
          { time: "2026-02-12T14:27:00", text: "Pedido entregado al cliente." }
        ]
      },
      {
        code: "TS-331907",
        customerUserId: "u_lgomez",
        customerName: "Laura Gomez",
        customerEmail: "laura@techstore.demo",
        phone: "3015558899",
        address: "Cra 81 #20-11",
        city: "Medellin",
        date: "2026-02-21",
        eta: "2026-02-25",
        carrier: "EnviaTech",
        subtotal: 1790000,
        shipping: 0,
        discount: 0,
        total: 1790000,
        status: "entregado",
        priority: "media",
        employee: "Carlos Ruiz",
        payment: "Transferencia",
        note: "",
        items: [
          { productId: "p2", name: "Smartphone Galaxy A55", category: "movil", qty: 1, price: 1480000 },
          { productId: "p4", name: "Audifonos inalambricos", category: "accesorio", qty: 1, price: 310000 }
        ],
        timeline: [
          { time: "2026-02-21T11:05:00", text: "Pago aprobado y pedido registrado." },
          { time: "2026-02-21T16:30:00", text: "Producto en proceso de empaque." },
          { time: "2026-02-22T07:55:00", text: "Pedido despachado." },
          { time: "2026-02-23T17:10:00", text: "Pedido entregado al cliente." }
        ]
      },
      {
        code: "TS-740512",
        customerUserId: "u_nmejia",
        customerName: "Nicolas Mejia",
        customerEmail: "nicolas@techstore.demo",
        phone: "3028004455",
        address: "Calle 90 #10-52",
        city: "Bucaramanga",
        date: "2026-02-19",
        eta: "2026-02-23",
        carrier: "TechExpress",
        subtotal: 420000,
        shipping: 25000,
        discount: 25000,
        total: 420000,
        status: "cancelado",
        priority: "media",
        employee: "Miguel Vega",
        payment: "Contraentrega",
        note: "Cancelado por el cliente",
        items: [
          { productId: "p7", name: "Disco SSD 1TB", category: "componente", qty: 1, price: 420000 }
        ],
        timeline: [
          { time: "2026-02-19T09:00:00", text: "Pago autorizado y pedido creado." },
          { time: "2026-02-19T12:10:00", text: "Pedido cancelado por solicitud del cliente." }
        ]
      }
    ];
  }

  function buildDefaultState() {
    return {
      version: APP_VERSION,
      session: {
        userId: OWNER_USER_ID,
        username: "admin",
        role: "administrador",
        name: OWNER_NAME,
        email: OWNER_EMAIL,
        city: OWNER_CITY,
        lastOrderCode: ""
      },
      users: defaultUsers(),
      inventory: defaultInventory(),
      carts: {
        u_cliente: [
          { productId: "p2", quantity: 1 },
          { productId: "p8", quantity: 2 }
        ],
        guest: []
      },
      orders: defaultOrders(),
      tickets: defaultTickets()
    };
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  }

  function currentCartKey(state) {
    return state.session && state.session.userId ? state.session.userId : "guest";
  }

  function findProduct(state, productId) {
    return state.inventory.find(function (item) {
      return item.id === productId;
    });
  }

  function ensureCartBucket(state) {
    const key = currentCartKey(state);
    if (!state.carts[key]) {
      state.carts[key] = [];
    }
    return state.carts[key];
  }

  function syncState(state) {
    let changed = false;

    if (!state.carts || typeof state.carts !== "object") {
      state.carts = { guest: [] };
      changed = true;
    }

    Object.keys(state.carts).forEach(function (key) {
      const originalLength = state.carts[key].length;
      state.carts[key] = state.carts[key].map(function (line) {
        const product = findProduct(state, line.productId);
        if (!product || !product.active || product.stock <= 0) {
          changed = true;
          return null;
        }
        const quantity = Math.max(1, Math.min(Number(line.quantity) || 1, product.stock));
        if (quantity !== line.quantity) {
          changed = true;
        }
        return {
          productId: line.productId,
          quantity: quantity
        };
      }).filter(Boolean);
      if (state.carts[key].length !== originalLength) {
        changed = true;
      }
    });

    if (!state.session || !state.session.userId) {
      state.session = stripUser(state.users[0]);
      changed = true;
    }

    if (!state.users.some(function (user) { return user.id === state.session.userId; }) && state.session.userId !== "guest") {
      state.session = stripUser(state.users[0]);
      changed = true;
    }

    if (Array.isArray(state.users)) {
      state.users.forEach(function (user) {
        if (user.id === PRIMARY_CUSTOMER_ID) {
          if (user.name !== PRIMARY_CUSTOMER_NAME) {
            user.name = PRIMARY_CUSTOMER_NAME;
            changed = true;
          }
          if (user.email !== PRIMARY_CUSTOMER_EMAIL) {
            user.email = PRIMARY_CUSTOMER_EMAIL;
            changed = true;
          }
          if (user.city !== PRIMARY_CUSTOMER_CITY) {
            user.city = PRIMARY_CUSTOMER_CITY;
            changed = true;
          }
        }
        if (user.id === OWNER_USER_ID) {
          if (user.name !== OWNER_NAME) {
            user.name = OWNER_NAME;
            changed = true;
          }
          if (user.email !== OWNER_EMAIL) {
            user.email = OWNER_EMAIL;
            changed = true;
          }
          if (user.city !== OWNER_CITY) {
            user.city = OWNER_CITY;
            changed = true;
          }
        }
      });
    }

    if (state.session && state.session.userId === PRIMARY_CUSTOMER_ID && state.session.name === OWNER_NAME) {
      state.session = {
        userId: OWNER_USER_ID,
        username: "admin",
        role: "administrador",
        name: OWNER_NAME,
        email: OWNER_EMAIL,
        city: OWNER_CITY,
        lastOrderCode: ""
      };
      changed = true;
    }

    if (state.session && state.session.userId === PRIMARY_CUSTOMER_ID) {
      if (state.session.name !== PRIMARY_CUSTOMER_NAME) {
        state.session.name = PRIMARY_CUSTOMER_NAME;
        changed = true;
      }
      if (state.session.email !== PRIMARY_CUSTOMER_EMAIL) {
        state.session.email = PRIMARY_CUSTOMER_EMAIL;
        changed = true;
      }
      if (state.session.city !== PRIMARY_CUSTOMER_CITY) {
        state.session.city = PRIMARY_CUSTOMER_CITY;
        changed = true;
      }
    }

    if (state.session && state.session.userId === OWNER_USER_ID) {
      if (state.session.name !== OWNER_NAME) {
        state.session.name = OWNER_NAME;
        changed = true;
      }
      if (state.session.email !== OWNER_EMAIL) {
        state.session.email = OWNER_EMAIL;
        changed = true;
      }
      if (state.session.city !== OWNER_CITY) {
        state.session.city = OWNER_CITY;
        changed = true;
      }
      if (state.session.role !== "administrador") {
        state.session.role = "administrador";
        changed = true;
      }
      if (state.session.username !== "admin") {
        state.session.username = "admin";
        changed = true;
      }
    }

    if (Array.isArray(state.orders)) {
      state.orders.forEach(function (order) {
        if (order.customerUserId === PRIMARY_CUSTOMER_ID) {
          if (order.customerName !== PRIMARY_CUSTOMER_NAME) {
            order.customerName = PRIMARY_CUSTOMER_NAME;
            changed = true;
          }
          if (order.customerEmail !== PRIMARY_CUSTOMER_EMAIL) {
            order.customerEmail = PRIMARY_CUSTOMER_EMAIL;
            changed = true;
          }
        }
      });
    }

    if (Array.isArray(state.tickets)) {
      state.tickets.forEach(function (ticket) {
        if (ticket.customerUserId === PRIMARY_CUSTOMER_ID && ticket.customerName !== PRIMARY_CUSTOMER_NAME) {
          ticket.customerName = PRIMARY_CUSTOMER_NAME;
          changed = true;
        }
      });
    }

    return changed;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return saveState(buildDefaultState());
      }
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== APP_VERSION) {
        return saveState(buildDefaultState());
      }
      if (syncState(parsed)) {
        return saveState(parsed);
      }
      return parsed;
    } catch (error) {
      return saveState(buildDefaultState());
    }
  }

  function updateState(mutator) {
    const state = loadState();
    const result = mutator(state);
    syncState(state);
    saveState(state);
    return {
      state: clone(state),
      result: result
    };
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(Number(value) || 0);
  }

  function formatDate(dateText) {
    const dateValue = new Date(dateText + "T00:00:00");
    return new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(dateValue);
  }

  function formatDateTime(dateText) {
    const dateValue = new Date(dateText);
    return [
      pad(dateValue.getDate()),
      pad(dateValue.getMonth() + 1),
      dateValue.getFullYear()
    ].join("/") + " " + [pad(dateValue.getHours()), pad(dateValue.getMinutes())].join(":");
  }

  function getState() {
    return clone(loadState());
  }

  function ensureInitialized() {
    return getState();
  }

  function resetDemoData() {
    return clone(saveState(buildDefaultState()));
  }

  function getSession() {
    return clone(loadState().session);
  }

  function login(username, password) {
    const userName = String(username || "").trim().toLowerCase();
    const userPass = String(password || "").trim();

    if (!userName || !userPass) {
      return {
        ok: false,
        message: "Completa usuario y contrasena."
      };
    }

    const result = updateState(function (state) {
      const user = state.users.find(function (candidate) {
        return candidate.username === userName && candidate.password === userPass;
      });

      if (!user) {
        return {
          ok: false,
          message: "Usuario o contrasena incorrectos."
        };
      }

      const session = stripUser(user);
      const recentOrder = state.orders.find(function (order) {
        return order.customerUserId === user.id;
      });
      session.lastOrderCode = recentOrder ? recentOrder.code : "";
      state.session = session;

      return {
        ok: true,
        message: "Sesion iniciada correctamente.",
        session: clone(session)
      };
    });

    return result.result;
  }

  function logout() {
    const result = updateState(function (state) {
      state.session = {
        userId: "guest",
        username: "guest",
        role: "guest",
        name: "Invitado",
        email: "",
        city: "",
        lastOrderCode: ""
      };
      return {
        ok: true
      };
    });
    return result.result;
  }

  function getInventory() {
    return clone(loadState().inventory).sort(function (a, b) {
      return a.name.localeCompare(b.name, "es");
    });
  }

  function getAvailableProducts() {
    return getInventory().filter(function (item) {
      return item.active && item.stock > 0;
    });
  }

  function getProductById(productId) {
    const product = loadState().inventory.find(function (item) {
      return item.id === productId;
    });
    return product ? clone(product) : null;
  }

  function addToCart(productId) {
    const outcome = updateState(function (state) {
      const product = findProduct(state, productId);
      if (!product || !product.active || product.stock <= 0) {
        return {
          ok: false,
          message: "El producto no esta disponible."
        };
      }

      const cart = ensureCartBucket(state);
      const line = cart.find(function (item) {
        return item.productId === productId;
      });
      const currentQuantity = line ? line.quantity : 0;
      if (currentQuantity >= product.stock) {
        return {
          ok: false,
          message: "No puedes agregar mas unidades de las disponibles."
        };
      }

      if (line) {
        line.quantity += 1;
      } else {
        cart.push({
          productId: productId,
          quantity: 1
        });
      }

      return {
        ok: true,
        message: "Producto agregado al carrito."
      };
    });

    return outcome.result;
  }

  function updateCartQuantity(productId, quantity) {
    const nextQuantity = Number(quantity) || 0;
    const outcome = updateState(function (state) {
      const product = findProduct(state, productId);
      const cart = ensureCartBucket(state);
      const line = cart.find(function (item) {
        return item.productId === productId;
      });

      if (!line || !product) {
        return {
          ok: false,
          message: "El producto no existe en el carrito."
        };
      }

      if (nextQuantity <= 0) {
        state.carts[currentCartKey(state)] = cart.filter(function (item) {
          return item.productId !== productId;
        });
        return {
          ok: true,
          message: "Producto eliminado del carrito."
        };
      }

      if (nextQuantity > product.stock) {
        return {
          ok: false,
          message: "La cantidad supera el stock disponible."
        };
      }

      line.quantity = nextQuantity;
      return {
        ok: true,
        message: "Cantidad actualizada."
      };
    });

    return outcome.result;
  }

  function clearCart() {
    const outcome = updateState(function (state) {
      state.carts[currentCartKey(state)] = [];
      return {
        ok: true
      };
    });
    return outcome.result;
  }

  function getCartItemsFromState(state) {
    const cart = state.carts[currentCartKey(state)] || [];
    return cart.map(function (line) {
      const product = findProduct(state, line.productId);
      if (!product) {
        return null;
      }
      return {
        productId: product.id,
        code: product.code,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: line.quantity,
        stock: product.stock,
        lineTotal: product.price * line.quantity,
        icon: CATEGORY_ICONS[product.category] || "fa-box"
      };
    }).filter(Boolean);
  }

  function getCartItems() {
    return clone(getCartItemsFromState(loadState()));
  }

  function evaluateCoupon(code, subtotal) {
    const normalized = String(code || "").trim().toUpperCase();
    if (!normalized) {
      return {
        code: "",
        valid: false,
        discount: 0
      };
    }

    if (normalized === "TECH10") {
      return {
        code: normalized,
        valid: true,
        discount: Math.round(subtotal * 0.1)
      };
    }

    if (normalized === "ENVIO0") {
      return {
        code: normalized,
        valid: true,
        discount: SHIPPING_COST
      };
    }

    return {
      code: normalized,
      valid: false,
      discount: 0
    };
  }

  function calculateCartSummary(couponCode) {
    const state = loadState();
    const items = getCartItemsFromState(state);
    const subtotal = items.reduce(function (acc, item) {
      return acc + item.lineTotal;
    }, 0);
    const shipping = items.length ? SHIPPING_COST : 0;
    const coupon = evaluateCoupon(couponCode, subtotal);
    const discount = Math.min(coupon.discount, subtotal + shipping);
    const total = Math.max(subtotal + shipping - discount, 0);

    return {
      items: clone(items),
      subtotal: subtotal,
      shipping: shipping,
      discount: discount,
      total: total,
      couponCode: coupon.code,
      couponValid: coupon.valid
    };
  }

  function generateCode(prefix, existingCodes) {
    let code = "";
    do {
      code = prefix + "-" + Math.floor(100000 + Math.random() * 900000);
    } while (existingCodes.indexOf(code) >= 0);
    return code;
  }

  function getPriority(total) {
    if (total >= 2000000) {
      return "alta";
    }
    if (total >= 800000) {
      return "media";
    }
    return "baja";
  }

  function getTimelineText(status) {
    if (status === "preparacion") {
      return "Pedido en preparacion para despacho.";
    }
    if (status === "enviado") {
      return "Pedido despachado y en ruta.";
    }
    if (status === "entregado") {
      return "Pedido entregado al cliente.";
    }
    if (status === "cancelado") {
      return "Pedido cancelado.";
    }
    return "Pago aprobado y pedido registrado.";
  }

  function placeOrder(payload) {
    let response = {
      ok: false,
      message: "No fue posible registrar la compra."
    };

    updateState(function (state) {
      const items = getCartItemsFromState(state);
      if (!items.length) {
        response = {
          ok: false,
          message: "El carrito esta vacio."
        };
        return;
      }

      const requiredFields = ["fullName", "email", "phone", "address", "city", "paymentMethod"];
      const missingField = requiredFields.find(function (fieldName) {
        return !String(payload[fieldName] || "").trim();
      });

      if (missingField) {
        response = {
          ok: false,
          message: "Completa todos los campos obligatorios."
        };
        return;
      }

      const subtotal = items.reduce(function (acc, item) {
        return acc + item.lineTotal;
      }, 0);
      const coupon = evaluateCoupon(payload.couponCode, subtotal);
      const shipping = SHIPPING_COST;
      const discount = Math.min(coupon.discount, subtotal + shipping);
      const total = subtotal + shipping - discount;
      const orderCode = generateCode("TS", state.orders.map(function (order) {
        return order.code;
      }));
      const now = new Date();
      const date = formatDateISO(now);
      const eta = addDays(date, 3);

      items.forEach(function (item) {
        const product = findProduct(state, item.productId);
        if (product) {
          product.stock = Math.max(product.stock - item.quantity, 0);
        }
      });

      const order = {
        code: orderCode,
        customerUserId: state.session.userId,
        customerName: String(payload.fullName).trim(),
        customerEmail: String(payload.email).trim(),
        phone: String(payload.phone).trim(),
        address: String(payload.address).trim(),
        city: String(payload.city).trim(),
        date: date,
        eta: eta,
        carrier: "TechExpress",
        subtotal: subtotal,
        shipping: shipping,
        discount: discount,
        total: total,
        status: "pendiente",
        priority: getPriority(total),
        employee: "Sin asignar",
        payment: String(payload.paymentMethod).trim(),
        note: String(payload.note || "").trim(),
        items: items.map(function (item) {
          return {
            productId: item.productId,
            name: item.name,
            category: item.category,
            qty: item.quantity,
            price: item.price
          };
        }),
        timeline: [
          {
            time: formatDateTimeISO(now),
            text: "Pago aprobado y pedido registrado."
          }
        ]
      };

      state.orders.unshift(order);
      state.carts[currentCartKey(state)] = [];
      state.session.lastOrderCode = orderCode;

      response = {
        ok: true,
        order: clone(order),
        message: "Compra registrada con exito."
      };
    });

    return response;
  }

  function getOrders() {
    return clone(loadState().orders).sort(function (a, b) {
      return new Date(b.date + "T00:00:00") - new Date(a.date + "T00:00:00");
    });
  }

  function getOrderByCode(code) {
    const normalized = String(code || "").trim().toUpperCase();
    const order = loadState().orders.find(function (item) {
      return item.code === normalized;
    });
    return order ? clone(order) : null;
  }

  function getOrderProgress(status) {
    if (status === "cancelado") {
      return -1;
    }
    return STATUS_FLOW.indexOf(status);
  }

  function getDisplayStatus(status) {
    if (status === "enviado") {
      return "en camino";
    }
    return status;
  }

  function getOrdersForCurrentUser() {
    const state = loadState();
    const list = state.orders.filter(function (order) {
      if (state.session.role === "cliente") {
        return order.customerUserId === state.session.userId;
      }
      return true;
    });
    return clone(list).sort(function (a, b) {
      return new Date(b.date + "T00:00:00") - new Date(a.date + "T00:00:00");
    });
  }

  function getRecentOrders(limit, onlyCurrentUser) {
    const list = onlyCurrentUser ? getOrdersForCurrentUser() : getOrders();
    return list.slice(0, limit || 5);
  }

  function advanceOrderStatus(code) {
    let response = {
      ok: false,
      message: "No fue posible actualizar el pedido."
    };

    updateState(function (state) {
      const order = state.orders.find(function (item) {
        return item.code === code;
      });
      if (!order) {
        response = {
          ok: false,
          message: "Pedido no encontrado."
        };
        return;
      }

      if (order.status === "cancelado") {
        response = {
          ok: false,
          message: "El pedido esta cancelado."
        };
        return;
      }

      const currentIndex = STATUS_FLOW.indexOf(order.status);
      if (currentIndex < 0 || currentIndex >= STATUS_FLOW.length - 1) {
        response = {
          ok: false,
          message: "El pedido ya esta en su estado final."
        };
        return;
      }

      const nextStatus = STATUS_FLOW[currentIndex + 1];
      order.status = nextStatus;
      order.timeline.push({
        time: formatDateTimeISO(new Date()),
        text: getTimelineText(nextStatus)
      });

      response = {
        ok: true,
        order: clone(order),
        message: "Estado actualizado correctamente."
      };
    });

    return response;
  }

  function updateOrder(code, updates) {
    let response = {
      ok: false,
      message: "No fue posible guardar los cambios."
    };

    updateState(function (state) {
      const order = state.orders.find(function (item) {
        return item.code === code;
      });
      if (!order) {
        response = {
          ok: false,
          message: "Pedido no encontrado."
        };
        return;
      }

      const note = String((updates && updates.note) || "").trim();
      const employee = String((updates && updates.employee) || "").trim();
      const status = String((updates && updates.status) || "").trim();

      if (employee) {
        order.employee = employee;
      }

      if (status && status !== order.status) {
        order.status = status;
        order.timeline.push({
          time: formatDateTimeISO(new Date()),
          text: getTimelineText(status)
        });
      }

      if (note) {
        order.note = note;
        order.timeline.push({
          time: formatDateTimeISO(new Date()),
          text: "Nota de gestion: " + note
        });
      }

      response = {
        ok: true,
        order: clone(order),
        message: "Pedido actualizado correctamente."
      };
    });

    return response;
  }

  function adjustInventoryStock(code, delta) {
    let response = {
      ok: false,
      message: "No fue posible actualizar el inventario."
    };

    updateState(function (state) {
      const item = state.inventory.find(function (product) {
        return product.code === code;
      });
      if (!item) {
        response = {
          ok: false,
          message: "Producto no encontrado."
        };
        return;
      }

      const nextStock = item.stock + Number(delta || 0);
      if (nextStock < 0) {
        response = {
          ok: false,
          message: "El stock no puede ser negativo."
        };
        return;
      }

      item.stock = nextStock;
      response = {
        ok: true,
        item: clone(item),
        message: "Stock actualizado correctamente."
      };
    });

    return response;
  }

  function toggleInventoryItem(code) {
    let response = {
      ok: false,
      message: "No fue posible cambiar el estado."
    };

    updateState(function (state) {
      const item = state.inventory.find(function (product) {
        return product.code === code;
      });
      if (!item) {
        response = {
          ok: false,
          message: "Producto no encontrado."
        };
        return;
      }

      item.active = !item.active;
      response = {
        ok: true,
        item: clone(item),
        message: "Estado actualizado correctamente."
      };
    });

    return response;
  }

  function createInventoryItem(payload) {
    let response = {
      ok: false,
      message: "No fue posible agregar el producto."
    };

    updateState(function (state) {
      const code = String(payload.code || "").trim().toUpperCase();
      const name = String(payload.name || "").trim();
      const category = String(payload.category || "").trim();
      const price = Number(payload.price || 0);
      const stock = Number(payload.stock || 0);

      if (!code || !name || !category || price <= 0 || stock < 0) {
        response = {
          ok: false,
          message: "Completa todos los datos del producto."
        };
        return;
      }

      if (state.inventory.some(function (item) { return item.code === code; })) {
        response = {
          ok: false,
          message: "El codigo ya existe."
        };
        return;
      }

      const item = {
        id: "p" + Date.now(),
        code: code,
        name: name,
        category: category,
        price: price,
        stock: stock,
        active: true
      };

      state.inventory.push(item);
      response = {
        ok: true,
        item: clone(item),
        message: "Producto agregado correctamente."
      };
    });

    return response;
  }

  function createSupportTicket(payload) {
    let response = {
      ok: false,
      message: "No fue posible crear el ticket."
    };

    updateState(function (state) {
      const ticket = {
        code: generateCode("TK", state.tickets.map(function (item) {
          return item.code;
        })),
        customerUserId: state.session.userId,
        customerName: state.session.name,
        subject: String(payload.subject || "Consulta general").trim(),
        message: String(payload.message || "").trim(),
        status: "abierto",
        createdAt: formatDateTimeISO(new Date())
      };

      state.tickets.unshift(ticket);
      response = {
        ok: true,
        ticket: clone(ticket),
        message: "Ticket creado correctamente."
      };
    });

    return response;
  }

  function getSupportTickets() {
    const state = loadState();
    const tickets = state.tickets.filter(function (ticket) {
      if (state.session.role === "cliente") {
        return ticket.customerUserId === state.session.userId;
      }
      return true;
    });
    return clone(tickets);
  }

  function getPrimaryCategory(order) {
    const buckets = {};
    order.items.forEach(function (item) {
      buckets[item.category] = (buckets[item.category] || 0) + item.price * item.qty;
    });
    return Object.keys(buckets).sort(function (a, b) {
      return buckets[b] - buckets[a];
    })[0] || "accesorio";
  }

  function getInventoryMetrics() {
    const inventory = getInventory();
    return {
      totalProducts: inventory.length,
      lowStock: inventory.filter(function (item) { return item.stock > 0 && item.stock <= 5; }).length,
      outStock: inventory.filter(function (item) { return item.stock === 0; }).length,
      inventoryValue: inventory.reduce(function (acc, item) {
        return acc + item.price * item.stock;
      }, 0)
    };
  }

  function getStatusFlow() {
    return STATUS_FLOW.slice();
  }

  window.TechStoreApp = {
    SHIPPING_COST: SHIPPING_COST,
    CATEGORY_NAMES: clone(CATEGORY_NAMES),
    CATEGORY_ICONS: clone(CATEGORY_ICONS),
    ensureInitialized: ensureInitialized,
    resetDemoData: resetDemoData,
    getState: getState,
    getSession: getSession,
    login: login,
    logout: logout,
    formatCurrency: formatCurrency,
    formatDate: formatDate,
    formatDateTime: formatDateTime,
    getInventory: getInventory,
    getInventoryMetrics: getInventoryMetrics,
    getAvailableProducts: getAvailableProducts,
    getProductById: getProductById,
    addToCart: addToCart,
    updateCartQuantity: updateCartQuantity,
    clearCart: clearCart,
    getCartItems: getCartItems,
    calculateCartSummary: calculateCartSummary,
    evaluateCoupon: evaluateCoupon,
    placeOrder: placeOrder,
    getOrders: getOrders,
    getOrderByCode: getOrderByCode,
    getOrdersForCurrentUser: getOrdersForCurrentUser,
    getRecentOrders: getRecentOrders,
    getOrderProgress: getOrderProgress,
    getDisplayStatus: getDisplayStatus,
    advanceOrderStatus: advanceOrderStatus,
    updateOrder: updateOrder,
    adjustInventoryStock: adjustInventoryStock,
    toggleInventoryItem: toggleInventoryItem,
    createInventoryItem: createInventoryItem,
    createSupportTicket: createSupportTicket,
    getSupportTickets: getSupportTickets,
    getPrimaryCategory: getPrimaryCategory,
    getStatusFlow: getStatusFlow
  };
})();
