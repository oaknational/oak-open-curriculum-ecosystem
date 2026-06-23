---
title: "Epistemic-status & attractor-state — carry-over from closed PR #128"
status: research
last_reviewed: 2026-06-23
supersedes_pr: 128
related_adr: "../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md"
related_report: "../../reports/pr-128-formal-substrate-analysis-2026-06-23.md"
---

# Epistemic-status & attractor-state — carry-over from closed PR #128

## Why this exists

PR #128 ("formal substrate for agentic recurrence") was closed as overtaken by
ADR-200 (see the [disposition report](../../reports/pr-128-formal-substrate-analysis-2026-06-23.md)).
Closing it should not lose the two or three genuine kernels it surfaced. This
note records them as **candidate inputs**, each gated — not as a new
`.agent/formal-substrate/` layer (which 5/6 duplicated existing surfaces and
structurally risked a rival source of truth).

This is research / candidate input, not a decision. Owner ratification routes
through ADR-200's process and Practice Core for PDR-016.

## Kernel 1 — explicit epistemic-status vocabulary

**The real gap**: a claim's epistemic status is currently *implicit* in which
surface it lives on (a rule vs a pattern vs `distilled.md` vs an ADR `status:`),
rather than carried explicitly. A small controlled vocabulary —
observation / hypothesis / supported / validated / doctrine / deprecated /
owner-direction / generated-inference / derived-view — would let agents
classify durable statements without inventing a private vocabulary.

**Where it belongs**: a facet of ADR-200's idea-node `class`/`status`, or a
small PDR amending memory frontmatter conventions — **not** a standalone file.

**Gate**: only adopt once ADR-200's node-status facet is being defined, so the
vocabulary is discovered/aligned with the schema rather than authored beside it
(ADR-200 §135-136, §217: vocabularies are discovered from the corpus, not
authored a priori).

## Kernel 2 — evidence envelope on load-bearing claims

**The instinct**: high-impact, reusable claims should carry
`evidence` / `counterevidence` / `depends_on` / `last_reviewed` so they do not
detach from their grounding across sessions.

**Where it belongs**: inside the ADR-200 idea-node schema (and PDR-016
claim-propagation governance), where a validator can enforce it — not a freeform
`claims/` directory with no verifier.

**Gate**: fold into the idea-node schema work; do not stand up a parallel
claim-record store.

## Kernel 3 — compact attractor-state orientation doc

**The idea**: a short, stable "why the system is the way it is" summary,
distinct from `AGENT.md` (procedure) and `orientation.md` (layer routing), to
help a freshly-instantiated agent recover the repo's reasoning posture.

**The cost to clear first**: a new always-relevant read competes with the
`directive-file-context-budget` and the ~80k reliably-loaded budget the repo
actively defends. This is the proposal's own unmet promotion gate.

**Gate**: a separate proposal that must *demonstrate* it lowers grounding cost
(onboarding before/after) before it becomes any kind of required read. One file
in an existing layer if promoted — never a new tree.

## Explicitly dropped

- The `.agent/formal-substrate/` tree as a structure (rival-source-of-truth
  risk; 5/6 duplication).
- The hand-authored 10-edge reasoning-graph vocabulary (conflicts with ADR-200's
  discover-from-corpus method).
- The "formal/mathematical" branding (over-claims rigour the artefacts lack).
- The vocabulary translation doc as a permanent artefact (one-time hygiene).
- The five speculative "formal reviewers" (ceremony without demonstrated need).
