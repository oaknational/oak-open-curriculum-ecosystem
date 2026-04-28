/**
 * Unit tests for canonical URL validation against the sitemap reference map.
 *
 * Pure-function tests only — no IO, no mocks, no side effects.
 *
 * @see validate-canonical-urls.ts for the implementation
 * @see ADR-132 for the sitemap scanner design
 */

import { describe, expect, it } from 'vitest';
import {
  validateUrl,
  validateGeneratedUrls,
  type UrlValidationResult,
  type ValidationSummary,
} from './validate-canonical-urls.js';

/** Sorted teacher paths fixture (mirrors the shape of canonical-url-map.json) */
const SORTED_PATHS: readonly string[] = [
  '/teachers/curriculum/art-primary/units',
  '/teachers/curriculum/art-secondary/units',
  '/teachers/curriculum/maths-primary/units',
  '/teachers/curriculum/maths-primary/units/addition-within-10',
  '/teachers/curriculum/maths-primary/units/counting-objects',
  '/teachers/key-stages/ks1/subjects',
  '/teachers/key-stages/ks1/subjects/maths/programmes',
  '/teachers/lessons/1066-and-claims-to-the-throne',
  '/teachers/lessons/addition-bonds-to-10',
  '/teachers/programmes/maths-primary-ks1',
  '/teachers/programmes/maths-primary-ks1/units',
  '/teachers/specialist/programmes/therapist-primary',
];

describe('validateUrl', () => {
  it('returns valid for a path present in the sorted list', () => {
    const result: UrlValidationResult = validateUrl(
      '/teachers/lessons/addition-bonds-to-10',
      SORTED_PATHS,
    );
    expect(result.valid).toBe(true);
  });

  it('returns invalid with reason for a path not in the list', () => {
    const result: UrlValidationResult = validateUrl(
      '/teachers/lessons/nonexistent-lesson',
      SORTED_PATHS,
    );
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toContain('not found');
    }
  });

  it('returns valid for the first element (binary search boundary)', () => {
    const result = validateUrl('/teachers/curriculum/art-primary/units', SORTED_PATHS);
    expect(result.valid).toBe(true);
  });

  it('returns valid for the last element (binary search boundary)', () => {
    const result = validateUrl('/teachers/specialist/programmes/therapist-primary', SORTED_PATHS);
    expect(result.valid).toBe(true);
  });

  it('returns valid for a middle element', () => {
    const result = validateUrl('/teachers/key-stages/ks1/subjects', SORTED_PATHS);
    expect(result.valid).toBe(true);
  });

  it('returns unvalidated when the paths array is empty', () => {
    const result = validateUrl('/teachers/lessons/anything', []);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toContain('empty');
    }
  });

  it('finds the correct element in a large sorted array', () => {
    const largePaths: string[] = [];
    for (let i = 0; i < 100_000; i++) {
      largePaths.push(`/teachers/lessons/lesson-${String(i).padStart(6, '0')}`);
    }
    const result = validateUrl('/teachers/lessons/lesson-050000', largePaths);
    expect(result.valid).toBe(true);

    const missing = validateUrl('/teachers/lessons/lesson-999999', largePaths);
    expect(missing.valid).toBe(false);
  });
});

describe('validateGeneratedUrls', () => {
  it('returns a summary with valid, invalid, and total counts', () => {
    const urls = [
      '/teachers/lessons/addition-bonds-to-10',
      '/teachers/lessons/nonexistent',
      '/teachers/curriculum/maths-primary/units',
    ];
    const summary: ValidationSummary = validateGeneratedUrls(urls, SORTED_PATHS);
    expect(summary.total).toBe(3);
    expect(summary.validCount).toBe(2);
    expect(summary.invalidCount).toBe(1);
  });

  it('includes all invalid URLs in the details array', () => {
    const urls = ['/teachers/lessons/nonexistent', '/teachers/programmes/ghost-programme'];
    const summary = validateGeneratedUrls(urls, SORTED_PATHS);
    expect(summary.invalidUrls).toHaveLength(2);
    expect(summary.invalidUrls[0]).toBe('/teachers/lessons/nonexistent');
    expect(summary.invalidUrls[1]).toBe('/teachers/programmes/ghost-programme');
  });

  it('returns all-valid summary when every URL matches', () => {
    const urls = [
      '/teachers/lessons/addition-bonds-to-10',
      '/teachers/programmes/maths-primary-ks1',
    ];
    const summary = validateGeneratedUrls(urls, SORTED_PATHS);
    expect(summary.invalidCount).toBe(0);
    expect(summary.invalidUrls).toHaveLength(0);
  });

  it('returns all-invalid summary when no URLs match', () => {
    const urls = ['/teachers/lessons/fake-a', '/teachers/lessons/fake-b'];
    const summary = validateGeneratedUrls(urls, SORTED_PATHS);
    expect(summary.validCount).toBe(0);
    expect(summary.invalidCount).toBe(2);
  });

  it('handles empty URL list gracefully', () => {
    const summary = validateGeneratedUrls([], SORTED_PATHS);
    expect(summary.total).toBe(0);
    expect(summary.validCount).toBe(0);
    expect(summary.invalidCount).toBe(0);
    expect(summary.invalidUrls).toHaveLength(0);
  });

  it('treats EYFS programme listings as invalid when only deep programme content exists', () => {
    const eyfsPaths = [
      '/teachers/eyfs/maths',
      '/teachers/programmes/maths-foundation-early-years-foundation-stage-l/units/counting/lessons',
    ];
    const urls = ['/teachers/programmes/maths-foundation-early-years-foundation-stage-l/units'];

    const summary = validateGeneratedUrls(urls, eyfsPaths);

    expect(summary.invalidCount).toBe(1);
    expect(summary.invalidUrls).toEqual([
      '/teachers/programmes/maths-foundation-early-years-foundation-stage-l/units',
    ]);
  });
});
