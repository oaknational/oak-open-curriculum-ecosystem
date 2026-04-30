---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in the repo-continuity
[`Deep consolidation status`](../operational/repo-continuity.md#deep-consolidation-status)
register.

The previous active napkin was archived during the 2026-04-30 deep
consolidation pass at
[`archive/napkin-2026-04-30.md`](archive/napkin-2026-04-30.md). It
carries the full record of the 2026-04-29 / 2026-04-30 session arc
(deep consolidation, PR-90 closure, sector-engagement narrative
refresh, observability config-coherence + substrate-vs-axis convention,
canonical-first skill-pack ingestion future plan).

High-signal entries from that arc graduated to:

- `docs/engineering/testing-tdd-recipes.md § Validator Script vs
  Integration Test` — the contrast pattern + scripts/-tier note;
- `distilled.md § Process` — the new "stage by explicit pathspec"
  and "hash presence without recompute is silent drift" entries;
- `repo-continuity.md § Pending-Graduations Register` — the
  commit-bundle-leakage candidate from this session's post-mortem.

## 2026-04-30 — Post-mortem + fitness remediation lane (Verdant Sheltering Glade)

Session opened on the owner-deferred housekeeping-with-intent lane
recorded in `repo-continuity.md § Deep Consolidation Status` after
Vining Ripening Leaf. Five mandatory outputs queued; full record lives
in this session's experience file [the-bundle-was-the-signal][exp].

[exp]: ../../experience/2026-04-30-verdant-the-bundle-was-the-signal.md

### Surprise — the bundle was the signal

- **Expected**: commit `75ac6b75` did what its message said —
  "record owner-deferred handoff post-mortem + remediation lane".
- **Actual**: the diff bundled 51 lines of legitimate continuity work,
  372 lines of parallel `agentic-engineering-enhancements` plan work,
  and 3 lines of unrelated `.claude/settings.json` cloudflare-plugin
  enable. The commit message is true for one slice of the diff and
  silent about the rest.
- **Why expectation failed**: I assumed the closing-session staging
  picked the queued bundle and stopped there. Wildcard staging
  (`git add -A` or moral equivalent) over a working tree containing
  another session's WIP defeats the queue.
- **Behaviour change**: stage by explicit pathspec from the queued
  intent; treat files-outside-the-named-intent at commit time as a
  coordination event, not a convenience. Surfaced as candidate
  doctrine in the pending-graduations register
  (commit-bundle-leakage-from-wildcard-staging). Same shape as Vining's
  own working principle: *the invented justification is the signal that
  the structure has not caught up to the shape of the work* — applied
  to a staging boundary, the message-vs-diff alignment requiring prose
  to bridge IS the signal.

### Fitness remediation outcomes

- Napkin rotated 2026-04-30 (this session). Outgoing archived to
  `archive/napkin-2026-04-30.md`. Distilled gained two new entries
  (stage-by-pathspec, hash-without-recompute), pruned the long
  testing-strategy line by graduating to testing-tdd-recipes.md, and
  pruned the duplicated shared-state-always-writable paragraph to a
  pointer.
- Distilled.md remains in HARD zone after rotation (314/275 lines):
  two PDR candidates pending owner direction (stated-principles-require-
  structural-enforcement and external-system-findings-tell-you-about-
  your-local-detection-gap) would graduate ~25 lines if directed; the
  remainder is canonical pointer registry.
- repo-continuity.md history archive landing this session.
- Distilled critical-line at line 268 (172 chars) closed by the
  testing-tdd-recipes graduation; same surface no longer carries the
  inline deep-path link.
- Substrate-vs-axis PDR disposition recorded in this session's handoff.

### Pattern note — substrate-vs-axis applied to staging

The substrate-vs-axis distinction Vining named for plan collections
generalises: when a categorisation system meets an edge case that wants
prose to justify, the system is missing a category. Applied to staging,
the categorisation `(this-session-intent | parallel-session-intent |
unrelated)` was implicit; the bundle-leakage made the missing category
visible. Recording the substrate-vs-axis component as a *plan-collection*
convention may have under-scoped its applicability — it is reusable
beyond plan collections.

## 2026-04-30 — Sentry build-scripts `trimToUndefined` hygiene (Leafy Bending Dew)

- **What landed.** One shared [`trim-to-undefined.ts`][trim-helper] helper:
  **unset** (`undefined`) and **present-but-empty-after-trim** (`''`) are
  separate `if` branches — no collapsed falsy shortcut. Duplicate privates
  dropped from sentry identity + plugin modules; small vitest module proves
  the boundary.

[trim-helper]: ../../../apps/oak-curriculum-mcp-streamable-http/build-scripts/trim-to-undefined.ts

- **Handoff.** Cursor session `/jc-session-handoff` **without** git commit —
  **active Claude Code instance should own** staging + conventional commit when
  it next touches the branch (surfaced on thread record +
  `repo-continuity.md` §Last refreshed / §Next safe step).

- **ADR/PDR (6b)**. Nothing qualifies — pure refactor clarity.
