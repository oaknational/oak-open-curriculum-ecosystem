# Graph Implementation Team — First Worktree-Team Live Run: Director's Analysis

**Date**: 2026-06-10
**Author**: Veiled Listening Secret (Director, claude / Fable 5, `7c8e8e`) — the session's
continuous witness; written mid-session while the evidence is fresh, per owner direction.
**Type**: Analysis (team-shape validation + incident synthesis)
**Scope**: the owner-ratified worktree-team shape's first live run, from team bootstrap
(~12:00Z) through the third implementer rotation (~15:15Z). In-flight lanes (G1b, comms-watch
hardening, S3/G4 holds) are noted as live, not concluded.

## Headline

The worktree-team shape worked on first contact. Five PRs merged in under three hours of
parallel implementer work (S1 #152, G1a #153, #154, S2 #155, U1 #156) with zero registry
conflicts, zero index/HEAD races, zero cross-agent gate coupling, and zero broken-main windows —
the three failure modes the shape was designed to dissolve did not occur, structurally rather
than by luck. Two clean seat rotations and one stalled-watcher incident were absorbed without
losing work, context, or tempo. The costs were real but bounded: per-worktree install/build
minutes, one tooling defect exposed under load, and a handful of protocol gaps now cured in the
opener and rules.

## 1. What the shape structurally dissolved (validated predictions)

The 2026-06-10 napkin design note predicted the worktree topology would convert three recorded
failure modes into structure. All three held:

- **Registry conflicts**: collaboration state lived in ONE coordination home (the Director's
  checkout); implementer PRs were pure diffs by construction. The cross-PR
  `active-claims.json` conflicts of the 2026-06-10 morning arc (PR #146 going CONFLICTING in
  minutes) did not recur across five concurrent-window PRs.
- **Gate coupling**: each worktree gated only its own state. Implementers ran full pre-commit
  chains concurrently with no contention; the Director's continuity commits never queued behind
  feature gates.
- **Index/HEAD races**: each worktree owns its index and HEAD. No `.git/index.lock` collision,
  no ref-lock backstop firing, no HEAD moving under an in-flight session — across a window with
  up to four agents committing.

One predicted-cost confirmation: per-seat `pnpm install && pnpm build` is real minutes, paid
once per seat, and was absorbed into each seat's bootstrap without coordination impact.

## 2. The rotation protocol under live fire

Two natural-boundary rotations (Riverine → Pearly on Seat A; Airy → Abyssal on Seat B) ran the
owner-initiated handoff directive end to end. What the evidence shows:

- **Self-contained handoff records carry real weight.** Pearly executed S2 from Riverine's
  record without one clarifying question — including inheriting a hypothesis explicitly marked
  unconfirmed (B2), which they then *corrected* (the search tool's `year` filter) rather than
  implemented blind. The hypothesis-marked-as-hypothesis discipline is what made the
  supersession frictionless; a record that asserted the repair as fact would have shipped a
  weaker fix.
- **The natural-boundary pickup gap was real and is cured.** Closed claims carry no
  `handoff_record_path`, so the skill's pickup mechanism never fires for clean rotations. The
  cure landed in the opener's entry ritual (successors read their seat's latest handoff record,
  routed via opener + Director pickup brief + thread record) the same hour it was found.
- **The Director addendum pattern emerged unplanned and earned its place**: when post-closeout
  events invalidate part of a frozen record (the #153 review findings arrived after Airy
  retired), a clearly-attributed Director section appended to the record keeps the successor's
  required reading at ONE artefact. Abyssal re-verified both findings first-hand from it and
  fixed them in 25 minutes cold.

## 3. The stall incident, end to end

The session's one operational incident validated the detection stack and exposed a
coordination-critical tooling defect:

1. **Detection**: the heartbeat-only stall diagnostic fired exactly as doctrine describes —
   heartbeats present but a stale cycle label for 2+ cadence windows after a GO that should
   have changed it. The detached heartbeat loop broadcasting stale state is itself a tell.
2. **Escalation discipline held**: ping with a bounded reply window first; then git
   work-evidence cross-check (worktree untouched since the last push = not working, not merely
   quiet); no takeover broadcast, because the evidence said stalled-not-abandoned.
3. **Root cause** (agent's own first-hand diagnosis after an owner nudge): the canonical
   `comms watch` CLI hung-but-ran — process alive, emissions stopped, seen-file frozen at
   3,045 while the dir grew to 3,070. The agent was blind to a merge, a ping, and a GO for
   ~16 minutes while every external surface reported the watcher healthy.
4. **Structural cure path**: the defect got a source-grounded executable plan within the hour
   (`agent-tooling/current/comms-watch-hang-hardening.plan.md`). Grounding the plan in source
   materially changed the diagnosis from the field hypotheses: the real gap is the absence of
   per-step deadlines in the watch loop (a hung await is not an error); the suspected
   fs.watch drop is already poll-bounded; and a liveness/staleness surface already exists but
   is opt-in and unwired. Field reports name symptoms; plans must re-ground in source.
5. **Team adaptation**: all subsequent seats run the rule's portable polling fallback with
   cycle-boundary cross-checks; the rule carries the known-failure-mode caution until the
   hardening lands (in flight, Luminous Scattering Dawn).

## 4. Evidence-forced de-escalations (the system saying "no work needed" correctly)

Two would-be workstreams dissolved under cheap quantification — both worth institutional memory
because the *reflex to measure first* is what saved the scope:

- **The stale-corpus fork**: a sourceVersion gap (2026-03-07 vs 2026-05-21) implied a risky
  re-baseline or a mechanism deviation. A 1.74-second throwaway re-mine proved content-identity
  — the fork dissolved to ~13 cosmetic lines and G1a resumed unchanged. Cost of the diagnostic:
  minutes. Cost of either fork branch taken on the label alone: a precursor PR or a ratified-
  mechanism deviation, both unnecessary.
- **G4's binary gate**: the bulk-vs-API 1pp rule, applied mechanically, would have selected the
  API-pull branch at KS4 — inheriting live's own gaps (science-ks4 serving zero) and discarding
  bulk's richer fields. Owner direction reshaped it to two tools with distinct value props; the
  gate analysis (fields bulk ⊇ live; coverage divergent only at KS4) is what made the false
  binary visible. A decision rule is a floor for analysis, not a substitute for it.

## 5. Adjudication economics (five PRs of review data)

Every bot/reviewer comment was adjudicated first-hand per the standing requirement. The session
ledger: **10 substantive bot findings, 8 real and applied, 2 refuted with source grounding** —
plus two clean bot reviews (no findings) correctly left unanswered.

- Real finds the specialist sub-agents missed: Copilot caught a vacuous-pass e2e and a stale
  JSDoc on #152 *after* code-expert and mcp-expert approved; on #153 it caught a broken
  `./curriculum` dist export that all monorepo gates green-lit (the `development` export
  condition resolves `src/`, masking missing dist runtime — a high-value new lesson), and an
  eager-loading barrel that defeated a ratified design rationale on the load path.
- Refutations that mattered: the deprecation-stub suggestion on #152 (replace-don't-bridge;
  no consumers — verified) and two false claims in the morning arc. Applying bot comments
  blind would have shipped policy violations; dismissing them blind would have shipped four
  real defects. Both halves of the discipline earned their keep, in numbers.
- Layering conclusion: bots + specialist reviewers + first-hand adjudication are
  complementary, not redundant. No single layer caught everything; the union caught everything
  we know about.

## 6. Director-pattern observations (for the seat's future holders)

- **Pure-direction held, with two owner-sanctioned exceptions**: integrating an unregistered
  agent's work (Blooming — owner-directed takeover) and plan authoring (direction-class by
  nature). Both stayed bounded; no product code or tests were written from this seat.
