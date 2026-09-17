---
id: typescript-estate-consolidation-review
node_type: delivery
name: "TypeScript estate consolidation and architectural-coherence review"
overview: "Build reproducible evidence for consolidation and foundational-building-block decisions across every tracked TypeScript and TSX file, including generated carriers and the curriculum SDK, then shape a bounded foundations-first programme without applying production fixes."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-02
ratified_where: "Codex thread 019fc3, owner instruction on 2026-08-02: Implement the plan."
serves: outcome-informed-practice-learning
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-08-03
---

# TypeScript estate consolidation and architectural-coherence review

## Goal

Maintainers can make a bounded, evidence-backed decision about which repeated
TypeScript structures and algorithms should be generated, shared, inlined,
deleted, rerouted, or deliberately kept, where each intervention belongs, and
which genuinely shared low-context responsibilities warrant later promotion to
meticulously documented, comprehensively tested and mutation-tested core
packages.
The review covers every tracked `.ts` and `.tsx` file, including generated
code and the curriculum SDK, and leaves a reproducible evidence bundle plus
ticket-shaped remediation proposals. It does not change production code.

The live decision enabled is whether to authorise a sequenced foundations-first
consolidation programme and, for every accepted candidate, which semantic
authority, generator, core building block, foundational system, SDK or domain
library, application, or composition boundary should own the cure. The primary
readers are repository maintainers and architecture reviewers; their reading
changes candidate disposition, layer placement, remediation locus, and proposal
priority rather than merely recording estate statistics.

### Beneficiary and impact bridge

The immediate beneficiaries are contributors and agents who must locate the
right authority, predict change propagation, and avoid creating competing
forms. The expected effect is lower change cost and fewer inconsistent fixes
without erasing purposeful local variation. The bridge is explicit:

1. classify the whole estate and trace authority and shipping paths;
2. identify repeated mechanisms and test them against change evidence;
3. disposition every candidate at its real intervention locus; and
4. test foundation-relevant candidates against the core-building-block
   promotion frame; and
5. offer maintainers independently adoptable proposals with named proofs.

The review succeeds by improving the quality and boundedness of a later
consolidation decision. Counts, graphs, and documents are evidence for that
decision, not the beneficiary-level outcome themselves. The longer bridge is
duplicated responsibility removed once, implementation and assurance cost paid
once, thinner higher layers, cheaper safe product change, and more capacity to
deliver and learn from real value for real people.

The general systems pattern is homed separately in
[PDR-135](../../practice-core/decision-records/PDR-135-cost-of-change-gradient.md)
and the
[cost-of-change gradient guide](../../../docs/foundation/cost-of-change-gradient.md).
This plan consumes that pattern through its foundations-first software
projection; it does not own, ratify, or complete the broader concept.

## Evidence ceiling and authority boundary

Static analysis can observe syntax, declared dependencies, file organisation,
and some registration and build paths. Repository history can observe past
co-change. Packed-consumer and generation trials can observe selected shipped
forms. None of these proves that a runtime route is exercised in production,
that similarity is harmful duplication, that a proposed abstraction will be
cheaper, or that a human outcome improves. Inferences remain labelled and
missing evidence remains visible.

The evidence bundle is derived review material, not a canonical registry and
not an authority source. OpenAPI schemas, generator inputs, generator
implementations, package exports, and runtime composition retain their
existing authority. Generated code is reviewed as an observable carrier whose
form and organisation are controlled by this repository; a generated-file
finding still names the upstream generator or authority as the intervention
locus unless evidence locates the defect in packaging or composition.

No detector, score, or agent may ratify a remediation. The report can propose
and disposition; the owner and normal delivery process decide whether any
production change proceeds.

The review uses **decision-relevant** to mean evidence that could change a
proposal's inclusion, priority, canonical form, intervention locus, or
acceptance proof, or could change a claim about a public API, shipped runtime,
generator determinism, or canonical ownership. Uncertainty outside that
boundary remains visible but does not acquire veto power over the bounded
maintainer decision.

## Information-governance boundary

