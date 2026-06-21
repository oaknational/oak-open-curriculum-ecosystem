/**
 * Type surface for the markdown-links validator. The data shapes live here so
 * the pure-logic helper module stays focused on behaviour; both the helpers and
 * the CLI entry consume these types.
 *
 * @packageDocumentation
 */

/** A markdown file to scan. */
export interface ScanFile {
  /** Repo-relative POSIX path. */
  readonly path: string;
  readonly content: string;
}

/** A single internal markdown link extracted from a source file. */
export interface ExtractedLink {
  /** The raw link target as written (fragment/title not yet stripped). */
  readonly rawTarget: string;
  /** 1-based line number of the link. */
  readonly line: number;
}

/** A broken internal `.md` link with an optional auto-correction suggestion. */
export interface BrokenLink {
  /** The raw target as written in the source markdown. */
  readonly writtenTarget: string;
  /** Repo-relative POSIX path the target resolved to. */
  readonly resolvedTarget: string;
  /** 1-based line number of the link in the source file. */
  readonly line: number;
  /**
   * Corrected target (relative to the source dir) when exactly one non-archive
   * file with the target's basename exists, else `null` (zero → deleted/renamed;
   * multiple → ambiguous; both manual).
   */
  readonly suggestedFix: string | null;
}

/** Broken links for a single source file. */
export interface BrokenLinksByFile {
  readonly sourcePath: string;
  readonly links: readonly BrokenLink[];
}

/** Aggregate totals for a validator run (internal; surfaced via `MarkdownLinkReport.totals`). */
interface MarkdownLinkTotals {
  readonly filesScanned: number;
  readonly linksChecked: number;
  readonly brokenLinks: number;
  /** Broken links carrying a unique-basename suggestion. */
  readonly autoFixable: number;
  /** Broken links with no suggestion (manual remediation). */
  readonly manual: number;
}

/** The full report model produced by `findBrokenLinks`. */
export interface MarkdownLinkReport {
  readonly broken: readonly BrokenLink[];
  readonly byFile: readonly BrokenLinksByFile[];
  readonly totals: MarkdownLinkTotals;
}
