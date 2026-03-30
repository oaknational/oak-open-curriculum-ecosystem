import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { serializeMinedSynonyms, writeMinedSynonymsFile } from './synonym-miner.js';
import type { MinedSynonymsData } from './synonym-miner.js';

function createMinedSynonymsData(): MinedSynonymsData {
  return {
    version: '1.0.0',
    generatedAt: '2026-03-29T15:00:00.000Z',
    stats: {
      totalKeywordsProcessed: 2,
      synonymsExtracted: 1,
      patternCounts: {
        'also known as': 1,
      },
    },
    synonyms: [
      {
        term: 'fraction',
        synonyms: ['rational number'],
        pattern: 'also known as',
        confidence: 0.9,
        subjects: ['maths'],
        occurrenceCount: 1,
      },
    ],
  };
}

describe('writeMinedSynonymsFile', () => {
  it('writes definition-synonyms.ts directly into the provided output directory', async () => {
    const outputDir = mkdtempSync(path.join(os.tmpdir(), 'synonym-miner-test-'));
    const data = createMinedSynonymsData();

    try {
      const filePath = await writeMinedSynonymsFile(data, outputDir);
      const expectedPath = path.join(outputDir, 'definition-synonyms.ts');

      expect(filePath).toBe(expectedPath);
      expect(readFileSync(expectedPath, 'utf8')).toBe(serializeMinedSynonyms(data));
    } finally {
      rmSync(outputDir, { force: true, recursive: true });
    }
  });
});
