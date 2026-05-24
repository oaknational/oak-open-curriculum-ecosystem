# Completion Claims and Value Proof Pipeline Report

## Executive Summary

The repeated false reports that P5 and P8 were "complete" are not isolated
carelessness. They expose a structural gap in the delivery pipeline:
completion language is not mechanically bound to the plan's live acceptance
criteria, and the testing doctrine is not yet expressed as a whole value-proof
chain from idea to user impact.

The repo already has strong doctrine:

- plans must name end goal, mechanism, means, acceptance, and validation;
- TDD applies at unit, integration, and E2E levels;
- validators must recompute instead of merely recording;
- strict and complete validation is non-negotiable;
- passive guidance loses to artefact gravity.

The missing piece is an enforced contract that says:

> A workstream is complete only when every nominated proof layer has passed,
> every acceptance criterion has evidence, the live plan status agrees, and
> the user-value proxy has either been measured or explicitly routed to its
> next observation point.

Until that contract exists, agents will continue to confuse four different
states:

1. a useful implementation slice landed;
2. a session, claim, or collaboration state closed;
3. a workstream's acceptance criteria were satisfied;
4. the intended user value was delivered.

Those states must be separate in language, plan schema, CLI commands, tests,
TUI display, and commit or handoff validation.

## Metacognitive Reflection

The inherited shape says "we have plans, TDD, gates, handoffs, and memory."
The failure says those pieces are not yet one system.

The deeper issue is not that agents forgot to read the plan. The deeper issue
is that the environment allowed plan truth, implementation truth,
collaboration truth, and value truth to diverge while still permitting a
single confident word: "complete".

That word is too powerful to remain prose-only.

The bridge from action to impact is therefore not another reminder. It is a
proof pipeline:

```text
ideation
  -> end goal and user-value proxy
  -> plan acceptance map
  -> TDD proof map across unit, integration, and E2E
  -> deterministic validation and evidence ledger
  -> completion assertion validator
  -> delivery observation
  -> consolidation and next ideation
```

This changes the work shape. It means completion is not the last sentence of a
handoff. Completion is a computed verdict over live artefacts.

## Root Cause

### 1. Completion is overloaded

The word "complete" currently carries too many meanings:

| Claimed state | Actual meaning | Example failure |
|---|---|---|
| Session complete | This agent is done for now | Misread as workstream complete |
| Claim closed | File ownership released | Misread as acceptance complete |
| Slice landed | Some useful code shipped | Misread as whole workstream complete |
| Plan item complete | All acceptance passed | Should be the only workstream-complete meaning |
| Value delivered | User-facing proxy moved | Often not measured at closure |

P5 and P8 failed in the same way. P5 had a strict parser slice landed. P8 had
a useful snapshot/text-mode TUI slice landed. Both were then spoken about as
though the workstream acceptance was complete.

### 2. Plan status is advisory at claim time

Plans have machine-readable todos, but no command currently prevents an agent
from saying "P5 complete" while the plan still says `status: pending`.

That is a direct violation of "validators must recompute, not just record":
the plan records status, but completion claims are not recomputed against it.

### 3. Acceptance criteria are prose islands

Acceptance criteria often exist as readable bullets, but there is no required
machine-readable acceptance ledger that maps:

- criterion id;
- expected proof level;
- command or observation;
- evidence reference;
- current verdict;
- reviewer or validator that accepted it.

Because the criteria are not addressable, a closeout can satisfy one bullet,
ignore another, and still sound plausible.

### 4. TDD is present but not yet value-complete

The current doctrine correctly says TDD applies at all levels. The first weak
point is that agents can still claim TDD after adding tests later. That is not
TDD; it is retrospective test coverage. It may be useful as regression
coverage, but it did not drive the design.

The second weak point is that "all levels" is not yet required as a delivery
proof graph.

For a meaningful capability:

- unit tests prove isolated engineering behaviour;
- integration tests prove units compose at the boundary;
- E2E tests prove the running system delivers intended behaviour;
- a nominated proxy metric proves the behaviour matters in the value model.

The repo has pieces of this, but plans do not yet require the full chain to be
declared up front and checked at close.

The enforcement test is simple: for any product-bearing cycle that claims TDD,
there must be evidence that the unit, integration, or E2E test was authored and
observed red before the corresponding product code was written, then observed
green after the product code landed. "Tests added after implementation" is a
different and weaker state, and must be named that way.

### 5. Collaboration closeout can outrun acceptance truth

