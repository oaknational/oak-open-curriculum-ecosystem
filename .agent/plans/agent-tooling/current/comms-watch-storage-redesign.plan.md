---
name: "Comms-Watch Seen-State Storage Redesign"
overview: >
  Move the comms-watch seen-state cursor out of the repo into per-session
  XDG cache + replace the unbounded UUID-list with an O(1) mtime watermark.
  WS2 + WS3 of the comms-watch trilogy whose WS1 (CLI auto-seed) landed at
  `75e47923` via post-m1-attestation-tidy-up.plan.md cycle 9. Strategic
  substance lifted verbatim from
  `practice-infrastructure-hardening-program.plan.md §P5.W1` at consolidation
  archival (2026-05-25); that program plan is closed and archived. This
  executable plan is the natural home for the remaining storage redesign +
  cleanup work, ready to pick up when bandwidth allows.
todos:
  - id: ws1-prerequisite-cli-auto-seed
    content: "WS1 prerequisite — CLI auto-seed (--seed-from-now + auto-seed-on-empty-or-missing). LANDED at 75e47923 (tidy cycle 9). Recorded here as context; nothing to execute."
    status: completed
  - id: ws2-storage-redesign
    content: "WS2 — Storage redesign. Replace UUID-list format with mtime watermark + filename array for millisecond-tie defense. Move location to $XDG_CACHE_HOME/oak/practice/<session_id_prefix>/comms-watch.json. Migrate legacy UUID-list to new format on first read. TDD cycle: failing test for new-format roundtrip + legacy-migration; product impl; reviewer dispatch (code-expert + type-expert + architecture-expert-wilma). One commit."
    status: pending
    depends_on: [ws1-prerequisite-cli-auto-seed]
  - id: ws3-cleanup
    content: "WS3 — Cleanup. Remove .agent/state/collaboration/comms-seen/ directory from repo (~100 files, 3.2 MB). Drop legacy-location compat read in CLI. Update start-right-team SKILL §0 + reference/comms-watch-mechanism.md to remove the manual re-seed instruction (now obsolete since auto-seed handles cold-start). Reviewer dispatch (docs-adr-expert + onboarding-expert). One commit."
    status: pending
    depends_on: [ws2-storage-redesign]
isProject: false
---

# Comms-Watch Seen-State Storage Redesign

**Last Updated**: 2026-05-25
**Status**: 📋 EXECUTABLE / QUEUED — promoted from the closed
`practice-infrastructure-hardening-program.plan.md §P5.W1` strategic
substance at consolidation archival 2026-05-25.
**Scope**: WS2 (storage redesign) + WS3 (cleanup) of the comms-watch
trilogy. WS1 (CLI auto-seed) landed at `75e47923` and is the load-bearing
prerequisite for WS2 + WS3.

---

## Context

The comms-watch CLI is `agent-tools/src/collaboration-state/cli-comms-watch.ts`
plus the auto-seed module at `comms-watch-auto-seed.ts` (landed Cycle 9,
`75e47923`). The watcher reads the comms event directory at
`.agent/state/collaboration/comms/`, emits new events to stdout, and tracks
which event IDs it has already emitted in a per-agent seen-file at
`.agent/state/collaboration/comms-seen/<agent>.json`. WS1 cured the cold-
start backflood failure mode by auto-seeding the seen-file on empty/missing.
WS2 + WS3 cure the four remaining problems with the seen-state substrate.

This plan was hand-promoted at consolidation archival of the
hardening-program parent (see archive supersession mapping at
`.agent/plans/agentic-engineering-enhancements/archive/completed/README.md`).
The strategic substance below is lifted verbatim from the hardening program
§P5.W1 to preserve the multi-dimension problem statement and the
reviewer-pass framing that originally surfaced it.

## Problem (four dimensions, lifted from hardening §P5.W1)

1. **Wrong primitive** — UUID checklist vs timestamp watermark. Current
   shape enumerates every UUID ever seen (~1660 entries in some files,
   unbounded growth); natural primitive is a single mtime watermark
   (O(1) per tick, O(1) re-seed).
2. **Committed seen-files create git churn**. Each agent's
   `.agent/state/collaboration/comms-seen/<agent>.json` grows
   monotonically and lives in git; closed-out agents leave stale files;
   non-trivial fraction of repo growth over months. Current count: ~100
   files, ~3.2 MB on disk; recurring `chore(hygiene): land noise tail`
   commit pattern (15+ examples in branch history) is the symptom.
