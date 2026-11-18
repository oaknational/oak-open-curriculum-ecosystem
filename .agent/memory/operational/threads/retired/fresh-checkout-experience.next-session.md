---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
> **RETIRED — thread completed 2026-07-20.** PR #436 merged
> (`SHA:792c440dd`), PR #439 merged (`SHA:7f55236c7`), and the residual
> #437 work was explicitly routed out of this thread. Retained as
> continuity history; not a live lane.
> Not listed in `repo-continuity.md` Active or Paused threads.

# Thread: fresh-checkout-experience — next-session record

Deep handoff per the Resonance `wrap` programme (owner-directed, 2026-07-20).
Author seat: **Deimos tracks Perigee** (claude / Fable 5 / 73e4ab), session
2026-07-20, working from a fresh secondary clone of this repository (the
"deconstruction" checkout, distinct from the primary estate's checkout).
Cast: n=2 with **Vanilla binds Bough** (f3599e, retired ~14:50Z with a
consolidated handoff on the comms stream); cross-machine coordination with
**Forge rides Brimstone** (398e24), Director of the primary estate's checkout,
over the owner-sanctioned SSH channel into the sibling primary-estate
checkout (its repo-relative `.agent/state/collaboration/comms/` stream).

## Landed state (all first-hand-verified at write time)

- **PR #436 MERGED** (19:18:23Z, merge `SHA:792c440dd`; tip `SHA:1524a556f`
  confirmed ancestor of origin/main). The fresh-checkout DX + error-doctrine
  slice: seed-bearing verify-then-seed ENOENT errors on all reader and
  claims-lifecycle paths; `state-file-readers.ts` with an injectable
  `ReadTextFile` seam (ADR-078); the single-throw-edge doctrine realised
  (`unwrapOrThrow` and a laundering-free `raise` in `@oaknational/result`,
  carrying the owner-authored eslint approval marker — the repo hook forbids
  agents authoring that marker, correctly, and blocked this seat twice);
  non-Error throwables CRASH at detection (TypeError, original as `cause`);
  the race-safe home-derived seeding block in
  `.agent/skills/start-right-quick/shared/start-right.md`. Ten review
  rounds, 26 threads,
  every finding fixed-with-evidence or refuted-with-evidence; Phase-8
  post-merge harvest CLEAN. Lint landed exactly at main's then-baseline.
- **PR #439 OPEN, auto-merge ARMED** (verified `enabledAt 19:21:25Z`;
  `BLOCKED` pending GitHub requirements under the post-queue ruleset). Carries
  the exploration report
  `.agent/reports/fresh-checkout-experience-concept-exploration-2026-07-20.md`
  (six review findings fixed at `SHA:95b706bb4`) plus this seat's attributed
  napkin addendum. Origin branch has advanced past local (a drain-side fold —
  safe; nothing local unpushed). If it wedges on a never-fires context, that
  is ruleset governance at Forge's seat (stand-down note `96d37177` names it).
- **PR #437 OPEN (ready for review), NOT this thread's work**: Vanilla's WAD
  projection. Since this record was authored it has been un-drafted and
  conflict-folded on the primary estate (merge commit `SHA:ec7d2a856`; the
  colliding ADR renumbered to ADR-215); 29 review threads await
  adjudication, routed on the primary estate's Director board. Forge's
  board-to-zero message (19:34Z) assigned it toward this seat, but the
  owner's direct wrap-and-stand-down instruction superseded; routed back
  explicitly (comms event `96d37177`).
- **WAD repo**: both PRs merged (verified); the optional main tag remains the
  owner's call.

## Owner rulings this session (doctrine-grade; napkin carries them for graduation)

1. **Error philosophy**: nothing handles an error better than a loud,
   destructive exception given observability and fast-safe fixes; code that
   replaces useful information with comfortable lies is deleted on sight
   (the `toError` unknown-laundering deletion is the worked instance).
2. **Result<T, E> means single-throw-location**, not never-throw: all throws
   route to `@oaknational/result`'s `raise` edge, thrown with the cause chain
   intact; that ONE location carries the owner-authored lint allowance — the
   only place it exists or is needed.
3. **Non-Error throwables crash**: a caught value that is not an `Error`
   instance is the system reporting a problem — listen, never accommodate
   (structural/cross-realm accommodation was explicitly overruled).
4. **No worktrees for this work** — primary checkout only (mid-session
   correction after two worktree cycles).
5. **No workarounds for vendor limits**: the merge queue was removed rather
   than worked around when CodeQL/SonarCloud could not report on merge groups.
