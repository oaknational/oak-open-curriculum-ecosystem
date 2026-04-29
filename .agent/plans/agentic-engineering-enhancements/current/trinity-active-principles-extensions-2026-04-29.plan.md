---
name: "Trinity Active Principles — 2026-04-29 Doctrine Extensions"
overview: >
  Carry the five 2026-04-29 doctrine sharpenings upward from PDR
  amendments into the trinity Active Principles + bootstrap surfaces
  per the trinity-drift sub-agent report. Concept-home work — the
  concepts already live in PDRs, skill, rule, distilled; this plan
  routes their general statement to the trinity layer where the
  Practice describes its own most-general principles. PDR-003
  care-and-consult applies: drafts produced in the deferring
  session (2026-04-29 by Nebulous Illuminating Satellite); per-diff
  owner approval before each lands.
parent: 2026-04-29-deferred-items-coordination.md
todos:
  - id: ext-1-knowledge-preservation-trinity
    content: "Extension 1: extend practice.md §Philosophy / Learning before fitness with the two-valid-responses + named-forbidden list. Mirror in practice-lineage.md Axioms."
    status: drafting
  - id: ext-2-shared-state-always-writable
    content: "Extension 2: extend practice.md Collaboration bullet + practice-lineage.md Always-Applied Rules with shared-state-always-writable contract. Add practice-verification.md smoke-test."
    status: drafting
  - id: ext-3-tool-error-as-question
    content: "Extension 3: add Active Principle 'Tool error as question' to practice-lineage.md."
    status: drafting
  - id: ext-4-reviewer-scope-equals-prompted-scope
    content: "Extension 4: add Active Principle 'Reviewer scope equals prompted scope' to practice-lineage.md + brief mention in practice-bootstrap.md §Sub-agents."
    status: drafting
  - id: ext-5-testing-classification-by-behaviour-shape
    content: "Extension 5: extend practice-lineage.md Testing Philosophy + practice-bootstrap.md testing-strategy.md template with behaviour-shape classification."
    status: drafting
  - id: per-diff-approval
    content: "Surface each draft amendment to owner; apply each on individual approval per PDR-003 hybrid posture."
    status: pending
isProject: false
---

# Trinity Active Principles — 2026-04-29 Doctrine Extensions

**Parent**:
[`2026-04-29-deferred-items-coordination.md`](2026-04-29-deferred-items-coordination.md).
**Created**: 2026-04-29 (deferred from 2026-04-29 deeper convergence
pass; drafts produced same session per owner direction).
**Status**: DRAFTING — five amendment diffs are below; each requires
per-diff owner approval before applying, per PDR-003.

## Context

The 2026-04-29 deeper convergence run sharpened five doctrines that
landed at PDR-amendment / skill / rule / distilled tier. The
trinity-drift sub-agent identified that the substance has not yet
propagated upward to the trinity Active Principles + bootstrap
surfaces (where the Practice describes its own most-general
principles). This is a healthy lag — single-session sharpenings
should sit at PDR layer for at least one cross-session validation
cycle — but owner direction is to draft the trinity extensions now
and surface per-diff for approval. Drafts below.

The five sharpenings:

1. **Knowledge preservation is absolute** — fitness limits never
   block writes to shared-state knowledge surfaces; only valid
   alternatives are write-in-full-and-flag or thoughtful holistic
   promotion to permanent homes.
2. **Shared-state files always writable / always commit-includable** —
   regardless of any active claim; deliberate anti-log-jam tradeoff.
3. **Tool error as question** — every signal-surface return is a
   question about state; three valid responses (understand-and-
   address / understand-and-dismiss-with-rationale / understand-
   and-stop); never skip-understanding.
4. **Reviewer scope equals prompted scope** — a reviewer's verdict
   is scoped to the brief; gating merge requires briefing with full
   merge-gate scope, not arc scope.
5. **Testing classification by behaviour-shape** — tests classified
   by behaviour (in-process vs separate-process, exchanges-protocol-
   with-running-system or imports-product-code-into-test-process),
   not by filename suffix.

## Extension 1 — Knowledge preservation absolute (in trinity)

**Source surfaces**: napkin SKILL §Knowledge Preservation Is Absolute,
consolidate-docs §Learning Preservation, distilled.md, PDR-026
amendment 2026-04-29.

### 1a. `practice.md` §Philosophy — Learning before fitness

**Location**: `.agent/practice-core/practice.md` lines 78–85
(existing "Learning before fitness" passage).

**Existing text** ends with: "Fitness is a post-writing health signal,
never a reason to suppress learning."

