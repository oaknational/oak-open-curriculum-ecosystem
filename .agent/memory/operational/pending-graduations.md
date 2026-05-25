---
fitness_line_target: 500
fitness_line_limit: 750
fitness_char_limit: 150000
fitness_line_length: 300
lifecycle_model: >-
  queue — empties as substance graduates; depth proportional to
  cross-session-wait accumulation, not to file-permanence concerns
access_pattern: >-
  consolidation-pass-only — read at consolidations and drain sessions; not
  loaded every session by every agent
split_strategy: >-
  Graduate items to PDRs/ADRs/rules/permanent docs; archive resolved items to
  dated archive snapshots; keep pending and recently-graduated items here
fitness_rationale: >-
  Limits calibrated to working queue depth (currently ~86 entries × ~12-25
  lines/entry, with index + per-entry metadata + schema preamble headroom), not
  to a permanent-doc shape. Raised 2026-05-07 (Pelagic Rolling Harbour) per
  owner direction: principles.md is loaded every session and must stay small;
  this register has a fundamentally different access rhythm — multi-session
  cross-wait accumulation under cross-session-wait pressure — and its limits
  should reflect that lifecycle. Recalibration is the substance-led structural
  fix per the substance > destination boundary.
merge_class: mostly-append-register
---

# Pending-Graduations Register

The structured queue of doctrine candidates awaiting graduation per
the capture → distil → graduate → enforce pipeline (ADR-150, PDR-011).
Each entry carries `captured-date`, `source-surface`,
`graduation-target`, `trigger-condition`, and `status`.

Items with `status: due` or `status: overdue` are the primary
graduation candidates for the next consolidation pass. Items with
`status: pending` are reviewed at each consolidation to see whether
their trigger condition has fired since last consolidation. Items
with `status: graduated` are kept here briefly for audit trail before
being archived to `archive/repo-continuity-session-history-*.md`.

This register lives in its own file (split out from
`repo-continuity.md` § Deep Consolidation Status on 2026-04-30 by
Briny Lapping Harbor under owner direction, when accumulated rich
register content was contributing the bulk of repo-continuity's
HARD fitness state). Doctrine references that previously pointed to
`repo-continuity.md § Deep consolidation status` now point here.

## Per-entry metadata schema (2026-05-07)

