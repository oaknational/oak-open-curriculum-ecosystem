import { describe, expect, it } from 'vitest';
import {
  INGEST_STAGES,
  RETRIEVAL_STAGES,
  SEARCH_FIELD_INVENTORY,
  SEARCH_INDEX_FAMILIES,
  STAGE_CONTRACT_MATRIX,
  FIELD_GROUPS,
} from './index.js';

describe('search field inventory contracts', () => {
  it('contains entries for every in-scope index family', () => {
    const familiesWithEntries = new Set(SEARCH_FIELD_INVENTORY.map((entry) => entry.indexFamily));
    for (const family of SEARCH_INDEX_FAMILIES) {
      expect(familiesWithEntries.has(family)).toBe(true);
    }
  });

  it('never contains mapping-only drift fields', () => {
    const driftEntries = SEARCH_FIELD_INVENTORY.filter((entry) => !entry.schemaHasField);
    expect(driftEntries).toEqual([]);
  });

  it('assigns every inventory field to a valid field group', () => {
    const groupSet = new Set(FIELD_GROUPS);
    for (const entry of SEARCH_FIELD_INVENTORY) {
      expect(groupSet.has(entry.fieldGroup)).toBe(true);
    }
  });

  it('creates stage matrix entries for each inventory field', () => {
    const expectedStageEntriesPerField = INGEST_STAGES.length + RETRIEVAL_STAGES.length;
    const matrixByField = new Map<string, number>();
    for (const entry of STAGE_CONTRACT_MATRIX) {
      const key = `${entry.indexFamily}:${entry.fieldName}`;
      const current = matrixByField.get(key) ?? 0;
      matrixByField.set(key, current + 1);
    }

    for (const field of SEARCH_FIELD_INVENTORY) {
      const key = `${field.indexFamily}:${field.fieldName}`;
      expect(matrixByField.get(key)).toBe(expectedStageEntriesPerField);
    }
  });
});
