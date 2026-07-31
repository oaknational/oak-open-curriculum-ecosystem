# Liveness Heartbeat Cron

Liveness is observable, or it is not. Where the
[all-channels comms watcher](comms-all-channels-watcher.md) ensures
*incoming* visibility — every event the team emits reaches every agent —
this rule ensures *outgoing* visibility — every agent's continued presence
reaches the team. Both are required preconditions of the full protocol
(PDR-078, Accepted); their *value* is context-contingent per
[`collaboration-is-value-contingent`](collaboration-is-value-contingent.md).
The incoming-awareness watcher is near-universally justified. The outgoing
heartbeat's value depends on a consumer (async retirement-detection). As of
2026-06-15 this is a graduated PDR-078 §4 exemption — the **consumer-absent
exemption**: suspend heartbeat emission when no consuming peer is observable on
the registry (a solo session, or a live owner/coordinator detecting retirement
directly from ground-truth surfaces), and resume the moment a consuming peer
appears, the conductor goes async, or the cast rotates. PDR-082 (Adopted) is
the n=2 owner-visible special case of this exemption.

The portable contract — cadence, threshold, redundancy rule, exemption
set, and the structural cure they compose — is authoritatively specified
by
[PDR-078 (liveness-heartbeat contract)](../practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md).
The repo-bound phenotype substrate that operationalises the contract in
this repository — the comms-event substrate shape, the canonical event
kind / discriminator field, the watcher render token — is recorded in
[ADR-186 (comms-event heartbeat lifecycle substrate)](../../docs/architecture/architectural-decisions/186-comms-event-heartbeat-lifecycle-substrate.md).
This rule is the operational adoption point: it cites the contract +
phenotype pair as authoritative and prescribes the team-cadence-shaped
discipline that every participating agent runs.

## The liveness classes this rule covers

This rule governs the OUTGOING classes: `EMIT` in its emit-side
sections, `REGISTRY` inside the canonical invocation, and `PROGRESS`
in the heartbeat-only stall diagnostic. The three are mutually
independent — each fails alone, and this rule's sections are the
repo's operational home for all three. It does not, and cannot,
certify that a peer's coordination reaches a seat — those are the
incoming classes named in PDR-133 §2, none of which any check here
touches. The class model, the reading rule (an observation is evidence
only about the classes on the path it traversed, and about nothing
else), the self-observation corollary, and the per-platform
declaration obligation live in
[PDR-133](../practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md),
ratified by the owner 2026-07-25 — cite it as the model; its
obligations bind. The
autonomous-emitter warning below is the emit-side instance of the
reading rule: a scheduling layer's green is evidence about the
scheduler and nothing else.

## Trigger

A team session is bootstrapping (`start-right-team` SKILL First Moves
move 2) or an existing team session is being rejoined after compaction
or handoff. This rule fires after the all-channels comms watcher
(`comms-all-channels-watcher.md`) is running and before the team-start
broadcast lands.

## Action

### Operational summary

Binding norms preserved here for fast read; PDR-078 + ADR-186 are the
authoritative source of substance.

- Every active team member emits a heartbeat event at cadence ≤ 4
  minutes (PDR-078 §Emit-side).
- Silence past the 10-minute threshold marks a seat
  **retired-pending-confirmation**: a soft signal that OPENS the
  retirement protocol, never a verdict that closes it (PDR-078 §3).
  Claim auto-rebalance fires only after the direct ping and the remote
  work-evidence cross-check of §"Heartbeat-only stall diagnostic" have
  both come back negative — see §"State thresholds" and §"Claim
  auto-rebalance protocol on retirement" below.
- The current repo phenotype (per ADR-186) emits heartbeats as comms
  events with `tags: ["heartbeat"]` per
  [ADR-183](../../docs/architecture/architectural-decisions/183-comms-event-tag-namespace-substrate.md)'s
  namespace substrate, rendering as a `[HEARTBEAT]` channel token.
  ADR-186 names `lifecycle + event_type='heartbeat'` as the canonical
  shape going forward; both shapes are operationally valid during the
  migration window (per ADR-186 §Migration discipline). The
  identity-tuple subject-line format:

