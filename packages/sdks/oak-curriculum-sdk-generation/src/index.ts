/**
 * `\@oaknational/curriculum-sdk-generation`
 *
 * Generation-time workspace for the Oak Curriculum SDK.
 * Hosts two data pipelines that run during `pnpm type-gen`:
 *
 * - **API pipeline**: OpenAPI spec to TypeScript types, Zod schemas,
 *   and MCP tool descriptors. Consumed by the curriculum SDK runtime
 *   and MCP server apps.
 *
 * - **Bulk pipeline**: bulk download JSON files to bulk types,
 *   extractors, Elasticsearch mappings, knowledge graphs, and
 *   vocabulary artefacts. Consumed by the search SDK and search CLI.
 *
 * This workspace is a shared foundation for type infrastructure.
 * Consumers needing types, schemas, readers, or extractors import
 * from this package directly. The runtime SDK
 * (`\@oaknational/curriculum-sdk`) handles API access concerns.
 *
 * @see `docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md` — ADR-108
 *
 * @packageDocumentation
 */

export {};
