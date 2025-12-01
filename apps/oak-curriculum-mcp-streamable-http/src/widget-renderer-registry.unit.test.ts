/**
 * Unit tests for widget renderer registry.
 *
 * Tests the tool name → renderer mapping logic.
 * These are pure function tests with no IO or mocks.
 *
 * @see widget-renderer-registry.ts
 */

import { describe, expect, it } from 'vitest';

import {
  getRendererIdForTool,
  TOOL_RENDERER_MAP,
  RENDERER_IDS,
} from './widget-renderer-registry.js';

describe('getRendererIdForTool', () => {
  describe('quiz tools', () => {
    it('returns "quiz" for get-lessons-quiz', () => {
      expect(getRendererIdForTool('get-lessons-quiz')).toBe('quiz');
    });

    it('returns "quiz" for get-key-stages-subject-questions', () => {
      expect(getRendererIdForTool('get-key-stages-subject-questions')).toBe('quiz');
    });

    it('returns "quiz" for get-sequences-questions', () => {
      expect(getRendererIdForTool('get-sequences-questions')).toBe('quiz');
    });
  });

  describe('entity summary tools', () => {
    it('returns "entitySummary" for get-lessons-summary', () => {
      expect(getRendererIdForTool('get-lessons-summary')).toBe('entitySummary');
    });

    it('returns "entitySummary" for get-units-summary', () => {
      expect(getRendererIdForTool('get-units-summary')).toBe('entitySummary');
    });

    it('returns "entitySummary" for get-subject-detail', () => {
      expect(getRendererIdForTool('get-subject-detail')).toBe('entitySummary');
    });
  });

  describe('entity list tools', () => {
    it('returns "entityList" for get-key-stages', () => {
      expect(getRendererIdForTool('get-key-stages')).toBe('entityList');
    });

    it('returns "entityList" for get-subjects', () => {
      expect(getRendererIdForTool('get-subjects')).toBe('entityList');
    });

    it('returns "entityList" for get-key-stages-subject-lessons', () => {
      expect(getRendererIdForTool('get-key-stages-subject-lessons')).toBe('entityList');
    });

    it('returns "entityList" for get-key-stages-subject-units', () => {
      expect(getRendererIdForTool('get-key-stages-subject-units')).toBe('entityList');
    });

    it('returns "entityList" for get-sequences-units', () => {
      expect(getRendererIdForTool('get-sequences-units')).toBe('entityList');
    });

    it('returns "entityList" for get-threads', () => {
      expect(getRendererIdForTool('get-threads')).toBe('entityList');
    });

    it('returns "entityList" for get-threads-units', () => {
      expect(getRendererIdForTool('get-threads-units')).toBe('entityList');
    });

    it('returns "entityList" for get-subjects-key-stages', () => {
      expect(getRendererIdForTool('get-subjects-key-stages')).toBe('entityList');
    });

    it('returns "entityList" for get-subjects-years', () => {
      expect(getRendererIdForTool('get-subjects-years')).toBe('entityList');
    });

    it('returns "entityList" for get-subjects-sequences', () => {
      expect(getRendererIdForTool('get-subjects-sequences')).toBe('entityList');
    });
  });

  describe('transcript tool', () => {
    it('returns "transcript" for get-lessons-transcript', () => {
      expect(getRendererIdForTool('get-lessons-transcript')).toBe('transcript');
    });
  });

  describe('assets tools', () => {
    it('returns "assets" for get-lessons-assets', () => {
      expect(getRendererIdForTool('get-lessons-assets')).toBe('assets');
    });

    it('returns "assets" for get-lessons-assets-by-type', () => {
      expect(getRendererIdForTool('get-lessons-assets-by-type')).toBe('assets');
    });

    it('returns "assets" for get-key-stages-subject-assets', () => {
      expect(getRendererIdForTool('get-key-stages-subject-assets')).toBe('assets');
    });

    it('returns "assets" for get-sequences-assets', () => {
      expect(getRendererIdForTool('get-sequences-assets')).toBe('assets');
    });
  });

  describe('changelog tools', () => {
    it('returns "changelog" for get-changelog', () => {
      expect(getRendererIdForTool('get-changelog')).toBe('changelog');
    });

    it('returns "changelog" for get-changelog-latest', () => {
      expect(getRendererIdForTool('get-changelog-latest')).toBe('changelog');
    });
  });

  describe('rate limit tool', () => {
    it('returns "rateLimit" for get-rate-limit', () => {
      expect(getRendererIdForTool('get-rate-limit')).toBe('rateLimit');
    });
  });

  describe('existing renderers', () => {
    it('returns "help" for get-help', () => {
      expect(getRendererIdForTool('get-help')).toBe('help');
    });

    it('returns "search" for search', () => {
      expect(getRendererIdForTool('search')).toBe('search');
    });

    it('returns "search" for get-search-lessons', () => {
      expect(getRendererIdForTool('get-search-lessons')).toBe('search');
    });

    it('returns "search" for get-search-transcripts', () => {
      expect(getRendererIdForTool('get-search-transcripts')).toBe('search');
    });

    it('returns "fetch" for fetch', () => {
      expect(getRendererIdForTool('fetch')).toBe('fetch');
    });
  });

  describe('unknown tools', () => {
    it('returns undefined for unknown tool names', () => {
      expect(getRendererIdForTool('unknown-tool')).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
      expect(getRendererIdForTool('')).toBeUndefined();
    });
  });
});

describe('TOOL_RENDERER_MAP', () => {
  it('is a readonly object', () => {
    expect(typeof TOOL_RENDERER_MAP).toBe('object');
  });

  it('maps all 26 tools to renderer IDs', () => {
    const mappedTools = Object.keys(TOOL_RENDERER_MAP);
    // 26 tools from the API, plus search and fetch helper tools
    expect(mappedTools.length).toBeGreaterThanOrEqual(26);
  });

  it('only uses valid renderer IDs', () => {
    const validIds = new Set(RENDERER_IDS);
    for (const rendererId of Object.values(TOOL_RENDERER_MAP)) {
      expect(validIds.has(rendererId)).toBe(true);
    }
  });
});

describe('RENDERER_IDS', () => {
  it('contains all expected renderer IDs', () => {
    expect(RENDERER_IDS).toContain('quiz');
    expect(RENDERER_IDS).toContain('entitySummary');
    expect(RENDERER_IDS).toContain('entityList');
    expect(RENDERER_IDS).toContain('transcript');
    expect(RENDERER_IDS).toContain('assets');
    expect(RENDERER_IDS).toContain('changelog');
    expect(RENDERER_IDS).toContain('rateLimit');
    expect(RENDERER_IDS).toContain('help');
    expect(RENDERER_IDS).toContain('search');
    expect(RENDERER_IDS).toContain('fetch');
  });
});
