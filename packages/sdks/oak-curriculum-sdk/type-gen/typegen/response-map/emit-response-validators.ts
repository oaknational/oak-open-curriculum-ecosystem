import type { ResponseMapEntry } from './build-response-map.js';

/**
 * Emit the TypeScript source for response schema validators derived from the response map entries.
 * The output file is consumed at compile time by esbuild, so the template must be valid TypeScript.
 */
export function emitResponseValidators(entries: readonly ResponseMapEntry[]): string {
  const header = `/**
* GENERATED FILE - DO NOT EDIT
*
* Response validator map built from OpenAPI schema at compile-time.
*/
import { curriculumSchemas, type CurriculumSchemaDefinition } from '../zod/curriculumZodSchemas.js';
import { type AllowedMethods, type AllowedMethodsForPath, type OperationId, type ValidNumericResponseCode, type ValidPath, type ValidResponseCode, getOperationIdByPathAndMethod } from './path-parameters.js';
`;

  const mapEntries = entries
    .map((entry) => {
      const schemaExpr = buildSchemaExpression(entry);
      const jsonSchemaLiteral = entry.jsonSchema ? JSON.stringify(entry.jsonSchema) : 'undefined';
      const zodIdentifierLiteral = entry.zodIdentifier ? `'${entry.zodIdentifier}'` : 'undefined';

      return `  '${entry.operationId}:${entry.status}': {
    schema: ${schemaExpr},
    operationId: '${entry.operationId}',
    status: '${entry.status}',
    path: '${entry.path}',
    colonPath: '${entry.colonPath}',
    method: '${entry.method}',
    source: '${entry.source}',
    zodIdentifier: ${zodIdentifierLiteral},
    jsonSchema: ${jsonSchemaLiteral},
  },`;
    })
    .join('\n');

  const allowedIds = entries.map((entry) => `  '${entry.operationId}:${entry.status}',`).join('\n');

  const responseMapBlock = `const RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS: Record<string, {
  readonly schema: CurriculumSchemaDefinition;
  readonly operationId: OperationId | '*';
  readonly status: ValidResponseCode | ValidNumericResponseCode;
  readonly path: ValidPath | '*';
  readonly colonPath: string;
  readonly method: AllowedMethods | '*';
  readonly source: 'component' | 'inline' | 'void';
  readonly zodIdentifier?: string;
  readonly jsonSchema?: unknown;
}> = {
${mapEntries}
};

const ALLOWED_IDS = [
${allowedIds}
] as const;

export type AllowedId = (typeof ALLOWED_IDS)[number];

export function isAllowedId(value: string): value is AllowedId {
  return ALLOWED_IDS.includes(value as AllowedId);
}
`;

  const helperFunctions = `export type ResponseSchemaByOperationIdAndStatus = typeof RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS;

function getResponseRecord(id: AllowedId) {
  const found = RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS[id];
  if (!found) {
    throw new TypeError('No response schema for id: ' + String(id));
  }
  return found;
}

function requireSchema(id: AllowedId): CurriculumSchemaDefinition {
  const record = getResponseRecord(id);
  if (record.source === 'void') {
    throw new TypeError('No response schema for id: ' + String(id));
  }
  return record.schema;
}

function getWildcardRecord(statusCode: ValidResponseCode | ValidNumericResponseCode) {
  const wildcardKey = '*:' + String(statusCode);
  if (!isAllowedId(wildcardKey)) {
    return null;
  }
  return getResponseRecord(wildcardKey);
}

export function getResponseSchemaByOperationIdAndStatus(operationId: OperationId, statusCode: ValidResponseCode | ValidNumericResponseCode): CurriculumSchemaDefinition {
  const key = operationId + ':' + String(statusCode);
  if (isAllowedId(key)) {
    return requireSchema(key);
  }
  const wildcard = getWildcardRecord(statusCode);
  if (wildcard && wildcard.source !== 'void') {
    return wildcard.schema;
  }
  throw new TypeError('Invalid id: ' + String(key));
}

export function getResponseSchemaByPathAndMethodAndStatus(path: ValidPath, method: AllowedMethodsForPath<ValidPath>, statusCode: ValidResponseCode | ValidNumericResponseCode): CurriculumSchemaDefinition {
  const operationId = getOperationIdByPathAndMethod(path, method);
  if (operationId) {
    return getResponseSchemaByOperationIdAndStatus(operationId, statusCode);
  }
  const wildcard = getWildcardRecord(statusCode);
  if (wildcard && wildcard.source !== 'void') {
    return wildcard.schema;
  }
  throw new TypeError('Invalid operationId: ' + String(operationId));
}

export function getResponseSchemaForEndpoint(method: AllowedMethods, path: ValidPath): CurriculumSchemaDefinition {
  return getResponseSchemaByPathAndMethodAndStatus(path, method as AllowedMethodsForPath<ValidPath>, 200);
}
`;

  const descriptorHelpers = `const RESPONSE_DESCRIPTOR_JSON: Record<string, unknown | undefined> = Object.fromEntries(
  Object.entries(RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS).map(([key, record]) => [
    key,
    record.jsonSchema,
  ]),
);

export function getResponseDescriptorSchema(operationId: OperationId, statusCode: ValidResponseCode | ValidNumericResponseCode): unknown {
  const key = operationId + ':' + String(statusCode);
  if (!Object.prototype.hasOwnProperty.call(RESPONSE_DESCRIPTOR_JSON, key)) {
    return undefined;
  }
  return RESPONSE_DESCRIPTOR_JSON[key];
}

export function getDescriptorSchemaForEndpoint(method: AllowedMethods, path: ValidPath): { readonly zod: CurriculumSchemaDefinition; readonly json: unknown } {
  const zod = getResponseSchemaForEndpoint(method, path);
  const operationId = getOperationIdByPathAndMethod(path, method as AllowedMethodsForPath<ValidPath>);
  if (typeof operationId !== 'string') {
    return { zod, json: undefined };
  }
  const key = operationId + ':' + '200';
  const json = RESPONSE_DESCRIPTOR_JSON[key];
  return { zod, json };
}
`;

  return header + responseMapBlock + helperFunctions + descriptorHelpers;
}

function buildSchemaExpression(entry: ResponseMapEntry): string {
  if (entry.source === 'void') {
    return (
      '(() => { throw new TypeError("No response schema for id: ' +
      entry.operationId +
      ':' +
      entry.status +
      '"); })()'
    );
  }

  if (entry.source === 'inline') {
    return 'curriculumSchemas.' + (entry.zodIdentifier ?? '');
  }

  return 'curriculumSchemas.' + entry.componentName;
}
