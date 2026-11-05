import { assert, describe, expect, it } from 'vitest';

import type { GitCommandResult } from './git-executor.js';
import { readOriginUrls } from './retire-git-read.js';
import type { RetireGit } from './retire-git-run.js';

/**
 * The retire reads that run git through its injected executor, over one
 * constant answer each. A failed read is a failure, never an answer: a
 * config git cannot read is never read as no origin, while the one exit git
 * gives for a key that is not set is.
 */

function answered(status: number, stdout: string, stderr = ''): GitCommandResult {
  return { status, signal: null, stdout, stderr };
}

/** git answering every question with `result`: the one call each read here makes. */
function gitAnswering(result: GitCommandResult): RetireGit {
  return {
    git: { file: '/usr/bin/git', exec: () => Promise.resolve(result) },
    cwd: '/srv/repo',
    env: {},
  };
}

describe('readOriginUrls', () => {
  it('reads every configured URL in config order, trimmed', async () => {
    const urls = await readOriginUrls(
      gitAnswering(
        answered(0, 'https://github.com/acme/widgets.git\n git@github.com:acme/mirror.git \n'),
      ),
    );

    expect(urls).toEqual({
      ok: true,
      value: ['https://github.com/acme/widgets.git', 'git@github.com:acme/mirror.git'],
    });
  });

  it('reads exit 1, the key not set, as no URL', async () => {
    expect(await readOriginUrls(gitAnswering(answered(1, '')))).toEqual({ ok: true, value: [] });
  });

  it('reads a config git cannot read as a failure in git own words, never as no URL', async () => {
    const urls = await readOriginUrls(
      gitAnswering(answered(3, '', 'fatal: bad config line 2 in file .git/config')),
    );

    assert(!urls.ok);
    expect(urls.error.message).toContain('bad config line 2');
  });
});
