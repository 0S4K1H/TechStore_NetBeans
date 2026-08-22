(function () {
  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function setMessage(element, text, tone) {
    if (!element) {
      return;
    }
    const resolvedTone = tone || "neutral";
    element.setAttribute("data-tone", resolvedTone);
    element.setAttribute("role", resolvedTone === "error" ? "alert" : "status");
    element.setAttribute("aria-live", resolvedTone === "error" ? "assertive" : "polite");
    element.textContent = text;
  }

  function statusClass(status) {
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
    return "pending";
  }

  function priorityClass(priority) {
    if (priority === "alta") {
      return "high";
    }
    if (priority === "media") {
      return "medium";
    }
    return "low";
  }

  function primeMessages() {
    document.querySelectorAll("#message, #statusMessage").forEach(function (element) {
      if (!element.hasAttribute("data-tone")) {
        element.setAttribute("data-tone", "neutral");
      }
      if (!element.hasAttribute("role")) {
        element.setAttribute("role", "status");
      }
      if (!element.hasAttribute("aria-live")) {
        element.setAttribute("aria-live", "polite");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", primeMessages);
  } else {
    primeMessages();
  }

  window.TechStoreUI = {
    escapeHtml: escapeHtml,
    setMessage: setMessage,
    statusClass: statusClass,
    priorityClass: priorityClass
  };
})();
