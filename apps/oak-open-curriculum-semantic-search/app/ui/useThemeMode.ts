'use client';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

import { createAdaptiveLogger } from '@oaknational/mcp-logger';

/**
 * @todo Move logger initialization to a more appropriate place, and pass in the instance.
 */
const logger = createAdaptiveLogger({
  level: 'INFO',
  name: 'useThemeMode',
});

const LOCAL_STORAGE_KEY = 'theme-mode';
const COOKIE_KEY = LOCAL_STORAGE_KEY;

const THEME_MODES = { light: 'light', dark: 'dark', system: 'system' } as const;
const THEME_DATA_ATTRIBUTES = { light: 'light-theme', dark: 'dark-theme' } as const;
const CONTRAST_PREFERENCES = {
  noPreference: 'no-preference',
  high: 'high',
  low: 'low',
  custom: 'custom',
} as const;

export type ThemeMode = (typeof THEME_MODES)[keyof typeof THEME_MODES];
type ThemeDataAttribute = (typeof THEME_DATA_ATTRIBUTES)[keyof typeof THEME_DATA_ATTRIBUTES];
type ContrastPreference = (typeof CONTRAST_PREFERENCES)[keyof typeof CONTRAST_PREFERENCES];

function isThemeMode(mode: unknown): mode is ThemeMode {
  if (typeof mode !== 'string') return false;
  const themeModes: readonly string[] = Object.values(THEME_MODES);
  return themeModes.includes(mode);
}

function isContrastPreference(preference: unknown): preference is ContrastPreference {
  if (typeof preference !== 'string') return false;
  const contrastPreferences: readonly string[] = Object.values(CONTRAST_PREFERENCES);
  return contrastPreferences.includes(preference);
}

function getThemeDataAttribute(mode: ThemeMode): ThemeDataAttribute {
  // Read the system set preference for theme.
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Read the system preference for contrast, values are 'no-preference', 'high', 'low', or 'custom'.
  // We don't support this yet, but we can gather requested values for future support.
  const maybeContrastPreference = window.matchMedia('(prefers-contrast: high)');
  let contrastPreference: ContrastPreference = 'no-preference';
  if (isContrastPreference(maybeContrastPreference)) {
    contrastPreference = maybeContrastPreference;
  }
  logger.info(`Contrast preference: ${contrastPreference}`);
  if (contrastPreference !== 'no-preference') {
    logger.warn(`Unsupported contrast preference requested: ${contrastPreference}`, {
      contrastPreference,
    });
  }

  // Determine the theme data attribute to use.
  const wantsDark = mode === 'dark' || (mode === 'system' && prefersDark);
  return wantsDark ? THEME_DATA_ATTRIBUTES.dark : THEME_DATA_ATTRIBUTES.light;
}

/**
 * @todo This probably shouldn't happen via direct DOM manipulation, move to canonical handling
 */
function applyThemeToDom(mode: ThemeMode): void {
  document.documentElement.dataset.theme = getThemeDataAttribute(mode);
}

/**
 * This is a hook that manages the theme mode and persists it to localStorage and cookies.
 *
 * @todo Fix the persistence mechanisms so we don't get hydration errors
 *
 * @returns The current theme mode and a function to set the theme mode.
 *
 */
export function useThemeMode(): { mode: ThemeMode; setMode: Dispatch<SetStateAction<ThemeMode>> } {
  const [mode, setMode] = useState<ThemeMode>('system');

  // Load localStorage saved mode on mount (preference wins; defaults to system)
  useEffect(() => {
    const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    const savedMode: ThemeMode | null = isThemeMode(saved) ? saved : null;
    const nextMode = savedMode ?? 'system';
    setMode(nextMode);
    applyThemeToDom(nextMode);
    return undefined;
  }, []);

  // Persist on change (localStorage + cookie), apply theme, and respond to system changes when in system mode
  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, mode);
    try {
      const maxAge = 60 * 60 * 24 * 365; // 1 year
      document.cookie = `${COOKIE_KEY}=${mode}; Path=/; Max-Age=${String(maxAge)}; SameSite=Lax`;
    } catch {
      // ignore
    }
    applyThemeToDom(mode);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (mode === 'system') applyThemeToDom('system');
    };
    media.addEventListener('change', handler);
    return () => {
      media.removeEventListener('change', handler);
    };
  }, [mode]);

  return { mode, setMode };
}
