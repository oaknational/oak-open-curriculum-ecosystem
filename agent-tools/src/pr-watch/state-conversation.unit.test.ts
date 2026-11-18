import { describe, expect, it } from 'vitest';

import { parseCommentsHarvest, parseCommitsHarvest } from './state-conversation.js';

/**
 * The conversation legs of `pr state`, each the slurped pages of a paginated
 * GraphQL harvest: the top-level comments (the surface a reviewer's
 * completion comment lands on) with their last edit, and the pull
 * request's commits. Shapes follow the reads on pull request 168
 * (2026-09-20; that pull request's description records them).
 */

const HEAD = 'f'.repeat(40);

interface CommentNode {
  readonly id: string;
  readonly url: string | undefined;
  readonly author: { readonly login: string } | null;
  readonly body: string;
  readonly createdAt: string;
  readonly lastEditedAt: string | null | undefined;
  readonly editor: { readonly login: string } | null | undefined;
}

const CODEX_NODE: CommentNode = {
  id: 'IC_kwDORdPTys8AAAABVt01ww',
  url: 'https://github.com/acme/widgets/pull/42#issuecomment-2',
  author: { login: 'chatgpt-codex-connector' },
  body: "Codex Review: Didn't find any major issues. :rocket:\n\n**Reviewed commit:** `7a9cd61414`\n",
  createdAt: '2026-09-20T20:02:19Z',
  lastEditedAt: null,
  editor: null,
};

function commentsPage(nodes: readonly CommentNode[]): unknown {
  return { data: { repository: { pullRequest: { comments: { nodes } } } } };
}

function commitsPage(oids: readonly string[]): unknown {
  return {
    data: {
      repository: {
        pullRequest: { commits: { nodes: oids.map((oid) => ({ commit: { oid } })) } },
      },
    },
  };
}

describe('parseCommentsHarvest', () => {
  it('reads the pages as completion-comment candidates in the connection order', () => {
    const earlier = {
      ...CODEX_NODE,
      id: 'IC_1',
      url: 'https://github.com/acme/widgets/pull/42#issuecomment-1',
      createdAt: '2026-09-20T19:46:32Z',
    };

    expect(
      parseCommentsHarvest([commentsPage([earlier]), commentsPage([CODEX_NODE])]),
    ).toStrictEqual([
      {
        id: 'IC_1',
        url: 'https://github.com/acme/widgets/pull/42#issuecomment-1',
        author: 'chatgpt-codex-connector',
        body: CODEX_NODE.body,
        createdAt: '2026-09-20T19:46:32Z',
        lastEdit: null,
      },
      {
        id: 'IC_kwDORdPTys8AAAABVt01ww',
        url: 'https://github.com/acme/widgets/pull/42#issuecomment-2',
        author: 'chatgpt-codex-connector',
        body: CODEX_NODE.body,
        createdAt: '2026-09-20T20:02:19Z',
        lastEdit: null,
      },
    ]);
  });

  it("reads a comment's last edit: when, and by whom", () => {
    const parsed = parseCommentsHarvest([
      commentsPage([
        {
          ...CODEX_NODE,
          lastEditedAt: '2026-09-20T20:05:00Z',
          editor: { login: 'octocat' },
        },
      ]),
    ]);

    expect(parsed[0]?.lastEdit).toStrictEqual({ at: '2026-09-20T20:05:00Z', by: 'octocat' });
  });

  it("names an edit by a deleted account as by 'unknown'", () => {
    const parsed = parseCommentsHarvest([
      commentsPage([{ ...CODEX_NODE, lastEditedAt: '2026-09-20T20:05:00Z', editor: null }]),
    ]);

    expect(parsed[0]?.lastEdit).toStrictEqual({ at: '2026-09-20T20:05:00Z', by: 'unknown' });
  });

  it("names a deleted account's comment as by 'unknown'", () => {
    const parsed = parseCommentsHarvest([commentsPage([{ ...CODEX_NODE, author: null }])]);

    expect(parsed[0]?.author).toBe('unknown');
  });

  it('reads no comments from a harvest of one empty page', () => {
    expect(parseCommentsHarvest([commentsPage([])])).toStrictEqual([]);
  });

  it.each([
    ['an empty page array', [], /too small/iu],
    ['a node without its url', [commentsPage([{ ...CODEX_NODE, url: undefined }])], /url/u],
    [
      'a node without its edit timestamp',
      [commentsPage([{ ...CODEX_NODE, lastEditedAt: undefined }])],
      /lastEditedAt/u,
    ],
    [
      'a node without its editor',
      [commentsPage([{ ...CODEX_NODE, editor: undefined }])],
      /editor/u,
    ],
    [
      'a node whose creation time is not a timestamp',
      [commentsPage([{ ...CODEX_NODE, createdAt: 'yesterday' }])],
      /createdAt/u,
    ],
  ])(
    'fails loud on %s: a misshapen harvest never reads as empty or as unedited',
    (_name, payload, leg) => {
      expect(() => parseCommentsHarvest(payload)).toThrow(leg);
    },
  );
});

describe('parseCommitsHarvest', () => {
  it('flattens the slurped pages into the full SHAs in the connection order', () => {
    const older = 'e'.repeat(40);

    expect(parseCommitsHarvest([commitsPage([older]), commitsPage([HEAD])])).toStrictEqual([
      older,
      HEAD,
    ]);
  });

  it('fails loud on an empty page array: an empty harvest must be a real empty page', () => {
    expect(() => parseCommitsHarvest([])).toThrow(/too small/iu);
  });
});
