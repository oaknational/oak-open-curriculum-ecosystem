import { createHash } from 'node:crypto';

const isLocal = process.env.VERCEL !== '1';

/**
 * Generates deterministic cache-busting hash for widget URI.
 *
 * Uses SHA-256 hash of current timestamp to ensure each build
 * produces a unique widget URI, forcing hosts to reload
 * the widget bundle instead of using a stale cached version.
 *
 * @returns First 8 characters of SHA-256 hash (e.g., "abc12345")
 */
function generateWidgetUriHash(isLocal: boolean): string {
  if (isLocal) {
    return 'local';
  }
  const timestamp = Date.now().toString();
  const hash = createHash('sha256').update(timestamp).digest('hex');
  return hash.slice(0, 8);
}

/**
 * Base widget URI with cache-busting hash.
 *
 * Generated at sdk-codegen time to ensure all tools and widget resource
 * registration use the same URI. New builds get new hashes, naturally
 * busting the host widget cache.
 *
 * Format: ui://widget/oak-curriculum-app-<hash>.html
 * Example: ui://widget/oak-curriculum-app-abc12345.html
 *
 * @see https://modelcontextprotocol.io/extensions/apps/overview (MCP Apps standard)
 */
export const BASE_WIDGET_URI = `ui://widget/oak-curriculum-app-${generateWidgetUriHash(isLocal)}.html`;

/**
 * Tools that should advertise a widget UI via `_meta.ui.resourceUri`.
 *
 * Only allowlisted **names** emit `_meta.ui.resourceUri` in codegen and in
 * aggregated tool definitions. Other tools must not include `resourceUri`
 * in `_meta.ui` (even if they use `_meta.ui.visibility` for app-only helpers).
 *
 * Tools in this set get `_meta.ui.resourceUri` in their codegen output
 * and in aggregated definitions.
 *
 * @see https://modelcontextprotocol.io/extensions/apps/overview (MCP Apps standard)
 */
export const WIDGET_TOOL_NAMES: ReadonlySet<string> = new Set([
  'get-curriculum-model',
  'user-search',
]);
