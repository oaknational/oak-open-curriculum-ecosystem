import { describe, expect, it } from 'vitest';

import { parseThreadId } from './codex-thread-id.js';

const V7_ID = '01a0cfaf-7914-72e2-afe7-fb2d0938eb94';

describe('parseThreadId', () => {
  it.each([
    ['a v7 id, the form Codex thread ids take', V7_ID],
    ['a v4 id', '3f2b8c1e-9d4a-4e6b-8a7c-1b2d3e4f5a6b'],
  ])('accepts %s', (_label, id) => {
    expect(parseThreadId(id)).toStrictEqual({ ok: true, value: id });
  });

  it.each([
    ['an option-shaped value', '--dangerously-bypass-approvals-and-sandbox'],
    ['a thread name', 'my-dialogue'],
    ['an uppercase UUID', V7_ID.toUpperCase()],
    ['a UUID with a leading space', ` ${V7_ID}`],
    ['a UUID with a trailing space', `${V7_ID} `],
    ['a UUID with an option appended', `${V7_ID}--x`],
    ['an empty value', ''],
  ])('refuses %s', (_label, raw) => {
    expect(parseThreadId(raw).ok).toBe(false);
  });
});