**Proposed addition** (extends, does not replace):

```markdown
The discipline has two valid responses to a write that pushes a
shared-state knowledge surface past target/limit: write the insight
in full and flag the file for attention, OR thoughtful holistic
promotion of mature concepts to permanent homes (ADR / PDR /
governance doc / principles / rule / README / TSDoc) via the
graduation scan. The forbidden responses are naive cutting,
compression, summarisation, splitting-for-budget, skipping the
write, or drafting a "concise version" alongside the full version.
Compressed capture is lossy capture; capture is sacred.
```

### 1b. `practice-lineage.md` Axioms — Learning before fitness

**Location**: `.agent/practice-core/practice-lineage.md` lines
637–644 ("Learning before fitness" axiom).

**Existing text**: brief axiom statement.

**Proposed addition** (extends): same two-valid-responses + named-
forbidden text as 1a, condensed to axiom register.

## Extension 2 — Shared-state files always writable / always commit-includable

**Source surfaces**: respect-active-agent-claims §Shared-state always
writable, distilled.md, PDR-026 amendment 2026-04-29.

### 2a. `practice.md` Collaboration bullet

**Location**: `.agent/practice-core/practice.md` lines 259–266
(existing Collaboration state bullet).

**Proposed addition** (extends the bullet):

```markdown
The shared-state contract: claims surface coordination, never refuse
entry. Shared-state knowledge surfaces (napkin, distilled, patterns,
thread records, repo-continuity, comms log, conversations,
escalations, claims) are ALWAYS writable and ALWAYS commit-
includable regardless of any active claim — deliberate anti-log-jam
tradeoff. The commit queue / `git:index/head` window is the
serialisation mechanism, not the claim.
```

### 2b. `practice-lineage.md` Always-Applied Rules

**Location**: `.agent/practice-core/practice-lineage.md` lines
215–218 ("Agent-to-agent coordination is observable" rule).

**Proposed addition** (sibling rule):

```markdown
- **Shared-state files are always writable** — claims on
  shared-state surfaces are coordination signals, not no-write
  locks. Writes are never blocked; the commit queue / index/head
  window is the serialisation mechanism. Anti-log-jam tradeoff
  per PDR-026 amendment 2026-04-29.
```

### 2c. `practice-verification.md` smoke-test addition

**Location**: `.agent/practice-core/practice-verification.md`
verification §"Vital Surfaces Category A".

**Proposed addition**:

```markdown
+ **Shared-state writability smoke**: the canonical writer can
  write to shared-state surfaces while a claim is held on the
  same path; rules / skills / commands do not turn shared-state
  into write-blocked surfaces.
```

## Extension 3 — Tool error as question (Active Principle)

**Source surfaces**: PDR-018 amendment 2026-04-29; pattern
`tool-error-as-question.md`; instance patterns
`hook-as-question-not-obstacle.md`, `ground-before-framing.md`.

### 3a. `practice-lineage.md` Active Principles

**Location**: `.agent/practice-core/practice-lineage.md` Active
Principles section (around lines 646–720).

**Proposed addition** (new principle entry):

```markdown
- **Tool error as question** — every signal-surface return (tool,
  hook, reviewer, validator, type-checker, fitness signal,
  Edit-tool safety contract) is a question about state. Three
  valid responses: understand-and-address; understand-and-dismiss-
  with-rationale; understand-and-stop. Never skip-understanding.
  The instinct of "tool returns error → find bypass" is the named
  anti-pattern. Codified at PDR-018 amendment 2026-04-29; instance
  patterns at memory/active/patterns/ (tool-error-as-question,
  hook-as-question-not-obstacle, ground-before-framing).
```

### 3b. `practice.md` §Philosophy cross-reference

**Location**: `.agent/practice-core/practice.md` §Philosophy near
"Strict and complete, everywhere, all the time".

**Proposed addition** (one sentence cross-reference):

```markdown
The strict-and-complete posture has an operational form at the
signal-surface level: tool error is a question, not a problem to
bypass (see PDR-018).
```

## Extension 4 — Reviewer scope equals prompted scope

**Source surfaces**: PDR-015 amendment 2026-04-29; PDR-018 amendment
2026-04-29; pattern `scope-as-goal.md`.

### 4a. `practice-lineage.md` Active Principles

**Location**: same section as Extension 3.

**Proposed addition**:

