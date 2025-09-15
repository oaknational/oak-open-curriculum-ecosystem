'use client';

import { useEffect } from 'react';
import { useColorMode } from './ColorModeContext';
import { createAdaptiveLogger } from '@oaknational/mcp-logger';

/** @todo centralise logger creation */
const logger = createAdaptiveLogger({ name: 'HtmlThemeAttribute' });

export function HtmlThemeAttribute(): React.JSX.Element | null {
  const { mode } = useColorMode();
  useEffect(() => {
    try {
      const root = document.getElementById('app-theme-root');
      if (root) root.dataset.theme = mode;
    } catch (error: unknown) {
      logger.error(`Error setting theme mode: ${error}`, { error });
    }
  }, [mode]);
  return null;
}
