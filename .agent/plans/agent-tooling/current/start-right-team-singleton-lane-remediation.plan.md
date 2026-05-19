---
name: "Start Right Team Singleton Lane Remediation"
overview: >
  First-pass remediation plan for the 2026-05-14 N-agent WS1 experiment:
  remove claim-first and path-override shapes that made locally reasonable
  agent behaviour produce duplicate ownership, rogue comms paths, and
  shared-state churn.
todos:
  - id: ws0-baseline-disposition
    content: "Inventory stale comms roots, low-level comms path options, claim-open overlap behaviour, team-start template shape, bulk-cleanup surfaces, and memory snippets; record a disposition for every finding."
    status: pending
  - id: ws1-team-start-rendezvous
    content: "Amend start-right-team and adjacent doctrine so owner-launched identical prompts on singleton lanes report presence/intended boundary before source claims."
    status: pending
    depends_on: [ws0-baseline-disposition]
  - id: ws2-claim-overlap-signal
    content: "Add parser-backed overlap grouping to claims open/list output with a team_routing_required signal for same-thread singleton-lane collisions."
    status: pending
    depends_on: [ws0-baseline-disposition]
  - id: ws3-canonical-comms-path
    content: "Remove normal agent-facing comms path overrides and any standing migration command shape; derive canonical comms paths from repo-root/tool contracts. **Absorbed scope (2026-05-19)**: widen `comms watch` identity filter from `(agent_name, session_id_prefix)` to the full PDR-027 tuple `(agent_name, platform, model, session_id_prefix)`; add a self-echo unit test proving a same-name-different-platform peer is not excluded and a same-tuple self-write is. Required by multi-vendor (Claude+Codex) graph work where derived `agent_name` collisions are foreseeable."
    status: pending
    depends_on: [ws0-baseline-disposition]
  - id: ws4-stale-surface-sweep
    content: "Update or delete stale docs, prompts, executive manifests, and memory-correction surfaces that present comms-events or other retired paths as live. **Deferred 2026-05-19**: scheduled to run parallel with graph multi-agent work, not before it."
    status: deferred
    depends_on: [ws3-canonical-comms-path]
  - id: ws5-bulk-cleanup-hot-window
    content: "Separate live coordination writes from bulk cleanup/retention sweeps, with parser-backed hot-window preflight before cleanup mutates shared state. **Deferred 2026-05-19**: scheduled to run parallel with graph multi-agent work, not before it."
    status: deferred
    depends_on: [ws0-baseline-disposition]
  - id: ws6-pilot-and-hypothesis-routing
    content: "Route the N=7 evidence through the collaboration hypothesis surfaces and validate the remediation on the next natural singleton-lane team window. **Deferred 2026-05-19**: validation surface for the deferred WS4+WS5 — moves with them."
    status: deferred
    depends_on: [ws1-team-start-rendezvous, ws2-claim-overlap-signal, ws3-canonical-comms-path, ws5-bulk-cleanup-hot-window]
  - id: ws7-closeout-and-consolidation
    content: "Run final validation, reviewer synthesis, continuity updates, and consolidation routing without entrenching fixed role labels. **Deferred 2026-05-19**: closeout for the deferred tail; runs after WS6."
    status: deferred
    depends_on: [ws6-pilot-and-hypothesis-routing]
isProject: false
---

# Start Right Team Singleton Lane Remediation

**Last Updated**: 2026-05-19
**Status**: DECISION-COMPLETE — lean multi-vendor scope (WS0 + WS1 + WS2 + WS3 only). WS4–WS7 deferred to run parallel with graph multi-agent work.
**Collection**: `agent-tooling/current`
**Thread**: `agentic-engineering-enhancements`
**Owner ratification (2026-05-19)**: under the broken/accelerator lens applied to graph multi-vendor priority, the gating scope is the four-workstream lean subset. WS3 absorbs the full-tuple identity-filter tightening from the deferred `comms-watch-liveness-floor` plan because the canonical-comms-path workstream already touches that surface and the multi-vendor (Claude+Codex) self-echo risk is named as non-negotiable in [`comms-watch-mechanism.md`](../../../reference/comms-watch-mechanism.md).

