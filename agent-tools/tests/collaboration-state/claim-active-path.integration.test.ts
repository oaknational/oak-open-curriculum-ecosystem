/**
 * F-85: `claims` commands resolve the shared coordination home for `--active`
 * by default, so a worktree-isolated agent's claims land in the team's primary
 * checkout rather than a worktree-local file (the F-41 fragmentation failure
 * mode, but for claims). These integration cases cover the resolution behaviour directly:
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
 * Options value; the runtime resolver is injected so the resolution is proven
 * without a repository.
 */
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  resolveActivePath,
  withActiveDefault,
} from '../../src/collaboration-state/claim-active-path';
import { parseOptions } from '../../src/collaboration-state/cli-options';
import { createCapturingCoordinationHomeResolver } from './fake-collaboration-runtime-fixtures';

const PRIMARY = '/workspace/oak';
const LINKED = '/workspace/oak-worktrees/lane-b';
// The default is host-joined onto the home, so the expectation is derived in
// host form (identical to the POSIX literal on POSIX).
const ACTIVE_IN_PRIMARY = join(PRIMARY, '.agent/state/collaboration/active-claims.json');

describe('resolveActivePath (F-85 claims --active default)', () => {
  it('defaults an omitted --active to the coordination home active-claims.json', () => {
    const resolver = createCapturingCoordinationHomeResolver(PRIMARY);
    const options = parseOptions(['claims', 'list']);
    expect(
      resolveActivePath(options, {
        cwd: LINKED,
        resolveCoordinationHome: resolver.resolve,
      }),
    ).toBe(ACTIVE_IN_PRIMARY);
    expect(resolver.calls).toStrictEqual([LINKED]);
  });

  it('honours an explicit --active verbatim without resolving the coordination home', () => {
    const resolver = createCapturingCoordinationHomeResolver('/unexpected-coordination-home');
    const options = parseOptions(['claims', 'list', '--active', '/explicit/active.json']);
    expect(
      resolveActivePath(options, {
        cwd: LINKED,
        resolveCoordinationHome: resolver.resolve,
      }),
    ).toBe('/explicit/active.json');
    expect(resolver.calls).toStrictEqual([]);
  });

  it('honours --repo-root as the home override without resolving the coordination home', () => {
    const resolver = createCapturingCoordinationHomeResolver('/unexpected-coordination-home');
    const options = parseOptions(['claims', 'list', '--repo-root', '/repo/root']);
    expect(
      resolveActivePath(options, {
        cwd: LINKED,
        resolveCoordinationHome: resolver.resolve,
      }),
    ).toBe(join('/repo/root', '.agent/state/collaboration/active-claims.json'));
    expect(resolver.calls).toStrictEqual([]);
  });
});

describe('withActiveDefault', () => {
  it('injects the resolved --active while preserving other option fields', () => {
    const resolver = createCapturingCoordinationHomeResolver(PRIMARY);
    const options = parseOptions([
      'claims',
      'heartbeat',
      '--claim-id',
      'abc',
      '--now',
      '2026-06-28T00:00:00Z',
    ]);
    const resolved = withActiveDefault(options, {
      cwd: LINKED,
      resolveCoordinationHome: resolver.resolve,
    });
    expect(resolved.values.get('active')).toBe(ACTIVE_IN_PRIMARY);
    expect(resolved.values.get('claim-id')).toBe('abc');
    expect(resolved.values.get('now')).toBe('2026-06-28T00:00:00Z');
    expect(resolved.command).toBe('claims');
    expect(resolved.topic).toBe('heartbeat');
    expect(resolver.calls).toStrictEqual([LINKED]);
  });

  it('leaves an explicit --active untouched', () => {
    const resolver = createCapturingCoordinationHomeResolver('/unexpected-coordination-home');
    const options = parseOptions(['claims', 'list', '--active', '/explicit/active.json']);
    const resolved = withActiveDefault(options, {
      cwd: LINKED,
      resolveCoordinationHome: resolver.resolve,
    });
    expect(resolved.values.get('active')).toBe('/explicit/active.json');
    expect(resolver.calls).toStrictEqual([]);
  });
});
