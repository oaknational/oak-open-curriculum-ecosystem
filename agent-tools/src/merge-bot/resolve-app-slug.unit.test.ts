import { describe, expect, it } from 'vitest';

import { MERGE_BOT_CONFIG_RELATIVE_PATH } from './repo-config.js';
import { resolveMergeBotAppSlug } from './resolve-identity.js';

/**
 * The bot's login for an unavailability declaration comes from the clone's
 * merge-bot config at its primary checkout, the one authority for the bot
 * identity; a config that cannot be read is named, never guessed around.
 */

const PRIMARY =
  'worktree /repo\nHEAD 0000000000000000000000000000000000000000\nbranch refs/heads/main\n\n';
const CONFIG = JSON.stringify({ appId: '123', appSlug: 'el-graphael', repo: 'acme/widgets' });

describe('resolveMergeBotAppSlug', () => {
  it("reads the app slug from the clone's merge-bot config", () => {
    expect(
      resolveMergeBotAppSlug({
        repoRoot: '/repo/worktree',
        runGitImpl: () => PRIMARY,
        readConfigFileImpl: () => CONFIG,
      }),
    ).toStrictEqual({ ok: true, value: 'el-graphael' });
  });

  it('names the config when it cannot be read', () => {
    const slug = resolveMergeBotAppSlug({
      repoRoot: '/repo',
      runGitImpl: () => PRIMARY,
      readConfigFileImpl: () => {
        throw new Error('ENOENT');
      },
    });

    // The path is joined with the host's separator, as the message prints it.
    expect(slug.ok ? '' : slug.error.message).toContain(
      `merge-bot config not readable at ${MERGE_BOT_CONFIG_RELATIVE_PATH}`,
    );
  });
});
