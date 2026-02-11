/**
 * Pass-through admin commands — orchestration scripts for ingestion,
 * verification, diagnostics, and infrastructure operations.
 *
 * These commands delegate to existing implementation scripts, which
 * are invoked as child processes for isolation. They do not use the
 * SDK directly.
 */

import type { Command } from 'commander';
import { registerPassThrough, registerBashPassThrough } from '../shared/index.js';

/**
 * Register all pass-through orchestration commands on the admin group.
 *
 * Each command delegates to a TypeScript or Bash script via
 * `registerPassThrough` / `registerBashPassThrough`, which spawns
 * a child process inheriting the current environment.
 *
 * @param parent - The parent Commander command to register under
 * @returns void
 */
export function registerOrchestrationCmds(parent: Command): void {
  registerPassThrough(
    parent,
    'ingest',
    'Ingest curriculum data into Elasticsearch',
    'src/lib/elasticsearch/setup/ingest-live.ts',
  );
  registerPassThrough(
    parent,
    'verify',
    'Verify ingestion completeness',
    'operations/ingestion/verify-ingestion.ts',
  );
  registerPassThrough(
    parent,
    'download',
    'Download Oak curriculum bulk data',
    'scripts/download-bulk.ts',
  );
  registerPassThrough(
    parent,
    'sandbox-ingest',
    'Ingest fixture data into sandbox index',
    'operations/sandbox/ingest.ts',
  );
  registerPassThrough(
    parent,
    'cache-reset',
    'Reset TTLs for SDK cache keys in Redis',
    'operations/utilities/reset-ttls.ts',
  );
  registerPassThrough(
    parent,
    'diagnose-elser',
    'Run ELSER ingestion failure diagnostics',
    'scripts/diagnose-elser-failures.ts',
  );
  registerPassThrough(
    parent,
    'analyze-elser',
    'Analyse ELSER diagnostic reports',
    'scripts/analyze-elser-failures.ts',
  );
  registerBashPassThrough(
    parent,
    'alias-swap',
    'Swap Elasticsearch index alias',
    'operations/infrastructure/alias-swap.sh',
  );
}
