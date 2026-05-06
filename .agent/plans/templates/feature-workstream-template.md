---
name: "[Plan Title]"
overview: "[One-line scope description]"
todos:
  - id: ws1-cycle-1
    content: "WS1 cycle 1: [test name] + [product code that makes it pass]. One commit. Tree green at end."
    status: pending
    # depends_on: []   # parallel-safe (no prerequisites)
  - id: ws1-cycle-2
    content: "WS1 cycle 2: [next test+code pair]. One commit. Tree green at end."
    status: pending
    # depends_on: []   # parallel-safe with ws1-cycle-1 if file scopes don't overlap
  - id: ws2-cycle-1
    content: "WS2 cycle 1: [test name] + [product code]. One commit. Tree green at end."
    status: pending
    depends_on: [ws1-cycle-1]   # example: this cycle consumes an interface ws1-cycle-1 introduces
  - id: ws3-doc-propagation
    content: "WS3: TSDoc, README, NL guidance, ADR/directive updates for landed behaviour."
    status: pending
    depends_on: [ws1-cycle-1, ws1-cycle-2, ws2-cycle-1]
  - id: ws4-quality-gates-final
    content: "WS4: Full quality gate chain (sdk-codegen through smoke:dev:stub) on the integrated delivery."
    status: pending
    depends_on: [ws3-doc-propagation]
  - id: ws5-adversarial-review
    content: "WS5: Adversarial specialist reviews. Document findings."
    status: pending
    depends_on: [ws4-quality-gates-final]
  - id: ws6-doc-propagation
    content: "WS6: Propagate settled outcomes to canonical ADR/directive/reference docs and relevant READMEs."
    status: pending
    depends_on: [ws5-adversarial-review]
isProject: false
---

<!-- TDD shape (mandatory): every WS that lands product code is a
     SEQUENCE of test+code CYCLES. Each cycle is one commit
     containing the failing test + the product code that makes it
     pass + any refactor — landed together. Tests and product code
     never separate across commits. Higher-level tests (integration,
     E2E) often need multiple lower-level cycles first; sequence
     them so each commit ends with all tests passing. The
     ws*-cycle-N todo IDs above are the unit of landing — replace
     the example IDs with the real cycles for this plan and add
     more rows as needed.

     See .agent/plans/templates/components/tdd-phases.md for the
     cycle definition and .agent/directives/testing-strategy.md
     §"TDD = test + product code as PAIRS" for the directive. -->

<!-- After copying this template, adjust component reference paths.
     From templates/ the paths use ../templates/components/.
     From .agent/plans/semantic-search/active/ use ../../templates/components/. -->

# [Plan Title]

**Last Updated**: [YYYY-MM-DD]
**Status**: 🟡 PLANNING
**Scope**: [One-line description of what this plan addresses]

---

## Context

[Describe the current situation, what exists, and what needs to change]

### Problem Statement

[What is the specific problem? Include evidence — error messages, test
failures, architectural gaps.]

### Existing Capabilities

[What already exists that this plan builds on? Do not duplicate what
the SDK, existing tools, or infrastructure already provide.]

---

## Design Principles

1. **[Principle 1]** — [Why this matters for the design]
2. **[Principle 2]** — [Why this matters for the design]

**Non-Goals** (YAGNI):

- [Thing we are explicitly NOT doing and why]

---

## Build-vs-Buy Attestation (REQUIRED before ExitPlanMode)

Complete this section for any plan that integrates a third-party vendor
(observability, auth, DB, bundler, CI/CD, hosting, payments, analytics,
search, storage, queueing, LLM provider). Delete the section if the plan
is purely internal.

**Vendor**: [e.g. Sentry / Vercel / Clerk / Elasticsearch / …]

**First-party integrations surveyed**:

| Integration shipped by vendor | Evaluated? | Adopted / ruled out + reason |
|--|--|--|
| [e.g. `@sentry/esbuild-plugin`] | [yes / no] | [adopted / "ruled out because X" — "X" must be concrete, not sunk-cost reasoning] |
| [e.g. official GitHub Action] | [yes / no] | [adopted / concrete reason ruled out] |
| [e.g. managed service / hosted flow] | [yes / no] | [adopted / concrete reason ruled out] |

**If bespoke wrapper is chosen**: state explicitly what the first-party
options cannot do that the bespoke shape can. "We already started
writing it", "we have tests for the current approach", or "switching
would be expensive" are SUNK-COST reasoning — not valid answers. Future
maintenance cost of the bespoke shape is the only relevant cost.

**Reviewer**: `assumptions-reviewer` MUST run against this attestation
pre-ExitPlanMode for any vendor-integration plan (see Reviewer
Scheduling below).

---

