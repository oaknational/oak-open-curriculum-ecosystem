# Landscape survey — round 1b fleet design (operational spec)

The execution contract for round 1b of
`workspace-taxonomy-landscape-survey`. Walker-visible texts:
`landscape-survey-round1b-briefs-2026-08-17.md`. Reasoning and roads
not taken: `landscape-survey-round1b-design-rationale-2026-08-17.md`.
Runnable script:
`.agent/reports/workspace-taxonomy-landscape-survey/round-1b-workflow.mjs`.
Falsifier input:
`.agent/reports/workspace-taxonomy-landscape-survey/round-1b-falsifier-packet.json`
(regenerated mechanically from the committed `round-1-raw.json`:
dominant cell = max memberCount → 19 members → elite walker 35).

Status: decision-complete pending fleet-design review (this document is
the review's object, per `fleet-design-review-before-expensive-fleets`)
and the owner's launch word. Launch is additionally held behind the
PR-889 closeout per owner word 2026-08-17 ("Let's get 889 sorted before
we run round 1b") and the GitHub-incident hold (launch itself needs no
GitHub operation — the hold constrains only the 889 closeout ahead of
it).

## 1. What round 1b measures (the four questions)

1. **Model prior vs territory** — 1a left this OPEN (40/46 walkers one
   model). Instrument: 18 unseeded baselines — 11 across four native
   tiers plus SEVEN cross-vendor seats (3 MCP-relay codex, 3 CLI
   terra-medium, 1 CLI sol-ultra). Verdict comes from the comparator's
   attractor test: a shape every tier's baseline reaches is territory;
   a shape only some tiers reach is those tiers' prior. The
   owner-directed CLI arms materially strengthen this question — the
   cross-vendor control was the rationale doc's thinnest-named
   limitation before them — and the terra arm's exact mirror of the
   haiku constraint grades adds a second cross-vendor axis: does
   constraint-stringency response transfer across vendors
   seat-for-seat?
2. **Rubric leakage** — 1a's six-item decision-needs list correlated
   with the walkers' 5-6 classification mode. Instrument: requirements
   as PROSE in THREE variants deliberately differing in concern
   cardinality (A=3, B=7, C=12), explicitly balanced 6/6/6 over
   grounding-c seats. Classification count tracking concern
   cardinality is a positive leakage measurement. (The frame-challenger
   killed the first design here: two variants with the same seven
   concerns in different voices — a test built to return a null.)
3. **The 1a lens itself** — the owner's requirement that 1b "properly
   challenges 1a". Instruments: a falsification arm attacking the 1a
   dominant elite verbatim; TWO independent reducers deriving fresh
   descriptors (1a's reducer was sonnet; 1b's are opus and fable) with
   a comparator treating descriptor mismatch as a finding; generation
   blindness (walkers cannot read the survey's own report home).
4. **Landscape enrichment** — new basins from tier-matched seeding:
   constraint grades that make the 1a dominant carrier (role/tier
   directory family) unreachable, forcing the search elsewhere.
5. **Territory vs convention (the third pole)** — universal baseline
   agreement could be industry cowpath rather than estate territory,
   and no seeding-side control can separate them. Instruments, both
   from the frame-challenger review: DECOY-ESTATE controls (4 seats,
   same task, a tiny single-licence no-generated-artefacts estate
   where the dominant shape would be manifestly wrong — reproducing it
   there convicts the convention prior) and a FREE-FORM arm (4 seats,
   task statement stripped of the classifications-with-carriers
   demand, schema `{proposal, notes}` — measuring whether the
   classification ontology itself is instrument or territory). One
   falsifier seat additionally attacks the INSTRUMENT rather than any
   design.

## 2. Arms and tiers (64 walkers + 4 decoy controls + 5 falsifier-arm seats + 4 synthesis seats)

| Arm | Count | Tier | Seeding | Groundings |
| --- | ----- | ---- | ------- | ---------- |
| B-haiku | 3 | haiku | none (baseline) | a, b, c(A) |
| B-sonnet | 3 | sonnet | none | a, b, c(B) |
| B-opus | 3 | opus | none | a, b, c(A) |
| B-fable | 2 | fable | none | b, c(B) |
| B-codex | 3 | codex relay | none | b, c(A), c(B) |
| H-graded | 9 | haiku | constraint grade 1/2/3, NO persona | each grade × a, b, c |
| S-seeded | 6 | sonnet | one-line persona + soft constraint | a b c a b c |
| O-seeded | 3 | opus | fuller persona + soft constraint | a, b, c |
| F-seeded | 2 | fable | rich persona, no constraint | a (cap 30), b |
| X-seeded | 4 | codex relay | constraint grades (2,2,3,1), no persona | b, c(A), b, c(B) |
| B-terra | 3 | codex CLI terra-medium | none | a, b, c |
| T-graded | 9 | codex CLI terra-medium | constraint grade 1/2/3, NO persona (haiku-arm mirror) | each grade × a, b, c |
| B-sol | 1 | codex CLI sol-ultra | none | b |
| SOL-seeded | 1 | codex CLI sol-ultra | rich persona | b |
| D-free | 4 | haiku, opus, fable, terra-medium | free-form task, no ontology demand, no probes | b |
| B2 replication | 6 | haiku, sonnet, opus, fable, codex MCP, terra | none (second grounding-b baseline per tier — the attractor test's balanced headline column at n=2; sol stays n=1) | b |
| O/F-grade3 | 2 | opus, fable | grade-3 directory ban at high tier (the carrier-ban test where the attractor actually appears) | b |
| D-decoy | 4 | haiku, sonnet, opus, terra-medium | standard task (no probes), DECOY estate facts | decoy sheet |
| K-design | 4 | opus, fable, codex MCP, codex CLI sol-ultra | walker-35 packet verbatim; may verdict "sound" | packet + facts + req-A |
| K-instrument | 1 | opus | attacks the task statement, probe set, and schema | instrument texts only |
| Reduce | 2 | opus, fable | corpus only, fresh descriptors | — |
| Compare | 1 | sonnet | both reductions + 1a descriptor tuple | — |
| Score | 1 | sonnet | reducer-X elites + measured record | — |

Baseline arms run FIRST in dispatch order but need no barrier — they
share the walker pool. Falsifiers are independent of walkers (their
input is the committed packet) and run concurrently. Reduction is a
true barrier: it needs the complete walker corpus. The two reducers run
in parallel; the comparator needs both; the scorer needs reducer X
only.

## 3. Instrument disciplines (each cures a named 1a defect)

- **Minimal walker schema, no self-scores, no trajectory** — both 1a
  hard failures were small-model StructuredOutput retry exhaustion;
  scoring belongs to the scorer stage.
- **Tier-matched seeding** — owner ruling: Haiku constraints-only with
  graded stringency; persona depth scales through sonnet/opus/fable.
- **Constraint grades attack the dominant carrier** — all three grades
  restrict directory-borne classification, which the 1a dominant shape
  spends freely; if the attractor survives even where its carrier is
  forbidden, that is strong evidence of territory (or of a prior deeper
  than layout).
- **Rubric blinding with a positive control** — no enumerated
  requirement list anywhere in walker text; three prose variants
  differing in concern cardinality (3/7/12), explicitly balanced
  6/6/6 over grounding-c seats.
- **Falsifiers may disconfirm** — the verdict field
  (refuted / sound-with-defects / sound) and nullable fixDesign mean
  an honest "this design survives" has an output slot; and the
  comparator prices the falsifier fix-designs' 1a anchoring by
  reporting basin mass with and without them.
- **Parser-not-transcriber relays** — 1a's codex leg had a native agent
  restructure codex prose; the 1b relay extracts a fenced JSON block
  verbatim or returns a named shortfall.
- **Read pricing and read caps** — 1a overshot ~3.2× because
  repo-direct read traffic was unpriced; 1b caps repo-direct walkers at
  30 files in-prompt with self-reported counts in `notes` (declared
  limitation: in-prompt is a soft cap; see rationale doc).
- **Generation blindness, leak-cured** — the forbidden list now
  includes the survey's own report home AND (frame-challenger cure,
  verified first-hand) `docs/`, `README.md`, and the agent directive
  files: ADR-041 states the ratified tiered layout verbatim and
  README:82 routes agents to the foundational ADRs, so the prior list
  left the incumbent answer readable by every repo-direct walker.
  Grounding-a is now an ALLOWLIST (manifests, workspace/turbo/tsconfig
  configs, lockfile, src/tests source only) and walkers must list
  every path they read, making any residual leak measurable.
- **Committed instrument** — briefs, script, and falsifier packet are
  committed BEFORE launch; 1a's walker-visible texts were session-local
  and are recoverable only by consensus reconstruction from walker
  echoes.

## 4. Budget (read-priced)

| Block | Estimate |
| ----- | -------- |
| Native + MCP baselines (14) | ~210k |
| Native + MCP seeded walkers (24) | ~385k |
| Repo-direct read traffic, native arms (~10 walkers × ≤30 files) | ~450k |
| Falsifiers (5, packet-loaded) | ~160k |
| CLI terra arm (12 seats × ~35k incl. ~19k fixed CLI overhead measured at smoke) | ~420k |
| CLI sol arm (3 seats × ~70k at ultra effort) | ~210k |
| CLI relay agents (17 × ~4k sonnet-low) | ~70k |
| Free-form arm (4 seats incl. one terra relay) | ~85k |
| Decoy controls (4 seats incl. one terra relay) | ~75k |
| B2 replication (6) + high-tier grade-3 (2) | ~165k |
| Reducers (2 × full corpus, now ~68 designs) | ~330k |
| Comparator (decoy + leakage + basin-mass + attractor analyses) + scorer | ~180k |
| Subtotal | ~2.76M |
| Contingency (retries, schema re-asks, relay re-runs) ×1.12 | **~3.1M** |

Cap: **3.25M tokens** all-vendors-combined, PRESENTED TO THE OWNER AT
THE LAUNCH-WORD GATE — the last agreed envelope (~2.1M) was priced
against a 42-seat fleet; the growth since is the owner's own CLI
addition (~+0.7M) plus the fleet-design review's absorbed cures
(~+0.35M: replication, high-tier carrier-ban seats, stimulus
controls, free-form arm). CLI spend lands on the codex account, not
the Anthropic budget — the combined number is still the honest cost
figure. The cap is enforced by the seat watching the run, not by the
script (the Workflow budget primitive binds only when the owner sets
a turn budget). 1a's actuals (~3.5M vs ≤1.1M estimated) are the
calibration warning; the corrections are read-traffic pricing, the
measured ~19k fixed CLI overhead, an explicit listings cap in the
repo-direct grounding (one full tracked-path listing on this estate
is ~800k characters ≈ 204k tokens — the 1a overshoot's likely
mechanism, uncapped by any per-file count), and per-tier rates in
the table above.

## 5. Failure tolerance, exit, kill, resume

- **Per-walker failure** (schema-retry exhaustion, relay shortfall):
  tolerated; nulls filtered; every shortfall named in the archive.
  1a precedent: walkers 20 and 42, tolerated by design (session-record
  provenance — the committed 1a archive carries no per-walker model
  field; the 1b archive rows carry tier and invocation path so the
  next round can check such claims from the committed record).
- **Per-arm abort bar**: if more than 25% of any arm fails — the
  falsifier arms included, they sit inside the same health check — the
  round reports the arm as COMPROMISED in its return value rather than
  presenting a hollow corpus as complete; the seat surfaces it before
  any harvest claims.
- **Relay-path failure decision rule**: if an entire relay PATH fails
  (MCP or CLI), question 1 keeps the native tiers plus the surviving
  vendor path and the harvest names the lost control explicitly — the
  cross-vendor comparison degrades, it is never silently narrated
  around.
- **Reducer failure is recoverable at zero walker cost**: the return
  value carries the full walker corpus even when reduction fails, and
  `resumeFromRunId` replays completed agents from cache — a reduction
  re-run pays only the reducer seats. Reducer schemas carry maxItems
  caps (descriptors 8, cells 16, outliers 12) against the
  oversized-emit failure class.
- **Post-run hygiene**: `git status` sweep after the round — 60+
  concurrent tool-holding agents and a live checkout; any stray write
  is found, surfaced, and disposed, never left.
- **Exit**: single round — all arms complete or shortfall-named. No
  loop, so no loop-exit criteria beyond completion; the CAMPAIGN's
  exit criteria live in the plan (two consecutive rounds minting no new
  above-threshold cell AND stable top basin, or the budget cap).
- **Kill**: the run may be stopped mid-flight at any moment; the
  archive artefact is written from whatever completed (as 1a's was),
  and `resumeFromRunId` replays completed agents at zero cost.
- **After the round the owner sees**: the combined 1a+1b harvest —
  archive map, per-tier attractor verdict, elites and outliers
  verbatim, rubric escapes, descriptor-mismatch findings, and the
  round-2 proposal — before any round-2 spend.

## 6. Verification gates before launch

1. Fleet-design review (this document + briefs + script) per
   `fleet-design-review-before-expensive-fleets`, with a
   frame-challenger seat per the model-tier stance gradient.
2. END-TO-END relay smoke, BOTH paths, with the REAL schemas — one MCP
   seat and one CLI seat run the full chain (brief → relay → vendor →
   schema'd extraction → RELAY_OUTCOME validation) before the fleet
   pays for fifteen. An availability ping is not this gate: the
   assumptions review flagged that both relay schema shapes (nested
   anyOf outcome; falsifier enum) are unproven against the
   structured-output validators, and a schema rejection at dispatch is
   a whole-arm loss. The CLI path's availability half is already
   probed live (`codex exec -s read-only -m gpt-5.6-terra …
   --output-schema … -o …` returned a clean schema'd reply; 19,110
   tokens fixed overhead measured; ChatGPT-login auth; runs start from
   the trusted repository root). Host-process discipline for the CLI
   seats is in the relay contract itself: `perl -e 'alarm 1800; exec
   @ARGV' --` bounded spawn (macOS ships no timeout binary), pid
   noted, process census before the relay returns — and CLI
   concurrency is bounded by the workflow's own agent cap.
3. **The zero-cost 1a leak probe**: before any 1b claims lean on 1a's
   dominant basin, grep the committed `round-1-raw.json` dominant-cell
   members for ADR-041 echoes (tier names, `packages/core|libs|sdks`
   vocabulary) — the leak was live in 1a, and its actual uptake there
   is measurable for free. (Capped, not open-ended: 1a's
   grounding-invariance probe already limits leak-as-sole-cause — the
   dominant shape appeared in facts-sheet and requirements-only
   walkers who could not read the repo.)
4. **The mechanical baseline**: compute the co-change-derived
   partition and the import-graph-derived partition directly from the
   measured record (git log + depcruise, local, near-zero fleet cost)
   and inject them as corpus entries via `args.extraCorpusEntries`
   (`origin=mechanical`). The frame-challenger's strongest economic
   point: the round otherwise spends ~96% generating candidates and
   ~4% evaluating against reality. These two entries give the reducers
   and scorer a reality-derived reference point inside the archive.
5. Owner launch word, after 889 is sorted (his sequencing).
