# Landscape survey rounds 1a + 1b — harvest report

Date: 2026-08-17. Author: survey lane (Nautilus calls Plankton, c6d48b),
harvesting workflow run `wf_5b49d499-9b5`.

Primary sources, all in this report home unless stated:

- `round-1-raw.json` — round 1a archive (46 walkers).
- `round-1b-raw.json` — round 1b archive (77 seats: 64 walkers, 4
  decoys, 4 design-falsifiers + 1 instrument-falsifier, double
  reduction, comparator, scorer; per-agent usage; contamination
  record).
- `round-1a-leak-probe-2026-08-17.md` — the zero-cost 1a echo probe.
- `round-1b-mechanical-baseline.json` + `mechanical-baseline-generator.mjs`.
- `round-1b-workflow.mjs` — the instrument itself.
- `../../research/landscape-survey-round1b-fleet-design-2026-08-17.md`
  (operational spec), `...-briefs-...` (walker-visible texts),
  `...-design-rationale-...` (decision record).

Method note: every headline claim below was read from the raw
synthesis outputs in `round-1b-raw.json`, and the comparator's
arithmetic was itself recomputed by that stage from the reducers' raw
member lists rather than their prose. Duplicate-pair claims were
re-verified byte-level against the raw walker results during archive
construction.

## Verdicts on the round's five questions

1. **Is the tiered attractor real territory or convention prior?**
   Both, separably, and now measurably: the attractor is real and
   strong (69–85% of headline baseline observations land in it) but
   **tier-conditioned, not universal** — opus resists it reproducibly
   at every grounding sampled, and fable reproducibly reshapes it.
   The decoy arm falsifies the *blind-stamping* form of the
   convention-prior hypothesis: all four decoy tiers correctly
   declined to impose the tiered/licence-zoned shape on a fake estate
   that lacks the facts to carry it.
2. **Does seed variation move small tiers?** The 1a persona-uptake
   gradient extends downward: **terra is template-locked** — six
   near-copies of one fixed design across different groundings,
   different constraint grades, and even the de-ontologised free-form
   arm. Constraint grades do not move terra at all; they do move
   haiku.
3. **Do the stimulus controls detect instrument-induced structure?**
   Variant leakage (A3/B7/C12) is **not detectable** at this n and is
   confounded (tier effects dominate; terra is variant-insensitive;
   the instrument-falsifier additionally shows variant B changed
   valence, not just cardinality). The mechanical baselines behave as
   designed: both reducers place MECH-cochange and MECH-imports
   outside design space as calibration controls.
4. **Does the 1a incumbent elite survive falsification?** **No.
   Refuted 3 of 4** (opus, codex-relay, sol-relay: refuted; fable:
   sound-with-defects), on convergent, quote-anchored defects. All
   four fix designs independently land in the same *non-dominant*
   region: licence-rooted or axis-rooted paths, one-fact-one-carrier
   manifests, gates that recompute rather than read declarations.
5. **Is the instrument itself valid?** Partially. The
   instrument-falsifier demonstrates the probe set *supplies* the
   facet vocabulary (each probe names its own discriminating
   dimension), and reducer Y independently corroborates this from the
   other side: the facet dimensions "turned out not to discriminate —
   they appear in nearly every design." The dimensions on which the
   corpus genuinely varies — path-load, generated-byte custody,
   boundary-feedback — were **not** taught by the instrument, and the
   round's findings stand on those three.

## The attractor, per-observation

The comparator's per-observation table (13 headline grounding-b rows,
n=2 per tier, sol n=1) is in `round-1b-raw.json` →
`return.comparator.attractorTest.observations`. The verdict:

- Clean matches to the dominant tiered/committed/rule-static family:
  haiku 2/2, sonnet 2/2, codex 2/2, terra 2/2 (discounted —
  template-locked), sol 1/1 → **9/13 (69%)**.
- **Opus 0/2** — both grounding-b samples land in the
  path-light/axis-rooted, self-correcting/telemetry-governed corner,
  and opus's grounding-a sample lands there too. This is a stable,
  paired, tier-conditioned departure, not sampling noise.
- **Fable 2/2 partial** — both samples keep the zoned path family but
  add a telemetry-governed boundary-feedback loop the dominant shape
  lacks. Counting these as matches on the primary dimension gives
  11/13 (85%).
- The within-tier pairing is the strongest single piece of evidence
  the replication arm bought: both samples of every tier land in the
  same cell family, so tier-conditioning is real.
