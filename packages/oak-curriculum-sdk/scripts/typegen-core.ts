import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

import type {
  OpenAPI3,
  PathItemObject,
  OperationObject,
  ReferenceObject,
  ParameterObject,
} from 'openapi-typescript';
import openapiTS, { astToString } from 'openapi-typescript';

function isNotReferenceObject(object: unknown): boolean {
  return typeof object === 'object' && object !== null && !('$ref' in object);
}
function isPathItemObject(pathItem: unknown): pathItem is PathItemObject {
  return isNotReferenceObject(pathItem) && typeof pathItem === 'object' && pathItem !== null;
}
function isOperationObject(operation: unknown): operation is OperationObject {
  return isNotReferenceObject(operation) && typeof operation === 'object' && operation !== null;
}
function isParameterObject(parameter: unknown): parameter is ParameterObject {
  return (
    isNotReferenceObject(parameter) &&
    typeof parameter === 'object' &&
    parameter !== null &&
    'name' in parameter
  );
}
function isReferenceObject(value: unknown): value is ReferenceObject {
  return (
    typeof value === 'object' && value !== null && '$ref' in (value as Record<string, unknown>)
  );
}

// Extract parameter names from a path pattern
function extractParameterNamesFromPath(pathPattern: string): string[] {
  const parameterPattern = /{([^{}]+)}/g;
  const parameterNames = (pathPattern.match(parameterPattern) ?? []).map((parameter) => {
    return parameter.slice(1, -1);
  });
  return parameterNames;
}

// Process a single parameter definition
function processParameterDefinition(
  parameterDefinition: ParameterObject,
  parameterName: string,
  pathParameters: Record<string, Set<string>>,
): void {
  if (parameterDefinition.name !== parameterName) {
    return;
  }

  const parameterSchema = parameterDefinition.schema;
  if (!parameterSchema?.enum) {
    return;
  }

  for (const value of parameterSchema.enum) {
    if (typeof value === 'string' && pathParameters[parameterName]) {
      pathParameters[parameterName].add(value);
    }
  }
}

// Resolve a local $ref to a parameter in components
function dereferenceParameter(
  referenceObject: ReferenceObject,
  root: OpenAPI3,
): ParameterObject | undefined {
  const referenceString = (referenceObject as { $ref?: unknown }).$ref;
  if (typeof referenceString !== 'string') {
    return undefined;
  }
  const prefix = '#/components/parameters/';
  if (!referenceString.startsWith(prefix)) {
    return undefined;
  }
  const key = referenceString.slice(prefix.length);
  const parameters = (root as unknown as { components?: { parameters?: Record<string, unknown> } })
    .components?.parameters;
  const maybe = parameters?.[key];
  if (typeof maybe === 'object' && maybe !== null && 'name' in maybe) {
    return maybe as ParameterObject;
  }
  return undefined;
}

function extractEnumValues(
  operation: OperationObject | ReferenceObject,
  parameterName: string,
  pathParameters: Record<string, Set<string>>,
  root: OpenAPI3,
): void {
  if (!isOperationObject(operation)) {
    return;
  }

  const operationParameters = operation.parameters;
  if (!operationParameters) {
    return;
  }

  for (const parameter of operationParameters) {
    let resolved: ParameterObject | undefined;
    if (isParameterObject(parameter)) {
      resolved = parameter;
    } else if (isReferenceObject(parameter)) {
      resolved = dereferenceParameter(parameter, root);
    }
    if (resolved) {
      processParameterDefinition(resolved, parameterName, pathParameters);
    }
  }
}

function processParameterDefinitions(
  parameterNames: string[],
  parametersList: (ParameterObject | ReferenceObject)[],
  pathParameters: Record<string, Set<string>>,
  root: OpenAPI3,
): void {
  for (const parameterName of parameterNames) {
    for (const parameter of parametersList) {
      let resolved: ParameterObject | undefined;
      if (isParameterObject(parameter)) {
        resolved = parameter;
      } else if (isReferenceObject(parameter)) {
        resolved = dereferenceParameter(parameter, root);
      }
      if (resolved) {
        processParameterDefinition(resolved, parameterName, pathParameters);
      }
    }
  }
}

