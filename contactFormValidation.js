document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const successEl = document.getElementById("form-success");

  function clearErrors() {
    form.querySelectorAll(".error-message").forEach(el => el.remove());
    [nameInput, emailInput, messageInput].forEach(input => {
      if (!input) return;
      input.classList.remove("input-error");
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    });
    if (successEl) {
      successEl.hidden = true;
      successEl.textContent = "";
    }
  }

  function showError(input, message) {
    if (!input) return;
    input.classList.add("input-error");
    input.setAttribute("aria-invalid", "true");
    const id = input.id ? `${input.id}-error` : `err-${Math.random().toString(36).slice(2)}`;

    // Remove existing message if present
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const err = document.createElement("div");
    err.className = "error-message";
    err.id = id;
    err.textContent = message;

    // place after the input
    input.setAttribute("aria-describedby", id);
    input.insertAdjacentElement("afterend", err);
  }

  function isEmailValid(email) {
    // Simple email regex (sufficient for client-side validation)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const message = messageInput ? messageInput.value.trim() : "";

    const errors = [];

    if (!name) {
      errors.push({ field: nameInput, msg: "Please enter your name." });
    }

    if (!email) {
      errors.push({ field: emailInput, msg: "Please enter your email address." });
    } else if (!isEmailValid(email)) {
      errors.push({ field: emailInput, msg: "Please enter a valid email address." });
    }

    if (!message) {
      errors.push({ field: messageInput, msg: "Please enter a message." });
    } else if (message.length < 10) {
      errors.push({ field: messageInput, msg: "Message should be at least 10 characters." });
    }

    if (errors.length) {
      // Show all errors and focus first invalid
      errors.forEach(err => showError(err.field, err.msg));
      if (errors[0] && errors[0].field && typeof errors[0].field.focus === 'function') {
        errors[0].field.focus();
      }
      return;
    }

    // No errors — show success message and optionally clear form
    if (successEl) {
      successEl.textContent = "Thanks — your message looks good!";
      successEl.hidden = false;
    } else {
      // Fallback: simple alert
      alert("Thanks — your message looks good! ");
    }

    // Optionally clear the form
    form.reset();
  });

  // Remove error on input
  [nameInput, emailInput, messageInput].forEach(input => {
    if (!input) return;
    input.addEventListener("input", () => {
      const errId = `${input.id}-error`;
      const existing = document.getElementById(errId);
      if (existing) existing.remove();
      input.classList.remove("input-error");
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    });
  });
});
