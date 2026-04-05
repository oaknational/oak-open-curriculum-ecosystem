---
name: "Cross-Session Pattern Emergence"
use_this_when: "Running consolidation after multiple sessions on the same workstream, or when a user observes that insights from separate sessions form a larger picture"
category: process
proven_in: "WS3 SDK adoption (4 sessions: investigation → planning → Phase 1 → Phase 2) — the 'workaround debt compounds' pattern was only visible across all four"
proven_date: 2026-04-05
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Individual session handoffs capture local observations but miss patterns that only emerge when observations from separate sessions are read together"
  stable: true
---

# Cross-Session Pattern Emergence

## Problem

Each session captures its own surprises, corrections, and patterns in
the napkin. Session handoffs record the local observations faithfully.
But the most important patterns — the ones that reveal architectural
drift, compounding debt, or fundamental misframings — only become
visible when observations from multiple sessions are read together.

No single session sees the full picture. The investigation session
found the shim. The planning session traced the pipeline. Phase 1
proved `.meta()` works. Phase 2's user corrections revealed that the
"different purposes" framing was rationalisation. The compound pattern
— workaround debt compounds through rationalisation — was invisible
in any one session's napkin entry.

## Pattern

During deep consolidation (`jc-consolidate-docs`), actively look for
**cross-session arcs** — sequences of observations across sessions
that form a larger pattern:

1. **Read the napkin chronologically**, not just the latest session.
   Look for recurring themes, corrections that sharpen earlier
   observations, or mistakes that compound.

2. **Ask: "What do these sessions know together that none knows
   alone?"** The individual entries may be correct and complete. The
   emergent pattern is in the relationships between them.

3. **Extract the meta-pattern as a named pattern.** Cross-session
   patterns are often the most valuable — they represent understanding
   that was hard to reach.

4. **Check user corrections across sessions.** A correction in
   session 4 may reframe an observation from session 1 that was
   accepted at the time. The reframing is the insight.

## Anti-Pattern

Consolidation that only processes the latest session's napkin entries.
This captures local learning but misses the arc. The consolidation
step should be where cross-session emergence is detected.

## Integration Point

The `jc-consolidate-docs` command's Step 5 (Extract reusable patterns)
should explicitly include a cross-session scan: "Read napkin entries
from the current rotation window as a sequence. Identify patterns that
emerge from the interaction of observations across sessions."
