/**
 * Unit tests for widget renderer registry.
 *
 * Tests the tool name to renderer mapping logic.
 * These are pure function tests with no IO or mocks.
 *
 * After Track 1a, only the search renderer remains.
 * Browse and explore entries are added in Phases 2-3
 * when their renderer functions exist.
 *
 * @see widget-renderer-registry.ts
 */

import { describe, expect, it } from 'vitest';

import {
  getRendererIdForTool,
  isToolWithRenderer,
  TOOL_RENDERER_MAP,
  RENDERER_IDS,
} from './widget-renderer-registry.js';
import { WIDGET_SCRIPT } from './widget-script.js';

describe('getRendererIdForTool', () => {
  describe('search tool', () => {
    it('returns "search" for search', () => {
      expect(getRendererIdForTool('search')).toBe('search');
    });
  });

  describe('browse-curriculum tool', () => {
    it('returns "browse" for browse-curriculum', () => {
      expect(getRendererIdForTool('browse-curriculum')).toBe('browse');
    });
  });

  describe('explore-topic tool', () => {
    it('returns "explore" for explore-topic', () => {
      expect(getRendererIdForTool('explore-topic')).toBe('explore');
    });
  });

  describe('deleted tools return undefined', () => {
    it('returns undefined for get-lessons-quiz (deleted renderer)', () => {
      expect(getRendererIdForTool('get-lessons-quiz')).toBeUndefined();
    });

    it('returns undefined for get-help (deleted renderer)', () => {
      expect(getRendererIdForTool('get-help')).toBeUndefined();
    });

    it('returns undefined for fetch (deleted renderer)', () => {
      expect(getRendererIdForTool('fetch')).toBeUndefined();
    });

    it('returns undefined for get-ontology (deleted renderer)', () => {
      expect(getRendererIdForTool('get-ontology')).toBeUndefined();
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
  it('contains entries for all search-family tools', () => {
    const keys = [];
    for (const key in TOOL_RENDERER_MAP) {
      keys.push(key);
    }
    expect(keys).toStrictEqual(['search', 'browse-curriculum', 'explore-topic']);
  });

  it('maps search to the search renderer', () => {
    expect(TOOL_RENDERER_MAP.search).toBe('search');
  });

  it('maps browse-curriculum to the browse renderer', () => {
    expect(TOOL_RENDERER_MAP['browse-curriculum']).toBe('browse');
  });

  it('maps explore-topic to the explore renderer', () => {
    expect(TOOL_RENDERER_MAP['explore-topic']).toBe('explore');
  });
});

describe('RENDERER_IDS', () => {
  it('contains all renderer IDs', () => {
    expect(RENDERER_IDS).toStrictEqual(['search', 'browse', 'explore']);
  });
});

describe('widget script parse check', () => {
  it('concatenated widget JS parses without error', () => {
    expect(() => new Function(WIDGET_SCRIPT)).not.toThrow();
  });
});

describe('four-way renderer sync', () => {
  const stubGlobals = [
    'const window = { openai: null };',
    'const document = { getElementById: () => null, querySelector: () => null, documentElement: { scrollTop: 0, style: { setProperty: () => {} } }, addEventListener: () => {} };',
    'window.addEventListener = () => {};',
  ].join('\n');

  it('every TOOL_RENDERER_MAP value is a valid RENDERER_ID', () => {
    for (const key in TOOL_RENDERER_MAP) {
      if (isToolWithRenderer(key)) {
        const rendererId = TOOL_RENDERER_MAP[key];
        expect(RENDERER_IDS).toContain(rendererId);
      }
    }
  });

  it('every RENDERER_ID has a corresponding function in RENDERERS', () => {
    const factory = new Function(`${stubGlobals}\n${WIDGET_SCRIPT}\nreturn RENDERERS;`);
    const renderers: unknown = factory();

    if (typeof renderers !== 'object' || renderers === null) {
      expect.fail('RENDERERS must be a non-null object');
    }

    for (const id of RENDERER_IDS) {
      expect(id in renderers).toBe(true);
    }
  });

  it('every RENDERER_ID has a render function in the widget JS', () => {
    for (const id of RENDERER_IDS) {
      const fnName = `render${id.charAt(0).toUpperCase()}${id.slice(1)}`;
      expect(WIDGET_SCRIPT).toContain(`function ${fnName}(`);
    }
  });
});
