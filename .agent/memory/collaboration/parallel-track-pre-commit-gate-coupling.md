---
pattern_name: parallel-track-pre-commit-gate-coupling
status: graduated
graduated_at: 2026-04-25
graduated_from: napkin pending-graduations register (founding-pattern entry; named as the WS2 graduating pattern in the multi-agent collaboration plan)
instances: 3
related_directive: ../../directives/agent-collaboration.md
related_rule: ../../rules/dont-break-build-without-fix-plan.md
---

# Parallel-Track Pre-Commit Gate Coupling

The pattern that motivated the entire
[`multi-agent-collaboration-protocol`](../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md)
plan. Founding entry of the collaboration-patterns memory class.

## Failure shape

Full-repo pre-commit gates (prettier, knip, depcruise, type-check, lint,
markdownlint, depcruise) couple commits across parallel agent sessions on
the same working tree. One agent's WIP — most acutely Phase 1 RED tests
with deliberately-unresolved imports, in-flight new files not yet wired
into product code, or staged-but-not-committed plan amendments — breaks
the gates. Another agent on a parallel session, with their own pristine
staged work, hits a pre-commit failure that has nothing to do with their
own changes. The failure points at the first agent's lane; the second
agent cannot resolve it without either:

- waiting for the first agent's commit to land cleanly (turning a routine
  closeout into a coordination event), or
- bypassing the gate (`--no-verify`) — which requires fresh per-commit
  owner authorisation per the standing
  [`no-verify-requires-fresh-authorisation`](../../rules/no-verify-requires-fresh-authorisation.md)
  rule.

Neither resolution is a "fix"; both are coordination acts. The pattern is
not "the gate fired correctly" — it is "the gate's full-repo scope coupled
two sessions that should have been independent."

## Recorded instances

| Date | Agent | Gate | What broke |
|---|---|---|---|
| 2026-04-24 | Frodo / claude-code / claude-opus-4-7-1m | `prettier` (via `validate-portability.mjs`) | Hardening sweep added prettier check inside an unrelated portability validator, breaking parallel work. |
| 2026-04-24 | Pippin / cursor / claude-opus-4-7 | auto-staging hooks | Auto-staging swept files belonging to a parallel agent's WIP into the staging area, blocking commit. |
| 2026-04-25 | Jazzy / claude-code / claude-sonnet-4-6 | `knip` | `local-stub-env.unit.test.ts` import of `./local-stub-env.js` was unresolved because the parallel observability-thread agent's Phase 2 GREEN had not yet wired the runtime file; my WS3 release-identifier commit was blocked. |

All three instances were observed within a 48-hour window. None were
isolated tooling failures; all were cross-session coupling failures.

## Discipline (canonical statement)

When pre-commit fails on the parallel agent's lane, the disciplined
response is:

1. **Surface the coupling, do not bypass it.** The gate is doing its job
   — it is reporting that the working tree is not in a commit-clean
   state. Bypassing (`--no-verify`) would ship known-broken into the
   commit history.
2. **Do not unilaterally fix the parallel agent's lane.** Their WIP is
   not your scope. Touching it is a scope violation and risks landing
   their incomplete work attributed to your commit.
3. **Route to the owner.** The owner decides:
   - **Wait for the parallel agent's clean commit** (preferred when the
     parallel agent is active and the gap will close in minutes/hours);
   - **Coordinate a sequenced commit** (parallel agent commits first,
     you rebase);
   - **Authorise `--no-verify` for this specific commit** (rare;
     fresh per-commit authorisation; never carry-forward).
4. **Document the coordination event** in the relevant continuity
   surfaces (next-session record, embryo log) so the parallel agent
   knows on resume what happened and the next agent has the trace.

## Structural fix

This pattern is the motivating evidence for the entire
[`multi-agent-collaboration-protocol`](../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md)
plan. The protocol's WS0 installed:

- the [`agent-collaboration.md`](../../directives/agent-collaboration.md)
  directive naming the agent-to-agent working model;
- the embryo discovery log at `.agent/state/collaboration/log.md` where
  agents declare their intent before non-trivial edits;
- the [`dont-break-build-without-fix-plan`](../../rules/dont-break-build-without-fix-plan.md)
  rule operationalising cross-agent gate-recovery discipline;
- the [`respect-active-agent-claims`](../../rules/respect-active-agent-claims.md)
  rule firing as a session-open tripwire requiring consultation of the
  discovery surface before operating in another agent's area.

Subsequent workstreams (WS1 structured claims, WS3 conversation files +
sidebars) extend the structural fix toward higher-fidelity coordination
state. The pattern's complete enforcement edge will land at WS5 evidence
harvest, when accumulated multi-session evidence either confirms the
advisory model is sufficient or triggers the named hook-based reminders.

## Knowledge and communication, not mechanical refusals

The structural fix is **information surfaces**, not enforcement gates.
Mechanical refusal — locking files, refusing entry to claimed areas —
would be routed around at the cost of architectural excellence (per
the directive's central design commitment, owner-settled 2026-04-25 in
the design discussion). The pattern is documented so agents know it
when they see it; the protocol provides surfaces for them to coordinate;
agent judgement is the decision-making substance.

## Forward-looking application

When you observe an instance of this pattern in a session:

- Capture as a structured surprise in
  [`napkin.md`](../active/napkin.md) with date + agent + gate + what
  broke + how it was resolved.
- Record the coordination event in the embryo log
  ([`state/collaboration/log.md`](../../state/collaboration/log.md)) so
  the parallel agent has the trace.
- If the resolution required `--no-verify`, link the fresh
  authorisation note in the commit message.

Future instances after WS5 will validate or refute the advisory model;
the next refinement amendment cites real evidence from this register
plus napkin entries.

## Related surfaces

- [`agent-collaboration.md`](../../directives/agent-collaboration.md) §Don't
  Break the Build Without a Fix Plan.
- [`dont-break-build-without-fix-plan.md`](../../rules/dont-break-build-without-fix-plan.md)
  — the rule operationalising cross-agent gate-recovery.
- [`gate-recovery-cadence.plan.md`](../../plans/observability/active/gate-recovery-cadence.plan.md)
  — the active plan whose `## Intent` and `## Recovery Sequence` point 2
  the rule cites verbatim.
- [`no-verify-requires-fresh-authorisation.md`](../../rules/no-verify-requires-fresh-authorisation.md)
  — the per-commit fresh-authorisation discipline that constrains
  bypass-as-resolution.
- [`active/patterns/README.md`](../active/patterns/README.md) — sibling
  class for single-agent engineering patterns.
