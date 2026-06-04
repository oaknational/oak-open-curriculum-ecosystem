---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-06-04 — napkin rotation (Arboreal Sprouting Branch curation pass)

Rotated the 2026-06-03 (Furnace) → 2026-06-04 (Shadowed) window — 13
session-sections — during a dedicated knowledge-curation pass. The processed
source is preserved verbatim at
[`archive/napkin-2026-06-04-arboreal-curation.md`](archive/napkin-2026-06-04-arboreal-curation.md);
the per-section disposition ledger is the
[ledger](../operational/curator-passes/2026-06-04-arboreal-sprouting-branch-curation.md).

Dispositions: most sections' primary lessons were already homed by each
session's own light handoff (distilled.md + Claude auto-memory), verified this
pass. Newly routed: six pending-graduations candidates
(dissolution-by-re-attribution; thoroughness-texture-is-not-evidence;
gate-outcome-vocabulary-third-word; mine-then-verify-against-canon;
corrections-are-high-risk-re-instantiation; independence-over-review-count),
plus a second-instance note on the design-optionality item and opener-genre
facets. Graduated to distilled: the commit-window moving-target discipline.
Homed to `docs/engineering/tooling.md`: the `pnpm outdated` exit-code semantics
(from the Codex cross-platform memory read).

Fresh capture starts below.

## 2026-06-04 — markdown wrapped-line list-marker trap (Fiery Sparking Caldera)

- **A wrapped prose line that begins with a list marker (`+`, `-`, `*` then a
  space) trips MD004/MD032** — markdownlint reads it as a nested list item. Hit
  it twice this
  session wrapping `a + b + c` enumerations across lines. Cure: never let a marker
  char start a wrapped line — reword, rewrap, or use commas. The pre-commit gate
  caught both (one re-cycle each).
