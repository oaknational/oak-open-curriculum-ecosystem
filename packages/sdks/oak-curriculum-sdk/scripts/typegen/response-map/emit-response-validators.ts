import type { ResponseMapEntry } from './build-response-map.js';

function sanitizeIdentifier(name: string): string {
  // Replace invalid characters for member access; keep underscores and alphanumerics
  return name.replace(/[^A-Za-z0-9_]/g, '_');
}

export function emitResponseValidators(entries: readonly ResponseMapEntry[]): string {
  const header = `
/**
* GENERATED FILE - DO NOT EDIT
*
* Response validator map built from OpenAPI schema at compile-time.
*/
import type { z } from 'zod';
import { schemas } from '../zod/zodSchemas.js';
import { type AllowedMethodsForPath, type OperationId, type ValidNumericResponseCode, type ValidPath, type ValidResponseCode, getOperationIdByPathAndMethod } from './path-parameters.js';`;

  const IDs: string[] = [];

  const schemaLines = `
const RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS = {
${entries
  .map((entry) => {
    const id = entry.operationId + ':' + entry.status;
    IDs.push(id);
    const member = sanitizeIdentifier(entry.componentName);
    return `"${id}": {schema: schemas.${member}, operationId: '${entry.operationId}', status: '${entry.status}'},`;
  })
  .join('\n')}
} as const;

const ALLOWED_IDS = [
"${IDs.join('",\n"')}"
] as const;

export type AllowedId = typeof ALLOWED_IDS[number];
export function isAllowedId(value: string): value is AllowedId {
  return value in ALLOWED_IDS;
}
`;

  const footer = `
export type ResponseSchemaByOperationIdAndStatus = typeof RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS;

function getResponseSchemaById(id: AllowedId): ResponseSchemaByOperationIdAndStatus[AllowedId]['schema'] {
  const found = RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS[id];
  if (!found) {
    throw new TypeError('No response schema for id: ' + String(id));
  }
  return found.schema;
}

export function getResponseSchemaByOperationIdAndStatus(operationId: OperationId, statusCode: ValidResponseCode | ValidNumericResponseCode): z.ZodSchema {
  const key = operationId + ':' + String(statusCode);
  if (!isAllowedId(key)) {
    throw new TypeError('Invalid id: ' + String(key));
  }
  return getResponseSchemaById(key);
}

export function getResponseSchemaByPathAndMethodAndStatus(path: ValidPath, method: AllowedMethodsForPath<ValidPath>, statusCode: ValidResponseCode | ValidNumericResponseCode): z.ZodSchema {
  const operationId = getOperationIdByPathAndMethod(path, method);
  if (!operationId) {
    throw new TypeError('Invalid operationId: ' + String(operationId));
  }
  return getResponseSchemaByOperationIdAndStatus(operationId, statusCode);
}

`;
  return [header, schemaLines, footer].join('\n');
}
