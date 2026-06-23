---
title: 'DORA 2025 (State of AI-assisted Software Development) ↔ the Practice — convergence and, more usefully, divergence'
type: research
status: comparison
last_updated: 2026-06-21
derives_from:
  - The DORA 2025 State of AI-assisted Software Development report (Google Cloud)
  - The DORA ROI of AI-assisted Software Development report (2026)
related:
  - ../plans/product-development-governance/future/repo-intent-graph.plan.md
  - ../plans/product-development-governance/plan-node-schema.v0.md
  - ../directives/metacognition.md
---

# DORA 2025 ↔ the Practice

> **Input-to-verify.** DORA's reports are external research (and Google Cloud
> artefacts). Convergence raises confidence in a direction; it never confers
> authority. The Practice was arrived at **independently** of these reports — so
> the convergences are corroboration, and the **divergences are the interesting
> part**: they are either the Practice's distinctive contribution beyond the
> research, or genuine gaps the research names that the Practice has not yet closed.

## 1. The convergence (briefly — established elsewhere)

The report's central frame — *AI is an amplifier; value comes from the
surrounding system, not the tools* — and its constructs (the seven AI capabilities;
"Continuous AI" as a living pipeline participant; "AI-native collaboration models"
of agentic workflows and swarming; platform-as-product; VSM) map closely onto the
Practice and the intent-graph design. Detail and the metric consequences live in
[`repo-intent-graph.plan.md` §Delivery-performance metrics](../plans/product-development-governance/future/repo-intent-graph.plan.md).
This doc does not re-argue the match.

## 2. The divergences (the point)

### Practice *ahead* of the report

- **Doctrine-graduation pipeline.** The report's "Continuous AI" *perceives events
  and is constantly measured*; it does not describe a mechanism that turns learning
  into **enforced constraint**. The Practice does: capture → distil → graduate →
  *enforce* (PDR-014 / PDR-046), where a recurring lesson becomes a rule a gate
  checks. The Practice does not just measure the system — it **compounds doctrine**
  across sessions. This is the Practice's sharpest contribution beyond the report.

- **Value-contingent collaboration (anti-ceremony).** The report leans toward "more
  collaboration capability" and frames swarming as "still early." The Practice has
  the opposite-direction refinement built in: collaboration ceremony must earn its
  keep against a *consumer test* (drop heartbeats/events when no consumer observes
  them; the n=2 mode). It also already operates far more collision-safety and
  identity machinery (name+UUID identity, claims registry, commit-warden singleton,
  mid-cycle handoff records, coordinator two-moments) than the report's nascent
  swarming description. The Practice is **ahead on collaboration protocol** and has
  learned that the protocol is costly.

- **Skepticism by doctrine.** The report finds ~30% of developers report little/no
  trust in AI output and flags "critical validation skills" as a need. The Practice
  *institutionalizes* this: verify-don't-trust, validators-must-recompute,
  first-hand-means-me, and a standing reviewer apparatus treat AI output as
  input-to-verify **by default**. The Practice sits at the skeptical end of the
  report's trust spectrum, on purpose.

- **Learning reframed to substrate-level.** The report's skill-development concern
  (AI erodes human apprenticeship; juniors lose hands-on reps) assumes the learner
  is an individual human. In the Practice the "juniors" are ephemeral agent
  sessions; the *system* learns via the doctrine pipeline rather than any one agent
  accruing skill. This sidesteps the apprenticeship-erosion failure mode by moving
  learning from the individual to the substrate — a genuinely different answer to
  the report's open worry.

### Topology difference (not better or worse — different)

- **Human-teams-plus-AI vs one-owner-plus-agent-fleet.** The report's unit is a
  human team augmented by AI; its "team performance" construct measures human
  collaborative strength. The Practice's unit is **one human owner orchestrating a
  fleet of AI agents**. So when DORA's "team performance" is mapped to the Practice
  it is a *reinterpretation* (agent-to-agent coordination), not a like-for-like
  match — and DORA's empirically-validated bands for team performance do not
  transfer. This is the same reason the Practice-altitude DORA metrics borrow the
  metric *shape*, not the calibrated thresholds. **This divergence is transitional:**
  the repo is moving from one-developer-many-agents to many checkouts with one or two
  developers at varying times and variable agent density. As it does, the topology
  converges on DORA's assumption (a human team plus AI), so the *team-performance*
  construct becomes **directly** applicable rather than a reinterpretation — and the
  author-agnostic, returning-evidence intent graph is the substrate that lets delivery
  be measured coherently across that fluid cast.

