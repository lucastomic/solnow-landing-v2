// Generator for the downloadable templates (contracts and waivers).
// Run with: node scripts/generate-contract-pdf.mjs [id …]
//   e.g. `node scripts/generate-contract-pdf.mjs charter waiver`
// Without ids it regenerates every template. Outputs into public/assets/; the
// resulting PDFs are committed and served as static downloads from the guides.
//
// `draft: true` prints a «pending legal review» band at the top of the PDF.
// Remove it from the template once a person has reviewed the clauses, and
// regenerate.

import PDFDocument from 'pdfkit';
import { createWriteStream, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../public/assets');
mkdirSync(OUT_DIR, { recursive: true });

const ACCENT = '#106695';
const INK = '#083954';
const MUTED = '#5a7a91';
const DRAFT = '#b4232a';

const ES = {
  id: 'jetski',
  file: 'modelo-contrato-alquiler-motos-de-agua.pdf',
  brandSub: 'Plantilla de contrato de alquiler de motos de agua',
  title: 'CONTRATO DE ALQUILER DE MOTO DE AGUA',
  fieldsHead: 'DATOS DEL ALQUILER',
  fields: [
    ['Empresa arrendadora', 'Razón social · CIF · domicilio'],
    ['Arrendatario', 'Nombre y apellidos · DNI/Pasaporte · teléfono'],
    ['Embarcación', 'Marca · modelo · matrícula/nº de casco · potencia'],
    ['Periodo', 'Fecha · hora de entrega · hora de devolución'],
    ['Precio y fianza', 'Importe · forma de pago · fianza retenida'],
    ['Estado a la entrega', 'Daños previos · nivel de combustible'],
  ],
  clausesHead: 'CLÁUSULAS',
  clauses: [
    ['1. Objeto', 'La empresa arrendadora cede al arrendatario el uso de la moto de agua identificada arriba, durante el periodo pactado y en las condiciones de este contrato.'],
    ['2. Precio, pago y fianza', 'El arrendatario abona el precio acordado y entrega una fianza en garantía de los posibles daños, sanciones o retrasos. La fianza se devuelve a la entrega de la moto en el estado pactado, una vez descontados los importes que procedan.'],
    ['3. Seguro y franquicia', 'La moto cuenta con el seguro de responsabilidad civil obligatorio. El arrendatario asume la franquicia y los daños no cubiertos por la póliza hasta el límite indicado en este contrato.'],
    ['4. Condiciones de uso', 'El arrendatario se compromete a: respetar la zona de navegación autorizada y la distancia mínima a la costa; no superar el número de ocupantes permitido; no navegar bajo los efectos del alcohol o de sustancias; usar en todo momento el chaleco salvavidas; y seguir las instrucciones de seguridad recibidas.'],
    ['5. Responsabilidad', 'El arrendatario responde de los daños causados a la moto, a terceros y de las sanciones administrativas derivadas del uso durante el periodo de alquiler, y autoriza expresamente su cargo en el medio de pago facilitado.'],
    ['6. Declaraciones del arrendatario', 'El arrendatario declara saber nadar, haber recibido las instrucciones de manejo y seguridad, y contar con la titulación o autorización exigida (o realizar la actividad en modalidad guiada bajo supervisión de un monitor).'],
    ['7. Devolución y retrasos', 'La moto se devuelve a la hora pactada y en el mismo estado. Cada hora o fracción de retraso se penaliza según el importe indicado.'],
    ['8. Protección de datos', 'Los datos del arrendatario se tratan conforme al RGPD con la finalidad de gestionar el alquiler y cumplir las obligaciones legales. El arrendatario puede ejercer sus derechos ante la empresa arrendadora.'],
  ],
  annexes: [{ head: 'ANEXO · ALQUILER A MENORES (cumplimentar solo si procede)', rows: [
    ['Menor', 'Nombre y apellidos · fecha de nacimiento'],
    ['Tutor legal', 'Nombre y apellidos · DNI/Pasaporte · vínculo con el menor'],
    ['Autorización', 'El tutor legal autoriza la actividad y asume la responsabilidad sobre el menor durante la misma.'],
  ] }],
  signHead: 'FIRMAS',
  signers: ['La empresa arrendadora', 'El arrendatario', 'El tutor legal (si procede)'],
  placeDate: 'Lugar y fecha: ______________________________',
  disclaimer:
    'Plantilla orientativa facilitada por Solnow. No constituye asesoramiento legal. Antes de usarla con clientes, revísala con un asesor jurídico y verifica los requisitos de tu Capitanía Marítima y comunidad autónoma. Genera, firma y archiva este contrato automáticamente con Solnow: solnow.io',
};

const EN = {
  id: 'jetski',
  file: 'modelo-contrato-alquiler-motos-de-agua-en.pdf',
  brandSub: 'Jet ski rental contract template',
  title: 'JET SKI RENTAL CONTRACT',
  fieldsHead: 'RENTAL DETAILS',
  fields: [
    ['Rental company', 'Legal name · tax ID · address'],
    ['Renter', 'Full name · ID/Passport · phone'],
    ['Craft', 'Make · model · registration/hull no. · power'],
    ['Period', 'Date · handover time · return time'],
    ['Price and deposit', 'Amount · payment method · deposit held'],
    ['Condition at handover', 'Prior damage · fuel level'],
  ],
  clausesHead: 'CLAUSES',
  clauses: [
    ['1. Subject', 'The rental company grants the renter the use of the jet ski identified above, for the agreed period and under the conditions of this contract.'],
    ['2. Price, payment and deposit', 'The renter pays the agreed price and provides a deposit as security against damage, penalties or delays. The deposit is refunded upon return of the craft in the agreed condition, less any applicable amounts.'],
    ['3. Insurance and excess', 'The craft carries the mandatory civil-liability insurance. The renter assumes the excess and any damage not covered by the policy up to the limit stated in this contract.'],
    ['4. Conditions of use', 'The renter agrees to: respect the authorized navigation area and the minimum distance from shore; not exceed the permitted number of occupants; not navigate under the influence of alcohol or substances; wear the life jacket at all times; and follow the safety instructions received.'],
    ['5. Liability', 'The renter is responsible for damage to the craft, to third parties and for administrative penalties arising from use during the rental period, and expressly authorizes charging them to the payment method provided.'],
    ['6. Renter declarations', 'The renter declares that they can swim, have received the handling and safety instructions, and hold the required license or authorization (or carry out the activity in guided format under instructor supervision).'],
    ['7. Return and delays', 'The craft is returned at the agreed time and in the same condition. Each hour or fraction of delay is penalized according to the stated amount.'],
    ['8. Data protection', 'The renter’s data is processed in accordance with the GDPR for the purpose of managing the rental and meeting legal obligations. The renter may exercise their rights with the rental company.'],
  ],
  annexes: [{ head: 'ANNEX · RENTING TO MINORS (complete only if applicable)', rows: [
    ['Minor', 'Full name · date of birth'],
    ['Legal guardian', 'Full name · ID/Passport · relationship to the minor'],
    ['Authorization', 'The legal guardian authorizes the activity and assumes responsibility for the minor during it.'],
  ] }],
  signHead: 'SIGNATURES',
  signers: ['The rental company', 'The renter', 'The legal guardian (if applicable)'],
  placeDate: 'Place and date: ______________________________',
  disclaimer:
    'Template provided by Solnow for guidance only. It does not constitute legal advice. Before using it with customers, review it with a legal advisor and verify the requirements of your Harbour Master and region. Generate, sign and archive this contract automatically with Solnow: solnow.io',
};

// Pendientes de revisión legal: `draft` imprime la banda hasta que alguien
// las revise. Seguro, titulación y validez de la exención cambian por país.
const DRAFT_ES = 'BORRADOR · PENDIENTE DE REVISIÓN LEGAL. Las cláusulas sobre seguro, titulación y responsabilidad no se han verificado. No usar con clientes hasta retirar este aviso.';
const DRAFT_EN = 'DRAFT · PENDING LEGAL REVIEW. Clauses on insurance, licensing and liability have not been verified. Do not use with customers until this notice is removed.';

const CHARTER = [
  {
    id: 'charter',
    draft: DRAFT_ES,
    file: 'modelo-contrato-alquiler-barco-charter.pdf',
    brandSub: 'Plantilla de contrato de alquiler de barco o chárter',
    title: 'CONTRATO DE ALQUILER DE EMBARCACIÓN (CHÁRTER)',
    fieldsHead: 'DATOS DEL ALQUILER',
    fields: [
      ['Empresa arrendadora', 'Razón social · CIF · domicilio'],
      ['Arrendatario', 'Nombre y apellidos · DNI/Pasaporte · teléfono · email'],
      ['Embarcación', 'Nombre · matrícula · eslora · número máximo de personas a bordo'],
      ['Base de salida y de devolución', 'Puerto de embarque · puerto de devolución si es distinto'],
      ['Periodo', 'Fecha y hora de embarque · fecha y hora de devolución'],
      ['Modalidad', '[  ] Con patrón — nombre del patrón     [  ] Sin patrón — titulación de quien gobierna, número y fecha de expedición'],
      ['Precio, señal y fianza', 'Precio total · señal abonada · resto · importe de la fianza y forma de pago'],
      ['Estado a la entrega', 'Inventario · daños previos · nivel de combustible · horas de motor'],
    ],
    clausesHead: 'CLÁUSULAS',
    clauses: [
      ['1. Objeto', 'La empresa arrendadora cede al arrendatario el uso de la embarcación identificada arriba, en la modalidad marcada, durante el periodo pactado y en las condiciones de este contrato.'],
      ['2. Precio, señal y fianza', 'El arrendatario abona el precio en la forma indicada. La fianza garantiza los daños, sanciones, combustible y retrasos que puedan producirse, y se devuelve tras la revisión de la embarcación a su entrega, descontados los importes que procedan.'],
      ['3. Seguro y franquicia', 'La embarcación cuenta con el seguro obligatorio exigido por la normativa aplicable. El arrendatario asume la franquicia de la póliza, por importe de ________ €, y los daños no cubiertos por ella.'],
      ['4. Gobierno de la embarcación', 'En la modalidad con patrón, el gobierno corresponde al patrón designado por la empresa arrendadora, cuyas instrucciones de seguridad son de obligado cumplimiento. En la modalidad sin patrón, el arrendatario declara poseer la titulación indicada, vigente y suficiente para la embarcación y la zona de navegación.'],
      ['5. Zona de navegación y uso', 'La embarcación solo navegará en la zona indicada por la empresa arrendadora y no superará el número máximo de personas a bordo. Queda prohibido navegar bajo los efectos del alcohol o de sustancias, subarrendar la embarcación o usarla para fines distintos del recreo.'],
      ['6. Meteorología y cancelación', 'Si las condiciones meteorológicas o del mar desaconsejan la salida, la empresa arrendadora podrá cancelarla o acortarla. En ese caso se ofrecerá una nueva fecha o la devolución de la parte proporcional, según se indique: ________________.'],
      ['7. Combustible', 'La embarcación se entrega con el nivel de combustible indicado y se devuelve con el mismo nivel; en caso contrario, la diferencia se cobra al precio vigente. Alternativa: cobro por horas de motor, a ________ € la hora.'],
      ['8. Responsabilidad', 'El arrendatario responde de los daños causados a la embarcación, a su equipo y a terceros por un uso contrario a este contrato, y de las sanciones derivadas del uso durante el periodo de alquiler.'],
      ['9. Devolución y retrasos', 'La embarcación se devuelve en el puerto, a la hora y en el estado pactados. Cada hora o fracción de retraso se cobra a ________ €.'],
      ['10. Protección de datos', 'Los datos del arrendatario y del pasaje se tratan conforme al RGPD para gestionar el alquiler y cumplir las obligaciones legales. Los interesados pueden ejercer sus derechos ante la empresa arrendadora.'],
    ],
    annexes: [{ head: 'ANEXO · TRIPULACIÓN Y PASAJE', rows: [
      ['Patrón o persona al mando', 'Nombre y apellidos · documento · titulación'],
      ['Pasajero 1', 'Nombre y apellidos · documento'],
      ['Pasajero 2', 'Nombre y apellidos · documento'],
      ['Pasajero 3', 'Nombre y apellidos · documento'],
      ['Pasajero 4', 'Nombre y apellidos · documento'],
    ] }],
    signHead: 'FIRMAS',
    signers: ['La empresa arrendadora', 'El arrendatario', 'El patrón (si procede)'],
    placeDate: 'Lugar y fecha: ______________________________',
    disclaimer:
      'Plantilla orientativa facilitada por Solnow. No constituye asesoramiento legal. Antes de usarla con clientes, revísala con un asesor jurídico y verifica los requisitos de tu Capitanía Marítima y comunidad autónoma. Genera, firma y archiva este contrato automáticamente con Solnow: solnow.io',
  },
  {
    id: 'charter',
    draft: DRAFT_EN,
    file: 'modelo-contrato-alquiler-barco-charter-en.pdf',
    brandSub: 'Boat charter agreement template',
    title: 'BOAT CHARTER AGREEMENT',
    fieldsHead: 'CHARTER DETAILS',
    fields: [
      ['Charter company', 'Legal name · tax ID · address'],
      ['Charterer', 'Full name · ID/Passport · phone · email'],
      ['Vessel', 'Name · registration · length · maximum number of people on board'],
      ['Departure and return base', 'Boarding port · return port if different'],
      ['Period', 'Boarding date and time · return date and time'],
      ['Charter type', '[  ] Skippered — skipper’s name     [  ] Bareboat — licence of the person in command, number and date of issue'],
      ['Price, deposit and security deposit', 'Total price · deposit paid · balance · security deposit amount and payment method'],
      ['Condition at handover', 'Inventory · prior damage · fuel level · engine hours'],
    ],
    clausesHead: 'CLAUSES',
    clauses: [
      ['1. Subject', 'The charter company grants the charterer the use of the vessel identified above, in the charter type ticked, for the agreed period and under the conditions of this agreement.'],
      ['2. Price, deposit and security deposit', 'The charterer pays the price as stated. The security deposit covers any damage, fines, fuel and late return, and is refunded after the vessel is inspected on return, less any applicable amounts.'],
      ['3. Insurance and excess', 'The vessel carries the insurance required by applicable law. The charterer bears the policy excess of ________ and any damage not covered by the policy.'],
      ['4. Command of the vessel', 'In a skippered charter, the vessel is commanded by the skipper appointed by the charter company, whose safety instructions must be followed. In a bareboat charter, the charterer declares that they hold the licence stated above, valid and sufficient for the vessel and the cruising area.'],
      ['5. Cruising area and use', 'The vessel will only sail within the area indicated by the charter company and will not exceed the maximum number of people on board. Sailing under the influence of alcohol or drugs, sub-chartering the vessel or using it for non-recreational purposes is prohibited.'],
      ['6. Weather and cancellation', 'If weather or sea conditions make the trip unsafe, the charter company may cancel or shorten it. In that case it will offer a new date or a pro-rata refund, as follows: ________________.'],
      ['7. Fuel', 'The vessel is handed over with the fuel level stated and must be returned with the same level; otherwise the difference is charged at the current price. Alternative: charged by engine hours at ________ per hour.'],
      ['8. Liability', 'The charterer is liable for damage to the vessel, its equipment and third parties caused by use contrary to this agreement, and for fines arising from use during the charter period.'],
      ['9. Return and late return', 'The vessel is returned to the agreed port, at the agreed time and in the agreed condition. Each hour or part of an hour late is charged at ________.'],
      ['10. Data protection', 'The personal data of the charterer and passengers is processed to manage the charter and meet legal obligations, in accordance with applicable data protection law. Data subjects may exercise their rights with the charter company.'],
    ],
    annexes: [{ head: 'ANNEX · CREW AND PASSENGERS', rows: [
      ['Skipper or person in command', 'Full name · ID · licence'],
      ['Passenger 1', 'Full name · ID'],
      ['Passenger 2', 'Full name · ID'],
      ['Passenger 3', 'Full name · ID'],
      ['Passenger 4', 'Full name · ID'],
    ] }],
    signHead: 'SIGNATURES',
    signers: ['The charter company', 'The charterer', 'The skipper (if applicable)'],
    placeDate: 'Place and date: ______________________________',
    disclaimer:
      'Template provided by Solnow for guidance only. It does not constitute legal advice. Before using it with customers, review it with a legal advisor and check the requirements of your maritime authority and jurisdiction. Generate, sign and archive this agreement automatically with Solnow: solnow.io',
  },
];

const WAIVER = [
  {
    id: 'waiver',
    draft: DRAFT_ES,
    file: 'plantilla-exencion-responsabilidad-actividades-acuaticas.pdf',
    brandSub: 'Plantilla de declaración de riesgos y exención de responsabilidad',
    title: 'DECLARACIÓN DE RIESGOS Y CONSENTIMIENTO · ACTIVIDADES ACUÁTICAS',
    fieldsHead: 'DATOS DEL PARTICIPANTE Y DE LA ACTIVIDAD',
    fields: [
      ['Empresa organizadora', 'Razón social · CIF · domicilio'],
      ['Participante', 'Nombre y apellidos · DNI/Pasaporte · fecha de nacimiento · teléfono'],
      ['Actividad', 'Actividad · fecha · hora · base'],
      ['Contacto de emergencia', 'Nombre · teléfono'],
    ],
    clausesHead: 'DECLARACIONES',
    clauses: [
      ['1. Información sobre los riesgos', 'Declaro haber sido informado de que la actividad se desarrolla en el mar y conlleva riesgos propios, entre otros: caídas al agua, golpes, cambios de viento, oleaje y corrientes, y que he podido preguntar todas mis dudas.'],
      ['2. Salud y aptitud', 'Declaro que sé nadar; que no he consumido alcohol, drogas ni medicamentos que afecten a mis reflejos; y que no padezco problemas cardíacos, de espalda o de cuello, ni otra condición que desaconseje la actividad, o que la he comunicado antes de empezar. Si estoy embarazada, lo he comunicado.'],
      ['3. Normas de seguridad', 'Me comprometo a usar el chaleco salvavidas en todo momento, a seguir las instrucciones del personal y a no salir de la zona indicada. Acepto que el personal pueda interrumpir la actividad si no se cumplen estas normas o si cambian las condiciones.'],
      ['4. Material', 'Me comprometo a usar el material de forma adecuada y a devolverlo en el estado en que lo recibí, y respondo de los daños causados por un uso contrario a las instrucciones.'],
      ['5. Alcance de este documento', 'Asumo los riesgos propios de la actividad que me han sido explicados. Este documento no limita la responsabilidad que legalmente corresponda a la empresa organizadora.'],
      ['6. Imagen (opcional)', '[  ] Autorizo  [  ] No autorizo  el uso de fotografías y vídeos de la actividad en los canales de la empresa organizadora.'],
      ['7. Protección de datos', 'Mis datos se tratan conforme al RGPD para gestionar la actividad y cumplir las obligaciones legales. Puedo ejercer mis derechos ante la empresa organizadora.'],
    ],
    annexes: [
      { head: 'ANEXO · ACTIVIDAD (marcar la que corresponda)', rows: [
        ['[  ] Moto de agua', 'He recibido las instrucciones de manejo y conozco la zona de navegación permitida. Conductor [  ] · Pasajero [  ] · Titulación (si se exige): ________'],
        ['[  ] Kayak / paddle surf', 'Sé nadar, he recibido las indicaciones de la zona y de la hora de regreso, y no me alejaré de la zona indicada. Unidad: ________'],
        ['[  ] Parasailing', 'Peso declarado: ______ kg. No tengo lesiones de espalda ni de cuello. Vuelo: individual [  ] · doble [  ] · triple [  ]'],
      ] },
      { head: 'ANEXO · MENORES DE EDAD (cumplimentar solo si procede)', rows: [
        ['Menor', 'Nombre y apellidos · fecha de nacimiento'],
        ['Tutor legal', 'Nombre y apellidos · DNI/Pasaporte · vínculo con el menor'],
        ['Consentimiento', 'El tutor legal ha leído estas declaraciones, autoriza la participación del menor y las suscribe en su nombre.'],
      ] },
    ],
    signHead: 'FIRMAS',
    signers: ['El participante', 'El tutor legal (si procede)', 'La empresa organizadora'],
    placeDate: 'Lugar y fecha: ______________________________',
    disclaimer:
      'Plantilla orientativa facilitada por Solnow. No constituye asesoramiento legal: la validez de estos documentos depende de la normativa aplicable. Revísala con un asesor jurídico antes de usarla. Haz que cada participante la firme en su móvil y archívala con la reserva con Solnow: solnow.io',
  },
  {
    id: 'waiver',
    draft: DRAFT_EN,
    file: 'plantilla-exencion-responsabilidad-actividades-acuaticas-en.pdf',
    brandSub: 'Watersports liability waiver template',
    title: 'ACKNOWLEDGEMENT OF RISK AND LIABILITY WAIVER · WATERSPORTS',
    fieldsHead: 'PARTICIPANT AND ACTIVITY DETAILS',
    fields: [
      ['Operator', 'Legal name · tax ID · address'],
      ['Participant', 'Full name · ID/Passport · date of birth · phone'],
      ['Activity', 'Activity · date · time · base'],
      ['Emergency contact', 'Name · phone'],
    ],
    clausesHead: 'DECLARATIONS',
    clauses: [
      ['1. Acknowledgement of risk', 'I have been informed that the activity takes place at sea and carries inherent risks, including falls into the water, impacts, wind shifts, waves and currents, and I have been able to ask any questions.'],
      ['2. Health and fitness', 'I can swim; I have not consumed alcohol, drugs or medication that affects my reflexes; and I have no heart, back or neck condition, or any other condition that makes the activity inadvisable, or I have disclosed it before starting. If I am pregnant, I have disclosed it.'],
      ['3. Safety rules', 'I will wear a life jacket at all times, follow the staff’s instructions and stay within the indicated area. I accept that staff may stop the activity if these rules are not followed or if conditions change.'],
      ['4. Equipment', 'I will use the equipment properly and return it in the condition I received it, and I am responsible for damage caused by use contrary to the instructions.'],
      ['5. Release and its limits', 'I assume the inherent risks of the activity that have been explained to me and, to the extent permitted by applicable law, release the operator from claims arising from those risks. Nothing in this document limits any liability the operator cannot exclude by law.'],
      ['6. Photos (optional)', '[  ] I consent  [  ] I do not consent  to photos and videos of the activity being used on the operator’s channels.'],
      ['7. Data protection', 'My personal data is processed to manage the activity and meet legal obligations, in accordance with applicable data protection law. I may exercise my rights with the operator.'],
    ],
    annexes: [
      { head: 'ANNEX · ACTIVITY (tick as applicable)', rows: [
        ['[  ] Jet ski', 'I received the handling briefing and know the permitted riding area. Driver [  ] · Passenger [  ] · Licence/boater card (if required): ________'],
        ['[  ] Kayak / paddle board', 'I can swim, I received the briefing on the area and return time, and I will stay within the indicated area. Unit: ________'],
        ['[  ] Parasailing', 'Declared weight: ______. No back or neck injuries. Flight: single [  ] · tandem [  ] · triple [  ]'],
      ] },
      { head: 'ANNEX · MINORS (complete only if applicable)', rows: [
        ['Minor', 'Full name · date of birth'],
        ['Legal guardian', 'Full name · ID/Passport · relationship to the minor'],
        ['Consent', 'The legal guardian has read these declarations, authorizes the minor’s participation and signs them on the minor’s behalf.'],
      ] },
    ],
    signHead: 'SIGNATURES',
    signers: ['The participant', 'The legal guardian (if applicable)', 'The operator'],
    placeDate: 'Place and date: ______________________________',
    disclaimer:
      'Template provided by Solnow for guidance only. It does not constitute legal advice: whether a waiver is enforceable depends on applicable law. Review it with a legal advisor before using it. Have every participant sign it on their phone and file it with the booking with Solnow: solnow.io',
  },
];

function render(data) {
  const doc = new PDFDocument({ size: 'A4', margin: 56 });
  doc.pipe(createWriteStream(resolve(OUT_DIR, data.file)));

  const W = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  // Header
  doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(15).text('Solnow', { continued: false });
  doc.fillColor(MUTED).font('Helvetica').fontSize(9).text(data.brandSub);
  doc.moveDown(0.8);
  doc.fillColor(INK).font('Helvetica-Bold').fontSize(17).text(data.title);
  doc.moveTo(doc.x, doc.y + 6).lineTo(doc.x + W, doc.y + 6).strokeColor(ACCENT).lineWidth(1.5).stroke();
  doc.moveDown(1.2);

  if (data.draft) {
    const y0 = doc.y;
    doc.fillColor(DRAFT).font('Helvetica-Bold').fontSize(9).text(data.draft, doc.x + 8, y0 + 6, { width: W - 16 });
    const h = doc.y - y0 + 6;
    doc.rect(doc.page.margins.left, y0, W, h).strokeColor(DRAFT).lineWidth(1).dash(3, { space: 2 }).stroke().undash();
    doc.x = doc.page.margins.left;
    doc.y = y0 + h;
    doc.moveDown(0.8);
  }

  const sectionHead = (txt) => {
    doc.moveDown(0.5);
    doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(10).text(txt.toUpperCase(), { characterSpacing: 0.5 });
    doc.moveDown(0.4);
  };

  const fieldRow = (label, hint) => {
    doc.fillColor(INK).font('Helvetica-Bold').fontSize(9.5).text(label + ':', { continued: false });
    doc.fillColor(MUTED).font('Helvetica-Oblique').fontSize(8.5).text(hint);
    doc.fillColor('#c9d4de').font('Helvetica').text('_______________________________________________________________________');
    doc.moveDown(0.3);
  };

  // Fields
  sectionHead(data.fieldsHead);
  data.fields.forEach(([l, h]) => fieldRow(l, h));

  // Clauses
  sectionHead(data.clausesHead);
  data.clauses.forEach(([h, p]) => {
    doc.fillColor(INK).font('Helvetica-Bold').fontSize(10).text(h);
    doc.fillColor('#1f4d6b').font('Helvetica').fontSize(9.5).text(p, { align: 'justify', lineGap: 1.5 });
    doc.moveDown(0.5);
  });

  // Annexes (minors, activity, passengers…)
  data.annexes.forEach(({ head, rows }) => {
    sectionHead(head);
    rows.forEach(([l, h]) => fieldRow(l, h));
  });

  // Signatures
  sectionHead(data.signHead);
  doc.moveDown(0.2);
  doc.fillColor(MUTED).font('Helvetica').fontSize(9).text(data.placeDate);
  doc.moveDown(1.4);
  // Firmas y pie van juntos: si no caben, a la página siguiente.
  if (doc.y > doc.page.height - doc.page.margins.bottom - 120) doc.addPage();
  const colW = (W - 40) / 3;
  const y = doc.y;
  const x0 = doc.page.margins.left;
  data.signers.forEach((label, i) => {
    const x = x0 + i * (colW + 20);
    doc.moveTo(x, y).lineTo(x + colW, y).strokeColor('#c9d4de').lineWidth(0.8).stroke();
    doc.fillColor(MUTED).font('Helvetica').fontSize(8).text(label, x, y + 5, { width: colW });
  });
  doc.y = y + 40;
  doc.x = doc.page.margins.left;

  // Disclaimer footer
  doc.moveDown(1);
  doc.moveTo(doc.x, doc.y).lineTo(doc.x + W, doc.y).strokeColor('#e6ebf1').lineWidth(0.8).stroke();
  doc.moveDown(0.5);
  doc.fillColor(MUTED).font('Helvetica-Oblique').fontSize(8).text(data.disclaimer, { lineGap: 1.5 });

  doc.end();
  return data.file;
}

const TEMPLATES = [ES, EN, ...CHARTER, ...WAIVER];
const only = process.argv.slice(2);
for (const data of TEMPLATES) {
  if (only.length && !only.includes(data.id)) continue;
  const file = render(data);
  console.log('generated', file);
}
