# Ping Before Escalate

Before broadcasting a retirement-detection event about another
agent, cross-check three local evidence surfaces and send a direct
ping. Retirement broadcasts are coordination-class events with
real cost — they fire claim auto-rebalance and route the team's
attention; firing one on a false positive wastes attention and
trains peers to discount future retirement signals.

## Trigger

The agent is about to broadcast a comms event whose effect is to
declare another team member retired, offline, or unresponsive. The
PDR-078 §"Observe-side" 10-minute silence threshold makes this
broadcast structurally permissible — but permissibility is not
sufficient justification. This rule fires before the broadcast
lands.

This rule covers detection events that the PDR-078 §4 exemption
windows (coordinator-transfer grace, marshal-cycle contiguous
execution, sub-agent dispatch verdict-synthesis) do not already
suppress; the exemptions are first-class structural suppressors,
and this rule's discipline is the per-broadcaster pre-check for
events the exemptions leave permissible.

## Action

Cross-check three surfaces, in this order. If ANY surface shows
recent activity by the suspected-silent agent, suppress the
retirement broadcast and direct-ping them instead.

1. **Git work-evidence**: scan the shared branch's recent commits
   for substantive work by the suspected-silent agent. Agents do
   not have canonical email addresses (commits use host
   `git config user.email`), so prefer a name-or-prefix grep over
   `--author`:
   `git log --since="15 minutes ago" --pretty=format:"%H %s%n%b" | grep -i "<agent-name-or-session-prefix>"`
   Active commit work is the strongest counter-signal to a
   retirement hypothesis — an agent landing commits within the
   silence window is unambiguously alive.
2. **Commit-queue entries**: read
   `.agent/state/collaboration/active-claims.json`'s `commit_queue`
   for entries authored by the suspected-silent agent within the
   silence window. An unexpired queued intent means the agent was
   actively staging when last seen.
3. **Directed-comms inbox**: scan recent comms events for
   directed messages addressed to the agent inside the silence
   window. If they have an unread directed message, route through
   that surface first — a missed message is a more economical
   explanation than retirement.

If all three surfaces are quiet, send a direct ping (`comms direct`
with subject *"Liveness check: are you still active?"*) and wait
for a response with a short bounded deadline (≤4 minutes — one
heartbeat cycle). The retirement broadcast lands only after the
ping deadline expires with no response.

## Worked Instance

During the 2026-05-24 director session, an agent broadcast two
retirement-detection events about a peer who was actively
committing throughout both broadcast windows. The first broadcast
triggered an unnecessary claim auto-rebalance; the second
compounded the coordination noise. Neither broadcast preceded a
direct ping; neither cross-checked git work-evidence. Both were
false positives.

The cure shape is *"verify silence is silence before naming it
retirement"*. PDR-078's threshold rule is a structural permission,
not a structural obligation; agents retain the discretion (and the
duty) to suppress the broadcast when local evidence contradicts
the silence inference.

## Why a Rule, Not a Clause

This rule is agent-general — every agent observing the heartbeat
stream is a potential retirement-detection broadcaster, and the
ping-before-escalate discipline applies uniformly. Folding the
discipline into PDR-078 as a Director-class clause was an earlier
framing; the rule-class promotion to agent-general broadens the
safety net to every observer of the heartbeat stream, not only
the agent who owns the retirement-detection decision.

## Related Surfaces

- [PDR-078 (liveness-heartbeat contract)](../practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md)
  — the substrate this rule defends. The 10-minute threshold and
  retirement-on-silence rule live there; this rule names the
  pre-broadcast cross-check discipline.
- [ADR-186 (comms-event heartbeat lifecycle substrate)](../../docs/architecture/architectural-decisions/186-comms-event-heartbeat-lifecycle-substrate.md)
  — the repo-bound phenotype that operationalises PDR-078.
- [`use-built-agent-tools-cli`](use-built-agent-tools-cli.md) —
  governs the CLI surfaces the cross-check uses
  (`comms direct`, `claims show`, and equivalents).

## Enforcement

Behavioural-only at this stage. The cross-check surfaces are
inspectable through standard CLI commands; the discipline is the
named pre-broadcast pause. Future hardening could add a CLI
confirmation prompt before retirement broadcasts emit, but the
rule is the named discipline that authoring agents apply.
