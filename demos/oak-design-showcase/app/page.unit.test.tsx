import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ShowcasePage from './page';

describe('showcase page', () => {
  it('presents one top-level heading inside the landmark structure', () => {
    render(<ShowcasePage />);
    expect(screen.queryAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.queryByRole('main')).not.toBeNull();
    expect(screen.queryByRole('banner')).not.toBeNull();
    expect(screen.queryByRole('contentinfo')).not.toBeNull();
  });

  it('offers both demo doors as links', () => {
    render(<ShowcasePage />);
    // The landing's contract is the two doors (tight scope, owner
    // 2026-08-13): the switching demo and the composition demo. The
    // demos' own behaviour is each route's spec to prove.
    expect(screen.queryByRole('link', { name: /switching demo/i })).not.toBeNull();
    expect(screen.queryByRole('link', { name: /composition demo/i })).not.toBeNull();
  });
});
