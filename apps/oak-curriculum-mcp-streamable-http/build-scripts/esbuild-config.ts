/**
 * Canonical esbuild build options for the MCP HTTP app.
 *
 * @remarks
 * Pure factory returning the Oak-owned build contract that
 * `apps/oak-curriculum-mcp-streamable-http` ships. Does NOT include the
 * Sentry plugin — the composition root (`esbuild.config.ts`) combines
 * this output with {@link createSentryBuildPlugin}'s intent and only
 * then calls `esbuild.build`. Keeping the two factories separate
 * preserves the principle that policy (env-driven) and contract
 * (Oak-owned) are independent concerns.
 *
 * Build-contract invariants previously encoded by
 * `tsup.config.base.ts → createAppConfig(...)` and the app's
 * `tsup.config.ts`. Both files are deleted by this lane (§L-8 WS2.3);
 * `tsup.config.base.ts` survives at the repo root for other apps and
 * libraries that have not migrated to esbuild.
 *
 * Deliberate divergence from the tsup baseline:
 *
 * - `sourcemap: 'external'` (was `sourcemap: true`) — esbuild's value
 *   for the Sentry "hidden source-map" posture: `.map` files land on
 *   disk for plugin upload but the emitted `.js` omits the
 *   `sourceMappingURL` comment so leaked artefacts cannot trivially
 *   leak source. (Sentry docs name this posture "hidden"; esbuild's API
 *   does not have a `'hidden'` value — `'external'` is the equivalent.)
 * - `packages: 'external'` (was `external: [/node_modules/]`) — canonical
 *   esbuild idiom for "bundle app code, externalise every bare import";
 *   functionally equivalent for normal app code but uses the supported
 *   first-party flag rather than tsup's regex-external translator.
 *
 * @packageDocumentation
 */

import type { BuildOptions } from 'esbuild';

/**
 * Return the canonical esbuild build options for the MCP HTTP app.
 *
 * @remarks Behaviour proven by `esbuild-config.unit.test.ts`.
 */
export function createMcpEsbuildOptions(): BuildOptions {
  return {
    entryPoints: {
      index: 'src/index.ts',
      application: 'src/application.ts',
    },
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'es2022',
    sourcemap: 'external',
    packages: 'external',
    outdir: 'dist',
  };
}
