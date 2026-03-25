#!/usr/bin/env -S pnpm exec tsx
import { Client } from '@elastic/elasticsearch';
import { findRepoRoot } from '@oaknational/env-resolution';
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  loadRuntimeConfig,
  type LoadRuntimeConfigOptions,
  type SearchCliRuntimeConfig,
} from '../../src/runtime-config.js';
import {
  createElasticsearchDeps,
  parseLedger,
  runFieldReadbackAudit,
  type GapLedger,
  type ReadbackAuditDependencies,
  type ReadbackAuditResult,
} from './field-readback-audit-lib.js';
import { parseCliArgs, resolveLedgerPath } from './field-readback-audit-cli.js';

/**
 * Minimal client contract used by the readback audit composition root.
 */
export interface FieldReadbackAuditClient {
  close(): Promise<void>;
}

/**
 * Runtime resources assembled by the readback audit composition root.
 */
export interface FieldReadbackAuditCommandResources {
  readonly auditDependencies: ReadbackAuditDependencies;
  readonly client: FieldReadbackAuditClient;
}

/**
 * Injectable dependencies for the readback audit command.
 *
 * @remarks
 * Integration tests replace filesystem, environment, stdout, and Elasticsearch
 * concerns with simple fakes per ADR-078.
 */
export interface FieldReadbackAuditCommandDeps {
  readonly createResources: (
    runtimeConfig: SearchCliRuntimeConfig,
    targetVersion: string | undefined,
  ) => FieldReadbackAuditCommandResources;
  readonly findRepoRoot: typeof findRepoRoot;
  readonly loadRuntimeConfig: (
    options: LoadRuntimeConfigOptions,
  ) => ReturnType<typeof loadRuntimeConfig>;
  readonly parseLedger: (ledgerPath: string) => Promise<GapLedger>;
  readonly runFieldReadbackAudit: (
    ledger: GapLedger,
    attempts: number,
    intervalMs: number,
    deps: ReadbackAuditDependencies,
  ) => Promise<ReadbackAuditResult>;
  readonly setExitCode: (exitCode: number) => void;
  readonly writeStdout: (message: string) => void;
}

function createClient(runtimeConfig: SearchCliRuntimeConfig): Client {
  return new Client({
    node: runtimeConfig.env.ELASTICSEARCH_URL,
    auth: { apiKey: runtimeConfig.env.ELASTICSEARCH_API_KEY },
  });
}

/**
 * Create the concrete command dependencies for the production composition root.
 */
export function createFieldReadbackAuditCommandDeps(): FieldReadbackAuditCommandDeps {
  return {
    createResources: (runtimeConfig, targetVersion) => {
      const client = createClient(runtimeConfig);
      return {
        client,
        auditDependencies: createElasticsearchDeps(client, targetVersion),
      };
    },
    findRepoRoot,
    loadRuntimeConfig,
    parseLedger,
    runFieldReadbackAudit,
    setExitCode: (exitCode) => {
      process.exitCode = exitCode;
    },
    writeStdout: (message) => {
      process.stdout.write(message);
    },
  };
}

/**
 * Resolve the script directory used to anchor env and repo-root discovery.
 *
 * @param moduleUrl - `import.meta.url` for this composition root
 * @returns Absolute directory containing the command script
 */
function resolveFieldReadbackAuditStartDir(moduleUrl: string): string {
  return dirname(fileURLToPath(moduleUrl));
}

/**
 * Load runtime configuration for the field readback audit from the script's
 * own directory so app-local `.env.local` works regardless of caller cwd.
 *
 * @param processEnv - Explicit process environment values
 * @param moduleUrl - `import.meta.url` for this composition root
 * @param loadRuntimeConfigFn - Injectable config loader for integration tests
 * @returns Runtime configuration result for the audit command
 */
export function loadFieldReadbackAuditRuntimeConfig(
  processEnv: Readonly<Record<string, string | undefined>>,
  moduleUrl: string,
  loadRuntimeConfigFn: FieldReadbackAuditCommandDeps['loadRuntimeConfig'] = loadRuntimeConfig,
): ReturnType<typeof loadRuntimeConfig> {
  return loadRuntimeConfigFn({
    processEnv,
    startDir: resolveFieldReadbackAuditStartDir(moduleUrl),
  });
}

/**
 * Run the field readback audit command with explicit arguments and environment.
 *
 * @param argv - CLI arguments excluding the node executable and script path
 * @param processEnv - Explicit process environment values
 * @param moduleUrl - `import.meta.url` for this composition root
 * @param commandDeps - Injectable dependencies for in-process integration tests
 */
export async function runFieldReadbackAuditCommand(
  argv: readonly string[],
  processEnv: Readonly<Record<string, string | undefined>>,
  moduleUrl: string,
  commandDeps: FieldReadbackAuditCommandDeps = createFieldReadbackAuditCommandDeps(),
): Promise<void> {
  const scriptDir = resolveFieldReadbackAuditStartDir(moduleUrl);
  const args = parseCliArgs(argv);
  const configResult = loadFieldReadbackAuditRuntimeConfig(
    processEnv,
    moduleUrl,
    commandDeps.loadRuntimeConfig,
  );
  if (!configResult.ok) {
    throw new Error(`Environment validation failed: ${configResult.error.message}`);
  }
  const ledgerPath = resolveLedgerPath(args.ledgerPath, commandDeps.findRepoRoot(scriptDir));
  const resources = commandDeps.createResources(configResult.value, args.targetVersion);

  try {
    const ledger = await commandDeps.parseLedger(ledgerPath);
    const result = await commandDeps.runFieldReadbackAudit(
      ledger,
      args.attempts,
      args.intervalMs,
      resources.auditDependencies,
    );
    if (args.emitJson) {
      commandDeps.writeStdout(`${JSON.stringify(result, null, 2)}\n`);
    } else {
      commandDeps.writeStdout(`Field readback audit complete. entries=${result.entries.length}\n`);
      if (result.failures.length > 0) {
        commandDeps.writeStdout(`${result.failures.join('\n')}\n`);
      }
    }
    if (!result.ok) {
      commandDeps.setExitCode(1);
    }
  } finally {
    await resources.client.close();
  }
}

async function main(): Promise<void> {
  await runFieldReadbackAuditCommand(process.argv.slice(2), process.env, import.meta.url);
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
