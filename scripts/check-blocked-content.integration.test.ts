import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  buildPreToolUseDenyResponse,
  extractContentPair,
  loadBlockedContentPatterns,
  runPreToolUseContentGuard,
} from './check-blocked-content.mjs';

describe('extractContentPair (filesystem)', () => {
  it('reads an existing file as prior content for a Write payload', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'check-blocked-'));

    try {
      const filePath = path.join(tempDir, 'existing.ts');
      await fs.writeFile(filePath, 'existing content');

      const hookInput = {
        tool_input: {
          content: 'replacement content',
          file_path: filePath,
        },
      };

      expect(extractContentPair(hookInput)).toStrictEqual({
        newContent: 'replacement content',
        priorContent: 'existing content',
      });
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });
});

describe('loadBlockedContentPatterns', () => {
  it('loads blocked content patterns from a policy file', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'hook-policy-'));

    try {
      const policyPath = path.join(tempDir, 'policy.json');

      await fs.writeFile(
        policyPath,
        JSON.stringify({
          hooks: {
            preToolUseContent: {
              blocked_patterns: ['pattern-a', 'pattern-b'],
            },
          },
        }),
      );

      await expect(loadBlockedContentPatterns(pathToFileURL(policyPath))).resolves.toStrictEqual([
        'pattern-a',
        'pattern-b',
      ]);
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('throws when the policy file has no blocked_patterns array', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'hook-policy-'));

    try {
      const policyPath = path.join(tempDir, 'policy.json');
      await fs.writeFile(policyPath, JSON.stringify({ hooks: {} }));

      await expect(loadBlockedContentPatterns(pathToFileURL(policyPath))).rejects.toThrow(
        'The canonical hook policy did not contain hooks.preToolUseContent.blocked_patterns.',
      );
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });
});

describe('runPreToolUseContentGuard', () => {
  it('writes a deny payload when new content introduces a blocked pattern', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'hook-policy-'));

    try {
      const policyPath = path.join(tempDir, 'policy.json');
      const stdoutChunks: string[] = [];
      const stderrChunks: string[] = [];

      await fs.writeFile(
        policyPath,
        JSON.stringify({
          hooks: {
            preToolUseContent: {
              blocked_patterns: ['secret-marker'],
            },
          },
        }),
      );

      async function* stdin(): AsyncGenerator<Buffer> {
        yield Buffer.from(
          JSON.stringify({
            tool_input: {
              new_string: 'code with secret-marker added',
              old_string: 'original code without marker',
            },
          }),
        );
      }

      const result = await runPreToolUseContentGuard({
        stdin: stdin(),
        stdout: {
          write: (text: string) => {
            stdoutChunks.push(text);
          },
        },
        stderr: {
          write: (text: string) => {
            stderrChunks.push(text);
          },
        },
        policyUrl: pathToFileURL(policyPath),
      });

      expect(result).toStrictEqual({ exitCode: 0 });
      expect(stderrChunks).toStrictEqual([]);
      expect(JSON.parse(stdoutChunks.join(''))).toStrictEqual(
        buildPreToolUseDenyResponse('secret-marker'),
      );
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('produces no output when the pattern already existed in prior content', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'hook-policy-'));

    try {
      const policyPath = path.join(tempDir, 'policy.json');
      const stdoutChunks: string[] = [];
      const stderrChunks: string[] = [];

      await fs.writeFile(
        policyPath,
        JSON.stringify({
          hooks: {
            preToolUseContent: {
              blocked_patterns: ['existing-marker'],
            },
          },
        }),
      );

      async function* stdin(): AsyncGenerator<Buffer> {
        yield Buffer.from(
          JSON.stringify({
            tool_input: {
              new_string: 'code with existing-marker still',
              old_string: 'code with existing-marker here',
            },
          }),
        );
      }

      const result = await runPreToolUseContentGuard({
        stdin: stdin(),
        stdout: {
          write: (text: string) => {
            stdoutChunks.push(text);
          },
        },
        stderr: {
          write: (text: string) => {
            stderrChunks.push(text);
          },
        },
        policyUrl: pathToFileURL(policyPath),
      });

      expect(result).toStrictEqual({ exitCode: 0 });
      expect(stdoutChunks).toStrictEqual([]);
      expect(stderrChunks).toStrictEqual([]);
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('returns exitCode 2 and writes to stderr on error', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'hook-policy-'));

    try {
      const policyPath = path.join(tempDir, 'policy.json');
      const stderrChunks: string[] = [];

      await fs.writeFile(
        policyPath,
        JSON.stringify({
          hooks: {
            preToolUseContent: {
              blocked_patterns: ['irrelevant'],
            },
          },
        }),
      );

      async function* stdin(): AsyncGenerator<Buffer> {
        yield Buffer.from('not valid json {{{');
      }

      const result = await runPreToolUseContentGuard({
        stdin: stdin(),
        stdout: { write: () => {} },
        stderr: {
          write: (text: string) => {
            stderrChunks.push(text);
          },
        },
        policyUrl: pathToFileURL(policyPath),
      });

      expect(result).toStrictEqual({ exitCode: 2 });
      expect(stderrChunks.length).toBe(1);
      expect(stderrChunks[0]).toContain('Claude PreToolUse hook input was not valid JSON:');
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });
});
