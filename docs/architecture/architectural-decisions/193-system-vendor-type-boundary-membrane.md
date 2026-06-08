# ADR-193: System–Vendor Type Boundary — Strict Domain Types, Vendor Types at the Membrane

**Status**: Accepted 2026-06-08 (Evergreen Blossoming Copse session; owner-ratified this session — "it is our architecture to construct so we can choose to accept … we should accept it and document it").
**Date**: 2026-06-08
**Related**:
[ADR-032](032-external-boundary-validation.md) — External Boundary Validation; this ADR is its **outgoing mirror** (ADR-032 governs the incoming membrane where external `unknown` is narrowed; ADR-193 governs the outgoing membrane where strict domain types are handed to external code);
[ADR-034](034-system-boundaries-and-type-assertions.md) — System Boundaries and Type Assertions;
[ADR-107](107-deterministic-sdk-nl-in-mcp-boundary.md) — Deterministic SDK / NL-in-MCP boundary;
[ADR-179](179-transport-agnostic-graph-substrate.md) — substrate ships no transport-shaped code (this ADR is the consumer-side counterpart: where the transport boundary actually sits within a consumer);
[ADR-191](191-deterministic-data-surface-agent-reasons.md) — the consuming agent is the only reasoner over `structuredContent`;
[ADR-038](038-compilation-time-revolution.md) — compilation-time strict typing via `as const` compile-time-known data;
[ADR-141](141-mcp-apps-standard-primary.md) — MCP Apps standard as the only UI surface (the `_meta.ui` convention on tool results that egress functions produce).
Operationalised by the rules `strict-validation-at-boundary`, `unknown-is-type-destruction`, `no-type-shortcuts`, `never-disable-checks`.

## Context

Strict types are a non-negotiable doctrine in this repository: external input is the only `unknown`, it is narrowed exactly once at the input boundary (ADR-032, `strict-validation-at-boundary`), and everything thereafter is exactly typed with no `as`, no widening, no `Record<string, unknown>`/index-signature fallbacks, and no disabled checks.

Building the `get-eef-evidence` MCP tool surfaced a hard question about the **other end** of the system. The tool produces a strict, fully-known evidence envelope (`EefEvidenceEnvelope`) derived entirely from the fixed `as const` EEF corpus. The owner's requirement was that this exact type flow "all the way in and out of the system without mutation." Grounding the MCP SDK (`@modelcontextprotocol/sdk` 1.29.0, the latest) first-hand established:

- The tool callback return type is `CallToolResult`, whose `structuredContent` is `Record<string, unknown>` (`types.d.ts:2601`, `mcp.d.ts:261`). The callback type is **not** parameterised by `outputSchema` (`OutputArgs` reaches only the config object, never `cb: ToolCallback<InputArgs>`), so providing an output schema does **not** type the response — the SDK validates `structuredContent` against the schema at **runtime** (`mcp.js:200-201`) and advertises it on the wire, but the static type is always the generic record. The shape is known to the SDK and deliberately dropped from the type.
- A strict interface is **not** assignable to `Record<string, unknown>` (it lacks the index signature). So the exact envelope cannot enter the vendor's `structuredContent` slot without an index signature, an `as` cast, a runtime launder, or a `Record`/intersection fallback — every one of which is forbidden doctrine. There is no SDK API to provide a precisely-typed `structuredContent`, and 1.29.0 is the latest version.
- **We never consume `structuredContent`.** A first-hand grep of all production (non-test) code in `oak-curriculum-sdk`, the MCP HTTP app, and `graph-corpus-sdk` found zero reads of `.structuredContent`. Our code only *produces* it and hands it to the SDK; the only field our pipeline inspects is `isError`. The sole consumer is the **calling agent**, across the wire, in its own type system (ADR-191).

