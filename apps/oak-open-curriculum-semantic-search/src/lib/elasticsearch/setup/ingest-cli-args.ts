#!/usr/bin/env npx tsx
/* eslint max-lines:[error, 300] -- JC: keeping the CLI args parsing simple and readable */
/**
 * CLI argument parsing for live data ingestion. Handles
 * parsing of subject, keystage, and flag arguments with validation.
 *
 * Subject and key stage values are derived from the OpenAPI schema via the SDK.
 * Use --all to ingest all subjects, or --subject to specify individual subjects.
 */

import type { KeyStage, SearchSubjectSlug } from '../../../types/oak.js';
import { SEARCH_INDEX_KINDS, type SearchIndexKind } from '../../search-index-target.js';
import {
  isKeyStage as isValidKeyStage,
  isSubject as isValidSubject,
  KEY_STAGES,
  SUBJECTS,
} from '@oaknational/oak-curriculum-sdk';

/** Available key stages for validation (from schema). */
const ALL_KEY_STAGES = KEY_STAGES;

/** All subjects from schema (17 total). */
const ALL_SUBJECTS = SUBJECTS;

/** Parsed CLI arguments for ingestion. */
export interface CliArgs {
  readonly subjects: SearchSubjectSlug[];
  readonly keyStages: KeyStage[];
  readonly indexes: SearchIndexKind[];
  readonly dryRun: boolean;
  readonly verbose: boolean;
  readonly help: boolean;
  readonly clearCache: boolean;
  readonly all: boolean;
  readonly bypassCache: boolean;
  readonly force: boolean;
  readonly ignoreCached404: boolean;
  /** Enable bulk-first ingestion mode (uses bulk download files). */
  readonly bulk: boolean;
  /** Directory containing bulk download files (required when --bulk is used). */
  readonly bulkDir: string | undefined;
}

/** Type guard for valid key stage values. */
function isKeyStage(value: string): value is KeyStage {
  return isValidKeyStage(value);
}

/** Type guard for valid subject values. */
function isSearchSubject(value: string): value is SearchSubjectSlug {
  return isValidSubject(value);
}

/** Type guard for valid index kind values. */
function isSearchIndexKind(value: string): value is SearchIndexKind {
  return SEARCH_INDEX_KINDS.some((kind) => kind === value);
}

/** Flag container for CLI argument parsing. */
interface FlagContainer {
  dryRun: boolean;
  verbose: boolean;
  help: boolean;
  clearCache: boolean;
  all: boolean;
  bypassCache: boolean;
  force: boolean;
  ignoreCached404: boolean;
  bulk: boolean;
}

/** Flag names that can be set via CLI arguments. */
type FlagName = keyof FlagContainer;

/** Mapping of CLI arguments to flag names. */
const FLAG_ARG_MAP: ReadonlyMap<string, FlagName> = new Map([
  ['--help', 'help'],
  ['-h', 'help'],
  ['--dry-run', 'dryRun'],
  ['--verbose', 'verbose'],
  ['-v', 'verbose'],
  ['--clear-cache', 'clearCache'],
  ['--all', 'all'],
  ['--bypass-cache', 'bypassCache'],
  ['--force', 'force'],
  ['-f', 'force'],
  ['--ignore-cached-404', 'ignoreCached404'],
  ['--bulk', 'bulk'],
]);

/** Process a single flag argument (--help, --dry-run, --all, etc). */
function processFlag(arg: string, flags: FlagContainer): boolean {
  const flagName = FLAG_ARG_MAP.get(arg);
  if (flagName !== undefined) {
    flags[flagName] = true;
    return true;
  }
  return false;
}

/** Process --subject argument. Returns 1 if value consumed. */
function processSubjectArg(
  arg: string,
  nextArg: string | undefined,
  subjects: SearchSubjectSlug[],
): number {
  if (arg !== '--subject' || !nextArg) {
    return 0;
  }
  if (!isSearchSubject(nextArg)) {
    throw new Error(`Invalid subject: ${nextArg}`);
  }
  subjects.push(nextArg);
  return 1;
}

/** Process --keystage argument. Returns 1 if value consumed. */
function processKeyStageArg(
  arg: string,
  nextArg: string | undefined,
  keyStages: KeyStage[],
): number {
  if (arg !== '--keystage' || !nextArg) {
    return 0;
  }
  if (!isKeyStage(nextArg)) {
    throw new Error(`Invalid key stage: ${nextArg}. Valid values: ${ALL_KEY_STAGES.join(', ')}`);
  }
  keyStages.push(nextArg);
  return 1;
}

/** Process --index argument. Returns 1 if value consumed. */
function processIndexArg(
  arg: string,
  nextArg: string | undefined,
  indexes: SearchIndexKind[],
): number {
  if (arg !== '--index' || !nextArg) {
    return 0;
  }
  if (!isSearchIndexKind(nextArg)) {
    throw new Error(
      `Invalid index kind: ${nextArg}. Valid values: ${SEARCH_INDEX_KINDS.join(', ')}`,
    );
  }
  indexes.push(nextArg);
  return 1;
}

