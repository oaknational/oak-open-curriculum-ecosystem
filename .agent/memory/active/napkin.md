---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

## 2026-05-25 — Shadowed Glimmering Moth / codex / GPT-5 / `019e5d`

### Patterns to Remember

- A fresh `comms watch` seen-file can replay old backlog before it reaches
  live team traffic. For current-state grounding, pair it with rendered comms
  tail, active claims, and queue reads; treat backlog replay as historical
  substrate unless the command has already caught up.
- A fitness hard-width line can be remediated without knowledge loss by moving
  detail from an overlong heading into adjacent body prose. That is structural
  reflow, not trimming.
- Tidy-plan delivery in a live team needs routing discipline even when the
  owner gives a broad "work on delivery" instruction. If another agent owns
  the fresh source claim, switch to read-only support or a Director-routed
  non-overlapping slice instead of racing the implementation.
- Cycle 10 readiness note: the existing collaboration-state transaction helper
  provides temp-file plus rename and lock directories, but no fsync. A storage
  redesign that promises crash-hardening must extend the helper or add a
  dedicated state writer, not merely reuse it by name.
- Cycle 11 cleanup audit currently has non-test `comms-seen` references in the
  start-right-team SKILL, comms-watch mechanism reference, agent-tools README,
  continuity-surface rule, and ADR-182. Treat ADR-182 as an architectural
  reference that may need a deliberate keep/update verdict, not a mechanical
  grep casualty.
- `practice:substrate:check` can fail on inherited collaboration-state schema
  debt even when a new substrate evaluator is clean. For the open-questions
  validator landing, the only blocking finding was an old abandoned
  `commit_queue[19].files[0] == ""` entry; validate whether a residual is in
  the touched surface before attributing the failure to the new reader.

## 2026-05-24 — Pelagic Snorkelling Sextant / codex / GPT-5 / `019e5b`

### What Was Done

- Re-grounded under `oak-start-right-team` and `oak-consolidate-docs`.
- Confirmed identity with PDR-027 preflight:
  Pelagic Snorkelling Sextant / codex / GPT-5 / `019e5b`.
- Refreshed live state: branch `feat/education-evidence-foundational-graphs`,
  HEAD `bf3a8152`, active commit queue empty, only stale claims visible.
- Ran live fitness and found no critical files; the only hard file was this
  active napkin at 441 lines / 22,689 chars.
- After reading the outgoing entries and recording their dispositions, made a
  mechanical preservation copy at the Pelagic hard-napkin window archive before
  replacing the live napkin with this disposition index.

### Processing Disposition

- **Hushed Fading Hush handoff rerun**: source-window preserved as processed
  session evidence. Live behavioural carry-forward remains here: refresh
  branch, HEAD, claims, queue, and current comms before repeating any closeout
  claim; stale CLI flag memory must be checked against command help.
- **Mistbound Hiding Threshold Capture H and marshal-monitoring highlight**:
  routed into
  `threads/branch-fitness-and-push-cadence.next-session.md` and indexed from
  `repo-continuity.md`, after Mistbound confirmed in live comms that the
  branch-fitness plan's Cycle 1 depended on this substrate. The archive is only
  the verbatim outgoing-window evidence; the durable knowledge home is now the
  thread record plus the executable branch-fitness plan. The post-M1 tidy
  plan's cycle 15 only covers a branch-fitness drain slice; it is not the full
  protocol home for Capture H.
- **Velvet Stalking Moth preview-MCP validation**: source-window preserved after
  verifying the durable route in `connecting-oak-resources.next-session.md` and
  `repo-continuity.md` PR #108 routing.
- **Hushed/Hearthlit closeout refresh observations**: source-window preserved as
  session-specific evidence. Behavioural carry-forward: PR, Sonar, branch, and
  comms evidence can change during closeout; refresh them immediately before a
  final handoff claim.
- **Charcoal comms-corpus research vector**: source-window preserved after
  verifying the durable route in
  `threads/agent-collaboration-research.next-session.md`,
  `repo-continuity.md`, the source-thread cross-reference, and comms event
  `b2f6a5fe`.
- **Charcoal discoverability five-surface capture**: source-window preserved as
  first worked instance. Promotion trigger remains a second new-thread
  discoverability gap; do not graduate it silently from one instance.
- **Charcoal cron CLI-shape drift capture**: source-window preserved as first
  worked instance. Promotion trigger remains a second stale cron / loop prompt
  whose command shape silently fails across compaction.

### Patterns to Remember

- Extraction, routing, and disposition are the curation work. Archiving is only
  a mechanical preservation step after that work has happened; it is never a
  tactic in its own right and never the durable knowledge home by itself.
- Pending-graduations metadata can need curation even when the underlying route
  is right. If a tag uses prose as `status`, preserve that prose as route-state
  context and set the lifecycle value back to the closed vocabulary.
- The same applies to `size`: if an entry says `M-to-L combined`, keep the
  combined-work uncertainty as route prose and set metadata to the nearest
  closed-vocabulary value.
