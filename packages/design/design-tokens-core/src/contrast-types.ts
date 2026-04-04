/**
 * Type definitions for WCAG contrast manifest, report, and colour models.
 *
 * @packageDocumentation
 */

/**
 * Normalised sRGB colour with channels in the 0–1 range.
 */
export interface SrgbColour {
  /** Red channel (0–1). */
  readonly r: number;
  /** Green channel (0–1). */
  readonly g: number;
  /** Blue channel (0–1). */
  readonly b: number;
}

/**
 * A pair of foreground and background tokens to check for contrast compliance.
 */
export interface ContrastPair {
  /** Token dot-path for the foreground colour (e.g. `"semantic.text-primary"`). */
  readonly foreground: string;
  /** Token dot-path for the background colour (e.g. `"semantic.surface-page"`). */
  readonly background: string;
  /**
   * Which WCAG criterion applies to this pairing, or `'informational'` to
   * compute the ratio without applying a pass/fail gate.
   */
  readonly context: 'text' | 'non-text' | 'large-text' | 'informational';
}

/**
 * A triad of foreground, middle-ground, and background tokens.
 *
 * @remarks
 * Models layered UI elements (e.g. button text on button surface on page
 * surface) where all three pairwise ratios must pass their applicable
 * WCAG criterion independently.
 */
export interface ContrastTriad {
  /** Token dot-path for the innermost foreground (e.g. button text). */
  readonly foreground: string;
  /** Token dot-path for the middle surface (e.g. button background). */
  readonly middle: string;
  /** Token dot-path for the outermost background (e.g. page surface). */
  readonly background: string;
  /** Which WCAG criterion applies to each pair within the triad. */
  readonly contexts: {
    /** Foreground on middle (e.g. button text on button surface). */
    readonly fgMid: 'text' | 'non-text' | 'large-text';
    /** Middle on background (e.g. button surface on page). */
    readonly midBg: 'non-text';
    /**
     * Foreground on background — informational when the middle layer is
     * opaque (e.g. button text vs page). Set to `'informational'` to
     * compute the ratio in the report without applying a WCAG gate.
     * Set to a context value to apply the gate (e.g. when the middle
     * layer is translucent).
     */
    readonly fgBg: 'text' | 'non-text' | 'large-text' | 'informational';
  };
}

/**
 * Human-authored manifest declaring which token pairs to validate.
 */
export interface ContrastManifest {
  /** Simple foreground/background pairs. */
  readonly pairs: readonly ContrastPair[];
  /** Three-layer triads expanded into pairwise checks. */
  readonly triads: readonly ContrastTriad[];
}

/**
 * A single contrast check result within the report.
 */
export interface ContrastReportEntry {
  /** Token dot-path for the foreground colour. */
  readonly foreground: string;
  /** Token dot-path for the background colour. */
  readonly background: string;
  /** Resolved hex value of the foreground colour. */
  readonly foregroundHex: string;
  /** Resolved hex value of the background colour. */
  readonly backgroundHex: string;
  /** Computed contrast ratio, rounded to two decimal places. */
  readonly ratio: number;
  /** The WCAG AA threshold that applies (4.5 or 3). */
  readonly requiredRatio: number;
  /** Which WCAG criterion was applied, or `'informational'` if no gate. */
  readonly context: 'text' | 'non-text' | 'large-text' | 'informational';
  /** Whether the pairing meets its applicable WCAG AA threshold. Always true for informational entries. */
  readonly pass: boolean;
}

/**
 * Error returned when a manifest token path cannot be resolved to a hex value.
 *
 * @remarks
 * Indicates a human authoring error in the contrast-pairings manifest:
 * a foreground or background token path was declared but does not exist
 * in the merged token tree.
 */
export interface ContrastValidationError {
  /** Discriminant for error routing. */
  readonly kind: 'unresolved_token';
  /** The foreground token dot-path from the manifest entry. */
  readonly foreground: string;
  /** The background token dot-path from the manifest entry. */
  readonly background: string;
}

/**
 * Machine-generated contrast validation report.
 */
export interface ContrastReport {
  /** ISO 8601 timestamp of report generation. */
  readonly timestamp: string;
  /** Theme identifier (e.g. `"light"`, `"dark"`). */
  readonly theme: string;
  /** Individual check results for every pairing. */
  readonly results: readonly ContrastReportEntry[];
  /** Aggregate pass/fail counts. */
  readonly summary: {
    readonly total: number;
    readonly passed: number;
    readonly failed: number;
  };
}
