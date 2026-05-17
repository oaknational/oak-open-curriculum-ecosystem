---
archived_from: '../distilled.md'
archived_at: 2026-05-17
archived_by: Swift Winging Gust / claude / Opus 4.7 (1M) / 50492a
archive_reason: 'History of where graduated substance went — not active learning. The substance itself lives at the named permanent homes (principles.md, agent-collaboration.md, workflow.md, testing-tdd-recipes.md, rules/, PDRs).'
sections_archived:
  - 'Recent graduations (2026-05-12 — Volcanic Charring Furnace)'
  - 'Recently Distilled — 2026-05-12 Napkin Rotation'
  - 'Recently Distilled — 2026-05-10 Napkin Rotation'
  - 'Graduations Log — 2026-05-14 Verdant Swaying Glade Route C-iv'
  - 'Graduations Log — 2026-05-14 Riverine Swimming Hull Batch C'
---

# Distilled — Graduations-Log Archive (2026-05-12 → 2026-05-14)

Routing logs from the 2026-05-12 → 2026-05-14 consolidation passes. Every
entry below describes substance that already graduated to a permanent home;
the back-cites are preserved here for audit-trail value, not active recall.
Live distilled state remains at [`../distilled.md`](../distilled.md).

---

## Recent graduations (2026-05-12 — Volcanic Charring Furnace)

Processed the substance distilled from
[`napkin-2026-05-12b.md`](archive/napkin-2026-05-12b.md) into durable homes
without using fitness numbers as brevity targets. The source archive remains
intact. Disposition:

- Mature commit/collaboration lessons landed in
  [`agent-collaboration.md`](../../directives/agent-collaboration.md),
  [`commit/SKILL-CANONICAL.md`](../../skills/commit/SKILL-CANONICAL.md),
  [`respect-active-agent-claims.md`](../../rules/respect-active-agent-claims.md),
  and
  [`collaboration-state-conventions.md`](../operational/collaboration-state-conventions.md).
- Learning-before-fitness details landed in
  [`substance-before-fitness.md`](patterns/substance-before-fitness.md):
  archive before compaction, and reconcile stale status without silent
  graduation.
- New pattern entry: static-analysis registration with scaffold
  ([pattern][static-analysis-scaffold]).
- Owner-visible or implementation-shaped follow-ups were routed to
  [`pending-graduations.md`](../operational/pending-graduations.md) as:
  commit-boundary peer-pair governance refinements; collaboration tooling
  operator UX backlog; detached monitor lifecycle contract; quality-gate
  profiling and built-surface proof backlog; skill and documentation surface
  audit follow-ups; graph-stack implementation and planning pattern candidates.
- Retained distilled state: the staged sequence still continues with
  `pending-graduations.md`, then `practice-bootstrap.md`; the hypothesis-layer
  multi-agent validation entry below remains held pending N≥3 validation.


---

## Recently Distilled — 2026-05-12 Napkin Rotation

The nine entries previously held here have all graduated; routing is captured
in the 2026-05-12 Volcanic Charring Furnace graduation log above. Brief
disposition: pre-stage non-negotiability and advisory-decay → P3 commit-queue
guard at `c083a1ab`; agent-tools unified CLI → P-Foundation landed; peer
sidebars vs helpers → `inter-agent-sidebar-with-default-action` + agent-
collaboration.md; pathspec discipline + verify-actual-contents → PDR-054 +
peer-commit-absorption-third-direction pattern + agent-collaboration.md
§ Treat Commit as a Short-Lived Shared Transaction Surface; gendered-
pronoun default → user-memory + jc-* skill canonicals; tooling-discipline
items (glob quoting, markdownlint --fix safety) live operationally rather
than as distilled doctrine.


---

## Recently Distilled — 2026-05-10 Napkin Rotation

These entries merged during the 2026-05-10 deep consolidation pass.
Most graduated to permanent homes during the 2026-05-14 Verdant Swaying
Glade Route C-iv pass; the entries listed below remain held for
cross-session validation or for a destination decision in a future
consolidation.

### Curation And Doctrine-Holding

- (graduated 2026-05-14 — see Graduations Log entry under
  "Riverine Swimming Hull Batch C")

### Coordination And Commit Discipline

- (graduated 2026-05-14 — see Graduations Log entry under
  "Riverine Swimming Hull Batch C")

### Planning Arithmetic And Disposition

- (no remaining entries — both planning-arithmetic items graduated to
  the [`jc-plan` skill body § Disposition Ledger][plan-disposition])

[plan-disposition]: ../../skills/plan/SKILL-CANONICAL.md#disposition-ledger-for-apply-all-of-x-inputs


---

## Graduations Log — 2026-05-14 Verdant Swaying Glade Route C-iv

