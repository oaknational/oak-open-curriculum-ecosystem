/**
 * Runtime OpenAPI validation helpers
 * Performs minimal structural checks so downstream tooling can rely on the schema.
 */

import type {
  OpenAPIObject,
  InfoObject,
  PathsObject,
  OperationObject,
  ParameterObject,
  ReferenceObject,
} from 'openapi3-ts/oas31';

export interface OpenCurriculumSchema {
  readonly original: OpenAPIObject;
  readonly sdk: OpenAPIObject;
}

/**
 * Validate raw input and ensure it matches the minimal OpenAPI 3 structure required by generators.
 * @param raw Input value to validate.
 * @returns The validated OpenAPIObject structure with guaranteed paths object.
 * @throws TypeError when validation fails.
 */
export function validateOpenApiDocument(raw: unknown): OpenAPIObject {
  if (!isOpenApi3Document(raw)) {
    throw new TypeError('Invalid OpenAPI 3 document');
  }
  return raw;
}

function isOpenApi3Document(value: unknown): value is OpenAPIObject {
  if (!isObject(value)) {
    return false;
  }
  if (!isNonEmptyString(value.openapi) || !value.openapi.startsWith('3.')) {
    return false;
  }
  if (!isInfoObject(value.info)) {
    return false;
  }
  if (!isPathsObject(value.paths)) {
    return false;
  }
  return true;
}

function isInfoObject(value: unknown): value is InfoObject {
  if (!isObject(value)) {
    return false;
  }
  return isNonEmptyString(value.title) && isNonEmptyString(value.version);
}

function isPathsObject(value: unknown): value is PathsObject {
  if (!isObject(value)) {
    return false;
  }
  for (const [pathKey, item] of Object.entries(value)) {
    if (!isValidPathKey(pathKey) || !isPathItemObject(item)) {
      return false;
    }
  }
  return true;
}

export function assertSchemaHasComponentsSchemas(schema: OpenAPIObject): void {
  if (!schema.components || !isObject(schema.components.schemas)) {
    throw new TypeError(
      'Schema components.schemas must be an object when decorating canonical URLs.',
    );
  }
}

function isValidPathKey(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.startsWith('/');
}

function isPathItemObject(value: unknown): value is PathsObject[string] {
  if (!isObject(value)) {
    return false;
  }
  if ('parameters' in value && value.parameters !== undefined) {
    if (!isParametersArray(value.parameters)) {
      return false;
    }
  }
  const methodEntries = Object.entries(value);
  const methodNames: readonly string[] = [
    'delete',
    'get',
    'head',
    'options',
    'patch',
    'post',
    'put',
    'trace',
  ];
  for (const [methodName, candidate] of methodEntries) {
    if (!methodNames.includes(methodName)) {
      continue;
    }
    if (candidate === undefined) {
      continue;
    }
    if (!isOperationObject(candidate)) {
      return false;
    }
  }
  return true;
}

function isOperationObject(value: unknown): value is OperationObject {
  if (!isObject(value)) {
    return false;
  }
  if ('operationId' in value && value.operationId !== undefined) {
    if (!isNonEmptyString(value.operationId)) {
      return false;
    }
  }
  if ('parameters' in value && value.parameters !== undefined) {
    if (!isParametersArray(value.parameters)) {
      return false;
    }
  }
  if (!('responses' in value) || !isObject(value.responses)) {
    return false;
  }
  return true;
}

function isParametersArray(value: unknown): value is (ParameterObject | ReferenceObject)[] {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every((entry) => isParameterObject(entry) || isReferenceObject(entry));
}

function isParameterObject(value: unknown): value is ParameterObject {
  if (!isObject(value)) {
    return false;
  }
  if (!isNonEmptyString(value.name)) {
    return false;
  }
  if (!isParameterLocation(value.in)) {
    return false;
  }
  if ('required' in value && value.required !== undefined && typeof value.required !== 'boolean') {
    return false;
  }
  return true;
}

function isReferenceObject(value: unknown): value is ReferenceObject {
  return isObject(value) && isNonEmptyString(value.$ref);
}

function isParameterLocation(value: unknown): value is ParameterObject['in'] {
  return value === 'path' || value === 'query' || value === 'header' || value === 'cookie';
}

function isObject(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}
