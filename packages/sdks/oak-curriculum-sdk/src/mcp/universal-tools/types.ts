/**
 * Type definitions for universal MCP tools.
 *
 * This module defines the core type interfaces for MCP tool metadata,
 * including annotations for behaviour hints and MCP Apps standard metadata
 * for UI integration (ADR-141).
 *
 * @remarks These types are used throughout the universal tools system
 * to ensure consistent structure for tool listings and registration.
 */

// `ZodRawShapeCompat | AnySchema` is the MCP SDK's own `registerTool` carrier
// union (raw shape OR a constructed schema value); resolved via the SDK's `./*`
// wildcard export to `dist/esm/server/zod-compat` — there is no explicit
// `./server/zod-compat` export entry.
import type { AnySchema, ZodRawShapeCompat } from '@modelcontextprotocol/sdk/server/zod-compat';
import type {
  ToolName,
  ToolDescriptorForName,
  SecurityScheme,
  ToolAnnotations,
  ToolMeta,
} from '@oaknational/sdk-codegen/mcp-tools';

/**
 * Subset of ToolDescriptor fields that the universal-tools layer accesses.
 *
 * Narrowed from the full `ToolDescriptorForName<TName>` via Interface
 * Segregation: consumers only need listing metadata and domain-context
 * hints, not invoke functions or Zod schemas.
 *
 * Generated tools must still provide a human-facing title and description.
 * `listUniversalTools()` fails fast if either field is missing.
 */
export interface ToolRegistryDescriptor {
  readonly title?: string;
  readonly description?: string;
  readonly inputSchema: ToolDescriptorForName<ToolName>['inputSchema'];
  readonly toolMcpFlatInputSchema: ToolDescriptorForName<ToolName>['toolMcpFlatInputSchema'];
  readonly securitySchemes?: readonly SecurityScheme[];
  readonly annotations?: ToolAnnotations;
  readonly _meta: ToolMeta;
  readonly requiresDomainContext?: boolean;
}

/**
 * Dependency interface for generated tool functions from the generation SDK.
 *
 * Abstracts the generation SDK's runtime exports behind an interface,
 * enabling dependency injection in both product code and tests.
 * The default implementation wires the real generation SDK functions;
 * tests inject lightweight fakes.
 *
 * @example
 * ```typescript
 * const registry: GeneratedToolRegistry = {
 *   toolNames: ['get-subjects'],
 *   getToolFromToolName: (name) => generatedToolRegistry.getToolFromToolName(name),
 *   isToolName: (value): value is ToolName => value === 'get-subjects',
 * };
 * ```
 */
export interface GeneratedToolRegistry {
  readonly toolNames: readonly ToolName[];
  readonly getToolFromToolName: (name: ToolName) => ToolRegistryDescriptor;
  readonly isToolName: (value: unknown) => value is ToolName;
}

/**
 * Aggregated tool names — hand-written tools that combine multiple API
 * calls into a single operation.
 *
 * @remarks This is an explicit union rather than derived from
 * `keyof typeof AGGREGATED_TOOL_DEFS` to break the circular dependency
 * between `types.ts` and `definitions.ts`. Compile-time safety is
 * maintained by the `satisfies Record<AggregatedToolName, ...>` guard
 * in `definitions.ts` — adding a tool to the map without updating
 * this union (or vice versa) is a type error.
 */
export type AggregatedToolName =
  | 'search'
  | 'fetch'
  | 'get-curriculum-model'
  | 'get-thread-progressions'
  | 'get-prior-knowledge-graph'
  | 'get-misconception-graph'
  | 'browse-curriculum'
  | 'explore-topic'
  | 'download-asset'
  | 'user-search'
  | 'user-search-query';

/**
 * Union of all tool names combining aggregated and generated tools.
 *
 * - Aggregated tools: search, fetch, get-curriculum-model (hand-written)
 * - Generated tools: All tools from OpenAPI spec (from code-generation)
 */
export type UniversalToolName = AggregatedToolName | ToolName;

export type { ToolAnnotations, ToolMeta };

/**
 * Entry in the universal tools list for MCP registration.
 *
 * Contains all metadata needed to register a tool with an MCP server,
 * including Zod schema for MCP SDK registration with proper parameter
 * descriptions and examples.
 *
 * `inputSchema` is always present. Tools without arguments expose `{}`,
 * which keeps the registration contract uniform while still producing an
 * object schema with no declared input properties on the wire.
 *
 * @example
 * ```typescript
 * const tool: UniversalToolListEntry = {
 *   name: 'get-curriculum-model',
 *   title: 'Oak Curriculum Overview',
 *   description: 'Orientation tool for the Oak curriculum domain.',
 *   inputSchema: {},
 * };
 * ```
 */
export interface UniversalToolListEntry {
  /** Tool name used for invocation (machine identifier) */
  readonly name: UniversalToolName;
  /** Human-friendly display name carried through from tool metadata */
  readonly title: string;
  /** Human-readable description of what the tool does */
  readonly description: string;
  /**
   * Input schema for MCP SDK `registerTool()` / `registerAppTool()`.
   *
   * Most tools provide a Zod raw shape containing `.describe()` and
   * `.meta({ examples })` calls that preserve parameter descriptions and
   * examples through the MCP SDK's native `z.toJSONSchema()` conversion;
   * no-input tools expose an empty shape (`{}`). Graph tools whose input is a
   * single `z.object(...)` (a constructed schema value) pass it directly — the
   * `AnySchema` arm of the carrier accepts it with no `as` cast.
   */
  readonly inputSchema: ZodRawShapeCompat | AnySchema;
  /**
   * Output schema for MCP SDK `registerTool()` / `registerAppTool()`, when the
   * tool declares one. The SDK validates the tool's `structuredContent` against
   * it (and skips validation when a result is `isError`). Always a constructed
   * `z.object(...)` value, never a raw shape. Optional on the carrier
   * (transitional): tools acquire output schemas incrementally
   * (`output-schemas-for-mcp-tools.plan.md`).
   */
  readonly outputSchema?: AnySchema;
  /** Security schemes required to invoke this tool */
  readonly securitySchemes?: readonly SecurityScheme[];
  /** MCP annotations providing behaviour hints */
  readonly annotations?: ToolAnnotations;
  /** MCP Apps standard metadata for UI integration (ADR-141) */
  readonly _meta: ToolMeta;
}

/**
 * A `UniversalToolListEntry` known to carry `_meta.ui` metadata.
 *
 * Widget tools (those in `WIDGET_TOOL_NAMES`) always have this field.
 * Use `isAppToolEntry()` to narrow a `UniversalToolListEntry` to this type.
 *
 * @example
 * ```typescript
 * const tool = listUniversalTools(generatedToolRegistry).find(
 *   (entry) => entry.name === 'user-search',
 * );
 *
 * if (tool && isAppToolEntry(tool)) {
 *   console.log(tool._meta.ui.resourceUri);
 * }
 * ```
 */
export interface AppToolListEntry extends UniversalToolListEntry {
  /**
   * Widget/app tools always declare a raw input shape (or `{}`), never a
   * constructed schema value, so this narrows the carrier's
   * `ZodRawShapeCompat | AnySchema` to the raw-shape arm — the type
   * `registerAppTool` accepts (its carrier is `ZodRawShapeCompat |
   * StandardSchemaWithJSON`, which excludes the SDK's `AnySchema`).
   */
  readonly inputSchema: ZodRawShapeCompat;
  readonly _meta: ToolMeta & { readonly ui: { readonly resourceUri: string } };
}
