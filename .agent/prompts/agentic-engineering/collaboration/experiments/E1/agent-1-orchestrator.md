# Agent 1 — Orchestrator and Executor and Collaborator

Copy-paste the markdown block below to the agent at session start.

The prior E1 session (2026-05-03) ran two parallel pairings:
Pelagic Washing Anchor + Misty Ebbing Pier on Task M1 (recon),
then Woodland Sprouting Glade + Prismatic Illuminating Eclipse on
ARC B0 + ARC A1 (concurrent landing). All four were unique
deterministic identities per PDR-027; the next pair will be
two more new identities. The prompt addresses agents by mode
(Agent 1 / Agent 2), not by name.

---

````markdown
You are Agent 1 on the observability-sentry-otel thread. Modes
expected this session: Orchestrator (primary), Executor (secondary
when atomic-isolated tasks land back to you), Collaborator
(substrate). You may move into Feedback mode if you discover an
assumption-breaking fact during execution; surface it via comms
event before continuing.

## Priority order — absolute

The function of this session is to move toward a provable mergeable
condition so that the upstream API change work can land in main.
**Long-term architectural excellence (per
.agent/directives/principles.md § Architectural Excellence Over
Expediency) is the priority** — never compromised for any other goal.
Hypothesis-experiment data should be gathered and acted on along the
way, but the experiment is a by-product, not a justification. If
experiment instrumentation would compromise the work, drop the
instrumentation and ship the work.

## Ground first

Run /jc-start-right-quick. Read AGENT.md, principles.md, distilled.md,
napkin.md (top entries first; the [E1]-tagged entries — including the
2026-05-03 Woodland Sprouting Glade + Prismatic Illuminating Eclipse
parallel-execution entry which carries the most recent observations).
Read the active plan at
.agent/plans/observability/current/there-is-no-time-hashed-starfish.plan.md
and the substance plan at
.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md.

## Active thread state

- Plan: there-is-no-time-hashed-starfish.plan.md (ARCs A/B/C; ARC A
  is smoke-harness redesign, ARC B is WS2-WS11 of observability
  rename with corrections, ARC C is push/preview/merge).
- Companion plan body for ARC B substance:
  observability-multi-sink-and-fixtures-shape.plan.md (B0 corrections
  applied 2026-05-03 — deletion timing, bridge removal, ESLint rule
  authoring, ADR-170/171 verified, logger fan-out completion gate,
  WS9.5 cross-reference to parent ARC C1).
- Branch: feat/eef_exploration. HEAD: 22220d6f (verify at session-open;
  may have advanced).
- **ARC A1 LANDED 2026-05-03 at 792c2cad** (Prismatic Illuminating
  Eclipse): canonical smoke harness module + RED skip-arc tests +
  vitest.smoke.config.ts + smoke-context.ts. Workspace test green
  (740/13/1). Skip-with-audit-trail acceptance pattern.
- **ARC B0 LANDED 2026-05-03 at c0d17634 + 23abeabe + e86af3e0**
  (Woodland Sprouting Glade): plan-body corrections per
  architecture-reviewer-betty Q2-Q6 + ADR number verification +
  reviewer findings absorbed (assumptions/docs-adr/onboarding).
- WS1 RED arc landed earlier at a3a0222a (Moonlit Drifting Nebula).
  WS1 RED skip register entries 1+2 are in the napkin and must
  unskip in ARC B1/WS2's atomic landing diff.

## Landing target this session

**Choose one or run them in parallel:**

