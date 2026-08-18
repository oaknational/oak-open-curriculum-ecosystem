/**
 * Row artefact types and the recompute-and-diff validation the census
 * plan's acceptance criteria name: every derived subject has exactly
 * one row; every row's subject is derivable; judged rows satisfy the
 * closed vocabularies, the two-distinct-evidence-kinds discipline, and
 * the mixed-only thinnest-slice restriction. Judged readings are data
 * this module validates, never facts it invents.
 */
import type { CensusSubject } from './subjects.js';
import {
  CLASSIFICATIONS,
  EVIDENCE_KINDS,
  LEAKAGE_DEPTHS,
  LEAKAGE_TYPES,
  LICENCES,
  TRANCHES,
  isInVocabulary,
  type Classification,
  type EvidenceKind,
  type LeakageDepth,
  type LeakageType,
  type Licence,
  type Tranche,
} from './vocabulary.js';

interface LeakageInstance {
  readonly type: LeakageType;
  readonly depth: LeakageDepth;
  readonly note: string;
}

interface EvidencePointer {
  readonly kind: EvidenceKind;
  readonly pointer: string;
}

type RowDisposition = 'classified' | 'excluded' | 'needs-construct-evidence' | 'pending';

export interface CensusRow {
  readonly dirPath: string;
  readonly publishedName: string | null;
  readonly disposition: RowDisposition;
  readonly classification?: Classification;
  readonly leakage?: readonly LeakageInstance[];
  readonly evidence?: readonly EvidencePointer[];
  readonly targetState?: string;
  readonly tranche?: Tranche;
  readonly licence?: readonly Licence[];
  readonly thinnestSlice?: string;
  readonly exclusionReason?: string;
  readonly falsifierReason?: string;
  readonly renamedFrom?: string;
}

export interface ValidateRowsInput {
  readonly subjects: readonly CensusSubject[];
  readonly rows: readonly CensusRow[];
}

export interface ValidationResult {
  readonly ok: boolean;
  readonly problems: readonly string[];
}

function isBlank(value: string | undefined): boolean {
  return value === undefined || value.trim() === '';
}

function checkLeakage(row: CensusRow, problems: string[]): void {
  for (const instance of row.leakage ?? []) {
    if (!isInVocabulary(LEAKAGE_TYPES, instance.type)) {
      problems.push(
        `row ${row.dirPath}: leakage type "${instance.type}" is outside the closed vocabulary`,
      );
    }
    if (!isInVocabulary(LEAKAGE_DEPTHS, instance.depth)) {
      problems.push(
        `row ${row.dirPath}: leakage depth "${instance.depth}" is outside the closed vocabulary`,
      );
    }
  }
}

function checkEvidence(row: CensusRow, problems: string[]): void {
  const entries = row.evidence ?? [];
  for (const entry of entries) {
    if (isBlank(entry.pointer)) {
      problems.push(`row ${row.dirPath}: blank evidence pointer on kind "${entry.kind}"`);
    }
  }
  // Only entries with a real pointer count toward the evidence gate.
  const kinds = new Set(entries.filter((entry) => !isBlank(entry.pointer)).map((e) => e.kind));
  for (const kind of kinds) {
    if (!isInVocabulary(EVIDENCE_KINDS, kind)) {
      problems.push(`row ${row.dirPath}: evidence kind "${kind}" is outside the closed vocabulary`);
    }
  }
  if (kinds.size < 2) {
    problems.push(
      `row ${row.dirPath}: judged rows need at least two DISTINCT evidence kinds; found ${String(kinds.size)}`,
    );
  }
}

function checkClassificationColumns(row: CensusRow, problems: string[]): void {
  if (row.classification === undefined || !isInVocabulary(CLASSIFICATIONS, row.classification)) {
    problems.push(
      `row ${row.dirPath}: classification must be one of ${CLASSIFICATIONS.join(', ')}`,
    );
  }
  if (isBlank(row.targetState)) {
    problems.push(`row ${row.dirPath}: judged rows need a target state`);
  }
}

