import type { OpenAPIObject, PathsObject } from 'openapi3-ts/oas31';

type OpenAPIWithPaths = OpenAPIObject & { paths: PathsObject };

/**
 * Ensures paths is present and non-optional on the schema.
 * openapi-zod-client expects paths to always be defined.
 */
export function ensurePathsPresent(schema: OpenAPIObject): OpenAPIWithPaths {
  const { paths, ...rest } = schema;
  if (paths) {
    return { ...rest, paths };
  }
  return { ...rest, paths: {} };
}
