import { defineConfig } from 'vitest/config';

/**
 * Field-integrity test suite — explicit file list (not a glob).
 *
 * @remarks
 * The semantic-search field-integrity invariant requires that the suite is
 * pinned to a specific set of integration and unit tests, so adding or
 * removing a test from this set is a deliberate, git-reviewable change. A
 * manifest file used to live at
 * `.agent/plans/semantic-search/archive/completed/field-integrity-test-manifest.json`
 * and was consumed by a wrapper script (`scripts/run-field-integrity-tests.ts`)
 * that validated it and then invoked vitest with the file list as positional
 * arguments. That indirection bypassed the testing-strategy directive's
 * principle that tests run directly under vitest, and was flagged by both
 * Sonar (security hotspot S4036, code smell S7786) and the testing-strategy
 * directive itself.
 *
 * The manifest is now this config file's `include` array. The constraint is
 * preserved (explicit list, no globs) and the indirection is removed: the
 * test:field-integrity npm script invokes vitest directly against this
 * config.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: false,
    isolate: true,
    pool: 'forks',
    include: [
      'packages/libs/search-contracts/src/field-inventory.integration.test.ts',
      'apps/oak-search-cli/src/lib/indexing/task-0.0-gap-ledger.integration.test.ts',
      'apps/oak-search-cli/src/lib/indexing/stage-contract-matrix.integration.test.ts',
      'apps/oak-search-cli/src/adapters/extraction-field-integrity.integration.test.ts',
      'apps/oak-search-cli/src/lib/indexing/builder-field-integrity.integration.test.ts',
      'apps/oak-search-cli/src/lib/indexing/bulk-ops-field-integrity.integration.test.ts',
      'apps/oak-search-cli/src/lib/indexing/cross-stage-field-integrity.integration.test.ts',
      'packages/sdks/oak-search-sdk/src/retrieval/search-field-integrity.integration.test.ts',
      'packages/sdks/oak-search-sdk/src/retrieval/search-field-integrity.unit.test.ts',
      'apps/oak-search-cli/src/lib/indexing/field-readback-audit-parse-ledger.integration.test.ts',
      'apps/oak-search-cli/src/lib/indexing/field-readback-audit-retry.unit.test.ts',
      'apps/oak-search-cli/src/lib/indexing/readback-field-audit.integration.test.ts',
    ],
    exclude: ['node_modules', 'dist', '**/*.e2e.test.ts'],
  },
});
