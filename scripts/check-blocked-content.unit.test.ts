import { describe, expect, it } from 'vitest';

import {
  buildPreToolUseDenyResponse,
  extractContentPair,
  findAddedBlockedContent,
  parseHookInput,
  readStreamText,
} from './check-blocked-content.mjs';

describe('parseHookInput', () => {
  it('parses valid JSON text', () => {
    expect(parseHookInput('{"tool_name":"Write"}')).toStrictEqual({ tool_name: 'Write' });
  });

  it('throws a helpful error for invalid JSON', () => {
    expect(() => parseHookInput('{')).toThrow('Claude PreToolUse hook input was not valid JSON:');
  });
});

describe('extractContentPair', () => {
  it('extracts new_string and old_string from an Edit payload', () => {
    const hookInput = {
      tool_input: {
        new_string: 'const updated = true;',
        old_string: 'const original = true;',
      },
    };

    expect(extractContentPair(hookInput)).toStrictEqual({
      newContent: 'const updated = true;',
      priorContent: 'const original = true;',
    });
  });

  it('uses empty string as prior when Edit payload omits old_string', () => {
    const hookInput = {
      tool_input: {
        new_string: 'new content',
      },
    };

    expect(extractContentPair(hookInput)).toStrictEqual({
      newContent: 'new content',
      priorContent: '',
    });
  });

  it('extracts content from a Write payload with a non-existent file_path', () => {
    const hookInput = {
      tool_input: {
        content: 'file content here',
        file_path: '/tmp/does-not-exist-check-blocked-content-test.ts',
      },
    };

    expect(extractContentPair(hookInput)).toStrictEqual({
      newContent: 'file content here',
      priorContent: '',
    });
  });

  it('handles flattened payload shape (no tool_input wrapper)', () => {
    const hookInput = {
      new_string: 'flat new',
      old_string: 'flat old',
    };

    expect(extractContentPair(hookInput)).toStrictEqual({
      newContent: 'flat new',
      priorContent: 'flat old',
    });
  });

  it('accepts toolInput (camelCase) as alternative to tool_input', () => {
    const hookInput = {
      toolInput: {
        new_string: 'camel new',
        old_string: 'camel old',
      },
    };

    expect(extractContentPair(hookInput)).toStrictEqual({
      newContent: 'camel new',
      priorContent: 'camel old',
    });
  });

  it('throws when input has no writable content', () => {
    const hookInput = {
      tool_input: { command: 'echo hello' },
    };

    expect(() => extractContentPair(hookInput)).toThrow(
      'Claude PreToolUse hook input did not include writable content.',
    );
  });

  it('throws when input is not an object', () => {
    expect(() => extractContentPair('not an object')).toThrow(
      'Claude PreToolUse hook input was not an object.',
    );
  });
});

describe('findAddedBlockedContent', () => {
  it('detects a blocked pattern present in new content but absent from prior', () => {
    expect(findAddedBlockedContent('some forbidden-word here', '', ['forbidden-word'])).toBe(
      'forbidden-word',
    );
  });

  it('returns null when the blocked pattern already existed in prior content', () => {
    expect(
      findAddedBlockedContent('some forbidden-word here', 'already had forbidden-word', [
        'forbidden-word',
      ]),
    ).toBeNull();
  });

  it('returns null when no blocked pattern matches', () => {
    expect(findAddedBlockedContent('clean content', '', ['forbidden-word'])).toBeNull();
  });

  it('performs case-insensitive matching', () => {
    expect(findAddedBlockedContent('FORBIDDEN-WORD', '', ['forbidden-word'])).toBe(
      'forbidden-word',
    );
  });

  it('returns the first matching pattern when multiple match', () => {
    expect(findAddedBlockedContent('has alpha and beta', '', ['alpha', 'beta'])).toBe('alpha');
  });
});

describe('buildPreToolUseDenyResponse', () => {
  it('returns the structured deny payload Claude expects', () => {
    expect(buildPreToolUseDenyResponse('some-pattern')).toStrictEqual({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason:
          'Blocked by repo hook policy: content contains forbidden pattern "some-pattern". Only the project owner can use this pattern.',
      },
    });
  });
});

describe('readStreamText', () => {
  it('reads all text from an async iterable stream', async () => {
    async function* fakeStdin(): AsyncGenerator<Buffer> {
      yield Buffer.from('first ');
      yield Buffer.from('second');
    }

    await expect(readStreamText(fakeStdin())).resolves.toBe('first second');
  });

  it('returns empty string for an empty stream', async () => {
    async function* emptyStdin(): AsyncGenerator<Buffer> {
      // yields nothing
    }

    await expect(readStreamText(emptyStdin())).resolves.toBe('');
  });
});
