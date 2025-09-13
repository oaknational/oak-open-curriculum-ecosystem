'use client';

import type { JSX } from 'react';
import { useEffect, useId, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

function applyTheme(mode: ThemeMode): void {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const wantDark = mode === 'dark' || (mode === 'system' && prefersDark);
  root.dataset.theme = wantDark ? 'dark' : 'light';
}

export default function ThemeSelect(): JSX.Element {
  const [mode, setMode] = useState<ThemeMode>('system');
  const selectId = useId();

  // Load saved mode on mount (preference wins; defaults to system)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('theme-mode') as ThemeMode | null;
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      setMode(saved);
      applyTheme(saved);
    } else {
      applyTheme('system');
    }
  }, []);

  // Persist on change (localStorage + cookie), apply theme, and respond to system changes when in system mode
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('theme-mode', mode);
    // Persist a cookie for SSR hint / early-script usage
    try {
      const maxAge = 60 * 60 * 24 * 365; // 1 year
      const cookie = `theme-mode=${mode}; Path=/; Max-Age=${String(maxAge)}; SameSite=Lax`;
      document.cookie = cookie;
    } catch {
      // ignore
    }
    applyTheme(mode);

    if (mode !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      applyTheme('system');
    };
    media.addEventListener('change', handler);
    return () => {
      media.removeEventListener('change', handler);
    };
  }, [mode]);

  return (
    <div style={{ marginLeft: 'auto' }}>
      <label htmlFor={selectId} style={{ marginRight: 6 }}>
        Theme
      </label>
      <select
        id={selectId}
        value={mode}
        onChange={(e) => {
          setMode(e.target.value as ThemeMode);
        }}
        aria-label="Theme selection"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
