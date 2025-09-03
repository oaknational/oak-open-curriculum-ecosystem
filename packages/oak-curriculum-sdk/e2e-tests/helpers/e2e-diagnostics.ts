/**
 * E2E diagnostics: provide actionable context when an API call fails.
 *
 * Logs HTTP status, URL, key headers, the error payload, and for 5xx
 * optionally re-fetches the same URL with the same Authorization header
 * to capture the raw body for correlation.
 */

type Errorish = unknown;

function safeJson(value: unknown, max = 4000): string {
  try {
    const text = JSON.stringify(value, null, 2);
    return text.length > max ? `${text.slice(0, max)}… [truncated]` : text;
  } catch {
    return '[unserializable]';
  }
}

function pickHeaders(h: Headers, keys: string[]): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (const k of keys) out[k] = h.get(k);
  return out;
}

/* eslint-disable-next-line max-lines-per-function, complexity */
export async function logErrorDiagnostics(
  result: { response: Response; error: Errorish },
  context: Record<string, unknown> = {},
  options: { apiKey?: string } = {},
): Promise<void> {
  const { response, error } = result;

  const status = response.status;
  const url = response.url;
  const statusText = response.statusText;
  const headers = pickHeaders(response.headers, [
    'x-request-id',
    'x-correlation-id',
    'x-ratelimit-limit',
    'x-ratelimit-remaining',
    'x-ratelimit-reset',
    'date',
    'content-type',
  ]);

  let probable = 'unknown';
  if (status >= 500) probable = 'upstream-instability-or-server-error (5xx)';
  else if (status === 429) probable = 'rate-limited (429)';
  else if (status >= 400) probable = 'client/test-input-or-auth (4xx)';

  console.error('--- E2E DIAGNOSTICS BEGIN ---');
  console.error('Context:', safeJson(context));
  console.error('HTTP:', safeJson({ status, statusText, url }));
  console.error('Headers:', safeJson(headers));
  console.error('Error payload:', safeJson(error));
  console.error('Probable cause:', probable);

  // Optional verification fetch for 5xx only
  if (status >= 500 && options.apiKey) {
    try {
      const verification = await fetch(url, {
        headers: {
          Authorization: `Bearer ${options.apiKey}`,
          Accept: 'application/json',
        },
      });
      const rawText = await verification.text();
      console.error(
        'Verification fetch:',
        safeJson({
          status: verification.status,
          statusText: verification.statusText,
          headers: pickHeaders(verification.headers, ['x-request-id', 'content-type', 'date']),
          body: rawText.length > 1000 ? `${rawText.slice(0, 1000)}… [truncated]` : rawText,
        }),
      );
    } catch (verErr) {
      console.error('Verification fetch failed:', safeJson(verErr));
    }
  }

  console.error('--- E2E DIAGNOSTICS END ---');
}
