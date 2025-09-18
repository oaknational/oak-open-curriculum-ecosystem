/* TypeDoc type formatting and guards (pure) */

import { getOwnString, getOwnValue } from '../../src/types/helpers';

function renderLiteral(value: unknown): string {
  return typeof value === 'string' ? JSON.stringify(value) : String(value);
}
function renderReferenceUnknown(t: unknown): string {
  const name = getOwnString(t, 'name') ?? 'Unknown';
  const argsUnknown = getOwnValue(t, 'typeArguments');
  const arr = Array.isArray(argsUnknown) ? argsUnknown : [];
  const args = arr.length > 0 ? `<${arr.map((a) => typeToString(a)).join(', ')}>` : '';
  return `${name}${args}`;
}
function renderArrayUnknown(t: unknown): string {
  const el = getOwnValue(t, 'elementType');
  return `${typeToString(el)}[]`;
}
function renderUnionUnknown(t: unknown): string {
  const types = getOwnValue(t, 'types');
  const arr = Array.isArray(types) ? types : [];
  return arr.map((x) => typeToString(x)).join(' | ');
}

function isIntrinsic(t: unknown): boolean {
  return getOwnString(t, 'type') === 'intrinsic' && typeof getOwnString(t, 'name') === 'string';
}
function isArrayT(t: unknown): boolean {
  return getOwnString(t, 'type') === 'array' && getOwnValue(t, 'elementType') !== undefined;
}
function isUnion(t: unknown): boolean {
  return getOwnString(t, 'type') === 'union' && Array.isArray(getOwnValue(t, 'types'));
}
function isLiteral(t: unknown): boolean {
  return getOwnString(t, 'type') === 'literal' && getOwnValue(t, 'value') !== undefined;
}
function isReference(t: unknown): boolean {
  return getOwnString(t, 'type') === 'reference' && typeof getOwnString(t, 'name') === 'string';
}

function stringifyKnown(t: unknown): string | null {
  if (isIntrinsic(t)) {
    return getOwnString(t, 'name') ?? 'unknown';
  }
  if (isArrayT(t)) {
    return renderArrayUnknown(t);
  }
  if (isUnion(t)) {
    return renderUnionUnknown(t);
  }
  if (isLiteral(t)) {
    const value = getOwnValue(t, 'value');
    return renderLiteral(value);
  }
  if (isReference(t)) {
    return renderReferenceUnknown(t);
  }
  return null;
}

export function typeToString(t?: unknown): string {
  if (!t) {
    return 'void';
  }
  const known = stringifyKnown(t);
  if (known !== null) {
    return known;
  }
  const kind = getOwnString(t, 'type');
  if (kind) {
    return `<${kind}>(…)`;
  }
  return 'unknown';
}
