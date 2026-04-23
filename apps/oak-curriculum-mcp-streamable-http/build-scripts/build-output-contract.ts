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

function escapeForRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasInlineDefaultFunctionExport(bundleSource: string): boolean {
  return (
    /export\s+default\s+(?:async\s+)?function\b/m.test(bundleSource) ||
    /export\s+default\s+(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/m.test(bundleSource)
  );
}

function findDefaultExportBinding(bundleSource: string): string | null {
  const reExportMatch = bundleSource.match(
    /export\s*\{[^}]*?\b([A-Za-z_$][\w$]*)\s+as\s+default\b[^}]*\}/m,
  );
  if (reExportMatch?.[1]) {
    return reExportMatch[1];
  }

  const directExportMatch = bundleSource.match(/export\s+default\s+([A-Za-z_$][\w$]*)\s*;/m);
  return directExportMatch?.[1] ?? null;
}

function isFunctionBinding(
  bundleSource: string,
  identifier: string,
  seen: Set<string> = new Set<string>(),
): boolean {
  if (seen.has(identifier)) {
    return false;
  }
  seen.add(identifier);

  const escapedIdentifier = escapeForRegExp(identifier);
  const declarationPatterns = [
    new RegExp(
      `(?:^|\\n)\\s*(?:export\\s+)?(?:async\\s+)?function\\s+${escapedIdentifier}\\b`,
      'm',
    ),
    new RegExp(
      `(?:^|\\n)\\s*(?:const|let|var)\\s+${escapedIdentifier}\\s*=\\s*(?:async\\s+)?function\\b`,
      'm',
    ),
    new RegExp(
      `(?:^|\\n)\\s*(?:const|let|var)\\s+${escapedIdentifier}\\s*=\\s*(?:async\\s*)?(?:\\([^)]*\\)|[A-Za-z_$][\\w$]*)\\s*=>`,
      'm',
    ),
  ] satisfies readonly RegExp[];

  if (declarationPatterns.some((pattern) => pattern.test(bundleSource))) {
    return true;
  }

  const aliasPattern = new RegExp(
    `(?:^|\\n)\\s*(?:const|let|var)\\s+${escapedIdentifier}\\s*=\\s*([A-Za-z_$][\\w$]*)\\s*;`,
    'm',
  );
  const aliasMatch = bundleSource.match(aliasPattern);
  if (!aliasMatch?.[1]) {
    return false;
  }

  return isFunctionBinding(bundleSource, aliasMatch[1], seen);
}

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
 * Fail when the built deploy entry does not default-export the deploy handler.
 *
 * @remarks
 * The source-level function proof lives in `src/server.unit.test.ts`. This
 * guard checks the emitted artefact shape after bundling so the build still
 * fails if `dist/server.js` loses its default export at the deploy boundary.
 */
export function assertBuiltServerDefaultExport(bundleSource: string): void {
  if (hasInlineDefaultFunctionExport(bundleSource)) {
    return;
  }

  const binding = findDefaultExportBinding(bundleSource);
  if (binding !== null && isFunctionBinding(bundleSource, binding)) {
    return;
  }

  throw new Error(INVALID_VERCEL_EXPORT_MESSAGE);
}
