import { writeErrorLine } from '../core/terminal-output';

export interface CliArgs {
  command: CliCommand;
  agentId: string;
  watch: boolean;
}

export type CliHandler = () => void | Promise<void>;

const CLI_COMMANDS = [
  'status',
  'worktrees',
  'log',
  'diff',
  'commit-ready',
  'preflight',
  'cleanup',
  'help',
] as const;

export type CliCommand = (typeof CLI_COMMANDS)[number];

const CLI_COMMAND_SET: ReadonlySet<string> = new Set(CLI_COMMANDS);
const HELP_ALIASES = new Set(['help', '--help', '-h']);

export const HELP_TEXT =
  'claude-agent-ops — CLI for monitoring and managing Claude background agents\n\nCommands:\n  status [--watch]\n  worktrees\n  log <id>\n  diff [id]\n  commit-ready\n  preflight\n  cleanup\n  help';

export function parseCliArgs(argv: string[]): CliArgs {
  const command = parseCommand(argv[0] ?? 'status');
  return {
    command,
    agentId: argv[1] ?? '',
    watch: argv.includes('--watch') || argv.includes('-w'),
  };
}

function parseCommand(value: string): CliCommand {
  if (HELP_ALIASES.has(value)) {
    return 'help';
  }
  if (isCliCommand(value)) {
    return value;
  }
  return exitWithError(`Unknown command '${value}'`);
}

function isCliCommand(value: string): value is CliCommand {
  return CLI_COMMAND_SET.has(value);
}

function exitWithError(message: string): never {
  writeErrorLine(`Error: ${message}`);
  process.exit(1);
}
