(function () {
  function init() {
    const app = window.TechStoreApp;
    const ui = window.TechStoreUI;
    const form = document.getElementById("checkoutForm");
    const itemsList = document.getElementById("itemsList");
    const subtotalValue = document.getElementById("subtotalValue");
    const shippingValue = document.getElementById("shippingValue");
    const discountValue = document.getElementById("discountValue");
    const totalValue = document.getElementById("totalValue");
    const couponInput = document.getElementById("coupon");
    const applyCouponBtn = document.getElementById("applyCouponBtn");
    const clearBtn = document.getElementById("clearBtn");
    const message = document.getElementById("message");
    if (!app || !ui || !form || !itemsList || !subtotalValue || !shippingValue || !discountValue || !totalValue || !couponInput || !applyCouponBtn || !clearBtn || !message) {
      return;
    }

    const session = app.getSession();
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const paymentMethod = document.getElementById("paymentMethod");
    const note = document.getElementById("note");
    let activeCoupon = "";

    if (fullName && !fullName.value) {
      fullName.value = session.name || "";
    }
    if (email && !email.value) {
      email.value = session.email || "";
    }
    if (city && !city.value) {
      city.value = session.city || "";
    }

    function renderSummary() {
      const summary = app.calculateCartSummary(activeCoupon);
      if (!summary.items.length) {
        itemsList.innerHTML = '<li class="item"><div><h4>Carrito vacio</h4><p>Agrega productos antes de finalizar tu compra.</p></div><strong>$0</strong></li>';
      } else {
        itemsList.innerHTML = summary.items.map(function (item) {
          return `
            <li class="item">
              <div>
                <h4>${ui.escapeHtml(item.name)}</h4>
                <p>Cantidad: ${ui.escapeHtml(String(item.quantity))}</p>
              </div>
              <strong>${app.formatCurrency(item.lineTotal)}</strong>
            </li>
          `;
        }).join("");
      }

      subtotalValue.textContent = app.formatCurrency(summary.subtotal);
      shippingValue.textContent = app.formatCurrency(summary.shipping);
      discountValue.textContent = "-" + app.formatCurrency(summary.discount);
      totalValue.textContent = app.formatCurrency(summary.total);
      return summary;
    }

    applyCouponBtn.addEventListener("click", function () {
      const code = String(couponInput.value || "").trim().toUpperCase();
      if (!code) {
        activeCoupon = "";
        renderSummary();
        ui.setMessage(message, "Ingresa un codigo de cupon para aplicar descuento.", "neutral");
        return;
      }

      const summary = app.calculateCartSummary(code);
      if (!summary.couponValid) {
        activeCoupon = "";
        renderSummary();
        ui.setMessage(message, "Cupon invalido. Usa TECH10 o ENVIO0 como codigos habilitados.", "error");
        return;
      }

      activeCoupon = code;
      renderSummary();
      ui.setMessage(message, "Cupon aplicado correctamente.", "success");
    });

    clearBtn.addEventListener("click", function () {
      form.reset();
      activeCoupon = "";
      if (fullName) {
        fullName.value = session.name || "";
      }
      if (email) {
        email.value = session.email || "";
      }
      if (city) {
        city.value = session.city || "";
      }
      renderSummary();
      ui.setMessage(message, "Formulario reiniciado.", "neutral");
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const summary = app.calculateCartSummary(activeCoupon);
      if (!summary.items.length) {
        ui.setMessage(message, "No puedes registrar una compra con el carrito vacio.", "error");
        return;
      }

      const result = app.placeOrder({
        fullName: fullName.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
        city: city.value,
        paymentMethod: paymentMethod.value,
        note: note.value,
        couponCode: activeCoupon
      });

      if (!result.ok) {
        ui.setMessage(message, result.message, "error");
        return;
      }

      ui.setMessage(message, "Compra registrada con exito. Numero de orden: " + result.order.code + ".", "success");
      renderSummary();
      window.setTimeout(function () {
        window.location.href = "Seguimiento de pedidos.html?order=" + encodeURIComponent(result.order.code);
      }, 1100);
    });

    renderSummary();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
