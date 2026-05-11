type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | readonly JsonValue[];

interface JsonObject {
  readonly [key: string]: JsonValue | undefined;
}

export function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getJsonValue(record: JsonObject, key: string): unknown {
  return record[key];
}

export function requireString(record: JsonObject, key: string): string {
  const value = getJsonValue(record, key);
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`missing required string field: ${key}`);
  }

  return value;
}

/**
 * Require that a string field is present (key exists, value is a string) but
 * permit an empty value. Distinguishes "absent / wrong type" (throws) from
 * "intentionally empty" (returns the empty string). Used for fields like
 * `claim_id` on lifecycle events, where the schema requires the field but
 * permits an empty value for non-claim-scoped events.
 */
export function requirePossiblyEmptyString(record: JsonObject, key: string): string {
  const value = getJsonValue(record, key);
  if (typeof value !== 'string') {
    throw new Error(`missing required string field: ${key}`);
  }

  return value;
}

/**
 * Read an optional string field. Returns `undefined` when the field is absent;
 * throws when the field is present but not a non-empty string.
 */
export function optionalString(record: JsonObject, key: string): string | undefined {
  const value = getJsonValue(record, key);
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`optional field ${key} must be a non-empty string when present`);
  }

  return value;
}

/**
 * Read an optional string-array field. Returns `undefined` when the field is
 * absent; throws when the field is present but not a non-empty-string array.
 */
export function optionalStringArray(
  record: JsonObject,
  key: string,
): readonly string[] | undefined {
  const value = getJsonValue(record, key);
  if (value === undefined) {
    return undefined;
  }

  return parseStringArray(value, key);
}

export function parseStringArray(value: unknown, label: string): readonly string[] {
  if (Array.isArray(value) && value.every((entry) => typeof entry === 'string')) {
    return value;
  }

  throw new Error(`${label} must be an array of strings`);
}
