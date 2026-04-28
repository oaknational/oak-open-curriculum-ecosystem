# Cloudflare MCP Public-Beta Security Gate

**Status**: Future strategic brief
**Last Updated**: 2026-04-28

## Problem and Intent

Public beta of the Oak MCP server must not open on optimism about remote MCP
security. The Cloudflare enterprise MCP architecture review identified a
concrete release gate: before public beta, Oak needs an owner-visible
disposition for the Cloudflare controls that can govern public or remote MCP
traffic.

This brief captures the security findings from the Cloudflare MCP review and
the linked MCP security sources. It is strategic context only. Execution
decisions are finalised only when this is promoted to `current/` or `active/`.

## Source Review

Primary sources reviewed:

1. <https://blog.cloudflare.com/enterprise-mcp/>
2. <https://blog.cloudflare.com/code-mode-mcp/>
3. <https://developers.cloudflare.com/cloudflare-one/access-controls/ai-controls/mcp-portals/>
4. <https://developers.cloudflare.com/cloudflare-one/access-controls/ai-controls/secure-mcp-servers/>
5. <https://developers.cloudflare.com/cloudflare-one/tutorials/detect-mcp-traffic-gateway-logs/>
6. <https://developers.cloudflare.com/waf/detections/ai-security-for-apps/>
7. <https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices>
8. <https://owasp.org/www-community/attacks/MCP_Tool_Poisoning>
9. <https://owasp.org/www-project-mcp-top-10/2025/MCP04-2025%E2%80%93Software-Supply-Chain-Attacks%26Dependency-Tampering>

## Domain Boundaries

In scope:

1. Cloudflare-side security controls for Oak's public remote MCP server.
2. MCP-specific threat-model deltas: tool poisoning, shadow MCP, supply-chain
   setup paths, auth audience/resource checks, and tool-output governance.
3. Practice improvements that make vendor-control adoption auditable.
4. Evidence and owner-risk disposition required before public beta.

Out of scope:

1. Replacing Clerk production-auth planning.
2. Implementing arbitrary Code Mode execution before a sandbox/security decision.
3. Rewriting the generated MCP tool system.
4. Treating Cloudflare availability as proof of Oak suitability.

## Candidate Control Disposition Matrix

| Control Family | Cloudflare Surface | Public-Beta Disposition Needed |
|---|---|---|
| Inbound MCP traffic inspection | WAF + AI Security for Apps | Enabled, unavailable, not applicable, or explicitly declined with evidence |
| Authenticated portal governance | Access + MCP server portals | Same disposition, including tool-exposure policy and audit logging |
| Shadow MCP detection | Gateway logs + DLP | Same disposition, including unregistered server/proxy detection |
| Employee/partner access segmentation | Access policies + device/user posture | Same disposition for non-public staff or partner paths |
| LLM traffic mediation, if Oak brokers model calls | AI Gateway | Same disposition where product architecture introduces model brokering |
| Sandboxed Code Mode execution | MCP portals + Dynamic Workers | Same disposition before any `execute(code)`-style product surface |

## Practice Enhancements to Capture

1. **Vendor-control disposition table**: future vendor-doc reviews should record
   each relevant vendor feature as enabled, unavailable, not applicable, or
   declined, with evidence and owner-visible residual risk.
2. **Governed MCP capability platform pattern**: MCP should be treated as a
   governed capability platform with central approval, policy templates,
   default-deny write controls, audit logging, secrets rules, and CI/CD
   provenance.
3. **Shadow MCP threat-model line**: Practice guidance should name unregistered
   MCP servers, MCP proxies, and hidden tool surfaces as discoverable risks at
   session open and security review time.
4. **MCP setup supply-chain rule**: setup docs should avoid floating
   `npx ...@latest` / unpinned proxy flows for trusted MCP paths unless the
   residual risk is explicitly accepted.
5. **Security evidence before claims**: security-facing release claims should
   cite control evidence rather than repeat vendor language.

## MCP Product Enhancements to Preserve

1. Treat structured tool outputs and output schemas as security controls as well
   as developer-experience improvements.
2. Re-check auth against MCP security best practice: token audience/resource
   validation, least-privilege scopes, no credential logging, dynamic client
   registration controls, and no trust in `Mcp-Session-Id`.
3. Evaluate MCP server portals as a possible enterprise/partner access mode.
4. Keep Code Mode behind the same sandbox and audit decision as any other
   generated-code execution surface.
5. Record tool-poisoning and supply-chain checks in the product threat model,
   not only in Practice docs.

## Dependencies and Sequencing Assumptions

1. Phase 2 evidence-contract work must complete before this gate can close.
2. Phase 3 protocol/auth/tool-governance baseline provides the executable home
   for Oak-side controls.
3. Cloudflare feature availability and Oak account entitlement must be verified
   directly during promotion.
4. Production Clerk and Cloudflare Access responsibilities must be separated:
   Clerk remains product identity; Cloudflare is an ingress, policy, portal, and
   inspection layer unless a later plan changes that architecture.

## Success Signals

This brief is ready to promote when:

1. Cloudflare account access and feature availability can be tested.
2. The Phase 2 evidence contract can record vendor-control dispositions.
3. The product threat model has an owner for MCP tool poisoning, shadow MCP,
   supply chain, and auth-audience risks.
4. The SDK/MCP token-economy plan has decided whether Code Mode remains a
   portal-only capability or becomes an Oak-owned product surface.

## Risks and Unknowns

| Risk | Why It Matters | Mitigation During Promotion |
|---|---|---|
| Vendor feature gaps | A missing Cloudflare feature could leave the public-beta gate unresolved | Record unavailable controls explicitly; owner decides residual-risk acceptance |
| Portal incompatibility | MCP server portals may not support every Oak transport or auth nuance | Validate JSON-RPC, auth, resources, prompts, and app metadata with real clients |
| Code Mode sandbox ambiguity | `execute(code)` creates a new high-risk execution surface | Do not implement without sandbox, resource limits, logging, and policy review |
| Tool poisoning | Descriptions and schemas can influence model behaviour | Add generated-descriptor integrity checks and review high-risk tool text |
| Shadow MCP | Users or agents may bypass the governed server | Evaluate Gateway/DLP detection and document setup paths clearly |

## Promotion Trigger

Promote this brief to `current/` when Milestone 3 planning begins, or earlier if
Oak obtains Cloudflare MCP portal / AI Security / Gateway-DLP access that can be
tested against the live MCP server.

The promoted executable plan must include:

1. a Cloudflare control disposition table;
2. deterministic validation commands or manual evidence steps per control;
3. owner-risk acceptance points for unavailable or declined controls;
4. documentation propagation to the security roadmap, product threat model, and
   Practice vendor-doc review pattern.
