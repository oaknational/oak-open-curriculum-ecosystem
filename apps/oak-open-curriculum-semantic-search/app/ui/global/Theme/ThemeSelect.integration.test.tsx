import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSelect from './ThemeSelect';
import { ThemeProvider, useThemeContext } from '../../../lib/theme/ThemeContext';
import { createMockMediaQueryAPI } from '../../../lib/media-query/MediaQueryContext.test-helpers';
import { MediaQueryContext } from '../../../lib/media-query/MediaQueryContext';

function ModeProbe(): React.JSX.Element {
  const { mode } = useThemeContext();
  return <span data-testid="mode">{mode}</span>;
}

describe('ThemeSelect', () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = '';
  });

  it('changes mode and persists when selecting an option', () => {
    const mockAPI = createMockMediaQueryAPI(false);
    render(
      <MediaQueryContext.Provider value={mockAPI}>
        <ThemeProvider initialMode="system">
          <ThemeSelect />
          <ModeProbe />
        </ThemeProvider>
      </MediaQueryContext.Provider>,
    );

    const radio = screen.getByLabelText('Dark');
    fireEvent.click(radio);
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });
});
