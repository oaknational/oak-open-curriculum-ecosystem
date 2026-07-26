# Thread: first-class Copilot CLI Practice citizenship

**Purpose:** Make GitHub Copilot CLI running locally an equal first-class
participant in the repository's canonical Practice and agentic tools.

## Current continuation

- Branch: `docs/copilot-cli-practice-citizenship`
- Base: current `main` at the start of the replacement record landing
- Owner ratification: direct in-session `Implement the plan`, relayed by
  Director Forge rides Brimstone in collaboration event
  `444463f6-d93f-41c1-81c5-a39b3205338f`
- Superseded record: PR #522 was closed with a naming comment; its branch was
  retained for evidence, not reused
- Controlling plan:
  [`first-class-copilot-cli-practice-citizenship`](../../../plans/strategic/first-class-copilot-cli-practice-citizenship.plan.md)
- Delivery plans:
  - [`first-class-copilot-cli-policy-enforcement`](../../../plans/delivery/first-class-copilot-cli-policy-enforcement.plan.md)
    — MCP-150
  - [`copilot-cli-identity-and-practice-join`](../../../plans/delivery/copilot-cli-identity-and-practice-join.plan.md)
    — MCP-154
  - [`copilot-cli-practice-projections`](../../../plans/delivery/copilot-cli-practice-projections.plan.md)
    — MCP-155
  - [`copilot-cli-local-comms-and-lifecycle`](../../../plans/delivery/copilot-cli-local-comms-and-lifecycle.plan.md)
    — MCP-156
- Current boundary: replacement documentation/ADR/matrix/plan landing only.
  Runtime work remains gated behind its merge.
- Next safe step after that merge: execute MCP-150's Claude-only canonical
  policy baseline under its accepted pre-execution constraints, then deliver
  the Copilot CLI vertical.
- Acceptance seat: a real local Copilot CLI process remains required whenever
  a delivery slice reaches acceptance-ready.

## Participating agent identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Thistle rides Canopy | copilot | gpt-5.6-sol | 494337 | design authority and live evidence author | 2026-07-24 | 2026-07-24 |
| Thistle holds Blossom | codex | GPT-5 | 019f94 | replacement-plan implementer | 2026-07-24 | 2026-07-24 |
| Forge rides Brimstone | claude | claude-fable-5 | 398e24 | Director and owner-word relay | 2026-07-24 | 2026-07-24 |

## Standing decisions

- "Copilot" in this thread means **GitHub Copilot CLI running locally**.
  Coding-agent/cloud execution, remote transport, hosted bridges, and
  product-wide Copilot goals are drift.
- First-class means behavioural citizenship: honest identity, deliberate team
  join, canonical capability through native surfaces, communications, policy,
  lifecycle, and proof.
- `.agent/` remains canonical. Direct portable discovery and local-CLI-only
  generated activation adapt it without making GitHub.com a second Practice.
- `.agents/skills/` remains the chosen Copilot skill home under documented
  precedence; no duplicate `.github/skills/` tree is planned.
- Native Copilot startup supplies repository and identity context.
  `oak-start-right-team` remains the deliberate boundary for claims,
  heartbeat, watcher, and lifecycle.
- The policy lane begins with one Claude-only production baseline. It contains
  no dormant Copilot or Codex production branches.
- Native GitHub pre-tool-use is the sole Copilot evaluation authority for a
  tested supported version and consumes the documented single-tool envelope.
  Its hook is inline in `.github/copilot/settings.json`, which cloud agent does
  not load. The version-pinned inherited Claude batch is neutral only when a
  strict environment/schema/session/native-attestation discriminator passes;
  partial evidence fails closed.
- Exact-once policy proof covers successfully dispatched requests. The host
  timeout remains a fail-open ceiling.
- Communications reuse the existing local file-backed substrate. Native wake
  is primary; bounded drain and seen-file gap sweep are recovery.
- MCP tool projection cannot generate from another platform adapter. MCP-155
  first establishes a canonical secret-free server manifest with a total
  disposition over tracked platform candidates, then passes an ignored
  session-only file through `--additional-mcp-config`.
- Shared `.github/hooks`, `.github/agents`, `.github/instructions`, and
  repository MCP projections are excluded because they can affect hosted or
  non-CLI consumers. Custom agents install locally with namespaced ownership
  and reversible cleanup; bounded path instructions are launcher-scoped.
- Plans and ADRs describe the ratified target. The cross-platform matrix
  records target separately from wired and acceptance-proven state.

## Claude-baseline implementation constraints

1. Freeze the failure contract before code.
2. One policy snapshot means one read and parse.
3. Canonical decisions contain no platform response shapes.
4. Production adapters are Claude-only in the baseline; arbitration tests use
   synthetic adapters.
5. Tests use literal snapshots and injected dependencies, never the live
   `.agent` tree.
6. Every structural consumer of removed runner artefacts changes in the same
   landing.
7. Deliver the baseline as one PR with two atomic green TDD commits:
   snapshot/evaluator, then closed Claude composition and full migration.

## Evidence and handoff

- Ratified evidence report:
  [`first-class-copilot-cli-practice-support-2026-07-24.md`](../../../reports/agentic-engineering/first-class-copilot-cli-practice-support-2026-07-24.md)
- Architectural authority:
  [ADR-125](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
- Live target-versus-wired truth:
  [`cross-platform-agent-surface-matrix.md`](../../executive/cross-platform-agent-surface-matrix.md)
- Linear is the execution surface; update MCP-150/MCP-154/MCP-155/MCP-156
  rather than copying ticket state into this thread.