- One contested row: B-codex-12, where the two reducers disagree on
  the design's own primary classification (path-null vs
  taxonomic-zones) — a measured bound on per-design placement
  reliability.

Capability ordering, not vendor, predicts resistance: the two
highest-capability Anthropic tiers (opus, fable) are the only
departures; OpenAI's highest tier sampled (sol, n=1) matched the
modal cell — and reducer Y made B-sol-50 that cell's elite.

## Basin mass, with and without the falsifier fixes

Removing the four falsifier-origin fix designs from the corpus does
**not** shrink the dominant basin — it ticks it *up* slightly in every
calculation (X: 51.5% → 53.2%; Y modal: 31.3% → 33.3%; Y broadened:
43.3% → 46.0%), because the falsifier fixes overwhelmingly anchor the
**alternative** licence-rooted corner, not the dominant cell. The
suspicion that incumbent-derived entries prop up the dominant shape is
empirically reversed: they prop up its challenger.

## The falsification arm: the 1a incumbent is refuted

Four independent high-tier falsifiers received the 1a elite design
verbatim (sealed packet, no repo access) with a brief to refute or
pass it. Verdicts: **refuted** (K-opus, 14 defects), **refuted**
(K-codex relay, 17), **refuted** (K-sol relay, 18),
**sound-with-defects** (K-fable, 12). The defect sets converge on the
same load-bearing failures, each quote-anchored to the packet:

- The "near-orthogonal classifications" headline is false: Generation
  Origin, Change Rhythm, and Edit Boundary are one fact declared
  three ways on the same manifest field family, with no reconciler.
- The `Mixed (per-export-path)` licence value violates the estate's
  hardest stated invariant (licence classes never mixable in one
  unit), and its stated carrier (licence slots in the Node `exports`
  map) does not exist as a mechanism.
- The estate's first question — "will anything tell me what else must
  change?" — has declarations but no detector anywhere in the design.
- The elite's own summary misdescribes its artefact (claims a licence
  root partition and regeneration manifests present nowhere in its
  layout sketch) — the propagated summary was partly fiction, which
  retrospectively strengthens the 1a decision to hand falsifiers the
  full packet rather than summaries.
- The 24MB regenerating mined corpus — the estate's most awkward byte
  class — is never placed.

All four fix designs, produced blind to each other, converge on:
licence class as a root partition (structural, not declared), edit
ownership as a fixed subtree grammar (`src/`/`gen|generated/`/
`vendor/`, no Mixed value), everything mutable in one validated
manifest, no rule keyed on a path glob, and a gate that **recomputes**
(regenerate-and-diff, digest provenance, licence purity, import
policy over the resolved graph). Reducer Y: "the four falsifier fixes
independently converge on O-seeded-29's territory."

## The instrument on trial

