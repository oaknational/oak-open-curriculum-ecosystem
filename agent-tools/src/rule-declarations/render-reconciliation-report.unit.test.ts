import { describe, expect, it } from 'vitest';

import { renderReconciliationReport } from './render-reconciliation-report.js';

describe('renderReconciliationReport', () => {
  it('says so when nothing was reconciled', () => {
    expect(renderReconciliationReport([])).toBe(
      'No reconciliations: every rule declaration was read from agreeing sources.\n',
    );
  });

  it('renders one markdown table row per reconciliation with both prior values', () => {
    expect(
      renderReconciliationReport([
        {
          rule: 'no-type-shortcuts',
          kind: 'core-with-scope-becomes-situational',
          indexClassification: 'core',
          indexTrigger: undefined,
          cursorAlwaysApply: undefined,
          cursorGlobs: ['**/*.ts', '**/*.tsx'],
          claudePaths: ['**/*.ts', '**/*.tsx'],
          outcome: 'situational; trigger surface:**/*.ts,**/*.tsx; globs kept',
        },
      ]),
    ).toBe(
      [
        '| Rule | Reconciliation | Index (classification, trigger) | Cursor (alwaysApply, globs) | Claude (paths) | Outcome |',
        '| ---- | -------------- | ------------------------------- | --------------------------- | -------------- | ------- |',
        '| `no-type-shortcuts` | core-with-scope-becomes-situational | core, — | absent, `**/*.ts,**/*.tsx` | `**/*.ts,**/*.tsx` | situational; trigger surface:**/*.ts,**/*.tsx; globs kept |',
        '',
      ].join('\n'),
    );
  });
});
