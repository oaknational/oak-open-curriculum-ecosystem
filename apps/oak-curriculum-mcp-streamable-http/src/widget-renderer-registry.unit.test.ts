/**
 * Unit tests for widget renderer registry.
 *
 * Tests the tool name to renderer mapping logic.
 * These are pure function tests with no IO or mocks.
 *
 * Renderers are parked for the current release — all tools
 * show the neutral shell. Tests verify the parked state.
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
  it('returns undefined for all tools (renderers parked for current release)', () => {
    expect(getRendererIdForTool('search')).toBeUndefined();
    expect(getRendererIdForTool('browse-curriculum')).toBeUndefined();
    expect(getRendererIdForTool('explore-topic')).toBeUndefined();
    expect(getRendererIdForTool('get-lessons-quiz')).toBeUndefined();
    expect(getRendererIdForTool('unknown-tool')).toBeUndefined();
    expect(getRendererIdForTool('')).toBeUndefined();
  });
});

describe('TOOL_RENDERER_MAP', () => {
  it('is empty (renderers parked for current release)', () => {
    const keys = [];
    for (const key in TOOL_RENDERER_MAP) {
      keys.push(key);
    }
    expect(keys).toStrictEqual([]);
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
