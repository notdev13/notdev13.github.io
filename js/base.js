// Site da MB2 · o que toda página tem: menu, tema claro/escuro e os botões de WhatsApp.
// Carregar depois de js/i18n.js e antes do script da página (site.js, obra.js, terreno.js).
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // Textos montados por JS passam pela tradução (js/i18n.js); sem ela, fica o português
  const tr = (chave, pt) => (window.MB2_I18N ? window.MB2_I18N.t(chave) : pt);
  const pendente = () => `<span class="pendente">${tr("pendente", "a confirmar")}</span>`;

  // ---------- Menu ----------
  const topo = $(".topo"), menuBtn = $("#menu-btn"), menuMovel = $("#menu-movel");
  function abrirMenu(abre) {
    menuMovel.hidden = !abre;
    topo.classList.toggle("aberto", abre);
    menuBtn.setAttribute("aria-expanded", String(abre));
    menuBtn.setAttribute("aria-label", abre ? tr("nav.fecharMenu", "Fechar menu") : tr("nav.abrirMenu", "Abrir menu"));
    document.body.style.overflow = abre ? "hidden" : "";
    topo.classList.toggle("no-topo", !abre && scrollY < 10 && !document.body.classList.contains("pagina-interna"));
  }
  menuBtn.addEventListener("click", () => abrirMenu(menuMovel.hidden));
  menuMovel.addEventListener("click", (e) => { if (e.target.closest("a")) abrirMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !menuMovel.hidden) abrirMenu(false); });

  // ---------- Tema claro / escuro ----------
  const temaBtn = $("#tema-btn"), raiz = document.documentElement;
  function rotuloTema() {
    const escuro = raiz.getAttribute("data-theme") === "dark";
    temaBtn.setAttribute("aria-pressed", String(escuro));
    temaBtn.setAttribute("aria-label", escuro ? tr("tema.claro", "Ativar tema claro") : tr("tema.escuro", "Ativar tema escuro"));
  }
  temaBtn.addEventListener("click", () => {
    const escuro = raiz.getAttribute("data-theme") !== "dark";
    if (escuro) raiz.setAttribute("data-theme", "dark"); else raiz.removeAttribute("data-theme");
    rotuloTema();
  });
  rotuloTema();

  document.addEventListener("mb2:lang", () => {
    rotuloTema();
    menuBtn.setAttribute("aria-label", menuMovel.hidden ? tr("nav.abrirMenu", "Abrir menu") : tr("nav.fecharMenu", "Fechar menu"));
  });
  menuBtn.setAttribute("aria-label", tr("nav.abrirMenu", "Abrir menu"));

  // No alto da página inicial o menu fica sem fundo; rolando, encolhe. Some ao descer e volta ao subir.
  // Nas páginas internas (obra, terreno) ele já começa com fundo.
  const interna = document.body.classList.contains("pagina-interna");
  let aguardando = false, ultimoY = scrollY;
  function aoRolar() {
    aguardando = false;
    const y = scrollY, aberto = !menuMovel.hidden;
    topo.classList.toggle("no-topo", y < 10 && !aberto && !interna);
    topo.classList.toggle("compacto", y > 80);
    if (Math.abs(y - ultimoY) > 6) {
      topo.classList.toggle("escondido", y > ultimoY && y > 200 && !aberto && !topo.contains(document.activeElement));
      ultimoY = y;
    }
  }
  addEventListener("scroll", () => { if (!aguardando) { aguardando = true; requestAnimationFrame(aoRolar); } }, { passive: true });
  topo.addEventListener("focusin", () => topo.classList.remove("escondido"));
  aoRolar();

  // O item da seção que está na tela fica em cobre (só faz sentido na página inicial)
  const itensNav = $$(".nav a").filter((a) => a.getAttribute("href").startsWith("#"));
  if ("IntersectionObserver" in window && itensNav.length) {
    const espia = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        itensNav.forEach((a) => a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    itensNav.forEach((a) => { const alvo = $(a.getAttribute("href")); if (alvo) espia.observe(alvo); });
  }

  // ---------- WhatsApp e telefone ----------
  // Número com DDD vira link do WhatsApp com o 55 do Brasil e uma primeira mensagem pronta
  const digitos = (n) => String(n).replace(/\D/g, "");
  const com55 = (n) => (digitos(n).length <= 11 ? "55" : "") + digitos(n);
  function ligarContato(empresa, mensagem) {
    const zap = $("#zap-fixo"), zapTexto = $("#zap-texto");
    const zapNumero = empresa.whatsapp ? com55(empresa.whatsapp) : "";
    const telefone = empresa.telefone || empresa.whatsapp;
    const telHref = telefone ? "tel:+" + com55(telefone) : "";
    function hrefZap(texto) {
      return "https://wa.me/" + zapNumero + "?text=" + encodeURIComponent(texto || tr("zap.msg", "Olá! Vim pelo site da MB2 e quero saber mais sobre as casas."));
    }
    function linksZap() {
      if (!zapNumero) return;
      $$(".link-zap").concat(zap ? [zap] : []).forEach((a) => {
        a.href = hrefZap(a.dataset.zapMsg ? tr(a.dataset.zapMsg, a.dataset.zapPt || "") : mensagem);
        a.target = "_blank"; a.rel = "noopener";
      });
    }
    if (zapNumero && zapTexto) { zapTexto.removeAttribute("data-i18n"); zapTexto.textContent = "WhatsApp"; }
    linksZap();
    document.addEventListener("mb2:lang", linksZap);
    const linkTel = () => telefone ? `<a href="${telHref}">${esc(telefone)}</a>` : pendente();
    const linkEmail = () => empresa.email ? `<a href="mailto:${esc(empresa.email)}">${esc(empresa.email)}</a>` : pendente();
    // Rodapé e chamada final: os dados que a MB2 confirmou aparecem; os vazios ficam marcados
    function textos() {
      const dados = $("#chamada-dados");
      if (dados) dados.innerHTML = [telefone && linkTel(), empresa.email && linkEmail()].filter(Boolean).join('<span aria-hidden="true">·</span>');
      const rod = $("#rodape-contato");
      if (rod) rod.innerHTML = [
        [tr("rod.telefone", "Telefone"), telefone && linkTel()],
        [tr("rod.email", "E-mail"), empresa.email && linkEmail()],
        [tr("rod.endereco", "Endereço"), empresa.endereco && esc(empresa.endereco)],
        [tr("rod.cnpj", "CNPJ"), empresa.cnpj && esc(empresa.cnpj)]
      ].map(([k, v]) => `<li>${k} ${v || pendente()}</li>`).join("");
    }
    textos();
    document.addEventListener("mb2:lang", textos);
    if (empresa.instagram) { const ig = $("#instagram"); if (ig) { ig.href = empresa.instagram; ig.hidden = false; } }
    return { zapNumero, hrefZap, telefone, telHref, linkTel, linkEmail };
  }

  // Uma foto em dois tamanhos: o navegador escolhe pela largura da tela
  function foto(nome, alt, extra) {
    return `<img src="imagens/obras/${nome}-480.webp" srcset="imagens/obras/${nome}-480.webp 480w, imagens/obras/${nome}-1400.webp 1400w" sizes="${extra && extra.sizes ? extra.sizes : "(min-width: 821px) 33vw, 50vw"}" alt="${esc(alt)}" ${extra && extra.eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  }
  // Obra sem foto ainda: moldura com o símbolo e um aviso, no lugar de um quadrado vazio
  function semFoto(texto) {
    return `<div class="sem-foto" role="img" aria-label="${esc(texto)}"><svg aria-hidden="true"><use href="#hx-o"/></svg><span>${esc(texto)}</span></div>`;
  }
  // "Casa alto padrão" é descrição, não nome próprio: traduz só esse começo
  const nomeTraduzido = (nome) => String(nome).replace(/^Casa alto padrão/, () => tr("obra.casa", "Casa alto padrão"));
  // Nome da etapa da obra (as chaves são as mesmas do Gestor MB2)
  const ETAPAS_PT = { terreno: "Terreno", fundacao: "Fundação", estrutura: "Estrutura", alvenaria: "Alvenaria", cobertura: "Cobertura", instalacoes: "Instalações", acabamento: "Acabamento", entrega: "Entrega" };
  const nomeEtapa = (chave) => tr("etapa." + chave, ETAPAS_PT[chave] || chave);
  // "2026-03" vira "mar/2026"; "2026-03-14" vira "14/03/2026", no idioma da página
  function dataCurta(iso) {
    if (!iso) return "";
    const locale = window.MB2_I18N ? window.MB2_I18N.locale : "pt-BR";
    const [a, m, d] = iso.split("-").map(Number);
    const data = new Date(a, (m || 1) - 1, d || 1);
    return d ? data.toLocaleDateString(locale) : data.toLocaleDateString(locale, { month: "short", year: "numeric" }).replace(".", "");
  }

  window.MB2 = { $, $$, esc, tr, pendente, ligarContato, foto, semFoto, nomeTraduzido, nomeEtapa, dataCurta, ETAPAS: Object.keys(ETAPAS_PT) };
})();
