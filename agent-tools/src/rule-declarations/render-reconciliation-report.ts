/**
 * Render the reconciliations of a sweep as a markdown table for the pull request that lands
 * it, one row per reconciliation with both prior values (Director ruling, 2026-09-13: every
 * reconciled rule is listed, never silent).
 *
 * @packageDocumentation
 */

import type { Reconciliation } from './reconcile-rule-declaration.js';

const HEADER = [
  '| Rule | Reconciliation | Index (classification, trigger) | Cursor (alwaysApply, globs) | Claude (paths) | Outcome |',
  '| ---- | -------------- | ------------------------------- | --------------------------- | -------------- | ------- |',
];

const NONE = '—';

/**
 * Render the report.
 *
 * @param reconciliations - The reconciliations a sweep made.
 * @returns Markdown: one sentence when there were none, otherwise a table.
 */
export function renderReconciliationReport(reconciliations: readonly Reconciliation[]): string {
  if (reconciliations.length === 0) {
    return 'No reconciliations: every rule declaration was read from agreeing sources.\n';
  }
  const rows = reconciliations.map(renderRow);
  return `${[...HEADER, ...rows].join('\n')}\n`;
}

function renderRow(entry: Reconciliation): string {
  const cells = [
    `\`${entry.rule}\``,
    entry.kind,
    `${entry.indexClassification}, ${entry.indexTrigger ?? NONE}`,
    `${renderAlwaysApply(entry.cursorAlwaysApply)}, ${renderList(entry.cursorGlobs)}`,
    renderList(entry.claudePaths),
    entry.outcome,
  ];
  return `| ${cells.join(' | ')} |`;
}

function renderAlwaysApply(value: boolean | undefined): string {
  return value === undefined ? 'absent' : String(value);
}

function renderList(members: readonly string[]): string {
  return members.length === 0 ? NONE : `\`${members.join(',')}\``;
}
