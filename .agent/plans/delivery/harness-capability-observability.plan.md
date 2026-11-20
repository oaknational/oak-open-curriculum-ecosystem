---
id: harness-capability-observability
node_type: delivery
name: "Harness capability observability — probe, record, diff, signal"
overview: "Give Codex and Claude seats a repeatable, read-only automated capability census, with separately authorised bounded liveness challenges, whose scope-qualified run records expose additions, removals, changes, and evidence-backed rename candidates as their harnesses evolve."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-01
ratified_where: "Owner decision card (671-delta, five themed amendments summarised with commit trail), Director session Falcon hunts Flight 52841f, 2026-08-01"
serves: first-major-release
impact_areas:
  - practice-and-estate
tickets:
  - MCP-456
depends_on: []
last_updated: 2026-08-01
---

# Harness capability observability — probe, record, diff, signal

Ratified at the current head 2026-08-01 (owner decision card; the delta from
the earlier PR #671 baseline — evidence independence, completeness honesty,
the liveness-challenge trust boundary, freshness/retention binding, and the
exposure/outcome separation — was summarised with its commit trail in the
card and ratified whole).

## Goal

A fresh Codex or Claude seat can establish, from evidence rather than
configuration alone, the capabilities exposed through every launch and
enumerator surface independently discovered for the tested harness version;
preserve the observation with enough provenance to make later runs comparable;
and see when abilities appear, disappear, change, or plausibly move under a new
name. A platform with no independent discovery surface records that coverage as
unknown rather than claiming completeness.

## Mechanism

One cross-platform pipeline with four shared primitives:

1. **Probe.** Enumerate a fresh, source-qualified ability inventory on every
   run. Keep configured, exposed, self-reported, and behaviourally proven facts
   distinct. Repository collectors gather deterministic platform metadata;
   short native test cards exercise harness-only root, child, and nested-child
   surfaces using harmless read-only canaries. Separately authorised,
   owner-held liveness challenges are outside the automated collector and run
   only when an external observer explicitly accepts the bounded write. Before
   collection, an independently maintained, versioned `ProbeSetDefinition`
   fixes the declared launch and enumerator matrix without consulting that
   run's observed output.
   Separately, each platform adapter derives version-pinned discovery evidence
   from authoritative surfaces exposed by that harness version—its native tool
   and supported-launch catalogues, plus CLI or schema discovery where
   available—without consulting the definition or behavioural outcomes.
   Reconciliation requires every independently discovered surface to map to
   exactly one declared row. An unmapped surface, unavailable discovery source,
   or evidence from another harness version marks definition coverage
   `unknown` or `stale` and suppresses completeness claims. The collector has
   read-only access, records both evidence sources and the exact
   definition-content digest, and rejects a changed digest under an unchanged
   version, so neither a snapshot nor its definition can certify its own
   completeness.
2. **Record.** The parent writes one immutable, schema-versioned, sanitised
   snapshot per run. It records the probe-set version and content digest,
   the executable collector and test-card revision with a content digest,
   launch graph, and—for both thread creation and observation—phase-specific
   timestamps, evidence sources, requested/configured/reported model, effort,
   and resolved tool family, or an explicit unavailable reason for each value.
   It also records root activity state, wake-path evidence, and—for any root
   self-observation from `SUBSTRATE` through `DELIVERY`—the fresh progress
   artefact type, bounded reference, observation time, and current-session
   continuity ID. It records run time and duration, harness and CLI versions where observable,
   repository/environment fingerprints, every ability ID and metadata observed
   within the reconciled matrix, and explicit unavailable reasons. Children
   never share-write the ledger.
3. **Diff.** Compare snapshots without rewriting history. Emit raw additions,
   removals, metadata changes, and behavioural changes. A rename is only an
   evidence-backed `rename_candidate` joining one removal to one addition;
   stable semantic launch keys, never run-local launch IDs, bind comparisons.
   Schema, probe-set content, launch/enumerator coverage, executable
   collector/test-card revision, and behavioural evidence-age drift are
   reported separately. Incompatible structural coverage suppresses
   per-ability inference; incompatible collector/test-card revisions or content
   digests suppress attribution of exposure or behavioural deltas to the
   harness; incompatible freshness suppresses behavioural-change inference. A probe implementation
   change, probe regression, or stale/fresh comparison therefore cannot
   masquerade as a lost or currently changed harness ability.
4. **Signal.** Derive a current ledger and bounded drift summary consumed by
   the SessionStart bootstrap alert and the capability-census operations
   runbook. An addition sends the runbook to reconcile the definition and run a
   safe canary; a removal prevents capability-dependent routing until it is
   reprobed; `unknown` or stale coverage sends the reader to refresh discovery
   evidence; and an unchanged compatible record permits the existing route.
   Signals are advisory and fail open for session startup; immutable run records
   remain the authority.

