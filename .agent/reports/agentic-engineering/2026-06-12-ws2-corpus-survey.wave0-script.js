#!/usr/bin/env node
/* Wave 0 — comms-corpus statistical index + survey skeleton (Katydid hunts Roost, a4314f).
 * Reads every event in .agent/state/collaboration/comms/, emits:
 *   /tmp/katydid-corpus-index.jsonl   one row per event (the shared index later waves consume)
 *   /tmp/katydid-corpus-stats.json    full statistics object
 *   stdout                            compact human summary
 * Analysis scratch per plan §WS2 — not product code. */
const fs = require("fs");
const path = require("path");

const DIR = ".agent/state/collaboration/comms";
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json") && !f.includes(".tmp-"));
const FULL_UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
const HEX_TOKEN = /\b[0-9a-f]{7,12}\b/g;

const rows = [];
let unparseable = 0;
for (const f of files) {
  let e;
  try {
    e = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
  } catch {
    unparseable++;
    continue;
  }
  const shape = e.author ? (e.kind === "lifecycle" ? "lifecycle" : "narrative") : e.from ? "directed" : "unknown";
  const author = e.author || e.from || {};
  const to = e.to || e.addressed_to || null;
  const body = e.body || "";
  const title = e.title || e.subject || "";
  const selfId = e.event_id || f.replace(/\.json$/, "");
  const citedUuids = [...new Set((body.match(FULL_UUID) || []).filter((u) => u !== selfId))];
  const hexTokens = [...new Set(body.match(HEX_TOKEN) || [])];
  const genre = title.includes(":") ? title.slice(0, title.indexOf(":")).trim().slice(0, 48) : "(no-prefix)";
  rows.push({
    id: selfId,
    file: f,
    created_at: e.created_at,
    shape,
    kind: e.kind,
    tags: e.tags || [],
    author_name: author.agent_name || "?",
    author_prefix: author.session_id_prefix || "?",
    author_platform: author.platform || "?",
    author_model: author.model || "?",
    naming_era: author.naming_schema_version || "(absent)",
    to_name: to ? to.agent_name || "?" : null,
    audience_n: Array.isArray(e.audience) ? e.audience.length : null,
    message_kind: e.message_kind || null,
    event_type: e.event_type || null,
    title,
    genre,
    body_len: body.length,
    cited_uuids: citedUuids,
    hex_tokens: hexTokens,
    has_in_response_to: Boolean(e.in_response_to || e.in_reply_to),
  });
}
rows.sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
fs.writeFileSync("/tmp/katydid-corpus-index.jsonl", rows.map((r) => JSON.stringify(r)).join("\n") + "\n");

const inc = (m, k, n = 1) => (m[k] = (m[k] || 0) + n);
const isHb = (r) => r.tags.includes("heartbeat");

// Distributions
const byDay = {}, byDayHb = {}, byKind = {}, byShape = {}, byTag = {}, byGenre = {}, byEra = {}, byHour = {};
const authors = {};
for (const r of rows) {
  const day = (r.created_at || "?").slice(0, 10);
  const hour = (r.created_at || "????????????T??").slice(11, 13);
  inc(byDay, day);
  if (isHb(r)) inc(byDayHb, day);
  inc(byKind, r.kind);
  inc(byShape, r.shape);
  for (const t of r.tags.length ? r.tags : ["(untagged)"]) inc(byTag, t);
  inc(byGenre, r.genre);
  inc(byEra, r.naming_era);
  inc(byHour, hour);
  const key = `${r.author_name}|${r.author_prefix}`;
  authors[key] ||= { events: 0, hb: 0, days: new Set(), first: r.created_at, last: r.created_at, platform: r.author_platform, model: r.author_model };
  const a = authors[key];
  a.events++;
  if (isHb(r)) a.hb++;
  a.days.add(day);
  if (r.created_at < a.first) a.first = r.created_at;
  if (r.created_at > a.last) a.last = r.created_at;
}

// Directed pair matrix
const pairs = {};
for (const r of rows) if (r.shape === "directed" && r.to_name) inc(pairs, `${r.author_name} -> ${r.to_name}`);

// Inter-event gaps, bursts, silences (global timeline)
const ts = rows.map((r) => Date.parse(r.created_at)).filter(Number.isFinite).sort((x, y) => x - y);
const silences = [];
for (let i = 1; i < ts.length; i++) {
  const gap = ts[i] - ts[i - 1];
  if (gap > 60 * 60 * 1000)
    silences.push({ from: new Date(ts[i - 1]).toISOString(), to: new Date(ts[i]).toISOString(), hours: +(gap / 3600000).toFixed(1) });
}
// busiest 5-minute windows
let maxBurst = { count: 0, at: null };
let j = 0;
for (let i = 0; i < ts.length; i++) {
  while (ts[i] - ts[j] > 5 * 60 * 1000) j++;
  const count = i - j + 1;
  if (count > maxBurst.count) maxBurst = { count, at: new Date(ts[j]).toISOString() };
}

