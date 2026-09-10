---
name: find-misconceptions
description: Surface the known pupil misconceptions for a topic, each paired with how the error shows up and how to respond.
argument-hint: <topic> <year or key stage>
---

Find misconceptions for: $ARGUMENTS

Delegate to the **misconception-miner** agent.

The agent must:

1. Resolve the topic to lesson, unit, or thread slugs first (`search` or the browse tools), then pull the misconception set with `get-misconception-graph` anchored by those slugs — it takes corpus slugs, not free text.
2. Corroborate with the authored distractors in related lessons' quizzes, drawn from `get-lessons-quiz` (authored content, not pupil-response telemetry).
3. For each misconception, return: the error in pupil terms, where it typically surfaces in the sequence, and a concrete teacher response.
4. Present in the order returned, within each ordered axis. With a unit anchor, `get-misconception-graph` returns that unit's lessons in Oak's authored teaching order; with a thread anchor, it returns the thread's units in Oak's curriculum order, one run per subject. Present those as returned, grouped by unit — no `get-units-summary` call and no re-sort — and keep a multi-subject thread's runs separate, because the join between subjects carries no order. Order ACROSS several `lessonSlugs` or `unitSlugs` anchors is your input order, not Oak's; anchor by unit or thread when the sequence matters. At KS4 a unit node merges every board and tier, so within a year the order is a bias towards each unit's earliest placement, not any one board's. Do not rank by severity, frequency, or how much later learning depends on the error — the corpus evidences none of these.

Stay grounded in the graph. Do not generalise from intuition about what pupils "probably" get wrong.
