import { execSync, spawnSync } from 'node:child_process';
import { existsSync, lstatSync, readdirSync, readFileSync, statSync } from 'node:fs';
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
interface RuntimeFileSystem {
  existsSync(pathValue: string): boolean;
  readdirSync(pathValue: string): string[];
  statSync(pathValue: string): {
    mtimeMs: number;
    size: number;
    isFile(): boolean;
    isDirectory(): boolean;
  };
  lstatSync(pathValue: string): { isSymbolicLink(): boolean };
  readFileSync(pathValue: string, encoding: 'utf8'): string;
}
const nodeRuntimeFileSystem: RuntimeFileSystem = {
  existsSync,
  readdirSync,
  statSync,
  lstatSync,
  readFileSync,
};
const maxDirectoryFilesRead = 200;
const maxFileBytesRead = 256 * 1024;
const maxJsonLinesBytesRead = 5 * 1024 * 1024;
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
  return discoverSessionsWithFs(projectsRoot, root, nodeRuntimeFileSystem);
}

export function discoverSessionsWithFs(
  projectsRoot: string,
  root: string,
  fileSystem: RuntimeFileSystem,
): SessionEntry[] {
  const pathValue = join(projectsRoot, escapedRepoPath(root));
  if (!fileSystem.existsSync(pathValue)) {
    return [];
  }
  const sessions: SessionEntry[] = [];
  for (const sessionId of fileSystem.readdirSync(pathValue).filter((name) => isSessionId(name))) {
    const sessionPath = join(pathValue, sessionId);
    try {
      const fileType = fileSystem.lstatSync(sessionPath);
      if (fileType.isSymbolicLink()) {
        continue;
      }
      const sessionStats = fileSystem.statSync(sessionPath);
      if (!sessionStats.isDirectory()) {
        continue;
      }
      sessions.push({
        sessionId,
        timestampMs: sessionStats.mtimeMs,
        display: '',
        project: root,
      });
    } catch {
      continue;
    }
  }
  return sessions;
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
export function readDirectoryFiles(
  directoryPath: string,
  predicate: (name: string) => boolean,
): { name: string; content: string }[] {
  return readDirectoryFilesWithFs(directoryPath, predicate, nodeRuntimeFileSystem);
}
export function readDirectoryFilesWithFs(
  directoryPath: string,
  predicate: (name: string) => boolean,
  fileSystem: RuntimeFileSystem,
): { name: string; content: string }[] {
  if (!fileSystem.existsSync(directoryPath)) {
    return [];
  }
  const results: { name: string; content: string }[] = [];
  for (const name of fileSystem.readdirSync(directoryPath).filter(predicate)) {
    if (results.length >= maxDirectoryFilesRead) {
      break;
    }
    const pathValue = join(directoryPath, name);
    try {
      const fileType = fileSystem.lstatSync(pathValue);
      if (fileType.isSymbolicLink()) {
        continue;
      }
      const fileStats = fileSystem.statSync(pathValue);
      if (!fileStats.isFile() || fileStats.size > maxFileBytesRead) {
        continue;
      }
      results.push({
        name,
        content: fileSystem.readFileSync(pathValue, 'utf8'),
      });
    } catch {
      continue;
    }
  }
  return results;
}
function readJsonLines<T>(pathValue: string, guard: (value: unknown) => value is T): T[] {
  if (!existsSync(pathValue)) {
    return [];
  }
  try {
    if (lstatSync(pathValue).isSymbolicLink()) {
      return [];
    }
    const fileStats = statSync(pathValue);
    if (!fileStats.isFile() || fileStats.size > maxJsonLinesBytesRead) {
      return [];
    }
    return readFileSync(pathValue, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => parseJson(line))
      .filter((value): value is T => guard(value));
  } catch {
    return [];
  }
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
  return (
    typeof value.sessionId === 'string' &&
    isSessionId(value.sessionId) &&
    typeof value.timestamp === 'number'
  );
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
