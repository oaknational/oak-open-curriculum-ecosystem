import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  buildPreToolUseDenyResponse,
  extractBashCommand,
  findBlockedPattern,
  loadBlockedPatterns,
  parseHookInput,
  runPreToolUseGuard,
} from './check-blocked-patterns.mjs';

describe('findBlockedPattern', () => {
  it('matches dangerous git flags even when arguments appear between tokens', () => {
    const blockedPatterns = ['git push --force', 'git reset --hard'];

    expect(findBlockedPattern('git push origin HEAD --force', blockedPatterns)).toBe(
      'git push --force',
    );
    expect(findBlockedPattern('git reset HEAD~1 --hard', blockedPatterns)).toBe('git reset --hard');
  });

  it('returns null when no blocked pattern matches', () => {
    expect(findBlockedPattern('pnpm lint', ['git push --force'])).toBeNull();
  });

  it('limits guardrail-bypass flags to git commands when the policy requires git', () => {
    expect(findBlockedPattern('git commit --no-verify', ['git --no-verify'])).toBe(
      'git --no-verify',
    );
    expect(findBlockedPattern('pnpm publish --no-verify', ['git --no-verify'])).toBeNull();
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

describe('loadBlockedPatterns', () => {
  it('loads blocked patterns from a policy file', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'hook-policy-'));
    const policyPath = path.join(tempDir, 'policy.json');

    await fs.writeFile(
      policyPath,
      JSON.stringify({
        hooks: {
          preToolUse: {
            blocked_patterns: ['git push --force', 'git --no-verify'],
          },
        },
      }),
    );

    await expect(loadBlockedPatterns(pathToFileURL(policyPath))).resolves.toStrictEqual([
      'git push --force',
      'git --no-verify',
    ]);

    await fs.rm(tempDir, { recursive: true, force: true });
  });
});

describe('runPreToolUseGuard', () => {
  it('writes a deny payload when the command matches a blocked pattern', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'hook-policy-'));
    const policyPath = path.join(tempDir, 'policy.json');
    const stdout: string[] = [];
    const stderr: string[] = [];

    await fs.writeFile(
      policyPath,
      JSON.stringify({
        hooks: {
          preToolUse: {
            blocked_patterns: ['git --no-verify'],
          },
        },
      }),
    );

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
        policyUrl: pathToFileURL(policyPath),
      }),
    ).resolves.toStrictEqual({ exitCode: 0 });

    expect(stderr).toStrictEqual([]);
    expect(JSON.parse(stdout.join(''))).toStrictEqual(
      buildPreToolUseDenyResponse('git --no-verify'),
    );

    await fs.rm(tempDir, { recursive: true, force: true });
  });
});

describe('buildPreToolUseDenyResponse', () => {
  it('returns the structured deny payload Claude expects', () => {
    expect(buildPreToolUseDenyResponse('git push --force')).toStrictEqual({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason:
          'Blocked by repo hook policy: matched dangerous pattern "git push --force".',
      },
    });
  });
});
