(function () {
  function init() {
    const app = window.TechStoreApp;
    const ui = window.TechStoreUI;
    const ordersBody = document.getElementById("ordersBody");
    const filterForm = document.getElementById("filterForm");
    const detailBox = document.getElementById("detailBox");
    const updateForm = document.getElementById("updateForm");
    const nextStatusBtn = document.getElementById("nextStatusBtn");
    const message = document.getElementById("message");
    if (!app || !ui || !ordersBody || !filterForm || !detailBox || !updateForm || !nextStatusBtn || !message) {
      return;
    }

    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const priorityFilter = document.getElementById("priorityFilter");
    const clearBtn = document.getElementById("clearBtn");
    const newStatus = document.getElementById("newStatus");
    const newEmployee = document.getElementById("newEmployee");
    const newNote = document.getElementById("newNote");
    const statTotal = document.getElementById("statTotal");
    const statPending = document.getElementById("statPending");
    const statShipped = document.getElementById("statShipped");
    const statDelivered = document.getElementById("statDelivered");
    let selectedCode = "";
    let filteredOrders = [];

    function clearDetail() {
      detailBox.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-box-open"></i>
          <p>Selecciona un pedido para gestionar.</p>
        </div>
      `;
    }

    function renderStats(allOrders) {
      statTotal.textContent = String(allOrders.length);
      statPending.textContent = String(allOrders.filter(function (order) {
        return order.status === "pendiente" || order.status === "preparacion";
      }).length);
      statShipped.textContent = String(allOrders.filter(function (order) {
        return order.status === "enviado";
      }).length);
      statDelivered.textContent = String(allOrders.filter(function (order) {
        return order.status === "entregado";
      }).length);
    }

    function renderTable(list) {
      if (!list.length) {
        ordersBody.innerHTML = '<tr><td colspan="8" class="empty-row">No hay pedidos para mostrar.</td></tr>';
        return;
      }

      ordersBody.innerHTML = list.map(function (order) {
        return `
          <tr class="${order.code === selectedCode ? "selected-row" : ""}">
            <td>${ui.escapeHtml(order.code)}</td>
            <td>${ui.escapeHtml(order.customerName)}</td>
            <td>${app.formatDate(order.date)}</td>
            <td>${app.formatCurrency(order.total)}</td>
            <td><span class="status ${ui.statusClass(order.status)}">${ui.escapeHtml(order.status)}</span></td>
            <td><span class="priority ${ui.priorityClass(order.priority)}">${ui.escapeHtml(order.priority)}</span></td>
            <td>${ui.escapeHtml(order.employee)}</td>
            <td>
              <div class="row-actions">
                <button class="mini-btn dark" data-action="view" data-code="${ui.escapeHtml(order.code)}" title="Ver detalle">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="mini-btn" data-action="next" data-code="${ui.escapeHtml(order.code)}" title="Siguiente estado">
                  <i class="fas fa-forward-step"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    function renderDetail(order) {
      detailBox.innerHTML = `
        <article class="detail-top">
          <div>
            <h3>${ui.escapeHtml(order.code)}</h3>
            <p>${ui.escapeHtml(order.customerName)} · ${app.formatDate(order.date)}</p>
          </div>
          <span class="status ${ui.statusClass(order.status)}">${ui.escapeHtml(order.status)}</span>
        </article>
        <article class="detail-data">
          <p><strong>Total:</strong> ${app.formatCurrency(order.total)}</p>
          <p><strong>Prioridad:</strong> ${ui.escapeHtml(order.priority)}</p>
          <p><strong>Empleado:</strong> ${ui.escapeHtml(order.employee)}</p>
          <p><strong>Pago:</strong> ${ui.escapeHtml(order.payment)}</p>
          <p><strong>Direccion:</strong> ${ui.escapeHtml(order.address + ", " + order.city)}</p>
        </article>
        <h4>Productos</h4>
        <ul class="item-list">
          ${order.items.map(function (item) {
            return "<li>" + ui.escapeHtml(item.name + " x" + item.qty) + "</li>";
          }).join("")}
        </ul>
        <h4>Historial</h4>
        <ul class="history-list">
          ${order.timeline.slice().reverse().map(function (entry) {
            return "<li>" + ui.escapeHtml(app.formatDateTime(entry.time) + " - " + entry.text) + "</li>";
          }).join("")}
        </ul>
      `;

      newStatus.value = order.status;
      newEmployee.value = order.employee === "Sin asignar" ? "" : order.employee;
      newNote.value = order.note || "";
    }

    function applyFilters(showMessage) {
      const query = String(searchInput.value || "").trim().toLowerCase();
      const status = statusFilter.value;
      const priority = priorityFilter.value;
      const allOrders = app.getOrders();
      filteredOrders = allOrders.filter(function (order) {
        const text = (order.code + " " + order.customerName).toLowerCase();
        return (!query || text.includes(query))
          && (!status || order.status === status)
          && (!priority || order.priority === priority);
      });

      renderTable(filteredOrders);
      renderStats(allOrders);
      if (!filteredOrders.some(function (order) { return order.code === selectedCode; })) {
        selectedCode = "";
        clearDetail();
      } else {
        const selected = app.getOrderByCode(selectedCode);
        if (selected) {
          renderDetail(selected);
        }
      }

      if (showMessage) {
        ui.setMessage(
          message,
          filteredOrders.length ? "Se encontraron " + filteredOrders.length + " pedido(s)." : "No hay pedidos que coincidan con los filtros.",
          filteredOrders.length ? "success" : "error"
        );
      }
    }

    ordersBody.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-action]");
      if (!button) {
        return;
      }

      const action = button.dataset.action;
      const code = button.dataset.code;
      if (action === "view") {
        selectedCode = code;
        const order = app.getOrderByCode(code);
        if (order) {
          renderDetail(order);
          renderTable(filteredOrders);
        }
        return;
      }

      const result = app.advanceOrderStatus(code);
      ui.setMessage(message, result.message, result.ok ? "success" : "error");
      if (result.ok) {
        selectedCode = code;
      }
      applyFilters(false);
    });

    filterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      applyFilters(true);
    });

    clearBtn.addEventListener("click", function () {
      filterForm.reset();
      selectedCode = "";
      clearDetail();
      applyFilters(false);
      ui.setMessage(message, "Filtros reiniciados. Mostrando todos los pedidos.", "neutral");
    });

    updateForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!selectedCode) {
        ui.setMessage(message, "Selecciona un pedido antes de guardar cambios.", "error");
        return;
      }

      const result = app.updateOrder(selectedCode, {
        status: newStatus.value,
        employee: newEmployee.value,
        note: newNote.value
      });

      ui.setMessage(message, result.message, result.ok ? "success" : "error");
      if (result.ok) {
        applyFilters(false);
      }
    });

    nextStatusBtn.addEventListener("click", function () {
      if (!selectedCode) {
        ui.setMessage(message, "Selecciona un pedido antes de avanzar el estado.", "error");
        return;
      }
      const result = app.advanceOrderStatus(selectedCode);
      ui.setMessage(message, result.message, result.ok ? "success" : "error");
      if (result.ok) {
        applyFilters(false);
      }
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
