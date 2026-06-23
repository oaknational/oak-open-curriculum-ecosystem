import { describe, expect, it } from 'vitest';

import { formatDecisionDebtSection, type DecisionDebtReading } from './decision-debt-report.js';
import type { DecisionDebtResult } from './decision-debt.js';

const result = (
  count: number,
  zone: DecisionDebtResult['zone'],
  byStatus: DecisionDebtResult['byStatus'] = { pending: count, due: 0, overdue: 0 },
  findings: DecisionDebtResult['findings'] = [],
  oldestDwellDays: DecisionDebtResult['oldestDwellDays'] = null,
  dwellZone: DecisionDebtResult['dwellZone'] = null,
): DecisionDebtResult => ({ count, byStatus, zone, findings, oldestDwellDays, dwellZone });

const reading = (
  filename: string,
  res: DecisionDebtResult,
  configFinding: string | null = null,
): DecisionDebtReading => ({ filename, result: res, configFinding });

describe('formatDecisionDebtSection', () => {
  it('is empty when there are no concept-counted files (the section is omitted)', () => {
    expect(formatDecisionDebtSection([])).toBe('');
  });

  it('renders the filename and the live count for a reading', () => {
    const out = formatDecisionDebtSection([reading('register.md', result(4, 'critical'))]);
    expect(out).toContain('register.md');
    expect(out).toContain('4');
  });

  it('renders the per-status breakdown', () => {
    const out = formatDecisionDebtSection([
      reading('r.md', result(3, 'critical', { pending: 1, due: 1, overdue: 1 })),
    ]);
    expect(out).toContain('pending 1');
    expect(out).toContain('due 1');
    expect(out).toContain('overdue 1');
  });

  it('surfaces a schema-failure when a concept-counted file is misconfigured', () => {
    const out = formatDecisionDebtSection([
      reading('r.md', result(0, null), 'must declare both thresholds'),
    ]);
    expect(out).toContain('schema failure');
    expect(out).toContain('must declare both thresholds');
  });

  it('renders the oldest-dwell prioritisation signal (with its zone) when present, omits when null', () => {
    const withDwell = formatDecisionDebtSection([
      reading('r.md', result(2, 'soft', { pending: 2, due: 0, overdue: 0 }, [], 42, 'critical')),
    ]);
    expect(withDwell).toContain('Oldest undecided: 42d');
    expect(withDwell).toContain('(dwell)');

    const withoutDwell = formatDecisionDebtSection([reading('r.md', result(0, 'healthy'))]);
    expect(withoutDwell).not.toContain('Oldest undecided');
  });

  it('always carries the inversion-guard reminder (decide, never delete)', () => {
    const out = formatDecisionDebtSection([reading('r.md', result(1, 'soft'))]);
    expect(out.toLowerCase()).toContain('decid');
  });

  it('prompts the pipeline triage when any reading is hard or critical', () => {
    const out = formatDecisionDebtSection([reading('r.md', result(4, 'critical'))]);
    expect(out.toLowerCase()).toContain('cadence');
    expect(out.toLowerCase()).toContain('capture');
  });

  it('omits the pipeline triage when every reading is healthy or soft', () => {
    const out = formatDecisionDebtSection([reading('r.md', result(2, 'soft'))]);
    expect(out.toLowerCase()).not.toContain('cadence');
  });

  it('summarises non-conformant entries by kind rather than listing every one', () => {
    const findings = [
      { kind: 'owner-gated-status' as const, detail: 'x' },
      { kind: 'owner-gated-status' as const, detail: 'x' },
      { kind: 'malformed' as const, detail: 'y' },
    ];
    const out = formatDecisionDebtSection([
      reading('r.md', result(2, 'soft', { pending: 2, due: 0, overdue: 0 }, findings)),
    ]);
    expect(out).toContain('3 non-conformant');
    expect(out).toContain('2 owner-gated-status');
    expect(out).toContain('1 malformed');
    // one representative example per kind, not all three findings listed
    expect(out.match(/e\.g\./g)).toHaveLength(2);
  });
});
