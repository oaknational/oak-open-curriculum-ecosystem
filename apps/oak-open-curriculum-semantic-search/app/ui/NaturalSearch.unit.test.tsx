import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../lib/theme/ThemeContext';
import NaturalSearchComponent from './NaturalSearch';

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

  it('shows filter guidance and all inputs when all content scope is selected', () => {
    renderWithTheme();

    fireEvent.click(screen.getByLabelText('All content'));

    expect(screen.getByText(/filters apply/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByLabelText('Phase')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimum lessons (units only)')).toBeInTheDocument();
  });

  it('hides programme filters when lessons are selected', () => {
    renderWithTheme();

    fireEvent.click(screen.getByLabelText('Lessons'));

    expect(screen.queryByLabelText('Phase')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
  });
});