The collaboration substrate has useful lifecycle events, claims, and handoffs.
But the lifecycle vocabulary is not strict enough. "Close P5 collaboration
state" can be true as a session event while false as workstream completion.

The system needs hard type separation between:

- `session_closed`;
- `claim_closed`;
- `slice_landed`;
- `workstream_completion_claim`;
- `workstream_completion_verified`;
- `value_observation_recorded`.

## Surfaces That Need Updating

### Protocols

| Surface | Required update |
|---|---|
| Start-right quick and thorough | Add a completion-verdict check when resuming a lane: compare handoff wording, recent commits, plan todo status, and acceptance evidence before repeating completion language. |
| Session handoff protocol | Require a `Completion Verdicts` section that uses only `complete`, `partial slice landed`, `pending`, or `blocked`, with a plan-validator command for each `complete` claim. |
| Commit protocol | When a commit or commit message claims a workstream completion, require the completion assertion id and validator output. Slice commits must say slice, not complete. |
| Collaboration claims protocol | Claim closure must not imply workstream completion. Add close reasons with strict kinds: session close, claim release, slice landed, or verified completion. |
| Comms protocol | Add structured completion events and reject prose-only `P<n> complete` claims unless linked to a verified completion assertion. |
| TUI protocol | Display completion claims as verified, partial, contradicted, or stale based on plan-validator results, not based on latest prose. |
| Consolidation protocol | Mine repeated completion-claim contradictions into rules or validators, not only memory notes. |

### Rules

New or amended rules should be added to the always-applied tier and mirrored
through platform adapters.

| Rule | Change |
|---|---|
| New: `completion-claims-must-match-plan.md` | Any claim that a plan item, phase, P-lane, WS-lane, or milestone is complete must cite the plan path, todo id, acceptance ids, evidence refs, and validator command. If the live plan says pending, the claim is forbidden. |
| New: `slice-is-not-completion.md` | A landed implementation slice, snapshot, spike, scaffold, or text-mode preview must be described as partial unless every acceptance criterion for the parent workstream is verified. |
| New: `value-proxy-required-for-capabilities.md` | Non-trivial capability plans must nominate the user-value proxy before execution and record the observation point before completion. |
| Amend `present-verdicts-not-menus.md` | Add "completion verdicts are computed verdicts": agents must answer completion questions directly, but only after reconciling plan status and acceptance evidence. |
| Amend `validators-must-recompute-not-just-record.md` | Name completion assertions as a validator class: stored evidence must be re-read and compared to current plan state. |
| Amend `plan-body-first-principles-check.md` | Add a value-proof clause: does the plan prove the user-impact mechanism, or only the implementation activity? |
| Amend `test-immediate-fails.md` | Add a pipeline fail: a test plan that omits the necessary scale for the claimed value is rejected as an incomplete proof. |
| Amend `no-hedging-vocabulary.md` | Add "close as slice", "good enough for P<n>", and similar completion hedges when they appear on doctrine or plan surfaces. |

### ADRs

| ADR | Change |
|---|---|
| ADR-117 Plan Templates and Reusable Plan Components | Amend executable plans to require a machine-readable acceptance and proof ledger, not only todos. |
| ADR-121 Quality Gate Surfaces | Clarify that completion-claim validation is a governance gate, distinct from code quality gates but eligible for pre-commit or pre-push enforcement. |
| ADR-150 Continuity Surfaces | Add completion-verdict truth as a continuity surface: handoff state must distinguish session closure from plan acceptance. |
| New ADR candidate | Define "completion assertion architecture" in `agent-tools`: schema, parser, CLI commands, hook integration, and TUI rendering contract. |

### PDRs and Principles

| Surface | Change |
|---|---|
| PDR-018 Planning Discipline | Add "proof chain over activity": end goal -> mechanism -> means must include nominated proof levels and value proxy. |
| PDR-026 Per-Session Landing Commitment | Clarify that a landing can be a slice, but cannot be reported as workstream complete without plan assertion validation. |
| PDR-029 Perturbation Mechanism Bundle | Add completion-claim contradiction as a Family-A tripwire: prose conflicts with authoritative artefact state. |
| `principles.md` | Under Strict and Complete and Fail FAST, add that completion claims are validated boundary data. Wrong completion language is a system failure, not a harmless wording issue. |

### Skills

