// E-mail de destino do formulário de contato — ajuste para o endereço correto da KLIT.
const CONTACT_EMAIL = "contato@klit.com.br";

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

  // Formulário de contato (sem backend: abre o cliente de e-mail com os dados preenchidos)
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const comment = document.getElementById("comment").value.trim();

    const subject = encodeURIComponent("Contato pelo site - " + name);
    const body = encodeURIComponent(
      "Nome: " + name + "\nE-mail: " + email + "\n\nMensagem:\n" + comment
    );

    window.location.href =
      "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
  });
});
