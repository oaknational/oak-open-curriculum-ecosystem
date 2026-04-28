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

/** Local/importable artefacts that do not define the Vercel deploy boundary. */
export const MCP_SUPPORT_ENTRY_POINTS = {
  index: 'src/index.ts',
  application: 'src/application.ts',
} satisfies Readonly<Record<'index' | 'application', string>>;

/** The single deploy-boundary artefact that Vercel imports at runtime. */
export const MCP_DEPLOY_ENTRY_POINTS = {
  server: 'src/server.ts',
} satisfies Readonly<Record<'server', string>>;

const MCP_ALL_ENTRY_POINTS = {
  ...MCP_SUPPORT_ENTRY_POINTS,
  ...MCP_DEPLOY_ENTRY_POINTS,
} satisfies Readonly<Record<'index' | 'application' | 'server', string>>;

/**
 * Return the canonical esbuild build options for the MCP HTTP app.
 *
 * @remarks Behaviour proven by `esbuild-config.unit.test.ts`.
 *
 * Pass an entry-point subset when the build consumer needs only one build
 * surface. The composition root uses this to keep the Sentry plugin scoped to
 * the deploy artefact (`server`) while still emitting the local/importable
 * support artefacts (`index`, `application`) in the same `dist/` directory.
 */
export function createMcpEsbuildOptions(
  entryPoints: Readonly<Record<string, string>> = MCP_ALL_ENTRY_POINTS,
): BuildOptions {
  return {
    entryPoints: { ...entryPoints },
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'es2022',
    sourcemap: 'external',
    packages: 'external',
    outdir: 'dist',
  };
}
