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
      document.documentElement.dataset.theme = mode;
    } catch (error: unknown) {
      logger.error(`Error setting theme mode: ${error}`, { error });
      // ignore
    }
  }, [mode]);
  return null;
}
