import type { PrimitiveType } from './param-utils.js';
import { buildInputSchemaObject, type JsonSchemaObject } from './emit-input-schema.js';

export interface ParamMetadata {
  readonly typePrimitive: PrimitiveType;
  readonly valueConstraint: boolean;
  readonly required: boolean;
  readonly allowedValues?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}

function buildRequiredList(schema: JsonSchemaObject): string {
  if (!schema.required || schema.required.length === 0) {
    return '(none)';
  }
  return schema.required.join(', ');
}

function escapeForSingleQuotedJsString(text: string): string {
  // Escape backslashes and single quotes, preserve newlines as \n
  return text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

/**
 * Emit a compile-time function literal for parameter validation errors.
 * The returned string is a JS/TS snippet defining `getValidRequestParamsDescription`.
 */
export function emitErrorDescription(
  pathParamMetadata: Record<string, ParamMetadata>,
  queryParamMetadata: Record<string, ParamMetadata>,
): string {
  const schema = buildInputSchemaObject(pathParamMetadata, queryParamMetadata);

  const compactSchemaJson = JSON.stringify(schema);
  const requiredList = buildRequiredList(schema);

  const content = [
    'Invalid request parameters. Please match the following schema:',
    `Schema: ${compactSchemaJson}`,
    `Required: ${requiredList}`,
  ].join('\n');

  const escaped = escapeForSingleQuotedJsString(content);

  return ['const getValidRequestParamsDescription= () => {', `  return '${escaped}';`, '};'].join(
    '\n',
  );
}
