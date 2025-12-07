/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Widget URI constants generated from type-gen cross-domain constants.
 * 
 * @see type-gen/typegen/cross-domain-constants.ts - Single source of truth
 */

/**
 * Base URI for the Oak JSON viewer widget resource.
 *
 * This widget renders tool output with Oak branding, logo, and styling.
 * All generated tools reference this URI in their `_meta['openai/outputTemplate']` field.
 *
 * **For HTTP servers**: Import via public API to apply cache-busting:
 * `@oaknational/oak-curriculum-sdk/public/mcp-tools`
 */
export const WIDGET_URI = "ui://widget/oak-json-viewer.html" as const;
