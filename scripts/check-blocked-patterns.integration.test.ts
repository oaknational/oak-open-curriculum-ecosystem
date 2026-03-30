import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  buildPreToolUseDenyResponse,
  loadBlockedPatterns,
  runPreToolUseGuard,
} from './check-blocked-patterns.mjs';

describe('loadBlockedPatterns', () => {
  it('loads blocked patterns from a policy file', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'hook-policy-'));

    try {
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
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });
});

describe('runPreToolUseGuard', () => {
  it('writes a deny payload when the command matches a blocked pattern', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'hook-policy-'));

    try {
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
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });
});
