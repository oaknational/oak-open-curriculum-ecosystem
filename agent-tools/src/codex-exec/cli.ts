import { createInterface } from 'node:readline';

import {
  readCommandRecords,
  renderSummary,
  type CommandRecordsSummary,
} from './command-records/index.js';
import { extractLastAgentMessage } from './turn-events.js';
import type { CodexExecCliInput, OutputFormat } from './types.js';

export async function runCodexExecCli(input: CodexExecCliInput): Promise<number> {
  if (input.command === undefined || input.command === 'help' || input.command === '--help') {
    input.stdout.write(`${usage()}\n`);
    return 0;
  }

  if (input.command === 'last-message') {
    return runLastMessage(input);
  }

  if (input.command === 'command-records') {
    return runCommandRecords(input);
  }

  input.stderr.write(`unknown command: ${input.command}\n${usage()}\n`);
  return 2;
}

async function runLastMessage(input: CodexExecCliInput): Promise<number> {
  const flags = parseCommonFlags(input.args);
  if (flags.kind === 'error') {
    input.stderr.write(`${flags.message}\n${usage()}\n`);
    return 2;
  }
  const lines = await readLines(input.stdin);
  const outcome = extractLastAgentMessage(lines);

  if (!outcome.found) {
    if (flags.strict) {
      input.stderr.write('no agent_message found in input\n');
      return 1;
    }
    return 0;
  }

  if (flags.format === 'json') {
    input.stdout.write(`${JSON.stringify({ text: outcome.text })}\n`);
  } else {
    input.stdout.write(`${outcome.text}\n`);
  }
  return 0;
}

/** Why a strict run refuses the rollout; empty when it does not. */
function strictReasons(summary: CommandRecordsSummary): string[] {
  const reasons: string[] = [];
  if (summary.turns === 0) {
    reasons.push('no turn started');
  }
  const ran = summary.flagged
    .filter((entry) => entry.kind !== 'refused')
    .reduce((shapes, entry) => shapes + entry.hits.length, 0);
  if (ran > 0) {
    reasons.push(`${ran} forbidden shape(s) ran`);
  }
  if (summary.unaccounted > 0) {
    reasons.push(`${summary.unaccounted} unaccounted exec call(s)`);
  }
  if (summary.malformed.length > 0) {
    reasons.push(`${summary.malformed.length} malformed evidence record(s)`);
  }
  if (summary.invalidLines.length > 0) {
    reasons.push(`${summary.invalidLines.length} invalid line(s)`);
  }
  return reasons;
}

/** Summarise a seat's rollout from stdin; under `--strict` the summary still prints before exit 1. */
async function runCommandRecords(input: CodexExecCliInput): Promise<number> {
  const flags = parseCommonFlags(input.args);
  if (flags.kind === 'error') {
    input.stderr.write(`${flags.message}\n${usage()}\n`);
    return 2;
  }
  const summary = readCommandRecords(await readLines(input.stdin));
  input.stdout.write(`${renderSummary(summary, flags.format)}\n`);
  if (!flags.strict) {
    return 0;
  }
  const reasons = strictReasons(summary);
  if (reasons.length === 0) {
    return 0;
  }
  input.stderr.write(`command-records --strict: ${reasons.join('; ')}\n`);
  return 1;
}

function readLines(stream: NodeJS.ReadableStream): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const lines: string[] = [];
    const rl = createInterface({ input: stream, crlfDelay: Infinity });
    rl.on('line', (line) => {
      lines.push(line);
    });
    rl.on('close', () => {
      resolve(lines);
    });
    rl.on('error', reject);
  });
}

type FormatParse =
  | { readonly kind: 'ok'; readonly value: OutputFormat }
  | { readonly kind: 'error'; readonly message: string };

function parseFormat(args: readonly string[]): FormatParse {
  const idx = args.indexOf('--format');
  if (idx === -1) {
    return { kind: 'ok', value: 'text' };
  }
  const val = args[idx + 1];
  if (val === 'text' || val === 'json') {
    return { kind: 'ok', value: val };
  }
  if (val === undefined) {
    return { kind: 'error', message: '--format requires a value (text or json)' };
  }
  return { kind: 'error', message: `--format must be text or json, got: ${val}` };
}

/** The flags every subcommand takes: `--format text|json` and `--strict`. */
type CommonFlags =
  | { readonly kind: 'ok'; readonly strict: boolean; readonly format: OutputFormat }
  | { readonly kind: 'error'; readonly message: string };

function parseCommonFlags(args: readonly string[]): CommonFlags {
  const format = parseFormat(args);
  if (format.kind === 'error') {
    return format;
  }
  return { kind: 'ok', strict: args.includes('--strict'), format: format.value };
}

function usage(): string {
  return [
    'Usage: codex-exec <command> [options]',
    '',
    'Commands:',
    '  last-message [--format text|json] [--strict]',
    '    Read JSONL from stdin, extract the last agent_message text.',
    '    --strict  Exit 1 if no message is found.',
    '  command-records [--format text|json] [--strict]',
    "    Read a seat's rollout (JSONL) from stdin; summarise the commands the harness ran.",
    '    A call is accounted only by a code-mode wrapper the harness completed; a function-tool',
    '    output (exec_command on a TUI seat) that is no refusal reads as unaccounted, so --strict',
    '    passes code-mode seats alone.',
    '    --strict  Exit 1 when no turn started, a forbidden shape of the seat rules ran, an exec',
    '              call is unaccounted, or an evidence record or a line could not be read. A',
    '              refusal alone prints and passes.',
  ].join('\n');
}
