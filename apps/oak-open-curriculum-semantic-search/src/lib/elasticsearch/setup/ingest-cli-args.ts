#!/usr/bin/env npx tsx
/**
 * CLI argument parsing for live data ingestion.
 *
 * @remarks
 * Handles parsing of subject, keystage, and flag arguments with validation.
 * Subject and key stage values are derived from the OpenAPI schema via the SDK.
 * Use --all to ingest all subjects, or --subject to specify individual subjects.
 *
 * @module ingest-cli-args
 */

import type { KeyStage, SearchSubjectSlug } from '../../../types/oak.js';
import type { SearchIndexKind } from '../../search-index-target.js';
import { KEY_STAGES, SUBJECTS } from '@oaknational/oak-curriculum-sdk';
import {
  processValueArg,
  processBulkDirArg,
  processMaxRetriesArg,
  processRetryDelayArg,
} from './ingest-cli-processors.js';

// Re-export help functions
export { printHelp } from './ingest-cli-help.js';

/** Available key stages and subjects from schema. */
const ALL_KEY_STAGES = KEY_STAGES;
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
  readonly bulk: boolean;
  readonly bulkDir: string | undefined;
  readonly maxRetries: number | undefined;
  readonly retryDelay: number | undefined;
  readonly noRetry: boolean;
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
  noRetry: boolean;
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
  ['--no-retry', 'noRetry'],
]);

/** Process a single flag argument. */
function processFlag(arg: string, flags: FlagContainer): boolean {
  const flagName = FLAG_ARG_MAP.get(arg);
  if (flagName !== undefined) {
    flags[flagName] = true;
    return true;
  }
  return false;
}

/** Resolve subjects based on --all flag and explicit --subject args. */
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

/** Initial state for flag container. */
function createInitialFlags(): FlagContainer {
  return {
    dryRun: false,
    verbose: false,
    help: false,
    clearCache: false,
    all: false,
    bypassCache: false,
    force: false,
    ignoreCached404: false,
    bulk: false,
    noRetry: false,
  };
}

/** Process all arguments in a single pass. */
function processAllArgs(
  args: readonly string[],
  subjects: SearchSubjectSlug[],
  keyStages: KeyStage[],
  indexes: SearchIndexKind[],
  bulkDirRef: { value: string | undefined },
  maxRetriesRef: { value: number | undefined },
  retryDelayRef: { value: number | undefined },
  flags: FlagContainer,
): void {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    if (processFlag(arg, flags)) {
      continue;
    }

    const consumed =
      processBulkDirArg(arg, nextArg, bulkDirRef) ||
      processMaxRetriesArg(arg, nextArg, maxRetriesRef) ||
      processRetryDelayArg(arg, nextArg, retryDelayRef) ||
      processValueArg(arg, nextArg, subjects, keyStages, indexes);

    if (consumed > 0) {
      i += consumed;
    }
  }
}

/** Build CliArgs from parsed components. */
function buildCliArgs(
  subjects: SearchSubjectSlug[],
  keyStages: KeyStage[],
  indexes: SearchIndexKind[],
  bulkDirRef: { value: string | undefined },
  maxRetriesRef: { value: number | undefined },
  retryDelayRef: { value: number | undefined },
  flags: FlagContainer,
): CliArgs {
  // Skip validation for help mode
  if (flags.help) {
    return {
      subjects: [],
      keyStages: [...ALL_KEY_STAGES],
      indexes,
      bulkDir: bulkDirRef.value,
      maxRetries: maxRetriesRef.value,
      retryDelay: retryDelayRef.value,
      ...flags,
    };
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
    maxRetries: maxRetriesRef.value,
    retryDelay: retryDelayRef.value,
    ...flags,
  };
}

/** Reference container for optional string value. */
interface StringRef {
  value: string | undefined;
}

/** Reference container for optional number value. */
interface NumberRef {
  value: number | undefined;
}

/** Parse CLI arguments into structured CliArgs. */
export function parseArgs(args: readonly string[]): CliArgs {
  const subjects: SearchSubjectSlug[] = [];
  const keyStages: KeyStage[] = [];
  const indexes: SearchIndexKind[] = [];
  const bulkDirRef: StringRef = { value: undefined };
  const maxRetriesRef: NumberRef = { value: undefined };
  const retryDelayRef: NumberRef = { value: undefined };
  const flags = createInitialFlags();

  processAllArgs(
    args,
    subjects,
    keyStages,
    indexes,
    bulkDirRef,
    maxRetriesRef,
    retryDelayRef,
    flags,
  );

  return buildCliArgs(
    subjects,
    keyStages,
    indexes,
    bulkDirRef,
    maxRetriesRef,
    retryDelayRef,
    flags,
  );
}
