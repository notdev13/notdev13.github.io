// Site da MB2 · página "Tem um terreno?". O formulário não grava nada: monta a mensagem e abre
// o WhatsApp da MB2 (ou o e-mail) com os dados já escritos.
(function () {
  "use strict";
  const { $, $$, tr, ligarContato } = window.MB2;
  let contato = null, empresa = null;

  fetch("dados/obras.json")
    .then((r) => r.json())
    .then((dados) => { empresa = dados.empresa; contato = ligarContato(dados.empresa); ligaEmail(); });

  const form = $("#form-terreno"), aviso = $("#aviso-terreno");
  const valor = (id) => $(id).value.trim();
  const interesse = () => {
    const v = ($$('input[name="interesse"]').find((i) => i.checked) || {}).value;
    return { permuta: tr("terr.permuta", "Permuta por casa pronta"), venda: tr("terr.venda", "Venda do terreno") }[v] || tr("terr.naoSei", "Ainda não sei");
  };
  const documentacao = () => {
    const sel = $("#t-doc"), op = sel.options[sel.selectedIndex];
    return op ? op.textContent : "";
  };
  function mensagem() {
    const linhas = [
      tr("terr.msgAbre", "Olá! Tenho um terreno e quero falar com a MB2."),
      `${tr("terr.nome", "Seu nome")}: ${valor("#t-nome")}`,
      `${tr("terr.bairro", "Bairro e cidade do terreno")}: ${valor("#t-bairro")}`,
      valor("#t-area") && `${tr("terr.area", "Área aproximada (m²)")}: ${valor("#t-area")} m²`,
      `${tr("terr.interesse", "O que você prefere")}: ${interesse()}`,
      `${tr("terr.doc", "Documentação")}: ${documentacao()}`,
      valor("#t-obs") && `${tr("terr.obs", "Algo mais que a gente deva saber")}: ${valor("#t-obs")}`
    ].filter(Boolean);
    return linhas.join("\n");
  }
  function valido() {
    aviso.hidden = true;
    if (!valor("#t-nome") || !valor("#t-bairro")) {
      aviso.textContent = tr("terr.erro", "Preencha pelo menos o seu nome e o bairro do terreno.");
      aviso.hidden = false;
      return false;
    }
    return true;
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!valido()) return;
    if (contato && contato.zapNumero) {
      open(contato.hrefZap(mensagem()), "_blank", "noopener");
    } else if (empresa && empresa.email) {
      location.href = linkEmail();
    } else {
      aviso.textContent = tr("terr.semCanal", "O WhatsApp da MB2 ainda não está cadastrado no site. Use o telefone do rodapé.");
      aviso.hidden = false;
    }
  });
  function linkEmail() {
    const assunto = tr("terr.assunto", "Tenho um terreno para a MB2");
    return `mailto:${empresa.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(mensagem())}`;
  }
  function ligaEmail() {
    const a = $("#t-email");
    if (!empresa || !empresa.email) { a.hidden = true; return; }
    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (valido()) location.href = linkEmail();
    });
  }
})();
