(function () {
  function init() {
    const app = window.TechStoreApp;
    const ui = window.TechStoreUI;
    const inventoryBody = document.getElementById("inventoryBody");
    const filterForm = document.getElementById("filterForm");
    const addForm = document.getElementById("addForm");
    const alertsList = document.getElementById("alertsList");
    const message = document.getElementById("message");
    if (!app || !ui || !inventoryBody || !filterForm || !addForm || !alertsList || !message) {
      return;
    }

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const stockFilter = document.getElementById("stockFilter");
    const clearBtn = document.getElementById("clearBtn");
    const totalProducts = document.getElementById("totalProducts");
    const lowStock = document.getElementById("lowStock");
    const outStock = document.getElementById("outStock");
    const inventoryValue = document.getElementById("inventoryValue");
    const newCode = document.getElementById("newCode");
    const newName = document.getElementById("newName");
    const newCategory = document.getElementById("newCategory");
    const newPrice = document.getElementById("newPrice");
    const newStock = document.getElementById("newStock");
    let filteredInventory = [];

    function matchesStockFilter(stock, filterValue) {
      if (!filterValue) {
        return true;
      }
      if (filterValue === "agotado") {
        return stock === 0;
      }
      if (filterValue === "bajo") {
        return stock > 0 && stock <= 5;
      }
      return stock > 5;
    }

    function getState(item) {
      if (item.stock === 0) {
        return { label: "agotado", statusClass: "out", stockClass: "out" };
      }
      if (!item.active) {
        return { label: "inactivo", statusClass: "inactive", stockClass: "low" };
      }
      if (item.stock <= 5) {
        return { label: "stock bajo", statusClass: "warning", stockClass: "low" };
      }
      return { label: "activo", statusClass: "active", stockClass: "ok" };
    }

    function renderMetrics() {
      const metrics = app.getInventoryMetrics();
      totalProducts.textContent = String(metrics.totalProducts);
      lowStock.textContent = String(metrics.lowStock);
      outStock.textContent = String(metrics.outStock);
      inventoryValue.textContent = app.formatCurrency(metrics.inventoryValue);
    }

    function renderAlerts() {
      const alerts = app.getInventory().filter(function (item) {
        return item.stock === 0 || item.stock <= 5;
      });

      if (!alerts.length) {
        alertsList.innerHTML = '<li class="empty-alert">No hay alertas activas.</li>';
        return;
      }

      alertsList.innerHTML = alerts.map(function (item) {
        return `
          <li class="alert-item ${item.stock === 0 ? "danger" : "warn"}">
            <div>
              <strong>${ui.escapeHtml(item.name)}</strong>
              <p>${ui.escapeHtml(item.code)} · ${item.stock === 0 ? "Agotado" : "Stock bajo"}</p>
            </div>
            <span>${ui.escapeHtml(String(item.stock))}</span>
          </li>
        `;
      }).join("");
    }

    function renderTable(list) {
      if (!list.length) {
        inventoryBody.innerHTML = '<tr><td colspan="7" class="empty-row">No hay productos para mostrar.</td></tr>';
        return;
      }

      inventoryBody.innerHTML = list.map(function (item) {
        const state = getState(item);
        return `
          <tr>
            <td>${ui.escapeHtml(item.code)}</td>
            <td>${ui.escapeHtml(item.name)}</td>
            <td>${ui.escapeHtml(app.CATEGORY_NAMES[item.category] || item.category)}</td>
            <td>${app.formatCurrency(item.price)}</td>
            <td><span class="stock-chip ${state.stockClass}">${ui.escapeHtml(String(item.stock))}</span></td>
            <td><span class="status ${state.statusClass}">${ui.escapeHtml(state.label)}</span></td>
            <td>
              <div class="row-actions">
                <button class="mini-btn" data-action="minus" data-code="${ui.escapeHtml(item.code)}" title="Disminuir stock">
                  <i class="fas fa-minus"></i>
                </button>
                <button class="mini-btn" data-action="plus" data-code="${ui.escapeHtml(item.code)}" title="Aumentar stock">
                  <i class="fas fa-plus"></i>
                </button>
                <button class="mini-btn dark" data-action="toggle" data-code="${ui.escapeHtml(item.code)}" title="Activar o inactivar">
                  <i class="fas fa-power-off"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    function applyFilters(showMessage) {
      const query = String(searchInput.value || "").trim().toLowerCase();
      const category = categoryFilter.value;
      const stockLevel = stockFilter.value;
      filteredInventory = app.getInventory().filter(function (item) {
        const text = (item.code + " " + item.name).toLowerCase();
        return (!query || text.includes(query))
          && (!category || item.category === category)
          && matchesStockFilter(item.stock, stockLevel);
      });

      renderTable(filteredInventory);
      renderMetrics();
      renderAlerts();
      if (showMessage) {
        ui.setMessage(
          message,
          filteredInventory.length ? "Se encontraron " + filteredInventory.length + " producto(s)." : "No hay productos que coincidan con los filtros.",
          filteredInventory.length ? "success" : "error"
        );
      }
    }

    filterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      applyFilters(true);
    });

    clearBtn.addEventListener("click", function () {
      filterForm.reset();
      applyFilters(false);
      ui.setMessage(message, "Filtros reiniciados. Mostrando todo el inventario.", "neutral");
    });

    inventoryBody.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-action]");
      if (!button) {
        return;
      }

      const action = button.dataset.action;
      const code = button.dataset.code;
      const result = action === "toggle"
        ? app.toggleInventoryItem(code)
        : app.adjustInventoryStock(code, action === "plus" ? 1 : -1);

      ui.setMessage(message, result.message, result.ok ? "success" : "error");
      applyFilters(false);
    });

    addForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const result = app.createInventoryItem({
        code: newCode.value,
        name: newName.value,
        category: newCategory.value,
        price: newPrice.value,
        stock: newStock.value
      });

      if (!result.ok) {
        ui.setMessage(message, result.message, "error");
        return;
      }

      addForm.reset();
      applyFilters(false);
      ui.setMessage(message, result.message, "success");
    });

    applyFilters(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
