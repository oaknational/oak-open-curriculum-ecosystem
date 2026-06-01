import { describe, expect, it } from 'vitest';

import { assembleMessage, parseArgs } from './check-commit-message.js';

describe('parseArgs', () => {
  it('collects repeated -m paragraphs', () => {
    expect(parseArgs(['-m', 'feat(scope): subject', '-m', 'body'])).toStrictEqual({
      kind: 'messages',
      msgs: ['feat(scope): subject', 'body'],
    });
  });

  it('reads from a file with -F', () => {
    expect(parseArgs(['-F', '.git/COMMIT_EDITMSG'])).toStrictEqual({
      kind: 'file',
      file: '.git/COMMIT_EDITMSG',
    });
  });

  it('defaults to stdin with no flags', () => {
    expect(parseArgs([])).toStrictEqual({ kind: 'stdin' });
  });

  it('treats -m and -F as mutually exclusive', () => {
    const parsed = parseArgs(['-m', 'subject', '-F', 'file']);
    expect(parsed.kind).toBe('error');
  });

  it('errors when -m has no value', () => {
    expect(parseArgs(['-m']).kind).toBe('error');
  });

  it('errors on an unknown argument', () => {
    const parsed = parseArgs(['--nope']);
    expect(parsed.kind).toBe('error');
    if (parsed.kind === 'error') {
      expect(parsed.message).toContain('unknown argument: --nope');
    }
  });

  it('reports help as a usage error', () => {
    expect(parseArgs(['--help']).kind).toBe('error');
  });
});

describe('assembleMessage', () => {
  it('joins paragraphs with a blank line and a trailing newline', () => {
    expect(assembleMessage(['feat(scope): subject', 'body'])).toBe(
      'feat(scope): subject\n\nbody\n',
    );
  });

  it('renders a single paragraph with a trailing newline', () => {
    expect(assembleMessage(['feat(scope): subject'])).toBe('feat(scope): subject\n');
  });
});
