import { describe, expect, it } from 'vitest';

import { parseHandshake } from '../../src/collaboration-state/comms-wake-handshake';

const THREAD_ID = '01a0d96a-ea38-75a1-a6dc-769bc05a0828';

describe('parseHandshake', () => {
  it.each([
    ['the thread id alone', THREAD_ID],
    ['the thread id and one newline', `${THREAD_ID}\n`],
  ])('arms on %s', (_name, content) => {
    expect(parseHandshake(content)).toStrictEqual({ ok: true, value: THREAD_ID });
  });

  it.each([
    ['an empty file', ''],
    ['an uppercase id', THREAD_ID.toUpperCase()],
    ['a braced id', `{${THREAD_ID}}`],
    ['a URN', `urn:uuid:${THREAD_ID}`],
    ['an id without hyphens', THREAD_ID.replaceAll('-', '')],
    ['two ids', `${THREAD_ID}\n${THREAD_ID}\n`],
    ['a leading space', ` ${THREAD_ID}`],
    ['a trailing space', `${THREAD_ID} `],
    ['two newlines', `${THREAD_ID}\n\n`],
    ['a carriage return', `${THREAD_ID}\r\n`],
    ['a session name', 'my-codex-session'],
    ['an option', `--thread=${THREAD_ID}`],
    ['a NUL', `${THREAD_ID}\u0000`],
    ['a fullwidth digit', `\uFF10${THREAD_ID.slice(1)}`],
    ['a line separator', `${THREAD_ID}\u2028`],
  ])('refuses %s, so codex queue never looks the value up as a session name', (_name, content) => {
    expect(parseHandshake(content)).toStrictEqual({
      ok: false,
      error: { kind: 'not-one-thread-id' },
    });
  });
});
