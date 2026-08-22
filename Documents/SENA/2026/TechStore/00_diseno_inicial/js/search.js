(function () {
  function init() {
    const app = window.TechStoreApp;
    const ui = window.TechStoreUI;
    const form = document.getElementById("searchForm");
    const results = document.getElementById("results");
    const message = document.getElementById("message");
    if (!app || !ui || !form || !results || !message) {
      return;
    }

    const searchInput = document.getElementById("searchInput");
    const category = document.getElementById("category");
    const minPrice = document.getElementById("minPrice");
    const maxPrice = document.getElementById("maxPrice");
    const clearBtn = document.getElementById("clearBtn");

    function renderList(list) {
      if (!list.length) {
        results.innerHTML = '<article class="product-card"><h3>Sin resultados</h3><p class="product-meta">Ajusta los filtros para encontrar productos disponibles.</p></article>';
        return;
      }

      results.innerHTML = list.map(function (product) {
        return `
          <article class="product-card">
            <span class="product-tag">${ui.escapeHtml(app.CATEGORY_NAMES[product.category] || product.category)}</span>
            <i class="fas ${ui.escapeHtml(app.CATEGORY_ICONS[product.category] || "fa-box")} product-icon"></i>
            <h3>${ui.escapeHtml(product.name)}</h3>
            <p class="product-price">${app.formatCurrency(product.price)}</p>
            <p class="product-stock">Stock disponible: ${ui.escapeHtml(String(product.stock))}</p>
            <button type="button" class="btn-accept product-action" data-add="${ui.escapeHtml(product.id)}">
              <i class="fas fa-cart-plus"></i> Agregar al carrito
            </button>
          </article>
        `;
      }).join("");
    }

    function applyFilters(showMessage) {
      const query = String(searchInput.value || "").trim().toLowerCase();
      const selectedCategory = category.value;
      const min = Number(minPrice.value || 0);
      const max = Number(maxPrice.value || 0);

      const list = app.getAvailableProducts().filter(function (product) {
        const matchesText = !query || product.name.toLowerCase().includes(query) || product.code.toLowerCase().includes(query);
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        const matchesMin = !minPrice.value || product.price >= min;
        const matchesMax = !maxPrice.value || product.price <= max;
        return matchesText && matchesCategory && matchesMin && matchesMax;
      });

      renderList(list);
      if (showMessage) {
        ui.setMessage(
          message,
          list.length ? "Se encontraron " + list.length + " producto(s)." : "No hay resultados con esos filtros.",
          list.length ? "success" : "error"
        );
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      applyFilters(true);
    });

    clearBtn.addEventListener("click", function () {
      form.reset();
      renderList(app.getAvailableProducts());
      ui.setMessage(message, "Filtros reiniciados. Catalogo actualizado.", "neutral");
    });

    results.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-add]");
      if (!button) {
        return;
      }
      const result = app.addToCart(button.dataset.add);
      ui.setMessage(message, result.message, result.ok ? "success" : "error");
    });

    renderList(app.getAvailableProducts());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