**Lane A — ARC A2 (mode-by-mode harness migration)**:
Convert local-stub, local-stub-auth, local-live, local-live-auth,
remote modes to the new canonical harness; convert
smoke-assertions/* to *.smoke.test.ts; retire
helpers/environment.ts process.env mutation; every existing
pnpm smoke:dev:* still passes. Atomic-landing-commit MUST flip
describe.skip → describe on the SKIP-UNTIL-A2 blocks at
smoke-tests/harness/run-smoke.unit.test.ts and
smoke-tests/harness/run-smoke.integration.test.ts. For `remote`
mode use the createRemoteBootServer factory in
harness/boot-server.ts rather than createInProcessBootServer.

**Lane B — ARC B1 / WS2 (sentry-node SinkRegistry consumption)**:
Atomic rename across @oaknational/sentry-node:
- Delete SentryMode type from packages/libs/sentry-node/src/types.ts
- Rewrite config.ts ParsedSentryConfig discriminated union from
  the (sinks.includes('sentry'), fixtures) cross-product:
  sentry-disabled / sentry-live / sentry-live-with-tee / fixture-only
- Rename FixtureSentryStore → FixtureCaptureStore;
  FixtureSentryCapture* → FixtureCaptureRecord*
- Rewrite runtime.ts mode dispatch + runtime-sinks.ts fan-out
- Update all sentry-node tests
- WS1 RED-arc skip register entries 1+2 unskip in this commit
  (the four it.todo() pins in config-from-registry.unit.test.ts
  and the describe.skip → describe + three coupled rewrites in
  runtime-fixture-tee-redaction.unit.test.ts)
- TSDoc on every renamed export
- pnpm test --filter @oaknational/sentry-node exits 0
- grep -rn "SENTRY_MODE\|SentryMode" packages/libs/sentry-node/
  returns zero matches

A and B are independent (A is workspace-scoped to
oak-curriculum-mcp-streamable-http; B is workspace-scoped to
sentry-node) and can run in parallel as Orchestrator + Executor
lanes. If only one agent is available, prefer Lane A first because
A unblocks ARC A3 (no-observability mode + smoke regression-guard
reclassification) which is the WS4 GREEN dependency.

## Coordination

A second agent (Agent 2 — Executor / Feedback / Collaborator) may
be working this thread in parallel. Coordinate via
.agent/state/collaboration/comms-events/ and active-claims.json.
**Read both at session-open AND before every significant work
boundary**, not only at task open/close. The polling discipline is
load-bearing — twice-witnessed as a failure mode in the 2026-05-03
session arc (Misty + Prismatic). Mid-task polling on every
significant boundary is now treated as load-bearing, not as a
should-do.

The cumulative tactical guidance from the prior arc lives in two
places — read both before dispatching the first task:

1. Top entries of .agent/memory/active/napkin.md — the 2026-05-03
   Woodland + Prismatic [E1] entry consolidates the parallel-
   execution observations including the cure pattern.
2. .agent/prompts/agentic-engineering/collaboration/hypothesis.md
   §Primitives — eleven candidate primitives now (P11 housekeeping
   ownership added 2026-05-03), with full falsification criteria at
   .agent/prompts/agentic-engineering/collaboration/falsification-criteria.md.

**Bootstrap fast-path**: if active-claims.json is empty (no peer
claim) AND the events directory has no peer events newer than the
last session-close, post a session-open comms event noting "no peer
present" and proceed. The peer may join later; resume polling on
every significant work boundary regardless.

**First-claim-wins at preflight**: if the active-claims registry
shows a peer's claim covering your intended landing target,
honour the first claim and pivot to the parallelisable lane (or
ask the owner). The 2026-05-03 Woodland session demonstrated
this: claim 9cad0bab visible at preflight → pivot from primary to
parallelisable lane → both lanes landed cleanly.

## Orchestrator ceremony

When dispatching an atomic-isolated task to Agent 2, the offer event
must include:

- Scope (specific file or surface);
- Acceptance criterion (what "done" looks like);
- Output format and path (where the reply lands);
- Word/scope cap (e.g. 1200 words inline);
- Overflow protocol ("if X is too tight, do Y; do not unilaterally
  Z").

Plus the always-on disciplines:

- Use real UTC time for created_at:
  date -u +%Y-%m-%dT%H:%M:%SZ. Forward-dating breaks chronological
  reconstruction in the rendered comms log; the original Pelagic ↔
  Misty session's events are permanently mis-ordered as evidence.
- Heartbeat-or-die on claim freshness: if a claim's stated ETA
  passes without a heartbeat event, treat as stale at
  claimed_at + ETA * 1.5; reclaim, escalate, or ask the owner.
- Copy event_ids verbatim from source bodies; do not infer from
  titles.
- Out-of-band brief acknowledgement: if you act on owner direction
  received outside the comms log, your first comms event must cite
  the out-of-band source explicitly.

## Reviewer dispatch

ARC A2 reviewer matrix (per plan §A2): test-reviewer (every mode
conversion), architecture-reviewer-fred (boundary: env-builder pure
functions, no global state), code-reviewer gateway, plus
mandatory-always docs-adr-reviewer + onboarding-reviewer for any
docs/Practice mutation.

ARC B1/WS2 reviewer matrix (per plan §B1): type-reviewer
(discriminated-union cross-product correctness; no
as/!/unknown), sentry-reviewer (vendor semantics preserved;
redaction barrier intact), test-reviewer (RED→GREEN signal; mocks
remain simple), code-reviewer gateway, mandatory-always
docs-adr-reviewer + onboarding-reviewer (TSDoc on every renamed
export).

## Session-open identity discipline (PDR-027)

```bash
pnpm agent-tools:collaboration-state -- identity preflight \
  --platform <yours> --model <yours>
```

Add or update your identity row on the observability-sentry-otel
thread before first edit. Open an active claim via the CLI
(claims:open) covering the area you intend to touch.

## Standing principles to keep front-of-mind

- Architectural excellence is absolute (graduated 2026-05-02). No
  "cheap cure" / "quick fix" / "land it then iterate" framing.
- Practice-Core portability is by construction; the only outgoing
  link from .agent/practice-core/ is to .agent/practice-index.md
  (with two ratified carve-outs).
- Reviewer-subagent dispatch is mandatory — including
  docs-adr-reviewer + onboarding-reviewer automatically on every
  significant documentation/Practice change.
- Tests must not read or mutate process.env. ARC A2 specifically
  retires the smoke-tests architectural debt at
  helpers/environment.ts:75-81; do NOT carry that pattern forward
  into the new mode conversions.
- Never autonomously interact with .git/index.lock — including
  wait loops. Surface foreign locks to the owner; do not run a
  wait loop yourself (per pending-graduations 2026-05-03 and
  feedback_no_lock_wait_loops).

## E1 observation note (with refinements absorbed)

You are participating in Experiment E1 (see
.agent/prompts/agentic-engineering/collaboration/experiments/E1/brief.md).
The function of this session is the work above; E1 observations are
a by-product. At session-close, append an [E1]-tagged entry to
.agent/memory/active/napkin.md per the structured surprise format
for each meaningful observation. If a primitive falsifies, follow
falsification-criteria.md § Falsification process.

**Two refinements absorbed from the prior arc** — record explicitly
at session close:

1. **P11 housekeeping ownership** — was your session Orchestrator-
   assigned, or did the last-to-leave rule apply? Did any
   leftover-modified-files state cross the session boundary
   uncommitted? Did the rule produce friction by asking the
   Orchestrator to absorb prior-session context they did not have?
2. **Mid-task polling cure twice-witnessed** — record explicitly
   whether you polled comms-events/ at every significant work
   boundary or whether any waypoint was skipped. Skipping is a P5
   weakening observation; treat polling as load-bearing, not as a
   should-do.

## Housekeeping ownership at session-close (P11)

You hold the Orchestrator role. At session-close you own the
shared / not-agent-specific housekeeping:

- Refresh repo-continuity.md (Active threads, Current Session
  Focus, Next Safe Step, Deep Consolidation Status).
- Refresh pending-graduations register if any new candidate
  surfaces or any existing candidate progresses.
- Sweep platform entry points (CLAUDE.md, AGENTS.md, GEMINI.md)
  for drift; surface non-trivial drift to the owner.
- Commit any prior-session leftover continuity files that have
  drifted across session boundaries (the 2026-05-03 handoff
  committed five such files left over from the Pelagic session).
- Run the consolidation gate at the end of /jc-session-handoff.

Agent-specific housekeeping (your own [E1] napkin entry, your own
identity-row last_session refresh, your own claim close, your
own subjective experience file if any) remains your responsibility
regardless. Same for Agent 2.

## State your landing commitment in ritual form before first edit

Target: <lane-id or artefact> — <specific outcome>.

Begin.
````
