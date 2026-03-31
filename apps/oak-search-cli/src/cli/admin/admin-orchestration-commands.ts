/**
 * Pass-through admin commands — orchestration scripts for ingestion,
 * verification, diagnostics, and infrastructure operations.
 *
 * These commands delegate to existing implementation scripts, which
 * are invoked as child processes for isolation. They do not use the
 * SDK directly.
 */

import type { Command } from 'commander';
import { registerPassThrough, type SearchCliEnvLoader } from '../shared/index.js';

/**
 * Register all pass-through orchestration commands on the admin group.
 *
 * Each command delegates to a TypeScript script via
 * `registerPassThrough`, which spawns a child process inheriting
 * the current environment.
 *
 * @param parent - The parent Commander command to register under
 * @returns void
 */
export function registerOrchestrationCmds(parent: Command, cliEnvLoader: SearchCliEnvLoader): void {
  registerPassThrough(
    parent,
    'verify',
    'Verify ingestion completeness',
    'operations/ingestion/verify-ingestion.ts',
    { cliEnvLoader },
  );
  registerPassThrough(
    parent,
    'download',
    'Download Oak curriculum bulk data',
    'scripts/download-bulk.ts',
    { cliEnvLoader },
  );
  registerPassThrough(
    parent,
    'sandbox-ingest',
    'Ingest fixture data into sandbox index',
    'operations/sandbox/ingest.ts',
    { cliEnvLoader },
  );
  registerPassThrough(
    parent,
    'cache-reset',
    'Reset TTLs for SDK cache keys in Redis',
    'operations/utilities/reset-ttls.ts',
    { cliEnvLoader },
  );
  registerPassThrough(
    parent,
    'diagnose-elser',
    'Run ELSER ingestion failure diagnostics',
    'scripts/diagnose-elser-failures.ts',
    { cliEnvLoader },
  );
  registerPassThrough(
    parent,
    'analyze-elser',
    'Analyse ELSER diagnostic reports',
    'scripts/analyze-elser-failures.ts',
    { cliEnvLoader },
  );
}