```markdown
- **Reviewer scope equals prompted scope** — a reviewer's verdict
  is scoped to the brief that briefed them. "GO WITH CONDITIONS"
  reads as a green merge signal only when the reviewer's brief
  matches the merge-gate scope. When asking a reviewer to gate
  merge, brief them with the full merge-gate criteria. Conflating
  arc-scope with merge-gate-scope is the named failure mode
  (`scope-as-goal` pattern). Codified at PDR-015 amendment
  2026-04-29.
```

### 4b. `practice-bootstrap.md` §Sub-agents

**Location**: `.agent/practice-core/practice-bootstrap.md` §Core
Review Agents (around lines 381–385).

**Proposed addition** (one sentence):

```markdown
When dispatching a reviewer to gate merge or completion, brief
with the full merge-gate scope, not the arc scope — reviewer
verdicts are scope-bounded artefacts (PDR-015 amendment 2026-04-29).
```

## Extension 5 — Testing classification by behaviour-shape

**Source surfaces**: testing-strategy.md amendment 2026-04-29.

### 5a. `practice-lineage.md` Testing Philosophy

**Location**: `.agent/practice-core/practice-lineage.md` lines
120–125 (Testing Philosophy — Unit / Integration definitions).

**Proposed addition** (extends the E2E definition):

```markdown
Tests are classified by behaviour shape — does the test exchange
protocol with a separate running system, or does it import product
code into the test process? — not by filename suffix. A `.e2e.test.ts`
filename does not exempt a test from in-process restrictions; the
behaviour-shape classification governs.
```

### 5b. `practice-bootstrap.md` testing-strategy.md template

**Location**: `.agent/practice-core/practice-bootstrap.md` lines
225–232 (testing-strategy.md template).

**Proposed addition** (one sentence):

```markdown
Classification rule: behaviour shape, not filename suffix. Filename
is signal, not exemption.
```

## Process

For each Extension above, owner reviews the proposed addition,
approves OR rejects OR requests revision. On approval, I apply
the diff to the named surface. On rejection, I capture the
rationale in repo-continuity and leave the doctrine at PDR-amendment
tier for now. On revision request, I draft the revised version
in this plan body and re-surface.

The five extensions are independent; any subset may land in any
order.

## Acceptance Criteria

- [ ] Each of the five extensions has explicit owner disposition
      (approved + applied / rejected with rationale / revised).
- [ ] Applied extensions land at the named locations with the
      proposed text.
- [ ] Pending-Graduations Register entry for trinity extensions
      flipped to graduated (with per-extension status if mixed).
- [ ] Trinity-drift sub-agent's recommendation closure recorded.

## Reviewers

- `assumptions-reviewer` may be dispatched per-extension if the
  owner's first reaction is uncertain; otherwise per-diff approval
  is the gate.
- `docs-adr-reviewer` final pass on applied extensions to verify
  cross-references resolve.

## Risk

Moderate. Trinity edits in Practice Core require care-and-consult
per PDR-003. Sub-agent risk-assessment from 2026-04-29 trinity-drift
review:

> The doctrine sharpenings are individually too recent
> (single-session) for unilateral promotion to the trinity; they
> should sit at PDR-amendment level for at least one more cross-
> session validation cycle.

Owner has overridden this with the explicit "draft now, per-diff
approval" direction. Mitigation: each extension is a small additive
change (≤ 15 lines per surface); no Core surface is restructured;
all five extensions cite the source PDR amendment so future
contributors can navigate to the originating sharpening if the
trinity claim is later re-examined.

## Cross-References

- Parent:
  [`2026-04-29-deferred-items-coordination.md`](2026-04-29-deferred-items-coordination.md).
- Source PDR amendments:
  PDR-015 (reviewer authority and dispatch),
  PDR-018 (planning discipline),
  PDR-026 (per-session landing commitment).
- Source rule / skill / command:
  [`napkin/SKILL.md` §Knowledge Preservation Is Absolute][napkin-skill],
  [`consolidate-docs.md` §Learning Preservation][consolidate-docs-pres],
  [`respect-active-agent-claims.md` §Shared-state always writable][respect-shared-state-rule],
  [`testing-strategy.md` §E2E test definition][testing-strategy].
- Sub-agent report from 2026-04-29 trinity-drift review.

[napkin-skill]: ../../../skills/napkin/SKILL.md#knowledge-preservation-is-absolute--fitness-is-never-a-constraint
[consolidate-docs-pres]: ../../../commands/consolidate-docs.md#learning-preservation-overrides-fitness-pressure
[respect-shared-state-rule]: ../../../rules/respect-active-agent-claims.md#shared-state-files-are-always-writable-and-always-commit-includable
[testing-strategy]: ../../../directives/testing-strategy.md