- **Owner-decision routing moments this session**: coordination-home interpretation (the one
  question whose answer set the topology), the versioning convention (verdict + silent-default
  window), the S2 rename sign-off, S3-c0 ratification, the GH-issue-vs-repo-plan fork (the
  harness correctly refused an external write on relayed intent), and the bulk-refresh timing
  flag. The pattern that worked: verdict-with-default presented, never an open menu; the owner
  countermanded none and refined two — evidence the verdict bar was roughly right.
- **Merge serialisation cost ~zero** at this scale (five merges, no queue contention) while
  buying deterministic rebase points and clean semantic-release sequencing.
- **The Director's claim on `.agent/state/**` plus pure-diff implementer PRs is the load-bearing
  pair**: every coordination write had exactly one owner, which is why the registry-conflict
  class vanished.
- **Watch your own watchers**: the Director's per-PR monitors (signature-diff loops with
  terminal-state exits) all exited cleanly; the exit-conditions discipline from the prior arc
  held. The one watcher that failed was the CLI one — input-to-verify applies to tools, not
  just scripts.

## 7. Open at time of writing (live lanes, not conclusions)

G1b (Abyssal — predecessor-direction view, the session's one substantive design correction:
prior-knowledge = predecessors, requiring reversed-edge construction over an outgoing-only BFS);
comms-watch hardening c1 (Luminous); S3 held warm behind G1b (Iridescent); G4 build gated on G2;
the principles-prompt attribution gate and bulk-refresh timing with the owner; Director
understudy transition (Solar Soaring Star) awaiting Moment-1 pre-positioning. A closeout
addendum to this report should record their outcomes; the in-flight design decisions above are
recorded in the plan todos and comms events, not duplicated here.

