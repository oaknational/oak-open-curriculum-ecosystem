import { describe, expect, it } from 'vitest';

import {
  buildTakeoverBundle,
  filterByWindow,
  scoreSessionMatch,
  shouldSkipCompactAgent,
  type SessionEntry,
  type SessionMatchInput,
  type SubagentSummary,
} from '../src/core/session-tools';

describe('session tools', () => {
  it('filters sessions by time window', () => {
    const nowMs = Date.now();
    const entries: SessionEntry[] = [
      { sessionId: 'a', timestampMs: nowMs - 30_000, display: '', project: '/repo' },
      { sessionId: 'b', timestampMs: nowMs - 8_000_000, display: '', project: '/repo' },
    ];

    const filtered = filterByWindow(entries, 1, nowMs);

    expect(filtered).toEqual([entries[0]]);
  });

  it('scores a session based on display and subagent hits', () => {
    const input: SessionMatchInput = {
      display: 'updated docs/requests/README.md',
      subagentFileNames: ['agent-a123.jsonl'],
      subagentFileContents: ['no hit'],
      fileHistoryContents: ['no hit'],
      needles: ['docs/requests/README.md'],
    };

    const scored = scoreSessionMatch(input);

    expect(scored.score).toBe(3);
    expect(scored.source).toBe('history-display');
  });

  it('skips compact subagents consistently', () => {
    expect(shouldSkipCompactAgent('agent-compact-abc123')).toBe(true);
    expect(shouldSkipCompactAgent('agent-a1234567')).toBe(false);
  });

  it('builds a takeover bundle with subagent summary', () => {
    const subagents: SubagentSummary[] = [
      {
        agentId: 'agent-a1',
        agentType: 'code-reviewer',
        assistantTurns: 9,
        lastMessage: 'done',
      },
    ];

    const content = buildTakeoverBundle({
      sessionId: 'session-1',
      timestampIso: '2026-03-10 11:18:15 UTC',
      repoPath: '/repo',
      display: 'some work',
      subagents,
    });

    expect(content).toContain('Claude Session Takeover Bundle');
    expect(content).toContain('agent-a1');
  });
});