```text
Heartbeat: <agent_name> (<session_id_prefix>) — <current lane>
```

Body composes from typed state args (claim id, intent, branch, current
cycle label) per the A1 typed-origin heartbeat gate; the canonical
agent-tools CLI rejects `--body` argv on `--tag heartbeat` events.
Heartbeats are coordination signal, not narrative content; substrate
weight should be low so the comms stream stays scannable.

### Canonical invocation — platform background-task primitive

Run a 4-minute-cadence loop that emits a heartbeat event each cycle.
**A claim-holding seat's loop bumps BOTH liveness surfaces every tick**:
the comms heartbeat event AND the claims registry
(`claims heartbeat --active <path> --claim-id <id> …`). The two are
distinct mechanisms — a comms-only loop leaves the registry's
`heartbeat_at` silently stale for the whole tenure (F-92; worked
instance 2026-07-15: a Director seat read continuously live on the
comms stream while its claim read stale for ~15 hours, peer-caught at
succession). Neither surface alone is liveness: the comms stream is
authoritative for intent, the registry check for age.
Platform-specific shapes:

- **Claude Code**: the `Monitor` tool with `persistent: true` and a
  `while/sleep 240` loop emitting heartbeats. **`CronCreate` is NOT a
  valid emitter shape** (calibrated first-hand 2026-07-31): cron
  prompts fire only while the session is IDLE, so a seat in one long
  working turn never fires them — the heartbeat goes dark exactly when
  the seat is busiest, which is indistinguishable from retirement on
  the F-75 detector (worked instance: a cron-armed seat flagged at the
  retirement threshold ~15 minutes into an active graduation batch,
  cleared only by the peer's work-evidence cross-check).
  A seat holding MULTIPLE active claims runs `claims heartbeat` once
  per claim-id per tick — the command updates only the named claim, so
  a singular-claim loop leaves every sibling claim silently stale (the
  same F-92 shape one registry-surface deeper).
- **Cursor**: the equivalent watch / background-task primitive per
  platform docs.
- **Codex**: the equivalent background-task mechanism.

macOS host note (owner-ruled 2026-07-31): fleet/workflow windows run under
`caffeinate -dims`, scoped to the window (started and stopped with it) —
host idle-sleep otherwise kills every monitor and heartbeat loop mid-window,
and the silence is indistinguishable from fleet-wide retirement. A standing
`pmset` change was considered and not adopted; the scoped, reversible form
is the ruling.

The loop SHOULD swallow stdout on success (failures emit so the agent
can react). The loop dies when the session ends, which correctly
satisfies the retirement-on-silence rule for natural session-end.

### Loop hygiene (worked-instance-derived, 2026-06-11)

Four disciplines keep the heartbeat loop honest; each cures a recorded
failure instance from the 2026-06-11 team window:

- **Relabel at lane transitions.** A fixed-label loop goes stale by
  construction: its title and typed state args are frozen at start, so a
  claim open, lane-terminal event, or cycle advance leaves the loop
  asserting a lane the agent no longer occupies (worked instance: a
  PDR-078 stall ping fired on a seat that was actively working, three
  cadence windows after its declared lane terminated). Relabelling —
  stop the loop, restart it with the honest label and current
  claim/intent/branch/cycle args — is a NAMED step of every lane
  transition, the same discipline class as verifying a CLI write's
  destination.
- **Stop-loop-first at heartbeat-end.** At session end the ordering is:
  stop the loop FIRST, then emit the final heartbeat-end event. A loop
  that outlives the end event can emit a stale "active" heartbeat after
  peers have already read the stand-down.
- **One timestamp per tick.** Derive a single timestamp per tick and pass
  it to both `--now` and `--created-at`; two `$(date)` calls can race a
  second boundary and the CLI rejects the resulting created_at-in-future
  (worked instance 2026-06-11).
- **Failures report with captured stderr.** A loop that swallows stderr
  makes its own failures undiagnosable (worked instance: a transient emit
  failure during registry churn surfaced as a bare "FAILED" line). Capture
  stderr into the failure line —
  e.g. `out=$(cmd 2>&1) || echo "HEARTBEAT FAILURE: $out"` — never a bare
  failure marker. Sibling of the
  loud-writes class.
- **Relabel on entering a long owner-wait.** On entering any
  potentially-long blocked-on-owner state, restart the loop with
  `cycle=blocked-on-owner-ask` (or equivalent honest label). A static
  active-lane label while blocked is indistinguishable from a stall;
  peers read the blocked label correctly as do-not-takeover and
  owner-transport-holds (worked instance: the third detached-heartbeat
  variant in one day, 2026-06-10; owner-approved 2026-06-11).

### Owner-input precedence on every scheduled tick

A cron, scheduled wakeup, or persistent monitor prompt is itself
substrate. Before it emits a heartbeat or resumes prior work, it MUST
read the latest owner turn. If the owner has issued a direction that
supersedes task continuation — pause, stop, wait, hold, standby,
paused-until-X, or an equivalent direction — do not resume the previous
task. Instead emit the final-heartbeat-end / pause-standby signal that
matches the new owner direction, stop the scheduled loop if the
direction requires it, and wait for the next real owner turn. Only when
no superseding owner direction has landed should the tick emit a
heartbeat and return to the in-flight task.

### Owner reroute visibility

When the owner redirects an active team member from the coordinated
boundary to a different lane, the rerouted agent MUST broadcast the
change within one heartbeat cadence. Include the new target lane,
expected duration, and original-lane disposition (`owned`, `handed
off`, `paused`, or `released`). This narrative event counts as
substantive activity for PDR-078's heartbeat-only stall diagnostic.
Until it lands, peers may correctly read heartbeat-only output against
the old lane as stalled and follow the direct-ping / takeover protocol.

### State thresholds

| Time since last heartbeat | State | Director action |
|---|---|---|
| < 4 min | Active | None |
| 4–10 min | Offline (transient) | None; assume resume imminent |
| ≥ 10 min | Retired-pending-confirmation — a soft signal opening a protocol, not a verdict (PDR-078 §3) | Claim auto-rebalance fires only after the direct ping ([`ping-before-escalate`](ping-before-escalate.md)) and the remote work-evidence cross-check in §"Heartbeat-only stall diagnostic" have both come back negative; the disposition steps are in §"Claim auto-rebalance protocol on retirement" |

### Heartbeat-only stall diagnostic

Heartbeats present but no substantive events for two or more cadence
windows means the role is alive-but-stalled-pending-coordination, not
active-on-lane. Direct ping with a one-cadence reply window; if silent,
broadcast takeover or route-adjustment intent before acting. See
PDR-078 §6.

**The autonomous-emitter generator** (three instances, 2026-07-20/21):
heartbeat loops run in the platform's background-task layer,
independent of the reasoning loop — a SUSPENDED harness (or a seat
whose main loop is wedged) heartbeats on schedule indefinitely,
asserting a liveness the seat does not have. One seat emitted perfect
≤4-min heartbeats through a ~64-minute harness suspension; two peer
seats heartbeated for 40+ minutes while their main loops processed
nothing. Emitter presence is therefore NEVER a liveness verdict on its
own; the detection that works is the observe-side pair this rule
already names — substantive response to a direct ping, plus the
work-evidence cross-check (branch tips, comms absorption, PR
activity). Weight substantive-response over heartbeat presence, always.

**Liveness arithmetic is tool-computed, UTC-vs-UTC, always.** Three
worked errors in one class: a false ~58-minute silence computed by
comparing comms UTC timestamps against a local-BST wall clock led to a
premature Director takeover (2026-06-25); the identical trap recurred
at a standby seat three days later (2026-06-28); and a seat reading
BATCHED monitor notifications drifted ahead of the wall clock and
nearly fired a false-silence escalation (2026-07-21). Hand-computed
elapsed time is banned for liveness verdicts at every seat: compute
ages with the tooling (`comms peer-liveness`, or explicit `date -u`
against event `created_at` deltas), never by eyeballing timestamps.

The work-evidence cross-check that precedes any bounded-deadline
default MUST include remote surfaces — PR pushes, review replies, and
check activity via `gh` — not only comms and local git. An agent can be
comms-silent yet substantively active on a PR; a takeover fired on
comms-evidence alone reads an active seat as stalled (two worked
instances, 2026-06-10/11; owner-approved 2026-06-11).

### Surfacing peer heartbeat-silence (F-75)

The stall diagnostic above is *pull*: an agent must remember to look. The
`comms peer-liveness` command makes the look mechanical, and a Monitor/poll
recipe turns it into a *push* alert — the F-75 cure for "no standard surface
fires when a PEER's heartbeat goes silent."

`comms peer-liveness` reads the PDR-078 heartbeat **comms-event** stream (not
claim freshness — that is a deliberately coarse 4-hour window that cannot see a
silently-retired peer, and not the watcher's own `<seen>.heartbeat.json`),
groups by author identity, takes each peer's latest heartbeat, and classifies
its age: `active` (<4 min) / `offline` (4–10 min) / `retired` (≥10 min),
most-stale-first. It is read-only and needs no identity seed:

**Vocabulary note.** The tool emits the bare label `retired` at the
≥10-minute bucket, while this rule's state name for the same bucket is
**retired-pending-confirmation** (§"State thresholds"). The label is the
tool's age classification, not a retirement verdict; read it as the
signal that opens the protocol, and do not carry the word `retired` from
the tool's output into a broadcast as if it were a conclusion.

```bash
pnpm agent-tools:collaboration-state -- comms peer-liveness \
  --comms-dir "<PRIMARY coordination home>/.agent/state/collaboration/comms"
```

`peer-liveness` does not yet default its read path. The absolute PRIMARY-home
path above is therefore mandatory, especially from a linked worktree; a
cwd-relative `.agent/state/...` path can read an empty decoy while the
canonical watcher correctly reads the shared stream.

The alert recipe — poll on the team cadence and emit only when a peer is
`retired`, so the line IS the heartbeat-silence alert. Run it as a `Monitor`
(or platform background-task); pair every alert with
[`ping-before-escalate`](ping-before-escalate.md) and the remote work-evidence
cross-check above before any retirement-detection broadcast — the classifier is
**input-to-verify, never an automatic retirement verdict** (the F-44 residual:
liveness still cannot tell "working" from "wedged" until OQ5):

**Poll the DELTA, never the bucket.** The `retired` bucket is cumulative — every seat that
ever retired stays in it forever — so a recipe that emits the whole bucket each poll emits
~20 permanently-dead seats every cycle, and an `idle` counter that increments only on an
EMPTY bucket never increments at all. The F-75 signal is a peer *newly* crossing the
threshold; baseline the bucket at arm time and emit only what is new against it. Both the
noise and the unreachable exit criterion were live in this recipe's earlier form and were
measured, not inferred (2026-07-27: 20 dead seats re-emitted every 2 minutes with the
stand-down structurally unreachable, which is exactly the `loop-exit-criteria-required`
violation the recipe claimed to satisfy).

```bash
# Emits ONLY peers newly crossing the threshold; verify before acting (never a verdict).
# Exit criteria (loop-exit-criteria-required): session close, or MAX_IDLE consecutive
# polls with no NEW retirement — reachable, because `idle` advances on a quiet delta
# rather than on an empty bucket.
COORD_HOME="$(git worktree list --porcelain | sed -n '1s/^worktree //p')"
if [ -z "$COORD_HOME" ] || { [ ! -d "$COORD_HOME/.git" ] && [ ! -f "$COORD_HOME/.git" ]; }; then
  echo "STOP: PRIMARY coordination home not derived — peer-liveness is not armed" >&2
  exit 1
fi
COMMS_DIR="$COORD_HOME/.agent/state/collaboration/comms"
PREV=$(mktemp); CUR=$(mktemp)
extract() { grep '^retired' | sed -E 's/^retired[[:space:]]+[0-9.]+m ago[[:space:]]+(.*)[[:space:]]+last_heartbeat=.*/\1/'; }
pnpm agent-tools:collaboration-state -- comms peer-liveness \
  --comms-dir "$COMMS_DIR" 2>/dev/null | extract | sort > "$PREV" || true
idle=0; MAX_IDLE=60
while [ "$idle" -lt "$MAX_IDLE" ]; do
  sleep 120
  pnpm agent-tools:collaboration-state -- comms peer-liveness \
    --comms-dir "$COMMS_DIR" 2>/dev/null | extract | sort > "$CUR" || true
  # An EMPTY read is transport failure, never "everyone came back": skip the cycle
  # rather than resetting the baseline on a dead read.
  if [ -s "$CUR" ]; then
    new=$(comm -13 "$PREV" "$CUR")
    if [ -n "$new" ]; then echo "NEWLY RETIRED: $(echo "$new" | tr '\n' '|')"; idle=0; else idle=$((idle + 1)); fi
    cp "$CUR" "$PREV"
  fi
done
```

Corpus-test the `extract` filter before arming, per
[`comms-all-channels-watcher`](comms-all-channels-watcher.md) §"No hand-rolled fallback":
prove the pass/leak counts against real `peer-liveness` output (agent names contain
spaces, so a positional `awk` field split is wrong).

The standalone command is the read-model; the poll-recipe is the alert. Wiring
the same classifier into `comms watch` as an `--alert-stale-peers` mode is a
recorded follow-on (it would couple an absence/timer concern into the
event-driven watcher, so it is kept a separate thin consumer).

### Reading calibrations (consolidated 2026-07-30, all measured)

- **The knife-edge**: "active < 4 m" against the fleet-standard 240 s beat means
  a poll sampling seconds before the next beat reads a HEALTHY seat as offline —
  every active→offline flicker in one measured day was followed by live
  activity, including the observer flagging ITSELF. Alert only on transitions
  INTO retired (≥ 10 m, the recipe above), keep margin between cadence and the
  active window, and cross-check work-evidence before any retirement claim.
  Under fleet load the OUTGOING liveness surface starves first, so peer-liveness
  over-reports retirement exactly when the fleet is busiest.
- **The shared-substrate signature**: a liveness signal naming EVERY seat
  simultaneously — especially one naming the observer itself — is evidence about
  a SHARED substrate (host sleep, reboot, comms home, clock), never about N
  independent retirements. First check `sysctl kern.sleeptime kern.waketime` AND
  `kern.boottime` (a fresh boot zeroes sleeptime); if the window covers the
  silence it is environmental — no retirement broadcasts, re-arm and move on.
  The host power-management posture (caffeinate/pmset during fleet windows) is
  an owner-level decision, not agent-side retry logic.
- **Process restart is a distinct event class from compaction**: monitors
  SURVIVE compaction but NOT a platform process restart. The restart signature
  is vanished tasks ("no completion record") plus MCP servers reconnecting —
  on it, re-arm all monitors and run the foreground gap sweep; do not trust
  any monitor's apparent continuity.
- **Never diff lines that contain their own clocks**: a delta poll comparing
  raw output whose age field changes every pass never converges (two measured
  noise classes: the moving age field, then its residual column padding) —
  strip the timestamp/age and squeeze whitespace before comparing, as the
  recipe's `extract` does.

### Claim auto-rebalance protocol on retirement

When an agent crosses the 10-minute threshold without heartbeat:

1. **Director surfaces a retirement-detection event** (broadcast;
   tagged `failure-mode` if the retirement is unexpected, tagged
   `behaviour-note` if it is a normal session-end without explicit
   closeout broadcast). The
   [`ping-before-escalate`](ping-before-escalate.md) discipline applies
   — cross-check git work-evidence, commit queue, and directed inbox
   before broadcasting; direct-ping first.
2. **Per-claim disposition**:
   - **Claims with `handoff_record_path` field set**: read the named
     handoff record (PDR-063 / ADR-182); surface to the natural-next
     agent named in the record or Director-route to a suitable agent.
   - **Claims without a handoff record**: surface as orphan-class;
     Director routes through dialogue to a natural-next-agent based on
     the claim's intent and the team's current shape.
   - **Claims explicitly retained for handoff** (named in the retiring
     agent's closeout): wait until the named successor arrives or the
     retention TTL expires, whichever fires first.

### Exemptions

The retirement-on-silence rule does NOT fire for the following
operational windows — silence is expected during these states and is
not a retirement signal:

- **Coordinator-transfer 30-minute grace window** (PDR-064
  §"Coordinator Handoff (Two Moments)"). Between Moment 1
  pre-positioning and Moment 2 active-acknowledgement, the incoming
  coordinator may be compacting, bootstrapping, or running their own
  start-right discipline; the outgoing coordinator continues
  heartbeats until Moment 2 lands and authority transfers cleanly.
- **Marshal-cycle contiguous-execution exemption**: while a marshal is
  inside a cycle (husky gate-chain in flight, staging window open,
  commit window open), cycle-boundary broadcasts (stage-complete,
  gate-green, commit-landed, tree-green) satisfy heartbeat semantics
  during the contiguous window. The marshal MUST emit an explicit
  heartbeat-tagged event during idle windows between cycles.
- **Sub-agent dispatch verdict-synthesis exemption**: while the
  dispatching agent is awaiting reviewer transcripts, verdict-synthesis
  broadcasts (with subagent transcript ids) satisfy heartbeat
  semantics. The dispatching agent MUST emit an explicit
  heartbeat-tagged event if the dispatch window exceeds 8 minutes (one
  full silence-to-offline transition).
- **Consumer-absent exemption** (PDR-078 §4, graduated 2026-06-15):
  categorically different from the three above — it suspends heartbeat
  *emission itself*, not the threshold, because it fires on consumer-absence.
  When no consuming peer is observable on the active-claims registry (a solo
  session, or a live owner/coordinator detecting retirement directly from
  git / the registry / `gh` rather than from the heartbeat stream), the cron
  need not run at all. It re-arms the moment a consuming peer appears, the
  conductor goes async, or the cast rotates. n=2 owner-visible mode (PDR-082,
  Adopted) is the special case where chat-visibility makes the consumer absent.
  - **Worked instance — the standby / successor-in-waiting seat.** A warm
    standby (a named successor benched until it adopts a claim) is a direct
    consumer-absent case, not a new exemption: it holds **no claim**, so its
    retirement rebalances nothing, so its heartbeat has no consumer. The
    standby-seat liveness contract is therefore **watcher + team-start
    registration, no heartbeat cron, no claim** — its incoming-visibility
    watcher and its registration broadcast are its liveness signal, and the
    PDR-063 handoff handshake confirms it is live at the moment it adopts.
    (This also matches the tooling reality that heartbeat mode requires a
    `--claim-id` a standby does not hold — frictions-register F-73 — so the
    two reasons converge: a standby neither needs nor can emit a heartbeat.)
    Adopting the claim flips the seat to active and arms the heartbeat in the
    same move. Minting a marker-claim purely to anchor a heartbeat re-creates
    the consumer the exemption removes; do not.

## Worked Instance

A founding worked instance for the heartbeat-only stall diagnostic is
preserved in PDR-078 §Falsifiability: an agent's session emitted
heartbeats every ~4 min for nearly an hour while making zero
substantive lane progress after a peer's commit-landed broadcast. No
investigation, no push attempt, no reply to a direct ping. The
presence-without-progress state looked identical to retirement-
detection from PDR-078's silence-threshold lens but was diagnostically
distinct: alive-but-stalled-pending-coordination, not retired. The
cure shape — direct-ping with bounded deadline ≈ 1 heartbeat cycle,
then broadcast takeover-of-lane intent with rationale — landed via the
takeover broadcast that followed. PDR-078 clause 6 and §Falsifiability
now formalise the diagnostic; the rule's commit-time history records
the specific commit and event identifiers.

## Why a Rule, Not a SKILL Clause

This rule was extracted from `start-right-team` SKILL §0.5 because the
heartbeat cron discipline is a discrete operational invariant with a
single Trigger (team session bootstrap) and a single Action (cron loop
running). The SKILL retains a thin-pointer paragraph naming this rule;
the substance lives here for the same two reasons that govern
[`comms-all-channels-watcher`](comms-all-channels-watcher.md): rule
discoverability and trigger-loaded doctrine cost.

The contract substance lives in PDR-078 (portable contract) and ADR-186
(repo-bound phenotype). This rule's role is the operational adoption
point — the named place where every agent reads the binding norms,
state thresholds, exemptions, and invocation shape at session
bootstrap.

## Related Surfaces

- [PDR-078 (liveness-heartbeat contract)](../practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md)
  — the portable contract this rule operationalises. Cadence, threshold,
  redundancy rule, exemption set, and the structural cure live there.
- [ADR-186 (comms-event heartbeat lifecycle substrate)](../../docs/architecture/architectural-decisions/186-comms-event-heartbeat-lifecycle-substrate.md)
  — the repo-bound phenotype that operationalises PDR-078 here.
  `[HEARTBEAT]` watcher token, at-most-once render guarantee, consumer
  dual-filter contract during migration. See ADR-186 §Migration
  discipline for the migration-window exit criterion.
- [ADR-183 (comms-event tag-namespace substrate)](../../docs/architecture/architectural-decisions/183-comms-event-tag-namespace-substrate.md)
  — the tag-namespace substrate ADR-186 composes through for the
  `[HEARTBEAT]` render token during the migration window.
- [PDR-027 (threads, sessions, and agent identity)](../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
  — identity tuple format in the heartbeat subject line.
- [PDR-064 (coordinator handoff two moments)](../practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md)
  — grace-window exemption for coordinator transitions.
- [`ping-before-escalate`](ping-before-escalate.md) — the cross-check
  discipline that fires before retirement-detection broadcasts at the
  ≥10 min threshold.
- [`comms-all-channels-watcher`](comms-all-channels-watcher.md) — the
  incoming-visibility sibling.
- [`directed-routing-requires-absorption-ack`](directed-routing-requires-absorption-ack.md)
  — the `ABSORB`-class sibling: heartbeats certify `EMIT` only, and the
  ack convention that rule owns is the added delivery signal that
  detects a heartbeat-fresh-but-absorption-dark seat.
- [PDR-133](../practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md)
  (Accepted) — the liveness class model this rule's `EMIT` / `REGISTRY`
  / `PROGRESS` coverage sits inside, and the home of the reading rule,
  the self-observation corollary, the two external instruments, the
  absence conjunction, and the platform-declaration obligation.
- [`start-right-team` SKILL First Moves move 2](../skills/start-right-team/SKILL-CANONICAL.md)
  — the thin-pointer host that names this rule's firing moment. The First
  Moves entry IS the trigger surface; removing it would make this rule
  unreachable from session bootstrap.

## Enforcement

Behavioural at session open. The cron's presence is observable as a
running background task (Cron job id, Monitor task id, or platform
equivalent); the team-start broadcast names the cron status. The
heartbeat-tagged comms events are observable on the stream at ≤4 min
cadence per active agent. Future hardening could add a session-open
check that fails fast if no heartbeat cron is observable, but the
discipline is the named first-move pause after watcher start.
