// Mechanical baseline for landscape-survey round 1b (launch gate 2).
// Run from the repository root. Two reality-derived partitions of the census
// subject universe:
//  (1) co-change: 12 months of git history, union-find over pair strengths
//  (2) import graph: committed census depcruise-derived sourceDependencies,
//      deterministic label propagation
// Output: round-1b-mechanical-baseline.json with both partitions, their
// agreement, and two corpus entries shaped for args.extraCorpusEntries.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const REPO = process.cwd();
const FACTS = process.env.CENSUS_FACTS_PATH ?? '.agent/reports/workspace-classification-census/facts.json';
const OUT = '.agent/reports/workspace-taxonomy-landscape-survey/round-1b-mechanical-baseline.json';

const facts = JSON.parse(readFileSync(FACTS, 'utf8'));
// Code estate only: coordination/practice surfaces co-change with every lane's
// commits by construction (continuity records ride along), so they are
// excluded from the pair universe rather than allowed to fuse it.
const EXCLUDED = new Set(['.agent', '.agents', '.claude', '.codex', '.cursor', '.husky', '.github', 'runtime-only-scripts']);
const subjects = facts.facts.map((s) => s.dirPath).filter((p) => p !== '.' && !EXCLUDED.has(p));
// Sweep commits (estate-wide lint/config/format passes) manufacture pairwise
// co-change everywhere; standard change-coupling practice excludes them.
const SWEEP_SUBJECT_LIMIT = 5;
const bySpecificity = [...subjects].sort((a, b) => b.length - a.length);
const subjectOf = (file) => bySpecificity.find((s) => file === s || file.startsWith(`${s}/`)) ?? null;

// ---- (1) co-change over 12 months ----
const raw = execFileSync('git', ['log', '--since=12 months ago', '--name-only', '--pretty=format:@@%H'], {
  cwd: REPO, maxBuffer: 256 * 1024 * 1024, encoding: 'utf8',
});
const commitCount = new Map();
const pairCount = new Map();
let commits = 0;
for (const block of raw.split('@@').slice(1)) {
  const lines = block.split('\n').slice(1).filter((l) => l.trim().length > 0);
  const touched = new Set();
  for (const f of lines) { const s = subjectOf(f.trim()); if (s) touched.add(s); }
  if (touched.size === 0 || touched.size > SWEEP_SUBJECT_LIMIT) continue;
  commits += 1;
  const list = [...touched].sort();
  for (const s of list) commitCount.set(s, (commitCount.get(s) ?? 0) + 1);
  for (let i = 0; i < list.length; i += 1) {
    for (let j = i + 1; j < list.length; j += 1) {
      const key = `${list[i]}|${list[j]}`;
      pairCount.set(key, (pairCount.get(key) ?? 0) + 1);
    }
  }
}
const pairStrength = [...pairCount.entries()].map(([key, n]) => {
  const [a, b] = key.split('|');
  const denom = Math.min(commitCount.get(a) ?? 1, commitCount.get(b) ?? 1);
  return { a, b, n, strength: n / denom };
}).filter((p) => p.n >= 5);
pairStrength.sort((x, y) => y.strength - x.strength);

const unionFindPartition = (threshold) => {
  const parent = new Map(subjects.map((s) => [s, s]));
  const find = (x) => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
  for (const p of pairStrength) {
    if (p.strength >= threshold) { const ra = find(p.a); const rb = find(p.b); if (ra !== rb) parent.set(ra, rb); }
  }
  const clusters = new Map();
  for (const s of subjects) { const r = find(s); if (!clusters.has(r)) clusters.set(r, []); clusters.get(r).push(s); }
  return [...clusters.values()].filter((c) => c.length > 1).map((c) => c.sort());
};
const coChange = {
  windowCommits: commits,
  minSharedCommits: 5,
  topPairs: pairStrength.slice(0, 20).map((p) => ({ pair: `${p.a} <-> ${p.b}`, shared: p.n, strength: Number(p.strength.toFixed(2)) })),
  partitionAt50: unionFindPartition(0.5),
  partitionAt70: unionFindPartition(0.7),
  partitionAt85: unionFindPartition(0.85),
};