interface ExtractionContext {
  pathParameters: Record<string, Set<string>>;
  validCombinations: Record<
    string,
    Record<string, { params?: string; path: string; paramsKey: string }>
  >;
  root: OpenAPI3;
}

function recordValidCombination(
  parameterNames: string[],
  pathPattern: string,
  validCombinations: Record<
    string,
    Record<string, { params?: string; path: string; paramsKey: string }>
  >,
): void {
  let key: string;
  if (parameterNames.length === 0) {
    key = 'NO_PARAMS';
  } else {
    const sortedParameters = [...parameterNames];
    sortedParameters.sort((a, b) => a.localeCompare(b));
    key = sortedParameters.join('_AND_');
  }

  const validCombinationForKey = (validCombinations[key] ??= {});

  validCombinationForKey[pathPattern] = {
    params: parameterNames.length > 0 ? parameterNames.join(', ') : '',
    path: pathPattern,
    paramsKey: key,
  };
}

function processPath(
  pathPattern: string,
  pathItem: PathItemObject,
  context: ExtractionContext,
): void {
  const parameterNames = extractParameterNamesFromPath(pathPattern);

  for (const parameterName of parameterNames) {
    context.pathParameters[parameterName] ??= new Set<string>();
  }

  const pathLevelParameters: (ParameterObject | ReferenceObject)[] = pathItem.parameters ?? [];
  processParameterDefinitions(
    parameterNames,
    pathLevelParameters,
    context.pathParameters,
    context.root,
  );

  const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'] as const;
  for (const method of methods) {
    const operation = pathItem[method];
    if (operation && typeof operation === 'object') {
      for (const parameterName of parameterNames) {
        extractEnumValues(operation, parameterName, context.pathParameters, context.root);
      }
    }
  }

  recordValidCombination(parameterNames, pathPattern, context.validCombinations);
}

function extractPathParameters(schema: OpenAPI3) {
  const paths = schema.paths;
  const pathParameters: Record<string, Set<string>> = {};
  const validCombinations: Record<
    string,
    Record<string, { params?: string; path: string; paramsKey: string }>
  > = {};

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

  const result: Record<string, string[]> = {};
  for (const parameterName in pathParameters) {
    result[parameterName] = pathParameters[parameterName] ? [...pathParameters[parameterName]] : [];
  }

  return { parameters: result, validCombinations } as const;
}

