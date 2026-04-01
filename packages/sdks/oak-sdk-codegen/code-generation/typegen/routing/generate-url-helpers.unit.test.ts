/**
 * Unit tests for the URL helpers generator.
 *
 * These tests specify the CORRECT URL patterns that must be generated.
 * They are written FIRST (TDD RED phase) before fixing the generator.
 *
 * URL patterns confirmed against OWA source (`src/pages/teachers/`) and
 * live site on 2026-03-05:
 * - Sequences: `/teachers/curriculum/{sequenceSlug}/units` (NOT `/programmes/`)
 * - Units: `/teachers/curriculum/{sequenceSlug}/units/{unitSlug}` (NOT `/programmes/`)
 * - Threads: no OWA page, return `null`
 * - Lessons: `/teachers/lessons/{lessonSlug}` (correct, unchanged)
 */

import { describe, expect, it } from 'vitest';
import { generateUrlHelpers } from './generate-url-helpers.js';

describe('generateUrlHelpers', () => {
  it('returns a non-empty string', () => {
    const output = generateUrlHelpers();
    expect(typeof output).toBe('string');
    expect(output.length).toBeGreaterThan(0);
  });

  describe('CONTENT_TYPE_PREFIXES', () => {
    it('includes generated path segments for every content type', () => {
      const output = generateUrlHelpers();
      expect(output).toContain(
        "lesson: { prefix: 'lesson:', contentType: 'lesson', pathSegment: 'lessons' }",
      );
      expect(output).toContain(
        "unit: { prefix: 'unit:', contentType: 'unit', pathSegment: 'units' }",
      );
      expect(output).toContain(
        "subject: { prefix: 'subject:', contentType: 'subject', pathSegment: 'subjects' }",
      );
      expect(output).toContain(
        "sequence: { prefix: 'sequence:', contentType: 'sequence', pathSegment: 'sequences' }",
      );
      expect(output).toContain(
        "thread: { prefix: 'thread:', contentType: 'thread', pathSegment: 'threads' }",
      );
    });
  });

  describe('urlForSequence', () => {
    it('generates /teachers/curriculum/{slug}/units (not /programmes/)', () => {
      const output = generateUrlHelpers();
      expect(output).toContain('/teachers/curriculum/');
      // Confirm it's in the urlForSequence context
      expect(output).toContain("+ slug + '/units'");
    });

    it('does not generate /teachers/programmes/ for sequences', () => {
      const output = generateUrlHelpers();
      const seqMatch = output.match(/function urlForSequence[\s\S]*?\n}/m);
      expect(seqMatch).not.toBeNull();
      if (seqMatch) {
        expect(seqMatch[0]).not.toContain('/teachers/programmes/');
      }
      expect(output).toContain('/teachers/curriculum/');
    });
  });

  describe('urlForUnit', () => {
    it('generates /teachers/curriculum/{sequenceSlug}/units/{unitSlug}', () => {
      const output = generateUrlHelpers();
      // The urlForUnit body should reference /curriculum/ and /units/
      const unitMatch = output.match(/function urlForUnit[\s\S]*?\n}/m);
      expect(unitMatch).not.toBeNull();
      if (unitMatch) {
        expect(unitMatch[0]).toContain('/teachers/curriculum/');
        expect(unitMatch[0]).toContain('/units/');
      }
    });

    it('accepts sequenceSlug in context (not subjectSlug/phaseSlug)', () => {
      const output = generateUrlHelpers();
      // The context parameter should reference sequenceSlug, not subjectSlug/phaseSlug
      const unitMatch = output.match(/function urlForUnit\(slug: string, context\?:[^)]+\)/);
      expect(unitMatch).not.toBeNull();
      if (unitMatch) {
        expect(unitMatch[0]).toContain('sequenceSlug');
      }
    });

    it('does not use /teachers/programmes/ for units', () => {
      const output = generateUrlHelpers();
      const unitMatch = output.match(/function urlForUnit[\s\S]*?\n}/m);
      expect(unitMatch).not.toBeNull();
      if (unitMatch) {
        expect(unitMatch[0]).not.toContain('/teachers/programmes/');
      }
    });
  });

  describe('urlForLesson', () => {
    it('generates /teachers/lessons/{slug} (unchanged)', () => {
      const output = generateUrlHelpers();
      expect(output).toContain('/teachers/lessons/');
      const lessonMatch = output.match(/function urlForLesson[\s\S]*?\n}/m);
      expect(lessonMatch).not.toBeNull();
    });
  });

  describe('urlForSubject', () => {
    it('generates /teachers/key-stages/{ks}/subjects/{slug}/programmes (unchanged)', () => {
      const output = generateUrlHelpers();
      expect(output).toContain('/teachers/key-stages/');
      expect(output).toContain('/subjects/');
      expect(output).toContain('/programmes');
    });
  });

  describe('generateOakUrlWithContext', () => {
    it('context type uses sequenceSlug for unit (not subjectSlug/phaseSlug)', () => {
      const output = generateUrlHelpers();
      const contextMatch = output.match(/unit\?:\s*\{[^}]+\}/);
      expect(contextMatch).not.toBeNull();
      if (contextMatch) {
        expect(contextMatch[0]).toContain('sequenceSlug');
        expect(contextMatch[0]).not.toContain('subjectSlug');
        expect(contextMatch[0]).not.toContain('phaseSlug');
      }
    });

    it('thread returns null (no website equivalent)', () => {
      const output = generateUrlHelpers();
      // Thread branch should assign null
      expect(output).toContain("type === 'thread'");
      expect(output).toContain('null');
    });
  });

  describe('generateOakUrl (fallback)', () => {
    it('also uses sequenceSlug context for units', () => {
      const output = generateUrlHelpers();
      // Both generateOakUrlWithContext and generateOakUrl must use sequenceSlug
      // in their unit context type (not subjectSlug/phaseSlug)
      // Check for the pattern in actual type declarations (not comments)
      const typeDeclarations = output.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
      expect(typeDeclarations).not.toMatch(/unit\?:\s*\{[^}]*subjectSlug/);
      expect(typeDeclarations).not.toMatch(/unit\?:\s*\{[^}]*phaseSlug/);
    });
  });
});
