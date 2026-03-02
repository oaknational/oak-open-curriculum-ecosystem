/**
 * Unit tests for field-extraction helpers.
 *
 * These helpers are pure JS functions (string templates) that
 * extract title, subject, key stage, and URL from search result
 * objects across all four scopes plus suggest.
 *
 * @see ./helpers.ts
 */

import { describe, expect, it } from 'vitest';

import { WIDGET_HELPERS } from './helpers.js';

interface HelperFunctions {
  readonly extractTitle: (result: unknown, scope: string) => string;
  readonly extractSubject: (result: unknown, scope: string) => string;
  readonly extractKeyStage: (result: unknown, scope: string) => string;
  readonly extractUrl: (result: unknown, scope: string) => string;
  readonly scopeObj: (result: unknown, scope: string) => unknown;
  readonly esc: (s: unknown) => string;
}

interface HasHelperKeys {
  extractTitle: unknown;
  extractSubject: unknown;
  extractKeyStage: unknown;
  extractUrl: unknown;
  scopeObj: unknown;
  esc: unknown;
}

function hasRequiredKeys(obj: object): obj is HasHelperKeys {
  return (
    'extractTitle' in obj &&
    'extractSubject' in obj &&
    'extractKeyStage' in obj &&
    'extractUrl' in obj &&
    'scopeObj' in obj &&
    'esc' in obj
  );
}

function allAreFunctions(obj: HasHelperKeys): obj is HelperFunctions {
  return (
    typeof obj.extractTitle === 'function' &&
    typeof obj.extractSubject === 'function' &&
    typeof obj.extractKeyStage === 'function' &&
    typeof obj.extractUrl === 'function' &&
    typeof obj.scopeObj === 'function' &&
    typeof obj.esc === 'function'
  );
}

function isHelperFunctions(value: unknown): value is HelperFunctions {
  if (!value || typeof value !== 'object') {
    return false;
  }
  if (!hasRequiredKeys(value)) {
    return false;
  }
  return allAreFunctions(value);
}

function createHelperHarness(): HelperFunctions {
  const factory = new Function(
    `${WIDGET_HELPERS}\nreturn { extractTitle, extractSubject, extractKeyStage, extractUrl, scopeObj, esc };`,
  );
  const fns: unknown = factory();
  if (!isHelperFunctions(fns)) {
    throw new Error('Helper harness failed — expected extraction functions');
  }
  return fns;
}

describe('extractTitle', () => {
  const { extractTitle } = createHelperHarness();

  it('extracts lesson_title for lessons scope', () => {
    const result = { lesson: { lesson_title: 'Photosynthesis' } };
    expect(extractTitle(result, 'lessons')).toBe('Photosynthesis');
  });

  it('falls back to lesson_slug when lesson_title is absent', () => {
    const result = { lesson: { lesson_slug: 'photosynthesis-intro' } };
    expect(extractTitle(result, 'lessons')).toBe('photosynthesis-intro');
  });

  it('extracts unit_title for units scope', () => {
    const result = { unit: { unit_title: 'Plant Biology' } };
    expect(extractTitle(result, 'units')).toBe('Plant Biology');
  });

  it('extracts thread_title for threads scope', () => {
    const result = { thread: { thread_title: 'Evolution' } };
    expect(extractTitle(result, 'threads')).toBe('Evolution');
  });

  it('extracts sequence_title for sequences scope', () => {
    const result = { sequence: { sequence_title: 'Biology KS4' } };
    expect(extractTitle(result, 'sequences')).toBe('Biology KS4');
  });

  it('returns "Untitled" when nested object is null', () => {
    expect(extractTitle({ lesson: null }, 'lessons')).toBe('Untitled');
    expect(extractTitle({ unit: null }, 'units')).toBe('Untitled');
  });

  it('returns "Untitled" when nested object is missing', () => {
    expect(extractTitle({}, 'lessons')).toBe('Untitled');
    expect(extractTitle({}, 'units')).toBe('Untitled');
  });
});

describe('extractSubject', () => {
  const { extractSubject } = createHelperHarness();

  it('extracts subject_title for lessons scope, falls back to subject_slug', () => {
    expect(extractSubject({ lesson: { subject_title: 'Science' } }, 'lessons')).toBe('Science');
    expect(extractSubject({ lesson: { subject_slug: 'science' } }, 'lessons')).toBe('science');
  });

  it('extracts subject_title for units scope', () => {
    expect(extractSubject({ unit: { subject_title: 'Biology' } }, 'units')).toBe('Biology');
  });

  it('joins subject_slugs array for threads scope', () => {
    const result = { thread: { subject_slugs: ['biology', 'science'] } };
    expect(extractSubject(result, 'threads')).toBe('biology / science');
  });

  it('returns single subject_slug for threads with one entry', () => {
    const result = { thread: { subject_slugs: ['physics'] } };
    expect(extractSubject(result, 'threads')).toBe('physics');
  });

  it('extracts subject_title for sequences scope', () => {
    expect(extractSubject({ sequence: { subject_title: 'Biology' } }, 'sequences')).toBe('Biology');
  });

  it('returns empty string when subject is absent', () => {
    expect(extractSubject({ lesson: {} }, 'lessons')).toBe('');
    expect(extractSubject({ thread: {} }, 'threads')).toBe('');
  });

  it('returns empty string when nested object is null', () => {
    expect(extractSubject({ unit: null }, 'units')).toBe('');
  });
});