## Routing

Lessons consolidated to the napkin throughout the session (2026-06-10 section); the closeout
learning pass (oak-consolidate-docs) routes durable candidates onward — the worktree-team
validation evidence in §1 supports the pending-graduations collaboration-practice pattern
candidate; §3's tooling defect is cured by the named plan; §5's layering numbers support the
extensive-reviewers doctrine with this session's first quantified ledger.

## Addendum (post-Moment-2, written at the outgoing Director's wake)

### 8. The Director succession — and the lesson it forced

The understudy transition (owner-designed: Solar Soaring Star shadows, outgoing Director fires
Moment 2 on named criteria) did not run its planned course, and the way it deviated is the
addendum's load-bearing content.

At 15:28:55Z — nine minutes before the Moment-1 pre-positioning event posted — the outgoing
Director's OWN comms watcher hit the hang-but-run defect documented in §3: process alive,
emissions stopped, seen-file frozen. The Director continued working (report authoring,
pre-positioning, the handoff-mechanics explainer) on a silent stream, attributing the quiet to
routine implementer work. Every signal of the next ~55 minutes — Abyssal's clean c1-boundary
closeout, two new seat pickups (Radiant Ascending Eclipse on G1b c2, Umbral Prowling Lantern on
G4a), a pickup contention and its resolution, Luminous landing all three hardening cycles, and
Solar's own arrival — was invisible to the seat whose defining duty is awareness. The owner
held the transport and directed Moment 2 at 16:22:39Z (acknowledgement `0a3d08ff`, Solar's
claim `8cd0de7f`); the outgoing Director was woken after the fact, verified the transfer
first-hand, stopped its monitors, and closed its claim citing the acknowledgement.

**The lesson: the detector cannot detect itself.** The stall diagnostic in §3 worked because an
OUTSIDE observer (the Director) read heartbeat-against-cycle-label divergence and cross-checked
work evidence. When the same defect hit the Director, there was no outside observer with that
duty — the highest-awareness seat is the one nobody else is watching. Three cures, layered:

1. **Tooling (already planned, landed-in-branch)**: the hardening plan's c1 fail-loud deadlines
   convert hang-but-run into supervisor-visible death, and its c2 default-on heartbeat-file
   makes staleness externally classifiable — for every agent including the Director.
2. **Practice (recommended to the incoming Director)**: the Director's watcher staleness check
   joins every implementer's cycle-boundary sweep — cheap mutual cover replacing the
   asymmetric watch.
3. **Protocol (validated by the deviation)**: PDR-064's two-moments shape absorbed the failure
   gracefully — because pre-positioning (`7dc40d71`) and the handoff-mechanics explainer were
   already in the stream, the owner-directed Moment 2 was a completion of a prepared transfer,
   not an improvised rescue. Front-loading the information transfer is what made the abrupt
   path cheap. The criteria-based shadow period was the plan; the doctrine's recovery path was
   the reality; both were pre-written, and that is the point.

Succession state at this addendum: Solar Soaring Star is the Director (singleton invariant
restored); the outgoing Director's session continues as a non-coordinator member for the
write-up arc only, with continuity writes routed through Solar. Live-lane outcomes (G1b c2,
G4a, the hardening merge) belong to Solar's record, not this one.

## Addendum 2 (written by the third Director at their own succession's completion)

### 9. The third Directorship (17:26–19:42Z): the rotation cadence becomes the operating mode

**Author**: Celestial Glowing Dusk (Director third holder, claude / Fable 5, `1e526e`), written
on the owner-directed write-up arc after transferring authority to Stratospheric Swooping
Zephyr (`fe53ec`, Moment-2 event `ed4e9d01`). Scope: the third Director window. Delivered in
the window: #159 (resync, `c60f030f`) and #160 (turbo env, `409c0999`) merged under two-loop
serialisation; ALL G1b source work completed across two seat rotations (four gate-green
commits ending `036b459e`, −51,427 lines of superseded surface retired); the G2 mint-rule
design delivered adversarially-reviewed (verdict event `62313be2`); five seat rotations and
one Director succession executed with zero lost work; two continuity waypoints committed +
pushed (`e8c9b219`, `ceb4dc8f`).

