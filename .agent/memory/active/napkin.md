---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at
[`napkin-2026-05-07-doctor-safe-merge.md`][archive-pass]. The prior
rotation is
[`napkin-2026-05-06-evening-graduation-pass.md`][previous-pass].

[archive-pass]: archive/napkin-2026-05-07-doctor-safe-merge.md
[previous-pass]: archive/napkin-2026-05-06-evening-graduation-pass.md

## 2026-05-07 — Doctor safe-merge consolidation / codex / GPT-5 / `019e03`

### Rotation Summary — memory/state doctor safe-merge arc

This consolidation rotated the active napkin after it crossed the critical
fitness threshold. The outgoing napkin is preserved verbatim in
[`napkin-2026-05-07-doctor-safe-merge.md`][archive-pass].

Distilled behaviour changes from the rotation:

+ focused validation lanes must prove they selected tests;
+ fixture-slice branches need literal fixtures;
+ generated read models must be refreshed after event writes;
+ portability review must include examples and narrative, not only normative
  prose;
+ git index operations are serial commit-window work, not parallel work;
+ deleted live state is gone and should not remain a continuity topic.

The memory/state substrate doctrine and merge semantics are already durable in
PDR-049, PDR-050, the local substrate contract, and the archived doctor plan.
The consolidation therefore did not create a new ADR or PDR. Future arcs remain
repair mode and consolidation integration, each requiring its own plan.
