# MB2 · Site institucional

Site estático da **MB2 Incorporações** (casas de alto padrão no Campeche, Sul da Ilha, Florianópolis).
Publicado pelo GitHub Pages em https://notdev13.github.io/. **Cada mudança na `main` vai ao ar sozinha**
em um ou dois minutos. O repositório é **público**.

Projeto separado do painel de gestão de obras (`notdev13/MB2`): não misture código, textos nem decisões.

## Onde está o quê
- `index.html`: a página. Textos fixos ficam aqui.
- `css/estilo.css`: estilos, escritos primeiro para o celular. Cores, fontes, tamanhos e espaços estão
  nos tokens do começo do arquivo (grafite, concreto, areia, verde, cobre; Manrope e Fraunces). O botão
  lua/sol do menu troca o tema só durante a visita.
- `js/site.js`: menu, fotos do topo (vídeo só no computador), grade de obras, contato e cadastro. Sem dependências.
- `js/i18n.js`: tradução própria. O português sai do próprio HTML; texto novo leva `data-i18n="chave"`
  (ou `data-i18n-attr="atributo:chave"`) e a frase em **todas as línguas** que o arquivo já suporta.
  Chave sem tradução cai para o português.
- `dados/obras.json`: dados da empresa, casa em destaque, obras e fotos do topo. Campo vazio ou `null`
  aparece como "a confirmar" ou some. **Nunca invente dado**: deixe vazio.
- `imagens/obras/`: cada foto em 480 px (celular) e 1400 px (computador), WebP.
- `video/`: tour do topo em três versões (HD, celular, economia de dados) e posters. Sem áudio.

## Como testar
Sem build. Rode um servidor local dentro da pasta (`python3 -m http.server`) e abra no navegador:
abrir o arquivo direto não funciona, porque a página carrega `dados/obras.json` por `fetch`.
Teste sempre no tamanho de celular primeiro, depois no computador, nos dois temas e em mais de um idioma.

## Regras
- **Mobile first**: todo pedido vale primeiro para o celular; o computador sempre fica funcional e bonito.
- Mudou `css/estilo.css` ou arquivo de `js/`? Troque o `?v=` desses arquivos no `index.html`
  (use a data do dia). Sem isso, quem já visitou vê a página nova com o estilo antigo.
- Texto em português do Brasil, simples, tom premium e sóbrio. Sem promessa que a empresa não possa cumprir.
- Identidade visual própria da MB2. Nunca copie cores, fontes, layout ou textos de outro projeto
  (nem de outros sites do mesmo desenvolvedor).
- Repositório público: nada de segredos, chaves, dados pessoais ou de clientes em arquivo, commit ou PR.
- Desempenho importa: imagens em WebP nos dois tamanhos, vídeos leves, nada que bloqueie o carregamento.
- Acessibilidade: contraste, foco visível, `aria-*` nos controles, respeitar `prefers-reduced-motion`.
- Mudanças pequenas e no escopo pedido. Ideia grande ou ousada vai em **branch separada**, com PR.

## Fluxo de trabalho
- Nunca trabalhe direto na `main` e **nunca faça merge sem aprovação do dono**: merge publica o site.
- Cada tarefa: branch nova `claude/<assunto>`, commits claros em português, PR descrevendo o que mudou,
  como testar e prints quando houver mudança visual.

## Time de agentes (`.claude/agents/`)
A sessão principal planeja, delega e confere. `dev-sites` implementa; `revisor` revisa sem alterar arquivos
(passe o diff). Acione só quando ajudar; tarefa pequena a sessão principal faz sozinha.

## Entrega
Resumir arquivos alterados, como foi testado (com resultado real) e o que ficou pendente.
