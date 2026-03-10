import { describe, it, expect } from 'vitest';

import { extractLocs, categoriseTeacherPaths, validateScanResult } from './sitemap-scanner-core.js';

describe('extractLocs', () => {
  it('extracts loc values from sitemap XML', () => {
    const xml = `<?xml version="1.0"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.thenational.academy/teachers/lessons/foo</loc></url>
  <url><loc>https://www.thenational.academy/teachers/lessons/bar</loc></url>
</urlset>`;

    expect(extractLocs(xml)).toEqual([
      'https://www.thenational.academy/teachers/lessons/foo',
      'https://www.thenational.academy/teachers/lessons/bar',
    ]);
  });

  it('trims whitespace from loc values', () => {
    const xml = '<url><loc>  https://example.com/page  </loc></url>';

    expect(extractLocs(xml)).toEqual(['https://example.com/page']);
  });

  it('returns empty array when no locs present', () => {
    expect(extractLocs('<urlset></urlset>')).toEqual([]);
  });

  it('ignores empty and self-closing loc tags', () => {
    const xml = '<url><loc></loc></url><url><loc/></url><url><loc>https://ok.com</loc></url>';

    expect(extractLocs(xml)).toEqual(['https://ok.com']);
  });
});

describe('categoriseTeacherPaths', () => {
  it('extracts lesson slugs from direct lesson paths', () => {
    const result = categoriseTeacherPaths([
      '/teachers/lessons/adding-fractions',
      '/teachers/lessons/adding-fractions/downloads',
      '/teachers/lessons/adding-fractions/media',
      '/teachers/lessons/adding-fractions/share',
    ]);

    expect(result.lessonSlugs).toEqual(['adding-fractions']);
    expect(result.totals.lessons).toBe(1);
  });

  it('extracts programme slugs from programme unit listing paths', () => {
    const result = categoriseTeacherPaths(['/teachers/programmes/maths-primary-year-1/units']);

    expect(result.programmeSlugs).toContain('maths-primary-year-1');
    expect(result.totals.programmes).toBe(1);
  });

  it('extracts programme slugs from programme root paths', () => {
    const result = categoriseTeacherPaths(['/teachers/programmes/maths-primary-year-1']);

    expect(result.programmeSlugs).toContain('maths-primary-year-1');
  });

  it('maps units to parent programme from unit-lesson-listing paths', () => {
    const result = categoriseTeacherPaths([
      '/teachers/programmes/maths-primary-year-1/units/addition-and-subtraction/lessons',
    ]);

    expect(result.unitToProgramme['addition-and-subtraction']).toBe('maths-primary-year-1');
    expect(result.totals.units).toBe(1);
  });

  it('maps lessons to their parent programme and unit', () => {
    const result = categoriseTeacherPaths([
      '/teachers/programmes/maths-primary-year-1/units/addition-and-subtraction/lessons/adding-fractions',
    ]);

    expect(result.lessonToProgrammeUnit['adding-fractions']).toEqual({
      programmeSlug: 'maths-primary-year-1',
      unitSlug: 'addition-and-subtraction',
    });
    expect(result.lessonSlugs).toContain('adding-fractions');
  });

  it('handles programme lesson sub-pages (downloads, media, share)', () => {
    const result = categoriseTeacherPaths([
      '/teachers/programmes/maths-primary-year-1/units/addition/lessons/adding-fractions/downloads',
      '/teachers/programmes/maths-primary-year-1/units/addition/lessons/adding-fractions/media',
      '/teachers/programmes/maths-primary-year-1/units/addition/lessons/adding-fractions/share',
    ]);

    expect(result.lessonSlugs).toEqual(['adding-fractions']);
    expect(result.lessonToProgrammeUnit['adding-fractions']).toEqual({
      programmeSlug: 'maths-primary-year-1',
      unitSlug: 'addition',
    });
  });

  it('groups key stages by subject (uniqueSubjects counts distinct subjects)', () => {
    const result = categoriseTeacherPaths([
      '/teachers/key-stages/ks3/subjects/maths/programmes',
      '/teachers/key-stages/ks4/subjects/maths/programmes',
    ]);

    expect(result.subjectToKeyStages['maths']).toEqual(['ks3', 'ks4']);
    expect(result.totals.uniqueSubjects).toBe(1);
  });

  it('deduplicates key-stage entries for the same subject', () => {
    const result = categoriseTeacherPaths([
      '/teachers/key-stages/ks3/subjects/maths/programmes',
      '/teachers/key-stages/ks3/subjects/maths/programmes',
    ]);

    expect(result.subjectToKeyStages['maths']).toEqual(['ks3']);
  });

  it('handles a subject appearing in a single key stage', () => {
    const result = categoriseTeacherPaths(['/teachers/key-stages/ks2/subjects/english/programmes']);

    expect(result.subjectToKeyStages['english']).toEqual(['ks2']);
    expect(result.totals.uniqueSubjects).toBe(1);
  });

  it('extracts curriculum sequence slugs', () => {
    const result = categoriseTeacherPaths([
      '/teachers/curriculum/maths-primary/units',
      '/teachers/curriculum/science-secondary-aqa/units',
    ]);

    expect(result.sequenceSlugs).toEqual(['maths-primary', 'science-secondary-aqa']);
    expect(result.totals.sequences).toBe(2);
  });

  it('handles curriculum catch-all paths beyond /units', () => {
    const result = categoriseTeacherPaths([
      '/teachers/curriculum/maths-primary/units',
      '/teachers/curriculum/maths-primary/some/deep/page',
    ]);

    expect(result.sequenceSlugs).toEqual(['maths-primary']);
  });

  it('captures slug from curriculum catch-all deeper paths', () => {
    const result = categoriseTeacherPaths(['/teachers/curriculum/previous-downloads/something']);

    expect(result.sequenceSlugs).toContain('previous-downloads');
  });

  it('does not capture /teachers/curriculum/{slug} without a deeper path', () => {
    const result = categoriseTeacherPaths(['/teachers/curriculum/previous-downloads']);

    expect(result.sequenceSlugs).toHaveLength(0);
    expect(result.teacherPaths).toContain('/teachers/curriculum/previous-downloads');
  });

  it('extracts specialist programme slugs', () => {
    const result = categoriseTeacherPaths([
      '/teachers/specialist/programmes/communication-and-language/units',
      '/teachers/specialist/programmes/communication-and-language/units/greetings/lessons',
      '/teachers/specialist/programmes/communication-and-language/units/greetings/lessons/hello/downloads',
    ]);

    expect(result.specialistProgrammeSlugs).toEqual(['communication-and-language']);
    expect(result.totals.specialistProgrammes).toBe(1);
  });

  it('extracts lesson slugs from specialist programme lesson paths', () => {
    const result = categoriseTeacherPaths([
      '/teachers/specialist/programmes/speech-therapy/units/verbal/lessons/reasoning-skills',
      '/teachers/specialist/programmes/speech-therapy/units/verbal/lessons/reasoning-skills/downloads',
    ]);

    expect(result.lessonSlugs).toContain('reasoning-skills');
    expect(result.specialistProgrammeSlugs).toEqual(['speech-therapy']);
  });

  it('extracts lesson slugs from beta programme lesson paths', () => {
    const result = categoriseTeacherPaths([
      '/teachers/beta/programmes/maths-year-1/units/addition/lessons/adding-ones',
    ]);

    expect(result.lessonSlugs).toContain('adding-ones');
    expect(result.betaProgrammeSlugs).toEqual(['maths-year-1']);
  });

  it('extracts beta programme slugs', () => {
    const result = categoriseTeacherPaths([
      '/teachers/beta/programmes/maths-primary-year-1/units',
      '/teachers/beta/programmes/maths-primary-year-1/units/addition/lessons',
    ]);

    expect(result.betaProgrammeSlugs).toEqual(['maths-primary-year-1']);
    expect(result.totals.betaProgrammes).toBe(1);
  });

  it('extracts lesson slugs from beta lesson paths', () => {
    const result = categoriseTeacherPaths([
      '/teachers/beta/lessons/adding-fractions',
      '/teachers/beta/lessons/adding-fractions/downloads',
      '/teachers/beta/lessons/adding-fractions/media',
    ]);

    expect(result.lessonSlugs).toEqual(['adding-fractions']);
  });

  it('includes all paths in teacherPaths, sorted', () => {
    const paths = [
      '/teachers/lessons/z-lesson',
      '/teachers/lessons/a-lesson',
      '/teachers/programmes/maths/units',
    ];
    const result = categoriseTeacherPaths(paths);

    expect(result.teacherPaths).toEqual([
      '/teachers/lessons/a-lesson',
      '/teachers/lessons/z-lesson',
      '/teachers/programmes/maths/units',
    ]);
  });

  it('counts total teacher URLs', () => {
    const paths = [
      '/teachers/lessons/adding-fractions',
      '/teachers/lessons/adding-fractions/downloads',
      '/teachers/search',
    ];
    const result = categoriseTeacherPaths(paths);

    expect(result.totals.teacherUrls).toBe(3);
  });

  it('handles static teacher pages without crashing', () => {
    const result = categoriseTeacherPaths([
      '/teachers',
      '/teachers/search',
      '/teachers/my-library',
    ]);

    expect(result.teacherPaths).toHaveLength(3);
    expect(result.lessonSlugs).toHaveLength(0);
  });
});

