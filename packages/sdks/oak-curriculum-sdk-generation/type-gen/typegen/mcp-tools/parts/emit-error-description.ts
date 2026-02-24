import { buildInputSchemaObject, type JsonSchemaObject } from './emit-input-schema.js';
import type { ParamMetadataMap } from './param-metadata.js';

function buildRequiredList(schema: JsonSchemaObject): string {
  if (!schema.required || schema.required.length === 0) {
    return '(none)';
  }
  return schema.required.join(', ');
}

function escapeForSingleQuotedJsString(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

export function emitErrorDescription(
  pathParamMetadata: ParamMetadataMap,
  queryParamMetadata: ParamMetadataMap,
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

  return [
    "const toolArgsDescription = '" + escaped + "';",
    'export const describeToolArgs = () => toolArgsDescription;',
  ].join('\n');
}
