/**
 * The canonical measurement widths (DDR-009, owner-directed 2026-08-10):
 * every fidelity capture, geometry probe, and visual comparison measures at
 * these CSS-pixel viewport widths, so that "looks the same" is judged at the
 * same places every time and coverage is an argument rather than a habit.
 * The DDR governs the discipline; this module owns the values.
 *
 * The set is DERIVED, not invented. Sources, in order of authority:
 *
 * - the kit's single width seam — `@media (max-width: 840px)` switches the
 *   canvas and main grids to their -narrow maps, so the seam needs proving
 *   from BOTH sides;
 * - the WCAG 2.2 SC 1.4.10 reflow floor (320 CSS px) — contractual, not
 *   stylistic: the narrowest width the page must serve without horizontal
 *   scroll;
 * - the device landscape — the widths real visitors actually hold;
 * - the export demo's design canvas (1440), the width the reference
 *   pixels were drawn at and the existing fidelity-capture convention.
 *
 * Each entry carries its warrant so a report can print WHY a cell exists.
 * Adding a width means naming the failure class the current set misses;
 * removing one means naming which entry's class another cell now covers.
 */
import { err, ok, type Result } from '@oaknational/result';

export interface MeasurementWidth {
  /** Viewport width in CSS pixels. */
  readonly width: number;
  /** Short stable name for report columns and file names. */
  readonly label: string;
  /** The distinct failure class this width exists to catch. */
  readonly warrant: string;
}

export const MEASUREMENT_WIDTHS: readonly MeasurementWidth[] = [
  {
    width: 320,
    label: 'reflow-floor',
    warrant:
      'WCAG 2.2 SC 1.4.10: the narrowest supported width — catches horizontal overflow and wrap collapse',
  },
  {
    width: 390,
    label: 'phone',
    warrant: 'dominant handset class — the width most real visitors hold',
  },
  {
    width: 768,
    label: 'tablet-portrait',
    warrant:
      "widest common device under the kit's 840px seam — proves the -narrow maps at their upper edge",
  },
  {
    width: 1024,
    label: 'seam-wide',
    warrant: 'first common width past the 840px seam — proves the wide maps at their lower edge',
  },
  {
    width: 1280,
    label: 'switchboard-canvas',
    warrant:
      "the export switchboard's framed canvas — the picker-parity cell: side-by-side demo comparison happens here (dated amendment 2026-08-10, owner-directed)",
  },
  {
    width: 1440,
    label: 'canvas',
    warrant:
      'the export demo design canvas and existing fidelity convention — the primary comparison cell',
  },
  {
    width: 1920,
    label: 'wide-desktop',
    warrant: 'full-HD — proves container max-widths and gutter absorption at the wide extreme',
  },
] as const;

/** The bare width values, ascending — for capture loops. */
export const MEASUREMENT_WIDTH_VALUES: readonly number[] = MEASUREMENT_WIDTHS.map(
  (entry) => entry.width,
);

/** Refuse a free-hand capture width (DDR-009's enforcement seam): two
 *  captures of the same pair are comparable only when taken at the same
 *  places, so the tooling accepts canonical widths and nothing else. The
 *  error carries the set, so the cure is in the message. */
export function assertCanonicalWidth(width: number): Result<number, string> {
  if (MEASUREMENT_WIDTH_VALUES.includes(width)) {
    return ok(width);
  }
  return err(
    `width ${width} is not a canonical measurement width (DDR-009) — use one of: ${MEASUREMENT_WIDTH_VALUES.join(
      ', ',
    )}`,
  );
}
