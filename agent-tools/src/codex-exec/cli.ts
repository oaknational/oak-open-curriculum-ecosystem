import { createInterface } from 'node:readline';

import { extractLastAgentMessage } from './parse-events.js';
import type { CodexExecCliInput, OutputFormat } from './types.js';

export async function runCodexExecCli(input: CodexExecCliInput): Promise<number> {
  if (input.command === undefined || input.command === 'help' || input.command === '--help') {
    input.stdout.write(`${usage()}\n`);
    return 0;
  }

  if (input.command === 'last-message') {
    return runLastMessage(input);
  }

  input.stderr.write(`unknown command: ${input.command}\n${usage()}\n`);
  return 2;
}

async function runLastMessage(input: CodexExecCliInput): Promise<number> {
  const strict = input.args.includes('--strict');
  const formatResult = parseFormat(input.args);
  if (formatResult.kind === 'error') {
    input.stderr.write(`${formatResult.message}\n${usage()}\n`);
    return 2;
  }
  const format = formatResult.value;
  const lines = await readLines(input.stdin);
  const outcome = extractLastAgentMessage(lines);

  if (!outcome.found) {
    if (strict) {
      input.stderr.write('no agent_message found in input\n');
      return 1;
    }
    return 0;
  }

  if (format === 'json') {
    input.stdout.write(`${JSON.stringify({ text: outcome.text })}\n`);
  } else {
    input.stdout.write(`${outcome.text}\n`);
  }
  return 0;
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

function usage(): string {
  return [
    'Usage: codex-exec <command> [options]',
    '',
    'Commands:',
    '  last-message [--format text|json] [--strict]',
    '    Read JSONL from stdin, extract the last agent_message text.',
    '    --strict  Exit 1 if no message is found.',
  ].join('\n');
}
