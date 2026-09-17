/**
 * Stryker mutation-testing config for `@oaknational/type-helpers` — the
 * first mutation-testing canary
 * (`.agent/plans/delivery/mutation-testing-core-canary.plan.md`).
 *
 * Report-only: `thresholds.break` stays `null`. Nothing here gates CI,
 * `pnpm check`, or any other quality gate — see the plan's "Design
 * constraint" and "Out of scope" sections.
 *
 * Why `.mjs`: Stryker auto-discovers only `json|js|mjs|cjs` config
 * filenames (first-hand source read of `@stryker-mutator/core`'s
 * `config-file-formats.ts`, banked in `mutation-evidence/mechanics-report.md`),
 * so a bare `stryker run` finds this file with no positional argument. A
 * `.ts` config is never auto-discovered and falls inside this workspace's
 * `tsconfig.lint.json` `*.config.ts` include, dragging a runtime-less
 * type import into type-check. This format avoids both; typing is
 * preserved via the JSDoc annotation below, backed by the
 * `@stryker-mutator/api` devDependency this workspace declares.
 *
 * `buildCommand` (the reference `stryker.config.base.ts` at the repo root
 * sets `'pnpm build'`) is deliberately NOT inherited. The
 * `@stryker-mutator/vitest-runner` runs Vitest directly against TypeScript
 * source, so a repository build before the initial test run duplicates
 * compile work the test runner already does. `mutation-evidence/dry-run.log.txt`
 * records the observed dry run without it (dry-run-scoped evidence; the
 * full-run evidence is `mutation-evidence/run.log.txt`).
 *
 * `vitest.configFile` points at the workspace's REAL `vitest.config.ts`.
 * It once pointed at a self-contained duplicate
 * (`vitest.stryker.config.ts`, now deleted): the real config used to
 * import a repo-root shared base that could not resolve inside Stryker's
 * per-workspace sandbox (`mutation-evidence/mechanics-report.md`
 * §"Obstacle 1" records the reproduced failure; `dry-run.log.txt` holds
 * the later successful duplicate-config dry run). The workspace-config isolation landing made the
 * real config import `@oaknational/workspace-config/vitest`, which
 * resolves through the sandbox's symlinked `node_modules` —
 * `mutation-evidence/run-real-config.log.txt` banks the re-run proving
 * config load and a completed pass against the real config.
 *
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
const config = {
  packageManager: 'pnpm',
  testRunner: 'vitest',
  plugins: ['@stryker-mutator/vitest-runner'],
  coverageAnalysis: 'perTest',
  vitest: { configFile: 'vitest.config.ts' },

  // Production mutation surface: authored source only. Test files are
  // excluded by extension; `dist/` is build output and is never under
  // `src/`, so it is structurally out of this glob already.
  mutate: ['src/**/*.ts', '!src/**/*.test.ts'],

  // Explicit unit + integration test selection per the Oak test-scope
  // contract (unit/integration/E2E). E2E tests must never enter a
  // mutation run — the brace set has no `e2e` member. One braced glob
  // rather than two patterns: a separate per-category pattern warns when
  // its category has no files yet (this workspace is unit-only today),
  // and mutation runs are warning-free by rule.
  testFiles: ['src/**/*.{unit,integration}.test.ts'],

  // A bad glob must fail loudly, never report a false "success".
  allowEmpty: false,

  reporters: ['html', 'clear-text', 'progress', 'json'],
  htmlReporter: { fileName: 'mutation-evidence/report.html' },
  jsonReporter: { fileName: 'mutation-evidence/report.json' },

  // Mutation score is evidence, never a gate (owner doctrine, plan
  // "Design constraint"). No threshold breaks the command.
  thresholds: { break: null },
};

export default config;
