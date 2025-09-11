/**
 * Helper functions for typegen-extraction to reduce complexity
 * These are pure functions extracted from processPath
 */

import type {
  PathItemObject,
  ParameterObject,
  ReferenceObject,
  OperationObject,
} from 'openapi-typescript';
import type { ExtractionContext } from './typegen/extraction-types';
import { isPlainObject, getOwnString } from '../src/types/helpers';

/**
 * Narrow unknown to a non-null object record
 */
function isObject(value: unknown): value is object {
  return isPlainObject(value);
}

/**
 * Check if value is a ReferenceObject
 */
function isReferenceObject(obj: unknown): obj is ReferenceObject {
  return isObject(obj) && typeof getOwnString(obj, '$ref') === 'string';
}

/**
 * Check if value is a ParameterObject or ReferenceObject
 */
function isParameterOrReference(p: unknown): p is ParameterObject | ReferenceObject {
  if (!isObject(p)) return false;
  if (isReferenceObject(p)) return true;
  const nameVal = getOwnString(p, 'name');
  const inVal = getOwnString(p, 'in');
  return (
    typeof nameVal === 'string' &&
    typeof inVal === 'string' &&
    ['path', 'query', 'header', 'cookie'].includes(inVal)
  );
}

/**
 * Initialize path parameter sets in the context
 */
export function initializePathParameters(
  parameterNames: string[],
  context: ExtractionContext,
): void {
  for (const parameterName of parameterNames) {
    context.pathParameters[parameterName] ??= new Set<string>();
  }
}

/**
 * Extract valid parameters from a parameter list
 */
export function extractValidParameters(
  parameters: unknown[] | undefined,
): (ParameterObject | ReferenceObject)[] {
  if (!parameters) return [];

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
    params: (ParameterObject | ReferenceObject)[],
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
  return isObject(operation) && !isReferenceObject(operation);
}
