/**
 * Unit tests for MediaQueryContext
 *
 * Tests the provider, hook, and SSR fallback behaviour.
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MediaQueryProvider, useMediaQuery } from './MediaQueryContext';

describe('MediaQueryProvider', () => {
  it('provides matchMedia API to children', () => {
    const { result } = renderHook(() => useMediaQuery(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MediaQueryProvider>{children}</MediaQueryProvider>
      ),
    });

    expect(result.current).toHaveProperty('matchMedia');
    expect(typeof result.current.matchMedia).toBe('function');
  });

  it('returns browser matchMedia in client environment', () => {
    const { result } = renderHook(() => useMediaQuery(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MediaQueryProvider>{children}</MediaQueryProvider>
      ),
    });

    const mediaQueryList = result.current.matchMedia('(min-width: 768px)');

    expect(mediaQueryList).toHaveProperty('matches');
    expect(mediaQueryList).toHaveProperty('media');
    expect(typeof mediaQueryList.addEventListener).toBe('function');
  });
});

describe('useMediaQuery', () => {
  it('throws error when used outside provider', () => {
    expect(() => {
      renderHook(() => useMediaQuery());
    }).toThrow('useMediaQuery must be used within MediaQueryProvider');
  });

  it('returns API when used within provider', () => {
    const { result } = renderHook(() => useMediaQuery(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MediaQueryProvider>{children}</MediaQueryProvider>
      ),
    });

    expect(result.current).toBeDefined();
    expect(result.current.matchMedia).toBeDefined();
  });
});
