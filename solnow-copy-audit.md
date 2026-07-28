# Solnow — Auditoría de Copy (LLM-friendly)

> Documento generado para que un agente de IA pueda analizar y tomar decisiones de copywriting (headlines, CTAs, propuesta de valor, SEO, consistencia de tono) sin tener que leer el código fuente.
> Fuente de verdad del copy: `src/messages/es.json` (ES, idioma principal) y `src/messages/en.json` (EN). Estructura de producto/guías: `src/content/products.ts`. Fecha de referencia del sitio: contenido "Actualizado · junio de 2026".

---

## 1. Resumen ejecutivo

**Qué es Solnow:** "El sistema operativo para flotas de alquiler acuático" (jet skis / motos de agua, principalmente). No se posiciona como "software de reservas" sino como un sistema operativo completo que digitaliza **cuatro áreas**: venta (mostrador + web + WhatsApp + colaboradores), papeleo (contratos con firma digital), operación en tiempo real (check-in QR, dashboard multi-base) y postventa/datos (libro de registro, reseñas, reporting).

**Propuesta de valor central (headline recurrente en todo el sitio):**
> "Los demás te ayudan a **reservar**. Nosotros te ayudamos a **vender, operar y cobrar**."

**Audiencia (ICP):** Operadores de alquiler de motos de agua (jet ski) de **alto volumen**, con **30+ reservas/día**, a menudo **multi-base**, en mercados turísticos (España peninsular, Canarias, Argentina, México). El copy asume: mucho walk-in en mostrador, mucha consulta por WhatsApp, temporada alta con picos de caos, y dolor real con papeleo/contratos en papel.

**Tono:** Directo, conversacional, sin bullshit corporativo, con datos concretos ("70-85% de la facturación entra por mostrador", "50 consultas/día sin responder", "2-3h diarias firmando contratos"). Usa segunda persona ("tu flota", "tu operación"). Frases cortas, contraste "los demás vs. nosotros", metáforas de otros sectores (banca→cajero→app, retail→autopago). Registro más cercano a un pitch de ventas B2B SaaS que a marketing institucional. Bastante repetitivo en estructura entre páginas SEO (mismo patrón: problema → checklist → tabla comparativa → callout → FAQ → CTA).

**Modelo de negocio como argumento de venta:** "No somos un proveedor, somos un partner que cobra cuando tú facturas" — comisión % + coste por conversación de IA + fee por base en volumen, **sin cuota fija**, sin permanencia. Este mensaje se repite en pricing, partner section, FAQ y comparativas.

---

## 2. Arquitectura del sitio

Todas las rutas viven bajo `src/app/[locale]/` con locales `es`/`en` (ES usa `/producto/`, EN usa `/product/` para las mismas fichas de producto vía rewrite de proxy).

| Ruta (slug ES) | Tipo | Propósito |
|---|---|---|
| `/` (home) | Landing principal | Long-form scroll: pitch completo, pricing, onboarding, social proof, FAQ |
| `/producto` (hub) | Hub de producto | Mapa visual (grafo) de las 4 canales → 1 flujo → 2 outputs; enlaza a las 8 fichas de área |
| `/producto/tpv-alquiler-motos-de-agua` | Ficha de producto | TPV de mostrador |
| `/producto/contratos-digitales-firma-electronica` | Ficha de producto | Contratos con firma digital |
| `/producto/agente-ia-whatsapp` | Ficha de producto | Agente de IA en WhatsApp |
| `/producto/recuperar-reservas-abandonadas` | Ficha de producto | "Modo persigue" (recuperación de carritos/consultas) |
| `/producto/portal-colaboradores` | Ficha de producto | Portal de hoteles/agencias con comisiones |
| `/producto/control-flota-tiempo-real` | Ficha de producto | Dashboard operación en vivo, QR check-in |
| `/producto/motor-de-reservas` | Ficha de producto | Motor de reservas online (checkout con pago+contrato) |
| `/producto/datos-unificados` | Ficha de producto | Analítica/dashboard financiero unificado |
| `/software-alquiler-motos-de-agua` | Guía SEO (pilar) | "Software para alquiler de motos de agua" — guía pilar/checklist, keyword genérica |
| `/digitalizar-mostrador-alquiler-motos-de-agua` | Guía SEO how-to | Digitalizar el walk-in de mostrador |
| `/gestion-multi-base-alquiler-motos-de-agua` | Guía SEO how-to | Gestión multi-base |
| `/whatsapp-reservas-motos-de-agua` | Guía SEO how-to | Automatizar WhatsApp con IA |
| `/eliminar-papeleo-alquiler-nautico` | Guía SEO how-to | Eliminar papeleo en temporada alta |
| `/contrato-alquiler-motos-de-agua` | Guía SEO + lead magnet | Plantilla gratis de contrato (PDF) |
| `/normativa-alquiler-motos-de-agua-espana` | Guía SEO legal | Normativa/legal en España |
| `/libro-registro-motos-de-agua` | Guía SEO legal | Libro de registro náutico |
| `/fareharbor-alternativa-motos-de-agua` | Comparativa (alternativa) | Alternativa a FareHarbor |
| `/turitop-alternativa-motos-de-agua` | Comparativa (alternativa) | Alternativa a TuriTop |
| `/fareharbor-vs-solnow` | Comparativa (vs) | Head-to-head FareHarbor vs Solnow |
| `/turitop-vs-solnow` | Comparativa (vs) | Head-to-head TuriTop vs Solnow |
| `/mejores-software-reservas-actividades-acuaticas` | Comparativa (listicle) | "Mejores software" — incluye FareHarbor, TuriTop, Bookeo, Regiondo, Solnow |
| `/software-reservas-motos-de-agua-tenerife` | Guía geo | SEO local Tenerife |
| `/software-reservas-motos-de-agua-gran-canaria` | Guía geo | SEO local Gran Canaria |
| `/software-reservas-motos-de-agua-canarias` | Guía geo | SEO local Canarias (multi-isla) |
| `/software-alquiler-motos-de-agua-argentina` | Guía geo | SEO local Argentina |
| `/software-alquiler-motos-de-agua-mexico` | Guía geo | SEO local México |
| `/privacy`, `/terms` | Legal | Política de privacidad / términos |

