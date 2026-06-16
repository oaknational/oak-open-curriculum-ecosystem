import { describe, expect, it } from 'vitest';

import {
  classifyDiscreteZone,
  decisionDebtConfigurationFinding,
  evaluateDecisionDebt,
  isConceptCounted,
  readCountThresholds,
  readDwellThresholds,
} from './decision-debt.js';

const ENTRY = (status: string): string =>
  `- **a candidate title**\n  \`[captured: 2026-06-16 | source: a napkin entry | target: a rule | trigger: a second instance | size: S | status: ${status}]\``;

describe('classifyDiscreteZone', () => {
  // The engine is axis-agnostic and tested with injected ceiling thresholds —
  // never the register's own owner-tunable values. Ceilings: healthy ≤ target,
  // soft ≤ soft, hard ≤ hard, else critical (critical = beyond hard).
  const countCeilings = { target: 0, soft: 2, hard: 3 };
  const dwellCeilings = { target: 2, soft: 4, hard: 7 };

  it('classifies the count axis against its ceilings (0 / 1–2 / 3 / 4+)', () => {
    expect(classifyDiscreteZone(0, countCeilings)).toBe('healthy');
    expect(classifyDiscreteZone(1, countCeilings)).toBe('soft');
    expect(classifyDiscreteZone(2, countCeilings)).toBe('soft');
    expect(classifyDiscreteZone(3, countCeilings)).toBe('hard');
    expect(classifyDiscreteZone(4, countCeilings)).toBe('critical');
    expect(classifyDiscreteZone(72, countCeilings)).toBe('critical');
  });

  it('classifies the dwell axis (days) against its own ceilings (≤2 / 3–4 / 5–7 / 8+)', () => {
    expect(classifyDiscreteZone(2, dwellCeilings)).toBe('healthy');
    expect(classifyDiscreteZone(4, dwellCeilings)).toBe('soft');
    expect(classifyDiscreteZone(7, dwellCeilings)).toBe('hard');
    expect(classifyDiscreteZone(8, dwellCeilings)).toBe('critical');
  });

  it('returns null when no thresholds are declared (the metric is opt-in per buffer)', () => {
    expect(classifyDiscreteZone(9, { target: null, soft: null, hard: null })).toBeNull();
  });
});

describe('readCountThresholds / readDwellThresholds', () => {
  it('reads each axis from its own frontmatter prefix (set-it-then-it-reads)', () => {
    // Arbitrary probe values, not the register's chosen config.
    const content = [
      '---',
      'fitness_item_count_target: 1',
      'fitness_item_count_soft: 5',
      'fitness_item_count_hard: 9',
      'fitness_item_dwell_target: 3',
      'fitness_item_dwell_soft: 6',
      'fitness_item_dwell_hard: 12',
      '---',
      '# buffer',
    ].join('\n');
    expect(readCountThresholds(content)).toEqual({ target: 1, soft: 5, hard: 9 });
    expect(readDwellThresholds(content)).toEqual({ target: 3, soft: 6, hard: 12 });
  });

  it('returns null ceilings when the buffer declares none', () => {
    expect(readCountThresholds('---\nfitness_line_limit: 100\n---\n# buffer')).toEqual({
      target: null,
      soft: null,
      hard: null,
    });
  });
});

describe('evaluateDecisionDebt', () => {
  it('produces the live count, by-status, count-zone, dwell, dwell-zone, and findings together', () => {
    const content = [
      '---',
      'fitness_item_count_target: 0',
      'fitness_item_count_soft: 2',
      'fitness_item_count_hard: 3',
      'fitness_item_dwell_target: 2',
      'fitness_item_dwell_soft: 4',
      'fitness_item_dwell_hard: 7',
      '---',
      ENTRY('pending'),
      ENTRY('due'),
      ENTRY('overdue'),
      ENTRY('graduated'),
      ENTRY('owner-gated'),
    ].join('\n\n');
    // ENTRY items are captured 2026-06-16; an injected now four days later.
    const result = evaluateDecisionDebt(content, new Date('2026-06-20T00:00:00Z'));
    expect(result.count).toBe(3);
    expect(result.byStatus).toEqual({ pending: 1, due: 1, overdue: 1 });
    expect(result.zone).toBe('hard'); // count 3 ≤ hard ceiling 3
    expect(result.oldestDwellDays).toBe(4);
    expect(result.dwellZone).toBe('soft'); // 4 days ≤ dwell soft ceiling 4
    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].kind).toBe('owner-gated-status');
  });
});

describe('isConceptCounted', () => {
  it('is true only for a file explicitly designated fitness_item_count: required', () => {
    expect(isConceptCounted('---\nfitness_item_count: required\n---\n# r')).toBe(true);
  });

  it('is false for a drainable buffer that is not designated for concept-counting', () => {
    // A prose buffer (napkin/distilled) is a buffer but is not concept-counted.
    expect(
      isConceptCounted('---\nfitness_content_role: drainable-buffer\n---\n# prose buffer'),
    ).toBe(false);
  });
});

describe('decisionDebtConfigurationFinding', () => {
  const DESIGNATED = (extra: string): string =>
    `---\nfitness_item_count: required\n${extra}\n---\n# register`;
  const COUNT_TRIO =
    'fitness_item_count_target: 0\nfitness_item_count_soft: 2\nfitness_item_count_hard: 3';
  const DWELL_TRIO =
    'fitness_item_dwell_target: 2\nfitness_item_dwell_soft: 4\nfitness_item_dwell_hard: 7';

  it('flags a concept-counted file that declares no thresholds as a schema failure', () => {
    expect(decisionDebtConfigurationFinding(DESIGNATED(''))).not.toBeNull();
  });

  it('flags a concept-counted file that declares the count trio but no dwell trio', () => {
    expect(decisionDebtConfigurationFinding(DESIGNATED(COUNT_TRIO))).not.toBeNull();
  });

  it('flags a concept-counted file that declares only some of a trio', () => {
    expect(
      decisionDebtConfigurationFinding(DESIGNATED(`fitness_item_count_hard: 3\n${DWELL_TRIO}`)),
    ).not.toBeNull();
  });

  it('does not flag a concept-counted file that declares both full ceiling trios', () => {
    expect(decisionDebtConfigurationFinding(DESIGNATED(`${COUNT_TRIO}\n${DWELL_TRIO}`))).toBeNull();
  });

  it('does not flag a file not designated for concept-counting (the requirement is opt-in per file)', () => {
    expect(
      decisionDebtConfigurationFinding('---\nfitness_content_role: drainable-buffer\n---\n# prose'),
    ).toBeNull();
  });
});