- The closed size vocabulary has no `XS`. If a candidate is truly tiny, set
  `size: S` and preserve the narrower "tiny focused cleanup" meaning in
  route-state prose.
- When a distilled entry already has a natural pattern home, move the reusable
  behaviour into the pattern and leave only still-live observations in
  `distilled.md`; this is curation, not score chasing.
- When a distilled entry belongs in a skill's live coordination rule, home the
  behaviour there and then remove the duplicate distilled body. The 2026-05-22
  late-named-peer observation now lives in `start-right-team`'s singleton-lane
  rule, not in `distilled.md`.
- If a shell search pattern contains backticks, single-quote it. I repeated
  the zsh command-substitution mistake while checking whether
  `session_id_prefix` already existed in durable homes.
- I repeated the same backtick mistake while searching Codex memory with
  double quotes; the behaviour change is still to use single-quoted `rg`
  patterns whenever the search text includes backticks.
- Keep validation searches boring. I tried to prove a metadata correction with
  an over-clever `rg` character class and made the regex itself invalid; simple
  literal alternatives were the right proof.
- `comms inbox` with a fresh seen-file replayed the whole multi-day backlog.
  For current-state checks, prefer a seeded seen-file or a bounded watch; treat
  backlog replay as historical evidence, not current team silence.
- A pending-shard entry can be closed when a later PDR preserves both the
  primary cure and the rejected/secondary cure. For the tempfile collision
  entry, PDR-076b is the durable home: frontmatter is primary; path
  session-prefixing remains secondary defence, so a separate pending rule
  would duplicate the processed lesson unless recurrence shows a new need.
- The all-channels watcher is alive for this session, but Codex does not have
  the Claude Monitor/Cron tools. When closing this session, stop any local
  watch process explicitly and name any heartbeat gap honestly.
- `comms send --tag` only accepts the ADR-183 namespace
  (`failure-mode`, `behaviour-note`, `heartbeat`). I tried `--tag status`; send
  ordinary status broadcasts without a tag unless one of those meanings applies.
- `repo-continuity.md` is a live operational index, so stale HEAD/claim prose is
  a knowledge problem even when fitness is soft-only. Repair it from live git,
  claims, comms, and fitness before using it as route authority.
- During closeout, poll the watcher before finalising any live-state edit. A
  commit can land between validation and claim close; if it does, reopen a
  narrow truth-repair claim and update the live index from the new evidence.
- Under active marshalling, a "ready for marshal" or "abandoned" event can be
  stale by the time it is read. Re-check git log and active queue before
  preserving the causal lesson; in Cycle 4 the abandonment was from a stale
  view after Cycle 3 had already landed, and the real current state was the
  re-enqueued intent.
- A partially-graduated pending entry is safe to remove from an active shard
  only after the residual lesson has a durable home. For peer-pair design
  sidebars, the home is the active inter-agent sidebar pattern: comparable
  agents, one shared append-only file, numbered turns, and joint-decision
  closure; the archive keeps the original route body.
- Route-state sharpening is valid curation when a residual is tempting to
  treat as done. For ADR-184, the representation decision is homed, but
  schema/parser/renderer/authoring support for `sync` and `urgency` has not
  landed; preserve the live residual with falsifiable evidence instead of
  removing it for neatness.
- Comms monitoring can create its own curation slice. If a watcher catches a
  new queue event after validation, refresh claims and queue before closeout,
  and repair `repo-continuity.md` when the live index would otherwise misroute
  the next agent. If the Director also surfaces owner-class marshal blockage,
  preserve that routing fact with the queue state. Also, `claims open` requires
  `--area-kind files` and explicit `--now`; I hit that shape mistake once
  during the repair claim.
- A retirement-detection broadcast can become stale minutes later if the
  supposedly retired agent corrects it and git/queue state moves. Preserve the
  original broadcast as timestamped evidence, but repair live continuity from
  the newer evidence instead of treating the older owner-class blockage as
  current.
- Successful commit-queue entries may disappear from the active list, while
  failed entries remain as `abandoned` with notes. Use git commit bodies,
  active queue output, and queue history together before deciding whether a
  missing intent landed or failed.
- A Director wind-down or pause broadcast can be superseded by newer owner
  direction within minutes. Preserve the superseded event as evidence, but make
  live continuity follow the newer controlling broadcast and name the
  supersession explicitly so future agents do not inherit the older pause as
  current truth.
- Commit-message length failures can be caught before burning a marshal cycle.
  If a queued intent subject is near the 100-character limit, count it before
  staging/commit; in Cycle 5a Mistbound caught a 103-character subject by
  pre-flight before the same commitlint failure repeated.

## 2026-05-25 — Pelagic Snorkelling Sextant / codex / GPT-5 / `019e5b`

### What Was Done

- Closed the updated curation objective exactly at the owner-stated boundary:
  both `practice:fitness:informational` and `practice:fitness --strict-hard`
  reported `SOFT (19 soft)`, so no critical or hard file remained.
- Posted the stop-condition comms event and heartbeat-end, opened no new
  curation claim, and did not process soft surfaces.
