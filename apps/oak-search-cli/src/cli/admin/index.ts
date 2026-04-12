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
 * oaksearch admin versioned-ingest
 * ```
 */

import { Command } from 'commander';
import type { CliObservability } from '../../observability/index.js';
import type { SearchCliEnvLoader } from '../shared/index.js';
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
import {
  registerInspectLeaseCmd,
  registerReleaseLeaseCmd,
} from './admin-lifecycle-lease-commands.js';
import { registerCountCmd } from './admin-count-command.js';
import { registerDeleteVersionCmd } from './admin-lifecycle-cleanup-commands.js';
import {
  registerListOrphansCmd,
  registerCleanupOrphansCmd,
} from './admin-lifecycle-orphan-commands.js';

/**
 * Create the `admin` subcommand group.
 *
 * Composes SDK-mapped commands (setup, status, synonyms, meta) and
 * pass-through orchestration commands (verify, download, etc.)
 * into a single Commander command group.
 *
 * Lifecycle commands that perform ingestion (versioned-ingest, stage)
 * require the wider `CliSdkEnv & OakClientEnv` to access the Oak API.
 *
 * @param cliEnvLoader - Cached loader for validated CLI environment values
 * @returns A Commander `Command` with all admin subcommands registered
 *
 * @example
 * ```typescript
 * const program = new Command();
 * program.addCommand(adminCommand(cliEnv));
 * ```
 */
export function adminCommand(
  cliEnvLoader: SearchCliEnvLoader,
  observability?: CliObservability,
): Command {
  // TODO(observability): thread observability to admin sub-registrations
  void observability;
  const cmd = new Command('admin').description(
    'Elasticsearch setup, ingestion, and index management',
  );

  registerSetupCmd(cmd, cliEnvLoader);
  registerStatusCmd(cmd, cliEnvLoader);
  registerSynonymsCmd(cmd, cliEnvLoader);
  registerMetaCmd(cmd, cliEnvLoader);
  registerOrchestrationCmds(cmd, cliEnvLoader);
  registerVersionedIngestCmd(cmd, cliEnvLoader);
  registerStageCmd(cmd, cliEnvLoader);
  registerPromoteCmd(cmd, cliEnvLoader);
  registerRollbackCmd(cmd, cliEnvLoader);
  registerValidateAliasesCmd(cmd, cliEnvLoader);
  registerInspectLeaseCmd(cmd, cliEnvLoader);
  registerReleaseLeaseCmd(cmd, cliEnvLoader);
  registerCountCmd(cmd, cliEnvLoader);
  registerDeleteVersionCmd(cmd, cliEnvLoader);
  registerListOrphansCmd(cmd, cliEnvLoader);
  registerCleanupOrphansCmd(cmd, cliEnvLoader);

  return cmd;
}
