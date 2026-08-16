/* =========================================================
   Katare Krishi Vikas Kendra — script.js
   Vanilla JS: nav, reveal animation, product filter,
   contact form validation + WhatsApp enquiry
   ========================================================= */

const SHOP_PHONE = "919425496757"; // used for wa.me links (no + or spaces)

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initRevealAnimation();
  initScrollTop();
  initProductFilter();
  initEnquireButtons();
  initContactForm();
});

/* ---------- Mobile navigation ---------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when a link is clicked (mobile)
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Scroll reveal ---------- */
function initRevealAnimation() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------- Scroll to top button ---------- */
function initScrollTop() {
  const btn = document.querySelector(".scroll-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 480) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Products page: category filter ---------- */
function initProductFilter() {
  const tabs = document.querySelectorAll(".tab-btn");
  const blocks = document.querySelectorAll(".category-block");
  if (!tabs.length || !blocks.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.dataset.category;

      if (target === "all") {
        blocks.forEach((b) => (b.style.display = ""));
      } else {
        blocks.forEach((b) => {
          b.style.display = b.dataset.category === target ? "" : "none";
        });
      }

      // Scroll the visible section into view on mobile for clarity
      if (target !== "all") {
        const visible = document.querySelector(
          `.category-block[data-category="${target}"]`
        );
        if (visible) {
          visible.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
}

/* ---------- "Enquire Now" buttons -> WhatsApp with pre-filled message ---------- */
function initEnquireButtons() {
  document.querySelectorAll("[data-enquire-category]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const category = btn.dataset.enquireCategory;
      const message = `Hello, I would like to enquire about ${category} products available at Katare Krishi Vikas Kendra.`;
      const url = `https://wa.me/${SHOP_PHONE}?text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank", "noopener");
    });
  });
}

/* ---------- Contact form validation + WhatsApp submit ---------- */
function initContactForm() {
  const form = document.getElementById("enquiry-form");
  if (!form) return;

  const nameField = form.querySelector("#field-name");
  const phoneField = form.querySelector("#field-phone");
  const categoryField = form.querySelector("#field-category");
  const messageField = form.querySelector("#field-message");
  const formMsg = form.querySelector(".form-msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    isValid = validateField(nameField, (v) => v.trim().length > 1, "Please enter your name.") && isValid;
    isValid = validateField(
      phoneField,
      (v) => /^[0-9+\-\s]{7,15}$/.test(v.trim()),
      "Please enter a valid phone number."
    ) && isValid;
    isValid = validateField(
      messageField,
      (v) => v.trim().length > 3,
      "Please tell us what you need."
    ) && isValid;

    if (!isValid) {
      showFormMessage(
        formMsg,
        "Please fix the highlighted fields before sending your enquiry.",
        "error"
      );
      return;
    }

    const name = nameField.value.trim();
    const phone = phoneField.value.trim();
    const category = categoryField ? categoryField.value : "";
    const message = messageField.value.trim();

    const lines = [
      "Hello, I would like to enquire about products at Katare Krishi Vikas Kendra.",
      `Name: ${name}`,
      `Phone: ${phone}`,
    ];
    if (category) lines.push(`Product Category: ${category}`);
    lines.push(`Message: ${message}`);

    const waMessage = lines.join("\n");
    const url = `https://wa.me/${SHOP_PHONE}?text=${encodeURIComponent(
      waMessage
    )}`;

    showFormMessage(
      formMsg,
      "Thank you! Opening WhatsApp so you can send your enquiry directly to the shop.",
      "success"
    );

    window.open(url, "_blank", "noopener");
    form.reset();
  });

  // Live-clear error state on input
  [nameField, phoneField, messageField].forEach((field) => {
    if (!field) return;
    field.addEventListener("input", () => {
      field.classList.remove("invalid");
      const errorEl = field.parentElement.querySelector(".field-error");
      if (errorEl) errorEl.classList.remove("show");
    });
  });
}

function validateField(field, testFn, errorText) {
  if (!field) return true;
  const errorEl = field.parentElement.querySelector(".field-error");
  const value = field.value || "";

  if (!testFn(value)) {
    field.classList.add("invalid");
    if (errorEl) {
      errorEl.textContent = errorText;
      errorEl.classList.add("show");
    }
    return false;
  }

  field.classList.remove("invalid");
  if (errorEl) errorEl.classList.remove("show");
  return true;
}

function showFormMessage(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = `form-msg show ${type}`;
}
