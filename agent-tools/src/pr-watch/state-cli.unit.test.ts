import { describe, expect, it } from 'vitest';

import { runPrStateCli } from './state-cli.js';
import type { ReadReadingInput } from './state-cli.js';
import type { PrStateReading } from './state-types.js';

/** CLI tests for `pr state` with an injected reading and clock — no gh. */

const TIP = 'a'.repeat(40);
const NOW = '2026-07-21T13:00:00Z';

function reading(overrides: Partial<PrStateReading> = {}): PrStateReading {
  return {
    number: 461,
    isDraft: false,
    url: 'https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/461',
    state: 'OPEN',
    mergeable: 'MERGEABLE',
    mergeStateStatus: 'BLOCKED',
    headRefOid: TIP,
    checks: { total: 1, passed: 0, failed: 1, pending: 0 },
    namedChecks: [{ name: 'SonarCloud Code Analysis', bucket: 'failed' }],
    checksGreenAt: null,
    reviewThreads: { total: 0, unresolved: 0 },
    autoMergeArmed: true,
    reviewRequests: [],
    expectedReviewers: ['copilot-pull-request-reviewer'],
    expectedDeclared: true,
    reviews: [],
    reviewRuns: { kind: 'read', runs: [] },
    ...overrides,
  };
}

class Sink {
  public text = '';
  public write(chunk: string): boolean {
    this.text += chunk;
    return true;
  }
}

function run(
  args: readonly string[],
  input: { reading?: PrStateReading; capture?: ReadReadingInput[] } = {},
): { exit: number; stdout: Sink; stderr: Sink } {
  const stdout = new Sink();
  const stderr = new Sink();
  const exit = runPrStateCli({
    args,
    stdout,
    stderr,
    now: () => NOW,
    readReading: (readInput) => {
      input.capture?.push(readInput);
      return input.reading ?? reading();
    },
  });
  return { exit, stdout, stderr };
}

describe('runPrStateCli', () => {
  it('prints the verdict with the red check named — never a column fragment', () => {
    const { exit, stdout } = run(['state', '461']);
    expect(exit).toBe(0);
    expect(stdout.text).toContain('PR #461 ARMED-BEHIND-RED');
    expect(stdout.text).toContain('failed check: SonarCloud Code Analysis');
  });

  it('emits the full reading and verdict as JSON with --json', () => {
    const { exit, stdout } = run(['state', '461', '--json']);
    expect(exit).toBe(0);
    const payload: unknown = JSON.parse(stdout.text);
    expect(payload).toMatchObject({
      verdict: { state: 'ARMED-BEHIND-RED' },
      reading: { number: 461, autoMergeArmed: true },
    });
  });

  it('passes repeatable --expect through to the reading seam', () => {
    const capture: ReadReadingInput[] = [];
    const { exit } = run(
      ['state', '461', '--expect', 'copilot-pull-request-reviewer', '--expect', 'claude'],
      {
        capture,
      },
    );
    expect(exit).toBe(0);
    expect(capture[0]?.expectedReviewers).toEqual(['copilot-pull-request-reviewer', 'claude']);
  });

  it('rejects an unknown action with usage on stderr and exit 2', () => {
    const { exit, stderr } = run(['status', '461']);
    expect(exit).toBe(2);
    expect(stderr.text).toContain('pr state');
  });

  it('rejects an unknown option with exit 2 and names it on stderr', () => {
    const { exit, stderr } = run(['state', '461', '--nope']);
    expect(exit).toBe(2);
    expect(stderr.text).toContain('unknown option: --nope');
  });

  it('rejects a malformed PR identifier at the boundary', () => {
    const { exit, stderr } = run(['state', 'not-a-pr']);
    expect(exit).toBe(2);
    expect(stderr.text).toContain('Invalid PR identifier');
  });

  it('prints usage on --help with exit 0', () => {
    const { exit, stdout } = run(['--help']);
    expect(exit).toBe(0);
    expect(stdout.text).toContain('pr state');
  });

  it('reports a reader failure on stderr with exit 2, never a partial verdict', () => {
    const stdout = new Sink();
    const stderr = new Sink();
    const exit = runPrStateCli({
      args: ['state', '461'],
      stdout,
      stderr,
      now: () => NOW,
      readReading: () => {
        throw new Error('gh pr view returned non-JSON output');
      },
    });
    expect(exit).toBe(2);
    expect(stderr.text).toContain('non-JSON');
  });
});
