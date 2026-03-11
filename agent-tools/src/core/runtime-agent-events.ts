import { existsSync, lstatSync, readFileSync, statSync } from 'node:fs';
import { writeErrorLine } from './terminal-output';

interface JsonCandidate {
  message?: unknown;
  stop_reason?: unknown;
  content?: unknown;
  type?: unknown;
  name?: unknown;
  input?: unknown;
  command?: unknown;
}

export interface AgentEvents {
  stopReason: string;
  toolNames: string[];
  bashCommands: string[];
}

interface AgentEventsFileSystem {
  existsSync(pathValue: string): boolean;
  statSync(pathValue: string): { size: number; isFile(): boolean };
  lstatSync(pathValue: string): { isSymbolicLink(): boolean };
  readFileSync(pathValue: string, encoding: 'utf8'): string;
}

const nodeAgentEventsFileSystem: AgentEventsFileSystem = {
  existsSync,
  statSync,
  lstatSync,
  readFileSync,
};

const maxAgentEventsFileBytes = 5 * 1024 * 1024;

export function readAgentEvents(jsonlPath: string): AgentEvents {
  return readAgentEventsWithFs(jsonlPath, nodeAgentEventsFileSystem);
}

/** Read agent events using an injected filesystem for testability. */
export function readAgentEventsWithFs(
  jsonlPath: string,
  fileSystem: AgentEventsFileSystem,
): AgentEvents {
  if (!isReadableEventsFile(jsonlPath, fileSystem)) {
    return emptyEvents();
  }
  const lines = readEventsLines(jsonlPath, fileSystem);
  if (lines === null) {
    return emptyEvents();
  }
  const events = emptyEvents();
  for (const line of lines) {
    const payload = parseJsonLine(line);
    appendPayloadEvents(events, payload);
  }
  return events;
}

function isReadableEventsFile(pathValue: string, fileSystem: AgentEventsFileSystem): boolean {
  if (!fileSystem.existsSync(pathValue)) {
    return false;
  }
  try {
    if (fileSystem.lstatSync(pathValue).isSymbolicLink()) {
      return false;
    }
    const fileStats = fileSystem.statSync(pathValue);
    return fileStats.isFile() && fileStats.size <= maxAgentEventsFileBytes;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    writeErrorLine(`Error: failed to inspect agent events file '${pathValue}': ${message}`);
    return false;
  }
}

function readEventsLines(pathValue: string, fileSystem: AgentEventsFileSystem): string[] | null {
  try {
    return fileSystem
      .readFileSync(pathValue, 'utf8')
      .split('\n')
      .filter((line) => line.trim().length > 0);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    writeErrorLine(`Error: failed to read agent events file '${pathValue}': ${message}`);
    return null;
  }
}

function appendPayloadEvents(events: AgentEvents, payload: unknown): void {
  if (!isJson(payload) || !isJson(payload.message)) {
    return;
  }
  const message = payload.message;
  if (typeof message.stop_reason === 'string') {
    events.stopReason = message.stop_reason;
  }
  if (!Array.isArray(message.content)) {
    return;
  }
  for (const block of message.content) {
    appendBlockEvent(events, block);
  }
}

function appendBlockEvent(events: AgentEvents, block: unknown): void {
  if (!isJson(block) || block.type !== 'tool_use' || typeof block.name !== 'string') {
    return;
  }
  events.toolNames.push(block.name);
  if (block.name !== 'Bash' || !isJson(block.input) || typeof block.input.command !== 'string') {
    return;
  }
  events.bashCommands.push(block.input.command);
}

function parseJsonLine(line: string): unknown {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

function isJson(value: unknown): value is JsonCandidate {
  return typeof value === 'object' && value !== null;
}

function emptyEvents(): AgentEvents {
  return { stopReason: '', toolNames: [], bashCommands: [] };
}
