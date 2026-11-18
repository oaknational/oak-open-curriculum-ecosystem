import { describe, expect, it } from 'vitest';

import { exitCodeFor, waitStep } from './gate-slot-schedule.js';

/**
 * The wait and the verdict, as pure functions. The wait counts polls rather
 * than reading a clock: poll N is the Nth blocked attempt, each followed by
 * one poll interval of sleep.
 */

describe('waitStep', () => {
  it('reports on the first blocked poll', () => {
    expect(waitStep(1)).toStrictEqual({ report: true, giveUp: false });
  });

  it('stays quiet within the minute after a report', () => {
    expect(waitStep(7)).toStrictEqual({ report: false, giveUp: false });
  });

  it('reports again a minute after the last report', () => {
    expect(waitStep(13)).toStrictEqual({ report: true, giveUp: false });
  });

  it('keeps waiting on the last poll of the hour', () => {
    expect(waitStep(720).giveUp).toBe(false);
  });

  it('gives up on the poll after the hour', () => {
    expect(waitStep(721).giveUp).toBe(true);
  });
});

describe('exitCodeFor', () => {
  it('passes an exit status through', () => {
    expect(exitCodeFor({ status: 3, signal: null })).toBe(3);
  });

  it('reads a signal death as 128 plus the signal number', () => {
    expect(exitCodeFor({ status: null, signal: 'SIGTERM' })).toBe(143);
    expect(exitCodeFor({ status: null, signal: 'SIGHUP' })).toBe(129);
  });
});
