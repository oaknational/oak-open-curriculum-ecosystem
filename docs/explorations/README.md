# Explorations

**Status**: active

This directory holds design-space explorations — option-weighing documents that
sit between captured observations (`.agent/memory/napkin.md`) and committed
decisions (`docs/architecture/architectural-decisions/`).

## What belongs here

- **Option analyses** that weigh multiple approaches against each other with
  cited evidence (benchmark data, external references, existing code patterns).
- **Research outputs** that inform an upcoming ADR, plan, or capability
  decision without themselves committing to one.
- **Capability matrices** comparing vendors, libraries, or architectural
  approaches.
- **Design-space notes** on problems where the answer is not yet stable but
  the thinking needs to survive the session in which it happened.

## What does NOT belong here

- **Committed decisions with rationale** — those are ADRs. If an exploration
  reaches a conclusion stable enough to commit, graduate the conclusion to an
  ADR and leave this document in place as the evidence trail.
- **Execution instructions** — those are plans (`.agent/plans/**`).
- **Session observations** — those are napkin entries
  (`.agent/memory/napkin.md`) distilled into rules
  (`.agent/memory/distilled.md`) and patterns (`.agent/memory/patterns/`).
- **Reference documentation** — those are READMEs and TSDoc.

## Document shape

Every exploration file:

1. Frontmatter with `title`, `date`, `status` (`active` / `informed-adr-<n>` /
   `informed-plan-<name>` / `superseded-by-<ref>` / `undecided-pending-<trigger>`).
2. Problem statement — what's under exploration and why now.
3. Options considered — each with pros, cons, evidence, and typical failure
   modes.
4. Research questions still open — what we don't yet know.
5. Informs — the ADR, plan, or decision this feeds into (if known yet).
6. References — external sources cited.

Explorations are timestamped at the filename level (`YYYY-MM-DD-<slug>.md`)
so chronological order is preserved without requiring metadata reads.

## Relationship to other documentation tiers

```text
napkin (ephemeral observations)
   ↓ distil
distilled.md (refined rules)
   ↓ graduate (if stable + has natural home)
patterns / ADRs / governance docs / plans
```

Explorations sit alongside this pipeline, not inside it:

```text
question arises
   ↓ research
exploration (option-weighing, evidence-gathering)
   ↓ conclude
ADR (decision) or plan (execution) or "undecided — re-evaluate when X"
```

An exploration may remain `active` indefinitely if the question is not yet
ripe. That is acceptable. What is not acceptable is an exploration that has
reached a conclusion but has not graduated to ADR or plan.

## Current explorations

See timestamped files in this directory.
