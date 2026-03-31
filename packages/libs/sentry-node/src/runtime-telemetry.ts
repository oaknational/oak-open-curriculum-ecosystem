import { sanitiseForJson, sanitiseObject, type JsonObject } from '@oaknational/logger';
import {
  redactHeaderValue,
  redactTelemetryObject,
  redactTelemetryValue,
} from '@oaknational/observability';

function requireJsonObject(value: JsonObject | null | undefined): JsonObject {
  if (!value) {
    throw new Error('Expected telemetry redaction to preserve object values');
  }

  return value;
}

export function describeUnknownError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function redactText(value: string, key?: string): string {
  const redacted = redactTelemetryValue(value, key);

  if (typeof redacted !== 'string') {
    throw new Error('Expected telemetry redaction to preserve string values');
  }

  return redacted;
}

export function redactUnknownValue(value: unknown, key?: string): unknown {
  return redactTelemetryValue(sanitiseForJson(value), key);
}

export function redactJsonObject(value: unknown): JsonObject | undefined {
  const sanitised = sanitiseObject(value);

  if (!sanitised) {
    return undefined;
  }

  return requireJsonObject(sanitiseObject(redactTelemetryObject(sanitised)));
}

export function redactStringRecord(
  values: Readonly<Record<string, string>> | undefined,
): Record<string, string> | undefined {
  if (!values) {
    return undefined;
  }

  const redacted: Record<string, string> = {};

  for (const key in values) {
    redacted[key] = redactHeaderValue(key, values[key]);
  }

  return redacted;
}
