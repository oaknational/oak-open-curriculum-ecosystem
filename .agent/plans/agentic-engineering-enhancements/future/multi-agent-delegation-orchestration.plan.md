---
status: STRATEGIC BRIEF
classification: future
created: 2026-05-12
session_id: 501be6  # Prismatic Beaming Twilight
related_work:
  - ADR-180 (Codex-Exec Agent Delegation Pattern)
  - cost-of-collaboration.plan.md (P0-P4 implementation)
  - codex-helper skill + codex-exec CLI
  - codex-exec-cli-deep-dive.plan.md
threads:
  - agentic-engineering-enhancements
---

# Multi-Agent Delegation Orchestration Architecture

**Status**: Strategic brief (not yet executable). Promotion to `current/` requires owner review of contracts and open-questions section.

## Open Questions (Address Before Promotion)

These are not gaps to resolve in this plan, but architectural decisions that belong to the promotion phase when concrete consumers appear.

1. **Agent Discovery & Routing**
   - How does a Cursor agent know which Claude or Codex agent to delegate to? (Registry? Convention? Comms-log scan?)
   - Is agent identity convention-based (`codex:main`, `claude:peer`, `cursor:xyz`) or discovery-based?
   - What happens if a target agent is not reachable or not registered?

2. **Credential & Context Scoping**
   - Does each platform invoker read credentials independently, or through a shared environment/config?
   - How does context (files, memory, claims) get passed through the contract without exposing platform internals?
   - What's the boundary between "context I can pass to Claude" and "context only Codex understands"?

3. **Timeout & Failure Modes**
   - How do invokers signal timeout vs other failures? (Currently: response.status = 'timeout'/'error' — is that sufficient?)
   - If a Cursor agent delegates to Codex and it times out, does Cursor retry? Escalate? Fall back to Claude?
   - Should the dispatcher enforce a maximum timeout, or is that the invoker's responsibility?

4. **Structured Output Extraction**
   - Claude has native `tool_use` and JSON schema; Codex has JSONL events; how does the contract express "I want structured output"?
   - Should structured output be a `DelegationRequest` field, or is it a brief-authoring concern?

5. **Observability & Audit Trail**
   - The comms-log provides one audit trail; is that sufficient, or do we need invoker-specific detailed logging?
   - What metadata belongs in `DelegationResponse.metadata` vs in the comms-log?

6. **Cascading Delegation**
   - If Cursor delegates to Claude, can Claude delegate back to Codex? (Or is that an anti-pattern?)
   - How many hops are safe before we treat it as infinite recursion?

## Problem and Intent

### Context

ADR-180 established `codex exec` as the preferred invocation surface for delegating tasks to Codex agents from Claude Code. The pattern works: a CLI that emits JSONL events, a skill documenting the pattern, and a minimal `last-message` extractor.

The next phase is multi-platform: **Cursor agents should be able to delegate to Codex, Claude, other Cursor agents, and internal processes using a single orchestration layer**.

Naive approaches fail:

