import type { ParamMetadata } from './param-metadata.js';

export const CANONICAL_YEAR_VALUES = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  'all-years',
] as const;

const CANONICAL_YEAR_SET = new Set<string>(CANONICAL_YEAR_VALUES);

/**
 * Detect whether a parameter is a year field that should accept both
 * string and number inputs in the flat MCP schema.
 *
 * Matches two upstream schema shapes:
 * - Numeric year (e.g. questions/assets): `typePrimitive === 'number'`
 * - String-enum year (e.g. units): allowed values are a subset of canonical year values
 */
export function isYearParameterRequiringNormalisation(meta: ParamMetadata): boolean {
  if (meta.typePrimitive === 'number' && !meta.valueConstraint) {
    return true;
  }
  if (
    meta.typePrimitive === 'string' &&
    meta.allowedValues &&
    meta.allowedValues.length > 0 &&
    meta.allowedValues.every((v) => CANONICAL_YEAR_SET.has(String(v)))
  ) {
    return true;
  }
  return false;
}
