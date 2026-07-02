---
name: "Statusline primary/worktree location rows"
status: "DELIVERED 2026-06-29 — ready to archive (see ## Outcome)"
overview: >-
  Reshape the Claude Code statusline so model and context share one row, and the
  git-location facts render as labelled location rows. FINAL shipped shape (the
  `πρ:` label of the original design was dropped per owner iteration): a primary
  checkout shows its name on one row and its branch on the next (no label); a
  linked worktree shows the primary checkout's name, its branch prefixed `coord:`,
  then the worktree's name and branch. The same arc also added the Claude.ai
  rate-limit gauges to the top row after the collaboration icons — `s:NN%(2h)`
  (session / five-hour) and `w:NN%(3d)` (week / seven-day), consumed-percentage
  colour-ramped, each with a DIM reset countdown (coarsest of d/h/m, nearest).
  Pure render/segments change plus a `resets_at` parse and a single clock read in
  the adapter — keys on already-gathered git facts; no git-facts gatherer refactor.
  Recreates a lost plan of the same intent (statusline-enhancements thread).
lineage:
  serves_thread: statusline-enhancements
  serves_stream: agent-tooling / agent-experience (glanceable session-location surface)
  derives_from:
    - ".agent/memory/operational/threads/statusline-enhancements.next-session.md (the live lane; logo work is paused — this is a distinct presentation member)"
    - ".agent/research/statusline-inputs-research.md (the stdin contract; terminal theme is NOT knowable — colour only with the theme's own contract: default-fg / DIM)"
todos:
  - id: ws1-location-rows-pure
    content: "WS1: pure labelled-location-row composition in statusline-segments.ts. Given the resolved parts, emit 1 or 2 fully-formatted location rows: `πρ:<branch> <checkout>` when no coordination branch resolved (single relevant location), else `coord:<primaryBranch> <primaryName>` then `wt:<branch> <worktreeName>`. Labels DIM; branch-you-are-on bold-blue (πρ, wt), coord branch non-bold blue; names cyan. TDD over fixture parts (no IO): primary-only, worktree, missing-worktree-name, error passthrough. One commit, tree green."
    status: completed
    depends_on: []
  - id: ws2-model-context-one-row
    content: "WS2: combine model and context onto one row in the logo layout (renderWithLogo) and confirm the no-logo layout already co-locates them. Splice the WS1 location rows into both layouts in place of the old branch/place/coordination rows; order coord before wt. TDD: render tests for primary-only and worktree shapes crossed with logo present/none; assert row content and order, not raw bytes. One commit, tree green."
    status: completed
    depends_on: [ws1-location-rows-pure]
  - id: ws3-wire-and-prove
    content: "WS3: ensure statusline-identity.ts passes the parts unchanged (no adapter logic change expected); rebuild dist (pnpm --filter ./agent-tools build — dist is gitignored, the live shim runs the built copy); render the statusline live via the shim with mock stdin for primary-only and (fixture) worktree inputs and capture the row strings as proof. Run the agent-tools gate. One commit (dist is not committed), tree green."
    status: completed
    depends_on: [ws2-model-context-one-row]
isProject: false
---

# Statusline primary/worktree location rows

## End goal

A glance at the statusline answers "which checkout am I in, and where is the
shared/primary checkout?" without ambiguity. In a plain checkout you see one
`πρ:` line (your branch and checkout). In a linked worktree you see both the
`coord:` line (the primary checkout — where shared team state lives, ADR-197) and
the `wt:` line (your worktree's branch and name). Model and context sit together
on one row, freeing vertical space for the two location rows beside the logo.

## Mechanism

The statusline already gathers every fact needed (`statusline-git-io.ts`):
`branch` + `dir` (the current checkout), `worktree` (the linked-worktree name),
and `coordinationBranch` + `coordinationPlace` (the primary checkout's branch and
name, resolved exactly when linked worktrees exist). The label choice keys on
whether `coordinationBranch` resolved: present → two relevant locations →
`coord:` + `wt:`; absent → one relevant location → `πρ:`. Because git forbids the
same branch in two worktrees, the existing coordination dedup never fires in
practice, so no gatherer change is required — the work is a pure
render/segments reshape.

## Means

- **WS1** — pure labelled-location-row composition (segments).
- **WS2** — model+context on one row; splice location rows into both layouts.
- **WS3** — wire, rebuild `dist`, prove live, run the gate.

## Acceptance criteria

- **Primary checkout** (no linked worktree): exactly one location row,
  `πρ: <branch>  <checkout>`. Proof: render test (unit) + live shim render with
  mock stdin.
- **Linked worktree**: two location rows in order `coord: <primaryBranch>
  <primaryName>` then `wt: <branch>  <worktreeName>`. Proof: render test (unit)
  over fixture parts.
- **Model and context** render on one row in the logo layout. Proof: render test.
- **Loud git errors** still surface (error token unchanged). Proof: render test
  asserting the error path is untouched.
- agent-tools gate green (`pnpm --filter ./agent-tools test` + type-check + lint).

## Non-goals

- No change to how git facts are gathered (`statusline-git-io.ts` /
  `statusline-git-location.ts`); the coordination dedup is left vestigial, not
  retired (a possible later cleanup, out of scope here).
- No logo / cycling / session-shape-icon changes (logo lane is paused).
- No new env vars or settings.

## Prerequisite classification

None blocking. Beneficial: a linked worktree to render the two-row case live —
absent it, the worktree path is proven by unit render tests over fixture parts
(the minimum shippable proof).

## Foundation alignment

- `testing-strategy.md` — TDD cycles; test and product code land together; no
  skipped/conditional tests; pure fixtures, no global state.
- `principles.md` — purity at the core (row composition is IO-free), IO stays in
  the adapter; replace-don't-bridge (labels replace the meaning-flipping
  unlabelled location line).