## Session Discipline (multi-session plans only)

Delete this section if the plan is single-session. Otherwise
reference the session-discipline component:

> **Session discipline**: see
> [`../templates/components/session-discipline.md`](../templates/components/session-discipline.md).
> The four disciplines (template-not-contract count, mid-arc
> checkpoints, context-budget thresholds, metacognition at session
> open) apply to every session in this plan.

Plan-specific amendments (tighter thresholds, specific checkpoint
placements, forward-loading of discipline artefacts into early
sessions) live alongside the reference.

---

## Lifecycle Triggers

> See [Lifecycle Triggers component](../templates/components/lifecycle-triggers.md)

Before the first non-planning edit, record the work shape: trivial
landing target, bounded simple plan, or executable repo plan. For
non-trivial work, name the start-right, active-claim, decision-thread,
session-handoff, and consolidation touch points this plan will use.

---

## Cycle Dependencies and Parallelisation

> See [TDD Cycles component](../templates/components/tdd-phases.md)
> §"Atomic, independent cycles for parallel dispatch"

Where the work shape allows, structure cycles so they can be
dispatched to parallel agents. For each cycle ask:

1. Could this cycle land at a different time than another in the
   plan without changing either's behaviour or verification?
2. Does this cycle touch the same files as another? If yes, name
   the overlap precisely (which lines / which symbols).
3. Does this cycle's acceptance criterion depend on another
   cycle's product code being present?

Cycles that touch separate file scopes and have no acceptance
dependency on other cycles are PARALLEL-SAFE — declare an empty
`depends_on: []` (or omit the field) on the YAML todo. The
orchestrator can dispatch them to separate agents simultaneously
with self-contained briefs.

Cycles that genuinely require other cycles to land first are
SEQUENCED — declare `depends_on: [prerequisite-cycle-id, ...]`
on the YAML todo. They are not dispatched until each prerequisite
has landed.

Plan-author discipline: do not invent serial dependencies. Pick
the natural decomposition (separate workspaces, separate modules,
separate features) the cycles already suggest. Where natural
decomposition yields independence, the cycles ARE parallel-safe
— declare them so.

### Self-contained brief checklist (per cycle)

A cycle is "ready to hand off to a parallel agent" when its
description in this plan answers:

- **What test to write**: file path + assertion shape
- **What product code to write**: file path(s) + behaviour
- **Starting state**: which branch / commit the cycle starts from
- **File scope**: every file the cycle is permitted to touch
- **Files NOT to touch**: the parallel-safety boundary
- **Acceptance**: deterministic command(s) another agent can run
- **Reviewer dispatch (optional)**: specialist reviewers for this
  cycle's substance

If any of these is missing, the cycle cannot be safely dispatched
to a parallel agent and must be either reshaped or kept sequenced
with the orchestrator.

---

## Reviewer Scheduling (phase-aligned)

Reviewers are scheduled in three phases, chosen by what they challenge:

### Plan-phase (PRE-ExitPlanMode) — challenges solution-class

These reviewers ask "should this work exist at all, in this shape?"
They are cheapest to act on because no commitment has been made.

- `assumptions-reviewer` — proportionality, build-vs-buy attestation,
  phase-alignment, blocking legitimacy, sunk-cost reasoning detection
- [specialist reviewer for vendor, if applicable — e.g. `sentry-reviewer`,
  `clerk-reviewer`, `elasticsearch-reviewer`, `mcp-reviewer`] — first-
  party integration surface, canonical idiom for this vendor

If `assumptions-reviewer` is requested mid-session AFTER code is
committed, that is a phase-misalignment signal, not a volume signal —
the invocation still runs, but the review MUST name the misalignment so
the scheduling pattern is corrected next time.

### Mid-cycle (DURING execution) — challenges solution-execution

These reviewers ask "is this well-structured within the chosen shape?"
They fire at natural checkpoints (after RED, after GREEN, after
integration wiring).

- `test-reviewer`, `type-reviewer` — after each RED/GREEN cycle
- `architecture-reviewer-*` (barney/betty/fred/wilma) — after
  structural changes
- `security-reviewer` — after trust-boundary changes
- `code-reviewer` — gateway; routes to missing specialists; fires the
  friction-ratchet counter when 3+ independent friction signals
  accumulate against the same shape (see code-reviewer template)

### Close (POST-execution) — verifies coherence

These reviewers ask "is the landed state internally consistent?"

- `docs-adr-reviewer` — documentation drift; ADR intent-vs-implementation
- `onboarding-reviewer` — contributor first-contact quality
- `release-readiness-reviewer` — GO / GO-WITH-CONDITIONS / NO-GO

---

## WS1 — [Slice 1: short value-bearing description]