Todas las guías y comparativas comparten el mismo componente `GuidePage.tsx` (hero + TOC + secciones + FAQ + relacionados + CTA), lo que explica la fuerte plantilla repetida.

---

## 3. Home — copy completo por sección

Orden real de render (`HomeClient.tsx`): **Nav → Hero → PainBar → Pillars → ProductAreas → WhyNow → Comparison → Onboarding → SocialProof → FAQ → FinalCTA → Footer**.

### Nav (`nav.*`)
Producto · Comparativa · Implementación · FAQ | Entrar | **CTA: "Pedir demo"**

### Hero (`hero.*`) — variante "a" es la que se usa en producción (`Hero variant="a"`)
- **H1 (variante a):** "Atiende el doble de reservas *sin contratar* a más personal."
- **Sub:** "Convierte tu empresa de actividades acuáticas en autoservicio: mostrador, web, WhatsApp y colaboradores en un único flujo de reserva, contrato y cobro."
- CTA primario: **"Pedir demo personalizada"** · CTA secundario: "Ver cómo funciona"
- *Variante b (existe en el JSON pero no se usa en `HomeClient`, revisar si está huérfana o reservada para test A/B):* "Tu flota crece. Tu software te *frena*." / "Solnow es el sistema operativo que reemplaza Excel, calendarios y cuatro herramientas inconexas..."

### PainBar (`painBar.*`)
Headline: "Si gestionas 30+ reservas al día, ya sabes que sumar volumen significa **sumar caos. O sumar personal.**"
Tres stats: **50** consultas/día sin respuesta (15-25 reservas perdidas/semana) · **2-3h** diarias quemadas firmando contratos a mano · **0** visibilidad multi-base (te enteras cuando ya escaló).

### Nuclear (`nuclear.*`) — presente en JSON, verificar si se renderiza en la página actual
"Los demás te ayudan a **reservar**. Nosotros te ayudamos a **vender** y a **operar**." + lede: "Somos los únicos que digitalizamos las cuatro áreas de tu negocio: el agente de IA cierra reservas en WhatsApp 24/7, y el sistema controla la operación en vivo durante la actividad."
*(Nota: este bloque no aparece listado en el import de `HomeClient.tsx`; puede estar deprecado, en pruebas, o embebido dentro de otro componente — confirmar antes de asumir que es visible.)*

### Pillars (`pillars.*`) — sección "04 · Por qué somos distintos"
Título: "Los demás te ayudan a reservar. Nosotros te ayudamos a vender, operar y **cobrar**."
Tres pilares:
1. **"Tus clientes se gestionan solos, llegues por donde llegues"** — mostrador, web, WhatsApp, colaboradores en un flujo; firma legal y pago sin que el equipo persiga papeles.
2. **"No te damos un software: te dejamos la operación andando"** — instalación, carga de flota, capacitación, optimización; "solo cobramos cuando tú facturas. Socio de crecimiento, no proveedor."
3. **"Vertical de actividades acuáticas: tiempo real + IA que cierra"** — dashboard en vivo, QR de embarque, multi-base + agente de IA en WhatsApp.

