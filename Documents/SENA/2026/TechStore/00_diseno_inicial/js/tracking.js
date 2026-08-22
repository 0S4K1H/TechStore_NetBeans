(function () {
  function init() {
    const app = window.TechStoreApp;
    const ui = window.TechStoreUI;
    const form = document.getElementById("trackingForm");
    const message = document.getElementById("message");
    const orderCodeInput = document.getElementById("orderCode");
    const simulateBtn = document.getElementById("simulateBtn");
    const infoOrderCode = document.getElementById("infoOrderCode");
    const infoCustomer = document.getElementById("infoCustomer");
    const infoDate = document.getElementById("infoDate");
    const infoEta = document.getElementById("infoEta");
    const infoCarrier = document.getElementById("infoCarrier");
    const infoTotal = document.getElementById("infoTotal");
    const itemsList = document.getElementById("itemsList");
    const timeline = document.getElementById("timeline");
    const progressFill = document.getElementById("progressFill");
    const stepElements = Array.from(document.querySelectorAll(".step"));
    if (!app || !ui || !form || !message || !orderCodeInput || !simulateBtn || !infoOrderCode || !infoCustomer || !infoDate || !infoEta || !infoCarrier || !infoTotal || !itemsList || !timeline || !progressFill || !stepElements.length) {
      return;
    }

    let currentOrderCode = "";

    function clearOrder() {
      infoOrderCode.textContent = "-";
      infoCustomer.textContent = "-";
      infoDate.textContent = "-";
      infoEta.textContent = "-";
      infoCarrier.textContent = "-";
      infoTotal.textContent = "-";
      itemsList.innerHTML = '<li class="empty-state">Sin productos para mostrar.</li>';
      timeline.innerHTML = '<li class="empty-state">Sin datos de seguimiento.</li>';
      updateProgress(-1);
    }

    function updateProgress(step) {
      stepElements.forEach(function (stepElement) {
        const currentStep = Number(stepElement.dataset.step);
        stepElement.classList.remove("active");
        stepElement.classList.remove("complete");
        if (step >= 0 && currentStep < step) {
          stepElement.classList.add("complete");
        }
        if (currentStep === step) {
          stepElement.classList.add("active");
        }
      });

      if (step < 0) {
        progressFill.style.width = "0%";
        return;
      }

      progressFill.style.width = ((step / Math.max(stepElements.length - 1, 1)) * 100) + "%";
    }

    function renderOrder(order) {
      infoOrderCode.textContent = order.code;
      infoCustomer.textContent = order.customerName;
      infoDate.textContent = app.formatDate(order.date);
      infoEta.textContent = app.formatDate(order.eta);
      infoCarrier.textContent = order.carrier;
      infoTotal.textContent = app.formatCurrency(order.total);

      itemsList.innerHTML = order.items.map(function (item) {
        return `
          <li class="item-card">
            <div>
              <h4>${ui.escapeHtml(item.name)}</h4>
              <p>Cantidad: ${ui.escapeHtml(String(item.qty))}</p>
            </div>
            <strong>${app.formatCurrency(item.price * item.qty)}</strong>
          </li>
        `;
      }).join("");

      timeline.innerHTML = order.timeline.slice().reverse().map(function (entry) {
        return `
          <li class="timeline-item">
            <span class="time">${ui.escapeHtml(app.formatDateTime(entry.time))}</span>
            <p>${ui.escapeHtml(entry.text)}</p>
          </li>
        `;
      }).join("");

      updateProgress(app.getOrderProgress(order.status));
    }

    function searchOrder() {
      const code = String(orderCodeInput.value || "").trim().toUpperCase();
      if (!code) {
        ui.setMessage(message, "Ingresa un codigo de pedido para consultar.", "error");
        return;
      }

      const order = app.getOrderByCode(code);
      if (!order) {
        currentOrderCode = "";
        clearOrder();
        ui.setMessage(message, "Pedido no encontrado.", "error");
        return;
      }

      currentOrderCode = code;
      renderOrder(order);
      ui.setMessage(message, "Pedido consultado correctamente.", "success");
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      searchOrder();
    });

    simulateBtn.addEventListener("click", function () {
      if (!currentOrderCode) {
        ui.setMessage(message, "Primero consulta un pedido para simular su avance.", "error");
        return;
      }
      const result = app.advanceOrderStatus(currentOrderCode);
      if (!result.ok) {
        ui.setMessage(message, result.message, "error");
        return;
      }
      renderOrder(result.order);
      ui.setMessage(message, result.message, "success");
    });

    const params = new URLSearchParams(window.location.search);
    const codeFromQuery = params.get("order") || app.getSession().lastOrderCode;
    if (codeFromQuery) {
      orderCodeInput.value = codeFromQuery;
      searchOrder();
    } else {
      clearOrder();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
