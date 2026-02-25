import { createHash } from 'node:crypto';

const isLocal = process.env.VERCEL !== '1';

/**
 * Generates deterministic cache-busting hash for widget URI.
 *
 * Uses SHA-256 hash of current timestamp to ensure each build
 * produces a unique widget URI, forcing ChatGPT to reload
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
 * busting ChatGPT's widget cache.
 *
 * Format: ui://widget/oak-json-viewer-<hash>.html
 * Example: ui://widget/oak-json-viewer-abc12345.html
 *
 * @see https://developers.openai.com/apps-sdk/build/mcp-server (cache-busting best practice)
 */
export const BASE_WIDGET_URI = `ui://widget/oak-json-viewer-${generateWidgetUriHash(isLocal)}.html`;
