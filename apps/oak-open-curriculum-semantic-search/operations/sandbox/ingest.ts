#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import { createSandboxHarness } from '../../src/lib/indexing/sandbox-harness';
import { coerceSearchIndexTarget, type SearchIndexTarget } from '../../src/lib/search-index-target';
import { sandboxLogger } from '../../src/lib/logger';

interface CliFlags {
  target?: SearchIndexTarget;
  dryRun?: boolean;
  verbose?: boolean;
  fixtureRoot?: string;
}

interface FlagHandler {
  consumesValue: boolean;
  apply: (flags: CliFlags, value: string | undefined) => void;
}

const FLAG_HANDLERS: Record<string, FlagHandler> = {
  '--target': {
    consumesValue: true,
    apply: (flags, value) => {
      const target = coerceSearchIndexTarget(value);
      if (target) {
        flags.target = target;
      }
    },
  },
  '--fixture': {
    consumesValue: true,
    apply: (flags, value) => {
      if (typeof value === 'string') {
        flags.fixtureRoot = value;
      }
    },
  },
  '--dry-run': {
    consumesValue: false,
    apply: (flags) => {
      flags.dryRun = true;
    },
  },
  '--verbose': {
    consumesValue: false,
    apply: (flags) => {
      flags.verbose = true;
    },
  },
};

function parseFlags(args: readonly string[]): CliFlags {
  const flags: CliFlags = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const handler = FLAG_HANDLERS[arg];
    if (!handler) {
      continue;
    }
    const value = handler.consumesValue ? args[index + 1] : undefined;
    handler.apply(flags, value);
    if (handler.consumesValue && typeof value === 'string') {
      index += 1;
    }
  }
  return flags;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const flags = parseFlags(args);
  const cwd = process.cwd();
  const fixtureRoot = flags.fixtureRoot
    ? path.resolve(cwd, flags.fixtureRoot)
    : path.join(cwd, 'fixtures/sandbox');
  const target = flags.target ?? 'sandbox';

  sandboxLogger.info('sandbox.cli.start', {
    target,
    fixtureRoot,
    dryRun: flags.dryRun ?? false,
    verbose: flags.verbose ?? false,
  });

  const harness = await createSandboxHarness({
    fixtureRoot,
    target,
    logger: sandboxLogger,
  });

  const result = await harness.ingest({
    dryRun: flags.dryRun ?? false,
    verbose: flags.verbose ?? false,
  });

  sandboxLogger.info('sandbox.cli.summary', {
    target,
    totalDocs: result.summary.totalDocs,
    counts: result.summary.counts,
  });
}

main().catch((error) => {
  sandboxLogger.error('sandbox.cli.error', error);
  process.exitCode = 1;
});
