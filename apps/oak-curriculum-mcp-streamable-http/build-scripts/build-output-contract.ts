/**
 * Build-output guardrails for the deployed MCP HTTP artefacts.
 *
 * @remarks
 * These checks codify the repaired Vercel deploy boundary:
 *
 * - esbuild warnings are blocking failures, not advisory output;
 * - the deployed `dist/server.js` artefact must default-export a function
 *   that satisfies the verified `@vercel/node` import contract.
 *
 * The esbuild composition root calls these guards immediately after writing
 * the bundle so the next entry-shape regression fails at build time rather
 * than after a preview deploy boots.
 *
 * @packageDocumentation
 */

import type { PartialMessage } from 'esbuild';

const INVALID_VERCEL_EXPORT_MESSAGE =
  'dist/server.js must default-export a function that satisfies the verified @vercel/node import contract.';

/**
 * Fail the build when esbuild emitted any warnings.
 *
 * @remarks
 * Warnings are surfaced as a deterministic error message so the build log
 * names the exact contract violation that must be fixed before deploy.
 */
export function assertNoEsbuildWarnings(warnings: readonly Pick<PartialMessage, 'text'>[]): void {
  if (warnings.length === 0) {
    return;
  }

  throw new Error(
    ['Esbuild emitted warnings:', ...warnings.map((warning) => `- ${warning.text}`)].join('\n'),
  );
}

/**
 * Fail when the built deploy entry does not default-export a function.
 *
 * @remarks
 * `@vercel/node` accepts several shapes after unwrapping default exports, but
 * the repo-owned deploy artefact contract for this workspace is explicit:
 * `dist/server.js` must default-export a function.
 */
export function assertVercelDefaultExportFunction(moduleNamespace: {
  readonly default?: unknown;
}): void {
  if (typeof moduleNamespace.default !== 'function') {
    throw new Error(INVALID_VERCEL_EXPORT_MESSAGE);
  }
}
