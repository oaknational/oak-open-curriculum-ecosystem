import { describe, expect, it } from 'vitest';

import { renderRetireOutcome, type RetireOutcome } from './retire-report.js';

/**
 * The retire outcome as the two streams carry it. Pure: an outcome in, the
 * text for stdout and stderr out. `--json` puts exactly the outcome object
 * on stdout. The exit map is proven at the front door
 * (`retire-cli.integration.test.ts`).
 */

const BASE = { name: 'main', sha: 'b'.repeat(40) };
const TIP = 'a'.repeat(40);
const retired: RetireOutcome = {
  kind: 'retired',
  branch: 'feat/x',
  base: BASE,
  names: {
    remote: { state: 'deleted', sha: TIP },
    tracking: { state: 'absent' },
    local: { state: 'deleted', sha: TIP },
  },
};

describe('renderRetireOutcome', () => {
  it('renders exactly the outcome object on stdout under --json', () => {
    const rendered = renderRetireOutcome(retired, true);

    expect(JSON.parse(rendered.stdout)).toEqual(retired);
    expect(rendered.stderr).toBe('');
  });

  it('renders a retire on stdout only, naming the branch, the default and each name with its sha', () => {
    const rendered = renderRetireOutcome(retired, false);
    const remote = rendered.stdout.split('\n').find((line) => line.includes('remote:')) ?? '';

    expect(rendered.stderr).toBe('');
    expect(rendered.stdout).toContain('feat/x');
    expect(rendered.stdout).toContain(`main@${BASE.sha}`);
    expect(remote).toContain('deleted');
    expect(remote).toContain(TIP);
  });

  it.each([
    { kind: 'refused', branch: 'feat/x', reason: 'in use in worktree wt' },
    { kind: 'failed', branch: 'feat/x', reason: 'the remote read failed' },
  ] as const)('renders a $kind outcome on stderr only, with its reason', (outcome) => {
    const rendered = renderRetireOutcome(outcome, false);

    expect(rendered.stdout).toBe('');
    expect(rendered.stderr).toContain(outcome.reason);
  });

  it('renders a partial retire on stderr, naming each name with its state and any sha', () => {
    const moved = 'c'.repeat(40);
    const partial: RetireOutcome = {
      ...retired,
      kind: 'partial',
      reason: 'the local branch moved',
      names: {
        remote: { state: 'unknown' },
        tracking: { state: 'not-reached' },
        local: { state: 'kept', sha: moved },
      },
    };
    const rendered = renderRetireOutcome(partial, false);
    const lineFor = (name: string): string =>
      rendered.stderr.split('\n').find((line) => line.includes(`${name}:`)) ?? '';

    expect(rendered.stdout).toBe('');
    expect(rendered.stderr).toContain('the local branch moved');
    expect(lineFor('remote')).toContain('unknown');
    expect(lineFor('tracking')).toContain('not-reached');
    expect(lineFor('local')).toContain('kept');
    expect(lineFor('local')).toContain(moved);
  });
});
