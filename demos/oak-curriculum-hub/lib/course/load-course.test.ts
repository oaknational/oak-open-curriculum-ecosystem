import { describe, it, expect } from 'vitest';

import { oakCourse } from './load-course';

/**
 * Census of the loaded Oak Course content (`oak-course.json`, schema-validated at load) against
 * the canonical `Oak Course.dc.html`. These counts are the verified fixtures (4 units · 11 modules
 * + intro · 63 module-sections + 1 intro section · 214 blocks) — a discriminating guard that the
 * generator extracted the whole course, not a subset. A drift here means the export changed or the
 * extractor regressed; either is worth a look.
 */
const allModules = [oakCourse.intro, ...oakCourse.modules];
const allSections = allModules.flatMap((m) => m.sections);
const allBlocks = allSections.flatMap((s) => s.blocks);

describe('oakCourse census — structure', () => {
  it('has 4 units and 11 modules plus the intro pseudo-module', () => {
    expect(oakCourse.units).toHaveLength(4);
    expect(oakCourse.modules).toHaveLength(11);
    expect(oakCourse.intro.id).toBe('intro');
  });

  it('has 64 sections (63 module-sections + 1 intro section)', () => {
    expect(oakCourse.modules.flatMap((m) => m.sections)).toHaveLength(63);
    expect(oakCourse.intro.sections).toHaveLength(1);
    expect(allSections).toHaveLength(64);
  });

  it('has 214 content blocks total', () => {
    expect(allBlocks).toHaveLength(214);
  });
});

describe('oakCourse census — content', () => {
  it('matches the canonical block-type distribution', () => {
    const distribution: Record<string, number> = {};
    for (const block of allBlocks) {
      distribution[block.t] = (distribution[block.t] ?? 0) + 1;
    }
    expect(distribution).toEqual({
      text: 80,
      callout: 40,
      heading: 18,
      quiz: 17,
      compare: 12,
      tabs: 8,
      summary: 7,
      flip: 6,
      accordion: 6,
      stats: 5,
      image: 5,
      columns: 3,
      video: 2,
      videoimport: 1,
      sortable: 1,
      hotspot: 1,
      download: 1,
      coursemap: 1,
    });
  });

  it('links course QS-callouts to Standards via #qs= deep-link ids', () => {
    const qsCodes = allBlocks.flatMap((b) =>
      b.t === 'callout' ? [...(b.qs ?? []), ...(b.items ?? []).map((i) => i.qs)] : [],
    );
    expect(qsCodes.length).toBeGreaterThan(0);
    expect(qsCodes.every((code) => code.startsWith('QS-'))).toBe(true);
  });
});
