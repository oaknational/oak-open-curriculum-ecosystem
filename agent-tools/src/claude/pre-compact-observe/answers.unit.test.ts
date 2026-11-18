import { describe, expect, it } from 'vitest';

import { failOpenAnswer, probeAnswer } from './answers.js';

const MARKER = '2026-09-16T10-11-12-345Z-1a2b3c4d';

describe('probeAnswer', () => {
  it('parses to exactly continue true and the prefixed marker', () => {
    const answer: unknown = JSON.parse(probeAnswer(MARKER));

    expect(answer).toStrictEqual({
      continue: true,
      systemMessage: `[pre-compact-observe] ${MARKER}`,
    });
  });
});

describe('failOpenAnswer', () => {
  it('still says continue true, and gives the reason', () => {
    const answer: unknown = JSON.parse(failOpenAnswer('CLAUDE_PROJECT_DIR is unset'));

    expect(answer).toStrictEqual({
      continue: true,
      systemMessage: '[pre-compact-observe] observation failed: CLAUDE_PROJECT_DIR is unset',
    });
  });
});

describe('failOpenAnswer with a long reason', () => {
  it('caps the reason at 200 characters, marks the cut, and still answers in one line', () => {
    const line = failOpenAnswer('x'.repeat(300));
    const answer: unknown = JSON.parse(line);

    expect(line.indexOf('\n')).toBe(line.length - 1);
    expect(answer).toStrictEqual({
      continue: true,
      systemMessage: `[pre-compact-observe] observation failed: ${'x'.repeat(199)}…`,
    });
  });

  it('keeps a reason of exactly 200 characters whole', () => {
    const reason = 'x'.repeat(200);

    const answer: unknown = JSON.parse(failOpenAnswer(reason));

    expect(answer).toStrictEqual({
      continue: true,
      systemMessage: `[pre-compact-observe] observation failed: ${reason}`,
    });
  });
});

describe('each answer', () => {
  it.each([
    { label: 'the probe answer', line: probeAnswer(MARKER) },
    {
      label: 'a fail-open answer whose reason spans lines',
      line: failOpenAnswer('first line\nsecond line'),
    },
  ])('is $label written as exactly one newline-terminated line', ({ line }) => {
    expect(line.indexOf('\n')).toBe(line.length - 1);
  });
});