Each entry carries an inline metadata tag line at the top of its
body (immediately under the bullet's title line). The tag is a
single-line key/value list, pipe-separated, designed for both
human skim and grep navigation. Pre-2026-05-07 entries predate
this discipline and are being backfilled across consolidation
passes; new entries from 2026-05-07 onward MUST carry the tag.

Tag shape:

```text
[captured: YYYY-MM-DD | source: <surface> | target: <type>:<id-or-name> |
 trigger: <type> | size: <S|M|L|XL> | status: <state>]
```

Field definitions:

- `captured`: ISO date. Records when the candidate was first
  registered.
- `source`: `napkin`, `experience/<file>`, `comms-log`,
  `napkin-archive/<file>`, `owner-direction`, or
  `pattern-emergence`. Records which capture surface seeded the entry.
- `target`: `pdr:<id-or-draft-name>`, `adr:<id-or-draft-name>`,
  `rule:<name>`, `pattern:<filename>`, `plan:<plan-name>`,
  `doc-amend:<doc>`, `multi:<list>`, or `none`. `multi:` marks
  entries with mandatory multiple targets; `none` marks entries with no
  graduation target, such as quarantined entries pending rethink.
  Inside `multi:` lists, every component MUST follow the
  `<type>:<id-or-name>` shape.
- `trigger`: `second-instance`, `owner-direction`, `n>=3-validation`,
  `plan-execution-gated`, `candidate`, or `vaporware-gated`. The
  `vaporware-gated` trigger flags the structural sequenced-deferral
  failure shape per `distilled.md` §Sequenced-Deferral Discipline.
- `size`: `S` (single small edit), `M` (multi-file but single
  artefact), `L` (multi-artefact, single domain), or `XL`
  (multi-artefact + cross-domain + directive-shape). This informs
  whether the entry can drain opportunistically or needs a dedicated
  session.
- `status`: `pending`, `due`, `overdue`, `partially-graduated`,
  `graduated`, `quarantined`, or `withdrawn`. **Note**:
  `vaporware-gated` is a `trigger` facet, NOT a `status` value; the
  index groups vaporware-gated entries separately for navigation while
  their lifecycle status remains explicit on the entry.

**Composite values**: `source` and `trigger` accept `+`-joined
composites (e.g. `napkin+distilled.md`, `n>=3-validation+owner-implicit`)
when multiple capture surfaces or trigger conditions co-apply, and
parenthetical `(scope)` qualifiers (e.g.
`vaporware-gated(WS11.3-execution)`) to name the specific gate.
The closed-vocabulary tokens above are the building blocks; composite
shapes are honest about real-world multi-source / multi-condition
entries.

Original schema fields (`captured-date`, `source-surface`,
`graduation-target`, `trigger-condition`, `status`) remain valid
inside the entry body for full prose context — the inline tag is
a navigation accelerator, not a replacement.

`consolidate-docs` uses this register as the live queue. Graduated
and merged history is preserved in git and the archived register
snapshots in [`archive/`](archive/) — most recent is
[`pending-graduations-archive-2026-05-24.md`](archive/pending-graduations-archive-2026-05-24.md)
(2026-05-24 processed-graduation-body rotation). Earlier archive:
[`pending-graduations-archive-2026-05-23.md`](archive/pending-graduations-archive-2026-05-23.md)
(2026-05-23 pattern-drain and older-entry sweep entries).

## Index

Regenerated 2026-05-12 by Twigged Growing Glade during the conservation-first
pending-graduations consolidation drain. Entries are listed by status then by
captured-date (most recent first). Line numbers are advisory hints; grep by
status field for authoritative position.

Per the [`fabricated-gate-as-avoidance`](../active/patterns/fabricated-gate-as-avoidance.md)
pattern instance, future consolidation passes read each entry's
substance before its inline metadata tag — gate vocabulary is a tag,
not a verdict.

### `due` (current body candidates)

Regenerated 2026-05-24 by Sylvan Sprouting Petal after routing the
`/remember` plugin write-time contract gap. Updated by Shaded Silencing Dusk
after the PDR-075 status review drain. The live body now contains **3** due
entries:

1. `director-pure-direction-only` — owner-decision packet item 2:
   principle-class PDR route needs owner approval.
2. `owner-action-is-not-a-cure` — owner-decision packet item 3:
   principle-class PDR route needs owner approval.
3. `marshal-as-cycle-discipline` — owner-decision packet item 5:
   decide PDR-077 vs repo-local pattern and respect existing ownership.

The former 2026-05-23 due set is now `partially-graduated`; the body
entries remain under the partially-graduated section because each still
has downstream cascade work rather than a complete graduated home.

### Processed history pointers

Processed curation logs, graduated-body sweeps, historical log blocks, and
2026-05-24 disposition ledgers have moved out of this live queue after
verification. Pointer text compacted from this index is preserved in
[`archive/pending-graduations-archive-2026-05-24.md`](archive/pending-graduations-archive-2026-05-24.md)
§ "Processed pointer notes compacted 2026-05-24". Live unresolved entries
remain below or in the active queue shards.

### `partially-graduated`

This slice contains entries whose first durable home exists but whose
second-stage trigger is still live: pattern files awaiting a third
instance, Draft PDRs awaiting ratification, and residual work routed
through later plans. Grep `status: partially-graduated` for the live
set. Current examples include moment-of-decision / cognitive-diversity
Draft PDRs and older commit-boundary residuals.

### `quarantined`

(empty — apply-don't-ask / stop-inventing-optionality reformulations
graduated 2026-05-10 to PDR-057 + PDR-058; quarantine cleared)

### 2026-05-25 — Misty Drifting Sail Director-session candidates

Active shard:
[`pending-graduations/2026-05-25-misty-director-session-candidates.md`](pending-graduations/2026-05-25-misty-director-session-candidates.md).

Route-state: split out by Estuarine Drifting Mast on 2026-05-25 as live queue
substance, not archive. The shard carries five entries: plan Done-When must
drive to live, state-bound heartbeat content, inbox/absorption semantics,
owner-direction provenance, and Director-seat threshold. Process the shard
entry by entry before removing this pointer.

### `pending` (body markers — second-instance or owner-direction gated)

The bulk of the queue. Reviewed at every consolidation; most stay
pending until trigger fires. Grep `status: pending` for the full
list; entry-level summary index is intentionally omitted to avoid
duplicating entry-body substance and to keep the index honest as
the queue churns.

Fresh 2026-05-24 napkin-tail candidates live in the
[`pending-graduations/2026-05-24-napkin-tail-candidates.md`](pending-graduations/2026-05-24-napkin-tail-candidates.md)
active shard.

### 2026-05-23 — Agent identity UUID + body-file frontmatter residuals

`[captured: 2026-05-23 | source: stormbound-floating-wing/tempfile-collision-incident-and-owner-direction | target: PDR-076a+PDR-076b operationalisation | trigger: owner direction | size: S | status: partially-graduated]`

**PDR-076 split processed 2026-05-24**:
the original bundled PDR-076 is superseded by
[PDR-076a](../../practice-core/decision-records/PDR-076a-agent-identity-tuple-name-and-uuid.md)
for the `(agent_name, id)` identity tuple and
[PDR-076b](../../practice-core/decision-records/PDR-076b-body-file-frontmatter-contract.md)
for body-file frontmatter. The live residual is now only their
operationalisation cascade:

1. Amend PDR-027 and identity-bearing schemas so `agent_name` + UUID
   `id` becomes the canonical routing pair.
2. Wire identity preflight, body-file frontmatter consumers, and
   identity-rendering surfaces in separate landing cycles.
3. Keep tempfile path session-prefixing as secondary defence only; the
   frontmatter contract is primary.

---

### 2026-05-22 — Rule/skill topology fragmentation (PDR-shaped, recovered from .remember buffer)

`[captured: 2026-05-22 | source: .remember/today-2026-05-15.md |
target: pdr:rule-skill-topology | trigger: owner-direction or
rule-topology slice opens | size: M | status: pending]`

Substance summary: at 2026-05-15, the cumulative token-load of
`.agent/rules/*.md` was measured at ~55k tokens — a fragmentation signal
flagged by the authoring session as a PDR candidate, with the lane queued
*"post-collab-lane"* (after the multi-agent collaboration substrate work
completed). The substance was captured only in the `.remember/` plugin buffer
and never drained into `distilled.md` or `pending-graduations.md` during the
subsequent week's consolidations, because the plugin lifecycle stalled when the
v0.5.0 install was scoped to a different project. It was re-installed as v0.7.2
at 2026-05-22T13:49Z scoped to this project, restoring the drainage path.

**Underlying substance**: rule files are loaded into context at session-open
via CLAUDE.md / equivalent platform entry points. 55k tokens of rule load is
large relative to the 80k reliably-loaded context budget
(`project_80k_reliably_loaded_context_budget.md`). Fragmentation across ~60+
rule files multiplies surface-discovery cost without proportionate
substance-density gain. The PDR candidate would author the topology: which
substance lives where, fitness signals for rule files individually and as a
load surface, the rules ↔ skills boundary, and the criteria for
promoting/demoting/merging rules.

**Why pending**: forward-looking restructuring substance; no current plan
absorbs the topology question. The closest active surface is the standing
memory entry on the 80k budget (which sets the constraint) but does not author
the cure. **Trigger to watch**: owner-direction to author a rule/skill-topology
PDR, OR the moment a rule-topology consolidation lane opens (would absorb this
as its design input).

Falsifiability: a future rule-topology consolidation that proceeds without
measuring rule load against the 80k budget, or without authoring criteria for
rule promotion/demotion/merging, is the failure mode. An implementation that
measures the load and authors the criteria is the success.

**Lifecycle note**: this entry is **first-instance recovery from .remember buffer drainage**; if a second instance of the rule-topology fragmentation signal appears in a future session, that strengthens the PDR case from candidate → ratification-ready.

### 2026-05-17 — Gates hide gates — failure surface is a stack

`[captured: 2026-05-17 | source: distilled.md §"Recently Distilled — 2026-05-17 Solar Orbiting Asteroid gate-green cascade" §"Gates hide gates" | target: pattern:gates-hide-gates | trigger: second-instance | size: S | status: pending]`

Substance: `pnpm check`'s serial chain (each gate's `&&` means
downstream gates do not run while an upstream gate is red) shields
each failed gate from the next. The shielding holds at test-level
too. **Diagnostic discipline**: when a gate clears, expect the next
downstream gate to surface a previously hidden problem. Treat each
green gate as a magnifying glass aimed at the next. Worked instance
2026-05-17 (Solar Orbiting Asteroid): knip clearing surfaced a
parallel-load MCP e2e flake; the e2e deletions surfaced a missing
Playwright binary; installing the binary surfaced two pre-existing
circular type imports in depcruise that had been latent for weeks.
Falsifiability: a `pnpm check --continue` mode would reveal the
full latent stack at once. Second-instance trigger: any future
consolidation observing the same cascade-on-clear shape graduates
this to a pattern in `.agent/memory/active/patterns/`.

