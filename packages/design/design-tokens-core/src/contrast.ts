/**
 * WCAG 2.2 contrast ratio computation — pure W3C formula implementations.
 *
 * @remarks
 * Implements the W3C WCAG 2.x relative luminance and contrast ratio
 * algorithms as pure functions with no external dependencies. Types and
 * higher-level validation are in sibling modules.
 *
 * @see {@link https://www.w3.org/TR/WCAG22/#dfn-relative-luminance}
 * @see {@link https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio}
 *
 * @packageDocumentation
 */

import type { SrgbColour } from './contrast-types.js';

const HEX_COLOUR_PATTERN = /^#[0-9a-f]{6}$/iu;

/**
 * Parse a 6-digit hex colour string to normalised sRGB channel values.
 *
 * @param hex - CSS hex colour in `#rrggbb` format (case-insensitive)
 * @returns Channel values normalised to the 0–1 range
 * @throws Error if the input is not a valid 6-digit hex colour
 */
export function hexToSrgb(hex: string): SrgbColour {
  if (!HEX_COLOUR_PATTERN.test(hex)) {
    throw new Error(`Invalid hex colour "${hex}": expected #rrggbb format`);
  }

  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  return { r, g, b };
}

/**
 * Linearise a single sRGB channel value using the WCAG 2.x transfer function.
 *
 * @remarks
 * Values at or below 0.04045 use a linear segment; above that threshold
 * the standard gamma-expansion formula applies.
 *
 * @param channel - sRGB channel value in the 0–1 range
 * @returns Linear-light channel value
 */
function linearise(channel: number): number {
  if (channel <= 0.04045) {
    return channel / 12.92;
  }

  return ((channel + 0.055) / 1.055) ** 2.4;
}

/**
 * Compute WCAG 2.x relative luminance from sRGB channel values.
 *
 * @see {@link https://www.w3.org/TR/WCAG22/#dfn-relative-luminance}
 *
 * @param rgb - sRGB colour with channels normalised to 0–1
 * @returns Relative luminance in the 0–1 range
 */
export function srgbToRelativeLuminance(rgb: SrgbColour): number {
  return 0.2126 * linearise(rgb.r) + 0.7152 * linearise(rgb.g) + 0.0722 * linearise(rgb.b);
}

/**
 * Compute the WCAG 2.x contrast ratio between two relative luminance values.
 *
 * @remarks
 * The formula is `(L_lighter + 0.05) / (L_darker + 0.05)`. The function
 * accepts luminance values in either order.
 *
 * @param l1 - Relative luminance of the first colour
 * @param l2 - Relative luminance of the second colour
 * @returns Contrast ratio (always ≥ 1)
 */
export function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check whether a contrast ratio meets WCAG 2.2 AA for text.
 *
 * @remarks
 * Normal text requires 4.5:1. Large text (at least 18pt or 14pt bold)
 * requires 3:1 per WCAG 2.2 Success Criterion 1.4.3.
 *
 * @param ratio - The computed contrast ratio
 * @param textSize - Whether the text is 'normal' or 'large'
 * @returns True if the ratio meets the AA threshold
 */
export function checkWcagAA(ratio: number, textSize: 'normal' | 'large'): boolean {
  const threshold = textSize === 'large' ? 3 : 4.5;

  return ratio >= threshold;
}

/**
 * Check whether a contrast ratio meets WCAG 2.2 AA for non-text elements.
 *
 * @remarks
 * UI components and graphical objects require 3:1 per
 * WCAG 2.2 Success Criterion 1.4.11.
 *
 * @param ratio - The computed contrast ratio
 * @returns True if the ratio meets the 3:1 threshold
 */
export function checkNonTextContrast(ratio: number): boolean {
  return ratio >= 3;
}
