/**
 * F-85: `claims` commands resolve the shared coordination home for `--active`
 * by default, so a worktree-isolated agent's claims land in the team's primary
 * checkout rather than a worktree-local file (the F-41 fragmentation failure
 * mode, but for claims). These cover the resolution behaviour directly:
 *
 * - an omitted `--active` resolves to the coordination home's
 *   `active-claims.json` (git consulted via the injected runner);
 * - an explicit `--active` is honoured verbatim and NEVER consults git (laziness
 *   — an explicit path must not pay for, or fail on, a git invocation);
 * - `--repo-root` overrides the home without consulting git;
 * - `withActiveDefault` injects the resolved value while preserving every other
 *   option field.
 *
 * Built through `parseOptions` so the flags are exercised on a real parsed
 * Options value; the git runner is stubbed so the resolution is proven without a
 * repository.
 */
import { describe, expect, it } from 'vitest';

import {
  resolveActivePath,
  withActiveDefault,
} from '../../src/collaboration-state/claim-active-path';
import { parseOptions } from '../../src/collaboration-state/cli-options';
import { type GitRunner } from '../../src/collaboration-state/coordination-home';

const PRIMARY = '/workspace/oak';
const LINKED = '/workspace/oak-worktrees/lane-b';
const ACTIVE_IN_PRIMARY = `${PRIMARY}/.agent/state/collaboration/active-claims.json`;

function porcelain(...roots: readonly string[]): string {
  return roots
    .map((root, i) => `worktree ${root}\nHEAD ${'0'.repeat(40)}\nbranch refs/heads/wt-${i}\n`)
    .join('\n');
}

const gitReturning =
  (output: string): GitRunner =>
  () =>
    output;

const gitThatThrows: GitRunner = () => {
  throw new Error('git must not be consulted when the path is given explicitly');
};

describe('resolveActivePath (F-85 claims --active default)', () => {
  it('defaults an omitted --active to the coordination home active-claims.json', () => {
    const options = parseOptions(['claims', 'list']);
    expect(
      resolveActivePath(options, LINKED, { runGit: gitReturning(porcelain(PRIMARY, LINKED)) }),
    ).toBe(ACTIVE_IN_PRIMARY);
  });

  it('honours an explicit --active verbatim without consulting git', () => {
    const options = parseOptions(['claims', 'list', '--active', '/explicit/active.json']);
    expect(resolveActivePath(options, LINKED, { runGit: gitThatThrows })).toBe(
      '/explicit/active.json',
    );
  });

  it('honours --repo-root as the home override without consulting git', () => {
    const options = parseOptions(['claims', 'list', '--repo-root', '/repo/root']);
    expect(resolveActivePath(options, LINKED, { runGit: gitThatThrows })).toBe(
      '/repo/root/.agent/state/collaboration/active-claims.json',
    );
  });
});

describe('withActiveDefault', () => {
  it('injects the resolved --active while preserving other option fields', () => {
    const options = parseOptions([
      'claims',
      'heartbeat',
      '--claim-id',
      'abc',
      '--now',
      '2026-06-28T00:00:00Z',
    ]);
    const resolved = withActiveDefault(options, LINKED, {
      runGit: gitReturning(porcelain(PRIMARY, LINKED)),
    });
    expect(resolved.values.get('active')).toBe(ACTIVE_IN_PRIMARY);
    expect(resolved.values.get('claim-id')).toBe('abc');
    expect(resolved.values.get('now')).toBe('2026-06-28T00:00:00Z');
    expect(resolved.command).toBe('claims');
    expect(resolved.topic).toBe('heartbeat');
  });

  it('leaves an explicit --active untouched', () => {
    const options = parseOptions(['claims', 'list', '--active', '/explicit/active.json']);
    const resolved = withActiveDefault(options, LINKED, { runGit: gitThatThrows });
    expect(resolved.values.get('active')).toBe('/explicit/active.json');
  });
});
