'use client';

import { useEffect } from 'react';
import { useColorMode } from './ColorModeContext';
import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
} from '@oaknational/mcp-logger';

/** @todo centralise logger creation */
const logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber('INFO'),
  resourceAttributes: buildResourceAttributes({}, 'HtmlThemeAttribute', '1.0.0'),
  context: {},
  stdoutSink: { write: (line: string) => console.log(line) }, // Browser console
  fileSink: null,
});

export function HtmlThemeAttribute(): React.JSX.Element | null {
  const { mode } = useColorMode();
  useEffect(() => {
    try {
      const root = document.getElementById('app-theme-root');
      if (root) {
        root.dataset.theme = mode;
      }
    } catch (error: unknown) {
      logger.error('Error setting theme mode', error instanceof Error ? error : undefined);
    }
  }, [mode]);
  return null;
}
