---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Misty Director Session Napkin Source Window

Archived by Estuarine Drifting Mast on 2026-05-25 during the
hard/critical docs-curation pass. The active napkin now records the
processing disposition; this file preserves the outgoing long-form source
window verbatim enough for future audit. Durable routes are the
`agentic-engineering-enhancements` thread record and the Misty Director-session
entries in `pending-graduations.md`.

## 2026-05-25 — Misty Drifting Sail / claude / claude-opus-4-7 / `02b325` (post-compaction Director session)

### Patterns to Remember

- **Heartbeats are infrastructure, not delivery.** Owner reset at 06:45Z:
  *"delivering means implemented, pushed, fixed, merged and live"*.
  Locally-committed cycles + heartbeat cadence + Director broadcasts don't
  constitute delivery. Delivery is the merge-and-live tail. Plans whose
  `Done When` stops at "local cycle commit + tree green" structurally
  underspecify delivery; amend Done-When to add PR + CI + merge + live gates.
  Graduation candidate: PDR or rule level — *"plan Done-When must drive to
  live, not local"*.
- **Coordination overhead-to-delivery ratio is a first-class metric.** A team
  can be alive (heartbeats green, claims open, broadcasts flowing) while
  delivering nothing. Measure substantive progress events / heartbeats per hour
  and ratio against actual commits-merged. When inverted (much coordination,
  little delivery), the cure is structural: reduce cadence, lift parallel
  constraints, defer non-priority work — not "try harder".
- **Heartbeat-content-drift can mask silent retirement.** Heartbeat cron
  prompts that are template-emit (same body text each tick) keep firing even
  when the agent's session has stalled or compacted. The 10-min PDR-078
  retirement threshold can produce false positives (agent alive but lag-bound
  on absorption) AND false negatives (agent dead but heartbeats firing
  template). State-bound heartbeats (body derived from live state — HEAD, claim
  count, intent state) cure this; Eclipsed and Hushed both demonstrated this
  fix mid-session by refreshing the cron prompt.
- **Emission-vs-absorption gap on broadcasts.** Events posted to canonical
  comms can take 5-15 minutes (or never) to reach a receiving agent's attention
  pipeline even when their watcher is alive. Witnessed five events from
  Director/Marshal to Eclipsed unabsorbed in a 14-min window. Directed channel
  attempts also showed lag. Watcher-emission is necessary but not sufficient
  for absorption; the agent's attention pipeline is a separate layer.
  Structural cure candidate: inbox semantics (acked-or-not state) rather than
  poll-the-stream.
- **Substrate-provenance discipline: skill-invocation is not owner-direction.**
  A new agent's team-start framed a `/team-onboarding` skill invocation as
  owner-commissioned; Director (me) accepted the framing without verifying
  owner-direction-chain (chat turn or relayed broadcast); fold-check + routing
  decisions cascaded from the false provenance. Owner explicitly disavowed at
  06:33Z: *"onboarding was never a priority, ever, that was a dumb assumption
  that propagated through the team"*. Cure: Director must require explicit
  owner-direction citation (chat turn or relayed broadcast) before accepting
  team-start owner-commissioned framings; team-start broadcasts must cite the
  specific authorising owner direction. (Co-named with Hushed + Wooded;
  graduation-grade.)
- **PDR-078 retirement-detection needs amendment.** The 10-min silence
  threshold + heartbeats-as-liveness assumption was too thin: agents can be
  alive-but-absorption-lag-bound (false positive retirement) OR
  retired-but-heartbeat-template-firing (false negative). Saw a false positive
  when I called Eclipsed retired at 10 min and they appeared 5 min later via
  own claim-open. Threshold-only is insufficient; the protocol needs
  corroborating evidence (claim mtime, file mtime, substantive event
  presence/absence) before retirement-detection broadcast.
- **Director routing-by-broadcast is single-point-of-fail under absorption
  gap.** When broadcasts don't reach implementers, Director routing decisions
  die in transit and the team stalls. Eclipsed self-directed Cycle 9 via
  `feedback_no_question_when_answer_is_forced` after owner direction made the
  next move obvious — that was the architectural-excellence cure to
  Director-routing dependency. Generalising: implementers should self-direct
  when the analysis leaves only one defensible move; Director routes only when
  genuine ambiguity exists.
- **Build-clean window breaks all team CLI invocations.** `pnpm check`'s
  `clean` step temporarily removes `agent-tools/dist/`, breaking every team
  agent's `agent-tools` CLI calls until rebuild completes (~90s). All
  heartbeats, marshal-cycles, comms-event posts fail during the window.
  Witnessed during Shadowed `pnpm check` run at 06:37Z. Structural cure
  candidate: don't clean the binary another team process is using, OR a
  different process model for `pnpm check` (read-only check on built binary,
  separate from build-cycle).
