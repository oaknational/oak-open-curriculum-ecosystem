---
name: "Plan-as-Artefact Gravity; Archive and Replace When the Plan Body Becomes a Self-Referential Document"
use_this_when: "A remediation plan has accumulated multiple session-history sections, re-grounding tables, and re-classification amendments while the gates it targets remain red"
category: process
proven_in: ".agent/plans/architecture-and-infrastructure/archive/superseded/pr-87-architectural-cleanup.plan.md → pr-87-codeql-alerts.plan.md (2026-04-28)"
proven_date: 2026-04-28
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Plans accumulate session-history prose and re-grounding tables faster than they close gates; the plan body becomes an artefact that requires curation, not an execution document that drives work"
  stable: true
---

# Plan-as-Artefact Gravity

## Problem

A remediation plan is intended as an *execution document*: it
describes what to do next, tracks progress, and closes gates. Over
multiple sessions, certain plan shapes accumulate weight that turns
them into *self-referential artefacts* instead. Symptoms:

- **Inline session-history prose**: "Session 1 / Session 2 /
  Session 2.0.5" sections accumulating in the plan body.
- **Verification tables of stale assertions**: rows that were true
  at some prior session but are now drifted.
- **Re-classification amendments**: footnotes correcting earlier
  scope or category claims.
- **Mixed signal classes**: e.g. CodeQL + Sonar + duplications +
  micro-clusters all in one 12-phase plan, each requiring a
  different mental model.
- **Per-session re-grounding cost exceeding per-session closure
  rate**: each session spends more time understanding the plan than
  closing rows in it.

When these symptoms appear, the plan body has become an artefact
that requires curation rather than an execution document that
drives work. Continuing to add prose to it makes the artefact
worse, not closer to closure.

## Pattern

Archive the plan body, port the load-bearing evidence files (not
the prose), and write a one-page replacement scoped to a single
signal class:

1. **Archive, don't delete.** Move the old plan to
   `archive/superseded/<plan-name>.superseded-by-<new-name>.md` so
   the audit trail remains.
2. **Port evidence, not prose.** Carry across security reviews,
   sink-trace findings, owner-approved dismissal evidence, and
   any other artefact that justifies a row's disposition. Do not
   carry across session-history prose, re-grounding tables, or
   re-classification amendments.
3. **Scope the replacement to a single signal class.** One signal
   class per plan: CodeQL alerts, or Sonar issues, or
   duplications, or micro-clusters — never all four. Each signal
   class has different generators, different cures, and different
   review surfaces.
4. **One row per finding, structural cure per row.** Each finding
   gets one row with one cure (or one owner-authorised dismissal
   with evidence). No inline history, no narrative — the row
   itself is the execution unit.
5. **Add a replacement marker on the archived plan.** A short
   comment in the archived plan's frontmatter or top section
   stating "Superseded by `<new-plan-path>` on `<date>` because
   …" closes the loop for future readers.

## Worked Example

**`pr-87-architectural-cleanup.plan.md` → `pr-87-codeql-alerts.plan.md`
2026-04-28**: the original plan had grown a 12-phase structure
spanning CodeQL alerts, Sonar issues, code duplications, and
micro-clusters of doc-issue-by-issue cleanup. By the third session,
the plan body included three "Session N grounding" prose blocks,
two re-classification amendment tables (rows that had been
re-categorised since the plan was authored), and per-session
verification statements that were stale. Per-session re-grounding
cost was exceeding per-session closure rate.

The cure was: archive the plan as `pr-87-architectural-cleanup.plan.superseded-by-codeql-alerts.md`,
port the security review evidence and the sink-trace findings as
referenced files (not as inline prose), and write a new
single-page `pr-87-codeql-alerts.plan.md` scoped to the CodeQL
signal class only — one row per CodeQL alert, one cure per row,
no inline history. The Sonar / duplications / micro-cluster work
got their own scoped plans authored in the same pass when they
became the active signal class.

## When This Pattern Does Not Apply

- A plan that is genuinely advancing (rows closing at a rate that
  outpaces prose accumulation).
- A plan in a single signal class whose body has stayed lean
  across multiple sessions.
- A plan whose session-history *is* the load-bearing artefact
  (rare; usually a doctrinal arc that should be in an ADR/PDR
  instead).

## Related

- Source insight: `distilled.md § Process` "Plan-as-artefact gravity".
- Companion to [`current-plan-promotion`](current-plan-promotion.md)
  (active vs archive lifecycle) and to PDR-018 § Disposition drift
  at phase boundaries.
