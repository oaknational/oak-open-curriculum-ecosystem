/**
 * Test helpers for MediaQueryContext
 *
 * Provides utilities for testing components that use media queries
 * without mutating global state.
 */

import { render, type RenderResult } from '@testing-library/react';
import { vi } from 'vitest';
import type { ReactElement } from 'react';
import { MediaQueryContext, type MediaQueryAPI } from './MediaQueryContext';

/**
 * Create a mock MediaQueryAPI for testing.
 *
 * @param matches - Whether media queries should match by default
 * @returns Mock MediaQueryAPI instance
 *
 * @example
 * ```tsx
 * const mockAPI = createMockMediaQueryAPI(true);
 * render(
 *   <MediaQueryContext.Provider value={mockAPI}>
 *     <Component />
 *   </MediaQueryContext.Provider>
 * );
 * ```
 */
export function createMockMediaQueryAPI(matches: boolean): MediaQueryAPI {
  const matchMedia: MediaQueryAPI['matchMedia'] = vi.fn((query: string): MediaQueryList => {
    const result: MediaQueryList = {
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    };
    return result;
  });

  return { matchMedia };
}

/**
 * Render a component with a mock MediaQueryProvider.
 *
 * @param ui - React element to render
 * @param options - Options object
 * @param options.matches - Whether media queries should match (default: false)
 * @returns Render result with mockAPI instance
 *
 * @example
 * ```tsx
 * const { mockAPI } = renderWithMediaQuery(<MyComponent />, { matches: true });
 * expect(mockAPI.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
 * ```
 */
export function renderWithMediaQuery(
  ui: ReactElement,
  { matches = false }: { matches?: boolean } = {},
): RenderResult & { mockAPI: MediaQueryAPI } {
  const mockAPI = createMockMediaQueryAPI(matches);

  return {
    ...render(<MediaQueryContext.Provider value={mockAPI}>{ui}</MediaQueryContext.Provider>),
    mockAPI,
  };
}
