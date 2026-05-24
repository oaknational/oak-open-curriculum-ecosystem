import { CONTEXT_COST_HELP_TEXT, parseArgs } from './cli-options.js';
import type { ContextCostFileSystem } from './file-system.js';
import { nodeContextCostFileSystem } from './file-system-node.js';
import { formatJson, formatText, formatWarnings } from './format.js';
import { tokenizeGlobs } from './tokenize-globs.js';
import { charsOverFourTokenizer, type Tokenizer } from './tokenizer.js';

export interface ContextCostCliInput {
  readonly argv: readonly string[];
  readonly cwd: string;
  readonly fs?: ContextCostFileSystem;
  readonly tokenizer?: Tokenizer;
  readonly stdout?: Pick<NodeJS.WritableStream, 'write'>;
  readonly stderr?: Pick<NodeJS.WritableStream, 'write'>;
}

export interface ContextCostCliResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

export async function runContextCostCli(input: ContextCostCliInput): Promise<ContextCostCliResult> {
  const parsed = parseArgs(input.argv);
  if (!parsed.ok) {
    return emit(input, { exitCode: 2, stdout: '', stderr: `${parsed.error}\n` });
  }

  if (parsed.options.help) {
    return emit(input, { exitCode: 0, stdout: `${CONTEXT_COST_HELP_TEXT}\n`, stderr: '' });
  }

  try {
    const result = await tokenizeGlobs(
      parsed.options.globs,
      input.cwd,
      input.fs ?? nodeContextCostFileSystem,
      input.tokenizer ?? charsOverFourTokenizer,
    );
    return emit(input, {
      exitCode: 0,
      stdout: parsed.options.json ? formatJson(result) : formatText(result),
      stderr: formatWarnings(result),
    });
  } catch (error) {
    return emit(input, {
      exitCode: 2,
      stdout: '',
      stderr: `${error instanceof Error ? error.message : String(error)}\n`,
    });
  }
}

function emit(input: ContextCostCliInput, result: ContextCostCliResult): ContextCostCliResult {
  input.stdout?.write(result.stdout);
  input.stderr?.write(result.stderr);
  return result;
}
