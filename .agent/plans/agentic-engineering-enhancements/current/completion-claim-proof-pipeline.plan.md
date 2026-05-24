---
name: "Completion-Claim Proof Pipeline"
overview: "Executable doctrine and enforcement plan for making workstream completion a computed verdict over live plan status, acceptance evidence, multi-level test-first proof, and value-proxy observation."
todos:
  - id: ws0-thread-integration
    content: "WS0: Integrate the completion-proof report into the agentic-engineering thread, current-plan index, and report index so future sessions route the work explicitly instead of treating it as a standalone reflection."
    status: completed
  - id: ws1-doctrine-contract
    content: "WS1: Amend the governing doctrine surfaces so completion claims are plan-validated boundary data and slice/session/claim closure cannot be called workstream completion."
    status: pending
    depends_on: [ws0-thread-integration]
  - id: ws2-plan-skill-proof-contract
    content: "WS2: Update jc-plan, templates, and planning guidance so executable plans require acceptance ids, proof levels, value proxies, and completion-claim policy before READY/DECISION-COMPLETE language."
    status: pending
    depends_on: [ws1-doctrine-contract]
  - id: ws3-test-first-multilevel-tdd
    content: "WS3: Update TDD doctrine, test-expert routing, and plan evidence language so unit/integration/E2E tests only count as TDD evidence when written and observed red before their product code."
    status: pending
    depends_on: [ws2-plan-skill-proof-contract]
  - id: ws4-agent-tooling-enforcement-bridge
    content: "WS4: Create or amend the agent-tooling execution plan for deterministic CLI/TUI enforcement: plan assert-complete, structured completion events, prose-claim scanning, and TUI contradiction rendering."
    status: pending
    depends_on: [ws2-plan-skill-proof-contract]
  - id: ws5-validator-implementation
    content: "WS5: Implement the deterministic completion assertion validator in the agent-tooling lane with unit, integration, and E2E tests proving the P5/P8 false-completion shape is rejected."
    status: pending
    depends_on: [ws4-agent-tooling-enforcement-bridge]
  - id: ws6-handoff-and-feedback-loop
    content: "WS6: Wire completion assertion evidence into session handoff, comms closeout, consolidation, and next-ideation routing; record measured value-proxy outcomes."
    status: pending
    depends_on: [ws5-validator-implementation]
---

# Completion-Claim Proof Pipeline

**Last Updated**: 2026-05-13
**Status**: 🟡 QUEUED FOR EXECUTION
**Scope**: Agentic-engineering doctrine, planning, proof, and enforcement
routing for completion claims. This plan turns the P5/P8 false-completion
failure into explicit requirements and deterministic checks.

**Authoritative findings source**:
[completion-claims-and-value-proof-pipeline-report.md](../../../reports/agentic-engineering/deep-dive-syntheses/completion-claims-and-value-proof-pipeline-report.md)

**Related source plan**:
[validation-and-tdd-doctrine-restructure.plan.md](validation-and-tdd-doctrine-restructure.plan.md)

**Implementation boundary**: this collection owns the Practice/governance
contract. Any product code in `agent-tools/`, collaboration-state schemas, CLI
commands, hooks, or TUI rendering must be represented in the
[`agent-tooling`](../../agent-tooling/current/) collection before
implementation. Do not implement `agent-tools/` changes directly from this plan
without the WS4 bridge.

---

## End Goal

Agents and humans can trust completion language.

When a session says a workstream, phase, P-lane, WS-lane, or milestone is
complete, that claim is a computed verdict over live plan status, addressable
acceptance criteria, multi-level test-first evidence, deterministic validation,
and the nominated value proxy.

## Mechanism

The plan closes the repeated failure mode by binding completion claims to
artefacts that can be checked:

1. doctrine defines the vocabulary and forbids slice/session closure being
   reported as workstream completion;
2. plans carry machine-addressable acceptance and proof contracts;
3. TDD evidence records test-first red/green ordering at unit, integration,
   and E2E levels;
4. `agent-tools` recomputes completion claims from live artefacts;
5. handoff, comms, and TUI surfaces render partial, contradicted, pending, and
   verified-complete states distinctly;
6. consolidation routes failures back into doctrine and the next ideation loop.

## Means

The work lands as six workstreams after this integration slice:

- doctrine and rule updates;
- `jc-plan` and template updates;
- source-anchored multi-level TDD updates;
- agent-tooling execution bridge;
- deterministic validator implementation;
- handoff, comms, TUI, consolidation, and value-proxy loop closure.

## Non-Goals

- Do not claim P5 or P8 completion from this plan.
- Do not implement `agent-tools/` code until WS4 has a companion
  `agent-tooling` execution surface.
- Do not reduce this to prose reminders; every enduring requirement needs a
  firing surface.
- Do not weaken TDD into "tests exist". The driven part means test-first.
- Do not require a perfect production metric before first enforcement; early
  value proxies may be fixture-backed and later graduate to operational
  telemetry.

## Proof Contract

### Value Proxy

**Name**: false completion caught before handoff.

**Why this proxy represents value**: the repeated P5/P8 failure wasted owner
attention and threatened future routing. If the system rejects, downgrades, or
visibly contradicts false completion claims before a human relies on them, the
collaboration loop becomes more trustworthy and less expensive.

**Measurement points**:

1. A fixture plan with P5/P8-like partial evidence rejects
   `assert-complete`.
2. A handoff or comms event that says "complete" without validator evidence
   fails or is rendered as contradicted.
3. The P8 TUI displays pending/partial/contradicted/verified-complete states
   from live plan evidence, not prose.

### Completion Claim Policy

Allowed verdicts:

- `complete`
- `partial-slice-landed`
- `pending`
- `blocked`
- `contradicted`

`complete` requires validator evidence. Any product-bearing cycle claiming TDD
requires evidence that the test was written and observed red before the product
code it describes.

## Workstreams

### WS0 — Thread Integration

**Status**: completed by this plan landing.

**Acceptance**:

1. This plan exists in `agentic-engineering-enhancements/current/`.
2. The thread record points future sessions to this plan.
3. The current-plan index lists this plan as queued.
4. The deep-dive report index lists the findings source.

**Validation**:

```bash
pnpm markdownlint-check:root
```

### WS1 — Doctrine Contract

**Goal**: make false completion language a doctrine violation, not a style
preference.

**Candidate surfaces**:

- `.agent/rules/completion-claims-must-match-plan.md` (new)
- `.agent/rules/slice-is-not-completion.md` (new)
- `.agent/rules/value-proxy-required-for-capabilities.md` (new or folded into
  the first two rules if simpler)
- `.agent/directives/principles.md`
- `.agent/rules/present-verdicts-not-menus.md`
- `.agent/rules/validators-must-recompute-not-just-record.md`
- `.agent/rules/plan-body-first-principles-check.md`
- PDR-018 and, if needed, PDR-029

**Acceptance**:

1. Completion, slice, session close, claim close, and value observation are
   distinct vocabulary.
2. Any "complete" claim on doctrine, plan, thread, handoff, or comms surfaces
   requires plan-path + todo-id + acceptance ids + validator evidence.
3. The new rule(s) are indexed in `RULES_INDEX.md` and mirrored to platform
   adapters.

**Proof levels**:

- Unit: not applicable unless a scanner helper lands.
- Integration: rule/index/adapter consistency check.
- E2E/value: a future session attempting false-completion wording sees the
  rule in start-right and the validator in handoff/CLI.

### WS2 — Plan Skill Proof Contract

**Goal**: plan authoring produces proof contracts before execution begins.

**Candidate surfaces**:

- `.agent/skills/plan/SKILL-CANONICAL.md`
- `.agents/skills/jc-plan/SKILL.md` if adapter wording needs refresh
- `.agent/plans/templates/feature-workstream-template.md`
- `.agent/plans/templates/components/tdd-phases.md`
- `.agent/plans/templates/components/quality-gates.md`
- ADR-117 amendment or a new ADR for completion assertion architecture

**Acceptance**:

1. Executable plans require acceptance ids.
2. Each acceptance id declares proof level: `unit`, `integration`, `e2e`,
   `value-proxy`, or `non-code`.
3. Each required proof level names a command or observation point.
4. Plans cannot be marked READY/DECISION-COMPLETE without the proof contract.
5. Completion claims are generated from validator output or explicitly labelled
   as pending/partial/blocked.

**Proof levels**:

- Unit: fixture parse/check helpers where tooling exists.
- Integration: plan template self-check catches missing proof contracts.
- E2E/value: a plan handoff cannot omit the proof contract without visible
  failure.

### WS3 — Test-First Multi-Level TDD

