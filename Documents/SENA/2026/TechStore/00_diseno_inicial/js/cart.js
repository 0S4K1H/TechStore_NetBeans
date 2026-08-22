(function () {
  function init() {
    const app = window.TechStoreApp;
    const ui = window.TechStoreUI;
    const cartList = document.getElementById("cartList");
    const cartTotal = document.getElementById("cartTotal");
    const productsGrid = document.querySelector(".products-grid");
    const message = document.getElementById("message");
    const clearBtn = document.getElementById("clearCartBtn");
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (!app || !ui || !cartList || !cartTotal || !productsGrid || !message || !clearBtn || !checkoutBtn) {
      return;
    }

    function renderProducts() {
      const products = app.getAvailableProducts();
      productsGrid.innerHTML = products.map(function (product) {
        return `
          <article class="product-card">
            <i class="fas ${ui.escapeHtml(app.CATEGORY_ICONS[product.category] || "fa-box")} product-icon"></i>
            <h3>${ui.escapeHtml(product.name)}</h3>
            <p class="product-price">${app.formatCurrency(product.price)}</p>
            <p class="product-meta">Stock: ${ui.escapeHtml(String(product.stock))}</p>
            <button class="btn-add" data-id="${ui.escapeHtml(product.id)}" type="button">
              <i class="fas fa-cart-plus"></i> Agregar
            </button>
          </article>
        `;
      }).join("");
    }

    function renderCart() {
      const items = app.getCartItems();
      if (!items.length) {
        cartList.innerHTML = `
          <li class="empty-cart">
            <i class="fas fa-basket-shopping"></i>
            Aun no has agregado productos.
          </li>
        `;
        cartTotal.textContent = app.formatCurrency(0);
        return;
      }

      let total = 0;
      cartList.innerHTML = items.map(function (item) {
        total += item.lineTotal;
        return `
          <li class="cart-item">
            <div class="cart-item-info">
              <h4>${ui.escapeHtml(item.name)}</h4>
              <p>${app.formatCurrency(item.price)} c/u</p>
            </div>
            <div class="cart-controls">
              <button class="qty-btn" data-action="decrease" data-id="${ui.escapeHtml(item.productId)}" aria-label="Disminuir cantidad">
                <i class="fas fa-minus"></i>
              </button>
              <span class="qty">${ui.escapeHtml(String(item.quantity))}</span>
              <button class="qty-btn" data-action="increase" data-id="${ui.escapeHtml(item.productId)}" aria-label="Aumentar cantidad">
                <i class="fas fa-plus"></i>
              </button>
              <button class="remove-btn" data-action="remove" data-id="${ui.escapeHtml(item.productId)}" aria-label="Eliminar producto">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <strong class="subtotal">${app.formatCurrency(item.lineTotal)}</strong>
          </li>
        `;
      }).join("");
      cartTotal.textContent = app.formatCurrency(total);
    }

    productsGrid.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-id]");
      if (!button) {
        return;
      }
      const result = app.addToCart(button.dataset.id);
      renderCart();
      ui.setMessage(message, result.message, result.ok ? "success" : "error");
    });

    cartList.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-action]");
      if (!button) {
        return;
      }
      const id = button.dataset.id;
      const action = button.dataset.action;
      const item = app.getCartItems().find(function (line) {
        return line.productId === id;
      });
      if (!item) {
        return;
      }

      const nextQuantity = action === "increase"
        ? item.quantity + 1
        : action === "decrease"
          ? item.quantity - 1
          : 0;
      const result = app.updateCartQuantity(id, nextQuantity);
      renderCart();
      ui.setMessage(message, result.message, result.ok ? "success" : "error");
    });

    clearBtn.addEventListener("click", function () {
      app.clearCart();
      renderCart();
      ui.setMessage(message, "Carrito reiniciado.", "neutral");
    });

    checkoutBtn.addEventListener("click", function () {
      if (!app.getCartItems().length) {
        ui.setMessage(message, "No puedes continuar: el carrito esta vacio.", "error");
        return;
      }
      window.location.href = "Realizar compras.html";
    });

    renderProducts();
    renderCart();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
