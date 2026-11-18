/**
 * Test fixture: a response whose JSON body is a `$ref` to a named component
 * schema, the shape the upstream Oak API uses for every shared error response
 * (`error.BAD_REQUEST`, `error.UNAUTHORIZED`, `error.NOT_FOUND`).
 */
import type { ResponseObject } from 'openapi3-ts/oas31';

/**
 * A response referencing `#/components/schemas/<name>`.
 *
 * @param name - The component schema name, dotted as upstream writes it
 */
export function errorResponseRef(name: string): ResponseObject {
  return {
    description: name,
    content: {
      'application/json': {
        schema: { $ref: `#/components/schemas/${name}` },
      },
    },
  };
}
