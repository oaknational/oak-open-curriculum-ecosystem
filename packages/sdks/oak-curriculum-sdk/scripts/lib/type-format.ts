/* TypeDoc type formatting and guards (pure) */

import type { TDArray, TDIntrinsic, TDLiteral, TDReference, TDUnion } from './ai-doc-types';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
function hasProp<K extends string>(o: unknown, k: K): o is Record<K, unknown> {
  return isRecord(o) && k in o;
}

function renderLiteral(value: TDLiteral['value']): string {
  return typeof value === 'string' ? JSON.stringify(value) : String(value);
}
function renderReference(t: TDReference): string {
  const args =
    t.typeArguments && t.typeArguments.length > 0
      ? `<${t.typeArguments.map((a) => typeToString(a)).join(', ')}>`
      : '';
  return `${t.name}${args}`;
}
function renderArray(t: TDArray): string {
  return `${typeToString(t.elementType)}[]`;
}
function renderUnion(t: TDUnion): string {
  return t.types.map((x) => typeToString(x)).join(' | ');
}

function isIntrinsic(t: unknown): t is TDIntrinsic {
  return (
    hasProp(t, 'type') && hasProp(t, 'name') && t.type === 'intrinsic' && typeof t.name === 'string'
  );
}
function isArrayT(t: unknown): t is TDArray {
  return hasProp(t, 'type') && isRecord(t) && t.type === 'array' && 'elementType' in t;
}
function isUnion(t: unknown): t is TDUnion {
  return hasProp(t, 'type') && hasProp(t, 'types') && t.type === 'union' && Array.isArray(t.types);
}
function isLiteral(t: unknown): t is TDLiteral {
  return hasProp(t, 'type') && isRecord(t) && t.type === 'literal' && 'value' in t;
}
function isReference(t: unknown): t is TDReference {
  return (
    hasProp(t, 'type') && hasProp(t, 'name') && t.type === 'reference' && typeof t.name === 'string'
  );
}

function stringifyKnown(t: unknown): string | null {
  if (isIntrinsic(t)) return t.name;
  if (isArrayT(t)) return renderArray(t);
  if (isUnion(t)) return renderUnion(t);
  if (isLiteral(t)) return renderLiteral(t.value);
  if (isReference(t)) return renderReference(t);
  return null;
}

export function typeToString(t?: unknown): string {
  if (!t) return 'void';
  const known = stringifyKnown(t);
  if (known !== null) return known;
  if (hasProp(t, 'type')) {
    const kind = String(t.type);
    return `<${kind}>(…)`;
  }
  return 'unknown';
}
