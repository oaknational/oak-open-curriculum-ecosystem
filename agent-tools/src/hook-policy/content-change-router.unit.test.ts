import { unwrap, unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { extractContentChanges, selectExactlyOneSchema } from './content-change-router.js';

describe('extractContentChanges', () => {
  it('normalises a Claude Edit envelope', () => {
    expect(
      unwrap(
        extractContentChanges({
          tool_input: {
            new_string: 'const updated = true;',
            old_string: 'const original = true;',
            file_path: '/repo/example.ts',
          },
        }),
      ),
    ).toStrictEqual([
      {
        newContent: 'const updated = true;',
        priorContent: 'const original = true;',
        filePath: '/repo/example.ts',
      },
    ]);
  });

  it('uses empty prior content when Claude Edit omits old_string', () => {
    expect(
      unwrap(extractContentChanges({ tool_input: { new_string: 'new content' } })),
    ).toStrictEqual([{ newContent: 'new content', priorContent: '' }]);
  });

  it('normalises a Claude Write envelope with a prior-file reference', () => {
    expect(
      unwrap(
        extractContentChanges({
          tool_input: {
            content: 'file content here',
            file_path: '/workspace/example.ts',
          },
        }),
      ),
    ).toStrictEqual([
      {
        newContent: 'file content here',
        priorContent: '',
        filePath: '/workspace/example.ts',
        priorFilePath: '/workspace/example.ts',
      },
    ]);
  });

  it('routes the flattened Claude payload as an explicit schema', () => {
    expect(
      unwrap(
        extractContentChanges({
          new_string: 'flat new',
          old_string: 'flat old',
        }),
      ),
    ).toStrictEqual([{ newContent: 'flat new', priorContent: 'flat old' }]);
  });

  it('routes the camel-case Claude envelope as an explicit schema', () => {
    expect(
      unwrap(
        extractContentChanges({
          toolInput: {
            new_string: 'camel new',
            old_string: 'camel old',
          },
        }),
      ),
    ).toStrictEqual([{ newContent: 'camel new', priorContent: 'camel old' }]);
  });

  it('fails closed when a Claude tool name and argument schema disagree', () => {
    const result = extractContentChanges({
      toolName: 'Write',
      toolInput: {
        new_string: 'edit content under the wrong tool name',
        old_string: 'old content',
      },
    });

    expect(unwrapErr(result).message).toContain(
      'PreToolUse content input matched 0 supported schemas',
    );
  });

  it('normalises the documented Copilot camel-case create envelope', () => {
    expect(
      unwrap(
        extractContentChanges({
          sessionId: 'copilot-session',
          timestamp: 1_753_426_800_000,
          cwd: '/repo',
          toolName: 'create',
          toolArgs: JSON.stringify({
            path: '/repo/new-file.md',
            file_text: 'new file content',
          }),
        }),
      ),
    ).toStrictEqual([
      {
        newContent: 'new file content',
        priorContent: '',
        filePath: '/repo/new-file.md',
        priorFilePath: '/repo/new-file.md',
      },
    ]);
  });

  it('normalises the documented Copilot PascalCase edit envelope', () => {
    expect(
      unwrap(
        extractContentChanges({
          hook_event_name: 'PreToolUse',
          session_id: 'copilot-session',
          timestamp: '2026-07-25T07:00:00.000Z',
          cwd: '/repo',
          tool_name: 'Edit',
          tool_input: {
            path: '/repo/existing.md',
            old_str: 'old content',
            new_str: 'new content',
          },
        }),
      ),
    ).toStrictEqual([
      {
        newContent: 'new content',
        priorContent: 'old content',
        filePath: '/repo/existing.md',
      },
    ]);
  });

  it('normalises the documented Copilot PascalCase create envelope', () => {
    expect(
      unwrap(
        extractContentChanges({
          hook_event_name: 'PreToolUse',
          session_id: 'copilot-session',
          timestamp: '2026-07-25T07:00:00.000Z',
          cwd: '/repo',
          tool_name: 'Write',
          tool_input: {
            path: '/repo/new-file.md',
            file_text: 'new file content',
          },
        }),
      ),
    ).toStrictEqual([
      {
        newContent: 'new file content',
        priorContent: '',
        filePath: '/repo/new-file.md',
        priorFilePath: '/repo/new-file.md',
      },
    ]);
  });

  it('normalises the documented Copilot camel-case edit envelope', () => {
    expect(
      unwrap(
        extractContentChanges({
          sessionId: 'copilot-session',
          timestamp: 1_753_426_800_000,
          cwd: '/repo',
          toolName: 'edit',
          toolArgs: JSON.stringify({
            path: '/repo/existing.md',
            old_str: 'old content',
            new_str: 'new content',
          }),
        }),
      ),
    ).toStrictEqual([
      {
        newContent: 'new content',
        priorContent: 'old content',
        filePath: '/repo/existing.md',
      },
    ]);
  });

  it('normalises the Copilot PascalCase raw apply_patch envelope', () => {
    expect(
      unwrap(
        extractContentChanges({
          hook_event_name: 'PreToolUse',
          session_id: 'copilot-session',
          timestamp: '2026-07-25T07:00:00.000Z',
          cwd: '/repo',
          tool_name: 'Edit',
          tool_input:
            '*** Begin Patch\n*** Update File: /repo/existing.md\n@@\n-old content\n' +
            '+new content\n*** End Patch\n',
        }),
      ),
    ).toStrictEqual([
      {
        newContent: 'new content',
        priorContent: 'old content',
        filePath: '/repo/existing.md',
      },
    ]);
  });

  it('fails closed for Copilot lifecycle batches because they are not command-hook input', () => {
    const result = extractContentChanges({
      sessionId: 'copilot-session',
      cwd: '/repo',
      toolCalls: [
        {
          id: 'call-create',
          name: 'create',
          args: JSON.stringify({
            path: '/repo/new-file.md',
            file_text: 'new file content',
          }),
        },
      ],
    });

    expect(unwrapErr(result).message).toContain(
      'PreToolUse content input matched 0 supported schemas',
    );
  });

  it('normalises add, move, and delete patch sections per target path', () => {
    const patch = [
      '*** Begin Patch',
      '*** Add File: /repo/added.md',
      '+added line',
      '*** Update File: /repo/old.md',
      '*** Move to: /repo/moved.md',
      '@@',
      '-old line',
      '+moved line',
      '*** Delete File: /repo/deleted.md',
      '*** End Patch',
    ].join('\n');

    expect(
      unwrap(
        extractContentChanges({
          sessionId: 'copilot-session',
          timestamp: 1_753_426_800_000,
          cwd: '/repo',
          toolName: 'apply_patch',
          toolArgs: JSON.stringify({ patch }),
        }),
      ),
    ).toStrictEqual([
      { newContent: 'added line', priorContent: '', filePath: '/repo/added.md' },
      {
        newContent: 'moved line',
        priorContent: 'old line',
        filePath: '/repo/moved.md',
      },
      { newContent: '', priorContent: '', filePath: '/repo/deleted.md' },
    ]);
  });

  it.each([
    {
      label: 'an empty add section',
      patch: '*** Begin Patch\n*** Add File: /repo/empty.md\n*** End Patch',
    },
    {
      label: 'a delete section with body lines',
      patch: '*** Begin Patch\n*** Delete File: /repo/deleted.md\n-deleted\n*** End Patch',
    },
    {
      label: 'a late move target',
      patch:
        '*** Begin Patch\n*** Update File: /repo/old.md\n@@\n-old\n+new\n' +
        '*** Move to: /repo/new.md\n*** End Patch',
    },
    {
      label: 'a non-terminal end-of-file marker',
      patch:
        '*** Begin Patch\n*** Update File: /repo/file.md\n@@\n-old\n*** End of File\n' +
        '+new\n*** End Patch',
    },
  ])('fails closed for $label', ({ patch }) => {
    const result = extractContentChanges({
      sessionId: 'copilot-session',
      timestamp: 1_753_426_800_000,
      cwd: '/repo',
      toolName: 'apply_patch',
      toolArgs: JSON.stringify({ patch }),
    });

    expect(unwrapErr(result).message).toContain(
      'PreToolUse content input matched 0 supported schemas',
    );
  });

  it('fails closed when no supported schema matches', () => {
    expect(
      unwrapErr(extractContentChanges({ tool_input: { command: 'echo hello' } })).message,
    ).toContain('PreToolUse content input matched 0 supported schemas');
  });

  it('fails closed when serialised Copilot tool arguments are malformed', () => {
    const result = extractContentChanges({
      sessionId: 'copilot-session',
      timestamp: 1_753_426_800_000,
      cwd: '/repo',
      toolName: 'create',
      toolArgs: '{',
    });

    expect(unwrapErr(result).message).toContain(
      'PreToolUse content input matched 0 supported schemas',
    );
  });

  it('fails closed when apply_patch syntax is malformed', () => {
    const result = extractContentChanges({
      sessionId: 'copilot-session',
      timestamp: 1_753_426_800_000,
      cwd: '/repo',
      toolName: 'apply_patch',
      toolArgs: JSON.stringify({ patch: 'not a patch' }),
    });

    expect(unwrapErr(result).message).toContain(
      'PreToolUse content input matched 0 supported schemas',
    );
  });
});

describe('selectExactlyOneSchema', () => {
  it('fails closed when more than one schema matches', () => {
    const schema = z.object({ value: z.string() }).strict();
    const result = selectExactlyOneSchema(
      { value: 'ambiguous' },
      [
        { name: 'first', schema },
        { name: 'second', schema },
      ],
      'synthetic input',
    );

    expect(unwrapErr(result).message).toBe(
      'synthetic input matched 2 supported schemas (first, second); expected exactly one.',
    );
  });
});
