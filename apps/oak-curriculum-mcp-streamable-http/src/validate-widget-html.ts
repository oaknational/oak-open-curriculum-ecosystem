/**
 * Fail-fast startup validation for the MCP App widget HTML bundle.
 *
 * Called during server bootstrap before resource registration. If the
 * built widget HTML is missing (e.g. build step skipped), the server
 * fails immediately with a descriptive error instead of producing an
 * opaque `ENOENT` on the first `resources/read` request.
 */

import { existsSync as nodeExistsSync } from 'node:fs';

/**
 * Validates that the widget HTML file exists at the given path.
 *
 * @param widgetHtmlPath - Absolute path to the built widget HTML file
 * @param existsSync - Filesystem existence check (injected for testability, defaults to `node:fs` `existsSync`)
 * @throws Error with descriptive message and build guidance when the file is missing
 */
export function validateWidgetHtmlExists(
  widgetHtmlPath: string,
  existsSync: (path: string) => boolean = nodeExistsSync,
): void {
  const existsAtWidgetPath = existsSync(widgetHtmlPath);
  // #region agent log
  fetch('http://127.0.0.1:7247/ingest/e98d08de-8905-4602-82c6-b7a35fc0848b', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'ae9818' },
    body: JSON.stringify({
      sessionId: 'ae9818',
      runId: 'pre-fix',
      hypothesisId: 'H1',
      location: 'validate-widget-html.ts:validateWidgetHtmlExists',
      message: 'validated widget html existence',
      data: { widgetHtmlPath, existsAtWidgetPath },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  if (!existsAtWidgetPath) {
    throw new Error(
      `Widget HTML not found at ${widgetHtmlPath}. ` +
        'Run `pnpm build` to generate the widget bundle before starting the server.',
    );
  }
}
