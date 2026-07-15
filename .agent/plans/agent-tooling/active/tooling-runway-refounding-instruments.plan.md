---
name: "Tooling Runway: Refounding Instruments"
overview: "Eight deterministic tooling items (Director remit d8a51548 + addendum) landed test-first, one PR per item, before the refounding stages that consume them start."
lineage:
  serves_thread: plan-corpus-refounding
  derives_from: "Director routing event d8a51548 (2026-07-15T15:47Z) + remit addendum (2026-07-15T16:11Z), owner-commissioned via the Director seat"
todos:
  - id: item1-arg-contract-guard
    content: "Item 1: shared entry arg-contract (refuse --, run-nothing --help, unknown-arg errors) applied to all 12 registered refound-* entries. One PR."
    status: in_progress
  - id: item7-amendment-writer
    content: "Item 7: G3/A1 amendment writer — versioned frozen-v2 amendment records consumed by verify-freeze/merge-recheck/tile. One PR."
    status: pending
    depends_on: [item1-arg-contract-guard]
  - id: item8-watcher-exclude-tag
    content: "Item 8: comms watch --exclude-tag <tag> repeatable filter at the drain step. One PR. Slots anywhere without displacing item 7."
    status: pending
  - id: item2-adjudication-queue
    content: "Item 2: J3 adjudication-queue substrate — row schema + status tracking + thin list/filter/recount CLI. No judgement semantics. One PR."
    status: pending
    depends_on: [item1-arg-contract-guard]
  - id: item3-lane-registry-shell
    content: "Item 3: lane-registry schema + free-text-refusing validator wired into repo-validators. Mechanical shell; values owner-gated (Walk-A sitting). One PR."
    status: pending
    depends_on: [item7-amendment-writer]
  - id: item4-runner-shells
    content: "Item 4: challenge runner + probe runner + per-batch loss-check runner entry points. Mechanical shells; semantics owner-gated (OG-2). One PR."
    status: pending
    depends_on: [item7-amendment-writer]
  - id: item5-challenge-stale-trigger
    content: "Item 5: challenge-stale trigger — deterministic git-diff scan over destination paths between two refs, emitting re-flag rows (R4). One PR."
    status: pending
    depends_on: [item4-runner-shells]
  - id: item6-retirement-precondition-checker
    content: "Item 6: retirement-precondition checker — per file: live bytes == frozen copy + ratified banner + amendments routed; refuses on mismatch (R5). One PR."
    status: pending
    depends_on: [item7-amendment-writer]
isProject: false
---

# Tooling Runway: Refounding Instruments

**Last Updated**: 2026-07-15
**Status**: 🟢 ACTIVE (item 1 in flight)
**Scope**: Every deterministic tool the remaining plan-corpus-refounding stages need exists, tested and registered, BEFORE its stage starts — no mid-stage tool-building stalls.

---

## Context

The refounding protocol (r1) has 13 registered `refound-*` CLIs as of `SHA:5ce08c259`. The
Director's first-hand gap audit (remit event `d8a51548`) found the remaining stages need six
more instruments, in dependency order; the 16:11Z addendum added two evidence-driven items
(a G3/A1 amendment writer — Aurora's S2 merge-recheck went RED on a real A1 arrival the same
day — and a watcher `--exclude-tag` filter for standby-seat context burn).

### Problem statement

Refounding stages have repeatedly stalled mid-stage to build tooling (worked instance: the
Stoat `--help` probe that EXECUTED `refound-sweep` for real, 2026-07-14 — the founding
evidence for item 1). Each missing instrument is a known future stall; the semantics that are
owner-gated (lane values, challenge dispositions) are NOT blockers for the mechanical shells
that carry them.

### Existing capabilities

- `scanArgs` (`agent-tools/src/core/cli-arg-parser.ts`) — shared argv scanner; errors on
  unknown options; stops at `--` (the footgun item 1 closes at every entry).
- `refound-freeze-args.ts` — the worked arg-contract precedent (freeze + merge-recheck).
- Challenge model/modes/scoring modules exist TESTED but have no registered entry point
  (item 4 adds the entries only).
- `refound-amendments.ts` carries the amendment READ contract only (item 7 adds the writer).
- `refound-ledger-row` + `refound-tile` — the pieces item 5's loss-check runner composes.

## Design principles

1. **Mechanical shells where semantics are owner-gated** — items 3 and 4 land schema +
   validation + entry points; the VALUES (lanes, dispositions, tiers, thresholds) bind later
   at the owner sittings (Walk-A, OG-2). No invented values, ever.