## Metacognition Pass

The inherited shape was "teach agents to coordinate better". That is too
agent-blaming and too passive. The 2026-05-14 WS1 experiment shows that the
system made the wrong behaviour locally reasonable:

- the team-start template collapsed presence and ownership;
- `claims open` recorded overlapping claims without surfacing the overlap as
  a team-routing event;
- comms commands exposed storage-path flags to ordinary agent callers;
- stale docs and memory entries could re-seed retired paths;
- bulk cleanup looked like ordinary shared-state writing even when it changed
  a hot coordination surface during an implementation window.

The impact sought is not a bigger role taxonomy. The impact is simpler:
given N agents with the same `start-right-team` opener and a continuation
surface, singleton-lane work should form one implementation route before
source mutation, while support agents become useful without colliding.

## Evidence Base

Primary evidence:

- `.agent/analysis/team-self-organisation-experiment-2026-05-14.md`
- `.agent/memory/active/napkin.md`
- `.agent/state/collaboration/shared-comms-log.md` around
  `2026-05-14T11:36Z` through `2026-05-14T12:40Z`
- `.agent/state/collaboration/closed-claims.archive.json` claim burst:
  `030be163`, `ed9e4df9`, `99ffa59a`, `f1726ad2`, `db6d268b`,
  `3af3b4e4`, `50339228`, and closeout claim `c98b9955`
- `.agent/skills/start-right-team/SKILL-CANONICAL.md`
- `agent-tools/src/collaboration-state/cli-claim-commands.ts`
- `agent-tools/src/collaboration-state/cli-specs.ts`
- `agent-tools/src/collaboration-state/cli-comms-commands.ts`
- `.agent/state/README.md`
- `.agent/memory/executive/memory-state-substrate-contracts.md`
- `.agent/memory/executive/memory-state-substrate-contracts.manifest.json`

Observed high-signal facts:

- Six source claims landed within sixteen seconds on the same WS1 path family.
- Several team-start reports announced "solo implementer" after locally valid
  empty-board checks.
- The closeout phase self-organised better once one visible closeout claim
  existed.
- Feathered's rogue comms events came from an explicit retired path supplied
  to the CLI, not from the current source default.
- Current source still exposes `--comms-dir` across ordinary comms commands.
- Stale repo docs and memory entries still present retired comms roots as live
  or reusable command knowledge.
- Salty's cleanup overlapped active work because a hand-authored jq probe used
  `.active_claims` instead of the actual `.claims` key.

## Problem

The current collaboration substrate makes three distinct concepts look similar
at the moment of action:

1. "I am present and intend to help."
2. "I own this singleton source implementation."
3. "I am writing or cleaning shared state."

When multiple agents launch simultaneously, that ambiguity turns local
compliance into global collision. A registry that merely records claims is not
enough. A comms CLI that allows arbitrary path selection keeps retired storage
concepts alive. A shared-state rule that treats live notes and bulk cleanup
identically lets large cleanup work happen during hot implementation windows.

## End Goal

Future owner-launched N-agent starts can use the same simple interface:

```text
$jc-start-right-team continue <thread>
```

Agents then self-organise earlier because the repo surfaces make the singleton
lane visible:

- presence is reported before source ownership;
- overlapping singleton claims produce a machine-readable routing signal;
- ordinary comms commands cannot write to retired or arbitrary roots;
- stale docs and memory snippets cannot present retired paths as live;
- bulk cleanup has a different hot-window preflight than live coordination
  notes.

## Mechanism

The remediation moves from passive instruction to structural feedback at the
surfaces where the observed failures occurred:

- `start-right-team` changes the first human-visible template from
  claim-first to intended-boundary-first.
