(function () {
  function init() {
    const app = window.TechStoreApp;
    const ui = window.TechStoreUI;
    const form = document.getElementById("reportForm");
    const reportBody = document.getElementById("reportBody");
    const chartBars = document.getElementById("chartBars");
    const categoryList = document.getElementById("categoryList");
    const clientList = document.getElementById("clientList");
    const chartLegend = document.getElementById("chartLegend");
    const message = document.getElementById("message");
    const exportPdfBtn = document.getElementById("exportPdfBtn");
    const exportExcelBtn = document.getElementById("exportExcelBtn");
    const printBtn = document.getElementById("printBtn");
    if (!app || !ui || !form || !reportBody || !chartBars || !categoryList || !clientList || !chartLegend || !message || !exportPdfBtn || !exportExcelBtn || !printBtn) {
      return;
    }

    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");
    const reportType = document.getElementById("reportType");
    const statusFilter = document.getElementById("statusFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const clearBtn = document.getElementById("clearBtn");
    const statSales = document.getElementById("statSales");
    const statOrders = document.getElementById("statOrders");
    const statAverage = document.getElementById("statAverage");
    const statDelivered = document.getElementById("statDelivered");
    let filteredRows = [];

    function getRows() {
      return app.getOrders().map(function (order) {
        return {
          code: order.code,
          date: order.date,
          customer: order.customerName,
          category: app.getPrimaryCategory(order),
          categories: order.items.map(function (item) { return item.category; }),
          status: order.status,
          total: order.total
        };
      });
    }

    function formatMonth(monthKey) {
      const parts = monthKey.split("-");
      const date = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
      return new Intl.DateTimeFormat("es-CO", {
        month: "short",
        year: "2-digit"
      }).format(date);
    }

    function renderLegend() {
      if (reportType.value === "ventas") {
        chartLegend.textContent = "Comparativo mensual de ventas (COP)";
      } else if (reportType.value === "pedidos") {
        chartLegend.textContent = "Valor agrupado de pedidos por mes (COP)";
      } else {
        chartLegend.textContent = "Concentracion de compras por cliente y mes (COP)";
      }
    }

    function renderStats(list) {
      const sales = list.reduce(function (acc, row) { return acc + row.total; }, 0);
      const orders = list.length;
      const delivered = orders ? (list.filter(function (row) { return row.status === "entregado"; }).length / orders) * 100 : 0;
      statSales.textContent = app.formatCurrency(sales);
      statOrders.textContent = String(orders);
      statAverage.textContent = app.formatCurrency(orders ? sales / orders : 0);
      statDelivered.textContent = Math.round(delivered) + "%";
    }

    function renderTable(list) {
      if (!list.length) {
        reportBody.innerHTML = '<tr><td colspan="6" class="empty-row">Sin informacion para mostrar.</td></tr>';
        return;
      }

      reportBody.innerHTML = list.slice().sort(function (a, b) {
        return new Date(b.date + "T00:00:00") - new Date(a.date + "T00:00:00");
      }).map(function (row) {
        return `
          <tr>
            <td>${ui.escapeHtml(row.code)}</td>
            <td>${app.formatDate(row.date)}</td>
            <td>${ui.escapeHtml(row.customer)}</td>
            <td>${ui.escapeHtml(app.CATEGORY_NAMES[row.category] || row.category)}</td>
            <td><span class="status ${ui.statusClass(row.status)}">${ui.escapeHtml(row.status)}</span></td>
            <td>${app.formatCurrency(row.total)}</td>
          </tr>
        `;
      }).join("");
    }

    function renderChart(list) {
      if (!list.length) {
        chartBars.innerHTML = '<p class="empty-chart">Sin datos para la grafica.</p>';
        return;
      }

      const grouped = {};
      list.forEach(function (row) {
        const key = row.date.slice(0, 7);
        grouped[key] = (grouped[key] || 0) + row.total;
      });

      const points = Object.keys(grouped).sort();
      const maxValue = Math.max.apply(null, points.map(function (key) { return grouped[key]; }));
      chartBars.innerHTML = points.map(function (key) {
        const ratio = maxValue ? (grouped[key] / maxValue) * 100 : 0;
        return `
          <article class="bar-item">
            <div class="bar-value">${app.formatCurrency(grouped[key])}</div>
            <div class="bar-track">
              <div class="bar-fill" style="height:${Math.max(ratio, 8)}%"></div>
            </div>
            <span class="bar-label">${ui.escapeHtml(formatMonth(key))}</span>
          </article>
        `;
      }).join("");
    }

    function renderRankings(list) {
      if (!list.length) {
        categoryList.innerHTML = '<li class="empty-item">Sin categorias.</li>';
        clientList.innerHTML = '<li class="empty-item">Sin clientes.</li>';
        return;
      }

      const categories = {};
      const clients = {};
      list.forEach(function (row) {
        categories[row.category] = (categories[row.category] || 0) + row.total;
        clients[row.customer] = (clients[row.customer] || 0) + row.total;
      });

      const topCategories = Object.keys(categories).sort(function (a, b) {
        return categories[b] - categories[a];
      }).slice(0, 4);

      const topClients = Object.keys(clients).sort(function (a, b) {
        return clients[b] - clients[a];
      }).slice(0, 4);

      categoryList.innerHTML = topCategories.map(function (key) {
        return "<li><span>" + ui.escapeHtml(app.CATEGORY_NAMES[key] || key) + "</span><strong>" + app.formatCurrency(categories[key]) + "</strong></li>";
      }).join("");
      clientList.innerHTML = topClients.map(function (key) {
        return "<li><span>" + ui.escapeHtml(key) + "</span><strong>" + app.formatCurrency(clients[key]) + "</strong></li>";
      }).join("");
    }

    function downloadCsv(list) {
      const header = ["Codigo", "Fecha", "Cliente", "Categoria", "Estado", "Total"];
      const rows = list.map(function (row) {
        return [
          row.code,
          row.date,
          row.customer,
          app.CATEGORY_NAMES[row.category] || row.category,
          row.status,
          row.total
        ].join(",");
      });
      const blob = new Blob([[header.join(","), rows.join("\n")].join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "techstore-reporte.csv";
      link.click();
      URL.revokeObjectURL(url);
    }

    function openPrintableReport(list) {
      const popup = window.open("", "_blank");
      if (!popup) {
        ui.setMessage(message, "No fue posible abrir la ventana de impresion.", "error");
        return;
      }

      popup.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Reporte TechStore</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1d252c; }
            h1 { margin: 0 0 16px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #d8e0e8; padding: 10px; text-align: left; }
            th { background: #eef7f9; }
          </style>
        </head>
        <body>
          <h1>Reporte TechStore</h1>
          <p>Registros: ${list.length}</p>
          <table>
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Categoria</th>
                <th>Estado</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(function (row) {
                return `
                  <tr>
                    <td>${ui.escapeHtml(row.code)}</td>
                    <td>${ui.escapeHtml(app.formatDate(row.date))}</td>
                    <td>${ui.escapeHtml(row.customer)}</td>
                    <td>${ui.escapeHtml(app.CATEGORY_NAMES[row.category] || row.category)}</td>
                    <td>${ui.escapeHtml(row.status)}</td>
                    <td>${ui.escapeHtml(app.formatCurrency(row.total))}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </body>
        </html>
      `);
      popup.document.close();
      popup.focus();
      popup.print();
    }

    function applyFilters(showMessage) {
      const rows = getRows();
      const from = startDate.value ? new Date(startDate.value + "T00:00:00") : null;
      const to = endDate.value ? new Date(endDate.value + "T23:59:59") : null;
      const status = statusFilter.value;
      const category = categoryFilter.value;

      if (from && to && from > to) {
        ui.setMessage(message, "La fecha inicial no puede ser mayor a la fecha final.", "error");
        return;
      }

      filteredRows = rows.filter(function (row) {
        const rowDate = new Date(row.date + "T00:00:00");
        const inRange = (!from || rowDate >= from) && (!to || rowDate <= to);
        const matchesStatus = !status || row.status === status;
        const matchesCategory = !category || row.categories.indexOf(category) >= 0;
        return inRange && matchesStatus && matchesCategory;
      });

      renderStats(filteredRows);
      renderTable(filteredRows);
      renderChart(filteredRows);
      renderRankings(filteredRows);
      renderLegend();
      if (showMessage) {
        ui.setMessage(
          message,
          filteredRows.length ? "Reporte generado con " + filteredRows.length + " registro(s)." : "No hay datos para el filtro seleccionado.",
          filteredRows.length ? "success" : "error"
        );
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      applyFilters(true);
    });

    clearBtn.addEventListener("click", function () {
      form.reset();
      applyFilters(false);
      ui.setMessage(message, "Filtros reiniciados. Reporte completo cargado.", "neutral");
    });

    exportExcelBtn.addEventListener("click", function () {
      downloadCsv(filteredRows);
      ui.setMessage(message, "Reporte CSV exportado correctamente.", "success");
    });

    exportPdfBtn.addEventListener("click", function () {
      openPrintableReport(filteredRows);
      ui.setMessage(message, "Se abrio la vista para exportar o imprimir en PDF.", "success");
    });

    printBtn.addEventListener("click", function () {
      window.print();
      ui.setMessage(message, "Preparando vista de impresion.", "neutral");
    });

    applyFilters(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
