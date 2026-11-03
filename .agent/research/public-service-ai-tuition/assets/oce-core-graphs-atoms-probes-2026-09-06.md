# `oce-core-graphs-atoms-probes-2026-09-06.mjs`, preserved as a listing

**What this file is.** The historical probe runner that produced
[`oce-core-graphs-atoms-probe-results-2026-09-06.json`](oce-core-graphs-atoms-probe-results-2026-09-06.json),
preserved as data: the listing below is the runner's exact text as imported on PR 66 (git blob
`795808186a4c215909aee2fa7994803d63302612`), fenced as a code block. It is not an executable file
in this tree.

**Why a listing.** ADR-226 clause 4 holds a record's executable content to this repository's
gates, and the TypeScript-only rule admits hand-authored JavaScript only in the pre-install tier
(ADR-168 §4), which a source-level probe runner cannot meet. The owner ruled on 2026-09-07 that
the standing policy applies with no research-record exemption class. Under the decision lenses
the cure is reduction to data rather than a wired TypeScript rewrite: the runner is a one-shot
witness pinned to OCE commit `31e76a7237ee7aecb8adfca96e73b2d83b25be39`, and a maintained script
would rot on the next source move while proving nothing new. The two links that pointed at the
executable (the collection README's assets table and chapter 08 §7) now point here;
[`AUTHORITY.md`](../AUTHORITY.md) beside the collection records every delta from the imported
bytes.

**To re-run it.** Save the fenced text below as `oce-core-graphs-atoms-probes-2026-09-06.mjs`
outside this repository, check out OCE at the pinned commit above in a separate directory, and
run it as chapter 08 §7 describes (Node 24.19.0, no third-party dependencies):
`node oce-core-graphs-atoms-probes-2026-09-06.mjs /absolute/path/to/pinned-oce-checkout`. The
runner refuses any other HEAD; compare its recorded source hashes with the saved results.

## Listing

```js
/** Reproducible source-level inquiry probes. Not a production package or package smoke test.
 * Usage: node oce-core-graphs-atoms-probes-2026-09-06.mjs /absolute/path/to/oce
 * Node 24.19.0; no third-party dependencies. Source modules are loaded unchanged apart
 * from Node TypeScript erasure and explicit source-path resolution; hashes are reported.
 */
import { registerHooks, stripTypeScriptTypes } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import os from 'node:os';
import assert from 'node:assert/strict';

const root = resolve(process.argv[2] ?? 'oce');
const pin = '31e76a7237ee7aecb8adfca96e73b2d83b25be39';
const head = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
assert.equal(head, pin, 'This inquiry is pinned; reframe and revise before testing another revision.');
const sourceHashes = {};
const aliases = {
  '@oaknational/result': 'packages/core/result/src/index.ts',
  '@oaknational/type-helpers': 'packages/core/type-helpers/src/index.ts',
  '@oaknational/graph-core/term': 'packages/core/graph-core/src/term/index.ts',
  '@oaknational/graph-core/data-factory': 'packages/core/graph-core/src/data-factory/index.ts',
  '@oaknational/graph-core/dataset': 'packages/core/graph-core/src/dataset/index.ts',
};
registerHooks({
  resolve(specifier, context, next) {
    if (aliases[specifier]) return { url: pathToFileURL(resolve(root, aliases[specifier])).href, shortCircuit: true };
    if (specifier.startsWith('.') && specifier.endsWith('.js') && context.parentURL?.startsWith('file:')) {
      const target = new URL(specifier.slice(0, -3) + '.ts', context.parentURL);
      if (fileURLToPath(target).startsWith(root + '/') && existsSync(target)) return { url: target.href, shortCircuit: true };
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.startsWith('file:') && url.endsWith('.ts') && fileURLToPath(url).startsWith(root + '/')) {
      const text = readFileSync(new URL(url), 'utf8');
      sourceHashes[relative(root, fileURLToPath(url))] = createHash('sha256').update(text).digest('hex');
      return { format: 'module', source: stripTypeScriptTypes(text, { mode: 'strip' }), shortCircuit: true };
    }
    return next(url, context);
  },
});
const load = async path => import(pathToFileURL(resolve(root, path)).href);
const { equals } = await load('packages/core/graph-core/src/term/index.ts');
const { createDataset } = await load('packages/core/graph-core/src/dataset/index.ts');
const { quadKey, serialiseSegments, parseSegments, jsonPointer } = await load('packages/libs/graph-ingest/src/source-path/index.ts');
const { createGraphView } = await load('packages/core/graph-core/src/graph-view/create-graph-view.ts');
const { serialiseCanonicalJson } = await load('agent-tools/src/typescript-estate/canonical-json.ts');
const { lengthFrame } = await load('agent-tools/src/typescript-estate/length-framing.ts');
const { createFetchWithRetry } = await load('packages/sdks/oak-curriculum-sdk/src/client/middleware/retry.ts');
const { createRetryConfig } = await load('packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts');
const { toPropertyGraph } = await load('packages/libs/graph-project/src/projection/to-property-graph.ts');
const { fromPropertyGraph } = await load('packages/libs/graph-project/src/projection/from-property-graph.ts');
const n = value => ({ termType: 'NamedNode', value });
const literal = direction => ({ termType: 'Literal', value: 'same', language: 'en', direction, datatype: n('http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString') });
const q = (object, graph = { termType: 'DefaultGraph', value: '' }) => ({ termType: 'Quad', subject: n('urn:s'), predicate: n('urn:p'), object, graph });
const out = { inquiry: 'oce-core-graphs-atoms-2026-09-06', revision: 1, pass: 'M3', pin, environment: { node: process.version, platform: process.platform, arch: process.arch, cpu: os.cpus()[0]?.model, cpus: os.cpus().length, memoryBytes: os.totalmem() }, probes: {} };

// P1. Same lexical value/language, different RDF base directions must be unequal.
const left = q(literal('ltr')), right = q(literal('rtl'));
const factSet = createDataset([left, right]);
const sourceMap = new Map([[quadKey(left), '/first'], [quadKey(right), '/second']]);
assert.equal(equals(left, right), false);
assert.equal(factSet.size, 2);
assert.equal(quadKey(left), quadKey(right));
assert.equal(sourceMap.size, 1);
out.probes.P1 = { unequal: !equals(left, right), datasetSize: factSet.size, sameSourceKey: quadKey(left) === quadKey(right), sourceMapSize: sourceMap.size };

// P2. Readonly types alone do not establish snapshot ownership. This deliberately
// violates the documented fixed-input assumption; it exposes the cost of that assumption.
const nodes = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
const edges = [{ source: 'a', type: 'edge', target: 'b' }];
const view = createGraphView({ nodes, edges, nodeId: x => x.id, maxDepth: 3 });
const before = view.subgraph({ rootIds: ['a'], depth: 2 });
edges.push({ source: 'b', type: 'edge', target: 'c' });
const after = view.subgraph({ rootIds: ['a'], depth: 2 });
const fresh = createGraphView({ nodes, edges, nodeId: x => x.id, maxDepth: 3 }).subgraph({ rootIds: ['a'], depth: 2 });
assert.deepEqual(after.value.nodes.map(x => x.id), ['a', 'b']);
assert.deepEqual(fresh.value.nodes.map(x => x.id), ['a', 'b', 'c']);
out.probes.P2 = { before, retainedViewAfterMutation: after, freshView: fresh, interpretation: 'Fixed-input ownership assumption; not proof that immutable corpus callers fail.' };

// P3. Depth boundary probes; no HTTP/Zod adapter is exercised.
const depthView = createGraphView({ nodes, edges, nodeId: x => x.id, maxDepth: 3 });
out.probes.P3 = Object.fromEntries([['NaN', NaN], ['fraction', 0.5], ['Infinity', Infinity], ['negative', -1], ['zero', 0]].map(([label, depth]) => [label, depthView.subgraph({ rootIds: ['a'], depth })]));
assert.equal(out.probes.P3.NaN.ok, true);
assert.equal(out.probes.P3.fraction.value.nodes.length, 2);
assert.equal(out.probes.P3.Infinity.ok, false);

// P4. Strict JSON examples plus a non-data object: getters run and may change bytes.
const decode = result => result.ok ? new TextDecoder().decode(result.value) : { code: result.error.code, message: result.error.message };
const a = decode(serialiseCanonicalJson({ b: 1, a: 2, '2': 'two', '10': 'ten' }, 4096));
const b = decode(serialiseCanonicalJson({ '10': 'ten', a: 2, '2': 'two', b: 1 }, 4096));
assert.equal(a, b);
const cyclic = {}; cyclic.self = cyclic;
let getterReads = 0;
const accessorObject = { get value() { getterReads += 1; return getterReads; } };
const firstAccessor = decode(serialiseCanonicalJson(accessorObject, 100));
const secondAccessor = decode(serialiseCanonicalJson(accessorObject, 100));
const invalid = { NaN, undefined, bigint: 1n, sparse: Array(1), cyclic };
out.probes.P4 = { reorderedBytesEqual: a === b, bytes: a, invalidValues: Object.fromEntries(Object.entries(invalid).map(([k,v]) => [k, decode(serialiseCanonicalJson(v, 4096))])), firstAccessor, secondAccessor, getterReads, lowLimit: decode(serialiseCanonicalJson('x'.repeat(4096), 8)) };
assert.notEqual(firstAccessor, secondAccessor);

// P5. Exact input framing does not take an immutable byte snapshot.
const bytes = new Uint8Array([1, 2]);
const framed = lengthFrame(bytes); bytes[0] = 9;
assert.equal(framed.value.bytes[0], 9);
out.probes.P5 = { sameByteReference: framed.value.bytes === bytes, framedAfterMutation: [...framed.value.bytes], interpretation: 'A framing view; digest callers must own bytes for the whole hash operation.' };

// P6. Retry: no network; injected operations fail deterministically.
const config = createRetryConfig({ maxRetries: 2, initialDelayMs: 1, maxDelayMs: 1, statusCodeMaxRetries: { 503: 0 } });
let abortAttempts = 0;
const cancelled = new AbortController(); cancelled.abort();
const abortFetch = createFetchWithRetry(async () => { abortAttempts += 1; throw new DOMException('aborted', 'AbortError'); }, config);
let abortName;
try { await abortFetch(new Request('https://example.invalid', { signal: cancelled.signal })); } catch (error) { abortName = error.name; }
let statusAttempts = 0;
const statusFetch = createFetchWithRetry(async () => { statusAttempts += 1; return new Response(null, { status: 503 }); }, config);
await statusFetch('https://example.invalid');
assert.equal(abortAttempts, 3); assert.equal(statusAttempts, 3);
out.probes.P6 = { abortAttempts, abortName, statusAttempts, configuredRetriesFor503: 0, globalMaxRetries: 2, networkCalls: 0 };

// P7. Projection's supported subset has a narrow round-trip; loss is not reported.
const named = q(n('urn:o'), n('urn:g'));
const triple = q({ termType: 'TripleTerm', value: '', subject: n('urn:x'), predicate: n('urn:y'), object: n('urn:z') });
const ordinary = q(n('urn:o'));
const projected = toPropertyGraph(createDataset([ordinary, named, triple]));
const restored = fromPropertyGraph(projected);
out.probes.P7 = { inputQuads: 3, projectedNodes: projected.nodes.length, projectedEdges: projected.edges.length, restoredQuads: restored.size, roundTripRetainsOrdinary: restored.has(ordinary), retainedNamedGraph: restored.has(named), retainedTripleTerm: restored.has(triple), returnKeys: Object.keys(projected) };
assert.equal(restored.has(ordinary), true); assert.equal(restored.has(named), false); assert.equal(restored.has(triple), false);

// P8. JSON selector control: escapes, empty token and Unicode are preserved.
const segments = ['a/b', '~name', '', '𝄞'];
const pointer = serialiseSegments(segments);
assert.deepEqual(parseSegments(pointer), segments);
assert.equal(jsonPointer('/bad~x').ok, false);
out.probes.P8 = { pointer, roundTrip: parseSegments(pointer), malformedRejected: !jsonPointer('/bad~x').ok };

// P9. Synthetic chain dataset scaling. Timings are within this run only.
// Candidate is a benchmark-only native Map keyed by exact tagged tuples; no package proposal.
const termTuple = t => {
  if (t.termType === 'Literal') return ['L', t.value, t.language, t.direction, t.datatype.value];
  if (t.termType === 'TripleTerm') return ['T', termTuple(t.subject), termTuple(t.predicate), termTuple(t.object)];
  return [t.termType, t.value];
};
const structuralKey = quad => JSON.stringify([termTuple(quad.subject), termTuple(quad.predicate), termTuple(quad.object), termTuple(quad.graph)]);
assert.notEqual(structuralKey(left), structuralKey(right));
const median = values => [...values].sort((x,y) => x-y)[Math.floor(values.length/2)];
const samples = [];
for (const size of [250, 500, 1000, 2000]) {
  const quads = Array.from({ length: size }, (_, i) => ({ ...q(n('urn:' + (i+1))), subject: n('urn:' + i) }));
  // One warmup per implementation; 5 repeats; balanced execution order.
  createDataset(quads); new Map(quads.map(x => [structuralKey(x), x]));
  const build = [], matchAll = [], mapBuild = [], mapHeap = [];
  for (let repeat = 0; repeat < 5; repeat += 1) {
    const runArray = () => { const t = performance.now(); const ds = createDataset(quads); build.push(performance.now()-t); const m=performance.now(); assert.equal(ds.match().size, size); matchAll.push(performance.now()-m); };
    const runMap = () => { const h=process.memoryUsage().heapUsed; const t=performance.now(); const map = new Map(quads.map(x => [structuralKey(x), x])); mapBuild.push(performance.now()-t); assert.equal(map.size,size); mapHeap.push(process.memoryUsage().heapUsed-h); };
    if (repeat % 2) { runMap(); runArray(); } else { runArray(); runMap(); }
  }
  samples.push({ size, repeats:5, arrayBuildMs:build, matchAllMs:matchAll, mapBuildMs:mapBuild, mapHeapDeltaBytes:mapHeap, medians:{arrayBuildMs:median(build), matchAllMs:median(matchAll), mapBuildMs:median(mapBuild)} });
}
out.probes.P9 = { shape:'synthetic unique chain quads', samples, limits:'Map candidate is not a complete DatasetCore replacement; heap deltas include allocator/GC noise, not retained-memory proof. No end-to-end product speedup established.' };
// P10. Corpus shape is measured separately from the synthetic dataset benchmark.
const corpusPath = 'packages/sdks/oak-sdk-codegen/src/generated/vocab/graph-corpus/data.json';
const corpusBytes = readFileSync(resolve(root, corpusPath));
sourceHashes[corpusPath] = createHash('sha256').update(corpusBytes).digest('hex');
const corpus = JSON.parse(corpusBytes.toString('utf8'));
const counts = (items, key) => items.reduce((acc, item) => { acc[item[key]] = (acc[item[key]] ?? 0) + 1; return acc; }, {});
const pre = corpus.edges.filter(edge => edge.type === 'prerequisiteFor');
out.probes.P10 = { sourceBytes: corpusBytes.length, version: corpus.version, sourceVersion: corpus.sourceVersion, generatedAt: corpus.generatedAt, nodes: corpus.nodes.length, edges: corpus.edges.length, nodesByKind: counts(corpus.nodes, 'kind'), edgesByType: counts(corpus.edges, 'type'), prerequisiteSelfLoops: pre.filter(edge => edge.source === edge.target).length, interpretation: 'These are generated edge labels, not validated educational relationships.' };
// P11. Cycles, disconnected nodes, parallel edges, roots, and breadth control.
const shapeNodes = ['a','b','c','z'].map(id => ({id}));
const shapeEdges = [{source:'a',type:'x',target:'b'}, {source:'a',type:'y',target:'b'}, {source:'b',type:'x',target:'a'}, {source:'b',type:'x',target:'c'}, {source:'c',type:'x',target:'c'}];
const shapeView = createGraphView({nodes:shapeNodes, edges:shapeEdges, nodeId:x=>x.id, maxDepth:20});
const cycleResult = shapeView.subgraph({rootIds:['a','a'],depth:20});
assert.deepEqual(cycleResult.value.nodes.map(x=>x.id), ['a','b','c']);
assert.equal(cycleResult.value.edges.length,5);
const starNodes = Array.from({length:1001}, (_,i)=>({id:String(i)}));
const starEdges = starNodes.slice(1).map(x=>({source:'0',type:'x',target:x.id}));
const starResult = createGraphView({nodes:starNodes,edges:starEdges,nodeId:x=>x.id,maxDepth:1}).subgraph({rootIds:['0'],depth:1});
assert.equal(starResult.value.nodes.length,1001);
out.probes.P11 = {cycleResult, disconnected:shapeView.subgraph({rootIds:['z'],depth:20}), missing:shapeView.subgraph({rootIds:['missing'],depth:1}), highDegreeDepth:1, highDegreeReturnedNodes:starResult.value.nodes.length, interpretation:'Depth bounds hops; it does not independently bound breadth, bytes or CPU work.'};
out.sourceHashes = sourceHashes;
console.log(JSON.stringify(out, (key, value) => typeof value === 'number' && !Number.isFinite(value) ? {nonFiniteNumber: String(value)} : value, 2));
```