describe('validateScanResult', () => {
  it('returns no errors for a scan with all expected patterns', () => {
    const result = categoriseTeacherPaths([
      '/teachers/lessons/adding-fractions',
      '/teachers/programmes/maths-y1/units',
      '/teachers/curriculum/maths-primary/units',
    ]);
    expect(validateScanResult(result)).toEqual([]);
  });

  it('returns error when no lessons found', () => {
    const result = categoriseTeacherPaths([
      '/teachers/programmes/maths-y1/units',
      '/teachers/curriculum/maths-primary/units',
    ]);
    const errors = validateScanResult(result);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/lesson/i);
  });

  it('returns error when no programmes found', () => {
    const result = categoriseTeacherPaths(['/teachers/lessons/adding-fractions']);
    const errors = validateScanResult(result);
    expect(errors.some((e) => /programme/i.test(e))).toBe(true);
  });

  it('returns error when no sequences found', () => {
    const result = categoriseTeacherPaths([
      '/teachers/lessons/adding-fractions',
      '/teachers/programmes/maths-y1/units',
    ]);
    const errors = validateScanResult(result);
    expect(errors.some((e) => /sequence/i.test(e))).toBe(true);
  });

  it('returns multiple errors when multiple patterns missing', () => {
    const result = categoriseTeacherPaths(['/teachers/search']);
    const errors = validateScanResult(result);
    expect(errors.length).toBeGreaterThanOrEqual(3);
  });
});