Ability IDs are stable and source-qualified (for example top-level harness,
functions-exec, MCP, skill, CLI, or hook). Exposure and behavioural outcome are
orthogonal fields with a validated coherence matrix. Full inventories are
never cached; expensive behavioural evidence may be reused only when labelled
stale with its source run and observation time, and freshness compatibility is
required before behavioural-change inference. Transport `DELIVERY`, creation
of a reasoning turn (`NOTIFY`), and content-bearing engagement (`ABSORB`) are
independent observations: no lower class implies a higher one.

Every live `owner-held` proof is verified from outside the probed seat by Jim
Cresswell or the serving Director. Bounded evidence—run IDs, external-observer
identity, challenge/reply or deliverable-movement references, and sanitised
result links—is recorded on MCP-456 and the implementation pull request.
The never-self-certifiable classes are owned by
[PDR-133 §5](../../practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md#5-the-self-observation-corollary),
not by this plan. Every snapshot retains an explicit row for every class,
including unobserved classes. Exposure remains `present`, `absent`, or
`unknown`, while outcome remains `pass`, `fail`, `unavailable`, `not_run`, or
`inconclusive`; `unknown` is never an outcome. A root snapshot may assign
`pass` to a class in the never-self-certifiable set only with the external
observer and evidence reference that certified it.
For the classes a seat may observe about itself, `SUBSTRATE` through
`DELIVERY`, a `pass` requires a progress artefact read fresh in the current
session and bound to that session's continuity ID. Cached, inherited,
pre-continuity-boundary, or inference-only evidence records exposure `unknown`
when exposure cannot be independently established, or outcome `inconclusive`
when exposure is established but current-session behaviour is not; it never
records outcome `pass`.
Certification selects the applicable instrument from
[PDR-133 §6](../../practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md#6-two-instruments-certify-what-no-self-report-reaches)
for each claimed class. Observed deliverable movement certifies `LOOP`,
`CAPABILITY`, and externally read `PROGRESS`, plus `ABSORB` only when the
movement responds to the coordination in question. `NOTIFY` requires a
content-bearing challenge reply bound to the exact delivery path traversed;
generic movement or a bare acknowledgement cannot certify it.
The automated test card never sends that challenge. If Jim Cresswell or the
serving Director has not explicitly authorised and observed the bounded
canonical-comms exchange, the snapshot retains the independently established
exposure value and records outcome `not_run`; when exposure itself cannot be
established, exposure is `unknown`. Lack of authorisation is neither a failed
capability nor permission to widen the probe.

## Acceptance criteria (each with a proof — required)

- **Every run takes a fresh census of its independently reconciled matrix.**
  Supported Codex and Claude root and child launch paths emit source-qualified
  ability lists, counts, hashes, probe-set versions, discovery-evidence
  versions, and explicit unknown/unavailable observations; no previous
  inventory can satisfy the current run. Completeness is scoped to the rows
  reconciled between the pre-run definition and independent, version-pinned
  discovery evidence. Unmapped surfaces or unavailable/stale discovery mark
  definition coverage `unknown` or `stale` and suppress the completeness claim.
  The snapshot binds the definition's exact content digest, and version/digest
  disagreement is rejected.
  Proof: `repo-safe` — totality, no-cache, definition/discovery independence,
  version/digest, unavailable-discovery, unmapped-surface, stale-evidence,
  missing-enumerator, and launch-matrix fixtures; `owner-held`
  — Jim Cresswell or the serving Director, external to each probed seat,
  verifies the platform runs and records their run IDs and bounded evidence
  links on MCP-456 and the implementation pull request.
- **Run records are immutable, comparable, and safely attributable.** Each
  snapshot records UTC/local time, duration, run and parent/child identity,
  launch mechanism, role/context mode, and separate thread-creation and
  observation provenance. Each phase records its timestamp and evidence source,
  plus requested/configured/reported model, effort, and resolved tool family—or
  explicit unavailability for each value. The snapshot also records root
  activity state, wake path, sandbox and approval state, harness/client/CLI
  versions with evidence or explicit unavailability, probe-definition content
  digest, executable collector/test-card revision and content digest,
  discovery-evidence version and source, repository/environment fingerprints,
  warnings, and bounded observations. Secrets, account identifiers, connector
  URLs, absolute machine paths, and unbounded output are rejected.
  Proof: `repo-safe` — schema, immutability, sanitiser, and hostile-fixture
  tests.
- **Evidence is class-honest.** `present | absent | unknown` exposure and
  `pass | fail | unavailable | not_run | inconclusive` outcome are validated
  independently, with impossible combinations rejected; `DELIVERY`, `NOTIFY`,
  and `ABSORB` are also recorded independently, and declared authority is
  recorded without exercising destructive or external mutations.
  Proof: `repo-safe` — exhaustive coherence-matrix, liveness-class,
  unobserved-row-retention, same-session-progress-artefact,
  stale/inherited-continuity rejection, and safe-canary tests; `owner-held` —
  Jim Cresswell or the serving Director
  certifies every claimed class governed by PDR-133 §5 with its applicable
  PDR-133 §6 instrument. A `NOTIFY` claim requires a content-bearing challenge
  reply over the exact tested delivery path; movement certifies `ABSORB` only
  when it responds to that coordination. The observer, event, traversed path,
  reply or movement reference, and result are recorded on MCP-456 and the
  implementation pull request.
- **Stored ledgers expose evolution.** Comparing any two compatible snapshots
  deterministically reports additions, removals, metadata changes, behavioural
  changes, and conservative rename candidates with their evidence. Schema,
  probe-set content, coverage, and evidence-age drift remain separate
  dimensions; incompatible coverage suppresses unsafe mass add/remove or
  rename inference, while incompatible freshness suppresses behavioural-change
  inference.
  Proof: `repo-safe` — golden comparator fixtures covering additions,
  removals, true metadata/behaviour changes, ambiguous renames, false rename
  traps, enumerator regression, collector/test-card revision drift,
  unchanged-revision/changed-digest drift, stale/fresh comparison, and
  freshness-compatible comparison.
- **Both harness families use the shared contract.** Codex covers the root,
  native child roles/fork modes, nested/follow-up continuity, and representative
  CLI sessions; Claude covers the main session, Agent-tool children, Agent
  Teams, and Workflow agents. A launch family disabled or unsupported in the
  tested version remains a required matrix row with its explicit unavailable
  reason. Each adapter also records the version-pinned discovery source used to
  reconcile that matrix, or marks definition coverage unknown. Platform
  adapters add observations but cannot fork the ledger schema or comparator
  semantics.
  Proof: `repo-safe` — adapter contract tests; `owner-held` — Jim Cresswell or
  the serving Director verifies the recorded live matrices from outside the
  probed seats and records their run IDs and bounded evidence links on MCP-456
  and the implementation pull request.
- **A new seat can find and run it.** One concise Oak skill and operations
  runbook explain the safe test card, result location, diff command, evidence
  limits, and how to add a newly exposed ability or launch mechanism.
  Proof: `repo-safe` — discoverability/link checks and shipped CLI smoke;
  `owner-held` — Jim Cresswell or the serving Director observes a fresh
  low-power seat producing and interpreting a run without oral guidance, then
  records the run ID and bounded result on MCP-456 and the implementation pull
  request.
- **Signals remain projections, not authority.** Current-ledger and startup
  drift summaries regenerate deterministically from immutable snapshots. The
  SessionStart alert and capability-census runbook consume them: additions
  require definition reconciliation and a safe canary, removals suspend the
  affected routing assumption until reprobed, and unknown/stale evidence
  requires refreshed discovery. None blocks session startup merely because a
  capability cannot be observed.
  Proof: `repo-safe` — reader-decision, projection-freshness, and fail-open
  SessionStart tests.

## Todos

- **A — shared contract (round budget: at most two review rounds).** Land the
  versioned schema and independently maintained pre-run probe-set definition,
  version-pinned independent discovery evidence, definition/discovery
  reconciliation and coverage state, definition-content binding,
  collector/test-card revision binding, source-qualified IDs, stable launch
  keys, sanitiser, validator, freshness-aware comparator, immutable writer, and
  adversarial fixtures.
- **B — Codex probe pack (round budget: at most two review rounds).** Add the
  deterministic collector and native root/child/CLI test card, then record the
  first independently reconciled Codex matrix.
- **B-prime — Claude probe pack (round budget: at most two review rounds).**
  Add the Claude main/Agent-tool/Agent Teams/Workflow adapters against the
  shared contract and record the first independently reconciled Claude matrix,
  retaining an explicit unavailable row for any launch family the tested
  version cannot exercise.
- **C — projections and signal (round budget: at most two review rounds).** Add
  ledger diff/current views, conservative rename candidates, SessionStart
  reader decisions, skill/runbook discoverability, and cross-platform
  acceptance.

## Out of scope

- Granting, widening, or bypassing permissions.
- Model-quality benchmarking or ranking agents by answer quality.
- Automated, destructive, privilege-widening, or unrelated external-state
  probes. The only write exception is an explicitly authorised, bounded
  owner-held canonical-comms challenge used to certify `NOTIFY` or `ABSORB`;
  it is never run by default, never grants or widens permissions, and absence
  of authorisation records outcome `not_run`, with exposure `unknown` only when
  exposure cannot be independently established.
- Installing optional integrations merely to make a capability appear.
- Treating self-report, configuration, stale behaviour, or a rename heuristic
  as proof of effective current capability.
- Implementing or operating a Codex idle-wake bridge. MCP-456 records that
  capability and its evidence but cannot authorise runtime delivery; any such
  work requires its own separately ratified delivery plan.