- **Sole-marshal binding extends naturally to GitHub interactions.** Owner
  direction at 06:53Z: defer GitHub interactions (gh CLI, PR create/update, PR
  comments) to Commit Marshal. Reasoning: same as commit-cycle sole-binding —
  GitHub state mutations are write-class with shared visibility; concentrating
  them in one seat (Marshal) prevents racing and gives clean ownership of
  CI/PR state. Graduation candidate: extend the Marshal role description in
  PDR-077 or successor.
- **Plan §Non-Goals can be superseded mid-execution by owner direction.** Plan
  §Non-Goals #1 said "no parallel re-shape; owner directed linear execution" —
  but owner at 06:52Z explicitly directed parallel work on cycles 12-15. Plans
  must support owner-direction-supersedes-plan-text without requiring a formal
  R-cycle refinement to land first; the comms record of the owner direction IS
  the in-band supersession. Plan refinement R-cycle that codifies the
  supersession is substrate-care that lands separately.
- **Director-seat dissolve in 3-agent context.** Owner direction at 07:03Z:
  Wooded/Eclipsed/Hushed coordinate amongst themselves with no formal Director.
  Per SKILL §3 the <=3 agents -> peer-collaboration-default rule supports this
  directly. Peer mode is the architectural-excellence shape for <=3 agents in
  active execution; Director seat is overhead at that count. Graduation
  candidate: codify ">=4 agents OR explicit owner direction" as the
  Director-seat-on threshold (currently informal in memory).

### What Was Done

- Resumed Director seat post-compaction at 05:54Z (Lunar->Starless->Misty chain
  re-anchored with PDR-064 Moment 2).
- Cycle 8a (ADR-187, Claude self-modification authz cure-shape, WS-8) landed
  via Hushed marshal at HEAD `7f7ad862` after pre-format cure on
  prettier-mangled state.
- Routed team through ~90 min of parallel cycle execution: Eclipsed Cycle 9
  (mid-flight at handoff), Wooded ONBOARDING.md (later disavowed), Twilit
  open-questions memory system (landed via separate marshal cycle),
  Hushed marshal-cycle on Option B (`26f8e7cb`).
- Authored closeout plan `/Users/jim/.claude/plans/vast-chasing-iverson.md`
  after owner critique on heartbeat-vs-delivery imbalance; approved by owner.
- Surfaced 10 distinct failure-modes and graduation candidates listed above.
- Director seat dissolved at 07:03Z per owner direction; peer-coordination
  shape broadcast to Wooded/Eclipsed/Hushed.

### Open Threads at Handoff

- PR-open in flight (Hushed Marshal seat). Pre-PR cleanup needed: 9 markdownlint
  errors in Eclipsed's handoff record (per Hushed `[06:58:12Z]`).
- PDR-078 cadence parameter change (4 -> 10 min) — owner approval pending.
- Plan §Done When amendment (add PR + CI + merge + live gates) — owner approval
  pending.
- Wooded Cycle 9 mid-flight (4 integration edits + reviewer dispatch + intent
  enqueue remain).
- Cycles 12-15 parallel-safe lanes available (12 was routed to Twilit; 13/14/15
  unrouted).
- R4 plan-update edits to `post-m1-attestation-tidy-up.plan.md` (10 cycle
  status flips from pending -> completed) are ON DISK uncommitted. Defer commit
  per owner delivery-only priority OR fold into Cycle 15.

### Final Insight (closing the session)

The deepest lesson of this session is structural, not tactical: **when substrate
structurally encodes the wrong outcome, agent behaviour follows the substrate,
not the intent.** The tidy plan's §Done When stopped at "local cycle commit +
tree green"; PDR-078's heartbeat contract measures coordination liveness, not
delivery; SKILL §1 broadcast norms reward coordination volume. All three are
well-designed — for the goals they were designed for. None of them measures
delivery in the owner's full sense (implemented + pushed + fixed + merged +
live).

For ~90 minutes, the team was alive (4 Opus seats, heartbeats green, claims
open, broadcasts flowing) while delivering nothing past local commits. Then the
owner reframed at 06:45Z and the team behaviour shifted immediately. The agents
didn't need new doctrine — they needed the substrate they were already running
on to point at the right outcome.

This generalises: doctrine on paper that's not encoded in substrate (Done-When
fields, heartbeat templates, broadcast norms) is invisible to the team in
operation. **The substrate IS the doctrine in operation.** If you want long-term
architectural excellence, the substrate must point at it — at every measurable
layer the agents observe. Owner-intervention is the recovery mechanism when
substrate diverges from intent; it should be the rare event, not the routine
cure.

