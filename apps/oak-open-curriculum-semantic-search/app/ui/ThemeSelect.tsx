'use client';

import { type JSX } from 'react';
import { useId } from 'react';
import { useThemeContext } from '../lib/theme/ThemeContext';

export default function ThemeSelect(): JSX.Element {
  const selectId = useId();
  const { mode, setMode } = useThemeContext();

  return (
    <div style={{ marginLeft: 'auto' }}>
      <label htmlFor={selectId} style={{ marginRight: 6 }}>
        Theme
      </label>
      <select
        id={selectId}
        value={mode}
        onChange={(e) => {
          const v = e.target.value;
          if (v === 'light' || v === 'dark' || v === 'system') setMode(v);
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
