import type { OpenAPIObject } from 'openapi3-ts/oas31';

type SchemaWithPaths = Omit<OpenAPIObject, 'paths'> & {
  paths: NonNullable<OpenAPIObject['paths']>;
};

export function ensurePathsOnSchema(schema: OpenAPIObject): SchemaWithPaths {
  const { paths, ...rest } = schema;
  if (paths) {
    return { ...rest, paths };
  }
  return { ...rest, paths: {} };
}