- `claims open` becomes overlap-aware without becoming a hard lock.
- comms command specs stop exposing storage roots to ordinary agents.
- stale root mentions are updated, deleted, or marked historical.
- bulk cleanup flows through parser-backed registry checks instead of ad hoc
  jq snippets.
- N=7 evidence is routed through the hypothesis layer without freezing the
  first role labels into permanent doctrine.

## Means

1. Baseline and disposition every stale or ambiguous surface.
2. Amend the team-start and singleton-lane rendezvous contract.
3. Add claim-overlap grouping and team-routing signals in tooling.
4. Remove normal comms path overrides and migration-shaped public commands.
5. Sweep stale docs, prompts, manifests, and memory-correction surfaces.
6. Split live coordination writes from bulk cleanup in docs and tooling.
7. Validate on the next natural singleton-lane team window and consolidate.

## Scope

In scope:

- `.agent/skills/start-right-team/SKILL-CANONICAL.md`
- `.agent/skills/session-handoff/SKILL-CANONICAL.md` only if closeout routing
  cross-references need tightening
- `.agent/rules/respect-active-agent-claims.md` if shared-state cleanup needs
  the live-vs-bulk distinction
- `.agent/directives/agent-collaboration.md` if the behaviour belongs at
  directive level
- `.agent/prompts/agentic-engineering/collaboration/**`
- `.agent/state/README.md`
- `.agent/memory/executive/memory-state-substrate-contracts.md`
- `.agent/memory/executive/memory-state-substrate-contracts.manifest.json`
- `agent-tools/src/collaboration-state/**`
- focused collaboration-state tests under `agent-tools`
- memory update notes under `/Users/jim/.codex/memories/extensions/ad_hoc/notes/`
  only when execution has explicit owner permission to update memory

Out of scope:

- completing WS1 token measurement or starting WS2 token-frontmatter work;
- adding a permanent controller/implementer/reviewer role taxonomy;
- adding a migration command for retired comms roots;
- turning claims into hard locks that mechanically strand agents;
- standalone synthetic team experiments that displace real work;
- solving every collaboration-state domain-model issue in the future brief.

## Prerequisite Classification

Blocking prerequisites:

- Owner review of this first-pass plan before marking it decision-complete.
- Fresh live grounding before implementation: active claims, active queue,
  staged files, dirty tree, shared comms, directed inbox, and relevant plans.
- If the WS1 token-measurement bundle is still uncommitted, the execution
  agent must either land it first or keep this plan's edits pathspec-tight and
  explicitly non-overlapping. This plan must not absorb WS1 source by accident.
- No public migration path for retired comms roots. The owner has rejected that
  shape; execution must replace the old concept rather than preserve it.

Beneficial prerequisites:

- Assumptions review for proportionality and hidden owner decisions.
- Code review for claim-overlap grouping and comms CLI interface removal.
- Docs/onboarding review for start-right-team and stale-surface wording.
- Test/config review for focused collaboration-state validation.
- Additional handoffs from any late-arriving agents in the WS1 experiment.

Minimum shippable shape without beneficial prerequisites:

- WS1 through WS5 can land as small, reviewed-by-author TDD/doc cycles if
  owner directs execution before specialist review, but the plan must stay
  "not decision-complete" until those reviews are run or explicitly waived.

## Workstreams

### WS0 - Baseline Disposition

Goal: produce a complete disposition ledger before changing behaviour.

Tasks:

- Inventory every live `comms-events` mention and classify it as
  `update`, `delete`, `historical-evidence`, or `test-fixture`.
- Inventory every agent-facing `--comms-dir`, `--events-dir`,
  `--messages-dir`, `--lifecycle-dir`, and `comms migrate` surface.
- Inventory team-start and claim-open entry points that ask agents to choose
  ownership before route formation.
- Inventory cleanup flows that mutate `.agent/state/collaboration/**`.
- Inventory memory entries that present stale path or CLI shapes as reusable
  current instructions.

Acceptance:

- A disposition table exists in this plan or a companion report.
- Every discovered stale comms-root surface has one disposition.
- The ledger distinguishes workspace files from external memory notes.
- No implementation change starts until the ledger exists.

