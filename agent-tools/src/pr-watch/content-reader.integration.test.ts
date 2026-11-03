import { describe, expect, it } from 'vitest';

import type { ContentLeg } from './content-binding.js';
import { syntheticPatchId, textHasher } from './content-fixture.js';
import { readContentLeg } from './content-reader.js';
import type { GhCommandExecutor } from './gh.js';

/**
 * The reader asks GitHub for each commit's diff against the base and hashes
 * it. The fake GitHub answers the compare endpoint with the diff media type,
 * for the repository and base it holds, as the API does, wherever those
 * arguments sit; anything else fails. Each fake diff is a patch-id's text,
 * which the fake hasher reads back. The oids are synthetic.
 */

const HEAD = 'b'.repeat(40);
const REVIEWED = 'a'.repeat(40);
const LOST = 'c'.repeat(40);
const ON_BASE = 'd'.repeat(40);
const HEAD_PATCH = syntheticPatchId('1');
const REVIEWED_PATCH = syntheticPatchId('2');
const DIFF_MEDIA = 'Accept: application/vnd.github.diff';

function github(
  diffs: ReadonlyMap<string, string>,
  held: { readonly repository: string; readonly base: string } = {
    repository: 'owner/name',
    base: 'engraph',
  },
): GhCommandExecutor {
  const prefix = `repos/${held.repository}/compare/refs/heads/${held.base}...`;
  return (_file, args) => {
    const endpoint = args.find((arg) => arg.startsWith(prefix));
    const diff = endpoint === undefined ? undefined : diffs.get(endpoint.slice(prefix.length));
    if (args[0] !== 'api' || !args.includes(DIFF_MEDIA) || diff === undefined) {
      throw new Error(`gh: HTTP 404 for ${args.join(' ')}`);
    }
    return diff;
  };
}

function read(
  run: GhCommandExecutor,
  reviewedOids: readonly string[],
  overrides: { readonly base?: string; readonly repo?: string | undefined } = {},
): ContentLeg {
  return readContentLeg({
    run,
    gh: '/usr/bin/gh',
    repo: 'owner/name',
    base: 'engraph',
    headRefOid: HEAD,
    reviewedOids,
    patchIdOf: textHasher,
    ...overrides,
  });
}

const BOTH = new Map([
  [HEAD, `${HEAD_PATCH}\n`],
  [REVIEWED, `${REVIEWED_PATCH}\n`],
]);

describe('readContentLeg', () => {
  it("reads the head's content and each earlier reviewed commit's from its diff against the base", () => {
    expect(read(github(BOTH), [REVIEWED])).toStrictEqual({
      kind: 'read',
      head: HEAD_PATCH,
      reviewed: [{ oid: REVIEWED, content: { kind: 'id', id: REVIEWED_PATCH } }],
    });
  });

  it('reads a commit whose diff is empty (its content already on the base) or unreadable as unproven', () => {
    const run = github(new Map([...BOTH, [ON_BASE, '\n']]));
    expect(read(run, [ON_BASE, LOST])).toMatchObject({
      reviewed: [
        { oid: ON_BASE, content: { kind: 'unproven', reason: 'the compare diff is empty' } },
        { oid: LOST, content: { kind: 'unproven', reason: 'the compare diff could not be read' } },
      ],
    });
  });

  it.each([
    ['a NUL, where patch-id stops reading the line', `+ok\u0000${REVIEWED_PATCH}\n`],
    ['U+FFFD, where the UTF-8 read lost bytes', `+caf\uFFFD ${REVIEWED_PATCH}\n`],
    [
      'a binary file, named only by abbreviated blob ids',
      `Binary files a/x and b/x differ\n${REVIEWED_PATCH}\n`,
    ],
  ])('reads a diff holding %s as unproven, never hashing it', (_what, diff) => {
    const run = github(new Map([...BOTH, [REVIEWED, diff]]));
    expect(read(run, [REVIEWED])).toMatchObject({
      reviewed: [
        {
          oid: REVIEWED,
          content: { kind: 'unproven', reason: 'the compare diff holds bytes the hash cannot see' },
        },
      ],
    });
  });

  it("reads no reviewed commit when the head's content is unproven", () => {
    const run = github(new Map([[REVIEWED, `${REVIEWED_PATCH}\n`]]));
    expect(read(run, [REVIEWED])).toStrictEqual({
      kind: 'unread',
      reason: 'the compare diff could not be read',
    });
  });

  it('keys the content by each distinct earlier commit, never the head or a review that names no commit', () => {
    expect(read(github(BOTH), [HEAD, '', REVIEWED, REVIEWED])).toMatchObject({
      kind: 'read',
      reviewed: [{ oid: REVIEWED }],
    });
  });

  it('reads an oid that is not a full commit id as unproven, although GitHub would answer it', () => {
    const run = github(new Map([...BOTH, ['abc1234', `${REVIEWED_PATCH}\n`]]));
    expect(read(run, ['abc1234'])).toMatchObject({
      reviewed: [
        { oid: 'abc1234', content: { kind: 'unproven', reason: 'not a full commit oid' } },
      ],
    });
  });

  it.each(['../engraph', '-engraph', 'main..engraph', 'engraph/', ''])(
    'refuses a base that is not a plain branch name, although GitHub would answer it: %j',
    (base) => {
      const run = github(BOTH, { repository: 'owner/name', base });
      expect(read(run, [REVIEWED], { base })).toStrictEqual({
        kind: 'unread',
        reason: 'the base ref is not a plain branch name',
      });
    },
  );

  it.each(['release/2026-09', 'v1.2', 'main'])('reads against a plain base name: %j', (base) => {
    const run = github(BOTH, { repository: 'owner/name', base });
    expect(read(run, [REVIEWED], { base })).toMatchObject({ kind: 'read', head: HEAD_PATCH });
  });

  it('reads the repository gh infers when none is named', () => {
    const run = github(BOTH, { repository: '{owner}/{repo}', base: 'engraph' });
    expect(read(run, [REVIEWED], { repo: undefined })).toMatchObject({
      kind: 'read',
      head: HEAD_PATCH,
    });
  });

  it('reads nothing when no review names an earlier commit', () => {
    expect(read(github(BOTH), [HEAD, ''])).toStrictEqual({
      kind: 'unread',
      reason: 'no review of an earlier commit',
    });
  });
});
