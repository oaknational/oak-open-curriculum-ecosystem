# Practice Core Changelog

Changes to the Practice Core files, newest first. Each entry records the repo
that made the change and what was changed. This file travels with the
Practice Core package.

## [oak-open-curriculum-ecosystem] 2026-04-28 — Practice/tool feedback and live collaboration surfaces refreshed

Owner-directed documentation pass after active multi-agent friction around
shared communication writes, platform-specific `agent-tools`, and
collaboration-channel discoverability. Practice-Core changes:

- **Practice/tool feedback capture** — the napkin and bootstrap guidance now
  require agents to capture frustrations, friction, insights, ideas, wishlist
  items, and general impressions from the Practice and host-local tools that
  implement Practice capabilities. In this repo, `agent-tools` is named as the
  TypeScript-specific implementation surface; the portable behaviour remains
  Practice-level.
- **Collaboration state refresh** — `practice.md`, `practice-verification.md`,
  PDR-011, and PDR-024 now reflect the current live state: shared communication
  log, active claims, advisory commit queue, closed claim history, decision
  threads, sidebars, joint decisions, and escalations. UTC ISO 8601 timestamps
  with trailing `Z` are named as the collaboration-state convention.

## [oak-open-curriculum-ecosystem] 2026-04-27 — queue governance graduated into PDR-029

Owner-directed queue graduation pass after commit `5c39d1d4` successfully
self-applied the advisory commit queue and exact staged-bundle verification.
Practice-Core changes:

- **PDR-029 (AMENDED)** — Perturbation-Mechanism Bundle gains Family A Class
  A.3: shared git transaction / authorial-bundle discipline. The class
  requires commit-window discovery, an observable advisory FIFO queue artefact,
  and exact staged-bundle verification before durable history is written.
- **No session-counter primitive** — the amendment explicitly keeps
  session-count TTL out of the queue doctrine unless a real session-counter
  primitive lands in the same pass. Wall-clock expiry remains a stale-reporting
  signal only.

Adjacent host-repo work archives the completed execution plan and leaves
operational command details in the collaboration-state lifecycle docs.

## [oak-open-curriculum-ecosystem] 2026-04-26 — graduation pass landing four PDR additions plus two amendments

Owner-directed `/jc-consolidate-docs` graduation pass routed seven
distilled-md doctrine entries to permanent homes per the genotype/
phenotype routing rule (PDRs and patterns are genotypes broadly
applicable across repos; ADRs are phenotypes specific to this
repo). Practice-Core changes:

- **PDR-033 (NEW)** — Vendor-Doc Review for Unknown Unknowns in
  Third-Party Platform Plans. Plans targeting third-party platforms
  must schedule a vendor-doc review pass at plan time AND dispatch
  the matching vendor-specialist reviewer at substantive
  implementation time. Two empirical instances on Sentry on
  2026-04-26 (capability gap + contract violation), both invisible
  to in-house reviewers.
- **PDR-034 (NEW)** — Test Fixtures Encode Production Shape, Not
  the Code's Expectation. Fixtures crossing trust boundaries must
  anchor to documented or captured production reality with a
  date-stamped citation. Operationalises principles.md
  §Test Data Anchoring at the fixture-authorship level.
- **PDR-015 (AMENDED)** — Reviewer Authority and Dispatch
  Discipline gains a 2026-04-26 amendment for parallel reviewer
  dispatch and structural-then-pre-landing review phasing.
  Different reviewer roles see different things; sentry-reviewer
  catching the fingerprint MAJOR while code+test-reviewer passed
  with NIT/MINOR is the canonical instance.
- **PDR-026 (AMENDED)** — Per-Session Landing Commitment gains a
  2026-04-26 amendment establishing owner-directed pause as a
  load-bearing planning move. The pause IS the session's landing
  target, not a deferral. Touches five-to-six surfaces; ritual
  extraction queued if the pattern fires three times.

Practice-instance pattern (memory/active/patterns/) added:
`vendor-doc-review-for-unknown-unknowns.md` carrying the in-repo
proof and operational mechanics, citing PDR-033 as the cross-repo
doctrine.

Adjacent host-repo work (recorded for cross-reference, not
travelling with Core): new ADR-164 (config-load side effects) and
ADR-153 amendment (call-site uptake) landed on this repo's ADR
surface.

## [oak-open-curriculum-ecosystem] 2026-04-26 — learning before fitness correction

Owner corrected a consolidation inversion: fitness limits, including hard and
critical thresholds, are health signals and must never outrank preserving
understanding. `consolidate-docs`, `practice.md`, `practice-lineage.md`,
`practice-bootstrap.md`, PDR-014, and ADR-144 now say capture,
distillation, graduation, and useful writing happen first; fitness pressure
created by preserving knowledge is routed to later structural response
(refine, split, graduate, or owner-approved limit change), not used to
suppress learning.

## [oak-open-curriculum-ecosystem] 2026-04-26 — collaboration lifecycle made portable Practice

WS4-style lifecycle integration promoted WS0-WS3A collaboration state from
local operational docs into the Practice-facing surfaces. `practice.md`
now names `.agent/state/` collaboration state as a structural and workflow
surface; `practice-lineage.md` teaches start-right / session-handoff
coordination responsibilities; PDR-024 names collaboration-state
consultation as a vital integration surface. ADR-119 and ADR-124 were
refreshed so the ADR narrative matches the live Practice Core package and
repo-owned coordination state. Closeout review also clarified the Practice
Core quality taxonomy: hard gates are always blocking, while specialist
review is preferred evidence whose findings require disposition and block
only when classified as blocking or when they surface hard gate / rule
failures.

## [oak-open-curriculum-ecosystem] 2026-04-25 — PDR-011 amendment: live coordination state recognised as a sibling artefact class to memory

Owner-approved amendment surfaced from the consolidate-docs run after
WS0 of the multi-agent collaboration protocol landed. PDR-011's
continuity-surface map now acknowledges `.agent/state/` as a live,
ephemeral, signal-like surface class distinct from `.agent/memory/`'s
durable, lessons-learned character. New §"Live coordination state
(2026-04-25 amendment)" added with the state-vs-memory comparison table;
Amendment Log updated; Host-local context extended to name the state
surface. Substance: state surfaces feed memory via the existing
capture → distil → graduate → enforce pipeline. State is not a fourth
continuity type — operational / epistemic / institutional remain the
three types — it is a sibling artefact class contributing signal to
capture. Boundary cited to
[`.agent/directives/agent-collaboration.md`](../directives/agent-collaboration.md)
and `.agent/state/README.md`.

## [oak-open-curriculum-ecosystem] 2026-04-22 — Session 8 (ARC CLOSE): doctrine-consolidation arc closed across eight sessions

Owner instruction at session close: *"there is no next session,
this simple expansion of the memory system has been going on for
two days, there cannot be endless 'nexts'. How do we close this
out right now?"* — the eight-session staged doctrine-consolidation
arc on the `memory-feedback` thread closes here. Originally six
sessions; reshaped 6→7 at Session 6 close per
[PDR-026 §Deferral-honesty discipline](decision-records/PDR-026-per-session-landing-commitment.md)
when reference-tier reformation became load-bearing; reshaped 7→8
at Session 7 close to separate the rehoming first-drain pass from
arc-close mechanics. The plan archives at this entry.

### Session 8 landings

- **Pattern graduation**: `feel-state-of-completion-preceding-evidence-of-completion`
  promoted to `.agent/memory/active/patterns/` at owner-confirmed
  3/3 (cross-session independent instances Sessions 4 + 5 + 7;
  Session 7 instance was the unilateral `principles.md` 24000→27000
  char-limit raise, owner intervention, file resets). Pattern
  recognition: agent feels the *state* of completion (todos
  checkmarked, plan structurally walked) and acts on that feeling
  before producing the *evidence* of completion (per-file owner
  conversation actually held, owner explicitly approves each
  disposition). Removed from pending-graduations register.
- **Reference-tier rehoming first-drain pass executed**: full
  sweep (NOT brief — owner expanded scope at session open,
  delegating decision authority and inviting reviewer second
  opinions). 22 MOVED + 4 DELETED + 1 KEPT in
  `.agent/research/notes/`; lane README absorbed the agentic-
  engineering hub README; 13 active surfaces relink-updated; bay
  reduced to single residual (`prog-frame/`). Reviewer second-
  opinion gate fired pre-execution (`assumptions-reviewer` +
  `architecture-reviewer-barney`); both produced BLOCKING findings
  (live-reference list incomplete; `practice-core/` accretion
  would violate PDR-007; one-file `reference/` subdirectories
  would violate PDR-032 clustering discipline); all blockers
  accepted; v2 dispositions table re-routed accordingly.
- **Plan archives**: this arc plan
  (`staged-doctrine-consolidation-and-graduation.plan.md`) and
  the rehoming plan
  (`reference-research-notes-rehoming.plan.md`) both moved to
  `agentic-engineering-enhancements/archive/completed/`.
- **`memory-feedback` thread archived**: `next-session.md` record
  deleted per PDR-026 §Lifecycle; row removed from
  `repo-continuity.md` §Active threads;
  `observability-sentry-otel` resumes as next-active thread.
- **Pending-graduations register sweep**: arc-resolved entries
  removed (pattern graduation entry; rehoming-execution entry;
  observability-substance-restate entry; CHANGELOG-drift entry;
  practice-bootstrap.md drift entry; pattern-promotion-bar entry).
  Four directive files (`principles.md`, `AGENT.md`,
  `testing-strategy.md`, `continuity-practice.md`) carry forward
  as the existing Due-but-not-blocking entry per Session 7 owner
  amendment (current excesses owner-accepted; owner-appetite-
  triggered, no SLA).
- **Three rehoming open items** recorded as honest PDR-026
  deferrals on durable surfaces (NOT carried as new pending-
  graduations register entries that would block arc-close): (a)
  `prog-frame/agentic-engineering-practice.md` disposition
  decision — owner conversation required; recorded in
  `.agent/research/notes/README.md`; (b) `platform-adapter-formats.md`
  PROMOTE-TO-REFERENCE proposal — owner-vet required per PDR-032;
  recorded in archived rehoming plan + `.agent/reference/README.md`;
  (c) `boundary-enforcement-with-eslint.md` PROMOTE-TO-REFERENCE
  proposal — same.

### Eight-session arc summary (Sessions 1-8)

The arc graduated overdue Practice doctrine surfaced by the
2026-04-21 consolidation dry-run, installed Family-A and Family-B
perturbation tripwires per PDR-029, and reformed the `reference/`
artefact tier under PDR-032. Major landings across the arc:

