'use client';

import type { ChangeEvent, JSX } from 'react';
import { OakRadioButton, OakRadioGroup } from '@oaknational/oak-components';
import { useThemeContext, THEME_MODES, type ThemeMode } from '../../lib/theme/ThemeContext';

const OPTIONS: ReadonlyArray<{ value: ThemeMode; label: string }> = [
  { value: THEME_MODES.system, label: 'System' },
  { value: THEME_MODES.light, label: 'Light' },
  { value: THEME_MODES.dark, label: 'Dark' },
];

export default function ThemeSelect(): JSX.Element {
  const { mode, setMode } = useThemeContext();

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const next = OPTIONS.find((option) => option.value === event.target.value);
    if (next) {
      setMode(next.value);
    }
  }

  return (
    <OakRadioGroup
      name="theme-mode"
      label="Theme"
      value={mode}
      onChange={handleChange}
      $gap="space-between-xs"
    >
      {OPTIONS.map((option) => (
        <OakRadioButton
          key={option.value}
          id={`theme-${option.value}`}
          value={option.value}
          label={option.label}
        />
      ))}
    </OakRadioGroup>
  );
}
