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

## 2026-06-04 — the clean review I refused to trust (Arboreal Sprouting Branch)

- **An adversarial verification workflow returned `issues_found: 0`; my own
  independent re-check then found a real markdownlint MD004/MD032 defect in the
  curator-pass ledger.** The defect landed in a step-8 edit made AFTER the
  workflow ran, so the verifiers were not wrong — but trusting their clean verdict
  as "certified" would have shipped the defect. Three freshly-routed lessons
  collided in one moment: don't-trust-the-clean-review (Pattern 5);
  corrections/edits are the highest-risk re-instantiation moment (Pattern 4 — the
  defect was in the very ledger documenting the pass); and the wrapped-list-marker
  trap above (a line started with a plus then a rule name). The discipline earned
  its keep: a clean review is a claim to re-verify, never a certificate — most of
  all when it flatters a careful pass.

## 2026-06-04 — an IDE diagnostic flood is not automatically a repo warning (Fiery Sparking Caldera)

- **~30 cSpell diagnostics fired on legitimate domain terms (GIAS, HMAC,
  `pg_trgm`…) after a one-line edit. Before treating an IDE diagnostic flood as
  a no-warning-toleration obligation, verify the tool is a repo-influenced
  gate.** Here there was no repo cspell config and no cspell in the gate
  scripts → the editor extension's default dictionary (local noise on correct
  terms), not a repo warning. never-ignore-signals means investigate the
  signal; no-warning-toleration scopes to systems the repo influences. Real
  coverage would be a repo cspell.json with a domain dictionary (a separate
  owner call), never silencing valid terms.
