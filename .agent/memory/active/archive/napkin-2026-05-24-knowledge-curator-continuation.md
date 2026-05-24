---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

## 2026-05-24 — Breezy Anchoring Rudder / claude / opus-4.7 / `20fc29`

Knowledge Curator session under owner pause; session-end capture.

### Capture A — Marshal-throughput-outpaces-reviewer-turnaround

Substrate-pointer-pattern variant. Dispatched docs-adr-expert + code-expert in
parallel at 10:42:42Z when cycle #1 substrate was authored; Mistbound marshal
queue executed Twilit-first → Charcoal-second → Breezy-third in ~5 min (landing
at 10:47:56Z); reviewer verdicts returned ~10:48Z, AFTER landing. Cycle #1
landed without reviewer-converge gate; both verdicts were GO-WITH-CONDITIONS
(7 SHOULD-ABSORB items + 1 BLOCKER-ADJACENT missing `.agents/rules/` adapter).
Cure shape: cycle #1.1 absorbs verdicts post-land — structurally valid, not a
doctrine break. **Worth promoting to pattern** if 2nd worked instance fires:
the gating-cue *"reviewer verdict in hand before marshal-request"* could be
added to `start-right-team` SKILL §4. Watch.

### Capture B — Owner-direction-shape-reading-vs-substantive-intent

Broadcast 10:34:04Z framed the curator role transfer as "director/executor
split inside the lane" based on owner's literal phrasing *"take over as the
Knowledge Curator, Vining will direct the process"*. Vining corrected to full
role transfer at 10:36:08Z; owner's "will direct" was a transition-state
framing of the handover, not a permanent director-shape. Cure:
framing-correction broadcast at 10:42:42Z. Lesson: when an owner-direction
phrase has both a process-shape reading and a substance-shape reading, prefer
to confirm intent with the named source (here: Vining the outgoing role-holder)
before broadcasting the framing. Naming this for future curator handovers and
analogous role-transfer moments.

### Capture C — Rule self-instantiates on landing day

Cycle #1 graduated `important-state-not-in-temp-files` (forbids durable
references from version-controlled or substrate files into `/tmp/`). The
load-bearing handover artefact for this very session sat at
`/tmp/breezy-deep-curation-survey-2026-05-24.md` — the rule's first enforcement
was on the very artefact that motivated the pass. Vining executed the migration
cure (copy to
`.agent/state/collaboration/handoffs/curator-role-handoff-2026-05-24-vining-to-breezy.md`)
as their final substantive act pre-retirement. Rare graduation-day evidence —
the substrate's first enforcement is on its own arrival.

### Capture D — Napkin-line-numbers go stale on rotation

The cycle #1 rule's worked-instance citation says *"napkin Ferny Capture D
2026-05-24 (lines 2284–2298)"*. The napkin rotated post-landing (Shaded
Silencing Dusk's solo rotation, evidenced by current 138-line state of this
file); the cited line range now resolves to nothing. Cure-shape for the next
pass: replace numeric line citations in canonical permanent docs (rules, PDRs)
with **content-addressable** citations — the section heading + date + author,
not the line range. Add as cycle #1.2 candidate or carry-forward.

### Processing Status — Breezy Captures A-D

- Capture A routed to `pending-graduations.md` as
  `marshal reviewer-turnaround gating cue` with a second-instance or owner-
  direction trigger.
- Capture B routed to `pending-graduations.md` as
  `owner-direction shape-reading vs substantive intent` with a second role-
  transfer misread or owner-direction trigger.
- Capture C already has a durable home in
  `.agent/rules/important-state-not-in-temp-files.md` Example 3.
- Capture D processed into
  `.agent/rules/important-state-not-in-temp-files.md` Example 1 by replacing
  the stale line-number citation with an archived-section citation.

## 2026-05-24 — Shaded Silencing Dusk / codex / GPT-5 / `019e59`

Solo Knowledge Curator napkin rotation.

### What Was Done