3. **Manual re-seed is fragile**. Every resume-protocol substrate bridge
   prescribes `ls .agent/state/collaboration/comms/ | sed 's/\.json$//' > <seen-file>`;
   forgetting = backflood; recur-prone (observed multiple times in
   single sessions before WS1 cure). WS1 fixed the cold-start case; the
   manual instruction still lives in `start-right-team` SKILL §0 and
   `comms-watch-mechanism.md` until WS3 strips it.
4. **Action-to-impact mismatch**. Watcher's job is *"emit events newer
   than my position"*; natural state is *"the last position"*, not
   *"enumerate what's old to derive what's new"*.

## End Goal

A future agent attaching the comms watcher gets:

- O(1) seen-state per agent regardless of event count.
- Zero seen-state in the repo; per-session ephemeral storage in
  `$XDG_CACHE_HOME/oak/practice/<session_id_prefix>/comms-watch.json`.
- Structurally-impossible backflood (auto-seed handles missing-file;
  mtime watermark handles position recovery).
- Documentation surfaces (`start-right-team` SKILL §0 +
  `comms-watch-mechanism.md`) describe the new shape with no obsolete
  manual re-seed instructions.

## Mechanism

The new storage shape and location replace UUID-list-in-repo. Legacy
UUID-list files migrate on first read (one-time, single-tick cost).
Documentation updates are forced by the implementation change, not
patched separately — exactly the structural cure shape from
`.agent/directives/metacognition.md §Cure Shape — Structural, Not
Doc-Patch`.

## Means (workstreams)

### WS1 — CLI auto-seed (PREREQUISITE, LANDED)

Status: COMPLETED at `75e47923` via post-m1-attestation-tidy-up.plan.md
cycle 9. No further work; recorded here as context.

Substance: `--seed-from-now` flag + auto-seed-on-empty/missing default +
`--no-auto-seed` opt-out. See `agent-tools/src/collaboration-state/comms-watch-auto-seed.ts`
and `agent-tools/tests/collaboration-state/comms-watch-auto-seed.unit.test.ts`.

### WS2 — Storage redesign (mtime watermark + XDG cache)

**TDD cycle** (one commit; tests + product code land together):

1. **Failing test** — author `agent-tools/tests/collaboration-state/seen-state-storage.unit.test.ts`
   covering:
   - New-format roundtrip: writing `{ last_seen_mtime: ISO,
     last_seen_filenames: string[] }` and re-reading recovers the exact
     shape.
   - Legacy migration: writing a legacy UUID-list file at the new
     location and reading it produces the new-format shape on first
     read (one-time-migration semantics).
   - Path resolution: `$XDG_CACHE_HOME` honoured when set; default to
     `$HOME/.cache` when unset; `<session_id_prefix>` segment appears
     in the path.
   - Idempotent re-read: reading the same file twice produces identical
     result without side-effects on disk.
2. **Product code** — implement the storage primitive (likely
   `agent-tools/src/collaboration-state/seen-state-storage.ts`) with a
   narrow IO surface (Pick-typed; tests substitute a tiny fake per the
   pattern established in `comms-watch-auto-seed.ts`).
3. **Wiring** — wire the new primitive into `cli-comms-watch.ts` and
   `comms-watch-auto-seed.ts`. The auto-seed module already lives at
   the right abstraction layer; the storage primitive plugs in beneath
   it.
4. **Reviewer dispatch** (pre-marshal): `code-expert` + `type-expert` +
   `architecture-expert-wilma`. Absorb verdicts; re-author if any
   reviewer returns NO-GO with substance.
5. **Pre-marshal verification** (workspace-scoped per the marshal-only
   `pnpm check` protocol): `pnpm --filter @oaknational/agent-tools test
   && type-check && lint`.

**Acceptance** (WS2 specific):

- Storage primitive tests pass (all the above shapes).
- Watcher functions against new location: a session running the watcher
  produces no events from `.agent/state/collaboration/comms-seen/`
  (verifiable: `ls -la .agent/state/collaboration/comms-seen/<my-agent>.json`
  returns no modification during the session).
- Legacy UUID-list files at the OLD location still readable by the
  CLI's legacy-location compat read (which WS3 drops).
- Workspace gates GREEN: `pnpm --filter @oaknational/agent-tools test
  && type-check && lint`.

**Files in scope** (additive + minimal modification):

- New: `agent-tools/src/collaboration-state/seen-state-storage.ts`
- New: `agent-tools/tests/collaboration-state/seen-state-storage.unit.test.ts`
- Modified: `agent-tools/src/collaboration-state/comms-watch-auto-seed.ts`
  (storage call sites)