> See [TDD Cycles component](../templates/components/tdd-phases.md)

WS1 is a sequence of test+code cycles that together deliver
[value-bearing slice 1]. Every cycle is one commit containing the
failing test, the product code that makes it pass, and any
refactor. The tree is green at the end of every commit.

### Cycle 1.1: [Cycle name — what behaviour this cycle delivers]

**Parallel-safety**: [parallel-safe | sequenced after `<cycle-id>`]

**Starting state**: [branch HEAD at dispatch | after `<cycle-id>` lands]

**File scope** (this cycle is permitted to touch):

- `[test-file].unit.test.ts` (NEW or MODIFIED)
- `[path/to/file.ts]` (NEW or MODIFIED)

**File scope NOT to touch** (parallel-safety boundary):

- [files another concurrent cycle owns; e.g., `[other-file.ts]`]

**Test** (Red):

- `[test-file].unit.test.ts` — [What it asserts]

**Product code** (Green):

- `[path/to/file.ts]` — [What changes; the minimal code to green
  the test]

**Refactor** (optional, in the same commit):

- [Extract/rename/document changes that keep the test green]

**Acceptance** (executable by another agent without reading the
rest of the plan):

1. The test runs and passes
2. The whole tree is green (`pnpm test` exits 0; no skipped tests)
3. The commit message names the cycle

**Code Sketch** (include when the approach is known):

```typescript
// Current (path/to/file.ts:42):
[problematic code]

// Target:
[desired code]
```

**Deterministic Validation**:

```bash
pnpm test --filter [workspace]
# Expected: exit 0, all tests pass

pnpm test
# Expected: exit 0, no skipped tests, no failing tests
```

**Reviewer dispatch (optional)**: [specialists for this cycle's
substance — e.g., `type-reviewer`, `mcp-reviewer`]

### Cycle 1.2: [Next cycle name]

[Same structure as 1.1: parallel-safety; starting state; file
scope; files NOT to touch; Red test; Green product code;
Refactor; Acceptance; Validation; Reviewer dispatch. One commit
per cycle. Self-contained brief — another agent can pick it up
and complete it without further coordination.]

---

## WS2 — [Slice 2: short value-bearing description]

WS2 is a sequence of cycles delivering [value-bearing slice 2].
For higher-level tests (integration, E2E) that need WS1's pieces
first, sequence the cycles so each commit ends green.

### Cycle 2.1: [E2E or integration cycle name]

**Test** (Red):

- `[test-file].integration.test.ts` or `[test-file].e2e.test.ts`
  — [What system-level behaviour it asserts]

**Product code** (Green):

- The wiring/composition pieces that turn the test green.
  If the test requires units that are not yet present, FIRST
  add them as their own unit cycles in this WS or the prior WS,
  then this cycle adds the integration/E2E test + the final
  wiring in one commit.

**Acceptance**:

1. The test runs and passes
2. The whole tree is green (`pnpm test` exits 0; no skipped tests)
3. Lower-level tests proving the units are also present

---

## WS3 — Documentation and Cross-Surface Updates

Pure documentation changes (TSDoc, README, ADR/directive prose
updates) that do not require new product behaviour. These do not
need test+code cycles because no behaviour changes; they are
landed alongside the cycles whose behaviour they document, or as
a final cleanup commit if the documentation is integrative.

### 3.1: TSDoc and NL guidance

- [Tool descriptions, NL examples, workflow guidance for the
  landed behaviour]

### 3.2: Documentation

- [README updates, architecture docs, ADR amendments]

---

## WS4 — Quality Gates

> See [Quality Gates component](../templates/components/quality-gates.md)

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test && pnpm test:ui && pnpm test:e2e && pnpm smoke:dev:stub
```

---

## WS5 — Adversarial Review

> See [Adversarial Review component](../templates/components/adversarial-review.md)

Invoke specialist reviewers. Document findings. Create follow-up
plan if BLOCKERs found.

---

## Risk Assessment

> See [Risk Assessment component](../templates/components/risk-assessment.md)

| Risk | Mitigation |
|------|------------|
| [Risk 1] | [Mitigation] |
| [Risk 2] | [Mitigation] |

---

## Foundation Alignment

> See [Foundation Alignment component](../templates/components/foundation-alignment.md)

---

## Documentation Propagation

> See [Documentation Propagation component](../templates/components/documentation-propagation.md)

---

## Consolidation

After all work is complete and quality gates pass, run `/jc-consolidate-docs`
to graduate settled content, extract reusable patterns, rotate the napkin,
manage fitness, and update the practice exchange.

---

## Dependencies

**Blocking**: [What must be completed before this can start?]

**Related Plans**:

- [Plan name] — [Relationship]