The first instinct — make the envelope `Record`-assignable (an index signature), or thread strict types through the executor/auth/registration to `server.registerTool` — was wrong in two ways: the index signature pulls the vendor's allow-anything shape *into* our strict domain type, and threading strict types through transport infrastructure adds large complexity (a generic executor/auth chain plus per-tool registration to defeat runtime union-dispatch) for type-purity in code whose currency is already the vendor type.

## Decision

We define an explicit, first-class **type boundary (membrane) between our system and the vendor system**, governed by one principle and realised as two symmetric membranes.

### The governing value principle

**Strict types exist for developer experience and excellence *within our code*. Forcing a strict type into a junction with external (vendor) code is justified only by significant, clear value.** Where it provides no such value — as here, because we never read the value back and the vendor validates it at runtime and the agent consumes it in its own type system — we accept the vendor's type at the boundary. The vendor's loose type is the **external contract**, not a fallback of our design; the "no allow-anything types" rule governs *our* design, not the external API we are handing data to.

### Two symmetric membranes

The system has exactly two type membranes with external code, mirror images of each other:

| Membrane | Direction | The one operation | Type movement |
|---|---|---|---|
| **Ingress** (ADR-032) | external → us | validation (`safeParse`) | `unknown` → strict (the only narrowing) |
| **Egress** (this ADR) | us → external | egress construction | strict → vendor type (the only erasure) |

