#!/usr/bin/env -S pnpm exec tsx
import { Client } from '@elastic/elasticsearch';
import { loadRuntimeConfig } from '../../src/runtime-config.js';
import {
  createElasticsearchDeps,
  parseLedger,
  runFieldReadbackAudit,
} from './field-readback-audit-lib.js';
import { parseCliArgs } from './field-readback-audit-cli.js';

async function main(): Promise<void> {
  const args = parseCliArgs(process.argv.slice(2));
  const configResult = loadRuntimeConfig({
    processEnv: process.env,
    startDir: '.',
  });
  if (!configResult.ok) {
    throw new Error(`Environment validation failed: ${configResult.error.message}`);
  }
  const client = new Client({
    node: configResult.value.env.ELASTICSEARCH_URL,
    auth: { apiKey: configResult.value.env.ELASTICSEARCH_API_KEY },
  });

  try {
    const ledger = await parseLedger(args.ledgerPath);
    const result = await runFieldReadbackAudit(
      ledger,
      args.attempts,
      args.intervalMs,
      createElasticsearchDeps(client, args.targetVersion),
    );
    if (args.emitJson) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } else {
      process.stdout.write(`Field readback audit complete. entries=${result.entries.length}\n`);
      if (result.failures.length > 0) {
        process.stdout.write(`${result.failures.join('\n')}\n`);
      }
    }
    if (!result.ok) {
      process.exitCode = 1;
    }
  } finally {
    await client.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