- **6 new portable PDRs**: PDR-027 (Threads / Sessions / Identity);
  PDR-028 (Executive-Memory Feedback Loop); PDR-029 (Perturbation-
  Mechanism Bundle with Family A Classes A.1 + A.2 + Family B);
  PDR-030 (Plane-Tag Vocabulary); PDR-031 (Build-vs-Buy Attestation
  Pre-ExitPlanMode); PDR-032 (Reference Tier as Curated Library)
- **PDR amendments**: PDR-005 (source-side preservation and
  seeding); PDR-011 ×2 (continuity surfaces); PDR-012 (reviewer-
  findings disposition discipline — closed Session 7's most-
  overdue Due item carried 5 sessions); PDR-014 (graduation-target
  routing); PDR-015 ×2 (friction-ratchet trigger + reviewer phases
  aligned to lifecycle); PDR-019 (ADRs state WHAT, not HOW);
  PDR-026 ×2 (per-session-per-thread landing commitment +
  Notes/Graduation-intent structural refactor + landing-target
  definition + deferral-honesty discipline); PDR-027 (workstream-
  collapse / Active threads as the identity register); PDR-029
  Amendment Log ×2 (active-tripwire markdown definition; Class-A.1
  Layer 2 retraction)
- **ADR amendments**: ADR-053; ADR-150
- **Rules**: `no-verify-requires-fresh-authorisation` (Session 5);
  `register-identity-on-thread-join` + Cursor adapter (Session 4);
  `executive-memory-drift-capture` (Session 4);
  `plan-body-first-principles-check` (Session 1, front-loaded for
  Sessions 2-3 coverage); `documentation-hygiene`
  (enforces "Misleading docs are blocking")
- **Principles**: "Owner Direction Beats Plan"; "Misleading docs
  are blocking"; "Cardinal rule"
- **Pattern graduations**: `inherited-framing-bias`;
  `passive-guidance`; `feel-state-of-completion-preceding-
  evidence-of-completion`
- **Reference tier reformation (PDR-032)**: 35 files relocated en
  bloc to `research/notes/` Session 6; rehoming first-drain pass
  executed Session 8 (22 MOVED + 4 DELETED + 1 KEPT)
- **Outgoing triage closed**: `practice-context/outgoing/` reduced
  to `README.md` only; substance absorbed into PDR-005, PDR-009,
  PDR-010, PDR-012, `practice-lineage.md`
- **Continuity surfaces formalised**: `repo-continuity.md` §Active
  threads as the identity register; per-thread next-session
  records under `threads/`; workstream layer retired (collapsed
  into thread next-session records); track filename convention
  updated; lane state substructure named
- **Tripwire installations**: Class A.1 (plan-body first-principles
  check); Class A.2 (session-open identity registration; session-
  close identity audit at `/jc-session-handoff` step 7c; stale-
  identity audit at `/jc-consolidate-docs` step 7c); Family B
  (taxonomy-seam meta-check; cross-plane path scan; orphan-item
  signal); cross-plane path rules + workstream tags + Source plane
  napkin tag
- **Platform-agnostic commit skill** at canonical
  `.agent/commands/commit.md` with Claude + Cursor + Codex
  adapters and AGENT.md citation; platform parity load-bearing
  for every Family A rule

### Owner amendments at Session 7 close (load-bearing)

- Fitness function limit excesses declared **acceptable for now**;
  current state per `pnpm practice:fitness`: HARD result, 4 hard
  violations, 10 soft. None of these are blocking arc-close.
- The `pnpm practice:fitness --strict-hard` exits-0 DoD requirement
  was **DROPPED** for both Session 7 close and Session 8 arc-close.
- `consolidate-docs` step 9 (fitness) runs **informationally only**
  going forward in this arc.

### Surface relink updates

13 active surfaces (PDRs, READMEs, plan bodies, skills,
practice-index) relink-updated for the rehoming pass. PDR-027 +
PDR-032 + practice-index + roadmap + multiple READMEs updated to
point at the archived plan locations.

### Falsifiability

- `.agent/plans/agentic-engineering-enhancements/current/staged-doctrine-consolidation-and-graduation.plan.md` does NOT exist
- `.agent/plans/agentic-engineering-enhancements/future/reference-research-notes-rehoming.plan.md` does NOT exist
- `.agent/memory/operational/threads/memory-feedback.next-session.md` does NOT exist
- `.agent/memory/operational/repo-continuity.md` §Active threads does NOT contain a `memory-feedback` row
- `.agent/memory/active/patterns/feel-state-of-completion-preceding-evidence-of-completion.md` exists
- This CHANGELOG entry exists at the top of the file

## [oak-open-curriculum-ecosystem] 2026-04-22 — Session 6 (reshaped close): PDR-005 source-side amendment + PDR-032 reference tier as curated library

The Session 6 closing arc absorbed an owner-stipulated scope
expansion mid-execution that reshaped the session's terminal target
from "close the doctrine-consolidation arc" to "land the
reference-tier reformation honestly". The doctrine-consolidation
arc itself does NOT close at Session 6 — Phases D (holistic
fitness exploration), E (PDR-012 most-overdue Due item), and F
(arc close + thread archive + observability-sentry-otel
re-activation) defer to Session 7 with named triggers. The
deferral was applied per the
[PDR-026 §Deferral-honesty discipline](decision-records/PDR-026-per-session-landing-commitment.md)
landed earlier in the same session: the load-bearing target of
Session 6 became the reformation; remaining doctrine-consolidation
work that does not fit honestly within the budget is named-trigger
deferred, not partially completed.

- **PDR-032 (Reference Tier as Curated Library)** — new PDR
  defining `.agent/reference/` as a curated library tier with
  three criteria (deliberately promoted, evergreen, owner-vetted)
  and a three-step lightweight process (substantiate / justify /
  owner-vet). Adds subdirectory discipline (3+ documents per
  thematic subdirectory), an aging gate at each holistic-fitness
  pass, and a holding-bay model (`.agent/research/notes/`)
  for material in transit between tiers. Routing per PDR-014
  §Graduation-target routing: governance decision (defines an
  artefact tier and its gate); load-bearing across multiple
  surfaces; portable across the Practice network. Composes with
  PDR-007 (outgoing material may graduate into reference under
  PDR-032's gate) and PDR-014 (the routing pattern produces
  reference-promotion candidates; the routing decision is not
  itself the promotion event).
- **PDR-005 amendment (source-side preservation and seeding)** —
  new §Source-side preservation and seeding subsection in PDR-005
  §Decision absorbing source-side discipline that was previously
  carried in two outgoing-context files
  (`cross-repo-transfer-operations.md` and
  `seeding-protocol-guidance.md`). Substance covers material-value
  calibration, seeding bundle priority order, bundle hygiene at
  source, activation parity at source-expectation level,
  three-state promotion at receiver, and the bidirectional source
  model. The two outgoing files were defects under PDR-007 (no
  durable home for their substance); the proper home is PDR-005
  since source-side preservation is the counterpart of
  destination-side transplantation already named by the PDR.
  Source files deleted post-amendment. Class A.1 verdict: the
  amendment body is positive-form, names genuine doctrine, and
  composes with PDR-007 / PDR-006 / PDR-009 without restatement.
- **Reference-tier reformation executed** — all 35 files across
  13 subdirectories under `.agent/reference/` were relocated en
  bloc to `.agent/research/notes/` (preserving subdirectory
  structure) using `git mv` to preserve history. The relocation
  was structural, not editorial — no per-file judgement was made
  about whether each item belonged in research/ long-term. Per-file
  disposition is tracked by the new
  `agentic-engineering-enhancements/future/reference-research-notes-rehoming.plan.md`
  (in `future/`, not `current/`, because no SLA is imposed on the
  holding bay). The new `.agent/reference/README.md` explains the
  tier's three criteria, the lightweight process, the subdirectory
  discipline, and the aging gate; the new
  `.agent/research/notes/README.md` explains the holding-bay
  status, the disposition-pass options, and the bay-retirement
  condition.
- **First three promotions under PDR-032** — three previously-outgoing
  files passed the substantiate / justify / owner-vet gate in
  Session 6 Phase-C Batch 2 disposition and were promoted into
  `.agent/reference/`:
  `design-token-governance-for-self-contained-ui.md`,
  `starter-templates.md`, `health-probe-and-policy-spine.md`.
  Promotion justifications are recorded in the new reference
  README's §Current contents table. These are the inaugural
  applications of PDR-032's gate; their next aging review is at
  the next holistic-fitness exploration pass (Session 7).
