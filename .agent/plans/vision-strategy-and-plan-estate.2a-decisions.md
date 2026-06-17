---
title: "Phase 2A — Decision-Ready Options"
type: decision-brief
status: awaiting-owner-ratification
plan: .agent/plans/vision-strategy-and-plan-estate.plan.md
thread: strategy-and-plan-estate-holistic-review
last_updated: 2026-06-17
---

# Phase 2A — Decision-Ready Options

The three owner decisions Phase 2A needs settled before the per-stream value/impact
articulation can be authored. **This document names the decisions and lays out the
options; it does not make them.** The owner ratifies next session. Drafted now
because the controlling plan makes 2A *drafting* beneficial and proceeds-now; only
*ratification* is owner-gated.

Companion to the controlling plan
[`vision-strategy-and-plan-estate.plan.md`](vision-strategy-and-plan-estate.plan.md),
reached through it (not an independent root plan).

## Decision 1 — K1–K3 keystones (the impact definition)

K1–K3 are asserted as "owner-DECIDED (2026-06-15)" across **five** surfaces but
recorded as **agent INPUT, not ratified** on three (`repo-continuity.md`, the
survey §12/§14, the thread record). K1 *is* the impact definition the whole
strategy is organised around, so this is the load-bearing decision.

**The proposal as written:**

- **K1 — what "live" means:** full GA, in the world, with real teachers and
  curriculum leaders using it and demonstrating positive impact. "Live" is an
  *evidence state, not a deploy state* — value-proof is a precondition of GA.
- **K2 — primary audience:** teachers and curriculum leaders (for now); not
  developers, not the open public. Sets the safeguarding bar and the experience.
- **K3 — surface scope:** the MCP app in ChatGPT and Claude, which means the
  entire estate beneath it must be GA-ready (readiness is whole-estate).

**Options, per keystone:** ratify as-is / revise / correct.

**Considerations:**

- **K1 carries a deprecated sub-concept that needs correcting even if ratified.**
  As written, K1 makes value-proof *"and its instrumentation"* a GA precondition.
  Owner §14.2 already superseded the in-repo-instrumentation idea: impact is
  *articulated here and measured by Oak*, not instrumented in-repo. So ratifying K1
  should correct it to: value-proof is a GA precondition, *articulated here and
  measured by Oak, not built in-repo*. (This part is a correction, not a fork.)
- **K1 is the strictest gate in the repo** — it makes *observed positive impact* a
  precondition of calling the product live, committing the strategy to a
  value-proof loop before GA. Owner call: is that bar right for the MCP-app stream,
  and does it apply equally to the other two streams?
- **K2 narrows the audience** to a professional education cohort — this is what
  sets the safeguarding boundary (the pupil, not the adult user) and the experience
  design. Owner call: does "for now" imply a later widening to plan for?
- **K3 makes readiness whole-estate** — the most expansive keystone, and what makes
  the strategy about the whole repo rather than one app. Owner call: is
  GA-readiness genuinely whole-estate, or scoped to the app's real dependency set?

**On ratification:** reconcile the five "decided" surfaces with the three "input"
surfaces to one consistent statement (the §12/§14 + `repo-continuity.md` correction
is the authority; the five plan/report surfaces are updated to the ratified wording).

## Decision 2 — Value-stream taxonomy depth

The three top-level streams are settled (teacher-facing MCP app; ecosystem
engineering tools; the agentic-engineering framework). The open decision is the
**depth** at which the Phase 2B gap analysis runs.

**Options:**

- **(a) Three streams only** — SDK / semantic search / curriculum graph / EEF are
  sub-capabilities *under* the ecosystem stream; the gap analysis runs at
  three-stream granularity.
- **(b) Decompose to capabilities** — treat SDK / search / graph / EEF as streams
  in their own right (~seven); the gap analysis runs per-capability.
- **(c) Hybrid** *(recommended)* — keep the three top-level streams as the vision's
  frame, but decompose the ecosystem stream into its named sub-capabilities *for the
  gap analysis*, so 2B runs at sub-capability granularity without changing the
  three-stream taxonomy.

**Considerations:** the survey flagged SDK / search / graph / EEF as the
sub-capabilities with *no execution spine*. A three-stream gap analysis (a) would
average over them and risk a false "no gaps". (b) and (c) surface the per-capability
gaps; (c) does so while honouring the settled three-stream vision — hence the
recommendation. The choice sets 2B's granularity and blocks nothing by waiting for
ratification.

## Decision 3 — README headline / strapline

The README front matter states three co-equal streams in the body, but the headline
blockquote (`README.md:8`) and strapline (`:6`) still frame the repo around the
ecosystem stream alone.

**Options:**

- **(a) Leave as-is** (ecosystem-framed).
- **(b) Name all three streams** *(recommended)*, e.g.: "This repository turns
  Oak's open curriculum into AI-native infrastructure — for teachers, for the wider
  ecosystem, and for delivering AI-enhanced innovation."
- **(c) An owner-worded variant** in the editorial voice.

**Considerations:** the headline is the most prominent positioning line; leaving it
ecosystem-only contradicts the three-stream vision the body now states. Editorial /
taste call (the `editorial-tone.md` directive applies); low-risk, not blocking.

## What this does NOT decide

The new directory structure and this plan's permanent home (Phase 3) are not here —
they genuinely require the settled strategy first and are correctly gated.
