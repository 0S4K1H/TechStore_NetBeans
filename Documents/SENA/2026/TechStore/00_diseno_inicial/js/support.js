(function () {
  function init() {
    const app = window.TechStoreApp;
    const ui = window.TechStoreUI;
    const chatMessages = document.getElementById("chatMessages");
    const chatForm = document.getElementById("chatForm");
    const messageInput = document.getElementById("messageInput");
    const statusMessage = document.getElementById("statusMessage");
    const ticketBtn = document.getElementById("ticketBtn");
    const closeChatBtn = document.getElementById("closeChatBtn");
    if (!app || !ui || !chatMessages || !chatForm || !messageInput || !statusMessage || !ticketBtn || !closeChatBtn) {
      return;
    }

    const quickButtons = document.querySelectorAll(".quick-btn");
    let chatClosed = false;
    let lastUserMessage = "";

    function scrollToBottom() {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function createMessageElement(text, type) {
      const article = document.createElement("article");
      article.className = "message " + type;
      const bubble = document.createElement("div");
      bubble.className = "bubble";
      bubble.textContent = text;
      const time = document.createElement("span");
      time.className = "time";
      time.textContent = new Date().toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit"
      });
      article.appendChild(bubble);
      article.appendChild(time);
      return article;
    }

    function addMessage(text, type) {
      chatMessages.appendChild(createMessageElement(text, type));
      scrollToBottom();
    }

    function showTyping() {
      const typing = document.createElement("article");
      typing.id = "typingMessage";
      typing.className = "message bot typing";
      typing.innerHTML = `
        <div class="bubble">
          <span></span><span></span><span></span>
        </div>
        <span class="time">Asesor escribiendo...</span>
      `;
      chatMessages.appendChild(typing);
      scrollToBottom();
    }

    function removeTyping() {
      const typing = document.getElementById("typingMessage");
      if (typing) {
        typing.remove();
      }
    }

    function getLatestOrder() {
      return app.getOrdersForCurrentUser()[0] || null;
    }

    function getBotResponse(text) {
      const lower = String(text || "").toLowerCase();
      const orderCodeMatch = lower.match(/ts-\d{6}/i);
      if (orderCodeMatch) {
        const order = app.getOrderByCode(orderCodeMatch[0].toUpperCase());
        if (order) {
          return "El pedido " + order.code + " se encuentra " + app.getDisplayStatus(order.status) + ". Puedes revisarlo en Seguimiento.";
        }
      }

      if (lower.includes("pedido") || lower.includes("orden") || lower.includes("envio")) {
        const latestOrder = getLatestOrder();
        if (latestOrder) {
          return "Tu pedido mas reciente es " + latestOrder.code + " y esta " + app.getDisplayStatus(latestOrder.status) + ".";
        }
        return "Puedes revisar tu estado en el modulo de Seguimiento de pedidos con tu codigo TS-xxxxxx.";
      }
      if (lower.includes("pago") || lower.includes("tarjeta") || lower.includes("transferencia")) {
        return "Aceptamos tarjeta debito o credito, transferencia, billetera digital y contraentrega.";
      }
      if (lower.includes("garantia")) {
        return "La garantia depende del producto y del proveedor. La referencia general es de 6 a 12 meses.";
      }
      if (lower.includes("devolucion") || lower.includes("cambio")) {
        return "Podemos crear un ticket para devolucion y asociarlo a tu pedido.";
      }
      if (lower.includes("soporte") || lower.includes("tecnico")) {
        return "Para soporte tecnico, comparte marca, modelo y la falla para guiarte paso a paso.";
      }
      if (lower.includes("hola") || lower.includes("buenas")) {
        return "Hola. Soy el asistente virtual de TechStore. Cuentame en que te ayudo.";
      }
      return "Recibimos tu mensaje. Si lo prefieres, puedo dejar un ticket para seguimiento.";
    }

    function sendUserMessage() {
      if (chatClosed) {
        ui.setMessage(statusMessage, "El chat esta finalizado. Abre una nueva sesion para continuar.", "error");
        return;
      }

      const text = String(messageInput.value || "").trim();
      if (!text) {
        ui.setMessage(statusMessage, "Escribe un mensaje para enviarlo.", "error");
        return;
      }

      lastUserMessage = text;
      addMessage(text, "user");
      messageInput.value = "";
      ui.setMessage(statusMessage, "Mensaje enviado. Esperando respuesta...", "neutral");

      showTyping();
      window.setTimeout(function () {
        removeTyping();
        addMessage(getBotResponse(text), "bot");
        ui.setMessage(statusMessage, "Asesor virtual respondio tu consulta.", "success");
      }, 850);
    }

    chatForm.addEventListener("submit", function (event) {
      event.preventDefault();
      sendUserMessage();
    });

    quickButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (chatClosed) {
          ui.setMessage(statusMessage, "El chat esta finalizado. Abre una nueva sesion para continuar.", "error");
          return;
        }
        messageInput.value = button.dataset.question || "";
        sendUserMessage();
      });
    });

    ticketBtn.addEventListener("click", function () {
      const ticket = app.createSupportTicket({
        subject: "Caso creado desde chat",
        message: lastUserMessage || "Ticket generado sin detalle adicional."
      });
      if (!ticket.ok) {
        ui.setMessage(statusMessage, ticket.message, "error");
        return;
      }
      addMessage("Se genero tu ticket " + ticket.ticket.code + ". Un agente humano te contactara pronto.", "bot");
      ui.setMessage(statusMessage, "Ticket creado correctamente: " + ticket.ticket.code + ".", "success");
    });

    closeChatBtn.addEventListener("click", function () {
      if (chatClosed) {
        ui.setMessage(statusMessage, "El chat ya se encuentra finalizado.", "neutral");
        return;
      }
      chatClosed = true;
      messageInput.disabled = true;
      addMessage("Chat finalizado. Gracias por comunicarte con TechStore.", "bot");
      ui.setMessage(statusMessage, "Sesion de soporte finalizada.", "neutral");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
