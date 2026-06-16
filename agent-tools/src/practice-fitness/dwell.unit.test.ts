import { describe, expect, it } from 'vitest';

import { oldestLiveItemAgeDays, parseLeadingIsoDate } from './dwell.js';
import { parseRegisterItems } from './item-count.js';

describe('parseLeadingIsoDate', () => {
  it('parses a plain ISO date', () => {
    expect(parseLeadingIsoDate('2026-06-16')).toBe('2026-06-16');
  });

  it('takes the leading date from a range (tolerant of the messy real formats)', () => {
    expect(parseLeadingIsoDate('2026-05-05-06')).toBe('2026-05-05');
  });

  it('finds the date when trailing text follows', () => {
    expect(parseLeadingIsoDate('2026-04-25 (registered later)')).toBe('2026-04-25');
  });

  it('returns null for a value with no full date and for undefined', () => {
    expect(parseLeadingIsoDate('2026-06')).toBeNull();
    expect(parseLeadingIsoDate(undefined)).toBeNull();
  });
});

describe('oldestLiveItemAgeDays', () => {
  const NOW = new Date('2026-06-16T00:00:00Z');
  const DATED = (captured: string, status: string): string =>
    `- **t**\n  \`[captured: ${captured} | source: s | target: r | trigger: t | size: S | status: ${status}]\``;

  it('returns the greatest age across live items (injected now, never a clock)', () => {
    const items = parseRegisterItems(
      [DATED('2026-06-14', 'pending'), DATED('2026-06-06', 'overdue')].join('\n\n'),
    );
    // 2026-06-06 is 10 days before 2026-06-16.
    expect(oldestLiveItemAgeDays(items, NOW)).toBe(10);
  });

  it('ignores terminal items — dwell is a property of undecided debt', () => {
    const items = parseRegisterItems(
      [DATED('2026-01-01', 'graduated'), DATED('2026-06-14', 'pending')].join('\n\n'),
    );
    // The ancient entry is graduated (terminal); only the 2-day pending item counts.
    expect(oldestLiveItemAgeDays(items, NOW)).toBe(2);
  });

  it('returns null when no live item carries a parseable date', () => {
    expect(oldestLiveItemAgeDays(parseRegisterItems(DATED('undated', 'pending')), NOW)).toBeNull();
  });
});
