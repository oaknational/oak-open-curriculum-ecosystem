import { describe, expect, it } from 'vitest';

import { readPreCompactPayload, type StdinRead } from './payload.js';

function stdinText(text: string): StdinRead {
  return { kind: 'read', text };
}

const USED_FIELDS = {
  session_id: 'session-1',
  transcript_path: '/work/transcripts/session-1.jsonl',
  cwd: '/work/project',
  hook_event_name: 'PreCompact',
  trigger: 'manual',
  custom_instructions: 'keep the plan in view',
};

describe('readPreCompactPayload', () => {
  it('validates the fields the observer uses', () => {
    const payload = readPreCompactPayload(stdinText(JSON.stringify(USED_FIELDS)));

    expect(payload).toStrictEqual({
      status: 'ok',
      topLevelKeys: [
        'session_id',
        'transcript_path',
        'cwd',
        'hook_event_name',
        'trigger',
        'custom_instructions',
      ],
      fields: USED_FIELDS,
      mismatchedFields: [],
    });
  });

  it('accepts the payload a bare /compact sends, and lists its undocumented keys', () => {
    const bareCompact = {
      ...USED_FIELDS,
      custom_instructions: null,
      scratchpad_dir: '/work/scratchpad',
      prompt_id: 'prompt-1',
    };

    const payload = readPreCompactPayload(stdinText(JSON.stringify(bareCompact)));

    expect(payload).toStrictEqual({
      status: 'ok',
      topLevelKeys: [
        'session_id',
        'transcript_path',
        'cwd',
        'hook_event_name',
        'trigger',
        'custom_instructions',
        'scratchpad_dir',
        'prompt_id',
      ],
      fields: { ...USED_FIELDS, custom_instructions: null },
      mismatchedFields: [],
    });
  });

  it('keeps every valid field when another carries the wrong type, and names the one that did', () => {
    const mistyped = JSON.stringify({ ...USED_FIELDS, trigger: 7 });

    const payload = readPreCompactPayload(stdinText(mistyped));

    expect(payload.status).toBe('schema-mismatch');
    expect(payload.mismatchedFields).toStrictEqual(['trigger']);
    expect(payload.fields).toStrictEqual({
      session_id: USED_FIELDS.session_id,
      transcript_path: USED_FIELDS.transcript_path,
      cwd: USED_FIELDS.cwd,
      hook_event_name: USED_FIELDS.hook_event_name,
      custom_instructions: USED_FIELDS.custom_instructions,
    });
  });

  it('treats an absent field as absent, not mismatched', () => {
    const payload = readPreCompactPayload(stdinText('{"session_id":"session-1"}'));

    expect(payload).toStrictEqual({
      status: 'ok',
      topLevelKeys: ['session_id'],
      fields: { session_id: 'session-1' },
      mismatchedFields: [],
    });
  });

  it('records an unknown top-level key as a name only, never consuming it as structure', () => {
    const text =
      '{"__proto__":{"session_id":"from-the-prototype"},"future_key":{"cwd":"nested"},"cwd":"/work/project"}';

    const payload = readPreCompactPayload(stdinText(text));

    expect(payload).toStrictEqual({
      status: 'ok',
      topLevelKeys: ['__proto__', 'future_key', 'cwd'],
      fields: { cwd: '/work/project' },
      mismatchedFields: [],
    });
  });

  it('reports unparseable input as a status rather than throwing', () => {
    expect(readPreCompactPayload(stdinText('{"session_id":'))).toStrictEqual({
      status: 'unparseable-json',
      topLevelKeys: [],
      fields: {},
      mismatchedFields: [],
    });
  });

  it.each([
    { label: 'nothing', text: '' },
    { label: 'whitespace only', text: ' \n\t ' },
  ])('reports a payload of $label as empty, distinctly from a broken one', ({ text }) => {
    expect(readPreCompactPayload(stdinText(text))).toStrictEqual({
      status: 'empty',
      topLevelKeys: [],
      fields: {},
      mismatchedFields: [],
    });
  });

  it.each([
    { label: 'an array', text: '[{"session_id":"session-1"}]' },
    { label: 'a number', text: '42' },
    { label: 'null', text: 'null' },
    { label: 'a string', text: '"session-1"' },
  ])('reports valid JSON that is $label as a schema mismatch', ({ text }) => {
    expect(readPreCompactPayload(stdinText(text))).toStrictEqual({
      status: 'schema-mismatch',
      topLevelKeys: [],
      fields: {},
      mismatchedFields: [],
    });
  });

  it('reports a stdin that could not be read as unreadable', () => {
    const payload = readPreCompactPayload({
      kind: 'unreadable',
      reason: 'EISDIR: illegal operation on a directory, read',
    });

    expect(payload).toStrictEqual({
      status: 'stdin-unreadable',
      topLevelKeys: [],
      fields: {},
      mismatchedFields: [],
    });
  });
});