### Product Areas (`product.home.*`) — sección "05 · El producto"
Título: "Cuatro canales. Un solo flujo." CTA de tarjetas: "Ver cómo funciona" / "Ver". Enlaza a las 8 fichas de producto (ver sección 4).

### WhyNow (`whyNow.*`) — sección "06 · Por qué ahora"
Título: "El self-service que transformó la banca y el retail llega al turismo de experiencias."
Escalera de analogías: Banca (Caja→Cajero→app) · Retail (Cajero→Autopago) · Restauración (Camarero→Quiosco de autopedido) · **Turismo de experiencias (Mostrador manual→Solnow)** ← "ESTÁS AQUÍ".

### Comparison (`comparison.*`) — sección "07 · Comparativa"
Título: "Cómo nos comparamos con las otras opciones que estás evaluando"
4 columnas: Motores genéricos (FareHarbor·Bookeo) · Software watersports (verticales near-water) · Solución propia con IA (build-it-yourself) · **Solnow (sistema operativo completo)**.
8 filas de capacidad: motor de reservas, vertical acuático, operación en tiempo real, IA conversacional que cierra, integraciones OTAs náuticas, cumplimiento legal del sector, soporte en temporada alta, tiempo a producción (Semanas/Semanas/6-12 meses/**Días**).
Cierre: *"Construir desde cero tiene sentido si tu producto es tu diferencial. Si tu diferencial es operar motos en el agua, cada mes que dedicas a programar es un mes que no escalas."*

### Partner (`partner.*`) — sección "08 · Modelo de partner"
Título: "No somos un proveedor. Somos un partner que cobra cuando tú facturas."
- **"0% cuota fija"** — Incentivos alineados: "% sobre reservas + coste por conversación IA. Sin cuota fija. Si no facturas, no cobramos."
- **"95% del trabajo"** — Delegación total: "Web, sistema, IA, configuración, optimización. Tú operas activos, nosotros operamos tu negocio digital."
- **"Sin tickets"** — Soporte como partner: capacitación, carga de activos, ayuda con precios/fotos, disponibilidad real en temporada alta.

### Pricing (`pricing.*`) — sección "07 · Pricing" (numeración duplicada con Comparison, revisar)
Título: "Tres planes. Un modelo alineado." Lede: "Pagas por uso real: comisión sobre lo que generamos, conversaciones de IA y un fee por base cuando ya estás en volumen. Sin sorpresas."
- **Starter** — "Para arrancar con una sola base sin fee fijo." CTA: "Empezar con Starter". Soporte email 48h.
- **Pro** (badge "Más elegido") — "El plan para operadores serios con varias bases." CTA: "Pedir demo del plan Pro". Soporte WhatsApp 24h. Anual: "4 meses gratis · 33%".
- **Scale** — "Para grupos multi-base con operación crítica." CTA: "Hablar con el equipo". Soporte WhatsApp prioritario 8h.
Facts: pago mensual vía Stripe Connect · sin permanencia · migración incluida en todos los planes · datos exportables CSV/JSON.
Incluye una **calculadora interactiva** ("¿Cuánto pagarías cada mes?") con inputs de bases, reservas/mes, ticket medio, conversaciones IA, % vía Solnow.

### Onboarding (`onboarding.*`) — sección "09 · Implementación"
Título: "En 7 días tu operación digital corre sobre Solnow." Lede: "Nosotros hacemos el 95% del trabajo de implementación. Tú sigues operando."
Días 1 (Kickoff) → 2-4 (Configuración) → 5-6 (Mostrador/web/integraciones) → 7 (Go-live), cada uno con "tu trabajo" mínimo (ej. "Estar 90 min en una llamada", "Mandarnos fotos y revisar precios").
Mini-FAQ propio: web actual, datos históricos, soporte en pico de temporada.
CTA: "¿Quieres ver cómo sería tu implementación específica? Te montamos una demo con tu flota real." Botón: "Pedir demo".

### Social Proof (`socialProof.*`) — sección "10 · Operadores con Solnow en producción"
3 testimonios (sin nombre/atribución de empresa visible en el JSON, solo quote + KPI label):
1. "Pasamos de 8 a 22 reservas/día sin contratar a nadie. La IA cierra el 70% de las consultas de WhatsApp antes de que abramos." (reservas/día)
2. "Por primera vez en cinco años veo la operación de las tres bases en una sola pantalla. Y lo veo desde el móvil." (paneles → 1)
3. "Quité tres herramientas, dos hojas de cálculo y una persona en backoffice. Solnow paga su % solo con eso." (coste admin.)
Logos/partners: LANZADERA (empresa acelerada) · VIATOR (partner OTAs) · GETYOURGUIDE (integración nativa) · STRIPE (verified partner).

### FAQ (`faq.*`) — sección "11 · FAQ"
8 preguntas: coste/modelo de comisión, funcionamiento offline en base, qué pasa con los datos si te vas, contratos de menores, integración Viator/GetYourGuide (con matiz: "las OTAs son el canal de menor volumen... un complemento, no el centro"), precios por temporada, facturación mensual vía Stripe Connect.

### Final CTA (`finalCta.*`) — sección "12 · Demo"
Headline: "¿Te suena alguno de **estos problemas**?" — 3 problemas: techo operativo/caos, pérdida de control por base, "cada finde de pico es una carrera contra el reloj y un riesgo legal".
**CTA principal del sitio:** "Pedir demo personalizada con tu flota real". Nota: "Te montamos la demo con tus motos, tus bases y tu volumen real · 30 minutos · sin compromiso". Incluye selector de calendario embebido.

### Footer (`footer.*`)
Tagline: "El sistema operativo para empresas de alquiler acuático con alto volumen. Hecho en Valencia, operado en el Mediterráneo."
Bloques: Legal (Privacidad, Términos) · Recursos (enlaza a las 8 guías how-to) · Comparativas (5 páginas de comparación) · Zonas (Tenerife, Gran Canaria, Canarias, Argentina, México).
Nota curiosa: `"status": "Todos los sistemas operativos"` — string ambigua, ver sección 9 (probablemente pretende decir "operativo" en singular como en un status badge "All systems operational", pero en plural suena a otra cosa en español).

---

## 4. Páginas de producto (Hub + 8 fichas de área)

**Hub** (`/producto`): H1 "Cuatro canales. Un solo flujo." Lede: "Cuatro canales de entrada, un mismo flujo de cobro, contrato y check-in, y una única capa de datos y monitorización." Grafo visual: Canales de entrada (WhatsApp/agente IA 24/7, Web/motor de reservas, Mostrador/walk-in·TPV, Colaboradores/hoteles·agencias) → Flujo único (Cobro→Contrato→Check-in QR) → Visibilidad y datos (Monitorización en tiempo real, Reporting y estadísticas). CTA hub: "¿Quieres verlo con tu flota real? Montamos la demo con tus motos, tus bases y tu volumen real. 30 minutos, sin compromiso." → "Pedir demo".

Cada ficha comparte estructura: hero (eyebrow/H1/lede) → 4 bullets → 3-4 secciones largas (problema → cómo funciona paso a paso → detalle) → FAQ (4 preguntas) → guías relacionadas (4 links cruzados a las guías SEO).

| Área | H1 | Ángulo / dato ancla |
|---|---|---|
| **TPV (mostrador)** *(core)* | "El TPV que digitaliza tu mostrador: venta, contrato y cobro en segundos" | Dato ancla: "70-85% de la facturación entra por mostrador". Modo Staff vs Modo Kiosko en el mismo equipo. |
| **Contratos digitales** | "Contratos de alquiler con firma digital: legales, en el móvil del cliente, en 15 segundos" | Firma avanzada eIDAS, anexo para menores, archivo buscable. |
| **Agente de IA en WhatsApp** | "El agente de WhatsApp que atiende, cobra y firma reservas solo" | Distingue 3 niveles: chatbot / agente de reservas / **agente que cierra** (Solnow). "No te pasa un lead: te cierra la venta." |
| **Modo persigue** (recuperación) | "Las reservas que hoy pierdes en silencio, el sistema las persigue y las cierra" | Analogía a "abandoned cart recovery" de e-commerce, pero vía WhatsApp en vez de email. |
| **Portal de colaboradores** | "Tus hoteles y agencias venden solos: disponibilidad real, reservas directas, comisiones calculadas" | Dolor: "15-20 colaboradores... a final de mes alguien intenta reconstruir quién trajo qué cliente". |
| **Control de flota en tiempo real** | "Tu flota y tus bases en vivo: quién está en el agua, qué moto vuelve tarde, qué pasa en cada oficina" | "El punto ciego de los software de reservas" — todos terminan cuando se paga la reserva. |
| **Motor de reservas** | "Motor de reservas online: disponibilidad real, pago y contrato en un solo checkout" | Se integra en la web existente, no obliga a rehacerla; Stripe; inventario único multi-canal. |
| **Datos unificados** | "Todo tu negocio en un solo dashboard: ingresos por canal, base y colaborador, en tiempo real" | "El problema no es la falta de datos, es que no cuadran." Incluye cierre automático (libro de registro + reseñas). |

Cada ficha tiene también su propio `meta.title`/`meta.description` optimizados a keyword (ej. TPV → "TPV para alquiler de motos de agua y actividades acuáticas | Solnow").

---

## 5. Landing pages SEO / guías how-to

Todas comparten plantilla: hero con `updated`/`readingTime` → secciones con listas/tablas/pasos → callout de refuerzo → FAQ → relacionados → CTA "Pedir demo".

| Guía | H1 | Ángulo | Público | CTA |
|---|---|---|---|---|
| `software` (pilar) | "Software para alquiler de motos de agua" | Guía/checklist de qué debe incluir un software del sector; distingue genérico vs. vertical | Operador evaluando opciones, primer contacto con la keyword | "Mira Solnow con tu flota real" |
| `mostrador` | "Cómo digitalizar el mostrador (walk-in) en alquiler de motos de agua" | Walk-in = "tu reserva más rentable y la que más te colapsa el mostrador" | Operador con cola física en temporada alta | "Digitaliza tu mostrador con Solnow" |
| `multibase` | "Cómo gestionar varias bases de motos de agua sin perder el control" | Dolor de escalar a 2+ bases sin visibilidad centralizada | Operador en expansión / multi-base | "Controla todas tus bases en una pantalla" |
| `whatsapp` | "Cómo responder reservas por WhatsApp 24/7 sin contratar más personal" | Distingue chatbot vs. agente de IA conectado a disponibilidad real | Operador perdiendo consultas fuera de horario | "Pon la IA a cerrar tus reservas" |
| `papeleo` | "Cómo eliminar el papeleo en temporada alta de alquiler náutico" | Dato ancla: "2-3 horas al día firmando contratos a mano" en agosto | Operador en pico de temporada | "Elimina el papeleo antes del próximo pico" |
| `contrato` (lead magnet) | "Modelo de contrato de alquiler de motos de agua (plantilla gratis)" | Plantilla PDF gratuita + qué cláusulas debe tener (fianza, seguro, menores) | Búsqueda informacional pura ("modelo de contrato…") — capta tráfico frío | "Deja de firmar contratos a mano" |
| `normativa` | "Normativa para el alquiler de motos de agua en España" | Legal: titulación, seguro obligatorio, zonas de navegación, sanciones | Operador que arranca o se regulariza | "Cumple con la normativa sin papeleo manual" |
| `libro` | "Libro de registro de motos náuticas: qué es y cómo llevarlo" | Legal/compliance: qué es, si es obligatorio, cómo automatizarlo | Operador ante una inspección o dudas de compliance | "Que el libro de registro se rellene solo" |

Todas las guías apuntan (vía `AREA_FOR_GUIDE` en `products.ts`) a una ficha de producto concreta como destino comercial — el clúster informacional "entrega" al clúster comercial en vez de competir con él (ej. `contrato`→`contratos`, `mostrador`→`tpv`, `libro`→`operacion`).

### Guías geográficas (misma plantilla, variando destino)

| Guía geo | H1 | Insight local usado como gancho |
|---|---|---|
| Tenerife | "Software de reservas para motos de agua en Tenerife" | Costa sur (Costa Adeje, Los Cristianos), turista UK/Alemania/nórdico, Capitanía de Santa Cruz de Tenerife |
| Gran Canaria | "Software de reservas para motos de agua en Gran Canaria" | Puerto Rico, Mogán, Anfi, Capitanía de Las Palmas |
| Canarias | "Software de reservas para motos de agua en Canarias" | Multi-isla (Tenerife+GC+Lanzarote+Fuerteventura), enfoque "operación multi-isla" |
| Argentina | "Software para alquiler de motos de agua en Argentina" | Temporada corta e intensa (dic-mar), costa atlántica + lagos de Córdoba/Bariloche, "WhatsApp como canal principal en el país" |
| México | "Software para alquiler de motos de agua en México" | Cancún/Riviera Maya/Los Cabos, turista EE.UU./Canadá, temporada casi todo el año |

Todas terminan en una tabla "Reto en [zona] / Con Solnow" prácticamente idéntica en estructura entre páginas (mismo patrón de filas: turista internacional/idiomas, walk-in, multi-base, papeleo, OTAs) — ver sección 9 sobre riesgo de contenido duplicado / thin content a ojos de buscadores.

---

## 6. Páginas de comparativa vs. competidores

Todas llevan disclaimer: *"Comparativa orientativa basada en información pública a junio de 2026. Las características y los precios de terceros pueden cambiar; verifica los detalles actuales en la web de cada herramienta."*

| Página | Tipo | Mensaje de diferenciación central |
|---|---|---|
| `fareharborAlt` — "FareHarbor: alternativa para alquiler de motos de agua" | Alternativa | Reconoce méritos de FareHarbor (motor maduro, distribución, afiliados) pero: "cubre la reserva online, pero no la operación de una flota acuática" — sin walk-in digital, sin operación en vivo, sin vertical náutico (libro de registro, menores), multi-base limitado. |
| `turitopAlt` — "TuriTop: alternativa para operadores de motos de agua" | Alternativa | TuriTop = "buen punto de partida para vender online" pero "se centra en la reserva, no en la operación": sin walk-in digital, sin operación en vivo, sin IA en WhatsApp, papeleo del sector limitado. |
| `fareharborVs` — "FareHarbor vs Solnow" | Head-to-head | "Dos productos para dos problemas distintos": FareHarbor = motor de reservas de tours; Solnow = sistema operativo de alquiler acuático. Tabla de 11 filas (categoría, walk-in, cobro, contratos, libro de registro, operación en vivo, IA WhatsApp, multi-base, precio, tiempo a producción). Callout: *"Las demás te ayudan a reservar. Solnow te ayuda a vender y a operar."* |
| `turitopVs` — "TuriTop vs Solnow" | Head-to-head | "Dos productos para dos momentos distintos": TuriTop = vender en tu web; Solnow = operar toda la flota. Callout: *"Vender online es el principio. Operar la flota completa es donde Solnow marca la diferencia."* |
| `mejoresSoftware` — "Mejores software de reservas para actividades acuáticas (2026)" | Listicle | Cubre FareHarbor, TuriTop, Bookeo, Regiondo y Solnow con criterios explícitos de evaluación (cobertura, walk-in, operación en vivo, vertical náutico, IA, modelo de precio). Tabla resumen de 4 columnas. Callout: *"El mejor software no es el que más reservas coge, es el que más de tu operación digitaliza."* |

**Patrón de diferenciación repetido en las 5 páginas** (y también en Home/Comparison): competidores = "motor de reservas" (solo la reserva online); Solnow = "sistema operativo" (venta + papeleo + operación en vivo + postventa). El eje de comparación siempre es: walk-in/mostrador, operación en vivo (QR+dashboard), IA en WhatsApp, papeleo/libro de registro, multi-base, modelo de precio (comisión/cuota vs. % sin cuota fija).

---

## 7. Navegación global y footer (recurrentes)

- **Nav:** Producto · Comparativa · Implementación · FAQ · Entrar · **"Pedir demo"**
- **CTA principal repetido en todo el sitio:** "Pedir demo" (nav, hub, fichas de producto, guías, comparativas), con variantes más largas en momentos clave: "Pedir demo personalizada" (hero), "Pedir demo personalizada con tu flota real" (final CTA), "Pedir demo del plan Pro" (pricing).
- **Footer — Recursos** (enlaza a las 8 guías how-to): Software de reservas · Digitalizar el mostrador · Gestión multi-base · WhatsApp con IA 24/7 · Eliminar el papeleo · Modelo de contrato · Normativa en España · Libro de registro.
- **Footer — Comparativas:** Alternativa a FareHarbor · Alternativa a TuriTop · FareHarbor vs Solnow · TuriTop vs Solnow · Mejores software de reservas.
- **Footer — Zonas:** Tenerife · Gran Canaria · Canarias · Argentina · México.
- Tagline footer: "El sistema operativo para empresas de alquiler acuático con alto volumen. Hecho en Valencia, operado en el Mediterráneo."

---

## 8. Diferencias notables ES vs. EN

En general el EN es una traducción fiel y bien adaptada (no literal palabra por palabra, sino localizada), sin cambios de mensaje. Diferencias detectadas:

- **Terminología de producto:** ES "TPV" → EN "POS". ES "moto de agua" → EN "jet ski"/"watercraft". ES "libro de registro" → EN "official register"/"logbook" (footer usa "Logbook guide" pero el `meta.title` de la guía usa "official register" — inconsistencia terminológica *dentro del propio EN*, ver sección 9).
- **`whyNow.ladder` (escalera de analogías):** ES usa "Restauración" (Camarero→Quiosco de autopedido); EN usa "Dining" (Waiter→Self-order kiosk) — equivalente, sin drift de mensaje.
- **`nuclear.reservar`/`vender`:** en ES el patrón es "reservar / vender **y a** operar" (dos verbos); en EN es "sell / operate" sin el conector "and" explícito en la misma estructura — mensaje equivalente, construcción gramatical distinta por naturaleza del idioma.
- **Footer status:** ES "Todos los sistemas operativos" vs EN "All systems operational" — el EN es correcto y claro (status badge típico); la versión ES suena a error de traducción/copy (ver hallazgo en sección 9).
- **Precio/soporte:** paridad total en tiers, horas de soporte y condiciones (Stripe Connect, sin permanencia, migración incluida) — no hay divergencia de oferta entre mercados.
- **Tono:** el EN es ligeramente menos "coloquial-agresivo" que el ES en algunos puntos (p.ej. "aprovechá cada finde de pico" en la guía Argentina usa voseo rioplatense — variante local que no tiene equivalente en EN, coherente con adaptar el copy al mercado argentino).

No se detectaron omisiones de secciones completas entre idiomas — la profundidad de contenido (guías, comparativas, FAQ) es la misma en ambos.

---

## 9. Inventario de CTAs (para detectar inconsistencia)

**CTAs de conversión primaria (todas apuntan a agendar demo):**
- "Pedir demo" (nav, hub de producto, mayoría de guías/comparativas — el más frecuente, genérico)
- "Pedir demo personalizada" (hero)
- "Pedir demo personalizada con tu flota real" (final CTA, home)
- "Ver cómo funciona" (CTA secundario del hero)
- "Empezar con Starter" (pricing, plan Starter)
- "Pedir demo del plan Pro" (pricing, plan Pro)
- "Hablar con el equipo" (pricing, plan Scale — única CTA que no dice "demo")
- "Mira Solnow con tu flota real" (guía `software`)
- "Digitaliza tu mostrador con Solnow" (guía `mostrador`)
- "Controla todas tus bases en una pantalla" (guía `multibase`)
- "Pon la IA a cerrar tus reservas" (guía `whatsapp`)
- "Elimina el papeleo antes del próximo pico" (guía `papeleo`)
- "Deja de firmar contratos a mano" (guía `contrato`)
- "Cumple con la normativa sin papeleo manual" (guía `normativa`)
- "Que el libro de registro se rellene solo" (guía `libro`)
- "Mira la alternativa con tu flota real" (fareharborAlt)
- (turitopAlt usa el mismo texto de botón "Pedir demo" con desc. distinta)
- "Compáralo con tu operación real" (fareharborVs, turitopVs — título del bloque CTA, botón dice "Pedir demo")
- "Mira por qué Solnow encaja con tu flota" (mejoresSoftware)
- CTAs geo: "Pon Solnow en tu base de Tenerife" / "...de Gran Canaria" / "...de México", "Escala tu alquiler acuático en Canarias", "Llegá al verano con Solnow" (Argentina)

**Patrón:** el **botón** casi siempre dice literalmente "Pedir demo" (texto corto, consistente), pero el **título/heading** que lo precede varía en cada página (personalizado a la keyword/dolor de esa página). Esto es intencional y funciona como copy de contexto — no es inconsistencia real, es personalización correcta. El único outlier real de texto de botón es "Hablar con el equipo" (plan Scale) y "Empezar con Starter" (plan Starter), que rompen el patrón "Pedir demo" — coherente porque son leads de intención distinta (self-serve vs. enterprise).

**Micro-copy secundario recurrente:** "30 minutos, sin compromiso" / "Te montamos la demo con tu flota real" aparece casi textual en 6+ lugares distintos (hero secundario, hub CTA, onboarding CTA, final CTA, varias guías) — refuerzo consistente de la oferta ("demo con tu flota real, no un demo genérico").

---

## 10. Observaciones y oportunidades para un agente de copy

Notas objetivas, sin implementar cambios:

1. **Footer `status: "Todos los sistemas operativos"` (ES) parece un error de traducción/copy.** El EN dice "All systems operational" (patrón estándar de status page). La versión ES en plural ("todos los sistemas operativos") no comunica lo mismo — suena a listado de tecnologías, no a "todo funciona correctamente". Candidato claro a revisión (`footer.status` en `es.json`).

2. **Terminología "libro de registro" inconsistente en EN.** El footer usa "Logbook guide" pero los `meta.title`/`ogTitle` de la guía usan "The jet ski official register" / "official register". Dos términos distintos para el mismo concepto dentro del mismo idioma pueden diluir el SEO on-page y confundir al lector que llega del footer.

3. **Numeración de secciones duplicada:** `comparison.eyebrow` = "07 · Comparativa" y `pricing.eyebrow` = "07 · Pricing" — ambos llevan el número "07". Si el numerado (04, 05, 06, 07...) pretende comunicar progresión narrativa al usuario, este duplicado rompe la cuenta (después vendría "08 · Modelo de partner" y luego otra vez "09 · Implementación", pero el pricing "07" se solapa con comparison "07"). Revisar si `partner`/`pricing` conviven en la página o si uno reemplazó al otro y quedó el eyebrow desactualizado.

4. **Bloque `nuclear` no aparece en el orden de renderizado de `HomeClient.tsx`.** Existe contenido completo en `es.json`/`en.json` (`nuclear.*`) con un mensaje muy fuerte y central ("Los demás te ayudan a reservar. Nosotros te ayudamos a vender y a operar.") que no se ve importado en la página home actual. Si es contenido huérfano/muerto, es candidato a limpieza; si está pensado para reaparecer (A/B test, sección pendiente), merece confirmarse antes de tocar el resto del copy que repite el mismo mensaje (Pillars ya lo repite casi literal).

5. **Hero variante "b" no usada en producción** (`Hero variant="a"` está hardcodeado en `HomeClient.tsx`), pero existe copy completo y pulido para la variante B ("Tu flota crece. Tu software te frena."). Vale la pena preguntar si esto es contenido de un test A/B pendiente de activar o copy descartado — si es lo segundo, es buen material para reciclar en otra sección (ej. ficha `motor` o `datos`, que hablan de "reemplazar Excel y herramientas sueltas").

6. **Fuerte repetición estructural entre las 5 guías geográficas** (Tenerife, Gran Canaria, Canarias, Argentina, México): mismas 5 filas de tabla "Reto / Con Solnow" (turista internacional, walk-in, multi-base, papeleo, OTAs) con cambios mínimos de wording. Bien para consistencia de marca, pero riesgo de que buscadores perciban contenido casi duplicado entre páginas muy similares en estructura (aunque los datos locales — playas, capitanías, perfil de turista — sí son específicos y genuinos, lo que mitiga el riesgo).

7. **Claims numéricos sin fuente visible:** "70% de las consultas de WhatsApp" (testimonio), "70-85% de la facturación entra por mostrador" (ficha TPV), "50 consultas/día", "2-3h diarias", "15-25 reservas perdidas/semana" (painBar) se presentan como hechos del sector sin atribución ni nota metodológica. Son buenos ganchos pero un lector escéptico (el ICP es un operador de negocio, no un consumidor impulsivo) podría cuestionarlos. Los testimonios en `socialProof` tampoco llevan nombre de empresa/persona — son citas anónimas con solo un KPI label, lo que reduce su poder de prueba social frente a testimonios atribuidos.

8. **El copy asume mucho conocimiento de contexto B2B SaaS de comisión/GMV** ("comisión sobre el GMV", "Stripe Connect", "coste por conversación de IA") en el FAQ de home — coherente con el ICP (dueños de operación con volumen, probablemente ya usan Stripe/TPVs), pero vale verificar que no genere fricción en mercados como Argentina/México donde el copy geo usa un tono más informal/local (voseo) mientras el FAQ de pricing mantiene el registro técnico-financiero sin adaptar.

9. **Mensaje sobre OTAs es doble filo y potencialmente confuso:** el FAQ de home dice explícitamente "para nuestro ICP, OTAs son el canal de menor volumen... un complemento, no el centro", mientras que `socialProof.partners` presenta a VIATOR y GETYOURGUIDE como partners destacados en el mismo nivel que STRIPE, y varias fichas de producto/guías promocionan la integración con OTAs como ventaja competitiva. No es necesariamente contradictorio (se puede integrar bien algo que no es el foco), pero el mensaje "las OTAs no son el centro" convive con bastante peso visual/narrativo dado a los logos de OTAs — vale revisar si el énfasis relativo está calibrado como se pretende.

10. **CTA del plan "Scale" ("Hablar con el equipo") rompe el patrón dominante de "Pedir demo"** en toda la página de pricing — es intencional (target enterprise/alto touch) pero conviene confirmar que es deliberado y no un descuido de copy, dado que todo el resto del sitio refuerza obsesivamente "Pedir demo" como único verbo de conversión.

11. **Sin FAQ ni disclaimer de "información pública sujeta a cambios" en las guías geográficas y en las fichas de producto** (sí existe en las 5 páginas de comparativa). Sería consistente añadir alguna nota de fecha de actualización más visible en fichas de producto también, ya que llevan datos operativos concretos (tiempos, %s) que podrían cambiar.
