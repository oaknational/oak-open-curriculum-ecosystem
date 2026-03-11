import { describe, expect, it } from 'vitest';

import {
  buildTakeoverBundle,
  findSessionByPrefix,
  filterByWindow,
  mergeSessionsById,
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

  it('scores subagent matches when display misses', () => {
    const scored = scoreSessionMatch({
      display: 'no display hit',
      subagentFileNames: ['agent-a1.jsonl'],
      subagentFileContents: ['edited docs/requests/README.md'],
      fileHistoryContents: [],
      needles: ['docs/requests/README.md'],
    });

    expect(scored.score).toBe(2);
    expect(scored.source).toBe('subagent:agent-a1.jsonl');
  });

  it('scores file-history matches when display and subagent miss', () => {
    const scored = scoreSessionMatch({
      display: 'no display hit',
      subagentFileNames: [],
      subagentFileContents: [],
      fileHistoryContents: ['touched docs/requests/README.md'],
      needles: ['docs/requests/README.md'],
    });

    expect(scored.score).toBe(2);
    expect(scored.source).toBe('file-history');
  });

  it('falls back to time-window score when no match sources hit', () => {
    const scored = scoreSessionMatch({
      display: 'no hits',
      subagentFileNames: [],
      subagentFileContents: [],
      fileHistoryContents: [],
      needles: ['docs/requests/README.md'],
    });

    expect(scored).toEqual({ score: 1, source: 'time-window' });
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

  it('builds a takeover bundle with empty subagent state', () => {
    const content = buildTakeoverBundle({
      sessionId: 'session-2',
      timestampIso: '2026-03-10 11:18:15 UTC',
      repoPath: '/repo',
      display: '',
      subagents: [],
    });

    expect(content).toContain('_No sub-agent activity found for this session._');
  });

  it('merges sessions by id and prefers the newest duplicate', () => {
    const merged = mergeSessionsById(
      [
        { sessionId: 'a', timestampMs: 100, display: '', project: '/repo' },
        { sessionId: 'b', timestampMs: 200, display: '', project: '/repo' },
      ],
      [
        { sessionId: 'a', timestampMs: 300, display: 'ignored duplicate', project: '/repo' },
        { sessionId: 'c', timestampMs: 150, display: '', project: '/repo' },
      ],
    );

    expect(merged.map((entry) => entry.sessionId)).toEqual(['a', 'b', 'c']);
  });

  it('finds sessions by id prefix', () => {
    const found = findSessionByPrefix('abc', [
      { sessionId: 'def-1', timestampMs: 1, display: '', project: '/repo' },
      { sessionId: 'abc-2', timestampMs: 2, display: '', project: '/repo' },
    ]);
    const missing = findSessionByPrefix('zzz', [
      { sessionId: 'abc-2', timestampMs: 2, display: '', project: '/repo' },
    ]);

    expect(found?.sessionId).toBe('abc-2');
    expect(missing).toBeNull();
  });
});
