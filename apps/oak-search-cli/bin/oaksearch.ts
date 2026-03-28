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
import { createSearchCliEnvLoader } from '../src/runtime-config.js';
import { searchCommand } from '../src/cli/search/index.js';
import { adminCommand } from '../src/cli/admin/index.js';
import { evalCommand } from '../src/cli/eval/index.js';
import { observeCommand } from '../src/cli/observe/index.js';
import { disableFileSink } from '../src/lib/logger.js';

const cliEnvLoader = createSearchCliEnvLoader({
  processEnv: process.env,
  startDir: import.meta.dirname,
});

const program = new Command()
  .name('oaksearch')
  .description('Oak National Academy — curriculum semantic search CLI')
  .version(process.env.npm_package_version ?? '0.0.0');

program.addCommand(searchCommand(cliEnvLoader));
program.addCommand(adminCommand(cliEnvLoader));
program.addCommand(evalCommand(cliEnvLoader));
program.addCommand(observeCommand(cliEnvLoader));

try {
  await program.parseAsync();
} finally {
  const sinkResult = disableFileSink();
  if (!sinkResult.ok) {
    process.stderr.write(`Warning: ${sinkResult.error.message}\n`);
  }
  process.exit(process.exitCode ?? 0);
}
