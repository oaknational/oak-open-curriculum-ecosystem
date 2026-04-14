/**
 * Composable tsup base configuration.
 *
 * @remarks
 * Three factory functions eliminate shared-default duplication across all
 * workspace tsup configs. Each workspace config becomes a 2-5 line import.
 *
 * - {@link createLibConfig} — libraries (core + libs, `bundle: true`)
 * - {@link createSdkConfig} — SDKs (`bundle: false`, `platform: 'neutral'`)
 * - {@link createAppConfig} — apps (`external: [/node_modules/]`)
 *
 * See ADR-010 (revised 2026-04-14) for the decision record.
 *
 * @packageDocumentation
 */

import { defineConfig, type Options } from 'tsup';

/** Shared defaults applied to every workspace build. */
const SHARED_DEFAULTS = {
  format: ['esm'],
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
  splitting: false,
  dts: false,
  tsconfig: './tsconfig.build.json',
  ignoreWatch: ['**/*.test.ts', '**/*.spec.ts'],
  outDir: 'dist',
} as const satisfies Partial<Options>;

/** Override options for {@link createLibConfig}. */
interface LibConfigOverrides {
  /** Dependencies to exclude from the bundle. */
  readonly external?: string[];
  /** Custom entry points (default: `['src/index.ts']`). */
  readonly entry?: Record<string, string> | string[];
  /** Emit `.d.ts` declaration files (default: `false`). */
  readonly dts?: boolean;
  /** Compilation target (default: `'es2022'`). */
  readonly target?: string;
}

/**
 * Create a tsup config for a library package.
 *
 * @remarks Covers `packages/core/*` and `packages/libs/*` workspaces.
 * Libraries bundle dependencies by default (`bundle: true`).
 *
 * @example
 * ```typescript
 * // Simple lib — no overrides
 * export default createLibConfig();
 *
 * // Lib with externals
 * export default createLibConfig({ external: ['@sentry/node'] });
 *
 * // Multi-entry lib
 * export default createLibConfig({
 *   entry: { index: 'src/index.ts', node: 'src/node.ts' },
 *   external: ['node:fs', 'node:path'],
 * });
 * ```
 */
export function createLibConfig(overrides?: LibConfigOverrides) {
  return defineConfig({
    ...SHARED_DEFAULTS,
    entry: overrides?.entry ?? ['src/index.ts'],
    target: overrides?.target ?? 'es2022',
    bundle: true,
    ...(overrides?.dts !== undefined && { dts: overrides.dts }),
    ...(overrides?.external && { external: overrides.external }),
  });
}

/** Override options for {@link createSdkConfig}. */
interface SdkConfigOverrides {
  /** Dependencies to exclude from the build output. */
  readonly external?: string[];
  /** Compilation target (default: `'node22'`). */
  readonly target?: string;
}

/**
 * Create a tsup config for an SDK package.
 *
 * @remarks Covers `packages/sdks/*` workspaces. SDKs are unbundled
 * (`bundle: false`, `platform: 'neutral'`) and include the
 * `ensure-js-extensions` esbuild plugin.
 *
 * @param entries - Entry point patterns (each SDK has a unique layout).
 *
 * @example
 * ```typescript
 * export default createSdkConfig(
 *   ['src/**\/*.ts', '!src/**\/*.test.ts'],
 *   { external: ['zod'] },
 * );
 * ```
 */
export function createSdkConfig(
  entries: string[] | Record<string, string>,
  overrides?: SdkConfigOverrides,
) {
  return defineConfig({
    ...SHARED_DEFAULTS,
    entry: entries,
    target: overrides?.target ?? 'node22',
    bundle: false,
    platform: 'neutral',
    ...(overrides?.external && { external: overrides.external }),
    esbuildOptions(options) {
      options.plugins = options.plugins ?? [];
      options.plugins.push({
        name: 'ensure-js-extensions',
        setup(build) {
          build.onResolve({ filter: /^\./ }, (args) => {
            if (args.path.endsWith('.js') || args.path.endsWith('.json')) {
              return null;
            }
            return { path: `${args.path}.js` };
          });
        },
      });
    },
  });
}

/** Override options for {@link createAppConfig}. */
interface AppConfigOverrides {
  /** JS banner (e.g. shebang for CLI apps). */
  readonly banner?: { readonly js: string };
  /** Compilation target (default: `'es2022'`). */
  readonly target?: string;
}

/**
 * Create a tsup config for an application.
 *
 * @remarks Covers `apps/*` workspaces. Apps bundle their own code but
 * exclude all `node_modules` (`external: [/node_modules/]`).
 *
 * @param entries - Application entry points.
 *
 * @example
 * ```typescript
 * // HTTP server
 * export default createAppConfig({
 *   index: 'src/index.ts',
 *   application: 'src/application.ts',
 * });
 *
 * // CLI with shebang
 * export default createAppConfig(
 *   { 'bin/oaksearch': 'bin/oaksearch.ts' },
 *   { banner: { js: '#!/usr/bin/env node' }, target: 'node22' },
 * );
 * ```
 */
export function createAppConfig(entries: Record<string, string>, overrides?: AppConfigOverrides) {
  return defineConfig({
    ...SHARED_DEFAULTS,
    entry: entries,
    target: overrides?.target ?? 'es2022',
    bundle: true,
    external: [/node_modules/],
    ...(overrides?.banner && { banner: overrides.banner }),
  });
}
