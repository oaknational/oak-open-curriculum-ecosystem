/*
 * TypeDoc guard helpers (small, pure, no side effects)
 */
export function isRecord(v: unknown): v is object {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function isString(v: unknown): v is string {
  return typeof v === 'string';
}
