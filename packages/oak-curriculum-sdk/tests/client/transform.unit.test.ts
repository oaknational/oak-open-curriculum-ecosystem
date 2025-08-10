import { describe, it, expect } from 'vitest';
import {
  transformLesson,
  transformSearchResults,
  buildSearchUrl,
} from '../../src/client/transform';

describe('Lesson Data Transformation', () => {
  describe('transformLesson', () => {
    it('transforms API lesson response to internal format', () => {
      // Given: Raw API data (just data, no fetching)
      const apiLesson = {
        id: 'lesson-1',
        title: 'Introduction to Fractions',
        subject_name: 'Mathematics',
        key_stage_slug: 'ks3',
        unit_slug: 'fractions-basics',
        year_group: 7,
        lesson_description: 'Learn the basics of fractions',
        duration_minutes: 45,
      };

      // When: Transform with pure function
      const result = transformLesson(apiLesson);

      // Then: Verify transformation
      expect(result.id).toBe('lesson-1');
      expect(result.title).toBe('Introduction to Fractions');
      expect(result.subject).toBe('Mathematics');
      expect(result.keyStage).toBe('ks3');
      expect(result.unitSlug).toBe('fractions-basics');
      expect(result.yearGroup).toBe(7);
      expect(result.description).toBe('Learn the basics of fractions');
      expect(result.durationMinutes).toBe(45);
    });

    it('handles optional fields gracefully', () => {
      // Given: Minimal API data
      const apiLesson = {
        id: 'lesson-2',
        title: 'Basic Addition',
        subject_name: 'Mathematics',
        key_stage_slug: 'ks1',
      };

      // When: Transform
      const result = transformLesson(apiLesson);

      // Then: Required fields are present, optional are undefined
      expect(result.id).toBe('lesson-2');
      expect(result.title).toBe('Basic Addition');
      expect(result.subject).toBe('Mathematics');
      expect(result.keyStage).toBe('ks1');
      expect(result.unitSlug).toBeUndefined();
      expect(result.yearGroup).toBeUndefined();
      expect(result.description).toBeUndefined();
      expect(result.durationMinutes).toBeUndefined();
    });
  });

  describe('transformSearchResults', () => {
    it('transforms search API response to internal format', () => {
      // Given: Search API response
      const apiResponse = {
        total: 2,
        page: 1,
        limit: 10,
        lessons: [
          {
            id: 'lesson-1',
            title: 'Fractions',
            subject_name: 'Mathematics',
            key_stage_slug: 'ks3',
          },
          {
            id: 'lesson-2',
            title: 'Decimals',
            subject_name: 'Mathematics',
            key_stage_slug: 'ks3',
          },
        ],
      };

      // When: Transform
      const result = transformSearchResults(apiResponse);

      // Then: Verify structure
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.lessons).toHaveLength(2);
      expect(result.lessons[0].id).toBe('lesson-1');
      expect(result.lessons[0].title).toBe('Fractions');
      expect(result.lessons[1].id).toBe('lesson-2');
      expect(result.lessons[1].title).toBe('Decimals');
    });
  });
});

describe('URL Building', () => {
  describe('buildSearchUrl', () => {
    it('builds URL with subject parameter', () => {
      // Given: Base URL and search params
      const baseUrl = 'https://api.oak.com';
      const params = { subject: 'mathematics' };

      // When: Build URL
      const result = buildSearchUrl(baseUrl, params);

      // Then: Verify URL
      expect(result).toBe('https://api.oak.com/api/v1/search?subject=mathematics');
    });

    it('builds URL with multiple parameters', () => {
      // Given: Multiple params
      const baseUrl = 'https://api.oak.com';
      const params = {
        subject: 'mathematics',
        keyStage: 'ks3',
        limit: 20,
      };

      // When: Build URL
      const result = buildSearchUrl(baseUrl, params);

      // Then: Verify URL contains all params
      const url = new URL(result);
      expect(url.searchParams.get('subject')).toBe('mathematics');
      expect(url.searchParams.get('keyStage')).toBe('ks3');
      expect(url.searchParams.get('limit')).toBe('20');
    });

    it('handles empty parameters', () => {
      // Given: No params
      const baseUrl = 'https://api.oak.com';
      const params = {};

      // When: Build URL
      const result = buildSearchUrl(baseUrl, params);

      // Then: URL has no query params
      expect(result).toBe('https://api.oak.com/api/v1/search');
    });

    it('encodes special characters in parameters', () => {
      // Given: Params with special chars
      const baseUrl = 'https://api.oak.com';
      const params = { subject: 'design & technology' };

      // When: Build URL
      const result = buildSearchUrl(baseUrl, params);

      // Then: Special chars are encoded
      expect(result).toContain('design+%26+technology');
    });
  });
});
