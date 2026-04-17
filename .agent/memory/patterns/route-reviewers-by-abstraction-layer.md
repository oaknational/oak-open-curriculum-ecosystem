---
name: "Route Reviewers by Abstraction Layer, Not File Scope"
use_this_when: "dispatching specialist reviewers on a finishing pass over a mixed code + docs + ADR lane and choosing which reviewers to invoke"
category: agent
proven_in: ".agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md (hygiene closure finishing pass, 2026-04-17)"
proven_date: 2026-04-17
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Picking reviewers by which files each one reads, producing overlapping findings and leaving semantic layers uncovered"
  stable: true
---

# Route Reviewers by Abstraction Layer, Not File Scope

## Pattern

When dispatching specialist reviewers on a finishing pass, treat
**reviewer scope** as "at what layer of meaning does this reviewer
look" rather than "which files does this reviewer read."

Three reviewers reading the exact same ADR disagree about what the ADR
is *for*:

| Layer | What the reviewer inspects | Example findings |
|---|---|---|
| **Domain semantics** | Is the claim *correct in the vendor / protocol / system's own terms*? | Preflight shape doesn't match the actual invocation path; runbook directs operators to the wrong UI surface. |
| **Docs / ADR mesh** | Do the cross-references, Related sections, and asserted links actually hold? Is the governance home present and discoverable? | A closure claim asserts ADR-143 links to ADR-159 but the link is missing; top-matter Related omits an ADR the Rationale cites. |
| **Code polish** | Tiny mechanical hygiene: stderr vs stdout, style, naming, error-message quality. | `echo` in a fail-fast helper routes to stdout; `require_command` missing an install URL. |

On a finishing pass over a mixed code + docs + ADR diff, book one
reviewer per layer and expect **disjoint** findings. Treat large
overlap as a warning sign that scope was under-specified.

## Anti-pattern

Picking reviewers by file list: "this lane touches ADRs and shell
scripts and one markdown doc, so book docs-adr-reviewer and
code-reviewer." The reviewers over-read the files they recognise,
both flag the same obvious lint-level issues, and neither catches
the domain-semantics class (wrong UI surface, incorrect preflight
shape, claim that is true in prose but false in-tree). A critical
fourth reviewer ends up being dispatched in a second round.

## Resolution

On any finishing pass over a lane that changes code + documentation +
governance surfaces:

1. Identify the **three layers** present in the diff:
   - Domain semantics (vendor / protocol / subsystem correctness)
   - Docs / ADR mesh (cross-reference hygiene, discoverability)
   - Code polish (mechanical / stylistic)
2. Book one specialist per layer in the same delegation batch, not
   sequentially. Overlap in outputs = scope error; escalate and
   re-specify rather than deduplicating after the fact.
3. Name the reviewer's layer in the delegation snapshot, not just
   its specialty. `docs-adr-reviewer` and `sentry-reviewer` can both
   read ADR-159 — the former is routed to the *mesh* layer, the
   latter to the *semantics* layer.

## Evidence

**Session 2026-04-17** — the Sentry CLI hygiene finishing pass
dispatched sentry-reviewer, docs-adr-reviewer, and code-reviewer in
parallel on an updated diff that spanned ADR-159, a runbook, an
operations doc, a shell script, a root README, and a plan file. The
three reviewers returned **almost entirely disjoint** findings at
three distinct layers (listed above). No two reviewers raised the
same issue. One pass resolved all 10 findings; a layer-overlapping
set would have required re-dispatch.
