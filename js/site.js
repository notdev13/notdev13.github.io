// Site da MB2 · comportamento da página. Os dados vêm de dados/obras.json.
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // Textos montados aqui passam pela tradução (js/i18n.js); sem ela, fica o português
  const tr = (chave, pt) => (window.MB2_I18N ? window.MB2_I18N.t(chave) : pt);
  const pendente = () => `<span class="pendente">${tr("pendente", "a confirmar")}</span>`;
  // "Casa alto padrão" é descrição, não nome próprio: traduz só esse começo
  const nomeTraduzido = (nome) => String(nome).replace(/^Casa alto padrão/, () => tr("obra.casa", "Casa alto padrão"));
  const semMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const computador = matchMedia("(min-width: 821px)");

  // Uma foto em dois tamanhos: o navegador escolhe pela largura da tela
  function foto(nome, alt, extra) {
    return `<img src="imagens/obras/${nome}-480.webp" srcset="imagens/obras/${nome}-480.webp 480w, imagens/obras/${nome}-1400.webp 1400w" sizes="${extra && extra.sizes ? extra.sizes : "(min-width: 821px) 33vw, 50vw"}" alt="${esc(alt)}" ${extra && extra.eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  }

  // ---------- Menu ----------
  const topo = $(".topo"), menuBtn = $("#menu-btn"), menuMovel = $("#menu-movel");
  function abrirMenu(abre) {
    menuMovel.hidden = !abre;
    topo.classList.toggle("aberto", abre);
    menuBtn.setAttribute("aria-expanded", String(abre));
    menuBtn.setAttribute("aria-label", abre ? tr("nav.fecharMenu", "Fechar menu") : tr("nav.abrirMenu", "Abrir menu"));
    document.body.style.overflow = abre ? "hidden" : "";
    topo.classList.toggle("no-topo", !abre && scrollY < 10);
  }
  menuBtn.addEventListener("click", () => abrirMenu(menuMovel.hidden));
  menuMovel.addEventListener("click", (e) => { if (e.target.closest("a")) abrirMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !menuMovel.hidden) abrirMenu(false); });

  // ---------- Tema claro / escuro ----------
  // Abre sempre claro; o botão liga o escuro só durante a visita
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

  // Troca de idioma: refaz os rótulos que este arquivo escreve
  document.addEventListener("mb2:lang", () => {
    rotuloTema();
    menuBtn.setAttribute("aria-label", menuMovel.hidden ? tr("nav.abrirMenu", "Abrir menu") : tr("nav.fecharMenu", "Fechar menu"));
    $("#aviso-lancamentos").hidden = true;
  });
  menuBtn.setAttribute("aria-label", tr("nav.abrirMenu", "Abrir menu"));

  // No alto da página o menu fica sem fundo; rolando, encolhe. Some ao descer e volta ao subir.
  let aguardando = false, ultimoY = scrollY;
  function aoRolar() {
    aguardando = false;
    const y = scrollY, aberto = !menuMovel.hidden;
    topo.classList.toggle("no-topo", y < 10 && !aberto);
    topo.classList.toggle("compacto", y > 80);
    // Só esconde depois de passar da altura do menu e com o foco fora dele
    if (Math.abs(y - ultimoY) > 6) {
      topo.classList.toggle("escondido", y > ultimoY && y > 200 && !aberto && !topo.contains(document.activeElement));
      ultimoY = y;
    }
  }
  addEventListener("scroll", () => { if (!aguardando) { aguardando = true; requestAnimationFrame(aoRolar); } }, { passive: true });
  topo.addEventListener("focusin", () => topo.classList.remove("escondido"));
  aoRolar();

  // O item da seção que está na tela fica em cobre
  const itensNav = $$(".nav a");
  if ("IntersectionObserver" in window) {
    const espia = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        itensNav.forEach((a) => a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    itensNav.forEach((a) => { const alvo = $(a.getAttribute("href")); if (alvo) espia.observe(alvo); });
  }

  // ---------- Carrega os dados ----------
  fetch("dados/obras.json")
    .then((r) => r.json())
    .then(montar)
    .catch(() => {
      $("#grade").innerHTML = `<p class="aviso">${tr("obras.erro", "Não consegui carregar a lista de obras. Recarregue a página.")}</p>`;
    });

  function montar(dados) {
    const obras = dados.obras, empresa = dados.empresa;
    const d = obras.find((o) => o.id === dados.destaque) || obras[0];

    // ----- Topo: vídeo em todas as telas (fotos aparecem enquanto ele não carrega) -----
    const hero = $(".hero"), fotosWrap = $("#hero-fotos"), tracos = $("#hero-tracos"), legenda = $("#hero-legenda"), cartaoTitulo = $("#hero-cartao-titulo");
    fotosWrap.innerHTML = dados.topo.map((t, i) =>
      `<img class="hero-foto${i === 0 ? " ativa" : ""}" src="imagens/obras/${t.foto}-480.webp" srcset="imagens/obras/${t.foto}-480.webp 480w, imagens/obras/${t.foto}-1400.webp 1400w" sizes="100vw" alt="" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>`
    ).join("");
    const fotos = $$(".hero-foto", fotosWrap);
    let atual = 0, relogio;
    tracos.innerHTML = dados.topo.map(() => '<button type="button"></button>').join("");
    const botoesTraco = $$("button", tracos);
    botoesTraco.forEach((b, i) => (b.onclick = () => irPara(i, true)));
    function irPara(i, manual) {
      atual = (i + fotos.length) % fotos.length;
      fotos.forEach((f, j) => f.classList.toggle("ativa", j === atual));
      botoesTraco.forEach((b, j) => b.setAttribute("aria-current", String(j === atual)));
      if (!hero.classList.contains("com-video")) legenda.textContent = nomeTraduzido(dados.topo[atual].legenda);
      if (manual) reiniciar();
    }
    function reiniciar() {
      clearInterval(relogio);
      if (!semMovimento && !hero.classList.contains("com-video")) relogio = setInterval(() => irPara(atual + 1), 6000);
    }
    $("#hero-prev").onclick = () => irPara(atual - 1, true);
    $("#hero-next").onclick = () => irPara(atual + 1, true);
    irPara(0);
    reiniciar();

    // Arraste com o dedo troca a foto
    let x0 = null;
    hero.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50 && !hero.classList.contains("com-video")) irPara(atual + (dx < 0 ? 1 : -1), true);
    }, { passive: true });

    // Vídeo em todas as telas: computador recebe a versão de máxima qualidade (12 MB),
    // celular a de 720p (6 MB); conexão lenta ou economia de dados recebe a 480p (3 MB)
    const video = $("#hero-video"), pausa = $("#hero-pausa");
    function sincronizaPausa() {
      const parado = video.paused;
      pausa.setAttribute("aria-pressed", String(parado));
      pausa.setAttribute("aria-label", parado ? tr("hero.continuar", "Continuar vídeo") : tr("hero.pausar", "Pausar vídeo"));
    }
    function ligaVideo() {
      const rede = navigator.connection || {};
      const lenta = rede.saveData || /(^|\b)(slow-2g|2g)\b/.test(rede.effectiveType || "");
      const grande = computador.matches;
      video.poster = grande ? "video/poster-1400.jpg" : "video/poster-480.jpg";
      video.src = lenta ? "video/hero-mb2-480.mp4" : grande ? "video/hero-mb2-hd.mp4" : "video/hero-mb2.mp4";
      hero.classList.add("com-video");
      clearInterval(relogio);
      cartaoTitulo.hidden = true; // sem a etiqueta "Tour em vídeo" (pedido de Gabriel, 27/10/2026)
      legenda.textContent = [d.nome, d.area_m2 && d.area_m2 + " m²"].filter(Boolean).join(" · ");
      textosTopo();
      if (!semMovimento) video.play().catch(() => {});
      sincronizaPausa();
    }
    video.addEventListener("play", sincronizaPausa);
    video.addEventListener("pause", sincronizaPausa);
    pausa.onclick = () => (video.paused ? video.play().catch(() => {}) : video.pause());
    function textosTopo() {
      botoesTraco.forEach((b, i) => b.setAttribute("aria-label", tr("hero.foto", "Foto") + " " + (i + 1)));
      if (hero.classList.contains("com-video")) {
        cartaoTitulo.textContent = tr("hero.tour", "Tour em vídeo");
        legenda.textContent = [nomeTraduzido(d.nome), d.area_m2 && d.area_m2 + " m²"].filter(Boolean).join(" · ");
      } else {
        cartaoTitulo.textContent = tr("hero.cartao", "Nossas casas");
        legenda.textContent = nomeTraduzido(dados.topo[atual].legenda);
      }
      sincronizaPausa();
    }
    textosTopo();
    ligaVideo();

    // ----- Casa em destaque -----
    $("#destaque-foto").innerHTML = foto(d.foto, "", { sizes: "100vw" });
    $("#destaque-local").textContent = [d.bairro, d.cidade].filter(Boolean).join(" · ");
    function textosDestaque() {
      $("#destaque-foto img").alt = tr("dest.fachada", "Fachada:") + " " + nomeTraduzido(d.nome);
      $("#destaque-nome").textContent = nomeTraduzido(d.nome);
      const etiquetas = [];
      if (d.area_m2) etiquetas.push(d.area_m2 + " m²");
      if (d.suites) etiquetas.push(d.suites + " " + tr("obras.suites", "suítes"));
      if (d.vagas) etiquetas.push(d.vagas + " " + tr("obras.vagas", "vagas"));
      if (d.bairro) etiquetas.push(d.bairro);
      if (d.situacao) etiquetas.push(d.situacao);
      $("#destaque-etiquetas").innerHTML = etiquetas.map((e) => `<span>${esc(e)}</span>`).join("");
    }
    textosDestaque();

    // ----- Obras: as casas do Campeche em cartões grandes; os residenciais numa faixa compacta -----
    function renderCasas() {
      $("#grade").innerHTML = obras.filter((o) => o.tipo === "casas").map((o) => {
        const local = [o.bairro, o.cidade].filter(Boolean).join(" · ");
        const dadosObra = [o.area_m2 && o.area_m2 + " m²", o.suites && o.suites + " " + tr("obras.suites", "suítes"), o.situacao].filter(Boolean);
        const nome = nomeTraduzido(o.nome);
        return `<a class="card" href="#contato">
          <div class="moldura">${foto(o.foto, nome, { sizes: "(min-width: 821px) 50vw, 100vw" })}</div>
          <span class="local">${local ? esc(local) : tr("obras.local", "Local") + " " + pendente()}</span>
          <h3>${esc(nome)}</h3>
          <span class="dados">${dadosObra.length ? dadosObra.map(esc).join(" · ") : tr("obras.areaTipo", "Área e tipologia") + " " + pendente()}</span>
        </a>`;
      }).join("");
    }
    renderCasas();
    // Na faixa só foto e nome: os dados que a MB2 ainda não confirmou não aparecem
    $("#faixa-residenciais").innerHTML = obras.filter((o) => o.tipo === "residenciais").map((o) => {
      const local = [o.bairro, o.cidade].filter(Boolean).join(" · ");
      return `<a class="card card-faixa" href="#contato">
        <div class="moldura">${foto(o.foto, o.nome, { sizes: "(min-width: 821px) 22vw, 62vw" })}</div>
        <h3>${esc(o.nome)}</h3>${local ? `<span class="local">${esc(local)}</span>` : ""}
      </a>`;
    }).join("");

    // ----- Fotos das outras seções -----
    $("#campeche-foto").innerHTML = foto("11-casa-jardim-campeche-288m2", "", { sizes: "100vw" });

    // ----- Contato: dados que a MB2 confirmar aparecem; os vazios ficam marcados -----
    const zap = $("#zap-fixo"), zapTexto = $("#zap-texto");
    // Número com DDD vira link do WhatsApp com o 55 do Brasil e uma primeira mensagem pronta
    const digitos = (n) => String(n).replace(/\D/g, "");
    const zapNumero = empresa.whatsapp ? (digitos(empresa.whatsapp).length <= 11 ? "55" : "") + digitos(empresa.whatsapp) : "";
    const telefone = empresa.telefone || empresa.whatsapp;
    const telHref = telefone ? "tel:+" + (digitos(telefone).length <= 11 ? "55" : "") + digitos(telefone) : "";
    function linksZap() {
      if (!zapNumero) return;
      const href = "https://wa.me/" + zapNumero + "?text=" + encodeURIComponent(tr("zap.msg", "Olá! Vim pelo site da MB2 e quero saber mais sobre as casas."));
      $$(".link-zap").concat(zap).forEach((a) => { a.href = href; a.target = "_blank"; a.rel = "noopener"; });
    }
    if (zapNumero) {
      zapTexto.removeAttribute("data-i18n");
      zapTexto.textContent = "WhatsApp";
      linksZap();
    }
    const linkTel = () => telefone ? `<a href="${telHref}">${esc(telefone)}</a>` : pendente();
    const linkEmail = () => empresa.email ? `<a href="mailto:${esc(empresa.email)}">${esc(empresa.email)}</a>` : pendente();
    // Pé do menu do celular: telefone e Instagram
    const telMenu = $(".menu-movel-pe .tel-mb2"), instaMenu = $(".menu-movel-pe .insta-mb2");
    if (telefone) { telMenu.href = telHref; telMenu.textContent = telefone; telMenu.hidden = false; }
    if (empresa.instagram) { instaMenu.href = empresa.instagram; instaMenu.hidden = false; }
    function textosContato() {
      $("#campeche-foto img").alt = tr("camp.fotoAlt", "Casa da MB2 no Jardim Campeche");
      $("#dados-contato").innerHTML =
        `${tr("cont.telZap", "Telefone e WhatsApp")}: ${linkTel()} &nbsp;·&nbsp; ${tr("rod.email", "E-mail")}: ${linkEmail()}`;
      $("#chamada-dados").innerHTML = [telefone && linkTel(), empresa.email && linkEmail()].filter(Boolean).join('<span aria-hidden="true">·</span>');
      $("#rodape-contato").innerHTML = [
        [tr("rod.telefone", "Telefone"), telefone && linkTel()],
        [tr("rod.email", "E-mail"), empresa.email && linkEmail()],
        [tr("rod.endereco", "Endereço"), empresa.endereco && esc(empresa.endereco)],
        [tr("rod.cnpj", "CNPJ"), empresa.cnpj && esc(empresa.cnpj)]
      ].map(([k, v]) => `<li>${k} ${v || pendente()}</li>`).join("");
      linksZap();
    }
    textosContato();

    document.addEventListener("mb2:lang", () => {
      textosTopo();
      textosDestaque();
      renderCasas();
      textosContato();
    });
    if (empresa.instagram) {
      const ig = $("#instagram");
      ig.href = empresa.instagram;
      ig.hidden = false;
    }
  }

  // ----- Lançamentos (prévia: ainda não envia para lugar nenhum) -----
  $("#form-lancamentos").addEventListener("submit", (e) => {
    e.preventDefault();
    const aviso = $("#aviso-lancamentos"), email = $("#email").value.trim();
    aviso.hidden = false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { aviso.textContent = tr("lanc.erroEmail", "Digite um e-mail válido, como nome@exemplo.com."); return; }
    if (!$("#consentimento").checked) { aviso.textContent = tr("lanc.erroConsent", "Marque a caixa da política de privacidade para continuar."); return; }
    aviso.textContent = tr("lanc.previa", "Esta é uma prévia: o cadastro ainda não está ligado a uma lista de e-mails.");
  });
})();
