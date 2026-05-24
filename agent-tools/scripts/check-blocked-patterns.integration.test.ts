import { describe, expect, it } from 'vitest';

import {
  buildPreToolUseDenyResponse,
  findBlockedPattern,
  loadBlockedPatterns,
  runPreToolUseGuard,
} from './check-blocked-patterns.js';

describe('runPreToolUseGuard', () => {
  it('writes a deny payload when the command matches a blocked pattern', async () => {
    const stdout: string[] = [];
    const stderr: string[] = [];

    async function* stdin(): AsyncGenerator<Buffer> {
      yield Buffer.from(
        JSON.stringify({
          tool_name: 'Bash',
          tool_input: {
            command: 'git commit --no-verify',
          },
        }),
      );
    }

    await expect(
      runPreToolUseGuard({
        stdin: stdin(),
        stdout: {
          write(text: string) {
            stdout.push(text);
          },
        },
        stderr: {
          write(text: string) {
            stderr.push(text);
          },
        },
        blockedPatterns: ['git --no-verify'],
      }),
    ).resolves.toStrictEqual({ exitCode: 0 });

    expect(stderr).toStrictEqual([]);
    expect(JSON.parse(stdout.join(''))).toStrictEqual(
      buildPreToolUseDenyResponse({ pattern: 'git --no-verify' }),
    );
  });
});

describe('canonical policy: explicit-pathspec staging discipline (WS6)', () => {
  const expectedCitation = 'distilled.md §Stage by explicit pathspec';

  it('blocks `git add -A`, `git add --all`, and `git add .` and surfaces the doctrinal citation', async () => {
    const patterns = await loadBlockedPatterns();

    expect(findBlockedPattern('git add -A', patterns)).toStrictEqual({
      pattern: 'git add -A',
      citation: expectedCitation,
    });
    expect(findBlockedPattern('git add --all', patterns)).toStrictEqual({
      pattern: 'git add --all',
      citation: expectedCitation,
    });
    expect(findBlockedPattern('git add .', patterns)).toStrictEqual({
      pattern: 'git add .',
      citation: expectedCitation,
    });
  });

  it('does not block explicit-pathspec staging via the canonical policy', async () => {
    const patterns = await loadBlockedPatterns();

    expect(findBlockedPattern('git add packages/core/foo.ts', patterns)).toBeNull();
    expect(findBlockedPattern('git add ./packages/core/foo.ts', patterns)).toBeNull();
    expect(findBlockedPattern('git add .gitignore', patterns)).toBeNull();
  });
});
