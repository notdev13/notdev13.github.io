# Site institucional da MB2

Site estático, sem build, publicado pelo GitHub Pages em https://notdev13.github.io/
(até o domínio `mb2incorporacoes.com.br` ser apontado em Settings > Pages > Custom domain).
Cada mudança na `main` vai ao ar sozinha em um ou dois minutos.

Para testar no computador, abra a pasta num servidor local (por exemplo
`python3 -m http.server`), porque a página carrega `dados/obras.json` por `fetch`,
o que não funciona abrindo o arquivo direto.

## Arquivos

- `index.html`: a página. Textos fixos ficam aqui.
- `css/estilo.css`: estilos, escritos primeiro para o celular. Cores, fontes,
  tamanhos e espaços estão nos tokens do começo do arquivo. O site abre sempre no
  tema claro; o botão lua/sol do menu liga o escuro só durante a visita.
- `js/site.js`: menu, fotos do topo (vídeo só no computador), grade de obras,
  contato e cadastro. Sem dependências.
- `dados/obras.json`: dados da empresa, a casa em destaque, as 12 obras e as
  fotos do topo. Campo vazio ou `null` aparece como "a confirmar" ou some.
- `imagens/obras/`: cada foto em 480 px (celular) e 1400 px (computador), WebP.
- `video/`: tour em vídeo do topo e posters. `hero-mb2-hd.mp4` (720p, ~12 MB) vai para o computador, `hero-mb2.mp4` (720p, ~6 MB) para o celular e `hero-mb2-480.mp4` (~3 MB) para quem está em economia de dados ou rede 2G; todas sem áudio, H.264, 27 s.
- `.nojekyll`: diz ao GitHub Pages para publicar os arquivos como estão.

## Para atualizar

- Nova obra: adicione a foto em dois tamanhos em `imagens/obras/` e um item em
  `dados/obras.json`.
- Telefone, WhatsApp, e-mail, endereço e CNPJ: preencha em `empresa` no JSON.
  Com o WhatsApp preenchido, o botão fixo do celular abre a conversa.

O painel de gestão de obras fica em outro repositório (`MB2`).