function checkTrancheAndLicence(row: CensusRow, problems: string[]): void {
  if (row.tranche === undefined || !isInVocabulary(TRANCHES, row.tranche)) {
    problems.push(`row ${row.dirPath}: tranche must be one of ${TRANCHES.join(', ')}`);
  }
  const licences = row.licence ?? [];
  if (licences.length === 0) {
    problems.push(`row ${row.dirPath}: judged rows need a licence mapping`);
  }
  for (const licence of licences) {
    if (!isInVocabulary(LICENCES, licence)) {
      problems.push(`row ${row.dirPath}: licence "${licence}" is outside the closed vocabulary`);
    }
  }
}

function checkThinnestSlice(row: CensusRow, problems: string[]): void {
  if (row.classification === 'mixed') {
    if (isBlank(row.thinnestSlice)) {
      problems.push(`row ${row.dirPath}: mixed rows carry a thinnest-slice disposition`);
    }
    return;
  }
  if (row.thinnestSlice !== undefined) {
    problems.push(
      `row ${row.dirPath}: thinnest-slice dispositions are restricted to mixed rows (found one on ${String(row.classification)})`,
    );
  }
}

function checkDisposition(row: CensusRow, problems: string[]): void {
  switch (row.disposition) {
    case 'classified':
      checkClassificationColumns(row, problems);
      checkTrancheAndLicence(row, problems);
      checkLeakage(row, problems);
      checkEvidence(row, problems);
      checkThinnestSlice(row, problems);
      break;
    case 'excluded':
      if (isBlank(row.exclusionReason)) {
        problems.push(`row ${row.dirPath}: exclusions carry a recorded reason`);
      }
      break;
    case 'needs-construct-evidence':
      if (isBlank(row.falsifierReason)) {
        problems.push(
          `row ${row.dirPath}: falsifier rows carry the reason the evidence set cannot reach them`,
        );
      }
      break;
    case 'pending':
      problems.push(
        `row ${row.dirPath}: pending — the census is not complete while skeleton rows remain`,
      );
      break;
    default:
      problems.push(`row ${row.dirPath}: unknown disposition "${String(row.disposition)}"`);
  }
}

function countRowDirs(rows: readonly CensusRow[], problems: string[]): Map<string, number> {
  const rowCounts = new Map<string, number>();
  for (const row of rows) {
    rowCounts.set(row.dirPath, (rowCounts.get(row.dirPath) ?? 0) + 1);
  }
  for (const [dirPath, count] of rowCounts) {
    if (count > 1) {
      problems.push(`row ${dirPath}: duplicated ${String(count)} times — one row per subject`);
    }
  }
  return rowCounts;
}

function checkCoverage(input: ValidateRowsInput, problems: string[]): void {
  const subjectsByDir = new Map(input.subjects.map((subject) => [subject.dirPath, subject]));
  const rowCounts = countRowDirs(input.rows, problems);
  for (const subject of input.subjects) {
    if (!rowCounts.has(subject.dirPath)) {
      problems.push(
        `subject ${subject.dirPath}: no matrix row and no recorded exclusion (silence is not allowed)`,
      );
    }
  }
  // Both halves of the dual identity are validated: a rename in the
  // manifest without a directory move must not pass silently.
  for (const row of input.rows) {
    const subject = subjectsByDir.get(row.dirPath);
    if (subject === undefined) {
      problems.push(`row ${row.dirPath}: the mechanical predicate derives no such subject`);
      continue;
    }
    if (subject.publishedName !== row.publishedName) {
      problems.push(
        `row ${row.dirPath}: published name ${JSON.stringify(row.publishedName)} disagrees with the derived subject (${JSON.stringify(subject.publishedName)})`,
      );
    }
  }
}

/**
 * Recompute-and-diff validation. `pending` rows are named individually —
 * the skeleton state is visible, never a silent pass.
 */
export function validateRows(input: ValidateRowsInput): ValidationResult {
  const problems: string[] = [];
  checkCoverage(input, problems);
  for (const row of input.rows) {
    checkDisposition(row, problems);
  }
  return { ok: problems.length === 0, problems };
}
