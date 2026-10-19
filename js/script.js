document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Menu mobile
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  mainNav.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Hero slider
  const slides = document.querySelectorAll(".hero-slide");
  const dotsWrap = document.getElementById("heroDots");
  let current = 0;
  let timer;

  slides.forEach(function (_, i) {
    const dot = document.createElement("button");
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", function () {
      goToSlide(i);
      restartTimer();
    });
    dotsWrap.appendChild(dot);
  });

  function goToSlide(index) {
    slides[current].classList.remove("is-active");
    dotsWrap.children[current].classList.remove("is-active");
    current = index;
    slides[current].classList.add("is-active");
    dotsWrap.children[current].classList.add("is-active");
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function restartTimer() {
    clearInterval(timer);
    timer = setInterval(nextSlide, 6000);
  }

  if (slides.length > 1) restartTimer();

  // Botão voltar ao topo
  const scrollTopBtn = document.getElementById("scrollTop");
  window.addEventListener("scroll", function () {
    scrollTopBtn.classList.toggle("is-visible", window.scrollY > 400);
  });

  // Formulário de contato: envia via Web3Forms (api.web3forms.com), sem backend próprio
  // e sem abrir app externo — funciona em hospedagem 100% estática (GitHub Pages).
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");
  const submitBtn = form.querySelector(".btn-submit");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    feedback.textContent = "Enviando...";
    feedback.className = "form-feedback";
    submitBtn.disabled = true;

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then(function (response) {
        return response.json().catch(function () {
          throw new Error("Resposta inválida do servidor.");
        });
      })
      .then(function (data) {
        feedback.textContent = data.success
          ? "Mensagem enviada com sucesso!"
          : data.message || "Não foi possível enviar sua mensagem.";
        feedback.className = "form-feedback " + (data.success ? "is-success" : "is-error");
        if (data.success) form.reset();
      })
      .catch(function () {
        feedback.textContent = "Não foi possível enviar sua mensagem. Tente novamente mais tarde.";
        feedback.className = "form-feedback is-error";
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
});
