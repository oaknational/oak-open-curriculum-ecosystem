/**
 * Path generation functions
 * Pure functions for generating path-related TypeScript code
 */

import type { OpenAPIObject } from 'openapi3-ts/oas31';

/**
 * Generate path parameters file header
 * @returns TypeScript file header with imports and documentation
 */
export function generatePathParametersHeader(): string {
  return `/**
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
import type { SchemaBase as Schema } from "./api-schema-base";
import { schemaBase as schema } from "./api-schema-base.js";

`;
}

/**
 * Generate PATHS constant from schema
 * @param schema - OpenAPI schema object
 * @returns TypeScript code for PATHS constant
 */
export function generatePathsConstant(schema: Pick<OpenAPIObject, 'paths'>): string {
  const pathEntries = Object.keys(schema.paths ?? {})
    .sort((a, b) => a.localeCompare(b))
    .map((path) => `  '${path}': '${path}'`)
    .join(',\n');

  return `export type ValidPath = keyof Paths;
/**
 * Convenience map for all the paths
 */
export const PATHS = {
${pathEntries}
} as const;`;
}

/**
 * Generate runtime schema checks section
 * @param getPaths - sorted array of OpenAPI paths that have a GET method
 * @returns TypeScript code for runtime validation functions
 */
function runtimeTypeDerivations(getPaths: readonly string[]): string {
  const header = `
/**
 * Types derived from the runtime schema object.
*/
export type RawPaths = Schema["paths"];

export function isValidPath(value: string): value is ValidPath {
  const paths = Object.keys(schema.paths);
  return paths.includes(value);
}
export const apiPaths: RawPaths = schema.paths;`;
  const httpMethods = `
// 1. All standard HTTP methods (the OpenAPI 3.1 vocabulary)
export const POSSIBLE_HTTP_METHODS = [
  "delete", "get", "head", "options", "patch", "post", "put", "trace"
] as const;
export type PossibleHttpMethod = (typeof POSSIBLE_HTTP_METHODS)[number];
export function isPossibleHttpMethod(value: string): value is PossibleHttpMethod {
  const methods: readonly string[] = POSSIBLE_HTTP_METHODS;
  return methods.includes(value);
}

// 2. API methods — derived from the runtime schema, exact type from the schema type system
type MethodKeysOf<T> = T extends unknown ? Extract<keyof T, PossibleHttpMethod> : never;
export type ApiHttpMethod = MethodKeysOf<RawPaths[keyof RawPaths]>;
const possibleMethodSet: ReadonlySet<string> = new Set(POSSIBLE_HTTP_METHODS);
export const API_HTTP_METHODS: readonly ApiHttpMethod[] = [...new Set(
  Object.values(schema.paths).flatMap((p) =>
    Object.keys(p).filter((k): k is ApiHttpMethod => possibleMethodSet.has(k))
  ),
)].sort((a, b) => a.localeCompare(b));
export function isApiHttpMethod(maybeMethod: string): maybeMethod is ApiHttpMethod {
  const methods: readonly string[] = API_HTTP_METHODS;
  return methods.includes(maybeMethod);
}`;
  const tail = `
// Helper types derived from schema for path/method/response typing
export type AllowedMethodsForPath<P extends ValidPath> = Extract<keyof Paths[P], PossibleHttpMethod>;

/**
 * Extract the JSON body from a 200 response for a given path and method.
 *
 * Uses direct \`Paths\` indexed access rather than the \`PathOperation\`
 * conditional chain. TypeScript resolves direct indexing eagerly for
 * concrete path/method literals, making the resulting type spreadable
 * in augmentation functions. The \`PathOperation\`-based chain
 * (\`ResponseForPathAndMethod\`) defers evaluation even for single
 * literals, which causes TS2698 spread errors.
 *
 * For methods that do not exist on a path (e.g. \`put?: never\`),
 * \`Paths[P][M]\` is \`never\`, and the conditional correctly yields
 * \`never\`.
 */
export type JsonBody200<P extends ValidPath, M extends AllowedMethodsForPath<P>> =
  Paths[P][M] extends { responses: { 200: { content: { 'application/json': infer J } } } }
    ? J
    : never;

/** Paths that expose a GET method. */
export type ValidGetPath = {
  [P in ValidPath]: 'get' extends AllowedMethodsForPath<P> ? P : never
}[ValidPath];

/**
 * Union of all GET 200 JSON response body types.
 *
 * Generated at sdk-codegen time as an explicit union — one direct
 * \`Paths\` index per path. Each member resolves eagerly to the
 * concrete response type from the processed OpenAPI schema, with no
 * conditional or mapped type indirection.
 *
 * Replaces hand-authored \`Readonly<Record<string, unknown>>\` aliases
 * that widen the type system.
 */
export type GetResponseBody =
${getPaths.map((p) => `  | Paths['${p}']['get']['responses'][200]['content']['application/json']`).join('\n')};

/** GET 200 response bodies that are objects (safe to spread). */
export type GetObjectResponseBody = Exclude<GetResponseBody, readonly unknown[]>;

/** GET 200 response bodies that are arrays. */
export type GetArrayResponseBody = Extract<GetResponseBody, readonly unknown[]>;

/** Element type of array-valued GET 200 response bodies. */
export type GetArrayResponseElement =
  GetArrayResponseBody extends readonly (infer E)[] ? E : never;`;
  return [header, httpMethods, tail].join('\n');
}

/**
 * Generate runtime type derivations from the schema.
 *
 * @param schema - OpenAPI schema; used to enumerate GET paths for the
 *   explicit `GetResponseBody` union. When omitted (e.g. in unit tests
 *   that don't supply a schema), the union is generated from a
 *   placeholder so the structural tests still pass.
 */
export function generateRuntimeSchemaChecks(schema?: Pick<OpenAPIObject, 'paths'>): string {
  const paths = Object.keys(schema?.paths ?? {}).sort((a, b) => a.localeCompare(b));
  return runtimeTypeDerivations(paths);
}
