---
name: "Tool-Default Scan-Set Drift"
polarity: anti-pattern
use_this_when: "Citing any sweep, search, or lint result — including a healthy non-empty one — without stating the file-selection semantics that defined the set the tool actually visited (dot-directories, .gitignore handling, hidden files)."
category: process
proven_in: "Longitudinal synthesis 2026-08-07, candidate C06 (adversary-surviving, novelty-verified): rg/fd dot-dir and ignore defaults, markdownlint-cli dot-dir exclusion, and validator-specific scan shapes each silently changed the scanned set across the June 2026 windows; live sibling instance — the machine-local-paths validator green over 10,121 files while tilde paths sat in JSON string leaves (napkin 2026-08-07)."
proven_date: 2026-08-07
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Reading a green or plausible sweep as covering the intended set while the tool's own selection defaults quietly excluded part of it — the denominator is wrong even when the result is non-empty."
  stable: true
---

# Tool-default scan-set drift

A search or lint tool's file-selection defaults silently define the set a sweep
actually visited — and those defaults differ per tool and per invocation shape.
`rg` and `fd` skip dot-directories and `.gitignore`d files by default;
markdownlint-cli excludes dot-directories while markdownlint-cli2 glob configs
and repo validators make their own choices about `.gitignore`; a fitness or
audit script inherits whichever semantics its inner tool ships. A green sweep
therefore certifies only the set the tool visited, which is not necessarily the
set the operator meant — and unlike a zero-match result, a NON-EMPTY result
looks healthy while the denominator is quietly wrong.

Longitudinal evidence: surfaced as candidate C06 of the 2026-08-07 archive-scale
synthesis (adversary-surviving, novelty-verified against this directory), with
grounding across the June windows of the corpus — see
`.agent/reports/agentic-engineering/large-corpus-analysis-tooling/data/longitudinal-2026-08-reduce-result.json`
(C06 `supportingLeafIds` resolve to dated napkin quotes). A related live
instance: the machine-local-paths validator scanning 10,121 files green while
tilde paths sat inside JSON string leaves (napkin, 2026-08-07) — same class,
per-validator scan-shape gap.

Cure shape:

- State the intended set explicitly at invocation (`--hidden`, `--no-ignore`,
  explicit globs) rather than inheriting the tool's default; when two tools
  must agree on a set, derive the set once and pass it to both.
- Any sweep-based claim names the set definition alongside the result ("N files
  visited, defined by X"), so a reviewer can see the denominator.
- For negative claims, this pattern composes with
  [`zero-match-false-green.md`](zero-match-false-green.md) (prove the
  instrument could match) and
  [`audit-sweep-filters-against-live-referent.md`](audit-sweep-filters-against-live-referent.md)
  (corpus-test written filters); this pattern covers the third leg — the
  tool's own implicit selection, which bites even when your filter is correct
  and your result is non-empty.