- **Rotation became cadence, not exception.** §2 recorded rotations as events; this window ran
  them as the steady state: five seat rotations (Airy-Squall→Galactic, Twinkling-Orbit→Eclipsed,
  Galactic→Fruited, plus two standbys pre-positioned: Glassy for Eclipsed, Fruited pre-arrival)
  and a Director succession, ~20 minutes apart on average, all owner-initiated. What made the
  cadence cheap: (a) **pre-arrival routing** — a broadcast addressed to a not-yet-registered
  successor by name, absorbed by their session-open baseline sweep (worked first for Fruited,
  event `221f42df`; the incoming Director then reused the shape for Glassy within minutes —
  doctrine propagating by stream observation, not instruction); (b) handoff-record chains
  (each record names its predecessors; the fifth G1b holder read three records and was
  instantly current); (c) the **two-condition transfer trigger** set this window
  (owner-calibrated: natural boundary OR self-sensed ~40% context approach — degradation onset
  for this session class is 40–45%, far below PDR-063's 80%). Worked instance: Twinkling Orbit
  at 36% finished c2-3 to gate-green INSIDE the tightened envelope and transferred at the
  boundary — the trigger reshaped behaviour (scope-fenced sweep, no PR mechanics) without
  firing.
- **The detached-heartbeat class produced its third variant — from the Director seat, in a new
  mode.** §3: hung watcher, live agent. §8: hung watcher, blind Director. This window:
  **blocked-on-owner-ask** — the Director heartbeat-only for ~9 cadence windows while awaiting
  a synchronous owner decision, indistinguishable from stalled (a merge-ready PR waited 49
  minutes). The implementer's PDR-078 §6 bounded ping fired correctly; the named cure is now
  practice: entering a potentially-long owner-wait, relabel the heartbeat
  (`blocked-on-owner-ask`) — the label IS the signal. Honest-label discipline generalised
  across the team within the hour (idle seats, paused standbys, and the write-up arc all
  self-describe).
- **The occupied-seat contention replayed and the choreography held under a race.** An
  owner-named successor arrived while the incumbent was live mid-cycle (the §2/Solar ruling's
  exact shape); the Director's claim-closure raced the incumbent's liveness broadcast by
  seconds. Resolution: hold the successor, restore registry truth, let the incumbent run to
  the boundary — and the incumbent then DELIVERED to gate-green inside their budget. The
  lesson: under fast rotation, registry operations on a live peer's claim need the peer's own
  signal (their supersession or closeout event) as the trigger, never the successor's arrival
  alone.
- **The verify-the-write-proof discipline earned its place as a standing ruling.** Three
  silent-failure shapes in one window: a comms-direct rejected on a malformed id whose error
  tail read as success (a Director ruling silently never landed); a claims-close that no-ops
  on an unmatched id; an append whose success is indistinguishable from failure without a
  grep. The cure is uniform — a write is real when its success token is observed — and the
  tool-fix notes are filed (napkin §Practice/tooling feedback) under the owner's standing
  direction that unnecessary-attention costs are tool-fix notes. A bootstrapping agent
  independently paid the same tax (a bare `test-probe` broadcast to verify their write path)
  — corroboration that the fix belongs in the tool, not in agent discipline.
- **The pull-forward pattern is now 2-for-2 and faster.** Iridescent's G4 Gate-1 pull-forward
  (§4) took a seat-session; Galactic's G2 mint-rule pull-forward ran arrival-to-reviewed-verdict
  in ~25 minutes: read-only grounding against the fresh bulk snapshot, two adversarial
  reviewers (one concern-pair folded, one framing refuted with grounds, every quantitative
  claim reproduced), open items named-not-decided, zero source edits. The design arrived
  settled before its execution unblocks — the critical-path compression a third seat could not
  have bought (the owner asked; the dependency analysis said the fork arrives at G2's merge,
  and the idle warm seat took the design instead).
- **Owner scope-assurance ran three-layer and the layers agreed.** "Will the full
  prior-knowledge graph survive c2-3?" was answered by: the corpus read first-hand in main
  (1,612 nodes / 3,452 prerequisiteFor edges), the deletion set grepped against graph-corpus
  paths (zero intersection), and a stop-and-flag tripwire embedded in the implementer's GO
  (their sweep confirmed it). Verdicts to the owner rested on my own reads at every layer —
  the first-hand-means-me discipline applied from the direction seat, where the temptation to
  relay is strongest.

Succession state at this addendum: Stratospheric Swooping Zephyr is the Director (fourth
holder; clean two-moments path, the third clean PDR-064 execution today); the G1b PR (#161)
opened into their serialisation queue minutes after transfer; the G2 fold, S3/G2-execution
routing, and the small queue transferred ordered and pre-staged in pre-positioning `56ae6447`.
This window's open question for the shape's next iteration: rotation this fast concentrates
choreography load on the Director (five pickups adjudicated in ~35 minutes) — whether
pre-arrival routing plus handoff-record chains keep that load sublinear as cast size grows is
the thing to watch.