// ---- (2) import graph: deterministic label propagation ----
const edges = [];
for (const s of facts.facts) {
  if (s.dirPath === '.') continue;
  for (const dep of s.sourceDependencies ?? []) {
    if (dep === '.' || dep === s.dirPath || !subjects.includes(dep)) continue;
    edges.push([s.dirPath, dep]);
  }
}
// Ubiquitous foundations hub the graph and collapse label propagation into
// one blob; nodes imported by >= 8 subjects are reported as shared SUBSTRATE
// and removed from the residual clustering.
const inDegree = new Map();
for (const [, b] of edges) inDegree.set(b, (inDegree.get(b) ?? 0) + 1);
const substrate = [...inDegree.entries()].filter(([, d]) => d >= 8).map(([s]) => s).sort();
const substrateSet = new Set(substrate);
const residualEdges = edges.filter(([a, b]) => !substrateSet.has(a) && !substrateSet.has(b));
const neighbours = new Map(subjects.map((s) => [s, []]));
for (const [a, b] of residualEdges) { neighbours.get(a).push(b); neighbours.get(b).push(a); }
const label = new Map(subjects.map((s) => [s, s]));
const ordered = [...subjects].sort();
for (let iter = 0; iter < 20; iter += 1) {
  let changed = 0;
  for (const s of ordered) {
    const counts = new Map();
    for (const n of neighbours.get(s)) { const l = label.get(n); counts.set(l, (counts.get(l) ?? 0) + 1); }
    if (counts.size === 0) continue;
    const best = [...counts.entries()].sort((x, y) => y[1] - x[1] || (x[0] < y[0] ? -1 : 1))[0][0];
    if (best !== label.get(s)) { label.set(s, best); changed += 1; }
  }
  if (changed === 0) break;
}
const importClusters = new Map();
for (const s of subjects) { const l = label.get(s); if (!importClusters.has(l)) importClusters.set(l, []); importClusters.get(l).push(s); }
const importPartition = [...importClusters.values()].filter((c) => c.length > 1).map((c) => c.sort()).sort((a, b) => b.length - a.length);
const importGraphReport = { edges: edges.length, substrate, residualEdges: residualEdges.length, partition: importPartition };

// ---- agreement ----
const clusterKey = (partition) => {
  const m = new Map();
  partition.forEach((c, i) => { for (const s of c) m.set(s, i); });
  return m;
};
const cc = clusterKey(coChange.partitionAt50);
const ig = clusterKey(importPartition);
let both = 0; let ccOnly = 0; let igOnly = 0;
for (let i = 0; i < subjects.length; i += 1) {
  for (let j = i + 1; j < subjects.length; j += 1) {
    const a = subjects[i]; const b = subjects[j];
    const inCc = cc.has(a) && cc.has(b) && cc.get(a) === cc.get(b);
    const inIg = ig.has(a) && ig.has(b) && ig.get(a) === ig.get(b);
    if (inCc && inIg) both += 1; else if (inCc) ccOnly += 1; else if (inIg) igOnly += 1;
  }
}

const prose = (title, partition, method) =>
  `${title}. Method: ${method}. Units not listed form no measured grouping and stand alone. Grouped units: ${partition.map((c) => `[${c.join(', ')}]`).join('; ')}.`;

const result = {
  provenance: {
    generated: '2026-08-17',
    method: 'universe: census code subjects (coordination/practice surfaces excluded — they co-change with every lane by construction). co-change: git log 12 months, sweep commits excluded (>5 subjects touched), subjects mapped by longest census dirPath, pairs with >=5 shared commits, union-find at strength thresholds (shared / min(commits)); imports: committed census facts.json sourceDependencies (depcruise-derived), substrate separation at in-degree >=8, deterministic label propagation over the residual graph (sorted order, max 20 iterations)',
    subjectUniverse: subjects.length,
  },
  coChange,
  importGraph: importGraphReport,
  agreement: { pairsGroupedInBoth: both, coChangeOnly: ccOnly, importOnly: igOnly },
  corpusEntries: [
    {
      id: 'MECH-cochange', arm: 'mechanical', tier: 'none', grounding: 'measured-record', variant: 'n/a', origin: 'mechanical',
      design: {
        proposal: prose('Organisation derived purely from measured change-coupling: units that changed together in >=50% of their commits over 12 months belong in one unit', coChange.partitionAt50, 'git co-change union-find at 0.5, pairs with >=5 shared commits'),
        notes: `Derived from ${String(commits)} commits; thresholds 0.7 and 0.85 give ${String(coChange.partitionAt70.length)} and ${String(coChange.partitionAt85.length)} groups respectively. No model judgement involved.`,
      },
    },
    {
      id: 'MECH-imports', arm: 'mechanical', tier: 'none', grounding: 'measured-record', variant: 'n/a', origin: 'mechanical',
      design: {
        proposal: prose('Organisation derived purely from the measured import graph: a shared SUBSTRATE tier (units imported by >= 8 others: ' + substrate.join(', ') + ') beneath residual clusters of units that import each other', importPartition, 'hub separation at in-degree >= 8, then label propagation over residual depcruise workspace-level edges'),
        notes: `Derived from ${String(edges.length)} workspace-level import edges (${String(residualEdges.length)} residual after substrate separation). No model judgement involved.`,
      },
    },
  ],
};
writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n');
console.log('written', OUT);
console.log('commits:', commits, '| pairs >=5 shared:', pairStrength.length, '| import edges:', edges.length);
console.log('co-change partition @0.5:', JSON.stringify(coChange.partitionAt50));
console.log('import partition (top 6):', JSON.stringify(importPartition.slice(0, 6)));
console.log('agreement:', JSON.stringify(result.agreement));
