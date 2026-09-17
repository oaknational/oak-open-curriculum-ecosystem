/**
 * The closed theme vocabulary — owner-facing labels and the option order,
 * in a FRAMEWORK-FREE module for the same reason IDENTITY_LABELS lives in
 * useIdentity.ts: server components consume these too, and an export from
 * a 'use client' module crosses the RSC boundary as a client reference
 * that evaluates to undefined in a server render (the colour matrix
 * duplicated this table until the extraction). Identity default leads: it
 * is the no-choice default (DDR-003 dated amendment 2026-08-11 — the
 * person's choice wins, and the identity speaks first when the person is
 * silent), and the five choices follow.
 */
import { typeSafeKeys } from '@oaknational/type-helpers';

import { IDENTITY_DEFAULT } from '@oaknational/oak-design-react';
import type { OakThemeSnapshot } from '@oaknational/oak-design-react';

export const THEME_LABELS: Readonly<Record<OakThemeSnapshot, string>> = {
  [IDENTITY_DEFAULT]: 'Identity default',
  system: 'Match device',
  light: 'Light',
  dark: 'Dark',
  'high-contrast': 'High contrast',
  'colour-safe': 'Colour safe',
};

export const THEME_OPTIONS: readonly OakThemeSnapshot[] = typeSafeKeys(THEME_LABELS);

export function isPickerTheme(value: string): value is OakThemeSnapshot {
  const names: readonly string[] = THEME_OPTIONS;
  return names.includes(value);
}
