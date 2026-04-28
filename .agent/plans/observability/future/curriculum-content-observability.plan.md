---
name: "Curriculum Content Observability"
status: strategic-brief
overview: >
  Strategic brief for joining observability events to curriculum metadata so
  data scientists can analyse usage by subject, key-stage, keyword, year
  group, thread, and lesson. MVP observability-events workspace captures
  categorical axes; this plan extends to richer curriculum-metadata joins
  when a specific data-science request surfaces.
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
promotion_trigger: "First data-science request that requires curriculum-metadata joins (subject/key-stage/keyword/year-group correlations beyond what MVP categorical axes support)."
---

# Curriculum Content Observability

**Status**: 🔵 Strategic (not yet executable)
**Last Updated**: 2026-04-18
**Promotion trigger**: first data-science request requiring curriculum-metadata joins beyond MVP categorical axes.

---

## Problem and Intent

The MVP events workspace (per
[`observability-events-workspace.plan.md`](../current/observability-strategy-restructure.plan.md))
captures categorical axes on `tool_invoked` and `search_query` —
subject, key-stage, keyword — sufficient for first-order data-science
questions like "what subjects are most queried." Deeper questions
("which thread progressions correlate with teacher feedback outcomes")
require joining events to curriculum metadata that is not today in
the event payload.

The intent: open this plan when a specific data-science request
demands that join.

## Domain Boundaries and Non-Goals

**In scope**:

- Extending event schemas with curriculum-identity fields
  (thread_id, unit_id, lesson_id where applicable).
- Analytics-side join contract with the data-science pipeline.
- Documentation of join keys in the event-catalog.
- Handling schema migration for downstream consumers.

**Out of scope (non-goals)**:

- Pre-computing any derived metrics — data-science owns this.
- Curriculum content design — different domain entirely.

## Dependencies and Sequencing

**Prerequisite**: a named data-science request — from owner or
analytics team — with a specific correlation question the MVP axes
cannot answer.

**Related**:

- `observability-events-workspace.plan.md` — extends the MVP schema
  set.
- `docs/explorations/2026-04-18-structured-event-schemas-for-curriculum-analytics.md`
  (exploration 4) — may foreshadow this plan's scope depending on how
  the data-scientist input lands.

## Success Signals

- Named data-science question answered end-to-end from telemetry.
- Schema migration for join fields is non-breaking (additive).
- Analytics pipeline validates the join at ingest.

## Risks and Unknowns

- **Scope creep from "one question" to "every question".** Mitigation:
  promotion scope is **that specific question**; further questions
  get separate plan promotions.
- **Join keys may not exist stably for all curriculum artefacts.**
  Mitigation: audit curriculum SDK for stable identifier surfaces
  before schema additions.
- **Privacy considerations.** Mitigation: ADR-160 redaction barrier
  applies; join keys are categorical curriculum identifiers, not
  user or pupil identifiers.

## Promotion Trigger

**Testable event**: a data-science or analytics request lands
(Slack message, issue, owner email) that names a correlation question
unanswerable with the current MVP schema set and names the specific
missing join key(s).

**When triggered**: move to `current/`. The first promotion handles
that specific question and its specific join keys; further curriculum-
axes additions open new plan cycles.

## Implementation Sketch (for context, finalised at promotion)

- Events workspace adds optional fields (thread_id, unit_id,
  lesson_id, year_group).
- Emission sites populate fields where available; omit where
  inapplicable (schema accepts optionality).
- Event catalog documents new fields + their curriculum-SDK source.

## References

- ADR-162 §Five Axes Product.
- Session report §2.3 gap item 14.
- `observability-events-workspace.plan.md`.
- Exploration 4 (structured event schemas for curriculum analytics).
