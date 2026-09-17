/**
 * Rows-artefact IO: the structured row data the human matrix is
 * rendered from or cross-checked against, so validation parses data,
 * never prose. Reads narrow unknown JSON through type guards
 * (assertion-free); deep column validation belongs to `rows.js`.
 */
import fs from 'node:fs/promises';

import { err, ok, type Result } from '@oaknational/result';

import { isErrnoCode } from '../collaboration-state/errno.js';
import { getJsonValue, isJsonObject, type JsonObject } from '../core/json.js';
import type { CensusRow } from './rows.js';

const ROWS_SCHEMA_VERSION = '1.0.0';

export const DEFAULT_ROWS_PATH = '.agent/reports/workspace-classification-census/rows.json';
export const DEFAULT_LEGACY_PATH =
  '.agent/plans-backlog-2026-07/architecture-and-infrastructure/future/oak-surface-isolation-and-generic-foundation-programme.plan.md';

export interface RowsArtefact {
  readonly schema_version: string;
  readonly plan: string;
  readonly rows: CensusRow[];
}

export function emptyRowsArtefact(): RowsArtefact {
  return {
    schema_version: ROWS_SCHEMA_VERSION,
    plan: '.agent/plans/delivery/workspace-classification-census.plan.md',
    rows: [],
  };
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === 'string';
}

function isOptionalArrayOf(value: unknown, guard: (item: unknown) => boolean): boolean {
  // Dense check (house pattern): Array.from so sparse holes cannot pass.
  return value === undefined || (Array.isArray(value) && Array.from(value).every(guard));
}

function isEvidenceShape(value: unknown): boolean {
  return (
    isJsonObject(value) &&
    typeof getJsonValue(value, 'kind') === 'string' &&
    typeof getJsonValue(value, 'pointer') === 'string'
  );
}

function isLeakageShape(value: unknown): boolean {
  return (
    isJsonObject(value) &&
    typeof getJsonValue(value, 'type') === 'string' &&
    typeof getJsonValue(value, 'depth') === 'string' &&
    typeof getJsonValue(value, 'note') === 'string'
  );
}

function hasRowIdentityShape(value: JsonObject): boolean {
  const publishedName = getJsonValue(value, 'publishedName');
  return (
    typeof getJsonValue(value, 'dirPath') === 'string' &&
    (publishedName === null || typeof publishedName === 'string') &&
    typeof getJsonValue(value, 'disposition') === 'string'
  );
}

function hasRowColumnShapes(value: JsonObject): boolean {
  const stringColumns = [
    'classification',
    'targetState',
    'tranche',
    'thinnestSlice',
    'exclusionReason',
    'falsifierReason',
    'renamedFrom',
  ];
  return (
    stringColumns.every((column) => isOptionalString(getJsonValue(value, column))) &&
    isOptionalArrayOf(getJsonValue(value, 'evidence'), isEvidenceShape) &&
    isOptionalArrayOf(getJsonValue(value, 'leakage'), isLeakageShape) &&
    isOptionalArrayOf(getJsonValue(value, 'licence'), (item) => typeof item === 'string')
  );
}

function isCensusRowShape(value: unknown): value is CensusRow {
  // The COMPLETE row shape is validated at parse time so hand-edited
  // JSON fails here as a validation error, never later as a crash;
  // closed-vocabulary membership stays with `rows.js`.
  return isJsonObject(value) && hasRowIdentityShape(value) && hasRowColumnShapes(value);
}

function isRowsArtefactShape(value: unknown): value is RowsArtefact {
  if (
    !isJsonObject(value) ||
    typeof getJsonValue(value, 'schema_version') !== 'string' ||
    typeof getJsonValue(value, 'plan') !== 'string'
  ) {
    return false;
  }
  const rows = getJsonValue(value, 'rows');
  return Array.isArray(rows) && Array.from(rows).every((row) => isCensusRowShape(row));
}

/** Parse rows-artefact JSON text; pure, so the shape contract is unit-testable. */
export function parseRowsArtefactJson(text: string, label: string): Result<RowsArtefact, string> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    return err(
      `${label}: invalid JSON — ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (!isRowsArtefactShape(parsed)) {
    return err(
      `${label}: not a rows artefact (schema_version, plan, and fully shaped rows[] required)`,
    );
  }
  return ok(parsed);
}

/**
 * Read the rows artefact. `ok(null)` means the file does not exist yet
 * (the skeleton command's create case); every other failure is an error.
 */
export async function readRowsArtefact(
  filePath: string,
): Promise<Result<RowsArtefact | null, string>> {
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    if (isErrnoCode(error, 'ENOENT')) {
      return ok(null);
    }
    return err(`${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
  const parsed = parseRowsArtefactJson(raw, filePath);
  if (!parsed.ok) {
    return err(parsed.error);
  }
  return ok(parsed.value);
}
