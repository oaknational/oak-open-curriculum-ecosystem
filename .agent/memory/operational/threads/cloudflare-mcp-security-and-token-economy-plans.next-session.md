# Next-Session Record — `cloudflare-mcp-security-and-token-economy-plans` thread

**Last refreshed**: 2026-04-28 (Glassy Ebbing Reef / codex / GPT-5 /
`019dd3` — owner-requested session handoff and light docs consolidation after
Cloudflare MCP security and token-economy planning. The planning artefacts are
ready for the closeout commit.)

---

## Thread Identity

- **Thread**: `cloudflare-mcp-security-and-token-economy-plans`
- **Thread purpose**: Product/security planning for the Oak MCP server's
  public-beta gate and token-efficient tool-use evolution.
- **Branch**: `feat/otel_sentry_enhancements` (parallel planning lane; not the
  branch-primary observability product thread)

## Participating Agent Identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Glassy Ebbing Reef` | `codex` | `GPT-5` | `019dd3` | `cloudflare-mcp-security-token-economy-planning` | 2026-04-28 | 2026-04-28 |

Identity discipline remains additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; matching platform/model/agent_name updates
`last_session`.

---

## Landing Target (per PDR-026)

**Latest session landed Cloudflare MCP planning capture (2026-04-28 Glassy
Ebbing Reef):**

- added
  [`cloudflare-mcp-public-beta-security-gate.plan.md`](../../../plans/security-and-privacy/future/cloudflare-mcp-public-beta-security-gate.plan.md)
  as the future strategic brief blocking MCP public beta on appropriate
  Cloudflare-side security-feature evaluation and owner-visible risk
  disposition;
- added
  [`mcp-tool-token-economy-and-progressive-discovery.plan.md`](../../../plans/sdk-and-mcp-enhancements/future/mcp-tool-token-economy-and-progressive-discovery.plan.md)
  as the strategic brief for Cloudflare/Anthropic Code Mode patterns,
  progressive discovery, token-footprint measurement, and Oak MCP
  applicability;
- clarified the product hierarchy: the MCP server primarily supports teachers
  and other end users exploring and using curriculum; engineering/product
  builder workflows are important but secondary, and the SDK is the more direct
  engineering surface;
- updated the high-level, security-and-privacy, and SDK/MCP enhancement indexes
  so the new future briefs are discoverable.

**Evidence before closeout commit**: targeted markdownlint, Prettier,
`git diff --check`, and collaboration-state checks passed before the
owner-requested handoff. The closeout commit should preserve those artefacts
plus this thread record.

---

## Lane State

**Owning plans**:

- [`../../../plans/security-and-privacy/future/cloudflare-mcp-public-beta-security-gate.plan.md`](../../../plans/security-and-privacy/future/cloudflare-mcp-public-beta-security-gate.plan.md)
- [`../../../plans/sdk-and-mcp-enhancements/future/mcp-tool-token-economy-and-progressive-discovery.plan.md`](../../../plans/sdk-and-mcp-enhancements/future/mcp-tool-token-economy-and-progressive-discovery.plan.md)
- [`../../../plans/high-level-plan.md`](../../../plans/high-level-plan.md)

**Current objective**: keep the Cloudflare public-beta security gate and token
economy research visible without prematurely starting implementation.

**Current state**:

- Public beta is blocked on the Cloudflare MCP security gate until each
  relevant control is enabled, unavailable, not applicable, or explicitly
  declined with evidence.
- Token-economy work is future strategic context. The first implementation
  step is measurement, not a generated-code execution surface.
- Teacher-facing curriculum journeys are the primary evaluation target for MCP
  token economy. Engineering/API workflows are secondary comparison cases and
  map more directly to the SDK.

**Blockers / low-confidence areas**:

- Cloudflare account entitlement and feature availability are unverified.
- Cloudflare portal Code Mode may not support Oak's transport, auth, resources,
  prompts, or app metadata without changes.
- An Oak-owned `execute(code)` tool is blocked until the security gate or an
  equivalent sandbox decision is satisfied.

**Next safe step**:

1. If public-beta planning resumes, promote the Cloudflare security gate to an
   executable `current/` plan and start with a vendor-control disposition table.
2. If token economy resumes first, measure current `tools/list` and real
   teacher-facing workflow token cost before changing the MCP tool surface.
3. Keep the SDK/MCP boundary explicit: direct API integration belongs primarily
   to the SDK; MCP optimisation starts from teacher curriculum exploration.

**Active track links**: none.

**Promotion watchlist**:

- Vendor-control disposition may become a reusable Practice pattern after a
  second vendor-control review proves the shape.
- Progressive tool discovery may become an SDK/MCP implementation pattern after
  Oak-specific token-footprint evidence exists.
