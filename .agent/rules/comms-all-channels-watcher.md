# Comms All-Channels Watcher

Communication is the absolute heart of multi-agent work. Before any other
team-bootstrap step — before registering presence, before naming
coordination pressure, before opening any claim — every participating agent
must have a persistent watcher running over the **entire** comms event
stream at `.agent/state/collaboration/comms/`.

The comms event stream is the canonical truth. Public (broadcast), group
(narrative with `audience` including the agent), direct (`directed` kind,
and narrative with `addressed_to` matching the agent), observed
(cross-traffic and audience-mismatch events the agent witnesses but is not
responsible for), and lifecycle messages are all valid views onto the same
stream, and all are important. A watcher that filters to a single view
(e.g. directed-only filters, manual `ls -t` polling) discards the others
and will miss vital coordination.

## Trigger

A team session is bootstrapping (`start-right-team` SKILL First Moves move
`1`) or an existing team session is being rejoined after compaction or
handoff. This rule fires before any other team-bootstrap move — before
heartbeat cron, before team-start broadcast, before any source claim.

## Action

Run one event-driven watcher over the full
`.agent/state/collaboration/comms/` directory, emitting one notification
per new event, with **self-exclusion only** — filter out events authored
by the agent's own `(agent_name, platform, session_id_prefix)` identity
tuple (per
[`.agent/reference/comms-watch-mechanism.md`](../reference/comms-watch-mechanism.md)
§"Identity discipline") and emit everything else. Apply relevance triage
in agent reasoning, not at the watcher boundary.

### Canonical invocation — the `agent-tools` CLI

```bash
# Replace <agent-codename> with the codename emitted by identity preflight.
pnpm agent-tools:collaboration-state -- comms watch \
  --comms-dir .agent/state/collaboration/comms \
  --seen-file .agent/state/collaboration/comms-seen/<agent-codename>.json \
  --platform <claude|codex|cursor> \
  --model <model-id>
```

The CLI emits every relevant event with self-exclusion only against the
identity tuple it derives from the platform-specific session-id env var
(`PRACTICE_AGENT_SESSION_ID_CLAUDE`, `PRACTICE_AGENT_SESSION_ID_CURSOR`,
`PRACTICE_AGENT_SESSION_ID_CODEX`, or `CODEX_THREAD_ID`) — one of these
MUST be set in the shell, or the CLI exits with `missing collaboration
identity seed`. Each event is tagged `[BROADCAST]` / `[GROUP]` /
`[DIRECTED]` / `[OBSERVED]` / `[LIFECYCLE]` on its first line so the agent
knows the channel at a glance. `[OBSERVED]` means incidental visibility
of cross-traffic, not a new work contract (event shape:
`.agent/state/collaboration/comms-event.schema.json`). `--only-directed`
opts into the legacy narrow view.

Run the command via the platform's persistent background-task mechanism:
Claude Code uses the `Monitor` tool with `persistent: true`; Cursor and
Codex use their equivalent watch primitives.

### Seen-file convention

The `<agent-codename>.json` seen-file lives in
`.agent/state/collaboration/comms-seen/` (committed directory). On a fresh
clone or worktree where the directory has not yet been created,
`mkdir -p .agent/state/collaboration/comms-seen` first — the CLI does not
auto-create the seen-file's parent directory and `appendFile` will fail
silently if it is missing, causing the watcher to re-emit every event on
every poll. The codename matches the `agent_name` derived by
`pnpm agent-tools:collaboration-state -- identity preflight --platform <p>
--model <m>`; pre-existing seen-files in the directory model the
convention.

### Fallback shape — portable script

Use when the `agent-tools` CLI is not yet built locally, or on a platform
without the CLI:

```bash
SEEN=/tmp/<agent>-comms-seen.txt
ls .agent/state/collaboration/comms | sort > "$SEEN"
while true; do
  ls .agent/state/collaboration/comms | sort > /tmp/now.txt
  for f in $(comm -13 "$SEEN" /tmp/now.txt); do
    jq -r --arg self "$SELF_SESSION_PREFIX" '
      if (.author.session_id_prefix // .from.session_id_prefix // "") == $self
      then empty
      else "[" + .created_at + "] "
           + ((.author.agent_name // .from.agent_name // "?") + "/"
              + (.author.session_id_prefix // .from.session_id_prefix // "?"))
           + " -> " + (
               if (.to // null) != null
               then (.to.agent_name // "?") + "/" + (.to.session_id_prefix // "?")
               elif (.addressed_to // null) != null then .addressed_to
               elif (.audience // null) != null
               then "GROUP(" + (.audience | join(",")) + ")"
               else "BROADCAST"
               end
             )
           + " :: " + (.title // .subject // "?")
      end' ".agent/state/collaboration/comms/$f"
  done
  mv /tmp/now.txt "$SEEN"
  sleep 5
done
```

