import { describe, expect, it } from 'vitest';

import {
  formatFitnessResponseDiscipline,
  getMode,
  runPracticeFitnessCheck,
} from './validate-practice-fitness.js';

describe('validate-practice-fitness wrapper', () => {
  it('exports the reusable Practice fitness runner', () => {
    expect(runPracticeFitnessCheck).toBeTypeOf('function');
  });

  it('exports reusable helpers through the thin script wrapper', () => {
    expect(getMode(['--informational'])).toBe('informational');
    expect(formatFitnessResponseDiscipline()).toContain('Preserve substance first');
  });
});
