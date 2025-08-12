/**
 * Validation functions for MCP tool inputs
 * Ensures type safety at runtime boundaries
 */

import type { OrganSearchLessonsParams } from '../../../chorai/stroma';

/**
 * Valid key stages from the Oak API
 */
const VALID_KEY_STAGES = ['eyfs', 'ks1', 'ks2', 'ks3', 'ks4', 'ks5'] as const;

/**
 * Valid subjects from the Oak API
 */
const VALID_SUBJECTS = [
  'english',
  'maths',
  'science',
  'history',
  'geography',
  'religious-education',
  'computing',
  'music',
  'art',
  'physical-education',
  'design-technology',
  'french',
  'spanish',
  'german',
  'latin',
  'citizenship',
  'rshe-pshe',
] as const;

/**
 * Type for valid key stages
 */
type ValidKeyStage = (typeof VALID_KEY_STAGES)[number];

/**
 * Type for valid subjects
 */
type ValidSubject = (typeof VALID_SUBJECTS)[number];

/**
 * Check if a value is a valid key stage
 */
function isValidKeyStage(value: string): value is ValidKeyStage {
  return VALID_KEY_STAGES.some((ks) => ks === value);
}

/**
 * Check if a value is a valid subject
 */
function isValidSubject(value: string): value is ValidSubject {
  return VALID_SUBJECTS.some((s) => s === value);
}

/**
 * Validates key stage parameter
 */
export function validateKeyStage(keyStage: string): OrganSearchLessonsParams['keyStage'] {
  if (!isValidKeyStage(keyStage)) {
    throw new Error(`Invalid key stage: ${keyStage}. Valid values: ${VALID_KEY_STAGES.join(', ')}`);
  }
  return keyStage;
}

/**
 * Validates subject parameter
 */
export function validateSubject(subject: string): OrganSearchLessonsParams['subject'] {
  if (!isValidSubject(subject)) {
    throw new Error(`Invalid subject: ${subject}. Valid values: ${VALID_SUBJECTS.join(', ')}`);
  }
  return subject;
}

/**
 * Validates lesson slug format
 */
export function validateLessonSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') {
    throw new Error('Lesson slug must be a non-empty string');
  }

  // Basic validation - slug should contain alphanumeric and hyphens
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(
      'Invalid lesson slug format. Must contain only lowercase letters, numbers, and hyphens',
    );
  }

  return slug;
}

/**
 * Export valid values for use in tool schemas
 */
export const TOOL_SCHEMA_ENUMS = {
  keyStages: VALID_KEY_STAGES,
  subjects: VALID_SUBJECTS,
} as const;
