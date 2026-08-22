(function () {
  const NAV_ITEMS = [
    { type: "link", href: "index.html", label: "Inicio", icon: "fa-house" },
    { type: "link", href: "Autenticidad de un usuario.html", label: "Acceso", icon: "fa-user-shield" },
    {
      type: "group",
      label: "Comercial",
      icon: "fa-bag-shopping",
      items: [
        { href: "Buscar productos.html", label: "Catalogo", icon: "fa-magnifying-glass" },
        { href: "Agregar productos al carrito.html", label: "Carrito", icon: "fa-cart-shopping" },
        { href: "Realizar compras.html", label: "Checkout", icon: "fa-credit-card" }
      ]
    },
    {
      type: "group",
      label: "Pedidos",
      icon: "fa-truck-fast",
      items: [
        { href: "Seguimiento de pedidos.html", label: "Seguimiento", icon: "fa-truck-fast" },
        { href: "Visualizar historial de compras.html", label: "Historial", icon: "fa-clock-rotate-left" },
        { href: "Chat de soporte.html", label: "Soporte", icon: "fa-headset" }
      ]
    },
    {
      type: "group",
      label: "Gestion",
      icon: "fa-briefcase",
      items: [
        { href: "Gestion de inventario.html", label: "Inventario", icon: "fa-boxes-stacked" },
        { href: "Gestion de pedidos.html", label: "Pedidos", icon: "fa-clipboard-check" },
        { href: "Generar reportes.html", label: "Reportes", icon: "fa-chart-pie" }
      ]
    },
    { type: "link", href: "Mapa de navegacion TechStore.html", label: "Mapa", icon: "fa-sitemap" }
  ];
  const GLOBAL_BG_ICONS = [
    "fa-laptop-code",
    "fa-microchip",
    "fa-database",
    "fa-server",
    "fa-shield-halved",
    "fa-cart-shopping",
    "fa-credit-card",
    "fa-box-open",
    "fa-headset",
    "fa-chart-line",
    "fa-mobile-screen",
    "fa-network-wired"
  ];
  const SHELL_COLLAPSE_WIDTH = 980;
  const SHELL_COMPACT_SCROLL = 44;
  const PAGE_DETAILS = {
    "index.html": {
      label: "Inicio",
      title: "Inicio | TechStore",
      description: "Portada operativa de TechStore con acceso unificado a compra, pedidos, soporte, inventario y reportes."
    },
    "Autenticidad de un usuario.html": {
      label: "Acceso",
      title: "Acceso | TechStore",
      description: "Inicio de sesion demo para perfiles de cliente, empleado y administrador dentro de TechStore."
    },
    "Buscar productos.html": {
      label: "Catalogo",
      title: "Buscar productos | TechStore",
      description: "Explora el catalogo de TechStore con filtros por texto, categoria y precio."
    },
    "Agregar productos al carrito.html": {
      label: "Carrito",
      title: "Agregar productos al carrito | TechStore",
      description: "Agrega productos al carrito, ajusta cantidades y prepara el pedido en TechStore."
    },
    "Realizar compras.html": {
      label: "Checkout",
      title: "Realizar compras | TechStore",
      description: "Finaliza la compra con datos de envio, cupones y metodos de pago en TechStore."
    },
    "Seguimiento de pedidos.html": {
      label: "Seguimiento",
      title: "Seguimiento de pedidos | TechStore",
      description: "Consulta el estado del pedido y visualiza su avance dentro del flujo logistico de TechStore."
    },
    "Visualizar historial de compras.html": {
      label: "Historial",
      title: "Visualizar historial de compras | TechStore",
      description: "Revisa compras previas, totales y detalles de cada pedido registrado en TechStore."
    },
    "Chat de soporte.html": {
      label: "Soporte",
      title: "Chat de soporte | TechStore",
      description: "Canal de soporte simulado para resolver dudas, crear tickets y acompanar al cliente."
    },
    "Gestion de inventario.html": {
      label: "Inventario",
      title: "Gestion de inventario | TechStore",
      description: "Panel administrativo para controlar stock, estado de productos y alertas de inventario."
    },
    "Gestion de pedidos.html": {
      label: "Pedidos",
      title: "Gestion de pedidos | TechStore",
      description: "Panel operativo para administrar responsables, prioridades y estados de pedidos."
    },
    "Generar reportes.html": {
      label: "Reportes",
      title: "Generar reportes | TechStore",
      description: "Visualiza metricas de ventas, categorias, clientes y reportes generales de TechStore."
    },
    "Mapa de navegacion TechStore.html": {
      label: "Mapa",
      title: "Mapa de navegacion | TechStore",
      description: "Mapa general del sitio TechStore para entender la relacion entre modulos y recorridos."
    }
  };

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getRoleLabel(role) {
    if (role === "administrador") {
      return "Propietario y administrador";
    }
    if (role === "empleado") {
      return "Equipo operativo";
    }
    if (role === "cliente") {
      return "Cliente";
    }
    return "Invitado";
  }

  function getStatusTone(status) {
    if (status === "entregado") {
      return "ok";
    }
    if (status === "enviado") {
      return "way";
    }
    if (status === "preparacion") {
      return "prep";
    }
    if (status === "cancelado") {
      return "cancel";
    }
    return "neutral";
  }

  function getNotifications(app, session) {
    const recentOrders = app.getRecentOrders(3, session.role === "cliente");
    const stockAlerts = app.getInventory().filter(function (item) {
      return item.stock === 0 || item.stock <= 5;
    }).slice(0, 3);

    return recentOrders.map(function (order) {
      return {
        tone: getStatusTone(order.status),
        icon: order.status === "cancelado" ? "fa-circle-xmark" : order.status === "entregado" ? "fa-circle-check" : "fa-truck-fast",
        title: order.code,
        meta: "Pedido " + app.getDisplayStatus(order.status) + " | " + app.formatDate(order.date)
      };
    }).concat(stockAlerts.map(function (item) {
      return {
        tone: item.stock === 0 ? "cancel" : "prep",
        icon: "fa-box-open",
        title: item.name,
        meta: "Stock " + String(item.stock) + " | " + (app.CATEGORY_NAMES[item.category] || item.category)
      };
    }));
  }

  function renderNotifications(app, session) {
    const notifications = getNotifications(app, session);
    return `
      <details class="ts-shell__notifications" data-shell-detail>
        <summary class="ts-shell__notify-button" aria-label="Abrir notificaciones">
          <i class="fas fa-bell" aria-hidden="true"></i>
          ${notifications.length ? `<span class="ts-shell__notify-badge">${notifications.length}</span>` : ""}
        </summary>
        <div class="ts-shell__notify-panel">
          <div class="ts-shell__notify-head">
            <div>
              <strong>Notificaciones</strong>
              <span>Pedidos y alertas relevantes</span>
            </div>
            <em>${notifications.length}</em>
          </div>
          <div class="ts-shell__notify-list">
            ${notifications.length ? notifications.map(function (item) {
              return `
                <article class="ts-shell__notify-item" data-tone="${item.tone}">
                  <span class="ts-shell__notify-icon">
                    <i class="fas ${item.icon}" aria-hidden="true"></i>
                  </span>
                  <div class="ts-shell__notify-copy">
                    <strong>${escapeHtml(item.title)}</strong>
                    <p>${escapeHtml(item.meta)}</p>
                  </div>
                </article>
              `;
            }).join("") : `
              <p class="ts-shell__notify-empty">No hay novedades para revisar.</p>
            `}
          </div>
        </div>
      </details>
    `;
  }

  function getCurrentPage() {
    const path = decodeURIComponent(window.location.pathname || "");
    const parts = path.split("/");
    return parts[parts.length - 1] || "index.html";
  }

  function getPageDetails(currentPage) {
    return PAGE_DETAILS[currentPage] || {
      label: "TechStore",
      title: document.title || "TechStore",
      description: "Experiencia operativa y comercial de TechStore."
    };
  }

  function sanitizePageToken(currentPage) {
    return String(currentPage || "techstore")
      .toLowerCase()
      .replace(/\.html$/i, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function ensureDocumentMeta(currentPage, pageDetails) {
    document.body.setAttribute("data-page", sanitizePageToken(currentPage));

    if (pageDetails && pageDetails.title && document.title !== pageDetails.title) {
      document.title = pageDetails.title;
    }

    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement("meta");
      themeColor.setAttribute("name", "theme-color");
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute("content", "#071a27");

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.appendChild(description);
    }
    description.setAttribute("content", pageDetails.description);
  }

  function enhancePageChrome() {
    const main = document.querySelector("main, .card, .home-card");
    if (main) {
      if (!main.id) {
        main.id = "tsMainContent";
      }
      if (!main.hasAttribute("tabindex")) {
        main.setAttribute("tabindex", "-1");
      }
    }

    if (!document.querySelector(".ts-skip-link") && main) {
      const skipLink = document.createElement("a");
      skipLink.className = "ts-skip-link";
      skipLink.href = "#" + main.id;
      skipLink.textContent = "Saltar al contenido";
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    const curve = document.querySelector(".curve-top");
    if (curve) {
      curve.setAttribute("aria-hidden", "true");
    }

    const codeBg = document.querySelector(".code-bg");
    if (codeBg) {
      codeBg.setAttribute("aria-hidden", "true");
      if (!codeBg.classList.contains("code-bg--home")) {
        codeBg.classList.add("code-bg--global");
        codeBg.innerHTML = GLOBAL_BG_ICONS.map(function (icon) {
          return '<i class="fas ' + icon + '" aria-hidden="true"></i>';
        }).join("");
      }
    }
  }

  function renderNavItem(item, currentPage) {
    if (item.type === "link") {
      const active = item.href === currentPage ? "active" : "";
      const ariaCurrent = item.href === currentPage ? ' aria-current="page"' : "";
      return `
        <a class="ts-shell__link ${active}" href="${item.href}"${ariaCurrent}>
          <i class="fas ${item.icon}" aria-hidden="true"></i>
          <span>${item.label}</span>
        </a>
      `;
    }

    const isActive = item.items.some(function (child) {
      return child.href === currentPage;
    });

    return `
      <details class="ts-shell__group" data-shell-detail>
        <summary class="ts-shell__link ${isActive ? "active" : ""}">
          <span class="ts-shell__link-main">
            <i class="fas ${item.icon}" aria-hidden="true"></i>
            <span>${item.label}</span>
          </span>
          <i class="fas fa-chevron-down ts-shell__caret" aria-hidden="true"></i>
        </summary>
        <div class="ts-shell__menu">
          ${item.items.map(function (child) {
            const active = child.href === currentPage ? "active" : "";
            const ariaCurrent = child.href === currentPage ? ' aria-current="page"' : "";
            return `
              <a class="ts-shell__menu-link ${active}" href="${child.href}"${ariaCurrent}>
                <i class="fas ${child.icon}" aria-hidden="true"></i>
                <span>${child.label}</span>
              </a>
            `;
          }).join("")}
        </div>
      </details>
    `;
  }

  function renderShell() {
    const app = window.TechStoreApp;
    if (!app || document.querySelector(".ts-shell")) {
      return;
    }

    const currentPage = getCurrentPage();
    const pageDetails = getPageDetails(currentPage);
    ensureDocumentMeta(currentPage, pageDetails);
    enhancePageChrome();
    app.ensureInitialized();
    const session = app.getSession();
    const shell = document.createElement("div");
    shell.className = "ts-shell";
    shell.innerHTML = `
      <div class="ts-shell__top">
        <a class="ts-shell__brand" href="index.html" aria-label="Ir al inicio de TechStore">
          <img src="img/Techstore-logo.png" alt="Logo TechStore">
          <span>TechStore</span>
        </a>
        <div class="ts-shell__utilities">
          ${renderNotifications(app, session)}
          <div class="ts-shell__session" data-role="${session.role}">
            <strong>${escapeHtml(session.name || "Invitado")}</strong>
            <span>${escapeHtml(getRoleLabel(session.role) + " | " + pageDetails.label)}</span>
          </div>
        </div>
        <button class="ts-shell__menu-toggle" type="button" id="tsShellMenuToggle" aria-controls="tsShellPanel" aria-expanded="false">
          <i class="fas fa-bars" aria-hidden="true"></i>
          <span>Menu</span>
        </button>
      </div>
      <nav class="ts-shell__panel" id="tsShellPanel" aria-label="Navegacion principal">
        ${NAV_ITEMS.map(function (item) {
          return renderNavItem(item, currentPage);
        }).join("")}
      </nav>
    `;

    document.body.insertBefore(shell, document.body.firstChild);

    if (currentPage !== "Chat de soporte.html") {
      const fab = document.createElement("a");
      fab.className = "ts-fab";
      fab.href = "Chat de soporte.html";
      fab.setAttribute("aria-label", "Abrir soporte");
      fab.innerHTML = '<i class="fas fa-comment-dots" aria-hidden="true"></i>';
      document.body.appendChild(fab);
    }

    const menuButton = document.getElementById("tsShellMenuToggle");
    const navLinks = shell.querySelectorAll(".ts-shell__link, .ts-shell__menu-link");
    const detailMenus = Array.from(shell.querySelectorAll("[data-shell-detail]"));

    function setMenuState(isOpen) {
      shell.classList.toggle("is-open", isOpen);
      if (menuButton) {
        menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }
      if (!isOpen && window.innerWidth <= SHELL_COLLAPSE_WIDTH) {
        detailMenus.forEach(function (detail) {
          detail.open = false;
        });
      }
    }

    function closeOtherDetails(activeDetail) {
      detailMenus.forEach(function (detail) {
        if (detail !== activeDetail) {
          detail.open = false;
        }
      });
    }

    function updateCompactState() {
      if (window.innerWidth <= SHELL_COLLAPSE_WIDTH) {
        shell.classList.remove("is-compact");
        return;
      }
      shell.classList.toggle("is-compact", window.scrollY > SHELL_COMPACT_SCROLL);
    }

    detailMenus.forEach(function (detail) {
      detail.addEventListener("toggle", function () {
        if (detail.open) {
          closeOtherDetails(detail);
        }
      });
    });

    if (menuButton) {
      menuButton.addEventListener("click", function () {
        setMenuState(!shell.classList.contains("is-open"));
      });
    }

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= SHELL_COLLAPSE_WIDTH) {
          setMenuState(false);
        }
      });
    });

    document.addEventListener("click", function (event) {
      const clickedInsideDetail = detailMenus.some(function (detail) {
        return detail.contains(event.target);
      });

      if (!clickedInsideDetail) {
        detailMenus.forEach(function (detail) {
          detail.open = false;
        });
      }

      if (window.innerWidth <= SHELL_COLLAPSE_WIDTH && shell.classList.contains("is-open") && !shell.contains(event.target)) {
        setMenuState(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenuState(false);
        detailMenus.forEach(function (detail) {
          detail.open = false;
        });
      }
    });

    window.addEventListener("scroll", updateCompactState, { passive: true });
    window.addEventListener("resize", updateCompactState);
    updateCompactState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderShell);
  } else {
    renderShell();
  }
})();
