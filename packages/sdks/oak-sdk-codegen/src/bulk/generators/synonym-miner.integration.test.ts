import { describe, expect, it } from 'vitest';

import { createInMemoryFileSystem } from '../../io/test-helpers/in-memory-file-system.js';
import { serializeMinedSynonyms, writeMinedSynonymsFile } from './synonym-miner.js';
import type { MinedSynonymsData } from './synonym-miner.js';

const minedSynonyms: MinedSynonymsData = {
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

describe('writeMinedSynonymsFile', () => {
  it('writes definition-synonyms.ts directly into the provided output directory', async () => {
    const fs = createInMemoryFileSystem();

    const filePath = await writeMinedSynonymsFile(minedSynonyms, '/out/synonyms', fs);

    expect(filePath).toBe('/out/synonyms/definition-synonyms.ts');
    expect(fs.files.get(filePath)).toBe(serializeMinedSynonyms(minedSynonyms));
  });
});
