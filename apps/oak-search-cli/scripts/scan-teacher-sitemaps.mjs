#!/usr/bin/env node
/**
 * Sitemap scanner for Oak teachers-site canonical URL validation.
 *
 * Fetches and parses the OWA sitemaps to build a reference map of known
 * canonical URL patterns. Used as CI validation tooling to confirm that
 * generated URLs exist on the live site.
 *
 * This script is NOT a build dependency. It runs as a standalone validation
 * tool (optionally in CI) and writes reference data to `reference/canonical-url-map.json`.
 *
 * Usage:
 *   node scripts/scan-teacher-sitemaps.mjs            # Scan and write reference map
 *   node scripts/scan-teacher-sitemaps.mjs --validate # Exit non-zero if patterns are missing
 *
 * @see ADR-047 Canonical URL Generation at Codegen Time
 */

/* eslint-disable no-console */

const INDEX_URL = 'https://www.thenational.academy/sitemap.xml';

/** Extract <loc> values from a sitemap XML string */
function extractLocs(xmlText) {
  const locs = [];
  const re = /<loc>\s*([^<]+)\s*<\/loc>/gim;
  let m;
  while ((m = re.exec(xmlText)) !== null) {
    locs.push(m[1].trim());
  }
  return locs;
}

/** Fetch text with basic retry */
async function fetchText(url, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i += 1) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 250 * (i + 1)));
    }
  }
  throw lastErr;
}

function ensureArray(val) {
  return Array.isArray(val) ? val : [...new Set(val ? [val] : [])];
}

