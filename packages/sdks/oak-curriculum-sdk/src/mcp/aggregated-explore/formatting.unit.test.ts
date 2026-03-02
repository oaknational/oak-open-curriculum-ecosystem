/**
 * Unit tests for explore-topic result formatting.
 *
 * Tests that formatTopicMap correctly merges multi-index results into
 * a unified topic map with appropriate summaries.
 */

import { describe, it, expect } from 'vitest';
import { formatTopicMap } from './formatting.js';

describe('formatTopicMap', () => {
  it('formats a complete topic map with all scopes succeeding', () => {
    const result = formatTopicMap(
      'volcanos',
      {
        lessons: { ok: true, data: { scope: 'lessons', total: 12, results: [] } },
        units: { ok: true, data: { scope: 'units', total: 3, results: [] } },
        threads: { ok: true, data: { scope: 'threads', total: 2, results: [] } },
      },
      { lessonTotal: 12, unitTotal: 3, threadTotal: 2 },
    );

    expect(result.isError).toBeUndefined();
    expect(result.content).toBeDefined();
    expect(result.content).toHaveLength(2);
  });

  it('includes topic in summary', () => {
    const result = formatTopicMap(
      'volcanos',
      {
        lessons: { ok: true, data: { scope: 'lessons', total: 5, results: [] } },
        units: { ok: true, data: { scope: 'units', total: 1, results: [] } },
        threads: { ok: true, data: { scope: 'threads', total: 0, results: [] } },
      },
      { lessonTotal: 5, unitTotal: 1, threadTotal: 0 },
    );

    const firstContent = result.content[0];
    if ('text' in firstContent) {
      expect(firstContent.text).toContain('volcanos');
    }
  });

  it('handles partial failure gracefully', () => {
    const result = formatTopicMap(
      'volcanos',
      {
        lessons: { ok: true, data: { scope: 'lessons', total: 5, results: [] } },
        units: { ok: false, error: 'ES timeout' },
        threads: { ok: true, data: { scope: 'threads', total: 1, results: [] } },
      },
      { lessonTotal: 5, unitTotal: 0, threadTotal: 1 },
    );

    expect(result.isError).toBeUndefined();
    expect(result.content).toBeDefined();
  });

  it('handles all scopes empty', () => {
    const result = formatTopicMap(
      'nonexistent-topic',
      {
        lessons: { ok: true, data: { scope: 'lessons', total: 0, results: [] } },
        units: { ok: true, data: { scope: 'units', total: 0, results: [] } },
        threads: { ok: true, data: { scope: 'threads', total: 0, results: [] } },
      },
      { lessonTotal: 0, unitTotal: 0, threadTotal: 0 },
    );

    expect(result.content).toBeDefined();
    const firstContent = result.content[0];
    if ('text' in firstContent) {
      expect(firstContent.text).toContain('nonexistent-topic');
    }
  });

  it('includes structuredContent with data from all scopes', () => {
    const result = formatTopicMap(
      'fractions',
      {
        lessons: { ok: true, data: { scope: 'lessons', total: 10, results: [] } },
        units: { ok: true, data: { scope: 'units', total: 2, results: [] } },
        threads: { ok: true, data: { scope: 'threads', total: 1, results: [] } },
      },
      { lessonTotal: 10, unitTotal: 2, threadTotal: 1 },
    );

    expect(result.structuredContent).toBeDefined();
  });
});
