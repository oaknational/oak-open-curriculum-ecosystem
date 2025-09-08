/**
 * Path parameter extraction functions
 * Handles extraction of parameters from OpenAPI schema
 */

import type {
  OpenAPI3,
  ParameterObject,
  PathItemObject,
  ReferenceObject,
} from 'openapi-typescript';
import { typeSafeKeys } from '../src/types/helpers.js';
import type {
  PathEntry,
  ValidCombinations,
  ExtractedParameters,
  ExtractedPathData,
  ParameterValueSets,
  ExtractionContext,
} from './typegen/extraction-types.js';
import {
  initializePathParameters,
  processOperationParameters,
} from './typegen-extraction-helpers.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isReferenceObject(value: unknown): value is ReferenceObject {
  if (!isRecord(value)) {
    return false;
  }

  if (!('$ref' in value)) {
    return false;
  }

  return typeof value.$ref === 'string';
}

export function dereferenceParameter(
  param: ParameterObject | ReferenceObject,
  root: OpenAPI3,
): ParameterObject {
  if (!isReferenceObject(param)) {
    return param;
  }

  const ref = param.$ref;
  const refPath = ref.replace('#/', '').split('/');
  let current: unknown = root;

  for (const segment of refPath) {
    if (typeof current !== 'object' || current === null || Array.isArray(current)) {
      throw new Error(`Cannot dereference ${ref}: invalid path at ${segment}`);
    }
    if (!isRecord(current)) {
      throw new Error(`Cannot dereference ${ref}: invalid path at ${segment}`);
    }
    current = current[segment];
  }

  if (!isParameterObject(current)) {
    throw new Error(`Dereferenced value at ${ref} is not a ParameterObject`);
  }

  return current;
}

export function isParameterObject(value: unknown): value is ParameterObject {
  return typeof value === 'object' && value !== null && 'name' in value && 'in' in value;
}

export function isPathItemObject(value: unknown): value is PathItemObject {
  return typeof value === 'object' && value !== null;
}

export function extractParameterNamesFromPath(pathPattern: string): string[] {
  const matches = pathPattern.match(/{(\w+)}/g);
  if (!matches) return [];
  return matches.map((match) => match.slice(1, -1));
}

export function processParameterDefinitions(
  parameterNames: string[],
  parameters: (ParameterObject | ReferenceObject)[],
  pathParameters: ParameterValueSets,
  root: OpenAPI3,
): void {
  for (const param of parameters) {
    const derefParam = dereferenceParameter(param, root);
    const paramName = derefParam.name;

    if (!parameterNames.includes(paramName)) continue;

    const enumValues = extractEnumFromParameter(derefParam);
    if (!enumValues) continue;

    for (const value of enumValues) {
      pathParameters[paramName].add(value);
    }
  }
}

export function extractEnumFromParameter(param: ParameterObject): string[] | undefined {
  const schema = param.schema;
  if (!schema) return undefined;

  const enumArray: unknown = Object.getOwnPropertyDescriptor(schema, 'enum')?.value;
  if (Array.isArray(enumArray)) {
    return enumArray.filter((v): v is string => typeof v === 'string');
  }
  return undefined;
}

export function isParameterOrReference(value: unknown): value is ParameterObject | ReferenceObject {
  return isParameterObject(value) || isReferenceObject(value);
}

export function recordValidCombination(
  parameterNames: string[],
  pathPattern: string,
  validCombinations: ValidCombinations,
): void {
  if (parameterNames.length === 0) {
    validCombinations.NO_PARAMS ??= {};
    const entry: PathEntry = {
      path: pathPattern,
      paramsKey: 'NO_PARAMS',
    };
    validCombinations.NO_PARAMS[pathPattern] = entry;
  } else {
    const paramsKey = parameterNames.sort().join('_');
    validCombinations[paramsKey] ??= {};
    const entry: PathEntry = {
      params: parameterNames.join(', '),
      path: pathPattern,
      paramsKey,
    };
    validCombinations[paramsKey][pathPattern] = entry;
  }
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

/**
 * Process all parameters from a list
 */
export function processParameterList(
  parameters: (ParameterObject | ReferenceObject)[],
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

export function extractPathParameters(schema: OpenAPI3): ExtractedPathData {
  const paths = schema.paths;
  const pathParameters: ParameterValueSets = {};
  const validCombinations: ValidCombinations = {};

  const sortedPathNames = typeSafeKeys(paths ?? {}).sort((a, b) => a.localeCompare(b));
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- disable to allow runtime validation
    result[parameterName] = pathParameters[parameterName] ? [...pathParameters[parameterName]] : [];
  }

  return { parameters: result, validCombinations } as const;
}
