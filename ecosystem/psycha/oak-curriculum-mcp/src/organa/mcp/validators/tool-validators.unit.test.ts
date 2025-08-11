/**
 * Unit tests for MCP tool validators
 */

import { describe, it, expect } from 'vitest';
import {
  validateKeyStage,
  validateSubject,
  validateLessonSlug,
  TOOL_SCHEMA_ENUMS,
} from './tool-validators';

describe('validateKeyStage', () => {
  it('should accept valid key stages', () => {
    expect(validateKeyStage('ks1')).toBe('ks1');
    expect(validateKeyStage('ks2')).toBe('ks2');
    expect(validateKeyStage('ks3')).toBe('ks3');
    expect(validateKeyStage('ks4')).toBe('ks4');
    expect(validateKeyStage('eyfs')).toBe('eyfs');
  });

  it('should reject invalid key stages', () => {
    expect(() => validateKeyStage('invalid')).toThrow('Invalid key stage: invalid');
    expect(() => validateKeyStage('KS1')).toThrow('Invalid key stage: KS1');
    expect(() => validateKeyStage('')).toThrow('Invalid key stage: ');
  });
});

describe('validateSubject', () => {
  it('should accept valid subjects', () => {
    expect(validateSubject('english')).toBe('english');
    expect(validateSubject('maths')).toBe('maths');
    expect(validateSubject('science')).toBe('science');
    expect(validateSubject('computing')).toBe('computing');
  });

  it('should reject invalid subjects', () => {
    expect(() => validateSubject('invalid')).toThrow('Invalid subject: invalid');
    expect(() => validateSubject('English')).toThrow('Invalid subject: English');
    expect(() => validateSubject('')).toThrow('Invalid subject: ');
  });
});

describe('validateLessonSlug', () => {
  it('should accept valid lesson slugs', () => {
    expect(validateLessonSlug('intro-fractions-2h6t8')).toBe('intro-fractions-2h6t8');
    expect(validateLessonSlug('simple-slug')).toBe('simple-slug');
    expect(validateLessonSlug('with-numbers-123')).toBe('with-numbers-123');
  });

  it('should reject invalid lesson slugs', () => {
    expect(() => validateLessonSlug('')).toThrow('Lesson slug must be a non-empty string');
    expect(() => validateLessonSlug('UPPERCASE')).toThrow('Invalid lesson slug format');
    expect(() => validateLessonSlug('with spaces')).toThrow('Invalid lesson slug format');
    expect(() => validateLessonSlug('special!chars')).toThrow('Invalid lesson slug format');
  });
});

describe('TOOL_SCHEMA_ENUMS', () => {
  it('should export valid key stages', () => {
    expect(TOOL_SCHEMA_ENUMS.keyStages).toContain('ks1');
    expect(TOOL_SCHEMA_ENUMS.keyStages).toContain('ks2');
    expect(TOOL_SCHEMA_ENUMS.keyStages).toHaveLength(6);
  });

  it('should export valid subjects', () => {
    expect(TOOL_SCHEMA_ENUMS.subjects).toContain('english');
    expect(TOOL_SCHEMA_ENUMS.subjects).toContain('maths');
    expect(TOOL_SCHEMA_ENUMS.subjects.length).toBeGreaterThan(10);
  });
});
