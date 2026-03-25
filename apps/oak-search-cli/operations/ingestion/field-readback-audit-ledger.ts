import { readFile } from 'node:fs/promises';
import { typeSafeGet, typeSafeHasOwn } from '@oaknational/type-helpers';
import { z } from 'zod';
import type { GapLedger, GapLedgerFieldEntry } from './field-readback-audit-types.js';

const gapLedgerSchema = z
  .object({
    version: z.number().int().positive().optional(),
    description: z.string().min(1).optional(),
    statuses: z.array(z.string().min(1)),
    fields: z.array(
      z.object({
        indexFamily: z.string().min(1),
        fieldName: z.string().min(1),
        stage: z.string().min(1),
        status: z.string().min(1),
        findingRefs: z.array(z.string().min(1)),
      }),
    ),
  })
  .loose();

const FIELD_ALIAS_MAP = {
  lessons: 'oak_lessons',
  units: 'oak_units',
  unit_rollup: 'oak_unit_rollup',
  threads: 'oak_threads',
  sequences: 'oak_sequences',
  sequence_facets: 'oak_sequence_facets',
  meta: 'oak_meta',
} as const;

const SUPPORTED_READBACK_STATUSES = [
  'unknown',
  'expected_empty_with_precondition',
  'must_be_populated',
  'verified',
] as const;

export type ReadbackStatus = (typeof SUPPORTED_READBACK_STATUSES)[number];

function isReadbackStatus(status: string): status is ReadbackStatus {
  return SUPPORTED_READBACK_STATUSES.some((value) => value === status);
}

/**
 * Parses and validates a field-gap ledger JSON file.
 *
 * @param ledgerPath - Path to the gap ledger JSON file.
 * @returns A validated ledger object.
 * @throws Error when file read fails, JSON is invalid, or schema shape is invalid.
 */
export async function parseLedger(ledgerPath: string): Promise<GapLedger> {
  let fileContent: string;
  try {
    fileContent = await readFile(ledgerPath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to read ledger file: ${ledgerPath}`, { cause: error });
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(fileContent);
  } catch (error) {
    throw new Error(`Ledger file contains invalid JSON: ${ledgerPath}`, { cause: error });
  }

  const parsed = gapLedgerSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new Error(`Invalid ledger JSON shape: ${ledgerPath}`);
  }
  return parsed.data;
}

/**
 * Resolves a ledger index family to its Elasticsearch alias.
 */
export function resolveFieldAlias(field: GapLedgerFieldEntry): string {
  if (!typeSafeHasOwn(FIELD_ALIAS_MAP, field.indexFamily)) {
    throw new Error(`Unknown ledger indexFamily: ${field.indexFamily}`);
  }
  return typeSafeGet(FIELD_ALIAS_MAP, field.indexFamily);
}

/**
 * Validates that a field status exists in the ledger-declared status list.
 */
export function ensureStatusListedInLedger(
  field: GapLedgerFieldEntry,
  ledgerStatuses: readonly string[],
): void {
  if (!ledgerStatuses.includes(field.status)) {
    throw new Error(
      `Ledger field status is not declared in statuses: ${field.indexFamily}.${field.fieldName} -> ${field.status}`,
    );
  }
}

/**
 * Parses and validates a readback status into the supported status union.
 */
export function parseReadbackStatus(field: GapLedgerFieldEntry): ReadbackStatus {
  if (!isReadbackStatus(field.status)) {
    throw new Error(
      `Unsupported ledger readback status: ${field.indexFamily}.${field.fieldName} -> ${field.status}`,
    );
  }
  return field.status;
}

/**
 * Adds a failure when an ingest readback field still has unresolved status.
 */
export function ensureLedgerStatusResolved(
  field: GapLedgerFieldEntry,
  readbackStatus: ReadbackStatus,
  failures: string[],
): void {
  if (field.stage !== 'ingest_dispatch_readback') {
    return;
  }
  if (readbackStatus === 'unknown') {
    failures.push(
      `Ledger status 'unknown' is unresolved for ${field.indexFamily}.${field.fieldName} (stage: ${field.stage}). Resolve status before running readback audit.`,
    );
  }
}