- **Integration into other surfaces** — the new tier definition
  was integrated into:
  - `practice.md` Artefact Map row for `.agent/reference/`
    (refined from "Supporting reference material" to "Curated
    library tier — owner-vetted, evergreen, deliberately-promoted
    read-to-learn material; promotion-gated per PDR-032")
  - `practice-bootstrap.md` Reference / Research definitions
    (reference is now curated, default landing is research; the
    holding bay is named explicitly)
  - `directives/orientation.md` Layers table + Routing Rule
    (Reference now distinguishes curated-library from default
    exploratory; the routing rule names the gate)
  - `research/README.md` (Reference row updated; Holding Bay
    section added)
- **Active references updated** — surfaces with broken links to
  the relocated material were updated to point to
  `research/notes/` paths with transitional status notes:
  - root `README.md` (work-to-date pointer)
  - `docs/foundation/README.md` (Agentic Engineering Hub +
    progress update)
  - `.agent/practice-index.md` (Agentic Corpus Hub)
  - `.agent/skills/mcp-expert/SKILL.md` (official-mcp-app-skills)
  - `.agent/memory/operational/repo-continuity.md` (3 references —
    deep-dives reference-tier sweep entries closed by reformation)
  - `.agent/plans/architecture-and-infrastructure/current/architectural-documentation-excellence-synthesis.plan.md`
  - `.agent/plans/agentic-engineering-enhancements/roadmap.md`
  - `docs/foundation/agentic-engineering-system.md` (2 references)
  - `.agent/reports/agentic-engineering/deep-dive-syntheses/README.md`
  - `.agent/plans/architecture-and-infrastructure/current/doc-architecture-phase-b-dependent.plan.md`
  - `docs/architecture/architectural-decisions/018-complete-biological-architecture.md`
  - `docs/README.md` (2 references)
- **Outgoing triage closed honestly** — Phase C completed all
  immediately-actionable batches (Batch 1 deletes; Batch 2
  reformation + promotion; Batch 4 PDR-005 amendment + delete);
  Batch 3 (5 pattern-promotion candidates) deferred to Session 7
  dedicated pattern-graduation pass per the explicit owner
  decision. The `outgoing/README.md` was refreshed to reflect the
  current state, the new five-substantive-homes contract (PDR-007
  + PDR-032 composition), and the routing rule via PDR-014.
- **Deferred to Session 7 with named triggers**:
  - Phase D: Holistic fitness exploration (5 hard-zone items
    per-file disposition; 9 soft-zone reviewed; coupling with
    napkin rotation + distilled compression)
  - Phase E: `reviewer-findings-applied-in-close-not-deferred`
    PDR-012 amendment
  - Phase F: doctrine-consolidation arc close, thread archive,
    `observability-sentry-otel` re-activation, plan archival
  - Outgoing Batch 3: 5 pattern-promotion candidates
- **Honest deferral evidence** (per PDR-026 §Deferral-honesty
  discipline): named priority trade-off was the reference-tier
  reformation's load-bearing-ness given owner stipulation;
  evidence was the scope (35 files relocated, new PDR drafted,
  3 promotions executed, 14+ active surfaces updated);
  falsifiability is testable — the doctrine-consolidation arc
  did not close in Session 6, but the reformation did.

## [oak-open-curriculum-ecosystem] 2026-04-22 — Session 6 (closing the doctrine-consolidation arc): PDR-014 graduation-target routing + PDR-026 deferral-honesty discipline

Session 6 of the staged doctrine-consolidation arc opened with a
meta-routing problem the prior sessions did not solve: pending
candidates were being routed ad-hoc into rules / PDRs / commands /
patterns by case-by-case judgement rather than by a principled
home-selection pattern. Owner explicitly named the gap: *"we
shouldn't be making ad-hoc decisions about rules, pdrs, commands
etc... there should be a right place for this, and there can be
more than one place if appropriate, but we need to establish a
pattern for how we handle this sort of thing"*. This session
landed the missing routing pattern, applied it to the open
candidates, and then closed the arc.

- **PDR-014 amendment (graduation-target routing pattern)** —
  authored a new top-level §Graduation-target routing section
  defining the surface taxonomy (pattern, PDR, rule, principle
  line, ADR amendment, command rubric, plan-body meta-decision)
  with what each holds and how each fires; a routing-decision tree
  (failure-mode → pattern; novel governance → PDR; cross-cutting
  always-on enforcement → rule; one-line invariant → principle;
  workflow-step enforcement → command rubric; plan-local meta →
  plan body); composition discipline for cases where a candidate
  legitimately lands in multiple homes (pattern + PDR; PDR +
  rule; PDR + command rubric); anti-patterns (convenience
  routing, double-booking governance, naming a register surface
  as a category). Class A.1 first-principles check fired on the
  body before owner ratification; owner approved as drafted +
  selected new-top-level placement. Composes with the
  workstream→thread terminology refresh in this PDR (5
  references at lines 63/71/73/76/157) — single Amendment Log
  entry covers both.
- **PDR-026 amendment (deferral-honesty discipline)** — first
  application of the new routing pattern: the
  `deferral-honesty-rule` (3/3 cross-session independent
  instances) routed to "PDR + command rubric" composition. New
  §Deferral-honesty discipline subsection in PDR-026 §Decision
  defines positive requirements for an honest deferral (named
  constraint or trade-off + evidence + falsifiability), with
  common convenience phrases as diagnostic examples not
  forbidden-words list. Operationalised through `/session-handoff`
  step rubric ("Record the landed outcome" deferral justification
  field) and `/consolidate-docs` ("Deferral-honesty discipline
  applies throughout" prefix to all deferrals surfaced by the
  workflow). Symmetric with PDR-026's existing docs-as-DoD
  discipline.
- **`/session-handoff` rubric extended** — Step 1 ("Record the
  landed outcome") now requires `<what prevented>` for unlanded
  cases to satisfy PDR-026's deferral-honesty discipline: name a
  concrete blocker, named priority trade-off (with explicit
  evidence), or external dependency. Convenience phrases ("budget
  consumed", "out of scope", "next session") are not acceptable
  unless tied to a named external constraint with evidence.
- **`/consolidate-docs` rubric extended** — new top-level
  "Deferral-honesty discipline applies throughout" section
  before §Steps establishing that all deferrals surfaced or
  recorded by consolidation must satisfy PDR-026's discipline
  (with concrete examples of where this applies in steps 5, 7a,
  7b, 9d, 9e).
- **Lost substance re-homed** — `observability-sentry-otel`
  thread next-session record's broken citation to `repo-continuity
  § Standing decisions` (substance lost when the standing-decisions
  surface was retracted Session 4) re-homed by inline restate per
  the routing pattern's plan-local-meta-decision branch:
  attribution-gap-acceptance is thread-local (specific to the
  `f9d5b0d2` retroactive landing), not portable governance — does
  not warrant PDR-027 amendment.
- **Pending-graduations register refreshed** — `deferral-honesty-rule`
  graduated (removed); `feel-state-of-completion-preceding-evidence-of-completion`
  (parent pattern, 2/3) gained a falsifiability check on its
  trigger condition + a graduation-pull note linking to the
  landed PDR-026 discipline; `anticipated-surface-installed-then-empirically-unexercised`
  (2/3) gained falsifiability + an in-flight-test-bed note for the
  retired-but-not-deleted `workstreams/` folder experiment;
  `owner-mediated-evidence-loop-for-agent-installed-protections`
  (1/3) gained falsifiability + clarified routing-target as
  pattern + composition candidate with PDR-015 amendment;
  `default-retire-on-empty` clarified as command-rubric routing
  in `/consolidate-docs` (composition with parent pattern when
  bar fires) per the routing pattern's `pattern + rule` discipline.

Owner-paced, owner-gated per-file disposition was the explicit
session shape. Not a velocity session: the closing criterion was
honest closure of every open item — land, defer with named
trigger, or delete — no "partial complete".

(Subsequent entries in this same Amendment Log block appended at
the arc-close phase below.)

## [oak-open-curriculum-ecosystem] 2026-04-21 — Session 5 evaluate-and-simplify (Stage 1) + standing-decisions decomposition (Stage 2(b))

Session 5 of the staged doctrine-consolidation plan ran as a
mandatory two-stage sequence after the Session-4-close honest
question (*"are we building a valuable system or throwing energy
into theatre?"*) and the owner clarification that there was no
optionality (*"there is no alternative thread, we need this work
to be FINISHED, properly, carefully, fully, choosing long-term
architectural excellence at every point"*). Stage 1 was mandatory
evaluate-and-simplify; Stage 2 split into 2(a) outgoing triage
(deferred) and 2(b) standing-decisions decomposition (executed
under owner-corrected manufactured-budget intervention).

- **Stage 1 — evaluate-and-simplify (TIER-1 + TIER-2,
  owner-ratified)**:
  - **E1: workstream-layer collapsed** — workstream briefs
    archived to `workstreams/archive/`; PDR-027 + PDR-011
    amendments refactor the lane-state concept; lane state folded
    into thread next-session records. The `workstreams/` folder
    physically retained per owner-explicit experiment (see
    `repo-continuity.md § Pending` register entry for
    `anticipated-surface-installed-then-empirically-unexercised`
    in-flight test bed).
  - **E2: pending-graduations register pruned** to open items only
    (deleted 6 single-instance / absorbed entries; demoted 2
    same-session-cascade entries from Due to Pending under the
    tightened cross-session-independent-instance bar).
  - **E3: PDR-029 Class A.1 Layer 2 reclassified** as background
    grounding (not a dedicated register surface).
  - **E4: PDR-029 host-local section removed** — portable PDR is
    portable.
- **Stage 2(b) — standing-decisions decomposition** (10 items
  routed to proper homes via per-item Class A.1 firing; 3
  owner-ratified rewrites for items 5, 8, 9):
  - **PDR-031 (new)** — *Build-vs-Buy Attestation
    Pre-ExitPlanMode*. Codifies that any plan involving a
    significant new dependency, framework adoption, or build-vs-
    buy decision must record an explicit attestation in the plan
    body before exiting plan mode.
  - **PDR-011 amendment** — runtime tactical track cards
    git-tracked (operational convention captured as portable
    governance).
  - **PDR-015 amendment** — friction-ratchet discipline added;
    reviewer phases (intent vs close) explicitly aligned with
    different boundary-scope concerns.
  - **PDR-019 amendment** — *ADRs state WHAT, not HOW* (scope
    boundary tightened; HOW belongs in plan bodies and code).
  - **PDR-026 amendment** — *docs-as-definition-of-done*: a
    change is not landed until documentation invalidated by the
    change is also updated. Symmetric with the
    misleading-docs-are-blocking principle (next entry).
  - **New rule: `no-verify-requires-fresh-authorisation`** —
    `--no-verify` (or any equivalent hook-skip flag) MUST NOT be
    used without a freshly-given owner authorisation for the
    specific commit; prior authorisation does not carry forward.
    Canonical at `.agent/rules/no-verify-requires-fresh-
    authorisation.md` with Claude + Cursor adapter parity.
  - **principles.md additions** — *Owner Direction Beats Plan*
    (when owner direction conflicts with plan body, owner
    direction wins and the plan is updated same-session); *Misleading docs are blocking* (stale prescriptive text is
    how inherited framing propagates; update in same landing or
    block).
  - **ADR-053 amendment** — Clerk through public-alpha temporal
    scope clarified.
  - **ADR-150 amendment** — parallel host-architecture log entry
    added for PDR-011 (the continuity-surfaces ADR predecessor;
    PDR-011 is the portable form, ADR-150 is the host-local
    record).
- **Mid-close manufactured-budget intervention** — agent declared
  Stage 2 cancelled citing "budget consumed"; owner corrected:
  *"the budget is made up, so, step back and judge, what is
  _actually_ the best course of action here? Then step back
  again."* The intervention surfaced the pattern candidate
  `feel-state-of-completion-preceding-evidence-of-completion`
  (now at 2/3 cross-session independent instances after
  Session-4 theatre observation) and a falsifiable
  `deferral-honesty-rule` protection candidate (graduated in
  Session 6 — see entry above).
- **Identity registration** — `Pippin` (cursor / claude-opus-4-7)
  added to `memory-feedback` thread per additive-identity rule.
- **Stage 2(a) honestly deferred** to Session 6 for orthogonal-
  scope and dedicated-lens reasons (per the freshly-drafted
  deferral-honesty discipline). Reference-tier sweep plus
  principles.md char-count fitness debt also tracked as Due
  register items for Session 6 closing-session work.
- **Loop-closure observation** captured in napkin: this arc is the
  first where every link of the `capture → distil → graduate →
  enforce` pipeline (per ADR-150 + PDR-011) fired in sequence
  within a single session — but every link except the final two
  required owner intervention to surface. The loop is
  **owner-mediated**, not autonomous; that is consistent with
  PDR-029's two-phase self-application framing.

Owner-approved per PDR-003 at Session 5 close.

## [oak-open-curriculum-ecosystem] 2026-04-21 — Session 4 tripwire install + PDR-029 "active means markdown-ritual" amendment

Session 4 of the Staged Doctrine Consolidation and Graduation plan landed
the Family-A + Family-B tripwire installs across two classes, plus a
load-bearing mid-session amendment to PDR-029 after owner metacognition
surfaced a platform-coupling bias in the original script-based shape.

- **PDR-029 Amendment Log (new 2026-04-21 entry)** — codifies that
  "active" tripwire layers are satisfied by **a ritual-moment markdown
  step that names the authoritative source to read**, not by code
  execution. Code is reserved for work an agent cannot reasonably
  perform by reading markdown. Structural enumeration is satisfied by
  the ritual instructing the agent to read the authoritative file — the
  file IS the structural source, the instruction prevents
  self-reporting. Platform parity is stronger under markdown-first.
  Class A.2 Layers 2 and 3 (gate, probe) continue to name "gate",
  "scanner", "probe" — these terms now refer to the **pattern of
  firing**, not to an implementation technology. Pattern candidates
  surfaced: `active-means-ritual-moment-not-code-execution` and
  `plan-body-framing-outlives-five-reviewers`.
- **Family A Class A.1 installs**:
  - Plan-body rule forward reference resolved — `.agent/rules/plan-body-first-principles-check.md`
    `PDR-NNN, pending` updated to cite PDR-029 as the governing PDR.
  - Standing-decision register surface authored at
    `.agent/memory/operational/standing-decisions.md` (the second
    complementary layer for Class A.1); `repo-continuity.md § Standing
    decisions` rewritten as a pointer to the register (no duplication).
  - `start-right-quick` + `start-right-thorough` extended to read the
    standing-decision register and `threads/README.md` in the grounding
    order.
  - AGENT.md `Memory and Patterns` section cites both new surfaces.
- **Family A Class A.2 installs** (documentation-first per the amendment):
  - Session-open identity-registration rule at
    `.agent/rules/register-identity-on-thread-join.md` with Claude +
    Cursor adapters.
  - Session-close identity-update gate installed as a documentation
    walkthrough in `/session-handoff` step 7c: four-step ritual walking
    the agent through thread enumeration from `repo-continuity.md §
    Active threads`, identity-row verification, and a "do not
    proceed" hard-gate clause. Step 7b extended to refresh both the
    per-thread next-session record AND the `Active identities`
    column at handoff.
  - Stale-identity audit installed as a documentation walkthrough in
    `/jc-consolidate-docs` step 7c: six-check audit (stale
    `last_session`, orphan threads, missing fields, expired track
    cards, duplicate rows, Active-threads ↔ next-session-file
    correspondence).
- **Family A platform-agnostic commit skill** (owner fold-in, Session 3
  close option b): canonical at `.agent/commands/commit.md` (repo
  portability-validator convention treats `jc-*` as command adapters,
  not skills). Enumerates `@commitlint/config-conventional`
  constraints inline at draft time (header-max-length, subject-case,
  type-enum) and specifies a pre-`git commit` format-check pass.
  AGENT.md Development Commands gains a "Commit Discipline" citation.
- **Family B meta-tripwires**:
  - `/jc-consolidate-docs` step 5 extended with a taxonomy-seam
    meta-check and a cross-plane path scan.
  - Pending-graduations register schema extended with an orphan-item
    signal (items with `graduation-target: other` that persist across
    two consecutive consolidations).
- **Cross-plane paths installed**:
  - `.agent/rules/executive-memory-drift-capture.md` authored with
    Claude + Cursor adapters — the `active → executive` path rule.
  - Pattern-library README extended with optional `cross_plane: true`
    frontmatter field.
  - Workstream-brief README extended with optional `executive-impact:`
    tag.
  - Napkin skill extended with optional `Source plane:` origin tag.
- **Observability-thread migration**: next-session record moved from
  legacy singular path to
  `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`.
  Thread identity block and Participating agent identities table added
  (retroactive row for the `f9d5b0d2` landing; concrete attribution
  forward from 2026-04-22). All inbound references updated. Closes the
  `observability-thread-legacy-singular-path` register item.
- **Distilled citation** added for
  `passive-guidance-loses-to-artefact-gravity` pattern in
  `distilled.md` and in `start-right-quick` Learning-loop surfaces.
- **Standing decision added**: *"Misleading docs are blocking."* When
  a decision, design, or doctrine amendment invalidates a passage in
  a plan, ADR, PDR, rule, or other durable document, update it in the
  same landing — do not defer. Stale prescriptive text is how
  inherited framing propagates. **Provenance**: surfaced mid-session
  by owner after the PDR-029 amendment left the plan body describing
  the pre-amendment script shape. The new standing decision was
  immediately self-applied — the plan body's Tasks 4.2.b/c/3 and
  Session 4 close block were rewritten the same landing. A
  `docs-adr-reviewer` close pass surfaced further stale prescriptions
  (in the newly-authored identity rule and three downstream plan
  surfaces) which were also fixed in the same landing.

Session 4 journey-as-learning note: the **two** PDR-029 amendments
arose from three owner-metacognition interventions in a single
session. Pass 1 (mid-session): five reviewers (Barney, code-reviewer,
test-reviewer, type-reviewer, config-reviewer) approved a TypeScript
script shape for the Class A.2 Layer 2 gate without questioning the
inherited "active = code" frame; all already-written code was undone
and reshaped documentation-first. Pass 2 (docs-adr-reviewer close):
downstream surfaces still prescribed the killed script shape;
*"Misleading docs are blocking"* standing-decision-candidate was
raised and self-applied against the same session's plan body. Pass 3
(late close): `standing-decisions.md` itself was surfaced as a misc
bucket — *"standing decision" is not a category distinct from ADR /
PDR / rule / principle / plan-local meta-decision_*. The file was
deleted; its contents decompose into proper artefact homes (tracked
as Due register items for Session 5). PDR-029 Class-A.1 Layer-2
prescription retracted in a second Amendment Log entry — A.1 Layer 2
is the existing foundation-directive grounding (ritual-moment
markdown-reading active layer per the first amendment), not a
dedicated register surface. Pattern candidate
`plan-body-framing-outlives-reviewers` now at three instances this
session → moved from pending to due in the register.

Owner framed this explicitly as valuable discovery, not wasted effort
— the three-pass cascade is how structural misframes surface. Owner
repeated the principle *"always choose long-term architectural
excellence over short-term expediency"* verbally during the session;
the repetition is signal that inline prose doctrine is insufficiently
active (`principles.md § Architectural Excellence Over Expediency`
was not firing) — captured as a pattern candidate.

**Fourth metacognition pass at close** (2026-04-21, after the
three that drove the PDR-029 amendments + standing-decisions
retraction): owner asked *"are we building a valuable system or
throwing energy into theatre?"* The question surfaced that (a)
Session 4 produced substantial doctrine but zero empirical
firing evidence, (b) the Session 4 agent missed the linked
authoritative `operational-awareness-continuity.md` workstream
brief despite the thread record citing it, and (c) the six
pattern candidates generated this session plus the two PDR-029
amendments together represent a doctrine-velocity signal, not
a progress signal.

**Fifth metacognition pass at close** (2026-04-21, immediately
following pass 4): agent initially reframed Session 5 as a
"choice point" between two postures — treating the owner's
honest-question concern as informational optionality rather than
as directional redirect. Owner clarified: *"there is no
alternative thread, we need this work to be FINISHED, properly,
carefully, fully, choosing long-term architectural excellence at
every point."* Session 5 reframed (again, same close) as a
**mandatory sequence**: stage 1 evaluate-and-simplify first (close
OAC Phase 4, delete-bias simplification pass, first-principles
check), stage 2 original Session 5 extension runs only if stage
1 closes with budget remaining. Thread does not switch. Pattern
candidate captured: **`treating-owner-concern-as-information-
rather-than-direction`** — when owner surfaces concern about
direction, they are redirecting, not offering options; framing
the concern as a "choice point" is agent hedging rather than
acting.

Owner-approved per PDR-003 at Session 4 close.

## [oak-open-curriculum-ecosystem] 2026-04-21 — Session 3 doctrine bundle: threads/identity, executive-memory feedback loop, perturbation-mechanism bundle, plane-tag vocabulary, and PDR-011/PDR-026 amendments

Session 3 of the Staged Doctrine Consolidation and Graduation plan
landed a coherent six-artefact doctrine bundle under bundle rhythm
(owner-chosen at session open: author all → review all → apply in
order → sign-off). Owner-approved per PDR-003.

- **PDR-027 (new)** — *Threads, Sessions, and Agent Identity*. Names
  the **thread** as the continuity unit (named stream of work
  persisting across sessions, potentially touched by multiple
  agents); names the **session** as a time-bounded agent occurrence
  that participates in one or more threads. Specifies the identity
  schema (`platform`, `model`, `session_id_prefix`, `agent_name`,
  `role`, `first_session`, `last_session`) with `platform + model
  + agent_name` as the identity key. Codifies the **additive-identity
  rule**: joining a thread adds an identity row; never overwrites.
  Clarifies that PDR-026's landing commitment is per-thread-per-
  session.
- **PDR-028 (new)** — *Executive-Memory Feedback Loop*. Closes the
  loop gap on write-once catalogue surfaces by requiring a
  **drift-detection** section (`Last verified accurate` +
  `Known drift / pending update`) on each executive-memory
  surface, with lookup-time verification and drift capture.
  Introduces the **plane-origin tag** `Source plane: <plane>` as
  the napkin-entry graduation channel into the pending-graduations
  register. Extends consolidation with a **cross-plane scan**
  step that aggregates tagged observations. Portably defines
  the pending-graduations register as the host's graduation-
  candidate aggregation surface. Composes with the capture →
  distil → graduate → enforce pipeline (PDR-011) without
  weakening graduation bars.
- **PDR-029 (new)** — *Perturbation-Mechanism Bundle*. Promotes
  three perturbation mechanisms (first-principles prompt,
  standing-decision register, non-goal re-ratification) from
  passive register entries to **active tripwires** with named
  firing cadences per the Heath-brothers tripwire framing
  (*Decisive* ch. 9, *Switch* ch. 8). Defines **Family A** for
  the `passive-guidance-loses-to-artefact-gravity` failure mode
  in two classes — Class A.1 (plan-body inherited framing; two
  layers) and Class A.2 (agent-registration/identity discipline;
  three layers: session-open rule + session-close gate with
  structural thread enumeration + stale-identity health probe).
  Defines **Family B** meta-tripwires for memory-taxonomy seams
  (per-consolidation meta-check, accumulation-triggered seam
  review, orphan-item signal). Makes **platform parity
  load-bearing**: every Family A rule requires canonical +
  Claude adapter + Cursor adapter + AGENT.md citation; every
  Family A probe requires platform-neutral inputs or explicit
  cross-platform parity. Self-application is explicit
  (two-phase: ratify then install; install session closes the
  exposure window).
- **PDR-030 (new)** — *Plane-Tag Vocabulary*. Unifies the two
  plane-aware tags introduced by the bundle into a small fixed
  vocabulary with two facets: **origin** (`Source plane:
  <plane>` inline on capture-stage entries) and **span**
  (`cross_plane: true` frontmatter on graduation-stage
  artefacts). Conditional on multi-plane memory organisation.
  New plane-prefixed tags require PDR amendment — the friction
  is the point. Authored in-bundle after the Session 3
  docs-adr-reviewer pass surfaced the vocabulary-fragmentation
  risk; owner directed the codification rather than deferring.
- **PDR-011 amendment (2026-04-21)** — continuity unit named
  explicitly as the **thread** (per PDR-027), not the session.
  Pipeline reframed as *thread-scoped at the upper lifecycle,
  session-scoped at the lower lifecycle*: capture within a
  session on a thread; distil → graduate → enforce across
  sessions within and across threads. Continuity contract
  extended to permit per-thread next-session records. Pipeline
  stages and split-loop model unchanged.
- **PDR-026 amendment (2026-04-21)** — landing commitment
  clarified as **per-thread-per-session**: a session commits to
  landing ONE thread's target; cross-thread spread is
  anti-pattern. Session-open structure updated to name the
  thread alongside the landing target; non-participating
  threads declared explicitly. Opportunistic structural fix:
  `Host-local context` moved from top-level H2 into a `## Notes`
  section and a `### Graduation intent` subsection added,
  matching the convention used by sibling PDRs.
- **README index** updated for PDR-026..PDR-030.
- Mid-cycle review discipline: `docs-adr-reviewer` dispatched
  on the bundle before owner review; supplementary pass
  dispatched on PDR-030 and the PDR-026 refactor. Findings
  applied to tighten cross-references, concept definitions
  (pending-graduations register, standing-decision register),
  and portability posture. Two OWNER-DECISION items surfaced
  by the supplementary pass (OD-3: span-tag frontmatter hedge;
  OD-4: migration-boundary mechanism) were accepted as-drafted
  (frontmatter canonical; migration boundary soft); addressable
  via amendment if tightening becomes load-bearing.

**Host-local downstream work scheduled**: Family A Class A.1
read-trigger surface (`standing-decisions.md`) and Class A.2
three tripwire layers install in Session 4 of the Staged
Doctrine Consolidation and Graduation plan. Family B layers
install same session. PDR-028 executive-memory drift-detection
surfaces install in Session 4 as well.

## [oak-open-curriculum-ecosystem] 2026-04-21 — Artefact Map row for `.agent/memory/` refreshed to three-mode taxonomy

- **practice.md Artefact Map** row for `.agent/memory/` rewritten
  from a single-thing description to explicitly enumerate the
  three modes (`active/` learning-loop; `operational/` continuity;
  `executive/` organisational contract) with their read triggers
  and refresh cadences. Cites `.agent/memory/README.md` for the
  full specification. Landed as Task 1.5 of the Staged Doctrine
  Consolidation and Graduation plan, Session 1; standing decision
  from 2026-04-21 (three-plane memory taxonomy RATIFIED;
  three-plane memory taxonomy PORTABLE) governs the frame.
- Owner-approved per PDR-003.

## [oak-open-curriculum-ecosystem] 2026-04-19 — PDR-025 Quality-Gate Dismissal + Compressed-Labels Principle Extended to Document-Structure Layer

- **PDR-025** graduates the distilled rule "all gates blocking, no
  'pre-existing' exceptions" into a full PDR covering quality-gate
  dismissal discipline. Three failure modes named: pre-existing
  dismissal; "no new issues" rationalisation; undocumented CI
  exception-lists. Decision: every gate failure routes to in-scope
  fix or a named lane with acceptance + owner + trigger; "pre-
  existing" is metadata, not a dismissal; CI exception-lists are
  tracked lanes, not shadow gates. Related to PDR-008 (gate
  naming), PDR-012 (findings routing), PDR-017 (workaround
  hygiene), PDR-020 (check-driven development) — composes without
  replacing.
- **practice-lineage.md** Active Learned Principle
  `Compressed neutral labels smuggle scope and uncertainty`
  extended to cover the document-structure layer as a third
  sibling (alongside review and planning). Trigger: 2026-04-19
  observability plan reshape surfaced a dual-frame drift trap
  (historical §Phase N headers + new §Execution Waves table + per-
  lane inline notes forming three authoritative frames for the
  same ordering). Document-structure layer instances go to the
  new `.agent/memory/active/patterns/collapse-authoritative-frames-when-settled.md`.
- Distilled graduation (2026-04-19 pass): 1 entry pruned
  (`All gates blocking, no "pre-existing" exceptions` → PDR-025);
  1 entry refined (`@ts-expect-error` narrowed to emphasise test-
  design scope distinct from PDR-020's RED-phase framing); 1
  watchlist entry added (forward-pointing planning references need
  "planned, not yet code" markers — single-instance hold pending
  cross-session validation).
- Host-local memory: three new patterns in `.agent/memory/active/patterns/`:
  `stage-what-you-commit.md` (2 cross-session instances — git
  index as durable state); `foundations-before-consumers.md`
  (owner-approved — multi-emitter plan wave ordering);
  `collapse-authoritative-frames-when-settled.md` (owner-approved
  — companion to the extended compressed-labels principle).
- **Fitness — Core trinity limits raised, deferred refinement
  acknowledged.** Step-9 fitness check surfaced three hard-zone
  Core trinity files (practice-bootstrap, practice-lineage,
  practice.md) alongside the three known-deferred directives.
  Per owner direction ("raise somewhat, not totally; defer full
  refinement and reflection of the Core to another session"),
  limits raised modestly with ~10% headroom over current content:
  practice-bootstrap `fitness_line_target` 590 → 680 /
  `fitness_line_limit` 750 → 830 / `fitness_char_limit` 31000 →
  40500; practice-lineage 590 → 680 / 725 → 830 / 36000 → 48500;
  practice.md `fitness_char_limit` 23000 → 29000 (lines unchanged).
  Practice.md prose-line-width violation at line 201 fixed by
  wrapping. Trinity files now soft-zone, not hard. Full refinement
  (compression, graduation, split decisions) deferred to a future
  dedicated session. Post-raise strict-hard state: three hard items
  matching the known-deferred AGENT.md / principles.md /
  testing-strategy.md — no new hard violations introduced.

## [oak-open-curriculum-ecosystem] 2026-04-18 — PDR-024 Vital Integration Surfaces + Consolidate-Docs Upstream-Review Wiring

- **PDR-024** names the vital bidirectional integration surfaces
  between repo and Practice Core as required, not optional. Five
  categories: (A) Core→Repo orientation — entry-point chain,
  practice-index bridge, start-flow skills, pattern discovery skill,
  rule activation; (B) Repo→Core feedback — capture, refinement,
  graduation, upstream Core review, Practice Box inbound, ephemeral
  exchange outbound; (C) Bootstrap / hydration / transplantation
  genesis paths; (D) Cross-cutting canonical contracts —
  artefact architecture (PDR-009), gate naming (PDR-008), specialist
  pattern (PDR-010), continuity surfaces (PDR-011), ecosystem
  tooling (PDR-006); (E) Defensive integrations — owner-edited
  foundations (PDR-003), pedagogical reinforcement (PDR-002),
  explorations tier (PDR-004). A Practice instance missing any vital
  surface is structurally present but inert (Practice Maturity
  Level 1).
- `consolidate-docs` command wired for PDRs and the new Core
  surfaces: step 5 (pattern extraction) distinguishes three
  destinations by substance shape (memory/patterns instances vs
  practice-core/patterns general abstractions vs PDR-shaped
  governance); step 7a (doctrine scan) now scans for ADR- AND
  PDR-shaped doctrine with adopter-scope test; step 7b (graduation
  destinations) names PDRs + practice-core/patterns as first-class
  homes; step 8 NEW — upstream Core review surfaces contradiction,
  extension, refinement, supersession, and drift candidates against
  existing Core for owner approval; step 10 (practice exchange)
  updated per PDR-007 outgoing-narrowing.
- `session-handoff` command now cites PDR-011 alongside ADR-150.
- `skills/patterns/SKILL.md` updated to point at both
  practice-core/patterns (general abstractions, first) and
  memory/patterns (instances, second); notes Practice-governance
  substance lives in PDRs, not patterns.
- `practice-verification.md` Bootstrap Checklist: item 9 cites
  PDR-008 canonical gate names; item 11 cites PDR-009 portability;
  new item 13 + new §Vital Integration Surfaces section enumerates
  every required surface from categories A, B, D, E per PDR-024.
- `practice.md` §Minimum Operational Estate gains §Vital Integration
  Surfaces subsection describing the bidirectional flow structure
  and linking PDR-024 + the verification checklist. §Self-Teaching
  Property refined to note dependency on Category A orientation
  surfaces.
- `practice-lineage.md`: new Learned Principle "Integrations must be
  named to be verified" added to Active Principles. §Growing a
  Practice cold-start gains step 11 verifying every vital surface
  from PDR-024.
- Distilled graduation: 9 entries pruned (substance graduated to
  PDRs 012-023 in the preceding session).

## [oak-open-curriculum-ecosystem] 2026-04-18 — PDR-007 Core Contract Change + Batch Practice-Governance PDRs

- **PDR-007** redefined the Practice Core contract from "eight files"
  to "a bounded package of files plus required directories." Added
  two first-class Core directories: `decision-records/` (absorbing
  the former `.agent/practice-decision-records/` peer) and
  `patterns/` (for general ecosystem-agnostic abstract patterns
  synthesised from specific instances).
- **PDR-008** codified canonical quality-gate naming across the
  Practice network — convention: bare = verify, `:fix` = apply,
  `:ci` = non-mutating CI form; `check` aliases `check:fix` as the
  one deliberate ergonomic exception.
- **PDR-009** codified canonical-first cross-platform agent
  architecture: canonical content in `.agent/` + thin platform
  adapters + entry points, with activation triggers distinct from
  policies.
- **PDR-010** codified the domain specialist capability pattern:
  four-layer structure (reviewer + skill + rule + optional
  operational tooling), agent classification taxonomy
  (domain_expert / process_executor / specialist), three operational
  modes (explore / advise / review), and the inverted-hierarchy
  variant for proportionality reviewers.
- **PDR-011** codified continuity surfaces and the surprise
  pipeline: three types of continuity (operational / epistemic /
  institutional), split-loop workflow (session-handoff vs
  consolidate-docs with consolidation gate), named continuity
  contract, surprise pipeline (capture → distil → graduate →
  enforce).
- **PDR-012 through PDR-023** batch-authored as Practice-governance
  decisions, absorbing ~29 Practice-governance patterns from
  `memory/active/patterns/` into coherent grouped PDRs: review-findings
  routing, grounding and framing, consolidation/knowledge-flow,
  reviewer authority and dispatch, claim propagation and reference
  quality, workaround hygiene and fix-at-source, planning
  discipline, ADR scope by reusability, check-driven development,
  test validity, governance enforcement scanners, documentation
  structure. Instance files remain in `memory/active/patterns/` with
  `related_pdr: PDR-NNN` frontmatter pointing at the general form.
- `.agent/practice-context/outgoing/` sharpened per PDR-007 to
  ephemeral exchange only: 12 PDR-shaped topic notes deleted
  (substance now in PDRs), `outgoing/patterns/` subdirectory
  retired (pattern exchange folds into Core travel), 4 files moved
  to `.agent/reference/` (host-local), 1 absorbed into the
  practice-core/patterns/ README.
- Trinity files updated to describe the new Core contract; Pattern
  Exchange section in `practice-lineage.md` rewritten to describe
  PDR/pattern travel as Core content.

## [oak-open-curriculum-ecosystem] 2026-04-18 — Transplantation + Generalisation Discipline + Portability Gradient

- **PDR-005 Wholesale Practice Transplantation** recorded as the third
  genesis scenario (alongside cold-start hydration and plasmid
  integration). Names the portability gradient vocabulary
  (fully-portable / portable-with-adaptation / hybrid / local); the
  classification-first three-phase process (manifest exploration →
  execution → four-audit close); and success criteria stronger than
  cold-start's (foreign-antigen audit, completeness audit, cohesion
  audit, manifest-closure audit).
- **PDR-006 Dev Tooling Per Ecosystem** recorded (same day) naming
  leading-edge reference repos and the nomination / supersession
  discipline.
- `practice-lineage.md` additions:
  - Two new Active Learned Principles: **generalise where
    generalisation doesn't cost utility** (naming the depth
    parameter of knowledge-flow extraction; specifying the context-
    test); **portability is a gradient, not a binary** (the
    gradient vocabulary consumed by PDR-005).
  - New §Three genesis scenarios sub-section in Growing a Practice,
    naming cold-start, plasmid integration, and wholesale
    transplantation, with pointers to PDR-005 for transplantation.
- `practice-bootstrap.md` adds the **Transplant Manifest** template
  as a specialised exploration shape, with frontmatter variant,
  gradient-classification table format, and the four-audit checklist.
- First use of the explorations tier established earlier today:
  `docs/explorations/2026-04-18-depth-of-generalisation-in-pattern-extraction.md`
  tests the generalisation discipline against three patterns
  extracted today and concludes with Option C (pointer annotations
  now, consolidation at next pass).
- Two existing patterns
  (`findings-route-to-lane-or-rejection.md`,
  `nothing-unplanned-without-a-promotion-trigger.md`) carry new
  `informs_deeper_pattern: no-smuggled-drops (pending consolidation)`
  frontmatter, making the deeper pattern discoverable before the
  consolidation executes.
- Motivation: the owner observed that wholesale transplantation has
  been performed manually several times and produces "surprise
  leftovers, incomplete transitions, contradictions" — a pattern
  indicator that codification is needed. The observation also
  surfaced a companion claim: Practice items that look ecosystem-
  specific are sometimes under-generalised extractions from their
  origin instance. Both observations produce Active Principles and
  the two PDRs; the generalisation discipline reduces the ecosystem-
  specific-orphan problem that transplantation would otherwise have
  to fix retroactively.

## [oak-open-curriculum-ecosystem] 2026-04-18 — Explorations as Durable Design-Space Tier + Active Principles Graduation

- Added **explorations** as a named documentation tier in the Practice
  Core. Explorations sit sideways between napkin (ephemeral
  observation) and ADR (committed decision) — option-weighing
  design-space documents that inform ADRs or plans without being
  refined rules. The tier filled a documentation gap: between
  captured observations and committed decisions there was previously
  no named home for durable research that hadn't yet crystallised
  into a decision. Host-repo convention: `docs/explorations/` with
  timestamped filenames.
- `practice.md` updates: Three Audiences renamed to **Five
  Audiences** with a new row for the Explore stage; Artefact
  Locations adds `docs/explorations/`; Artefact Map adds entry for
  host-repo explorations home; rationale paragraph added explaining
  explorations sit sideways to the main knowledge flow.
- `practice-lineage.md` updates: six new Active Principles captured —
  findings-route-to-lane-or-rejection (review-layer no-smuggled-drops);
  nothing-unplanned-without-a-promotion-trigger (planning-layer
  sibling); compressed-neutral-labels-smuggle-scope (generalisation
  across stretch/deferred/follow-up); implicit-architectural-intent-
  is-not-enforced-principle (naming is the upgrade path); explorations-
  sit-between-observation-and-decision (the new tier's principle
  form). Three new Always-Applied Rules: findings routing; planning
  trigger discipline; compressed-label correction.
- `practice-bootstrap.md` updates: new section **Design-Space
  Explorations** with required frontmatter, document shape,
  relationship to other tiers, creation triggers, and cross-repo
  exchange notes.
- PDR-004 recorded: Explorations as Durable Design-Space Tier. The
  PDR captures why the tier warrants Core-level naming and carries
  the graduation intent (stable concepts integrate into the Core
  trinity as refinements).
- Motivation: the receiving session established
  `docs/explorations/` to fill a real gap while reframing a
  single-branch observability expansion into a project-wide five-
  axis principle. The reasoning trail that shaped the reframe would
  not have survived the session without a durable home. Naming the
  tier in the Core makes the innovation portable.

## [oak-open-curriculum-ecosystem] 2026-04-17 — Practice Decision Records as Third Peer Directory

- Introduced a new peer directory alongside `.agent/practice-core/`
  and `.agent/practice-context/`: `.agent/practice-decision-records/`.
  Practice Decision Records (PDRs) capture authoritative decisions
  that govern the Practice itself — its structure, its doctrine, its
  own governance — as distinct from decisions that govern a host
  repo's product architecture.
- Motivation: decisions that govern a portable Practice must travel
  with it. Placing Practice-governance decisions in a host repo's
  product-ADR folder fails the travel test. The new peer directory
  preserves the eight-file Core contract while giving Practice
  doctrine a portable home.
- The arrangement is provisional. The intent is that stable PDRs
  integrate into the Core plasmid trinity as refinements over time;
  the PDR directory is a staging ground, not a permanent fixture.
- Wired into the Core entry points (`README.md`, `index.md`) and
  the verification companion (`practice-verification.md`) as an
  optional peer directory. The Core itself remains the eight-file
  package.
- First three PDRs recorded in the new directory:
  - PDR-001 — Location of Practice Decision Records (self-
    referential meta-decision that establishes the directory).
  - PDR-002 — Pedagogical Reinforcement in Foundational Practice
    Docs (substantive doctrine: cross-document rule repetition in
    foundational documents is deliberate reinforcement, not
    duplication).
  - PDR-003 — Sub-Agent Protection of Foundational Practice Docs
    (operational enforcement: sub-agents MUST NOT edit foundational
    documents; records the rationale that host-repo permission
    rules can now cite).
- Deferred: retroactive migration of existing Practice-governance
  decisions from host-repo product-ADR folders into the PDR
  directory. Migration touches cross-references in rule files and
  is a separate decision.

## [oak-open-curriculum-ecosystem] 2026-04-05 — Concept Exchange, ADR Bootstrap, Self-Containment

- Promoted "concepts are the unit of exchange" as a foundational
  principle in practice.md Philosophy section. The Practice learns,
  teaches, compares, and evolves at the concept level — not the file or
  name level. The knowledge flow extracts concepts from instances;
  Practice exchange compares concepts across repos.
- Promoted "substance before fitness" as a foundational principle
  (amended 2026-04-26 to "learning before fitness"). Concepts must be
  written at the weight they deserve first; fitness limits are
  post-writing health signals, not learning constraints.
- Added Architectural Decision Records section to practice-bootstrap.md:
  portable ADR template, lifecycle states, learning loop connection.
  ADRs are the graduation target of the knowledge flow.
- Strengthened self-containment: travelling content must carry the
  concept itself (what, how, why), not a pointer to where a host repo
  documents it. A descriptive name is better than an opaque number, but
  a name alone is still a pointer — the substance must travel.
- Removed all host-repo-specific ADR references from Practice Core
  files (6 occurrences of "ADR-144" across 3 files, replaced with
  concept descriptions).
- Reframed Integration Flow step 3 to operate at the concept level:
  "compare at the concept level, not file-by-file."
- Compressed redundant content across practice.md, practice-bootstrap.md,
  and practice-lineage.md to accommodate new material within fitness
  limits — holistically, after writing, not during.

## [oak-open-curriculum-ecosystem] 2026-04-03 — Operational Estate and Provenance UUID Migration

- Migrated `provenance.yml` from sequential `index` integers to UUID v4 `id`
  fields across all three chains (63 existing entries + 3 new entries).
  Eliminates implied hierarchy and merge-conflict risk during plasmid exchange.
  Updated field specification in practice-lineage.md.
- Added Minimum Operational Estate section to practice-bootstrap.md: defines
  6 mandatory surface categories (core+bridge, memory, continuity host,
  planning scaffold, platform truth, validators) that must exist beyond the
  Core 7 files for a self-sufficient hydration
- Added Claimed/Installed/Activated Audit section to practice-bootstrap.md:
  three-state verification model ensuring surfaces are not just claimed but
  actually installed and activated on a fresh checkout
- Added Fresh-Checkout Acceptance Criteria to practice-bootstrap.md: 6 things
  a fresh-checkout agent must do without consulting the source repo
- Extended Post-Installation Health Check with continuity-host existence,
  bridge truthfulness, and runtime smoke checks (three proof modes: presence,
  parity, runtime)
- Added Continuity Contract subsection to practice-bootstrap.md Skills: host
  surface as verification target, contract fields, surprise pipeline, split
  between session-handoff and consolidate-docs
- Added cross-platform integration order and policy-spine authority hierarchy
  to the Artefact Model section
- Extended Ecosystem Survey with deliberate-omission protocol: absent concepts
  must be recorded in live surfaces with rationale, not just changelogs
- Added forward reference to Fresh-Checkout Acceptance Criteria near the top
  of practice-bootstrap.md for hydration orientation
- Strengthened continuity-host wording in practice.md: the host is a
  verification target, not just a description; prompts are one valid option
- Added Minimum Operational Estate pointer and Claimed/Installed/Activated
  reference to practice.md
- Added 3 new Active Learned Principles to practice-lineage.md: hydration
  verifies operations not just structure, deliberate absences must live in
  operational surfaces, canonical source before activation always
- Extended practice-lineage.md Integration Flow step 8 with operational
  surface audit clause
- Extended practice-lineage.md hydration steps 8-9 with deliberate-omission
  and claimed/installed/activated requirements
- Added 3 operational validation checks (7-9) to practice-lineage.md with
  explicit static/operational distinction
- Integrated 8 incoming practice-context files from agent-collaboration
- Split practice-bootstrap.md: extracted verification material (bootstrap
  checklist, health check, minimum operational estate,
  claimed/installed/activated audit, fresh-checkout acceptance criteria) into
  new `practice-verification.md` — 8th Practice Core file. The split gives
  verification proper weight as a distinct lifecycle phase
- Deduplicated continuity host description in practice.md: reduced to
  summary with pointer to practice-bootstrap.md §Continuity Contract
- Promoted two Active Principles to axiom tier: "Architectural excellence
  over expediency" and "Apps are thin; libraries own domain logic" — both
  already stated in the universal principles blueprint
- Updated all "seven files" references to "eight files" across the Core

## [oak-open-curriculum-ecosystem] 2026-04-03 — Continuity Promotion and Platform-Config Doctrine

- Promoted the split-loop continuity model into the portable Core:
  `session-handoff` is now a required command, prompts explicitly carry live
  continuity contracts, and the lineage now records that ordinary continuity
  and deep convergence are separate loops
- Promoted the platform-configuration doctrine into the portable Core:
  tracked project settings define the agentic system contract, gitignored local
  settings are additive overrides, and portability checks must validate
  authorisation parity as well as wrapper presence
- Tightened reviewer guidance so UI-heavy repos may install a browser-facing
  reviewer cluster (for example accessibility, design-system, and
  component-architecture reviewers) rather than relying on one generic code
  reviewer for rendered output

## [oak-open-curriculum-ecosystem] 2026-04-01 — Consolidation Workflow Evolution

- Added full abstract Consolidation Workflow section to practice-bootstrap.md
  (the Knowledge Flow's central mechanism now travels with the Practice as an
  operational workflow, not just a conceptual description)
- Renamed "Code Patterns" to "Reusable Patterns" to reflect all learning types:
  process, architecture, structural, behavioural, agent operational,
  domain-specific
- Updated consolidation command summary in the Required Commands table to
  mention incoming practice box integration and outgoing practice context
  broadcast
- Compressed the Distillation subsection into a brief reference that points to
  the new Consolidation Workflow section

## [oak-open-curriculum-ecosystem] 2026-04-01 — Learning Loop Refinement

- Absorbed the distillation skill into the consolidation command as an
  inline step. Distillation had exactly one consumer (consolidation step 6)
  and did not warrant independent extraction as a skill
- Added explicit graduation criteria for distilled.md entries: stable,
  natural home exists, target doc has capacity
- Made fitness management active in the consolidation command: analyse,
  refine, split, or extend files at or approaching their ceiling
- Removed "not yet matured into settled practice" barrier language — agent-
  operational content is what the Practice is for
- Updated all Practice Core references from "the distillation skill" to
  "the consolidation command" or conceptual "distillation" process
- Deleted canonical distillation skill and all platform adapters

## [oak-open-curriculum-ecosystem] 2026-03-23 — Practice Convergence Remediation

- Clarified hook-runtime wording in the portable Core: hook enforcement uses a
  repo-local script surface (`scripts/` or `tools/` as appropriate), not a
  hard-coded directory name
- Clarified the portable fitness doctrine: the trinity files carry all three
  ceilings, while other docs declare only the dimensions their role needs and
  validators check only declared dimensions
- Clarified that advisory hook types can stay documented-only when equivalent
  grounding or quality-gate reminders already exist elsewhere in the local
  Practice
- Synced outgoing support notes to the live implementation state: promoted the
  cross-platform surface integration guide, added a Claude Code hook activation
  note, and refreshed the fitness artefacts so they match the live repo-wide
  validator

## [oak-open-curriculum-ecosystem] 2026-03-23 — Deep Integration of algo-experiments Round-Trip

- Integrated 8 evolution rounds from pine-scripts and algo-experiments
- Adopted provenance.yml extraction (7th Practice Core file)
- Adopted fitness key rename: `fitness_ceiling` → `fitness_line_count`,
  `fitness_ceiling_chars` → `fitness_char_count`,
  `fitness_max_prose_line` → `fitness_line_length`
- Adopted "strict and complete, everywhere, all the time" as explicit
  universal principle
- Adopted Learned Principles tiering (axioms vs active)
- Adopted session priority ordering, plan readiness levels, code-pattern
  exchange mechanism, and Code Pattern Exchange section
- Preserved local "architectural excellence over expediency" and "apps are
  thin; libraries own domain logic" as Active learned principles
- Re-added Practice Maturity diagnostic framework (4 levels)
- Added `.github/` to recognised platform adapter families
- Retained `.agent/prompts/` for handover prompts (valid local adaptation
  distinct from the prompts-to-skills migration for generic workflows)

## [algo-experiments] 2026-03-23 — Prompts-to-Skills Migration and Core Cohesion

- Removed "prompts" as a separate artefact category from the portable Core.
  Session-entry workflows (start-right-quick, start-right-thorough, go) now
  live as canonical skills in `.agent/skills/`, with thin command and platform
  skill wrappers. The workflow diagrams, artefact lists, integration flow
  steps, ecosystem survey, bootstrap checklist, and validation sections all
  updated to reflect this
- Added "Session workflows must be state-free" as a learned principle: session
  skills must not carry per-session content (specific plan names, tranche
  status, active/archive state). They reference plan-discovery surfaces and
  let those own the mutable state
- Added readme-as-index code pattern to the exchange pack: plan-directory
  READMEs are pure indexes, plan content lives in `.plan.md` files

## [algo-experiments] 2026-03-23 — Fitness Constraint Reflow and Rename

- Renamed fitness frontmatter keys for clarity: `fitness_ceiling` to
  `fitness_line_count`, `fitness_ceiling_chars` to `fitness_char_count`,
  `fitness_max_prose_line` to `fitness_line_length`
- Reflowed all prose in the trinity files and directive files to the
  100-character line length limit
- Recalibrated line count ceilings to accommodate reflowed prose:
  line counts increase with narrower lines but character counts
  (the honest volume constraint) are unchanged

## [algo-experiments] 2026-03-23 — Hooks and Fitness Universalisation

- Added hook guardrails to Practice Core: hooks row in artefact model table
  (`practice-bootstrap.md`), hooks description in Tooling section
  (`practice.md`). Hooks follow the canonical-first pattern: policy in
  `.agent/hooks/`, shared runtime in `tools/`, thin native activation.
- Extended three-dimension fitness constraint from trinity-only to all files
  carrying a fitness function. Updated doctrine in `practice-lineage.md` and
  `practice.md`.

## [algo-experiments] 2026-03-23 — Practice Core Structural Reform

- Extracted per-file provenance chains from trinity frontmatter into
  `provenance.yml` — a new seventh file in the Practice Core package.
  Trinity frontmatter now carries a pointer (`provenance: provenance.yml`)
  instead of the full array.
- Adopted three-dimension fitness constraints from oak-open-curriculum-ecosystem: line
  count (`fitness_ceiling`), character count (`fitness_ceiling_chars`), and
  prose line width (`fitness_max_prose_line`). All measure content only —
  frontmatter is excluded. The three dimensions form a constraint triangle
  that prevents gaming any single dimension.
- Introduced Learned Principles tiering: **axioms** (one-line, validated across
  3+ repos) and **active** principles (recent, with teaching narrative).
  Promotion happens during consolidation.
- Added Growth Governance section documenting provenance extraction and
  principles tiering as negative-feedback mechanisms.
- Deduplicated Meta-Principles from practice.md (replaced with cross-reference
  to the canonical list in practice-lineage.md §Learned Principles).
- Compressed validation scripts, sub-agent template, Practice Index template,
  and command adapter examples to structural specifications.
- Updated all "six files" references to "seven files" across the Core.

## [algo-experiments] 2026-03-23 — Practice Innovation Write-Back

- Added code-pattern exchange mechanism to the portable Core: template in
  `practice-bootstrap.md`, exchange guidance in `practice-lineage.md` and
  `practice.md`, consolidation step in the consolidation command
- Added four learned principles: repo-state enforcement needs its own proof
  layer; four kinds of truth; entry surfaces degrade by default; RED-first
  applies to repo-state enforcement
- Added session priority ordering (bugs → unfinished → new) to the portable
  bootstrap and the start-right command specification in lineage
- Added plan readiness levels (decision-complete vs session-entry-ready) to
  the bootstrap artefact model
- Added reference/research estate split guidance to the bootstrap
- Packaged 6 cross-repo-applicable code patterns into
  `.agent/practice-context/outgoing/patterns/`
- Added two new outgoing notes: multi-strand planning pattern and repo-audit
  as Practice enforcement

## [algo-experiments] 2026-03-23 — Strict Completeness and Exchange-Pack Guidance

- Promoted "strict and complete, everywhere, all the time" from local doctrine
  into the portable Practice Core blueprint and bootstrap guidance
- Clarified in the portable testing philosophy that complete proof belongs in
  the correct layer, not only in tests
- Added the learned pattern that Practice Context outgoing works best as an
  indexed support pack with note types separated by responsibility

## [algo-experiments] 2026-03-22 — Strict-and-Complete Tenet

- Added "strict and complete, everywhere, all the time" as explicit local canon
  rather than leaving strictness as an implied style preference
- Clarified that type precision is one of the clearest concrete expressions of
  this tenet
- Threaded the tenet into the testing doctrine so strictness means complete
  proof in the correct layer, not collapsing every proof type into tests

## [algo-experiments] 2026-03-22 — Test Boundary Clarification and Repo Audit Split

- Clarified that tests exist to prove behaviour and code-level engineering
  correctness, not to police tracked repo state or file layout
- Split static repo checks out of `pytest` into a dedicated repo-audit step so
  filesystem, text-estate, and wrapper-parity concerns use the correct tool
- Updated the local doctrine and quality-gate sequence to model repo audits as
  distinct from tests

## [algo-experiments] 2026-03-21 — Cross-Platform Surface Contract and Evidence Boundary

- Added a local cross-platform surface matrix as the operational contract for
  supported and unsupported platform mappings
- Clarified across the portable Core that `.agents/skills/` is a narrow
  portable skill and command-workflow layer, not evidence for blanket
  `.agents/` parity
- Added the portability-language refinement that portable does not mean
  symmetrical; unsupported states should be explicit rather than silent

## [algo-experiments] 2026-03-21 — Native Skill Surface Expansion

- Completed native skill-wrapper coverage for Cursor, Claude Code, Gemini CLI,
  and GitHub Copilot against the canonical `.agent/skills/` estate
- Normalised skill wrappers to a stricter thin-wrapper contract: frontmatter
  plus a single pointer body, with no wrapper-local headings or workflow logic
- Updated the artefact inventory, Practice bridge, and bootstrap guidance so
  native skill surfaces are modelled explicitly

## [algo-experiments] 2026-03-21 — Gemini Command Surface Integration

- Added Gemini `jc-*.toml` command wrappers for the full canonical command
  estate
- Clarified in the Core and local matrix that commands remain a distinct
  semantic surface repo-wide even when some platforms can converge them into
  skills
- Kept GitHub command wrappers explicitly unsupported rather than implied by
  omission

## [algo-experiments] 2026-03-21 — GitHub Reviewer-Agent Integration

- Added GitHub reviewer adapters matching the installed canonical reviewer
  roster exactly
- Documented GitHub Copilot reviewer wrappers as thin, read-only pointer
  surfaces rather than a second canonical source
- Updated the Practice bootstrap and local bridge to model GitHub reviewer
  adapters alongside Cursor, Claude, and Codex

## [algo-experiments] 2026-03-21 — Practice Surface Contract Tests and Parity Validation

- Added repository contract tests for the matrix, wrapper-family parity,
  explicit unsupported states, and thin wrapper shape
- Extended reviewer-platform parity checks so GitHub reviewer adapters are part
  of the executable contract
- Made surface discoverability itself testable from the Practice bridge, the
  active entry surface, and the research note

## [algo-experiments] 2026-03-21 — Practice Context Cross-Platform Write-Back

- Added an outgoing source pack, discoveries note, portable-versus-native
  surface note, and receiving-repo integration guide for the cross-platform
  tranche
- Kept the portable Core concise by routing source-heavy and contingent
  implementation lessons into `.agent/practice-context/outgoing/`
- Updated the outgoing Practice Context index so future receiving repos can
  find the new support material quickly

## [algo-experiments] 2026-03-19 — Repo Reframe and Source Absorption

- Reframed the repo around trading-input processing, Python research and
  validation, and multi-platform output adapters
- Added repo-wide context, market-data doctrine, research-methodology, and
  parity guidance as local canon
- Localised plan templates, experiment logging, and specialist-capability plans
- Removed dependency on the temporary imported source snapshot after
  translation into local artefacts

## [pine-scripts] 2026-03-18 — Practice Maturation & Ecosystem Write-Back

- Built full sub-agent component architecture: 6 components (subagent-identity, reading-discipline, review-discipline, dry-yagni, reviewer-team, default persona)
- Refactored all 5 reviewer templates to compose from components; removed duplicated universal content
- Created canonical plan structure with lifecycle directories (active/current/future/archive) grouped by domain
- Moved all existing plans to canonical locations with `.plan.md` naming
- Moved python-environment-setup from plans to `.agent/reference/` (not a plan)
- Wrote 4 documents back to the source practice ecosystem: field report, sub-agent component model proposal, practice maturity model, plan lifecycle refinement
- Extracted 2 code patterns: thin-adapter-pattern, component-composition-pattern
- Deep consolidation: verified DRY compliance (15/15 rules with consistent thin adapters), updated cross-references, cleaned stale identity.md stub
- Practice assessed at Level 3 (Self-Correcting) per the maturity model proposed back to the source practice ecosystem

## [pine-scripts] 2026-03-17 — Practice Infrastructure Hardening

- Applied DRY to principles.md: TDD stated once authoritatively, testing section references testing-strategy.md
- Fixed strategy-context-guardrails: moved inline content from `.cursor/rules/` to canonical `.agent/rules/`
- Created `.agents/skills/` cross-platform discovery layer (14 thin wrappers)
- Added `agent-files-are-infrastructure` rule and Cursor/Claude adapters
- Improved practice-bootstrap.md §Metacognition: added failure mode warnings (the "not even wrong" failure, the recursive failure, load-bearing affective break and grounding anchor)
- Added six new Learned Principles to practice-lineage.md (metacognition-as-technology, intent-over-mechanics, recursive-failure-mode, agent-files-are-infrastructure, .agents/-as-discovery-surface)
- Fixed practice.md parenthetical to be ecosystem-agnostic (no longer references "SDK, MCP servers, search system")
- Updated practice-index.md: added Rules section, GO.md prompt, `.agents/` directory
- Updated artefact-inventory.md with `.agents/` layer and corrected counts

## [pine-scripts] 2026-03-17 — Intent Transfer

- Rewrote ALL operational artefacts using the imported source substrate, preserving reasoning depth
- Replaced hollow metacognition directive with the real recursive metacognitive prompt
- Expanded principles.md, testing-strategy.md, invoke-code-reviewers.md, AGENT.md to carry full reasoning, anti-patterns, and escape-hatch closures
- Upgraded all 13 rules from 1-2 line stubs to compressed-but-complete arguments
- Upgraded all 9 commands from checklists to structured workflows
- Rewrote all 5 sub-agent templates to full review systems with delegation triggers, checklists, output formats, boundaries
- Created GO.md prompt with ACTION/REVIEW/GROUNDING cadence
- Key insight: integrating mechanics without intent produces correct-but-inert artefacts; the Practice works through reasoning embedded in every layer

## [pine-scripts] 2026-03-17 — Practice Core Integration

- Integrated full Practice Core into trading strategy research repo, replacing stub files
- Installed memory pipeline (napkin, distillation skills), universal skills (systematic-debugging, patterns, receiving-code-review), and prompts
- Added missing Cursor agent adapters and completed Claude command adapter coverage
- Upgraded practice-index to full table format
- Appended pine-scripts provenance entries to all three trinity files

## [castr] 2026-03-09

- Integrated portable Practice Core into a mature local repo Practice rather than a blank-slate hydration
- Confirmed `principles.md` as the authoritative doctrine name and aligned the local canonical-first structure around that distinction
- Added the structural learning that paused workstreams are distinct from `future/` backlog in mature repos
- Clarified that the portable agent architecture is installable in stages: the Core should distinguish canonical reviewer/domain-expert structure from a repo's current installation status
- Added provenance entries for Castr to the travelling trinity files

## [oak-open-curriculum-ecosystem] 2026-03-09

- Integrated new-cv round-trip: adopted Codex model, value traceability, six-file package, practice-context adjunct, napkin threshold 800→500
- Added `.codex/` to platform adapter lists throughout `practice.md` and `practice-bootstrap.md`
- Updated artefact map and review system to include Codex reviewer registration model
- Adopted value traceability as plan workflow point 5
- Replaced templates as required infrastructure with optional supporting artefacts
- Lowered napkin distillation threshold from ~800 to ~500 lines
- Removed repo-specific ADR references from portable files (routed via practice-index)
- Updated ADR directory path to generic "Repo's ADR directory" with practice-index reference
- Adopted expanded learned principles: documentation concurrent, value traceability, local norms, fitness everywhere, self-containment with practice-context
- Added Adaptation Levels, Restructuring path, and Validation scripts sections to `practice-lineage.md`
- Adopted `CHANGELOG.md` as the sixth Practice Core file
- Adopted practice-context adjunct pattern references

## [new-cv] 2026-03-09

- Added value traceability to the portable planning model: non-trivial work now has to state outcome, impact, and value mechanism
- Updated `practice-lineage.md` so the metacognition prompt and `plan` command both carry the outcome-to-value bridge explicitly
- Tightened `practice.md` to treat plan templates as optional supporting artefacts rather than a required `.agent/plans/templates/` layer
- Updated the bootstrap practice-index template so `.agent/plans/` no longer implies a mandatory templates subtree
- Added an optional `.agent/practice-context/` adjunct pattern with sender-maintained `outgoing/` support material and transient receiver-side `incoming/`; clear `incoming/` after integration and let agents consider supporting outgoing files when a changelog entry alone would be too thin

## [new-cv] 2026-03-08

- Clarified the portable Codex model: `.agents/skills/` is for skills and command-shaped workflows, while real Codex reviewer sub-agents live under `.codex/`
- Updated `practice.md` to include `.codex/` in the tooling layer, review-system description, and artefact map
- Updated `practice-bootstrap.md` so its adapter summary and reviewer-roster wording match the `.codex/` reviewer model
- Aligned the portable Practice wording with the repo's current Codex reviewer architecture

## [new-cv] 2026-03-06

- Added "Restructuring an Existing Practice" path to practice-lineage.md
- Expanded Ecosystem Survey to include practice maturity assessment
- Extended "Never overwrite" to cover domain-specific practice mechanisms
- Added routine cohesion audit to consolidation command specification
- Reframed underscore-prefix rule as ecosystem-agnostic principle
- Added this changelog
- Updated all "five files" references to "six files" across the Practice Core
- Removed vestigial ADR numbers (114, 117, 119, 124, 125) from practice.md and practice-bootstrap.md — concepts already described inline
- Fixed broken references: `schema-first-execution.md`, `invoke-code-reviewers`, `pnpm qg`
- Made non-canonical paths generic: ADR directory paths removed from the Practice Core (routed via `practice-index.md`)
- Aligned distillation threshold to ~500 lines across practice.md and practice-bootstrap.md
- Made portability check step ecosystem-agnostic in practice-bootstrap.md

## [new-cv] 2026-03-05

- First restructuring hydration: adopted the Practice Core into a repo with a mature platform-locked Practice
- Added provenance entries for new-cv to all three trinity files

## [oak-open-curriculum-ecosystem] 2026-02-28

- Ecosystem-agnostic hydration: labelled ecosystem-specific content
- Added cold-start path
- Aligned consolidation with concurrent documentation principle

## [oak-open-curriculum-ecosystem] 2026-02-27

- Adopted Practice Core structure, trinity concept, and bootstrap from round-trip

## [cloudinary-icon-ingest-poc] 2026-02-26

- Origin: initial Practice Core files created for short-lived POC

## [oak-open-curriculum-ecosystem] 2026-02-26

- Origin: initial Practice lineage created for production SDK ecosystem