- **Unified invocation surface**: suppresses platform strengths (Codex's sandbox, Claude's streaming, Cursor's native patterns)
- **Platform-specific scripts everywhere**: scatters coordination logic and increases maintenance surface

The right approach: **unify the coordination layer and contracts, keep invocation surfaces platform-native**.

### Intent

Design and document an architecture that enables any agent (on any platform) to invoke any other agent while:

- Respecting each platform's strengths without compromise
- Coordinating safely through shared comms-log, claims, and structured contracts
- Scaling to new platforms by adding one invoker, not rethinking the whole pattern
- Keeping the agentic-engineering practice alive (explicit principles, contracts before code)

## End Goal

**Enable multi-platform agent orchestration** through a clean three-layer architecture:

1. **Invocation layer** (platform-specific) — how to reach agents on each platform
2. **Contract layer** (unified) — what gets exchanged between invoker and dispatcher
3. **Coordination layer** (unified, already exists) — who's doing what, when, with what comms protocol

A Cursor agent should be able to delegate to Codex or Claude with the same dispatcher call, receiving the same response shape, logged to the same comms-log.

## Mechanism

### Layer 1: Coordination (Already Exists, Make Explicit)

The coordination layer already exists in `.agent/state/collaboration/`:

- `active-claims.json` — who owns what work
- `shared-comms-log.md` — generated index of `comms-events/`
- `comms-events/*.json` — individual delegation requests and responses

**The work**: Document this as the canonical coordination surface and define the `CommsEvent` schema.

### Layer 2: Contracts (Define Before Code)

Three schemas, platform-agnostic, defined in `agent-tools/src/contracts/`:

**`DelegationRequest`**

```typescript
interface DelegationRequest {
  agentId: string;                    // Who's asking? (cursor:peer, claude:main)
  targetAgent: string;                // Who to invoke? (includes platform)
  requestId: string;                  // Unique trace ID
  brief: string;                      // The task
  context?: {
    cwd?: string;
    files?: Record<string, string>;
    memory?: unknown;                // Session state
    claims?: string[];               // Active claims in this repo
  };
  sandbox?: 'read-only' | 'workspace-write' | 'danger-full-access';
  maxTokens?: number;
  deadline: number;                  // Unix timestamp
  defaultAction?: string;            // Timeout behavior
}
```

**`DelegationResponse`**

```typescript
interface DelegationResponse {
  agentId: string;
  status: 'success' | 'timeout' | 'error';
  message: string;                   // Final output
  structured?: unknown;              // Optional structured output
  metadata?: {
    duration: number;
    tokensUsed?: number;            // Claude
    eventsProcessed?: number;       // Codex
    sandboxMode?: string;           // Codex
    modelUsed?: string;             // Claude
    platformMetadata?: Record<string, unknown>;
  };
}
```

**`CommsEvent`** (in `.agent/state/collaboration/comms-events/`)

```typescript
interface CommsEvent {
  id: string;
  timestamp: number;
  from: string;                       // Invoking agent
  to: string;                         // Target agent
  type: 'delegation-request' | 'delegation-response' | 'delegation-error';
  request: DelegationRequest;
  response?: DelegationResponse;
  status: 'pending' | 'complete' | 'failed';
  deadline: number;
  defaultAction?: string;
}
```

**The work**: Typify these contracts in `agent-tools/src/contracts/`, define them in `agent-tools/docs/`, and document the contract evolution rules.

### Layer 3: Invocation (Platform-Specific, Pluggable)

Each platform gets an `AgentInvoker` that:

- Knows how to reach agents on that platform
- Translates `DelegationRequest` to platform-native calls
- Extracts results back to `DelegationResponse`
- Is testable with injected dependencies

**Invoker interface**:

```typescript
interface AgentInvoker {
  platformId: 'codex' | 'claude' | 'cursor' | 'internal' | string;
  canInvoke(agentId: string): boolean;
  invoke(request: DelegationRequest): Promise<DelegationResponse>;
}
```

**Examples**:

- **CodexInvoker**: Spawns `codex exec --json`, parses JSONL, extracts final message (already proven in ADR-180)
- **ClaudeInvoker**: Calls Anthropic SDK, injects context via system prompt, captures structured output via streaming or schemas
- **CursorInvoker**: HTTP POST to Cursor agent endpoint, or file-based handoff + polling
- **InternalInvoker**: Direct function call to TypeScript function in the same process

**The work**: Implement invokers for each platform, each in its own module, each returning the unified contract.

### Dispatcher (Coordinates the Layers)

The `AgentDispatcher` sits above all invokers:

```typescript
class AgentDispatcher {
  async delegate(request: DelegationRequest): Promise<DelegationResponse> {
    // 1. Post comms-event (pending)
    // 2. Find invoker by platform prefix in targetAgent ID
    // 3. Invoke and handle timeout
    // 4. Update comms-event with response
    // 5. Return response to caller
  }
}
```

**The work**: Implement the dispatcher, wire it to the comms-log, and provide a CLI entry point (`pnpm agent-tools:agent-dispatch`).

## Means (Strategic Moves)

### Move 1: Articulate the Contracts (this plan, next session)

Write the `DelegationRequest`, `DelegationResponse`, and `CommsEvent` schemas in TypeScript.

- Where: `agent-tools/src/contracts/`
- Validation: TypeScript compile, schema round-tripping tests, schema documentation

This is the core design deliverable. Implementation can wait until there's a concrete consumer.

### Move 2: Implement CodexInvoker (proven via ADR-180, just codify)

Extract the `codex exec` pattern into an `AgentInvoker` interface:

- Take a `DelegationRequest`, return `DelegationResponse`
- Use the existing `codex-exec last-message` extractor
- Test with injected `spawn` mock

**Why**: Validate that the contract works with an existing, proven pattern.

### Move 3: Implement ClaudeInvoker (new, requires decisions)

Wrap Anthropic SDK to:

- Inject context via system prompt
- Handle structured output (schemas or tool-use)
- Return unified response shape

**Why**: Prove that different platform invocations can return the same contract.

### Move 4: Implement AgentDispatcher (orchestration)

Coordinate the invokers:

- Route by agent ID platform prefix
- Post/update comms-events
- Handle timeouts and errors
- Provide CLI and programmatic APIs

**Why**: The dispatcher is how agents actually use this. It's not interesting until multiple invokers exist.

### Move 5: Implement CursorInvoker (deferred, awaits Cursor integration research)

Cursor agent invocation pattern depends on:

- How Cursor agents expose themselves (HTTP endpoint? shared file system? MCP?)
- Credential/context passing conventions
- Whether Cursor has native delegation support

**Why**: Deferred until there's a concrete Cursor agent in the workflow.

## Domain Boundaries

### What This Plan DOES

- Define the coordination and contract layers for multi-platform delegation
- Prove the contracts work with real platforms (Codex, Claude)
- Design the dispatcher and invoker interfaces
- Document the pattern for future platforms (scaling property)

### What This Plan DOES NOT

- Implement Cursor invoker (awaits Cursor integration research)
- Solve agent discovery/routing at the registry level (deferred to implementation)
- Handle credential management (deferred to invoker implementations)
- Design retry strategies or backoff (deferred to implementation)
- Build a general-purpose multi-agent framework (narrowly scoped to delegation)

## Dependencies and Sequencing

| Dependency | Type | Reasoning |
| --- | --- | --- |
| ADR-180 (Codex-Exec pattern) | Blocking | CodexInvoker reference implementation |
| codex-exec CLI + codex-helper skill | Blocking | Extraction and pattern documentation |
| Anthropic SDK (already in repo) | Blocking | ClaudeInvoker implementation |
| `.agent/state/collaboration/` surfaces | Blocking | Coordination layer foundation |
| cost-of-collaboration.plan.md (P0-P2 complete) | Beneficial | Multi-agent execution environment is ready; P3 commit-queue enforcement is orthogonal |

**Minimum shippable without cost-of-collaboration P3**: Contracts + CodexInvoker validated against existing ADR-180 work. Dispatcher is deferred if multi-agent windows aren't safe yet.

## Strategic Acceptance Criteria

Plan promotion to `current/` (executable planning phase) requires:

1. **Contracts finalized and documented**
   - `DelegationRequest`, `DelegationResponse`, `CommsEvent` types in `agent-tools/src/contracts/`
   - JSON Schema and TypeScript versions both present
   - At least one unit test validating round-trip serialization for each
   - Zero unresolved open questions in the contracts section (open questions 1-6 remain at the strategic level)

2. **CodexInvoker reference implementation validated**
   - Takes `DelegationRequest`, returns `DelegationResponse`
   - Reuses existing `codex-exec last-message` extractor
   - At least 5 unit tests with mocked child-process spawn
   - Code-expert and assumptions-expert APPROVE

3. **ClaudeInvoker design explored**
   - System-prompt injection pattern documented
   - Structured-output approach decided (schemas vs tool-use)
   - Trade-offs between streaming and batching understood
   - At least 3 unit test stubs written (no implementation)

4. **Open questions addressed**
   - Questions 1-6 above have explicit owner decisions or deferral notes
   - Assumptions section (below) records which questions are dependencies vs nice-to-haves

5. **Assumptions section reviewed by owner**
   - Owner confirms which assumptions are load-bearing
   - Owner specifies which open questions block promotion vs are allowed to remain open

## Risks and Unknowns

| Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- |
| Codex event API changes | Medium | Invoker breaks silently | CodexInvoker unit tests must verify event parsing; ADR-180 risk already accepted |
| Claude's streaming model doesn't map cleanly to contract | Medium | ClaudeInvoker complexity grows | Structured-output decision during promotion phase |
| Agent discovery becomes a coordination bottleneck | Low | Scaling fails beyond 5-10 agents | Deferred; convention-based routing (`codex:main`, `claude:peer`) should scale to hundreds |
| Credential scoping grows unexpectedly complex | Medium | Invoker implementations diverge | Addressed in contracts phase if pattern emerges |
| Multi-agent execution windows remain unsafe (P3 pending) | Medium | Dispatcher can't be used yet | Orthogonal to contract design; promotion can happen anytime |

## Assumptions (Explicit for Future Review)

1. **Coordination layer exists and is stable** — `.agent/state/collaboration/` is the source of truth for comms and claims. (Evidence: P0-P2 cost-of-collaboration work landed successfully.)

2. **Platform-native invocation beats unified surfaces** — Codex's sandbox, Claude's streaming, and Cursor's native patterns are worth preserving, even if it means multiple invoker implementations. (Evidence: ADR-180 analysis.)

3. **Agent IDs encode platform prefix** — `codex:main`, `claude:peer`, `cursor:xyz` style IDs are stable enough to base routing on. (Assumption: convention holds across sessions.)

4. **Contracts are stable and rarely change** — Once `DelegationRequest`, `DelegationResponse`, and `CommsEvent` are finalized, they are immutable except through deliberate versioning. (Evidence: Similar patterns in other distributed systems; versioning example: Anthropic SDK message format evolution.)

5. **Invokers are independent** — CodexInvoker, ClaudeInvoker, CursorInvoker don't share code beyond the interface. (Rationale: Keeps platform-specific logic isolated; futures the ability to move an invoker to its own workspace.)

6. **Timeout is the dispatcher's responsibility, not the invoker's** — The dispatcher enforces `deadline - now()` and signals timeout if an invoker overruns; invokers don't need their own timeout logic. (Trade-off: Simpler invoker implementations, but means the dispatcher must be resilient to blocking calls.)

7. **Structured output is explicit in the brief, not in the contract** — The requester puts "Return JSON matching schema X" in the brief; the invoker is responsible for parsing/validating. (Rationale: Keeps the contract simple; structured output is a quality-of-life concern, not a routing concern.)

## Promotion Trigger

Promote from `future/` to `current/` when:

1. Owner reviews and approves the open questions section and assumptions, designating which are blocking vs allowed-to-remain-open for the `current/` phase.
2. Contracts are drafted in TypeScript with at least basic tests.
3. CodexInvoker reference implementation is reviewed and APPROVED by code-expert and assumptions-expert.
4. A second concrete consumer exists or is visible in the backlog (Cursor-to-Codex delegation, Claude-to-Claude, or internal agent-to-agent).

**Evidence marker**: When the promotion trigger fires, record the owner decision, the second consumer's name, and the readiness verdict in the `current/` executable plan.

## Integration Points (Existing and Future)

### Existing Work

**ADR-180 (Codex-Exec)**: This plan extends ADR-180. The contracts layer formalises what ADR-180 proved informally. CodexInvoker will validate that the proven pattern works when expressed as `AgentInvoker`.

**codex-helper skill**: Remains stable. The skill documents the Codex delegation pattern at the high level; this plan documents how it fits into multi-platform orchestration.

**cost-of-collaboration lane**: P0-P2 (broken-code guards, comms CLI, comms watch) provide the operational foundation. P3 commit-queue enforcement is orthogonal. The dispatcher will respect the same comms-log and claims surfaces that P0-P2 created.

**Agent-tools workspace**: The contracts, invokers, and dispatcher all live in `agent-tools/src/`. The skill and CLI entry points grow organically.

### Future Work (Contingent on This Plan)

**Cursor invoker + Cursor delegation**: Once Cursor agent infrastructure exists and this plan is in `current/` or `active/`, someone will implement `CursorInvoker` by deciding on credential scoping and context passing.

**Agent discovery/routing**: If the second-consumer trigger fires for Cursor-to-Codex work, a registry or convention-based routing layer will become concrete. This plan assumes it but doesn't prescribe it.

**Cascading delegation**: If Claude ever needs to delegate to Codex, or Cursor needs to delegate to Claude, those invokers will already exist and the dispatcher will just work.

**Internal agent invoker**: Direct TypeScript function invocation (for type-checkers, linters, validators running in-process) uses the same dispatcher.

## Foundation Alignment

**Principle: Schema-First Execution** (`schema-first-execution.md`) — The contracts are the schema; all invoker implementations derive from them. The contracts are defined first, code follows.

**Principle: Architectural Excellence Over Expediency** (`principles.md`) — This plan chooses multiple invokers over a false unified surface. The short-term complexity (maintaining several invokers) is justified by long-term clarity (each platform shines).

**Principle: No Speed Pressure** (`no-speed-pressure.md`) — This is a strategic brief. Implementation is deferred until a second consumer appears and the owner decides to promote.

**Rule: Consolidate at Third Consumer** (`consolidate-at-third-consumer.md`) — We're designing for extensibility; consolidation happens when three platforms have invokers and patterns emerge.

**Rule: Plan-Body First-Principles Check** — This plan's shape (three-layer architecture) came from first principles: what's platform-specific, what's shared, what already exists. The landing-path (contracts first, then reference implementations) is intentional. Vendor-literal details (Codex event shape, Anthropic SDK features) are deferred to the invoker implementations.

## Non-Goals (YAGNI)

- **Not a general-purpose multi-agent framework** — narrowly scoped to delegation and orchestration, not to shared memory, learning, or emergent behaviour
- **Not a retry/backoff system** — invoker authors are responsible for timeouts within their boundaries; the dispatcher enforces deadline
- **Not a credential management system** — each invoker reads credentials independently (or through whatever the platform provides); the plan does not centralize secrets
- **Not an observability solution** — the comms-log provides audit trail; invoker-specific tracing/metrics are a separate concern
- **Not a load balancer** — agent selection is the caller's responsibility; the dispatcher just routes to the nominated agent
- **Not a protocol buffer / gRPC replacement** — the contracts are JSON-serializable TypeScript interfaces, not a cross-language wire format

## Learning Loop Reference

Completion of this plan (when promoted to `current/` and executed) MUST run or reference:

- **Milestone closure**: When the dispatcher is tested and working with Codex and Claude invokers, record findings in the thread record's next-session entry.
- **Strategic promotion**: When a second concrete consumer appears and promotion to `current/` is decided, document the promotion evidence and carry forward assumptions.
- **Consolidation**: When this work is complete, run `/jc-consolidate-docs` to graduate permanent findings (contracts, invoker patterns, dispatcher lifecycle) into ADRs, docs, or the skill library. Archive this plan per ADR-117.

## Plan-Body First-Principles Check

**Shape**: Three layers (invocation, contract, coordination) is justified by platform heterogeneity. Each platform is better served by its own invoker. Coordination is shared. This is simpler than both "unified surface" and "platform-specific everything".

**Landing-path**: Contracts first (1-2 sessions), CodexInvoker (1 session, mostly extraction), ClaudeInvoker (2-3 sessions, decisions required), dispatcher (1-2 sessions). This is staged so promotions to `current/` can happen incrementally.

**Vendor literals**: Codex event shape (already proven in ADR-180), Anthropic SDK features (documented in clippy), Claude's streaming model (requires exploration). These are deferred to invoker implementation phases.
