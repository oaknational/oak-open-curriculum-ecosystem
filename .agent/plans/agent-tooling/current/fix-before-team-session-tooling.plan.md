---
name: "Fix-Before-Team-Session Tooling (F-94 + F-95)"
overview: "Two bootstrap/handoff-integrity tooling fixes the next team session needs in place before it starts: claims adopt/set-handoff (F-94) and a comms-watcher-presence gate (F-95)."
todos:
  - id: wsa-a0-type-export
    content: "WS-A A0: add handoff_record_path to CollaborationClaim type + export assertClaimMatches. One commit."
    status: completed
  - id: wsa-a1-set-handoff-happy
    content: "WS-A A1: setHandoffPathOnClaims sets the field on the matching row, length unchanged. One commit."
    status: completed
    depends_on: [wsa-a0-type-export]
  - id: wsa-a3-set-handoff-shape
    content: "WS-A A3: assertHandoffPathShape rejects traversal/absolute/wrong-dir, accepts .md and .json under handoffs/. One commit."
    status: completed
    depends_on: [wsa-a1-set-handoff-happy]
  - id: wsa-a5-adopt-rewrite
    content: "WS-A A5: adoptClaims rewrites agent_id in place, no new row; preserves handoff_record_path/role/claimed_at. One commit."
    status: completed
    depends_on: [wsa-a0-type-export]
  - id: wsa-wire
    content: "WS-A wire: register claims:adopt + claims:set-handoff (specs/help/options/usage); add 'path' to KNOWN_OPTION_KEYS. One commit."
    status: completed
    depends_on: [wsa-a1-set-handoff-happy, wsa-a5-adopt-rewrite]
  - id: wsa-integration
    content: "WS-A integration: fail-loud on unknown/closed claim (A2/A6/A9); duplicate-row rewrite (A7); adopter-identity-not-retiree (A8); set-handoff idempotency (A4). Via runCollaborationStateCli. One or more commits, each green."
    status: completed
    depends_on: [wsa-wire]
  - id: wsa-skill-docsync
    content: "WS-A doc-sync: start-right-team move-7 references claims adopt for handoff-carrying pickups (PDR-063/ADR-182). One commit."
    status: completed
    depends_on: [wsa-integration]
  - id: wsb-b1-classifier
    content: "WS-B B1: pure classifyWatcherPresence + path derivers; exhaustive over the 5 staleness kinds + the stale-no-emit mtime-grace boundary. One commit."
    status: completed
  - id: wsb-b2-stat-io
    content: "WS-B B2: production WatcherStalenessIo adapter (fs.stat -> mtimeMs / 'missing' on ENOENT, rethrow else; readFile). One commit."
    status: completed
  - id: wsb-b3-assert-subcommand
    content: "WS-B B3: comms assert-watcher-live subcommand + wiring + integration. One or more commits, each green."
    status: completed
    depends_on: [wsb-b1-classifier, wsb-b2-stat-io]
  - id: wsb-b4-claims-open-gate
    content: "WS-B B4: hasOtherLiveAgents extraction + claims-open watcher precondition (solo-safe). One or more commits, each green."
    status: completed
    depends_on: [wsb-b1-classifier, wsb-b2-stat-io]
  - id: wsb-b5-docsync
    content: "WS-B B5: rule §Enforcement present-truth; start-right-team move-1 mechanical step; reconcile stale comms-watch-hang-hardening c2. One commit."
    status: completed
    depends_on: [wsb-b3-assert-subcommand, wsb-b4-claims-open-gate]
  - id: reviews-gates
    content: "Adversarial reviews (code/type/test/security/architecture); full gates one at a time; release-readiness."
    status: completed
    depends_on: [wsa-skill-docsync, wsb-b5-docsync]
isProject: false
---

# Fix-Before-Team-Session Tooling (F-94 + F-95)

**Last Updated**: 2026-06-25
**Status**: 🟢 LANDED (branch `fix/fix-before-team-session-tooling`, off `origin/main`; owner controls push/PR)
**Scope**: Two agent-tooling fixes that guard bootstrap/handoff integrity from a team session's first moves — landed before the next team session.

> **Landed 2026-06-25.** WS-A `9fe9a3741`/`d6e468801`/`a009917e8`/`40cfec00b`;
> WS-B `d27453500`/`157cf3f6d`/`aee0c5271`/`a3486fe08`/`f3e45eef1`; review
> hardening (TOCTOU/exhaustiveness/path-guard, all findings verified first-hand)
> `e5c42da07`. All gates green; both features smoke-verified end-to-end through
> the built binary. **Open follow-up:** retire F-94/F-95 in `frictions-register.md`
> — those entries live on the pilot continuity branch, not `origin/main`, so the
> retirement is a consolidation-session task on the branch that owns the register
> (doing it here would conflict).

---

## Context

The worktree-pilot (closed out 2026-06-25) surfaced two founding failures the
owner flagged as the strongest "fix-before the team session" items, because
both bite from the first moves, before the in-session tooling-fix seat exists:

- **F-95** — "arm the all-channels comms watcher as move 1" is a prose rule
  backed only by agent diligence. An implementer skipped it under
  ceremony-aversion, went **blind to a simultaneous identical-branch claim**,
  and never re-armed. Nothing failed fast.
- **F-94** — a PDR-063 mid-cycle role handoff needs the successor to adopt the
  retiring agent's claim and the retiring agent to record a handoff-record
  path, but `claims` has no `adopt` / `set-handoff`. Reusing `--claim-id` on
  `claims open` created a **duplicate active-claims row**; hand-editing the
  registry is unsafe in a busy multi-writer window.

### Existing capabilities (built on, not duplicated)

- `updateActiveClaimsFile` (`state-io.ts`) — locked, optimistic-retry,
  schema-validated atomic write. All registry mutations go through it.
- `heartbeatClaim` / `assertClaimMatches` (`cli-claim-commands.ts`) — the
  correct map-and-update + fail-loud pattern for a claim-by-id mutation.
- `detectStaleWatcher` (`watcher-staleness.ts`) — 5-state liveness classifier
  (`live`/`stale-aged`/`stale-no-emit`/`absent`/`malformed`), injected
  `WatcherStalenessIo`, explicit `nowMs`. F-95 is its first production consumer.
- The watcher heartbeat is **already default-on** (git `0a1e07d71`,
  2026-06-10) — F-95 has no blocking dependency on `comms-watch-hang-hardening`.
- `assertNoLiveIdentityRoutingCollision` (`active-agents.ts`) — already at the
  `claims open` write boundary; B reuses its private liveness notion.

---

## Design Principles

1. **Mechanical, not diligence** — F-95's gate sits on the dangerous action
   (`claims open`) so the founding failure is structurally impossible, not
   merely discouraged. Resolved by the Decision Lenses (1 + 2 decisive).
2. **Single source of truth for liveness** — reuse `detectStaleWatcher` and the
   existing live-agents predicate; no second staleness/freshness implementation.
3. **Single-responsibility commands** — `adopt` and `set-handoff` are distinct
   PDR-063 moments (no mode-flag optionality); `adopt` mutates only `agent_id`.
4. **Solo-safe** — the bootstrap fast-path (no other live agents) is preserved;
   solo/n=1 sessions are never blocked.

**Non-Goals (YAGNI)**:

- Mid-session watcher-death detection — that is WS-2 of
  `agent-experience-improvement.plan.md` (cycle-boundary liveness).
- Stale-state sweep/cleanup — that is F-69.
- De-duplicating historical duplicate claim rows — a separate janitor concern.
- Clearing `handoff_record_path` on adopt — PDR-063 Pickup Item 4 makes clearing
  a separate, later, deliberate act.

---

## Reviewer Scheduling

- **Plan-phase**: completed in plan mode (3 Explore + 2 Plan subagents; all
  load-bearing claims re-verified first-hand). Purely internal — no vendor
  build-vs-buy attestation required.
- **Mid-cycle**: `test-expert` + `type-expert` after each RED/GREEN;
  `security-expert` after the `adopt` identity-rewrite and the watcher gate
  (coordination-safety control); `architecture-expert` on the claims↔watcher
  coupling at the open boundary; `code-expert` as gateway.
- **Close**: `docs-adr-expert` (doc-sync drift), `release-readiness-expert`.

All reviewer findings are verified first-hand before acting.

---

## WS-A — F-94: `claims adopt` + `claims set-handoff`

Surface:

- `claims adopt --active <p> --claim-id <id> --platform <p> --model <m>` —
  rewrites the matching row's `agent_id` in place; never adds a row.
- `claims set-handoff --active <p> --claim-id <id> --path <p>` — sets
  `handoff_record_path` on the matching row.

Both fail loud via the exported `assertClaimMatches`; write through
`updateActiveClaimsFile`; never hand-edit.

New module `cli-claim-handoff-commands.ts` holds `adoptClaims`, `adoptClaim`,
`setHandoffPathOnClaims`, `setHandoffClaim`, `assertHandoffPathShape`.

**A0 (prereq)** — add `readonly handoff_record_path?: string;` to
`CollaborationClaim` (`types.ts`); `export assertClaimMatches`. Red: round-trip
test proves the field is type-visible and preserved.

**A1 / A3 / A4 (set-handoff)** — sets field (length unchanged); shape guard
(repo-root-relative, under `.agent/state/collaboration/handoffs/`, extension
open — accepts `.md` and `.json`; **no existence check**); idempotent overwrite.

**A5 / A7 (adopt, pure)** — rewrites `agent_id` only, length unchanged (explicit
anti-append assertion `next.claims.length === claims.length`); over historical
duplicate rows, rewrites all matches, adds none.

**A-wire** — register `claims:adopt` + `claims:set-handoff` in `cli-specs.ts`;
help in `cli-spec-help.ts`; option sets in `cli-spec-options.ts`; add `'path'`
to `KNOWN_OPTION_KEYS` (`cli-options.ts`); add both to `cli.ts` `usage()`.

