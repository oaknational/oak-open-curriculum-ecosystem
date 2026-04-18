---
name: "Nothing Unplanned Without a Promotion Trigger"
category: process
status: proven
discovered: 2026-04-18
proven_in: "Observability strategy restructure (commit 2319a614) — fourteen previously-unplanned items each absorbed into a current/ plan (MVP) or a future/ plan with a named, testable promotion trigger"
related_pattern: findings-route-to-lane-or-rejection.md
informs_deeper_pattern: "no-smuggled-drops (pending consolidation — see docs/explorations/2026-04-18-depth-of-generalisation-in-pattern-extraction.md)"
---

# Nothing Unplanned Without a Promotion Trigger

Every unplanned work item identified in scope-spanning analysis must be
absorbed into a plan with lifecycle placement. `current/` (MVP) plans
carry acceptance criteria; `future/` plans carry a **named, testable
promotion trigger** — a concrete event or piece of evidence whose
occurrence would promote the plan to `current/` or `active/`. An item
"parked for later" without a trigger is a smuggled drop at the planning
layer.

This is the planning-layer sibling of `findings-route-to-lane-or-rejection`
(which applies the same principle to reviewer findings). Both say: no
in-between status that lets work disappear into an unnamed backlog.

## Pattern

When a scope-analysis exercise surfaces N un-addressed items, each item
becomes one of:

1. **Actioned now** — already in flight, or absorbed into an existing
   active plan with an acceptance criterion that would cover it.
2. **MVP plan** (`current/` lifecycle) — launch-blocking; has explicit
   scope, acceptance, and dependencies.
3. **Future plan** (`future/` lifecycle) — post-launch; **must carry a
   named, testable promotion trigger** in its frontmatter and body.
4. **Rejected** — with a written rationale naming the principle being
   upheld or the alternative chosen.

A valid promotion trigger:

- **Names the event or evidence**: "when the first LLM-calling MCP tool
  lands"; "after thirty days of baseline traffic data"; "when a
  cross-system debug session surfaces the correlation gap."
- **Is testable by someone other than the current author**: a future
  session can check whether the trigger has fired without re-deriving
  the author's intent.
- **Has an implicit or explicit owner**: product-owner request,
  data-scientist request, an engineer's observed pain point, a specific
  vendor change.

## Anti-Pattern

Parking items with vague language: "future enhancement," "nice to
have," "when time allows," "maybe after launch." These share a property
with "deferred follow-ups" in the sibling pattern: no future session
has a cue to pick them up. The backlog grows; items rot; the scope
analysis that identified them becomes a one-time observation rather
than an ongoing commitment.

Symptoms:

- A `future/` directory with plans whose status lines have not changed
  in six months.
- Plans named by a speculative feature (`maybe-add-x.plan.md`) rather
  than by the problem they solve.
- Plans that list "this should happen someday" without identifying who
  would notice or benefit.
- Plans that cite intuition as the trigger ("when it feels right to
  revisit").

## The Correction

For any item that lacks a trigger, pause and ask:

1. **Is there nothing that would promote it?** If so, it isn't really
   planned — it's a speculation. Consider rejecting it with a written
   rationale rather than parking it.
2. **Is the trigger just unknown?** If so, name the uncertainty — "no
   trigger identified; re-evaluate if problem X recurs" — and track
   the plan under an explicit watch status.
3. **Is the trigger actually known but vague?** Sharpen it until a
   future session can check it without interpretation.

The exercise of naming a trigger frequently surfaces structural gaps:
an item nobody can identify a trigger for is often an item nobody
actually needs.

## Evidence

**Origin session (2026-04-18)**. A comprehensive gap analysis produced
fourteen unplanned observability items. Initial instinct was to list
them as "things worth doing someday." Owner pushed: "By the end of
this exercise nothing on the above list should be unplanned, it should
exist as at least a well defined bullet in a parent plan." The
exercise of absorbing each item into either a MVP `current/` plan or
a `future/` plan with a named trigger surfaced that:

- Three items (real AI telemetry, real feature-flag provider,
  cross-system correlated tracing) had unambiguous triggers tied to
  other concrete work landing — easy.
- Four items (SLO + error budget, cost telemetry, capacity planning,
  deployment-impact bisection) had triggers tied to operational
  maturity events (baseline data collected; cost pressure observed)
  — these were planning-level, not speculation.
- Three items (customer-facing status page, statuspage integration,
  second-backend evaluation) had triggers tied to prior dependencies
  landing — these naturally sequenced.
- Two items (business/product metrics, curriculum-content
  observability) turned out to be MVP, not future — the trigger
  analysis revealed the owner-priority.
- Two items (security observability beyond app layer, synthetic
  monitoring) split: one became MVP scoped narrowly; one's broader
  scope became future with an exploration-led trigger.

Without the trigger discipline, most of these would have been
parked as "maybe later" items and drifted. With it, the shape of
the post-launch roadmap emerged as a structured artefact.

**Related prior instance**. `findings-route-to-lane-or-rejection`
(extracted 2026-04-17) applies the same "no smuggled drops" principle
to reviewer findings. Today's pattern is the planning-layer
generalisation: drops can hide at either the review layer or the
planning layer, and the same structural cure applies at both.

## When to Apply

- After any gap analysis or scope-spanning audit (quarterly reviews;
  new project kick-offs; major reframe sessions).
- When compiling or auditing a `future/` plan directory.
- When the team is tempted to add a "nice to have" section to any
  planning document.
- When a plan's promotion trigger reads as "when it feels right" or
  "someday" — rewrite.

## Related Patterns

- `findings-route-to-lane-or-rejection.md` — the review-layer sibling.
- `end-goals-over-means-goals.md` — triggers are means that serve ends;
  the end should be visible in the trigger phrasing.
- `adr-by-reusability-not-diff-size.md` — similar "what actually
  warrants structure" question for ADR-worthiness.