// Heartbeat cadence per author (median gap between consecutive heartbeats, all-time)
const hbByAuthor = {};
for (const r of rows) if (isHb(r)) (hbByAuthor[r.author_name] ||= []).push(Date.parse(r.created_at));
const cadence = {};
for (const [a, list] of Object.entries(hbByAuthor)) {
  list.sort((x, y) => x - y);
  const gaps = [];
  for (let i = 1; i < list.length; i++) {
    const g = (list[i] - list[i - 1]) / 60000;
    if (g < 120) gaps.push(g); // ignore cross-session gaps
  }
  gaps.sort((x, y) => x - y);
  if (gaps.length)
    cadence[a] = { n: list.length, median_min: +gaps[Math.floor(gaps.length / 2)].toFixed(2), p90_min: +gaps[Math.floor(gaps.length * 0.9)].toFixed(2) };
}

// Citation graph: resolve cited full UUIDs and unique 8-hex prefixes against known ids
const idSet = new Set(rows.map((r) => r.id));
const prefixMap = {};
for (const r of rows) {
  const p = r.id.slice(0, 8);
  (prefixMap[p] ||= []).push(r.id);
}
let edgesFull = 0, edgesPrefix = 0, eventsCiting = 0;
const inDegree = {};
for (const r of rows) {
  let cites = new Set();
  for (const u of r.cited_uuids) if (idSet.has(u)) cites.add(u);
  for (const h of r.hex_tokens)
    if (h.length === 8 && prefixMap[h] && prefixMap[h].length === 1 && prefixMap[h][0] !== r.id) cites.add(prefixMap[h][0]);
  if (cites.size) eventsCiting++;
  for (const c of cites) {
    inc(inDegree, c);
    if (r.cited_uuids.includes(c)) edgesFull++;
    else edgesPrefix++;
  }
}
const topCited = Object.entries(inDegree).sort((a, b) => b[1] - a[1]).slice(0, 15);
const inResponseToCount = rows.filter((r) => r.has_in_response_to).length;

// Body length stats by class
const lenStats = (sel) => {
  const ls = rows.filter(sel).map((r) => r.body_len).sort((a, b) => a - b);
  if (!ls.length) return null;
  return { n: ls.length, median: ls[Math.floor(ls.length / 2)], p90: ls[Math.floor(ls.length * 0.9)], max: ls[ls.length - 1], total_chars: ls.reduce((s, x) => s + x, 0) };
};

const stats = {
  derived_at: new Date().toISOString(),
  total: rows.length,
  unparseable,
  span: { first: rows[0]?.created_at, last: rows[rows.length - 1]?.created_at },
  byDay, byDayHb, byKind, byShape, byTag, byEra, byHour,
  genres_top: Object.entries(byGenre).sort((a, b) => b[1] - a[1]).slice(0, 40),
  authors: Object.fromEntries(Object.entries(authors).map(([k, a]) => [k, { ...a, days: a.days.size, hb_share: +(a.hb / a.events).toFixed(2) }])),
  directed_pairs_top: Object.entries(pairs).sort((a, b) => b[1] - a[1]).slice(0, 30),
  silences_over_1h: silences,
  max_5min_burst: maxBurst,
  heartbeat_cadence: cadence,
  citations: { events_citing: eventsCiting, edges_full_uuid: edgesFull, edges_8hex_prefix: edgesPrefix, top_cited: topCited, in_response_to_populated: inResponseToCount },
  body_len: { all: lenStats(() => true), heartbeat: lenStats(isHb), narrative_untagged: lenStats((r) => r.shape === "narrative" && !r.tags.length), directed: lenStats((r) => r.shape === "directed") },
};
fs.writeFileSync("/tmp/katydid-corpus-stats.json", JSON.stringify(stats, null, 2));

// Compact human summary
const p = (o, n = 8) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${k}=${v}`).join("  ");
console.log(`TOTAL ${rows.length} (unparseable ${unparseable})  span ${stats.span.first} -> ${stats.span.last}`);
console.log(`SHAPES ${p(byShape)} | in_response_to populated: ${inResponseToCount}`);
console.log(`TAGS ${p(byTag)}`);
console.log(`ERAS ${p(byEra)}`);
console.log(`AUTHORS ${Object.keys(authors).length} distinct (name|prefix). Top: ${p(Object.fromEntries(Object.entries(authors).map(([k, a]) => [k.split("|")[0], a.events])), 6)}`);
console.log(`DIRECTED PAIRS top: ${stats.directed_pairs_top.slice(0, 5).map(([k, v]) => `${k}(${v})`).join("; ")}`);
console.log(`SILENCES >1h: ${silences.length} (longest ${Math.max(0, ...silences.map((s) => s.hours))}h)  MAX 5-MIN BURST: ${maxBurst.count} @ ${maxBurst.at}`);
console.log(`CITATIONS events-citing=${eventsCiting} full-uuid-edges=${edgesFull} prefix-edges=${edgesPrefix}`);
console.log(`HB CADENCE (median min): ${Object.entries(cadence).slice(0, 8).map(([a, c]) => `${a}=${c.median_min}`).join("  ")}`);
console.log(`GENRES top: ${stats.genres_top.slice(0, 10).map(([g, n]) => `${g}(${n})`).join("; ")}`);
console.log(`BODY chars total=${stats.body_len.all.total_chars} hb-median=${stats.body_len.heartbeat?.median} narr-median=${stats.body_len.narrative_untagged?.median} dir-median=${stats.body_len.directed?.median}`);