**A-integration** — via `runCollaborationStateCli`: A2/A6/A9 fail-loud
(unknown/closed claim → exit 2, file unmutated); A8 adopter's derived identity
lands (different env), not the retiree's.

**A-skill-docsync** — `start-right-team` move-7 references `claims adopt` for
handoff-carrying pickups (PDR-063 / ADR-182).

`adopt` uses `resolveIdentity(options, env)`; **no** `--now`; does **not** run
`assertNoLiveIdentityRoutingCollision` (a takeover legitimately replaces the
row's identity) — documented in the handler so a reviewer does not re-add it.

---

## WS-B — F-95: comms-watcher-presence gate (A + B)

Shared pure core (`watcher-presence.ts`), reused by both surfaces:

- `classifyWatcherPresence(...)` → `WatcherPresenceVerdict` over
  `detectStaleWatcher`'s union. Block policy: `live → present`;
  `stale-aged|absent|malformed → blind`; **`stale-no-emit → present only if the
  heartbeat mtime is fresh (≤ 3× interval), else blind`** — `detectStaleWatcher`
  returns `stale-no-emit` before its mtime check, so the gate applies the
  secondary mtime check (a started-then-frozen never-emitter must not pass).
  Type-expert to confirm whether to widen `detectStaleWatcher` to carry `agedMs`
  on that branch (single liveness home) vs the gate computing mtime.
- Pure derivers `commsSeenFileForCodename`, `heartbeatFileForSeen` (reuse the
  single `.heartbeat.json` suffix constant exported from `cli-comms-watch.ts`).

**B1** — pure classifier + derivers, exhaustive over 5 kinds + grace boundary.

**B2** — production `WatcherStalenessIo` adapter (standalone module; do NOT
widen `CollaborationStateCliIo`, which deliberately excludes `stat`).

**B3 (Option A surface)** — `comms assert-watcher-live` subcommand: resolves
this session's heartbeat path (codename via `resolveSelfIdentity`; env read once
at entry) or `--heartbeat-file`; runs `detectStaleWatcher` +
`classifyWatcherPresence`; throws (exit 2) with a fix instruction when `blind`.
Registered in the CLI. Wired into `start-right-team` move-1.

**B4 (Option B surface, load-bearing)** — extract
`hasOtherLiveAgents(registry, nowIso, selfRoutingKey)` from `active-agents.ts`'s
private liveness logic; new `claims-open-watcher-gate.ts`; in `openClaim`, **as a
read-only precondition before `updateActiveClaimsFile`** (NOT inside the locked
retry transform): if no other live agents → return (fast-path); else classify
this session's watcher and throw if `blind`. Add `runtime` param to `openClaim`;
thread `comms-seen-dir` + heartbeat-interval options. Load-bearing test:
**solo + absent watcher → claim opens**.

**B5 (doc-sync, no-tombstones)** — rewrite `comms-all-channels-watcher.md`
§Enforcement from "future hardening could add…" to present-truth; add the move-1
mechanical step to `start-right-team`; reconcile the stale
`comms-watch-hang-hardening.plan.md` c2 text.

---

## WS — Quality Gates

Run one at a time after each workstream and finally on the integrated delivery:

```bash
pnpm --filter @oaknational/agent-tools build
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
pnpm --filter @oaknational/agent-tools test
pnpm check   # repo aggregate
```

Plus the collaboration-state schema validator after schema/type touches. All
gates blocking. Owner controls push.

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Watcher armed under non-canonical codename / relocated heartbeat → gate sees `absent` and blocks a watching session | `--heartbeat-file` override on the A subcommand; document the codename-derived convention; do NOT add a B opt-out that weakens the guarantee unless a real false-block is observed |
| TOCTOU between the B precondition and the transactional open | Acceptable: `assertNoLiveIdentityRoutingCollision` inside the transform stays the authoritative concurrency guard; the watcher gate is a coarser precondition |
| `adopt` over historical duplicate rows | Rewrites all matching rows (honest `.map`); de-dup is out of scope |
| WS-A and WS-B both touch the shared registry files (`cli-specs.ts`, `cli-spec-help.ts`, `cli-spec-options.ts`) | Sequential execution on one branch (not parallel worktrees); each cycle one atomic commit |

---

## Dependencies

**Blocking**: none — built on `origin/main`; substrate verified present.

**Sequenced follow-up (NOT on this branch)**: the `frictions-register.md`
entries for F-94/F-95 live on the pilot continuity branch, not `origin/main`.
Retiring them (move to "Mitigated / Addressed" with this work's SHAs) is a
consolidation-session activity on the branch that owns the register, gated on
this code landing — doing it here would conflict with the pilot branch.

**Related plans**:

- `agent-experience-improvement.plan.md` — the AX umbrella; this plan is a
  fix-before sibling to its WS-1 (cli-ergonomics) and WS-2 (watcher liveness).
- `comms-watch-hang-hardening.plan.md` — WS-B B5 reconciles its stale c2 text.
