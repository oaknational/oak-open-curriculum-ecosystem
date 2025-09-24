import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createLightTheme } from './themes/light';
import StructuredSearchClient from './StructuredSearchClient';

const resolve = async (): Promise<{ result: unknown | null; error?: string }> => ({ result: null });

function renderWithTheme(ui: React.ReactElement): void {
  render(<StyledThemeProvider theme={createLightTheme()}>{ui}</StyledThemeProvider>);
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

    const select = screen.getByLabelText('Scope');
    fireEvent.change(select, { target: { value: 'lessons' } });

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
    const form = screen.getByRole('tabpanel');
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
});
