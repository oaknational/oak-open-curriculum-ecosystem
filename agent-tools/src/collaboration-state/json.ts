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

export function parseStringArray(value: unknown, label: string): readonly string[] {
  if (Array.isArray(value) && value.every((entry) => typeof entry === 'string')) {
    return value;
  }

  throw new Error(`${label} must be an array of strings`);
}
