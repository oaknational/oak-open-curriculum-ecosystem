/**
 * Unit tests for the Lesson Ground Truths system.
 *
 * These tests verify the BEHAVIOUR of accessor functions, not types.
 * TypeScript enforces type structure at compile time.
 */

import { typeSafeKeys } from '@oaknational/curriculum-sdk';
import { describe, it, expect } from 'vitest';
import {
  LESSON_GROUND_TRUTHS,
  CROSS_SUBJECT_LESSON_GROUND_TRUTHS,
  APPLE_LESSONS,
  MATHS_PRIMARY,
  MATHS_SECONDARY,
  getLessonGroundTruth,
  getLessonGroundTruthsForSubject,
  getLessonGroundTruthsForPhase,
  subjectPhaseKey,
} from './index';

// =============================================================================
// subjectPhaseKey — Pure function tests
// =============================================================================

describe('subjectPhaseKey', () => {
  it('concatenates subject and phase with hyphen', () => {
    expect(subjectPhaseKey('maths', 'secondary')).toBe('maths-secondary');
  });

  it('works for any valid subject-phase combination', () => {
    expect(subjectPhaseKey('english', 'primary')).toBe('english-primary');
    expect(subjectPhaseKey('science', 'secondary')).toBe('science-secondary');
  });
});

// =============================================================================
// LESSON_GROUND_TRUTHS — Data integrity tests
// =============================================================================

describe('LESSON_GROUND_TRUTHS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(LESSON_GROUND_TRUTHS)).toBe(true);
    expect(LESSON_GROUND_TRUTHS.length).toBeGreaterThan(0);
  });

  it('has no duplicate subject-phase pairs', () => {
    // Each subject-phase pair should appear exactly once
    const keys = LESSON_GROUND_TRUTHS.map((gt) => subjectPhaseKey(gt.subject, gt.phase));
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it('all queries follow the 2-10 word constraint from GROUND-TRUTH-GUIDE', () => {
    // Some curriculum topics are naturally 2 words (e.g. "plate boundaries", "cam mechanisms")
    for (const gt of LESSON_GROUND_TRUTHS) {
      const wordCount = gt.query.split(/\s+/).length;
      expect(wordCount).toBeGreaterThanOrEqual(2);
      expect(wordCount).toBeLessThanOrEqual(10);
    }
  });

  it('all descriptions explain why the query should find the lesson', () => {
    // Descriptions must be meaningful, not empty
    for (const gt of LESSON_GROUND_TRUTHS) {
      expect(gt.description.length).toBeGreaterThan(20);
    }
  });

  it('all entries have expected relevance with 2-3 results', () => {
    // Each ground truth must have relevance judgments for benchmarking
    for (const gt of LESSON_GROUND_TRUTHS) {
      const resultCount = typeSafeKeys(gt.expectedRelevance).length;
      expect(resultCount).toBeGreaterThanOrEqual(2);
      expect(resultCount).toBeLessThanOrEqual(3);
    }
  });
});

// =============================================================================
// CROSS_SUBJECT_LESSON_GROUND_TRUTHS — Data integrity tests
// =============================================================================

