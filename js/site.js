// Site da MB2 · página inicial. Menu, tema e WhatsApp ficam em js/base.js; os dados vêm de dados/obras.json.
(function () {
  "use strict";
  const { $, $$, esc, tr, pendente, ligarContato, foto, semFoto, nomeTraduzido, nomeEtapa, dataCurta } = window.MB2;
  const semMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const computador = matchMedia("(min-width: 821px)");

  // ---------- Carrega os dados ----------
  fetch("dados/obras.json")
    .then((r) => r.json())
    .then(montar)
    .catch(() => {
      $("#grade").innerHTML = `<p class="aviso">${tr("obras.erro", "Não consegui carregar a lista de obras. Recarregue a página.")}</p>`;
    });

  function montar(dados) {
    const obras = dados.obras, empresa = dados.empresa, etapas = dados.etapas || [];
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

    // ----- Em construção agora: um cartão por canteiro, cada um com a própria página -----
    function renderCanteiros() {
      const canteiros = obras.filter((o) => o.tipo === "canteiro" && o.situacao === "em-construcao");
      $("#grade-canteiros").innerHTML = canteiros.map((o) => {
        const local = [o.bairro, o.cidade].filter(Boolean).join(" · ");
        const ultima = (o.atualizacoes || [])[o.atualizacoes.length - 1];
        const fotoSemana = (ultima && ultima.fotos && ultima.fotos[0]) || o.foto;
        const posicao = etapas.indexOf(o.etapa);
        const avanco = posicao < 0 ? 0 : Math.round(((posicao + 1) / etapas.length) * 100);
        const linha = o.etapa
          ? `${tr("obra.etapaAtual", "Etapa atual")}: ${nomeEtapa(o.etapa)}`
          : tr("obra.etapaEmBreve", "Primeira atualização em breve");
        const datas = [o.inicio && `${tr("obra.inicio", "Início")} ${dataCurta(o.inicio)}`, o.previsao && `${tr("obra.previsao", "Previsão")} ${dataCurta(o.previsao)}`].filter(Boolean).join(" · ");
        return `<a class="card card-canteiro" href="obra.html?id=${encodeURIComponent(o.id)}">
          <div class="moldura">${fotoSemana ? foto(fotoSemana, o.nome, { sizes: "(min-width: 821px) 33vw, 100vw" }) : semFoto(tr("obra.semFoto", "Foto da semana em breve"))}
            <span class="selo selo-obra">${tr("obras.emConstrucao", "Em construção")}</span></div>
          <span class="local">${local ? esc(local) : tr("obras.local", "Local") + " " + pendente()}</span>
          <h3>${esc(o.nome)}</h3>
          <span class="dados">${linha}${ultima ? ` · ${tr("obra.atualizadoEm", "atualizado em")} ${dataCurta(ultima.data)}` : ""}</span>
          <span class="avanco" role="img" aria-label="${avanco}%"><i style="width:${avanco}%"></i></span>
          ${datas ? `<span class="dados">${esc(datas)}</span>` : ""}
        </a>`;
      }).join("");
    }
    renderCanteiros();

    // ----- Entregues: as casas do Campeche, com o selo de vendida -----
    function renderCasas() {
      $("#grade").innerHTML = obras.filter((o) => o.tipo === "casas").map((o) => {
        const local = [o.bairro, o.cidade].filter(Boolean).join(" · ");
        const dadosObra = [o.area_m2 && o.area_m2 + " m²", o.suites && o.suites + " " + tr("obras.suites", "suítes")].filter(Boolean);
        const nome = nomeTraduzido(o.nome);
        return `<a class="card" href="obra.html?id=${encodeURIComponent(o.id)}">
          <div class="moldura">${foto(o.foto, nome, { sizes: "(min-width: 821px) 50vw, 100vw" })}
            ${o.vendida ? `<span class="selo selo-vendida">${tr("obras.vendida", "Vendida")}</span>` : ""}</div>
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
      return `<a class="card card-faixa" href="obra.html?id=${encodeURIComponent(o.id)}">
        <div class="moldura">${foto(o.foto, o.nome, { sizes: "(min-width: 821px) 22vw, 62vw" })}</div>
        <h3>${esc(o.nome)}</h3>${local ? `<span class="local">${esc(local)}</span>` : ""}
      </a>`;
    }).join("");

    // ----- Fotos das outras seções -----
    $("#campeche-foto").innerHTML = foto("11-casa-jardim-campeche-288m2", "", { sizes: "100vw" });
    const textosCampeche = () => { $("#campeche-foto img").alt = tr("camp.fotoAlt", "Casa da MB2 no Jardim Campeche"); };
    textosCampeche();

    // ----- Contato (botões de WhatsApp, rodapé, chamada final) -----
    ligarContato(empresa);

    document.addEventListener("mb2:lang", () => {
      textosTopo();
      renderCanteiros();
      renderCasas();
      textosCampeche();
      $("#aviso-lancamentos").hidden = true;
    });
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
