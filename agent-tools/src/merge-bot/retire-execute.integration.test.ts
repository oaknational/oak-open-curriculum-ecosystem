import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  BRANCH,
  GRAPHQL_ERROR,
  LOCAL_REF,
  LOCAL_WORLD,
  MINT_ANSWERING,
  MINT_FAILING,
  OTHER,
  REMOTE_TIP,
  REMOTE_WORLD,
  refRead,
  runRetire,
  TOKEN,
  type GitWorld,
} from './test-helpers/retire-cli-double.js';

/**
 * The retire command's writes through the `merge-bot retire` front door,
 * where one constant answer decides them. The remote delete: the mint
 * answers or fails, GitHub answers every GraphQL call the same way for the
 * run, and each case checks the exit and the outcome kind and reason; one
 * case per output shape checks that the token reaches neither output
 * stream. The local deletes: git's port answers the in-use check,
 * read again before them, as failed or as naming a worktree (a constant
 * world standing for a worktree taken since the proof), or answers that a
 * compare-and-swap cannot run; each case checks the report. The outcomes
 * that need GitHub or git to change between calls (a delete that takes, one
 * accepted that changes nothing, one GitHub refuses with an error, a
 * read-back that fails, a branch re-created after its delete, a ref moved or
 * taken after its proof), and every check of where the refs are, run against
 * real git in the smokes.
 */

/** The remote delete over the branch merged everywhere: GitHub's one answer, and a mint that answers. */
function retireRemote(graphql: unknown, ...flags: string[]): ReturnType<typeof runRetire> {
  return runRetire(['--branch', BRANCH, ...flags], REMOTE_WORLD, { graphql, mint: MINT_ANSWERING });
}

describe('merge-bot retire, the remote delete', () => {
  it('refuses with exit 3 when the remote moved after its proof', async () => {
    const run = await retireRemote(refRead(OTHER), '--json');

    expect(run.exit).toBe(3);
    expect(JSON.parse(run.out)).toMatchObject({ kind: 'refused' });
    expect(run.out).toContain('moved');
  });

  it("refuses with exit 3 when the bot's repository has another default branch", async () => {
    const run = await retireRemote(refRead(REMOTE_TIP, 'trunk'), '--json');

    expect(run.exit).toBe(3);
    expect(JSON.parse(run.out)).toMatchObject({ kind: 'refused' });
    expect(run.out).toContain('trunk');
  });

  it('fails with exit 1 when the re-read at the mint fails', async () => {
    const run = await retireRemote(GRAPHQL_ERROR, '--json');

    expect(run.exit).toBe(1);
    expect(JSON.parse(run.out)).toMatchObject({ kind: 'failed' });
  });

  it('fails with exit 1, the token off both streams, when GitHub answers the delete with a body it does not recognise and the branch reads back unchanged', async () => {
    const run = await retireRemote(refRead(REMOTE_TIP), '--json');

    expect(run.exit).toBe(1);
    expect(JSON.parse(run.out)).toMatchObject({ kind: 'failed' });
    expect(run.out).toContain('did not accept');
    expect(`${run.out}${run.err}`).not.toContain(TOKEN);
  });

  it('keeps the token off both streams in human output after a mint', async () => {
    const run = await retireRemote(refRead(REMOTE_TIP));

    expect(run).toMatchObject({ exit: 1, out: '' });
    expect(run.err).toContain('did not accept');
    expect(run.err).not.toContain(TOKEN);
  });

  it('fails with exit 1, deleting nothing, when the mint fails', async () => {
    const run = await runRetire(['--branch', BRANCH, '--json'], REMOTE_WORLD, {
      graphql: refRead(REMOTE_TIP),
      mint: MINT_FAILING,
    });

    expect(run.exit).toBe(1);
    expect(JSON.parse(run.out)).toMatchObject({ kind: 'failed' });
    expect(run.out).toContain('minting the branch-retire token');
    expect(run.out).toContain('nothing was deleted');
  });
});

describe('merge-bot retire, the local deletes', () => {
  it('keeps both local names, exit 1, when the in-use check read again before them fails', async () => {
    const world: GitWorld = { ...LOCAL_WORLD, inUseBy: err(new Error('worktrees unread')) };
    const run = await runRetire(['--branch', BRANCH, '--json'], world);

    expect(run.exit).toBe(1);
    expect(JSON.parse(run.out)).toMatchObject({
      kind: 'partial',
      names: { tracking: { state: 'not-reached' }, local: { state: 'not-reached' } },
    });
    expect(run.out).toContain('worktrees unread');
  });

  it('keeps both local names, exit 1, when a worktree began using the branch after its proof', async () => {
    const world: GitWorld = { ...LOCAL_WORLD, inUseBy: ok(['late-lane']) };
    const run = await runRetire(['--branch', BRANCH, '--json'], world);

    expect(run.exit).toBe(1);
    expect(JSON.parse(run.out)).toMatchObject({ kind: 'partial' });
    expect(run.out).toContain('late-lane');
  });

  it('reports a local name unknown, exit 1, when its compare-and-swap cannot run', async () => {
    const swaps = new Map(LOCAL_WORLD.swaps).set(LOCAL_REF, err(new Error('git would not run')));
    const run = await runRetire(['--branch', BRANCH, '--json'], { ...LOCAL_WORLD, swaps });

    expect(run.exit).toBe(1);
    expect(JSON.parse(run.out)).toMatchObject({
      kind: 'partial',
      names: { local: { state: 'unknown' } },
    });
    expect(run.out).toContain('git would not run');
  });
});
