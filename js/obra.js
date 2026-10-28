// Site da MB2 · página de uma obra (obra.html?id=...). É a página da placa de obra (QR code)
// e a de transparência para quem comprou: etapa atual, linha do tempo semanal, fotos e vídeo.
// Os dados vêm de dados/obras.json; na fase 1 do Gestor MB2 esse arquivo passa a ser gerado por ele.
(function () {
  "use strict";
  const { $, $$, esc, tr, pendente, ligarContato, foto, semFoto, nomeTraduzido, nomeEtapa, dataCurta } = window.MB2;
  const id = new URLSearchParams(location.search).get("id");

  fetch("dados/obras.json")
    .then((r) => r.json())
    .then((dados) => {
      const obra = dados.obras.find((o) => o.id === id);
      if (!obra) { naoEncontrada(dados); return; }
      montar(dados, obra);
    })
    .catch(() => naoEncontrada());

  function naoEncontrada(dados) {
    $("#obra-topo").hidden = true;
    $("#obra-nao-encontrada").hidden = false;
    if (dados) ligarContato(dados.empresa);
  }

  function montar(dados, obra) {
    const etapas = dados.etapas || [];
    const atualizacoes = (obra.atualizacoes || []).slice().sort((a, b) => (a.data < b.data ? 1 : -1));
    const emObra = obra.situacao === "em-construcao";
    const fotoPrincipal = obra.foto || (atualizacoes[0] && atualizacoes[0].fotos && atualizacoes[0].fotos[0]);

    // A mensagem do WhatsApp cita a obra; o {obra} é trocado pelo nome em qualquer idioma
    $$(".link-zap[data-zap-pt]").forEach((a) => { a.dataset.zapPt = a.dataset.zapPt.replace("{obra}", obra.nome); });
    const contato = ligarContato(dados.empresa);
    const ajustaZap = () => $$(".link-zap").forEach((a) => {
      if (contato.zapNumero) a.href = contato.hrefZap(tr("zap.msgObra", "Olá! Vi a obra {obra} no site da MB2 e quero saber mais.").replace("{obra}", obra.nome));
    });
    ajustaZap();

    function textos() {
      const nome = nomeTraduzido(obra.nome);
      document.title = nome + " · MB2 Incorporações";
      $("#obra-nome").textContent = nome;
      $("#obra-chapeu").textContent = emObra ? tr("obras.emConstrucao", "Em construção") : tr("obras.entregue", "Entregue");
      $("#obra-local").textContent = [obra.bairro, obra.cidade].filter(Boolean).join(" · ") || "";
      $("#obra-foto").innerHTML = fotoPrincipal
        ? foto(fotoPrincipal, nome, { sizes: "(min-width: 821px) 60vw, 100vw", eager: true })
        : semFoto(tr("obra.semFoto", "Foto da semana em breve"));

      const etiquetas = [];
      if (obra.area_m2) etiquetas.push(obra.area_m2 + " m²");
      if (obra.suites) etiquetas.push(obra.suites + " " + tr("obras.suites", "suítes"));
      if (obra.vagas) etiquetas.push(obra.vagas + " " + tr("obras.vagas", "vagas"));
      if (emObra && obra.etapa) etiquetas.push(tr("obra.etapaAtual", "Etapa atual") + ": " + nomeEtapa(obra.etapa));
      if (emObra && obra.inicio) etiquetas.push(tr("obra.inicio", "Início") + " " + dataCurta(obra.inicio));
      if (emObra && obra.previsao) etiquetas.push(tr("obra.previsao", "Previsão") + " " + dataCurta(obra.previsao));
      if (obra.vendida) etiquetas.push(tr("obras.vendida", "Vendida"));
      $("#obra-etiquetas").innerHTML = etiquetas.map((e) => `<span>${esc(e)}</span>`).join("");

      // Andamento: só para obra em construção
      const andamento = $("#atualizacoes");
      andamento.hidden = !emObra;
      $("#obra-ir-atualizacoes").hidden = !emObra;
      if (emObra) {
        const posicao = etapas.indexOf(obra.etapa);
        $("#etapas-barra").innerHTML = etapas.map((e, i) => {
          const estado = posicao < 0 ? "" : i < posicao ? "feita" : i === posicao ? "atual" : "";
          return `<li class="${estado}"${i === posicao ? ' aria-current="step"' : ""}><i></i><span>${esc(nomeEtapa(e))}</span></li>`;
        }).join("");
        $("#linha-tempo").innerHTML = atualizacoes.map((a) => `
          <li>
            <time datetime="${esc(a.data)}">${esc(dataCurta(a.data))}</time>
            <div class="conteudo">
              ${a.etapa ? `<span class="chapeu">${esc(nomeEtapa(a.etapa))}</span>` : ""}
              ${a.texto ? `<p>${esc(a.texto)}</p>` : ""}
              ${a.fotos && a.fotos.length ? `<div class="fotos">${a.fotos.map((f) => `<div class="moldura">${foto(f, nome + " · " + dataCurta(a.data), { sizes: "(min-width: 821px) 30vw, 80vw" })}</div>`).join("")}</div>` : ""}
              ${a.video ? `<video controls playsinline preload="metadata" src="${esc(a.video)}"></video>` : ""}
            </div>
          </li>`).join("");
        $("#obra-vazio").hidden = atualizacoes.length > 0;
      }

      // Vídeo e galeria: aparecem quando existem
      const vid = $("#obra-video");
      vid.hidden = !obra.video;
      if (obra.video) $("#obra-video-player").src = obra.video;
      const fotosExtra = (obra.fotos || []).filter((f) => f !== fotoPrincipal);
      $("#obra-galeria").hidden = fotosExtra.length === 0;
      $("#galeria").innerHTML = fotosExtra.map((f) => `<div class="moldura">${foto(f, nome, { sizes: "(min-width: 821px) 30vw, 100vw" })}</div>`).join("");

      ajustaZap();
    }
    textos();
    document.addEventListener("mb2:lang", textos);
  }
})();
