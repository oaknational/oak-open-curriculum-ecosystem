/**
 * Human-authored contrast pairing manifest.
 *
 * @remarks
 * Declares which foreground/background token pairs must pass WCAG 2.2 AA
 * contrast checks, and which triadic relationships exist (e.g. button text
 * on button surface on page background). The manifest is consumed by the
 * build pipeline to generate `dist/contrast-report.json`.
 */
import type { ContrastManifest } from '@oaknational/design-tokens-core';

const contrastPairings = {
  pairs: [
    {
      foreground: 'semantic.text-primary',
      background: 'semantic.surface-page',
      context: 'text',
    },
    {
      foreground: 'semantic.text-primary',
      background: 'semantic.surface-panel',
      context: 'text',
    },
    {
      foreground: 'semantic.text-secondary',
      background: 'semantic.surface-page',
      context: 'text',
    },
    {
      foreground: 'semantic.text-secondary',
      background: 'semantic.surface-panel',
      context: 'text',
    },
    {
      foreground: 'semantic.focus-ring',
      background: 'semantic.surface-page',
      context: 'non-text',
    },
    {
      foreground: 'semantic.focus-ring',
      background: 'semantic.surface-panel',
      context: 'non-text',
    },
    {
      foreground: 'semantic.error',
      background: 'semantic.surface-page',
      context: 'text',
    },
    {
      foreground: 'semantic.error',
      background: 'semantic.surface-panel',
      context: 'text',
    },
    {
      foreground: 'semantic.border-subtle',
      background: 'semantic.surface-page',
      context: 'non-text',
    },
    {
      foreground: 'semantic.border-subtle',
      background: 'semantic.surface-panel',
      context: 'non-text',
    },
    {
      foreground: 'semantic.accent',
      background: 'semantic.surface-page',
      context: 'non-text',
    },
    {
      foreground: 'semantic.accent',
      background: 'semantic.surface-panel',
      context: 'non-text',
    },
    {
      foreground: 'semantic.accent-strong',
      background: 'semantic.surface-page',
      context: 'non-text',
    },
    {
      foreground: 'semantic.accent-strong',
      background: 'semantic.surface-panel',
      context: 'non-text',
    },
    {
      foreground: 'semantic.text-inverse',
      background: 'semantic.accent-strong',
      context: 'text',
    },
  ],
  triads: [
    // Button primary: text on button surface on page background.
    // fgBg is informational because the button surface is opaque —
    // text-inverse matches the page colour by design, so fg→bg contrast
    // has no a11y value. It is still computed for design visibility.
    {
      foreground: 'semantic.text-inverse',
      middle: 'semantic.accent',
      background: 'semantic.surface-page',
      contexts: { fgMid: 'text', midBg: 'non-text', fgBg: 'informational' },
    },
  ],
} as const satisfies ContrastManifest;

export default contrastPairings;