describe('extractKeyStage', () => {
  const { extractKeyStage } = createHelperHarness();

  it('extracts key_stage_title for lessons scope, falls back to key_stage', () => {
    expect(extractKeyStage({ lesson: { key_stage_title: 'KS3' } }, 'lessons')).toBe('KS3');
    expect(extractKeyStage({ lesson: { key_stage: 'ks3' } }, 'lessons')).toBe('ks3');
  });

  it('extracts key_stage_title for units scope', () => {
    expect(extractKeyStage({ unit: { key_stage_title: 'KS4' } }, 'units')).toBe('KS4');
  });

  it('returns empty string for threads (no key stage field)', () => {
    expect(extractKeyStage({ thread: { thread_title: 'Evolution' } }, 'threads')).toBe('');
  });

  it('joins key_stages array for sequences scope', () => {
    const result = { sequence: { key_stages: ['ks3', 'ks4'] } };
    expect(extractKeyStage(result, 'sequences')).toBe('ks3 / ks4');
  });

  it('returns empty string when key stage is absent', () => {
    expect(extractKeyStage({ lesson: {} }, 'lessons')).toBe('');
    expect(extractKeyStage({ sequence: {} }, 'sequences')).toBe('');
  });

  it('returns empty string when nested object is null', () => {
    expect(extractKeyStage({ unit: null }, 'units')).toBe('');
  });
});

describe('extractUrl', () => {
  const { extractUrl } = createHelperHarness();

  it('extracts lesson_url for lessons scope', () => {
    const result = { lesson: { lesson_url: 'https://example.com/lesson' } };
    expect(extractUrl(result, 'lessons')).toBe('https://example.com/lesson');
  });

  it('extracts unit_url for units scope', () => {
    const result = { unit: { unit_url: 'https://example.com/unit' } };
    expect(extractUrl(result, 'units')).toBe('https://example.com/unit');
  });

  it('extracts thread_url for threads scope', () => {
    const result = { thread: { thread_url: 'https://example.com/thread' } };
    expect(extractUrl(result, 'threads')).toBe('https://example.com/thread');
  });

  it('extracts sequence_url for sequences scope', () => {
    const result = { sequence: { sequence_url: 'https://example.com/sequence' } };
    expect(extractUrl(result, 'sequences')).toBe('https://example.com/sequence');
  });

  it('returns empty string when URL is absent', () => {
    expect(extractUrl({ lesson: {} }, 'lessons')).toBe('');
    expect(extractUrl({ unit: null }, 'units')).toBe('');
    expect(extractUrl({}, 'threads')).toBe('');
  });
});

describe('scopeObj', () => {
  const { scopeObj } = createHelperHarness();

  it('returns null for unknown scope instead of defaulting to sequence', () => {
    const result = { sequence: { sequence_title: 'Should Not Match' } };
    expect(scopeObj(result, 'unknown-scope')).toBeNull();
  });

  it('returns null for "results" scope (not a real scope)', () => {
    const result = { sequence: { sequence_title: 'Should Not Match' } };
    expect(scopeObj(result, 'results')).toBeNull();
  });

  it('returns the nested object for known scopes', () => {
    const lesson = { lesson_title: 'Test' };
    expect(scopeObj({ lesson }, 'lessons')).toBe(lesson);

    const unit = { unit_title: 'Test' };
    expect(scopeObj({ unit }, 'units')).toBe(unit);

    const thread = { thread_title: 'Test' };
    expect(scopeObj({ thread }, 'threads')).toBe(thread);

    const sequence = { sequence_title: 'Test' };
    expect(scopeObj({ sequence }, 'sequences')).toBe(sequence);
  });
});

describe('extractTitle with unknown scope', () => {
  const { extractTitle } = createHelperHarness();

  it('returns "Untitled" for unknown scope', () => {
    expect(extractTitle({ sequence: { sequence_title: 'Wrong' } }, 'unknown')).toBe('Untitled');
  });

  it('returns "Untitled" for "results" scope', () => {
    expect(extractTitle({ sequence: { sequence_title: 'Wrong' } }, 'results')).toBe('Untitled');
  });
});

describe('esc', () => {
  const { esc } = createHelperHarness();

  it('escapes single quotes to prevent XSS in onclick handlers', () => {
    expect(esc("it's")).toBe('it&#39;s');
  });

  it('escapes all HTML entities', () => {
    expect(esc('<script>"alert(\'xss\')"</script>')).toBe(
      '&lt;script&gt;&quot;alert(&#39;xss&#39;)&quot;&lt;/script&gt;',
    );
  });
});
