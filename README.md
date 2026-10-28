# Site institucional da MB2

Site estático, sem build, publicado pelo GitHub Pages em https://notdev13.github.io/
(até o domínio `mb2incorporacoes.com.br` ser apontado em Settings > Pages > Custom domain).
Cada mudança na `main` vai ao ar sozinha em um ou dois minutos.

Para testar no computador, abra a pasta num servidor local (por exemplo
`python3 -m http.server`), porque a página carrega `dados/obras.json` por `fetch`,
o que não funciona abrindo o arquivo direto.

## Arquivos

- `index.html`: a página inicial. Textos fixos ficam aqui.
- `obra.html`: página de uma obra, aberta como `obra.html?id=lote-39` (o `id` é o do
  JSON). É a página da placa de obra (QR code) e a de acompanhamento para quem
  comprou: etapa atual, linha do tempo das atualizações, fotos e vídeo.
- `terreno.html`: página "Tem um terreno?" para quem quer permutar ou vender um
  terreno. O formulário não grava nada: monta a mensagem e abre o WhatsApp (ou o
  e-mail) da MB2 com os dados já escritos.
- `css/estilo.css`: estilos, escritos primeiro para o celular. Cores, fontes,
  tamanhos e espaços estão nos tokens do começo do arquivo. O site abre sempre no
  tema claro; o botão lua/sol do menu liga o escuro só durante a visita.
- `js/base.js`: o que toda página tem (menu, tema, botões de WhatsApp, rodapé,
  foto em dois tamanhos). Carrega antes do script da página.
- `js/site.js`: página inicial (vídeo do topo, destaque, canteiros, entregues,
  cadastro). `js/obra.js` e `js/terreno.js` são das outras duas páginas. Sem
  dependências.
- `js/i18n.js`: tradução própria em português, inglês, espanhol e francês (mesmo
  mecanismo do site da Dra. Grazi). O português sai do próprio HTML; para traduzir
  um texto novo, marque o elemento com `data-i18n="chave"` (ou
  `data-i18n-attr="aria-label:chave"`) e escreva a frase nas três línguas no
  arquivo. Chave sem tradução continua em português. A escolha fica guardada no
  aparelho; na primeira visita, vale o idioma do navegador.
- `dados/obras.json`: dados da empresa, a casa em destaque, as obras (entregues e
  canteiros), a lista de `etapas` e as fotos do topo. Campo vazio ou `null`
  aparece como "a confirmar" ou some.
- `imagens/obras/`: cada foto em 480 px (celular) e 1400 px (computador), WebP.
- `video/`: tour em vídeo do topo e posters. `hero-mb2-hd.mp4` (720p, ~12 MB) vai para o computador, `hero-mb2.mp4` (720p, ~6 MB) para o celular e `hero-mb2-480.mp4` (~3 MB) para quem está em economia de dados ou rede 2G; todas sem áudio, H.264, 27 s.
- `.nojekyll`: diz ao GitHub Pages para publicar os arquivos como estão.

## Para atualizar

- Nova obra entregue: adicione a foto em dois tamanhos em `imagens/obras/` e um
  item em `dados/obras.json` (`situacao: "entregue"`; `vendida: true` põe o selo).
- Canteiro de obra: item com `tipo: "canteiro"`, `situacao: "em-construcao"`,
  `etapa` (uma das chaves de `etapas`: terreno, fundacao, estrutura, alvenaria,
  cobertura, instalacoes, acabamento, entrega), `inicio` e `previsao` no formato
  `AAAA-MM`. Aparece em "Em construção agora" com barra de avanço e ganha a
  página `obra.html?id=…`. Quando a obra termina, troque `situacao` para
  `"entregue"` e `tipo` para o grupo em que ela deve ficar.
- Atualização semanal de um canteiro: acrescente um item em `atualizacoes` da
  obra: `{ "data": "AAAA-MM-DD", "etapa": "estrutura", "texto": "...", "fotos":
  ["nome-da-foto"], "video": "video/arquivo.mp4" }` (texto, fotos e vídeo são
  opcionais; as fotos seguem a regra de dois tamanhos). A foto da última
  atualização vira a foto do cartão na página inicial. Na fase 1 do Gestor MB2
  esse arquivo passa a ser gerado pelo painel.
- Telefone, WhatsApp, e-mail, endereço e CNPJ: preencha em `empresa` no JSON.
  Com o WhatsApp preenchido (com DDD; o 55 do Brasil entra sozinho), todos os botões
  "Fale com a MB2" e o botão fixo do celular abrem a conversa com uma primeira
  mensagem pronta (chave `zap.msg` em `js/i18n.js`). O destino de `#contato` é a
  chamada final da página, que mostra telefone e e-mail.
- Mudou `css/estilo.css` ou algum arquivo de `js/`: troque o `?v=` desses arquivos
  nas três páginas HTML (por exemplo, para a data do dia). O GitHub Pages deixa o
  navegador guardar CSS e JS por 10 minutos; sem trocar o `?v=`, quem já tinha
  visitado pode ver a página nova com o estilo antigo.

O painel de gestão de obras fica em outro repositório (`MB2`).
