import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ThemeProvider } from '../lib/theme/ThemeContext';
import NaturalSearchComponent from './NaturalSearch';
import { SearchNaturalLanguageRequestSchema } from '../../src/types/oak';
import type { NaturalBody } from './NaturalSearch.types';

const submitNaturalSearchRequest = vi.hoisted(() =>
  vi.fn().mockResolvedValue({
    result: {
      scope: 'lessons',
      results: [],
      total: 0,
      took: 4,
      timedOut: false,
    },
    summary: {
      prompt: 'initial prompt',
      structured: {
        scope: 'lessons',
        text: 'initial',
        subject: undefined,
        keyStage: undefined,
        minLessons: undefined,
        phaseSlug: undefined,
        includeFacets: true,
        size: undefined,
      },
    },
  }),
);

vi.mock('./NaturalSearch.helpers', () => {
  const normaliseNaturalRequest = (model: Pick<NaturalBody, 'q'>): NaturalBody => {
    const prompt = typeof model.q === 'string' ? model.q.trim() : '';
    return SearchNaturalLanguageRequestSchema.parse({ q: prompt });
  };

  return {
    normaliseNaturalRequest,
    submitNaturalSearchRequest,
  };
});

describe('NaturalSearchComponent', () => {
  function renderWithTheme(): void {
    render(
      <ThemeProvider initialMode="light">
        <NaturalSearchComponent
          onResults={() => undefined}
          onError={() => undefined}
          setLoading={() => undefined}
        />
      </ThemeProvider>,
    );
  }

  beforeEach(() => {
    submitNaturalSearchRequest.mockClear();
  });

  it('presents a prompt-only form without structured filter inputs', () => {
    renderWithTheme();

    expect(screen.getByLabelText('Describe what you need')).toBeInTheDocument();
    expect(screen.queryByLabelText('Scope')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Subject')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Key Stage')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Phase')).not.toBeInTheDocument();
  });

  it('submits the prompt to the server and renders the derived summary read-only', async () => {
    renderWithTheme();

    submitNaturalSearchRequest.mockResolvedValueOnce({
      result: {
        scope: 'lessons',
        results: [],
        total: 0,
        took: 7,
        timedOut: false,
      },
      summary: {
        prompt: 'Plan KS2 fractions lessons',
        structured: {
          scope: 'lessons',
          text: 'fractions lessons',
          subject: 'maths',
          keyStage: 'ks2',
          minLessons: 4,
          phaseSlug: 'primary',
          includeFacets: true,
          size: 10,
        },
      },
    });

    fireEvent.change(screen.getByLabelText('Describe what you need'), {
      target: { value: 'Plan KS2 fractions lessons' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() =>
      expect(submitNaturalSearchRequest).toHaveBeenCalledWith({ q: 'Plan KS2 fractions lessons' }),
    );

    const summary = await screen.findByTestId('natural-summary');
    const items = within(summary).getAllByRole('definition');
    expect(items[0]).toHaveTextContent('Plan KS2 fractions lessons');
    expect(items[1]).toHaveTextContent('fractions lessons');
    expect(items[2]).toHaveTextContent('Lessons');
    expect(items[3]).toHaveTextContent(/Maths/i);
    expect(items[4]).toHaveTextContent(/KS2/i);
    expect(items[5]).toHaveTextContent(/Primary/i);
    expect(items[6]).toHaveTextContent('4');
    expect(items[7]).toHaveTextContent('10');
    expect(within(summary).queryByRole('textbox')).not.toBeInTheDocument();
  });
});
