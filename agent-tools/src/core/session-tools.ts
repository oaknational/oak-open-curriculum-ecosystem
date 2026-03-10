export interface SessionEntry {
  sessionId: string;
  timestampMs: number;
  display: string;
  project: string;
}

export interface SubagentSummary {
  agentId: string;
  agentType: string;
  assistantTurns: number;
  lastMessage: string;
}

export interface SessionMatchInput {
  display: string;
  subagentFileNames: string[];
  subagentFileContents: string[];
  fileHistoryContents: string[];
  needles: string[];
}

export interface SessionMatchResult {
  score: number;
  source: string;
}

export interface TakeoverBundleInput {
  sessionId: string;
  timestampIso: string;
  repoPath: string;
  display: string;
  subagents: SubagentSummary[];
}

const hourMs = 60 * 60 * 1000;

export function filterByWindow(
  entries: readonly SessionEntry[],
  lastHours: number,
  nowMs: number,
): SessionEntry[] {
  const cutoff = nowMs - Math.floor(lastHours * hourMs);
  return entries.filter((entry) => entry.timestampMs >= cutoff);
}

export function shouldSkipCompactAgent(agentId: string): boolean {
  return agentId.includes('compact');
}

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