- Modified: `agent-tools/src/collaboration-state/cli-comms-watch.ts`
  (path resolution + storage call sites)

### WS3 — Cleanup (remove committed seen-files + doc updates)

**Depends on WS2 landing.**

**TDD cycle** (one commit):

1. **Failing test** — author or extend a test asserting the CLI no
   longer attempts to read `.agent/state/collaboration/comms-seen/`
   (the legacy-location compat path is gone).
2. **Product code** —
   - Remove `.agent/state/collaboration/comms-seen/` directory from the
     repo (~100 files, 3.2 MB).
   - Drop legacy-location compat read in the CLI; remove the read
     fallback to the old location.
   - Update `start-right-team` SKILL §0 (`.agent/skills/start-right-team/SKILL-CANONICAL.md`):
     remove the manual re-seed instructions; describe the new
     auto-seeded XDG-cache shape.
   - Update `.agent/reference/comms-watch-mechanism.md` to describe the
     new storage location, format, and lifecycle.
3. **Reviewer dispatch** (pre-marshal): `docs-adr-expert` (SKILL prose
   alignment + reference doc accuracy) + `onboarding-expert` (new-agent
   path through the docs).
4. **Pre-marshal verification**: workspace-scoped gates as in WS2.

**Acceptance** (WS3 specific):

- `git ls-files .agent/state/collaboration/comms-seen/` returns empty.
- Repo-wide `grep -r "comms-seen" .agent/skills .agent/reference` returns
  zero hits naming the OLD instruction (any reference is in
  archive-class content).
- The CLI no longer falls through to the legacy location.
- SKILL §0 + reference doc match the implementation.
- Workspace gates GREEN.

**Files in scope**:

- Removed (committed deletion): `.agent/state/collaboration/comms-seen/`
  directory and all its contents.
- Modified: `agent-tools/src/collaboration-state/cli-comms-watch.ts`
  (drop legacy compat).
- Modified: `.agent/skills/start-right-team/SKILL-CANONICAL.md` §0.
- Modified: `.agent/reference/comms-watch-mechanism.md`.

## Prerequisite Classification

- **Blocking**: WS1 (CLI auto-seed) — LANDED at `75e47923`. Without
  auto-seed the WS3 doc updates cannot drop the manual re-seed
  instruction without regressing the cold-start contract.
- **Blocking**: WS2 must land before WS3 — WS3 removes the legacy
  location which WS2's compat-read uses during the migration window.

No external blockers. No beneficial-only prerequisites.

## Acceptance Criteria (whole plan)

- All WS2 + WS3 cycles landed.
- Zero references to `.agent/state/collaboration/comms-seen/` in repo
  source (verifiable: `git ls-files .agent/state/collaboration/comms-seen/`
  returns empty AND `grep -rn "state/collaboration/comms-seen"
  .agent/skills .agent/reference agent-tools/src` returns zero hits in
  live surfaces).
- Watcher functions against the new XDG-cache location across a fresh
  session (manual verification: run watcher, observe new-location file
  created, no in-repo writes).
- Legacy UUID-list files at the OLD location (in agents' local working
  trees during the migration window) migrate cleanly on first read with
  no data loss.
- `start-right-team` SKILL §0 + `comms-watch-mechanism.md` describe the
  new shape with no obsolete manual re-seed instructions.

## Non-Goals

- **Comms event archival or `comms/` directory restructuring** — owner
  corrected this misframing during Cycle 15 of the parent tidy plan.
  Comms-events are a critical durable resource; their lifecycle is
  handled by `consolidate-docs` §3a retention discipline, not by this
  plan.
- **Inotify / FSEvents migration** — polling stays; the storage
  redesign does not change the watcher's event-detection mechanism.
- **Watcher self-exclusion logic** — unchanged; identity-tuple-based
  self-exclusion is correct and stays.
- **Multi-machine state sync** — out of scope; per-session ephemeral
  is the right shape.
- **Per-event emission format** — unchanged.
- **Migration of existing committed seen-files into the new XDG
  location** — explicitly NOT migrated; deleted in WS3. The
  auto-seed-on-missing path handles fresh-machine startup.

## Risks (per hardening §P5.W1)

- **Mid-migration two-format coexistence** — low; bugs self-correct
  after one tick.
- **Per-session ephemeral state lost on machine reboot** — low; auto-
  seed-on-missing IS the recovery path.
