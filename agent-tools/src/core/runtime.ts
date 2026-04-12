import { execSync, spawnSync } from 'node:child_process';
import { existsSync, lstatSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import type { SessionEntry, SubagentSummary } from './session-tools';
import { shouldSkipCompactAgent } from './session-tools';
import { escapedRepoPath, isSessionId } from './runtime-paths';
import { isHistoryRow, isMetaRow, readJsonLines } from './json-parsing';
import { writeErrorLine } from './terminal-output';
export { listAgentShortIds, resolveAgentJsonlPath } from './runtime-agent-index';
export { readAgentEvents } from './runtime-agent-events';
/** File-system contract used by runtime helpers for dependency injection in tests. */
interface RuntimeFileSystem {
  /** Check whether the path exists. */
  existsSync(pathValue: string): boolean;
  /** List entries directly under a directory. */
  readdirSync(pathValue: string): string[];
  /** Read stat information for files or directories. */
  statSync(pathValue: string): {
    mtimeMs: number;
    size: number;
    isFile(): boolean;
    isDirectory(): boolean;
  };
  /** Read symlink metadata without following links. */
  lstatSync(pathValue: string): { isSymbolicLink(): boolean };
  /** Read UTF-8 file content. */
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
export function repoRoot(): string {
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to determine repository root from '${process.cwd()}': ${message}`, {
      cause: error,
    });
  }
}
export function readHistory(pathValue: string): SessionEntry[] {
  return readJsonLines(pathValue, isHistoryRow).map((row) => ({
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      writeErrorLine(`Error: unable to inspect session entry '${sessionPath}': ${message}`);
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
    const [meta] = readJsonLines(metaPath, isMetaRow);
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
  return new Date(timestampMs)
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d{3}Z$/, ' UTC');
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
function readDirectoryFilesWithFs(
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
      writeErrorLine(
        `Error: directory read truncated at ${String(maxDirectoryFilesRead)} files: '${directoryPath}'`,
      );
      break;
    }
    const fileResult = readSafeFile(directoryPath, name, fileSystem);
    if (fileResult !== null) {
      results.push(fileResult);
    }
  }
  return results;
}

function readSafeFile(
  directoryPath: string,
  name: string,
  fileSystem: RuntimeFileSystem,
): { name: string; content: string } | null {
  const pathValue = join(directoryPath, name);
  try {
    const fileType = fileSystem.lstatSync(pathValue);
    if (fileType.isSymbolicLink()) {
      return null;
    }
    const fileStats = fileSystem.statSync(pathValue);
    if (!fileStats.isFile() || fileStats.size > maxFileBytesRead) {
      return null;
    }
    return {
      name,
      content: fileSystem.readFileSync(pathValue, 'utf8'),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    writeErrorLine(`Error: unable to read directory entry '${pathValue}': ${message}`);
    return null;
  }
}
