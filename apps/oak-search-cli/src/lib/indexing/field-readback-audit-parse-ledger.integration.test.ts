import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseLedger } from '../../../operations/ingestion/field-readback-audit-lib.js';

async function withTempDir<T>(run: (dir: string) => Promise<T>): Promise<T> {
  const dir = await mkdtemp(join(tmpdir(), 'field-readback-audit-'));
  try {
    return await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe('parseLedger integration', () => {
  it('parses a valid ledger file', async () => {
    await withTempDir(async (dir) => {
      const validPath = join(dir, 'valid-ledger.json');
      await writeFile(
        validPath,
        JSON.stringify({
          statuses: ['unknown', 'must_be_populated'],
          fields: [
            {
              indexFamily: 'lessons',
              fieldName: 'thread_slugs',
              stage: 'ingest_dispatch_readback',
              status: 'must_be_populated',
              findingRefs: ['F1'],
            },
          ],
        }),
        'utf8',
      );
      const ledger = await parseLedger(validPath);
      expect(ledger.statuses).toContain('must_be_populated');
      expect(ledger.fields).toHaveLength(1);
    });
  });

  it('fails with helpful error when file does not exist', async () => {
    await withTempDir(async (dir) => {
      const missingPath = join(dir, 'missing-ledger.json');
      await expect(parseLedger(missingPath)).rejects.toThrow('Failed to read ledger file');
    });
  });

  it('fails with helpful error when JSON is invalid', async () => {
    await withTempDir(async (dir) => {
      const invalidPath = join(dir, 'invalid-ledger.json');
      await writeFile(invalidPath, '{invalid-json', 'utf8');
      await expect(parseLedger(invalidPath)).rejects.toThrow('Ledger file contains invalid JSON');
    });
  });

  it('fails when JSON shape is invalid', async () => {
    await withTempDir(async (dir) => {
      const invalidShapePath = join(dir, 'invalid-shape-ledger.json');
      await writeFile(invalidShapePath, JSON.stringify({ statuses: [] }), 'utf8');
      await expect(parseLedger(invalidShapePath)).rejects.toThrow('Invalid ledger JSON shape');
    });
  });
});
