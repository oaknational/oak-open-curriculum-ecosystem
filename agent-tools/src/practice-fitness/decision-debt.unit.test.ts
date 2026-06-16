import { describe, expect, it } from 'vitest';

import {
  classifyDecisionDebtZone,
  decisionDebtConfigurationFinding,
  evaluateDecisionDebt,
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

describe('decisionDebtConfigurationFinding', () => {
  const BUFFER = (extra: string): string =>
    `---\nfitness_content_role: drainable-buffer\n${extra}\n---\n# buffer`;

  it('flags a drainable-buffer that declares no decision-debt thresholds as a schema failure', () => {
    expect(decisionDebtConfigurationFinding(BUFFER(''))).not.toBeNull();
  });

  it('flags a drainable-buffer that declares only one of the two thresholds', () => {
    expect(decisionDebtConfigurationFinding(BUFFER('fitness_item_count_limit: 2'))).not.toBeNull();
  });

  it('does not flag a drainable-buffer that declares both thresholds', () => {
    const buffer = BUFFER('fitness_item_count_target: 0\nfitness_item_count_limit: 2');
    expect(decisionDebtConfigurationFinding(buffer)).toBeNull();
  });

  it('does not flag a non-buffer surface lacking thresholds (the metric applies to buffers only)', () => {
    expect(
      decisionDebtConfigurationFinding('---\nfitness_line_limit: 100\n---\n# a reference doc'),
    ).toBeNull();
  });
});
