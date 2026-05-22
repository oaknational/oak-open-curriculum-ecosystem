/**
 * Shared ESLint base configuration factory for graph-* workspaces.
 *
 * @remarks
 * Consolidates the ~95% identical flat-config shape across the three
 * `graph-*` workspaces (`graph-core`, `graph-ingest`, `graph-project`)
 * into a single composable factory. The workspace-differentiating
 * concerns — anchor directory, tsconfig project paths, and boundary
 * rules — are injected by the caller; everything else (global ignores,
 * strict config spread, language options, import resolver settings,
 * test-files block, config-file self-override block) is fixed here.
 *
 * Per the snagging-cycle code-expert and config-expert findings:
 *
 * - `thisDir` MUST come from the caller. Computing it here from
 *   `import.meta.url` would anchor `tsconfigRootDir` at
 *   `oak-eslint/src/configs/` instead of the consumer workspace root.
 * - `wsTsProject` and `configFileTsconfig` are both required; no
 *   defaults — defaults would hide the graph-core vs graph-{ingest,
 *   project} divergence in how they tsconfig-anchor `*.config.ts`
 *   files.
 * - Boundary rules are caller-supplied via the `boundaryRules` slot
 *   because graph-core consumes `coreBoundaryRules` (object) whereas
 *   graph-ingest and graph-project consume
 *   `createLibBoundaryRules(name)` (factory).
 *
 * @see packages/core/graph-core/eslint.config.ts
 * @see packages/libs/graph-ingest/eslint.config.ts
 * @see packages/libs/graph-project/eslint.config.ts
 */

import globals from 'globals';
import type { Linter } from 'eslint';
import type { TSESLint } from '@typescript-eslint/utils';

import { strict } from './strict.js';
// Module-graph cycle (base.ts ↔ ../index.js) is intentional and live-binding-safe:
// index.ts only re-exports from this file; this file only references the imports
// inside the factory function body. Do NOT add a module-level call here.
import {
  createImportResolverSettings,
  defineConfigArray,
  ignores as globalIgnores,
  testRules,
} from '../index.js';

export interface CreateGraphBaseConfigOptions {
  readonly thisDir: string;
  readonly wsTsProject: string;
  readonly boundaryRules: Partial<Linter.RulesRecord>;
  readonly configFileTsconfig: string;
}

/**
 * Builds the shared flat-config array for a `graph-*` workspace.
 *
 * @param options - Workspace-supplied anchors and boundary rules.
 * @param options.thisDir - The consumer workspace root directory
 *   (typically `dirname(fileURLToPath(import.meta.url))` at the
 *   consumer's `eslint.config.ts`). Anchors `tsconfigRootDir` for
 *   TypeScript-aware rules; MUST come from the caller to avoid
 *   misanchoring at `oak-eslint/src/configs/`.
 * @param options.wsTsProject - The resolved tsconfig project path for
 *   the workspace's lint (typically `tsconfig.lint.json`'s URL or
 *   path). Threaded into both `parserOptions.project` on the main
 *   block and the import resolver settings.
 * @param options.boundaryRules - The workspace-differentiating
 *   boundary rules — `coreBoundaryRules` for `graph-core`, the result
 *   of `createLibBoundaryRules(packageName)` for `graph-ingest` and
 *   `graph-project`. Scoped to `src/**\/*.ts` only; test and
 *   config-file blocks do not inherit these.
 * @param options.configFileTsconfig - The tsconfig path for the
 *   `eslint.config.ts` / `vitest.config.ts` / `tsup.config.ts`
 *   self-override block. `'./tsconfig.json'` for `graph-core`;
 *   `wsTsProject` for `graph-ingest` and `graph-project`.
 * @returns A `TSESLint.FlatConfig.ConfigArray` ready for use as the
 *   workspace `eslint.config.ts` default export.
 */
export function createGraphBaseConfig(
  options: CreateGraphBaseConfigOptions,
): TSESLint.FlatConfig.ConfigArray {
  const { thisDir, wsTsProject, boundaryRules, configFileTsconfig } = options;

  return defineConfigArray(
    {
      ignores: [...globalIgnores, 'dist/**', 'coverage/**', '*.log', '.turbo/**'],
    },
    strict,
    {
      files: ['**/*.ts'],
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.es2021,
        },
        parserOptions: {
          projectService: false,
          project: wsTsProject,
          tsconfigRootDir: thisDir,
        },
      },
      settings: createImportResolverSettings({ project: wsTsProject }),
    },
    {
      files: ['src/**/*.ts'],
      rules: {
        ...boundaryRules,
      },
    },
    {
      files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
      rules: testRules,
    },
    {
      files: ['eslint.config.ts', 'vitest.config.ts', 'tsup.config.ts'],
      languageOptions: {
        parserOptions: {
          project: configFileTsconfig,
          tsconfigRootDir: thisDir,
        },
      },
      rules: {
        'import-x/no-relative-packages': 'off',
        'import-x/no-relative-parent-imports': 'off',
      },
    },
  );
}
