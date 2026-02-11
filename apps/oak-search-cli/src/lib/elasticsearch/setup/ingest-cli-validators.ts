/**
 * CLI argument validators for ingestion.
 *
 * Pure validation functions for CLI argument values.
 *
 * @module ingest-cli-validators
 */

import { InvalidArgumentError } from 'commander';
import type { KeyStage, SearchSubjectSlug } from '../../../types/oak.js';
import type { SearchIndexKind } from '../../search-index-target.js';
import { SEARCH_INDEX_KINDS } from '../../search-index-target.js';
import {
  isKeyStage as isValidKeyStage,
  isSubject as isValidSubject,
  KEY_STAGES,
  SUBJECTS,
} from '@oaknational/oak-curriculum-sdk';

/** Available key stages from schema. */
export const ALL_KEY_STAGES = KEY_STAGES;

/** Available subjects from schema. */
export const ALL_SUBJECTS = SUBJECTS;

/**
 * Validate subject slug.
 */
export function validateSubject(value: string): SearchSubjectSlug {
  if (!isValidSubject(value)) {
    throw new InvalidArgumentError(`Invalid subject: ${value}. Valid: ${ALL_SUBJECTS.join(', ')}`);
  }
  return value;
}

/**
 * Validate key stage.
 */
export function validateKeyStage(value: string): KeyStage {
  if (!isValidKeyStage(value)) {
    throw new InvalidArgumentError(
      `Invalid key stage: ${value}. Valid: ${ALL_KEY_STAGES.join(', ')}`,
    );
  }
  return value;
}

/**
 * Validate index kind.
 */
export function validateIndex(value: string): SearchIndexKind {
  const kinds = SEARCH_INDEX_KINDS;
  for (const kind of kinds) {
    if (kind === value) {
      return kind;
    }
  }
  throw new InvalidArgumentError(`Invalid index: ${value}. Valid: ${kinds.join(', ')}`);
}

/**
 * Validate positive integer.
 */
export function validatePositiveInt(value: string, name: string): number {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 0) {
    throw new InvalidArgumentError(`${name} must be a non-negative integer`);
  }
  return parsed;
}

/**
 * Collect subject values into array.
 */
export function collectSubject(value: string, previous: SearchSubjectSlug[]): SearchSubjectSlug[] {
  return [...previous, validateSubject(value)];
}

/**
 * Collect key stage values into array.
 */
export function collectKeyStage(value: string, previous: KeyStage[]): KeyStage[] {
  return [...previous, validateKeyStage(value)];
}

/**
 * Collect index values into array.
 */
export function collectIndex(value: string, previous: SearchIndexKind[]): SearchIndexKind[] {
  return [...previous, validateIndex(value)];
}

/**
 * Resolve subjects based on --all flag and explicit --subject args.
 */
export function resolveSubjects(
  explicitSubjects: readonly SearchSubjectSlug[],
  allFlag: boolean,
  bulkMode: boolean,
): SearchSubjectSlug[] {
  if (bulkMode) {
    return [];
  }
  if (allFlag && explicitSubjects.length > 0) {
    throw new Error('--all cannot be combined with --subject');
  }
  if (allFlag) {
    return [...ALL_SUBJECTS];
  }
  if (explicitSubjects.length === 0) {
    throw new Error('No subjects specified. Use --subject <slug> or --all');
  }
  return [...explicitSubjects];
}

/**
 * Validate bulk mode requirements.
 */
export function validateBulkMode(bulkMode: boolean, bulkDir: string | undefined): void {
  if (bulkMode && bulkDir === undefined) {
    throw new Error('--bulk requires --bulk-dir <path>');
  }
}
