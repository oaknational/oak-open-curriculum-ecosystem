import { describe, expect, it } from 'vitest';

import { computePushScanRanges, type ConfiguredRemote } from './compute-push-scan-ranges.js';

/**
 * The repository's configured remotes, as `git remote` lists them, each with
 * the one URL it fetches from as `git remote get-url` prints it.
 */
const ORIGIN: ConfiguredRemote = { name: 'origin', fetchUrl: 'https://github.com/acme/gizmos.git' };
const CONFIGURED: readonly ConfiguredRemote[] = [ORIGIN];

const ZERO = '0'.repeat(40);
const LOCAL = 'a'.repeat(40);
const REMOTE = 'b'.repeat(40);

describe('computePushScanRanges', () => {
  it('scans local commits not on any remote when git supplies no ref lines (manual run)', () => {
    expect(
      computePushScanRanges({ refsText: '', remoteName: 'origin', configuredRemotes: CONFIGURED }),
    ).toStrictEqual(['HEAD --not --remotes']);
  });

  // Regression for the deletion-only bug: an all-deletion push supplies ref
  // lines but must scan nothing — it must NOT reach the manual-run fallback.
  it('scans nothing when every pushed ref is a deletion (does not fall back)', () => {
    const refsText = `refs/heads/x ${ZERO} refs/heads/x ${REMOTE}`;
    expect(
      computePushScanRanges({ refsText, remoteName: 'origin', configuredRemotes: CONFIGURED }),
    ).toStrictEqual([]);
  });

  // Regression for the new-remote-ref bug: the exclusion must be scoped to the
  // destination remote, so commits already on ANOTHER remote are still scanned.
  it('scopes a new ref to the destination remote', () => {
    const refsText = `refs/heads/x ${LOCAL} refs/heads/x ${ZERO}`;
    expect(
      computePushScanRanges({ refsText, remoteName: 'origin', configuredRemotes: CONFIGURED }),
    ).toStrictEqual([`${LOCAL} --not --remotes=origin`]);
  });

  // githooks(5): git passes the push destination through verbatim, so a push
  // to a URL arrives as the URL, never as an empty string. When the URL names
  // the repository a configured remote fetches from, that remote's tracking
  // refs hold what is already on the destination — the shape `merge-bot push`
  // hands the hook, since it pushes to the configured repository's URL.
  it("scopes a new ref pushed to a configured remote's URL by that remote's name", () => {
    const refsText = `refs/heads/x ${LOCAL} refs/heads/x ${ZERO}`;
    expect(
      computePushScanRanges({
        refsText,
        remoteName: 'https://github.com/acme/gizmos.git',
        configuredRemotes: CONFIGURED,
      }),
    ).toStrictEqual([`${LOCAL} --not --remotes=origin`]);
  });

  it('reads the destination URL as the repository it names, whatever its spelling', () => {
    const refsText = `refs/heads/x ${LOCAL} refs/heads/x ${ZERO}`;
    expect(
      computePushScanRanges({
        refsText,
        remoteName: 'git@GitHub.com:Acme/Gizmos',
        configuredRemotes: CONFIGURED,
      }),
    ).toStrictEqual([`${LOCAL} --not --remotes=origin`]);
  });

  it("scopes to every remote that fetches from the destination's repository", () => {
    const refsText = `refs/heads/x ${LOCAL} refs/heads/x ${ZERO}`;
    const mirror: ConfiguredRemote = {
      name: 'mirror',
      fetchUrl: 'ssh://git@github.com/acme/gizmos',
    };
    expect(
      computePushScanRanges({
        refsText,
        remoteName: 'https://github.com/acme/gizmos.git',
        configuredRemotes: [ORIGIN, mirror],
      }),
    ).toStrictEqual([`${LOCAL} --not --remotes=origin --remotes=mirror`]);
  });

  // The same owner and name on another host is another repository: its
  // remote's tracking refs say nothing about what the destination holds.
  it('does not scope through a remote that fetches the same owner and name from another host', () => {
    const refsText = `refs/heads/x ${LOCAL} refs/heads/x ${ZERO}`;
    const elsewhere: ConfiguredRemote = {
      name: 'elsewhere',
      fetchUrl: 'https://gitlab.example/acme/gizmos.git',
    };
    expect(
      computePushScanRanges({
        refsText,
        remoteName: 'https://github.com/acme/gizmos.git',
        configuredRemotes: [elsewhere],
      }),
    ).toStrictEqual([`${LOCAL} --not --remotes`]);
  });

  // A remote whose fetch URL git could not report still scopes by its name,
  // and never by a URL: nothing says what its tracking refs hold.
  it('does not scope a URL through a remote whose fetch URL is unknown', () => {
    const refsText = `refs/heads/x ${LOCAL} refs/heads/x ${ZERO}`;
    const unread: ConfiguredRemote = { name: 'origin', fetchUrl: undefined };
    expect(
      computePushScanRanges({
        refsText,
        remoteName: 'https://github.com/acme/gizmos.git',
        configuredRemotes: [unread],
      }),
    ).toStrictEqual([`${LOCAL} --not --remotes`]);
    expect(
      computePushScanRanges({ refsText, remoteName: 'origin', configuredRemotes: [unread] }),
    ).toStrictEqual([`${LOCAL} --not --remotes=origin`]);
  });

  // A URL naming a repository no configured remote fetches from cannot scope
  // the exclusion — and scoping to it anyway would build `--remotes=<URL>`, a
  // glob over refs/remotes/* that matches nothing and therefore excludes
  // nothing.
  it('falls back to all remotes for a new ref pushed to the URL of a repository no remote fetches from', () => {
    const refsText = `refs/heads/x ${LOCAL} refs/heads/x ${ZERO}`;
    expect(
      computePushScanRanges({
        refsText,
        remoteName: 'https://github.com/acme/widgets.git',
        configuredRemotes: CONFIGURED,
      }),
    ).toStrictEqual([`${LOCAL} --not --remotes`]);
  });

  it('falls back for a destination that merely looks like a remote name but is not configured', () => {
    const refsText = `refs/heads/x ${LOCAL} refs/heads/x ${ZERO}`;
    expect(
      computePushScanRanges({ refsText, remoteName: 'upstream', configuredRemotes: CONFIGURED }),
    ).toStrictEqual([`${LOCAL} --not --remotes`]);
  });

  it('scans only the new commits for a ref update', () => {
    const refsText = `refs/heads/x ${LOCAL} refs/heads/x ${REMOTE}`;
    expect(
      computePushScanRanges({ refsText, remoteName: 'origin', configuredRemotes: CONFIGURED }),
    ).toStrictEqual([`${REMOTE}..${LOCAL}`]);
  });

  it('emits a range only for the non-deletion ref in a mixed push', () => {
    const refsText = [
      `refs/heads/gone ${ZERO} refs/heads/gone ${REMOTE}`,
      `refs/heads/x ${LOCAL} refs/heads/x ${REMOTE}`,
    ].join('\n');
    expect(
      computePushScanRanges({ refsText, remoteName: 'origin', configuredRemotes: CONFIGURED }),
    ).toStrictEqual([`${REMOTE}..${LOCAL}`]);
  });

  it('ignores blank lines around ref lines', () => {
    const refsText = `\nrefs/heads/x ${LOCAL} refs/heads/x ${REMOTE}\n\n`;
    expect(
      computePushScanRanges({ refsText, remoteName: 'origin', configuredRemotes: CONFIGURED }),
    ).toStrictEqual([`${REMOTE}..${LOCAL}`]);
  });
});
