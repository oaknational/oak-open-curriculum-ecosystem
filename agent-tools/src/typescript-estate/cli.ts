import { err, isErr, ok, type Result } from '@oaknational/result';

import { EstateReviewError } from './errors.js';

export interface EstateExtractRequest {
  readonly inputRef: string;
  readonly outDirectory: string;
  readonly cwd: string;
  readonly env: NodeJS.ProcessEnv;
}

export interface EstateExtractResult {
  readonly outputPath: string;
  readonly commit: string;
  readonly denominator: number;
}

export interface TypeScriptEstateCliRuntime {
  extract(request: EstateExtractRequest): Promise<EstateExtractResult>;
}

export interface TypeScriptEstateCliInput {
  readonly args: readonly string[];
  readonly cwd: string;
  readonly env: NodeJS.ProcessEnv;
  readonly runtime: TypeScriptEstateCliRuntime;
}

export interface TypeScriptEstateCliResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

interface ExtractFlags {
  readonly inputRef: string;
  readonly outDirectory: string;
}

export async function runTypeScriptEstateCli(
  input: TypeScriptEstateCliInput,
): Promise<TypeScriptEstateCliResult> {
  try {
    const args = normaliseArgs(input.args);
    if (isHelp(args)) {
      return { exitCode: 0, stdout: `${usage()}\n`, stderr: '' };
    }
    const parsed = parseExtractFlags(args);
    if (isErr(parsed)) {
      return errorResult(parsed.error.message);
    }
    const flags = parsed.value;
    const result = await input.runtime.extract({
      inputRef: flags.inputRef,
      outDirectory: flags.outDirectory,
      cwd: input.cwd,
      env: input.env,
    });
    return {
      exitCode: 0,
      stdout: `${JSON.stringify(result)}\n`,
      stderr: '',
    };
  } catch (cause: unknown) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return errorResult(message);
  }
}

function normaliseArgs(args: readonly string[]): readonly string[] {
  return args[0] === '--' ? args.slice(1) : args;
}

function isHelp(args: readonly string[]): boolean {
  if (args.length === 0) {
    return true;
  }
  const helpAtRoot = args.length === 1 && (args[0] === '--help' || args[0] === '-h');
  const helpAtAction =
    args.length === 2 && args[0] === 'extract' && (args[1] === '--help' || args[1] === '-h');
  return helpAtRoot || helpAtAction;
}

function parseExtractFlags(args: readonly string[]): Result<ExtractFlags, EstateReviewError> {
  if (args[0] !== 'extract') {
    return err(new EstateReviewError('CLI_INVALID', "expected action 'extract'"));
  }
  const values = parsePairs(args.slice(1));
  if (isErr(values)) {
    return values;
  }
  return flagsFromValues(values.value);
}

function parsePairs(
  args: readonly string[],
): Result<ReadonlyMap<string, string>, EstateReviewError> {
  const values = new Map<string, string>();
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    const value = args[index + 1];
    if ((flag !== '--ref' && flag !== '--out') || value === undefined || value.length === 0) {
      return err(new EstateReviewError('CLI_INVALID', `invalid argument at position ${index + 2}`));
    }
    if (values.has(flag)) {
      return err(new EstateReviewError('CLI_INVALID', `duplicate flag ${flag}`));
    }
    values.set(flag, value);
  }
  return ok(values);
}

function flagsFromValues(
  values: ReadonlyMap<string, string>,
): Result<ExtractFlags, EstateReviewError> {
  const inputRef = values.get('--ref');
  const outDirectory = values.get('--out');
  if (inputRef === undefined || outDirectory === undefined) {
    const missing = inputRef === undefined ? '--ref' : '--out';
    return err(new EstateReviewError('CLI_INVALID', `missing ${missing}`));
  }
  return ok({ inputRef, outDirectory });
}

export function usage(): string {
  return 'Usage: agent-tools typescript-estate extract --ref <git-ref> --out <repo-directory>';
}

function errorResult(message: string): TypeScriptEstateCliResult {
  return { exitCode: 2, stdout: '', stderr: `${usage()}\n\nError: ${message}\n` };
}
