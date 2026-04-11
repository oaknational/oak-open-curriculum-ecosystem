/** Session metadata discovered from Claude history and local project folders. */
export interface SessionEntry {
  sessionId: string;
  timestampMs: number;
  display: string;
  project: string;
}

/** Minimal summary of a subagent run associated with a session. */
export interface SubagentSummary {
  agentId: string;
  agentType: string;
  assistantTurns: number;
  lastMessage: string;
}

/** Inputs used to score whether a session matches a requested file target. */
export interface SessionMatchInput {
  display: string;
  subagentFileNames: string[];
  subagentFileContents: string[];
  fileHistoryContents: string[];
  needles: string[];
}

/** Scoring result describing match confidence and the signal source. */
export interface SessionMatchResult {
  score: number;
  source: string;
}

/** Inputs used to generate a handover bundle for Cursor takeover. */
export interface TakeoverBundleInput {
  sessionId: string;
  timestampIso: string;
  repoPath: string;
  display: string;
  subagents: SubagentSummary[];
}

const hourMs = 60 * 60 * 1000;

/** Filter sessions to entries occurring inside the supplied hour window. */
export function filterByWindow(
  entries: readonly SessionEntry[],
  lastHours: number,
  nowMs: number,
): SessionEntry[] {
  const cutoff = nowMs - Math.floor(lastHours * hourMs);
  return entries.filter((entry) => entry.timestampMs >= cutoff);
}

/** Merge session batches by id and return entries sorted by recency. */
export function mergeSessionsById(...batches: SessionEntry[][]): SessionEntry[] {
  const map = new Map<string, SessionEntry>();
  for (const batch of batches) {
    for (const entry of batch) {
      const existing = map.get(entry.sessionId);
      if (existing === undefined || entry.timestampMs > existing.timestampMs) {
        map.set(entry.sessionId, entry);
      }
    }
  }
  return [...map.values()].sort((left, right) => right.timestampMs - left.timestampMs);
}

/** Find a session by id prefix. */
export function findSessionByPrefix(
  prefix: string,
  entries: readonly SessionEntry[],
): SessionEntry | null {
  return entries.find((entry) => entry.sessionId.startsWith(prefix)) ?? null;
}

/** Identify compact helper agents that should not be listed in summaries. */
export function shouldSkipCompactAgent(agentId: string): boolean {
  return agentId.includes('compact');
}

/**
 * Score matching signals for a session.
 *
 * @remarks
 * Match precedence is display text, then subagent content, then file-history
 * content, then a default time-window fallback score.
 */
export function scoreSessionMatch(input: SessionMatchInput): SessionMatchResult {
  const hasDisplayMatch = input.needles.some((needle) => input.display.includes(needle));
  if (hasDisplayMatch) {
    return { score: 3, source: 'history-display' };
  }

  const subagentHitIndex = input.subagentFileContents.findIndex((content) =>
    input.needles.some((needle) => content.includes(needle)),
  );
  if (subagentHitIndex >= 0) {
    return {
      score: 2,
      source: `subagent:${input.subagentFileNames[subagentHitIndex] ?? 'unknown'}`,
    };
  }

  const hasHistoryHit = input.fileHistoryContents.some((content) =>
    input.needles.some((needle) => content.includes(needle)),
  );
  if (hasHistoryHit) {
    return { score: 2, source: 'file-history' };
  }

  return { score: 1, source: 'time-window' };
}

/** Build markdown bundle content used when taking over a Claude session in Cursor. */
export function buildTakeoverBundle(input: TakeoverBundleInput): string {
  const lines: string[] = [
    '# Claude Session Takeover Bundle',
    '',
    `- session: \`${input.sessionId}\``,
    `- time: \`${input.timestampIso}\``,
    `- repo: \`${input.repoPath}\``,
    `- display: ${input.display || '(empty)'}`,
    '',
    '## Suggested Cursor Prompt',
    '',
    '```text',
    `Please continue Claude session \`${input.sessionId}\` in \`${input.repoPath}\`. ` +
      'Use the sub-agent summary below as context, then verify current git status and continue the work.',
    '```',
    '',
    '## Reintegration Contract',
    '',
    '- Reintegration owner: the receiving operator in the parent lane',
    '- Required evidence: verify current git status, active plans, and any live continuity surfaces before acting',
    '- Acceptance signal: Absorb the delegated outcome back into the parent plan or dialogue before continuing execution',
    '- Stop or escalate if the takeover bundle conflicts with the live repo state or the active plan authority',
    '',
    '## Sub-agent Summary',
    '',
  ];

  if (input.subagents.length === 0) {
    lines.push('_No sub-agent activity found for this session._');
    return lines.join('\n');
  }

  for (const subagent of input.subagents) {
    lines.push(
      `- \`${subagent.agentId}\` (${subagent.agentType}, assistant turns: ${subagent.assistantTurns})`,
    );
    if (subagent.lastMessage) {
      lines.push(`  - last message: ${subagent.lastMessage}`);
    }
  }
  return lines.join('\n');
}
