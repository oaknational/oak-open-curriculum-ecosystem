---
name: "Gate-1a EEF First Tool Delivery — Parallel Execution Addendum"
overview: "Addendum to graph-stack / graph-mvp-arc / eef-first-feature / graph-query-layer. Captures one architectural amendment, four rotating-cast coordination questions, the dependency-graph-dictated round structure, and the inviolate quality invariants for getting the first EEF MCP tool delivered without rushing or compromising. Authored 2026-05-21 evening by Cirrus Circling Plume after a six-agent team session landed the Inc.1d planning amendment-set at 0cdaf58c plus the residual at f4ca84f6."
graph_layer: substrate
graph_portfolio_index: "../../../graph-portfolio-index.md"
parent_plan: "../active/graph-stack.plan.md"
sibling_plans:
  - "../active/graph-stack.plan.md"
  - "../../../graph-mvp-arc.plan.md"
  - "../../../sector-engagement/eef/current/eef-first-feature.plan.md"
  - "./graph-query-layer.plan.md"
  - "../../../sector-engagement/eef/current/eef-evidence-corpus.plan.md"
specialist_reviewer: "architecture-expert-betty, architecture-expert-fred, assumptions-expert, type-expert, test-expert"
status: current
isProject: false
promotion_trigger: "Owner authorisation of the WS4.4 test-partition amendment + sketch-level ratification of the four rotating-cast protocol additions. Until both are owner-authorised, this addendum is pre-launch and no rotating-cast rounds open."
todos:
  - id: amend-ws4-4-test-partition
    content: "Architectural amendment to WS4.4: ship its own type-invariant smoke-test in graph-core using an inline fixture TNode; move the EefStrand-instantiation smoke-test to land with WS4.5. Justified by separation-of-concerns (each home tests its own invariants), independent of the parallelism side-effect."
    status: pending
    depends_on: []
  - id: protocol-mid-cycle-retirement
    content: "Design the mid-cycle retirement protocol: agent senses approaching token budget → freezes work-in-progress to a structured handoff record (current edit state, in-flight reasoning, decisions made, decisions deferred) → claim handed off → retire. Today's session had natural-boundary closeouts only; token-limit retirement is unnatural and needs structure."
    status: pending
    depends_on: []
  - id: protocol-coordinator-handoff-under-pressure
    content: "Ratify the two-distinct-moments coordinator-handoff pattern (pre-positioning vs. active-acknowledgement) currently in pending-graduations awaiting second-instance. Rotating-cast operation will be the second instance within hours of launch; design accepts that and treats first rotating-cast launch as the controlled stress test."
    status: pending
    depends_on: []
  - id: protocol-grounding-amortisation
    content: "Decide whether each new agent session must pay the full start-right-team grounding cost (~30k tokens) or whether a fast-bootstrap mode is appropriate for narrowly-scoped single-cycle agents (read last-session record + current claims + recent comms only, skip full directive reading). Architectural question about information density of continuity surfaces under faster-than-human-pace operation."
    status: pending
    depends_on: []
  - id: protocol-comms-events-as-failure-mode-channel
    content: "Adopt the comms-event stream as the load-bearing channel for real-time failure-mode capture. Current pattern relies on session-close napkin entries; rotating-cast needs continuous capture so next coordinator's watcher picks up prior coordinator's failure modes during their session, not at close."
    status: pending
    depends_on: []
  - id: fact-find-eef-first-feature-graph
    content: "Read eef-first-feature.plan.md to enumerate the ff1-ff6 dependency graph. Round 4 parallelism shape depends on it; deferred until Round 1 outcome is observed to avoid premature planning."
    status: pending
    depends_on: []
  - id: fact-find-ws2-3-scope
    content: "Read graph-stack.plan.md to confirm WS2.3 is parallel-safe with WS2.2 (file-disjoint within graph-ingest). The plan annotation already declares parallel-safety; this verifies it before Round 1 opens."
    status: pending
    depends_on: []
  - id: launch-round-1-controlled-experiment
    content: "Launch Round 1 as a 3-agent session (not 4 yet) with a single coordinator. Use it to stress-test rotation by deliberately retiring the coordinator mid-round and observing the second-coordinator handoff. Cheapest controlled experiment for the rotating-cast model."
    status: pending
    depends_on: [amend-ws4-4-test-partition, protocol-mid-cycle-retirement, protocol-coordinator-handoff-under-pressure, fact-find-ws2-3-scope]
  - id: round-1-substrate
    content: "Round 1 — 3 parallel implementation cycles after the WS4.4 amendment lands: WS2.2 (graph-ingest jsonld-compatible + Turtle/SKOS parser + invariant-#2 contract test), WS2.3 (graph-ingest peer cycle), WS4.1 (graph-corpus-sdk scaffold), WS4.4 (GraphView interface + fixture-based type-invariant smoke-test in graph-core)."
    status: pending
    depends_on: [launch-round-1-controlled-experiment]
  - id: round-2-adapters
    content: "Round 2 — 2 parallel cycles after Round 1 lands: WS4.2 Threads adapter in graph-corpus-sdk/src/threads/; WS4.5 EefStrandsGraphView adapter in graph-corpus-sdk/src/eef-strands/ with the EefStrand-instantiation smoke-test (T7a's corpus-sdk half)."
    status: pending
    depends_on: [round-1-substrate]
  - id: round-3-query-proof-and-ff1
    content: "Round 3 — WS4.3 Threads query proof + ff1 (first EEF feature ratifying WS4.4 + WS4.5 interfaces against a concrete user-facing scenario). ff1 may run after ff1-ff6 dependency-graph fact-finding completes."
    status: pending
    depends_on: [round-2-adapters, fact-find-eef-first-feature-graph]
  - id: round-4-ff2-ff6
    content: "Round 4 — parallel ff2-ff6 work after ff1 stabilises the interface. Parallelism shape derived from ff1-ff6 dependency graph fact-finding."
    status: pending
    depends_on: [round-3-query-proof-and-ff1]
  - id: capture-test-partition-pdr-candidate
    content: "Capture the test-partition-by-invariant-ownership generalisation as a PDR candidate after WS4.4 + WS4.5 land and a second instance accumulates. Generalisation: each workspace tests its own invariants; downstream consumers test integration; tests do not pull cycles forward via cross-workspace placement."
    status: pending
    depends_on: [round-2-adapters]