- Owner confirmed all other team members are paused; treated the pass as a
  solo temporary Knowledge Curator session while preserving active-claims state
  as evidence rather than as a blocker.
- Opened claim `b02fe923` over the napkin-processing surfaces and created
  metadata-only curator-pass log
  `.agent/memory/operational/curator-passes/2026-05-24-shaded-silencing-dusk.md`.
- Preserved the oversized active napkin verbatim at
  `.agent/memory/active/archive/napkin-2026-05-24-shaded-silencing-dusk.md`
  as the historical source for this processed rotation.
- Distilled behaviour-changing lessons from the archived window into
  `.agent/memory/active/distilled.md` under
  "Recently Distilled — 2026-05-24 active-napkin rotation".
- Routed still-processable candidates to
  `.agent/memory/operational/pending-graduations.md` under
  "2026-05-24 active-napkin rotation updates".

### Patterns to Remember

- The active napkin can be processed without losing history by routing the
  behaviour-changing substance first, then archiving the full source as the
  historical record before shrinking the live surface.
- Fitness pressure was useful here only as a routing signal: it proved the
  active napkin needed rotation, but it did not decide which knowledge was
  worth preserving.
- A curator-pass file must stay as a pointer ledger. The substance lives in
  the archive, distilled entries, pending-graduations entries, comms events, or
  permanent homes.

### Rotation Pointer

Previous active napkin:
[`napkin-2026-05-24-shaded-silencing-dusk.md`](archive/napkin-2026-05-24-shaded-silencing-dusk.md).

The previous rotation before this one remains
[`napkin-2026-05-22-evening.md`](archive/napkin-2026-05-22-evening.md).

### Coverage Audit Follow-up

- Re-audited the archived napkin candidate families after the first rotation
  and found seven route gaps that should not live only in the archive.
- Added pending-graduations routes for `/remember` plugin write-time
  validation, plan-directory taxonomy, PDR-075 status review,
  parallel-reserve capacity, owner-coordinated compaction refocus,
  arriving-agent boundary dormancy, and Monitor first-run backfill.
- Left marshal queue broadcast-ordering under the broader
  marshal-as-cycle-discipline route rather than duplicating it as a separate
  pending entry.

### Critical Surface Follow-up

- The napkin is now processed; the remaining consolidation work is the next
  layer up, not a reason to keep editing the fresh napkin.
- Opened an explicit 2026-05-24 critical-drain plan so `distilled.md`,
  `pending-graduations.md`, and `repo-continuity.md` pressure has checkable
  acceptance criteria rather than a vague handoff.
- Current baseline: napkin 65 lines, distilled 1,004 lines,
  pending-graduations 4,979 lines, repo-continuity 758 lines.

### Repo-Continuity Drain Follow-up

- Phase 1 of the critical-drain plan archived stale `repo-continuity.md`
  Current State and thread-roster history verbatim before replacing the live
  surface with compact current-state pointers.
- The fitness signal improved by structural routing, not trimming:
  `repo-continuity.md` moved from critical to hard, and the overall report moved
  from `CRITICAL (3 critical, 3 hard, 13 soft)` to
  `CRITICAL (2 critical, 4 hard, 13 soft)`.
- Remaining critical surfaces are `distilled.md` and `pending-graduations.md`;
  treat the completed Phase 1 result as a useful slice, not full closure.

### Pending-Graduations Drain Follow-up

- Phase 2 made a narrow safe pass over `pending-graduations.md`: removed two
  resolved live pointer stubs after verifying their archive bodies and pattern
  homes, then regenerated the stale `due` index.
- The current due set is mostly owner-gated or separate-lane work. The right
  curator move is explicit routing, not silent PDR/rule/tool mutation.
- `pending-graduations.md` remains critical by size and metadata/table width;
  the next substantial drain needs owner-approved promotions, implementation
  of the comms-watch cure, or a larger archive rotation.

### Distilled Drain Follow-up

- Phase 3 made a verified-home prune of `distilled.md`: removed only entries
  whose durable homes were inspected first, and put the audit trail in
  `archive/distilled-graduations-log-2026-05-14.md`.
