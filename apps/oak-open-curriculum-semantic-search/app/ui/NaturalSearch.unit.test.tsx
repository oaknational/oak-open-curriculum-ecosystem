import { fireEvent, render, screen, within } from '@testing-library/react';
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

  it('renders a multiline prompt field with an instructional label', () => {
    renderWithTheme();

    const prompt = screen.getByLabelText('Describe what you need');

    expect(prompt.tagName).toBe('TEXTAREA');
  });

  it('summarises the derived parameters as the form updates', () => {
    renderWithTheme();

    const summary = screen.getByTestId('natural-summary');
    const initialDefinitions = within(summary).getAllByRole('definition');
    expect(initialDefinitions[0]).toHaveTextContent('(not set)');
    expect(initialDefinitions[1]).toHaveTextContent('Auto (Oak decides)');

    const prompt = screen.getByLabelText('Describe what you need');
    fireEvent.change(prompt, { target: { value: 'Plan KS2 fractions lessons' } });
    fireEvent.click(screen.getByLabelText('Units'));
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'maths' } });
    fireEvent.change(screen.getByLabelText('Key Stage'), { target: { value: 'ks2' } });
    fireEvent.change(screen.getByLabelText('Size'), { target: { value: '5' } });

    const updatedDefinitions = within(summary).getAllByRole('definition');
    expect(updatedDefinitions[0]).toHaveTextContent('Plan KS2 fractions lessons');
    expect(updatedDefinitions[1]).toHaveTextContent('Units');
    expect(updatedDefinitions[2]).toHaveTextContent(/Maths/i);
    expect(updatedDefinitions[3]).toHaveTextContent(/KS2/i);
    expect(updatedDefinitions.at(-1)).toHaveTextContent('5');
  });
});
