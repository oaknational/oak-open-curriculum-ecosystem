/*
 * TypeDoc guard helpers (small, pure, no side effects)
 */

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

export function isString(v: unknown): v is string {
  return typeof v === 'string';
}
