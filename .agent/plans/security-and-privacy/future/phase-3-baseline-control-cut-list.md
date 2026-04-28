# Phase 3 Baseline Control Cut List

**Status**: 📋 Planned
**Last Updated**: 2026-04-28

## Purpose

Define the first executable implementation tranche for baseline security
controls.

## Public-Beta Blocking Gate

Public beta of the Oak MCP server is blocked until appropriate Cloudflare-side
security features for public/remote MCP operation are evaluated and resolved.
This gate was added after reviewing Cloudflare's 2026-04-14 enterprise MCP
reference architecture: <https://blog.cloudflare.com/enterprise-mcp/>

The strategic source for this vendor-control gate is
[cloudflare-mcp-public-beta-security-gate.plan.md](cloudflare-mcp-public-beta-security-gate.plan.md).
This baseline cut list keeps only the Phase 3 implementation tranche pointer.

The current candidate control families are:

| Control Family | Cloudflare Surface | Required Disposition Before Public Beta |
|---|---|---|
| Inbound MCP traffic inspection | WAF + AI Security for Apps | Enabled, unavailable, not applicable, or explicitly declined with evidence |
| Shadow MCP detection and policy enforcement | Cloudflare Gateway + DLP | Enabled, unavailable, not applicable, or explicitly declined with evidence |
| Authenticated portal governance | Cloudflare Access + MCP server portals | Enabled, unavailable, not applicable, or explicitly declined with evidence |

The gate is intentionally stricter than the current baseline tranche. Public
beta can proceed only after these Cloudflare controls have owner-visible
evidence and risk classification; a missing vendor feature is still a release
blocker unless the owner explicitly accepts the residual risk.

## Implementation Tranche 1 (Baseline)

| Order | Control Family | Research Anchor | Primary Surfaces |
|---|---|---|---|
| 1 | Protocol strictness and request validation | 5.2 / 6.1 | `apps/*mcp*/`, request validation layers |
| 2 | Authentication/authorisation baseline | 5.2 / 6.2 | auth middleware/policy, token validation flows |
| 3 | Tool governance baseline | 5.2 / 6.3 | tool manifests, onboarding controls, execution policy |

## Deterministic Validation Map (Initial)

- Protocol baseline: request schema/method allowlist checks defined and runnable.
- Auth baseline: token validation and no-passthrough checks defined and runnable.
- Tool governance baseline: manifest/integrity checks defined and runnable.

## Deferred Controls

Low-priority controls are tracked in
[deferred-controls-register.md](deferred-controls-register.md).

## Validation Checklist

- [ ] Baseline controls map only to 6.1-6.3 scope
- [ ] Ordering and ownership are explicit
- [ ] Deferred controls are referenced explicitly
