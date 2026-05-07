import { type SubstrateFinding } from './types.js';

export interface PracticeSubstrateReport {
  readonly ok: boolean;
  readonly mode: 'report';
  readonly summary: {
    readonly blocking: number;
    readonly reviewRequired: number;
    readonly informational: number;
  };
  readonly findings: readonly SubstrateFinding[];
}

export interface PracticeSubstrateCliOptions {
  readonly command: 'check';
  readonly mode: 'report';
  readonly repoRoot?: string;
  readonly targetRef?: string;
}

export interface PracticeSubstrateCliResult {
  readonly exitCode: 0 | 1 | 2;
  readonly stdout: string;
  readonly stderr: string;
}

export interface PracticeSubstrateCliRunnerInput {
  readonly argv: readonly string[];
  readonly repoRoot: string;
  readonly executeReport: (
    options: PracticeSubstrateCliOptions,
  ) => Promise<PracticeSubstrateReport>;
}

interface ParsedPracticeSubstrateArgs {
  readonly mode?: string;
  readonly repoRoot?: string;
  readonly targetRef?: string;
}

/**
 * Build the stable JSON report shape for read-only report mode.
 */
export function createPracticeSubstrateReport(
  findings: readonly SubstrateFinding[],
): PracticeSubstrateReport {
  const summary = {
    blocking: findings.filter((item) => item.severity === 'blocking').length,
    reviewRequired: findings.filter((item) => item.severity === 'review-required').length,
    informational: findings.filter((item) => item.severity === 'informational').length,
  };

  return {
    ok: summary.blocking === 0,
    mode: 'report',
    summary,
    findings,
  };
}

/**
 * Parse the intentionally narrow Phase 2 CLI surface.
 */
export function parsePracticeSubstrateCliArgs(
  argv: readonly string[],
): PracticeSubstrateCliOptions {
  const [command, ...args] = stripPnpmSeparator(argv);
  if (command !== 'check') {
    throw new Error('practice-substrate supports only the check command in Phase 2');
  }

  const parsed = parseOptions(args);
  if (parsed.mode !== undefined && parsed.mode !== 'report') {
    throw new Error('practice-substrate check supports only --mode report in Phase 2');
  }

  return {
    command,
    mode: 'report',
    ...(parsed.repoRoot === undefined ? {} : { repoRoot: parsed.repoRoot }),
    ...(parsed.targetRef === undefined ? {} : { targetRef: parsed.targetRef }),
  };
}

function stripPnpmSeparator(argv: readonly string[]): readonly string[] {
  return argv[0] === '--' ? argv.slice(1) : argv;
}

/**
 * Execute report mode and map deterministic result classes to CLI exit codes.
 */
export async function runPracticeSubstrateCli(
  input: PracticeSubstrateCliRunnerInput,
): Promise<PracticeSubstrateCliResult> {
  try {
    const options = parsePracticeSubstrateCliArgs(input.argv);
    const report = await input.executeReport({
      ...options,
      repoRoot: options.repoRoot ?? input.repoRoot,
    });

    return {
      exitCode: report.ok ? 0 : 1,
      stdout: `${JSON.stringify(report, null, 2)}\n`,
      stderr: '',
    };
  } catch (error) {
    return {
      exitCode: 2,
      stdout: '',
      stderr: `${error instanceof Error ? error.message : String(error)}\n`,
    };
  }
}

function parseOptions(args: readonly string[]): ParsedPracticeSubstrateArgs {
  let parsed: ParsedPracticeSubstrateArgs = {};

  for (let index = 0; index < args.length; index += 1) {
    const option = args[index];
    if (!isKnownOption(option)) {
      throw new Error(`Unknown practice-substrate option ${option}`);
    }
    const next = readOptionValue(args, index, option);
    parsed = updateParsedOptions(parsed, option, next);
    index += 1;
  }

  return parsed;
}

function updateParsedOptions(
  parsed: ParsedPracticeSubstrateArgs,
  option: string,
  value: string,
): ParsedPracticeSubstrateArgs {
  if (option === '--mode') {
    return { ...parsed, mode: value };
  }
  if (option === '--repo-root') {
    return { ...parsed, repoRoot: value };
  }
  if (option === '--target-ref') {
    return { ...parsed, targetRef: value };
  }

  throw new Error(`Unknown practice-substrate option ${option}`);
}

function isKnownOption(option: string): boolean {
  return option === '--mode' || option === '--repo-root' || option === '--target-ref';
}

function readOptionValue(args: readonly string[], index: number, option: string): string {
  const value = args[index + 1];
  if (value === undefined || value.startsWith('--')) {
    throw new Error(`${option} requires a value`);
  }

  return value;
}
