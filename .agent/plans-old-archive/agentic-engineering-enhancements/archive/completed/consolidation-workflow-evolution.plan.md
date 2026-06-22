---
name: "Consolidation Workflow Evolution"
overview: "Propagate learning-loop improvements to Practice Core, resolve bootstrap template gaps, and decide whether consolidation belongs in the portable Practice"
todos:
  - id: phase-0-strategic-decision
    content: "Phase 0: Decide whether the consolidation workflow belongs in Practice Core."
    status: completed
  - id: phase-1-bootstrap-updates
    content: "Phase 1: Update practice-bootstrap.md to reflect consolidation improvements."
    status: completed
  - id: phase-2-validation
    content: "Phase 2: Validate fitness, portability, and document the decision."
    status: completed
---

> NOTES:
>
> - when this plan is complete, we need to commit and push.
> - we need to update the plan templates so that all plans automatically include the consolidation workflow as a final step

# Consolidation Workflow Evolution

**Last Updated**: 2026-04-01
**Status**: COMPLETED
**Scope**: Propagate consolidation command improvements to Practice Core
and decide whether the consolidation workflow itself should be portable.

---

## Context

The Learning Loop Refinement (2026-04-01) and its immediate follow-up
produced several improvements to the consolidation command:

1. Step 5 broadened from "Extract code patterns" to "Extract reusable
   patterns" covering all types of learning
2. Step 9 gained an explicit outgoing Practice Context pathway
3. Step 7 now states Practice Core structural changes are valid with
   user approval
4. The distillation protocol was absorbed as an inline step

These improvements exist only in this repo's `.agent/commands/consolidate-docs.md`.
The Practice Core's `practice-bootstrap.md` template still has the narrow
framing. Repos that bootstrap from the Practice will get an outdated
version of the consolidation workflow description.

More fundamentally: the Practice Core describes the Knowledge Flow as
"the Practice's central mechanism" (`practice.md` §The Knowledge Flow),
yet the workflow that *drives* the Knowledge Flow — the consolidation
command — does not travel with the Practice. New repos get the concept
but not the implementation.

### The Strategic Question

The napkin skill travels with the Practice (via `practice-bootstrap.md`).
The distillation protocol now travels too (embedded in the bootstrap
template's distillation section). But the full consolidation workflow —
the 10-step procedure that graduates content, manages fitness, and drives
the practice exchange — is a canonical command that stays behind.

Should the consolidation workflow be part of Practice Core?

**Arguments for**:

- The Knowledge Flow is "the Practice's central mechanism." A mechanism
  described without its implementation is aspirational, not operational.
- Every repo that adopts the Practice needs consolidation. They currently
  have to reinvent or discover it independently.
- The napkin and distillation already travel. Consolidation is the third
  leg of the same tripod.
- The bootstrap template already contains a one-line summary of the
  consolidation command. Expanding it to include the full workflow is a
  degree change, not a kind change.

**Arguments against**:

- Consolidation is a complex 10-step workflow. Practice Core files are
  under tight fitness constraints. Adding the full workflow would
  consume significant capacity.
- The consolidation command is repo-specific in places (e.g., `pnpm
  practice:fitness`, specific plan directory structures). A portable
  version would need to be more abstract.
- Commands are user-invoked operational procedures. Practice Core
  traditionally carries concepts and templates, not full operational
  procedures.
- The bootstrap template already provides enough scaffolding for a new
  repo to create its own consolidation command.

**A middle path**: The bootstrap template could carry a more complete
consolidation protocol — not the full 10-step command verbatim, but the
essential workflow logic (graduation criteria, fitness management,
practice exchange) in a form that new repos can adapt. This is what
already happened with the distillation protocol.

---

## Identified Improvements

### I1: Bootstrap template "Code Patterns" heading

`practice-bootstrap.md` line 433 says "Code Patterns" but should
reflect all types of learning. The `domain` field in the frontmatter
template already includes "agent-infrastructure, planning, validation,
testing" — the heading is narrower than the intent.

### I2: Bootstrap template consolidation command summary

`practice-bootstrap.md` line 340 summarises consolidation as "Check
Practice fitness. Consider Practice evolution." This omits the practice
exchange (incoming/outgoing) which is now an explicit part of
consolidation step 9.

### I3: Consolidation workflow breadth in bootstrap

The bootstrap template's distillation section (lines 419-431) was
updated in the previous session, but the broader consolidation workflow
improvements (graduation criteria, fitness management, practice exchange)
are not reflected in the portable template.

### I4: Agent infrastructure coherence audit scope correction

The existing `agent-infrastructure-coherence-audit.plan.md` in `future/`
lists "Practice Core portable files" as out of scope. This should be
corrected to: "Practice Core structural changes require user approval"
(consistent with the governance correction made this session).

---

## Non-Goals

- Rewriting the full consolidation command as a Practice Core artefact
  (unless Phase 0 decision directs this)
- Changing the three-layer model (ADR-125)
- Changing Practice Core structural organisation
- Refactoring the consolidation command itself (already done)

---

## Foundation Document Commitment

Before beginning work:

1. Re-read `.agent/practice-core/practice-lineage.md` — governance rules
   for Practice Core changes
2. Re-read `.agent/practice-core/practice-bootstrap.md` — current
   template state
3. Re-read `.agent/practice-core/practice.md` §The Knowledge Flow — how
   the consolidation workflow is currently described

---

## Resolution Plan

### Phase 0: Strategic Decision (~15 min)

Present the strategic question and arguments to the user. The decision
determines the scope of Phase 1.

#### Task 0.1: User Decision on Consolidation in Practice Core

Present the three options:

**Option A — Full workflow in Practice Core**: Add the consolidation
workflow as a new section in `practice-bootstrap.md`, abstracted from
repo-specific tooling (no `pnpm` commands, no specific directory paths).
Largest change, highest value for new repos.

**Option B — Expanded protocol in Practice Core**: Keep the current
structure (bootstrap template has a summary + distillation protocol)
but expand the summary to include graduation criteria, fitness
management principles, and practice exchange flow. Medium change,
captures the key improvements without the full procedure.

**Option C — No Practice Core change**: The bootstrap template is
sufficient as-is. Improvements stay in this repo's command. New repos
discover the pattern independently. Smallest change.

**Acceptance Criteria**:

1. User has chosen Option A, B, or C
2. Decision is recorded in the plan

---

### Phase 1: Bootstrap Template Updates (~30 min)

Scope depends on Phase 0 decision. All options include I1, I2, and I4.
Option A or B additionally includes I3.

#### Task 1.1: Rename "Code Patterns" Section (I1)

In `practice-bootstrap.md`, rename the section heading from "Code
Patterns" to "Reusable Patterns" and update the opening description
to reflect all learning types.

**Acceptance Criteria**:

1. Section heading says "Reusable Patterns" (or equivalent)
2. Description mentions process, architecture, structural, behavioural,
   agent operational, and domain-specific patterns
3. No other content changes

#### Task 1.2: Update Consolidation Command Summary (I2)

In `practice-bootstrap.md`, update the consolidation command row in the
commands table to mention the practice exchange (incoming/outgoing).

**Acceptance Criteria**:

1. Summary mentions incoming practice box integration
2. Summary mentions outgoing practice context broadcast
3. Table row fits within line length constraints

#### Task 1.3: Expand Consolidation Protocol (I3) — Options A/B Only

If Option A: Add a new "Consolidation Workflow" section to
`practice-bootstrap.md` with the abstract workflow (graduation criteria,
fitness management, practice exchange). Remove repo-specific tooling
references.

If Option B: Expand the existing distillation section to include
graduation criteria (stable? natural home? capacity?) and the practice
exchange principle (incoming integration + outgoing broadcast).

**Acceptance Criteria**:

1. Graduation criteria are documented (stable, natural home, capacity)
2. Fitness management principle is documented (analyse, refine, split,
   extend)
3. Practice exchange is documented (incoming integration, outgoing
   broadcast, Practice Core proposals with user approval)
4. No repo-specific tooling commands (no `pnpm`, no specific paths)

#### Task 1.4: Correct Coherence Audit Scope (I4)

In `agent-infrastructure-coherence-audit.plan.md`, change the out-of-scope
entry from "Practice Core portable files (governed by plasmid exchange
model)" to "Practice Core structural changes (require user approval,
governed by plasmid exchange model)".

