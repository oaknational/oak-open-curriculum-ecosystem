import { describe, expect, it } from 'vitest';

import {
  BENCHMARK_CORPUS,
  CALIBRATION_CORPUS,
  HELD_OUT_CORPUS,
} from '../../src/codex-hook-review/corpus';

describe('Codex hook benchmark corpus', () => {
  it('provides the frozen calibration balance and difficulty mix', () => {
    expect(CALIBRATION_CORPUS).toHaveLength(20);
    expect(CALIBRATION_CORPUS.filter((entry) => entry.expected.label === 'concern')).toHaveLength(
      10,
    );
    expect(CALIBRATION_CORPUS.filter((entry) => entry.expected.label === 'clean')).toHaveLength(10);
    expect(CALIBRATION_CORPUS.filter((entry) => entry.difficulty === 'easy')).toHaveLength(8);
    expect(CALIBRATION_CORPUS.filter((entry) => entry.difficulty === 'medium')).toHaveLength(6);
    expect(CALIBRATION_CORPUS.filter((entry) => entry.difficulty === 'hard')).toHaveLength(6);
  });

  it.each(['easy', 'medium', 'hard'] as const)(
    'provides five concerns and five clean held-out cases at %s difficulty',
    (difficulty) => {
      const tier = HELD_OUT_CORPUS.filter((entry) => entry.difficulty === difficulty);
      expect(tier).toHaveLength(10);
      expect(tier.filter((entry) => entry.expected.label === 'concern')).toHaveLength(5);
      expect(tier.filter((entry) => entry.expected.label === 'clean')).toHaveLength(5);
    },
  );

  it('covers code, configuration, documentation, and agent writes with bounded batches', () => {
    expect(BENCHMARK_CORPUS).toHaveLength(50);
    expect(BENCHMARK_CORPUS.map((entry) => entry.surface)).toEqual(
      expect.arrayContaining(['code', 'config', 'docs', 'agent']),
    );
    expect(
      BENCHMARK_CORPUS.every((entry) => entry.changes.length >= 1 && entry.changes.length <= 3),
    ).toBe(true);
    expect(BENCHMARK_CORPUS.map((entry) => entry.changes[0].tool)).toEqual(
      expect.arrayContaining(['Edit', 'Write']),
    );
  });
});
