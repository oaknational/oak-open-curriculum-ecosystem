import { describe, expect, it } from 'vitest';

import { bindingNote, bindsHead, NO_CONTENT, reviewBinds } from './content-binding.js';
import type { ContentId, ContentLeg } from './content-binding.js';
import { syntheticPatchId } from './content-fixture.js';

/**
 * A review binds the head exactly, or by content: its reviewed commit carries
 * the same patch against the base as the head (a pure sync). Anything unread
 * or unequal leaves it unbound. The ids are synthetic.
 */

const HEAD = 'b'.repeat(40);
const REVIEWED = 'a'.repeat(40);
const OTHER = 'c'.repeat(40);
const PATCH = syntheticPatchId('1');
const OTHER_PATCH = syntheticPatchId('f');

function read(reviewed: Readonly<Record<string, ContentId>>): ContentLeg {
  return {
    kind: 'read',
    head: PATCH,
    reviewed: Object.entries(reviewed).map(([oid, content]) => ({ oid, content })),
  };
}

describe('bindsHead', () => {
  it('binds a review of the head commit exactly, whatever was read', () => {
    expect(bindsHead({ commitOid: HEAD }, HEAD, NO_CONTENT)).toStrictEqual({ kind: 'exact' });
  });

  it('binds a review of an earlier commit by content when its patch equals the head’s', () => {
    const content = read({ [REVIEWED]: { kind: 'id', id: PATCH } });
    expect(bindsHead({ commitOid: REVIEWED }, HEAD, content)).toStrictEqual({
      kind: 'content',
      id: PATCH,
    });
  });

  it.each<[string, string, ContentLeg]>([
    [
      'its patch differs from the head’s',
      REVIEWED,
      read({ [REVIEWED]: { kind: 'id', id: OTHER_PATCH } }),
    ],
    ['it names no commit, even with content read', '', read({ '': { kind: 'id', id: PATCH } })],
    ['the head’s content was not read', REVIEWED, { kind: 'unread', reason: 'empty diff' }],
    ['its commit was not read', REVIEWED, read({ [OTHER]: { kind: 'id', id: PATCH } })],
    [
      'its content is unproven',
      REVIEWED,
      read({ [REVIEWED]: { kind: 'unproven', reason: 'gh failed' } }),
    ],
  ])('leaves a review unbound when %s', (_why, commitOid, content) => {
    expect(bindsHead({ commitOid }, HEAD, content)).toStrictEqual({ kind: 'unbound' });
  });
});

describe('reviewBinds and bindingNote', () => {
  const head = { headRefOid: HEAD, content: read({ [REVIEWED]: { kind: 'id', id: PATCH } }) };

  it('binds a review of the head, or of an earlier commit with the same content, and no other', () => {
    expect(
      [HEAD, REVIEWED, OTHER].map((commitOid) => reviewBinds({ commitOid }, head)),
    ).toStrictEqual([true, true, false]);
  });

  it('names the content inference with the id and both commits, unless a review binds exactly', () => {
    const note = bindingNote([{ commitOid: REVIEWED }], head);
    expect(note).toContain('bound by content');
    expect([PATCH, REVIEWED, HEAD].every((id) => note.includes(id.slice(0, 10)))).toBe(true);
    expect(bindingNote([{ commitOid: REVIEWED }, { commitOid: HEAD }], head)).toBe('');
    expect(bindingNote([], head)).toBe('');
  });
});
