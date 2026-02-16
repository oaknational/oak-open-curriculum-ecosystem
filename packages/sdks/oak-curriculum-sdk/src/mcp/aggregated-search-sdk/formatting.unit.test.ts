/**
 * Unit tests for SDK-backed search tool result formatting.
 *
 * Tests that formatSearchResults produces appropriate CallToolResult
 * responses for each scope, including human-readable summaries,
 * structured content, and widget metadata.
 *
 * @remarks
 * In WS1 (RED phase), all these tests MUST FAIL because the formatting
 * function is a stub that throws. They describe the desired behavior
 * that will be implemented in WS2 (GREEN phase).
 */

import { describe, it, expect } from 'vitest';
import { formatSearchResults } from './formatting.js';

describe('formatSearchResults', () => {
  describe('lessons scope', () => {
    it('formats a successful lessons result', () => {
      const mockResult = {
        scope: 'lessons' as const,
        total: 15,
        took: 42,
        timedOut: false,
        results: [
          {
            id: '1',
            rankScore: 0.9,
            lesson: { lessonTitle: 'Photosynthesis Basics', subjectSlug: 'science' },
            highlights: ['<em>photosynthesis</em> is the process...'],
          },
        ],
      };

      const result = formatSearchResults('lessons', mockResult, 'photosynthesis');

      expect(result.isError).toBeUndefined();
      expect(result.content).toBeDefined();
      expect(result.content).toHaveLength(1);
    });

    it('includes count in summary', () => {
      const mockResult = {
        scope: 'lessons' as const,
        total: 15,
        took: 42,
        timedOut: false,
        results: [],
      };

      const result = formatSearchResults('lessons', mockResult, 'photosynthesis');
      const firstContent = result.content[0];

      if ('text' in firstContent) {
        expect(firstContent.text).toContain('15');
      }
    });

    it('includes query in summary', () => {
      const mockResult = {
        scope: 'lessons' as const,
        total: 1,
        took: 10,
        timedOut: false,
        results: [],
      };

      const result = formatSearchResults('lessons', mockResult, 'photosynthesis');
      const firstContent = result.content[0];

      if ('text' in firstContent) {
        expect(firstContent.text).toContain('photosynthesis');
      }
    });
  });

  describe('units scope', () => {
    it('formats a successful units result', () => {
      const mockResult = {
        scope: 'units' as const,
        total: 3,
        took: 30,
        timedOut: false,
        results: [
          {
            id: '1',
            rankScore: 0.85,
            unit: { unitTitle: 'Fractions and Decimals' },
            highlights: [],
          },
        ],
      };

      const result = formatSearchResults('units', mockResult, 'fractions');

      expect(result.isError).toBeUndefined();
      expect(result.content).toBeDefined();
    });
  });

  describe('threads scope', () => {
    it('formats a successful threads result', () => {
      const mockResult = {
        scope: 'threads' as const,
        total: 2,
        took: 25,
        timedOut: false,
        results: [
          {
            id: '1',
            rankScore: 0.7,
            thread: { threadTitle: 'Algebra Progression' },
          },
        ],
      };

      const result = formatSearchResults('threads', mockResult, 'algebra');

      expect(result.isError).toBeUndefined();
      expect(result.content).toBeDefined();
    });
  });

  describe('sequences scope', () => {
    it('formats a successful sequences result', () => {
      const mockResult = {
        scope: 'sequences' as const,
        total: 1,
        took: 20,
        timedOut: false,
        results: [
          {
            id: '1',
            rankScore: 0.6,
            sequence: { sequenceTitle: 'KS3 Science' },
          },
        ],
      };

      const result = formatSearchResults('sequences', mockResult, 'science');

      expect(result.isError).toBeUndefined();
      expect(result.content).toBeDefined();
    });
  });

  describe('suggest scope', () => {
    it('formats suggestion results', () => {
      const mockResult = {
        suggestions: [
          {
            label: 'photosynthesis',
            scope: 'lessons' as const,
            url: '/lessons/photosynthesis',
            contexts: {},
          },
          {
            label: 'photosynthesis and leaf structure',
            scope: 'lessons' as const,
            url: '/lessons/photosynthesis-leaf',
            contexts: {},
          },
        ],
        cache: { version: 'v1', ttlSeconds: 300 },
      };

      const result = formatSearchResults('suggest', mockResult, 'photo');

      expect(result.isError).toBeUndefined();
      expect(result.content).toBeDefined();
    });
  });

  describe('empty results', () => {
    it('formats empty lessons results with appropriate message', () => {
      const mockResult = {
        scope: 'lessons' as const,
        total: 0,
        took: 10,
        timedOut: false,
        results: [],
      };

      const result = formatSearchResults('lessons', mockResult, 'nonexistent-topic');

      expect(result.isError).toBeUndefined();
      const firstContent = result.content[0];
      if ('text' in firstContent) {
        expect(firstContent.text).toContain('nonexistent-topic');
      }
    });
  });
});
