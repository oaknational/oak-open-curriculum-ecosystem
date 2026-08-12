/**
 * F-108: `claims close` / `claims archive-stale` resolve the shared coordination
 * home for `--closed` by default, so a worktree-isolated agent archives closed
 * claims into the team's primary checkout rather than a worktree-local file (the
 * F-41 fragmentation failure mode F-85 cured for `--active`, applied to the
 * closed archive). These integration cases cover the resolution behaviour directly:
 *
 * - an omitted `--closed` resolves to the coordination home's
 *   `closed-claims.archive.json` (git consulted via the injected runner);
 * - an explicit `--closed` is honoured verbatim and NEVER consults git (laziness
 *   — an explicit path must not pay for, or fail on, a git invocation);
 * - `--repo-root` overrides the home without consulting git;
 * - `withClosedDefault` injects the resolved value while preserving every other
 *   option field.
 *
 * Built through `parseOptions` so the flags are exercised on a real parsed
 * Options value; the runtime resolver is injected so the resolution is proven
 * without a repository.
 */
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  resolveClosedPath,
  withClosedDefault,
} from '../../src/collaboration-state/claim-closed-path';
import { parseOptions } from '../../src/collaboration-state/cli-options';
import { createCapturingCoordinationHomeResolver } from './fake-collaboration-runtime-fixtures';

const PRIMARY = '/workspace/oak';
const LINKED = '/workspace/oak-worktrees/lane-b';
// The default is host-joined onto the home, so the expectation is derived in
// host form (identical to the POSIX literal on POSIX).
const CLOSED_IN_PRIMARY = join(PRIMARY, '.agent/state/collaboration/closed-claims.archive.json');

describe('resolveClosedPath (F-108 claims --closed default)', () => {
  it('defaults an omitted --closed to the coordination home closed-claims.archive.json', () => {
    const resolver = createCapturingCoordinationHomeResolver(PRIMARY);
    const options = parseOptions(['claims', 'close', '--claim-id', 'abc']);
    expect(
      resolveClosedPath(options, {
        cwd: LINKED,
        resolveCoordinationHome: resolver.resolve,
      }),
    ).toBe(CLOSED_IN_PRIMARY);
    expect(resolver.calls).toStrictEqual([LINKED]);
  });

  it('honours an explicit --closed verbatim without resolving the coordination home', () => {
    const resolver = createCapturingCoordinationHomeResolver('/unexpected-coordination-home');
    const options = parseOptions(['claims', 'close', '--closed', '/explicit/closed.json']);
    expect(
      resolveClosedPath(options, {
        cwd: LINKED,
        resolveCoordinationHome: resolver.resolve,
      }),
    ).toBe('/explicit/closed.json');
    expect(resolver.calls).toStrictEqual([]);
  });

  it('honours --repo-root as the home override without resolving the coordination home', () => {
    const resolver = createCapturingCoordinationHomeResolver('/unexpected-coordination-home');
    const options = parseOptions(['claims', 'close', '--repo-root', '/repo/root']);
    expect(
      resolveClosedPath(options, {
        cwd: LINKED,
        resolveCoordinationHome: resolver.resolve,
      }),
    ).toBe(join('/repo/root', '.agent/state/collaboration/closed-claims.archive.json'));
    expect(resolver.calls).toStrictEqual([]);
  });
});

describe('withClosedDefault', () => {
  it('injects the resolved --closed while preserving other option fields', () => {
    const resolver = createCapturingCoordinationHomeResolver(PRIMARY);
    const options = parseOptions([
      'claims',
      'close',
      '--claim-id',
      'abc',
      '--now',
      '2026-06-28T00:00:00Z',
    ]);
    const resolved = withClosedDefault(options, {
      cwd: LINKED,
      resolveCoordinationHome: resolver.resolve,
    });
    expect(resolved.values.get('closed')).toBe(CLOSED_IN_PRIMARY);
    expect(resolved.values.get('claim-id')).toBe('abc');
    expect(resolved.values.get('now')).toBe('2026-06-28T00:00:00Z');
    expect(resolved.command).toBe('claims');
    expect(resolved.topic).toBe('close');
    expect(resolver.calls).toStrictEqual([LINKED]);
  });

  it('leaves an explicit --closed untouched', () => {
    const resolver = createCapturingCoordinationHomeResolver('/unexpected-coordination-home');
    const options = parseOptions(['claims', 'close', '--closed', '/explicit/closed.json']);
    const resolved = withClosedDefault(options, {
      cwd: LINKED,
      resolveCoordinationHome: resolver.resolve,
    });
    expect(resolved.values.get('closed')).toBe('/explicit/closed.json');
    expect(resolver.calls).toStrictEqual([]);
  });
});
