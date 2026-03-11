/**
 * Type definitions for the OWA sitemap scanner.
 *
 * @remarks
 * These types define the shape of the categorised sitemap data written
 * to `reference/canonical-url-map.json`. The primary consumer is URL
 * validation at codegen time — any canonical URL constructed from the
 * API that does not appear in `teacherPaths` can be instantly rejected.
 *
 * @see sitemap-scanner-core.ts for the categorisation logic
 * @see sitemap-scanner.ts for the entry point
 *
 * @packageDocumentation
 */

/**
 * Result of categorising teacher URL paths from the OWA sitemap.
 *
 * @remarks
 * The primary deliverable is `teacherPaths` — a sorted array of every
 * teacher-facing URL path. This serves as a validation superset: any
 * canonical URL constructed from the API that does not appear in this
 * list can be instantly rejected.
 *
 * The slug maps provide structural metadata for diagnostics and for
 * future codegen consumers that need slug to path lookups.
 */
export interface SitemapCategorisation {
  /** All teacher URL paths (relative to base), sorted lexicographically */
  readonly teacherPaths: readonly string[];

  /** Summary counts by category */
  readonly totals: {
    readonly teacherUrls: number;
    readonly lessons: number;
    readonly programmes: number;
    readonly sequences: number;
    readonly units: number;
    readonly specialistProgrammes: number;
    readonly betaProgrammes: number;
    readonly uniqueSubjects: number;
  };

  /** Unique lesson slugs from all contexts (direct, programme, beta) */
  readonly lessonSlugs: readonly string[];

  /** Unique programme slugs from standard `/teachers/programmes/` routes */
  readonly programmeSlugs: readonly string[];

  /** Unique curriculum sequence slugs (e.g. maths-primary, science-secondary-aqa) */
  readonly sequenceSlugs: readonly string[];

  /** Programme slugs from `/teachers/specialist/programmes/` routes */
  readonly specialistProgrammeSlugs: readonly string[];

  /** Programme slugs from `/teachers/beta/programmes/` routes */
  readonly betaProgrammeSlugs: readonly string[];

  /**
   * Unit slug to parent programme slug.
   * Keys are runtime-extracted slugs from an external source (OWA sitemap).
   * Last-wins policy: if the same unit appears under multiple programmes, the
   * last-encountered programme is stored.
   */
  readonly unitToProgramme: Readonly<Record<string, string>>;

  /**
   * Lesson slug to parent programme + unit context.
   * Keys are runtime-extracted slugs from an external source (OWA sitemap).
   * Last-wins policy: if the same lesson appears under multiple programmes,
   * the last-encountered programme/unit pair is stored.
   */
  readonly lessonToProgrammeUnit: Readonly<
    Record<string, { readonly programmeSlug: string; readonly unitSlug: string }>
  >;

  /**
   * Subject slug to key stage slugs where it appears.
   * Keys are runtime-extracted slugs from an external source (OWA sitemap).
   */
  readonly subjectToKeyStages: Readonly<Record<string, readonly string[]>>;
}

/**
 * Full scan output written to the reference JSON file.
 *
 * @remarks
 * Extends the categorisation with metadata about when and where the
 * scan was performed.
 */
export interface SitemapScanOutput extends SitemapCategorisation {
  /** ISO 8601 timestamp when the scan was performed */
  readonly generatedAt: string;

  /** Base URL of the site (e.g. `https://www.thenational.academy`) */
  readonly base: string;
}
