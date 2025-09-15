'use client';

import { type JSX } from 'react';
import { useId } from 'react';
import sc from 'styled-components';
import { useThemeContext, THEME_MODES } from '../../lib/theme/ThemeContext';

const Wrapper = sc.div`
  margin-left: auto;
`;
const Label = sc.label`
  margin-right: ${(p) => p.theme.app.space.xs};
`;

export default function ThemeSelect(): JSX.Element {
  const selectId = useId();
  const { mode, setMode } = useThemeContext();

  return (
    <Wrapper>
      <Label htmlFor={selectId}>Theme</Label>
      <select
        id={selectId}
        value={mode}
        onFocus={(e) => {
          const v = e.target.value;
          if (v === THEME_MODES.light || v === THEME_MODES.dark || v === THEME_MODES.system) {
            setMode(v);
          }
        }}
        onChange={(e) => {
          const v = e.target.value;
          if (v === THEME_MODES.light || v === THEME_MODES.dark || v === THEME_MODES.system) {
            setMode(v);
          }
        }}
        onBlur={(e) => {
          const v = e.target.value;
          if (v === THEME_MODES.light || v === THEME_MODES.dark || v === THEME_MODES.system) {
            setMode(v);
          }
        }}
        aria-label="Theme selection"
      >
        <option value={THEME_MODES.system}>System</option>
        <option value={THEME_MODES.light}>Light</option>
        <option value={THEME_MODES.dark}>Dark</option>
      </select>
    </Wrapper>
  );
}
