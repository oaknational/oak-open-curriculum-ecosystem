import { join } from 'node:path';

import { writeErrorLine } from '../core/terminal-output';

export interface CliArgs {
  command: 'find' | 'inspect' | 'takeover' | 'help';
  sessionId: string;
  lastHours: number;
  includeSubagents: boolean;
  file: string;
  output: string;
  historyPath: string;
  projectsRoot: string;
}

export function parseCliArgs(argv: string[]): CliArgs {
  const command = parseCommand(argv[0]);
  const homePath = resolveHomePath();
  const defaults: CliArgs = {
    command,
    sessionId: '',
    lastHours: 2,
    includeSubagents: false,
    file: '',
    output: '',
    historyPath: join(homePath, '.claude', 'history.jsonl'),
    projectsRoot: join(homePath, '.claude', 'projects'),
  };
  const rest = argv.slice(1);
  if (requiresSessionId(command) && hasPositionalSession(rest)) {
    defaults.sessionId = rest.shift() ?? '';
  }
  parseFlags(rest, defaults);
  validateParsedArgs(defaults);
  return defaults;
}

function resolveHomePath(): string {
  const homePath = process.env.HOME;
  if (homePath === undefined || homePath.length === 0) {
    exitWithError('Missing HOME environment variable');
  }
  return homePath;
}

function parseCommand(value: string | undefined): CliArgs['command'] {
  const normalizedValue = value === '--help' || value === '-h' ? 'help' : value;
  if (normalizedValue === undefined || normalizedValue === '') {
    return 'help';
  }
  if (isCommand(normalizedValue)) {
    return normalizedValue;
  }
  return exitWithError('Missing or invalid command: find | inspect | takeover | help');
}

function isCommand(value: string): value is CliArgs['command'] {
  return value === 'find' || value === 'inspect' || value === 'takeover' || value === 'help';
}

function parseFlags(rest: string[], defaults: CliArgs): void {
  const requireFlagValue = (flag: string): string => {
    const value = rest.shift();
    if (value === undefined || value.length === 0 || value.startsWith('--')) {
      exitWithError(`Flag '${flag}' requires a value`);
    }
    return value;
  };
  const handlers = new Map<string, () => void>();
  handlers.set('--include-subagents', () => {
    defaults.includeSubagents = true;
  });
  handlers.set('--last-hours', () => {
    defaults.lastHours = Number(requireFlagValue('--last-hours'));
  });
  handlers.set('--file', () => {
    defaults.file = requireFlagValue('--file');
  });
  handlers.set('--output', () => {
    defaults.output = requireFlagValue('--output');
  });
  handlers.set('--history-path', () => {
    defaults.historyPath = requireFlagValue('--history-path');
  });
  handlers.set('--projects-root', () => {
    defaults.projectsRoot = requireFlagValue('--projects-root');
  });
  while (rest.length > 0) {
    const current = rest.shift() ?? '';
    const handler = handlers.get(current);
    if (!handler) {
      if (!current.startsWith('--')) {
        exitWithError(
          `Unexpected positional argument '${current}'. Positional arguments are only supported for inspect/takeover <session-id>.`,
        );
      }
      exitWithError(`Unknown argument '${current}'`);
    }
    handler();
  }
}

function validateParsedArgs(args: CliArgs): void {
  if (!isValidLastHours(args.lastHours)) {
    exitWithError('Invalid --last-hours value');
  }
  if (requiresSessionId(args.command) && !args.sessionId) {
    exitWithError(`Command '${args.command}' requires <session-id>`);
  }
  if (args.command === 'find' && args.file !== '' && args.file.trim() === '') {
    exitWithError('--file requires a non-empty path');
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

function exitWithError(message: string): never {
  writeErrorLine(`Error: ${message}`);
  process.exit(1);
}
