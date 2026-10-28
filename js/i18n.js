/* ============================================================
   MB2 — Tradução própria (PT · EN · ES · FR)
   Mesmo mecanismo do site da Dra. Grazi (gcode-i18n.js).
   Carregar no fim do <body>, ANTES de js/site.js, e SEM defer:
   nesse ponto o DOM já está completo e a troca acontece antes da
   primeira pintura, então não há piscada de texto em português.

   POR QUE NÃO O GOOGLE TRADUTOR
   O widget injeta <font> dentro de cada frase (quebra a tipografia),
   recarrega a página a cada troca e gera textos de tamanho imprevisível
   que estouram o layout no celular. Aqui as frases são escritas à mão.

   COMO FUNCIONA
   O português NÃO fica duplicado neste arquivo: no primeiro carregamento
   guardamos o HTML original de cada elemento marcado (snapshot) e ele passa
   a ser o dicionário "pt". Editar o HTML basta para mudar o português.

   COMO MARCAR TEXTO NO HTML
     <p data-i18n="chave">Texto em português</p>
     <button data-i18n-attr="aria-label:chave">
     <input data-i18n-attr="placeholder:chave;aria-label:outra">
   Chave sem tradução = mantém o português (degrada bem).

   TEXTO MONTADO POR JS (js/site.js)
   Use MB2_I18N.t('chave') e ouça o evento "mb2:lang" para redesenhar.
   O português dessas chaves fica em PT_EXTRA, mais abaixo.
   ============================================================ */
