/**
 * The workspace-census subcommands. Each returns a process exit code;
 * failures arrive as Result errors from the gatherers and are written
 * to stderr here, at the process boundary. `check` validates the row
 * data AND recomputes every committed derived artefact (facts.json,
 * matrix.md) for parity, so nothing derived can drift while the gate
 * stays green.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

import { emptyRowsArtefact, readRowsArtefact, type RowsArtefact } from './artefact.js';
import { diffFactsParity, diffMatrixParity } from './check-parity.js';
import { compareStrings } from './compare.js';
import {
  deriveLiveSubjects,
  loadRowsArtefact,
  readLegacyMarkdown,
  type CommandContext,
} from './context.js';
import { computeDelta, parseLegacyMatrix, type DeltaResult } from './delta.js';
import { FACTS_PATH, gatherLiveFacts } from './facts-command.js';
import { MATRIX_PATH, renderMatrixString } from './render-command.js';
import { validateRows } from './rows.js';
import type { CensusSubject } from './subjects.js';

export async function runSubjects(context: CommandContext): Promise<number> {
  const subjects = await deriveLiveSubjects(context.repoRoot);
  if (!subjects.ok) {
    context.stderr.write(`workspace-census: ${subjects.error}\n`);
    return 1;
  }
  if (context.json) {
    context.stdout.write(`${JSON.stringify(subjects.value, null, 2)}\n`);
    return 0;
  }
  for (const subject of subjects.value) {
    const name = subject.publishedName ?? '(no published name)';
    context.stdout.write(`${subject.dirPath}\t${name}\t[${subject.sources.join(', ')}]\n`);
  }
  context.stdout.write(`total subjects: ${String(subjects.value.length)}\n`);
  return 0;
}

function mergeSkeletonRows(artefact: RowsArtefact, subjects: readonly CensusSubject[]): string[] {
  const existingDirs = new Set(artefact.rows.map((row) => row.dirPath));
  const added: string[] = [];
  for (const subject of subjects) {
    if (existingDirs.has(subject.dirPath)) {
      continue;
    }
    artefact.rows.push({
      dirPath: subject.dirPath,
      publishedName: subject.publishedName,
      disposition: 'pending',
    });
    added.push(subject.dirPath);
  }
  artefact.rows.sort((a, b) => compareStrings(a.dirPath, b.dirPath));
  return added;
}

export async function runSkeleton(context: CommandContext): Promise<number> {
  const subjects = await deriveLiveSubjects(context.repoRoot);
  if (!subjects.ok) {
    context.stderr.write(`workspace-census: ${subjects.error}\n`);
    return 1;
  }
  const rowsAbsolute = path.resolve(context.repoRoot, context.rowsPath);
  const readResult = await readRowsArtefact(rowsAbsolute);
  if (!readResult.ok) {
    context.stderr.write(`workspace-census: ${readResult.error}\n`);
    return 1;
  }
  const artefact = readResult.value ?? emptyRowsArtefact();
  const added = mergeSkeletonRows(artefact, subjects.value);

  await fs.mkdir(path.dirname(rowsAbsolute), { recursive: true });
  await fs.writeFile(rowsAbsolute, `${JSON.stringify(artefact, null, 2)}\n`, 'utf8');

  context.stdout.write(
    `skeleton: ${String(added.length)} row(s) added, ${String(artefact.rows.length)} total (${context.rowsPath})\n`,
  );
  for (const dirPath of added) {
    context.stdout.write(`  + ${dirPath}\n`);
  }
  return 0;
}

async function readCommitted(context: CommandContext, relPath: string): Promise<string | null> {
  try {
    return await fs.readFile(path.resolve(context.repoRoot, relPath), 'utf8');
  } catch {
    return null;
  }
}

async function factsParityProblems(context: CommandContext): Promise<string[]> {
  const liveFacts = await gatherLiveFacts(context);
  if (!liveFacts.ok) {
    return [liveFacts.error];
  }
  const committedFacts = await readCommitted(context, FACTS_PATH);
  if (committedFacts === null) {
    return [`${FACTS_PATH}: missing — run \`facts\``];
  }
  return diffFactsParity(liveFacts.value, committedFacts);
}

async function matrixParityProblems(
  context: CommandContext,
  rows: RowsArtefact['rows'],
): Promise<string[]> {
  const legacyMarkdown = await readLegacyMarkdown(context);
  if (!legacyMarkdown.ok) {
    return [legacyMarkdown.error];
  }
  const legacyRows = parseLegacyMatrix(legacyMarkdown.value);
  if (!legacyRows.ok) {
    return [legacyRows.error];
  }
  const delta = computeDelta({ legacyRows: legacyRows.value, rows });
  const problems = delta.danglingRenames.map(
    (dangling) =>
      `row ${dangling.dirPath}: renamedFrom "${dangling.renamedFrom}" matches no baseline row`,
  );
  const rendered = renderMatrixString({ rows, legacyCount: legacyRows.value.length, delta });
  const committedMatrix = await readCommitted(context, MATRIX_PATH);
  if (committedMatrix === null) {
    return [...problems, `${MATRIX_PATH}: missing — run \`render\``];
  }
  return [...problems, ...diffMatrixParity(rendered, committedMatrix)];
}

/** Parity problems for the committed derived artefacts (facts.json, matrix.md). */
async function gatherParityProblems(
  context: CommandContext,
  rows: RowsArtefact['rows'],
): Promise<string[]> {
  return [...(await factsParityProblems(context)), ...(await matrixParityProblems(context, rows))];
}

