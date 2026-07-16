import { describe, expect, it } from 'vitest';

import { isTournamentCellId } from '../../src/codex-hook-review/local-state.js';

describe('isTournamentCellId', () => {
  it('recognises only frozen tournament cells', () => {
    expect(isTournamentCellId('spark-low:inline')).toBe(true);
    expect(isTournamentCellId('gpt-latest:inline')).toBe(false);
  });
});
