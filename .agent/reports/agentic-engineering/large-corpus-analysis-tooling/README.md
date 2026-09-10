# Large-corpus-analysis — run checkpoints and runbook

The corpus-analysis workflow tooling is standard TypeScript in
[`agent-tools/src/corpus-analysis/`](../../../../agent-tools/src/corpus-analysis/) — the tested
aggregation/orchestration modules, plus [`workflows/`](../../../../agent-tools/src/corpus-analysis/workflows/)
(the four stage entries, prompts, zod stage contracts, sandbox guards) and
[`workflows/build/`](../../../../agent-tools/src/corpus-analysis/workflows/build/) (the esbuild
bundling, harness emitter, and machine-enforced output contract). Every stage artefact is compiled
and bundled from that source; nothing runnable is hand-authored, mirrored, or spliced. `pnpm build`
verifies all four stages against the harness output contract on every build.

This directory holds the **run evidence**: the committed checkpoint JSONs each stage consumes and
produces, and this runbook. It embodies
[PDR-122](../../../practice-core/decision-records/PDR-122-agentic-judgment-pipelines.md) (atomic
judgment, deterministic aggregation, conserve-by-default) and feeds the conservation machinery
(PDR-014 `consolidate-docs` / `consolidate-until-done`).

## Runbook — discovery run (corpus pinned 2026-07-01)

- **Corpus pin:** the 100 corpus files (`data/discovery-run-partition-2026-07-01.json`) are
  byte-identical to commit `194fdc704`. **Do not write to `.agent/memory/active/napkin.md` (w15)
  before the map stage completes** — a write breaks the pin. Re-verify the pin before spending.
- **Ceiling:** `--ceiling 30000000` (owner-decided; 120-candidate projection × 5 voters × ~50k).
  The ceiling has no default anywhere; the validate stage returns a typed failure before
  dispatching any voter if the real candidate count would breach it.
- **Throttle:** map runs at `MAP_CONCURRENCY = 4` with deterministic jitter; validate at
  `MAX_CONCURRENCY = 3` (≤3 voters in flight per candidate loop).

Each step: build the seeded artefact (validates the input checkpoints with the zod stage
contracts — a partial map, a failed stage, or an incomplete merged disposition set is a typed
refusal), launch it, then commit the returned result envelope as the next checkpoint.

```bash
# from agent-tools/; artefacts land in dist/corpus-analysis/workflows/ (gitignored)
pnpm build-run-artefact --stage map --partition <partition.json>
# → Workflow({scriptPath: dist/.../map.workflow.seeded.mjs}) → commit result as map-result.json
#   (the result carries mapComplete/incompleteWindows — a partial map cannot seed reduce)

pnpm build-run-artefact --stage reduce --map-result <map-result.json>
# → run → commit reduce-result.json

pnpm build-run-artefact --stage validate --map-result <map-result.json> \
  --reduce-result <reduce-result.json> --ceiling 30000000
# → run → commit validate-result.json
#   On a quota trip: re-run with --validate-result <prior.json> (repeatable) — resume ids are
#   derived from the prior results' terminal dispositions; only the unresolved tail re-runs.

pnpm build-run-artefact --stage meta --reduce-result <reduce-result.json> \
  --validate-result <validate-result.json> [--validate-result <tail.json> ...]
# → run → commit meta-result.json
#   The merged-set gate is structural: every candidate must carry exactly one terminal
#   disposition or the build refuses to seed meta.
```

After meta: the deterministic post-run driver (strict re-parse via the stage-io/judgment parsers →
recall integrity → Choice-B verdict {strict ≥ 0.6, lenient ≥ 0.85} → coverage + temporal coverage →
recompute every disposition by replaying `adjudicate`), then the conservation buffer and
`consolidate-until-done` — that conservation is the run's success; recall is the tuning
instrument, never the milestone.

### Known limitation (surfaced, owner-dispositioned)

- **w15 self-reference:** `napkin.md` (w15) holds the discovery tooling's own development notes.
  Accepted as legitimate agent-engineering corpus content (tooling-dev recurs across all 15
  windows; 1 file of 100); post-run novelty-stratification buckets any self-referential pattern as
  re-confirming-known, not novel yield.

## Checkpoints (`data/`)

- **`discovery-run-partition-2026-07-01.json`** — the 15-window token-balanced partition of the
  100 pinned corpus files (map stage input; validated by `mapRunDataSchema`).
- **`v2-rerun-corrected-findings-2026-06-30.json`** — the v2 rerun's full corrected findings: 50
  candidates, 45 keep / 5 kill dispositions, 182 voter outcomes, 18 recall matches, 31
  corroboration claims. The conservation source for graduating the v2 patterns.
- **`probe-w08-w10-w11-{leaves,candidates}-2026-06-30.json`** — the WS1 grain-probe outputs (167
  leaves, 75 candidates over 3 windows). Probe evidence, NOT validated discovery; the probe PASS
  surfaced the grain fix and the ~80–120 candidate full-run projection behind the 30M ceiling.

## Operational notes (verified first-hand)

- Launch seeded artefacts with an ABSOLUTE `scriptPath`: the Workflow tool resolves a
  relative path against the CALLER'S current working directory, not the repo root, and a
  build step typically leaves the shell in `agent-tools/` (first-hand, 2026-08-07
  longitudinal run — the relative launch failed on a doubled `agent-tools/agent-tools/`
  path).
- The Workflow tool's `.output` file wraps the script's return under `.result` (alongside
  `summary`, `logs`, `totalTokens`). Every stage returns a typed envelope discriminated on `ok` —
  inspect it before committing a checkpoint; a failure is a value, not an exception.
- The harness accepts artefacts up to 524,288 chars; the build's output contract enforces the cap
  (validate's leaves are projected to `{id, window, grounding}` to stay well under it). A
  legitimately-oversized validate splits into candidate-subset runs via the resume mechanism.
- Voter cost calibration: ~50k tokens/voter at high effort over grounding-heavy prompts
  (`OBSERVED_VALIDATE_TOKENS_PER_VOTER`, `run-orchestration.ts`).

## Runbook — since-marker run (first used 2026-09-02)

A pass scoped to "napkins since the last processed marker" does not re-map files a prior
run already mapped. The shape, all file-level, no engine change:

1. **Partition only the post-marker files** (plus any file that shared a window with an
   out-of-scope file in the prior run, so the new window has a clean file boundary). Use
   window ids that continue the prior run's numbering so leaf ids stay unique.
2. **Map** as normal; assess the map checkpoint before spending further: (a) each mapper's
   `Read` calls cover its file in contiguous line ranges up to the file's line count;
   (b) every leaf's grounding quote anchors verbatim in its archive after whitespace
   collapsing (split abridged quotes at their ellipses and anchor the fragments).
3. **Splice** the prior map checkpoint's leaves for the in-scope files by window into a
   union map-result (partition and coverage rows added, `leafCount` recomputed, ids
   unique). The union is the reduce corpus.
4. **Reduce** over the union, then **dedup in-seat** against the prior run's full
   adjudicated set (kept and killed): same-mechanism-as-a-keep candidates are not re-voted
   (their post-marker recurrence is the finding); same-as-a-kill with pre-marker evidence
   only are not re-voted; everything else forms a filtered reduce-result checkpoint.
5. **Validate and meta over the filtered checkpoint**; the full reduce result stays
   committed beside it, and the merged-disposition gate is satisfied over the filtered set.
   Publish the dedup mapping in the report so any row can be contested.

The meta stage emits absolute home paths; rewrite them repo-relative before committing the
checkpoint (the driver resolves either form; the path ratchet accepts only the relative one).
