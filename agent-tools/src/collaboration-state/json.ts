type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | readonly JsonValue[];

export interface JsonObject {
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

/**
 * Parse JSON text at a trust boundary, converting the native `JSON.parse`
 * `SyntaxError` into an actionable error that names what the text was expected
 * to be. A raw parse failure ("No number after minus sign in JSON at position
 * 1" when a markdown file beginning with `---` is read as JSON) is position-only
 * and gives the caller no clue which surface — or which mis-passed `--active`
 * file — was malformed. The label restores that context.
 */
export function parseJsonText(text: string, label: string): unknown {
  try {
    const value: unknown = JSON.parse(text);
    return value;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`${label} is not valid JSON: ${reason}`, { cause: error });
  }
}
