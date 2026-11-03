import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  BRANCH,
  LOCAL_REF,
  LOCAL_TIP,
  LOCAL_WORLD,
  MAIN_SHA,
  mergedLocally,
  OTHER,
  REMOTE_WORLD,
  runRetire,
  TRACKING_REF,
  TRACKING_TIP,
  UNREADABLE,
  type GitWorld,
} from './test-helpers/retire-cli-double.js';

/**
 * The `merge-bot retire` front door over injected seams: git is the
 * command's port, answered by a constant world; the mint is a fake that
 * fails, so a run that reached it could not end as the refusal, usage error
 * or clean retirement its case reads. It proves the exit map, the `--json`
 * object, the bindings and refusals that mint nothing, and that a credential
 * in origin's URL reaches neither output stream. The remote delete's outcomes and the local deletes' failures
 * are `retire-execute.integration.test.ts`; the paths that change refs, and
 * every git reading, run against real git in the smokes.
 */

const withOrigin = (...urls: string[]): GitWorld => ({
  ...REMOTE_WORLD,
  originUrls: ok(urls),
});

describe('merge-bot retire, front door', () => {
  it('prints its usage on --help and exits 0', async () => {
    const run = await runRetire(['--help'], UNREADABLE);

    expect(run.exit).toBe(0);
    expect(run.out).toContain('merge-bot retire --branch');
  });

  it('exits 2 on a usage error', async () => {
    expect((await runRetire(['--json'], UNREADABLE)).exit).toBe(2);
  });

  it("exits 2 on a name git's ref grammar rejects", async () => {
    const run = await runRetire(['--branch', BRANCH], UNREADABLE, {
      branchArgSeams: { refFormatOracle: () => false },
    });

    expect(run.exit).toBe(2);
  });

  it('fails with exit 1, reading nothing, when no git binary can answer the ref grammar', async () => {
    const run = await runRetire(['--branch', BRANCH], UNREADABLE, {
      branchArgSeams: { pathExists: () => false },
    });

    expect(run.exit).toBe(1);
    expect(run.err).toContain('merge-bot retire:');
  });

  it('exits 2, minting nothing, when the bot identity cannot be read', async () => {
    const unreadable = (): string => {
      throw new Error('ENOENT: no merge-bot.json');
    };
    const run = await runRetire(['--branch', BRANCH], REMOTE_WORLD, {
      readConfigFileImpl: unreadable,
    });

    expect(run.exit).toBe(2);
  });

  it.each(['Main', 'HEAD', 'head', 'MASTER'])(
    'refuses the reserved name %s with exit 3, reading nothing and minting nothing',
    async (name) => {
      expect((await runRetire(['--branch', name], UNREADABLE)).exit).toBe(3);
    },
  );

  it.each(['git@github.com:someone-else/widgets.git', 'git@github.com:acme/widgets-fork.git'])(
    'refuses with exit 3, minting nothing, when origin (%s) is not the bot identity repository',
    async (url) => {
      const run = await runRetire(['--branch', BRANCH], withOrigin(url));

      expect(run.exit).toBe(3);
      expect(run.err).toContain('acme/widgets');
    },
  );

  it.each([
    'https://x-access-token:s3cret-in-url@github.com/someone-else/widgets.git',
    'https://s3cret-in-url@example.com/acme/widgets.git',
    'https://github.com/acme/widgets.git?access_token=s3cret-in-url',
  ])('never echoes a credential carried in origin URL, on either stream: %s', async (url) => {
    const run = await runRetire(['--branch', BRANCH], withOrigin(url));

    expect(run.exit).toBe(3);
    expect(`${run.out}${run.err}`).not.toContain('s3cret-in-url');
  });

  it.each([
    { origin: withOrigin(), says: 'no origin URL' },
    {
      origin: withOrigin(
        'https://github.com/acme/widgets.git',
        'https://github.com/acme/widgets-mirror.git',
      ),
      says: '2 URLs',
    },
    { origin: { ...REMOTE_WORLD, originUrls: err(new Error('origin unread')) }, says: 'unread' },
  ])(
    'fails with exit 1, minting nothing, when origin is not one readable URL ($says)',
    async ({ origin, says }) => {
      const run = await runRetire(['--branch', BRANCH], origin);

      expect(run.exit).toBe(1);
      expect(run.err).toContain(says);
    },
  );

  it('refuses with exit 3 when a tip is not on the default, naming the tip, minting nothing', async () => {
    const world = {
      ...REMOTE_WORLD,
      readings: ok({ ...mergedLocally(BRANCH), local: { sha: LOCAL_TIP, onBase: false } }),
    };
    const run = await runRetire(['--branch', BRANCH], world);

    expect(run.exit).toBe(3);
    expect(run.err).toContain(LOCAL_TIP);
  });

  it('fails with exit 1 when the readings cannot be read', async () => {
    const world = { ...LOCAL_WORLD, readings: err(new Error('the remote is unreadable')) };
    const run = await runRetire(['--branch', BRANCH], world);

    expect(run.exit).toBe(1);
    expect(run.err).toContain('the remote is unreadable');
  });

  it('retires the local names with exit 0 and no mint when the remote has no such branch', async () => {
    const run = await runRetire(['--branch', BRANCH, '--json'], LOCAL_WORLD);

    expect(run.exit).toBe(0);
    expect(JSON.parse(run.out)).toEqual({
      kind: 'retired',
      branch: BRANCH,
      base: { name: 'main', sha: MAIN_SHA },
      names: {
        remote: { state: 'absent' },
        tracking: { state: 'deleted', sha: TRACKING_TIP },
        local: { state: 'deleted', sha: LOCAL_TIP },
      },
    });
  });

  it.each([
    { ref: LOCAL_REF, name: 'local' },
    { ref: TRACKING_REF, name: 'tracking' },
  ])(
    'exits 1 as partial, reporting the $name ref kept at the sha it moved to',
    async ({ ref, name }) => {
      const swaps = new Map(LOCAL_WORLD.swaps).set(ref, ok({ kind: 'kept', sha: OTHER }));
      const run = await runRetire(['--branch', BRANCH, '--json'], { ...LOCAL_WORLD, swaps });

      expect(run.exit).toBe(1);
      expect(JSON.parse(run.out)).toMatchObject({
        kind: 'partial',
        names: { [name]: { state: 'kept', sha: OTHER } },
      });
    },
  );

  it('reports nothing to retire with exit 0 when the branch has no name anywhere', async () => {
    const world = {
      ...LOCAL_WORLD,
      readings: ok({ ...mergedLocally(BRANCH), local: undefined, tracking: undefined }),
    };

    expect((await runRetire(['--branch', BRANCH], world)).exit).toBe(0);
  });

  it("fails with exit 1 when nothing is left to retire but the branch's config section cannot be removed", async () => {
    const world = {
      ...LOCAL_WORLD,
      readings: ok({ ...mergedLocally(BRANCH), local: undefined, tracking: undefined }),
      removeConfig: err(new Error('config locked')),
    };
    const run = await runRetire(['--branch', BRANCH, '--json'], world);

    expect(run.exit).toBe(1);
    expect(JSON.parse(run.out)).toMatchObject({ kind: 'failed' });
    expect(run.out).toContain('config was left');
  });
});
