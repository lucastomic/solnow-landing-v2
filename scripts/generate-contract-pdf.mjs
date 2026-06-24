// One-off generator for the downloadable rental-contract templates.
// Run with: node scripts/generate-contract-pdf.mjs
// Outputs the ES + EN PDFs into public/assets/. The resulting PDFs are
// committed to the repo and served as static downloads from the contract guide.

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

const ES = {
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
  minorsHead: 'ANEXO · ALQUILER A MENORES (cumplimentar solo si procede)',
  minors: [
    ['Menor', 'Nombre y apellidos · fecha de nacimiento'],
    ['Tutor legal', 'Nombre y apellidos · DNI/Pasaporte · vínculo con el menor'],
    ['Autorización', 'El tutor legal autoriza la actividad y asume la responsabilidad sobre el menor durante la misma.'],
  ],
  signHead: 'FIRMAS',
  signLessor: 'La empresa arrendadora',
  signRenter: 'El arrendatario',
  signGuardian: 'El tutor legal (si procede)',
  placeDate: 'Lugar y fecha: ______________________________',
  disclaimer:
    'Plantilla orientativa facilitada por Solnow. No constituye asesoramiento legal. Antes de usarla con clientes, revísala con un asesor jurídico y verifica los requisitos de tu Capitanía Marítima y comunidad autónoma. Genera, firma y archiva este contrato automáticamente con Solnow → solnow.io',
};

const EN = {
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
  minorsHead: 'ANNEX · RENTING TO MINORS (complete only if applicable)',
  minors: [
    ['Minor', 'Full name · date of birth'],
    ['Legal guardian', 'Full name · ID/Passport · relationship to the minor'],
    ['Authorization', 'The legal guardian authorizes the activity and assumes responsibility for the minor during it.'],
  ],
  signHead: 'SIGNATURES',
  signLessor: 'The rental company',
  signRenter: 'The renter',
  signGuardian: 'The legal guardian (if applicable)',
  placeDate: 'Place and date: ______________________________',
  disclaimer:
    'Template provided by Solnow for guidance only. It does not constitute legal advice. Before using it with customers, review it with a legal advisor and verify the requirements of your Harbour Master and region. Generate, sign and archive this contract automatically with Solnow → solnow.io',
};

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

  // Minors annex
  sectionHead(data.minorsHead);
  data.minors.forEach(([l, h]) => fieldRow(l, h));

  // Signatures
  sectionHead(data.signHead);
  doc.moveDown(0.2);
  doc.fillColor(MUTED).font('Helvetica').fontSize(9).text(data.placeDate);
  doc.moveDown(1.4);
  const colW = (W - 40) / 3;
  const y = doc.y;
  const x0 = doc.page.margins.left;
  [data.signLessor, data.signRenter, data.signGuardian].forEach((label, i) => {
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

for (const data of [ES, EN]) {
  const file = render(data);
  console.log('generated', file);
}
