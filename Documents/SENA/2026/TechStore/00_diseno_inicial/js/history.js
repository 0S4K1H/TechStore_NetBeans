(function () {
  function init() {
    const app = window.TechStoreApp;
    const ui = window.TechStoreUI;
    const form = document.getElementById("filterForm");
    const historyList = document.getElementById("historyList");
    const detailBox = document.getElementById("detailBox");
    const message = document.getElementById("message");
    if (!app || !ui || !form || !historyList || !detailBox || !message) {
      return;
    }

    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const sortFilter = document.getElementById("sortFilter");
    const clearBtn = document.getElementById("clearBtn");
    const statOrders = document.getElementById("statOrders");
    const statSpent = document.getElementById("statSpent");
    const statDelivered = document.getElementById("statDelivered");
    const statAverage = document.getElementById("statAverage");
    let selectedCode = "";
    let filteredPurchases = [];

    function normalizeFilterStatus(value) {
      return value === "en camino" ? "enviado" : value;
    }

    function clearDetail() {
      detailBox.innerHTML = `
        <div class="empty-detail">
          <i class="fas fa-receipt"></i>
          <p>Selecciona una compra para ver su detalle.</p>
        </div>
      `;
    }

    function renderStats(list) {
      const total = list.length;
      const spent = list.reduce(function (acc, item) { return acc + item.total; }, 0);
      const delivered = list.filter(function (item) { return item.status === "entregado"; }).length;
      statOrders.textContent = String(total);
      statSpent.textContent = app.formatCurrency(spent);
      statDelivered.textContent = String(delivered);
      statAverage.textContent = app.formatCurrency(total ? spent / total : 0);
    }

    function renderDetail(order) {
      detailBox.innerHTML = `
        <article class="detail-header">
          <div>
            <h3>${ui.escapeHtml(order.code)}</h3>
            <p>${app.formatDate(order.date)}</p>
          </div>
          <span class="status ${ui.statusClass(order.status)}">${ui.escapeHtml(app.getDisplayStatus(order.status))}</span>
        </article>
        <article class="detail-info">
          <p><strong>Metodo de pago:</strong> ${ui.escapeHtml(order.payment)}</p>
          <p><strong>Direccion:</strong> ${ui.escapeHtml(order.address + ", " + order.city)}</p>
          <p><strong>Total:</strong> ${app.formatCurrency(order.total)}</p>
        </article>
        <h4>Productos</h4>
        <ul class="detail-items">
          ${order.items.map(function (item) {
            return `
              <li>
                <div>
                  <strong>${ui.escapeHtml(item.name)}</strong>
                  <p>Cantidad: ${ui.escapeHtml(String(item.qty))}</p>
                </div>
                <span>${app.formatCurrency(item.price * item.qty)}</span>
              </li>
            `;
          }).join("")}
        </ul>
        <a class="inline-link-btn" href="Seguimiento de pedidos.html?order=${encodeURIComponent(order.code)}">
          <i class="fas fa-truck-fast"></i> Ver seguimiento
        </a>
      `;
    }

    function renderList(list) {
      if (!list.length) {
        historyList.innerHTML = '<li class="empty-state">No hay compras para mostrar.</li>';
        return;
      }

      historyList.innerHTML = list.map(function (order) {
        return `
          <li class="history-item ${order.code === selectedCode ? "selected" : ""}">
            <div class="item-main">
              <h3>${ui.escapeHtml(order.code)}</h3>
              <p>${app.formatDate(order.date)} · ${ui.escapeHtml(String(order.items.length))} producto(s)</p>
            </div>
            <div class="item-meta">
              <span class="status ${ui.statusClass(order.status)}">${ui.escapeHtml(app.getDisplayStatus(order.status))}</span>
              <strong>${app.formatCurrency(order.total)}</strong>
            </div>
            <button class="btn-view" data-code="${ui.escapeHtml(order.code)}">
              <i class="fas fa-eye"></i> Ver detalle
            </button>
          </li>
        `;
      }).join("");
    }

    function applyFilters(showMessage) {
      const query = String(searchInput.value || "").trim().toLowerCase();
      const status = normalizeFilterStatus(statusFilter.value);
      const sort = sortFilter.value;
      filteredPurchases = app.getOrdersForCurrentUser().filter(function (order) {
        const text = [
          order.code,
          order.customerName,
          order.items.map(function (item) { return item.name; }).join(" ")
        ].join(" ").toLowerCase();
        const matchesText = !query || text.includes(query);
        const matchesStatus = !status || order.status === status;
        return matchesText && matchesStatus;
      });

      filteredPurchases.sort(function (a, b) {
        if (sort === "oldest") {
          return new Date(a.date + "T00:00:00") - new Date(b.date + "T00:00:00");
        }
        if (sort === "high") {
          return b.total - a.total;
        }
        if (sort === "low") {
          return a.total - b.total;
        }
        return new Date(b.date + "T00:00:00") - new Date(a.date + "T00:00:00");
      });

      renderList(filteredPurchases);
      renderStats(filteredPurchases);
      if (!filteredPurchases.some(function (order) { return order.code === selectedCode; })) {
        selectedCode = "";
        clearDetail();
      }

      if (showMessage) {
        ui.setMessage(
          message,
          filteredPurchases.length ? "Se encontraron " + filteredPurchases.length + " compra(s)." : "No hay compras que coincidan con los filtros.",
          filteredPurchases.length ? "success" : "error"
        );
      }
    }

    historyList.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-code]");
      if (!button) {
        return;
      }
      selectedCode = button.dataset.code;
      const order = app.getOrdersForCurrentUser().find(function (item) {
        return item.code === selectedCode;
      });
      if (!order) {
        return;
      }
      renderDetail(order);
      renderList(filteredPurchases);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      applyFilters(true);
    });

    clearBtn.addEventListener("click", function () {
      form.reset();
      selectedCode = "";
      clearDetail();
      applyFilters(false);
      ui.setMessage(message, "Filtros reiniciados. Mostrando todo el historial.", "neutral");
    });

    clearDetail();
    applyFilters(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
