'use client';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

function applyTheme(mode: ThemeMode): void {
  if (typeof window === 'undefined') return;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const wantDark = mode === 'dark' || (mode === 'system' && prefersDark);
  document.documentElement.dataset.theme = wantDark ? 'dark' : 'light';
}

export function useThemeMode(): { mode: ThemeMode; setMode: Dispatch<SetStateAction<ThemeMode>> } {
  const [mode, setMode] = useState<ThemeMode>('system');

  // Load saved mode on mount (preference wins; defaults to system)
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const saved = window.localStorage.getItem('theme-mode');
    const savedMode: ThemeMode | null =
      saved === 'light' || saved === 'dark' || saved === 'system' ? saved : null;
    const nextMode = savedMode ?? 'system';
    setMode(nextMode);
    applyTheme(nextMode);
    return undefined;
  }, []);

  // Persist on change (localStorage + cookie), apply theme, and respond to system changes when in system mode
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    window.localStorage.setItem('theme-mode', mode);
    try {
      const maxAge = 60 * 60 * 24 * 365; // 1 year
      document.cookie = `theme-mode=${mode}; Path=/; Max-Age=${String(maxAge)}; SameSite=Lax`;
    } catch {
      // ignore
    }
    applyTheme(mode);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (mode === 'system') applyTheme('system');
    };
    media.addEventListener('change', handler);
    return () => {
      media.removeEventListener('change', handler);
    };
  }, [mode]);

  return { mode, setMode };
}
