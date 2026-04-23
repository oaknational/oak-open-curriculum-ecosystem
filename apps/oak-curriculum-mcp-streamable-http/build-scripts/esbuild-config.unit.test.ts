/**
 * §L-8 WS1 RED — canonical esbuild build options for the MCP HTTP app.
 *
 * @remarks
 * Proves the Oak-owned build-contract invariants currently encoded by
 * `tsup.config.base.ts → createAppConfig(...)` and `tsup.config.ts`.
 * These invariants are what consumers (the MCP runtime, the deploy
 * pipeline, the Sentry plugin) rely on; preserving them across the
 * tsup → raw esbuild swap is the actual subject under test.
 *
 * Two deliberate divergences from the tsup baseline are asserted as
 * the new contract (NOT the legacy tsup shape):
 *
 * - `sourcemap: 'external'` (tsup baseline: `sourcemap: true`) —
 *   canonical esbuild value for the Sentry "hidden source-map" posture:
 *   `.map` files land on disk for plugin upload but the emitted `.js`
 *   omits the `sourceMappingURL` comment so leaked artefacts cannot
 *   trivially leak source. (Sentry docs use the word "hidden", which
 *   maps to esbuild's `'external'` mode — esbuild's API does not have a
 *   `'hidden'` value.)
 * - `packages: 'external'` (tsup baseline: `external: [/node_modules/]`)
 *   — canonical esbuild idiom; tsup's regex form is its own translator
 *   for the same intent.
 *
 * Replaces the `build-output-equivalence.integration.test.ts` originally
 * specified in §L-8 WS1.2 — see plan body §L-8 WS1 and the 2026-04-21
 * napkin entry for the intent-review-driven simplification.
 */

import { describe, expect, it } from 'vitest';
import { createMcpEsbuildOptions } from './esbuild-config.js';

describe('createMcpEsbuildOptions — Oak-owned build contract', () => {
  it('declares the three entry points: index, application, and server', () => {
    const options = createMcpEsbuildOptions();
    expect(options.entryPoints).toEqual({
      index: 'src/index.ts',
      application: 'src/application.ts',
      server: 'src/server.ts',
    });
  });

  it('targets node platform', () => {
    const options = createMcpEsbuildOptions();
    expect(options.platform).toBe('node');
  });

  it('emits ESM modules', () => {
    const options = createMcpEsbuildOptions();
    expect(options.format).toBe('esm');
  });

  it('compiles to es2022 language target', () => {
    const options = createMcpEsbuildOptions();
    expect(options.target).toBe('es2022');
  });

  it('bundles app code', () => {
    const options = createMcpEsbuildOptions();
    expect(options.bundle).toBe(true);
  });

  it('externalises every bare-import package (canonical esbuild equivalent of tsup external: [/node_modules/])', () => {
    const options = createMcpEsbuildOptions();
    expect(options.packages).toBe('external');
  });

  it('writes to dist/', () => {
    const options = createMcpEsbuildOptions();
    expect(options.outdir).toBe('dist');
  });
});

describe('createMcpEsbuildOptions — Sentry hidden-source-map posture (deliberate divergence from tsup)', () => {
  it('emits sourcemaps in external mode (esbuild equivalent of Sentry "hidden": .map written, no sourceMappingURL comment in .js)', () => {
    const options = createMcpEsbuildOptions();
    expect(options.sourcemap).toBe('external');
  });
});