### 2026-05-14 — Cross-thread program artefact shape (first-instance trigger captured)

`[captured: 2026-05-14 | source: napkin.md §"2026-05-14 — Cross-thread program artefact shape (first observed instance)" | target: pdr-or-rule-on-cross-thread-program-artefact-shape | trigger: second-cross-thread-program-emergence | size: M | status: pending]`

Substance: multi-session sequences crossing two or more threads have
no canonical artefact shape in this Practice. The 2026-05-14
`token-remediation-p8-parallel-program.plan.md` is the first observed
instance; its anti-decay clauses (advancement rule, owner-redirection
clause, evidence threshold, interrupt log, anti-decay handoff clause)
are proposed structural cures against ten documented multi-session
decay modes. If a second cross-thread program emerges, the
artefact-shape itself graduates to a PDR (Practice-portable) or rule
(always-applied behavioural cure when an agent encounters such a
sequence). Watch for: owner naming a sequence with ≥3 steps spanning
multiple plans; owner naming a sequence that explicitly crosses
thread boundaries; owner using language like "then", "after that",
"then back to" linking work on different threads.

### 2026-05-14 — Shape-selection-by-vehicle-weight failure mode (first-instance trigger captured)

`[captured: 2026-05-14 | source: napkin.md §"2026-05-14 — Shape-selection-by-vehicle-weight is a recurring failure" | target: rule-or-pdr-on-shape-selection-by-function | trigger: second-shape-selection-by-weight-correction | size: S | status: pending]`

