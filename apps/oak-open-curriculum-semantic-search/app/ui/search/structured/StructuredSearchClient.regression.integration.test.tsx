import { useState, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { SearchStructuredRequest } from '@oaknational/oak-curriculum-sdk/public/search.js';
import StructuredSearchClient from './StructuredSearchClient';
import { ThemeProvider } from '../../../lib/theme/ThemeContext';
import { createMockMediaQueryAPI } from '../../../lib/media-query/MediaQueryContext.test-helpers';
import { MediaQueryContext } from '../../../lib/media-query/MediaQueryContext';

function renderWithTheme(ui: ReactElement): void {
  const mockAPI = createMockMediaQueryAPI(false);
  render(
    <MediaQueryContext.Provider value={mockAPI}>
      <ThemeProvider initialMode="light">{ui}</ThemeProvider>
    </MediaQueryContext.Provider>,
  );
}

describe('StructuredSearchClient regression', () => {
  it('maintains a stable render cycle when structured results resolve', async () => {
    const action = vi
      .fn<(input: SearchStructuredRequest) => Promise<{ result: unknown | null; error?: string }>>()
      .mockResolvedValue({
        result: {
          scope: 'lessons',
          results: [],
          total: 1,
          took: 12,
          timedOut: false,
        },
      });

    function Harness(): ReactElement {
      const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
      const [message, setMessage] = useState<string | null>(null);

      return (
        <>
          <StructuredSearchClient
            action={action}
            onResultsAction={() => {
              setStatus('success');
              setMessage(null);
            }}
            onErrorAction={(error) => {
              setStatus('error');
              setMessage(error ?? 'Unknown error');
            }}
            setLoadingAction={(isLoading) => {
              if (isLoading) {
                setStatus('loading');
              }
            }}
          />
          <span data-testid="status-probe" data-status={status} data-message={message ?? ''} />
        </>
      );
    }

    renderWithTheme(<Harness />);

    fireEvent.change(screen.getByLabelText('Query'), { target: { value: 'fractions' } });

    await act(async () => {
      fireEvent.submit(screen.getByTestId('structured-search-form'));
    });

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('status-probe')).toHaveAttribute('data-status', 'success');
    });

    expect(screen.getByTestId('status-probe')).toHaveAttribute('data-message', '');
  });
});