Validation:

```bash
rg -n "comms-events|--comms-dir|--events-dir|--messages-dir|--lifecycle-dir|comms migrate|active_claims" .agent agent-tools
```

### WS1 - Team-Start Rendezvous Contract

Goal: make owner-launched identical prompts on singleton lanes rendezvous
before source ownership.

Expected changes:

- Replace `Claimed paths` in the team-start template with:
  - `Intended boundary`
  - `Claim status`
- Add a singleton-lane rule:
  - if the owner launched identical `start-right-team` prompts;
  - and the next safe step is a narrow single-owner source slice;
  - then empty claims mean "no team visible yet", not "safe solo ownership".
- Require presence or a team-routing lease before source claim.
- Preserve normal solo work for non-team and broad parallelisable work.

Acceptance:

- The skill no longer nudges agents to open a source claim just to post
  presence.
- The skill names the first-overlap response: route proposal, one provisional
  reconciler, support roles by boundary, silent default, and closeout owner.
- The wording says role labels are examples, not doctrine.

Validation:

```bash
pnpm markdownlint:root
rg -n "Claimed paths|singleton|Intended boundary|Claim status" .agent/skills/start-right-team/SKILL-CANONICAL.md
```

### WS2 - Claim-Overlap Routing Signal

Goal: make the claims tool surface same-lane overlap at the write point.

Expected changes:

- Add pure overlap-detection helpers for claim path families.
- Add focused unit tests for:
  - same-thread overlapping file/pattern claims;
  - non-overlapping claims;
  - broad shared-state claims that should warn differently from source claims;
  - same-agent claim updates versus peer collision;
  - expired/stale claims excluded from the fresh overlap group.
- Extend `claims open` output with:
  - `overlapping_claims`;
  - `team_routing_required`;
  - `routing_reason`;
  - optional suggested comms text.
- Do not refuse claim creation in this slice. The signal is a routing
  interlock for agents and skills, not a mechanical lock.

Acceptance:

- A same-thread singleton source collision returns
  `team_routing_required: true`.
- Non-overlap returns `team_routing_required: false`.
- The output is machine-readable JSON.
- Existing claim-open callers still receive the claim id and claim body.

Validation:

```bash
pnpm --filter @oaknational/agent-tools exec vitest run tests/collaboration-state --passWithNoTests=false
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
pnpm --filter @oaknational/agent-tools build
```

### WS3 - Canonical Comms Path Interface

Goal: remove ordinary agent ability to choose collaboration comms storage
paths.

Expected changes:

- Remove `--comms-dir` from normal agent-facing comms commands.
- Remove public `comms migrate` command shape unless owner explicitly
  reauthorises it for a one-off maintenance binary outside normal agent use.
- Derive comms root from repo root and the tool contract.
- Keep testability through injected IO/runtime fakes, not path flags.
- Review whether `--repo-root` is still necessary for ordinary callers; keep
  it only with a documented reason.

Acceptance:

- CLI help for `comms send`, `append`, `render`, `inbox`, `watch`, `direct`,
  and `reply` no longer invites agents to provide a comms storage directory.
- No command can write to `.agent/state/collaboration/comms-events/` through a
  normal agent-facing path.
- Tests prove the canonical path is used.
- Tests prove retired paths are absent from help output.

Validation:

```bash
pnpm --filter @oaknational/agent-tools exec vitest run tests/collaboration-state --passWithNoTests=false
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
pnpm --filter @oaknational/agent-tools build
pnpm agent-tools:collaboration-state -- comms send --help
```

Expected help result: no `--comms-dir` for ordinary comms operations.

### WS4 - Stale Surface Sweep

Goal: update or delete stale path and command knowledge.

Expected changes:

- Update `.agent/state/README.md` to point at
  `.agent/state/collaboration/comms/`.
- Update executive memory substrate contract files in the repo.
- Update old experiment prompts or mark them historical if retained.
- Update skill docs and operational docs that still say "session
  comms-events" ambiguously.
