/**
 * The 2026-04-28 baseline parser and the delta derivation, keyed on
 * directory path so renames read as renames, never as a disappearance
 * plus an appearance.
 */
import { err, ok, type Result } from '@oaknational/result';

import type { CensusRow } from './rows.js';
import type { Classification } from './vocabulary.js';

export interface LegacyRow {
  readonly dirPath: string;
  readonly classification: Classification;
}

const LEGACY_CLASSIFICATION_MAP: Readonly<Record<string, Classification>> = {
  generic: 'generic-foundation',
  mixed: 'mixed',
  'oak-leaf': 'oak-leaf',
};

/**
 * Parse the 2026-04-28 matrix table (the surface-isolation brief) into
 * rows keyed on directory path, mapping the legacy `generic` label onto
 * `generic-foundation`. Mechanical extraction from the pipe table —
 * backticked first column, classification in the second. A matched row
 * whose label is outside the legacy vocabulary is a PARSE ERROR: a
 * silently dropped baseline row would fake a delta.
 */
export function parseLegacyMatrix(markdown: string): Result<LegacyRow[], string> {
  const rows: LegacyRow[] = [];
  for (const line of markdown.split('\n')) {
    const match = /^\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|/.exec(line);
    if (!match) {
      continue;
    }
    const [, dirPath, legacyLabel] = match;
    if (dirPath === undefined || legacyLabel === undefined) {
      continue;
    }
    const classification = LEGACY_CLASSIFICATION_MAP[legacyLabel];
    if (classification === undefined) {
      return err(
        `legacy matrix: unrecognised classification label "${legacyLabel}" on \`${dirPath}\` — the baseline document cannot be interpreted`,
      );
    }
    rows.push({ dirPath, classification });
  }
  return ok(rows);
}

export interface DeltaInput {
  readonly legacyRows: readonly LegacyRow[];
  readonly rows: readonly CensusRow[];
}

export interface DeltaResult {
  readonly appeared: readonly { readonly dirPath: string }[];
  readonly disappeared: readonly { readonly dirPath: string }[];
  readonly changed: readonly {
    readonly dirPath: string;
    readonly from: Classification;
    readonly to: Classification;
  }[];
  readonly renamed: readonly { readonly fromDirPath: string; readonly toDirPath: string }[];
  /** Declared renames matching no baseline row — validation problems, never hidden. */
  readonly danglingRenames: readonly { readonly dirPath: string; readonly renamedFrom: string }[];
}

function pairDeclaredRenames(
  rows: readonly CensusRow[],
  legacyByDir: ReadonlyMap<string, LegacyRow>,
): {
  renamed: { fromDirPath: string; toDirPath: string }[];
  renamedFromDirs: Set<string>;
  danglingRenames: { dirPath: string; renamedFrom: string }[];
} {
  const renamed: { fromDirPath: string; toDirPath: string }[] = [];
  const renamedFromDirs = new Set<string>();
  const danglingRenames: { dirPath: string; renamedFrom: string }[] = [];
  for (const row of rows) {
    if (row.renamedFrom === undefined) {
      continue;
    }
    if (legacyByDir.has(row.renamedFrom)) {
      renamed.push({ fromDirPath: row.renamedFrom, toDirPath: row.dirPath });
      renamedFromDirs.add(row.renamedFrom);
    } else {
      danglingRenames.push({ dirPath: row.dirPath, renamedFrom: row.renamedFrom });
    }
  }
  return { renamed, renamedFromDirs, danglingRenames };
}

/**
 * Delta over the two keyed row sets. Presence (appeared/disappeared)
 * and renames span EVERY subject row — exclusions and falsifier rows
 * are census subjects too; only the classification comparison is
 * restricted to classified rows. A rename is a DECLARED fact on the new
 * row (`renamedFrom`); one that matches no baseline row is surfaced as
 * a dangling rename, and its row still counts as appeared.
 */
export function computeDelta(input: DeltaInput): DeltaResult {
  const legacyByDir = new Map(input.legacyRows.map((row) => [row.dirPath, row]));
  const currentByDir = new Map(input.rows.map((row) => [row.dirPath, row]));
  const classified = input.rows.filter((row) => row.disposition === 'classified');

  const { renamed, renamedFromDirs, danglingRenames } = pairDeclaredRenames(
    input.rows,
    legacyByDir,
  );
  const pairedNewDirs = new Set(renamed.map((pair) => pair.toDirPath));

  const appeared = input.rows
    .filter((row) => !legacyByDir.has(row.dirPath) && !pairedNewDirs.has(row.dirPath))
    .map((row) => ({ dirPath: row.dirPath }));

  const disappeared = input.legacyRows
    .filter((row) => !currentByDir.has(row.dirPath) && !renamedFromDirs.has(row.dirPath))
    .map((row) => ({ dirPath: row.dirPath }));

  const changed = classified.flatMap((row) => {
    const legacy = legacyByDir.get(row.dirPath);
    if (
      legacy === undefined ||
      row.classification === undefined ||
      legacy.classification === row.classification
    ) {
      return [];
    }
    return [{ dirPath: row.dirPath, from: legacy.classification, to: row.classification }];
  });

  return { appeared, disappeared, changed, renamed, danglingRenames };
}
