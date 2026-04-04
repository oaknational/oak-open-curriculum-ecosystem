import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppView } from './App.js';

describe('AppView', () => {
  it('renders the app shell container', () => {
    render(<AppView onOpenLink={() => undefined} />);

    expect(screen.getByTestId('oak-mcp-app-shell')).toBeTruthy();
  });

  it('renders the brand banner with the Oak National Academy link', () => {
    render(<AppView onOpenLink={() => undefined} />);

    const link = screen.getByRole('link', { name: /oak national academy/iu });

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('https://www.thenational.academy');
  });

  it('passes onOpenLink through to the banner', () => {
    const calls: string[] = [];

    render(<AppView onOpenLink={(url) => calls.push(url)} />);

    const link = screen.getByRole('link', { name: /oak national academy/iu });

    link.click();

    expect(calls).toStrictEqual(['https://www.thenational.academy']);
  });
});
