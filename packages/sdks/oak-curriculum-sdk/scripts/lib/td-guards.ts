/*
 * TypeDoc guard helpers (small, pure, no side effects)
 */
import { isPlainObject } from '../../src/types/helpers';

export function isRecord(v: unknown): v is object {
  return isPlainObject(v);
}

export function isString(v: unknown): v is string {
  return typeof v === 'string';
}
