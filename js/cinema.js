/* Transições ao rolar: revelação das seções, parallax lento nas fotos grandes e título do topo que se recolhe.
   Só usa transform/opacity. Desligado com prefers-reduced-motion. Sem JS, o conteúdo fica visível. */
(function () {
  "use strict";
  var raiz = document.documentElement;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  raiz.classList.add("js-anim");

  var alvos = document.querySelectorAll(
    ".cabecalho, .grade, .faixa, .etapa, .destaque-conteudo, .historia-texto, .campeche-texto, .chamada .wrap"
  );
  var io = new IntersectionObserver(function (itens) {
    itens.forEach(function (i) {
      if (i.isIntersecting) { i.target.classList.add("cinema-in"); io.unobserve(i.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
  alvos.forEach(function (el) { el.classList.add("cinema"); io.observe(el); });

  /* Com scroll-driven animations (CSS) o navegador cuida do parallax; senão, faz aqui. */
  if (window.CSS && CSS.supports && CSS.supports("animation-timeline: view()")) return;

  var fotos = [].slice.call(document.querySelectorAll("#destaque-foto, #campeche-foto"));
  var hero = document.querySelector(".hero");
  var conteudo = document.querySelector(".hero-conteudo");
  var visiveis = new Set();
  var agendado = false;
  var vh = innerHeight;

  var ioFotos = new IntersectionObserver(function (itens) {
    itens.forEach(function (i) { i.isIntersecting ? visiveis.add(i.target) : visiveis.delete(i.target); });
    pedir();
  }, { rootMargin: "10% 0px" });
  fotos.forEach(function (f) { ioFotos.observe(f.parentNode); });

  function quadro() {
    agendado = false;
    var leituras = [];
    visiveis.forEach(function (secao) {
      var r = secao.getBoundingClientRect();
      var p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      leituras.push([secao, Math.max(-1, Math.min(1, p))]);
    });
    var h = 0;
    if (hero) h = Math.max(0, Math.min(1, scrollY / (hero.offsetHeight * 0.6)));
    leituras.forEach(function (l) { l[0].style.setProperty("--p", l[1].toFixed(3)); });
    if (conteudo) conteudo.style.setProperty("--h", h.toFixed(3));
  }
  function pedir() { if (!agendado) { agendado = true; requestAnimationFrame(quadro); } }
  addEventListener("scroll", pedir, { passive: true });
  addEventListener("resize", function () { vh = innerHeight; pedir(); });
  pedir();
})();
