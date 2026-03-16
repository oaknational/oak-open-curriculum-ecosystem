import { describe, expect, it } from 'vitest';
import {
  INGEST_STAGES,
  RETRIEVAL_STAGES,
  SEARCH_FIELD_INVENTORY,
  STAGE_CONTRACT_MATRIX,
} from '@oaknational/search-contracts';

describe('stage contract matrix', () => {
  it('contains ingest and retrieval stage entries for every inventory field', () => {
    const expectedStageEntriesPerField = INGEST_STAGES.length + RETRIEVAL_STAGES.length;
    const fieldKeyCounts = new Map<string, number>();
    for (const entry of STAGE_CONTRACT_MATRIX) {
      const key = `${entry.indexFamily}:${entry.fieldName}`;
      const existing = fieldKeyCounts.get(key) ?? 0;
      fieldKeyCounts.set(key, existing + 1);
    }

    for (const inventoryField of SEARCH_FIELD_INVENTORY) {
      const key = `${inventoryField.indexFamily}:${inventoryField.fieldName}`;
      expect(fieldKeyCounts.get(key)).toBe(expectedStageEntriesPerField);
    }
  });

  it('contains explicit ownership routes for each stage', () => {
    const ownerRoutes = new Set(STAGE_CONTRACT_MATRIX.map((entry) => entry.producerOwner));
    expect(ownerRoutes.has('apps/oak-search-cli/src/adapters/oak-adapter*')).toBe(true);
    expect(ownerRoutes.has('apps/oak-search-cli/src/lib/indexing/*document*')).toBe(true);
    expect(ownerRoutes.has('apps/oak-search-cli/src/adapters/bulk-*-transformer*')).toBe(true);
    expect(ownerRoutes.has('apps/oak-search-cli/src/lib/indexing/ingest-harness-*')).toBe(true);
    expect(ownerRoutes.has('packages/sdks/oak-search-sdk/src/retrieval/*')).toBe(true);
  });
});