2. **Ship-independent** — one landing per item, one PR per item, never bundled
   (`ship-independent-coordinate-dependent`).
3. **Deterministic and recomputable** — every instrument recomputes from artefacts; none
   trusts a recorded green (the batch-status precedent).

**Non-goals** (YAGNI):

- No lane VALUES (item 3), no challenge SEMANTICS (item 4) — owner-gated.
- No edits to `.agent/plans-refounding/**` state files (other seats' lane).
- No edits to `refound-window-sample*` or the oak-eslint no-real-io allowlist while
  Hedgehog's claims `6632e841` / `646cb8df` are live.
- No S2 execution, no reader-batch work (other seats' lanes).

## Lifecycle triggers

> See [Lifecycle Triggers component](../../templates/components/lifecycle-triggers.md)

Work shape: executable repo plan (this file). Claim: `ba5b683d` (implementer,
`agent-tools/**`, thread `plan-corpus-refounding`). Worktree:
`oak-open-curriculum-ecosystem-worktrees/tooling-runway`, branch per item off current
`origin/main`. Session handoff: PDR-063 record targeting the pre-named successor seat
(Draco weaves Infinity, `ef3e3e` — surfaced to the Director for corroboration). Consolidation
at natural boundaries per `oak-session-handoff` / `oak-consolidate-docs`.

## Session discipline (multi-session plan)

> See [`session-discipline.md`](../../templates/components/session-discipline.md). Item
> count is template-not-contract; the successor picks up at the first `pending` todo whose
> `depends_on` is satisfied, reading the per-item sections below as the delegation brief.

## Reviewer scheduling

- **Plan-phase**: `assumptions-expert` against this plan (proportionality; the
  mechanical-shell vs owner-gated boundary). Dispatch pre-declared to the Director per the
  lane's zero-undeclared-subagents rule.
- **Mid-cycle**: `code-expert` twice per item (pre-execution scope review + post-execution
  gateway before commit, per `pre-execution-code-expert-review-per-loop-cycle`);
  `test-expert` on every test-file change; `type-expert` on schema/type-flow items (2, 3, 7).
- **Close (per item)**: gateway verdict recorded in the PR body; `docs-adr-expert` when an
  item changes documented behaviour (items 7, 8 touch TSDoc'd contracts).

## The items (each WS = one item = one PR)

### Item 1 — arg-contract / `--help` guard on every raw refound-* entry (IN FLIGHT)

**File scope**: `agent-tools/src/refounding/refound-entry-args.ts` (+ unit test, NEW);
`refound-freeze-args.ts` (delegates); the 10 non-conformant entries (verify-freeze,
inventory, tile, default-ledger, residue, sweep, plant-orphan, plant-challenge-canary,
claim-census, batch-status); `refound-challenge-modes.ts` (usage line);
`refound-tile.unit.test.ts` (exported-parser contract cases).
**Shape**: one shared helper (`parseEntryArgs` + `parseOutDirArgs` + `prepareOutDirEntry`),
applied per script; every entry refuses `--` outright, answers `--help`/`-h` run-nothing
BEFORE any resolution or write, and errors on unknown args. Sweep + plant-orphan reuse
`parseFreezeArgs` (identical rule+out surface).
**Acceptance**: helper + freeze-args + tile unit tests green; all refounding tests green;
`pnpm --filter @oaknational/agent-tools type-check` and `lint` clean (zero errors, no NEW
warnings); live smoke: `--help` on one tool exits 0 printing usage with no artefact writes,
`-- --help` refused non-zero.
**Proof level**: unit (parser contract) + integration (existing per-tool suites) +
value-proxy (live smoke pair).

### Item 7 — G3/A1 amendment writer (NEXT after item 1)

**File scope**: `agent-tools/src/refounding/refound-amendments*.ts` (+ writer entry + tests);
package.json script registration.
**Shape**: tested writer authoring versioned frozen-v2 amendment records — file, frozen sha,
live sha, diff substance, provenance, arrivals-report totals — consumed by
verify-freeze/merge-recheck/tile as sanctioned denominator extensions. Semantics are
G3-RATIFIED (A1 = auto-freeze, no ruling): NOT owner-gated.
**Acceptance**: writer round-trips through the existing read contract; verify-freeze /
merge-recheck / tile consume a written amendment in integration tests (the RED-with-known-
cause S2 case becomes green); determinism: double-write byte-identical.
**Proof level**: unit + integration.

### Item 8 — `comms watch --exclude-tag` (slots anywhere; do not displace item 7)

**File scope**: `agent-tools/src/collaboration-state/` watch/drain modules + tests.
**Shape**: repeatable `--exclude-tag <tag>` excluding tagged events at the drain step
(house-style tests). Cures standby-seat heartbeat burn (Ceres, Tuna).
**Acceptance**: tagged events excluded, untagged and other-tagged delivered; seen-file
cursor semantics unchanged (excluded events still marked seen); existing watch tests green.
**Proof level**: unit + integration.

### Item 2 — J3 adjudication-queue substrate

**File scope**: `agent-tools/src/refounding/` (new queue schema + status modules + thin
CLI + tests); package.json registration.
**Shape**: rows carry verbatim-anchored evidence, disposition status (undecided/…),
provenance; CLI lists/filters/recounts. The queue is the container, not the verdict — no
judgement semantics. Input shapes: `.agent/plans-refounding/proofs/s1-deterministic-evidence.v1.json`
(77 residue candidates + 3,514 sweep hits) + the reader batch's PR (re-read at cycle-open).
**Acceptance**: schema validates the real S1 shapes; recount agrees with source counts;
list/filter deterministic; entry conforms to the item-1 contract.
**Proof level**: unit + integration against fixture copies of the real shapes.

### Item 3 — lane-registry schema + validation gate (mechanical shell)

**Blocking prerequisite (semantics)**: lane VALUES come from the owner's Walk-A sitting —
the shell must land in the same tranche as the taxonomy per the controlling plan. Minimum
shippable shape without the sitting: registered-axis-value schema, candidate/registered
status, a validator that refuses free-text lane values, wired into `repo-validators:check`,
with an EMPTY registered set.
**Acceptance**: validator refuses a free-text value and accepts a registered one (fixture);
`pnpm repo-validators:check` runs it; zero invented values in the tree.

### Item 4 — challenge runner + probe runner + per-batch loss-check runner (shells)

**Blocking prerequisite (semantics)**: disposition taxonomy, regime pair, challenger tier,
H-thresholds are owner-gated (OG-2 machinery half) and bind later. Shells only: registered
entry points over the existing tested model/modes/scoring modules; loss-check runner
composes `refound-ledger-row` + `refound-tile`.
**Acceptance**: entries registered and item-1-conformant; runners execute the existing
tested modules against fixtures; no semantic constants introduced.

### Item 5 — challenge-stale trigger

**Shape**: deterministic git-diff scan over destination paths between two refs; emits
re-flag rows for VERIFIED rows whose destination home a later commit mutates (plan clause
R4). Depends on item 4's runner substrate for row emission shape.
**Acceptance**: fixture repo proves: mutated destination → re-flag row; untouched →
none; determinism across double runs.

### Item 6 — retirement-precondition checker

**Shape**: per file — live bytes == frozen copy, ratified banner present, amendments routed
(consumes item 7's records); refuses on any mismatch (R5's scripted gate).
**Acceptance**: fixture proves all three mismatch classes refuse individually; clean file
passes; recomputable (no recorded-green trust).

## Quality gates

Per item, scoped: `pnpm --filter @oaknational/agent-tools type-check | lint | test` +
`pnpm repo-validators:check` where wired. Pre-push and PR CI run the canonical aggregate
gate (see [quality-gates component](../../templates/components/quality-gates.md)). Zero new
warnings (`no-warning-toleration`).

## Risk assessment

| Risk | Mitigation |
|------|------------|
| Inventing owner-gated semantics in a "shell" | Non-goals name the gated surfaces; per-item acceptance asserts zero semantic constants; assumptions-expert checks the boundary |
| Claim collision (window-sample / eslint allowlist) | Explicit not-to-touch list; re-check claims registry at each item open |
| Plan drift vs remit | The remit events (`d8a51548`, addendum) are authoritative; deltas route through the Director |
| Successor pickup cost mid-item | PDR-063 handoff record + this plan's per-item briefs; todos carry live status |

## Foundation alignment

TDD pairs per cycle (testing-strategy), Result-typed errors ADR-088, strict boundary
validation, `principles.md` lenses at every item open. First question standing: could it be
simpler without compromising quality? (Item 1's answer: reuse `parseFreezeArgs` for two
entries rather than a third shape.)

## Consolidation

Per item landing: PR body carries the compressed verdict to the Director. At session
boundaries: `oak-session-handoff`; napkin capture rides `team/plan-corpus-refounding`
(PDR-127), never the product branch.

## Dependencies

**Blocking**: none for items 1, 7, 8, 2 (semantics for 3–6 are gated but their shells are
not). **Related**: the controlling refounding plan (Director-owned,
`.agent/plans-refounding/**`); Hedgehog's s1-reader-sample batch (claim boundary only).