**Acceptance Criteria**:

1. Out-of-scope entry reflects the corrected governance framing
2. No other changes to the audit plan

#### Task 1.5: Update Practice Core CHANGELOG

Add an entry to `.agent/practice-core/CHANGELOG.md` documenting the
changes made in this plan.

**Acceptance Criteria**:

1. Entry describes the specific changes
2. Entry references the consolidation workflow evolution plan

---

### Phase 2: Validation (~15 min)

#### Task 2.1: Practice Fitness Check

Run `pnpm practice:fitness:informational` and verify all files remain
within their ceilings after the changes.

**Deterministic Validation**:

```bash
pnpm practice:fitness:informational
# Expected: PASS, no violations
```

**If violations found**: Compress content in the affected file before
proceeding. Follow the file's `split_strategy` frontmatter.

#### Task 2.2: Portability Check

Run `pnpm portability:check` and verify platform adapter consistency.

**Deterministic Validation**:

```bash
pnpm portability:check
# Expected: exit 0, no adapter parity issues
```

#### Task 2.3: Specialist Review

Invoke `docs-adr-reviewer` on the Practice Core changes to verify
documentation quality and consistency.

**Acceptance Criteria**:

1. No critical findings
2. All findings addressed or justified

---

## Success Criteria

### Phase 0

- User decision recorded (Option A, B, or C)

### Phase 1

- Bootstrap template "Code Patterns" renamed to reflect all learning types
- Consolidation command summary mentions practice exchange
- Coherence audit plan scope corrected
- CHANGELOG updated
- If Option A/B: consolidation protocol expanded with graduation
  criteria, fitness management, and practice exchange

### Phase 2

- Practice fitness check passes
- Portability check passes
- Specialist review addressed

### Overall

- All identified improvements from the Learning Loop Refinement
  sessions are resolved
- The strategic question about consolidation in Practice Core is
  answered and documented
- New repos bootstrapping from the Practice get an accurate and
  complete description of the Knowledge Flow's operational mechanism

---

## Dependencies

**Blocking**: None — this plan can execute independently.

**Related Plans**:

- [learning-loop-refinement.plan.md](../archive/completed/learning-loop-refinement.plan.md)
  — predecessor that produced the improvements being propagated
- [agent-infrastructure-coherence-audit.plan.md](../future/agent-infrastructure-coherence-audit.plan.md)
  — scope correction (I4) is a minor fix to this plan

---

## References

- `.agent/commands/consolidate-docs.md` — the authoritative consolidation
  workflow (already updated)
- `.agent/practice-core/practice-bootstrap.md` — the portable template
  (target of updates)
- `.agent/practice-core/practice.md` §The Knowledge Flow — conceptual
  description of the mechanism
- `.agent/plans/agentic-engineering-enhancements/archive/completed/learning-loop-refinement.plan.md`
  — predecessor plan
- `.agent/memory/napkin.md` — session entries documenting the improvements
