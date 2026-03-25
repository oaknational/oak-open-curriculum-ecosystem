import { describe, expect, it } from 'vitest';
import {
  runFieldReadbackAudit,
  type GapLedger,
} from '../../../operations/ingestion/field-readback-audit-lib.js';

function createLedgerFixture(): GapLedger {
  return {
    statuses: ['unknown', 'expected_empty_with_precondition', 'must_be_populated', 'verified'],
    fields: [
      {
        indexFamily: 'lessons',
        fieldName: 'thread_slugs',
        stage: 'ingest_dispatch_readback',
        status: 'must_be_populated',
        findingRefs: ['F1'],
      },
      {
        indexFamily: 'sequences',
        fieldName: 'category_titles',
        stage: 'ingest_dispatch_readback',
        status: 'must_be_populated',
        findingRefs: ['F2'],
      },
    ],
  };
}

describe('readback field audit', () => {
  it('returns mapping and count evidence entries for each ledger field', async () => {
    const result = await runFieldReadbackAudit(createLedgerFixture(), 2, 1, {
      resolveAlias: async (alias: string) => `${alias}_v2026-03-15-134856`,
      getMappingProperties: async () => ({
        thread_slugs: { type: 'keyword' },
        category_titles: { type: 'text' },
      }),
      getExistsCount: async () => 3,
      getMissingCount: async () => 0,
      sleep: async () => Promise.resolve(),
    });

    const lessonThreadEntry = result.entries.find(
      (entry) => entry.indexFamily === 'lessons' && entry.fieldName === 'thread_slugs',
    );
    const sequenceCategoryEntry = result.entries.find(
      (entry) => entry.indexFamily === 'sequences' && entry.fieldName === 'category_titles',
    );

    expect(result.ok).toBe(true);
    expect(result.entries).toHaveLength(2);
    expect(lessonThreadEntry?.mappingExists).toBe(true);
    expect(lessonThreadEntry?.existsCount).toBe(3);
    expect(sequenceCategoryEntry?.mappingType).toBe('text');
  });

  it('fails when must_be_populated fields have zero exists count', async () => {
    const result = await runFieldReadbackAudit(createLedgerFixture(), 1, 1, {
      resolveAlias: async (alias: string) => `${alias}_v2026-03-15-134856`,
      getMappingProperties: async () => ({
        thread_slugs: { type: 'keyword' },
        category_titles: { type: 'text' },
      }),
      getExistsCount: async () => 0,
      getMissingCount: async () => 10,
      sleep: async () => Promise.resolve(),
    });

    expect(result.ok).toBe(false);
    expect(
      result.failures.some((failure) =>
        failure.includes('Expected populated field has zero count'),
      ),
    ).toBe(true);
  });

  it('fails when field mapping is missing from resolved index', async () => {
    const result = await runFieldReadbackAudit(createLedgerFixture(), 1, 1, {
      resolveAlias: async (alias: string) => `${alias}_v2026-03-15-134856`,
      getMappingProperties: async () => ({
        thread_slugs: { type: 'keyword' },
      }),
      getExistsCount: async () => 3,
      getMissingCount: async () => 0,
      sleep: async () => Promise.resolve(),
    });

    expect(result.ok).toBe(false);
    expect(result.failures.some((failure) => failure.includes('Missing mapping for'))).toBe(true);
  });

  it('fails when ingest readback status remains unknown', async () => {
    const ledger = createLedgerFixture();
    const fields = [...ledger.fields];
    const firstField = fields[0];
    if (firstField === undefined) {
      throw new Error('Expected first ledger field');
    }
    fields[0] = {
      ...firstField,
      status: 'unknown',
    };
    const unknownLedger: GapLedger = {
      ...ledger,
      fields,
    };

    const result = await runFieldReadbackAudit(unknownLedger, 1, 1, {
      resolveAlias: async (alias: string) => `${alias}_v2026-03-15-134856`,
      getMappingProperties: async () => ({
        thread_slugs: { type: 'keyword' },
        category_titles: { type: 'text' },
      }),
      getExistsCount: async () => 3,
      getMissingCount: async () => 0,
      sleep: async () => Promise.resolve(),
    });

    expect(result.ok).toBe(false);
    expect(
      result.failures.some((failure) => failure.includes("Ledger status 'unknown' is unresolved")),
    ).toBe(true);
  });

  it('retries must_be_populated zero-count reads and records attempts used', async () => {
    let getExistsCountCalls = 0;
    let sleepCalls = 0;
    const result = await runFieldReadbackAudit(createLedgerFixture(), 3, 1, {
      resolveAlias: async (alias: string) => `${alias}_v2026-03-15-134856`,
      getMappingProperties: async () => ({
        thread_slugs: { type: 'keyword' },
        category_titles: { type: 'text' },
      }),
      getExistsCount: async () => {
        getExistsCountCalls += 1;
        if (getExistsCountCalls <= 2) {
          return 0;
        }
        return 3;
      },
      getMissingCount: async () => 1,
      sleep: async () => {
        sleepCalls += 1;
        return Promise.resolve();
      },
    });

    const lessonThreadEntry = result.entries.find(
      (entry) => entry.indexFamily === 'lessons' && entry.fieldName === 'thread_slugs',
    );

    expect(result.ok).toBe(true);
    expect(lessonThreadEntry?.attemptsUsed).toBe(3);
    expect(sleepCalls).toBeGreaterThan(0);
  });

  it('retries transient 429 errors before succeeding', async () => {
    let getExistsCountCalls = 0;
    const result = await runFieldReadbackAudit(createLedgerFixture(), 2, 1, {
      resolveAlias: async (alias: string) => `${alias}_v2026-03-15-134856`,
      getMappingProperties: async () => ({
        thread_slugs: { type: 'keyword' },
        category_titles: { type: 'text' },
      }),
      getExistsCount: async () => {
        getExistsCountCalls += 1;
        if (getExistsCountCalls === 1) {
          throw Object.assign(new Error('Transient rate limit'), { statusCode: 429 });
        }
        return 3;
      },
      getMissingCount: async () => 0,
      sleep: async () => Promise.resolve(),
    });

    expect(result.ok).toBe(true);
    expect(getExistsCountCalls).toBeGreaterThan(1);
  });

  it('fails fast when ledger status is unsupported', async () => {
    const ledger = createLedgerFixture();
    const fields = [...ledger.fields];
    const firstField = fields[0];
    if (firstField === undefined) {
      throw new Error('Expected first ledger field');
    }
    fields[0] = {
      ...firstField,
      status: 'must_be_poplated',
    };

    await expect(
      runFieldReadbackAudit(
        {
          ...ledger,
          fields,
        },
        1,
        1,
        {
          resolveAlias: async (alias: string) => `${alias}_v2026-03-15-134856`,
          getMappingProperties: async () => ({
            thread_slugs: { type: 'keyword' },
            category_titles: { type: 'text' },
          }),
          getExistsCount: async () => 3,
          getMissingCount: async () => 0,
          sleep: async () => Promise.resolve(),
        },
      ),
    ).rejects.toThrow('Ledger field status is not declared in statuses');
  });
});