- This moved `distilled.md` from critical to hard and the overall fitness
  result from `CRITICAL (2 critical, 4 hard, 13 soft)` to
  `CRITICAL (1 critical, 5 hard, 13 soft)`.
- The remaining critical surface is `pending-graduations.md`; `distilled.md`
  still needs a full per-entry home-gap walk before Phase 3 can be complete.

### Owner Correction — Process Before Archive

- Owner corrected the team route on 2026-05-24: never archive unprocessed
  content. Knowledge curation comes first, always.
- The corrected invariant is: read the source, extract and route the substance,
  record unresolved items in the right queue, and only then archive the source
  as a historical record.
- Archive-before-processing is a curation violation, even when fitness pressure
  is critical and even when the archive would preserve bytes.
- Shaded's read-only review caught a scope hazard in my first rule patch: the
  preservation-over-fitness rule excludes buffers, but process-before-archive
  must apply to buffers too. Corrected shape: preservation-over-fitness is
  memory/state scoped; archive-after-processing applies to every curation
  archive move.
- Tooling note: during the archive audit I used one piped `rg` discovery
  command despite the local preference for separate/parallel reads. It did not
  affect the curation result, but the better habit is to keep audit commands
  discrete and easy to review.

### Graduation — No Question When The Answer Is Forced

- The archived napkin carried `no-question-when-answer-is-forced` as a standing
  direction already used by team agents, with the decision-time heuristic
  "which shape gives long-term architectural excellence?" already present in
  PDR-070 and PDR-018.
- Graduated the behaviour into
  `.agent/rules/present-verdicts-not-menus.md`: when doctrine, evidence, and
  long-term architectural excellence leave one defensible answer, ask no
  owner-choice question; present the forced verdict and evidence.

### Graduation — Verify, Do Not Trust

- The archived napkin and distilled layer carried repeated trust-propagation
  failures: peers, handoffs, owner recollections, and sub-agent summaries were
  sometimes treated as verified state without artefact evidence.
- Graduated the behaviour into `.agent/rules/verify-dont-trust.md` plus
  platform forwarders and `RULES_INDEX.md`: when routing, closing,
  validating, archiving, or reporting completion depends on a claim, inspect
  the artefact that would make the claim true.

### Graduation — Cron Ticks Obey Owner Input First

- The archived napkin carried Ferny's concrete cure for heartbeat cron prompts:
  cron-fired prompts must read the latest owner turn before returning to
  "whatever task is in flight".
- Graduated the cure into
  `.agent/skills/start-right-team/SKILL-CANONICAL.md` §0.5: every cron,
  scheduled wakeup, or persistent monitor tick must absorb pause/stop/wait/hold
  style owner directions before emitting heartbeat or resuming prior work.

### Graduation — Comms Watch Self-Exclusion Cure

- The pending-graduations body still counted the 2026-05-23 comms-watch
  self-exclusion cure as `due`, but the durable homes now carry the substance:
  `comms-relevant-events.ts` uses `observed` for cross-traffic, the focused
  unit tests cover directed/narrative observed views plus self-authored
  exclusion, and `comms-watch-mechanism.md` forbids addressee-filtering.
- Processed the entry in place before changing status: verified the code, test,
  and doc homes, then marked the pending entry `graduated` and removed it from
  the due index. This is the corrected curation sequence: understand and route
  first, update the register second, archive only after processing if needed.

### Graduation — Current vs Active Plan-Directory Taxonomy

- The pending-graduations body counted the plan-directory taxonomy as `due`:
  arriving agents could confuse `current/` with work in flight because the root
  plan README emphasised reachability before lifecycle meaning.
- Verified the taxonomy already existed in `/jc-plan` and
  `.agent/plans/templates/README.md`, then graduated the root home by adding
  `.agent/plans/README.md` §Lifecycle Taxonomy.