async function main() {
  const args = process.argv.slice(2);
  const validateMode = args.includes('--validate');

  console.log('Scanning sitemap index:', INDEX_URL);
  const rootXml = await fetchText(INDEX_URL);
  const rootLocs = extractLocs(rootXml);
  const teacherSitemaps = rootLocs.filter((u) => u.includes('/teachers/'));

  const teacherUrls = new Set();
  for (const smUrl of teacherSitemaps) {
    try {
      const xml = await fetchText(smUrl);
      for (const loc of extractLocs(xml)) {
        if (loc.includes('/teachers/')) teacherUrls.add(loc);
      }
    } catch (err) {
      console.warn('Failed to read sitemap:', smUrl, String(err));
    }
  }

  const base = 'https://www.thenational.academy';

  // Legacy programme routes (programme-level pages, distinct from curriculum/sequence pages)
  const lessonToPath = {};
  const lessonToProgrammeUnit = {};
  const unitToProgramme = {};
  const subjectToKeyStages = {};
  const programmeSet = new Set();

  // Curriculum routes (sequences and units under /teachers/curriculum/)
  const sequenceToPath = {};
  const unitToSequence = {};

  for (const url of teacherUrls) {
    const path = url.replace(base, '');

    // /teachers/lessons/{lessonSlug} and variants
    let m = path.match(/^\/teachers\/lessons\/([^/]+)(?:\/?|\/.*)$/);
    if (m) {
      const lessonSlug = m[1];
      lessonToPath[lessonSlug] = `/teachers/lessons/${lessonSlug}`;
    }

    // /teachers/programmes/{programmeSlug} (programme-level pages)
    m = path.match(/^\/teachers\/programmes\/([^/]+)(?:\/?|\/.*)$/);
    if (m) {
      programmeSet.add(m[1]);
    }

    // /teachers/programmes/{programmeSlug}/units/{unitSlug}
    m = path.match(/^\/teachers\/programmes\/([^/]+)\/units\/([^/]+)(?:\/?|$)/);
    if (m) {
      const [, programmeSlug, unitSlug] = m;
      unitToProgramme[unitSlug] = programmeSlug;
    }

    // /teachers/programmes/{programmeSlug}/units/{unitSlug}/lessons/{lessonSlug}
    m = path.match(/^\/teachers\/programmes\/([^/]+)\/units\/([^/]+)\/lessons\/([^/]+)(?:\/?|$)/);
    if (m) {
      const [, programmeSlug, unitSlug, lessonSlug] = m;
      lessonToProgrammeUnit[lessonSlug] = { programmeSlug, unitSlug };
      if (!lessonToPath[lessonSlug]) {
        lessonToPath[lessonSlug] = `/teachers/lessons/${lessonSlug}`;
      }
    }

    // /teachers/key-stages/{keyStageSlug}/subjects/{subjectSlug}/programmes
    m = path.match(/^\/teachers\/key-stages\/([^/]+)\/subjects\/([^/]+)\/programmes(?:\/?|$)/);
    if (m) {
      const [, keyStageSlug, subjectSlug] = m;
      const arr = ensureArray(subjectToKeyStages[subjectSlug]);
      if (!arr.includes(keyStageSlug)) arr.push(keyStageSlug);
      subjectToKeyStages[subjectSlug] = arr;
    }

    // /teachers/curriculum/{sequenceSlug}/units — sequence (curriculum view) pages
    m = path.match(/^\/teachers\/curriculum\/([^/]+)\/units(?:\/?|$)/);
    if (m) {
      const [, sequenceSlug] = m;
      sequenceToPath[sequenceSlug] = `/teachers/curriculum/${sequenceSlug}/units`;
    }

    // /teachers/curriculum/{sequenceSlug}/units/{unitSlug} — unit pages within curriculum context
    m = path.match(/^\/teachers\/curriculum\/([^/]+)\/units\/([^/]+)(?:\/?|$)/);
    if (m) {
      const [, sequenceSlug, unitSlug] = m;
      unitToSequence[unitSlug] = sequenceSlug;
    }
  }

  const result = {
    base,
    totals: {
      urls: teacherUrls.size,
      programmes: programmeSet.size,
      sequences: Object.keys(sequenceToPath).length,
      lessons: Object.keys(lessonToPath).length,
      unitsInProgramme: Object.keys(unitToProgramme).length,
      unitsInCurriculum: Object.keys(unitToSequence).length,
      subjects: Object.keys(subjectToKeyStages).length,
    },
    // Curriculum routes (confirmed via OWA source /teachers/curriculum/)
    sequenceToPath,
    unitToSequence,
    // Legacy programme routes
    lessonToPath,
    lessonToProgrammeUnit,
    unitToProgramme,
    subjectToKeyStages,
    programmes: [...programmeSet],
  };

  const fs = await import('node:fs/promises');
  await fs.mkdir(new URL('../reference/', import.meta.url), { recursive: true });
  const outPath = new URL('../reference/canonical-url-map.json', import.meta.url);
  await fs.writeFile(outPath, JSON.stringify(result, null, 2), 'utf8');
  console.log('Wrote', outPath.pathname);
  console.log('Totals:', result.totals);

  if (validateMode) {
    // CI validation: confirm that the critical URL patterns are present in the sitemap.
    // Any failure here means the live site does not serve the URLs our generators produce.
    const validationErrors = [];

    if (result.totals.sequences === 0) {
      validationErrors.push(
        'No /teachers/curriculum/{sequenceSlug}/units paths found in sitemap. ' +
          'Expected at least one sequence URL (e.g. /teachers/curriculum/maths-primary/units).',
      );
    }

    if (result.totals.unitsInCurriculum === 0) {
      validationErrors.push(
        'No /teachers/curriculum/{sequenceSlug}/units/{unitSlug} paths found in sitemap. ' +
          'Expected at least one unit URL within the curriculum context.',
      );
    }

    if (validationErrors.length > 0) {
      console.error('\n[VALIDATION FAILED]');
      for (const err of validationErrors) {
        console.error(' -', err);
      }
      process.exit(1);
    }

    console.log('[VALIDATION PASSED] Canonical URL patterns present in sitemap.');
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
