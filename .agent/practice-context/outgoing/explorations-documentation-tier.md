# Explorations — A Durable Documentation Tier Between Observation and Decision

**Type**: Structural Innovation (Practice-tier)
**Origin**: oak-open-curriculum-ecosystem (2026-04-18)
**Related Core additions**: `practice.md` Five Audiences; `practice-lineage.md`
Active Principle "explorations sit between observation and decision";
`practice-bootstrap.md` Design-Space Explorations section; PDR-004.

## Summary

Add a durable documentation tier for option-weighing design-space
work: **`docs/explorations/`** (or host equivalent). Explorations are
research-shaped documents that sit sideways in the knowledge flow,
between napkin (ephemeral session observations) and ADR (committed
decisions). They inform ADRs and plans without being refined rules,
and are cited from those ADRs and plans as the evidence trail the
decision rests on.

## Problem

The existing Practice knowledge flow has captured → distilled →
graduated as its main axis. Between captured observation and
committed decision, a class of work had no named home:

- Option-weighing analyses that compare multiple credible approaches
  with evidence.
- Research outputs that gather external references, benchmark data,
  and capability matrices.
- Capability explorations ("how far does vendor X take us before we
  hit a gap?") that don't yet commit to a decision.

Practically, such analyses lived in session chat or in plan prose,
and the reasoning trail evaporated when the session ended or the
plan archived. A future decision would cite the ADR that resulted
but lose the evidence that shaped it. Plans would sometimes carry
load-bearing reasoning in prose that belonged in a sibling artefact,
making plans heavier than they should have been and the reasoning
harder to cite.

## Key Moves

### 1. Create the tier as a named top-level documentation directory

Host-repo convention: `docs/explorations/` at the top of the
documentation tree, with a README defining the shape. Alternative
locations are valid provided the tier is named explicitly in the
host repo's practice-index.

### 2. Timestamped filenames, explicit status

Files are named `YYYY-MM-DD-<kebab-slug>.md`. The date prefix
preserves chronological order. Required frontmatter:

```yaml
---
title: {Title}
date: YYYY-MM-DD
status: active              # or informed-adr-<N> / informed-plan-<name> /
                            # superseded-by-<ref> / undecided-pending-<trigger>
---
```

Status values name the exploration's relationship to downstream
decisions. `active` is acceptable as a terminal state if the
question is genuinely not yet ripe.

### 3. Stable document shape

Every exploration carries:

1. Frontmatter as above.
2. Problem statement — what's under exploration and why now.
3. Options considered — each with pros, cons, evidence, failure modes.
4. Research questions still open — what we don't yet know.
5. Informs — the ADR / plan / decision this feeds into if known.
6. References — external sources cited.

### 4. Cite from ADRs and plans, don't substitute

An ADR or plan that benefits from exploration reasoning cites the
exploration file by path. The exploration file remains as the
evidence trail. This keeps:

- ADRs compact (decision and rationale only; evidence trail by reference).
- Plans execution-shaped (no load-bearing research buried in prose).
- Reasoning searchable and portable (one canonical source per option-analysis).

### 5. Graduation discipline

An exploration that reaches a conclusion should graduate that
conclusion to an ADR or plan, leaving the exploration file in place
as the evidence trail. Explorations that remain `active`
indefinitely are acceptable only if the question is genuinely not
yet ripe — "I haven't got around to it" is not a valid reason.

## What This Unlocks

- **Reasoning trails survive the session.** Option-weighing that
  would have been lost to chat is preserved with structure, dates,
  and status.
- **ADRs stay light.** The decision record commits to a stance; the
  supporting analysis lives in the cited exploration.
- **Plans stay execution-shaped.** Design rationale doesn't leak
  into plan prose.
- **Durable research outputs.** Benchmark data, capability
  matrices, vendor comparisons, and cross-cutting analyses now have
  a canonical home that external reviewers can cite.
- **Structural gap-surfacing.** When an exploration is required but
  cannot be written, the author surfaces the real bottleneck:
  missing evidence, unscoped question, wrong level of abstraction.

## Evidence

**Origin session (2026-04-18)**. A large session reframing a
single-branch telemetry expansion into a project-wide five-axis
observability principle produced substantial option-weighing work —
capability matrices, vendor-comparison analyses, first-class vs
transitional API decisions, accessibility-observability feasibility
questions. The session author noticed the reasoning trail was about
to be lost to chat history. The owner proposed an explorations home;
the author created `docs/explorations/` with a README defining the
shape; the reframe rationale became the inaugural entry. The tier
was validated end-to-end in the same session that surfaced the need.

The session also produced two companion deliverables whose existence
depends on the explorations tier:

- A five-phase restructure plan that cites the session's exploration
  for its rationale rather than carrying the rationale in its own
  body.
- An ADR-162 (Observability-First) scheduled for drafting that will
  cite multiple explorations as its evidence trail.

Without the explorations tier, the session's reasoning would have
lived in plan prose (overloading the plan) or in the ADR (overloading
the decision record) or nowhere durable at all.

## Adoption

For receiving repos:

1. Create `docs/explorations/` (or equivalent) with a README defining
   the shape above.
2. Update `practice-index.md` to point at the explorations home.
3. Next time option-weighing work surfaces, write an exploration
   rather than burying the analysis in a plan or chat.
4. When the exploration informs an ADR or plan, set its status
   accordingly and ensure the ADR/plan cites it.

Cost: one new directory, one README, one small discipline change.
Benefit: the reasoning trail that shapes your repo's architecture
now has a home and survives beyond the session it emerged in.

## Practice Core integration

The explorations tier was graduated to Practice Core doctrine in the
originating session. Receiving repos inherit the tier's concept via
the Core updates; this outgoing note provides the discovery surface
and the adoption checklist. See PDR-004 for the governance-layer
decision and its graduation intent.