**Goal**: make actual TDD non-ambiguous at every proof level.

**Candidate surfaces**:

- `.agent/directives/tdd-as-design.md`
- `.agent/directives/testing-strategy.md`
- `docs/engineering/testing-tdd-recipes.md`
- `.agent/rules/test-immediate-fails.md`
- `test-expert` definition
- `future/tdd-specialist-capability.plan.md`

**Acceptance**:

1. Doctrine names Kent Beck, Martin Fowler, Agile Alliance, and Freeman/Pryce
   as source anchors for test-first red/green/refactor and outside-in guidance.
2. Test-first evidence is required for TDD claims at unit, integration, and
   E2E levels.
3. Tests added after product code are named as regression, characterisation, or
   audit coverage, not TDD evidence.
4. Test-expert rejects "tests were added later" as proof that TDD was followed.

**Proof levels**:

- Unit: examples distinguish test-first evidence from retrospective tests.
- Integration: plan/reviewer fixtures classify evidence correctly.
- E2E/value: a completion validator refuses a TDD claim when red-before-code
  evidence is missing.

### WS4 — Agent-Tooling Enforcement Bridge

**Goal**: route implementation work to the owning collection before code
starts.

**Acceptance**:

1. `agent-tooling/current/` has a companion plan or the
   `cost-of-collaboration.plan.md` has a new todo for completion assertion
   enforcement.
2. That agent-tooling surface names CLI/TUI acceptance criteria:
   `plan assert-complete`, structured completion events, prose-claim scanning,
   claim-close kinds, and TUI contradiction rendering.
3. P5/P8 current plan state is used as the fixture shape: useful slice landed
   must fail as incomplete.

**Proof levels**:

- Non-code: companion plan exists and is indexed.
- Integration: cross-collection references are bidirectional.

### WS5 — Validator Implementation

**Goal**: deterministic enforcement exists in tooling, with real tests.

**Implementation owner**: `agent-tooling`, not this collection.

**Acceptance**:

1. `plan assert-complete` fails hard with helpful errors when plan status is
   pending or acceptance evidence is missing.
2. Unit tests prove parser/evidence classification.
3. Integration tests prove a fixture plan with partial evidence cannot be
   marked complete.
4. E2E tests prove a CLI completion claim is rejected and a partial-slice claim
   is accepted as partial.
5. P8 TUI can render pending, partial, contradicted, and verified-complete
   states.

### WS6 — Handoff and Feedback Loop

**Goal**: completion truth feeds future planning rather than ending at a gate.

**Acceptance**:

1. `jc-session-handoff` requires completion-validator evidence for complete
   verdicts.
2. Comms events and claim closure carry strict completion kinds.
3. Consolidation mines contradicted completion claims into rules or validators.
4. The nominated value proxy is measured for at least one live false-completion
   prevention example.
5. New ideation can cite measured outcomes, not only doctrine.

## Deterministic Validation

At plan-integration time:

```bash
pnpm markdownlint-check:root
```

During doctrine/template work:

```bash
pnpm markdownlint-check:root
pnpm practice:vocabulary
pnpm portability:check
```

During agent-tooling implementation:

```bash
pnpm --filter @oaknational/agent-tools test
pnpm --filter @oaknational/agent-tools test:e2e
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools build
pnpm repo-validators:check
```

Aggregate close:

```bash
pnpm check
```

## Reviewer Routing

- `assumptions-expert`: before WS1/WS2 to validate that the proof contract is
  proportionate and not a disguised rewrite of every plan surface.
- `docs-adr-expert`: WS1/WS2/WS3 doctrine and ADR/PDR changes.
- `test-expert`: WS3 and WS5; must specifically classify test-first vs
  retrospective-test evidence.
- `architecture-expert-fred`: rule/PDR boundary discipline.
- `code-expert` and `type-expert`: WS5 agent-tooling implementation.
- `react-component-expert` or equivalent Ink/TUI reviewer: P8 contradiction
  rendering.

## First Execution Slice

The first non-planning implementation slice is WS1 + the smallest WS2 template
amendment:

1. add `completion-claims-must-match-plan.md`;
2. index and adapter it;
3. amend `jc-plan` to require acceptance ids, proof levels, and value proxy;
4. add a tiny plan-template proof-contract block;
5. validate with markdown, vocabulary, portability, and reviewer routing.

Do not begin `agent-tools` code until WS4 creates the companion implementation
surface.
