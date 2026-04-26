/**
 * Hand-authored MCP protocol types.
 *
 * These types define contracts that are NOT derived from the OpenAPI spec.
 * They change when we make MCP feature decisions, not when the upstream
 * API changes. Placing them here — outside `src/types/generated/` — keeps
 * them safe from `generate:clean` (`rm -rf src/types/generated`) while
 * giving them full IDE support, TSDoc, and compile-time checking.
 *
 * The generator (`generate-tool-descriptor-file.ts`) emits an import from
 * this module so that `ToolDescriptor` references these types by import
 * rather than duplicating them in a string template.
 *
 * @see ADR-029 for the cardinal rule (API-derived types are generated)
 * @see ADR-157 §Namespace Convention for SourceAttribution rationale
 * @see ADR-141 for MCP Apps metadata (`_meta.ui`)
 *
 * @packageDocumentation
 */

// ---------------------------------------------------------------------------
// Security schemes
// ---------------------------------------------------------------------------

/**
 * Union of supported security scheme type literals.
 */
export type SecuritySchemeType = 'noauth' | 'oauth2';

/**
 * No authentication required.
 *
 * Tools with this scheme can be called without a Bearer token.
 * Typically used for public metadata or discovery endpoints.
 */
export interface NoAuthScheme {
  readonly type: 'noauth';
}

/**
 * OAuth 2.1 authentication required.
 *
 * Tools with this scheme require a valid OAuth 2.1 Bearer token.
 * Scopes define the required permissions.
 */
export interface OAuth2Scheme {
  readonly type: 'oauth2';
  readonly scopes?: readonly string[];
}

/**
 * Union of all supported security schemes.
 *
 * This discriminated union allows type-safe handling of different
 * authentication requirements. Use the `type` field to narrow.
 */
export type SecurityScheme = NoAuthScheme | OAuth2Scheme;

// ---------------------------------------------------------------------------
// Source attribution (ADR-157)
// ---------------------------------------------------------------------------

/**
 * Machine-readable source attribution for an MCP resource or tool.
 *
 * Embedded in the `_meta.attribution` field of resource and tool definitions
 * so downstream consumers can programmatically identify data provenance.
 *
 * @see ADR-157 §Namespace Convention for the prefix and attribution rationale
 */
export interface SourceAttribution {
  /** Display name of the upstream data source. */
  readonly source: string;
  /** Canonical URL for the upstream data source. */
  readonly sourceUrl: string;
  /** SPDX-style or human-readable licence name. */
  readonly licence: string;
  /** URL to the full licence text. */
  readonly licenceUrl: string;
  /** Required attribution text for downstream consumers. */
  readonly attributionNote: string;
}

// ---------------------------------------------------------------------------
// MCP tool annotations
// ---------------------------------------------------------------------------

/**
 * MCP tool annotations providing hints about tool behaviour.
 *
 * Uses `type` (not `interface`) to prevent accidental declaration merging.
 *
 * @see https://spec.modelcontextprotocol.io/specification/server/tools/#annotations-object
 */
export interface ToolAnnotations {
  readonly readOnlyHint?: boolean;
  readonly destructiveHint?: boolean;
  readonly idempotentHint?: boolean;
  readonly openWorldHint?: boolean;
  readonly title?: string;
}

// ---------------------------------------------------------------------------
// MCP Apps metadata (_meta)
// ---------------------------------------------------------------------------

/**
 * MCP Apps standard metadata for tool descriptors (ADR-141),
 * extended with optional source attribution (ADR-157 §Namespace Convention).
 *
 * Uses `type` (not `interface`) to prevent accidental declaration merging.
 *
 * @see https://modelcontextprotocol.io/extensions/apps/overview
 * @see ADR-157 §Namespace Convention for attribution rationale
 */
export interface ToolMeta {
  /** MCP Apps UI metadata for widget tools */
  readonly ui?: {
    /**
     * URI of the UI resource to display for this tool (e.g. `ui://widget/app.html`).
     * Omit when the tool does not open an embedded app, but may still set
     * {@link visibility} (e.g. app-only helper tools with no widget).
     */
    readonly resourceUri?: string;
    /**
     * Tool visibility for MCP Apps hosts.
     *
     * Valid values: `['model']`, `['app']`, or `['model', 'app']`.
     * When omitted, defaults to `['model', 'app']` (callable by both).
     * Set to `['app']` for app-only helper tools hidden from the model.
     *
     * @see https://modelcontextprotocol.io/extensions/apps/overview
     */
    readonly visibility?: ('model' | 'app')[];
  };
  /** Mirror securitySchemes for clients that only read _meta */
  readonly securitySchemes?: readonly SecurityScheme[];
  /** Source attribution metadata (ADR-157 §Namespace Convention) */
  readonly attribution?: SourceAttribution;
}

// ---------------------------------------------------------------------------
// Invocation types
// ---------------------------------------------------------------------------

/**
 * Utility type that narrows a numeric-string literal to its numeric form.
 *
 * Used by `ToolDescriptor` to convert HTTP status strings (e.g. `"200"`)
 * into their numeric equivalents for discriminated union narrowing.
 */
export type StatusDiscriminant<T extends string> = T extends `${infer N extends number}` ? N : T;

/**
 * Return shape of the generated invoke method.
 *
 * Preserves the HTTP status alongside the response payload so that
 * consumers can distinguish error statuses (400/401/404) even when
 * the response body validates against multiple documented schemas.
 */
export interface InvokeResult {
  readonly httpStatus: number;
  readonly payload: unknown;
}

// ---------------------------------------------------------------------------
// Error contract
// ---------------------------------------------------------------------------

/**
 * Shared prefix for the TypeError thrown by generated executors when the
 * upstream API returns a documented error HTTP status of 400 or above.
 *
 * Both the generated `invokeToolByName` (producer) and the authored
 * `mapErrorToResult` (consumer) reference this constant to maintain
 * a single source of truth for the cross-layer contract.
 */
export const DOCUMENTED_ERROR_PREFIX = 'Documented error response: ';