export async function generateSchemaArtifacts(
  schema: OpenAPI3,
  outDirectory: string,
): Promise<void> {
  fs.mkdirSync(outDirectory, { recursive: true });

  const outFileJson = path.resolve(outDirectory, 'api-schema.json');
  const outFileTs = path.resolve(outDirectory, 'api-schema.ts');
  const outFileTsTypes = path.resolve(outDirectory, 'api-paths-types.ts');
  const outFilePathParameters = path.resolve(outDirectory, 'path-parameters.ts');

  const jsonStringSchema = JSON.stringify(schema, undefined, 2);
  fs.writeFileSync(outFileJson, jsonStringSchema);

  const ast = await openapiTS(schema);
  const contents = astToString(ast);
  fs.writeFileSync(outFileTsTypes, contents);

  const pathFileContent = `/**
 * The API schema.
 *
 * This is a runtime object that can be used to access the API definition programmatically.
 */

export const schema = ${jsonStringSchema} as const;

export type Schema = typeof schema;
`;
  fs.writeFileSync(outFileTs, pathFileContent);

  const { parameters, validCombinations } = extractPathParameters(schema);

  const pathParameterFileContent = `/**
 * GENERATED FILE - DO NOT EDIT
 * This file is generated from the API schema during type generation.
 * 
 * This file contains the tuples, types and type guards for the path parameters, for use in dynamically constructing API requests.
 * 
 * It also contains the valid parameter combinations for different paths.
 */

// Link to the processed schema for use with the OpenAPI-Fetch client.
import type { paths as Paths } from "./api-paths-types";
// Link to the schema runtime object file.
/**
 * The Schema["paths"] keys are the same as the Paths type keys, but the types are different.
 * The Schema["paths"] type is for the raw schema, and the Paths type is the OpenAPI-TS type for the processed schema.
 */
import type { Schema } from "./api-schema";
import { schema } from "./api-schema";


type ValidPath = keyof Paths;
/**
 * Convenience map for all the paths
 */
export const PATHS = {
${Object.keys(schema.paths ?? {})
  .sort((a, b) => a.localeCompare(b))
  .map((p) => `"${p}": "${p}"`)
  .join(',\n')}
} as const;

/**
 * Types derived from the runtime schema object.
*/
type RawPaths = Schema["paths"];

export function isValidPath(value: string): value is ValidPath {
  const paths = Object.keys(schema.paths);
  return paths.includes(value);
}
export const apiPaths: RawPaths = schema.paths;

// A union type of the allowed methods for all paths
type AllowedMethods = keyof (RawPaths[keyof RawPaths]);

const allowedMethodsSet = new Set<AllowedMethods>();
for (const path in schema.paths) {
  if (!isValidPath(path)) {
    throw new TypeError(\`Invalid path: \${path}\`);
  }
  const methods = Object.keys(schema.paths[path]);
  for (const method of methods) {
    allowedMethodsSet.add(method as AllowedMethods);
  }
}

// The full set of allowed methods for all paths.
export const allowedMethods: AllowedMethods[] = [...allowedMethodsSet];
export function isAllowedMethod(
  maybeMethod: string
): maybeMethod is AllowedMethods {
  const methods: readonly string[] = allowedMethods;
  return methods.includes(maybeMethod);
}

/**
 * For each path, and each method within that path,
 * map to the return type of a 200 response.
 * 
 * This works because the raw schema type and the OpenAPI-TS type use the path as the key.
 */
export type PathReturnTypes = {
  [P in ValidPath]: {
    "get": Paths[P]["get"]["responses"][200]["content"]["application/json"];
  }
};


/**
 * Key stages extracted from the API schema
 */
export const KEY_STAGES = ${JSON.stringify(parameters.keyStage, undefined, 2)} as const;
type KeyStages = typeof KEY_STAGES;
export type KeyStage = KeyStages[number];
export function isKeyStage(value: string): value is KeyStage {
  const keyStages: readonly string[] = KEY_STAGES;
  return keyStages.includes(value);
}

/**
 * Subjects extracted from the API schema
 */
export const SUBJECTS = ${JSON.stringify(parameters.subject, undefined, 2)} as const;
type Subjects = typeof SUBJECTS;
export type Subject = Subjects[number];
export function isSubject(value: string): value is Subject {
  const subjects: readonly string[] = SUBJECTS;
  return subjects.includes(value);
}

/**
 * Lessons extracted from the API schema
 */
export const LESSONS = ${JSON.stringify(parameters.lesson, undefined, 2)} as const;
type Lessons = typeof LESSONS;
export type Lesson = Lessons[number];
export function isLesson(value: string): value is Lesson {
  const lessons: readonly string[] = LESSONS;
  return lessons.includes(value);
}

/**
 * Asset types extracted from the API schema
 */
export const ASSET_TYPES = ${JSON.stringify(parameters.type, undefined, 2)} as const;
type AssetTypes = typeof ASSET_TYPES;
export type AssetType = AssetTypes[number];
export function isAssetType(value: string): value is AssetType {
  const assetTypes: readonly string[] = ASSET_TYPES;
  return assetTypes.includes(value);
} 

/**
 * Sequence types extracted from the API schema
 */
export const SEQUENCE_TYPES = ${JSON.stringify(parameters.sequence, undefined, 2)} as const;
type SequenceTypes = typeof SEQUENCE_TYPES;
export type SequenceType = SequenceTypes[number];
export function isSequenceType(value: string): value is SequenceType {
  const sequenceTypes: readonly string[] = SEQUENCE_TYPES;
  return sequenceTypes.includes(value);
}

/**
 * Thread slugs extracted from the API schema
 */
export const THREAD_SLUGS = ${JSON.stringify(parameters.threadSlug, undefined, 2)} as const;
type ThreadSlugs = typeof THREAD_SLUGS;
export type ThreadSlug = ThreadSlugs[number];
export function isThreadSlug(value: string): value is ThreadSlug {
  const threadSlugs: readonly string[] = THREAD_SLUGS;
  return threadSlugs.includes(value);
}

/**
 * Units extracted from the API schema
 */
export const UNITS = ${JSON.stringify(parameters.unit, undefined, 2)} as const;
type Units = typeof UNITS;
export type Unit = Units[number];
export function isUnit(value: string): value is Unit {
  const units: readonly string[] = UNITS;
  return units.includes(value);
}

/**
 * All possible path parameters extracted from the API schema
 */
interface PathParameters {
  keyStage: KeyStages;
  subject: Subjects;
  lesson: Lessons;
  type: AssetTypes;
  sequence: SequenceTypes;
  threadSlug: ThreadSlugs;
  unit: Units;
}

export const PATH_PARAMETERS: PathParameters = {
  keyStage: KEY_STAGES,
  subject: SUBJECTS,
  lesson: LESSONS,
  type: ASSET_TYPES,
  sequence: SEQUENCE_TYPES,
  threadSlug: THREAD_SLUGS,
  unit: UNITS,
} as const;

/**
 * Type for path parameter values
 */
export type PathParameterValues = {
  [K in keyof typeof PATH_PARAMETERS]: (typeof PATH_PARAMETERS)[K][number];
};

/**
 * Type guard for parameter types
 */
export function isValidParameterType(
  parameterType: string
): parameterType is keyof PathParameterValues {
  return parameterType in PATH_PARAMETERS;
}

/**
 * Function to validate if a value is a valid parameter for a given parameter type
 */
export function isValidPathParameter<K extends keyof PathParameterValues>(
  parameterType: K,
  value: string
): value is PathParameterValues[K] {
  const allowedValues: readonly string[] = PATH_PARAMETERS[parameterType]
  return allowedValues.length === 0 ? typeof value === "string" : allowedValues.includes(value)
};

/**
 * Path grouping keys
 */
type PathGroupingKeys = "NO_PARAMS" | ${Object.keys(validCombinations)
    .filter((key) => key !== 'NO_PARAMS')
    .map((key) => `"${key}"`)
    .join(' | ')}  ;


/**
 * Type for a valid parameter combination, linking to the paths types file.
 */
// Parametrise ValidParameterCombination with both the path and the path key
interface ValidParameterCombination<
  P extends ValidPath,
  K extends PathGroupingKeys
> {
  params?: string;
  path: P;
  paramsKey: K; // This ensures paramsKey matches the K type parameter, enabling type narrowing based on the path key
}

// Make ValidPathAndParameters parameterized by the path key K
type ValidPathAndParameters<K extends PathGroupingKeys> = {
  // Only include paths that are valid for this specific K
  [P in ValidPath as P extends keyof Paths ? P : never]?: ValidParameterCombination<P, K>;
};

// Now ValidPathGroupings maps each key to only its relevant paths
type ValidPathGroupings = {
  [K in PathGroupingKeys]: ValidPathAndParameters<K>;
};



/**
 * Valid combinations of parameters for different paths
 */
export const VALID_PATHS_BY_PARAMETERS: ValidPathGroupings = {
${Object.keys(validCombinations)
  .sort((a, b) => a.localeCompare(b))
  .map((pathGroupingKey) => {
    const group = validCombinations[pathGroupingKey] ?? {};
    const sortedKeys = Object.keys(group as Record<string, unknown>).sort((a, b) =>
      a.localeCompare(b),
    );
    const sortedEntries: Record<string, { params?: string; path: string; paramsKey: string }> = {};
    for (const key of sortedKeys) {
      const entry = (group as Record<string, { params?: string; path: string; paramsKey: string }>)[
        key
      ];
      if (entry) {
        sortedEntries[key] = entry;
      }
    }
    return `"${pathGroupingKey}": ${JSON.stringify(sortedEntries, undefined, 2)}`;
  })
  .join(', ')}
};
`;

  fs.writeFileSync(outFilePathParameters, pathParameterFileContent);

  // Format the generated files with prettier
  try {
    const filesToFormat = [outFileJson, outFileTs, outFileTsTypes, outFilePathParameters];
    for (const file of filesToFormat) {
      execSync(`npx prettier --write "${file}"`, { stdio: 'inherit', cwd: path.dirname(file) });
    }
  } catch (error) {
    console.warn('Warning: Failed to format generated files with prettier:', error);
    // Don't fail the generation if prettier fails
  }
}