- The durable rule is now explicit at the portfolio root: `active/` means NOW
  and in progress; `current/` means NEXT and queued but not started; `future/`
  means LATER strategic intent; `archive/completed/` means DONE after durable
  outcomes are extracted.

### Graduation — Sidebar Protocol With Default Action

- The pending-graduations body counted the sidebar protocol as `due` because
  the second worked instance had fired, but the entry still framed
  classification as an owner question.
- Verified the existing durable home:
  `.agent/memory/active/patterns/inter-agent-sidebar-with-default-action.md`
  already carries the 2026-05-11 proof plus the Mistbound-Lanternlit and
  Mistbound-Vining 2026-05-24 instances.
- Graduated the pending entry to that pattern. Verdict: the evidence supports a
  repo-local situational coordination pattern; a PDR can wait unless a portable
  role/lane governance primitive emerges later.

### Route — `/remember` Plugin Write-Time Contract Gap

- The pending-graduations body counted the `/remember` contamination contract
  gap as `due`, but the cure is not a curator edit to `.remember/*`.
- Routed the defect to `.agent/plans/agent-tooling/frictions-register.md` as
  F-33: `/remember` compression can write assistant-prose contamination.
- The repo-local curation result is now an evidence-bearing plugin-maintenance
  route. The external `/remember` plugin still needs a write-time validation
  fix that rejects empty or assistant-prose compression output before writing.
- Tooling mistake: I verified the route with an `rg` command whose double-quoted
  pattern contained backticked `/remember`, so zsh attempted command
  substitution. Use single quotes or avoid shell-special prose in command
  patterns.

### Archive — Processed 2026-05-24 Pending-Graduation Bodies

- After the live queue reached four remaining due entries, the buffer still
  carried several full bodies whose status was already `graduated`.
- Archived those processed bodies to
  `.agent/memory/operational/archive/pending-graduations-archive-2026-05-24.md`
  and left concise stubs in `pending-graduations.md`.
- This is archive-after-processing: the durable homes were already verified or
  routed before the bodies moved. The archive preserves source history; the
  live register now carries queue state rather than re-storing resolved
  substance.

### Tooling Note — `claims list` Flag Shape

- I ran `pnpm agent-tools:collaboration-state -- claims list` with
  `--platform` and `--model`, but that subcommand rejects those flags. The
  correct shape is `claims list --active <path>`; identity flags belong on
  commands such as `identity preflight`, `claims mine`, and claim mutations.
- I then repeated the adjacent shell hazard while verifying this note: a
  double-quoted `rg` pattern containing backticked `claims list` triggered zsh
  command substitution. This is the same quoting family as the earlier
  `/remember` verification mistake, so the durable habit is stronger than
  "remember once".
- Behaviour change: check the subcommand-specific `--help` before adding
  identity flags to read-only collaboration-state commands, and use
  single-quoted search patterns when the literal text contains backticks.

### Critical-Drain Plan Catch-Up

- Added Sylvan's metadata-only curator pass ledger at
  `.agent/memory/operational/curator-passes/2026-05-24-sylvan-sprouting-petal.md`.
- Updated the critical-drain plan with the processed-body archive continuation
  so the controlling plan now reflects the actual four-entry due set instead
  of the earlier nine-entry Phase 2 partial.
- Corrected `repo-continuity.md` Current State to stop saying that
  `distilled.md`, `pending-graduations.md`, and `repo-continuity.md` are all
  live critical surfaces; latest validation shows only `pending-graduations.md`
  is critical, while `distilled.md`, `repo-continuity.md`, and this napkin are
  hard.
- Remaining due entries are owner/PDR-gated; the useful move is routing and
  evidence preservation, not opportunistic principle-class mutation.

### Distilled Verified-Home Prune

- Continued Phase 3 of the critical-drain plan without touching Shaded's fresh
  pending-register claim.
- Verified durable homes before pruning: PDR-081 and the curator-pass skill
  cover metadata-only pass logs; `knowledge-preservation-over-fitness-warnings`
  covers archive-after-processing; `verify-dont-trust` covers artefact-first
  verification.
