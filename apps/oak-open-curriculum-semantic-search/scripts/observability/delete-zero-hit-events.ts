#!/usr/bin/env node
import process from 'node:process';
import type { TransportRequestOptions, TransportRequestParams } from '@elastic/elasticsearch';
import { esClient } from '../../src/lib/es-client';
import { env } from '../../src/lib/env';
import {
  coerceSearchIndexTarget,
  currentSearchIndexTarget,
  resolveZeroHitIndexName,
  type SearchIndexTarget,
} from '../../src/lib/search-index-target';
import { searchLogger } from '../../src/lib/logger';

/** CLI script to purge persisted zero-hit events from Elasticsearch Serverless. */
interface CliFlags {
  target?: SearchIndexTarget;
  olderThanDays?: number;
  force?: boolean;
}

type FlagHandler = {
  consumesValue: boolean;
  apply: (flags: CliFlags, value: string | undefined) => void;
};

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
  '--older-than-days': {
    consumesValue: true,
    apply: (flags, value) => {
      if (!value) {
        return;
      }
      const parsed = Number.parseInt(value, 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        flags.olderThanDays = parsed;
      }
    },
  },
  '--force': {
    consumesValue: false,
    apply: (flags) => {
      flags.force = true;
    },
  },
};

const JSON_REQUEST_OPTIONS: TransportRequestOptions = {
  headers: { 'content-type': 'application/json' },
};

/**
 * Parse CLI flags supporting target selection, retention override, and confirmation.
 */
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

/** Ensure the destructive script has been confirmed with --force. */
function isForceConfirmed(force: boolean | undefined): boolean {
  if (force) {
    return true;
  }
  searchLogger.error('zero-hit.purge.aborted', new Error('Confirmation missing'), {
    message: 'Pass --force when you are certain you want to delete persisted zero-hit events.',
  });
  process.exitCode = 1;
  return false;
}

/** Determine the effective search index target from flags or env. */
function resolveTargetFromFlags(flags: CliFlags): SearchIndexTarget {
  return flags.target ?? currentSearchIndexTarget();
}

/** Determine retention cut-off in days using flag override or env default. */
function resolveRetentionDays(flags: CliFlags): number {
  return flags.olderThanDays ?? env().ZERO_HIT_INDEX_RETENTION_DAYS;
}

/** Build the delete-by-query request body respecting the retention window. */
function buildDeleteRequest(indexName: string, olderThanDays: number): TransportRequestParams {
  return {
    method: 'POST',
    path: `/${indexName}/_delete_by_query`,
    body: JSON.stringify({
      query: {
        range: {
          '@timestamp': {
            lt: `now-${olderThanDays}d`,
          },
        },
      },
    }),
  };
}

/** Execute the purge request and log success or failure. */
async function executePurge(
  target: SearchIndexTarget,
  indexName: string,
  olderThanDays: number,
  request: TransportRequestParams,
): Promise<void> {
  searchLogger.info('zero-hit.purge.started', {
    target,
    indexName,
    olderThanDays,
  });

  try {
    const response = await esClient().transport.request(request, JSON_REQUEST_OPTIONS);
    searchLogger.info('zero-hit.purge.completed', {
      target,
      indexName,
      olderThanDays,
      response,
    });
  } catch (error: unknown) {
    searchLogger.error('zero-hit.purge.failed', error, {
      target,
      indexName,
      olderThanDays,
    });
    process.exitCode = 1;
  }
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  env(); // validate configuration and load defaults.
  if (!isForceConfirmed(flags.force)) {
    return;
  }
  const target = resolveTargetFromFlags(flags);
  const indexName = resolveZeroHitIndexName(target);
  const olderThanDays = resolveRetentionDays(flags);
  const request = buildDeleteRequest(indexName, olderThanDays);
  await executePurge(target, indexName, olderThanDays, request);
}

main().catch((error: unknown) => {
  searchLogger.error('zero-hit.purge.unhandled', error);
  process.exitCode = 1;
});
