/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Widget URI constants generated from sdk-codegen cross-domain constants.
 * 
 * @see code-generation/typegen/cross-domain-constants.ts - Single source of truth
 */

/**
 * Base URI for the Oak JSON viewer widget resource.
 *
 * This widget renders tool output with Oak branding, logo, and styling.
 * All generated tools reference this URI in their `_meta.ui.resourceUri` field (ADR-141).
 *
 * **Cache-Busting Strategy**: The URI includes a hash generated at sdk-codegen time.
 * Each build produces a new hash, naturally busting the host widget cache.
 *
 * **Format**: `ui://widget/oak-json-viewer-<hash>.html`
 * **Example**: `ui://widget/oak-json-viewer-abc12345.html`
 *
 * @see code-generation/typegen/cross-domain-constants.ts - Source of truth
 * @see https://modelcontextprotocol.io/extensions/apps/overview (MCP Apps standard)
 */
export const WIDGET_URI = "ui://widget/oak-json-viewer-local.html" as const;

/**
 * Tools that advertise a widget UI via `_meta.ui.resourceUri`.
 *
 * Only tools in this set have `_meta.ui` in their descriptors.
 * All other tools have no widget UI — MCP clients will not render
 * a widget for their results.
 *
 * @see code-generation/typegen/cross-domain-constants.ts - Source of truth
 */
export const WIDGET_TOOL_NAMES: ReadonlySet<string> = new Set([]);