- Removed only those duplicate live distilled entries and recorded the
  dispositions in
  `.agent/memory/active/archive/distilled-graduations-log-2026-05-14.md`.

### Distilled Verified-Home Prune — Second Slice

- Reopened the Phase 3 distilled walk for entries that did not overlap
  Shaded's fresh `pending-graduations.md` claim.
- Pruned two duplicate live entries only after verifying homes:
  cadence-aware substrate absorption is carried by the recursion-of-doctrine
  and substrate-pointer patterns plus PDR-080, and HTTP/MCP transport test
  classification is carried by `docs/engineering/testing-patterns.md` plus
  `.agent/directives/testing-strategy.md`.
- Left `Bare timer races leak unless cleaned up` live because the located
  guarded-cleanup pattern does not yet preserve the exact timer-disposal rule.

### Distilled Verified-Home Prune — Third Slice

- Continued Phase 3 while Shaded still owned `pending-graduations.md`.
- Pruned six owner-working-style duplicate entries after verifying
  `.agent/directives/user-collaboration.md` already carries the exact
  substance under Owner Working Style.
- Pruned the metacognition structural-cure duplicate after verifying
  `.agent/directives/metacognition.md` carries the exact cure shape.
- Left the destructive-incident and consolidation-surface owner-profile
  entries live because no exact permanent home was verified.

### Distilled Graduation — Bare Timer Cleanup

- Re-grounded after owner direction to continue `oak-consolidate-docs` and
  avoided Shaded's fresh `pending-graduations.md` claim.
- Found that `Bare timer races leak unless cleaned up` could now graduate only
  after correcting its durable home: the existing
  `guarded-fire-and-forget-cleanup.md` pattern carried the cleanup timeout
  shape but did not name timer disposal.
- Updated the pattern and the proven `mcp-handler.ts` cleanup path to clear
  the timeout in `finally`, then removed the duplicate distilled entry and
  logged the verified home in the distilled graduations archive.

### Mistake — First Timer Patch Left A Dead Timeout

- My first edit tried to add the cleaned-up timeout but accidentally left a
  stray unused timeout promise in `mcp-handler.ts`. I caught it on immediate
  re-read and removed it before touching the documentation.
- Behaviour change: after changing an async race/timeout shape, re-read the
  whole local block before moving to docs; otherwise the code can contain both
  the old failure shape and the intended cure.

### Tooling Note — `claims close` Does Need Identity Flags

- I closed the timer-cleanup claim first without `--platform` / `--model`.
  `claims close` rejected it and printed the required help text. This is the
  converse of the earlier `claims list` note: read-only list rejects identity
  flags, but mutation commands such as open/close need them.
- Behaviour change: do not generalise a flag rule across all
  `collaboration-state claims` subcommands; check the specific verb's help
  when switching between read-only inspection and mutation.

### Pending-Graduations Historical Pointer Drain

- Re-grounded the live claims after Shaded's fresh pending-register claim had
  cleared and opened claim `601edc7d` over the Phase 2 continuation files.
- Removed seven live-body stubs that were already graduated historical
  pointers: ADR-041 top-level workspace tiers, pre-commit staged-scope,
  PDR-055/ADR-178 CLI affordance/build isolation, no-moving-target hook
  tightening, observability WS10/WS8.6 orthogonal axes, and PDR-056
  inter-agent protocol gaps.
- Verified before removal that each stub's body is preserved in
  `pending-graduations-archive-2026-05-22.md` and that current durable homes
  exist. Kept the status-correction and graduation-log rows because those are
  ledger context, not live queue bodies.
- Validation after the drain: focused Prettier, markdownlint, and
  `git diff --check` passed; `practice:fitness:informational` still reports
  `CRITICAL (1 critical, 6 hard, 13 soft)` with `pending-graduations.md` as the
  single critical surface.

### Pending-Graduations 2026-05-24 Processed-Stub Drain

- Opened claim `7b2850b8` for a second Phase 2 continuation and removed seven
  already-processed stubs whose bodies are preserved in
  `pending-graduations-archive-2026-05-24.md`.
