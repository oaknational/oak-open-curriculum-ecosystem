import { describe, expect, it } from 'vitest';

import {
  buildPreToolUseDenyResponse,
  extractBashCommand,
  findBlockedPattern,
  parseBlockedPatternPolicy,
  parseHookInput,
} from './check-blocked-patterns.js';

describe('findBlockedPattern', () => {
  it('matches dangerous git flags even when arguments appear between tokens', () => {
    const blockedPatterns = ['git push --force', 'git reset --hard'];

    expect(findBlockedPattern('git push origin HEAD --force', blockedPatterns)).toStrictEqual({
      pattern: 'git push --force',
    });
    expect(findBlockedPattern('git reset HEAD~1 --hard', blockedPatterns)).toStrictEqual({
      pattern: 'git reset --hard',
    });
  });

  it('returns null when no blocked pattern matches', () => {
    expect(findBlockedPattern('pnpm lint', ['git push --force'])).toBeNull();
  });

  it('limits guardrail-bypass flags to git commands when the policy requires git', () => {
    expect(findBlockedPattern('git commit --no-verify', ['git --no-verify'])).toStrictEqual({
      pattern: 'git --no-verify',
    });
    expect(findBlockedPattern('pnpm publish --no-verify', ['git --no-verify'])).toBeNull();
  });

  it('carries the citation through when the entry is an object', () => {
    expect(
      findBlockedPattern('git add .', [
        { pattern: 'git add .', citation: 'distilled.md §Stage by explicit pathspec' },
      ]),
    ).toStrictEqual({
      pattern: 'git add .',
      citation: 'distilled.md §Stage by explicit pathspec',
    });
  });

  it('does not match `git add .` against explicit-pathspec staging', () => {
    const wildcardPattern = 'git add .';
    expect(findBlockedPattern('git add packages/core/foo.ts', [wildcardPattern])).toBeNull();
    expect(findBlockedPattern('git add ./packages/core/foo.ts', [wildcardPattern])).toBeNull();
    expect(findBlockedPattern('git add .gitignore', [wildcardPattern])).toBeNull();
  });
});

describe('extractBashCommand', () => {
  it('returns the Bash command from Claude hook input', () => {
    const hookInput = {
      tool_name: 'Bash',
      tool_input: {
        command: 'git commit --no-verify',
      },
    };

    expect(extractBashCommand(hookInput)).toBe('git commit --no-verify');
  });

  it('accepts command-bearing input from runners that flatten the payload', () => {
    const hookInput = {
      command: 'git push origin HEAD --force',
    };

    expect(extractBashCommand(hookInput)).toBe('git push origin HEAD --force');
  });

  it('throws when the hook input does not contain a Bash command', () => {
    const hookInput = {
      tool_name: 'Bash',
      tool_input: {},
    };

    expect(() => extractBashCommand(hookInput)).toThrow(
      'Claude PreToolUse hook input did not include a Bash command.',
    );
  });
});

describe('parseHookInput', () => {
  it('throws a helpful error for invalid JSON', () => {
    expect(() => parseHookInput('{')).toThrow('Claude PreToolUse hook input was not valid JSON:');
  });
});

describe('parseBlockedPatternPolicy', () => {
  it('extracts blocked command patterns from policy data', () => {
    expect(
      parseBlockedPatternPolicy({
        hooks: {
          preToolUse: {
            blocked_patterns: ['git push --force', 'git --no-verify'],
          },
        },
      }),
    ).toStrictEqual(['git push --force', 'git --no-verify']);
  });

  it('accepts entries that pair a pattern with a doctrinal citation', () => {
    expect(
      parseBlockedPatternPolicy({
        hooks: {
          preToolUse: {
            blocked_patterns: [
              'git push --force',
              { pattern: 'git add .', citation: 'distilled.md §Stage by explicit pathspec' },
            ],
          },
        },
      }),
    ).toStrictEqual([
      'git push --force',
      { pattern: 'git add .', citation: 'distilled.md §Stage by explicit pathspec' },
    ]);
  });

  it('throws when an object entry omits the pattern field', () => {
    expect(() =>
      parseBlockedPatternPolicy({
        hooks: {
          preToolUse: {
            blocked_patterns: [{ citation: 'orphan citation' }],
          },
        },
      }),
    ).toThrow('The canonical hook policy did not contain hooks.preToolUse.blocked_patterns.');
  });

  it('throws when an object entry has a non-string citation', () => {
    expect(() =>
      parseBlockedPatternPolicy({
        hooks: {
          preToolUse: {
            blocked_patterns: [{ pattern: 'git add .', citation: 42 }],
          },
        },
      }),
    ).toThrow('The canonical hook policy did not contain hooks.preToolUse.blocked_patterns.');
  });

  it('throws when policy data has no blocked_patterns array', () => {
    expect(() => parseBlockedPatternPolicy({ hooks: {} })).toThrow(
      'The canonical hook policy did not contain hooks.preToolUse.blocked_patterns.',
    );
  });
});

describe('buildPreToolUseDenyResponse', () => {
  it('returns the structured deny payload Claude expects', () => {
    expect(buildPreToolUseDenyResponse({ pattern: 'git push --force' })).toStrictEqual({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason:
          'Blocked by repo hook policy: matched dangerous pattern "git push --force".',
      },
    });
  });

  it('appends the doctrinal citation to the reason when present', () => {
    expect(
      buildPreToolUseDenyResponse({
        pattern: 'git add .',
        citation: 'distilled.md §Stage by explicit pathspec',
      }),
    ).toStrictEqual({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason:
          'Blocked by repo hook policy: matched dangerous pattern "git add .". Citation: distilled.md §Stage by explicit pathspec.',
      },
    });
  });
});
