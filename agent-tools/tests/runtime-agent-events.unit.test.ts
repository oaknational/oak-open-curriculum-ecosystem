import { mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { describe, expect, it } from 'vitest';

import { readAgentEvents } from '../src/core/runtime-agent-events';

describe('runtime agent events', () => {
  it('extracts stop reason, tool names, and bash commands', () => {
    const dir = mkdtempSync(join(tmpdir(), 'agent-events-'));
    const jsonl = join(dir, 'agent-a.jsonl');
    const first = {
      message: {
        stop_reason: '',
        content: [{ type: 'tool_use', name: 'ReadFile' }],
      },
    };
    const second = {
      message: {
        stop_reason: 'end_turn',
        content: [{ type: 'tool_use', name: 'Bash', input: { command: 'pnpm test' } }],
      },
    };
    writeFileSync(jsonl, `${JSON.stringify(first)}\n${JSON.stringify(second)}\n`, 'utf8');

    const result = readAgentEvents(jsonl);

    expect(result.stopReason).toBe('end_turn');
    expect(result.toolNames).toEqual(['ReadFile', 'Bash']);
    expect(result.bashCommands).toEqual(['pnpm test']);
  });
});
