import type { OperationObject } from 'openapi-typescript';
import type { PrimitiveType } from './param-utils.js';
import { buildInputSchemaObject } from './emit-input-schema.js';
import { emitErrorDescription } from './emit-error-description.js';
import { typeSafeKeys, typeSafeValues } from '../../../../src/types/helpers.js';

export interface ParamMetadata {
  typePrimitive: PrimitiveType;
  valueConstraint: boolean;
  required: boolean;
  allowedValues?: readonly unknown[];
  description?: string;
  default?: unknown;
}

// Pure string emitter for schema/type guard section
function tsTypeFor(meta: ParamMetadata): string {
  if (Array.isArray(meta.allowedValues) && meta.allowedValues.length > 0) {
    // Emit literal union
    return meta.allowedValues
      .map((v) => (typeof v === 'string' ? `'${v}'` : String(v)))
      .join(' | ');
  }
  const t = meta.typePrimitive;
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  if (t === 'string[]') return 'string[]';
  if (t === 'number[]') return 'number[]';
  return 'boolean[]';
}

function objectShapeFromMeta(meta: Readonly<Record<string, ParamMetadata>>): string {
  const lines: string[] = ['{'];
  for (const name in meta) {
    if (!(name in meta)) continue;
    const m = meta[name];
    const optional = m.required ? '' : '?';
    lines.push(`  ${name}${optional}: ${tsTypeFor(m)};`);
  }
  lines.push('}');
  return lines.join('\n');
}

function headerBlock(
  pathParamMetadata: Readonly<Record<string, ParamMetadata>>,
  queryParamMetadata: Readonly<Record<string, ParamMetadata>>,
): string {
  const pathShape = objectShapeFromMeta(pathParamMetadata);
  const queryShape = objectShapeFromMeta(queryParamMetadata);
  const hasPath = typeSafeKeys(pathParamMetadata).length > 0;
  const hasQuery = typeSafeKeys(queryParamMetadata).length > 0;
  const hasRequiredQuery = typeSafeValues(queryParamMetadata).some((m) => m.required);
  const lines: string[] = [];
  if (hasPath) lines.push('type PathParamsShape = ' + pathShape);
  if (hasQuery) lines.push('type QueryParamsShape = ' + queryShape);
  if (!hasPath && !hasQuery) {
    lines.push('interface ValidRequestParams {');
    lines.push('  [key: string]: unknown;');
    lines.push('  params?: object');
    lines.push('}');
  } else {
    lines.push('interface ValidRequestParams {');
    lines.push('  [key: string]: unknown;');
    lines.push('  params: {');
    if (hasPath) lines.push('    path: PathParamsShape;');
    if (hasQuery) {
      lines.push(
        hasRequiredQuery ? '    query: QueryParamsShape;' : '    query?: QueryParamsShape;',
      );
    }
    lines.push('  };');
    lines.push('}');
  }
  lines.push('');
  return lines.join('\n');
}

function buildValidatorHelpers(): string[] {
  return [
    'function hasRequired(meta: object, container: unknown): boolean {',
    '  if (container === null) return false;',
    "  if (container !== undefined && typeof container !== 'object') return false;",
    '  const obj = typeof container === "object" && container !== null ? container : undefined;',
    '  for (const name in meta) {',
    '    if (!(name in meta)) continue;',
    '    const m = getOwnValue(meta, name);',
    '    const isReq = Boolean(getOwnValue(m, "required"));',
    '    if (isReq) {',
    '      if (!obj || !(name in obj)) return false;',
    '    }',
    '  }',
    '  return true;',
    '}',
    '',
    'function validateKnown(validators: Readonly<Record<string, (value: unknown) => boolean>> | undefined, container: unknown): boolean {',
    '  if (!validators) return true;',
    '  for (const k in validators) {',
    '    if (!(k in validators)) continue;',
    '    const fn = validators[k];',
    '    const isObj = typeof container === "object" && container !== null;',
    '    if (typeof fn === "function" && isObj && (k in container)) {',
    '      const v = getOwnValue(container, k);',
    '      if (!fn(v)) return false;',
    '    }',
    '  }',
    '  return true;',
    '}',
    '',
  ];
}

function buildValidatorHead(): string[] {
  return [
    'function isValidRequestParams(value: unknown): value is ValidRequestParams {',
    '  if (value === null || typeof value !== "object") return false;',
    '  const params = getOwnValue(value, "params");',
    '  if (params === null) return false;',
    '  if (params !== undefined && typeof params !== "object") return false;',
    '  const path = getOwnValue(params, "path");',
    '  const query = getOwnValue(params, "query");',
    '  if (path === null) return false;',
    '  if (path !== undefined && (typeof path !== "object" || Array.isArray(path))) return false;',
    '  if (query === null) return false;',
    '  if (query !== undefined && (typeof query !== "object" || Array.isArray(query))) return false;',
    '  if (!hasRequired(pathParams, path)) return false;',
    '  if (!hasRequired(queryParams, query)) return false;',
  ];
}

function buildValidatorTail(): string[] {
  return [
    '  if (typeof path === "object" && path !== null) {',
    '    if (!validateKnown(pathValueValidators, path)) return false;',
    '  }',
    '  if (typeof query === "object" && query !== null) {',
    '    if (!validateKnown(queryValueValidators, query)) return false;',
    '  }',
    '  return true;',
    '}',
    '',
  ];
}

function validatorBlock(): string {
  return [...buildValidatorHead(), ...buildValidatorTail()].join('\n');
}

function inputSchemaBlock(
  pathParamMetadata: Readonly<Record<string, ParamMetadata>>,
  queryParamMetadata: Readonly<Record<string, ParamMetadata>>,
): string {
  // Build JSON schema and then emit a typed literal with mutable required
  const schemaObject = buildInputSchemaObject(pathParamMetadata, queryParamMetadata);
  const propertiesLiteral = JSON.stringify(schemaObject.properties);
  const requiredKeys: string[] = [];
  for (const name in pathParamMetadata) {
    if (!(name in pathParamMetadata)) continue;
    if (pathParamMetadata[name].required) requiredKeys.push(name);
  }
  for (const name in queryParamMetadata) {
    if (!(name in queryParamMetadata)) continue;
    if (queryParamMetadata[name].required) requiredKeys.push(name);
  }
  const requiredPart = requiredKeys.length > 0 ? `, required: ${JSON.stringify(requiredKeys)}` : '';
  return `const inputSchema = { type: 'object' as const, properties: ${propertiesLiteral} as const, additionalProperties: false as const${requiredPart} };`;
}

export function emitSchema(
  _operation: OperationObject,
  _pathParamMetadata: Readonly<Record<string, ParamMetadata>>,
  _queryParamMetadata: Readonly<Record<string, ParamMetadata>>,
): string {
  void [_operation];
  return [
    headerBlock(_pathParamMetadata, _queryParamMetadata),
    ...buildValidatorHelpers(),
    inputSchemaBlock(_pathParamMetadata, _queryParamMetadata),
    validatorBlock(),
    emitErrorDescription(_pathParamMetadata, _queryParamMetadata),
  ].join('\n');
}
