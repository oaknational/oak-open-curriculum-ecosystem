/**
 * Operation extraction from OpenAPI schema
 * Extracts path operations at generation time for runtime constants
 */

import type { OpenAPI3, OperationObject, ParameterObject } from 'openapi-typescript';
import { getPropertyValue, isParameterObject, isOperationObject } from './operation-validators.js';

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
}

// isParameterObject type guard moved to operation-validators.ts

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

// isOperationObject type guard moved to operation-validators.ts

/**
 * Extract parameters from an operation
 */
function extractOperationParameters(operation: OperationObject): ExtractedParameter[] {
  if (!Array.isArray(operation.parameters)) return [];

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
  if (!pathItem || typeof pathItem !== 'object') return [];

  const operations: ExtractedOperation[] = [];

  for (const method of httpMethods) {
    const operation = getPropertyValue(pathItem, method);
    if (!isOperationObject(operation)) continue;

    operations.push({
      path,
      method,
      operationId: operation.operationId,
      summary: operation.summary,
      description: operation.description,
      parameters: extractOperationParameters(operation),
    });
  }

  return operations;
}

/**
 * Extract all path operations from an OpenAPI schema
 * This runs at generation time with the full OpenAPI3 type
 */
export function extractPathOperations(schema: OpenAPI3): ExtractedOperation[] {
  const operations: ExtractedOperation[] = [];
  const httpMethods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

  for (const path in schema.paths) {
    const pathItem = schema.paths[path];
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
