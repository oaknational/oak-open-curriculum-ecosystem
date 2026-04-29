import { describe, expect, it } from 'vitest';

import { buildPreToolUseDenyResponse, runPreToolUseGuard } from './check-blocked-patterns.js';

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
      buildPreToolUseDenyResponse('git --no-verify'),
    );
  });
});
