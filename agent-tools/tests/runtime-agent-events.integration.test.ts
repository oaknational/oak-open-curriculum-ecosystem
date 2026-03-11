import { describe, expect, it } from 'vitest';

import { readAgentEventsWithFs } from '../src/core/runtime-agent-events';

describe('runtime agent events', () => {
  it('extracts stop reason, tool names, and bash commands', () => {
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

    const result = readAgentEventsWithFs('/virtual/agent-a.jsonl', {
      existsSync: () => true,
      statSync: () => ({ size: 100, isFile: () => true }),
      lstatSync: () => ({ isSymbolicLink: () => false }),
      readFileSync: () => `${JSON.stringify(first)}\n${JSON.stringify(second)}\n`,
    });

    expect(result.stopReason).toBe('end_turn');
    expect(result.toolNames).toEqual(['ReadFile', 'Bash']);
    expect(result.bashCommands).toEqual(['pnpm test']);
  });
});
