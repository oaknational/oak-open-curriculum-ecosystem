import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { shouldSkipCompactAgent } from './session-tools';
import { escapedRepoPath, isSessionId } from './runtime-paths';

function projectSessionsPath(root: string, homePath: string): string {
  return join(homePath, '.claude', 'projects', escapedRepoPath(root));
}

function subagentJsonls(pathValue: string): string[] {
  if (!existsSync(pathValue)) {
    return [];
  }
  return readdirSync(pathValue).filter(
    (name) => name.endsWith('.jsonl') && !shouldSkipCompactAgent(name),
  );
}

export function listAgentShortIds(root: string, homePath: string): string[] {
  const values = new Set<string>();
  const worktrees = join(root, '.claude', 'worktrees');
  if (existsSync(worktrees)) {
    for (const name of readdirSync(worktrees).filter((entry) => entry.startsWith('agent-'))) {
      values.add(name.replace('agent-', ''));
    }
  }
  const projects = projectSessionsPath(root, homePath);
  if (!existsSync(projects)) {
    return [...values].sort();
  }
  for (const sessionId of readdirSync(projects).filter((entry) => isSessionId(entry))) {
    const subagents = join(projects, sessionId, 'subagents');
    for (const entry of subagentJsonls(subagents)) {
      values.add(entry.replace('.jsonl', '').replace('agent-', '').slice(0, 8));
    }
  }
  return [...values].sort();
}

export function resolveAgentJsonlPath(
  root: string,
  shortId: string,
  homePath: string,
): string | null {
  const projects = projectSessionsPath(root, homePath);
  if (!existsSync(projects)) {
    return null;
  }
  const matches: string[] = [];
  for (const sessionId of readdirSync(projects).filter((entry) => isSessionId(entry))) {
    const subagents = join(projects, sessionId, 'subagents');
    for (const entry of subagentJsonls(subagents)) {
      const candidate = entry.replace('.jsonl', '').replace('agent-', '').slice(0, 8);
      if (candidate === shortId) {
        matches.push(join(subagents, entry));
      }
    }
  }
  if (matches.length === 0) {
    return null;
  }
  if (matches.length > 1) {
    throw new Error(
      `Agent id prefix '${shortId}' is ambiguous across ${matches.length} session files; use a longer unique identifier.`,
    );
  }
  const [match] = matches;
  return match ?? null;
}
