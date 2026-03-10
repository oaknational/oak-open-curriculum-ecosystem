/**
 * Pure functions for parsing OWA sitemaps and categorising teacher-facing URLs.
 *
 * @remarks
 * Extracted from the sitemap scanning script so the categorisation logic is
 * testable without network IO. The entry point (`sitemap-scanner.ts`) handles
 * fetching and file output. Route patterns are derived from the OWA Next.js
 * pages router at `Oak-Web-Application/src/pages/teachers/`.
 *
 * @see ADR-047 Canonical URL Generation at Codegen Time
 * @see ADR-132 Sitemap Scanner for Canonical URL Validation
 * @see sitemap-scanner-types.ts for type definitions
 *
 * @packageDocumentation
 */

export type { SitemapCategorisation } from './sitemap-scanner-types.js';

import type { SitemapCategorisation } from './sitemap-scanner-types.js';

/** Optional sub-page suffix shared across lesson route patterns */
const SUB_PAGE = '(?:\\/(?:downloads|media|share))?\\/??$';

/** Secondary regex to extract a lesson slug from deep specialist/beta paths */
const LESSON_IN_PATH = /\/lessons\/([^/]+)(?:\/(?:downloads|media|share))?\/?$/;

// --- Route dispatch table ---

interface RouteAccumulators {
  lessonSlugs: Set<string>;
  programmeSlugs: Set<string>;
  sequenceSlugs: Set<string>;
  specialistProgrammeSlugs: Set<string>;
  betaProgrammeSlugs: Set<string>;
  unitToProgramme: Map<string, string>;
  lessonToProgrammeUnit: Map<string, { programmeSlug: string; unitSlug: string }>;
  subjectToKeyStages: Map<string, string[]>;
}

interface RouteRule {
  readonly pattern: RegExp;
  readonly handle: (match: RegExpMatchArray, acc: RouteAccumulators, path: string) => void;
}

const TEACHER_ROUTES: readonly RouteRule[] = [
  // /teachers/lessons/{slug}[/downloads|media|share]
  {
    pattern: new RegExp(`^\\/teachers\\/lessons\\/([^/]+)${SUB_PAGE}`),
    handle: (m, acc) => void acc.lessonSlugs.add(m[1]),
  },
  // /teachers/programmes/{p}/units/{u}/lessons/{l}[/sub-page]
  {
    pattern: new RegExp(
      `^\\/teachers\\/programmes\\/([^/]+)\\/units\\/([^/]+)\\/lessons\\/([^/]+)${SUB_PAGE}`,
    ),
    handle: (m, acc) => {
      const [, prog, unit, lesson] = m;
      acc.programmeSlugs.add(prog);
      acc.unitToProgramme.set(unit, prog);
      acc.lessonToProgrammeUnit.set(lesson, { programmeSlug: prog, unitSlug: unit });
      acc.lessonSlugs.add(lesson);
    },
  },
  // /teachers/programmes/{p}/units/{u}/lessons (listing)
  {
    pattern: /^\/teachers\/programmes\/([^/]+)\/units\/([^/]+)\/lessons\/?$/,
    handle: (m, acc) => {
      acc.programmeSlugs.add(m[1]);
      acc.unitToProgramme.set(m[2], m[1]);
    },
  },
  // /teachers/programmes/{p}/units
  {
    pattern: /^\/teachers\/programmes\/([^/]+)\/units\/?$/,
    handle: (m, acc) => void acc.programmeSlugs.add(m[1]),
  },
  // /teachers/programmes/{p} (root)
  {
    pattern: /^\/teachers\/programmes\/([^/]+)\/?$/,
    handle: (m, acc) => void acc.programmeSlugs.add(m[1]),
  },
  // /teachers/key-stages/{ks}/subjects/{subj}/programmes
  {
    pattern: /^\/teachers\/key-stages\/([^/]+)\/subjects\/([^/]+)\/programmes\/?$/,
    handle: (m, acc) => {
      const [, ks, subject] = m;
      const existing = acc.subjectToKeyStages.get(subject);
      if (existing) {
        if (!existing.includes(ks)) {
          existing.push(ks);
        }
      } else {
        acc.subjectToKeyStages.set(subject, [ks]);
      }
    },
  },
  // /teachers/curriculum/{slug}/units (sequence listing)
  {
    pattern: /^\/teachers\/curriculum\/([^/]+)\/units\/?$/,
    handle: (m, acc) => void acc.sequenceSlugs.add(m[1]),
  },
  // /teachers/curriculum/{slug}/... (catch-all deeper paths)
  {
    pattern: /^\/teachers\/curriculum\/([^/]+)\/.+$/,
    handle: (m, acc) => void acc.sequenceSlugs.add(m[1]),
  },
  // /teachers/specialist/programmes/{p}[/...]
  {
    pattern: /^\/teachers\/specialist\/programmes\/([^/]+)(?:\/.*)?$/,
    handle: (m, acc, path) => {
      acc.specialistProgrammeSlugs.add(m[1]);
      const lesson = path.match(LESSON_IN_PATH);
      if (lesson) {
        acc.lessonSlugs.add(lesson[1]);
      }
    },
  },
  // /teachers/beta/programmes/{p}[/...]
  {
    pattern: /^\/teachers\/beta\/programmes\/([^/]+)(?:\/.*)?$/,
    handle: (m, acc, path) => {
      acc.betaProgrammeSlugs.add(m[1]);
      const lesson = path.match(LESSON_IN_PATH);
      if (lesson) {
        acc.lessonSlugs.add(lesson[1]);
      }
    },
  },
  // /teachers/beta/lessons/{slug}[/downloads|media]
  {
    pattern: /^\/teachers\/beta\/lessons\/([^/]+)(?:\/(?:downloads|media))?\/?$/,
    handle: (m, acc) => void acc.lessonSlugs.add(m[1]),
  },
];

