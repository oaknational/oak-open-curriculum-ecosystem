import { describe, expect, it } from 'vitest';

import { runPrStateCli } from './state-cli.js';
import type { ReadReadingInput } from './state-cli.js';
import { NO_CONTENT } from './content-binding.js';
import { NO_DECLARATIONS } from './declared-unavailable.js';
import type { PrStateReading } from './state-types.js';

/** CLI tests for `pr state` with an injected reading and clock — no gh. */

const TIP = 'a'.repeat(40);
const NOW = '2026-07-21T13:00:00Z';

function reading(overrides: Partial<PrStateReading> = {}): PrStateReading {
  return {
    number: 461,
    isDraft: false,
    url: 'https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/461',
    author: 'app/el-graphael',
    state: 'OPEN',
    mergeable: 'MERGEABLE',
    mergeStateStatus: 'BLOCKED',
    headRefOid: TIP,
    baseRefName: 'main',
    checks: { total: 1, passed: 0, failed: 1, pending: 0 },
    namedChecks: [{ name: 'SonarCloud Code Analysis', bucket: 'failed' }],
    checksGreenAt: null,
    reviewThreads: { total: 0, unresolved: 0 },
    autoMergeArmed: true,
    reviewRequests: [],
    roundRequests: [],
    expectedReviewers: ['copilot-pull-request-reviewer'],
    expectedDeclared: true,
    reviews: [],
    completionComments: { reviews: [], refused: [], notices: [] },
    declaredUnavailable: NO_DECLARATIONS,
    reviewRuns: { kind: 'read', runs: [] },
    reviewConfiguration: { kind: 'unread', reason: 'the test reading declares none' },
    content: NO_CONTENT,
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

  it('passes --expect none through as the DECLARED empty set', () => {
    const capture: ReadReadingInput[] = [];
    const { exit } = run(['state', '461', '--expect', 'none'], { capture });
    expect(exit).toBe(0);
    expect(capture[0]?.expectedReviewers).toEqual([]);
  });

  it('leaves the set undeclared when --expect is absent, so the reading defaults it and says so', () => {
    const capture: ReadReadingInput[] = [];
    const { exit } = run(['state', '461'], { capture });
    expect(exit).toBe(0);
    expect(capture[0]).not.toHaveProperty('expectedReviewers');
  });

  it('refuses --expect none beside a login as a usage error', () => {
    const { exit, stderr } = run(['state', '461', '--expect', 'none', '--expect', 'claude']);
    expect(exit).toBe(2);
    expect(stderr.text).toContain('--expect none');
  });

  it('refuses a non-login --expect value with the usage text, like every other usage error', () => {
    const { exit, stderr } = run(['state', '461', '--expect', '$(whoami)']);
    expect(exit).toBe(2);
    expect(stderr.text).toContain('--expect must be a GitHub login or none');
    expect(stderr.text).toContain('pr state <pr-number|github-pull-url>');
  });

  it('rejects an unknown action with usage on stderr and exit 2', () => {
    const { exit, stderr } = run(['status', '461']);
    expect(exit).toBe(2);
    expect(stderr.text).toContain('pr state');
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
