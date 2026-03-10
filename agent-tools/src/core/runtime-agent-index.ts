import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { shouldSkipCompactAgent } from './session-tools';
import { escapedRepoPath, isSessionId } from './runtime-paths';

function projectSessionsPath(root: string): string {
  return join(process.env.HOME ?? '', '.claude', 'projects', escapedRepoPath(root));
}

function subagentJsonls(pathValue: string): string[] {
  if (!existsSync(pathValue)) {
    return [];
  }
  return readdirSync(pathValue).filter(
    (name) => name.endsWith('.jsonl') && !shouldSkipCompactAgent(name),
  );
}

export function listAgentShortIds(root: string): string[] {
  const values = new Set<string>();
  const worktrees = join(root, '.claude', 'worktrees');
  if (existsSync(worktrees)) {
    for (const name of readdirSync(worktrees).filter((entry) => entry.startsWith('agent-'))) {
      values.add(name.replace('agent-', ''));
    }
  }
  const projects = projectSessionsPath(root);
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

export function resolveAgentJsonlPath(root: string, shortId: string): string | null {
  const projects = projectSessionsPath(root);
  if (!existsSync(projects)) {
    return null;
  }
  for (const sessionId of readdirSync(projects).filter((entry) => isSessionId(entry))) {
    const subagents = join(projects, sessionId, 'subagents');
    for (const entry of subagentJsonls(subagents)) {
      const candidate = entry.replace('.jsonl', '').replace('agent-', '').slice(0, 8);
      if (candidate === shortId) {
        return join(subagents, entry);
      }
    }
  }
  return null;
}
