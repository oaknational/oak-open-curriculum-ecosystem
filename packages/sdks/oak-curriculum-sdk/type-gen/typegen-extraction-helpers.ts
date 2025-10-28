/**
 * Helper functions for typegen-extraction to reduce complexity
 * These are pure functions extracted from processPath
 */

import type {
  PathItemObject,
  ParameterObject,
  ReferenceObject,
  OperationObject,
} from 'openapi3-ts/oas31';
import type { ExtractionContext } from './typegen/extraction-types.js';

/**
 * Narrow unknown to a non-null object record
 */
function isObject(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if value is a ReferenceObject
 */
function isReferenceObject(obj: unknown): obj is ReferenceObject {
  return isObject(obj) && typeof obj.$ref === 'string' && obj.$ref.length > 0;
}

/**
 * Check if value is a ParameterObject or ReferenceObject
 */
function isParameterOrReference(p: unknown): p is ParameterObject | ReferenceObject {
  if (!isObject(p)) {
    return false;
  }
  if (isReferenceObject(p)) {
    return true;
  }
  if (typeof p.name !== 'string' || p.name.length === 0) {
    return false;
  }
  if (p.in !== 'path' && p.in !== 'query' && p.in !== 'header' && p.in !== 'cookie') {
    return false;
  }
  if ('required' in p && p.required !== undefined && typeof p.required !== 'boolean') {
    return false;
  }
  return true;
}

/**
 * Initialize path parameter sets in the context
 */
export function initializePathParameters(
  parameterNames: readonly string[],
  context: ExtractionContext,
): void {
  for (const parameterName of parameterNames) {
    if (!(parameterName in context.pathParameters)) {
      context.pathParameters[parameterName] = new Set<string>();
    }
  }
}

/**
 * Extract valid parameters from a parameter list
 */
export function extractValidParameters(
  parameters: readonly unknown[] | undefined,
): (ParameterObject | ReferenceObject)[] {
  if (!parameters) {
    return [];
  }

  return parameters.filter((p): p is ParameterObject | ReferenceObject =>
    isParameterOrReference(p),
  );
}

/**
 * Process parameters from all operations in a path item
 */
export function processOperationParameters(
  pathItem: PathItemObject,
  context: ExtractionContext,
  processParameterList: (
    params: readonly (ParameterObject | ReferenceObject)[],
    ctx: ExtractionContext,
  ) => void,
): void {
  const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'] as const;

  for (const method of methods) {
    const operation = pathItem[method];
    if (isValidOperation(operation)) {
      const operationParams = operation.parameters ?? [];
      const validParams = extractValidParameters(operationParams);
      processParameterList(validParams, context);
    }
  }
}

/**
 * Check if a value is a valid operation object
 */
function isValidOperation(operation: unknown): operation is OperationObject {
  if (!isObject(operation)) {
    return false;
  }
  if (isReferenceObject(operation)) {
    return false;
  }
  if ('operationId' in operation && operation.operationId !== undefined) {
    if (typeof operation.operationId !== 'string' || operation.operationId.length === 0) {
      return false;
    }
  }
  if ('parameters' in operation && operation.parameters !== undefined) {
    if (!Array.isArray(operation.parameters)) {
      return false;
    }
    if (!operation.parameters.every((param) => isParameterOrReference(param))) {
      return false;
    }
  }
  if (!('responses' in operation) || !isObject(operation.responses)) {
    return false;
  }
  return true;
}
