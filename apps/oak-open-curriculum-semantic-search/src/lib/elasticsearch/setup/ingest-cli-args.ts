#!/usr/bin/env npx tsx
/**
 * @module ingest-cli-args
 * @description CLI argument parsing for live data ingestion. Handles
 * parsing of subject, keystage, and flag arguments with validation.
 */

import type { KeyStage, SearchSubjectSlug } from '../../../types/oak.js';

/** Available key stages for validation. */
const ALL_KEY_STAGES = ['ks1', 'ks2', 'ks3', 'ks4'] as const;

/** Common subjects for testing (default when none specified). */
const COMMON_SUBJECTS = ['maths', 'english', 'science', 'history', 'geography'] as const;

/** Parsed CLI arguments for ingestion. */
export interface CliArgs {
  readonly subjects: SearchSubjectSlug[];
  readonly keyStages: KeyStage[];
  readonly dryRun: boolean;
  readonly verbose: boolean;
  readonly help: boolean;
  readonly clearCache: boolean;
}

/** Type guard for valid key stage values. */
function isKeyStage(value: string): value is KeyStage {
  return ALL_KEY_STAGES.includes(value as KeyStage);
}

/** Type guard for valid subject values. */
function isSearchSubject(value: string): value is SearchSubjectSlug {
  return value.length > 0;
}

/** Process a single flag argument (--help, --dry-run, etc). */
function processFlag(
  arg: string,
  flags: { dryRun: boolean; verbose: boolean; help: boolean; clearCache: boolean },
): boolean {
  if (arg === '--help' || arg === '-h') {
    flags.help = true;
    return true;
  }
  if (arg === '--dry-run') {
    flags.dryRun = true;
    return true;
  }
  if (arg === '--verbose' || arg === '-v') {
    flags.verbose = true;
    return true;
  }
  if (arg === '--clear-cache') {
    flags.clearCache = true;
    return true;
  }
  return false;
}

/** Process a value argument (--subject, --keystage). Returns 1 if value consumed. */
function processValueArg(
  arg: string,
  nextArg: string | undefined,
  subjects: SearchSubjectSlug[],
  keyStages: KeyStage[],
): number {
  if (arg === '--subject' && nextArg) {
    if (!isSearchSubject(nextArg)) {
      throw new Error(`Invalid subject: ${nextArg}`);
    }
    subjects.push(nextArg);
    return 1;
  }
  if (arg === '--keystage' && nextArg) {
    if (!isKeyStage(nextArg)) {
      throw new Error(`Invalid key stage: ${nextArg}. Valid values: ${ALL_KEY_STAGES.join(', ')}`);
    }
    keyStages.push(nextArg);
    return 1;
  }
  return 0;
}

/** Parse CLI arguments into structured CliArgs. */
export function parseArgs(args: readonly string[]): CliArgs {
  const subjects: SearchSubjectSlug[] = [];
  const keyStages: KeyStage[] = [];
  const flags = { dryRun: false, verbose: false, help: false, clearCache: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    if (processFlag(arg, flags)) continue;
    i += processValueArg(arg, nextArg, subjects, keyStages);
  }

  return {
    subjects: subjects.length > 0 ? subjects : [...COMMON_SUBJECTS],
    keyStages: keyStages.length > 0 ? keyStages : [...ALL_KEY_STAGES],
    ...flags,
  };
}

/** Print CLI help text to console. Uses console.log as this is program output, not logging. */
export function printHelp(): void {
  console.log(`
Live Data Ingestion CLI

Usage:
  npx tsx src/lib/elasticsearch/setup/ingest-live.ts [options]

Options:
  --subject <slug>    Subject to ingest (can repeat, defaults to common subjects)
  --keystage <ks>     Key stage to ingest (can repeat, defaults to all)
  --dry-run           Preview what would be ingested without writing to ES
  --clear-cache       Clear SDK response cache before ingestion
  --verbose, -v       Show detailed output
  --help, -h          Show this help message

Examples:
  # Ingest history for KS2 (small, good for testing)
  npx tsx src/lib/elasticsearch/setup/ingest-live.ts --subject history --keystage ks2

  # Ingest all common subjects for all key stages
  npx tsx src/lib/elasticsearch/setup/ingest-live.ts

  # Dry run for maths with fresh cache
  npx tsx src/lib/elasticsearch/setup/ingest-live.ts --subject maths --dry-run --clear-cache

Environment:
  Requires ELASTICSEARCH_URL, ELASTICSEARCH_API_KEY, and OAK_API_KEY
  in .env.local in the app directory.

Caching:
  SDK responses can be cached in Redis to speed up repeated runs.
  Set SDK_CACHE_ENABLED=true and ensure Redis is running (docker compose up -d).
  See docs/SDK-CACHING.md for full documentation.

Note:
  Live ingestion makes many API calls and can take several minutes.
  Start with a single subject to test your setup.
`);
}
