import { describe, expect, it } from 'vitest';

import { gateExit, parsePushedRefs, runReviewCostCli } from '../../src/review-cost/cli.js';

// A sink that records output; no gh, no git — every case here is refused before either runs.
const run = (args: readonly string[]) => {
  const out: string[] = [];
  const err: string[] = [];
  const exitCode = runReviewCostCli({
    args,
    stdout: {
      write: (chunk: string) => {
        out.push(chunk);
        return true;
      },
    },
    stderr: {
      write: (chunk: string) => {
        err.push(chunk);
        return true;
      },
    },
  });
  return { exitCode, stdout: out.join(''), stderr: err.join('') };
};

describe('review-cost gate — malformed invocations are refused as usage, never priced', () => {
  it('prints usage on --help', () => {
    const result = run(['gate', '--help']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('review-cost gate');
  });

  it('refuses a value flag with no value: --expect at the end never empties the reviewer set', () => {
    const result = run(['gate', '--branch', '--expect']);
    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('--expect needs a value');
  });

  it('refuses a flag-shaped value', () => {
    expect(run(['gate', '--pr', '--branch']).exitCode).toBe(2);
  });

  it('refuses a --pr that is not a positive integer', () => {
    const result = run(['gate', '--pr', 'abc']);
    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('positive integer');
  });

  it('refuses two selectors, and none', () => {
    expect(run(['gate', '--pr', '7', '--branch']).exitCode).toBe(2);
    expect(run(['gate']).exitCode).toBe(2);
    expect(run(['gate']).stderr).toContain('exactly one of');
  });

  it('refuses a survey without a date, with a malformed date, or with a selector', () => {
    expect(run(['survey']).exitCode).toBe(2);
    expect(run(['survey', '--since', '12/09/2026']).exitCode).toBe(2);
    expect(run(['survey', '--since', '2026-09-12', '--pr', '7']).exitCode).toBe(2);
  });

  it('refuses a survey flag on the gate: a malformed invocation never looks successful', () => {
    const result = run(['gate', '--pr', '7', '--since', '2026-09-12']);
    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('--since is a survey flag');
  });

  it('refuses an unknown subcommand and an unknown flag', () => {
    expect(run(['price', '--pr', '7']).exitCode).toBe(2);
    expect(run(['gate', '--pr', '7', '--verbose']).exitCode).toBe(2);
  });
});

describe('parsePushedRefs — the hook ref lines the gate prices', () => {
  it('reads the branch, the local head and the remote head; a creation has no remote head', () => {
    const refs = parsePushedRefs(
      [
        'refs/heads/lane/a 1111111 refs/heads/lane/a 2222222',
        'refs/heads/lane/new 3333333 refs/heads/lane/new 0000000000000000000000000000000000000000',
        'refs/heads/gone 0000000000000000000000000000000000000000 refs/heads/gone 4444444',
        'refs/tags/v1 5555555 refs/tags/v1 0000000',
        '',
      ].join('\n'),
    );
    expect(refs).toStrictEqual([
      { branch: 'lane/a', localSha: '1111111', remoteSha: '2222222' },
      { branch: 'lane/new', localSha: '3333333', remoteSha: undefined },
    ]);
  });
});

describe('gateExit — an exhausted loop is held until the note records a decision for every push past the budget', () => {
  const exhausted = {
    rounds: [],
    total: 61.41,
    budget: 40,
    budgetPushes: 2,
    verdict: 'exhausted',
    evidence: ['BUDGET-EXHAUSTED'],
    pushesPastBudget: 0,
  } as const;

  it('holds the first push past the budget with exit 3 and names the line to write', () => {
    const exit = gateExit(exhausted, false, 0);
    expect(exit.code).toBe(3);
    expect(exit.evidence.at(-1)).toContain('HELD: this push is number 1 past the budget');
    expect(exit.evidence.at(-1)).toContain('.agent/state/collaboration/review-rebudgets.md');
  });

  it('passes the first push past the budget once one decision line is recorded', () => {
    const exit = gateExit(exhausted, false, 1);
    expect(exit.code).toBe(0);
    expect(exit.evidence.at(-1)).toContain('rebudget decision recorded: 1 line(s)');
  });

  it('holds a second push past the budget until a second line exists', () => {
    const second = { ...exhausted, pushesPastBudget: 1 } as const;
    expect(gateExit(second, false, 1).code).toBe(3);
    expect(gateExit(second, false, 2).code).toBe(0);
  });

  it('passes a sync push on an exhausted loop with no decision line, saying why', () => {
    const exit = gateExit(exhausted, true, 0);
    expect(exit.code).toBe(0);
    expect(exit.evidence.at(-1)).toContain('outside the settlement budget (PDR-140 clause 4)');
  });

  it('passes a loop within budget with its evidence unchanged, sync or not, lines or none', () => {
    const within = { ...exhausted, total: 12, verdict: 'within', evidence: ['within'] } as const;
    expect(gateExit(within, false, 0)).toStrictEqual({ code: 0, evidence: ['within'] });
    expect(gateExit(within, true, 0)).toStrictEqual({ code: 0, evidence: ['within'] });
  });
});