The review analyses repository source, generated artefacts, package metadata,
build declarations, and path-level Git history. It does not collect pupil data,
product-user data, workplace-performance data, or individual productivity
measures. History extraction omits author names and email addresses and uses
commit identity, time, paths, and change type only. Results must not be used
to rank or profile contributors. Raw source is not copied into the bundle
beyond the minimum repo-relative evidence location needed to reproduce a
signal.

If a proposed proof requires people-derived or pupil-derived evidence, that
proof stops and is reported as outside this plan; a separately authorised
privacy, safeguarding, and decision-rights review would be required before
collection.

## Mechanism

### 1. Pin the population and evidence contract

- Pin a full Git commit and record branch, dirty-state observation, toolchain,
  lockfile digest, file-list digest, and detector configuration.
- Derive the denominator from tracked `.ts` and `.tsx` files. Reconcile every
  later coverage claim to that immutable list.
- Classify each file by a total role function, one provenance vocabulary, and
  independent delivery dimensions whose values are `present`, `absent`,
  `not-probed`, or `ambiguous`. Unprobed evidence is never encoded as absence;
  `unknown` is evidence to resolve, never an exclusion category.
- Store the fixed raw extraction at
  `.agent/reports/typescript-estate-consolidation-review/raw-extraction.json`,
  validate it against `raw-extraction.schema.json`, and reference it from the
  derived `evidence.json` validated by `evidence.schema.json`.
  The final bundle records the reader and decision for each accounting
  surface and preserves raw evidence separately from normalised views.

### 2. Calibrate four end-to-end archetypes

Calibrate the model against four predeclared paths before estate-wide
extraction:

1. OpenAPI → codegen → curriculum SDK → MCP;
2. bulk data → generated vocabulary/search SDK → CLI or MCP;
3. agent-tools source → distribution output → CLI or hook; and
4. TSX source → production bundle → served UI.

For each archetype, follow both declared edges and executable shipped-form
evidence. Record every mismatch between the proposed edge vocabulary and the
observed path. Prefer existing repository tools. Add a minimal read-only
agent-tools extractor only if calibration proves a coverage gap that cannot be
closed by composing existing tools; do not add a dependency or a new gate for
the review.

Once calibration and the independent pre-execution reviews close, freeze the
detector universe and its configuration. A review blocker found before the
first estate run refreezes the contract and records why; no rejected version
produces estate results. Do not tune detectors against the main result set. A
new mechanism class may reopen calibration; a surprising result within an
already modelled class may not.

If the coverage gap requires a repository entrypoint, `agent-tools` owns only
run-scoped census orchestration, source inspection, and evidence
serialisation. It emits the frozen producers for all nine edge kinds and the
four calibrated ownership chains. Its node-edge output is a review-specific document, not a new
reusable graph substrate. It must not import `curriculum-sdk` or
`sdk-codegen`; it invokes authoritative package commands and inspects their
declared inputs, outputs, manifests, and export maps. It must not duplicate
generic graph operations already homed by ADR-173/ADR-179/ADR-221, and this
plan does not authorise promoting its review model into graph infrastructure.

Extractor implementation follows Red-first atomic landing: every behaviour is
introduced with its adjacent in-process unit description and made Green in the
same landing. Unit tests use injected in-memory Git, filesystem, process,
identity, clock, and environment adapters; they never read `.agent/**/*`, spawn
processes, use the network, or conditionally register/skip tests. Pinned
real-source excerpts with source path and blob hash provide hand-counted
transform backstops. An unconditional post-build smoke command outside Vitest
executes the unified CLI from its independently derived executing checkout
against a deterministic temporary invoking Git root, including the built
implementation-identity gate. The identity covers the complete local ESM
closure reached from the entrypoint plus the executing checkout's manifest and
lock; it does not claim byte-proof of installed external packages or the Node
runtime. Generation, SDK consumer,
bundle closure, report, reproduction, and drift proofs are manifest commands,
not conditional test cases.