6. **PDR-131 (primary estate, owner-ratified, relayed by Forge)**: merge
   concurrency is free; serial slots retired; settled-READY + green means arm
   auto-merge under the standing Director grant; strict-currency dropped.

## The exploration thread (the session's intellectual spine)

Report (rides #439): four-movement output, jointly authored and adversarially
reviewed with Vanilla. Load-bearing results: the failure taxonomy
(loud-cryptic < doc-known < silent-wrong), one-property-two-faces (the
untracked substrate's branch-survival IS the homing hazard), and proposals
1–6 — **proposal 1 realised (PR #436); 2, 2b, 3 (re-scoped: stop DEFEATING
the existing home-derivation — the doctrine's own canonical invocations
mandate explicit relative `--comms-dir`), 4 (self-suppressing advisory), 5,
and 6 (bootstrap seed-if-primary, interlocked with 3) are OWNER-GATED
candidates, not accepted architecture.** The unresolved-evidence list
includes the intermittent silent `comms send` failure — mechanism partially
isolated (this seat's own event-id grep filter masked the loud error; the
underlying intermittent failure reproduced twice, cause unfound).

## Successor guidance

- Read the comms stream in BOTH homes: this checkout's
  `.agent/state/collaboration/comms/` (the n=2 session record) and the
  sibling primary-estate checkout's `.agent/state/collaboration/comms/`
  (cross-machine coordination with Forge; this seat's events run
  team-start `dba4259f` through stand-down `96d37177`).
- Fresh-checkout seeding: follow the updated
  `.agent/skills/start-right-quick/shared/start-right.md` fresh-checkout block —
  home-derived, guarded, race-safe; the seed shapes' SSOT is
  `agent-tools/src/collaboration-state/state-file-seeds.ts`.
- Known traps this session recorded in the napkin: zsh EQUALS expansion of
  unquoted leading-`=` separator tokens; grep-filtered send verification (never pipe
  the command whose outcome you need); pre-queue-enablement auto-merge arms
  not converting to queue entries (blocking re-enqueue until disarmed); the
  post-branch-switch stale-dist bootstrap brick (skip-bootstrap install,
  filtered result build, then full install).

## Metaloss recursion (wrap programme step 6, run to fixed point)

- **Compressed reasoning**: the ten-round review arc is compressed here to
  outcomes; the round-by-round reasoning survives in the PR threads
  (26 on #436, 12+ on #439), each disposition self-contained — decision
  sufficient. The step-back verdicts (two firings; the second terminal) are
  recorded in commit `SHA:1524a556f`'s message and PR #436's description.
- **Promises sweep**: the slot contract with Forge — superseded by PDR-131
  (their own message); "#439 outcomes reported here" — forwarded to Forge
  with a named condition (wedge means their seat) in `96d37177`; the napkin
  addendum for Vanilla — landed (rides #439); the exploration retest of the
  silent-send — recorded in the report's unresolved evidence; #437 — routed
  back with an explicit non-transfer. Zero silent drops found on a second
  pass.
- **Attribution inferences (flagged as inference, not observation)**: that
  the #436 cascade-merge was triggered by queue-rule removal is Forge's
  account, not observed; that the #439 branch fold `SHA:f48b787e9` was drain-side
  is inferred from timing; Vanilla's internal reasoning is known only through
  their broadcasts.
- **Blind-spot bounds**: two comms-watcher dead-windows existed (hourly
  backstop deaths); events inside them were recovered by sweep, but the
  notification-path loss window is structural. The code-expert subagent's
  full analysis lives only in its transcript; its load-bearing findings were
  absorbed into commits. The first silent-send failure's root cause is
  unrecoverable by construction (the evidence was destroyed by the filter).
- **Index of homes**: this record (the successor's entry point), then the
  napkin (this session's lesson entries), repo-continuity (compact lane
  pointer), the PR threads (review reasoning), both comms streams
  (coordination record), the exploration report (proposals and evidence),
  and git history (fourteen commits, SHA-prefixed here and in the napkin).
- **External bound**: this scan is the seat's self-model; its error
  signature this session was consistent — the OWNER caught what the
  self-scan missed (the laundering helper, the why-question, the worktree
  topology, the accommodation instinct), and the REVIEW BOT caught the
  self-model's local blindnesses (the doc block contradicting its own
  warning; the identity hole reintroduced one layer up). Successors: point
  external scrutiny at whatever this seat has just built, not at what it has
  just read.
- **Fixed point**: a further pass would only re-find the watcher
  dead-windows and the destroyed first-failure evidence already named — the
  recursion closes here.