An agent on a platform with no persistent background-task primitive must
declare the gap in their team-start post and adopt a polling cadence that
sweeps the full directory at the team-cadence interval, never a
single-view filter — because the directed-only view misses the broadcast
and group events that carry the team-bootstrap coordination itself.

## Real-Time Failure-Mode Capture on the Comms Stream

Under any team session running under the all-channels watcher discipline
above, the comms event stream is also the real-time channel for
failure-mode capture per
[PDR-066](../practice-core/decision-records/PDR-066-comms-events-as-failure-mode-channel.md).
Failure modes worth surfacing to peers during their session — verdict
walk-backs, shell-quoting hazards, premature-optimisation reflex saves,
audit-shaped test catches, reviewer-dispatch surprises,
coordination-protocol gaps — are posted as comms-events as they occur,
not held back to session close.

The substrate-implementation phenotype is
[ADR-183](../../docs/architecture/architectural-decisions/183-comms-event-tag-namespace-substrate.md):
an optional `tags` array on the `narrative`, `lifecycle`, and `directed`
event kinds, with the namespace exactly `"failure-mode"` (substantive
failure modes) and `"behaviour-note"` (softer behaviour patterns worth
peers' attention but not yet failure modes).

The failure-mode event body follows a four-section convention —
**Observation / Diagnosis / Cure / Pointer** — kept short enough that a
watcher reading the event inline absorbs the substance in one read pass.
The convention is not schema-enforced (the body field stays free-form
prose by design); it is the SKILL-level discipline that makes the channel
scannable.

**Activation live as of 2026-05-23.** ADR-183's required substrate has
landed: the optional `tags` field is on `comms-event.schema.json`, and
watcher rendering with tests for `[FAILURE-MODE]` / `[BEHAVIOUR-NOTE]`
tokens composed with the existing channel tokens is active. Agents MAY
now write `tags: ["failure-mode"]` or `tags: ["behaviour-note"]` on the
`narrative`, `lifecycle`, and `directed` event kinds when the event's
substance matches the namespace above.

The comms-event channel is the primary first-capture vehicle for
real-time team-session failure modes and behaviour notes. The
consolidation surfaces remain the absorption destination: session
closeout reads the session's tagged events forward into napkin /
`distilled.md` / graduation surfaces as appropriate.

## Worked Instance

The 2026-05-22 watcher absorption gap was the founding failure mode for
this rule. An agent ran a directed-only filter over the comms stream
during a multi-agent session; the directed filter discarded broadcast
and group events that carried the team-bootstrap coordination itself.
The agent appeared bootstrapped on their own surface but was invisible
to peers and missed the broadcast coordinating cycle/boundary
assignment. The cure was the all-channels watcher with self-exclusion
only — and the rule that the watcher fires before any other
team-bootstrap move so the same gap cannot recur.

## Why a Rule, Not a SKILL Clause

This rule was extracted from `start-right-team` SKILL §0 because the
all-channels watcher discipline is a discrete operational invariant with
a single Trigger (team session bootstrap) and a single Action
(persistent watcher running). The SKILL retains a thin-pointer paragraph
naming the rule; the substance lives here for two reasons:

1. The rule corpus is the discoverability surface for agent-general
   disciplines. Folding the watcher invocation inside a SKILL section
   buries it where authors of new SKILLs and other coordination surfaces
   cannot find it.
2. The doctrine-load discipline of
   [`directive-file-context-budget`](directive-file-context-budget.md)
   benefits from rules being trigger-loaded — this rule loads at team
   session bootstrap, not at every session open, reducing baseline
   directive cost.

## Related Surfaces

- [`start-right-team` SKILL First Moves move 1](../skills/start-right-team/SKILL-CANONICAL.md)
  — the thin-pointer host that names this rule's firing moment. The First
  Moves entry IS the trigger surface; removing it would make this rule
  unreachable from session bootstrap.
- [`liveness-heartbeat-cron`](liveness-heartbeat-cron.md) — the
  outgoing-visibility sibling. Watcher delivers incoming visibility;
  heartbeat cron emits outgoing visibility. Both are non-negotiable
  preconditions for team work.
- [`.agent/reference/comms-watch-mechanism.md`](../reference/comms-watch-mechanism.md)
  — identity discipline and self-exclusion contract.
- [PDR-066](../practice-core/decision-records/PDR-066-comms-events-as-failure-mode-channel.md)
  — comms-events as failure-mode capture channel.
- [ADR-183](../../docs/architecture/architectural-decisions/183-comms-event-tag-namespace-substrate.md)
  — comms-event tag-namespace substrate (`failure-mode`,
  `behaviour-note`, `heartbeat`).
- [`use-built-agent-tools-cli`](use-built-agent-tools-cli.md) — governs
  the CLI surface this rule invokes.

## Enforcement

Behavioural at session open. The watcher's presence is observable as a
running background task (Monitor task id, Cron job, or platform
equivalent); the team-start broadcast names the watcher status. Future
hardening could add a session-open check that fails fast if no watcher
is observable, but the discipline is the named first-move pause.