export async function runCheck(context: CommandContext): Promise<number> {
  const subjects = await deriveLiveSubjects(context.repoRoot);
  if (!subjects.ok) {
    context.stderr.write(`workspace-census: ${subjects.error}\n`);
    return 1;
  }
  const artefact = await loadRowsArtefact(context);
  if (!artefact.ok) {
    context.stderr.write(`workspace-census: ${artefact.error}\n`);
    return 1;
  }
  const rowResult = validateRows({ subjects: subjects.value, rows: artefact.value.rows });
  const parityProblems = await gatherParityProblems(context, artefact.value.rows);
  const problems = [...rowResult.problems, ...parityProblems];
  if (problems.length === 0) {
    context.stdout.write(
      `workspace-census check: PASS (${String(subjects.value.length)} subjects; rows, facts, and matrix all recomputed clean)\n`,
    );
    return 0;
  }
  context.stderr.write(`workspace-census check: FAIL — ${String(problems.length)} problem(s)\n`);
  for (const problem of problems) {
    context.stderr.write(`  - ${problem}\n`);
  }
  return 1;
}

function renderDeltaText(legacyCount: number, delta: DeltaResult): string {
  const orNone = (parts: readonly string[]): string =>
    parts.length === 0 ? '(none)' : parts.join(', ');
  const changed = delta.changed.map((row) => `${row.dirPath} (${row.from} -> ${row.to})`);
  const renamed = delta.renamed.map((row) => `${row.fromDirPath} -> ${row.toDirPath}`);
  const dangling = delta.danglingRenames.map((row) => `${row.dirPath} (from ${row.renamedFrom})`);
  return [
    `legacy rows: ${String(legacyCount)}`,
    `appeared:    ${orNone(delta.appeared.map((row) => row.dirPath))}`,
    `disappeared: ${orNone(delta.disappeared.map((row) => row.dirPath))}`,
    `changed:     ${orNone(changed)}`,
    `renamed:     ${orNone(renamed)}`,
    `dangling:    ${orNone(dangling)}`,
    '',
  ].join('\n');
}

export async function runDelta(context: CommandContext): Promise<number> {
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
  if (context.json) {
    context.stdout.write(`${JSON.stringify(delta, null, 2)}\n`);
    return 0;
  }
  context.stdout.write(renderDeltaText(legacyRows.value.length, delta));
  return 0;
}
