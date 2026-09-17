# W0 gate baseline — dated snapshot at first light's open (2026-08-08)

The W0.2(a) deliverable (design-system-completion plan, D12): every
existing design gate verified FIRST-HAND at W0 start, states recorded at a
pinned commit. Verified by the design seat (Civet spins Cavern, 054f5e) on
2026-08-08 (gate runs 13:46–14:33Z), in a fresh worktree at `7ecfc187c` (main, the #828
merge — the a729c466 combined window's landing), following the owner's
implementation word (comms event `a080375f`).

## Review contract (per `.agent/reports/README.md` §Review Contract)

Purpose: the dated ground-truth record of design-gate states at W0 start —
later red gates are measured against it, and the provisional first-pixels
render gates on its verdict. A review should test: was every named gate
actually run first-hand at the pinned commit; is each state supported by
its recorded evidence; are the environment artefacts honestly separated
from gate states. Evidence standard: the exact commands in §Gate states
re-run at the pinned sha reproduce every state; per-gate exit codes were
read in-band at occurrence. Authority boundary: this report records states; it schedules no
work and waives no gate. Non-goals: W0.2(b) KNOWN-ISSUES triage (its own
slice); browser-suite coverage growth (W0.6). A successful review either
confirms the table against a re-run at the same sha or reports the
specific gate whose state diverges.

## Gate inventory (derivation)

The inventory is enumerated from the `build`, `test`, and `validate*`
package scripts across `packages/design/*` plus the two rendering
consumers (`demos/oak-design-showcase`, `demos/oak-curriculum-hub`) at
the pinned sha — thirteen gates. `@oaknational/oak-design-assets`
carries no gate scripts (asset-only package; its byte-integrity is
covered by the showcase's `validate-kit-assets` gate). `lint` scripts
are not counted: they run in the static-checks CI leg on every PR and
are not design-estate gates. This table supersedes the report's initial
ten-row version: the PR review round caught three package test suites
absent from the claimed every-existing-gate scope
(`design-tokens-core`, `oak-design-ink`, `oak-design-system`); all
three were run at the same sha and their rows are recorded below.

## Gate states at `7ecfc187c` — ALL GREEN

Method: dependency-aware turbo runs, then FORCED re-runs (`--force`,
0 cached) so every test verdict below is first-hand at this sha, never
a cache echo; validators invoked by their package scripts; Playwright
suites run against their own webServer. The exact runs:

```bash
# dependency-aware build+test (20 tasks green), then forced re-run (20 tasks, 0 cached)
pnpm exec turbo run build test \
  --filter=@oaknational/oak-curriculum-hub \
  --filter=@oaknational/oak-design-react \
  --filter=@oaknational/oak-design-showcase
pnpm exec turbo run test \
  --filter=@oaknational/oak-curriculum-hub \
  --filter=@oaknational/oak-design-react \
  --filter=@oaknational/oak-design-showcase \
  --filter=@oaknational/oak-design-tokens \
  --force
# inventory-completion runs (9 tasks, 0 cached)
pnpm exec turbo run build test \
  --filter=@oaknational/design-tokens-core \
  --filter=@oaknational/oak-design-ink \
  --filter=@oaknational/oak-design-system \
  --force
# validators, by their package scripts
pnpm --filter @oaknational/oak-design-tokens validate-design-system-consistency
pnpm --filter @oaknational/oak-design-showcase validate-authored-css
pnpm --filter @oaknational/oak-design-showcase validate-kit-assets
# Playwright suites (each against its own webServer)
pnpm --filter @oaknational/oak-design-showcase test:ui
pnpm --filter @oaknational/oak-design-showcase test:a11y
```

| Gate | State | First-hand evidence |
| --- | --- | --- |
| `design-tokens-core` build | GREEN | turbo build exit 0 |
| dtcg↔CSS consistency (`validate-design-system-consistency`) | GREEN | "810 values compared, dtcg and CSS agree", exit 0 |
| `oak-design-tokens` test suite (incl. the 43-pair contrast-pairings manifest and its no-silent-bumps expectations) | GREEN | forced turbo test exit 0 |
| `validate-authored-css` (showcase) | GREEN | "1 authored file(s) clean — zero literal design values", exit 0 |
| `validate-kit-assets` (showcase) | GREEN | "6 copies byte-identical, closure complete", exit 0 |
| `oak-design-showcase` unit suite | GREEN | forced turbo test exit 0 (8 co-located unit files) |
| `oak-design-react` suite (theme-store contract incl. unsubscribe-cleanup and setter-guard pins) | GREEN | forced turbo test exit 0 |
| `oak-curriculum-hub` suite (7+ suites incl. the jsdom axe backstop with its documented `color-contrast` scope bound) | GREEN | forced turbo test exit 0 |
| `design-tokens-core` test suite | GREEN | forced turbo test exit 0 (8 files, 97 tests) |
| `oak-design-system` test suite (the source-of-truth CSS package) | GREEN | forced turbo test exit 0 (2 files, 13 tests) |
| `oak-design-ink` test suite | GREEN | forced turbo test exit 0 (1 file, 1 test) |
| showcase `test:ui` (Playwright: region contract, pre-hydration shell geometry, system-theme follows device) | GREEN | 15 passed (5.2s), exit 0 |
| showcase `test:a11y` (Playwright + axe: identity × theme matrix incl. creature × system dark, 320px reflow per identity) | GREEN | 22 passed (9.5s), exit 0 |

Baseline verdict: ZERO red gates at W0 start. No fix PRs are owed by this
story; W0.2(a)'s "red gates fixed before anything else" arm is vacuously
discharged, and the first-pixels gate's W0.2(a) leg is GREEN.

## Environment artefacts observed and separated (not gate states)

1. **Run-shape false reds**: direct per-package `pnpm --filter <pkg> test`
   in a cold worktree fails showcase and hub suites with
   `Failed to resolve import "@oaknational/oak-design-react"` — the tier's
   dist is unbuilt because the direct invocation skips turbo's dependency
   builds. The estate's own path (turbo, dependency-aware) is the valid
   gate invocation; the baseline above uses it.
2. **Playwright browser install**: the pinned chromium headless shell
   (v1234) was absent from this machine's cache; both browser suites fail
   at `browserType.launch` until `playwright install chromium` runs
   (installed at occurrence, 94.7 MiB). A cold machine reproduces this —
   works-for-any-machine reviewers should treat it as setup, not signal.
3. **Transient `ECONNREFUSED :3000`** appeared once inside the hub suite
   under the broken-dependency run (artefact 1's conditions) and did not
   reproduce in any dependency-correct run (forced, 0 cached, 0
   occurrences). Recorded so a future observer of the same symptom checks
   their build state before suspecting the suite.
