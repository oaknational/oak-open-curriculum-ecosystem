/**
 * Oak Search CLI — entry point.
 *
 * Single entry point for all search operations. Subcommands are
 * grouped by responsibility: search, admin, eval, and observe.
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
import { searchCommand } from '../src/cli/search/index.js';
import { adminCommand } from '../src/cli/admin/index.js';
import { evalCommand } from '../src/cli/eval/index.js';
import { observeCommand } from '../src/cli/observe/index.js';

const program = new Command()
  .name('oaksearch')
  .description('Oak National Academy — curriculum semantic search CLI')
  .version('0.0.0-development');

program.addCommand(searchCommand());
program.addCommand(adminCommand());
program.addCommand(evalCommand());
program.addCommand(observeCommand());

program.parse();
