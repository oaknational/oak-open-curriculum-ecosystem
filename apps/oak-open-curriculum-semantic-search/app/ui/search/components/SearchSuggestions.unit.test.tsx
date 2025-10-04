import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OakThemeProvider, oakDefaultTheme } from '@oaknational/oak-components';
import { SearchSuggestions } from './SearchSuggestions';

const suggestions = [
  {
    label: 'Fractions primer',
    scope: 'lessons' as const,
    url: '/lessons/fractions-primer',
    contexts: {},
  },
];

describe('SearchSuggestions', () => {
  it('renders suggestion chips with scope labels', () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SearchSuggestions suggestions={suggestions} />
      </OakThemeProvider>,
    );

    expect(screen.getByRole('button', { name: /fractions primer/i })).toBeInTheDocument();
    expect(screen.getByText('Lesson suggestion')).toBeInTheDocument();
  });

  it('renders nothing when no suggestions are present', () => {
    const { container } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SearchSuggestions suggestions={[]} />
      </OakThemeProvider>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('invokes callback when a suggestion is selected', () => {
    const onSelect = vi.fn();

    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SearchSuggestions suggestions={suggestions} onSelectSuggestion={onSelect} />
      </OakThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /fractions primer/i }));

    expect(onSelect).toHaveBeenCalledWith(suggestions[0]);
  });
});
