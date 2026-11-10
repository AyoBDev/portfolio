import type { APIRoute } from 'astro';
import { buildCvDocument } from '../lib/cv/buildCvDocument';
import { renderCvPdf } from '../lib/cv/renderCvPdf';

// Built into dist/ at build time, so the CV is regenerated from the site content on every deploy.
// The file name must match SITE.cvPath.
export const GET: APIRoute = async () =>
  new Response(await renderCvPdf(buildCvDocument()), {
    headers: { 'Content-Type': 'application/pdf' },
  });
