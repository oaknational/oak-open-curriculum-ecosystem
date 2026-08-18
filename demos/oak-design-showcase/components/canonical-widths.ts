/**
 * The canonical measurement widths as client-safe data (DDR-009). The
 * values DERIVE from the authoritative module (tools/measurement-widths.ts
 * is framework-free, so client code imports it directly) — one source, no
 * drift to detect. Only the owner-facing labels are authored here.
 */
import { MEASUREMENT_WIDTH_VALUES } from '../tools/measurement-widths';

export const VIEWPORT_WIDTHS: readonly number[] = MEASUREMENT_WIDTH_VALUES;

/** Owner-facing option labels: the width plus its warrant's short name,
 *  humanised from the canonical entries' labels. */
export const VIEWPORT_WIDTH_LABELS: Readonly<Record<string, string>> = {
  '320': '320 px — reflow floor',
  '390': '390 px — phone',
  '768': '768 px — tablet portrait',
  '1024': '1024 px — past the seam',
  '1280': '1280 px — switchboard canvas',
  '1440': '1440 px — design canvas',
  '1920': '1920 px — wide desktop',
};

/** The design-canvas cell — the side-by-side's simulated viewport
 *  (DDR-009's primary comparison cell). */
export const DEFAULT_VIEWPORT_WIDTH = 1440;

/** The export switchboard's framed canvas — the picker opens here so the
 *  two demos read identically side by side (DDR-009 dated amendment,
 *  2026-08-10: a same-width pair is the only fair visual comparison). */
export const SWITCHBOARD_CANVAS_WIDTH = 1280;
