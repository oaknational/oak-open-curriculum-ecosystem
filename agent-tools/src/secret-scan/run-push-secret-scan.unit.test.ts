import { describe, expect, it } from 'vitest';

import type { ConfiguredRemote } from './compute-push-scan-ranges.js';
import { runPushSecretScan } from './run-push-secret-scan.js';

/**
 * The pre-push scan's orchestration over an injected scanner and an injected
 * warning sink. The range arithmetic itself is pinned in
 * `compute-push-scan-ranges.unit.test.ts`; what is described here is what an
 * operator SEES — in particular that a scan which has quietly become a
 * full-history walk says so (R6: a performance-sensitive operation that loses
 * its optimisation precondition refuses or warns, never degrades silently).
 */

const LOCAL = '1111111111111111111111111111111111111111';
const REMOTE = '2222222222222222222222222222222222222222';
const ZERO = '0000000000000000000000000000000000000000';

/** The configured remotes, each with the one URL it fetches from. */
const ORIGIN_URL = 'https://github.com/acme/gizmos.git';
const CONFIGURED: readonly ConfiguredRemote[] = [
  { name: 'origin', fetchUrl: ORIGIN_URL },
  { name: 'upstream', fetchUrl: 'https://github.com/acme-upstream/gizmos.git' },
];

/**
 * A destination that names a repository no configured remote fetches from.
 * git passes the push destination through verbatim, so a push to a URL
 * arrives as the URL — never as an empty string.
 */
const UNKNOWN_URL = 'https://github.com/someone-else/gizmos.git';

function run(args: {
  remoteName: string;
  refsText: string;
  configuredRemotes?: readonly ConfiguredRemote[];
}): {
  exit: number;
  scanned: string[];
  warnings: string[];
} {
  const scanned: string[] = [];
  const warnings: string[] = [];
  const exit = runPushSecretScan(
    { ...args, configuredRemotes: args.configuredRemotes ?? CONFIGURED },
    (range) => {
      scanned.push(range);
      return true;
    },
    (message) => warnings.push(message),
  );
  return { exit, scanned, warnings };
}

describe('runPushSecretScan', () => {
  it('warns loudly when the destination URL names a repository no remote fetches from, turning the incremental scan into a full-history walk', () => {
    // The destination names no configured remote and no repository one
    // fetches from, so there are no remote-tracking refs to scope the
    // exclusion against. Scoping to the URL is worse than useless:
    // `--remotes=<URL>` is a glob matched against refs/remotes/*, it matches
    // nothing, and the walk excludes nothing.
    const result = run({
      remoteName: UNKNOWN_URL,
      refsText: `refs/heads/lane ${LOCAL} refs/heads/lane ${ZERO}`,
    });

    expect(result.exit).toBe(0);
    expect(result.warnings).toHaveLength(1);
    // The operator is told WHAT was lost and WHAT it costs, and the message
    // names the destination that cost it.
    expect(result.warnings[0]).toContain('not a configured remote');
    expect(result.warnings[0]).toContain(UNKNOWN_URL);
    // The range never carries the URL as a ref glob.
    expect(result.scanned).toEqual([`${LOCAL} --not --remotes`]);
  });

  it('warns for a filesystem-path destination too — no scheme, still no tracking refs', () => {
    // A path destination names no configured remote and parses to no host
    // repository, so nothing can scope it.
    const result = run({
      remoteName: '/srv/mirrors/oak.git',
      refsText: `refs/heads/lane ${LOCAL} refs/heads/lane ${ZERO}`,
    });

    expect(result.warnings).toHaveLength(1);
    expect(result.scanned).toEqual([`${LOCAL} --not --remotes`]);
  });

  it('warns when git supplies no ref lines at all — a manual run scans the same superset', () => {
    const result = run({ remoteName: 'origin', refsText: '' });

    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toContain('no ref lines');
    expect(result.scanned).toEqual(['HEAD --not --remotes']);
  });

  it('stays silent on the ordinary incremental push — the precondition holds', () => {
    const result = run({
      remoteName: 'origin',
      refsText: `refs/heads/lane ${LOCAL} refs/heads/lane ${REMOTE}`,
    });

    expect(result.exit).toBe(0);
    expect(result.warnings).toEqual([]);
    expect(result.scanned).toEqual([`${REMOTE}..${LOCAL}`]);
  });

  it('keeps a new ref scoped to its named destination remote without warning', () => {
    const result = run({
      remoteName: 'origin',
      refsText: `refs/heads/lane ${LOCAL} refs/heads/lane ${ZERO}`,
    });

    expect(result.warnings).toEqual([]);
    expect(result.scanned).toEqual([`${LOCAL} --not --remotes=origin`]);
  });

  // The shape `merge-bot push` hands the hook: a new branch pushed to the
  // configured repository's URL, which origin fetches from. The push's
  // destination is known, so the scan says nothing.
  it('stays silent when the destination is the URL of the repository a configured remote fetches from', () => {
    const result = run({
      remoteName: ORIGIN_URL,
      refsText: `refs/heads/lane ${LOCAL} refs/heads/lane ${ZERO}`,
    });

    expect(result.warnings).toEqual([]);
    expect(result.scanned).toEqual([`${LOCAL} --not --remotes=origin`]);
  });

  it('reports a leak as a non-zero exit', () => {
    const exit = runPushSecretScan(
      {
        remoteName: 'origin',
        refsText: `refs/heads/lane ${LOCAL} refs/heads/lane ${REMOTE}`,
        configuredRemotes: CONFIGURED,
      },
      () => false,
      () => undefined,
    );

    expect(exit).toBe(1);
  });
});
