/**
 * `@oaknational/sdk-codegen`
 *
 * Generation-time workspace for the Oak Curriculum SDK.
 * Hosts two data pipelines that run during `pnpm sdk-codegen`:
 *
 * - **API pipeline**: OpenAPI spec to TypeScript types, Zod schemas,
 *   and MCP tool descriptors. Consumed by the curriculum SDK runtime
 *   and MCP server apps.
 *
 * - **Bulk pipeline**: bulk download JSON files to bulk types,
 *   extractors, Elasticsearch mappings, knowledge graphs, and
 *   vocabulary artefacts. Consumed by the search SDK and search CLI.
 *
 * **Prefer subpath imports** over this root barrel for better
 * tree-shaking and explicit domain grouping:
 *
 * - `@oaknational/sdk-codegen/api-schema`
 * - `@oaknational/sdk-codegen/mcp-tools`
 * - `@oaknational/sdk-codegen/search`
 * - `@oaknational/sdk-codegen/zod`
 * - `@oaknational/sdk-codegen/bulk`
 * - `@oaknational/sdk-codegen/query-parser`
 * - `@oaknational/sdk-codegen/observability`
 * - `@oaknational/sdk-codegen/admin`
 * - `@oaknational/sdk-codegen/widget-constants`
 *
 * @see `docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md` — ADR-108
 *
 * @packageDocumentation
 */

// Curated subset of the most commonly used API schema exports
export {
  PATHS,
  isValidPath,
  KEY_STAGES,
  isKeyStage,
  SUBJECTS,
  isSubject,
  ASSET_TYPES,
  isAssetType,
  PATH_OPERATIONS,
  OPERATIONS_BY_ID,
  isOperationId,
  schemaBase,
} from './api-schema.js';
export type {
  paths,
  components,
  operations,
  ValidPath,
  KeyStage,
  Subject,
  AssetType,
  PathOperation,
  OperationId,
  SchemaBase,
  OakApiPathBasedClient,
} from './api-schema.js';

// Curated search types
export { SEARCH_SCOPES, isSearchScope, isSearchScopeWithAll } from './search.js';
export type { SearchScope, SearchScopeWithAll, SearchSubjectSlug } from './search.js';

export { WIDGET_URI } from './widget-constants.js';
