import { screen, within } from '@testing-library/react';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import type { StructuredSearchAction } from './structured/StructuredSearch';
import { LESSONS_SCOPE } from '../../../src/lib/search-scopes';
import { renderWithTheme, resetSearchPageTestState } from './SearchPageClient.test-helpers';

describe('SearchPageClient hero and shell layout', () => {
  beforeEach(() => {
    resetSearchPageTestState();
  });

  it('routes the hero CTAs to dedicated structured and natural search pages', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action);

    const structuredLink = screen.getByRole('link', { name: /open structured search/i });
    const naturalLink = screen.getByRole('link', { name: /open natural language search/i });

    expect(structuredLink).toHaveAttribute('href', '/structured_search');
    expect(naturalLink).toHaveAttribute('href', '/natural_language_search');
  });

  it('presents structured-only hero messaging and skip links on the structured route', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 5, timedOut: false },
    });

    renderWithTheme(action, { variant: 'structured' });

    expect(
      screen.getByRole('heading', { level: 1, name: /structured search/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/choose subject, phase, and scope to target the oak catalogue/i),
    ).toBeInTheDocument();

    const skipLinksNav = screen.getByRole('navigation', { name: /skip links/i });
    const skipLinks = within(skipLinksNav).getAllByRole('link');
    expect(skipLinks).toHaveLength(2);
    expect(skipLinks[0]).toHaveAccessibleName(/skip to structured search form/i);
    expect(skipLinks[1]).toHaveAccessibleName(/skip to structured results/i);

    expect(screen.queryByTestId('natural-search-panel')).not.toBeInTheDocument();
  });

  it('surfaces natural language hero messaging, prompt-only controls, and skip links on the natural route', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 4, timedOut: false },
    });

    renderWithTheme(action, { variant: 'natural' });

    expect(
      screen.getByRole('heading', { level: 1, name: /natural language search/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /describe what you need in plain language and we will translate it into a structured query/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Describe what you need')).toBeInTheDocument();
    expect(screen.queryByLabelText('Scope')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Subject')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Key Stage')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Phase')).not.toBeInTheDocument();

    const summary = screen.getByTestId('natural-summary');
    expect(
      within(summary).getByRole('heading', { level: 3, name: /derived parameters/i }),
    ).toBeInTheDocument();
    expect(summary).toHaveTextContent(/Submit a prompt to populate the derived summary/i);

    const skipLinksNav = screen.getByRole('navigation', { name: /skip links/i });
    const skipLinks = within(skipLinksNav).getAllByRole('link');
    expect(skipLinks).toHaveLength(2);
    expect(skipLinks[0]).toHaveAccessibleName(/skip to natural language search form/i);
    expect(skipLinks[1]).toHaveAccessibleName(/skip to natural language results/i);

    expect(screen.queryByTestId('structured-search-panel')).not.toBeInTheDocument();
  });

  it('surfaces the structured Phase selector with an accessible label', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action);

    const structuredPanel = screen.getByTestId('structured-search-panel');
    const phaseSelect = within(structuredPanel).getByLabelText('Phase');

    expect(phaseSelect).toHaveAttribute('id', 'structured-phase-select');
    const options = within(phaseSelect).getAllByRole('option');
    const optionLabels = options.map((opt) => opt.textContent?.trim());
    expect(optionLabels).toEqual(['(any)', 'Primary', 'Secondary']);
  });

  it('caps the main layout inline size using the app layout CSS variable', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action);

    const content = screen.getByTestId('search-page-content');
    const computed = getComputedStyle(content);
    expect(computed.getPropertyValue('max-width')).toBe(
      'min(100%, var(--app-layout-container-max-width))',
    );
  });

  it('renders a fixture scenario pill when fixtures are enabled on the page', () => {
    const action = vi.fn<StructuredSearchAction>().mockResolvedValue({
      result: { scope: LESSONS_SCOPE, results: [], total: 0, took: 3, timedOut: false },
    });

    renderWithTheme(action, { showFixtureToggle: true, initialFixtureMode: 'fixtures-empty' });

    expect(screen.getByText(/Using fixture scenario: empty dataset/i)).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup', { name: /search data/i })).not.toBeInTheDocument();
  });
});
