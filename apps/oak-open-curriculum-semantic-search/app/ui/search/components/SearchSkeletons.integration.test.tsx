import { render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { SummarySkeleton } from './SearchSkeletons';
import { createLightTheme } from '../../themes/light';

function renderWithTheme(children: React.ReactNode): void {
  const theme = createLightTheme();
  render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
}

function resolveRgba(hex: string, alpha: number): string {
  const normalised = hex.replace('#', '');
  const red = parseInt(normalised.slice(0, 2), 16);
  const green = parseInt(normalised.slice(2, 4), 16);
  const blue = parseInt(normalised.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function collectStyledCss(): string {
  return Array.from(document.head.querySelectorAll('style[data-styled]'))
    .map((node) => node.textContent ?? '')
    .join('\n');
}

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn().mockReturnValue(true),
    })),
  });
});

describe('SearchSkeletons', () => {
  it('tints skeleton surfaces using brand tone tokens', () => {
    renderWithTheme(<SummarySkeleton />);

    const wrapper = screen.getByTestId('search-summary-skeleton');
    const firstLine = wrapper.firstElementChild;
    if (!(firstLine instanceof HTMLElement)) {
      throw new Error('Skeleton structure changed');
    }

    const styles = getComputedStyle(firstLine);
    expect(styles.backgroundColor).toBe(resolveRgba('#6ed680', 0.16));
  });

  it('disables shimmer animation when reduced motion is preferred', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn((query: string) => ({
        matches: true,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn().mockReturnValue(true),
      })),
    });

    renderWithTheme(<SummarySkeleton />);

    const css = collectStyledCss();
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    expect(css).toMatch(/animation:\s*none/);
  });
});
