import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

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

function loadGapLedger() {
  const ledgerUrl = new URL(
    '.agent/plans/semantic-search/archive/completed/field-gap-ledger.json',
    new URL('../../../../../', import.meta.url),
  );
  const parsedLedger: unknown = JSON.parse(readFileSync(ledgerUrl, 'utf8'));
  if (
    typeof parsedLedger !== 'object' ||
    parsedLedger === null ||
    !('statuses' in parsedLedger) ||
    !('fields' in parsedLedger)
  ) {
    throw new Error(`Gap ledger has invalid shape at ${ledgerUrl.toString()}`);
  }
  const parsed = gapLedgerSchema.safeParse(parsedLedger);
  if (!parsed.success) {
    throw new Error(`Gap ledger parsing failed at ${ledgerUrl.toString()}`);
  }
  return parsed.data;
}

describe('field gap ledger', () => {
  it('contains all required statuses', () => {
    const ledger = loadGapLedger();
    expect(ledger.statuses).toEqual([
      'unknown',
      'expected_empty_with_precondition',
      'must_be_populated',
      'verified',
    ]);
  });

  it('maps F1 and F2 findings to concrete field-stage tuples', () => {
    const ledger = loadGapLedger();
    const f1Entries = ledger.fields.filter((entry) => entry.findingRefs.includes('F1'));
    const f2Entries = ledger.fields.filter((entry) => entry.findingRefs.includes('F2'));

    expect(f1Entries.length).toBeGreaterThan(0);
    expect(f2Entries.length).toBeGreaterThan(0);
    expect(
      f1Entries.some(
        (entry) =>
          entry.indexFamily === 'lessons' &&
          entry.fieldName === 'thread_slugs' &&
          entry.stage === 'ingest_dispatch_readback',
      ),
    ).toBe(true);
    expect(
      f2Entries.some(
        (entry) =>
          entry.indexFamily === 'sequences' &&
          entry.fieldName === 'category_titles' &&
          entry.stage === 'ingest_dispatch_readback',
      ),
    ).toBe(true);
  });
});
