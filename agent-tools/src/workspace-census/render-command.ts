/**
 * The `render` subcommand: generate the human-facing census matrix
 * (matrix.md) FROM the structured rows artefact plus the computed
 * delta, so the readable table is constructively derived from the data
 * the instrument validates — never hand-maintained prose. The pure
 * renderer is exported so `check` can recompute and compare the
 * committed matrix (validators-must-recompute).
 */
import fs from 'node:fs/promises';
import path from 'node:path';

import { computeDelta, parseLegacyMatrix, type DeltaResult } from './delta.js';
import { loadRowsArtefact, readLegacyMarkdown, type CommandContext } from './context.js';
import type { CensusRow } from './rows.js';

export const MATRIX_PATH = '.agent/reports/workspace-classification-census/matrix.md';

function cell(value: string): string {
  return value.replaceAll('|', String.raw`\|`).replaceAll('\n', ' ');
}

function leakageSummary(row: CensusRow): string {
  const instances = row.leakage ?? [];
  if (instances.length === 0) {
    return 'none found';
  }
  return instances.map((instance) => `${instance.type} (${instance.depth})`).join('; ');
}

function classifiedTable(rows: readonly CensusRow[]): string {
  const header = [
    '| Subject (dir) | Published name | Classification | Leakage (type, depth) | Target state | Tranche | Licence |',
    '|---|---|---|---|---|---|---|',
  ];
  const body = rows.map((row) =>
    [
      `| \`${row.dirPath}\``,
      row.publishedName === null ? '—' : `\`${row.publishedName}\``,
      `**${String(row.classification)}**`,
      cell(leakageSummary(row)),
      cell(row.targetState ?? ''),
      row.tranche ?? '',
      (row.licence ?? []).join(' + '),
      '',
    ].join(' | '),
  );
  return [...header, ...body].join('\n');
}

function slicesSection(rows: readonly CensusRow[]): string {
  const mixed = rows.filter((row) => row.classification === 'mixed');
  return mixed.map((row) => `- \`${row.dirPath}\` — ${cell(row.thinnestSlice ?? '')}`).join('\n');
}

function reasonsTable(
  rows: readonly CensusRow[],
  header: string,
  reasonOf: (row: CensusRow) => string | undefined,
): string {
  const head = [`| Subject (dir) | ${header} |`, '|---|---|'];
  const body = rows.map((row) => `| \`${row.dirPath}\` | ${cell(reasonOf(row) ?? '')} |`);
  return [...head, ...body].join('\n');
}

function deltaLists(delta: DeltaResult): string[] {
  const changed = delta.changed.map(
    (entry) => `- \`${entry.dirPath}\`: ${entry.from} → ${entry.to}`,
  );
  const appeared = delta.appeared.map((entry) => `- \`${entry.dirPath}\``);
  const disappeared = delta.disappeared.map((entry) => `- \`${entry.dirPath}\``);
  const renamed = delta.renamed.map(
    (entry) => `- \`${entry.fromDirPath}\` → \`${entry.toDirPath}\``,
  );
  const dangling = delta.danglingRenames.map(
    (entry) => `- \`${entry.dirPath}\` declares \`${entry.renamedFrom}\` (no such baseline row)`,
  );
  return [
    `**Classification changed (${String(changed.length)}):**`,
    ...(changed.length > 0 ? changed : ['- (none)']),
    '',
    `**Appeared since 2026-04-28 (${String(appeared.length)}):**`,
    ...(appeared.length > 0 ? appeared : ['- (none)']),
    '',
    `**Disappeared since 2026-04-28 (${String(disappeared.length)}):**`,
    ...(disappeared.length > 0 ? disappeared : ['- (none)']),
    '',
    `**Renamed (${String(renamed.length)}):**`,
    ...(renamed.length > 0 ? renamed : ['- (none)']),
    '',
    `**Declared renames with no matching baseline row (${String(dangling.length)}) — validation problems:**`,
    ...(dangling.length > 0 ? dangling : ['- (none)']),
  ];
}

