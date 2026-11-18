import { join } from 'node:path';

import { shouldSkipCompactAgent } from './session-tools.js';
import { escapedRepoPath, isSessionId } from './runtime-paths.js';
import { nodeSyncFileSystem, type SyncFileSystem } from './sync-file-system.js';

/** The directory reads the index is made of; the process's own by default. */
export type DirectoryIndex = Pick<SyncFileSystem, 'exists' | 'list'>;

function projectSessionsPath(root: string, homePath: string): string {
  return join(homePath, '.claude', 'projects', escapedRepoPath(root));
}

function subagentJsonls(pathValue: string, index: DirectoryIndex): string[] {
  if (!index.exists(pathValue)) {
    return [];
  }
  return index
    .list(pathValue)
    .filter((name) => name.endsWith('.jsonl') && !shouldSkipCompactAgent(name));
}

export function listAgentShortIds(
  root: string,
  homePath: string,
  index: DirectoryIndex = nodeSyncFileSystem,
): string[] {
  const values = new Set<string>();
  const worktrees = join(root, '.claude', 'worktrees');
  if (index.exists(worktrees)) {
    for (const name of index.list(worktrees).filter((entry) => entry.startsWith('agent-'))) {
      values.add(name.replace('agent-', ''));
    }
  }
  const projects = projectSessionsPath(root, homePath);
  if (!index.exists(projects)) {
    return [...values].sort((a, b) => a.localeCompare(b));
  }
  for (const sessionId of index.list(projects).filter((entry) => isSessionId(entry))) {
    const subagents = join(projects, sessionId, 'subagents');
    for (const entry of subagentJsonls(subagents, index)) {
      values.add(entry.replace('.jsonl', '').replace('agent-', '').slice(0, 8));
    }
  }
  return [...values].sort((a, b) => a.localeCompare(b));
}

/** Every session subagent file under `projects` whose short id is `shortId`. */
function matchingJsonlPaths(projects: string, shortId: string, index: DirectoryIndex): string[] {
  const matches: string[] = [];
  for (const sessionId of index.list(projects).filter((entry) => isSessionId(entry))) {
    const subagents = join(projects, sessionId, 'subagents');
    for (const entry of subagentJsonls(subagents, index)) {
      const candidate = entry.replace('.jsonl', '').replace('agent-', '').slice(0, 8);
      if (candidate === shortId) {
        matches.push(join(subagents, entry));
      }
    }
  }
  return matches;
}

export function resolveAgentJsonlPath(
  root: string,
  shortId: string,
  homePath: string,
  index: DirectoryIndex = nodeSyncFileSystem,
): string | null {
  const projects = projectSessionsPath(root, homePath);
  if (!index.exists(projects)) {
    return null;
  }
  const matches = matchingJsonlPaths(projects, shortId, index);
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
