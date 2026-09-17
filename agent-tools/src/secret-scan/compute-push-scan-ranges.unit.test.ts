import { describe, expect, it } from 'vitest';

import { computePushScanRanges } from './compute-push-scan-ranges.js';

/** The repository's configured remotes, as `git remote` would list them. */
const CONFIGURED = ['origin'] as const;

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
  // to a URL arrives as the URL, never as an empty string. It names no
  // configured remote, so it cannot scope the exclusion — and scoping to it
  // anyway would build `--remotes=<URL>`, a glob over refs/remotes/* that
  // matches nothing and therefore excludes nothing.
  it('falls back to all remotes for a new ref pushed to a URL destination', () => {
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
