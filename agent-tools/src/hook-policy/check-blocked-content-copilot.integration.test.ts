import { describe, expect, it } from 'vitest';

import {
  CopilotPreToolUseDenyResponseSchema,
  buildCopilotPreToolUseDenyResponse,
  runPreToolUseContentGuard,
} from './check-blocked-content.js';

/** In-process stdin fake carrying one JSON hook request. */
async function* stdinFromJson(payload: unknown): AsyncGenerator<Buffer> {
  yield Buffer.from(JSON.stringify(payload));
}

/** Build the PascalCase-compatible input emitted for Copilot's custom patch tool. */
function copilotApplyPatch(patchAddition: string): unknown {
  return {
    hook_event_name: 'PreToolUse',
    session_id: 'copilot-session',
    timestamp: '2026-07-25T07:00:00.000Z',
    cwd: '/repo',
    tool_name: 'Edit',
    tool_input:
      `*** Begin Patch\n*** Update File: /repo/existing.md\n@@\n-old content\n` +
      `+${patchAddition}\n*** End Patch\n`,
  };
}

describe('runPreToolUseContentGuard with Copilot CLI input', () => {
  it('evaluates a raw apply_patch input and renders a native denial', async () => {
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    const result = await runPreToolUseContentGuard({
      stdin: stdinFromJson(copilotApplyPatch('secret-marker added')),
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
      blockedPatterns: ['secret-marker'],
      scopedBlocks: [],
      readPriorContent: () => '',
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stderrChunks).toStrictEqual([]);
    expect(
      CopilotPreToolUseDenyResponseSchema.parse(JSON.parse(stdoutChunks.join(''))),
    ).toStrictEqual(
      buildCopilotPreToolUseDenyResponse({
        kind: 'owner-marker',
        pattern: 'secret-marker',
      }),
    );
  });

  it('allows a clean raw apply_patch input', async () => {
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    const result = await runPreToolUseContentGuard({
      stdin: stdinFromJson(copilotApplyPatch('new clean content')),
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
      blockedPatterns: ['secret-marker'],
      scopedBlocks: [],
      readPriorContent: () => '',
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdoutChunks).toStrictEqual([]);
    expect(stderrChunks).toStrictEqual([]);
  });

  it('fails closed when the envelope matches no supported schema', async () => {
    const stderrChunks: string[] = [];

    const result = await runPreToolUseContentGuard({
      stdin: stdinFromJson({
        sessionId: 'copilot-session',
        cwd: '/repo',
        hook_event_name: 'PreToolUse',
        session_id: 'copilot-session',
        timestamp: '2026-07-25T07:00:00.000Z',
        tool_name: 'Edit',
        tool_input: 'not a patch document',
      }),
      stdout: { write: () => undefined },
      stderr: {
        write: (text: string) => {
          stderrChunks.push(text);
        },
      },
      blockedPatterns: [],
      scopedBlocks: [],
    });

    expect(result).toStrictEqual({ exitCode: 2 });
    expect(stderrChunks).toStrictEqual([
      expect.stringContaining('PreToolUse content input matched 0 supported schemas'),
    ]);
  });
});
