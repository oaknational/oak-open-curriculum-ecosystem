import type { OperationObject } from 'openapi-typescript';
import type { PrimitiveType } from './param-utils.js';

export interface ParamMetadata {
  typePrimitive: PrimitiveType;
  valueConstraint: boolean;
  required: boolean;
  allowedValues?: readonly unknown[];
}

// Pure string emitter for schema/type guard section
function headerBlock(): string {
  return [
    'type ValidRequestParams= {params: {',
    '  path?: Record<string, unknown>;',
    '  query?: Record<string, unknown>;',
    '}}',
    '',
  ].join('\n');
}

function validatorBlock(): string {
  return `function isValidRequestParams(value: unknown): value is ValidRequestParams {
  if (value === null || typeof value !== "object") return false;
  const paramsDesc = Object.getOwnPropertyDescriptor(value, "params");
  const params = paramsDesc?.value;
  if (params !== undefined && (params === null || typeof params !== "object")) return false;
  const path = params?.path;
  const query = params?.query;
  if (path !== undefined && (path === null || typeof path !== "object" || Array.isArray(path))) return false;
  if (query !== undefined && (query === null || typeof query !== "object" || Array.isArray(query))) return false;
  for (const [name, meta] of Object.entries(pathParams)) {
    if (meta && (meta as { required?: boolean }).required === true) {
      const has = Boolean(path && Object.prototype.hasOwnProperty.call(path, name));
      if (!has) return false;
    }
  }
  for (const [name, meta] of Object.entries(queryParams)) {
    if (meta && (meta as { required?: boolean }).required === true) {
      const has = Boolean(query && Object.prototype.hasOwnProperty.call(query, name));
      if (!has) return false;
    }
  }
  const validateValue = (meta: unknown, value: unknown): boolean => {
    if (!meta || typeof meta !== "object") return true;
    const m = meta as {
      valueConstraint?: boolean;
      typeguard?: (v: unknown) => boolean
    };
    if (m.valueConstraint && typeof m.typeguard === "function") {
      return m.typeguard(value);
    }
    return true;
  };
  if (path) {
    for (const [k, v] of Object.entries(path)) {
      if (!validateValue((pathParams as Record<string, unknown>)[k], v)) return false;
    }
  }
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (!validateValue((queryParams as Record<string, unknown>)[k], v)) return false;
    }
  }
  return true;
}

const getValidRequestParamsDescription= () => {
  return 'Invalid request parameters. Please match the following schema:';
};`;
}

export function emitSchema(
  _operation: OperationObject,
  _pathParamMetadata: Record<string, ParamMetadata>,
  _queryParamMetadata: Record<string, ParamMetadata>,
): string {
  void [_operation, _pathParamMetadata, _queryParamMetadata];
  return [headerBlock(), validatorBlock()].join('\n');
}
