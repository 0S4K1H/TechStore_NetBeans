(function () {
  function init() {
    const app = window.TechStoreApp;
    const ui = window.TechStoreUI;
    const form = document.getElementById("loginForm");
    const userField = document.getElementById("username");
    const passwordField = document.getElementById("password");
    const message = document.getElementById("message");
    const toggleButton = document.querySelector(".toggle-password");
    const toggleIcon = toggleButton ? toggleButton.querySelector("i") : null;
    if (!app || !ui || !form || !userField || !passwordField) {
      return;
    }

    const forgotLink = document.querySelector(".forgot");
    if (forgotLink) {
      forgotLink.href = "Chat de soporte.html";
    }

    const session = app.getSession();
    ui.setMessage(
      message,
      "Sesion actual: " + session.name + ". Usa cliente, empleado o admin con clave 12345.",
      "neutral"
    );

    window.togglePassword = function () {
      if (!toggleButton || !toggleIcon) {
        return;
      }
      if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
        toggleButton.setAttribute("aria-label", "Ocultar contrasena");
        toggleButton.setAttribute("aria-pressed", "true");
      } else {
        passwordField.type = "password";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
        toggleButton.setAttribute("aria-label", "Mostrar contrasena");
        toggleButton.setAttribute("aria-pressed", "false");
      }
    };

    if (toggleButton) {
      toggleButton.addEventListener("click", window.togglePassword);
    }

    window.clearForm = function () {
      form.reset();
      passwordField.type = "password";
      if (toggleIcon) {
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
      }
      if (toggleButton) {
        toggleButton.setAttribute("aria-label", "Mostrar contrasena");
        toggleButton.setAttribute("aria-pressed", "false");
      }
      ui.setMessage(message, "Formulario reiniciado.", "neutral");
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const result = app.login(userField.value, passwordField.value);
      if (!result.ok) {
        ui.setMessage(message, result.message, "error");
        document.querySelectorAll(".input-group").forEach(function (group) {
          group.style.borderColor = "#e74c3c";
          group.style.boxShadow = "0 0 8px rgba(231, 76, 60, 0.3)";
        });
        window.setTimeout(function () {
          document.querySelectorAll(".input-group").forEach(function (group) {
            group.style.borderColor = "#d6eaf8";
            group.style.boxShadow = "none";
          });
        }, 1600);
        return;
      }

      ui.setMessage(message, result.message + " Redirigiendo...", "success");
      const role = result.session.role;
      const nextPage = role === "administrador"
        ? "Gestion de inventario.html"
        : role === "empleado"
          ? "Gestion de pedidos.html"
          : "Buscar productos.html";
      window.setTimeout(function () {
        window.location.href = nextPage;
      }, 900);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
