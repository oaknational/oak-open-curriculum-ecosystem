/**
 * Path parameter extraction functions
 * Handles extraction of parameters from OpenAPI schema
 */

import type {
  OpenAPIObject,
  ParameterObject,
  ReferenceObject,
  PathItemObject,
} from 'openapi3-ts/oas31';
import {
  initializePathParameters,
  processOperationParameters,
} from './typegen-extraction-helpers.js';
import {
  type ExtractedParameters,
  type ExtractedPathData,
  type ExtractionContext,
  type ParameterValueSets,
  type PathEntry,
  type ValidCombinations,
} from './typegen/extraction-types.js';

function isObject(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isReferenceObject(value: unknown): value is ReferenceObject {
  return isObject(value) && typeof value.$ref === 'string' && value.$ref.length > 0;
}

export function dereferenceParameter(
  param: ParameterObject | ReferenceObject,
  root: OpenAPIObject,
): ParameterObject {
  if (!isReferenceObject(param)) {
    return param;
  }

  const ref = param.$ref;
  const refPath = ref.replace('#/', '').split('/');
  let current: unknown = root;

  for (const segment of refPath) {
    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!Number.isInteger(index) || index < 0 || index >= current.length) {
        throw new Error(`Cannot dereference ${ref}: invalid array index at ${segment}`);
      }
      current = current[index];
      continue;
    }
    if (!isObject(current)) {
      throw new Error(`Cannot dereference ${ref}: invalid path at ${segment}`);
    }
    if (!(segment in current)) {
      throw new Error(`Cannot dereference ${ref}: missing segment ${segment}`);
    }
    current = current[segment];
  }

  if (!isParameterObject(current)) {
    throw new Error(`Dereferenced value at ${ref} is not a ParameterObject`);
  }

  return current;
}

export function isParameterObject(value: unknown): value is ParameterObject {
  return (
    isObject(value) &&
    typeof value.name === 'string' &&
    (value.in === 'path' || value.in === 'query' || value.in === 'header' || value.in === 'cookie')
  );
}

export function isPathItemObject(value: unknown): value is PathItemObject {
  if (!isObject(value)) {
    return false;
  }
  if ('parameters' in value && value.parameters !== undefined && !Array.isArray(value.parameters)) {
    return false;
  }
  return true;
}

export function extractParameterNamesFromPath(pathPattern: string): string[] {
  const matches = pathPattern.match(/{(\w+)}/g);
  if (!matches) {
    return [];
  }
  return matches.map((match) => match.slice(1, -1));
}

export function processParameterDefinitions(
  parameterNames: readonly string[],
  parameters: readonly (ParameterObject | ReferenceObject)[],
  pathParameters: ParameterValueSets,
  root: OpenAPIObject,
): void {
  for (const param of parameters) {
    const derefParam = dereferenceParameter(param, root);
    const paramName = derefParam.name;

    if (!parameterNames.includes(paramName)) {
      continue;
    }

    const enumValues = extractEnumFromParameter(derefParam);
    if (!enumValues) {
      continue;
    }

    for (const value of enumValues) {
      pathParameters[paramName].add(value);
    }
  }
}

export function extractEnumFromParameter(param: ParameterObject): string[] | undefined {
  const schema = param.schema;
  if (!schema) {
    return undefined;
  }

  // Enums exist on SchemaObject, not ReferenceObject
  if (isReferenceObject(schema)) {
    return undefined;
  }

  const enumArray: unknown = schema.enum;
  if (Array.isArray(enumArray)) {
    return enumArray.filter((v): v is string => typeof v === 'string');
  }
  return undefined;
}

export function isParameterOrReference(value: unknown): value is ParameterObject | ReferenceObject {
  return isParameterObject(value) || isReferenceObject(value);
}

export function recordValidCombination(
  parameterNames: readonly string[],
  pathPattern: string,
  validCombinations: ValidCombinations,
): void {
  if (parameterNames.length === 0) {
    const paramsKey = 'NO_PARAMS';
    const group = validCombinations[paramsKey] ?? {};
    const entry: PathEntry = {
      path: pathPattern,
      paramsKey,
    };
    group[pathPattern] = entry;
    validCombinations[paramsKey] = group;
    return;
  }

  const sortedNames = [...parameterNames].sort();
  const paramsKey = sortedNames.join('_');
  const group = validCombinations[paramsKey] ?? {};
  const entry: PathEntry = {
    params: sortedNames.join(', '),
    path: pathPattern,
    paramsKey,
  };
  group[pathPattern] = entry;
  validCombinations[paramsKey] = group;
}

/**
 * Extract and process a single parameter
 */
export function processParameter(
  param: ParameterObject | ReferenceObject,
  context: ExtractionContext,
): void {
  const derefParam = dereferenceParameter(param, context.root);
  const paramName = derefParam.name;

  // Initialize set for this parameter if not already present
  context.pathParameters[paramName] ??= new Set<string>();

  // Extract enum values if present
  const enumValues = extractEnumFromParameter(derefParam);
  if (enumValues) {
    for (const value of enumValues) {
      context.pathParameters[paramName].add(value);
    }
  }
}

export function processParameterList(
  parameters: readonly (ParameterObject | ReferenceObject)[],
  context: ExtractionContext,
): void {
  for (const param of parameters) {
    processParameter(param, context);
  }
}

export function processPath(
  pathPattern: string,
  pathItem: PathItemObject,
  context: ExtractionContext,
): void {
  const pathParameterNames = extractParameterNamesFromPath(pathPattern);

  // Initialize sets for path parameters
  initializePathParameters(pathParameterNames, context);

  // Process path-level parameters (these apply to all operations in this path)
  const pathLevelParameters = pathItem.parameters ?? [];
  processParameterList(pathLevelParameters, context);

  // Process all operation parameters
  processOperationParameters(pathItem, context, processParameterList);

  recordValidCombination(pathParameterNames, pathPattern, context.validCombinations);
}

export function extractPathParameters(schema: OpenAPIObject): ExtractedPathData {
  const { paths } = schema;
  const pathParameters: ParameterValueSets = {};
  const validCombinations: ValidCombinations = {};

  const sortedPathNames = Object.keys(paths ?? {}).sort((a, b) => a.localeCompare(b));
  for (const pathName of sortedPathNames) {
    const pathItem = paths?.[pathName];
    if (!isPathItemObject(pathItem)) {
      throw new TypeError(
        `Invalid path item for path ${pathName}:\n${JSON.stringify(pathItem, undefined, 2)}`,
      );
    }
    processPath(pathName, pathItem, {
      pathParameters,
      validCombinations,
      root: schema,
    });
  }

  const result: ExtractedParameters = {};
  for (const parameterName in pathParameters) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- allow runtime validation
    result[parameterName] = pathParameters[parameterName] ? [...pathParameters[parameterName]] : [];
  }

  return { parameters: result, validCombinations } as const;
}
