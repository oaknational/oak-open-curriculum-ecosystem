# Value-Delivery Discipline — measurable plan (2026-05-27)

Owner mandate: invert the process:value ratio to **≥80% useful delivery**, as a
measurable plan with caps + a per-commit ledger — **not an intention**. Proving
ground: EEF value-PR commits 2–4. Graduates to general practice if it holds.
Authored by Starless (13c7d5).

## Definition of "useful delivery"

- **VALUE** = edits/tests on the irreducible value path (the **adapter → loader →
  tool** chain that makes a teacher's EEF query return real evidence) + gate runs
  that verify it + real-behaviour verification.
- **CEREMONY** = reviewer dispatches, register/report/reflection authoring,
  comms/sidebar posts, coordination, speculative re-grounding beyond the files
  being changed.
- **Justified-ceremony exception:** ceremony that *de-risks value* (e.g. the
  review that caught the missing WS4.5 adapter) earns its place; ceremony that
  merely *ratifies low-risk mechanical work* does not. The caps below encode the
  distinction — they don't ban ceremony, they make it pay its way.

## The dashboard — one ledger line per commit, appended to the review register

`commit N | VER = value/(value+ceremony) tool-calls | reviewers=R | new-standing-artefacts=A | value-path-advance=Y/N`

| Measure | Baseline (commit 1) | Target (commits 2–4) | How measured |
|---|---|---|---|
| **VER** (value tool-calls ÷ total) | ~0.20 | **≥ 0.80** | count tool-uses by class, per commit |
| **Specialist reviewers / commit** | 6 | **≤1 mechanical · ≤2 novel-design**; full panel ONLY at PR-open or owner-flagged pattern-setting | count reviewer Agent dispatches |
| **New standing artefacts / commit** | ~4 (register, report, reflection, observer) | **0** — append to existing only | count new registers/reports/observers |
| **Value-path advance** | n/a | **Y every commit** (adapter→loader→tool moves toward working-on-real-data) | binary vs the chain |
| **End-to-end real-value proof @ PR** | none | **1** — tool returns a real EEF subgraph, not a fake | run the tool on a real teacher context |

## The five mechanisms that move the metric

1. **Risk-calibrated review caps** (table above) — the single biggest lever;
   commit 1's 6 reviewers → target ≤2, panel only at the PR boundary.
2. **No new standing apparatus** — register/report/observer already exist; append,
   never rebuild.
3. **Ground only what you touch** — read the files the commit changes + their
   direct contract; no broad re-survey of settled ground.
4. **Comms = signal, not narration** — sidebar/comms only at decision points +
   commit-landed; n=2 mode (no heartbeat) stays.
5. **Batch review at the PR boundary** — one consolidated review pass at PR-open
   (no-backfill = before *merge*, not before each worktree commit), not a
   per-commit panel.

## Value-protecting items to KEEP (they prevent wasted effort)

- The **WS4.5-class fitness check** (verify plan `LANDED` claims against code) —
  recur-proofs the drift that wastes the most effort. Build as a follow-on.
- **Quality gates stay blocking, always** — correctness, not ceremony.

## The check

Each commit gets its ledger line. At **PR-open**, compute VER across commits 2–4.
If VER < 0.80, the recalibration failed: name the dominant ceremony driver and cut
it before continuing. The owner sees the dashboard at PR-open. This plan is itself
held to the rule — it is one artefact, written once, not a standing apparatus.
