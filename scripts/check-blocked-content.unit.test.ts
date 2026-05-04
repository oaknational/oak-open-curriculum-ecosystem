import { describe, expect, it } from 'vitest';

import {
  buildPreToolUseDenyResponse,
  extractContentChange,
  findAddedBlockedContent,
  findAddedScopedBlock,
  isPathInScope,
  parseBlockedContentPolicy,
  parseHookInput,
  parseScopedContentBlocks,
  readStreamText,
} from './check-blocked-content.js';

describe('parseHookInput', () => {
  it('parses valid JSON text', () => {
    expect(parseHookInput('{"tool_name":"Write"}')).toStrictEqual({ tool_name: 'Write' });
  });

  it('throws a helpful error for invalid JSON', () => {
    expect(() => parseHookInput('{')).toThrow('Claude PreToolUse hook input was not valid JSON:');
  });
});

describe('extractContentChange', () => {
  it('extracts new_string and old_string from an Edit payload', () => {
    const hookInput = {
      tool_input: {
        new_string: 'const updated = true;',
        old_string: 'const original = true;',
      },
    };

    expect(extractContentChange(hookInput)).toStrictEqual({
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

    expect(extractContentChange(hookInput)).toStrictEqual({
      newContent: 'new content',
      priorContent: '',
    });
  });

  it('extracts content and prior file path from a Write payload', () => {
    const hookInput = {
      tool_input: {
        content: 'file content here',
        file_path: '/tmp/check-blocked-content-test.ts',
      },
    };

    expect(extractContentChange(hookInput)).toStrictEqual({
      newContent: 'file content here',
      priorContent: '',
      filePath: '/tmp/check-blocked-content-test.ts',
      priorFilePath: '/tmp/check-blocked-content-test.ts',
    });
  });

  it('extracts file_path from an Edit payload when present', () => {
    const hookInput = {
      tool_input: {
        new_string: 'new prose',
        old_string: 'old prose',
        file_path: '/repo/.agent/plans/example.plan.md',
      },
    };

    expect(extractContentChange(hookInput)).toStrictEqual({
      newContent: 'new prose',
      priorContent: 'old prose',
      filePath: '/repo/.agent/plans/example.plan.md',
    });
  });

  it('handles flattened payload shape (no tool_input wrapper)', () => {
    const hookInput = {
      new_string: 'flat new',
      old_string: 'flat old',
    };

    expect(extractContentChange(hookInput)).toStrictEqual({
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

    expect(extractContentChange(hookInput)).toStrictEqual({
      newContent: 'camel new',
      priorContent: 'camel old',
    });
  });

  it('throws when input has no writable content', () => {
    const hookInput = {
      tool_input: { command: 'echo hello' },
    };

    expect(() => extractContentChange(hookInput)).toThrow(
      'Claude PreToolUse hook input did not include writable content.',
    );
  });

  it('throws when input is not an object', () => {
    expect(() => extractContentChange('not an object')).toThrow(
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

  it('appends the doctrinal citation to the reason when supplied', () => {
    expect(
      buildPreToolUseDenyResponse(
        'carve out',
        'PDR-044; principles.md §Architectural Excellence Over Expediency',
      ),
    ).toStrictEqual({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason:
          'Blocked by repo hook policy: content contains forbidden pattern "carve out". Only the project owner can use this pattern. Citation: PDR-044; principles.md §Architectural Excellence Over Expediency.',
      },
    });
  });
});

describe('isPathInScope', () => {
  it('returns false when filePath is undefined', () => {
    expect(isPathInScope(undefined, ['.agent/'])).toBe(false);
  });

  it('matches a substring include path', () => {
    expect(isPathInScope('/repo/.agent/practice-core/PDR-x.md', ['.agent/practice-core/'])).toBe(
      true,
    );
  });

  it('matches a `**/*.suffix` include path via endsWith', () => {
    expect(isPathInScope('/repo/.agent/plans/foo.plan.md', ['**/*.plan.md'])).toBe(true);
  });

  it('returns false when no include path matches', () => {
    expect(isPathInScope('/repo/src/index.ts', ['.agent/practice-core/', '**/*.plan.md'])).toBe(
      false,
    );
  });

  it('returns false when an exclude path matches even if an include matches', () => {
    expect(
      isPathInScope('/repo/.agent/plans/foo.plan.md', ['.agent/'], ['/plans/foo.plan.md']),
    ).toBe(false);
  });
});

describe('findAddedScopedBlock', () => {
  const carveOutBlock = {
    pattern: 'carve out',
    include_paths: ['.agent/practice-core/', '**/*.plan.md'],
    exclude_paths: [],
    citation: 'PDR-044; principles.md §Architectural Excellence Over Expediency',
  };

  it('returns the block when the pattern is added on a path inside the include scope', () => {
    expect(
      findAddedScopedBlock(
        'we will carve out an exception here',
        'we will not yet decide',
        '/repo/.agent/plans/foo.plan.md',
        [carveOutBlock],
      ),
    ).toStrictEqual(carveOutBlock);
  });

  it('returns null when the pattern is added on a path outside the include scope', () => {
    expect(
      findAddedScopedBlock(
        'we will carve out an exception here',
        'we will not yet decide',
        '/repo/src/index.ts',
        [carveOutBlock],
      ),
    ).toBeNull();
  });

  it('returns null when the pattern already existed in prior content (even on doctrine paths)', () => {
    expect(
      findAddedScopedBlock(
        'we will carve out a tweak today',
        'we will carve out a tweak yesterday',
        '/repo/.agent/practice-core/foo.md',
        [carveOutBlock],
      ),
    ).toBeNull();
  });

  it('returns null when filePath is undefined', () => {
    expect(
      findAddedScopedBlock('we will carve out today', '', undefined, [carveOutBlock]),
    ).toBeNull();
  });

  it('honours exclude_paths so that doctrine-defining surfaces are not self-tripped', () => {
    const blockWithExclusion = {
      ...carveOutBlock,
      include_paths: ['.agent/'],
      exclude_paths: ['.agent/directives/principles.md'],
    };
    expect(
      findAddedScopedBlock(
        'add carve out to the trip-list',
        'old',
        '/repo/.agent/directives/principles.md',
        [blockWithExclusion],
      ),
    ).toBeNull();
  });
});

describe('findAddedScopedBlock — regex with context-aware exclusions (WS4)', () => {
  const shaBlock = {
    pattern: '\\b[a-f0-9]{7,40}\\b',
    kind: /** @type {'regex'} */ 'regex',
    include_paths: ['docs/architecture/architectural-decisions/', '.agent/practice-core/'],
    exclude_paths: [],
    excludes_inline_code: true,
    excludes_lines_with: ['(historical reference)'],
    citation: 'distilled.md §Moving targets do not belong in permanent docs',
  };

  it('returns the block when a 7-character hex SHA is added on a permanent-doc path', () => {
    expect(
      findAddedScopedBlock(
        'See commit abc1234 for the change.',
        'See some commit for the change.',
        '/repo/docs/architecture/architectural-decisions/ADR-x.md',
        [shaBlock],
      ),
    ).toStrictEqual(shaBlock);
  });

  it('returns the block when a 40-character SHA is added on a permanent-doc path', () => {
    const fortyCharSha = '0123456789abcdef0123456789abcdef01234567';
    expect(
      findAddedScopedBlock(
        `See commit ${fortyCharSha} for the change.`,
        'See some commit for the change.',
        '/repo/.agent/practice-core/PDR-x.md',
        [shaBlock],
      ),
    ).toStrictEqual(shaBlock);
  });

  it('does not detect a SHA wrapped in inline code (excludes_inline_code: true)', () => {
    expect(
      findAddedScopedBlock(
        'See commit `abc1234` for the change.',
        'See some commit for the change.',
        '/repo/docs/architecture/architectural-decisions/ADR-x.md',
        [shaBlock],
      ),
    ).toBeNull();
  });

  it('does not detect a SHA on a line containing the historical-reference marker', () => {
    expect(
      findAddedScopedBlock(
        'See commit abc1234 for the change. (historical reference)',
        'See some commit for the change.',
        '/repo/docs/architecture/architectural-decisions/ADR-x.md',
        [shaBlock],
      ),
    ).toBeNull();
  });

  it('does not detect a SHA inside a fenced code block', () => {
    const newContent = ['Some prose introducing context.', '```', 'abc1234', '```'].join('\n');
    expect(
      findAddedScopedBlock(
        newContent,
        'Some prose introducing context.',
        '/repo/docs/architecture/architectural-decisions/ADR-x.md',
        [shaBlock],
      ),
    ).toBeNull();
  });

  it('returns null when the SHA already existed in prior content (not a new addition)', () => {
    expect(
      findAddedScopedBlock(
        'See commit abc1234 — and another mention of abc1234.',
        'See commit abc1234 was the original.',
        '/repo/docs/architecture/architectural-decisions/ADR-x.md',
        [shaBlock],
      ),
    ).toBeNull();
  });

  it('does not detect a SHA on out-of-scope paths', () => {
    expect(
      findAddedScopedBlock(
        'See commit abc1234 for the change.',
        'See some commit for the change.',
        '/repo/src/index.ts',
        [shaBlock],
      ),
    ).toBeNull();
  });
});

describe('parseScopedContentBlocks', () => {
  it('returns an empty array when scoped_blocks is omitted', () => {
    expect(
      parseScopedContentBlocks({
        hooks: { preToolUseContent: { blocked_patterns: [] } },
      }),
    ).toStrictEqual([]);
  });

  it('parses a well-formed scoped block', () => {
    const block = {
      pattern: 'carve out',
      include_paths: ['.agent/practice-core/'],
      citation: 'PDR-044',
    };
    expect(
      parseScopedContentBlocks({
        hooks: { preToolUseContent: { scoped_blocks: [block] } },
      }),
    ).toStrictEqual([block]);
  });

  it('throws when an entry is missing the citation', () => {
    expect(() =>
      parseScopedContentBlocks({
        hooks: {
          preToolUseContent: {
            scoped_blocks: [{ pattern: 'carve out', include_paths: ['.agent/'] }],
          },
        },
      }),
    ).toThrow('hooks.preToolUseContent.scoped_blocks was malformed');
  });

  it('throws when include_paths is empty', () => {
    expect(() =>
      parseScopedContentBlocks({
        hooks: {
          preToolUseContent: {
            scoped_blocks: [{ pattern: 'carve out', include_paths: [], citation: 'x' }],
          },
        },
      }),
    ).toThrow('hooks.preToolUseContent.scoped_blocks was malformed');
  });

  it('throws when kind has an unsupported value', () => {
    expect(() =>
      parseScopedContentBlocks({
        hooks: {
          preToolUseContent: {
            scoped_blocks: [
              {
                pattern: 'carve out',
                kind: 'magic',
                include_paths: ['.agent/'],
                citation: 'x',
              },
            ],
          },
        },
      }),
    ).toThrow('hooks.preToolUseContent.scoped_blocks was malformed');
  });

  it('accepts a regex block with excludes_inline_code and excludes_lines_with', () => {
    const regexBlock = {
      pattern: '\\b[a-f0-9]{7,40}\\b',
      kind: 'regex',
      include_paths: ['docs/architecture/architectural-decisions/'],
      excludes_inline_code: true,
      excludes_lines_with: ['(historical reference)'],
      citation: 'distilled.md §Moving targets do not belong in permanent docs',
    };
    expect(
      parseScopedContentBlocks({
        hooks: { preToolUseContent: { scoped_blocks: [regexBlock] } },
      }),
    ).toStrictEqual([regexBlock]);
  });

  it('throws when a regex block has an unparseable pattern', () => {
    expect(() =>
      parseScopedContentBlocks({
        hooks: {
          preToolUseContent: {
            scoped_blocks: [
              {
                pattern: '[unclosed',
                kind: 'regex',
                include_paths: ['docs/'],
                citation: 'x',
              },
            ],
          },
        },
      }),
    ).toThrow('hooks.preToolUseContent.scoped_blocks was malformed');
  });

  it('throws when excludes_inline_code is not a boolean', () => {
    expect(() =>
      parseScopedContentBlocks({
        hooks: {
          preToolUseContent: {
            scoped_blocks: [
              {
                pattern: 'x',
                include_paths: ['docs/'],
                excludes_inline_code: 'yes',
                citation: 'x',
              },
            ],
          },
        },
      }),
    ).toThrow('hooks.preToolUseContent.scoped_blocks was malformed');
  });
});

describe('parseBlockedContentPolicy', () => {
  it('extracts blocked content patterns from policy data', () => {
    expect(
      parseBlockedContentPolicy({
        hooks: {
          preToolUseContent: {
            blocked_patterns: ['pattern-a', 'pattern-b'],
          },
        },
      }),
    ).toStrictEqual(['pattern-a', 'pattern-b']);
  });

  it('throws when policy data has no blocked_patterns array', () => {
    expect(() => parseBlockedContentPolicy({ hooks: {} })).toThrow(
      'The canonical hook policy did not contain hooks.preToolUseContent.blocked_patterns.',
    );
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
