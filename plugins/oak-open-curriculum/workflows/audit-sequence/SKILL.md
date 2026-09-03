---
name: audit-sequence
description: Check a draft plan against Oak's thread-graph of coherently sequenced units and the prior knowledge statements each unit records. Use when asked to audit, sanity-check, or sequence-check a long-term plan, scheme of work, or unit order.
argument-hint: <paste or reference the plan to audit>
---

Audit this sequence: $ARGUMENTS

Delegate to the **sequencing-auditor** agent.

The agent must:

1. Read the draft sequence into an ordered list of units.
2. Resolve each unit to its Oak slug first (`search` scoped to units, or `browse-curriculum`) — the tools take corpus keys, not the plan's wording — then retrieve the prior knowledge each unit states it assumes, and the year Oak teaches it, from `get-prior-knowledge-graph`.
3. Report two kinds of finding, kept apart: **ordering breaks against Oak's threads** (a unit placed before one Oak teaches in an earlier year — data), and **assumed knowledge the plan may not have taught yet** (a stated requirement with no earlier unit that plausibly covers it — the agent's judgement).
4. Report findings as a short table in plan order: unit, finding, whether it is data or judgement, suggested fix.

This is a structural check, not a stylistic one. Oak's statements name knowledge, not the units that teach it — so say plainly which findings are read off the data and which are your reading of it.