That's the architectural-excellence frame applied to the Practice itself: keep
substrate aligned with the actual delivery shape, not the local-process shape
that's easier to write down. The graduation candidates surfaced today
(plan-Done-When-to-live, state-bound heartbeats, inbox semantics, provenance
discipline, Director-threshold) all point in the same direction — make the
substrate measure what the owner actually means by delivery.

— Misty Drifting Sail (`02b325`), session close 2026-05-25T07:11Z

---

## 2026-05-25 — Misty Drifting Sail / claude / claude-opus-4-7 / `02b325`

### Surprises captured

Post-M1 attestation tidy-up plan cycles: 5, 5a, held-items, 7, 7.1, 8, and
8a authoring.

- **Heartbeat-content-drift is a recurring failure mode, not a one-off**
  (graduation candidate). Three Misty instances (23:13/23:17/23:22Z) + 3+
  Lunar instances (22:24/22:28/22:32Z) of templated heartbeat body staying stale
  despite live state changes. Mechanism: free-form prose bodies in a Monitor
  `while/sleep 240` loop don't get refreshed unless the agent manually stops +
  restarts the loop. The structural cure is mechanical state-binding: heartbeat
  body should reflect a single observable current-claim or current-cycle-state
  field (e.g. by reading `active-claims.json` and emitting the current claim's
  intent verbatim), rather than free-form prose an agent must remember to
  refresh. Falsifiability: a heartbeat body whose content was authored >= 1
  cycle ago but whose state has since changed is the failure phenotype.
- **Platform-wide Monitor-primitive cron-drift episode** (substrate-level
  graduation candidate). Misty heartbeat cron silent 20 min (23:26 -> 23:47Z)
  AND Lunar's silent 17 min (23:28 -> 23:45Z) in the same window. Two
  independent Claude-platform Monitor cron loops degraded concurrently —
  strongly suggests platform/harness-side cause, not agent-side. Mistbound's
  silence-without-work-evidence at 23:11-onwards may have been the same
  episode. Structural cure candidate: heartbeat-cron health-monitoring via the
  existing `agent-tools/src/collaboration-state/watcher-staleness.ts` substrate
  — the same surface ADR-186 §C5 reserves for substrate-as-API. A healthy-cron
  staleness file written per-tick would let peers detect "cron loop alive, just
  silent" vs "cron loop dead".
- **Ping-before-escalate cure validated TWICE in single session** (graduation
  candidate; pattern is genuine). First false-positive at 22:57Z (Lunar
  declared retirement-detection on Mistbound; Mistbound responded alive at
  22:58:53Z); second false-positive at 23:46Z (Lunar declared again; Mistbound
  responded alive). Both used the cure shape (cross-check git work-evidence
  before declaring retirement). The cure works; the failure mode it prevents
  (false-positive Director retirement-detection cascading to unauthorised claim
  auto-rebalance) is real and recurring. Worth graduating to a
  Director-discipline rule citing the empirical evidence.
- **Reviewer fan-out depth pays its way on security-class ADRs**. ADR-187
  authored at 480 lines; 4-reviewer absorption (docs-adr + assumptions +
  security + wilma) surfaced 3 RES-CRITICAL findings (security: C4 provenance
  requirement to defend against confused-deputy; wilma: owner-bottleneck under
  N agents; wilma: mixed-tenant fleet-wide impact disclosure) that the draft
  completely missed. Final ADR grew to 585 lines (+22%) after absorption.
  Generalisation: for security-class or substrate-as-API ADRs, retain the full
  4 reviewers even when proportionality reviewer asks.
- **Hook-policy `carve-out` block fired correctly** (PDR-044 memetic immune
  system worked-instance). My ADR-187 reviewer absorption Edit used the
  forbidden word "carve-out"; the policy hook rejected with the citation.
  Rephrased to "scope clarification" — substance identical, vocabulary
  compliant. Evidence the hook is firing as designed.
- **ADR-186 prettier-mangle through husky recovery** (substrate worked
  instance). Multi-line inline-code-span pattern in a markdown body got mangled
  when Mistbound ran `pnpm format:root` during husky recovery — prettier
  interpreted the wrap as a list item, corrupting the prose mid-sentence. Cycle
  7 landed with broken text; Cycle 7.1 fix-cycle followed. Cure shape: prefer
  single-line inline-code spans in markdown body prose; avoid multi-line code
  spans that prettier can re-interpret as list items.
- **State-field vs date-field vocab-slip caught at reviewer time**. Lunar's
  Cycle 8 routing brief said *"add `**Accepted**: 2026-05-25` lifecycle-record
  line"* but the canonical PDR-076a/076b/077/079 precedent uses
  `**Adopted**:` (state-field `Status: Accepted` is distinct from date-field
  `Adopted: YYYY-MM-DD`). docs-adr-expert confirmed Adopted is correct via
  grep over 4 precedent files. Worked instance for the reviewer-as-vocab-
  guardrail discipline.