- **Cross-platform cache-dir conventions** — low; default
  `${XDG_CACHE_HOME:-$HOME/.cache}` works on Linux + macOS (and Windows
  via WSL).
- **Two concurrent watchers from same session-id-prefix** — low; path
  includes prefix; detect-and-error on second open if collision
  observed in practice.
- **Removal of committed seen-files breaks external consumer** — low;
  grep the repo before WS3 to verify no external code reads the old
  location.

## Foundation Alignment

- **PDR-027** — identity tuple drives `session_id_prefix` segment in
  the XDG cache path.
- **PDR-066** — comms-event-failure-mode-channel; this plan does NOT
  touch the comms-event substrate.
- **ADR-183** — comms-event tag-namespace; not extended by this plan.
- **`consolidate-docs` Cardinal Rule** — operational plans are not
  permanent documentation; the storage spec lives in
  `comms-watch-mechanism.md` after WS3, not here.
- **`metacognition.md` §Cure Shape — Structural, Not Doc-Patch** —
  WS3's doc updates are FORCED by WS2's implementation change, not
  patched separately.

## Plan-Body First-Principles Check

Per `.agent/rules/plan-body-first-principles-check.md`: this rule fires
BEFORE executing any cycle's tests, implementation, or doctrine moves.

- **Shape**: the proposed two cycles match the work shape (storage
  primitive + integration; cleanup + docs). Decomposition is the natural
  one (WS2 changes how state is stored; WS3 removes the old location and
  aligns docs). No invented serial dependencies.
- **Landing path**: each cycle is one commit; tests + product code land
  together; workspace gates green at end of each.
- **Vendor literal**: no vendor SDK calls; storage primitive uses
  local-FS via node `fs.promises`. No vendor-shape literals to verify.

## Readiness Reviewers

Before marking this plan `READY FOR EXECUTION`:

- `assumptions-expert` — plan-readiness and proportionality.
- `architecture-expert-wilma` — adversarial probe on the storage-shape
  decisions (mtime watermark vs. filename array; migration shape).
- `type-expert` — discriminated union of legacy vs new format on the
  read path.

Reviewer dispatch happens at WS2 execution start, not now.

## Learning Loop

This plan's completion (both WS2 + WS3 landed + acceptance criteria
met) triggers a closeout pass that:

- Runs `consolidate-docs` if any of its triggers fire (likely:
  a plan / milestone has closed).
- Updates `.agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md`
  to record the comms-watch trilogy completion.
- Extracts any operational learnings from the storage redesign into
  napkin → distilled → graduated as appropriate.

## Lifecycle Triggers

- **On WS2 landing**: surface the legacy migration evidence in napkin so
  a future agent debugging cache state has the migration window
  documented.
- **On WS3 landing**: this plan moves to `archive/completed/` with a
  supersession-mapping entry in
  `.agent/plans/agent-tooling/archive/completed/README.md` (or create
  if absent). `cost-of-collaboration.plan.md` back-pointer (added at
  consolidation archival) is updated to mark the storage-redesign
  follow-on completed.

## Cross-references

- **Strategic source**: `practice-infrastructure-hardening-program.plan.md
  §P5.W1` (now archived at
  `.agent/plans/agentic-engineering-enhancements/archive/completed/`
  after the 2026-05-25 consolidation; supersession mapping records this
  plan as the executable home for WS2 + WS3).
- **WS1 prerequisite landing**: `75e47923`
  (`feat(agent-tools): comms-watch auto-seed + --seed-from-now/--no-auto-seed
  flags (tidy cycle 9)`).
- **Sibling agent-tools plan**: `cost-of-collaboration.plan.md` —
  `ws-p2-comms-watch` is the original watcher landing; this plan is the
  storage-shape follow-on. Back-pointer added to that plan at
  consolidation archival.
- **Documentation surfaces updated by WS3**:
  `.agent/skills/start-right-team/SKILL-CANONICAL.md` §0;
  `.agent/reference/comms-watch-mechanism.md`.

## Out of Scope This Plan

- Comms event substrate (unchanged).
- Heartbeat mechanism (WS-10 of hardening; re-homed to
  `cost-of-collaboration.plan.md` at consolidation archival).
- Multi-platform watcher portability beyond Linux + macOS (covered by
  the XDG default).

---

— Plan promoted from `practice-infrastructure-hardening-program.plan.md
§P5.W1` strategic substance at 2026-05-25 consolidation archival;
authored by Hushed Stalking Shade (`bc0a07`, claude-opus-4-7).
