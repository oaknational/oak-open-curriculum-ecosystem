# Reproducing the TypeScript graph foundations evidence

**7 September 2026.** Companion to [the report](typescript-graph-foundations-report-2026-09-07.md).

The [source bundle](typescript-graph-foundations-probes-2026-09-07.json) contains 18 UTF-8 files with SHA-256 hashes: original research scripts, exact package manifests/locks, TypeScript fixtures and a candidate-specific README. The [evidence file](typescript-graph-foundations-evidence-2026-09-07.json) preserves recorded observations, raw timings, summary distributions, compiler diagnostics, source hashes and method limitations. The bundle deliberately contains no checkout of OCE or generated/transpiled OCE source.

A successful behavioural run means that the recorded observations—including identified defects—were reproduced. It is not a candidate conformance certificate. Timings will vary by host, runtime, system load and compiler/package versions.

## Environment and source

Original execution: Node **24.19.0**, V8 **13.6.233.17-node.51**, Linux x64, AMD EPYC 9V74 shared host. Root TypeScript probe uses **6.0.3**; functional/numeric and RDF probes use **5.9.3**, all pinned in their manifests/locks. Reproduce with the original Node version to minimise runtime differences.

OCE commit: `dfe92492711f8d7c6ac8233735994c8fada45e0e`. Corpus:

`packages/sdks/oak-sdk-codegen/src/generated/vocab/graph-corpus/data.json`

Corpus SHA-256: `6252ee33a2f5472dc127df1f6c823a146ce1076f1ffd86ad3feef93a40d67158`.

Installation and cloning require access to npm and the OCE GitHub repository. The probes themselves do not send data externally. They read unchanged OCE source/corpus from a separate checkout and write outputs only in the reproduction directories. No monorepo installation or OCE build is needed.

## Extract the bundle

Place this guide, the source bundle and recorded evidence together. From that directory, run the following with Python 3. It creates a **new** `graph-foundations-reproduction` directory and refuses to overwrite an existing one.

```python
import hashlib
import json
from pathlib import Path, PurePosixPath

bundle = json.loads(Path(
    "typescript-graph-foundations-probes-2026-09-07.json"
).read_text())
root = Path("graph-foundations-reproduction")
root.mkdir(exist_ok=False)
for item in bundle["files"]:
    rel = PurePosixPath(item["path"])
    assert not rel.is_absolute() and ".." not in rel.parts
    data = item["content"].encode("utf-8")
    assert hashlib.sha256(data).hexdigest() == item["sha256"]
    destination = root.joinpath(*rel.parts)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(data)
print(f"Extracted and verified {len(bundle['files'])} files")
```

## Acquire the pinned checkout

From the directory containing the new reproduction directory:

```sh
git clone --filter=blob:none --no-checkout https://github.com/EngraphCode/open-curriculum-ecosystem.git graph-foundations-reproduction/oce
git -C graph-foundations-reproduction/oce checkout --detach dfe92492711f8d7c6ac8233735994c8fada45e0e
```

The resulting siblings must be `oce/`, `probes/`, `candidate-b/` and `rdf-seam-probes/`. The scripts verify the commit or corpus hash where material, and RDF results record hashes of each executed OCE source file. The type fixtures intentionally use this sibling layout.

## Run the probes

Run the blocks sequentially from the indicated directories. `npm ci` uses the included lockfile with lifecycle scripts disabled. The source includes esbuild’s platform package through its lockfile; no manual copying of OCE implementation is required.

```sh
cd graph-foundations-reproduction/probes
npm ci --ignore-scripts --no-audit --no-fund
node --expose-gc run.mjs ../oce > root-run.log
node supplement.mjs ../oce > supplement-run.log
./node_modules/.bin/tsc -p tsconfig.json --extendedDiagnostics > type-results.txt
```

This creates `root-results.json`, `supplement-results.json`, generated local `oce-view.mjs`/`oce-dataset.mjs` and compiler diagnostics. The root type probe should compile cleanly; its `@ts-expect-error` assertions verify that specified invalid assignments are rejected. The script also demonstrates an accepted method-variance widening risk deliberately.

```sh
cd ../candidate-b
npm ci --ignore-scripts --no-audit --no-fund
node behaviour-probes.mjs > behaviour-results.json
node type-probes.mjs > type-results.json
node --expose-gc equal-workload.mjs ../oce > equal-workload-results.json
```

The functional/numeric probes contain **21 behavioural observations** and **5 type diagnostic expectations**. One Effect 4 type case deliberately expects missing Disposable declarations; the next supplies `ESNext.Disposable` and compiles cleanly. Source for virtual type cases is embedded in the result. Stable Effect 3 and Effect 4 RC coexist via the `effect4` npm alias.

The equal-workload script compares native indexing, Effect 4 RC and Graphology under the same node/edge/output-order and retained-snapshot contract. Five rotating repetitions measure conversion/build, first/reused queries, publication of 100 additions and updated queries. It verifies complete outputs with an independent edge-list oracle; it does not measure ecosystem-wide algorithm reuse or maintenance economics.

```sh
cd ../probes
node effect-probe.mjs ../oce > effect-run.log
node seam-laws.mjs > seam-laws-results.json
```

The Effect supplemental timing file writes `effect-results.json` in the current working directory. In the original research session that particular script was launched from the workspace root, so its archived result is keyed `effect-results.json`; the reproduction output’s values/semantics are comparable even though its directory differs. The supplementary Effect timing was sequential, not the later paired common-contract comparison.

```sh
cd ../rdf-seam-probes
npm ci --ignore-scripts --no-audit --no-fund
node run-probes.cjs ../oce > rdf-run.log
```

The RDF script writes `results.json` containing **16 behavioural observations** and assignment diagnostics. It transpiles selected unchanged OCE source for execution in the research harness; this is not an OCE build. It records incompatibility diagnostics rather than requiring the deliberately incompatible assignments to compile. The assignment probe uses strict checking with `skipLibCheck:true` to isolate those assignments.

## What to compare

Compare named observations, output digests, counts, invariants and compiler diagnostic expectations first. Review any changed result against the exact runtime and package versions; do not reinterpret a newly fixed defect as a failed candidate merely because the old observation changed.

For timing, compare complete output contracts and lifecycle stages. Raw repetitions and min/median/max are in the evidence; these are within-run spreads, not confidence intervals. The early representation test has unequal output work across OCE and other implementations; the later `equal-workload` comparison removes that difference. JSON parse/serialisation, retained-memory signals and update publication are separate measurements with their own scope.

Memory deltas are noisy forced-GC retained-allocation observations, not peak RSS or total payload/WASM footprint. The recorded host is shared. The native examples omit substantial production-engine responsibilities and must not be promoted into an ownership recommendation from speed alone.

The investigation did not run full upstream conformance suites, all algorithm families, browser bundles, production traffic or dependency security audits. Architectural recommendations and exact-version readiness are deliberately separate in the report.