- `schema-first-execution.md` — n/a (no schema surface touched).
- Theme constraint (statusline-inputs-research.md): colour only with the theme's
  own contract (DIM / default-fg); the terminal theme is not knowable.

## Plan-body first-principles check

- **Shape**: pure-core / IO-at-edge already holds; this plan keeps composition
  pure and changes no IO. No new boundary.
- **Landing path**: each WS is one commit ending tree-green; `dist` is rebuilt
  but not committed (gitignored).
- **Vendor-literal**: none (no third-party call shapes).

## Risk

- **Misclassifying primary-vs-worktree** if `coordinationBranch` is absent inside
  a worktree (only reachable via the git-forbidden same-branch case). Mitigation:
  key on `coordinationBranch` presence (the loud-resolved fact), and the unit
  matrix covers the worktree shape explicitly.
- **Live render not reflecting source** because `dist/` is gitignored. Mitigation:
  WS3 rebuilds `dist` and proves via the shim.

## Learning loop

On completion, run the consolidation workflow and update the
`statusline-enhancements` thread record (this plan replaces the lost one).

## Outcome (DELIVERED 2026-06-29)

Shipped on `docs/consolidations` (owner-directed; the branch state was owner-resolved
mid-session). Three things landed as one arc:

1. **Model + context share one row** in the logo layout (already co-located in the
   no-logo layout).
2. **Labelled location rows.** Primary checkout: checkout name on one row, its branch
   on the next, **no label** (the original `πρ:` design was dropped on owner
   iteration — the body sections above record that earlier shape as the journey).
   Linked worktree: primary checkout name, its branch prefixed `coord:`, then the
   worktree's name and branch. Keyed on `coordinationBranch` presence; the git
   "no same branch in two worktrees" rule makes that a reliable in-worktree signal,
   so **no git-facts gatherer refactor** was needed.
3. **Rate-limit gauges + reset countdowns** (owner-added in the same arc). Top row,
   after the collaboration icons: `s:NN%(2h)` (session/five-hour) and `w:NN%(3d)`
   (week/seven-day). Percentage carries the shared usage colour ramp (green→yellow→red
   as consumed climbs); countdown is DIM. New pure `formatCountdown` (coarsest of
   d/h/m, nearest, rollover-promoting so no `60m`/`24h` artefact, clamps past→`0m`)
   in `statusline-countdown.ts`; the usage gauges moved to `statusline-usage.ts` to
   keep `statusline-segments.ts` under the 250-line limit. The parser reads
   `resets_at` (Unix epoch seconds — doc-confirmed); the adapter does the single
   clock read and the `resets_at − now` subtraction, keeping formatting pure.

**Proof:** agent-tools gate green (1846 tests; type-check; lint 0 errors); `dist`
rebuilt; both layouts and the gauges/countdowns rendered live via the shim
(primary, worktree, high-consumption red, sub-hour minutes). Tests are
behaviour-shaped (relationships through the rendered output; ANSI-stripped; no row
indices/line counts/whole-object pins) after owner correction of over-coupled tests.

**Follow-ons (not blocking, for a future enhancement arc):**

- `statusLine.refreshInterval` set to 10s by the owner (2026-06-29), so the
  countdown ticks while idle as well as on render events. DONE.
- Fold the current statusline-docs deltas into
  `.agent/research/statusline-inputs-research.md` (footerLinksRegexes, Windows
  config, "notifications share the row", the `// empty` absence idiom) and bump its
  verified-against version.
- **Statusline trace log (observability follow-on)** — **moved** to the live
  [`statusline-enhancements`](../../../memory/operational/threads/statusline-enhancements.next-session.md)
  thread record (§"Future enhancement lanes"), 2026-06-30, so it is not orphaned when this plan
  archives. Summary: NOT a recalc fix (the recompute is correct — the staleness is upstream in
  Claude Code's snapshot cadence); an env-gated disk trace log for this soft surface; deprioritized
  below spawn-flow. Full diagnosis lives in the thread record.

Ready to archive to `agent-tooling/archive/completed/` per ADR-117.
