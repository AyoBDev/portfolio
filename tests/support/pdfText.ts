import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

export type ExtractedPdf = { pageCount: number; text: string };

/**
 * Pulls the text out of a PDF the way an applicant tracking system would: page by page,
 * in reading order, with each text line on its own line.
 */
export async function extractPdfText(bytes: Uint8Array): Promise<ExtractedPdf> {
  const pdf = await getDocument({ data: bytes, useSystemFonts: false }).promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const lines: string[] = [];
    let current = '';
    for (const item of content.items) {
      if (!('str' in item)) continue;
      current += item.str;
      if (item.hasEOL) {
        lines.push(current);
        current = '';
      }
    }
    if (current) lines.push(current);
    pages.push(lines.join('\n'));
  }
  return { pageCount: pdf.numPages, text: pages.join('\n') };
}