(function () {
  'use strict';

  var SUPORTADOS = ['pt', 'en', 'es', 'fr'];
  var STORAGE = 'mb2_lang';
  var LOCALE = { pt: 'pt-BR', en: 'en-US', es: 'es-ES', fr: 'fr-FR' };

  /* ── dicionários (pt vem do snapshot do HTML) ── */
  var T = {
    en: {
      'meta.titulo': 'MB2 Incorporações · Homes in Campeche, Florianópolis',
      'meta.desc': 'MB2 Incorporações: 14 years of building. High-end homes in Campeche, in the south of the island of Florianópolis, Brazil.',
      'h1': 'MB2 Incorporações · High-end homes in the south of the island, Florianópolis',

      'nav.principal': 'Main',
      'nav.logo': 'MB2 Incorporações, home',
      'nav.obras': 'Projects',
      'nav.como': 'Process',
      'nav.comoLongo': 'How we build',
      'nav.campeche': 'Campeche',
      'nav.campecheLongo': 'Living in Campeche',
      'nav.contato': 'Contact',
      'nav.fale': 'Talk to MB2',
      'nav.idioma': 'Choose language',
      'nav.menuMovel': 'Mobile menu',
      'nav.abrirMenu': 'Open menu',
      'nav.fecharMenu': 'Close menu',
      'zap.msg': 'Hello! I found MB2 through the website and would like to know more about the homes.',
      'tema.escuro': 'Switch to dark theme',
      'tema.claro': 'Switch to light theme',

      'hero.aria': 'Introduction',
      'hero.titulo': '14 years of building. <em>Now in the south of the island.</em>',
      'hero.cta': 'See our projects',
      'hero.rolar': 'Scroll down',
      'hero.cartao': 'Our homes',
      'hero.tour': 'Video tour',
      'hero.fotoAnt': 'Previous photo',
      'hero.fotoProx': 'Next photo',
      'hero.foto': 'Photo',
      'hero.pausar': 'Pause video',
      'hero.continuar': 'Play video',

      'dest.aria': 'Featured home',
      'dest.chapeu': 'Featured home',
      'dest.cta': 'I want to see this home',
      'dest.fachada': 'Front view:',

      'obras.chapeu': 'Under construction now',
      'obras.casas': 'Homes in Campeche',
      'obras.residenciais': 'Residential buildings',
      'obras.suites': 'suites',
      'obras.vagas': 'parking spaces',
      'obras.local': 'Location',
      'obras.areaTipo': 'Area and layout',
      'obras.erro': 'We couldn’t load the list of projects. Please reload the page.',
      'obra.casa': 'High-end home',

      'obras.titulo': 'Works in progress in the <em>south of the island.</em>',
      'port.chapeu': 'Portfolio',
      'port.titulo': 'Residential buildings in <em>Curitiba and Itapoá.</em>',
      'port.dica': 'Swipe to see more',
      'port.aria': 'Completed residential buildings',
      'num.anos': 'years of building',
      'num.emp': 'developments',
      'num.cidades': 'cities',
      'cham.titulo': 'Want to see a home <em>by MB2?</em>',
      'cham.p': 'We show you the site up close, send floor plans and terms, and you talk directly to the team that builds.',
      'cham.casas': 'See the homes',

      'hist.aria': 'About MB2',
      'hist.chapeu': 'Building for 14 years',
      'hist.titulo': 'We started in Curitiba. <em class="italico">We chose Campeche to carry on.</em>',
      'hist.p': 'We came to Florianópolis because the island’s way of life and its market suit the homes we build.',

      'como.chapeu': 'From the plot to the keys',
      'como.titulo': 'How <em>we build.</em>',
      'como.1t': 'Plot and design',
      'como.1d': 'We choose the plot and design the house around it: the path of the sun, ventilation and the south-island way of life.',
      'como.2t': 'Approvals',
      'como.2d': 'We handle the paperwork and permits before construction begins.',
      'como.3t': 'Construction',
      'como.3d': 'We follow every stage closely, from the foundations to the finishes, with materials chosen for the island’s climate.',
      'como.4t': 'Handover',
      'como.4d': 'You get the house ready to move in, and you keep talking to the same team that built it.',

      'camp.chapeu': 'Where we build',
      'camp.titulo': 'Living in <em>Campeche.</em>',
      'camp.p': 'Campeche is in the south of the island of Florianópolis. It is a neighbourhood of houses, close to the sea, with a calm routine and everything daily life needs.',
      'camp.l1': 'Open-sea beach, great for walking and surfing',
      'camp.l2': 'Campeche Island right in front of the beach',
      'camp.l3': 'Shops, schools and restaurants in the neighbourhood',
      'camp.l4': 'A short drive to the city’s airport',
      'camp.fotoAlt': 'MB2 home in Jardim Campeche',

      'cont.chapeu': 'Talk to the builders',
      'cont.titulo': 'Want to see an MB2 home? <em class="italico">We’ll show you the site up close.</em>',
      'cont.1t': 'Direct conversation',
      'cont.1d': 'No middleman. The MB2 team itself answers your questions about design, construction and terms.',
      'cont.2t': 'Floor plans and terms',
      'cont.2d': 'We send floor plans, images and the terms for the home that caught your eye.',
      'cont.3t': 'Site visit',
      'cont.3d': 'Book a time to see the construction site or the finished home in Campeche.',
      'cont.chamar': 'Contact MB2',
      'cont.agendar': 'Book a visit',
      'cont.telZap': 'Phone and WhatsApp',

      'lanc.aria': 'New launches',
      'lanc.chapeu': 'New launches',
      'lanc.titulo': 'Be the first to hear about <em class="italico">MB2’s next homes.</em>',
      'lanc.email': 'Your e-mail',
      'lanc.inscrever': 'Subscribe',
      'lanc.consent': 'By signing up you agree to our privacy policy.',
      'lanc.erroEmail': 'Enter a valid e-mail, like name@example.com.',
      'lanc.erroConsent': 'Tick the privacy policy box to continue.',
      'lanc.previa': 'This is a preview: sign-up is not yet connected to a mailing list.',

      'zap.texto': 'Talk to MB2',

      'rod.logo': 'MB2 Incorporações',
      'rod.sociais': 'Social media',
      'rod.instagram': 'MB2 on Instagram',
      'rod.facebook': 'Facebook: to be confirmed',
      'rod.youtube': 'YouTube: to be confirmed',
      'rod.emp': 'Developments',
      'rod.casas': 'Homes in Campeche',
      'rod.resid': 'Residential buildings',
      'rod.inst': 'Company',
      'rod.sobre': 'About MB2',
      'rod.como': 'How we build',
      'rod.campeche': 'Living in Campeche',
      'rod.privacidade': 'Privacy policy',
      'rod.contato': 'Contact',
      'rod.telefone': 'Phone',
      'rod.email': 'E-mail',
      'rod.endereco': 'Address',
      'rod.cnpj': 'Company ID (CNPJ)',
      'obras.texto': 'Every project has its own page with the current stage and this week’s updates. It is the same page the site sign points to.',
      'entr.chapeu': 'Completed',
      'entr.titulo': 'Finished homes in <em>Campeche.</em>',
      'obras.emConstrucao': 'Under construction',
      'obras.entregue': 'Completed',
      'obras.vendida': 'Sold',
      'obra.etapaAtual': 'Current stage',
      'obra.etapaEmBreve': 'First update coming soon',
      'obra.inicio': 'Started',
      'obra.previsao': 'Due',
      'obra.atualizadoEm': 'updated on',
      'obra.semFoto': 'Photo of the week coming soon',
      'etapa.terreno': 'Site',
      'etapa.fundacao': 'Foundations',
      'etapa.estrutura': 'Structure',
      'etapa.alvenaria': 'Masonry',
      'etapa.cobertura': 'Roof',
      'etapa.instalacoes': 'Services',
      'etapa.acabamento': 'Finishes',
      'etapa.entrega': 'Handover',
      'nav.terreno': 'Land',
      'nav.terrenoLongo': 'Own a plot of land?',
      'rod.construcao': 'Under construction',
      'terr.chapeu': 'Own a plot of land?',
      'terr.titulo': 'Build with MB2, by land swap or sale.',
      'terr.p': 'We assess your plot in Campeche and the surrounding area and reply within 48 business hours.',
      'terr.cta': 'Talk about my land',
      'zap.msgObra': 'Hello! I saw the {obra} project on the MB2 website and would like to know more.',
      'obra.metaTitulo': 'Project · MB2 Incorporações',
      'obra.metaDesc': 'Construction progress, current stage and weekly photos. MB2 Incorporações, Campeche, Florianópolis.',
      'obra.migalhasAria': 'You are here',
      'obra.voltar': 'All projects',
      'obra.cta': 'Ask about this project',
      'obra.verAtualizacoes': 'See the progress',
      'obra.andamentoChapeu': 'Construction progress',
      'obra.andamentoTitulo': 'Week by week, <em>from the ground to the keys.</em>',
      'obra.andamentoTexto': 'Buyers follow their home here. Anyone still deciding sees how MB2 builds.',
      'obra.etapasAria': 'Construction stages',
      'obra.semAtualizacao': 'This project has just started. The first update goes up here next week.',
      'obra.videoChapeu': 'On video',
      'obra.galeriaChapeu': 'Photos',
      'obra.chamadaTitulo': 'Want to know more <em>about this project?</em>',
      'obra.outras': 'See other projects',
      'obra.naoEncontrada': 'We couldn’t find that project. Go back to the list and choose again.',
      'terr.metaTitulo': 'Own a plot of land? Build with MB2',
      'terr.metaDesc': 'Land swap or purchase in Campeche and the south of the island. MB2 assesses your plot and replies within 48 business hours.',
      'terr.h1': 'Build with MB2, <em>by land swap or sale.</em>',
      'terr.lede': 'We are looking for plots in Campeche and the south of the island for our next homes. You can sell the land, or swap it for finished homes, without putting money into the build.',
      'terr.1t': 'You tell us about the land',
      'terr.1d': 'Neighbourhood, size and the state of the paperwork. No need for a design or a price.',
      'terr.2t': 'MB2 assesses it',
      'terr.2d': 'We check what the law allows on the plot and what it is worth today. Reply within 48 business hours.',
      'terr.3t': 'Swap or sale',
      'terr.3d': 'In a swap, you receive one or more finished homes in exchange for the land. In a sale, you receive the agreed amount. All under contract, with a registered deed.',
      'terr.formChapeu': 'Tell us about your land',
      'terr.formTitulo': 'Send the details and we <em>reply on WhatsApp.</em>',
      'terr.nome': 'Your name',
      'terr.bairro': 'Neighbourhood and city of the plot',
      'terr.area': 'Approximate area (m²)',
      'terr.interesse': 'What you prefer',
      'terr.permuta': 'Swap for a finished home',
      'terr.venda': 'Sell the land',
      'terr.naoSei': 'Not sure yet',
      'terr.doc': 'Paperwork',
      'terr.docEscritura': 'Registered deed',
      'terr.docContrato': 'Purchase agreement',
      'terr.docInventario': 'In probate or being regularised',
      'terr.docNaoSei': 'I can’t say',
      'terr.obs': 'Anything else we should know',
      'terr.enviar': 'Send on WhatsApp',
      'terr.email': 'I’d rather e-mail',
      'terr.nota': 'Sending opens a WhatsApp chat with MB2 with these details already written. Nothing is stored on the site.',
      'terr.porqueChapeu': 'Why MB2',
      'terr.porqueTitulo': 'Fourteen years of building <em>means we keep our word.</em>',
      'terr.p1': 'developments completed in Curitiba, Itapoá and Florianópolis',
      'terr.p2': 'high-end homes completed and sold in Jardim Campeche',
      'terr.p3': 'building sites open in the south of the island right now, with progress published every week',
      'terr.verObras': 'See the projects',
      'terr.verComo': 'How we build',
      'terr.msgAbre': 'Hello! I own a plot of land and would like to talk to MB2.',
      'terr.erro': 'Please fill in at least your name and the neighbourhood of the plot.',
      'terr.semCanal': 'MB2’s WhatsApp is not on the site yet. Please use the phone number in the footer.',
      'terr.assunto': 'I have a plot of land for MB2',
      'rod.base': 'Builder · Campeche, Florianópolis · SC, Brazil',
      'pendente': 'to be confirmed'
    },

    es: {
      'meta.titulo': 'MB2 Incorporações · Casas en Campeche, Florianópolis',
      'meta.desc': 'MB2 Incorporações: 14 años construyendo. Casas de alto nivel en Campeche, en el sur de la isla de Florianópolis, Brasil.',
      'h1': 'MB2 Incorporações · Casas de alto nivel en el sur de la isla, Florianópolis',

      'nav.principal': 'Principal',
      'nav.logo': 'MB2 Incorporações, inicio',
      'nav.obras': 'Obras',
      'nav.como': 'Proceso',
      'nav.comoLongo': 'Cómo construimos',
      'nav.campeche': 'Campeche',
      'nav.campecheLongo': 'Vivir en Campeche',
      'nav.contato': 'Contacto',
      'nav.fale': 'Habla con MB2',
      'nav.idioma': 'Elegir idioma',
      'nav.menuMovel': 'Menú del móvil',
      'nav.abrirMenu': 'Abrir menú',
      'nav.fecharMenu': 'Cerrar menú',
      'zap.msg': '¡Hola! Vi el sitio de MB2 y quiero saber más sobre las casas.',
      'tema.escuro': 'Activar tema oscuro',
      'tema.claro': 'Activar tema claro',

      'hero.aria': 'Presentación',
      'hero.titulo': '14 años construyendo. <em>Hoy, en el sur de la isla.</em>',
      'hero.cta': 'Ver nuestras obras',
      'hero.rolar': 'Desliza para ver',
      'hero.cartao': 'Nuestras casas',
      'hero.tour': 'Recorrido en vídeo',
      'hero.fotoAnt': 'Foto anterior',
      'hero.fotoProx': 'Foto siguiente',
      'hero.foto': 'Foto',
      'hero.pausar': 'Pausar vídeo',
      'hero.continuar': 'Reanudar vídeo',

      'dest.aria': 'Casa destacada',
      'dest.chapeu': 'Casa destacada',
      'dest.cta': 'Quiero ver esta casa',
      'dest.fachada': 'Fachada:',

      'obras.chapeu': 'En construcción ahora',
      'obras.casas': 'Casas en Campeche',
      'obras.residenciais': 'Residenciales',
      'obras.suites': 'suites',
      'obras.vagas': 'plazas de garaje',
      'obras.local': 'Ubicación',
      'obras.areaTipo': 'Superficie y tipología',
      'obras.erro': 'No pudimos cargar la lista de obras. Recarga la página.',
      'obra.casa': 'Casa de alto nivel',

      'obras.titulo': 'Obras en curso en el <em>sur de la isla.</em>',
      'port.chapeu': 'Portafolio',
      'port.titulo': 'Residenciales en <em>Curitiba y Itapoá.</em>',
      'port.dica': 'Desliza para ver',
      'port.aria': 'Residenciales entregados',
      'num.anos': 'años construyendo',
      'num.emp': 'emprendimientos',
      'num.cidades': 'ciudades',
      'cham.titulo': '¿Quieres conocer una casa <em>de MB2?</em>',
      'cham.p': 'Te mostramos la obra de cerca, te enviamos planos y condiciones, y quien responde es el equipo que construye.',
      'cham.casas': 'Ver las casas',

      'hist.aria': 'Sobre MB2',
      'hist.chapeu': 'Constructora desde hace 14 años',
      'hist.titulo': 'Empezamos en Curitiba. <em class="italico">Elegimos Campeche para seguir.</em>',
      'hist.p': 'Vinimos a Florianópolis porque el estilo de vida de la isla y su mercado encajan con las casas que hacemos.',

      'como.chapeu': 'Del terreno a la llave',
      'como.titulo': 'Cómo <em>construimos.</em>',
      'como.1t': 'Terreno y proyecto',
      'como.1d': 'Elegimos el lote y diseñamos la casa a partir de él: la posición del sol, la ventilación y el estilo de vida del sur de la isla.',
      'como.2t': 'Aprobaciones',
      'como.2d': 'Nos ocupamos de la documentación y las licencias antes de iniciar la obra.',
      'como.3t': 'Obra',
      'como.3d': 'Seguimos cada etapa de cerca, desde los cimientos hasta los acabados, con materiales elegidos para el clima de la isla.',
      'como.4t': 'Entrega',
      'como.4d': 'Recibes la casa lista para vivir y sigues hablando con el mismo equipo que la construyó.',

      'camp.chapeu': 'Dónde construimos',
      'camp.titulo': 'Vivir en <em>Campeche.</em>',
      'camp.p': 'Campeche está en el sur de la isla, en Florianópolis. Es un barrio de casas, cerca del mar, con una rutina tranquila y todo lo que pide el día a día.',
      'camp.l1': 'Playa de mar abierto, ideal para caminar y surfear',
      'camp.l2': 'La Isla de Campeche justo frente a la playa',
      'camp.l3': 'Comercios, colegios y restaurantes en el propio barrio',
      'camp.l4': 'Trayecto corto hasta el aeropuerto de la ciudad',
      'camp.fotoAlt': 'Casa de MB2 en Jardim Campeche',

      'cont.chapeu': 'Habla con quien construye',
      'cont.titulo': '¿Quieres conocer una casa de MB2? <em class="italico">Te mostramos la obra de cerca.</em>',
      'cont.1t': 'Conversación directa',
      'cont.1d': 'Sin intermediarios. Quien responde tus dudas sobre proyecto, obra y condiciones es el equipo de MB2.',
      'cont.2t': 'Planos y condiciones',
      'cont.2d': 'Te enviamos planos, imágenes y las condiciones de la casa que te interesó.',
      'cont.3t': 'Visita a la obra',
      'cont.3d': 'Reserva un horario para ver la obra o la casa terminada en Campeche.',
      'cont.chamar': 'Contactar a MB2',
      'cont.agendar': 'Reservar visita',
      'cont.telZap': 'Teléfono y WhatsApp',

      'lanc.aria': 'Lanzamientos',
      'lanc.chapeu': 'Lanzamientos',
      'lanc.titulo': 'Entérate antes de <em class="italico">las próximas casas de MB2.</em>',
      'lanc.email': 'Tu e-mail',
      'lanc.inscrever': 'Suscribirme',
      'lanc.consent': 'Al registrarte aceptas nuestra política de privacidad.',
      'lanc.erroEmail': 'Escribe un e-mail válido, como nombre@ejemplo.com.',
      'lanc.erroConsent': 'Marca la casilla de la política de privacidad para continuar.',
      'lanc.previa': 'Esto es una vista previa: el registro aún no está conectado a una lista de e-mails.',

      'zap.texto': 'Habla con MB2',

      'rod.logo': 'MB2 Incorporações',
      'rod.sociais': 'Redes sociales',
      'rod.instagram': 'Instagram de MB2',
      'rod.facebook': 'Facebook: por confirmar',
      'rod.youtube': 'YouTube: por confirmar',
      'rod.emp': 'Emprendimientos',
      'rod.casas': 'Casas en Campeche',
      'rod.resid': 'Residenciales',
      'rod.inst': 'Institucional',
      'rod.sobre': 'Sobre MB2',
      'rod.como': 'Cómo construimos',
      'rod.campeche': 'Vivir en Campeche',
      'rod.privacidade': 'Política de privacidad',
      'rod.contato': 'Contacto',
      'rod.telefone': 'Teléfono',
      'rod.email': 'E-mail',
      'rod.endereco': 'Dirección',
      'rod.cnpj': 'CNPJ',
      'obras.texto': 'Cada obra tiene su propia página, con la etapa actual y las novedades de la semana. Es la misma página que está en el cartel de la obra.',
      'entr.chapeu': 'Entregadas',
      'entr.titulo': 'Casas listas en <em>Campeche.</em>',
      'obras.emConstrucao': 'En construcción',
      'obras.entregue': 'Entregada',
      'obras.vendida': 'Vendida',
      'obra.etapaAtual': 'Etapa actual',
      'obra.etapaEmBreve': 'Primera actualización en breve',
      'obra.inicio': 'Inicio',
      'obra.previsao': 'Entrega prevista',
      'obra.atualizadoEm': 'actualizado el',
      'obra.semFoto': 'Foto de la semana en breve',
      'etapa.terreno': 'Terreno',
      'etapa.fundacao': 'Cimientos',
      'etapa.estrutura': 'Estructura',
      'etapa.alvenaria': 'Albañilería',
      'etapa.cobertura': 'Cubierta',
      'etapa.instalacoes': 'Instalaciones',
      'etapa.acabamento': 'Acabados',
      'etapa.entrega': 'Entrega',
      'nav.terreno': 'Terrenos',
      'nav.terrenoLongo': '¿Tienes un terreno?',
      'rod.construcao': 'En construcción',
      'terr.chapeu': '¿Tienes un terreno?',
      'terr.titulo': 'Construye con MB2, por permuta o compra.',
      'terr.p': 'Evaluamos tu lote en Campeche y alrededores y respondemos en hasta 48 horas hábiles.',
      'terr.cta': 'Hablar de mi terreno',
      'zap.msgObra': '¡Hola! Vi la obra {obra} en el sitio de MB2 y quiero saber más.',
      'obra.metaTitulo': 'Obra · MB2 Incorporações',
      'obra.metaDesc': 'Avance de la obra, etapa actual y fotos semanales. MB2 Incorporações, Campeche, Florianópolis.',
      'obra.migalhasAria': 'Estás en',
      'obra.voltar': 'Todas las obras',
      'obra.cta': 'Hablar de esta obra',
      'obra.verAtualizacoes': 'Ver el avance',
      'obra.andamentoChapeu': 'Avance de la obra',
      'obra.andamentoTitulo': 'Semana a semana, <em>del terreno a la llave.</em>',
      'obra.andamentoTexto': 'Quien compró la sigue por aquí. Quien está decidiendo ve cómo construye MB2.',
      'obra.etapasAria': 'Etapas de la obra',
      'obra.semAtualizacao': 'La obra acaba de empezar. La primera actualización entra aquí la próxima semana.',
      'obra.videoChapeu': 'En video',
      'obra.galeriaChapeu': 'Fotos',
      'obra.chamadaTitulo': '¿Quieres saber más <em>sobre esta obra?</em>',
      'obra.outras': 'Ver otras obras',
      'obra.naoEncontrada': 'No encontramos esa obra. Vuelve a la lista y elige de nuevo.',
      'terr.metaTitulo': '¿Tienes un terreno? Construye con MB2',
      'terr.metaDesc': 'Permuta o compra de terrenos en Campeche y el sur de la isla. MB2 evalúa tu lote y responde en hasta 48 horas hábiles.',
      'terr.h1': 'Construye con MB2, <em>por permuta o compra.</em>',
      'terr.lede': 'Buscamos lotes en Campeche y en el sur de la isla para las próximas casas. Puedes vender el terreno o cambiarlo por unidades listas, sin poner dinero en la obra.',
      'terr.1t': 'Nos cuentas del terreno',
      'terr.1d': 'Barrio, metraje y situación de la documentación. No hace falta proyecto ni saber el valor.',
      'terr.2t': 'MB2 evalúa',
      'terr.2d': 'Estudiamos lo que la ley permite construir en el lote y cuánto vale hoy. Respuesta en hasta 48 horas hábiles.',
      'terr.3t': 'Permuta o compra',
      'terr.3d': 'En la permuta recibes una o más casas listas a cambio del terreno. En la compra recibes el valor acordado. Todo por contrato, con escritura.',
      'terr.formChapeu': 'Cuéntanos de tu terreno',
      'terr.formTitulo': 'Envía los datos y te <em>respondemos por WhatsApp.</em>',
      'terr.nome': 'Tu nombre',
      'terr.bairro': 'Barrio y ciudad del terreno',
      'terr.area': 'Superficie aproximada (m²)',
      'terr.interesse': 'Qué prefieres',
      'terr.permuta': 'Permuta por casa lista',
      'terr.venda': 'Venta del terreno',
      'terr.naoSei': 'Todavía no sé',
      'terr.doc': 'Documentación',
      'terr.docEscritura': 'Escritura registrada',
      'terr.docContrato': 'Contrato de compraventa',
      'terr.docInventario': 'En sucesión o regularización',
      'terr.docNaoSei': 'No sabría decir',
      'terr.obs': 'Algo más que debamos saber',
      'terr.enviar': 'Enviar por WhatsApp',
      'terr.email': 'Prefiero por e-mail',
      'terr.nota': 'Al enviar se abre la conversación en el WhatsApp de MB2 con estos datos ya escritos. Nada queda guardado en el sitio.',
      'terr.porqueChapeu': 'Por qué MB2',
      'terr.porqueTitulo': 'Quien construye hace 14 años <em>cumple lo acordado.</em>',
      'terr.p1': 'emprendimientos entregados en Curitiba, Itapoá y Florianópolis',
      'terr.p2': 'casas de alto estándar entregadas y vendidas en Jardim Campeche',
      'terr.p3': 'obras abiertas ahora en el sur de la isla, con avance publicado cada semana',
      'terr.verObras': 'Ver las obras',
      'terr.verComo': 'Cómo construimos',
      'terr.msgAbre': '¡Hola! Tengo un terreno y quiero hablar con MB2.',
      'terr.erro': 'Completa al menos tu nombre y el barrio del terreno.',
      'terr.semCanal': 'El WhatsApp de MB2 todavía no está en el sitio. Usa el teléfono del pie de página.',
      'terr.assunto': 'Tengo un terreno para MB2',
      'rod.base': 'Constructora · Campeche, Florianópolis · SC, Brasil',
      'pendente': 'por confirmar'
    },

    fr: {
      'meta.titulo': 'MB2 Incorporações · Maisons à Campeche, Florianópolis',
      'meta.desc': 'MB2 Incorporações : 14 ans de construction. Maisons haut de gamme à Campeche, au sud de l’île de Florianópolis, Brésil.',
      'h1': 'MB2 Incorporações · Maisons haut de gamme au sud de l’île, Florianópolis',

      'nav.principal': 'Principal',
      'nav.logo': 'MB2 Incorporações, accueil',
      'nav.obras': 'Réalisations',
      'nav.como': 'Processus',
      'nav.comoLongo': 'Notre méthode',
      'nav.campeche': 'Campeche',
      'nav.campecheLongo': 'Vivre à Campeche',
      'nav.contato': 'Contact',
      'nav.fale': 'Parler à MB2',
      'nav.idioma': 'Choisir la langue',
      'nav.menuMovel': 'Menu mobile',
      'nav.abrirMenu': 'Ouvrir le menu',
      'nav.fecharMenu': 'Fermer le menu',
      'zap.msg': 'Bonjour ! J’ai découvert MB2 sur le site et j’aimerais en savoir plus sur les maisons.',
      'tema.escuro': 'Activer le thème sombre',
      'tema.claro': 'Activer le thème clair',

      'hero.aria': 'Présentation',
      'hero.titulo': '14 ans de construction. <em>Aujourd’hui, au sud de l’île.</em>',
      'hero.cta': 'Voir nos réalisations',
      'hero.rolar': 'Faites défiler',
      'hero.cartao': 'Nos maisons',
      'hero.tour': 'Visite en vidéo',
      'hero.fotoAnt': 'Photo précédente',
      'hero.fotoProx': 'Photo suivante',
      'hero.foto': 'Photo',
      'hero.pausar': 'Mettre la vidéo en pause',
      'hero.continuar': 'Reprendre la vidéo',

      'dest.aria': 'Maison à la une',
      'dest.chapeu': 'Maison à la une',
      'dest.cta': 'Je veux voir cette maison',
      'dest.fachada': 'Façade :',

      'obras.chapeu': 'En construction',
      'obras.casas': 'Maisons à Campeche',
      'obras.residenciais': 'Résidences',
      'obras.suites': 'suites',
      'obras.vagas': 'places de parking',
      'obras.local': 'Lieu',
      'obras.areaTipo': 'Surface et typologie',
      'obras.erro': 'Impossible de charger la liste des réalisations. Rechargez la page.',
      'obra.casa': 'Maison haut de gamme',

      'obras.titulo': 'Chantiers en cours dans le <em>sud de l’île.</em>',
      'port.chapeu': 'Portfolio',
      'port.titulo': 'Résidences à <em>Curitiba et Itapoá.</em>',
      'port.dica': 'Faites glisser pour voir',
      'port.aria': 'Résidences livrées',
      'num.anos': 'ans de construction',
      'num.emp': 'programmes',
      'num.cidades': 'villes',
      'cham.titulo': 'Envie de découvrir une maison <em>MB2 ?</em>',
      'cham.p': 'Nous vous montrons le chantier de près, nous envoyons plans et conditions, et c’est l’équipe qui construit qui vous répond.',
      'cham.casas': 'Voir les maisons',

      'hist.aria': 'À propos de MB2',
      'hist.chapeu': 'Constructeur depuis 14 ans',
      'hist.titulo': 'Nous avons commencé à Curitiba. <em class="italico">Nous avons choisi Campeche pour continuer.</em>',
      'hist.p': 'Nous sommes venus à Florianópolis parce que l’art de vivre de l’île et son marché correspondent aux maisons que nous construisons.',

      'como.chapeu': 'Du terrain aux clés',
      'como.titulo': 'Comment <em>nous construisons.</em>',
      'como.1t': 'Terrain et projet',
      'como.1d': 'Nous choisissons le terrain et dessinons la maison à partir de lui : la course du soleil, la ventilation et l’art de vivre du sud de l’île.',
      'como.2t': 'Autorisations',
      'como.2d': 'Nous nous occupons des documents et des permis avant d’ouvrir le chantier.',
      'como.3t': 'Chantier',
      'como.3d': 'Nous suivons chaque étape de près, des fondations aux finitions, avec des matériaux choisis pour le climat de l’île.',
      'como.4t': 'Livraison',
      'como.4d': 'Vous recevez la maison prête à habiter et vous continuez à parler à l’équipe qui l’a construite.',

      'camp.chapeu': 'Où nous construisons',
      'camp.titulo': 'Vivre à <em>Campeche.</em>',
      'camp.p': 'Campeche se trouve au sud de l’île de Florianópolis. C’est un quartier de maisons, près de la mer, au rythme tranquille, avec tout ce qu’il faut au quotidien.',
      'camp.l1': 'Plage de pleine mer, idéale pour marcher et surfer',
      'camp.l2': 'L’île de Campeche juste en face de la plage',
      'camp.l3': 'Commerces, écoles et restaurants dans le quartier',
      'camp.l4': 'À quelques minutes de l’aéroport de la ville',
      'camp.fotoAlt': 'Maison MB2 à Jardim Campeche',

      'cont.chapeu': 'Parlez à ceux qui construisent',
      'cont.titulo': 'Envie de découvrir une maison MB2 ? <em class="italico">Nous vous montrons le chantier de près.</em>',
      'cont.1t': 'Échange direct',
      'cont.1d': 'Sans intermédiaire. C’est l’équipe MB2 qui répond à vos questions sur le projet, le chantier et les conditions.',
      'cont.2t': 'Plans et conditions',
      'cont.2d': 'Nous envoyons les plans, les images et les conditions de la maison qui vous intéresse.',
      'cont.3t': 'Visite du chantier',
      'cont.3d': 'Prenez rendez-vous pour voir le chantier ou la maison terminée à Campeche.',
      'cont.chamar': 'Contacter MB2',
      'cont.agendar': 'Planifier une visite',
      'cont.telZap': 'Téléphone et WhatsApp',

      'lanc.aria': 'Lancements',
      'lanc.chapeu': 'Lancements',
      'lanc.titulo': 'Soyez informé avant tout le monde <em class="italico">des prochaines maisons MB2.</em>',
      'lanc.email': 'Votre e-mail',
      'lanc.inscrever': 'S’inscrire',
      'lanc.consent': 'En vous inscrivant, vous acceptez notre politique de confidentialité.',
      'lanc.erroEmail': 'Saisissez un e-mail valide, par exemple nom@exemple.com.',
      'lanc.erroConsent': 'Cochez la case de la politique de confidentialité pour continuer.',
      'lanc.previa': 'Ceci est un aperçu : l’inscription n’est pas encore reliée à une liste d’e-mails.',

      'zap.texto': 'Parler à MB2',

      'rod.logo': 'MB2 Incorporações',
      'rod.sociais': 'Réseaux sociaux',
      'rod.instagram': 'Instagram de MB2',
      'rod.facebook': 'Facebook : à confirmer',
      'rod.youtube': 'YouTube : à confirmer',
      'rod.emp': 'Programmes',
      'rod.casas': 'Maisons à Campeche',
      'rod.resid': 'Résidences',
      'rod.inst': 'L’entreprise',
      'rod.sobre': 'À propos de MB2',
      'rod.como': 'Notre méthode',
      'rod.campeche': 'Vivre à Campeche',
      'rod.privacidade': 'Politique de confidentialité',
      'rod.contato': 'Contact',
      'rod.telefone': 'Téléphone',
      'rod.email': 'E-mail',
      'rod.endereco': 'Adresse',
      'rod.cnpj': 'CNPJ',
      'obras.texto': 'Chaque chantier a sa propre page, avec l’étape en cours et les nouvelles de la semaine. C’est la page indiquée sur le panneau du chantier.',
      'entr.chapeu': 'Livrées',
      'entr.titulo': 'Maisons terminées à <em>Campeche.</em>',
      'obras.emConstrucao': 'En construction',
      'obras.entregue': 'Livrée',
      'obras.vendida': 'Vendue',
      'obra.etapaAtual': 'Étape en cours',
      'obra.etapaEmBreve': 'Première mise à jour bientôt',
      'obra.inicio': 'Début',
      'obra.previsao': 'Livraison prévue',
      'obra.atualizadoEm': 'mis à jour le',
      'obra.semFoto': 'Photo de la semaine bientôt',
      'etapa.terreno': 'Terrain',
      'etapa.fundacao': 'Fondations',
      'etapa.estrutura': 'Structure',
      'etapa.alvenaria': 'Maçonnerie',
      'etapa.cobertura': 'Toiture',
      'etapa.instalacoes': 'Réseaux',
      'etapa.acabamento': 'Finitions',
      'etapa.entrega': 'Livraison',
      'nav.terreno': 'Terrains',
      'nav.terrenoLongo': 'Vous avez un terrain ?',
      'rod.construcao': 'En construction',
      'terr.chapeu': 'Vous avez un terrain ?',
      'terr.titulo': 'Construisez avec MB2, par échange ou vente.',
      'terr.p': 'Nous évaluons votre terrain à Campeche et dans les environs et répondons sous 48 heures ouvrées.',
      'terr.cta': 'Parler de mon terrain',
      'zap.msgObra': 'Bonjour ! J’ai vu le chantier {obra} sur le site de MB2 et j’aimerais en savoir plus.',
      'obra.metaTitulo': 'Chantier · MB2 Incorporações',
      'obra.metaDesc': 'Avancement du chantier, étape en cours et photos hebdomadaires. MB2 Incorporações, Campeche, Florianópolis.',
      'obra.migalhasAria': 'Vous êtes ici',
      'obra.voltar': 'Tous les chantiers',
      'obra.cta': 'Parler de ce chantier',
      'obra.verAtualizacoes': 'Voir l’avancement',
      'obra.andamentoChapeu': 'Avancement du chantier',
      'obra.andamentoTitulo': 'Semaine après semaine, <em>du terrain aux clés.</em>',
      'obra.andamentoTexto': 'Les acheteurs suivent leur maison ici. Ceux qui hésitent voient comment MB2 construit.',
      'obra.etapasAria': 'Étapes du chantier',
      'obra.semAtualizacao': 'Le chantier vient de commencer. La première mise à jour arrive ici la semaine prochaine.',
      'obra.videoChapeu': 'En vidéo',
      'obra.galeriaChapeu': 'Photos',
      'obra.chamadaTitulo': 'Envie d’en savoir plus <em>sur ce chantier ?</em>',
      'obra.outras': 'Voir d’autres chantiers',
      'obra.naoEncontrada': 'Chantier introuvable. Revenez à la liste et choisissez à nouveau.',
      'terr.metaTitulo': 'Vous avez un terrain ? Construisez avec MB2',
      'terr.metaDesc': 'Échange ou achat de terrains à Campeche et dans le sud de l’île. MB2 évalue votre terrain et répond sous 48 heures ouvrées.',
      'terr.h1': 'Construisez avec MB2, <em>par échange ou vente.</em>',
      'terr.lede': 'Nous cherchons des terrains à Campeche et dans le sud de l’île pour nos prochaines maisons. Vous pouvez vendre le terrain, ou l’échanger contre des maisons terminées, sans investir dans les travaux.',
      'terr.1t': 'Vous nous parlez du terrain',
      'terr.1d': 'Quartier, surface et état des papiers. Pas besoin de projet ni de prix.',
      'terr.2t': 'MB2 évalue',
      'terr.2d': 'Nous étudions ce que la loi permet de construire et la valeur actuelle du terrain. Réponse sous 48 heures ouvrées.',
      'terr.3t': 'Échange ou vente',
      'terr.3d': 'Dans l’échange, vous recevez une ou plusieurs maisons terminées contre le terrain. Dans la vente, vous recevez le montant convenu. Le tout par contrat, avec acte notarié.',
      'terr.formChapeu': 'Parlez-nous de votre terrain',
      'terr.formTitulo': 'Envoyez les informations et nous <em>répondons sur WhatsApp.</em>',
      'terr.nome': 'Votre nom',
      'terr.bairro': 'Quartier et ville du terrain',
      'terr.area': 'Surface approximative (m²)',
      'terr.interesse': 'Ce que vous préférez',
      'terr.permuta': 'Échange contre une maison terminée',
      'terr.venda': 'Vente du terrain',
      'terr.naoSei': 'Je ne sais pas encore',
      'terr.doc': 'Documents',
      'terr.docEscritura': 'Acte enregistré',
      'terr.docContrato': 'Compromis de vente',
      'terr.docInventario': 'En succession ou en régularisation',
      'terr.docNaoSei': 'Je ne sais pas',
      'terr.obs': 'Autre chose à savoir',
      'terr.enviar': 'Envoyer sur WhatsApp',
      'terr.email': 'Je préfère par e-mail',
      'terr.nota': 'L’envoi ouvre une conversation WhatsApp avec MB2, ces informations déjà écrites. Rien n’est enregistré sur le site.',
      'terr.porqueChapeu': 'Pourquoi MB2',
      'terr.porqueTitulo': 'Quatorze ans de construction, <em>parole tenue.</em>',
      'terr.p1': 'programmes livrés à Curitiba, Itapoá et Florianópolis',
      'terr.p2': 'maisons haut de gamme livrées et vendues à Jardim Campeche',
      'terr.p3': 'chantiers ouverts en ce moment dans le sud de l’île, avec l’avancement publié chaque semaine',
      'terr.verObras': 'Voir les chantiers',
      'terr.verComo': 'Notre méthode',
      'terr.msgAbre': 'Bonjour ! J’ai un terrain et j’aimerais parler avec MB2.',
      'terr.erro': 'Indiquez au moins votre nom et le quartier du terrain.',
      'terr.semCanal': 'Le WhatsApp de MB2 n’est pas encore sur le site. Utilisez le téléphone en bas de page.',
      'terr.assunto': 'J’ai un terrain pour MB2',
      'rod.base': 'Constructeur · Campeche, Florianópolis · SC, Brésil',
      'pendente': 'à confirmer'
    }
  };

  /* ── português de strings que NÃO existem no HTML ──
     O snapshot abaixo cobre tudo que está escrito na página. Estas aqui são
     montadas por js/site.js (rótulos que alternam, grade de obras, contato),
     então não há de onde tirar o português automaticamente. */
  var PT_EXTRA = {
    'nav.fecharMenu': 'Fechar menu',
    'zap.msg': 'Olá! Vim pelo site da MB2 e quero saber mais sobre as casas.',
    'tema.claro': 'Ativar tema claro',
    'hero.cartao': 'Nossas casas',
    'hero.tour': 'Tour em vídeo',
    'hero.foto': 'Foto',
    'hero.continuar': 'Continuar vídeo',
    'dest.fachada': 'Fachada:',
    'obras.suites': 'suítes',
    'obras.vagas': 'vagas',
    'obras.local': 'Local',
    'obras.areaTipo': 'Área e tipologia',
    'obras.erro': 'Não consegui carregar a lista de obras. Recarregue a página.',
    'obra.casa': 'Casa alto padrão',
    'camp.fotoAlt': 'Casa da MB2 no Jardim Campeche',
    'cont.telZap': 'Telefone e WhatsApp',
    'lanc.erroEmail': 'Digite um e-mail válido, como nome@exemplo.com.',
    'lanc.erroConsent': 'Marque a caixa da política de privacidade para continuar.',
    'lanc.previa': 'Esta é uma prévia: o cadastro ainda não está ligado a uma lista de e-mails.',
    'rod.telefone': 'Telefone',
    'rod.email': 'E-mail',
    'rod.endereco': 'Endereço',
    'rod.cnpj': 'CNPJ',
    'obras.emConstrucao': 'Em construção',
    'obras.entregue': 'Entregue',
    'obras.vendida': 'Vendida',
    'obra.etapaAtual': 'Etapa atual',
    'obra.etapaEmBreve': 'Primeira atualização em breve',
    'obra.inicio': 'Início',
    'obra.previsao': 'Previsão',
    'obra.atualizadoEm': 'atualizado em',
    'obra.semFoto': 'Foto da semana em breve',
    'etapa.terreno': 'Terreno',
    'etapa.fundacao': 'Fundação',
    'etapa.estrutura': 'Estrutura',
    'etapa.alvenaria': 'Alvenaria',
    'etapa.cobertura': 'Cobertura',
    'etapa.instalacoes': 'Instalações',
    'etapa.acabamento': 'Acabamento',
    'etapa.entrega': 'Entrega',
    'zap.msgObra': 'Olá! Vi a obra {obra} no site da MB2 e quero saber mais.',
    'terr.msgAbre': 'Olá! Tenho um terreno e quero falar com a MB2.',
    'terr.erro': 'Preencha pelo menos o seu nome e o bairro do terreno.',
    'terr.semCanal': 'O WhatsApp da MB2 ainda não está cadastrado no site. Use o telefone do rodapé.',
    'terr.assunto': 'Tenho um terreno para a MB2',
    'pendente': 'a confirmar'
  };

  /* ── snapshot do português direto do HTML ──
     Evita manter uma cópia do PT aqui dentro (que sairia de sincronia). */
  var PT = { html: {}, attr: {} };
  function tirarSnapshot() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (!(k in PT.html)) PT.html[k] = el.innerHTML;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      parsePares(el).forEach(function (par) {
        var id = par.chave;
        if (!(id in PT.attr)) PT.attr[id] = el.getAttribute(par.attr) || '';
      });
    });
  }

  function parsePares(el) {
    return (el.getAttribute('data-i18n-attr') || '').split(';').map(function (p) {
      var i = p.indexOf(':');
      if (i < 0) return null;
      return { attr: p.slice(0, i).trim(), chave: p.slice(i + 1).trim() };
    }).filter(Boolean);
  }

  function detectar() {
    try {
      var salvo = localStorage.getItem(STORAGE);
      if (salvo && SUPORTADOS.indexOf(salvo) >= 0) return salvo;
    } catch (e) { /* localStorage bloqueado: cai na detecção do navegador */ }
    var langs = navigator.languages || [navigator.language || 'pt'];
    for (var i = 0; i < langs.length; i++) {
      var base = String(langs[i]).toLowerCase().slice(0, 2);
      if (SUPORTADOS.indexOf(base) >= 0) return base;
    }
    return 'pt';
  }

  var atual = 'pt';

  function ptDe(chave) {
    if (PT.html[chave] != null) return PT.html[chave];
    if (PT_EXTRA[chave] != null) return PT_EXTRA[chave];
    if (PT.attr[chave] != null) return PT.attr[chave];
    return '';
  }

  function t(chave) {
    if (atual !== 'pt') {
      var d = T[atual] || {};
      if (d[chave] != null) return d[chave];
    }
    return ptDe(chave);           // sem tradução: português
  }

  function semTags(s) { return String(s).replace(/<[^>]*>/g, ''); }

  function aplicar(lang) {
    atual = SUPORTADOS.indexOf(lang) >= 0 ? lang : 'pt';
    var dic = atual === 'pt' ? null : (T[atual] || {});

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      var v = (dic && dic[k] != null) ? dic[k] : ptDe(k);
      if (v !== '' && el.innerHTML !== v) el.innerHTML = v;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      parsePares(el).forEach(function (par) {
        var v = (dic && dic[par.chave] != null) ? dic[par.chave] : ptDe(par.chave);
        if (v !== '') el.setAttribute(par.attr, semTags(v));
      });
    });

    document.documentElement.lang = LOCALE[atual] || 'pt-BR';
    try { localStorage.setItem(STORAGE, atual); } catch (e) { /* sem persistência */ }

    var cur = document.getElementById('langCur');
    if (cur) cur.textContent = atual.toUpperCase();
    document.querySelectorAll('#langList li').forEach(function (li) {
      var on = li.getAttribute('data-lang') === atual;
      li.classList.toggle('active', on);
      li.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    // Avisa quem monta texto por JS (grade de obras, contato, rótulos do topo).
    document.dispatchEvent(new CustomEvent('mb2:lang', { detail: { lang: atual, locale: LOCALE[atual] } }));
  }

  /* ── seletor de idioma ── */
  function ligarSeletor() {
    var caixa = document.getElementById('lang');
    if (!caixa) return;
    var btn = document.getElementById('langBtn');
    var lista = document.getElementById('langList');
    // A lista começa com "hidden" no HTML: fica fechada mesmo se o CSS não carregar
    function abrir(sim) {
      caixa.classList.toggle('open', sim);
      lista.hidden = !sim;
      btn.setAttribute('aria-expanded', sim ? 'true' : 'false');
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      abrir(!caixa.classList.contains('open'));
    });
    document.addEventListener('click', function () { abrir(false); });
    caixa.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { abrir(false); btn.focus(); }
    });

    document.querySelectorAll('#langList li').forEach(function (li) {
      li.tabIndex = 0;
      var troca = function () {
        // Troca instantânea, sem recarregar a página (o Google Tradutor recarregava).
        aplicar(li.getAttribute('data-lang'));
        abrir(false);
      };
      li.addEventListener('click', troca);
      li.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); troca(); }
      });
    });
  }

  tirarSnapshot();
  aplicar(detectar());
  ligarSeletor();

  window.MB2_I18N = {
    t: t,
    aplicar: aplicar,
    get lang() { return atual; },
    get locale() { return LOCALE[atual] || 'pt-BR'; }
  };
})();
