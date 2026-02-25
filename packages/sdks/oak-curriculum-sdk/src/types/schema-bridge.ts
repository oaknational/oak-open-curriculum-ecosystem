/**
 * Bridge module that re-exports the generated schema base for TypeDoc and
 * consumers that need the full OpenAPI schema type without importing directly
 * from the generated directory.
 *
 * @generated
 */
import { schemaBase } from '@oaknational/sdk-codegen/api-schema';

export type OpenApiSchemaBase = typeof schemaBase;

export { schemaBase };
