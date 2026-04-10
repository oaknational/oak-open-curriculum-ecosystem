import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrandBanner } from './BrandBanner.js';

const OAK_URL = 'https://www.thenational.academy';

describe('BrandBanner', () => {
  it('renders the "Oak National Academy" text', () => {
    render(<BrandBanner onOpenLink={() => undefined} />);

    expect(screen.getByText('Oak National Academy')).toBeTruthy();
  });

  it('wraps the logo and text in a single link to the Oak website', () => {
    render(<BrandBanner onOpenLink={() => undefined} />);

    const link = screen.getByRole('link', { name: /oak national academy/iu });

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe(OAK_URL);
  });

  it('renders an inline SVG logo that is hidden from assistive technology', () => {
    render(<BrandBanner onOpenLink={() => undefined} />);

    const link = screen.getByRole('link', { name: /oak national academy/iu });
    const svg = link.querySelector('svg');

    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('calls onOpenLink with the Oak URL and the click event', () => {
    const calls: string[] = [];

    render(
      <BrandBanner
        onOpenLink={(url) => {
          calls.push(url);
        }}
      />,
    );

    const link = screen.getByRole('link', { name: /oak national academy/iu });

    fireEvent.click(link);

    expect(calls).toStrictEqual([OAK_URL]);
  });

  it('renders inside a header landmark', () => {
    render(<BrandBanner onOpenLink={() => undefined} />);

    const header = screen.getByRole('banner');

    expect(header).toBeTruthy();
  });
});
