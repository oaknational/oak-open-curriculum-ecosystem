/**
 * Renderer test harness for integration contract tests.
 *
 * Evaluates concatenated helper + renderer JS strings in a
 * sandboxed context (via `new Function()`) and returns callable
 * renderer functions that accept data and return HTML strings.
 *
 * @example
 * ```typescript
 * const { renderSearch } = createRendererHarness();
 * const html = renderSearch({ scope: 'lessons', total: 5, results: [...] });
 * expect(html).toContain('Search lessons');
 * ```
 *
 * @see ../../src/widget-renderers/helpers.ts
 * @see ../../src/widget-renderers/search-renderer.ts
 * @see ../../src/widget-renderers/browse-renderer.ts
 * @see ../../src/widget-renderers/explore-renderer.ts
 */

import { WIDGET_HELPERS } from '../../src/widget-renderers/helpers.js';
import { SEARCH_RENDERER } from '../../src/widget-renderers/search-renderer.js';
import { BROWSE_RENDERER } from '../../src/widget-renderers/browse-renderer.js';
import { EXPLORE_RENDERER } from '../../src/widget-renderers/explore-renderer.js';

export interface RendererFunctions {
  readonly renderSearch: (data: unknown) => string;
  readonly renderBrowse: (data: unknown) => string;
  readonly renderExplore: (data: unknown) => string;
  readonly esc: (s: unknown) => string;
}

interface HasRendererKeys {
  renderSearch: unknown;
  renderBrowse: unknown;
  renderExplore: unknown;
  esc: unknown;
}

function hasRendererKeys(value: unknown): value is HasRendererKeys {
  return (
    !!value &&
    typeof value === 'object' &&
    'renderSearch' in value &&
    'renderBrowse' in value &&
    'renderExplore' in value &&
    'esc' in value
  );
}

function isRendererFunctions(value: unknown): value is RendererFunctions {
  if (!hasRendererKeys(value)) {
    return false;
  }
  return (
    typeof value.renderSearch === 'function' &&
    typeof value.renderBrowse === 'function' &&
    typeof value.renderExplore === 'function' &&
    typeof value.esc === 'function'
  );
}

/**
 * Creates a sandboxed harness that evaluates the widget renderer
 * JS strings and returns callable functions.
 *
 * @returns An object containing callable renderer functions
 * @throws If the JS strings contain syntax errors
 */
export function createRendererHarness(): RendererFunctions {
  const openOnOakWebsite = 'function openOnOakWebsite() {}';
  const combined = [
    openOnOakWebsite,
    WIDGET_HELPERS,
    SEARCH_RENDERER,
    BROWSE_RENDERER,
    EXPLORE_RENDERER,
  ].join('\n\n');
  const factory = new Function(
    `${combined}\nreturn { renderSearch, renderBrowse, renderExplore, esc };`,
  );
  const fns: unknown = factory();
  if (!isRendererFunctions(fns)) {
    throw new Error('Renderer harness failed — expected all renderer functions');
  }
  return fns;
}
