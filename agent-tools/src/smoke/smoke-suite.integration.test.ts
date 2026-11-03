import { describe, expect, it } from 'vitest';

import { runSmokeSuite, type SmokeEnd } from './smoke-suite.js';

/**
 * The suite runs every smoke, one after another, whatever the earlier ones
 * ended with, and its verdict is the conjunction of every run. The runner of
 * one smoke is injected, so the order and completeness are proven without a
 * process.
 */

describe('runSmokeSuite', () => {
  it('runs every smoke in the given order even when each one fails, and fails the suite', async () => {
    const ran: string[] = [];
    const failing = (file: string): Promise<SmokeEnd> => {
      ran.push(file);
      return Promise.resolve({ status: 1, signal: null });
    };

    // Out of name order, so a loop that re-sorts what it is given goes red.
    const summary = await runSmokeSuite(['c.smoke.ts', 'a.smoke.ts', 'b.smoke.ts'], failing);

    expect(ran).toStrictEqual(['c.smoke.ts', 'a.smoke.ts', 'b.smoke.ts']);
    expect(summary.ok).toBe(false);
    expect(summary.lines.some((line) => line.includes('3 of 3 failed'))).toBe(true);
  });

  it('carries a smoke killed by a signal into the report by its signal', async () => {
    const killed = (): Promise<SmokeEnd> => Promise.resolve({ status: null, signal: 'SIGTERM' });

    const summary = await runSmokeSuite(['a.smoke.ts'], killed);

    const line = summary.lines.find((candidate) => candidate.includes('a.smoke.ts'));
    expect(line).toContain('SIGTERM');
    expect(summary.ok).toBe(false);
  });

  it('starts each smoke only after the one before it has ended', async () => {
    const events: string[] = [];
    const slow = async (file: string): Promise<SmokeEnd> => {
      events.push(`start ${file}`);
      await Promise.resolve();
      events.push(`end ${file}`);
      return { status: 0, signal: null };
    };

    const summary = await runSmokeSuite(['a.smoke.ts', 'b.smoke.ts'], slow);

    expect(events).toStrictEqual([
      'start a.smoke.ts',
      'end a.smoke.ts',
      'start b.smoke.ts',
      'end b.smoke.ts',
    ]);
    expect(summary.ok).toBe(true);
  });
});
