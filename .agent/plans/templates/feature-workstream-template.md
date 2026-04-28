---
name: "[Plan Title]"
overview: "[One-line scope description]"
todos:
  - id: ws1-red
    content: "WS1 (RED): [Describe tests to write]. Tests MUST fail."
    status: pending
  - id: ws2-green
    content: "WS2 (GREEN): [Describe implementation]. All tests MUST pass."
    status: pending
  - id: ws3-refactor
    content: "WS3 (REFACTOR): [Describe documentation, TSDoc, NL guidance, README updates]."
    status: pending
  - id: ws4-quality-gates
    content: "WS4: Full quality gate chain (sdk-codegen through smoke:dev:stub)."
    status: pending
  - id: ws5-adversarial-review
    content: "WS5: Adversarial specialist reviews. Document findings."
    status: pending
  - id: ws6-doc-propagation
    content: "WS6: Propagate settled outcomes to canonical ADR/directive/reference docs and relevant READMEs."
    status: pending
isProject: false
---

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

## WS1 — [Test Specification] (RED)

All tests MUST FAIL at the end of WS1.

> See [TDD Phases component](../templates/components/tdd-phases.md)

### 1.1: [Test Group]

**Tests**:

- `[test-file].unit.test.ts` — [What it asserts]
- `[test-file].integration.test.ts` — [What it asserts]

**Acceptance Criteria**:

1. Tests compile and run
2. All new tests fail for the expected reason
3. No existing tests broken

---

## WS2 — [Implementation] (GREEN)

All tests MUST PASS at the end of WS2.

### 2.1: [Implementation Task]

**File**: `[path/to/file.ts]`

**Changes**:

- [Specific change 1]
- [Specific change 2]

**Code Sketch** (include when the approach is known):

```typescript
// Current (path/to/file.ts:42):
[problematic code]

// Target:
[desired code]
```

**Deterministic Validation**:

```bash
# [What this checks]
[command]
# Expected: [result]
```

---

## WS3 — [Documentation and Polish] (REFACTOR)

### 3.1: TSDoc and NL guidance

- [Tool descriptions, NL examples, workflow guidance]

### 3.2: Documentation

- [README updates, architecture docs]

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
