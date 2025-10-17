/**
 * Operation extraction from OpenAPI schema
 * Extracts path operations at generation time for runtime constants
 */

import type {
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  ResponsesObject,
} from 'openapi3-ts/oas31';

export interface ExtractedParameter {
  in: 'path' | 'query' | 'header' | 'cookie';
  name: string;
  description?: string;
  required?: boolean;
  schema?: unknown;
}

export interface ExtractedOperation {
  path: string;
  method: string;
  operationId?: string;
  summary?: string;
  description?: string;
  parameters: ExtractedParameter[];
  responses?: ResponsesObject;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getPropertyValue(obj: unknown, key: string): unknown {
  if (!isRecord(obj)) {
    return undefined;
  }
  const descriptor = Object.getOwnPropertyDescriptor(obj, key);
  return descriptor?.value;
}

function isParameterObject(param: unknown): param is ParameterObject {
  if (!isRecord(param)) {
    return false;
  }
  const name = getPropertyValue(param, 'name');
  const location = getPropertyValue(param, 'in');
  if (typeof name !== 'string' || typeof location !== 'string') {
    return false;
  }
  return (
    location === 'path' || location === 'query' || location === 'header' || location === 'cookie'
  );
}

/**
 * Extract parameter metadata from a ParameterObject
 */
function extractParameter(param: ParameterObject): ExtractedParameter {
  // The ParameterObject type already has the correct 'in' type
  // We trust the OpenAPI TypeScript types here
  return {
    in: param.in,
    name: param.name,
    description: param.description,
    required: param.required,
    schema: param.schema,
  };
}

function isOperationObject(op: unknown): op is OperationObject {
  if (!isRecord(op)) {
    return false;
  }
  return isRecord(getPropertyValue(op, 'responses'));
}

/**
 * Extract parameters from an operation
 */
function extractOperationParameters(operation: OperationObject): ExtractedParameter[] {
  if (!Array.isArray(operation.parameters)) {
    return [];
  }

  const parameters: ExtractedParameter[] = [];
  for (const param of operation.parameters) {
    if (isParameterObject(param)) {
      parameters.push(extractParameter(param));
    }
  }
  return parameters;
}

/**
 * Extract operations for a single path
 */
function extractOperationsForPath(
  path: string,
  pathItem: unknown,
  httpMethods: readonly string[],
): ExtractedOperation[] {
  if (!pathItem || typeof pathItem !== 'object') {
    return [];
  }

  const operations: ExtractedOperation[] = [];

  for (const method of httpMethods) {
    const operation = getPropertyValue(pathItem, method);
    if (!isOperationObject(operation)) {
      continue;
    }

    operations.push({
      path,
      method,
      operationId: operation.operationId,
      summary: operation.summary,
      description: operation.description,
      parameters: extractOperationParameters(operation),
      responses: operation.responses,
    });
  }

  return operations;
}

/**
 * Extract all path operations from an OpenAPI schema
 * This runs at generation time with the full OpenAPI schema
 */
export function extractPathOperations(schema: OpenAPIObject): ExtractedOperation[] {
  const operations: ExtractedOperation[] = [];
  const httpMethods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

  const paths = schema.paths ?? {};
  for (const path in paths) {
    const pathItem = paths[path];
    const pathOperations = extractOperationsForPath(path, pathItem, httpMethods);
    operations.push(...pathOperations);
  }

  return operations;
}

/**
 * Extract unique HTTP methods from operations
 */
export function extractUniqueMethods(operations: ExtractedOperation[]): string[] {
  const methods = new Set<string>();
  for (const op of operations) {
    methods.add(op.method);
  }
  return Array.from(methods).sort();
}