Implementation is also contract-staged. A slice may begin only when the frozen
detector configuration names it contract-ready. The sequence is pinned source
and auxiliary context; workspace attribution, provenance, and roles;
syntax-only module declarations; pinned module and project resolution;
delivery derivation; then graph, ownership, and candidate assembly. A later
slice does not borrow an implementation choice from an earlier substrate, and
the estate run remains prohibited while any slice is contract-held or the
external built smoke has not passed.

Current gate state: revision 2.4's complete-tree and auxiliary-read substrate
is implemented and independently accepted. Revision 2.5 independently closes
workspace attribution, provenance, and role semantics, so those three slices
may proceed as a classification fragment. Module declarations and resolution,
delivery, graph/ownership, candidate synthesis, raw-document assembly, and the
estate run remain contract-held. The fragment boundary prevents the ready
classifiers from inventing the still-held delivery fields required by a full
`FileRecord`.

### 3. Build the typed estate model

Build a typed multigraph whose nodes distinguish files, packages, workspaces,
commands, artefacts, registrations, and external contracts. Record these nine
edge kinds separately: imports, re-exports, export maps, generation, scripts,
filesystem reads, filesystem writes, build relationships, and runtime
registrations. Each kind has a frozen extractor producer and every derived
graph edge cites its raw observation; none is hand-entered during synthesis.
The derived evidence graph is an identity copy of the raw graph arrays, checked
byte-for-byte by the external closure command; interpretation is carried in
separate signals and dispositions rather than mutating graph observations.

For every generated or shipped chain, model:

`semantic authority → generator → generated carrier → runtime owner → composition → remediation locus`

An omitted stage is recorded as absent or missing evidence, not silently
collapsed. Every tracked file receives a classification even when it has no
candidate signal.

### 4. Gather independent change evidence

Run the full census and initial signal triage before the expensive executable
proofs below. The six counterfactuals are retained because each tests a
different high-impact ownership-chain class; generation and packaging proofs
are applied to the lanes whose dispositions depend on them. A failure is
preserved as evidence and narrows what the affected lane may conclude rather
than invalidating unrelated estate evidence.

- Preserve raw Git history output and derive a separately stored normalised
  path-change view. Normalisation may resolve renames and stable package
  identities but never overwrites or substitutes for raw evidence.
- Exercise six predeclared counterfactual changes: an upstream OpenAPI type
  change; a bulk-data or generated-vocabulary input change; a curriculum-SDK
  public-export change; an agent-tools CLI or hook contract change; a shared
  core-library contract change; and a shared TSX or design-component change.
  Predict and then observe the affected ownership chain without landing the
  changes.
- Run each selected offline-capable generation path twice from identical
  recorded inputs in clean output locations, with network access absent during
  generation. Preserve both raw outputs and a byte-level diff. A path that
  cannot regenerate from materialised inputs is a finding, not permission to
  substitute a normalised-only comparison.
- Pack `@oaknational/curriculum-sdk` and install the tarball into a clean,
  isolated Node 24 consumer using the repository package-manager policy and
  frozen scrubbed proof environment. Generate its lockfile first with
  `CI=true`, `--lockfile-only`,
  `--config.minimumReleaseAge=1440`,
  `--config.minimumReleaseAgeStrict=true`, and `--ignore-scripts`; preserve and
  review that lockfile, fetch its frozen dependency closure in the only other
  network-permitted phase, then install with `CI=true`, `--offline`,
  `--frozen-lockfile`, and the same release-age and script policy. Commit the
  reviewed consumer lockfile as proof input so second-worktree reproduction
  uses the identical dependency closure. Exercise every runtime condition in
  the packed exports map under a proved network-deny sandbox, and resolve every
  type-only condition without executing it. Record the installed dependency
  closure, exact denominator/result matrix, exit status, and output as
  shipped-form evidence. If the network-deny canary cannot be proved, the
  proof is blocked. This
  proof is required for curriculum-SDK candidates because the owner explicitly
  included that published boundary; it is not a universal health gate for
  unrelated lanes.

### 5. Detect, challenge, and disposition candidates

