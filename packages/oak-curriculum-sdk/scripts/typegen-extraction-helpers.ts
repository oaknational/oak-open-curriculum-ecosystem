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

/**
 * Narrow unknown to a non-null object record
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Check if value is a ReferenceObject
 */
function isReferenceObject(obj: unknown): obj is ReferenceObject {
  if (!isRecord(obj)) return false;
  const desc = Object.getOwnPropertyDescriptor(obj, '$ref');
  return !!desc && typeof desc.value === 'string';
}

/**
 * Check if value is a ParameterObject or ReferenceObject
 */
function isParameterOrReference(p: unknown): p is ParameterObject | ReferenceObject {
  if (!isRecord(p)) return false;

  // Check if it's a reference
  if (isReferenceObject(p)) return true;

  // Check if it's a parameter (must have 'name' and 'in' properties)
  const nameDesc = Object.getOwnPropertyDescriptor(p, 'name');
  const inDesc = Object.getOwnPropertyDescriptor(p, 'in');
  const nameVal: unknown = nameDesc?.value;
  const inVal: unknown = inDesc?.value;

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
  return (
    operation !== null &&
    operation !== undefined &&
    typeof operation === 'object' &&
    !isReferenceObject(operation)
  );
}
