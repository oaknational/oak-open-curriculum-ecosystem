/**
 * Operation extraction from OpenAPI schema
 * Extracts path operations at generation time for runtime constants
 */

import type {
  ComponentsObject,
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  PathItemObject,
  ReferenceObject,
  ResponsesObject,
  SchemaObject,
} from 'openapi3-ts/oas31';

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

function isReferenceObject(value: unknown): value is ReferenceObject {
  return Boolean(value && typeof value === 'object' && '$ref' in value);
}

function isParameterObject(param: unknown): param is ParameterObject {
  if (!param || typeof param !== 'object' || !('name' in param) || !('in' in param)) {
    return false;
  }
  return typeof param.name === 'string' && typeof param.in === 'string';
}

function extractRefName(ref: string): string | undefined {
  const parts = ref.split('/');
  const name = parts[parts.length - 1];
  return name && name.length > 0 ? name : undefined;
}

function isSchemaObject(value: unknown): value is SchemaObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  return !isReferenceObject(value);
}

function cloneSchema(schema: SchemaObject): SchemaObject {
  const cloned = structuredClone(schema);
  if (!isSchemaObject(cloned)) {
    throw new TypeError('Failed to clone schema object.');
  }
  return cloned;
}

type ResolveSchemaFn = (
  schema: SchemaObject | ReferenceObject | undefined,
) => SchemaObject | undefined;

type ResolveParameterFn = (
  parameter: ParameterObject | ReferenceObject,
) => ParameterObject | undefined;

function createSchemaResolver(components: ComponentsObject | undefined): ResolveSchemaFn {
  const schemas = components?.schemas ?? {};
  const cache = new Map<string, SchemaObject | null>();
  const resolving = new Set<string>();

  function resolveByName(name: string): SchemaObject | undefined {
    if (cache.has(name)) {
      const cached = cache.get(name);
      return cached ?? undefined;
    }
    if (resolving.has(name)) {
      return undefined;
    }
    resolving.add(name);
    const target = schemas[name];
    let resolved: SchemaObject | undefined;
    if (isSchemaObject(target)) {
      resolved = cloneSchema(target);
    } else if (isReferenceObject(target)) {
      const refName = extractRefName(target.$ref);
      if (refName && refName !== name) {
        const nested = resolveByName(refName);
        if (nested) {
          resolved = cloneSchema(nested);
        }
      }
    }
    resolving.delete(name);
    cache.set(name, resolved ?? null);
    return resolved;
  }

  return (schema) => {
    if (!schema) {
      return undefined;
    }
    if (isReferenceObject(schema)) {
      const name = extractRefName(schema.$ref);
      if (!name) {
        return undefined;
      }
      const resolved = resolveByName(name);
      return resolved ? cloneSchema(resolved) : undefined;
    }
    return cloneSchema(schema);
  };
}

function createParameterResolver(components: ComponentsObject | undefined): {
  resolveParameter: ResolveParameterFn;
  resolveSchema: ResolveSchemaFn;
} {
  const parameters = components?.parameters ?? {};
  const schemaResolver = createSchemaResolver(components);
  const cache = new Map<string, ParameterObject | null>();
  const resolving = new Set<string>();

  function resolveByName(name: string): ParameterObject | undefined {
    if (cache.has(name)) {
      const cached = cache.get(name);
      return cached ?? undefined;
    }
    if (resolving.has(name)) {
      return undefined;
    }
    resolving.add(name);
    const target = parameters[name];
    let resolved: ParameterObject | undefined;
    if (isParameterObject(target)) {
      resolved = structuredClone(target);
    } else if (isReferenceObject(target)) {
      const nestedName = extractRefName(target.$ref);
      if (nestedName && nestedName !== name) {
        const nested = resolveByName(nestedName);
        if (nested) {
          resolved = structuredClone(nested);
        }
      }
    }
    resolving.delete(name);
    cache.set(name, resolved ?? null);
    return resolved;
  }

  const resolveParameter: ResolveParameterFn = (parameter) => {
    if (isReferenceObject(parameter)) {
      const name = extractRefName(parameter.$ref);
      if (!name) {
        return undefined;
      }
      return resolveByName(name);
    }
    return structuredClone(parameter);
  };

  return { resolveParameter, resolveSchema: schemaResolver };
}

/**
 * Extract parameter metadata from a ParameterObject
 */
function extractParameter(
  param: ParameterObject,
  resolveSchema: ResolveSchemaFn,
): ExtractedParameter {
  const schema = resolveSchema(param.schema);
  // The ParameterObject type already has the correct 'in' type
  // We trust the OpenAPI TypeScript types here
  return {
    in: param.in,
    name: param.name,
    description: param.description,
    required: param.required,
    schema,
  };
}

function isOperationObject(op: unknown): op is OperationObject {
  if (!op || typeof op !== 'object' || Array.isArray(op) || isReferenceObject(op)) {
    return false;
  }
  return (
    'responses' in op &&
    typeof (op as OperationObject).responses === 'object' &&
    (op as OperationObject).responses !== null
  );
}

/**
 * Extract parameters from an operation
 */
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
    if (!parameter) {
      continue;
    }
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

/**
 * Extract operations for a single path
 *
 * @deprecated replace with a helper function that uses the real types.
 */

type HttpMethod = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace';

function extractOperationsForPath(
  path: string,
  pathItem: PathItemObject | undefined,
  httpMethods: readonly HttpMethod[],
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

  for (const method of httpMethods) {
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
  const httpMethods: readonly HttpMethod[] = [
    'get',
    'put',
    'post',
    'delete',
    'options',
    'head',
    'patch',
    'trace',
  ];
  const { resolveParameter, resolveSchema } = createParameterResolver(schema.components);

  const paths = schema.paths ?? {};
  for (const path in paths) {
    const pathItem = paths[path];
    const pathOperations = extractOperationsForPath(
      path,
      pathItem,
      httpMethods,
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