Run the frozen detector universe across all domain lanes, including explicit
type-truth boundary signals and type-space/schema-shape repetition: SDK,
codegen, search, and curriculum; applications and demos; agent tools; core libraries
and design; tests, configuration, research, and root source. Preserve
generated/authored and shipped/non-shipped breakdowns rather than allowing a
large generated family to hide or inflate another population.

Before the full detector run, select a held-out classification path sample and
a separate repetition-precision sample using only frozen
path/provenance/delivery rules and a seeded hash order. Detector presence is not
a selection input. The classification sample includes verification and
unresolved-delivery strata; each path receives one correct-or-incorrect manual
classification judgement and an explicit list of every detector whose
expected signal was missed. The repetition sample contains only files whose
`verificationOnly` state is proven `absent`; every qualifying all-production
group intersecting it receives one precision judgement. Verification groups
remain visible as observations but cannot admit a detector, become a
consolidation candidate, or support a proposal. Review every candidate against
its authority chain, history, consumers, and shipped form.
Each candidate receives exactly one disposition:

- `generate` — make the authoritative generator emit the canonical form;
- `share` — consolidate a genuinely shared responsibility at its narrowest
  stable owner;
- `inline` — remove an abstraction whose locality is clearer and cheaper;
- `delete` — remove a redundant form with no retained responsibility;
- `reroute` — point consumers at an existing authority rather than adding one;
- `keep` — retain purposeful similarity and state the losing condition; or
- `undetermined` — unresolved, with the exact missing evidence, why it is
  unavailable, the conclusions it affects, and the proof that would resolve
  it. It cannot support canonicalisation, prioritisation, or an authorised
  proposal.

Every resolved disposition names the canonical form, placement action,
intervention locus, supporting and opposing evidence, confidence, beneficiary
effect, and proof artefacts. An `undetermined` row leaves canonical form,
placement action, and intervention locus unset rather than manufacturing an
authority claim. Aggregate scores may help order human reading but may not
choose a disposition.

Any group containing a verification-only, ambiguous-verification, or
unprobed-verification file remains a raw observation and never becomes a
candidate row. It cannot support a proposal, and this review may not propose a
shared test builder or hoisted test description. Consequently every candidate
has production scope and a resolved or explicitly undetermined production
disposition. Every resolved intervention locus is structured and checked
against pinned paths/workspaces/generators. A locus in or crossing the complete
ADR-173 topology or ADR-221 graph-knowledge SDK roots—including roots not yet
created—must pass an explicit ADR-173, ADR-179, and ADR-221 conformance
assessment; non-compliant or undetermined placement is not proposal-eligible.

For every production candidate relevant to shared-foundation work, the human
review also applies
[`foundational-building-blocks-frame.md`](../../reports/typescript-estate-consolidation-review/foundational-building-blocks-frame.md).
It records the duplicated responsibility, independent consumers, change and
assurance amplification, lowest coherent layer, core-promotion gate outcomes,
dependency posture, future excellence contract, expected innovation-cost
leverage, opposing evidence, and losing condition. These are derived
architectural judgements in `report.md` and `proposals.md`, not new detector
facts or a new `evidence.json` field. This derived frame does not change the
extraction contract; any pre-run refreeze must have an independently recorded
detector-contract cause.

### 6. Synthesis and reproducibility

- Publish three repo-observed rankings: top-ten runtime-value structures,
  top-ten erased type-model structures, and top-ten algorithmic operations.
  Each is selected from a frozen universe larger than ten, uses a commensurable
  counting unit within its table, ranks the proven non-verification population,
  and reports exact authored, generated-confirmed,
  generated-declared-unconfirmed, imported, unknown, verification-only, and
  verification-unresolved partitions.
- Publish the full candidate/disposition ledger and independently adoptable,
  ticket-shaped proposals. The report carries a foundations-first promotion
  reading for every relevant candidate while `proposals.md` carries the later
  package contract. Each proposal names the problem, evidence, beneficiary,
  intervention locus, scope, acceptance proof, losing condition, and sequencing
  relationship. Do not create external tickets.
- Re-run the evidence procedure in a second clean worktree at the pinned
  commit and compare raw-artefact hashes and normalised outputs.