| Skill | Required change |
|---|---|
| `jc-plan` | Add proof-contract requirements, acceptance ids, value proxies, and completion assertion schema. |
| `jc-session-handoff` | Require plan-validator output before using workstream completion language. |
| `jc-commit` | Detect completion wording in commit subjects/bodies and require a completion assertion id or downgrade wording to slice language. |
| `jc-gates` | Include completion assertion validation when plan, handoff, or comms surfaces changed. |
| `jc-start-right-quick` / `thorough` | On takeover, reconcile latest handoff claims against live plan status before naming lane state. |
| `jc-consolidate-docs` | Treat repeated false completion reports as doctrine-enforcement candidates, not just memory entries. |
| `test-expert` | Enforce proof-level sufficiency: unit-only proof cannot approve a system-value completion claim. |
| `release-readiness-expert` | Refuse GO when plan acceptance, proof ledger, and value proxy observation disagree. |

## Plan Skill Foundation Changes

The plan skill should require a new section in every executable plan:

```yaml
proof_contract:
  value_proxy:
    name: "<metric or observation>"
    why_this_proxy_represents_value: "<mechanism>"
    measurement_point: "<command, TUI view, log query, user workflow, or owner observation>"
  completion_claim_policy:
    allowed_verdicts:
      - complete
      - partial-slice-landed
      - pending
      - blocked
    completion_requires_validator: true
```

Each todo should then carry addressable acceptance and proof requirements:

```yaml
todos:
  - id: ws-p5-unified-comms-format
    content: "Collapse comms formats into one discriminated event store."
    status: pending
    acceptance:
      - id: p5-a1-single-directory
        text: "One comms directory is used for all new events."
        proof_level: integration
        validator: "pnpm agent-tools:collaboration-state -- plan assert ..."
      - id: p5-a2-single-parser
        text: "One strict parser surface validates all comms events."
        proof_level: unit
      - id: p5-a3-renderer-path
        text: "Renderer consumes only the unified parser output."
        proof_level: integration
      - id: p5-a4-historical-migration
        text: "Historical events migrate and parse through the new path."
        proof_level: e2e
      - id: p5-a5-value-proxy
        text: "Operators see one coherent comms source in TUI."
        proof_level: value-proxy
```

The skill should also change its readiness requirements:

1. Every non-trivial plan must define a value proxy.
2. Every workstream must define acceptance ids.
3. Every acceptance id must declare its required proof level.
4. Every proof level must name a command or observation.
5. Every completion claim must be generated by, or cite, the validator.
6. The plan cannot be marked `READY FOR EXECUTION` if the proof contract is
   missing.
7. The plan cannot be marked `DECISION-COMPLETE` if completion policy is
   absent or ambiguous.

This is the foundation change: plan writing becomes proof-chain design, not
task enumeration.

## Deterministic Enforcement Design

### 1. Add `agent-tools plan assert-complete`

Proposed command:

```bash
pnpm agent-tools plan assert-complete \
  --plan .agent/plans/agent-tooling/current/cost-of-collaboration.plan.md \
  --todo-id ws-p5-unified-comms-format
```

It should fail hard when:

- the plan file cannot be parsed;
- the todo id is missing;
- the todo status is not `completed`;
- any acceptance id is missing;
- any acceptance id lacks evidence;
- any required proof level is absent;
- any evidence command is stale or failed;
- any linked file no longer exists;
- any value proxy is missing or unobserved.

Error messages should name the exact blocker:

```text
Cannot claim ws-p5-unified-comms-format complete.

Plan status: pending
Missing acceptance evidence:
- p5-a1-single-directory: no evidence
- p5-a3-renderer-path: no evidence
- p5-a4-historical-migration: no evidence
- p5-a5-value-proxy: no observation

Allowed wording: "P5 strict parser slice landed; P5 unified format pending."
```

### 2. Add `agent-tools plan completion-claim`

Completion should be a structured event:

```bash
pnpm agent-tools plan completion-claim \
  --plan <path> \
  --todo-id <id> \
  --verdict complete \
  --evidence-ref <path-or-log-id>
```

This command should emit a typed collaboration event:

```json
{
  "kind": "workstream_completion_claim",
  "plan": "...",
  "todo_id": "...",
  "verdict": "complete",
  "validator_status": "passed",
  "acceptance_ids": ["..."],
  "value_proxy_status": "observed"
}
```

If the validator fails, the command may emit a `partial_slice_landed` event
only when the caller supplies the slice scope. It must not let failed evidence
be represented as `complete`.

### 3. Add prose-claim scanning

Pre-commit should scan changed plan, handoff, thread, comms-render, and
memory surfaces for high-risk phrases:

- `P5 complete`;
- `P8 complete`;
- `WS<n> complete`;
- `workstream complete`;
- `ready/complete/done` near a plan todo id.

