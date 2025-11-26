import { describe, it, expect } from 'vitest';
import { kebabToTitleCase } from './kebab-to-title-case.js';

/**
 * Unit tests for kebabToTitleCase pure function.
 *
 * This function converts kebab-case tool names to human-readable titles
 * for MCP tool annotations.
 */
describe('kebabToTitleCase', () => {
  it('converts get-key-stages to Get Key Stages', () => {
    expect(kebabToTitleCase('get-key-stages')).toBe('Get Key Stages');
  });

  it('converts get-lessons-transcript to Get Lessons Transcript', () => {
    expect(kebabToTitleCase('get-lessons-transcript')).toBe('Get Lessons Transcript');
  });

  it('handles single word', () => {
    expect(kebabToTitleCase('search')).toBe('Search');
  });

  it('handles multiple hyphens', () => {
    expect(kebabToTitleCase('get-key-stages-subject-assets')).toBe('Get Key Stages Subject Assets');
  });

  it('handles already capitalized words', () => {
    expect(kebabToTitleCase('GET-KEY-STAGES')).toBe('Get Key Stages');
  });

  it('handles empty string', () => {
    expect(kebabToTitleCase('')).toBe('');
  });
});
