import type { OpenAPIObject } from 'openapi3-ts/oas31';

export function assertOpenApiGeneratorInput(schema: OpenAPIObject, generatorName: string): void {
  if (typeof schema.openapi !== 'string' || schema.openapi.length === 0) {
    throw new TypeError(`${generatorName} requires an OpenAPI schema with an openapi version.`);
  }
}