- Immediately before finalising, reconcile the pinned snapshot with the
  branch tip. Classify all intervening TypeScript-relevant changes, rerun the
  affected detectors and proofs, and record whether conclusions changed.

## Falsifiers and stop conditions

- If the four calibration paths cannot be represented without conflating
  semantic authority, generated carrier, and runtime owner, stop the unified
  model and report the incompatible models. Do not force one ontology.
- If a detector fails the preselected held-out audit or its apparent value
  depends on knowing the desired answer, reject that detector and preserve the
  rejection. Do not tune it on the final candidate set.
- If census closure, second-worktree reproduction, raw proof preservation, or
  final branch-drift reconciliation fails, the review cannot claim complete.
- If a decision-relevant candidate remains `undetermined`, the plan stays
  live. This includes uncertainty that could change a proposed canonical form,
  priority, intervention locus, public/API or shipped-correctness claim,
  generator determinism, or canonical ownership. Other `undetermined` rows may
  remain only as explicit, non-authorising limitations; never convert
  uncertainty to `keep` for closure.
- If generation requires unrecorded network state, if the packed SDK cannot be
  consumed in isolation, or if a shipping path cannot be executed, report the
  failure as evidence and do not replace it with a declaration-only proof.
- If evidence collection crosses the information-governance boundary, stop
  that collection. This plan grants no authority to widen the boundary.
- Stop at the evidence and programme boundary even when a production fix looks
  obvious. Remediation needs its own ratified delivery work.

## Acceptance criteria (each with a proof — required)

- The snapshot denominator contains every tracked `.ts` and `.tsx` file, and
  every file has role, provenance, and shipping classification — `repo-safe`:
  the external bundle validator repeats the complete NUL-delimited Git-tree
  enumeration at the recorded commit and proves zero missing, duplicate, or
  extra paths. It is not an in-process test and never reads `.agent/**/*` from
  the test runner.
- The typed multigraph contains the nine declared edge kinds and a complete
  ownership chain for every calibrated archetype — `repo-safe`: graph
  raw-graph producer coverage, referential-integrity, and archetype-coverage
  checks plus the four executable proof records.
- Generated code and the curriculum SDK remain first-class populations, with
  authority and remediation locus independently recorded — `repo-safe`:
  coverage assertions and the packed clean-Node-24 consumer proof.
- Raw and normalised Git history are both preserved, all six counterfactuals
  have predicted-versus-observed records, and selected generation runs are
  byte-compared twice offline — `repo-safe`: immutable proof-artefact hashes,
  command exit records, and raw diffs referenced from the manifest.
- The detector universe is frozen after calibration and survives a preselected
  held-out audit — `repo-safe`: detector-config digest, freeze timestamp,
  held-out selection record, and accepted/rejected detector results.
- Every candidate has one disposition, canonical form, placement action, and
  intervention locus; no decision-relevant `undetermined` candidate or other
  completion-blocking missing-evidence row remains, every non-blocking
  `undetermined` or placement-nonconformant row is excluded from proposals,
  and every verification observation is absent from the candidate ledger —
  `repo-safe`: schema validation plus an external closure command that
  recomputes candidate, test-doctrine, ADR-placement, missing-evidence, and
  proposal-reference state.
- Every foundation-relevant candidate has an explicit layer-placement and
  core-promotion assessment, including failed gates, opposing evidence, future
  test, mutation, documentation, boundary proof, and a losing condition —
  `repo-safe`: report/proposal structure validation plus human architectural
  review against the durable promotion frame; detector output is never used as
  automatic authority.
- The report includes defined, counted top-ten runtime-value, type-model, and algorithm
  lists and ticket-shaped proposals without creating external tickets or
  changing production code — `repo-safe`: report structure check and a scoped
  Git diff containing review artefacts and any separately justified read-only
  extractor with its paired tests and built-smoke harness only.
- A second clean worktree reproduces the bundle and final branch drift is
  reconciled — `repo-safe`: independent-run manifest comparison, raw hash
  comparison, and a dated drift record at the final branch tip.