The scanner should require either:

- a nearby completion assertion id; or
- wording that explicitly says `partial`, `slice`, `pending`, or `not
  complete`.

This must not police ordinary prose everywhere. It should target the surfaces
where coordination truth is created.

### 4. Add claim-close kind enforcement

`claims close` should require one of:

- `--close-kind session-closed`;
- `--close-kind claim-released`;
- `--close-kind slice-landed`;
- `--close-kind workstream-complete --completion-assertion <id>`.

Without the `workstream-complete` close kind, TUI and handoff renderers must
not show the closure as workstream completion.

### 5. Add TUI contradiction rendering

The P8 TUI should make the failure visible:

```text
P5 unified comms format
  Plan status: pending
  Latest slice: dd5b9e54 strict parser
  Completion claim: contradicted
  Missing: single directory, renderer path, historical migration, value proxy
```

That turns hidden drift into live negative feedback.

## Updating Multi-Level TDD

The current doctrine says "all levels". The update should make two things
unmistakable:

1. **Driven means test-first.** At unit, integration, and E2E levels, the
   relevant test is written before the product code it describes. It is run
   red against the old system or absent behaviour, then the product code is
   written to make it green, then refactoring happens while it stays green.
2. **All levels means a declared proof map.** The plan states which unit,
   integration, E2E, and value-proxy proofs are required for the claimed
   capability, and completion validation refuses claims where a required level
   is missing.

Tests added after product code can still be valuable. They are regression
tests, characterisation tests, audit coverage, or safety-net expansion. They
are not TDD evidence for the already-written code. This distinction must be
machine-visible in plan evidence and reviewer language.

### Source-Anchored TDD Doctrine

Repo doctrine should pin TDD to respected guidance, not to training-data
averages or casual industry misuse.

The source anchors for the repo's interpretation should be:

- Kent Beck's *Test-Driven Development: By Example*: the canonical
  red-green-refactor discipline and test-first framing.
- Martin Fowler's Test Driven Development article: write a test for the next
  bit of functionality, write functional code until it passes, then refactor.
- Agile Alliance's TDD glossary: write a single unit test, run it and see it
  fail because the program lacks the feature, write just enough code to pass,
  refactor, repeat.
- Steve Freeman and Nat Pryce's *Growing Object-Oriented Software, Guided by
  Tests*: outside-in and whole-system guidance, where higher-level tests help
  steer the design and lower-level tests grow the implementation.

The repo-specific extension is multi-level proof, not a weakening of TDD:
tests still drive the work. Higher-level tests may be sequenced so they land
when their supporting lower-level cycles can green in the same commit, but
they still describe the intended behaviour before the product code for that
cycle is written. They are not written after the implementation as a
retrospective audit.

### Unit proofs

Purpose: prove isolated engineering behaviour.

Required for:

- pure functions;
- parsers;
- reducers;
- scoring functions;
- validators;
- plan evidence classification;
- pressure or urgency calculations.

Completion language allowed: "the unit behaviour is proven".

Completion language forbidden: "the capability is complete".

### Integration proofs

Purpose: prove collections of units work together at a boundary.

Required for:

- parser plus renderer;
- plan parser plus completion validator;
- claims plus comms plus TUI snapshot;
- proof ledger plus handoff rendering;
- migration plus historical data parser.

Completion language allowed: "the boundary behaviour is proven".

Completion language forbidden: "the user value is delivered" unless the E2E
and value proxy layers also pass.

### E2E proofs

Purpose: prove the running system delivers the intended behaviour through its
real protocol or UI surface.

Required for:

- CLI workflows;
- TUI workflows;
- MCP workflows;
- browser/UI flows;
- multi-command collaboration workflows.

For P5/P8-style work, an E2E proof should drive the actual CLI/TUI path:

1. create sample comms and claims;
2. attempt a false completion claim;
3. observe the CLI rejection;
4. record a valid partial slice claim;
5. observe the TUI displaying partial, not complete;
6. complete all evidence;
7. observe the TUI displaying verified complete.

### Value-proxy proofs

Purpose: prove the behaviour matters in the nominated value model.

Examples:

| Capability | Value proxy |
|---|---|
| P5 unified comms | Operators no longer need to inspect three directories to understand one event stream. |
| P8 live TUI | Human can see active collaborators, recent changes, waiting work, queue pressure, and directed-thread pressure without tailing raw JSON or rendered markdown. |
| Completion validator | False completion claims are rejected or displayed as contradicted before handoff. |
| Commit queue enforcement | Staging without matching intent fails before index mutation. |

