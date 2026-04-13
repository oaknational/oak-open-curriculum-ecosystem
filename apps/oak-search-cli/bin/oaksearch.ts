/**
 * Oak Search CLI — entry point.
 *
 * Single entry point for all search operations. Subcommands are
 * grouped by responsibility: search, admin, eval, and observe.
 *
 * This is a composition root: `process.env` is read here and nowhere
 * else. The validated `SearchCliEnv` is threaded through all downstream
 * modules via function parameters (ADR-078).
 *
 * @example
 * ```bash
 * oaksearch search lessons "expanding brackets" --subject maths
 * oaksearch admin setup
 * oaksearch eval benchmark --index lessons
 * oaksearch observe summary
 * ```
 */

import { Command } from 'commander';
import { parseLogLevel } from '@oaknational/logger';
import { loadRuntimeConfig, createSearchCliEnvLoader } from '../src/runtime-config.js';
import { searchCommand } from '../src/cli/search/index.js';
import { adminCommand } from '../src/cli/admin/index.js';
import { evalCommand } from '../src/cli/eval/index.js';
import { observeCommand } from '../src/cli/observe/index.js';
import {
  configureLogLevel,
  disableFileSink,
  registerAdditionalSink,
  clearAdditionalSinks,
} from '../src/lib/logger.js';
import {
  createCliObservability,
  describeCliObservabilityError,
  type CliObservability,
} from '../src/observability/index.js';

const loadOptions = {
  processEnv: process.env,
  startDir: import.meta.dirname,
};

const cliEnvLoader = createSearchCliEnvLoader(loadOptions);

/* ------------------------------------------------------------------ */
/* Observability init (non-fatal — SENTRY_MODE=off is default)        */
/* ------------------------------------------------------------------ */

let cliObservability: CliObservability | undefined;

const configResult = loadRuntimeConfig(loadOptions);
if (configResult.ok) {
  configureLogLevel(parseLogLevel(configResult.value.logLevel));
  const obsResult = createCliObservability(configResult.value);
  if (obsResult.ok) {
    cliObservability = obsResult.value;
    if (cliObservability.sentrySink) {
      registerAdditionalSink(cliObservability.sentrySink);
    }
  } else {
    process.stderr.write(
      `Warning: observability init failed (${describeCliObservabilityError(obsResult.error)}), continuing without Sentry\n`,
    );
  }
} else {
  // Config failure is non-fatal here: --help and --version still work.
  // Actual env validation error fires via withLoadedCliEnv when a command runs.
  process.stderr.write('Warning: config load failed, observability disabled\n');
}

/* ------------------------------------------------------------------ */
/* Command registration                                               */
/* ------------------------------------------------------------------ */

const program = new Command()
  .name('oaksearch')
  .description('Oak National Academy — curriculum semantic search CLI')
  .version(process.env.npm_package_version ?? '0.0.0');

program.addCommand(searchCommand(cliEnvLoader, cliObservability));
program.addCommand(adminCommand(cliEnvLoader, cliObservability));
program.addCommand(evalCommand(cliEnvLoader, cliObservability));
program.addCommand(observeCommand(cliEnvLoader, cliObservability));

/* ------------------------------------------------------------------ */
/* Execute and clean up                                               */
/* ------------------------------------------------------------------ */

try {
  await program.parseAsync();
} finally {
  if (cliObservability) {
    const closeResult = await cliObservability.close();
    if (!closeResult.ok) {
      process.stderr.write('Warning: Sentry close failed\n');
    }
  }
  clearAdditionalSinks();
  const sinkResult = disableFileSink();
  if (!sinkResult.ok) {
    process.stderr.write(`Warning: ${sinkResult.error.message}\n`);
  }
  process.exit(process.exitCode ?? 0);
}