## Todos

### Execution state at the 2026-08-03 documentation handoff (historical)

**Amendment 2026-08-12 — this section is a dated historical record, no longer
current state.** The tranche it describes was preserved to main by the owner's
safety commit `c69b0746c` (2026-08-03, 125 paths) and subsequently GREENED by
the foundations-review lane (`d16ba0e7d`, 2026-08-05, plus three follow-on
cure rounds: tsc 0, eslint 0 errors, three boundary smokes wired into
`test:e2e`). Per the plan-node schema's governing principle, execution state
is never a durable plan field — current state is read from the estate. The
`survey-machinery-deconstruction` node (2026-08-12) reads this plan's corpus
as design input for the owner's survey programme; its ledger proposes
dispositions and retires nothing here.

The paragraph below stands as what was true at the 2026-08-03 handoff moment:

This plan remains active. The implementation is an uncommitted, incomplete
tranche in the dedicated worktree; no preservation commit, push, pull request,
raw extraction, evidence document, census, candidate ledger, top-ten result, or
proposal set exists. The last observed combined type-check was red at the
secure-identity integration boundary, and no validation was rerun during the
owner-directed documentation-only handoff.

The exact custody, prior evidence, known diagnostics, file map, and ordered
continuation live in
[`handoff-2026-08-03.md`](../../reports/typescript-estate-consolidation-review/handoff-2026-08-03.md).
That file is the execution-state source for the next agent; earlier
knowledge-safety records remain the design and correction history.

| Workstream | State at handoff |
| --- | --- |
| Cost-of-change gradient and foundations-first frame | Permanent docs authored in this worktree; concept remains falsifiable, not automatic extraction authority |
| Revision 2.6 configuration and classification fragment | Implemented through one validated config ingress; independent boundary gateway and built smoke previously passed |
| Shared UTF-16 ordering and test-shape corrections | Focused Red/Green slices previously passed |
| Git invocation and exact process projection | Focused integration slice previously passed |
| Atomic publication | Phase-specific model/result split present; post-split proof incomplete |
| Secure implementation-identity read | Unit behaviour previously passed; stale integration fake and known type-check diagnostics remain |
| Pinned auxiliary blob read | Pure decision/transition only; semantic port, Git adapter, production wiring, integration rewrite, and built smoke absent |
| Later contract slices and estate review | Held and not started; no estate run authorised |

The next executor resumes only after fresh owner authority for implementation
and validation. They first preserve and inspect the complete dedicated-worktree
diff, then restore one coherent secure-identity/publication/snapshot foundation,
finish the auxiliary capability, obtain specialist scrutiny, and re-establish
new evidence before extending the frozen contract. The first estate run remains
last, not next.

Each slice uses the default PDR-132 budget of no more than two substantive
review rounds.

1. Land the evidence contract, pinned snapshot, tracked-file denominator, and
   deterministic manifest.
2. Calibrate the four archetypes and either compose existing tools or prove
   the need for the minimal read-only extractor; close each staged contract
   boundary, implement it in Red/Green atomic pairs, and prove the built
   entrypoint with the external smoke harness.
3. Produce full-estate classifications, graph, ownership chains, frozen
   signals, and preselected held-out audit.
4. Produce raw and normalised history, six counterfactual records, repeated
   offline generation proofs, and the clean Node 24 packed-SDK proof.
5. Complete human review, candidate dispositions, core-promotion and layer
   placement assessments, top-ten lists, and ticket-shaped proposals.
6. Reproduce in a second worktree, reconcile final branch drift, close every
   completion-blocking evidence gap, and publish the report.

## Out of scope

- Production remediation, package moves, public API changes, generated-output
  rewrites, new quality gates, or new external dependencies.
- Creating or updating Linear, GitHub, or any other external tickets.
- Runtime or product-usage claims not supported by an executable proof in this
  review.
- People analytics, contributor ranking, pupil data, or user telemetry.
- A general quality audit of the repository. A separate follow-on may use this
  evidence only if its own goal and authority justify that wider scope.
