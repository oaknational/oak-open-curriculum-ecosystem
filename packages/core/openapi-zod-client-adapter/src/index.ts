/**
 * OpenAPI Zod Client Adapter
 *
 * This library is the ONLY code in the codebase that may import from `openapi-zod-client`.
 * It encapsulates all Zod v3 artefacts and provides a clean Zod v4-compatible interface.
 *
 * The adapter enforces the Zod version boundary documented in ADR-055.
 */

export {
  generateZodSchemasFromOpenAPI,
  type GenerateZodSchemasOptions,
  type GenerateZodSchemasResult,
} from './generate-zod-schemas.js';

export {
  getEndpointDefinitions,
  type EndpointDefinitionOptions,
  type EndpointDefinitionResult,
  type EndpointDefinition,
  type EndpointParameter,
  type EndpointError,
} from './get-endpoint-definitions.js';

export { transformZodV3ToV4 } from './zod-v3-to-v4-transform.js';