Substance: when proposing graduation shapes (rule / ADR / PDR / new
file / amendment), the function test must be applied first, not the
vehicle-weight ranking. Today's Batch A failure: presented three
shape options ranked by lightness, recommended the lightest, ignored
the entry's own prior function-test argument. Owner intervention
named the diagnostic: *"rules, ADRs, PDRs all have functions, this
choice is not arbitrary."* Existing per-user memory ("never surface
a cheap-cure option") is operational but not always-applied as a
repo rule. If a second instance fires, graduate to a rule that names
the failure shape directly and forces the function-test framing.

### 2026-05-14 — Skill text vs continuation record distinction (single-instance, PDR-shape candidate)

`[captured: 2026-05-14 | source: distilled.md §"Continuation surfaces" first bullet (Sylvan distillation) | target: pdr:skill-text-vs-continuation-record | trigger: second-instance-stability | size: S | status: pending]`

Substance: skill text carries durable routing behaviour; continuation
records carry volatile facts. Branch, plan, next-step, commit ids,
team expectation — every fact that changes between sessions belongs
in the thread record, not in the skill body. The skill's job is to
fire the routing on arrival; the record's job is to provide the
current state for that routing to act on. Function-test verdict:
PDR-shape (Practice-meta design distinction). Currently single-
instance evidence (Sylvan's distillation 2026-05-14). Holds until a
second session corroborates or contradicts the distinction.

### Active queue shards created 2026-05-24

The main register now delegates large still-unprocessed clusters to active
queue shards rather than archives. These shards are live pending-graduations
surfaces and must be processed before any archive move:

- [`pending-graduations/2026-05-23-team-session-autonomy.md`](pending-graduations/2026-05-23-team-session-autonomy.md)
  — 2026-05-23 first-out closeout, commit-queue ceremony cures, PDR-074
  autonomy primitives P1-P6, and PDR-078 / ADR-186 heartbeat bundle.
- [`pending-graduations/2026-05-06-to-2026-05-21-legacy-backlog.md`](pending-graduations/2026-05-06-to-2026-05-21-legacy-backlog.md)
  — legacy live backlog covering early-May collaboration, agent-tooling,
  validation, topology, graph/source-authority, insight-report, and
  commands-retirement candidates.

## Active queue shard pointers

The shard bodies listed in the index remain live queue substance, not archives.
Process entries there before removing their pointers from this register.

## 2026-05-24 owner-decision-batch candidates (Lanternlit Listening Dusk / `78683a`)

Route note 2026-05-24 (Shaded Silencing Dusk): the active `distilled.md`
summaries for PDR-vs-ADR classification, M1/M2 milestone asymmetry,
owner-reframe-as-misframe, and marshal queue discipline were removed after
verifying this register carries their live status. These entries remain live
queue substance, not archived or graduated content.

### PDR-079 PDR-vs-ADR portability distinction (owner-articulated; codification authored in-flight as WS-12)

[captured: 2026-05-24 | source: owner /oak-metacognition critique |
graduation-target: PDR-079 + no-moving-targets scope amendment | trigger:
owner direction + 3 worked-instance evidence base | status: pending]

Routing note: authoring is routed through Lanternlit's WS-12 lane in
`practice-infrastructure-hardening-program.plan.md`; this entry stays pending
until that lane lands or its route changes.

Owner-articulated 2026-05-24: PDRs are portable practice doctrine — claims
about how multi-agent practice WORKS that apply to ANY repo with multi-agent
collaboration. PDRs CANNOT contain SHAs, repo paths, branch names, or any
artefact-reference tied to *this* git history. ADRs are repo-specific
architectural decisions: choices about how *this* repo's substrate IMPLEMENTS
something. ADRs are repo-bound by definition; SHAs and event-UUIDs are welcome
as appropriate evidence.

**SHA-in-PDR = misclassification signal**: when content wants a SHA in a PDR,
that's not a citation-style question — it's a routing question. The SHA-bearing
substance belongs in an ADR, not the PDR.

Cure shape: PDR-079 authors the portability constraint as explicit practice
doctrine. Co-cure: scope the existing `no-moving-targets-in-permanent-docs.md`
rule strictly to portable surfaces (PDRs + rules + patterns); ADRs are out of
scope.

Resume substrate: substance fully captured in program plan R1.5 §Emergent
Observations E4 (RESOLVED) + §Workstream Roll-up WS-12 row + R1.5 Refinement
Log entry. Composes with PDR-066 (PDR↔ADR composition pattern as
principle/phenotype pair).

Falsifiability: PDR-079 file exists at canonical location with §Decision naming
the portability constraint; rule scope-amendment lands at
`.agent/rules/no-moving-targets-in-permanent-docs.md` with explicit "in-scope:
portable surfaces; out-of-scope: ADRs" framing; PDR-066 §Related
cross-references PDR-079.

Cross-references: composes with PDR-066 (PDR↔ADR composition); dissolves R1.4 E4 hybrid framing; binds WS-11 bundle authoring (PDR-078 SHA-free, ADR-186 SHAs allowed).

---

### Reviewer-pass + critical-analysis loop as cure for trust-without-reverification

[captured: 2026-05-24 | source: program plan R1.2/R1.3 review loop |
graduation-target: reviewer-pass pattern or substrate-pointer v3 amendment |
trigger: 2nd single-author trust-without-reverification cure | status:
pending]

Routing note: pending second instance of the reviewer-pass +
critical-analysis loop catching single-author trust-without-reverification.

Worked instance: program plan R1 authoring (Lanternlit, 2026-05-24) exhibited
trust-without-reverification in three sub-failures: trusted Mistbound's 22-min
throughput number without git-checking (actually ~14 min by author timestamps);
trusted earlier subagent C's "no active cure-claim" snapshot without
re-verifying current claim state; introduced ADR-186 references in WS-10
contradicting my own WS-11 statement. The recursion-of-doctrine pattern fired
on the plan that catalogues it.

Cure shape: dispatch dual reviewer pass (docs-adr-expert + code-expert) with
sharp specialty briefs; receive findings; **critically analyse before
absorbing** by verifying highest-stakes findings against live state,
identifying reviewer blind spots, and reflecting on the reflection for
self-checks. The loop converged at R1.2 with 21 findings absorbed, then R1.3
self-critique caught two more.

Why pending: 1 worked instance. Promotion gate: 2nd worked instance of single-author substrate that the reviewer-pass loop catches authoring-time trust-without-reverification failures.

Falsifiability: pattern file lists ≥2 worked instances with named
upstream-trust signals + named reviewer findings + named critical-analysis
verifications + named steady-state declarations. If 2nd instance fails to
converge or produces different cure-shape, pattern needs refinement before
promotion.

Cross-references: composes with WS-5 substrate-pointer-read-as-current-state
pattern; composes with WS-4 recursion-of-doctrine pattern; instance-of WS-5
pattern firing on plan body that catalogues it.

---

### Sidebar co-authoring model — first deployment worked instance

[captured: 2026-05-24 | source: program plan R1.4 §Plan Coordination
(owner adoption) + first-instance deployment by Mistbound (`d7c918cf` sidebar
opener for R1.4-landing path) | graduation-target: PDR or pattern file
capturing sidebar-mediated peer co-authoring model after 2nd worked instance |
trigger: 2nd worked instance of sidebar-mediated peer collaboration outside
the originating plan's coordination | status: pending]

Routing note: pending second sidebar-mediated peer collaboration instance
outside the originating plan's coordination.

Worked instance: Mistbound Hiding Threshold (0e27cc) opened sidebar at
`.agent/state/collaboration/sidebars/program-plan-landing-cadence-2026-05-24-mistbound-lanternlit.md`
2026-05-24T08:55Z with structured 2-question + deadline +
default-action-if-silent shape. Lanternlit (78683a) appended reply within
~75 min of opener. Sidebar resolution pending Mistbound marshal-success on
R1.4-R1.5 land.

Mechanism that worked: structured opener with explicit questions + deadline +
default-action-if-silent; participant identity tuples in frontmatter;
append-only convention; resolution slot. Sidebar-file polling by sidebar-opener
via comms-watcher (not file mtime).

Why pending: 1 worked instance. Promotion gate: 2nd worked instance, ideally
across a different plan or substrate surface, demonstrating the model
generalises beyond the originating program plan.

Falsifiability: 2nd sidebar opens with consistent shape (frontmatter + structured questions + deadline + default + reply slot + resolution slot); resolves cleanly without contention; substrate-pointer-stale-state risks remain bounded.

Cross-references: composes with `feedback_peer_sidebar_beats_coordinator_helpers` (graduated 2026-05-22 — peer-pair sidebars for design work). The sidebar model is the operational shape of that feedback's claim.

---

### M1-vs-M2 milestone-priority-asymmetry framing for multi-WS programs

[captured: 2026-05-24 | source: program plan R1.1 M1/M2 framing |
graduation-target: PDR or plan-template amendment | trigger: 2nd multi-WS
program adopting explicit M1/M2 asymmetry | status: pending]

Routing note: pending second multi-WS program that adopts explicit M1/M2
priority asymmetry.

Worked instance: program plan R1 originally framed Safe-Pause Criteria +
Completion Criteria as two parallel "criteria to land" surfaces without
priority asymmetry. Owner critique 2026-05-24 exposed the framing gap: "are end
goals separate from the milestone that fulfils 'first safe stopping point'?"
R1.1 reframed as M1 — Safe-Pause Milestone (near-term target; pivot-ready) and
M2 — Completion Milestone (open-ended; full end-state), with explicit
M2-pursuit-deferred-until-M1 priority asymmetry. R1.3 added M1 Gate Monitor
duty + path-trigger completeness specs. R1.4 added sidebar model. R1.5
resolved all owner verdicts.

Effect: path-forward sequencing became M1-focused; M2-pursuit work clearly tagged and deferred; reader sees priority at a glance.

Why pending: applied to 1 plan only. Promotion gate: 2nd multi-WS program that adopts the same explicit M1/M2 asymmetry, ideally without further owner intervention (proving the pattern is teachable from existing substrate).

Falsifiability: 2nd plan body contains explicit "M1 — <near-term-milestone-name>" + "M2 — <completion-milestone-name>" sections with priority asymmetry table + Path Forward sequenced for M1 first + M2-pursuit deferred unless owner directs.

Cross-references: composes with PDR-018 (plan body shape) — extends the plan-template surface for programs with multi-milestone concerns.

---

### Owner-direction-reshapes-the-question pattern (AskUserQuestion misframe signal)

[captured: 2026-05-24 | source: AskUserQuestion Q3 owner reframe |
graduation-target: rule or skill amendment for owner-reframe handling |
trigger: 2nd owner-reframe exposing AskUserQuestion misframe | status: pending]

Routing note: pending second owner-reframe instance exposing an
AskUserQuestion misframe.

Worked instance: AskUserQuestion Q3 offered three citation-policy options
(descriptive-only / event-IDs / hybrid-with-historical-reference). Owner
answered the hybrid option BUT in a follow-up turn reframed the question: the
real shape was PDR-vs-ADR classification, not citation-style choice. The
reframe exposed that all three options were the wrong shape.

Cure shape: when an AskUserQuestion answer triggers an owner reframe (rather than a clean selection), absorb the reframe as the new question shape and re-author options if needed. The reframe is the data, not noise.

Why pending: 1 worked instance. Promotion gate: 2nd instance of owner-reframe exposing question misframe in a different decision context.

Falsifiability: documented protocol for AskUserQuestion-misframe detection at the asking-agent boundary, with examples of reframe-signal recognition.

Cross-references: composes with `present-verdicts-not-menus` rule (when only one defensible option exists, direct don't ask — sometimes the menu itself is the wrong shape).

---

## 2026-05-24 active-napkin rotation updates (Shaded Silencing Dusk / `019e59`)

### Director pure-direction-only as broad/focused cognition split

[captured: 2026-05-24 | source: active-napkin rotation +
curator handoff survey §2.2 | target:
pdr:director-pure-direction-only | trigger: owner-direction | size: L |
status: due]

Owner-stated doctrine says the Director role exists to keep broad
awareness and focused implementation co-existing: the Director's
awareness is broad, implementers' awareness is focused, and the
Director-only boundary is the load-bearing mechanism enabling both.
This is Practice-governance shaped, not repo product architecture.

Natural home: new PDR, related to PDR-074 (Director value), PDR-075
(Director substrate-writing), PDR-064 (role transition), and PDR-072
(autonomic learning). The entry is due because the trigger is explicit
owner direction and the concept has already been consumed by sibling
memory surfaces.

Owner-decision pointer: keep this entry in the live due set until the
Memory Surface Critical Drain owner-decision packet item 2 approves the
principle-class PDR route.

Falsifiability: PDR exists with a decision section naming the
broad-awareness / focused-awareness split and a consequence section
specifying which work the Director must not absorb.

### Owner action is not a cure

[captured: 2026-05-24 | source: active-napkin rotation +
curator handoff survey §2.4 | target:pdr:owner-action-is-not-a-cure |
trigger: owner-direction+N>=3 worked instances | size: L | status: due]

Repeated windows show the same structural rule: when an owner action
unblocks a team, the durable learning is the missing autonomy
primitive, not "ask the owner next time". Worked evidence in this
napkin includes Playwright install permission routing, broad
Director-routing blockages, and owner-wide sweep intervention over
ceremony-heavy bundle coordination.

Natural home: a PDR or PDR amendment in the PDR-074 autonomy-primitives
cluster. This should name the diagnostic distinction: owner
intervention is evidence of a substrate gap unless the decision is
genuinely owner-only.

Owner-decision pointer: keep this entry in the live due set until the
Memory Surface Critical Drain owner-decision packet item 3 approves the
principle-class PDR route.

Falsifiability: future notes about owner interventions classify each
case into owner-only decision vs missing autonomy primitive, and route
the latter into protocol/tooling substrate.

### Marshal-as-cycle-discipline throughput substrate

[captured: 2026-05-24 | source: active-napkin rotation (Scorched
Director window + Mistbound marshal arc) | target:pdr:PDR-077 or
pattern:marshal-as-cycle-discipline | trigger: second worked instance
fired | size: L | status: due]

The original Scorched entry recorded 9 marshal-class cycles plus one
Class A wrapper in a single Director window. The later Mistbound marshal
arc gives the second worked instance: queue ordering, explicit comms,
pre-stage verification, and marshal-owned commit turns converted
coordination contention into repeated small landings.

Natural home: PDR-077 if the doctrine is portable marshal-role
governance; repo-local pattern if the current evidence remains
implementation-shaped. Charcoal's in-flight PDR-077 ownership should
be respected if that lane resumes.

Owner-decision pointer: keep this entry in the live due set until the
Memory Surface Critical Drain owner-decision packet item 5 decides
whether the evidence routes to PDR-077 or a repo-local pattern.

Falsifiability: PDR-077 or a pattern file lists both worked instances,
the role boundary, the queue/ordering/comms mechanism, and the
acceptance evidence for one complete marshal cycle.

Additional evidence routed 2026-05-24 from Mistbound Capture G:
cross-platform marshal-cycle shape worked without special casing. Estuarine
Fathoming Sail (codex/GPT-5) emitted the full marshal-request shape, and
Mistbound Hiding Threshold (claude/opus-4.7) processed it through ACK,
explicit pathspec staging, full-tree hook, and co-authored commit. This
strengthens the PDR-077/pattern route because the protocol worked across
platform families, not only inside one vendor's sessions.

### Structured field for agent state

[captured: 2026-05-24 | source: active-napkin rotation (Ferny
2026-05-23 15:09Z entry) | target:adr-or-pdr:agent-state-field |
trigger: schema-design route + heartbeat contract composition | size:
L | status: pending]

The napkin captured a substrate gap: readers infer `active`,
`paused`, `presumed-ended`, or `retired` state from comms narrative
instead of querying a canonical field. This composes with the
liveness-heartbeat contract but is not the same thing: heartbeat emits
freshness; `agent_state` or equivalent makes lifecycle state explicit.

Natural home: ADR if implemented in this repo's active-claims schema;
PDR if the lifecycle-state model is portable Practice doctrine. The
route should remain pending until PDR-078/ADR-186 or their successors
settle the heartbeat substrate.

Falsifiability: `active-claims` or the successor state substrate has a
structured lifecycle field whose values are recomputed or maintained
by tooling, and readers stop inferring state from prose broadcasts.

### Script substance-preserving relocations; make the script the audit artefact

[captured: 2026-05-24 | source: active-napkin rotation (Velvet archive
sweep + repeated backfill surgery) | target:
pattern:script-substance-preserving-relocations | trigger: second
relocation pass with script-as-audit evidence | size: M | status:
pending]

Large repetitive archive or buffer-drain edits are safer when performed
by a narrowly scoped script whose input/output can be inspected than by
many hand edits. The useful property is not speed; it is boundary
preservation plus a reproducible audit artefact.

Natural home: repo-local pattern after a second clearly documented
substance-relocation pass uses a script and reviewer spot-checks its
boundary preservation.

Falsifiability: a pattern file cites at least two relocation passes,
the script strategy used, reviewer or command evidence that boundaries
were preserved, and the criteria for when hand editing is still
preferable.

### Parallel-reserve capacity for tranche teams

[captured: 2026-05-24 | source: active-napkin archive coverage audit |
target:pattern:parallel-reserve-capacity | trigger: second tranche-team
planning instance | size: M | status: pending]

The archive captures a tranche-team planning move: reserve more candidate
workers than immediate tranches so review, interruption, and reactive lanes have
capacity without stealing from the primary implementation slots. The point is
not "add more agents"; it is to keep the team design from becoming brittle when
review or repair work appears.

Natural home: team-planning pattern or start-right-team amendment if the move
recurs in another multi-agent tranche plan.

Falsifiability: a future tranche plan explicitly budgets reserve capacity and
shows whether the reserve prevented review or reactive work from blocking the
primary tranche.

### Owner-coordinated team-wide refocus through same-identity compactions

[captured: 2026-05-24 | source: active-napkin archive coverage audit |
target:pattern:team-wide-refocus-through-compaction | trigger: second
owner-coordinated refocus instance | size: M | status: pending]

The archived window records an owner-coordinated refocus across same-identity
compacted sessions. This is distinct from a Director broadcast: the owner used
individual continuation prompts to realign each agent after compaction while
preserving identity continuity.

Natural home: coordination pattern if a second explicit refocus-through-
compaction event appears, or a start-right-team note if this becomes a common
bootstrap mechanism.

Falsifiability: a pattern names when owner-compaction refocus is legitimate,
what state must be restated in each continuation, and how it differs from
Director or comms-based rerouting.

### Arriving-agent no-boundary dormancy

[captured: 2026-05-24 | source: active-napkin archive coverage audit |
target:start-right-team-or-opener:arriving-agent-boundary | trigger: second
dormancy instance or owner direction | size: M | status: pending]

The archive records a failure mode where an arriving agent with a broad
start-right-team prompt but no inherited boundary can become dormant instead of
choosing a useful lane. The cure is not to skip grounding; it is to provide an
initial boundary, candidate default, or explicit "ask after grounding" route.

Natural home: start-right-team guidance, opener template, or role handoff
checklist.

Falsifiability: future arriving-agent prompts include enough boundary to avoid
idle waiting while still allowing live-state grounding to revise the route.

### Monitor first-run backfill cascade

[captured: 2026-05-24 | source: active-napkin archive coverage audit |
target:monitor-doc:bounded-first-run | trigger: second monitor backfill
cascade | size: M | status: pending]

The archived napkin records that persistent Monitor first-run backlog can flood
the session and preempt same-turn tool calls. The useful route is a bounded
first-run or pre-seeded seen-file habit before treating the monitor stream as a
live coordination source.

Natural home: Monitor skill/use-monitor documentation, or a small rule if this
becomes a repeated coordination hazard.

Falsifiability: first-run Monitor use has a bounded catch-up contract, and a
future session can distinguish backlog replay from current coordination without
losing urgent messages.

### Marshal reviewer-turnaround gating cue

[captured: 2026-05-24 | source: active-napkin Breezy Capture A |
target:pattern-or-skill:marshal-reviewer-turnaround-gating | trigger: second
worked instance or owner direction | size: M | status: pending]

Breezy's capture records a marshal/reviewer timing hazard: reviewer fan-out was
dispatched when Cycle #1 substrate was authored, but the marshal queue landed
the work in about five minutes and the reviewer verdicts returned only after
landing. The landed cycle was still structurally valid because verdicts were
GO-WITH-CONDITIONS and could be absorbed as Cycle #1.1, but the incident names
a reusable gating cue: when a cycle depends on reviewer convergence, the
marshal-request boundary should state whether reviewer verdicts must be in
hand before landing or whether post-land absorption is an accepted follow-up.

Natural home: repo-local coordination pattern or `start-right-team` marshal
guidance if a second worked instance shows this timing gap recurring. The
candidate composes with `marshal-as-cycle-discipline`, but is narrower: it is
about the review-convergence condition at marshal-request time, not the whole
marshal transaction protocol.

Falsifiability: a second marshal cycle records reviewer fan-out started before
landing and reviewer verdicts arrived after landing, and the team either needed
a post-land absorption cycle or explicitly authorised post-land absorption at
marshal-request time.

### Owner-direction shape-reading vs substantive intent

[captured: 2026-05-24 | source: active-napkin Breezy Capture B |
target:pattern-or-skill:owner-direction-intent-confirmation-on-role-transfer |
trigger: second role-transfer misread or owner direction | size: M | status:
pending]

Breezy's capture records a role-transfer interpretation hazard: the phrase
"Vining will direct the process" was first read as a durable director/executor
split inside the Knowledge Curator lane, then Vining corrected it as a
transition-state framing for the handover. The durable lesson is not "ask more
questions"; it is to distinguish process-shape readings from substance-shape
readings when owner wording names both a new role-holder and an outgoing
role-holder.

Natural home: repo-local coordination pattern, `start-right-team` handoff
guidance, or a small rule if another role-transfer window repeats the same
failure. Until a second instance appears, the item stays pending rather than
silently becoming doctrine.

Falsifiability: a future role-transfer prompt contains wording that could mean
either temporary transition support or a permanent split of role authority, and
the agent confirms against the named source or records the interpretation
without broadcasting the wrong permanent shape.
