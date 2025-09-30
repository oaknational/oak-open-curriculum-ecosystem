import { describe, expect, it, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import StyledComponentsRegistry from './registry';

vi.mock('next/navigation', () => ({
  useServerInsertedHTML: (callback: () => React.ReactNode) => {
    callback();
  },
}));

describe('StyledComponentsRegistry', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children unchanged in the browser', () => {
    const { getByText } = render(
      <StyledComponentsRegistry>
        <div>client</div>
      </StyledComponentsRegistry>,
    );
    expect(getByText('client')).toBeInTheDocument();
  });
});
