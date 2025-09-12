import type { OperationObject } from 'openapi-typescript';
import type { PrimitiveType } from './param-utils.js';
import { buildInputSchemaObject } from './emit-input-schema.js';
import { emitErrorDescription } from './emit-error-description.js';

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

function objectShapeFromMeta(meta: Record<string, ParamMetadata>): string {
  const lines: string[] = ['{'];
  for (const [name, m] of Object.entries(meta)) {
    const optional = m.required ? '' : '?';
    lines.push(`  ${name}${optional}: ${tsTypeFor(m)};`);
  }
  lines.push('}');
  return lines.join('\n');
}

function headerBlock(
  pathParamMetadata: Record<string, ParamMetadata>,
  queryParamMetadata: Record<string, ParamMetadata>,
): string {
  const pathShape = objectShapeFromMeta(pathParamMetadata);
  const queryShape = objectShapeFromMeta(queryParamMetadata);
  const hasPath = Object.keys(pathParamMetadata).length > 0;
  const hasQuery = Object.keys(queryParamMetadata).length > 0;
  const hasRequiredQuery = Object.values(queryParamMetadata).some((m) => m.required);
  const lines: string[] = [];
  if (hasPath) lines.push('type PathParamsShape = ' + pathShape + ';');
  if (hasQuery) lines.push('type QueryParamsShape = ' + queryShape + ';');
  lines.push('type ValidRequestParams= {params: {');
  if (hasPath) lines.push('  path: PathParamsShape;');
  if (hasQuery) {
    lines.push(hasRequiredQuery ? '  query: QueryParamsShape;' : '  query?: QueryParamsShape;');
  }
  lines.push('}}');
  lines.push('');
  return lines.join('\n');
}

function buildValidatorHead(): string[] {
  return [
    'function isValidRequestParams(value: unknown): value is ValidRequestParams {',
    '  if (value === null || typeof value !== "object") return false;',
    '  const paramsDesc = Object.getOwnPropertyDescriptor(value, "params");',
    '  const params = paramsDesc?.value;',
    '  if (params !== undefined && (params === null || typeof params !== "object")) return false;',
    '  const path = params?.path;',
    '  const query = params?.query;',
    '  if (path !== undefined && (path === null || typeof path !== "object" || Array.isArray(path))) return false;',
    '  if (query !== undefined && (query === null || typeof query !== "object" || Array.isArray(query))) return false;',
    '  for (const [name, meta] of Object.entries(pathParams)) {',
    '    if (meta && (meta as { required?: boolean }).required === true) {',
    '      const has = Boolean(path && Object.prototype.hasOwnProperty.call(path, name));',
    '      if (!has) return false;',
    '    }',
    '  }',
    '  for (const [name, meta] of Object.entries(queryParams)) {',
    '    if (meta && (meta as { required?: boolean }).required === true) {',
    '      const has = Boolean(query && Object.prototype.hasOwnProperty.call(query, name));',
    '      if (!has) return false;',
    '    }',
    '  }',
  ];
}

function buildValidatorTail(): string[] {
  return [
    '  const hasTypeguardAndValidate = (container: unknown, key: string, value: unknown): boolean => {',
    "    if (container === null || typeof container !== 'object') return true;",
    '    const metaDesc = Object.getOwnPropertyDescriptor(container, key);',
    '    const metaVal = metaDesc?.value;',
    "    if (metaVal && typeof metaVal === 'object') {",
    "      const tgDesc = Object.getOwnPropertyDescriptor(metaVal, 'typeguard');",
    "      const vcDesc = Object.getOwnPropertyDescriptor(metaVal, 'valueConstraint');",
    '      const typeguard = tgDesc?.value;',
    '      const hasConstraint = vcDesc?.value === true;',
    '      if (hasConstraint && typeof typeguard === "function") {',
    '        return typeguard(value);',
    '      }',
    '    }',
    '    return true;',
    '  };',
    '  if (path) {',
    '    for (const [k, v] of Object.entries(path)) {',
    '      if (!hasTypeguardAndValidate(pathParams, k, v)) return false;',
    '    }',
    '  }',
    '  if (query) {',
    '    for (const [k, v] of Object.entries(query)) {',
    '      if (!hasTypeguardAndValidate(queryParams, k, v)) return false;',
    '    }',
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
  pathParamMetadata: Record<string, ParamMetadata>,
  queryParamMetadata: Record<string, ParamMetadata>,
): string {
  // Build a concrete JSON Schema object and embed it as a literal
  const schemaObject = buildInputSchemaObject(pathParamMetadata, queryParamMetadata);
  const schemaLiteral = JSON.stringify(schemaObject);
  return `const inputSchema = ${schemaLiteral} as const;`;
}

export function emitSchema(
  _operation: OperationObject,
  _pathParamMetadata: Record<string, ParamMetadata>,
  _queryParamMetadata: Record<string, ParamMetadata>,
): string {
  void [_operation];
  return [
    headerBlock(_pathParamMetadata, _queryParamMetadata),
    inputSchemaBlock(_pathParamMetadata, _queryParamMetadata),
    validatorBlock(),
    emitErrorDescription(_pathParamMetadata, _queryParamMetadata),
  ].join('\n');
}
