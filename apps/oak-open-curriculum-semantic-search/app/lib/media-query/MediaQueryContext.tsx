/**
 * Media Query Context Provider
 *
 * Provides dependency injection for the browser's matchMedia API,
 * enabling proper testability without global state mutation.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
 */

'use client';

import { createContext, useContext, useMemo, type ReactNode, type ReactElement } from 'react';

/**
 * Interface for the media query API.
 * Abstracts the browser's matchMedia function to enable dependency injection.
 */
export interface MediaQueryAPI {
  /**
   * Query media features and get a MediaQueryList object.
   *
   * @param query - CSS media query string (e.g., "(min-width: 768px)")
   * @returns MediaQueryList object with matches property and event listeners
   */
  matchMedia(query: string): MediaQueryList;
}

const MediaQueryContext = createContext<MediaQueryAPI | null>(null);

/**
 * Provider component that wraps the browser's matchMedia API.
 * Includes SSR fallback that returns non-matching MediaQueryList.
 *
 * @example
 * ```tsx
 * <MediaQueryProvider>
 *   <App />
 * </MediaQueryProvider>
 * ```
 */
export function MediaQueryProvider({ children }: { children: ReactNode }): ReactElement {
  const api: MediaQueryAPI = useMemo(
    () => ({
      matchMedia: (query: string): MediaQueryList => {
        // SSR guard: window.matchMedia not available during server-side rendering
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
          // Return a mock MediaQueryList that never matches
          // This ensures consistent behaviour during SSR and hydration
          const mockMql: MediaQueryList = {
            matches: false,
            media: query,
            onchange: null,
            addEventListener: () => undefined,
            removeEventListener: () => undefined,
            addListener: () => undefined,
            removeListener: () => undefined,
            dispatchEvent: () => true,
          };
          return mockMql;
        }
        return window.matchMedia(query);
      },
    }),
    [],
  );

  return <MediaQueryContext.Provider value={api}>{children}</MediaQueryContext.Provider>;
}

/**
 * Hook to access the media query API.
 * Must be used within a MediaQueryProvider.
 *
 * @throws Error if used outside MediaQueryProvider
 * @returns MediaQueryAPI instance for querying media features
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { matchMedia } = useMediaQuery();
 *   const media = matchMedia('(min-width: 768px)');
 *   return <div>Desktop: {media.matches ? 'Yes' : 'No'}</div>;
 * }
 * ```
 */
export function useMediaQuery(): MediaQueryAPI {
  const context = useContext(MediaQueryContext);
  if (!context) {
    throw new Error('useMediaQuery must be used within MediaQueryProvider');
  }
  return context;
}

// Export the context for testing purposes
export { MediaQueryContext };