### Genuine gaps the report names that the Practice has not closed

- **No continuous accuracy / usefulness / *cost* instrumentation.** The report's
  "Continuous AI" is "constantly measured for accuracy, usefulness, **and cost**."
  The Practice *asserts* value-contingency and seat-cost awareness, but the
  measurement is reviewer- and reflection-based, not continuous telemetry on agent
  output. The Practice has no objective, ongoing signal of whether an agent's work
  is accurate / useful / worth its cost. **This is precisely the gap the
  DORA-metrics-derivation work closes** — and the report's METR finding (developers
  believed they were 20% faster while being 19% slower) is the reason self-report
  cannot substitute for it. The Practice needs the *objective* delivery metrics
  exactly because perception is unreliable.

- **User-centric focus is the weakest-mapped capability — and it is the report's
  make-or-break.** DORA finds user-centric focus is the strongest moderator of AI's
  effect on *team performance*, and that *without* it AI adoption can **harm** team
  performance. The Practice's intent graph is strong on the internal capabilities
  (data ecosystem, platform, version control, small batches) but an internal
  engineering substrate is structurally **distant from the end user** (the teacher).
  The Practice instruments intent → strategic-choice (a traceability link), not
  intent → user-feedback (a live loop). This is the honest counter to the flattering
  "seven-for-seven" reading: six map well; user-centric focus is a link, not a loop,
  and it is the one the report says matters most for teams. Closing it is not an
  in-repo metric — it is the Oak-grounded impact layer (measures.md K1) — but the
  *gap between the in-repo proxy and real user value* is a thing to watch, not paper
  over.

- **VSM is encoded, but truncated.** The Practice can make value-stream management
  *executable* — the value stream as a queryable typed graph rather than a periodic
  whiteboard workshop (an advance on the report). But the report's VSM spans the
  *full* idea → customer flow, and the intent graph currently models intent →
  plan → work → commit → deploy and **stops at delivery**. The discovery /
  origination end and the customer-feedback end are external (Oak). The Practice's
  value stream is complete on the build side, truncated on the discovery and
  feedback sides — consistent with the measures.md split (delivery in-repo; impact
  Oak-grounded), but worth naming as a deliberate boundary, not an oversight.

## 3. What this prompts (now designed for)

Both gaps turned out to be the **same structural move** — wiring evidence back into the intent
graph — now captured in
[`repo-intent-graph.plan.md` §Closing the loop](../plans/product-development-governance/future/repo-intent-graph.plan.md):

- The **cost/usefulness/accuracy gap** closes uniformly: output accuracy (gate-failure + rework
  trend), cost-per-delivered-value (token/seat telemetry via `realized_by`), and the DORA five are
  all Pillar-1 projections over the graph plus `evidence` edges — no separate metrics stack. (The
  METR finding is why self-report cannot substitute for these.)
- The **user-centric gap** gains a structural cure: the `validated_by` returning edge turns
  user-centricity from a *link* into a *loop* (user-value evidence returns onto the strategic
  choice; a validator flags choices with delivered output but no returned evidence). The *loop
  structure* is the cure; the *user-value-hypothesis content* remains an owner-level strategy call.
- The **topology divergence** is dissolved by the multi-developer transition (see §2): as the repo
  moves to many checkouts with a fluid developer/agent cast, DORA's team-performance construct
  becomes directly applicable, and the author-agnostic graph is what measures delivery across it.
- The **structure is necessary but inert.** Turning it into an effective system requires an
  **evidence-ingestion layer**: connectors drawing directly from the sources
  (Vercel / Sentry / Sonar / GitHub / PostHog), triggers, agentic analysis, and validated
  write-back. The report's "Continuous AI" (perceives events, *constantly measured*) **presupposes**
  exactly this machinery; the Practice has now named it as the required actuation layer (the *how*
  is TBD). PostHog is the concrete source for the user-value loop's signal. See the
  repo-intent-graph plan, "From structure to system — the evidence-ingestion requirement".
- The convergences remain corroboration of direction, not proof. The divergences — especially the
  gaps, now designed-for — were the more valuable output of the comparison.