K-instrument (opus, attacking the survey instrument itself) found the
probe set is "the forbidden census delivered through the front door":
every probe is a minimal pair that names its own discriminating
dimension, so facet convergence across the fleet measures the prompt,
not the territory. Further confirmed defects: `forcedFit` can only
attribute misfit to the respondent, never the instrument;
`additionalProperties:false` closes every channel disagreement could
use; the free-form variant disclaims the answer's shape then
re-imposes it ("state what determines where any given piece of code
lives"); the 308 multi-unit-commit statistic presupposes the incumbent
partition; the licence probes are unverifiable under the Markdown
ban; and "monorepo" is a frozen premise that forecloses repo-boundary
answers.

The decisive cross-validation: reducer Y, working only from the
corpus, independently reported that the facet dimensions do not
discriminate (nearly every design carries them) and derived its
descriptors from what actually varies. The instrument taught the
facets; it did not teach path-load, byte custody, or
boundary-feedback — so conclusions drawn on those three dimensions
survive the instrument critique, and facet-level convergence claims
do not.

## Elites against the measured record

The scorer read the seven elite designs' actual text against the
measured co-change record (glosses: vocab-mining↔corpus-data 95%,
es-ingest 89%, fidelity-capture 86%). Finding: **six of seven elites
unconditionally extract the P10 generic-datastore machinery — exactly
the split the measured 89% co-change argues against — with no cost
check.** Only O-grade3-62 prices the boundary before drawing it
(extracts only the credential-holding adapter sliver, keeps the rest
until a second consumer exists). "Extract generic-looking machinery
on sight" is a cross-framework blind spot that survives every
organising principle in the elite set. Governance answerability is
highest exactly where "one fact, one carrier" is a named organising
rule (K-opus-1-fix 5/5, X-seeded-35 5/5, F-grade3-63 4/5).

## Mechanical baselines as controls

Both reducers refuse the MECH entries a design cell and use them as
calibration: measured co-change groups the search CLI with two SDKs
and agent-tools with the error primitive — cutting across the seams
the tiered family treats as foundational — and the measured import
graph supports "one substrate tier plus two small domain clusters
plus a residual blob," not a multi-level core/libs/sdks/design
hierarchy. Reducer X names MECH-imports "the archive's sharpest
falsifier" of the modal cell's tiering.

## Outliers and escapes worth keeping verbatim

- **D-free-52** (haiku, free-form): reframes organisation as
  "regeneration and ownership choreography, not a directory tree
  problem" — the corpus's only genuine frame escape; verified
  first-hand (its safety-classifier review was unavailable at run
  time; content is benign and coherent).
- **D-free-53**: per-unit turbo cache-hit rate as a free, continuous
  boundary-quality measurement — reducer X calls it "the single most
  original mechanism anywhere here."
- **O-grade3-62**: the byte-durability test ("reproducible byte-exact
  from tracked inputs alone?") that evicts derived artefacts without
  deleting lockfiles, plus the meta-rule stopping name grammars from
  becoming a covert tree.
- **B-opus-7**: the rule that *deletes* classifications — any
  change-trigger value with no detector is removed within a quarter.
- **O-seeded-30**: boundary quality as one ratcheted number (re-handle
  budget seeded at the measured 5.2% multi-unit-commit baseline).
- **B-fable-9 / B2-fable-59**: repairs the co-change metric itself —
  generator-driven fan-out commits are exempted so regeneration events
  cannot poison the boundary-health number.

## Contamination and compromised arms (instrument accounting)

- **CLI relay filename race** (defect, cured for any future round):
  the relay brief fixed `p.txt`/`s.json`/`out.txt` for every
  concurrent codex seat in one shared scratchpad. Loud branch:
  SOL-seeded-51's prompt files were overwritten mid-window with the
  D-decoy estate task; the relay agent detected the mutation and
  refused to transcribe it (SOL-seeded arm n=0, `compromisedArms`).
  Silent branch: B-terra-39/40 byte-identical across *different
  groundings* (one observation, not two). Cure: per-seat filenames.
- **Terra template-lock** (finding, not defect): B-terra-38 matches
  the raced pair at design level with independent notes, T-grade2-44
  = T-grade3-48 across *different constraint grades*, and D-free-55
  reproduces the same estate design inside the free-form arm.
  Independent runs, one template. Terra contributes essentially one
  design to any corpus regardless of stimulus; price future fleets
  accordingly (n=1 is honest; n=6 buys noise-free redundancy, not
  evidence).
- Fable's near-duplicate pair (B-fable-9 ~ B2-fable-59) is **not**
  contamination: full results differ; this is replication stability.
- 4 first-run seats died at an Anthropic session-quota wall and were
  resumed cleanly (71 cached, ~0.5M completion cost at the time);
  the archive-per-round + resume design absorbed the failure class as
  intended.

## Integration with round 1a

- The 1a leak probe (20/46 walkers echo ratified-layout vocabulary; 7
  sealed walkers emit tier-paths with no repo access) motivated 1b's
  closed-shape blindness, decoys, and sealed groundings. 1b then
  showed the sealed prior *fires territory-responsively*: decoys got
  no tiered shape, and the real estate did. The convention prior is
  real but keyed to genuine surface features; the strong (blind)
  form is falsified.
- 1a's "grounding does not move the shape" survives with a
  refinement: grounding moves designs *within* the family toward
  correction-flavoured incumbent-tuning (reducer Y's category), and
  produces live estate defects as content — the two independently
  grounded opus runs converging on path-light is the corpus's only
  case of convergent structure from independent evidence.
- 1a's open model-prior question (40/46 walkers one model) is now
  answered by construction: per-tier baselines show the attractor is
  cross-vendor at the low-and-mid tiers and resisted at the Anthropic
  high tiers.

## Budget actuals

- Round 1b total: first run ~6.14M measured subagent tokens + resume
  run 3,173,904 measured (77 agents, 45.7 min) ≈ **9.3M**, against a
  3.25M presented cap. Per-agent usage is in the archive
  (`perAgentUsage`); the ~2× estimate error and its mechanism are
  banked in `fleet-design-lessons-2026-08-17.md` — this round adds
  the resume-tail as a further uncounted line item.
- Round 1a: ~3.5M vs ≤1.1M estimated. Two rounds, one lesson: derive
  caps from measured per-agent actuals; watch spend during the run.

## What round 2 should be

Verdict: **not another walker fleet.** The corpus is saturated where
it is cheap (the modal cell re-confirms at every tier that can reach
it; terra adds nothing further; facet convergence is instrument-taught)
and the discriminating evidence now sits in a small, convergent,
high-quality region: the four falsifier fixes plus O-seeded-29/30,
O-grade3-62, B2-opus-58, F-grade3-63, D-free-53's metric — all
sharing one meta-commitment (carriers priced by cost-of-being-wrong,
checks that recompute, a named falsifier for the design itself).

Round 2 should be a **grounded adjudication round**: synthesise that
region into one candidate organisational design for THIS estate;
verify against the real workspace every claim the falsifiers flagged
as unverified (imports resolve by package name; actual migration
costs; regeneration-diff cost at 5,900 commits/yr; the 24MB corpus
digest cost); stress it with the measured record (the P10 89%
co-change blind spot becomes a test case, with O-grade3-62's pricing
rule as the control); and present the synthesis with a migration cost
model for owner ratification. Fleet shape: small — one synthesis
seat, a grounded verification pass, an adversarial panel; no
baselines, no decoys, no walker corpus.

If any future round does run walkers, the instrument cures are
mandatory: per-seat relay filenames; probes redesigned as tests that
do not name their own discriminating dimension; an open extension
field and an instrument-critique channel in every schema; the
free-form arm freed of location/checkability presuppositions;
partition-dependent statistics restated at path granularity; the
monorepo premise unfrozen.

## Provenance-audit addendum (same day, post-publication)

An owner-directed forensic audit of the CLI relay arm, run after this
report first published, supersedes this report's contamination
section and several findings above. The governing owner ruling,
verbatim: "nothing we do should ever, ever rely on timing or races,
we build things so they WORK."

The audit reconstructed every relay seat's file writes and codex
spawns from the agent transcripts and attributed each spawn to the
prompt actually on disk at that moment. Measured: **7 of 28 codex
spawns executed a different seat's prompt** (writers landing seconds
before a neighbour's spawn), and the count is a lower bound — seats
that wrote via shell heredocs are invisible to the write-event sweep.
One seat (T-grade3-49's agent) hit the mid-flight mutation error,
re-spawned, "completed" in 73 seconds — impossible for a real run —
and returned what can only be another seat's stale output as its own
design. The SOL-seeded refusal, the byte-identical pair, and this
stale-return case are three surfaces of one defect: every CLI relay
seat shared three fixed filenames in one scratchpad.

Consequences, applied strictly (unverifiable provenance = struck, not
down-weighted):

- **Struck from all statistics**: every CLI-relayed row — B-terra-38/
  39/40, B2-terra-61, T-grade1-41/42/43, T-grade2-44/45/46,
  T-grade3-47/48/49, B-sol-50, SOL-seeded-51 (already n=0),
  D-free-55, DECOY-terra. They remain in the archive as unattributed
  designs. B-sol-50's content is high quality and plausibly genuine
  (its spawn was clean; no byte-duplicate exists), but its output was
  read from the shared `out.txt` after many other completions and
  cannot be attributed — struck. K-sol-1 is RETAINED: its 15:48:11Z
  spawn was clean and the write timeline shows no other writer after
  it, so its output file had exactly one producer; its content also
  self-validates (packet-quoting defects).
- **The terra "template-lock" finding is WITHDRAWN** — under crossed
  prompts, identical designs across "different groundings" cannot be
  distinguished from seats running the same accidentally-shared
  prompt. Tier-uptake claims about terra await a collision-free
  re-run.
- **Attractor headline restated** on native + MCP tiers only (10
  rows): haiku 2/2, sonnet 2/2, codex 2/2 match; opus 0/2 stable
  resistance; fable 2/2 partial — 6/10 strict, 8/10 counting fable's
  partial. Qualitatively unchanged: the attractor is real and
  tier-conditioned; the sol/terra columns are simply absent rather
  than supportive.
- **Decoy verdict restated on the three native decoys** (haiku,
  sonnet, opus — DECOY-opus remains the sharpest): the falsification
  of blind convention-stamping stands; DECOY-terra is struck.
- **Reducer Y's modal-cell elite selection loses its object**
  (B-sol-50); its cell structure is unaffected. The scorer's seven
  elites are all native or retained rows; its findings stand.
- Sol tier valid observations: zero from the fleet. An isolated,
  collision-free re-run of the SOL-seeded task (verbatim prompt and
  schema, per-run directory) was launched as part of this audit;
  a schema-conformance ping already passed cleanly, confirming the
  model and CLI path were never the problem.

Mandatory mechanics for any future cross-vendor arm, from the ruling:
per-seat directories (eliminate the shared resource, never shrink the
window), a task identifier echoed through the output schema and
verified on return, and provenance checks that recompute rather than
assume.

## Re-integration addendum (same day, after the collision-free re-runs)

Owner-ratified sequence completed: all 16 struck CLI tasks were re-run
collision-free (`round-1b-rerun-clean.json` — per-run directories,
verbatim prompts recovered from each seat's own agent prompt, sha256
verified, 16/16 schema-valid on first attempt, zero relay agents), and
a blind opus classifier placed every clean design in both reducers'
published descriptor spaces, evidence-quoted per axis
(`round-1b-rerun-classification.json`; 131,370 tokens).

Findings that replace the struck column:

- **Terra template-lock never existed**: all 14 clean terra outputs
  are distinct designs. The fleet's near-copy cluster was one draw
  duplicated by output cross-reads.
- **Clean occupancy** (16 rows): X — path-null 9, path-heavy 5,
  path-light 2; assurance reproduced 13, self-correcting 2,
  recomputed 1 (the decoy); `stated` still empty. Y — flat-namespace
  9, taxonomic-zones 4, axis-rooted 2, no-layout 1 (free-form),
  incumbent-tuned 0. Exactly **3 of 16** match the dominant tiered
  shape on both readings (two terra grounding-a rows and the terra
  grounding-b baseline, the last contested).
- **Attractor headline restated** (grounding-b, now with clean
  cross-vendor columns): haiku 2/2, sonnet 2/2, codex 2/2, clean
  terra baseline 1/1 (contested) match; opus 0/2, clean sol baseline
  0/1, sol-seeded 0/1 depart; fable 2/2 partial. 7/12 strict, 9/12
  counting fable's partial. The pattern is now **capability-graded
  across BOTH vendors**: every low/mid tier sampled matches
  (haiku, sonnet, codex, terra); every high tier resists or reshapes
  (opus fully, fable partially, sol on custody+feedback with a
  tiered path, sol-seeded to axis-rooted/path-light). The clean sol
  baseline is the instructive case: it keeps a zoned tree but
  attaches durability-split custody and change-coupling telemetry —
  high tiers do not reject the tree so much as refuse
  declaration-only assurance.
- **Basin mass restated** (struck rows removed, clean rows added):
  X's tiered family 52% → **45.5%** (30/66); Y's modal cell 31.3% →
  **23.9%** (16/67); the flat/path-null family rises to ~32%. The
  tiered family remains the largest single X family, but the
  contamination had overstated it, and in Y's finer space the modal
  cell no longer dominates the flat family.
- The decoy re-run stays territory-responsive (no licence zones or
  tiers invented; the sole `recomputed` row — the fake estate gives
  it nothing to reproduce), and the free-form re-run lands
  `no-layout`, replacing the raced D-free-55 with a genuine
  frame-escape observation.

Round-2 consequence: the convergent region gains its final piece of
support — clean high-tier evidence from both vendors converges on
manifest-carried classification with recompute-or-better assurance,
whether over flat, axis-rooted, or zoned trees; the load-bearing
disagreement left in the corpus is path-carried versus
manifest-carried classification, which is exactly what the grounded
adjudication round verifies against the real estate's measured costs.

## Limitations

- Six B2-* baseline shapes rest on the two reducers' independent
  cell-placement agreement, not on re-reading their design text (the
  comparator flags this explicitly).
- The B-codex-12 contested placement bounds per-design placement
  reliability; corpus-level statistics are robust to it, single-design
  claims are not.
- Sol is n=1 (the seeded seat was lost to the relay race); the
  cross-vendor high-tier comparison is thinner than designed.
- The decoy test cannot distinguish "reasoned about this estate" from
  "correctly pattern-matched which convention applies" — both produce
  the observed behaviour; only a grounded adjudication round can.
- All falsifier cost claims about the fix designs are unverified
  against the real workspace, by design (sealed packets); round 2's
  first job is exactly that verification.
