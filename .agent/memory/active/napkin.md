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
[`patterns/`](patterns/README.md). Cross-session pending graduations live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at [`napkin-2026-05-21.md`][archive-pass].
Prior rotations are [`napkin-2026-05-17.md`][previous-pass],
[`napkin-2026-05-14.md`][previous-previous-pass], and
[`napkin-2026-05-13.md`][previous-previous-previous-pass]. The 2026-05-21
rotation was the output of Gilded Ascending Orbit's consolidation pass over
the dense 2026-05-20 and 2026-05-21 multi-agent learning window. Behaviour-
changing entries were merged into [`distilled.md`](distilled.md) under
"Recently Distilled — 2026-05-21"; the full session-by-session capture lives
in the archived napkin.

[archive-pass]: archive/napkin-2026-05-21.md
[previous-pass]: archive/napkin-2026-05-17.md
[previous-previous-pass]: archive/napkin-2026-05-14.md
[previous-previous-previous-pass]: archive/napkin-2026-05-13.md

## 2026-05-21 — Gilded Ascending Orbit consolidation workflow / codex / GPT-5 / `019e4c`

### Surprise: same-prefix identity drift can appear inside one Codex session

- **Expected**: PDR-027 identity preflight would produce the same
  `agent_name` for the whole session prefix.
- **Actual**: live collaboration state contained a fresh `Prismatic Scattering
  Supernova / codex / GPT-5 / 019e4c` claim, while the current preflight
  resolved `019e4c` to `Gilded Ascending Orbit`.
- **Why expectation failed**: the wordlist or identity seed resolution can drift
  within the same platform session; the stable coordinate is the `(name,
  prefix)` pair, with the prefix carrying continuity evidence.
- **Behaviour change**: treat same-prefix/different-name as identity drift, not
  as a peer conflict. Preserve the older claim in the archive, open a fresh
  current-identity claim, and surface the reconciliation in comms before
  editing shared state.
  Source plane: `operational`.

### Consolidation observation: critical fitness pressure is multi-surface

`pnpm practice:fitness:informational` reported CRITICAL pressure in
`napkin.md`, `pending-graduations.md`, and `repo-continuity.md`, plus HARD
pressure in `distilled.md` and two directives. This pass rotated the napkin
first because it was the active capture surface and had a clean archive
lifecycle. The remaining critical surfaces need a follow-on drain rather than
reactive trimming.

Deferral honesty: pending-graduations and repo-continuity remain critical
because safely draining them requires entry-level classification and archive
mapping; doing that inside the same high-context directive-grounding pass would
increase the chance of lossy deletion. Falsifiability: the next consolidation
pass should either archive graduated pending-graduations entries and compact
repo-continuity history, or explicitly record why a higher-priority owner lane
pre-empted that drain.
