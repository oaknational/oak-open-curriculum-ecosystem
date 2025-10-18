/**
 * Operation extraction from OpenAPI schema
 * Extracts path operations at generation time for runtime constants
 */

import type {
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  PathItemObject,
  ReferenceObject,
  ResponsesObject,
  SchemaObject,
} from 'openapi3-ts/oas31';
import {
  createParameterResolver,
  isReferenceObject,
  type ResolveParameterFn,
  type ResolveSchemaFn,
} from './schema-resolvers.js';

export interface ExtractedParameter {
  readonly in: 'path' | 'query' | 'header' | 'cookie';
  readonly name: string;
  readonly description?: string;
  readonly required?: boolean;
  readonly schema?: SchemaObject;
}

export interface ExtractedOperation {
  readonly path: string;
  readonly method: string;
  readonly operationId?: string;
  readonly summary?: string;
  readonly description?: string;
  readonly parameters: readonly ExtractedParameter[];
  readonly responses?: ResponsesObject;
}

function isOperationObject(op: unknown): op is OperationObject {
  if (typeof op !== 'object' || op === null || Array.isArray(op) || isReferenceObject(op)) {
    return false;
  }
  return 'responses' in op && typeof op.responses === 'object' && op.responses !== null;
}

function extractParameter(
  param: ParameterObject,
  resolveSchema: ResolveSchemaFn,
): ExtractedParameter {
  const schema = resolveSchema(param.schema);
  return {
    in: param.in,
    name: param.name,
    description: param.description,
    required: param.required,
    schema,
  };
}

/**
 * Extract parameters from an operation
 */
const HTTP_METHODS = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
] as const satisfies readonly (keyof PathItemObject)[];

function collectParametersFromList(
  parameters: readonly (ParameterObject | ReferenceObject)[] | undefined,
  resolveParameter: ResolveParameterFn,
  resolveSchema: ResolveSchemaFn,
): ExtractedParameter[] {
  if (!parameters) {
    return [];
  }
  const extracted: ExtractedParameter[] = [];
  for (const parameter of parameters) {
    const resolved = resolveParameter(parameter);
    if (!resolved) {
      continue;
    }
    extracted.push(extractParameter(resolved, resolveSchema));
  }
  return extracted;
}

function extractOperationParameters(
  operation: OperationObject,
  resolveParameter: ResolveParameterFn,
  resolveSchema: ResolveSchemaFn,
): ExtractedParameter[] {
  if (!Array.isArray(operation.parameters)) {
    return [];
  }

  return collectParametersFromList(operation.parameters, resolveParameter, resolveSchema);
}

function extractOperationsForPath(
  path: string,
  pathItem: PathItemObject | undefined,
  resolveParameter: ResolveParameterFn,
  resolveSchema: ResolveSchemaFn,
): ExtractedOperation[] {
  if (!pathItem || isReferenceObject(pathItem)) {
    return [];
  }

  const sharedParameters = collectParametersFromList(
    pathItem.parameters,
    resolveParameter,
    resolveSchema,
  );

  const operations: ExtractedOperation[] = [];

  for (const method of HTTP_METHODS) {
    const operation = pathItem[method];
    if (!operation || isReferenceObject(operation)) {
      continue;
    }
    if (!isOperationObject(operation)) {
      continue;
    }

    const operationParameters = extractOperationParameters(
      operation,
      resolveParameter,
      resolveSchema,
    );
    const parameters =
      sharedParameters.length === 0
        ? operationParameters
        : [...sharedParameters, ...operationParameters];
    operations.push({
      path,
      method,
      operationId: operation.operationId,
      summary: operation.summary,
      description: operation.description,
      parameters,
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
  const { resolveParameter, resolveSchema } = createParameterResolver(schema.components);

  const paths = schema.paths ?? {};
  for (const path in paths) {
    const pathItem = paths[path];
    const pathOperations = extractOperationsForPath(
      path,
      pathItem,
      resolveParameter,
      resolveSchema,
    );
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
