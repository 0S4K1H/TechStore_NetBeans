(function () {
  function init() {
    const app = window.TechStoreApp;
    const ui = window.TechStoreUI;
    const sessionBox = document.getElementById("homeSession");
    const statsBox = document.getElementById("dashboardStats");
    if (!app || !ui || !sessionBox || !statsBox) {
      return;
    }

    const session = app.getSession();
    const tickets = app.getSupportTickets();
    const myOrders = app.getOrdersForCurrentUser();
    const metrics = app.getInventoryMetrics();
    const roleLabel = session.role === "administrador"
      ? "Propietario y administrador"
      : session.role === "empleado"
        ? "Equipo TechStore"
        : "Cliente registrado";
    const roleSummary = session.role === "administrador"
      ? "Control total sobre inventario, pedidos, soporte y reportes."
      : session.role === "empleado"
        ? "Prioriza operaciones, avances logistico y atencion al cliente."
        : "Explora catalogo, compras y seguimiento desde una sola vista.";

    sessionBox.innerHTML = `
      <article class="dashboard-badge">
        <span>Perfil activo</span>
        <strong>${ui.escapeHtml(session.name)}</strong>
        <p>${ui.escapeHtml(roleLabel)}</p>
        <small>${ui.escapeHtml(roleSummary)}</small>
      </article>
    `;

    statsBox.innerHTML = [
      {
        label: "Catalogo activo",
        value: String(app.getAvailableProducts().length),
        hint: "Productos disponibles para compra inmediata.",
        icon: "fa-box-open"
      },
      {
        label: "Pedidos visibles",
        value: String(myOrders.length),
        hint: "Ordenes que puedes consultar o gestionar ahora.",
        icon: "fa-truck-fast"
      },
      {
        label: "Tickets abiertos",
        value: String(tickets.filter(function (ticket) { return ticket.status === "abierto"; }).length),
        hint: "Conversaciones activas que requieren seguimiento.",
        icon: "fa-headset"
      },
      {
        label: "Riesgos de stock",
        value: String(metrics.lowStock + metrics.outStock),
        hint: "Productos con alerta por bajo inventario o agotados.",
        icon: "fa-triangle-exclamation"
      }
    ].map(function (stat) {
      return `
        <article class="dashboard-stat">
          <span class="dashboard-stat__icon">
            <i class="fas ${ui.escapeHtml(stat.icon)}" aria-hidden="true"></i>
          </span>
          <div class="dashboard-stat__copy">
            <span class="dashboard-stat__label">${ui.escapeHtml(stat.label)}</span>
            <strong>${ui.escapeHtml(stat.value)}</strong>
            <p>${ui.escapeHtml(stat.hint)}</p>
          </div>
        </article>
      `;
    }).join("");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
