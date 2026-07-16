import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { parsePostToolBatchInput } from '../../src/codex-hook-review/hook-input.js';

const projectDir = '/workspace/oak';

function parse(value: unknown) {
  return parsePostToolBatchInput({ rawInput: JSON.stringify(value), projectDir });
}

describe('parsePostToolBatchInput', () => {
  it('extracts only successful Edit and Write changes and common identity fields', () => {
    const result = parse({
      hook_event_name: 'PostToolBatch',
      session_id: 'session-123',
      cwd: '/workspace/oak/packages/app',
      agent_id: 'subagent-456',
      transcript_path: '/private/transcript.jsonl',
      tool_calls: [
        {
          tool_name: 'Edit',
          tool_input: {
            file_path: '/workspace/oak/src/edit.ts',
            old_string: 'before',
            new_string: 'after',
            replace_all: false,
          },
          tool_response:
            'The file /workspace/oak/src/edit.ts has been updated successfully. User modified the edit.',
          tool_use_id: 'tool-1',
        },
        {
          tool_name: 'Write',
          tool_input: { file_path: '/workspace/oak/src/write.ts', content: 'export {};' },
          tool_response:
            'File created successfully at: /workspace/oak/src/write.ts\nSaved 10 bytes.',
        },
      ],
    });

    expect(result).toStrictEqual(
      ok({
        sessionId: 'session-123',
        agentId: 'subagent-456',
        changes: [
          {
            tool: 'Edit',
            filePath: '/workspace/oak/src/edit.ts',
            oldText: 'before',
            newText: 'after',
          },
          {
            tool: 'Write',
            filePath: '/workspace/oak/src/write.ts',
            content: 'export {};',
          },
        ],
      }),
    );
  });

  it('omits agentId for a main-agent event', () => {
    expect(
      parse({
        hook_event_name: 'PostToolBatch',
        session_id: 'session-123',
        cwd: projectDir,
        tool_calls: [],
      }),
    ).toStrictEqual(ok({ sessionId: 'session-123', changes: [] }));
  });

  it('accepts the exact-path successful Write overwrite response', () => {
    const filePath = '/workspace/oak/src/write.ts';

    expect(
      parse({
        hook_event_name: 'PostToolBatch',
        session_id: 'session-123',
        cwd: projectDir,
        tool_calls: [
          {
            tool_name: 'Write',
            tool_input: { file_path: filePath, content: 'export const updated = true;' },
            tool_response: `The file ${filePath} has been updated successfully.`,
          },
        ],
      }),
    ).toStrictEqual(
      ok({
        sessionId: 'session-123',
        changes: [
          {
            tool: 'Write',
            filePath,
            content: 'export const updated = true;',
          },
        ],
      }),
    );
  });

  it('normalizes bounded Edit content blocks alongside a serialized Write response', () => {
    const editPath = '/workspace/oak/src/edit.ts';
    const writePath = '/workspace/oak/src/write.ts';
    const result = parse({
      hook_event_name: 'PostToolBatch',
      session_id: 'session-123',
      cwd: projectDir,
      tool_calls: [
        {
          tool_name: 'Edit',
          tool_input: { file_path: editPath, old_string: 'before', new_string: 'after' },
          tool_response: [
            { type: 'text', text: `The file ${editPath} has been updated successfully.` },
            { type: 'text', text: 'response-only-private-metadata' },
          ],
        },
        {
          tool_name: 'Write',
          tool_input: { file_path: writePath, content: 'export {};' },
          tool_response: `File created successfully at: ${writePath}`,
        },
        { tool_name: 'Read', tool_input: { file_path: editPath }, tool_response: 'ignored' },
      ],
    });

    expect(result).toStrictEqual(
      ok({
        sessionId: 'session-123',
        changes: [
          { tool: 'Edit', filePath: editPath, oldText: 'before', newText: 'after' },
          { tool: 'Write', filePath: writePath, content: 'export {};' },
        ],
      }),
    );
    expect(JSON.stringify(result)).not.toContain('response-only-private-metadata');
  });

  it('normalizes bounded Write content blocks without retaining response-only text', () => {
    const filePath = '/workspace/oak/src/write.ts';
    const result = parse({
      hook_event_name: 'PostToolBatch',
      session_id: 'session-123',
      cwd: projectDir,
      tool_calls: [
        {
          tool_name: 'Write',
          tool_input: { file_path: filePath, content: 'export const written = true;' },
          tool_response: [
            { type: 'text', text: `File created successfully at: ${filePath}` },
            { type: 'text', text: 'response-only-private-metadata' },
          ],
        },
      ],
    });

    expect(result).toStrictEqual(
      ok({
        sessionId: 'session-123',
        changes: [{ tool: 'Write', filePath, content: 'export const written = true;' }],
      }),
    );
    expect(JSON.stringify(result)).not.toContain('response-only-private-metadata');
  });

  it('skips unknown, failed, mismatched, structured, and unsuccessful content-block responses', () => {
    const result = parse({
      hook_event_name: 'PostToolBatch',
      session_id: 'session-123',
      cwd: projectDir,
      tool_calls: [
        {
          tool_name: 'Write',
          tool_input: { file_path: 'failed.ts', content: 'failed' },
          tool_response: 'Error writing file',
        },
        {
          tool_name: 'Write',
          tool_input: { file_path: '/workspace/oak/mismatch.ts', content: 'mismatch' },
          tool_response: 'File created successfully at: another.ts',
        },
        {
          tool_name: 'Write',
          tool_input: { file_path: 'object.ts', content: 'object' },
          tool_response: { success: true, filePath: 'object.ts' },
        },
        {
          tool_name: 'Edit',
          tool_input: {
            file_path: 'array.ts',
            old_string: 'before',
            new_string: 'after',
          },
          tool_response: [{ type: 'text', text: 'updated' }],
        },
        {
          tool_name: 'Read',
          tool_input: { file_path: 'read.ts' },
          tool_response: 'contents',
        },
        {
          tool_name: 'Edit',
          tool_input: null,
          tool_response: 'Edit failed before reading tool input',
        },
      ],
    });

    expect(result).toStrictEqual(
      ok({
        sessionId: 'session-123',
        changes: [],
        unsupportedToolResponse: true,
      }),
    );
  });

  it('skips source changes containing a null byte', () => {
    const result = parse({
      hook_event_name: 'PostToolBatch',
      session_id: 'session-123',
      cwd: projectDir,
      tool_calls: [
        {
          tool_name: 'Write',
          tool_input: { file_path: '/workspace/oak/nul.ts', content: 'before\u0000after' },
          tool_response: 'File created successfully at: /workspace/oak/nul.ts',
        },
      ],
    });

    expect(result).toStrictEqual(ok({ sessionId: 'session-123', changes: [] }));
  });

  it('returns an error for malformed JSON', () => {
    expect(parsePostToolBatchInput({ rawInput: '{', projectDir })).toStrictEqual(
      err(new Error('Claude hook input is not valid JSON')),
    );
  });

  it('returns an error for missing common fields', () => {
    expect(
      parse({ hook_event_name: 'PostToolBatch', cwd: projectDir, tool_calls: [] }),
    ).toStrictEqual(err(new Error('Claude PostToolBatch input must include a session_id')));
    expect(
      parse({ hook_event_name: 'PostToolBatch', session_id: 'session-123', tool_calls: [] }),
    ).toStrictEqual(err(new Error('Claude PostToolBatch input must include an absolute cwd')));
  });

  it('returns an error for an invalid optional agent_id', () => {
    expect(
      parse({
        hook_event_name: 'PostToolBatch',
        session_id: 'session-123',
        cwd: projectDir,
        agent_id: '   ',
        tool_calls: [],
      }),
    ).toStrictEqual(err(new Error('Claude PostToolBatch agent_id must be a non-blank string')));
  });

  it('rejects a cwd outside CLAUDE_PROJECT_DIR', () => {
    expect(
      parse({
        hook_event_name: 'PostToolBatch',
        session_id: 'session-123',
        cwd: '/workspace/oak-private',
        tool_calls: [],
      }),
    ).toStrictEqual(err(new Error('Claude PostToolBatch cwd must be inside CLAUDE_PROJECT_DIR')));
  });

  it('rejects a relative CLAUDE_PROJECT_DIR', () => {
    const rawInput = JSON.stringify({
      hook_event_name: 'PostToolBatch',
      session_id: 'session-123',
      cwd: '/workspace/oak',
      tool_calls: [],
    });

    expect(parsePostToolBatchInput({ rawInput, projectDir: 'workspace/oak' })).toStrictEqual(
      err(new Error('CLAUDE_PROJECT_DIR must be an absolute path')),
    );
  });

  it('returns an error for a malformed successful Edit input', () => {
    const result = parse({
      hook_event_name: 'PostToolBatch',
      session_id: 'session-123',
      cwd: projectDir,
      tool_calls: [
        {
          tool_name: 'Edit',
          tool_input: { file_path: '/workspace/oak/src/edit.ts', new_string: 'after' },
          tool_response: 'The file /workspace/oak/src/edit.ts has been updated successfully.',
        },
      ],
    });

    expect(result).toStrictEqual(
      err(new Error('Claude hook tool_calls[0] has an invalid Edit tool_input')),
    );
  });

  it.each(['src/write.ts', '/workspace/oak/src/../write.ts'])(
    'rejects unsafe successful tool file_path %s before normalisation',
    (filePath) => {
      expect(
        parse({
          hook_event_name: 'PostToolBatch',
          session_id: 'session-123',
          cwd: projectDir,
          tool_calls: [
            {
              tool_name: 'Write',
              tool_input: { file_path: filePath, content: 'export {};' },
              tool_response: `File created successfully at: ${filePath}`,
            },
          ],
        }),
      ).toStrictEqual(err(new Error('Claude hook tool_calls[0] has an invalid Write tool_input')));
    },
  );

  it('does not retain unsupported content-block tool responses', () => {
    const result = parse({
      hook_event_name: 'PostToolBatch',
      session_id: 'session-123',
      cwd: projectDir,
      tool_calls: [
        {
          tool_name: 'Write',
          tool_input: { file_path: '/workspace/oak/src/write.ts', content: 'source-private' },
          tool_response: [{ type: 'future-block', value: 'response-private' }],
        },
      ],
    });

    expect(result).toStrictEqual(
      ok({ sessionId: 'session-123', changes: [], unsupportedToolResponse: true }),
    );
    expect(JSON.stringify(result)).not.toContain('private');
  });

  it('fails soft when a content-block response exceeds its block bound', () => {
    const result = parse({
      hook_event_name: 'PostToolBatch',
      session_id: 'session-123',
      cwd: projectDir,
      tool_calls: [
        {
          tool_name: 'Write',
          tool_input: { file_path: '/workspace/oak/src/write.ts', content: 'source' },
          tool_response: Array.from({ length: 9 }, () => ({ type: 'text', text: 'bounded' })),
        },
      ],
    });

    expect(result).toStrictEqual(
      ok({ sessionId: 'session-123', changes: [], unsupportedToolResponse: true }),
    );
  });
});
