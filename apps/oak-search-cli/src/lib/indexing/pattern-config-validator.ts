/**
 * Validation utilities for curriculum pattern configuration.
 *
 * These functions ensure the pattern config is complete and consistent
 * at build/startup time, catching configuration errors early.
 */

import { typeSafeEntries } from '@oaknational/type-helpers';
import {
  CURRICULUM_PATTERN_CONFIG,
  PATTERN_SUBJECTS,
  PATTERN_KEY_STAGES,
  makeSubjectKeyStageKey,
  type PatternConfig,
} from './curriculum-pattern-config';

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
  const total = PATTERN_SUBJECTS.length * PATTERN_KEY_STAGES.length; // 68
  const missing: string[] = [];
  const errors: string[] = [];
  let configured = 0;

  for (const subject of PATTERN_SUBJECTS) {
    for (const keyStage of PATTERN_KEY_STAGES) {
      const key = makeSubjectKeyStageKey(subject, keyStage);
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
