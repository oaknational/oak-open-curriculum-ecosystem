/**
 * Zod v3 to v4 Adapter
 *
 * This adapter re-exports from @oaknational/openapi-zod-client-adapter,
 * which is the ONLY code in the codebase that may:
 * 1. Call openapi-zod-client
 * 2. Import from 'zod' (v3)
 *
 * All other code MUST import from 'zod' (with Zod v4 installed).
 *
 * @packageDocumentation
 */

export {
  generateZodSchemasFromOpenAPI,
  type GenerateZodSchemasOptions,
  type GenerateZodSchemasResult,
  transformZodV3ToV4,
  getEndpointDefinitions,
  type EndpointDefinitionOptions,
  type EndpointDefinitionResult,
  type EndpointDefinition,
  type EndpointParameter,
  type EndpointError,
} from '@oaknational/openapi-zod-client-adapter';
