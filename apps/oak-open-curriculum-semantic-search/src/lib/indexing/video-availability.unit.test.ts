/**
 * Unit tests for video availability map.
 *
 * These tests verify the pure function that builds a video availability map
 * from subject assets data. No mocks, no I/O.
 */
import { describe, it, expect } from 'vitest';
import { buildVideoAvailabilityMapFromAssets } from './video-availability';
import type { SubjectAssetEntry } from '../../adapters/oak-adapter-types';

describe('buildVideoAvailabilityMapFromAssets', () => {
  it('returns empty map for empty assets array', () => {
    const result = buildVideoAvailabilityMapFromAssets([]);

    expect(result.totalLessons).toBe(0);
    expect(result.lessonsWithVideo).toBe(0);
    expect(result.lessonSlugs.size).toBe(0);
    expect(result.hasVideo('any-lesson')).toBe(false);
  });

  it('correctly identifies lessons with videos', () => {
    const assets: readonly SubjectAssetEntry[] = [
      {
        lessonSlug: 'lesson-with-video',
        lessonTitle: 'Lesson With Video',
        assets: [
          { type: 'video', label: 'Video', url: '/video' },
          { type: 'worksheet', label: 'Worksheet', url: '/worksheet' },
        ],
      },
      {
        lessonSlug: 'lesson-without-video',
        lessonTitle: 'Lesson Without Video',
        assets: [{ type: 'worksheet', label: 'Worksheet', url: '/worksheet' }],
      },
    ];

    const result = buildVideoAvailabilityMapFromAssets(assets);

    expect(result.totalLessons).toBe(2);
    expect(result.lessonsWithVideo).toBe(1);
    expect(result.hasVideo('lesson-with-video')).toBe(true);
    expect(result.hasVideo('lesson-without-video')).toBe(false);
  });

  it('returns false for unknown lessons', () => {
    const assets: readonly SubjectAssetEntry[] = [
      {
        lessonSlug: 'known-lesson',
        lessonTitle: 'Known Lesson',
        assets: [{ type: 'video', label: 'Video', url: '/video' }],
      },
    ];

    const result = buildVideoAvailabilityMapFromAssets(assets);

    expect(result.hasVideo('unknown-lesson')).toBe(false);
  });

  it('collects all lesson slugs in lessonSlugs set', () => {
    const assets: readonly SubjectAssetEntry[] = [
      {
        lessonSlug: 'lesson-a',
        lessonTitle: 'Lesson A',
        assets: [{ type: 'video', label: 'Video', url: '/video' }],
      },
      {
        lessonSlug: 'lesson-b',
        lessonTitle: 'Lesson B',
        assets: [{ type: 'worksheet', label: 'Worksheet', url: '/worksheet' }],
      },
      {
        lessonSlug: 'lesson-c',
        lessonTitle: 'Lesson C',
        assets: [],
      },
    ];

    const result = buildVideoAvailabilityMapFromAssets(assets);

    expect(result.lessonSlugs.has('lesson-a')).toBe(true);
    expect(result.lessonSlugs.has('lesson-b')).toBe(true);
    expect(result.lessonSlugs.has('lesson-c')).toBe(true);
    expect(result.totalLessons).toBe(3);
  });

  it('handles lessons with empty assets array', () => {
    const assets: readonly SubjectAssetEntry[] = [
      {
        lessonSlug: 'lesson-with-no-assets',
        lessonTitle: 'Lesson With No Assets',
        assets: [],
      },
    ];

    const result = buildVideoAvailabilityMapFromAssets(assets);

    expect(result.totalLessons).toBe(1);
    expect(result.lessonsWithVideo).toBe(0);
    expect(result.hasVideo('lesson-with-no-assets')).toBe(false);
    expect(result.lessonSlugs.has('lesson-with-no-assets')).toBe(true);
  });

  it('counts multiple video-having lessons correctly', () => {
    const assets: readonly SubjectAssetEntry[] = [
      {
        lessonSlug: 'lesson-1',
        lessonTitle: 'Lesson 1',
        assets: [{ type: 'video', label: 'Video', url: '/video' }],
      },
      {
        lessonSlug: 'lesson-2',
        lessonTitle: 'Lesson 2',
        assets: [{ type: 'video', label: 'Video', url: '/video' }],
      },
      {
        lessonSlug: 'lesson-3',
        lessonTitle: 'Lesson 3',
        assets: [{ type: 'worksheet', label: 'Worksheet', url: '/worksheet' }],
      },
    ];

    const result = buildVideoAvailabilityMapFromAssets(assets);

    expect(result.lessonsWithVideo).toBe(2);
    expect(result.totalLessons).toBe(3);
  });
});
