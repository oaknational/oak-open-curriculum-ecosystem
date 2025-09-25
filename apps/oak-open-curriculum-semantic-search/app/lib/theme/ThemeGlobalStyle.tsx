import { useMemo, type JSX } from 'react';
import {
  oakColorTokens,
  oakUiRoleTokens,
  type OakColorToken,
  type OakUiRoleToken,
} from '@oaknational/oak-components';
import type { AppTheme } from '../../ui/themes/types';

function isOakColorToken(value: unknown): value is OakColorToken {
  return typeof value === 'string' && value in oakColorTokens;
}
function isOakUiRoleToken(value: unknown): value is OakUiRoleToken {
  return typeof value === 'string' && oakUiRoleTokens.some((token) => token === value);
}

/**
 * Resolves an Oak UI role token to its actual HEX/rgb value using the Oak component token map.
 */
export function resolveUiColor(theme: AppTheme, role: OakUiRoleToken): string {
  if (!isOakUiRoleToken(role)) {
    throw new TypeError(`Invalid Oak UI role token: ${role}`);
  }
  const colourToken = theme.uiColors[role];
  if (!isOakColorToken(colourToken)) {
    throw new TypeError(`Invalid Oak UI colour token: ${colourToken}`);
  }
  return oakColorTokens[colourToken];
}

/**
 * Builds the CSS applied to the document root and app wrapper for the active semantic theme.
 */
function buildGlobalCss(theme: AppTheme): string {
  const background = resolveUiColor(theme, 'bg-primary');
  const text = resolveUiColor(theme, 'text-primary');
  const link = resolveUiColor(theme, 'text-link-active');
  const linkHover = resolveUiColor(theme, 'text-link-hover');

  return [
    'html, body {',
    `  background-color: ${background};`,
    `  color: ${text};`,
    '  transition: background-color 0.2s ease, color 0.2s ease;',
    '}',
    '#app-theme-root {',
    `  background-color: ${background};`,
    `  color: ${text};`,
    '  min-height: 100%;',
    '}',
    '#app-theme-root a {',
    `  color: ${link};`,
    '}',
    '#app-theme-root a:hover,',
    '#app-theme-root a:focus {',
    `  color: ${linkHover};`,
    '}',
  ].join('\n');
}

/**
 * Emits a deterministic `<style>` tag that paints `html`, `body`, and `#app-theme-root`
 * using the active semantic theme colours while keeping link states consistent.
 */
export function ThemeGlobalStyle({ theme }: { theme: AppTheme }): JSX.Element {
  const css = useMemo(() => buildGlobalCss(theme), [theme]);
  return <style id="app-theme-global">{css}</style>;
}
