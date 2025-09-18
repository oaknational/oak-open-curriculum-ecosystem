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

function pickHeaders(h: Headers, keys: string[]): { name: string; value: string | null }[] {
  const out: { name: string; value: string | null }[] = [];
  for (const k of keys) {
    out.push({ name: k, value: h.get(k) });
  }
  return out;
}

export async function logErrorDiagnostics(
  result: { response: Response; error: Errorish },
  context: unknown = {},
  options: { apiKey?: string } = {},
): Promise<void> {
  const { response, error } = result;
  const status = response.status;
  const url = response.url;
  printHeader(context, status, response.statusText, url, response.headers, error);
  await maybeVerify(status, options.apiKey, url);
  console.error('--- E2E DIAGNOSTICS END ---');
}

function printHeader(
  context: unknown,
  status: number,
  statusText: string,
  url: string,
  headersIn: Headers,
  error: Errorish,
): void {
  const headers = pickHeaders(headersIn, [
    'x-request-id',
    'x-correlation-id',
    'x-ratelimit-limit',
    'x-ratelimit-remaining',
    'x-ratelimit-reset',
    'date',
    'content-type',
  ]);
  console.error('--- E2E DIAGNOSTICS BEGIN ---');
  console.error('Context:', safeJson(context));
  console.error('HTTP:', safeJson({ status, statusText, url }));
  console.error('Headers:', safeJson(headers));
  console.error('Error payload:', safeJson(error));
  console.error('Probable cause:', classify(status));
}

function classify(status: number): string {
  if (status >= 500) {
    return 'upstream-instability-or-server-error (5xx)';
  }
  if (status === 429) {
    return 'rate-limited (429)';
  }
  if (status >= 400) {
    return 'client/test-input-or-auth (4xx)';
  }
  return 'unknown';
}

async function maybeVerify(status: number, apiKey: string | undefined, url: string): Promise<void> {
  if (!(status >= 500 && apiKey)) {
    return;
  }
  try {
    const verification = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
