/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Widget URI constants generated from sdk-codegen cross-domain constants.
 *
 * @see code-generation/typegen/cross-domain-constants.ts - Single source of truth
 */

/**
 * Base URI for the Oak curriculum MCP App resource.
 *
 * This app renders tool output with Oak branding, logo, and styling.
 * All UI-bearing tools reference this URI in their `_meta.ui.resourceUri` field (ADR-141).
 *
 * **Published address**: the URI is the same on every build. Clients keep the
 * address from the tool list they were given, so compatible widget changes
 * ship as content behind it; an incompatible change takes the next version
 * segment and is a published-contract change (ADR-141, widget URI identity
 * amendment; MCP-489).
 *
 * @see code-generation/typegen/cross-domain-constants.ts - Source of truth
 * @see https://modelcontextprotocol.io/extensions/apps/overview (MCP Apps standard)
 */
export const WIDGET_URI = "ui://widget/oak-curriculum-app-v1.html" as const;

/**
 * Widget addresses from releases before the address was fixed.
 *
 * Not served. Listed on the auth public-resource allowlist so that an
 * unauthenticated read reaches the resource-not-found error rather than an
 * authentication challenge. The server sends no instruction to list tools
 * again (ADR-141, widget URI identity amendment; MCP-489).
 *
 * @see code-generation/typegen/cross-domain-constants.ts - Source of truth
 */
export const RETIRED_WIDGET_URIS: readonly string[] = ["ui://widget/oak-curriculum-app-899803c6.html","ui://widget/oak-curriculum-app-5ce56c4b.html"];

/**
 * Tools that advertise a widget UI via `_meta.ui.resourceUri`.
 *
 * Only tools in this set have `_meta.ui` in their descriptors.
 * All other tools have no widget UI — MCP clients will not render
 * a widget for their results.
 *
 * @see code-generation/typegen/cross-domain-constants.ts - Source of truth
 */
export const WIDGET_TOOL_NAMES: ReadonlySet<string> = new Set(["get-curriculum-model","user-search"]);