function deltaSection(legacyCount: number, delta: DeltaResult): string {
  return [
    `The 2026-04-28 matrix carried ${String(legacyCount)} rows. This census supersedes it; the delta is keyed on directory path over EVERY subject row (renames are declared on rows and read as renames, never as disappear-plus-appear).`,
    '',
    ...deltaLists(delta),
  ].join('\n');
}

export interface RenderMatrixInput {
  readonly rows: readonly CensusRow[];
  readonly legacyCount: number;
  readonly delta: DeltaResult;
}

/** Render matrix.md content from row data — pure and recomputable. */
export function renderMatrixString(input: RenderMatrixInput): string {
  const { rows, legacyCount, delta } = input;
  const classified = rows.filter((row) => row.disposition === 'classified');
  const excluded = rows.filter((row) => row.disposition === 'excluded');
  const falsifier = rows.filter((row) => row.disposition === 'needs-construct-evidence');
  const counts = {
    generic: classified.filter((row) => row.classification === 'generic-foundation').length,
    mixed: classified.filter((row) => row.classification === 'mixed').length,
    leaf: classified.filter((row) => row.classification === 'oak-leaf').length,
  };
  return [
    '# Workspace classification census — matrix',
    '',
    '**GENERATED FILE — do not hand-edit.** Rendered from `rows.json` by',
    "`pnpm agent-tools:workspace-census -- render`; the same instrument's `check`",
    'validates the row data (coverage, closed vocabularies, two distinct evidence',
    'kinds per judged row) and recomputes this rendering for parity. Evidence',
    'pointers live in `rows.json`; detector facts in `facts.json`. Governing record:',
    '`.agent/plans/delivery/workspace-classification-census.plan.md`.',
    '',
    `Subjects: ${String(rows.length)} (${String(classified.length)} classified — ${String(counts.generic)} generic-foundation, ${String(counts.mixed)} mixed, ${String(counts.leaf)} oak-leaf; ${String(excluded.length)} recorded exclusions; ${String(falsifier.length)} needs-construct-evidence).`,
    '',
    '## Classification matrix',
    '',
    classifiedTable(classified),
    '',
    '## Thinnest-Oak-slice dispositions (mixed rows only)',
    '',
    slicesSection(classified),
    '',
    '## Recorded exclusions',
    '',
    reasonsTable(excluded, 'Recorded exclusion', (row) => row.exclusionReason),
    '',
    '## Falsifier rows (needs-construct-evidence)',
    '',
    falsifier.length === 0
      ? 'None — every judged row reached two distinct evidence kinds from the named instrument set; the recorded falsifier never fired.'
      : reasonsTable(falsifier, 'Recorded falsifier reason', (row) => row.falsifierReason),
    '',
    '## Delta against the 2026-04-28 matrix (superseded)',
    '',
    deltaSection(legacyCount, delta),
    '',
  ].join('\n');
}

export async function runRender(context: CommandContext): Promise<number> {
  const artefact = await loadRowsArtefact(context);
  if (!artefact.ok) {
    context.stderr.write(`workspace-census: ${artefact.error}\n`);
    return 1;
  }
  const legacyMarkdown = await readLegacyMarkdown(context);
  if (!legacyMarkdown.ok) {
    context.stderr.write(`workspace-census: ${legacyMarkdown.error}\n`);
    return 1;
  }
  const legacyRows = parseLegacyMatrix(legacyMarkdown.value);
  if (!legacyRows.ok) {
    context.stderr.write(`workspace-census: ${legacyRows.error}\n`);
    return 1;
  }
  const delta = computeDelta({ legacyRows: legacyRows.value, rows: artefact.value.rows });
  const outPath = path.resolve(context.repoRoot, MATRIX_PATH);
  await fs.writeFile(
    outPath,
    renderMatrixString({
      rows: artefact.value.rows,
      legacyCount: legacyRows.value.length,
      delta,
    }),
    'utf8',
  );
  context.stdout.write(`render: matrix written (${MATRIX_PATH})\n`);
  return 0;
}
