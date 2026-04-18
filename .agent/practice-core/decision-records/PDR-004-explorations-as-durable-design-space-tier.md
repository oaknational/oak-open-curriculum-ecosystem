# PDR-004: Explorations as Durable Design-Space Tier

**Status**: Accepted
**Date**: 2026-04-18
**Related**: [PDR-001](PDR-001-location-of-practice-decision-records.md)
(for the directory convention this decision sits inside).

## Context

The Practice has a well-established knowledge-flow pipeline: napkin
captures ephemeral session observations; `distilled.md` refines them into
rules; permanent documents (ADRs, governance docs, READMEs, TSDoc)
graduate the settled content; rules and always-applied directives
enforce it.

Between observation and decision, a class of work existed with no home.
Option-weighing analyses — "should we dual-export to a second telemetry
backend?"; "which of these three event-schema shapes actually serves
the downstream analytics?"; "how far does vendor X take us before we
hit a gap?" — required more durability than a napkin entry and more
specificity than a chat transcript, but were not ready to commit to an
ADR-level decision.

The practical failure mode: such analyses lived in session chat or in
plan prose, and the reasoning trail evaporated when the session ended
or the plan archived. A future decision would cite the ADR that
ultimately resulted but lose the evidence trail that shaped it. Plans
would sometimes carry load-bearing reasoning in prose that belonged in
a sibling artefact, making the plan heavier than it should have been
and making the reasoning harder to cite.

The receiving session in 2026-04-18 (host repo
`oak-open-curriculum-ecosystem`) surfaced this gap explicitly while
reframing a single-branch Sentry observability expansion into a
project-wide five-axis observability principle. The reframe produced
substantial option-weighing (Sentry-as-PaaS-exploration-thesis,
PostHog-vs-Sentry capability matrix, accessibility observability at
runtime, event schema shape for curriculum analytics) that would
inform multiple ADRs but itself did not commit to them. A new tier
was introduced: `docs/explorations/`. The receiving session's own
rationale became the inaugural entry.

## Decision

**Explorations are a durable design-space tier in the Practice's
knowledge flow, sitting sideways between napkin and ADR.**

An exploration is:

- **Durable** (survives the session it emerged in, unlike napkin entries).
- **Option-weighing** (compares multiple approaches with evidence,
  unlike refined rules which state the adopted stance).
- **Research-shaped** (gathers evidence, cites external sources, names
  open questions).
- **Cited by decisions rather than substituting for them** (an ADR or
  plan references the exploration as its evidence trail).
- **Allowed to remain unresolved** (status `active` or
  `undecided-pending-<trigger>` is a valid terminal state for an
  exploration).

An exploration is **not**:

- A refined rule (that's `distilled.md` / patterns).
- A committed decision (that's an ADR).
- Execution instruction (that's a plan).
- Session-internal observation (that's the napkin).

### Home convention

Host-repo convention: **`docs/explorations/`** at the top of the
documentation tree, with a README defining the shape. Alternative
locations are valid provided the tier is named explicitly in the host
repo's `practice-index.md`.

### Filename and frontmatter

Files are timestamped: `YYYY-MM-DD-<kebab-slug>.md`. The date prefix
preserves chronological order without requiring metadata reads.

Required frontmatter:

```yaml
---
title: {Title}
date: YYYY-MM-DD
status: active              # or informed-adr-<N> / informed-plan-<name> /
                            # superseded-by-<ref> / undecided-pending-<trigger>
---
```

### Document shape

Every exploration carries:

1. Frontmatter as above.
2. Problem statement — what's under exploration and why now.
3. Options considered — each with pros, cons, evidence, failure modes.
4. Research questions still open — what we don't yet know.
5. Informs — the ADR / plan / decision this feeds into if known.
6. References — external sources cited.

### Relationship to the knowledge flow

```text
work → napkin → distilled → permanent docs → rules
          ↓                       ↑
          └── explorations ───────┘
```

Napkin captures observations; explorations weigh options; ADRs commit
decisions; plans execute. The exploration survives as the evidence
trail the ADR or plan cites; it does not substitute for either.

### Graduation intent

Per the PDR layer's general intent (PDR-001), this decision is
provisional in the sense that stable exploration concepts should
integrate into the Core plasmid trinity as refinements over time.
Concretely:

- `practice.md` now names the Five Audiences (with Explore as the
  fifth) and includes `docs/explorations/` in the Artefact Map and
  Artefact Locations.
- `practice-lineage.md` records **explorations sit between observation
  and decision** as an Active Principle.
- `practice-bootstrap.md` carries the document shape and frontmatter
  as a portable template.

Once the tier has been validated across 2+ receiving repos without
correction, the PDR-shaped governance may be unwound — the substance
will live in the trinity and this PDR becomes historical.

## Rationale

Four reasons to name this as a Core tier rather than leaving it as
a host-repo convention.

1. **The failure mode is universal.** Every repo with a Practice will
   at some point face a decision with multiple credible options and
   insufficient evidence to commit. Without a named home, the
   reasoning trail evaporates. This isn't a host-specific need.

2. **The shape is portable.** Unlike host-specific artefacts
   (curriculum-data schemas, MCP tool registrations, Oak-specific
   plans), the document shape of an exploration — problem, options,
   research questions, informs, references — transfers unchanged
   across repos.

3. **It fills a real gap, not an imagined one.** The gap was observed
   empirically: a session's option-weighing work was about to be lost
   to chat history, and the owner surfaced the missing tier as a
   concrete observation. The innovation came from actual friction,
   not aesthetic refinement.

4. **It strengthens the existing knowledge flow.** Without
   explorations, the flow is `napkin → distilled → ADR`, and ADRs
   have to either carry the evidence trail themselves (making them
   heavy) or omit it (losing the reasoning). Explorations absorb that
   load correctly.

## Consequences

**Required**:

- Host repos adopting the explorations tier SHOULD place the home at
  `docs/explorations/` for consistency. Alternative locations require
  explicit cross-reference in `practice-index.md`.
- Every exploration file MUST carry the required frontmatter.
- An exploration that has reached a conclusion SHOULD graduate its
  conclusion to an ADR or plan, leaving the exploration file in place
  as the evidence trail. Explorations that remain `active` indefinitely
  are acceptable only if the question is genuinely not yet ripe.

**Forbidden**:

- Explorations MUST NOT substitute for ADRs. A decision committed to
  in an exploration without graduating to an ADR is a decision
  without a citation surface.
- Explorations MUST NOT be compressed into plan prose for "simplicity."
  Plan prose carries load-bearing reasoning that belongs in a sibling
  artefact loses portability and citability.

**Accepted cost**:

- One more tier in the documentation hierarchy. The cost is justified
  by the knowledge-flow correctness: previously, option-weighing work
  either burdened plans, overloaded ADRs, or disappeared.

## Notes

### Relationship to `.agent/research/` (if present in a host)

Some host repos may already have `.agent/research/` for research
artefacts. The distinction: `.agent/research/` is typically
agent-facing and session-ephemeral (pre-decision exploration that
may get consumed during consolidation); `docs/explorations/` is
human-and-agent facing and durable. If a host has only one of the
two and the semantics align, using the existing location is
acceptable — name the choice in `practice-index.md`.

### Host-local context (this repo only, not part of the decision)

In the repo where this PDR was authored (`oak-open-curriculum-ecosystem`),
the explorations directory is `docs/explorations/` with its own README,
and the inaugural entry is
`docs/explorations/2026-04-18-observability-strategy-and-restructure.md`.
The directory was created in the same session that surfaced the need
for the tier, validating the approach end-to-end.