/**
 * Extract `<loc>` values from a sitemap XML string.
 *
 * @remarks
 * Uses regex extraction — assumes well-formed, non-CDATA sitemaps.
 * Empty or self-closing `<loc>` tags are silently skipped.
 *
 * @param xmlText - Raw sitemap XML content
 * @returns Array of URL strings found in `<loc>` elements
 */
export function extractLocs(xmlText: string): string[] {
  const locs: string[] = [];
  const re = /<loc>\s*([^<]+)\s*<\/loc>/gim;
  let match: RegExpExecArray | null;
  while ((match = re.exec(xmlText)) !== null) {
    locs.push(match[1].trim());
  }
  return locs;
}

/**
 * Categorise teacher URL paths extracted from the OWA sitemap.
 *
 * @remarks
 * Uses a table-driven dispatch: each path is tested against the route table
 * in most-specific-first order. The first matching rule handles the path.
 * Static pages and uncategorised paths are included in `teacherPaths` but
 * do not contribute to slug maps.
 *
 * @param paths - Teacher URL paths relative to base, starting with `/teachers/`
 * @returns Categorised result with slug lookups and a flat sorted path array
 */
export function categoriseTeacherPaths(paths: readonly string[]): SitemapCategorisation {
  const acc: RouteAccumulators = {
    lessonSlugs: new Set(),
    programmeSlugs: new Set(),
    sequenceSlugs: new Set(),
    specialistProgrammeSlugs: new Set(),
    betaProgrammeSlugs: new Set(),
    unitToProgramme: new Map(),
    lessonToProgrammeUnit: new Map(),
    subjectToKeyStages: new Map(),
  };

  for (const p of paths) {
    for (const rule of TEACHER_ROUTES) {
      const m = p.match(rule.pattern);
      if (m) {
        rule.handle(m, acc, p);
        break;
      }
    }
  }

  const sorted = (s: Set<string>) => [...s].sort();

  return {
    teacherPaths: [...paths].sort(),
    totals: {
      teacherUrls: paths.length,
      lessons: acc.lessonSlugs.size,
      programmes: acc.programmeSlugs.size,
      sequences: acc.sequenceSlugs.size,
      units: acc.unitToProgramme.size,
      specialistProgrammes: acc.specialistProgrammeSlugs.size,
      betaProgrammes: acc.betaProgrammeSlugs.size,
      uniqueSubjects: acc.subjectToKeyStages.size,
    },
    lessonSlugs: sorted(acc.lessonSlugs),
    programmeSlugs: sorted(acc.programmeSlugs),
    sequenceSlugs: sorted(acc.sequenceSlugs),
    specialistProgrammeSlugs: sorted(acc.specialistProgrammeSlugs),
    betaProgrammeSlugs: sorted(acc.betaProgrammeSlugs),
    unitToProgramme: Object.fromEntries(acc.unitToProgramme),
    lessonToProgrammeUnit: Object.fromEntries(acc.lessonToProgrammeUnit),
    subjectToKeyStages: Object.fromEntries(acc.subjectToKeyStages),
  };
}

/**
 * Validate that a scan result contains the expected URL pattern categories.
 *
 * @remarks
 * Used by the `--validate` CLI flag to confirm the live site still serves
 * the URL patterns that canonical URL generators depend on.
 *
 * @param result - The categorisation result to validate
 * @returns Array of validation error messages (empty if valid)
 */
export function validateScanResult(result: SitemapCategorisation): string[] {
  const errors: string[] = [];
  if (result.totals.lessons === 0) {
    errors.push('No lesson paths found. Expected /teachers/lessons/ URLs in sitemap.');
  }
  if (result.totals.programmes === 0) {
    errors.push('No programme paths found. Expected /teachers/programmes/ URLs in sitemap.');
  }
  if (result.totals.sequences === 0) {
    errors.push(
      'No curriculum sequence paths found. Expected /teachers/curriculum/{slug}/units URLs.',
    );
  }
  return errors;
}
