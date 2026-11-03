import assert from 'node:assert/strict';

import { describe, expect, it } from 'vitest';

import { readHarnessText } from './harness-text.js';
import { execOutputs, refusalRecords } from './test-helpers/seat-fixtures.js';

/** The refusal fixture's one tool output, as the harness wrote it (a string carrier). */
function observedRefusalOutput(): string {
  const [output] = execOutputs(refusalRecords());
  assert(output);
  const text = output.payload['output'];
  assert(typeof text === 'string' && text.length > 0);
  return text;
}

const NONCE = 'nonce-4e21';
const COMPLETED = 'Script completed\nWall time 0.1 seconds\nOutput:\n';
const FAILED = 'Script failed\nWall time 0.0 seconds\nOutput:\n';
const TERMINATED = 'Script terminated\nWall time 3.0 seconds\nOutput:\n';
const RUNNING = 'Script running with cell ID 7\nWall time 1.0 seconds\nOutput:\n';

/** Every wrapper the preamble settles on its own, crossed with what the program might print first. */
const SETTLED = [
  { wrapper: 'completed', preamble: COMPLETED },
  { wrapper: 'terminated', preamble: TERMINATED },
  { wrapper: 'running', preamble: RUNNING },
].flatMap((row) => [
  { ...row, name: 'bare', lead: '' },
  { ...row, name: 'after a Script error line the program printed', lead: 'Script error:\n' },
]);

/** The router's rendering of a refusal, as the code-mode wrapper appends it after `Script error:`. */
function debugRejected(commandLine: string, justification: string): string {
  const message = `\`${commandLine}\` rejected: ${justification}`;
  const literal = JSON.stringify(message);
  return `exec_command failed: CreateProcess { message: "Rejected(${literal.replaceAll('\\', '\\\\').replaceAll('"', String.raw`\"`)})" }`;
}

describe('readHarnessText reads a refusal by the exec policy', () => {
  it('reads the observed refusal: the judged command line alone', () => {
    const read = readHarnessText(observedRefusalOutput(), 'code-mode');
    assert(read.kind === 'text');
    expect(read.status).toBe('failed');
    expect(read.refusal).toStrictEqual({ commandLine: "/bin/zsh -lc 'git push origin HEAD'" });
    expect(read.truncated).toBe(false);
  });

  it.each([
    { name: 'a string', carry: (text: string): unknown => text },
    {
      name: "the harness's parts",
      carry: (text: string): unknown => [{ type: 'input_text', text }],
    },
    {
      name: 'a JSON string holding the parts',
      carry: (text: string): unknown => JSON.stringify([{ type: 'input_text', text }]),
    },
  ])('reads a code-mode refusal from $name carrier', ({ carry }) => {
    const text = `${FAILED}Script error:\n${debugRejected(`git push ${NONCE}`, `because ${NONCE}`)}`;
    const read = readHarnessText(carry(text), 'code-mode');
    assert(read.kind === 'text');
    expect(read.refusal).toStrictEqual({ commandLine: `git push ${NONCE}` });
  });

  it('reads a function-tool refusal from offset 0, in the bare and the rendered forms', () => {
    const bare = readHarnessText(
      `\`git push ${NONCE}\` rejected: because ${NONCE}`,
      'function-tool',
    );
    const rendered = readHarnessText(
      debugRejected(`git push ${NONCE}`, `because ${NONCE}`),
      'function-tool',
    );
    for (const read of [bare, rendered]) {
      assert(read.kind === 'text');
      expect(read.status).toBe('none');
      expect(read.refusal?.commandLine).toBe(`git push ${NONCE}`);
    }
  });

  it('reads a refused write_stdin as a refusal with no command line', () => {
    const read = readHarnessText(`write_stdin rejected: ${NONCE}`, 'function-tool');
    assert(read.kind === 'text');
    expect(read.refusal).toStrictEqual({ commandLine: '' });
  });

  it.each([
    { name: 'a completed preamble', text: `${COMPLETED}{"exit_code":0}` },
    {
      name: 'a failed preamble with a refusal after its Script error line',
      text: `${FAILED}Script error:\n${debugRejected(`git push ${NONCE}`, NONCE)}`,
    },
  ])(
    'reads a function-tool output that opens with $name as text with no wrapper and no refusal',
    ({ text }) => {
      const read = readHarnessText(text, 'function-tool');
      assert(read.kind === 'text');
      expect(read.status).toBe('none');
      expect(read.refusal).toBeUndefined();
    },
  );

  it.each(SETTLED)(
    'never reads the program’s own text: the same words under a $wrapper wrapper ($name) are no refusal',
    ({ wrapper, preamble, lead }) => {
      const printed = `${preamble}${lead}${debugRejected(`git push ${NONCE}`, NONCE)}`;
      const read = readHarnessText(printed, 'code-mode');
      assert(read.kind === 'text');
      expect(read.status).toBe(wrapper);
      expect(read.refusal).toBeUndefined();
    },
  );

  it('anchors after the last Script error line, not the first thing that looks like one', () => {
    const program = `Script error:\n${debugRejected(`git push ${NONCE}`, NONCE)}\n`;
    const harness = `Script error:\nTypeError: ${NONCE}`;
    const read = readHarnessText(`${FAILED}${program}${harness}`, 'code-mode');
    assert(read.kind === 'text');
    expect(read.status).toBe('failed');
    expect(read.refusal).toBeUndefined();
  });
});

describe('readHarnessText reads the wrapper and its truncation', () => {
  it.each([
    { text: `${COMPLETED}{"exit_code":0}`, status: 'completed' },
    { text: `${FAILED}Script error:\nTypeError: x`, status: 'failed' },
    { text: TERMINATED, status: 'terminated' },
    { text: `${RUNNING}partial`, status: 'running' },
    { text: `Chunk ID: a1\nProcess exited with code 0\nOutput:\n${NONCE}`, status: 'none' },
    { text: 'Script running with cell ID 7\npartial', status: 'none' },
  ])('reads the status $status', ({ text, status }) => {
    const read = readHarnessText(text, 'code-mode');
    assert(read.kind === 'text');
    expect(read.status).toBe(status);
  });

  it('reads a truncation marker after the anchor as truncated', () => {
    const read = readHarnessText(`${FAILED}Script error:\n…153 tokens truncated…`, 'code-mode');
    assert(read.kind === 'text');
    expect(read.truncated).toBe(true);
  });

  it('reads a truncation marker in a function-tool output as truncated', () => {
    const read = readHarnessText(`${NONCE}\nWarning: truncated output\n`, 'function-tool');
    assert(read.kind === 'text');
    expect(read.truncated).toBe(true);
  });

  it.each(SETTLED)(
    'does not read a truncation marker the program printed under a $wrapper wrapper ($name)',
    ({ preamble, lead }) => {
      const read = readHarnessText(`${preamble}${lead}…153 tokens truncated…`, 'code-mode');
      assert(read.kind === 'text');
      expect(read.truncated).toBe(false);
    },
  );

  it.each([
    { output: 42 },
    { output: { text: 'x' } },
    { output: [{ type: 'input_text' }] },
    { output: [{ text: 'Script completed\nWall time 0.1 seconds\nOutput:\n' }] },
    {
      output: [{ type: 'output_text', text: 'Script completed\nWall time 0.1 seconds\nOutput:\n' }],
    },
    { output: null },
  ])('reads an output that is neither text nor parts as malformed: $output', ({ output }) => {
    const read = readHarnessText(output, 'code-mode');
    expect(read.kind).toBe('malformed');
  });
});