---

# Gate-1a EEF First Tool Delivery — Parallel Execution Addendum

## Scope

This addendum is a strategic-brief overlay across four existing plans:

- [`graph-stack.plan.md`](../active/graph-stack.plan.md) — substrate sequencing (WS2.2, WS2.3, WS3.3, WS4.1, WS4.2, WS4.3, WS4.4, WS4.5).
- [`graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md) — gate-0a / gate-1a / gate-0b / gate-1b spine.
- [`eef-first-feature.plan.md`](../../../sector-engagement/eef/current/eef-first-feature.plan.md) — gate-1a delivery contract (ff1–ff6).
- [`graph-query-layer.plan.md`](./graph-query-layer.plan.md) — per-operation sequencing of the 17 MCP tools.

It does NOT replace any of those plans. They remain authoritative for cycle scope, sequencing within each cycle, acceptance criteria, and validation. This addendum captures only:

- One architectural amendment that improves WS4.4's test partition.
- Four open coordination-protocol questions raised by the rotating-cast operational model.
- The dependency-graph-dictated round structure for parallel execution.
- The inviolate quality invariants that hold regardless of compute level.

## Current state (2026-05-21 evening)

- Branch: `feat/mcp-graph-support-foundation`
- HEAD: `f4ca84f6` (chore(repo): land inherited working-tree residual from prior 2026-05-21 sessions). Prior commits this evening: `1178db03` (handoff state) + `0cdaf58c` (Inc.1d EEF concurrent-tenant amendment-set).
- All substrate scaffolds landed: WS1.1–1.6, WS2.1, WS3.1, WS3.2, **WS3.3 adjacency** (landed in `f4ca84f6`).
- Inc.1a remaining: WS2.2, WS2.3 (verify parallel-safety with WS2.2).
- Inc.1b/1c/1d remaining: WS4.1 (scaffold), WS4.2 (Threads adapter), WS4.3 (Threads query proof), WS4.4 (GraphView interface), WS4.5 (EefStrandsGraphView adapter).
- Delivery: ff1–ff6 in `eef-first-feature.plan.md`.

## Architectural amendment: WS4.4 test partition

### The amendment

WS4.4 currently bundles the GraphView interface (in `packages/core/graph-core/src/graph-view/`) with the T7a DeepKeyPath compile-time smoke-test (in `packages/sdks/graph-corpus-sdk/`, against a concrete EefStrand TNode). This couples WS4.4's atomic landing to WS4.1's prior landing (the workspace where the test lives).

The amendment partitions the test by ownership-of-invariant:

- **WS4.4 carries its own type-invariant smoke-test in graph-core**, using an inline fixture TNode declared in the test file. This verifies the interface's DeepKeyPath array-stop discipline against a representative TNode without depending on any concrete instantiation.
- **WS4.5 carries the EefStrand-instantiation smoke-test in corpus-sdk** (T7a's other half), verifying the interface as instantiated on the EEF-specific TNode.

### Architectural justification (independent of parallelism)

1. **Each home tests its own invariants.** Type contracts test where the type lives; instantiation contracts test where the instantiation lives. This is the same separation-of-concerns principle that placed Adjacency tests in graph-project's `./adjacency/` rather than in graph-core.
2. **Reduces graph-core ↔ corpus-sdk test coupling.** Cross-workspace test dependencies make refactoring costlier; they pull cycles forward in time.
3. **graph-core's type contracts become self-testable.** A future contributor reading graph-core can verify the type discipline without needing to load corpus-sdk's context.
4. **Honors atomic-landing.** Each home's cycle is atomic with its own test set. Neither cycle ships a half-tested invariant.

### Side-effect (not the motivation)

WS4.4 can land in parallel with WS4.1 in Round 1, because it no longer depends on the corpus-sdk workspace existing. The parallelism is a downstream consequence of the architectural amendment, not its driver.

### What needs owner authorisation

- Approval of the amendment as a planning change to WS4.4 (small edit to `graph-stack.plan.md` and `graph-query-layer.plan.md`).
- Optional: capture the test-partition-by-invariant-ownership generalisation as a PDR candidate for graduation after a second instance lands (see todo `capture-test-partition-pdr-candidate`).

## Four rotating-cast coordination questions

The owner-proposed operational model: rotating cast of agents (some coordinating, some not), each bounded to ~250k token context budget, eventually auto-spawned every 10 minutes, retiring at budget. This model raises four open coordination-protocol questions that today's natural-boundary closeouts did not exercise:

### Question 1: Mid-cycle retirement protocol

Today's session had agents retire at natural stopping points — slice-complete, commit-landed, peer-closeout. Token-limit retirement is unnatural. An agent approaching their budget mid-cycle, mid-edit, possibly mid-claim cannot simply stop without risking either (a) leaving work in an indeterminate state for the next agent, or (b) rushing to a forced stopping point that breaks atomic-landing.

The protocol shape:

1. Agent senses approaching budget (~80% used, or after each commit).
2. Agent freezes work-in-progress to a structured handoff record covering: current edit state (which files are open and what state they are in), in-flight reasoning (the analysis that led to current state), decisions made (what is settled), decisions deferred (what the next agent must resolve).
3. Claim is reassigned (existing claim shape extended with `mid_cycle_handoff: true` flag plus the structured handoff record).
4. Next agent picks up the claim via the active-claims registry + comms-event watcher.
5. Original agent retires.

This needs designing before rotation is routine.

### Question 2: Coordinator handoff under token pressure

Today's Stratospheric → Cirrus coordinator handoff is in [`pending-graduations.md`](../../memory/operational/pending-graduations.md) awaiting a second-instance trigger before graduating to ratified pattern. The pattern as observed: pre-positioning a coordinator handoff broadcast is distinct from transferring authority; only the receiving agent's active acknowledgement effects the transfer.

Rotating-cast operation will hit this second instance within hours of starting. The design accepts that and treats the first rotating-cast launch as the controlled stress test for the pattern. After observation, graduate to a ratified PDR.

### Question 3: Grounding-cost amortisation

Each new agent session pays ~30k tokens reading the start-right-team foundation (AGENT.md, RULES_INDEX, principles, tdd-as-design, testing-strategy, orientation, thread record, active claims, recent comms, plan body) before any productive work. At 10-min spawn cadence, this is ~180k tokens/hour burned on duplicate grounding alone.

The architectural question: is this efficient, or is a fast-bootstrap mode appropriate for narrowly-scoped single-cycle agents? A fast bootstrap would read only the last-session record + current claims + recent comms-event window, skipping full directive reading on the assumption that the coordinator already verified directive compliance.

This is architectural — it is about the *information density* of continuity surfaces under faster-than-human-pace operation. The current surfaces were designed for human-pace sessions. Rotating-cast is faster.

### Question 4: Comms-events as the failure-mode capture channel

Today's session caught my failure modes (t6 YAML walk-back, backtick incident, verdict-swap loop) at session close, in napkin entries. In rotating operation, my failures need to be visible to the *next* coordinator *during their session*, not at my close. The napkin is too coarse a vehicle — it lives in my context until I write it at close.

The cure: comms-events as the durable real-time channel. Each failure mode is surfaced as an event the next coordinator's watcher picks up immediately. This was implicit in today's all-channels-watcher-non-negotiable rule but becomes load-bearing under rotation. The comms-event-stream-canonical-truth principle currently in pending-graduations becomes essential infrastructure, not a recommendation.

## Dependency-graph-dictated round structure

The wall-clock floor is set by the dependency graph, not by compute. Round N cannot start before Round N-1 lands. Within a round, parallelism is bounded by the file-disjoint partition size. Adding agents beyond that within a single round yields coordinator overhead, not speed.

### Unified execution partition — see `eef-first-feature.plan.md` §Execution Partition

The earlier substrate-only round structure here (4 rounds bounded by `WS2.2`/`WS2.3`/`WS4.1`/`WS4.4`/`WS4.2`/`WS4.5`/`WS4.3` + `ff1`–`ff6`) under-counted gate-1a parallelism: corpus cycles (`t9`, `t12`, `t13`, `t14`, `t20` and downstream) were not layered in, and Inc.1a closure (`WS2.2`/`WS2.3`) was bundled with gate-1a substrate rather than recognised as cross-workspace parallel.

The unified execution partition — substrate cycles + corpus cycles + `ff`-coordination tokens, with file scope, dependency edges, reviewer set, and round assignment — lives in [`eef-first-feature.plan.md`](../../../sector-engagement/eef/current/eef-first-feature.plan.md) §Execution Partition. That table is the team-execution surface. A rotating-cast agent picking up any Round N cycle reads it there.

Summary shape (full table in the eef-first-feature plan):

- **Round 0**: owner authorisation only (`WS4.4` test-partition amendment + four protocol additions).
- **Round 1**: eight parallel cycles + two non-technical streams + two cross-workspace Inc.1a cycles.
- **Round 2**: three parallel cycles (`WS4.5`, `t1`, `t14`-pattern).
- **Round 3**: `t2-zod-loader`.
- **Round 4**: `t6a-explore-tool` + `ff5`-evidence (parallel).
- **Round 5**: `t10-lesson-plan-prompt` + `t15`/`t16`/`t17`/`t18`/`t19` partial extensions (parallel).
- **Round 6**: `ff6-acceptance-bundle` (terminal gate).

Critical path: `WS4.4` → `t1` → `t2` → `t6a` → `t10` → `ff6` (5 sequential rounds + Round 0 + terminal acceptance). The dependency graph, not compute, is the bottleneck.

### What compute scaling buys

- More rounds run unattended (auto-spawn every 10 min carries through Rounds 1–3 over a working day).
- Failure-mode resilience (a failing agent does not take the round down; next spawn picks up via comms-event stream).
- Per-agent context safety (250k cap respected because each agent owns a smaller boundary).

### What compute scaling does NOT buy

- Inter-round latency reduction (each round's commit cascade is serial through one gatekeeper).
- Cross-round parallelism beyond the interface boundary (speculative execution against unobserved behaviour is architecturally risky).
- Cycle-time reduction below the per-cycle floor (TDD authoring, reviewer absorption, gate-suite runtime).

## Inviolate quality invariants

These hold regardless of compute level or parallelism. Any rotating-cast launch MUST respect them.

1. **Atomic-landing**: test code and product code travel in one commit. No "code now, tests later" split.
2. **Reviewer absorption in-cycle**: type-expert, architecture-expert, test-expert dispatched per cycle, verdicts absorbed before the cycle's commit. Not deferred.
3. **File-disjoint partition**: agents do not edit each other's scope within a round. Cross-workspace imports are fine; cross-workspace edits within a round are forbidden.
4. **Pre-commit hook on every commit**: full gate suite (`pnpm check`). Cross-workspace cascade failures surface before merge.
5. **Cross-cutting reviewer per round**: one reviewer reads the integrated state after all round-cycles land, before the next round opens. Today's Evergreen role.
6. **Schema-first execution**: types flow from the Open Curriculum OpenAPI schema (cardinal rule). No manual types at SDK boundaries.
7. **Result pattern at SDK boundaries**: per `principles.md`, no throw-paths in business logic.
8. **TDD-as-design**: tests describe system state, not implementation choices.
9. **Owner direction is final**: any re-shape requires owner authorisation; agents do not re-shape from inside a session.
10. **No `--no-verify`, no scoped-only gate substitution, no hook bypass**: per `no-verify-requires-fresh-authorisation` rule.

## Single biggest architectural lever

Decompose every cycle's tests by ownership-of-invariant, not by ownership-of-implementation. Each workspace tests its own invariants; downstream consumers test integration; tests do not pull cycles forward via cross-workspace placement.

This is:

1. Architecturally correct on its own merits (separation of concerns).
2. The enabler of more parallel-safe partitions because cycles stop coupling each other through test placement.
3. A generalisation that compounds across all future cycles, not just WS4.4 → WS4.5.

After WS4.4 and WS4.5 land with this partition, capture the principle as a PDR candidate (see todo `capture-test-partition-pdr-candidate`).

## Path to done

For a fresh session reviewing this addendum, the path is:

1. **Owner authorisation pass** (read this addendum end to end; decide on the WS4.4 amendment and the four protocol questions).
2. **Fact-finding** (read `eef-first-feature.plan.md` for ff1–ff6 graph; read `graph-stack.plan.md` for WS2.3 scope).
3. **Round 1 launch as controlled experiment** (3 agents, single coordinator, deliberate mid-round coordinator retirement to stress-test the handoff protocol).
4. **Round 1 closeout + protocol observations** (capture what worked; refine the four protocol additions from worked-once to ratified).
5. **Rounds 2–4 cascade** (each round dispatches after prior lands clean).
6. **First EEF tool shipped** (ff1 lands → ratifies WS4.4 + WS4.5 interfaces against a concrete user-facing scenario).

Estimated wall-clock: ~8–11 hours from Round 1 launch through first tool shipped.

## Acceptance

This addendum is accepted as the strategic frame for getting the first EEF MCP tool delivered when:

- WS4.4 test-partition amendment is owner-authorised AND landed as a planning amendment to `graph-stack.plan.md` and `graph-query-layer.plan.md`.
- The four rotating-cast protocol additions are at minimum sketched as PDR candidates in `pending-graduations.md` with first-instance owner direction recorded.
- Round 1 controlled experiment lands clean (3 cycles atomic, reviewers absorbed, pre-commit hook green, mid-round coordinator handoff observed and recorded).
- Rounds 2–4 follow the documented structure, with cross-round protocol refinements captured as comms-event entries for the next coordinator in real time.

When ff1 ships and the first EEF MCP tool is callable end-to-end (interface ratified, test set passing, MCP tool registered), this addendum closes. The trailing PDR graduations (test-partition principle, rotating-cast coordination patterns) carry forward into the next consolidation pass.
