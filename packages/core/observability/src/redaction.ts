/**
 * Shared telemetry redaction helpers.
 *
 * The policy is recursive and value-oriented so it can be reused by logs,
 * spans, breadcrumbs, CLI metadata, and future Sentry hooks.
 */

import { typeSafeEntries, typeSafeFromEntries } from '@oaknational/type-helpers';
import { redactUrlString } from './redaction-url.js';
import type { TelemetryRecord, TelemetryValue } from './types.js';

/**
 * Redaction placeholder used across all observability surfaces.
 */
export const REDACTED_VALUE = '[REDACTED]';

const FULLY_REDACTED_KEYS = new Set([
  'access_token',
  'api-key',
  'api_key',
  'apikey',
  'authorization',
  'client_secret',
  'cookie',
  'id_token',
  'ip',
  'password',
  'proxy-authorization',
  'refresh_token',
  'secret',
  'set-cookie',
  'token',
  'x-api-key',
  'x-auth-token',
  'x-vercel-oidc-token',
  'x-vercel-proxy-signature',
]);

const PARTIALLY_REDACTED_HEADERS = new Set([
  'cf-connecting-ip',
  'x-forwarded-for',
  'x-real-ip',
  'x-vercel-forwarded-for',
  'x-vercel-proxied-for',
]);

const REDACTED_QUERY_KEYS = new Set([
  'access_token',
  'api_key',
  'apikey',
  'client_secret',
  'code',
  'id_token',
  'refresh_token',
  'state',
  'token',
]);

function isTelemetryObject(value: TelemetryValue): value is TelemetryRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normaliseKey(key: string): string {
  return key.toLowerCase();
}

function shouldFullyRedactKey(key: string): boolean {
  const normalisedKey = normaliseKey(key);
  return (
    FULLY_REDACTED_KEYS.has(normalisedKey) ||
    normalisedKey.includes('token') ||
    normalisedKey.includes('secret') ||
    normalisedKey.includes('password')
  );
}

function shouldPartiallyRedactHeader(key: string): boolean {
  return PARTIALLY_REDACTED_HEADERS.has(normaliseKey(key));
}

function partiallyRedactValue(value: string): string {
  if (value.length <= 8) {
    return REDACTED_VALUE;
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function redactEmbeddedCredentials(value: string): string {
  return value
    .replace(/\b(Bearer|Basic)\s+[^\s,]+/giu, '$1 [REDACTED]')
    .replace(
      /(^|\s)(--?(?:access-token|api-key|api_key|client-secret|client_secret|password|token)|(?:access_token|api_key|client_secret|password|token))=([^\s]+)/giu,
      '$1$2=[REDACTED]',
    );
}

function redactString(value: string): string {
  return redactEmbeddedCredentials(
    redactUrlString(value, {
      normaliseKey,
      redactedQueryKeys: REDACTED_QUERY_KEYS,
      redactedValue: REDACTED_VALUE,
    }),
  );
}

function redactScalarForKey(key: string | undefined, value: string): string {
  if (key !== undefined) {
    if (shouldFullyRedactKey(key)) {
      return REDACTED_VALUE;
    }

    if (shouldPartiallyRedactHeader(key)) {
      return partiallyRedactValue(value);
    }
  }

  return redactString(value);
}

function redactArray(
  values: readonly TelemetryValue[],
  key: string | undefined,
): readonly TelemetryValue[] {
  return values.map((entry) => redactTelemetryValue(entry, key));
}

function redactObject(value: TelemetryRecord): TelemetryRecord {
  return typeSafeFromEntries(
    typeSafeEntries(value).map(([key, entry]) => [key, redactTelemetryValue(entry, key)]),
  );
}

/**
 * Recursively redacts a JSON-safe telemetry value.
 *
 * @param value - JSON-safe telemetry input
 * @param key - Optional parent key used for key-specific redaction rules
 * @returns Redacted JSON-safe telemetry value
 */
export function redactTelemetryValue(value: TelemetryValue, key?: string): TelemetryValue {
  if (typeof value === 'string') {
    return redactScalarForKey(key, value);
  }

  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return redactArray(value, key);
  }

  if (isTelemetryObject(value)) {
    return redactObject(value);
  }

  return value;
}

/**
 * Recursively redacts a JSON-safe telemetry object.
 *
 * @param value - JSON-safe telemetry object
 * @returns Redacted object
 */
export function redactTelemetryObject(value: TelemetryRecord): TelemetryRecord {
  return redactObject(value);
}

/**
 * Redacts a single header value using the shared telemetry policy.
 *
 * @param name - Header name
 * @param value - Header value
 * @returns Redacted string safe for logs and telemetry
 */
export function redactHeaderValue(
  name: string,
  value: string | string[] | number | undefined,
): string {
  if (value === undefined) {
    return '[undefined]';
  }

  const stringValue = Array.isArray(value) ? value.join(', ') : String(value);
  return redactScalarForKey(name, stringValue);
}

/**
 * Applies header redaction to a full header record.
 *
 * @param headers - Header record to redact
 * @returns Redacted header record
 */
export function redactHeaderRecord(
  headers: Readonly<Record<string, string | string[] | number | undefined>>,
): Record<string, string> {
  return typeSafeFromEntries(
    typeSafeEntries(headers).map(([key, value]) => [key, redactHeaderValue(key, value)]),
  );
}
