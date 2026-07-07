#!/usr/bin/env node
/**
 * crossref-lookup.mjs — one-off provenance tooling: resolve the graph's
 * reference citations to DOIs via the Crossref API.
 *
 * Reads data.json alongside this script; writes crossref-results.json
 * alongside this script. The results are REVIEW EVIDENCE, not build input:
 * every match was checked by hand against the citation's author, title and
 * year before being curated into the generator's EXTERNAL_SOURCES table
 * (see build-itf-graph.mjs), so the graph build itself stays offline and
 * deterministic. Re-running this script re-queries Crossref and may return
 * different rankings; the curated table in the generator is authoritative.
 *
 * PRESERVATION COPY — this hand-authored JavaScript is sanctioned for this
 * spike only (owner direction 2026-07-07, knowledge preservation). All
 * official repository code must be TypeScript; the proper integration pass
 * will promote this to a typed, tested workspace module. See README.md and
 * NOTES.md alongside this file.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const corpus = JSON.parse(readFileSync(join(DIR, 'data.json'), 'utf8'));
const refs = corpus.nodes.filter((n) => n.kind === 'reference');
const results = [];

for (const ref of refs) {
  const url = new URL('https://api.crossref.org/works');
  url.searchParams.set('query.bibliographic', ref.citation);
  url.searchParams.set('rows', '1');
  url.searchParams.set('select', 'DOI,title,issued,score,container-title,author');
  url.searchParams.set('mailto', 'oce-itf-graph-spike@example.org');
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'oce-itf-graph-spike/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    const item = body.message.items?.[0];
    if (!item) {
      results.push({ slug: ref.id, year: ref.year, match: null });
    } else {
      results.push({
        slug: ref.id,
        year: ref.year,
        match: {
          doi: item.DOI,
          title: item.title?.[0] ?? '',
          issuedYear: item.issued?.['date-parts']?.[0]?.[0] ?? null,
          firstAuthorFamily: item.author?.[0]?.family ?? '',
          container: item['container-title']?.[0] ?? '',
          score: item.score,
        },
      });
    }
  } catch (err) {
    results.push({ slug: ref.id, year: ref.year, error: String(err) });
  }
  process.stderr.write('.');
  await new Promise((r) => setTimeout(r, 250));
}

writeFileSync(join(DIR, 'crossref-results.json'), `${JSON.stringify(results, null, 2)}\n`);
console.error(`\n${results.length} lookups done`);
