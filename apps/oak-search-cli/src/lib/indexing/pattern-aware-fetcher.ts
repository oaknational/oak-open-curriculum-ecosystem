/**
 * Pattern-aware data fetching for curriculum ingestion.
 *
 * This module implements traversal strategies based on the static pattern
 * configuration, ensuring all curriculum data is fetched regardless of
 * API structural variations.
 *
 * @see curriculum-pattern-config.ts for pattern definitions
 * @see ADR-080 Comprehensive Curriculum Data Denormalisation Strategy
 */

import type { Logger } from '@oaknational/logger';
import { formatSdkError, type SdkFetchError } from '@oaknational/curriculum-sdk';
import { isSequenceUnitsResponse } from '@oaknational/curriculum-sdk/public/search.js';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter';
import { getPatternConfig, type PatternConfig } from './curriculum-pattern-config';
import { ingestLogger } from '../logger';
import { extractUnitsForKeyStage } from './sequence-unit-extraction';

// ============================================================================
// Types
// ============================================================================

/**
 * Unit data returned from pattern-aware fetching.
 */
interface PatternFetchedUnit {
  readonly unitSlug: string;
  readonly unitTitle: string;
  /** Sequence the unit was fetched from (for sequence-units traversal) */
  readonly sourceSequence?: string;
}

/**
 * Result of pattern-aware data fetching.
 */
interface PatternFetchResult {
  readonly units: readonly PatternFetchedUnit[];
  readonly pattern: PatternConfig;
  readonly skipped: boolean;
  readonly skipReason?: string;
}

// ============================================================================
// Pattern-Aware Fetching
// ============================================================================

/**
 * Fetch units for a subject/keystage pair using pattern-aware traversal.
 */
export async function fetchUnitsPatternAware(
  client: OakClient,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
  logger: Logger = ingestLogger,
): Promise<PatternFetchResult> {
  const key = `${subject}:${keyStage}`;
  const config = getPatternConfig(subject, keyStage);

  if (!config) {
    return createSkippedResult(`No pattern config for ${key}`, 'empty');
  }

  if (config.traversal === 'skip') {
    logger.debug('Skipping combination (no data)', { subject, keyStage, pattern: config.pattern });
    return { units: [], pattern: config, skipped: true, skipReason: config.notes };
  }

  if (config.traversal === 'key-stage-lessons') {
    return fetchViaKeyStageEndpoint(client, subject, keyStage, config, logger);
  }

  if (config.traversal === 'sequence-units') {
    return fetchViaSequenceEndpoint(client, subject, keyStage, config, logger);
  }

  // TypeScript exhaustiveness check
  const _exhaustive: never = config.traversal;
  throw new Error(`Unknown traversal strategy: ${String(_exhaustive)}`);
}

// ============================================================================
// Helpers
// ============================================================================

function createSkippedResult(
  skipReason: string,
  pattern: PatternConfig['pattern'],
): PatternFetchResult {
  return {
    units: [],
    pattern: { pattern, traversal: 'skip', notes: skipReason },
    skipped: true,
    skipReason,
  };
}

// ============================================================================
// Key Stage Endpoint Traversal
// ============================================================================

async function fetchViaKeyStageEndpoint(
  client: OakClient,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
  config: PatternConfig,
  logger: Logger,
): Promise<PatternFetchResult> {
  logger.debug('Fetching via key-stage endpoint', { subject, keyStage, pattern: config.pattern });

  const result = await client.getUnitsByKeyStageAndSubject(keyStage, subject);

  if (!result.ok) {
    handleSdkError(result.error, logger, 'key-stage endpoint', { subject, keyStage });
  }

  const units: PatternFetchedUnit[] = result.value.map((u) => ({
    unitSlug: u.unitSlug,
    unitTitle: u.unitTitle,
  }));

  logger.debug('Fetched units', { subject, keyStage, count: units.length });
  return { units, pattern: config, skipped: false };
}

// ============================================================================
// Sequence Endpoint Traversal
// ============================================================================

async function fetchViaSequenceEndpoint(
  client: OakClient,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
  config: PatternConfig,
  logger: Logger,
): Promise<PatternFetchResult> {
  const sequences = config.sequences;
  if (!sequences || sequences.length === 0) {
    throw new Error(`Pattern ${config.pattern} requires sequences but none defined`);
  }

  logger.debug('Fetching via sequence endpoint', {
    subject,
    keyStage,
    sequenceCount: sequences.length,
  });

  const allUnits: PatternFetchedUnit[] = [];
  const seenSlugs = new Set<string>();

  for (const sequenceSlug of sequences) {
    const units = await fetchUnitsFromSequence(client, sequenceSlug, keyStage, logger);
    for (const unit of units) {
      if (!seenSlugs.has(unit.unitSlug)) {
        seenSlugs.add(unit.unitSlug);
        allUnits.push({ ...unit, sourceSequence: sequenceSlug });
      }
    }
  }

  logger.debug('Fetched units via sequences', { subject, keyStage, count: allUnits.length });
  return { units: allUnits, pattern: config, skipped: false };
}

async function fetchUnitsFromSequence(
  client: OakClient,
  sequenceSlug: string,
  keyStage: KeyStage,
  logger: Logger,
): Promise<PatternFetchedUnit[]> {
  const result = await client.getSequenceUnits(sequenceSlug);

  if (!result.ok) {
    handleSdkError(result.error, logger, 'sequence units', { sequenceSlug });
  }

  const response = result.value;
  if (!isSequenceUnitsResponse(response)) {
    logger.warn('Invalid sequence units response', { sequenceSlug });
    return [];
  }

  const extracted = extractUnitsForKeyStage(response, keyStage);
  return extracted.map((u) => ({ unitSlug: u.unitSlug, unitTitle: u.unitTitle }));
}

// ============================================================================
// Error Handling
// ============================================================================

function handleSdkError(
  error: SdkFetchError,
  logger: Logger,
  context: string,
  details: Record<string, string>,
): never {
  const message = formatSdkError(error);
  logger.error(`Failed to fetch ${context}`, { ...details, error: message });
  if (error.kind === 'network_error') {
    throw error.cause;
  }
  throw new Error(message);
}