- Verified current homes before removal: comms-watch code/tests/reference doc,
  sidebar default-action pattern, verify-dont-trust rule/adapters/index,
  start-right-team heartbeat owner-input precedence, F-33 in the
  agent-tooling frictions register, root plan lifecycle taxonomy, and the
  Supertest E2E classification in testing docs.
- Mistake: while inspecting snippets I used one chained shell read with `&&`.
  It did not change files, but it violates the local preference for discrete
  parallel reads; keep inspection commands separate so audit output stays
  reviewable.

### Pending-Graduations Legacy Implementation-Route Stub Drain

- Opened claim `8516bc73` and removed three more already-processed live
  pointers after verification: CLI first-touch friction, pre-commit
  staged-content gating, and advisory-protocol enforcement via commit-queue
  guard.
- Verified the archived bodies in the 2026-05-22 / 2026-05-24 pending
  archives and current homes in PDR-055, ADR-178, the
  cost-of-collaboration plan, `.husky/pre-commit`, and commit-queue guard
  documentation/evidence.
- The owner/PDR-gated due set stayed untouched.

## 2026-05-24 — Charcoal Brazing Kiln / claude / opus-4.7 / `7c7327`

Implementor under Director Seaworthy routing on PR-108 Sonar quality-gate.

### Capture — Owner-authorised exception recorded as audit-trail-class entry

Director Seaworthy routing event `73f9c57f` (2026-05-24T12:46:31Z) carried the
owner verbatim direction: *"add
`packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/` to the sonar
duplication ignore list -- this is not typically allowed, this is a specific
user intervention"*. Architectural observation absorbed before action: the
existing `**/src/types/generated/**` glob in `sonar.cpd.exclusions` already
matches the directed-add path by construction; the new entry's value is
**recording-class** — an explicit audit-trail marker of the owner-authz
boundary — not functional extension of duplication-analyser scope. The inline
policy comment in `sonar-project.properties` names this redundancy explicitly
so a future reader is not misled about coverage semantics. config-expert
returned PASS-WITH-FOLLOW-UP; the follow-up is a paired update to
`docs/governance/sonar-disposition-policy.md` (Block 2 + Excluded-globs
enumeration) — separate cycle per Director's "no other changes in the same
commit" bound. **Worth noting for future owner-authz exception moves**: the
right shape under `feedback_long_term_architectural_excellence_is_always_the_answer`
is to action the directed cure AND name the substrate truth (here: the
redundancy) at the change-site, so the architectural picture is preserved in
the edit itself, not lost across the boundary into the routing event alone.

### Capture — Substrate-pointer-pattern v2 instance: compose-vs-emit window

Director Seaworthy broadcast `f6eb4f51` (2026-05-24T12:36:08Z) enumerated
team-shape with Twilit + Charcoal among closed-out agents; both of us had
resumed pre-emit (Charcoal at 12:35:04Z `589f3486`; Twilit at 12:35:43Z
`acc85f6c`). Director's compose state was accurate at compose start; the world
changed during the compose-vs-emit window (39s + 25s gaps). 18th-or-19th
worked instance on the v2 axis. State-correction issued via direct ACK
`5cb294ba` naming the timeline + real Opus count (4, under 5+ fold trigger
per the owner direction landed via Vining at 12:23Z). Cure-shape is
unchanged: watcher fires post-emit, peer agent issues state correction,
sender absorbs. Pattern continues to bind reliably; no v3 escalation
warranted from this instance alone.

### Processing Status — Charcoal Captures

- Owner-authorised Sonar audit-trail capture processed into
  `docs/governance/sonar-disposition-policy.md` Block 2 by naming the explicit
  generated API-schema glob as a recording-class, owner-ratified boundary.
- Compose-vs-emit substrate-pointer capture processed into the existing
  `pending-graduations.md` route for substrate-pointer v3 real-time absorption
  variants. No new doctrine entry was needed because the capture itself says
  the existing cure shape still binds.
