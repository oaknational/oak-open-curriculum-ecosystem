import { err, isErr, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { resolveRefToCommitSha } from './git.js';

/**
 * Behaviour of the ref resolver with an injected git runner — no real git.
 * The resolver must yield the FULL sha (peeled to a commit) and fail loudly,
 * with the ref named and a remedy, when the ref does not resolve.
 */

const FULL_SHA = `219095${'e'.repeat(34)}`;

describe('resolveRefToCommitSha', () => {
  it('resolves the ref to its full trimmed commit sha via rev-parse --verify', () => {
    let receivedArgs: readonly string[] | undefined;
    let receivedCwd: string | undefined;

    const result = resolveRefToCommitSha({
      ref: 'origin/main',
      cwd: '/repo',
      runGit: (args, cwd) => {
        receivedArgs = args;
        receivedCwd = cwd;
        return ok(`${FULL_SHA}\n`);
      },
    });

    expect(result).toStrictEqual({ ok: true, value: FULL_SHA });
    expect(receivedArgs).toStrictEqual([
      'rev-parse',
      '--verify',
      '--end-of-options',
      'origin/main^{commit}',
    ]);
    expect(receivedCwd).toBe('/repo');
  });

  it('fails loudly, naming the ref and a remedy, when the ref does not resolve', () => {
    const result = resolveRefToCommitSha({
      ref: 'origin/nope',
      cwd: '/repo',
      runGit: () => err(new Error('fatal: Needed a single revision')),
    });

    expect(isErr(result)).toBe(true);
    const message = isErr(result) ? result.error.message : '';
    expect(message).toContain("cannot resolve ref 'origin/nope'");
    expect(message).toContain('fetch');
  });

  it('rejects git output that is not a full 40-hex sha', () => {
    const result = resolveRefToCommitSha({
      ref: 'origin/main',
      cwd: '/repo',
      runGit: () => ok('219095\n'),
    });

    expect(isErr(result)).toBe(true);
    expect(isErr(result) ? result.error.message : '').toContain('40-hex');
  });
});
