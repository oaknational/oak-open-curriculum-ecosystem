#!/usr/bin/env node
/* Citation-resolution analysis — settles the "citation theatre" question first-hand.
 * Distinguishes: full-UUID citations (clean signal — nobody types a full UUID by accident)
 * from 8-hex tokens (noisy — also git SHAs, which legitimately are NOT comms events) and
 * from literal placeholder strings. Reports resolve vs dangle rates. Derived scratch. */
const fs = require("fs");
const path = require("path");
const DIR = ".agent/state/collaboration/comms";
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json") && !f.includes(".tmp-"));

const FULL_UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
const HEX8 = /\b[0-9a-f]{8}\b/g;
// literal citation placeholders: [..id..] or <..id..> or <event-id> style
const PLACEHOLDER = /\[[^\]\n]*\bid\b[^\]\n]*\]|<[^>\n]*\bid\b[^>\n]*>|\[(?:event[-_ ]?id|id-of-[^\]\n]+)\]/gi;
// CLI-usage context that should NOT count as a citation placeholder (Myrtle's false-positive class)
const CLI_USAGE = /comms\s+show|--event-id|<event-id>|<id>|event_id\s*[:=]/i;

const ids = new Set();
const events = [];
for (const f of files) {
  let e; try { e = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")); } catch { continue; }
  const id = e.event_id || f.replace(/\.json$/, "");
  ids.add(id);
  events.push({ id, body: e.body || "", title: e.title || e.subject || "" });
}
const prefix8 = new Map();
for (const id of ids) { const p = id.slice(0, 8); prefix8.set(p, (prefix8.get(p) || 0) + 1); }

let fullCited = 0, fullResolve = 0, fullDangle = 0;
const dangleFullExamples = [];
let hex8Cited = 0, hex8ResolveUnique = 0, hex8DangleOrSha = 0;
let placeholderEvents = 0, placeholderCliContext = 0;
const placeholderExamples = [];

for (const e of events) {
  const body = e.body;
  // Full UUIDs (exclude self)
  const fulls = [...new Set((body.match(FULL_UUID) || []))].filter((u) => u !== e.id);
  for (const u of fulls) {
    fullCited++;
    if (ids.has(u)) fullResolve++;
    else { fullDangle++; if (dangleFullExamples.length < 12) dangleFullExamples.push({ in: e.id.slice(0, 8), cited: u }); }
  }
  // 8-hex tokens (exclude ones inside a full uuid already counted, exclude self prefix)
  const bodyNoFull = body.replace(FULL_UUID, " ");
  const hexes = [...new Set((bodyNoFull.match(HEX8) || []))].filter((h) => h !== e.id.slice(0, 8));
  for (const h of hexes) {
    hex8Cited++;
    if (prefix8.get(h) === 1) hex8ResolveUnique++;
    else if (!prefix8.has(h)) hex8DangleOrSha++; // dangles OR is a git SHA / other hex
  }
  // Literal placeholders
  const ph = body.match(PLACEHOLDER) || [];
  if (ph.length) {
    placeholderEvents++;
    const cli = ph.every((p) => CLI_USAGE.test(p) || CLI_USAGE.test(body.slice(Math.max(0, body.indexOf(p) - 30), body.indexOf(p) + p.length + 10)));
    if (cli) placeholderCliContext++;
    else if (placeholderExamples.length < 12) placeholderExamples.push({ in: e.id.slice(0, 8), ph: ph.slice(0, 2) });
  }
}

console.log(`derived_at ${new Date().toISOString()} over ${events.length} events`);
console.log(`\n=== FULL-UUID citations (clean signal) ===`);
console.log(`  cited (non-self): ${fullCited}  resolve: ${fullResolve}  DANGLE (cite no real event): ${fullDangle}  (${(100 * fullDangle / Math.max(1, fullCited)).toFixed(1)}% dangling)`);
console.log(`  dangling examples (citing-event-prefix -> cited-uuid):`); dangleFullExamples.forEach((d) => console.log(`    ${d.in} -> ${d.cited}`));
console.log(`\n=== 8-hex tokens in bodies (NOISY: includes git SHAs, which legitimately are not comms events) ===`);
console.log(`  tokens (non-self): ${hex8Cited}  resolve-to-unique-event-prefix: ${hex8ResolveUnique}  no-event-prefix (dangle OR git SHA OR other): ${hex8DangleOrSha}`);
console.log(`\n=== literal placeholder citation strings ([..id..] / <..id..>) ===`);
console.log(`  events with placeholder-shaped strings: ${placeholderEvents}  of which all-in-CLI-usage-context (false positives): ${placeholderCliContext}  genuine-looking: ${placeholderEvents - placeholderCliContext}`);
console.log(`  genuine-looking placeholder examples:`); placeholderExamples.forEach((p) => console.log(`    ${p.in}: ${JSON.stringify(p.ph)}`));
