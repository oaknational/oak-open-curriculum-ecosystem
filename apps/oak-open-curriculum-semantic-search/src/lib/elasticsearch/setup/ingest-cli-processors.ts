/**
 * Argument processing functions for the ingestion CLI.
 *
 * @module ingest-cli-processors
 */

import type { KeyStage, SearchSubjectSlug } from '../../../types/oak.js';
import type { SearchIndexKind } from '../../search-index-target.js';
import { SEARCH_INDEX_KINDS } from '../../search-index-target.js';
import {
  isKeyStage as isValidKeyStage,
  isSubject as isValidSubject,
  KEY_STAGES,
} from '@oaknational/oak-curriculum-sdk';

/** Available key stages for validation (from schema). */
const ALL_KEY_STAGES = KEY_STAGES;

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

/** Process --subject argument. Returns 1 if value consumed. */
export function processSubjectArg(
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
export function processKeyStageArg(
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
export function processIndexArg(
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
export function processBulkDirArg(
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

/**
 * Process --max-retries argument. Returns 1 if value consumed.
 *
 * @throws Error if value is not a positive integer
 */
export function processMaxRetriesArg(
  arg: string,
  nextArg: string | undefined,
  maxRetriesRef: { value: number | undefined },
): number {
  if (arg !== '--max-retries' || !nextArg) {
    return 0;
  }
  const parsed = parseInt(nextArg, 10);
  if (isNaN(parsed) || parsed < 0) {
    throw new Error(`--max-retries must be a non-negative integer, got: ${nextArg}`);
  }
  maxRetriesRef.value = parsed;
  return 1;
}

/**
 * Process --retry-delay argument. Returns 1 if value consumed.
 *
 * @throws Error if value is not a positive integer
 */
export function processRetryDelayArg(
  arg: string,
  nextArg: string | undefined,
  retryDelayRef: { value: number | undefined },
): number {
  if (arg !== '--retry-delay' || !nextArg) {
    return 0;
  }
  const parsed = parseInt(nextArg, 10);
  if (isNaN(parsed) || parsed < 0) {
    throw new Error(`--retry-delay must be a non-negative integer (milliseconds), got: ${nextArg}`);
  }
  retryDelayRef.value = parsed;
  return 1;
}

/** Process a value argument (--subject, --keystage, --index). Returns 1 if value consumed. */
export function processValueArg(
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
