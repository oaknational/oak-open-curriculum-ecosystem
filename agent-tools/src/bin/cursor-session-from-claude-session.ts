#!/usr/bin/env node

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import {
  discoverSessions,
  formatTimestamp,
  readHistory,
  readDirectoryFiles,
  repoRoot,
  sessionDirectory,
  subagentSummaries,
  targetNeedles,
} from '../core/runtime';
import {
  buildTakeoverBundle,
  findSessionByPrefix,
  filterByWindow,
  mergeSessionsById,
  scoreSessionMatch,
  type SessionEntry,
} from '../core/session-tools';
import { writeErrorLine, writeLine } from '../core/terminal-output';

interface CliArgs {
  command: 'find' | 'inspect' | 'takeover';
  sessionId: string;
  lastHours: number;
  includeSubagents: boolean;
  file: string;
  output: string;
  historyPath: string;
  projectsRoot: string;
}

function run(): void {
  const args = parseCliArgs(process.argv.slice(2));
  const root = repoRoot();
  const sessions = mergeSessionsById(
    readHistory(args.historyPath),
    discoverSessions(args.projectsRoot, root),
  );
  const inWindow = filterByWindow(sessions, args.lastHours, Date.now());
  if (args.command === 'find') {
    runFind(args, root, inWindow);
    return;
  }
  const selected = findSessionByPrefix(args.sessionId, inWindow);
  if (!selected) {
    exitWithError(`No session starts with '${args.sessionId}'`);
  }
  if (args.command === 'inspect') {
    runInspect(args, root, selected);
    return;
  }
  runTakeover(args, root, selected);
}

function parseCliArgs(argv: string[]): CliArgs {
  const command = parseCommand(argv[0]);
  const defaults: CliArgs = {
    command,
    sessionId: '',
    lastHours: 2,
    includeSubagents: false,
    file: '',
    output: '',
    historyPath: join(process.env.HOME ?? '', '.claude', 'history.jsonl'),
    projectsRoot: join(process.env.HOME ?? '', '.claude', 'projects'),
  };
  const rest = argv.slice(1);
  if (requiresSessionId(command) && hasPositionalSession(rest)) {
    defaults.sessionId = rest.shift() ?? '';
  }
  parseFlags(rest, defaults);
  validateParsedArgs(defaults);
  return defaults;
}

function parseCommand(value: string | undefined): CliArgs['command'] {
  if (value === 'find' || value === 'inspect' || value === 'takeover') {
    return value;
  }
  return exitWithError('Missing or invalid command: find | inspect | takeover');
}

function parseFlags(rest: string[], defaults: CliArgs): void {
  const handlers = new Map<string, (nextValue: () => string) => void>();
  handlers.set('--include-subagents', () => {
    defaults.includeSubagents = true;
  });
  handlers.set('--last-hours', (nextValue) => {
    defaults.lastHours = Number(nextValue() || '2');
  });
  handlers.set('--file', (nextValue) => {
    defaults.file = nextValue();
  });
  handlers.set('--output', (nextValue) => {
    defaults.output = nextValue();
  });
  handlers.set('--history-path', (nextValue) => {
    defaults.historyPath = nextValue() || defaults.historyPath;
  });
  handlers.set('--projects-root', (nextValue) => {
    defaults.projectsRoot = nextValue() || defaults.projectsRoot;
  });
  while (rest.length > 0) {
    const current = rest.shift() ?? '';
    const nextValue = () => rest.shift() ?? '';
    const handler = handlers.get(current);
    if (!handler) {
      exitWithError(`Unknown argument '${current}'`);
    }
    handler(nextValue);
  }
}

function validateParsedArgs(args: CliArgs): void {
  if (!isValidLastHours(args.lastHours)) {
    exitWithError('Invalid --last-hours value');
  }
  if (requiresSessionId(args.command) && !args.sessionId) {
    exitWithError(`Command '${args.command}' requires <session-id>`);
  }
}

function requiresSessionId(command: CliArgs['command']): boolean {
  return command === 'inspect' || command === 'takeover';
}

function hasPositionalSession(rest: string[]): boolean {
  const first = rest[0];
  return Boolean(first && !first.startsWith('--'));
}

function isValidLastHours(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function runFind(args: CliArgs, root: string, sessions: SessionEntry[]): void {
  const needles = args.file ? targetNeedles(root, args.file) : [];
  const ranked = sessions
    .map((entry) => ({
      entry,
      match:
        needles.length === 0
          ? { score: 1, source: 'time-window' }
          : scoreSessionMatch(
              buildMatchInput(
                entry.display,
                sessionDirectory(args.projectsRoot, root, entry.sessionId),
                needles,
              ),
            ),
    }))
    .filter((row) => needles.length === 0 || row.match.score > 1)
    .sort((left, right) => right.entry.timestampMs - left.entry.timestampMs);

  if (ranked.length === 0) {
    writeLine('No matching Claude sessions found.');
    return;
  }
  for (const row of ranked) {
    writeLine(`- session: ${row.entry.sessionId}`);
    writeLine(`  time: ${formatTimestamp(row.entry.timestampMs)}`);
    writeLine(`  source: ${row.match.source}`);
    writeLine(`  display: ${row.entry.display || '(empty)'}`);
    if (args.includeSubagents) {
      const subagents = subagentSummaries(
        sessionDirectory(args.projectsRoot, root, row.entry.sessionId),
      );
      writeLine(`  subagents: ${subagents.length}`);
    }
  }
}

function runInspect(args: CliArgs, root: string, session: SessionEntry): void {
  const pathValue = sessionDirectory(args.projectsRoot, root, session.sessionId);
  writeLine(`session: ${session.sessionId}`);
  writeLine(`time: ${formatTimestamp(session.timestampMs)}`);
  writeLine(`display: ${session.display || '(empty)'}`);
  writeLine(`path: ${pathValue}`);
  const subagents = subagentSummaries(pathValue);
  writeLine(`subagents: ${subagents.length}`);
}

function runTakeover(args: CliArgs, root: string, session: SessionEntry): void {
  const subagents = subagentSummaries(sessionDirectory(args.projectsRoot, root, session.sessionId));
  const content = buildTakeoverBundle({
    sessionId: session.sessionId,
    timestampIso: formatTimestamp(session.timestampMs),
    repoPath: root,
    display: session.display,
    subagents,
  });
  if (args.output) {
    mkdirSync(dirname(args.output), { recursive: true });
    writeFileSync(args.output, `${content}\n`, 'utf8');
    writeLine(`Wrote takeover bundle: ${args.output}`);
    return;
  }
  writeLine(content);
}

function buildMatchInput(display: string, sessionPath: string, needles: string[]) {
  const subagentDirectory = join(sessionPath, 'subagents');
  const subagentEntries = readDirectoryFiles(subagentDirectory, (name) => name.endsWith('.jsonl'));
  const subagentFileNames = subagentEntries.map((entry) => entry.name);
  const subagentFileContents = subagentEntries.map((entry) => entry.content);
  const fileHistoryContents = readDirectoryFiles(
    sessionPath,
    (name) => name.endsWith('.jsonl') && !name.startsWith('agent-'),
  ).map((entry) => entry.content);
  return {
    display,
    subagentFileNames,
    subagentFileContents,
    fileHistoryContents,
    needles,
  };
}

function exitWithError(message: string): never {
  writeErrorLine(`Error: ${message}`);
  process.exit(1);
}

run();