Between the two membranes, **everything is strict**: exact domain types, no `unknown` (except the ingress validator's input), no `Record<string, unknown>`, no index signatures, no `as`, no disabled checks.

### Data-handling code vs transport code

The membrane sits at the **domain → transport seam**, not at the call into the vendor SDK:

- **Data-handling (domain) code** is strict. It produces and operates on exact domain types built from known data (e.g. the EEF binding layer → `EefEvidenceEnvelope`; `runEefEvidenceTool` → the strict `EefEvidenceResult`).
- **Transport code** is vendor-facing: its currency *is* the vendor's types. The MCP executor, the auth-interception layer, and the registration loop traffic in `CallToolResult`. The decisive tell that they are transport, not domain: the auth-error path **produces** `CallToolResult` directly (`auth-error-response.ts`) — error responses are vendor-shaped by nature. Transport code legitimately speaks the vendor's type; it is not "our strict domain leaking."
- The **egress membrane** is the named seam between them: a per-primitive egress function whose input is a strict domain type and whose output is the vendor's type.

### The nature of types crossing the egress membrane

- On the domain side, the value has its exact type (e.g. `EefEvidenceResult` with `structuredContent: EefEvidenceEnvelope`), proven correct **at construction**.
- The egress function performs the one erasure by **constructing a fresh object** from the strict value (e.g. `{ ...envelope }`), which is structurally assignable to the vendor's `Record<string, unknown>` slot. This needs **no `as` cast, no index signature on our domain types, no `any`, no SDK fork** — a fresh object literal *is* a record; a named interface is the strict constraint on that shape; the spread is the honest act of dropping the name as the value crosses out. It is necessarily **per concrete type** (a generic `<T extends object>` spread is not record-assignable), which is correct for a per-primitive boundary.
- Beyond the membrane, the value is the vendor's type. The vendor serialises it to JSON (its true wire form, where types do not exist) and delivers it to the calling agent.

### We do not reach inside the vendor SDK

The SDK's internal typing choices are the SDK's. We do not fork it, and we do not module-augment its `registerTool`/`ToolCallback`/`CallToolResult` types to smuggle strictness across the boundary. Improving the SDK's types (e.g. genericising the callback over `outputSchema`) is a legitimate **upstream contribution**, pursued separately, never a local override of vendor internals.

### Scope

This boundary governs everything we hand to the MCP SDK — **tools** (`CallToolResult` / `structuredContent`), **resources** (resource result types), **prompts** (prompt result types), and any future primitive. Each primitive that originates from a strict domain type crosses via its own egress function. Tools that build `CallToolResult` directly (e.g. via `formatToolResponse`) never authored a strict type for their `structuredContent`, so they are already consistent with this ADR with no migration — their domain data was always handed across as the vendor type.

## Consequences

**Positive**:

- Strict types hold across the entire domain, from the `as const` corpus through validation to the membrane, with the type checker as the end-to-end proof — without any allow-anything fallback anywhere in our code.
- The data-handling / transport separation is explicit and inspectable: domain code is strict; transport code speaks the vendor type; the egress functions are the named seam.
- Far simpler than threading strict types through transport: no generic executor/auth chain, no per-tool registration gymnastics, no SDK fork or augmentation. The EEF tool fix is a single egress function plus one handler-map wiring.
- The doctrine is symmetric and complete: ingress (ADR-032) and egress (this ADR) are the system's only two type membranes with external code, each with exactly one operation.

**Negative / cost accepted**:

- The vendor's loose type appears at the boundary. This is named, not hidden: it is the external contract, confined to the egress functions, and never inside domain code.
- Each strict-origin primitive must author its own egress function (per-concrete-type; no single generic egress). This is the intended discipline — the seam is explicit — not accidental duplication.
- Two ADRs (032 + 193) describe the full membrane doctrine; they are deliberately symmetric and cite each other.

## Alternatives considered

- **Preserve the precise `structuredContent` type into the SDK.** Impossible: the SDK callback type is `CallToolResult` regardless of `outputSchema` (1.29.0, latest). Rejected on first-hand vendor evidence.
- **Give the domain type an index signature / `& Record<string, unknown>` so it is vendor-assignable.** Rejected: pulls the vendor's allow-anything shape into our strict domain type, inverting the boundary (the external contract belongs at the membrane, not in the domain).
- **Thread strict types through executor/auth/registration to `server.registerTool` (the generic spine).** Maximally strict per line, but large complexity (generic transport chain + per-tool registration to defeat runtime union-dispatch) for type-purity in code whose currency is already the vendor type — no significant, clear value, so excluded by the governing principle.
- **Fork or module-augment the SDK** to type `structuredContent` precisely. Rejected: do not control vendor internals. Upstream contribution is the legitimate path and is separate.
- **`as` cast / runtime launder at the boundary.** Rejected: forbidden by `no-type-shortcuts`; the fresh-object egress construction achieves the crossing without them.

## Open questions / future revision

- **Immediate implementation obligation.** The egress function for `get-eef-evidence` does not yet exist. `oak-curriculum-sdk/src/mcp/universal-tools/executor.ts` currently assigns the strict `EefEvidenceResult` directly into the `CallToolResult`-typed handler map — a type error (`TS2322`, "index signature missing") until the egress function lands. Authoring that egress function (strict `EefEvidenceResult` → `CallToolResult` via fresh-object construction) and wiring it at that point is the first implementation step under this decision; the EEF resource and prompt follow the same pattern. This ADR records the membrane; it does not pre-exist in code.
- **Existing tools** that build `CallToolResult` directly (e.g. via `formatToolResponse`) never authored a strict type for their `structuredContent`, so they are consistent today with no migration. If and when they gain strict domain output types (e.g. via the universal output-schema work), they adopt egress functions at that point.
- **Structural demarcation surface.** This ADR establishes the conceptual separation and the egress-function seam. The exact code-organisation convention that makes data-handling vs transport obvious at a glance (naming, co-location vs a dedicated egress module, TSDoc markers) is a **time-bounded** open item: it settles during the EEF implementation, and this ADR is amended when it does. Until then the boundary is conceptual, with no structural enforcement (e.g. a lint rule) — a new primitive could be wired without an egress function and only the type checker (a direct-assignment error like the one above) would catch it.
- **The governing value principle** ("strict types serve internal DX; cross an external junction only for significant clear value") is a candidate for graduation to a repo-wide principle/rule if it recurs beyond the MCP boundary. Do not pre-generalise.
