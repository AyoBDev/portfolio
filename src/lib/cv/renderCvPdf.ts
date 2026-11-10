// Draws a CvDocument as a one-column, text-only PDF. That is what applicant tracking systems
// parse best: real selectable text in reading order, standard fonts, no tables, icons or images.
import PDFDocument from 'pdfkit';
import type { CvDocument, CvItem } from './buildCvDocument';

const PAGE = { size: 'A4', margin: 48 } as const;
const FONT = { regular: 'Helvetica', bold: 'Helvetica-Bold' } as const;
const SIZE = {
  name: 20,
  title: 12,
  section: 12,
  heading: 10.5,
  body: 9.5,
} as const;
const COLOR = { text: '#102C40', muted: '#4A5B68', rule: '#9AA7B1' } as const;
const SPACE = {
  afterHeader: 10,
  beforeSection: 10,
  afterSectionTitle: 6,
  betweenItems: 6,
  bulletIndent: 12,
} as const;
const CONTACT_SEPARATOR = '  |  ';
const BULLET = '•';
/** Room to keep a heading with at least its first line or two, instead of stranding it at a page foot. */
const KEEP_WITH_NEXT = 48;

type Pdf = InstanceType<typeof PDFDocument>;

function contentWidth(doc: Pdf): number {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}

function startNewPageIfLow(doc: Pdf, needed: number): void {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + needed > bottom) doc.addPage();
}

function drawHeader(doc: Pdf, cv: CvDocument): void {
  const left = doc.page.margins.left;
  doc.font(FONT.bold).fontSize(SIZE.name).fillColor(COLOR.text).text(cv.name, left);
  doc.font(FONT.regular).fontSize(SIZE.title).text(cv.title);
  doc.moveDown(0.2).fontSize(SIZE.body).fillColor(COLOR.muted).text(cv.contact.join(CONTACT_SEPARATOR));
  cv.links.forEach((link, index) => {
    const isLast = index === cv.links.length - 1;
    const label = isLast ? link : `${link}${CONTACT_SEPARATOR}`;
    doc.text(label, {
      link: `https://${link}`,
      continued: !isLast,
      underline: false,
    });
  });
  doc.moveDown(0).y += SPACE.afterHeader;
}

function drawSectionTitle(doc: Pdf, title: string): void {
  doc.y += SPACE.beforeSection;
  startNewPageIfLow(doc, KEEP_WITH_NEXT);
  const left = doc.page.margins.left;
  doc.font(FONT.bold).fontSize(SIZE.section).fillColor(COLOR.text).text(title, left);
  const ruleY = doc.y + 1;
  doc
    .moveTo(left, ruleY)
    .lineTo(left + contentWidth(doc), ruleY)
    .lineWidth(0.75)
    .strokeColor(COLOR.rule)
    .stroke();
  doc.y = ruleY + SPACE.afterSectionTitle;
}

/** Heading and subheading on the left, dates right-aligned on the same line. */
function drawItemHeading(doc: Pdf, item: CvItem): void {
  if (!item.heading) return;
  const left = doc.page.margins.left;
  const width = contentWidth(doc);
  const top = doc.y;
  doc.fontSize(SIZE.heading);
  const datesWidth = item.dates ? doc.font(FONT.regular).widthOfString(item.dates) + 12 : 0;
  // The heading is drawn first so text extraction reads it before the dates.
  doc
    .font(FONT.bold)
    .fillColor(COLOR.text)
    .text(item.heading, left, top, {
      width: width - datesWidth,
      continued: Boolean(item.subheading),
    });
  if (item.subheading) doc.font(FONT.regular).fillColor(COLOR.muted).text(`, ${item.subheading}`);
  const afterHeading = doc.y;
  if (item.dates) {
    doc.font(FONT.regular).fillColor(COLOR.muted).text(item.dates, left, top, { width, align: 'right' });
  }
  doc.y = afterHeading;
}

function drawBullets(doc: Pdf, bullets: string[]): void {
  const left = doc.page.margins.left;
  const width = contentWidth(doc);
  doc.font(FONT.regular).fontSize(SIZE.body).fillColor(COLOR.text);
  for (const bullet of bullets) {
    const top = doc.y;
    doc.text(BULLET, left + 2, top, { lineBreak: false });
    doc.text(bullet, left + SPACE.bulletIndent, top, {
      width: width - SPACE.bulletIndent,
    });
  }
}

function drawItem(doc: Pdf, item: CvItem): void {
  startNewPageIfLow(doc, KEEP_WITH_NEXT / 2);
  drawItemHeading(doc, item);
  if (item.text) {
    doc
      .font(FONT.regular)
      .fontSize(SIZE.body)
      .fillColor(COLOR.text)
      .text(item.text, doc.page.margins.left, doc.y, {
        width: contentWidth(doc),
      });
  }
  if (item.bullets?.length) drawBullets(doc, item.bullets);
  doc.y += SPACE.betweenItems;
}

/** Renders the CV and resolves with the finished PDF bytes. */
export function renderCvPdf(cv: CvDocument): Promise<Uint8Array<ArrayBuffer>> {
  const doc = new PDFDocument({
    size: PAGE.size,
    margin: PAGE.margin,
    lang: 'en',
    displayTitle: true,
    info: {
      Title: `${cv.name} – CV`,
      Author: cv.name,
      Subject: cv.title,
      Keywords: cv.title,
    },
  });
  const chunks: Buffer[] = [];
  const finished = new Promise<Uint8Array<ArrayBuffer>>((resolve, reject) => {
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Uint8Array.from(Buffer.concat(chunks))));
    doc.on('error', reject);
  });
  drawHeader(doc, cv);
  for (const section of cv.sections) {
    drawSectionTitle(doc, section.title);
    section.items.forEach((item) => drawItem(doc, item));
  }
  doc.end();
  return finished;
}
