/**
 * Span-side redaction of the barrier (ADR-160): a span's description and its
 * string attributes, keyed so the redactor sees the attribute name.
 */
import { redactText } from '@oaknational/observability';
import { typeSafeEntries } from '@oaknational/type-helpers';
import type { SentrySpanPayload } from './types.js';

function isStringSpanArray(
  value: SentrySpanPayload['data'][string],
): value is (string | null | undefined)[] {
  return (
    Array.isArray(value) &&
    value.every((entry) => entry === null || entry === undefined || typeof entry === 'string')
  );
}

function redactSpanAttributeValue(
  key: string,
  value: SentrySpanPayload['data'][string],
): SentrySpanPayload['data'][string] {
  if (value === undefined || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return redactText(value, key);
  }

  if (isStringSpanArray(value)) {
    return value.map((entry) => (typeof entry === 'string' ? redactText(entry, key) : entry));
  }

  return value;
}

function redactSpanData(data: SentrySpanPayload['data']): SentrySpanPayload['data'] {
  const redacted: SentrySpanPayload['data'] = {};

  for (const [key, value] of typeSafeEntries(data)) {
    redacted[key] = redactSpanAttributeValue(key, value);
  }

  return redacted;
}

/** Redact a span before it leaves the process (ADR-160's barrier). */
export function redactSentrySpan(span: SentrySpanPayload): SentrySpanPayload {
  return {
    ...span,
    data: redactSpanData(span.data),
    ...(span.description ? { description: redactText(span.description) } : {}),
  };
}