Graduations landed during the 2026-05-14 Route C-iv pass. Entries below
moved from the 2026-05-09 / 2026-05-10 rotations to their named permanent
homes per canonical step 7b. Five distilled entries graduated as new
substance; four were verified as already-incorporated and pruned with
back-cites; two planning-arithmetic items consolidated into one
disposition-ledger section in the `jc-plan` skill body.

**Newly graduated (5 substance moves)**:

- *Target-architecture wording needs consuming-runtime evidence*
  → [`principles.md` § Code Quality (after "Misleading docs are blocking")][prin-target-arch]
- *Commit-helper state writes still need peer-claim audits*
  → [`agent-collaboration.md` § Treat Commit as a Short-Lived Shared Transaction Surface][ac-helper]
- *Generators require populated source data* (consolidating the
  2026-05-09 + 2026-05-10 mentions of the same insight)
  → [`docs/engineering/workflow.md` § 12 Workflow Gotchas][wf-generators]
- *Exact focused tests should use the runner directly when script forwarding drifts*
  → [`docs/engineering/workflow.md` § 12 Workflow Gotchas][wf-runner]
- *Unit test taxonomy beats historical local precedent*
  → [`docs/engineering/testing-tdd-recipes.md` § Adding To Existing IO Debt In A Unit Test File][tdd-iodebt]

**Consolidated graduation (2 entries → 1 section)**:

- *Count targets derived from current state must name their derivation*
  AND *"Apply all of X" needs a disposition ledger, not one cycle per item*
  → [`jc-plan` skill body § Disposition Ledger For "Apply All Of X" Inputs][plan-disposition]

**Already-incorporated prunes (4 back-cites, no new substance)**:

- *Reading doctrine is weaker than holding its frame at output time*
  was already covered structurally by `principles.md` § Architectural
  Excellence Over Expediency — three structural cues at output time
  (PDR-043 / ADR-172). The cure is operational; the distilled note
  was a refinement of an already-landed cure.
- *Parent directives need operational cures when the rule keeps being
  rediscovered* was already incorporated into `agent-collaboration.md`
  § c (Treat Commit as a Short-Lived Shared Transaction Surface), which
  now names both `git add -- <paths>` and `git commit -- <paths>` as
  the cured pair. Cure landed; observation distilled.
- *Whole-tree hooks can block pathspec-only commits by design* was
  already incorporated into `agent-collaboration.md` § c — the queue
  protects authorial-bundle integrity but does not narrow whole-tree
  hooks; minor peer-owned failures are repaired in place. Cure landed;
  observation distilled.
- *Check schema or CLI help before authoring claims from memory* was
  already covered structurally by [`read-before-asking.md`][rba] (and
  PDR-057, the empirical-answerability pre-question gate). The
  structural cure is read-before-asking; the distilled note was an
  instance.

[prin-target-arch]: ../../directives/principles.md#code-quality
[ac-helper]: ../../directives/agent-collaboration.md#c-treat-commit-as-a-short-lived-shared-transaction-surface
[wf-generators]: ../../../docs/engineering/workflow.md#generators-require-populated-source-data
[wf-runner]: ../../../docs/engineering/workflow.md#use-the-test-runner-directly-when-script-forwarding-drifts
[tdd-iodebt]: ../../../docs/engineering/testing-tdd-recipes.md#adding-to-existing-io-debt-in-a-unit-test-file
[rba]: ../../rules/read-before-asking.md

---

## Graduations Log — 2026-05-14 Riverine Swimming Hull Batch C

Three curation entries from the 2026-05-10 Sylvan Fruiting Glade rotation
graduated to permanent homes per the graduation-triage-disposition
2026-05-14 plan's Batch C. All three were stable since 2026-05-10 (4 days)
with no contradicting evidence; all are minor curation/hygiene cures
whose right home is the workflow gotchas section in the engineering
workflow document.

**Newly graduated (3 substance moves)**:

- *Lettered-section edits must re-read the parent count*
  → [`docs/engineering/workflow.md` § 12 Workflow Gotchas — Lettered-Section Edits Must Re-Read The Parent Count][wf-lettered]
- *Growth-axis metadata is live doctrine*
  → [`docs/engineering/workflow.md` § 12 Workflow Gotchas — Growth-Axis Metadata Is Live Doctrine][wf-growth]
- *Shell loops over multiline command output are unsafe in deletion paths*
  → [`docs/engineering/workflow.md` § 12 Workflow Gotchas — Shell Loops Over Multi-line Command Output Are Unsafe In Deletion Paths][wf-shell]

[wf-lettered]: ../../../docs/engineering/workflow.md#lettered-section-edits-must-re-read-the-parent-count
[wf-growth]: ../../../docs/engineering/workflow.md#growth-axis-metadata-is-live-doctrine
[wf-shell]: ../../../docs/engineering/workflow.md#shell-loops-over-multi-line-command-output-are-unsafe-in-deletion-paths
