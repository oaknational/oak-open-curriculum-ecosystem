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
 * All generated tools reference this URI in their `_meta['openai/outputTemplate']` field.
 *
 * **Cache-Busting Strategy**: The URI includes a hash generated at sdk-codegen time.
 * Each build produces a new hash, naturally busting ChatGPT's widget cache.
 * This aligns with OpenAI's best practice: "give the template a new URI".
 *
 * **Format**: `ui://widget/oak-json-viewer-<hash>.html`
 * **Example**: `ui://widget/oak-json-viewer-abc12345.html`
 *
 * @see code-generation/typegen/cross-domain-constants.ts - Source of truth
 * @see https://developers.openai.com/apps-sdk/build/mcp-server (OpenAI cache-busting guidance)
 */
export const WIDGET_URI = "ui://widget/oak-json-viewer-local.html" as const;
