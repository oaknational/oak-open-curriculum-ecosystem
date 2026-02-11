/**
 * Unit tests for transcript cache categorization types.
 *
 * These tests specify the behavior of the transcript cache types
 * and are written FIRST per TDD methodology.
 *
 * @see ADR-092 Transcript Cache Categorization Strategy
 */

import { describe, it, expect } from 'vitest';
import {
  isTranscriptCacheEntry,
  serializeTranscriptCacheEntry,
  deserializeTranscriptCacheEntry,
  type TranscriptCacheEntry,
} from './transcript-cache-types';

describe('TranscriptCacheEntry type guard', () => {
  describe('isTranscriptCacheEntry', () => {
    it('returns true for available status with transcript and vtt', () => {
      const entry: TranscriptCacheEntry = {
        status: 'available',
        transcript: "Welcome to today's lesson on fractions.",
        vtt: 'WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nWelcome...',
      };
      expect(isTranscriptCacheEntry(entry)).toBe(true);
    });

    it('returns true for no_video status', () => {
      const entry: TranscriptCacheEntry = { status: 'no_video' };
      expect(isTranscriptCacheEntry(entry)).toBe(true);
    });

    it('returns true for not_found status', () => {
      const entry: TranscriptCacheEntry = { status: 'not_found' };
      expect(isTranscriptCacheEntry(entry)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isTranscriptCacheEntry(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isTranscriptCacheEntry(undefined)).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(isTranscriptCacheEntry({})).toBe(false);
    });

    it('returns false for object without status', () => {
      expect(isTranscriptCacheEntry({ transcript: 'hello' })).toBe(false);
    });

    it('returns false for invalid status value', () => {
      expect(isTranscriptCacheEntry({ status: 'invalid' })).toBe(false);
    });

    it('returns false for available status missing transcript', () => {
      expect(isTranscriptCacheEntry({ status: 'available', vtt: 'WEBVTT' })).toBe(false);
    });

    it('returns false for available status missing vtt', () => {
      expect(isTranscriptCacheEntry({ status: 'available', transcript: 'hello' })).toBe(false);
    });

    it('returns false for string value', () => {
      expect(isTranscriptCacheEntry('__NOT_FOUND__')).toBe(false);
    });

    it('returns false for array', () => {
      expect(isTranscriptCacheEntry([{ status: 'available' }])).toBe(false);
    });
  });
});

describe('serializeTranscriptCacheEntry', () => {
  it('serializes available entry to valid JSON', () => {
    const entry: TranscriptCacheEntry = {
      status: 'available',
      transcript: 'Hello world',
      vtt: 'WEBVTT',
    };
    const json = serializeTranscriptCacheEntry(entry);
    const parsed: unknown = JSON.parse(json);
    expect(parsed).toEqual(entry);
  });

  it('serializes no_video entry to valid JSON', () => {
    const entry: TranscriptCacheEntry = { status: 'no_video' };
    const json = serializeTranscriptCacheEntry(entry);
    const parsed: unknown = JSON.parse(json);
    expect(parsed).toEqual(entry);
  });

  it('serializes not_found entry to valid JSON', () => {
    const entry: TranscriptCacheEntry = { status: 'not_found' };
    const json = serializeTranscriptCacheEntry(entry);
    const parsed: unknown = JSON.parse(json);
    expect(parsed).toEqual(entry);
  });

  it('handles transcript with special characters', () => {
    const entry: TranscriptCacheEntry = {
      status: 'available',
      transcript: 'He said "hello" and left.\nNew line here.',
      vtt: 'WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nHello',
    };
    const json = serializeTranscriptCacheEntry(entry);
    const parsed: unknown = JSON.parse(json);
    expect(parsed).toEqual(entry);
  });
});

describe('deserializeTranscriptCacheEntry', () => {
  describe('valid structured format', () => {
    it('deserializes available entry', () => {
      const json = '{"status":"available","transcript":"Hello","vtt":"WEBVTT"}';
      const result = deserializeTranscriptCacheEntry(json);
      expect(result).toEqual({
        status: 'available',
        transcript: 'Hello',
        vtt: 'WEBVTT',
      });
    });

    it('deserializes no_video entry', () => {
      const json = '{"status":"no_video"}';
      const result = deserializeTranscriptCacheEntry(json);
      expect(result).toEqual({ status: 'no_video' });
    });

    it('deserializes not_found entry', () => {
      const json = '{"status":"not_found"}';
      const result = deserializeTranscriptCacheEntry(json);
      expect(result).toEqual({ status: 'not_found' });
    });
  });

  describe('null handling', () => {
    it('returns null for null input', () => {
      expect(deserializeTranscriptCacheEntry(null)).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(deserializeTranscriptCacheEntry('')).toBeNull();
    });

    it('returns null for invalid JSON', () => {
      expect(deserializeTranscriptCacheEntry('not valid json')).toBeNull();
    });

    it('returns null for valid JSON with invalid structure', () => {
      expect(deserializeTranscriptCacheEntry('{"foo":"bar"}')).toBeNull();
    });

    it('returns null for valid JSON with invalid status', () => {
      expect(deserializeTranscriptCacheEntry('{"status":"invalid"}')).toBeNull();
    });
  });

  describe('roundtrip', () => {
    it('roundtrips available entry', () => {
      const original: TranscriptCacheEntry = {
        status: 'available',
        transcript: 'Test transcript',
        vtt: 'WEBVTT\n\nTest',
      };
      const serialized = serializeTranscriptCacheEntry(original);
      const deserialized = deserializeTranscriptCacheEntry(serialized);
      expect(deserialized).toEqual(original);
    });

    it('roundtrips no_video entry', () => {
      const original: TranscriptCacheEntry = { status: 'no_video' };
      const serialized = serializeTranscriptCacheEntry(original);
      const deserialized = deserializeTranscriptCacheEntry(serialized);
      expect(deserialized).toEqual(original);
    });

    it('roundtrips not_found entry', () => {
      const original: TranscriptCacheEntry = { status: 'not_found' };
      const serialized = serializeTranscriptCacheEntry(original);
      const deserialized = deserializeTranscriptCacheEntry(serialized);
      expect(deserialized).toEqual(original);
    });
  });
});
