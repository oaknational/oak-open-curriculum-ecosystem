'use client';
/* Theme + motion controls for the Oak design system (kit
   docs/nextjs-theme-switcher.tsx.txt, adapted to useSyncExternalStore over
   the lib/oak-theme-store adapter). Pairs with the kit's oak-theme.js served
   as a raw inline <head> script from app/layout.tsx (ADR-213: never
   next/script beforeInteractive — it does not block first paint). The server
   snapshot is undefined, so server HTML renders no controls and the client
   upgrades after hydration: theme state lives in localStorage, so the server
   must not guess. All five themes are offered — the access themes
   (high-contrast, colour-safe) are not optional extras.

   The theme select binds the store's CHOICE snapshot, never the applied
   theme: with no explicit choice it shows the "Page default" placeholder
   (value ''), so the OS contrast route is not misreported as a choice and
   the first real choice always fires a change event. The placeholder shape
   depends on React emitting `selected=""` on the value-matching option even
   when that option is `disabled hidden` (the showcase's LabelledSelect
   records the same dependency). Motion binds the applied mode — 'system'
   is its own no-choice semantic. */
import { useSyncExternalStore } from 'react';
import type { ReactElement } from 'react';

import { oakThemeStore } from '@/lib/oak-theme-store';
import type { OakMotionMode, OakThemeName, OakThemeStore } from '@/lib/oak-theme-store';

const THEME_LABELS: Readonly<Record<OakThemeName, string>> = {
  light: 'Light',
  dark: 'Dark',
  system: 'Match device',
  'high-contrast': 'High contrast',
  'colour-safe': 'Colour safe',
};
const MOTION_LABELS: Readonly<Record<OakMotionMode, string>> = {
  system: 'Match device',
  reduced: 'Reduced',
  full: 'Full',
};

function AxisSelect({
  id,
  label,
  value,
  options,
  labels,
  placeholderLabel,
  onChange,
}: {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly options: readonly string[];
  readonly labels: Readonly<Record<string, string>>;
  readonly placeholderLabel?: string;
  readonly onChange: (value: string) => void;
}): ReactElement {
  return (
    <>
      <label className="oak-body-3" htmlFor={id}>
        {label}
      </label>
      <select
        className="oak-select"
        id={id}
        value={value}
        style={{ width: 'auto', minHeight: 'var(--size-target-min)' }}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholderLabel !== undefined && (
          <option value="" disabled hidden>
            {placeholderLabel}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option] ?? option}
          </option>
        ))}
      </select>
    </>
  );
}

export default function ThemeSwitcher({
  store = oakThemeStore,
}: {
  readonly store?: OakThemeStore;
} = {}): ReactElement | null {
  const theme = useSyncExternalStore(store.subscribe, store.getTheme, store.getServerSnapshot);
  const motion = useSyncExternalStore(store.subscribe, store.getMotion, store.getServerSnapshot);

  if (theme === undefined || motion === undefined) {
    return null; // server render / no runtime: HTML stays theme-neutral
  }

  return (
    <div className="oak-cluster oak-cluster--s">
      <AxisSelect
        id="oak-theme-select"
        label="Theme"
        value={theme}
        options={store.themeOptions()}
        labels={THEME_LABELS}
        placeholderLabel="Page default"
        onChange={store.setTheme}
      />
      <AxisSelect
        id="oak-motion-select"
        label="Motion"
        value={motion}
        options={store.motionOptions()}
        labels={MOTION_LABELS}
        onChange={store.setMotion}
      />
    </div>
  );
}
