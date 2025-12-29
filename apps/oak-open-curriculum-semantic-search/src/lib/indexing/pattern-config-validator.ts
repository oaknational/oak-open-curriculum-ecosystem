/**
 * Validation utilities for curriculum pattern configuration.
 *
 * These functions ensure the pattern config is complete and consistent
 * at build/startup time, catching configuration errors early.
 *
 * @packageDocumentation
 */

import { typeSafeEntries } from '@oaknational/oak-curriculum-sdk';
import {
  CURRICULUM_PATTERN_CONFIG,
  type PatternConfig,
  type SubjectKeyStageKey,
} from './curriculum-pattern-config';

/**
 * All valid subject slugs. These MUST match the SDK SUBJECTS constant.
 */
const ALL_SUBJECTS = [
  'art',
  'citizenship',
  'computing',
  'cooking-nutrition',
  'design-technology',
  'english',
  'french',
  'geography',
  'german',
  'history',
  'maths',
  'music',
  'physical-education',
  'religious-education',
  'rshe-pshe',
  'science',
  'spanish',
] as const;

/**
 * All valid key stage slugs. These MUST match the SDK KEY_STAGES constant.
 */
const ALL_KEY_STAGES = ['ks1', 'ks2', 'ks3', 'ks4'] as const;

/**
 * Validation result for pattern config completeness.
 */
export interface PatternConfigValidationResult {
  readonly valid: boolean;
  readonly total: number;
  readonly configured: number;
  readonly missing: readonly string[];
  readonly errors: readonly string[];
}

/**
 * Validate that the pattern configuration is complete.
 */
export function validatePatternConfig(): PatternConfigValidationResult {
  const total = ALL_SUBJECTS.length * ALL_KEY_STAGES.length; // 68
  const missing: string[] = [];
  const errors: string[] = [];
  let configured = 0;

  for (const subject of ALL_SUBJECTS) {
    for (const keyStage of ALL_KEY_STAGES) {
      // Safe assertion: ALL_SUBJECTS and ALL_KEY_STAGES are exhaustive
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const key = `${subject}:${keyStage}` as SubjectKeyStageKey;
      const config = CURRICULUM_PATTERN_CONFIG[key];

      if (!config) {
        missing.push(key);
        continue;
      }

      configured++;

      // Validate config structure
      const configErrors = validateConfigEntry(key, config);
      errors.push(...configErrors);
    }
  }

  return {
    valid: missing.length === 0 && errors.length === 0,
    total,
    configured,
    missing,
    errors,
  };
}

/**
 * Validate a single config entry for sequence-units traversal.
 */
function validateSequenceUnitsConfig(key: string, config: PatternConfig): string[] {
  if (config.traversal !== 'sequence-units') {
    return [];
  }
  if (!config.sequences || config.sequences.length === 0) {
    return [`${key}: traversal='sequence-units' but no sequences defined`];
  }
  return [];
}

/**
 * Validate that pattern and traversal are consistent.
 */
function validatePatternTraversalConsistency(key: string, config: PatternConfig): string[] {
  const errors: string[] = [];

  const patternsRequiringSequenceUnits: readonly string[] = [
    'tier-variants',
    'exam-board-variants',
    'exam-subject-split',
  ];

  if (
    patternsRequiringSequenceUnits.includes(config.pattern) &&
    config.traversal !== 'sequence-units'
  ) {
    errors.push(`${key}: pattern='${config.pattern}' should use traversal='sequence-units'`);
  }

  const patternsRequiringSkip: readonly string[] = ['empty', 'no-ks4'];

  if (patternsRequiringSkip.includes(config.pattern) && config.traversal !== 'skip') {
    errors.push(`${key}: pattern='${config.pattern}' should use traversal='skip'`);
  }

  return errors;
}

/**
 * Validate a single config entry.
 */
function validateConfigEntry(key: string, config: PatternConfig): string[] {
  const sequenceErrors = validateSequenceUnitsConfig(key, config);
  const consistencyErrors = validatePatternTraversalConsistency(key, config);
  return [...sequenceErrors, ...consistencyErrors];
}

/**
 * Assert that the pattern config is valid. Throws if invalid.
 */
export function assertPatternConfigValid(): void {
  const result = validatePatternConfig();

  if (!result.valid) {
    const messages: string[] = [];

    if (result.missing.length > 0) {
      messages.push(`Missing configs: ${result.missing.join(', ')}`);
    }

    if (result.errors.length > 0) {
      messages.push(`Config errors:\n  ${result.errors.join('\n  ')}`);
    }

    throw new Error(
      `Pattern config validation failed (${result.configured}/${result.total} configured):\n${messages.join('\n')}`,
    );
  }
}

/**
 * Get the count of configured patterns.
 */
export function getConfiguredPatternCount(): number {
  const entries = typeSafeEntries(CURRICULUM_PATTERN_CONFIG);
  return entries.length;
}
