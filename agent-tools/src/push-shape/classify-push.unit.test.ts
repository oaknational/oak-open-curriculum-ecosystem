import { describe, expect, it } from 'vitest';

import { classifyPush } from './classify-push.js';

const ZERO = '0'.repeat(40);
const LOCAL = 'a'.repeat(40);
const REMOTE = 'b'.repeat(40);

/** One `pre-push` ref line that deletes `name` on the remote, as git writes it. */
const deletion = (name: string): string => `(delete) ${ZERO} refs/heads/${name} ${REMOTE}`;
/** One `pre-push` ref line that updates `name` on the remote. */
const update = (name: string): string => `refs/heads/${name} ${LOCAL} refs/heads/${name} ${REMOTE}`;
/** One `pre-push` ref line that creates `name` on the remote. */
const creation = (name: string): string => `refs/heads/${name} ${LOCAL} refs/heads/${name} ${ZERO}`;

describe('classifyPush', () => {
  it('reads a run git supplied no ref lines for as having nothing to classify', () => {
    expect(classifyPush('')).toBe('no-ref-lines');
    expect(classifyPush('\n  \n')).toBe('no-ref-lines');
  });

  it('reads a push that updates or creates refs as sending commits', () => {
    expect(classifyPush(update('lane'))).toBe('commits');
    expect(classifyPush(`${update('lane')}\n${creation('other')}\n`)).toBe('commits');
  });

  it('reads a push whose every ref is deleted as deletions only', () => {
    expect(classifyPush(deletion('lane'))).toBe('deletions-only');
    expect(classifyPush(`${deletion('lane')}\n${deletion('other')}\n`)).toBe('deletions-only');
  });

  it('reads a push that deletes one ref and sends commits to another as mixed', () => {
    expect(classifyPush(`${deletion('gone')}\n${update('lane')}`)).toBe('mixed');
    expect(classifyPush(`${creation('lane')}\n${deletion('gone')}`)).toBe('mixed');
  });

  it('reads a deletion in a SHA-256 repository by the shape of the object id', () => {
    const zero = '0'.repeat(64);
    expect(classifyPush(`(delete) ${zero} refs/heads/lane ${'c'.repeat(64)}`)).toBe(
      'deletions-only',
    );
  });

  // A line this cannot read is never taken for a deletion: the gates run.
  it('reads a line it cannot parse as sending commits', () => {
    expect(classifyPush('refs/heads/lane')).toBe('commits');
    expect(classifyPush(`${deletion('gone')}\nnot a ref line`)).toBe('mixed');
  });
});
