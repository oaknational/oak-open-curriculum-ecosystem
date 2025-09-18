#!/usr/bin/env node
// Simple sitemap traverser to build canonical URL mapping for teachers site
// Output: reference/canonical-url-map.json

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
  const lessonToPath = {};
  const lessonToProgrammeUnit = {};
  const unitToProgramme = {};
  const subjectToKeyStages = {};
  const programmeSet = new Set();

  for (const url of teacherUrls) {
    const path = url.replace(base, '');

    // /teachers/lessons/{lessonSlug} and variants
    let m = path.match(/^\/teachers\/lessons\/([^\/]+)(?:\/?|\/.*)$/);
    if (m) {
      const lessonSlug = m[1];
      lessonToPath[lessonSlug] = `/teachers/lessons/${lessonSlug}`;
    }

    // /teachers/programmes/{programmeSlug}
    m = path.match(/^\/teachers\/programmes\/([^\/]+)(?:\/?|\/.*)$/);
    if (m) {
      programmeSet.add(m[1]);
    }

    // /teachers/programmes/{programmeSlug}/units
    // /teachers/programmes/{programmeSlug}/units/{unitSlug}
    m = path.match(/^\/teachers\/programmes\/([^\/]+)\/units(?:\/?|$)/);
    if (m) programmeSet.add(m[1]);

    m = path.match(/^\/teachers\/programmes\/([^\/]+)\/units\/([^\/]+)(?:\/?|$)/);
    if (m) {
      const [, programmeSlug, unitSlug] = m;
      unitToProgramme[unitSlug] = programmeSlug;
    }

    // /teachers/programmes/{programmeSlug}/units/{unitSlug}/lessons/{lessonSlug}
    m = path.match(
      /^\/teachers\/programmes\/([^\/]+)\/units\/([^\/]+)\/lessons\/([^\/]+)(?:\/?|$)/,
    );
    if (m) {
      const [, programmeSlug, unitSlug, lessonSlug] = m;
      lessonToProgrammeUnit[lessonSlug] = { programmeSlug, unitSlug };
      if (!lessonToPath[lessonSlug]) {
        lessonToPath[lessonSlug] = `/teachers/lessons/${lessonSlug}`;
      }
    }

    // /teachers/key-stages/{keyStageSlug}/subjects/{subjectSlug}/programmes
    m = path.match(/^\/teachers\/key-stages\/([^\/]+)\/subjects\/([^\/]+)\/programmes(?:\/?|$)/);
    if (m) {
      const [, keyStageSlug, subjectSlug] = m;
      const arr = ensureArray(subjectToKeyStages[subjectSlug]);
      if (!arr.includes(keyStageSlug)) arr.push(keyStageSlug);
      subjectToKeyStages[subjectSlug] = arr;
    }
  }

  const result = {
    base,
    totals: {
      urls: teacherUrls.size,
      programmes: programmeSet.size,
      lessons: Object.keys(lessonToPath).length,
      units: Object.keys(unitToProgramme).length,
      subjects: Object.keys(subjectToKeyStages).length,
    },
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
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
