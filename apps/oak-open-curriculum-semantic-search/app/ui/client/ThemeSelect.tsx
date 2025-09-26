'use client';

import type { ChangeEvent, JSX } from 'react';
import { OakRadioButton, OakRadioGroup, oakColorTokens } from '@oaknational/oak-components';
import styledComponents from 'styled-components';

import { useThemeContext, THEME_MODES, type ThemeMode } from '../../lib/theme/ThemeContext';

function isOakColorToken(token: string): token is keyof typeof oakColorTokens {
  return Object.hasOwn(oakColorTokens, token);
}

function resolveColor(token: string | null | undefined, fallback: string): string {
  if (!token || !isOakColorToken(token)) {
    return fallback;
  }
  const resolved = oakColorTokens[token];
  return typeof resolved === 'string' ? resolved : fallback;
}

const OPTIONS: ReadonlyArray<{ value: ThemeMode; label: string }> = [
  { value: THEME_MODES.system, label: 'System' },
  { value: THEME_MODES.light, label: 'Light' },
  { value: THEME_MODES.dark, label: 'Dark' },
];

const ThemeModeRadioGroup = styledComponents(OakRadioGroup)`
  [data-theme='dark'] & input[type='radio'] + div {
    border-color: ${({ theme }) => resolveColor(theme.uiColors['text-subdued'], '#e4e4e4')};
  }

  [data-theme='dark'] & input[type='radio']:hover:not(:disabled) + div,
  [data-theme='dark'] & input[type='radio']:focus-visible + div,
  [data-theme='dark'] & input[type='radio']:checked + div {
    border-color: ${({ theme }) => resolveColor(theme.uiColors['text-primary'], '#ffffff')};
  }

  [data-theme='dark'] & input[type='radio']:focus-visible + div::before {
    border-color: ${({ theme }) => resolveColor(theme.uiColors['text-subdued'], '#e4e4e4')};
    box-shadow: inset 0 0 0 0.13rem
      ${({ theme }) => resolveColor(theme.uiColors['border-primary'], '#35a04c')};
  }

  [data-theme='dark'] & input[type='radio']:checked + div::after {
    background: ${({ theme }) => resolveColor(theme.uiColors['text-primary'], '#ffffff')};
    border-color: ${({ theme }) => resolveColor(theme.uiColors['text-primary'], '#ffffff')};
  }
`;

export default function ThemeSelect(): JSX.Element {
  const { mode, setMode } = useThemeContext();

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const next = OPTIONS.find((option) => option.value === event.target.value);
    if (next) {
      setMode(next.value);
    }
  }

  return (
    <ThemeModeRadioGroup
      name="theme-mode"
      label="Theme"
      value={mode}
      onChange={handleChange}
      $flexDirection="row"
      $flexWrap="wrap"
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
    </ThemeModeRadioGroup>
  );
}
