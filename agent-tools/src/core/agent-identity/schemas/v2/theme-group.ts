/**
 * One themed pair of edge-noun columns for the v2 noun-verb-noun schema.
 *
 * @remarks
 * Lives in its own module so theme data files and the manifest can both
 * import it without a dependency cycle.
 */
export interface V2ThemeGroup {
  /** Stable group key emitted in derived identity results. */
  readonly group: string;
  /** First-column (subject) nouns: the largest, highest-salience column. */
  readonly subjectNouns: readonly string[];
  /** Last-column (object) nouns. */
  readonly objectNouns: readonly string[];
}