- Submit an external memory correction note for stale global memory snippets
  if execution has explicit permission to update memories.

Acceptance:

- Live repo docs no longer present `.agent/state/collaboration/comms-events/`
  as a live root.
- Any remaining `comms-events` mention is explicitly historical evidence,
  fixture data, or a deletion candidate with a recorded reason.
- No raw old-path command example remains in current operational guidance.

Validation:

```bash
rg -n "comms-events|--comms-dir|comms migrate|active_claims" .agent agent-tools
pnpm markdownlint:root
```

### WS5 - Bulk Cleanup Hot-Window Contract

Goal: distinguish live shared-state writes from bulk cleanup.

Expected changes:

- Amend the shared-state posture rule or directive:
  - live coordination notes remain always writable;
  - retention cleanup and abandoned-queue clearing are bulk cleanup;
  - bulk cleanup requires hot-window preflight and visible heads-up when
    active claims exist.
- Add or reuse parser-backed registry checks for cleanup commands.
- Remove examples that encourage direct `.active_claims` jq probes.

Acceptance:

- Cleanup guidance cannot be satisfied by hand-written `.active_claims` jq.
- Bulk cleanup has a preflight result that reports active claims and queue
  entries through the same parser used by collaboration-state tooling.
- Live comms/napkin/claim writes remain unblocked.

Validation:

```bash
pnpm --filter @oaknational/agent-tools exec vitest run tests/collaboration-state --passWithNoTests=false
pnpm markdownlint:root
```

### WS6 - Pilot And Hypothesis Routing

Goal: validate the changed behaviour without turning the repo into an
experiment theatre.

Expected changes:

- Update `n-agent-collaboration-experiments.plan.md`,
  `hypothesis.md`, and `falsification-criteria.md` with the N=7 evidence.
- Treat the evidence as pressure-first routing and mechanical visibility,
  not as proof of a permanent role taxonomy.
- On the next natural owner-launched singleton-lane team window, observe:
  - presence-before-source-claim;
  - overlap output if claims collide;
  - one visible source route before mutation;
  - support agents converting without owner rescue.

Acceptance:

- Hypothesis surfaces record the experiment as strengthening/falsifying
  evidence against specific primitives.
- The next natural pilot has a short evidence note, even if it finds the
  remediation incomplete.
- No standalone experiment is run unless the owner explicitly asks for one.

Validation:

```bash
pnpm markdownlint:root
```

### WS7 - Closeout And Consolidation

Goal: finish with computed status, not confident prose.

Tasks:

- Run focused gates from WS1-WS6.
- Run aggregate gates appropriate to the changed files.
- Dispatch reviewers:
  - assumptions-expert for proportionality and hidden owner decisions;
  - code-expert for collaboration-state implementation;
  - test-expert for TDD/validation shape;
  - docs-adr-expert or onboarding-expert for skill/doc propagation;
  - config-expert if CLI option parsing or package scripts change.
- Update continuity, plan indices, and the frictions register if applicable.
- Run or explicitly route consolidation.

Acceptance:

- Every workstream acceptance id is proven or left pending with a precise
  blocker.
- The plan is not called complete unless all acceptance ids are proven.
- Settled lessons are routed to durable homes; experiment-only evidence stays
  in the hypothesis surfaces.

## Proof Contract

