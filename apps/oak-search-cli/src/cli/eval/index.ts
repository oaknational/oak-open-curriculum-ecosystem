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
 * oaksearch eval typegen
 * ```
 */

import { Command } from 'commander';
import { registerPassThrough } from '../shared/index.js';

/** Create the `eval benchmark` subcommand group with per-scope commands. */
function createBenchmarkCmd(): Command {
  const cmd = new Command('benchmark').description('Run search benchmarks against ground truth');

  registerPassThrough(
    cmd,
    'all',
    'Run benchmarks for all indexes',
    'evaluation/analysis/benchmark.ts',
  );
  registerPassThrough(
    cmd,
    'lessons',
    'Run lesson search benchmarks',
    'evaluation/analysis/benchmark-lessons.ts',
  );
  registerPassThrough(
    cmd,
    'units',
    'Run unit search benchmarks',
    'evaluation/analysis/benchmark-units.ts',
  );
  registerPassThrough(
    cmd,
    'threads',
    'Run thread search benchmarks',
    'evaluation/analysis/benchmark-threads.ts',
  );
  registerPassThrough(
    cmd,
    'sequences',
    'Run sequence search benchmarks',
    'evaluation/analysis/benchmark-sequences.ts',
  );

  return cmd;
}

/**
 * Create the `eval` subcommand group.
 *
 * @returns A Commander `Command` with eval subcommands registered
 */
export function evalCommand(): Command {
  const cmd = new Command('eval').description(
    'Benchmarks, ground truth validation, and type generation',
  );

  cmd.addCommand(createBenchmarkCmd());

  registerPassThrough(
    cmd,
    'validate',
    'Validate ground truth entries',
    'evaluation/validation/validate-ground-truth.ts',
  );
  registerPassThrough(
    cmd,
    'typegen',
    'Generate ground truth types from bulk data',
    'ground-truths/generation/generate-ground-truth-types.ts',
  );

  return cmd;
}
