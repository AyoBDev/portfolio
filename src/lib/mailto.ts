// Single place that builds the mailto link, so every email button stays in sync.
export function buildMailtoUrl(email: string, subject: string, body?: string): string {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${email}?${params.join('&')}`;
}
