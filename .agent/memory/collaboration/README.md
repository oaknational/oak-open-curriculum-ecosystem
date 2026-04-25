---
fitness_line_target: 80
fitness_line_limit: 125
fitness_char_limit: 6000
fitness_line_length: 100
split_strategy: "Each pattern entry is one file; this README is the index. As the class grows, group by failure mode (gate-coupling, claim-conflict, escalation-pathway) into sub-indexes."
---

# Collaboration Patterns

Lessons-learned about **agent-to-agent collaboration patterns**, distinct
from `.agent/memory/active/patterns/` (code/architecture/process patterns).
This memory class was installed by WS2 of the
[`multi-agent-collaboration-protocol`](../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md)
plan as a sibling to the active-patterns class — same lifecycle (capture in
napkin → distil → graduate to permanent file when the pattern earns it),
different substance (cross-agent coordination patterns, not single-agent
engineering patterns).

## Lifecycle

Per [PDR-011 §The surprise-to-enforcement pipeline](../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md):
capture → distil → graduate → enforce. Collaboration-pattern instances
follow the same path. Capture: napkin entry from a session that observed
the pattern. Distil: cross-session entries refined into `distilled.md`.
Graduate: stable, multi-instance pattern earns a permanent file in this
directory. Enforce: governance via the
[`agent-collaboration.md`](../../directives/agent-collaboration.md) directive
or rule files in `.agent/rules/`.

## Bar for graduation

Same three-part bar as the active-patterns class:

1. **Broadly applicable** across multi-agent contexts (not a one-off
   incident).
2. **Proven by ≥ 2 cross-session instances** with concrete evidence.
3. **Stable** — survived at least one subsequent session without
   contradiction.

Practice-governance substance (review discipline, claim discipline,
sidebar protocol) is PDR-shaped, not pattern-shaped (per PDR-007).
Surface PDR candidates to the consolidate-docs step 7a scan; keep this
directory for instance-shaped collaboration patterns.

## Frontmatter schema

Each pattern file declares:

```yaml
---
pattern_name: <kebab-case>
status: graduated
graduated_at: <YYYY-MM-DD>
graduated_from: <source-surface-or-register-entry>
instances: <count>
related_directive: <path-to-agent-collaboration.md or sibling>
related_rule: <optional path to .agent/rules/ entry>
---
```

## Current entries

- [`parallel-track-pre-commit-gate-coupling.md`](parallel-track-pre-commit-gate-coupling.md)
  — founding pattern (2026-04-25, graduated from the napkin's pending-
  graduations register; founding instances 2026-04-24 and 2026-04-25).

## Cross-references

- [`agent-collaboration.md`](../../directives/agent-collaboration.md) —
  agent-to-agent working model.
- [PDR-011](../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md)
  — capture→distil→graduate→enforce pipeline; `.agent/state/` and
  `.agent/memory/` as sibling classes.
- [`active/patterns/README.md`](../active/patterns/README.md) — sibling
  class for single-agent engineering patterns.
