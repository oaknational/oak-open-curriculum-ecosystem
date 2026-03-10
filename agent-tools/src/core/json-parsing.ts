import { closeSync, fstatSync, openSync, readFileSync } from 'node:fs';
import { isSessionId } from './runtime-paths';

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

export type { HistoryRow, MetaRow };

const maxJsonLinesBytesRead = 5 * 1024 * 1024;

/** Read a JSONL file, returning only lines that pass the type guard. */
export function readJsonLines<T>(pathValue: string, guard: (value: unknown) => value is T): T[] {
  let fileDescriptor: number | null = null;
  try {
    fileDescriptor = openSync(pathValue, 'r');
    const fileStats = fstatSync(fileDescriptor);
    if (!fileStats.isFile() || fileStats.size > maxJsonLinesBytesRead) {
      return [];
    }
    return readFileSync(fileDescriptor, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => parseJson(line))
      .filter((value): value is T => guard(value));
  } catch {
    return [];
  } finally {
    if (fileDescriptor !== null) {
      closeSync(fileDescriptor);
    }
  }
}

function parseJson(line: string): unknown {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

/** Type guard: value is a valid history row with sessionId and timestamp. */
export function isHistoryRow(value: unknown): value is HistoryRow {
  if (!isJsonCandidate(value)) {
    return false;
  }
  return (
    typeof value.sessionId === 'string' &&
    isSessionId(value.sessionId) &&
    typeof value.timestamp === 'number'
  );
}

/** Type guard: value is a valid meta row with optional agentType. */
export function isMetaRow(value: unknown): value is MetaRow {
  if (!isJsonCandidate(value)) {
    return false;
  }
  return value.agentType === undefined || typeof value.agentType === 'string';
}

function isJsonCandidate(value: unknown): value is JsonCandidate {
  return typeof value === 'object' && value !== null;
}