/** Process --bulk-dir argument. Returns 1 if value consumed. */
function processBulkDirArg(
  arg: string,
  nextArg: string | undefined,
  bulkDirRef: { value: string | undefined },
): number {
  if (arg !== '--bulk-dir' || !nextArg) {
    return 0;
  }
  bulkDirRef.value = nextArg;
  return 1;
}

/** Process a value argument (--subject, --keystage, --index). Returns 1 if value consumed. */
function processValueArg(
  arg: string,
  nextArg: string | undefined,
  subjects: SearchSubjectSlug[],
  keyStages: KeyStage[],
  indexes: SearchIndexKind[],
): number {
  return (
    processSubjectArg(arg, nextArg, subjects) ||
    processKeyStageArg(arg, nextArg, keyStages) ||
    processIndexArg(arg, nextArg, indexes)
  );
}

/**
 * Resolve subjects based on --all flag and explicit --subject args.
 *
 * @throws Error if neither --all nor --subject is specified
 * @throws Error if --all is combined with --subject
 */
function resolveSubjects(
  explicitSubjects: readonly SearchSubjectSlug[],
  allFlag: boolean,
): SearchSubjectSlug[] {
  if (allFlag && explicitSubjects.length > 0) {
    throw new Error('--all cannot be combined with --subject');
  }
  if (allFlag) {
    return [...ALL_SUBJECTS];
  }
  if (explicitSubjects.length === 0) {
    throw new Error('No subjects specified. Use --subject <slug> or --all for all subjects.');
  }
  return [...explicitSubjects];
}

/** Parse CLI arguments into structured CliArgs. */
export function parseArgs(args: readonly string[]): CliArgs {
  const subjects: SearchSubjectSlug[] = [];
  const keyStages: KeyStage[] = [];
  const indexes: SearchIndexKind[] = [];
  const bulkDirRef: { value: string | undefined } = { value: undefined };
  const flags: FlagContainer = {
    dryRun: false,
    verbose: false,
    help: false,
    clearCache: false,
    all: false,
    bypassCache: false,
    force: false,
    ignoreCached404: false,
    bulk: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    if (processFlag(arg, flags)) {
      continue;
    }
    const bulkDirConsumed = processBulkDirArg(arg, nextArg, bulkDirRef);
    if (bulkDirConsumed > 0) {
      i += bulkDirConsumed;
      continue;
    }
    i += processValueArg(arg, nextArg, subjects, keyStages, indexes);
  }

  // Validate bulk mode requirements
  if (flags.bulk && bulkDirRef.value === undefined) {
    throw new Error('--bulk requires --bulk-dir <path> to specify the bulk download directory');
  }

  return {
    subjects: flags.bulk ? [] : resolveSubjects(subjects, flags.all),
    keyStages: keyStages.length > 0 ? keyStages : [...ALL_KEY_STAGES],
    indexes,
    bulkDir: bulkDirRef.value,
    ...flags,
  };
}

/** Generate CLI help text. */
function generateHelpText(): string {
  const subjectList = ALL_SUBJECTS.join(', ');
  return `
Live Data Ingestion CLI

Usage: npx tsx src/lib/elasticsearch/setup/ingest-live.ts [options]

Subject Selection (REQUIRED for API mode):
  --subject <slug>    Subject to ingest (can repeat for multiple subjects)
  --all               Ingest ALL subjects (${ALL_SUBJECTS.length} total)

Bulk Mode (alternative to subject selection):
  --bulk              Use bulk download files instead of API
  --bulk-dir <path>   Directory containing bulk download JSON files (required with --bulk)

Options:
  --keystage <ks>     Key stage to ingest (can repeat, defaults to all: ks1-ks4)
  --index <kind>      Index to ingest (can repeat, defaults to all)
  --dry-run           Preview without writing to ES
  --force, -f         Force overwrite existing documents (default: skip existing)
  --clear-cache       Clear SDK response cache before ingestion
  --bypass-cache      Continue without Redis cache (default: fail if cache unavailable)
  --ignore-cached-404 Ignore cached 404 responses (re-fetch transcripts that were missing)
  --verbose, -v       Show detailed output
  --help, -h          Show this help message

Available Subjects: ${subjectList}

Ingestion Modes:
  - API (default): Fetches data from Oak API. Use --subject or --all to specify subjects.
  - Bulk (--bulk): Uses pre-downloaded bulk JSON files. Faster and includes all data.
    Bulk mode extracts lessons, units, and threads from downloaded curriculum files.

Incremental vs Force:
  - Incremental (default): Only creates new documents. Safe for resuming.
  - Force (--force): Overwrites all documents. Use after schema changes.

Examples:
  --subject history --keystage ks2    # Single subject via API
  --all --force                       # Full refresh via API
  --bulk --bulk-dir ./bulk-downloads  # Bulk ingestion from downloaded files
  --bulk --bulk-dir ./bulk --dry-run  # Preview bulk ingestion

Environment: ELASTICSEARCH_URL, ELASTICSEARCH_API_KEY, OAK_API_KEY in .env.local
`;
}

/** Print CLI help text to console. Uses console.log as this is program output, not logging. */
export function printHelp(): void {
  console.log(generateHelpText());
}
