---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-06-05 — napkin rotation (Lanternlit Passing Mask curation pass)

Rotated the 2026-06-04 (Arboreal) → 2026-06-05 (Dim) window — ~13 session-sections
— during a dedicated knowledge-curation pass. The processed source is preserved
verbatim at
[`napkin-2026-06-05-lanternlit-curation.md`](archive/napkin-2026-06-05-lanternlit-curation.md);
the per-section disposition ledger is the
[ledger](../operational/curator-passes/2026-06-05-lanternlit-passing-mask-curation.md).

Dispositions: most sections were already homed by each session's own light handoff
(distilled / Claude auto-memory / experience files), verified this pass. Graduated
to `distilled.md`: the markdown wrapped-list-marker trap, the IDE-diagnostic-flood
scope clarification, the pointer-status-is-not-ground-truth meta-law, the
set-membership content-conservation sharpening (into the commit-window entry), and
the grounding-bar calibration guard (into the consolidated felt-authority cluster).
Owner-gated: the felt-authority unification (pending-graduations top entry —
recommended for graduation this pass). Surfaced as an owner finding: the
`.husky/pre-commit` hook drifted from ADR-121 (omits knip + depcruise, adds build).
Duplicates (already homed, skipped): clean-review, discrepancy-claims,
graduate-not-skip-grounding, pairing/monitors, the Dim/Silvered tooling gotchas
(build-system.md covers SDK-build-before-consume + lint≠format).

Fresh capture starts below.

## 2026-06-05 — the lesson I documented bit me three times the same session (Lanternlit)

- **The wrapped-list-marker trap (MD004/MD032) tripped me 3× in one session —
  while consolidating the very distilled entry that documents it.** A prose line
  using ` + ` or ` * ` enumerations wraps so a marker char lands at line-start;
  markdownlint reads it as a list item. A live instance of PDR-089 obs-3 (naming a
  lesson does not inoculate against it) and of passive-guidance-loses-to-artefact-gravity.
  The reliable cure was NOT the lesson — it was the **mechanical gate**: the
  pre-commit `markdownlint-staged` check caught all three before they landed.
  Behavioural takeaway: when writing ` + `/` * ` enumerations in prose, use commas;
  but rely on the gate, not vigilance.
- **Owner approved "mint a new PDR"; grounding routed it to a clause instead — a
  live instance of the doctrine being graduated.** The felt-authority family was
  going to become `pdr:felt-authority-grounding-discipline`, but PDR-089 §Decision 6
  already owned the substrate, so per `new-rule-vs-pdr-clause` it landed as PDR-089
  §Decision 7 (a new PDR would have *fragmented* the unification it was meant to
  achieve). The full-doctrine-estate non-duplication check fired correctly — and on
  a graduation the owner had explicitly greenlit, confirming "owner-directed
  graduation is still an independently-grounded act."
- **A quality-gate ADR can silently drift from its own hook.** `.husky/pre-commit`
  had dropped knip + depcruise (ADR-121-mandated) and added build; the drift was
  invisible until a curation grounding pass cross-checked the hook against the ADR.
  The matrix being *duplicated* in ADR-121 and build-system.md is the structural
  cause (two copies diverge). Fixed the hook + reconciled both docs; flagged the
  de-duplication as a follow-up.

## 2026-06-05 — a fail-closed gate with no working in-band recovery is fail-*bricked* (Skyward)

- **The PreToolUse guard shim failed closed when its dist artefact was unbuilt — bricking
  fresh/branch-switched worktrees**, because the block also stopped the `pnpm install` /
  `pnpm agent-tools:build` that builds the guard. Its `OAK_ALLOW_MISSING_PRETOOLUSE_GUARDS`
  break-glass was non-functional for the only actor that hits the catch-22 (the agent can't
  set the hook process's own env per-invocation). Cure: split **missing/not-built** (fail
  OPEN, loud + logged to `.claude/logs/hook-errors.log`) from **present-but-broken** (still
  fail closed). Bricking doesn't serve the safety goal of guarding *mistakes*; it only
  halts. Homed in `.agent/hooks/README.md` + the `decideMissingGuardArtifact` TSDoc.
- **Verify a prompt's "it's already tested" premise before treating the work as a flip.**
  The brief said the missing-artefact decision was unit-tested — flip the expectation. It
  was not: the smoke test that covered it was dropped in `2078e0f0` ("drop the smoke
  over-reach") and the surviving unit test only covers `resolveGuardExitCode` (the present-
  guard case). The honest move was extract-to-pure-fn + *create* the test, not "flip." A
  convenient premise that makes the work a one-liner is exactly the kind to ground first.
