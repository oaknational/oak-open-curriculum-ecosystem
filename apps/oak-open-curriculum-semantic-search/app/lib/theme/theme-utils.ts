/**
 * Pure theming utilities: types, guards, resolution, and cookie builder.
 * These are deliberately side-effect free for unit testing.
 */

export const THEME_MODEL_LOCAL_STORAGE_KEY = 'theme-mode';
const THEME_MODEL_COOKIE_NAME = THEME_MODEL_LOCAL_STORAGE_KEY;

export const THEME_MODES = { light: 'light', dark: 'dark', system: 'system' } as const;
export type ThemeMode = (typeof THEME_MODES)[keyof typeof THEME_MODES];

const RESOLVED_THEME_MODES = { light: 'light', dark: 'dark' } as const;
export type ResolvedThemeMode = (typeof RESOLVED_THEME_MODES)[keyof typeof RESOLVED_THEME_MODES];
export const isResolvedThemeMode = (value: unknown): value is ResolvedThemeMode => {
  if (typeof value !== 'string') {
    return false;
  }
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  const modes: readonly string[] = Object.values(RESOLVED_THEME_MODES);
  return modes.includes(value);
};

export const CONTRAST_PREFERENCES = {
  noPreference: 'no-preference',
  high: 'high',
  low: 'low',
  custom: 'custom',
} as const;
export type ContrastPreference = (typeof CONTRAST_PREFERENCES)[keyof typeof CONTRAST_PREFERENCES];

export function isThemeMode(value: unknown): value is ThemeMode {
  if (typeof value !== 'string') {
    return false;
  }
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  const modes: readonly string[] = Object.values(THEME_MODES);
  return modes.includes(value);
}

/**
 * Resolve a concrete light/dark mode from an abstract mode (light|dark|system).
 * The system preference is provided as a function to keep this pure and testable.
 */
export function resolveMode(mode: ThemeMode, getPrefersDark: () => boolean): ResolvedThemeMode {
  if (mode === 'light') {
    return 'light';
  }
  if (mode === 'dark') {
    return 'dark';
  }
  return getPrefersDark() ? 'dark' : 'light';
}

/**
 * Build a cookie string for persisting theme mode. Caller sets document.cookie to this value.
 */
export function makeThemeCookie(mode: unknown, maxAgeSeconds = 60 * 60 * 24 * 365): string {
  const safe = isThemeMode(mode) ? mode : THEME_MODES.system;
  return `${THEME_MODEL_COOKIE_NAME}=${encodeURIComponent(safe)}; Path=/; Max-Age=${String(maxAgeSeconds)}; SameSite=Lax`;
}

/** Safely read the stored theme mode from localStorage. */
export function getStoredThemeMode(): ThemeMode | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const raw = window.localStorage.getItem(THEME_MODEL_LOCAL_STORAGE_KEY);
    return isThemeMode(raw) ? raw : null;
  } catch {
    return null;
  }
}

/** Safely persist the theme mode to localStorage. */
export function setStoredThemeMode(mode: ThemeMode): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.setItem(THEME_MODEL_LOCAL_STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

/** Safely read system dark preference using matchMedia. */
export function getSystemPrefersDark(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      !!window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  } catch {
    return false;
  }
}

/** Subscribe to system dark-mode changes. Returns an unsubscribe function. */
export function subscribeToSystemPrefersDark(onChange: (prefersDark: boolean) => void): () => void {
  try {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return () => undefined;
    }
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const modernListener = (e: MediaQueryListEvent) => onChange(e.matches);
    if (
      typeof mql.addEventListener === 'function' &&
      typeof mql.removeEventListener === 'function'
    ) {
      mql.addEventListener('change', modernListener);
      return () => {
        try {
          mql.removeEventListener('change', modernListener);
        } catch {
          // ignore
        }
      };
    }
    return () => undefined;
  } catch {
    return () => undefined;
  }
}

/** Infer a coarse contrast preference using available media queries. */
export function getContrastPreference(): ContrastPreference {
  try {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return 'no-preference';
    }
    // Standard syntax
    if (window.matchMedia('(prefers-contrast: more)').matches) {
      return 'high';
    }
    if (window.matchMedia('(prefers-contrast: less)').matches) {
      return 'low';
    }
    // Some engines may expose a custom or non-standard state; if neither matches, assume no-preference
    return 'no-preference';
  } catch {
    return 'no-preference';
  }
}
