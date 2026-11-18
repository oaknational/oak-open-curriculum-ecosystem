import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  EMPTY_ACTIVE_CLAIMS_REGISTRY_JSON,
  EMPTY_CLOSED_CLAIMS_ARCHIVE_JSON,
} from './state-file-seeds.js';
import { readActiveClaimsFile, readClosedClaimsFile } from './state-file-readers.js';
import { updateActiveClaimsFile, updateClaimStateFiles } from './state-io.js';

// On a fresh checkout or new worktree the collaboration-state files are
// untracked-by-design (ADR-199 / PDR-094), so first contact meets ENOENT.
// The system states these tests describe: that first contact yields an
// error whose message embeds the COMPLETE seed content (instructions
// sufficient on their own to cure the failure); absence is never a silent
// empty registry; and every non-ENOENT failure surfaces as its ORIGINAL
// self — never wrapped, summarised, or softened (owner ruling 2026-07-20).
// The readers' text-read seam is injected (ADR-078); no test touches
// real IO.

function missingFile(path: string): Promise<string> {
  return Promise.reject(
    Object.assign(new Error(`ENOENT: no such file or directory, open '${path}'`), {
      code: 'ENOENT',
    }),
  );
}

const permissionFailure = Object.assign(new Error("EACCES: permission denied, open 'x'"), {
  code: 'EACCES',
});

describe('readActiveClaimsFile on a fresh checkout', () => {
  it('yields an Err whose message embeds the complete registry seed behind a verify-first instruction', async () => {
    const error = unwrapErr(await readActiveClaimsFile('active-claims.json', missingFile));

    expect(error.message).toContain('active-claims registry not found');
    expect(error.message).toContain('untracked-by-design');
    // Verify-then-seed: a mistyped explicit path also ENOENTs, and seeding
    // there would create the decoy this error exists to prevent.
    expect(error.message).toContain('FIRST verify the path');
    expect(error.message).toContain('do NOT seed at the wrong location');
    expect(error.message).toContain(EMPTY_ACTIVE_CLAIMS_REGISTRY_JSON);
  });

  it('accepts a file seeded with exactly the content the error prescribes', async () => {
    const registry = unwrapOrThrow(
      await readActiveClaimsFile(
        'active-claims.json',
        async () => EMPTY_ACTIVE_CLAIMS_REGISTRY_JSON,
      ),
    );

    expect(registry.claims).toEqual([]);
    // The 1.4.0 seed carries claims only: the commit queue is machine-local
    // ephemera in the per-intent store, never in the claims file.
    expect(EMPTY_ACTIVE_CLAIMS_REGISTRY_JSON).not.toContain('commit_queue');
  });

  it('yields the parser error as its original Err for present-but-invalid content — only ENOENT is enriched', async () => {
    const error = unwrapErr(
      await readActiveClaimsFile('active-claims.json', async () => 'not json at all'),
    );

    expect(error.message).toMatch(/not valid JSON/);
  });

  it('yields a non-ENOENT read failure as its original self, never wrapped', async () => {
    const error = unwrapErr(
      await readActiveClaimsFile('active-claims.json', () => Promise.reject(permissionFailure)),
    );

    expect(error).toBe(permissionFailure);
  });

  it('crashes on a non-Error throwable — the anomaly is surfaced, never accommodated', async () => {
    // Owner ruling 2026-07-20: a value that is not an Error instance is the
    // system reporting a problem; it must cause an exception (with the
    // original preserved as cause), not flow through the Result channel.
    const structural: Error = { name: 'Error', message: 'not an instance' };

    await expect(
      readActiveClaimsFile('active-claims.json', () => Promise.reject(structural)),
    ).rejects.toThrow('non-Error value thrown at the state-file read boundary');
  });

  it('crashes on a non-Error throwable even when it carries an ENOENT-shaped code — the code never buys enrichment', async () => {
    const structural: Error = { name: 'Error', message: 'shaped like fs, not an instance' };

    await expect(
      readActiveClaimsFile('active-claims.json', () =>
        Promise.reject(Object.assign(structural, { code: 'ENOENT' })),
      ),
    ).rejects.toThrow('non-Error value thrown at the state-file read boundary');
  });
});

describe('readClosedClaimsFile on a fresh checkout', () => {
  it('yields an Err whose message embeds the complete archive seed behind a verify-first instruction', async () => {
    const error = unwrapErr(await readClosedClaimsFile('closed-claims.archive.json', missingFile));

    expect(error.message).toContain('closed-claims archive not found');
    expect(error.message).toContain('untracked-by-design');
    expect(error.message).toContain('FIRST verify the path');
    expect(error.message).toContain(EMPTY_CLOSED_CLAIMS_ARCHIVE_JSON);
  });

  it('accepts a file seeded with exactly the content the error prescribes', async () => {
    const archive = unwrapOrThrow(
      await readClosedClaimsFile(
        'closed-claims.archive.json',
        async () => EMPTY_CLOSED_CLAIMS_ARCHIVE_JSON,
      ),
    );

    expect(archive.claims).toEqual([]);
  });
});

// The claims lifecycle commands reach the registry through the
// transactional updaters, not the plain readers. Each updater's
// pre-transaction reads surface the same seed-bearing errors before any
// lock is taken; the in-transaction reads route through the SAME reader
// implementation, so the deeper failure contract is proven once above.

describe('updateActiveClaimsFile on a fresh checkout', () => {
  it('rejects with the seed-bearing error before entering the transaction (the claims open path)', async () => {
    await expect(
      updateActiveClaimsFile({
        activePath: 'active-claims.json',
        transform: (registry) => registry,
        readTextFile: missingFile,
      }),
    ).rejects.toThrow(EMPTY_ACTIVE_CLAIMS_REGISTRY_JSON);
  });
});

describe('updateClaimStateFiles on a fresh checkout', () => {
  it('rejects with the seed-bearing error before entering the transaction (the claims close path)', async () => {
    // Both files missing (one constant branch-free fake): the preflight
    // fires on the registry first, proving the updater surfaces seeding
    // errors BEFORE any lock is taken. The archive leg routes through the
    // same single reader implementation proven above; a regression to
    // in-transaction raw reads would fail this assertion (the rejection
    // would no longer carry the seed message).
    await expect(
      updateClaimStateFiles({
        activePath: 'active-claims.json',
        closedPath: 'closed-claims.archive.json',
        transform: (state) => state,
        readTextFile: missingFile,
      }),
    ).rejects.toThrow(EMPTY_ACTIVE_CLAIMS_REGISTRY_JSON);
  });
});
