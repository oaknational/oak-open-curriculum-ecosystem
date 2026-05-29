import { describe, expect, it } from 'vitest';

import { validateEefExploreArgs } from './validation.js';

describe('validateEefExploreArgs', () => {
  it('accepts a full valid call and normalises key_stage to keyStage', () => {
    const result = validateEefExploreArgs({
      subject: 'science',
      key_stage: 'KS3',
      topic: 'photosynthesis',
      focus: 'metacognition_and_self_regulation',
    });
    expect(result).toEqual({
      ok: true,
      value: {
        subject: 'science',
        keyStage: 'KS3',
        topic: 'photosynthesis',
        focus: 'metacognition_and_self_regulation',
      },
    });
  });

  it('accepts a call without the optional focus', () => {
    const result = validateEefExploreArgs({
      subject: 'maths',
      key_stage: 'KS2',
      topic: 'fractions',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.focus).toBeUndefined();
    }
  });

  it.each(['subject', 'key_stage', 'topic'])('rejects a call missing the required %s', (field) => {
    const full: Record<string, string> = {
      subject: 'science',
      key_stage: 'KS3',
      topic: 'photosynthesis',
    };
    const withoutField = Object.fromEntries(Object.entries(full).filter(([key]) => key !== field));
    const result = validateEefExploreArgs(withoutField);
    expect(result.ok).toBe(false);
  });

  it('rejects a whitespace-only topic', () => {
    const result = validateEefExploreArgs({ subject: 'science', key_stage: 'KS3', topic: '   ' });
    expect(result.ok).toBe(false);
  });

  it('rejects a focus outside the closed enum', () => {
    const result = validateEefExploreArgs({
      subject: 'science',
      key_stage: 'KS3',
      topic: 'photosynthesis',
      focus: 'time-management',
    });
    expect(result.ok).toBe(false);
  });

  it('rejects an unknown key (strict boundary)', () => {
    const result = validateEefExploreArgs({
      subject: 'science',
      key_stage: 'KS3',
      topic: 'photosynthesis',
      injected: 'x',
    });
    expect(result.ok).toBe(false);
  });

  it('rejects a non-object input', () => {
    expect(validateEefExploreArgs('science').ok).toBe(false);
    expect(validateEefExploreArgs(null).ok).toBe(false);
  });
});
