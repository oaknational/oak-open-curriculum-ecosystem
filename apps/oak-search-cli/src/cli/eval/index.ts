/**
 * Eval subcommand group — benchmarking and ground truth validation.
 *
 * Provides commands for running search benchmarks, validating
 * ground truth entries, and generating ground truth types.
 *
 * Benchmark commands exercise the SDK retrieval service, ensuring
 * evaluation uses the same code path as production consumers.
 *
 * @example
 * ```bash
 * oaksearch eval benchmark --index lessons
 * oaksearch eval benchmark lessons --all
 * oaksearch eval benchmark lessons -s maths -p primary --review
 * oaksearch eval validate
 * oaksearch eval codegen
 * ```
 */

import { Command } from 'commander';
import { registerPassThrough, type SearchCliEnvLoader } from '../shared/index.js';

/**
 * Create the `eval benchmark` subcommand group with per-scope commands.
 *
 * @returns A Commander `Command` with benchmark subcommands registered
 */
function createBenchmarkCmd(cliEnvLoader: SearchCliEnvLoader): Command {
  const cmd = new Command('benchmark').description('Run search benchmarks against ground truth');

  registerPassThrough(
    cmd,
    'all',
    'Run benchmarks for all indexes',
    'evaluation/analysis/benchmark.ts',
    { cliEnvLoader },
  );
  registerPassThrough(
    cmd,
    'lessons',
    'Run lesson search benchmarks',
    'evaluation/analysis/benchmark-lessons.ts',
    { cliEnvLoader },
  );
  registerPassThrough(
    cmd,
    'units',
    'Run unit search benchmarks',
    'evaluation/analysis/benchmark-units.ts',
    { cliEnvLoader },
  );
  registerPassThrough(
    cmd,
    'threads',
    'Run thread search benchmarks',
    'evaluation/analysis/benchmark-threads.ts',
    { cliEnvLoader },
  );
  registerPassThrough(
    cmd,
    'sequences',
    'Run sequence search benchmarks',
    'evaluation/analysis/benchmark-sequences.ts',
    { cliEnvLoader },
  );

  return cmd;
}

/**
 * Create the `eval` subcommand group.
 *
 * @returns A Commander `Command` with eval subcommands registered
 *
 * @example
 * ```typescript
 * const program = new Command();
 * program.addCommand(evalCommand(cliEnv));
 * ```
 */
export function evalCommand(cliEnvLoader: SearchCliEnvLoader): Command {
  const cmd = new Command('eval').description(
    'Benchmarks, ground truth validation, and type generation',
  );

  cmd.addCommand(createBenchmarkCmd(cliEnvLoader));

  registerPassThrough(
    cmd,
    'validate',
    'Validate ground truth entries',
    'evaluation/validation/validate-ground-truth.ts',
    { cliEnvLoader },
  );
  registerPassThrough(
    cmd,
    'codegen',
    'Generate ground truth types from bulk data',
    'ground-truths/generation/generate-ground-truth-types.ts',
    { cliEnvLoader },
  );

  return cmd;
}