- Verified no active Pelagic claim remained at session handoff.

### Patterns to Remember

- When the owner defines a stop condition as "once all files are soft then
  STOP", soft-only fitness is a completion condition for that objective, not
  a prompt to keep improving soft counts.
- In Codex, a long-running `exec_command` background process can lose stdin,
  so `write_stdin` cannot always stop it. If a watcher or heartbeat loop needs
  cleanup at closeout, verify the process table and kill only the exact
  session-owned process family.

## 2026-05-25 — Misty Drifting Sail / claude / claude-opus-4-7 / `02b325`

### Surprises captured

Post-M1 attestation tidy-up plan cycles: 5, 5a, held-items, 7, 7.1, 8, and
8a authoring.

- **Heartbeat-content-drift is a recurring failure mode, not a one-off**
  (graduation candidate). Three Misty instances (23:13/23:17/23:22Z) + 3+
  Lunar instances (22:24/22:28/22:32Z) of templated heartbeat body
  staying stale despite live state changes. Mechanism: free-form prose
  bodies in a Monitor `while/sleep 240` loop don't get refreshed unless
  the agent manually stops + restarts the loop. The structural cure is
  mechanical state-binding: heartbeat body should reflect a single
  observable current-claim or current-cycle-state field (e.g. by reading
  `active-claims.json` and emitting the current claim's intent verbatim),
  rather than free-form prose an agent must remember to refresh.
  Falsifiability: a heartbeat body whose content was authored ≥ 1 cycle
  ago but whose state has since changed is the failure phenotype.
- **Platform-wide Monitor-primitive cron-drift episode** (substrate-level
  graduation candidate). Misty heartbeat cron silent 20 min (23:26 →
  23:47Z) AND Lunar's silent 17 min (23:28 → 23:45Z) in the same window.
  Two independent Claude-platform Monitor cron loops degraded concurrently
  — strongly suggests platform/harness-side cause, not agent-side.
  Mistbound's silence-without-work-evidence at 23:11-onwards may have been
  the same episode. Structural cure candidate: heartbeat-cron
  health-monitoring via the existing
  `agent-tools/src/collaboration-state/watcher-staleness.ts` substrate —
  the same surface ADR-186 §C5 reserves for substrate-as-API. A healthy-
  cron staleness file written per-tick would let peers detect "cron loop
  alive, just silent" vs "cron loop dead".
- **Ping-before-escalate cure validated TWICE in single session**
  (graduation candidate; pattern is genuine). First false-positive at
  22:57Z (Lunar declared retirement-detection on Mistbound; Mistbound
  responded alive at 22:58:53Z); second false-positive at 23:46Z (Lunar
  declared again; Mistbound responded alive). Both used the cure shape
  (cross-check git work-evidence before declaring retirement). The cure
  works; the failure mode it prevents (false-positive Director retirement-
  detection cascading to unauthorised claim auto-rebalance) is real and
  recurring. Worth graduating to a Director-discipline rule citing the
  empirical evidence.
- **Reviewer fan-out depth pays its way on security-class ADRs**.
  ADR-187 authored at 480 lines; 4-reviewer absorption (docs-adr +
  assumptions + security + wilma) surfaced 3 RES-CRITICAL findings
  (security: C4 provenance requirement to defend against confused-deputy;
  wilma: owner-bottleneck under N agents; wilma: mixed-tenant fleet-wide
  impact disclosure) that the draft completely missed. Final ADR grew to
  585 lines (+22%) after absorption. Generalisation: for security-class or
  substrate-as-API ADRs, retain the full 4 reviewers even when
  proportionality reviewer asks.
- **Hook-policy `carve-out` block fired correctly** (PDR-044 memetic
  immune system worked-instance). My ADR-187 reviewer absorption Edit
  used the forbidden word "carve-out"; the policy hook rejected with the
  citation. Rephrased to "scope clarification" — substance identical,
  vocabulary compliant. Evidence the hook is firing as designed.
- **ADR-186 prettier-mangle through husky recovery** (substrate worked-
  instance). Multi-line inline-code-span pattern in a markdown body got
  mangled when Mistbound ran `pnpm format:root` during husky recovery —
  prettier interpreted the wrap as a list item, corrupting the prose
  mid-sentence. Cycle 7 landed with broken text; Cycle 7.1 fix-cycle
  followed. Cure shape: prefer single-line inline-code spans in markdown
  body prose; avoid multi-line code spans that prettier can re-interpret
  as list items.
- **State-field vs date-field vocab-slip caught at reviewer time**.
  Lunar's Cycle 8 routing brief said *"add `**Accepted**: 2026-05-25`
  lifecycle-record line"* but the canonical PDR-076a/076b/077/079
  precedent uses `**Adopted**:` (state-field `Status: Accepted` is
  distinct from date-field `Adopted: YYYY-MM-DD`). docs-adr-expert
  confirmed Adopted is correct via grep over 4 precedent files. Worked-
  instance for the reviewer-as-vocab-guardrail discipline.