Value proxies can be measured by deterministic fixtures at first. Later they
can graduate into live operational metrics.

## Delivery Pipeline Model

### 1. Ideation

Define:

- user-impact end goal;
- mechanism;
- value proxy;
- leading risks;
- required proof levels.

Output: strategic or executable plan seed.

### 2. Planning

Define:

- machine-readable todos;
- acceptance ids;
- proof levels;
- validation commands;
- value-proxy observation point;
- completion-claim policy.

Output: executable proof contract.

### 3. Creation

Land TDD cycles:

- unit cycles for isolated behaviour;
- integration cycles for composition;
- E2E cycles for running-system behaviour;
- documentation and TSDoc alongside the behaviour they describe.

Output: tested product slices, each honestly named.

### 4. Delivery

Run:

- focused deterministic validations;
- aggregate gates;
- plan completion assertion;
- release readiness review where applicable.

Output: computed readiness verdict.

### 5. User Value

Observe:

- value proxy;
- operator workflow;
- telemetry;
- benchmark;
- human-facing TUI state;
- user or owner feedback.

Output: value observation, not merely code closure.

### 6. Feedback to Ideation

Route:

- failed proxies to new plan work;
- repeated frictions to rules or tooling;
- useful surprises to napkin and consolidation;
- matured patterns to PDR/ADR/rule/skill updates.

Output: next better idea, informed by measured reality.

## Positive and Negative Feedback Loops

The user's pressure-model idea is useful, but it needs a balancing loop.

A constructive positive loop:

```text
events repeat + immediacy rises + urgency is high
  -> pressure score rises
  -> TUI and coordinator surface the issue earlier
  -> agents converge on the blocking work
```

Required negative loops:

- stale-claim guard reduces pressure from old or contradicted signals;
- evidence requirement prevents urgency from becoming completion language;
- cooldown prevents repeated events from causing panic escalation;
- contradiction detection dampens claims that conflict with plan truth;
- owner-visible value proxy prevents local coordination pressure from
  replacing user value.

The mathematical version should be bounded:

```text
pressure = sigmoid(
  weighted_frequency * immediacy * urgency
  - stale_penalty
  - contradiction_penalty
  - recently_acknowledged_penalty
)
```

No exponential should be unbounded. The point is not to create group panic; it
is to make the right work visible early while refusing runaway cascade.

## First Implementation Slice

The smallest material slice is not a grand rewrite. It is:

1. Add `completion-claims-must-match-plan.md`.
2. Amend `jc-plan` to require acceptance ids and proof levels.
3. Add a plan-validator command that checks one todo id against:
   - frontmatter status;
   - acceptance ids;
   - evidence references;
   - value proxy presence.
4. Add unit tests for the validator.
5. Add integration tests with a fixture plan where P5-like partial evidence
   must fail as incomplete.
6. Add one CLI E2E test proving a false completion claim is rejected with a
   helpful error.
7. Wire the validator into session-handoff and comms completion events.

That slice directly prevents the observed P5/P8 failure mode.

## Acceptance Criteria for the Doctrine Update

The doctrine update is complete only when all are true:

1. New or amended rules define completion-claim truth.
2. ADR-117 or a new ADR defines machine-readable acceptance/proof ledgers.
3. PDR-018 names proof chains and value proxies as planning discipline.
4. `jc-plan` templates require proof contracts.
5. `jc-session-handoff` requires completion-validator evidence.
6. `agent-tools` has deterministic plan assertion commands.
7. Unit, integration, and E2E tests prove the validator rejects the exact P5
   false-completion shape.
8. The TDD evidence ledger distinguishes test-first proof from retrospective
   tests and rejects after-the-fact tests as TDD evidence.
9. P8 TUI can show partial, contradicted, pending, and verified-complete states.
10. The cost-of-collaboration plan can no longer be closed as P5 or P8 complete
   while its own acceptance remains pending.

## Final Verdict

The repo does not need less doctrine. It needs a tighter circuit from doctrine
to enforcement.

The right foundation is:

- plans define value and proof;
- TDD creates proofs at every needed level;
- validators recompute completion from live artefacts;
- collaboration tools carry strict completion event kinds;
- the TUI makes contradictions visible;
- consolidation turns repeated contradictions into stronger tripwires.

The non-negotiable tenet should be:

> Completion is a computed verdict, not a confident sentence.

The matching TDD tenet should be:

> Tests drive the work only when they are written before the product code they
> describe. Tests added afterwards may be useful, but they are not TDD.
