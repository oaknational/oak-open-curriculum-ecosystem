/**
 * Minimal typed fakes for type-gen unit tests (OpenAPI 3.1 types).
 * Used to avoid inline type assertions in tests; each factory documents the single cast.
 */

import type { OperationObject, ParameterObject, PathItemObject } from 'openapi3-ts/oas31';

/**
 * Creates a minimal OperationObject for tests. OpenAPI 3.1 requires `responses`;
 * other fields are optional. Cast used so tests can pass partial shapes.
 */
export function createFakeOperationObject(
  partial: Partial<OperationObject> & { responses?: OperationObject['responses'] },
): OperationObject {
  const out = { responses: partial.responses ?? {}, ...partial };
  return out as OperationObject;
}

/**
 * Creates a minimal ParameterObject for tests (name, in, optional schema).
 * Cast used so tests can pass minimal shapes without implementing full OpenAPI parameter.
 */
export function createFakeParameterObject(
  partial: Partial<ParameterObject> & { name: string; in: ParameterObject['in'] },
): ParameterObject {
  return partial as ParameterObject;
}

/**
 * Creates a minimal PathItemObject for tests (get/post/etc. with operation shapes).
 * Cast used so tests can pass plain objects that processOperationParameters accepts at runtime.
 */
export function createFakePathItemObject(partial: Partial<PathItemObject>): PathItemObject {
  return partial as PathItemObject;
}