describe('CROSS_SUBJECT_LESSON_GROUND_TRUTHS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(CROSS_SUBJECT_LESSON_GROUND_TRUTHS)).toBe(true);
    expect(CROSS_SUBJECT_LESSON_GROUND_TRUTHS.length).toBeGreaterThan(0);
  });

  it('contains the APPLE_LESSONS entry', () => {
    expect(CROSS_SUBJECT_LESSON_GROUND_TRUTHS).toContain(APPLE_LESSONS);
  });

  it('all queries follow the 1-10 word constraint (single-word queries are valid stress tests)', () => {
    for (const gt of CROSS_SUBJECT_LESSON_GROUND_TRUTHS) {
      const wordCount = gt.query.split(/\s+/).length;
      expect(wordCount).toBeGreaterThanOrEqual(1);
      expect(wordCount).toBeLessThanOrEqual(10);
    }
  });

  it('all entries have expected relevance with 2-3 results', () => {
    for (const gt of CROSS_SUBJECT_LESSON_GROUND_TRUTHS) {
      const resultCount = typeSafeKeys(gt.expectedRelevance).length;
      expect(resultCount).toBeGreaterThanOrEqual(2);
      expect(resultCount).toBeLessThanOrEqual(3);
    }
  });

  it('all entries have meaningful descriptions', () => {
    for (const gt of CROSS_SUBJECT_LESSON_GROUND_TRUTHS) {
      expect(gt.description.length).toBeGreaterThan(20);
    }
  });

  it('unfiltered entries have no subject, phase, or keyStage', () => {
    const unfilteredEntries = CROSS_SUBJECT_LESSON_GROUND_TRUTHS.filter(
      (gt) => gt.subject === undefined && gt.phase === undefined && gt.keyStage === undefined,
    );
    expect(unfilteredEntries.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// getLessonGroundTruth — Lookup behaviour tests
// =============================================================================

describe('getLessonGroundTruth', () => {
  it('finds ground truth when subject and phase match (secondary)', () => {
    const result = getLessonGroundTruth('maths', 'secondary');
    expect(result).toBeDefined();
    expect(result?.subject).toBe('maths');
    expect(result?.phase).toBe('secondary');
  });

  it('finds ground truth when subject and phase match (primary)', () => {
    const result = getLessonGroundTruth('maths', 'primary');
    expect(result).toBeDefined();
    expect(result?.subject).toBe('maths');
    expect(result?.phase).toBe('primary');
  });

  it('returns undefined when subject has no ground truths for that phase', () => {
    // German only has secondary ground truth, primary should be undefined
    const result = getLessonGroundTruth('german', 'primary');
    expect(result).toBeUndefined();
  });

  it('returns undefined when phase has no ground truth for that subject', () => {
    // Citizenship only has secondary ground truth, primary should be undefined
    const result = getLessonGroundTruth('citizenship', 'primary');
    expect(result).toBeUndefined();
  });

  it('returns the exact same object reference from LESSON_GROUND_TRUTHS (secondary)', () => {
    // Verifies no copying/cloning occurs
    const result = getLessonGroundTruth('maths', 'secondary');
    expect(result).toBe(MATHS_SECONDARY);
  });

  it('returns the exact same object reference from LESSON_GROUND_TRUTHS (primary)', () => {
    // Verifies no copying/cloning occurs
    const result = getLessonGroundTruth('maths', 'primary');
    expect(result).toBe(MATHS_PRIMARY);
  });
});

// =============================================================================
// getLessonGroundTruthsForSubject — Filtering behaviour tests
// =============================================================================

describe('getLessonGroundTruthsForSubject', () => {
  it('returns all ground truths for a subject with entries', () => {
    const results = getLessonGroundTruthsForSubject('maths');
    expect(results.length).toBeGreaterThan(0);
    // All results should have the requested subject
    for (const gt of results) {
      expect(gt.subject).toBe('maths');
    }
  });

  it('returns empty array for subject with no ground truths', () => {
    // combined-science exists as a valid subject type but has no ground truths
    const results = getLessonGroundTruthsForSubject('combined-science');
    expect(results).toEqual([]);
  });

  it('returns array even when only one entry matches', () => {
    const results = getLessonGroundTruthsForSubject('maths');
    expect(Array.isArray(results)).toBe(true);
  });
});

// =============================================================================
// getLessonGroundTruthsForPhase — Filtering behaviour tests
// =============================================================================

describe('getLessonGroundTruthsForPhase', () => {
  it('returns all ground truths for secondary phase', () => {
    const results = getLessonGroundTruthsForPhase('secondary');
    expect(results.length).toBeGreaterThan(0);
    // All results should have the requested phase
    for (const gt of results) {
      expect(gt.phase).toBe('secondary');
    }
  });

  it('returns all ground truths for primary phase', () => {
    const results = getLessonGroundTruthsForPhase('primary');
    expect(results.length).toBeGreaterThan(0);
    // All results should have the requested phase
    for (const gt of results) {
      expect(gt.phase).toBe('primary');
    }
  });

  it('returns array type for phase results', () => {
    const results = getLessonGroundTruthsForPhase('secondary');
    expect(Array.isArray(results)).toBe(true);
  });
});
