import { describe, expect, it } from 'vitest';

import {
  classifyDecisionDebtZone,
  decisionDebtConfigurationFinding,
  evaluateDecisionDebt,
  isConceptCounted,
  readDecisionDebtThresholds,
} from './decision-debt.js';

const ENTRY = (status: string): string =>
  `- **a candidate title**\n  \`[captured: 2026-06-16 | source: a napkin entry | target: a rule | trigger: a second instance | size: S | status: ${status}]\``;

describe('classifyDecisionDebtZone', () => {
  // The engine is tested with injected thresholds — never the register's own
  // owner-tunable values. These probes prove the count→zone mapping mechanism.
  const thresholds = { target: 0, limit: 2 };

  it('reads an empty buffer (the target) as healthy', () => {
    expect(classifyDecisionDebtZone(0, thresholds)).toBe('healthy');
  });

  it('reads accruing debt within the limit as soft', () => {
    expect(classifyDecisionDebtZone(2, thresholds)).toBe('soft');
  });

  it('reads the count just over the limit as hard', () => {
    expect(classifyDecisionDebtZone(3, thresholds)).toBe('hard');
  });

  it('reads sustained debt as critical (loop failure)', () => {
    expect(classifyDecisionDebtZone(4, thresholds)).toBe('critical');
  });

  it('returns null when no thresholds are declared (the metric is opt-in per buffer)', () => {
    expect(classifyDecisionDebtZone(9, { target: null, limit: null })).toBeNull();
  });
});

describe('readDecisionDebtThresholds', () => {
  it('reads the count thresholds from frontmatter (set-it-then-it-reads mechanism)', () => {
    // Arbitrary probe values, not the register's chosen config.
    const content = '---\nfitness_item_count_target: 7\nfitness_item_count_limit: 9\n---\n# buffer';
    expect(readDecisionDebtThresholds(content)).toEqual({ target: 7, limit: 9 });
  });

  it('returns null thresholds when the buffer declares none', () => {
    expect(readDecisionDebtThresholds('---\nfitness_line_limit: 100\n---\n# buffer')).toEqual({
      target: null,
      limit: null,
    });
  });
});

describe('evaluateDecisionDebt', () => {
  it('produces the live count, by-status breakdown, zone, and conformance findings together', () => {
    const content = [
      '---',
      'fitness_item_count_target: 0',
      'fitness_item_count_limit: 2',
      '---',
      ENTRY('pending'),
      ENTRY('due'),
      ENTRY('overdue'),
      ENTRY('graduated'),
      ENTRY('owner-gated'),
    ].join('\n\n');
    const result = evaluateDecisionDebt(content);
    expect(result.count).toBe(3);
    expect(result.byStatus).toEqual({ pending: 1, due: 1, overdue: 1 });
    expect(result.zone).toBe('hard');
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

  it('flags a concept-counted file that declares no thresholds as a schema failure', () => {
    expect(decisionDebtConfigurationFinding(DESIGNATED(''))).not.toBeNull();
  });

  it('flags a concept-counted file that declares only one of the two thresholds', () => {
    expect(
      decisionDebtConfigurationFinding(DESIGNATED('fitness_item_count_limit: 2')),
    ).not.toBeNull();
  });

  it('does not flag a concept-counted file that declares both thresholds', () => {
    const designated = DESIGNATED('fitness_item_count_target: 0\nfitness_item_count_limit: 2');
    expect(decisionDebtConfigurationFinding(designated)).toBeNull();
  });

  it('does not flag a file not designated for concept-counting (the requirement is opt-in per file)', () => {
    expect(
      decisionDebtConfigurationFinding('---\nfitness_content_role: drainable-buffer\n---\n# prose'),
    ).toBeNull();
  });
});
