import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
});
