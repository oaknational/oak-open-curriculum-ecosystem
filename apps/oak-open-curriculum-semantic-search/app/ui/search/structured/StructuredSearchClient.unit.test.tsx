import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../../lib/theme/ThemeContext';
import StructuredSearchClient from './StructuredSearchClient';

const resolve = async (): Promise<{ result: unknown | null; error?: string }> => ({ result: null });

function renderWithTheme(ui: React.ReactElement): void {
  render(<ThemeProvider initialMode="light">{ui}</ThemeProvider>);
}

describe('StructuredSearchClient', () => {
  it('notifies when scope changes', async () => {
    const onScopeChange = vi.fn();
    renderWithTheme(
      <StructuredSearchClient
        action={resolve}
        onResultsAction={() => undefined}
        onErrorAction={() => undefined}
        setLoadingAction={() => undefined}
        onScopeChange={onScopeChange}
        onSubmitPayload={() => undefined}
      />,
    );

    const radio = screen.getByLabelText('Lessons');
    fireEvent.click(radio);

    expect(onScopeChange).toHaveBeenCalledWith('lessons');
  });

  it('reports the payload used at submission time', async () => {
    const onSubmitPayload = vi.fn();
    renderWithTheme(
      <StructuredSearchClient
        action={resolve}
        onResultsAction={() => undefined}
        onErrorAction={() => undefined}
        setLoadingAction={() => undefined}
        onScopeChange={() => undefined}
        onSubmitPayload={onSubmitPayload}
      />,
    );

    fireEvent.change(screen.getByLabelText('Query'), { target: { value: 'fractions' } });
    const form = screen.getByTestId('structured-search-form');
    await act(async () => {
      fireEvent.submit(form);
    });

    expect(onSubmitPayload).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'units',
        text: 'fractions',
        includeFacets: true,
      }),
    );
  });

  it('reveals all filters and explanatory copy when all content scope is selected', () => {
    renderWithTheme(
      <StructuredSearchClient
        action={resolve}
        onResultsAction={() => undefined}
        onErrorAction={() => undefined}
        setLoadingAction={() => undefined}
        onScopeChange={() => undefined}
        onSubmitPayload={() => undefined}
      />,
    );

    fireEvent.click(screen.getByLabelText('All content'));

    expect(screen.getByText(/filters apply/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Phase')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimum lessons (units only)')).toBeInTheDocument();
  });

  it('hides programme-specific filters when lessons scope is selected', () => {
    renderWithTheme(
      <StructuredSearchClient
        action={resolve}
        onResultsAction={() => undefined}
        onErrorAction={() => undefined}
        setLoadingAction={() => undefined}
        onScopeChange={() => undefined}
        onSubmitPayload={() => undefined}
      />,
    );

    fireEvent.click(screen.getByLabelText('Lessons'));

    expect(screen.queryByLabelText('Phase')).not.toBeInTheDocument();
  });
});
