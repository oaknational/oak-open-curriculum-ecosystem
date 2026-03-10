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
import { loadRuntimeConfig } from '../src/runtime-config.js';
import { searchCommand } from '../src/cli/search/index.js';
import { adminCommand } from '../src/cli/admin/index.js';
import { evalCommand } from '../src/cli/eval/index.js';
import { observeCommand } from '../src/cli/observe/index.js';
import { disableFileSink } from '../src/lib/logger.js';

const configResult = loadRuntimeConfig({
  processEnv: process.env,
  startDir: import.meta.dirname,
});

if (!configResult.ok) {
  process.stderr.write(`Environment validation failed: ${configResult.error.message}\n`);
  for (const d of configResult.error.diagnostics) {
    if (!d.present) {
      process.stderr.write(`  ${d.key}: MISSING\n`);
    }
  }
  process.exit(1);
}

const config = configResult.value;

const program = new Command()
  .name('oaksearch')
  .description('Oak National Academy — curriculum semantic search CLI')
  .version(config.version);

program.addCommand(searchCommand(config.env));
program.addCommand(adminCommand(config.env));
program.addCommand(evalCommand(config.env));
program.addCommand(observeCommand(config.env));

await program.parseAsync();

const sinkResult = disableFileSink();
if (!sinkResult.ok) {
  process.stderr.write(`Warning: ${sinkResult.error.message}\n`);
}

process.exit(process.exitCode ?? 0);
