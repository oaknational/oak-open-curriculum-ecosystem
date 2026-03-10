import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

import type { SessionEntry, SubagentSummary } from './session-tools';
import { shouldSkipCompactAgent } from './session-tools';
import { escapedRepoPath, isSessionId } from './runtime-paths';
export { escapedRepoPath } from './runtime-paths';
export { listAgentShortIds, resolveAgentJsonlPath } from './runtime-agent-index';
export { readAgentEvents } from './runtime-agent-events';
export type { AgentEvents } from './runtime-agent-events';

interface HistoryRow {
  sessionId: string;
  timestamp: number;
  display?: string;
  project?: string;
}

interface MetaRow {
  agentType?: string;
}

interface JsonCandidate {
  sessionId?: unknown;
  timestamp?: unknown;
  display?: unknown;
  project?: unknown;
  agentType?: unknown;
}

export function repoRoot(): string {
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
  } catch {
    return process.cwd();
  }
}

export function readHistory(pathValue: string): SessionEntry[] {
  return readJsonLines<HistoryRow>(pathValue, isHistoryRow).map((row) => ({
    sessionId: row.sessionId,
    timestampMs: row.timestamp,
    display: row.display ?? '',
    project: row.project ?? '',
  }));
}

export function discoverSessions(projectsRoot: string, root: string): SessionEntry[] {
  const pathValue = join(projectsRoot, escapedRepoPath(root));
  if (!existsSync(pathValue)) {
    return [];
  }
  return readdirSync(pathValue)
    .filter((name) => isSessionId(name))
    .map((sessionId) => ({
      sessionId,
      timestampMs: Date.now(),
      display: '',
      project: root,
    }));
}

export function sessionDirectory(projectsRoot: string, root: string, sessionId: string): string {
  return join(projectsRoot, escapedRepoPath(root), sessionId);
}

export function subagentSummaries(sessionDir: string): SubagentSummary[] {
  const subagentsDir = join(sessionDir, 'subagents');
  if (!existsSync(subagentsDir)) {
    return [];
  }
  const result: SubagentSummary[] = [];
  const metaFiles = readdirSync(subagentsDir).filter((name) => name.endsWith('.meta.json'));
  for (const metaFile of metaFiles.sort()) {
    const agentId = metaFile.replace('.meta.json', '');
    if (shouldSkipCompactAgent(agentId)) {
      continue;
    }
    const metaPath = join(subagentsDir, metaFile);
    const [meta] = readJsonLines<MetaRow>(metaPath, isMetaRow);
    result.push({
      agentId,
      agentType: meta?.agentType ?? 'unknown',
      assistantTurns: 0,
      lastMessage: '',
    });
  }
  return result;
}

export function targetNeedles(root: string, targetFile: string): string[] {
  const normalized = targetFile.replaceAll('\\', '/');
  const values = new Set<string>([normalized, basename(normalized)]);
  const prefix = `${root.replaceAll('\\', '/')}/`;
  if (normalized.startsWith(prefix)) {
    values.add(normalized.slice(prefix.length));
  }
  return [...values];
}

export function runGit(repoPath: string, args: string[]): string {
  const result = spawnSync('git', ['-C', repoPath, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  return result.status === 0 ? result.stdout.trimEnd() : '';
}

export function formatTimestamp(timestampMs: number): string {
  return new Date(timestampMs).toISOString().replace('T', ' ').replace('.000Z', ' UTC');
}

export function nonEmptyLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);
}

function readJsonLines<T>(pathValue: string, guard: (value: unknown) => value is T): T[] {
  if (!existsSync(pathValue)) {
    return [];
  }
  return readFileSync(pathValue, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => parseJson(line))
    .filter((value): value is T => guard(value));
}

function parseJson(line: string): unknown {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

function isHistoryRow(value: unknown): value is HistoryRow {
  if (!isJsonCandidate(value)) {
    return false;
  }
  return typeof value.sessionId === 'string' && typeof value.timestamp === 'number';
}

function isMetaRow(value: unknown): value is MetaRow {
  if (!isJsonCandidate(value)) {
    return false;
  }
  return value.agentType === undefined || typeof value.agentType === 'string';
}

function isJsonCandidate(value: unknown): value is JsonCandidate {
  return typeof value === 'object' && value !== null;
}
