import { useMemo } from 'react';
import { useColorMode } from './ColorModeContext';

function buildCss(vars: Record<string, string>, mode: 'light' | 'dark'): string {
  const selector = `#app-theme-root[data-theme="${mode}"]`;
  const body = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  return `${selector} {\n${body}\n}`;
}

export function ThemeCssVars({ vars }: { vars: Record<string, string> }): React.JSX.Element {
  const { mode } = useColorMode();
  const css = useMemo(() => buildCss(vars, mode), [vars, mode]);
  return <style id="app-theme-vars">{css}</style>;
}
