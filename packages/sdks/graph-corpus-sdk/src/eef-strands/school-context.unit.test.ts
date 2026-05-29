import { describe, expect, it } from 'vitest';

import { EEF_PHASES, EEF_PRIORITIES, EEF_KEY_STAGES } from './school-context.js';

describe('EEF controlled vocabularies', () => {
  it('EEF_PRIORITIES is the 15-value priority vocabulary', () => {
    expect(EEF_PRIORITIES).toHaveLength(15);
    expect(EEF_PRIORITIES).toContain('metacognition_and_self_regulation');
    expect(EEF_PRIORITIES).toContain('improving_maths');
    // The invented gate-1a vocabulary is not in the data-derived set.
    expect<readonly string[]>(EEF_PRIORITIES).not.toContain('numeracy');
    expect<readonly string[]>(EEF_PRIORITIES).not.toContain('literacy');
  });

  it('EEF_KEY_STAGES is the 6-value key-stage vocabulary', () => {
    expect(EEF_KEY_STAGES).toEqual(['EYFS', 'KS1', 'KS2', 'KS3', 'KS4', 'KS5']);
  });

  it('EEF_PHASES is the canonical phase vocabulary including early_years', () => {
    expect(EEF_PHASES).toEqual(['early_years', 'primary', 'secondary']);
  });
});
