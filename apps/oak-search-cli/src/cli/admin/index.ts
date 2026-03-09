/**
 * Admin subcommand group — Elasticsearch management operations.
 *
 * Provides commands for ES setup, ingestion, index management,
 * synonym updates, bulk data download, and diagnostics.
 *
 * SDK-mapped operations call the SDK admin service directly.
 * Complex orchestration operations delegate to existing implementation
 * files, which are invoked as child processes for isolation.
 *
 * @example
 * ```bash
 * oaksearch admin setup
 * oaksearch admin setup --reset
 * oaksearch admin status
 * oaksearch admin synonyms
 * oaksearch admin meta get
 * oaksearch admin ingest --subject maths
 * ```
 */

import { Command } from 'commander';
import type { CliSdkEnv } from '../shared/index.js';
import type { OakClientEnv } from '../../adapters/oak-adapter.js';
import {
  registerSetupCmd,
  registerStatusCmd,
  registerSynonymsCmd,
  registerMetaCmd,
} from './admin-sdk-commands.js';
import { registerOrchestrationCmds } from './admin-orchestration-commands.js';
import { registerVersionedIngestCmd, registerStageCmd } from './admin-lifecycle-commands.js';
import {
  registerPromoteCmd,
  registerRollbackCmd,
  registerValidateAliasesCmd,
} from './admin-lifecycle-alias-commands.js';

/**
 * Create the `admin` subcommand group.
 *
 * Composes SDK-mapped commands (setup, status, synonyms, meta) and
 * pass-through orchestration commands (ingest, verify, download, etc.)
 * into a single Commander command group.
 *
 * Lifecycle commands that perform ingestion (versioned-ingest, stage)
 * require the wider `CliSdkEnv & OakClientEnv` to access the Oak API.
 *
 * @param cliEnv - Validated CLI environment values including Oak API credentials
 * @returns A Commander `Command` with all admin subcommands registered
 *
 * @example
 * ```typescript
 * const program = new Command();
 * program.addCommand(adminCommand(cliEnv));
 * ```
 */
export function adminCommand(cliEnv: CliSdkEnv & OakClientEnv): Command {
  const cmd = new Command('admin').description(
    'Elasticsearch setup, ingestion, and index management',
  );

  registerSetupCmd(cmd, cliEnv);
  registerStatusCmd(cmd, cliEnv);
  registerSynonymsCmd(cmd, cliEnv);
  registerMetaCmd(cmd, cliEnv);
  registerOrchestrationCmds(cmd);
  registerVersionedIngestCmd(cmd, cliEnv);
  registerStageCmd(cmd, cliEnv);
  registerPromoteCmd(cmd, cliEnv);
  registerRollbackCmd(cmd, cliEnv);
  registerValidateAliasesCmd(cmd, cliEnv);

  return cmd;
}