| ID | Workstream | Proof level | Proof |
| --- | --- | --- | --- |
| STR-1 | WS1 | non-code | `start-right-team` template contains intended boundary and claim status, not claim-first presence. |
| STR-2 | WS1 | non-code | Singleton-lane caveat says empty claims under simultaneous owner launch are rendezvous signal, not solo permission. |
| CLM-1 | WS2 | unit | Claim-overlap helper detects same-thread path-family overlap. |
| CLM-2 | WS2 | integration | `claims open` output includes `team_routing_required` for overlapping singleton claims. |
| CLM-3 | WS2 | integration | Non-overlap preserves existing claim-open behaviour. |
| COM-1 | WS3 | unit | Comms defaults derive canonical `comms/` root. |
| COM-2 | WS3 | integration | Agent-facing comms help omits storage-root override flags. |
| COM-3 | WS3 | integration | Retired `comms-events/` cannot be selected through normal comms commands. |
| DOC-1 | WS4 | non-code | Stale comms-root references have recorded dispositions. |
| CLN-1 | WS5 | unit/non-code | Bulk cleanup preflight uses parser-backed registry data, not hand-authored jq. |
| HYP-1 | WS6 | non-code | N=7 evidence is routed through hypothesis/falsification surfaces without fixed role-taxonomy graduation. |
| CLS-1 | WS7 | non-code | Completion verdict is computed from this table, not from session closeout. |

## Quality Gates

Use focused deterministic validation in each workstream, then the standard
component:

- after code cycles: `pnpm --filter @oaknational/agent-tools type-check`,
  `pnpm --filter @oaknational/agent-tools lint`, focused Vitest, and
  `pnpm --filter @oaknational/agent-tools build`;
- after doc cycles: `pnpm markdownlint:root` and `git diff --check`;
- before completion claim: `pnpm check`, unless the owner explicitly scopes a
  smaller proof and records why aggregate proof is deferred.

See `../../templates/components/quality-gates.md`.

## Risk Assessment

| Risk | Mitigation |
| --- | --- |
| Claim-overlap signal becomes a hard lock by accident. | Acceptance states signal, not refusal. Tests prove claim creation still succeeds. |
| Role labels calcify into doctrine. | WS6 routes evidence through hypothesis surfaces and forbids permanent role taxonomy graduation in this plan. |
| Removing path flags breaks tests. | Use runtime IO fakes and repo-root discovery in tests, not production CLI path options. |
| Stale memory outside the repo keeps re-seeding old paths. | Workspace sweep plus explicit external memory correction note when owner permits memory updates. |
| Bulk cleanup becomes blocked behind claims. | Split live writes from bulk cleanup; only bulk cleanup gets hot-window preflight. |
| Current dirty WS1 work is accidentally absorbed. | Blocking prerequisite requires fresh pathspec and commit-boundary check before execution. |

## Foundation Alignment

- `principles.md`: strict and complete; no invented optionality; no
  compatibility layers; replace old concepts everywhere.
- `testing-strategy.md`: tool changes land as TDD pairs with focused tests;
  product code and tests travel together.
- `schema-first-execution.md`: not directly MCP-related, but the same
  generated/contract-first instinct applies: parser-backed state access beats
  hand-authored jq snippets.

## Plan-Body First-Principles Check

The first-principles check fires before every workstream:

- Is this simpler without compromising value?
- Is the plan removing an unnecessary agent-visible option rather than adding
  another warning?
- Is the landing path structural and testable, or only guidance?
- Are role labels being used as examples rather than as ontology?

## Lifecycle Triggers

See `../../templates/components/lifecycle-triggers.md`.

- Session entry: use `jc-start-right-team` only if a team is active; otherwise
  use `jc-start-right-thorough` because this touches Practice and tooling.
- Pre-edit coordination: claim exact files and re-check live claims, queue,
  index, dirty tree, shared comms, and directed inbox.
- During work: log overlap, interface-removal, or stale-surface findings in
  comms and napkin when they change the route.
- Handoff: close own claims, update this plan and relevant thread records.
- Consolidation: route settled observations through `jc-consolidate-docs`;
  do not graduate role taxonomy from this plan.

## Readiness Reviewers

Before this plan is marked `DECISION-COMPLETE / READY FOR EXECUTION`, run:

- `assumptions-expert`
- `code-expert`
- `test-expert`
- `docs-adr-expert` or `onboarding-expert`
- `config-expert` if CLI option parsing changes

## First-Pass Verdict

There is enough evidence to plan the remediation. There is not enough review
yet to execute it as decision-complete work. The first safe next step is WS0:
the disposition ledger.
