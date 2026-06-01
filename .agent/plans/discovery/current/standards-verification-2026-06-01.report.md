---
title: "Agent-readiness standards verification"
collection: discovery
lane: current
status: verification-report
verified_at: 2026-06-01
---

# Agent-readiness standards verification - 2026-06-01

This report re-checks the discovery future bundle and the Oak ticket against
primary standards sources and live Oak endpoints. It is evidence for
[`agent-readiness-discovery-hub.plan.md`](agent-readiness-discovery-hub.plan.md).

## Sources Re-Checked

Primary standards and documentation:

- RFC 9727, `api-catalog`: <https://www.rfc-editor.org/rfc/rfc9727.html>
- RFC 9264, Linkset: <https://www.rfc-editor.org/rfc/rfc9264.html>
- RFC 8288, Web Linking: <https://www.rfc-editor.org/rfc/rfc8288.html>
- RFC 9309, Robots Exclusion Protocol:
  <https://www.rfc-editor.org/rfc/rfc9309>
- Cloudflare Agent Skills Discovery RFC:
  <https://github.com/cloudflare/agent-skills-discovery-rfc>
- Agent Skills overview/specification: <https://agentskills.io/home>
- Cloudflare managed robots/content signals:
  <https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/>
- Cloudflare Web Bot Auth:
  <https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/>
- Cloudflare signed agents:
  <https://developers.cloudflare.com/bots/concepts/bot/signed-agents/>
- MCP Server Card Working Group charter:
  <https://modelcontextprotocol.io/community/server-card/charter>
- SEP-2127 draft branch:
  <https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/sep/mcp-server-cards/seps/2127-mcp-server-cards.md>
- SEP-1649 historical issue:
  <https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1649>
- RFC 9728, OAuth Protected Resource Metadata:
  <https://www.rfc-editor.org/rfc/rfc9728>
- RFC 8414, OAuth Authorization Server Metadata:
  <https://www.rfc-editor.org/rfc/rfc8414>
- A2A latest specification: <https://a2a-protocol.org/dev/specification/>
- A2A agent discovery guide:
  <https://a2a-protocol.org/latest/topics/agent-discovery/>
- DNS-AID draft:
  <https://datatracker.ietf.org/doc/html/draft-mozleywilliams-dnsop-dnsaid-02>
- WebMCP draft/reference:
  <https://webmachinelearning.github.io/webmcp/>

Live Oak checks run from this repository on 2026-06-01:

```bash
curl -I -L https://www.thenational.academy/
curl -i -L https://www.thenational.academy/.well-known/api-catalog
curl -i -L https://www.thenational.academy/.well-known/agent-skills/index.json
curl -i -L https://www.thenational.academy/robots.txt
curl -I -L https://www.thenational.academy/sitemap.xml
curl -i -L https://open-api.thenational.academy/Auth.md
curl -i -L https://open-api.thenational.academy/.well-known/oauth-protected-resource
curl -I -L https://mcp.thenational.academy/.well-known/mcp-server-card
curl -I -L https://mcp.thenational.academy/.well-known/mcp/server-card.json
curl -sS https://curriculum-mcp-alpha.oaknational.dev/.well-known/oauth-protected-resource
dig +short _index._agents.thenational.academy SVCB
dig +short _mcp._agents.thenational.academy SVCB
dig +short _api._agents.thenational.academy SVCB
```

## Verification Summary

| Surface | Current Verification | Plan Consequence |
|---|---|---|
| API catalog | RFC 9727 defines `/.well-known/api-catalog` and the `api-catalog` link relation; live apex returns the `Link` header and an `application/linkset+json` catalog with the RFC 9727 profile. | Treat as shipped baseline; only add the skills relation and keep absolute service anchors. |
| Open API anchor | Live catalog anchors `https://open-api.thenational.academy` and uses absolute URLs for Swagger, docs, playground, and health. | The Oak ticket's consistency concern is already satisfied in production as checked. |
| Skills relation | Live catalog does not include a skills-index relation and `/.well-known/agent-skills/index.json` currently returns 404. | Phase 1 must add skills publication and one catalog edge to it. |
| Agent Skills Discovery | Current Cloudflare RFC uses `/.well-known/agent-skills/index.json`, `$schema` `https://schemas.agentskills.io/discovery/0.2.0/schema.json`, flat artifact entries with `type`, `url`, and `digest`, SHA-256 over raw artifact bytes, GET/HEAD, and correct content types. | Existing repo Agent Skills direction remains valid; implement with build-time digest generation and same-origin Oak artifact hosting. |
| Agent Skills format | Skills are folders with required `SKILL.md` containing at least `name` and `description`, with optional scripts/references/assets and progressive loading. | Keep first tranche as `skill-md` unless supporting files are truly required. |
| Robots / sitemaps / Content Signals | Live apex `robots.txt` has standard directives and sitemaps, but no Content Signals or AI-crawler policy. Cloudflare documents `search`, `ai-input`, and `ai-train`; Cloudflare's managed example is `search=yes, ai-train=no`. Robots and sitemaps are a general baseline for every official Oak web app, not only an apex agent-readiness task. | Engineering must keep per-host robots/sitemap coverage visible and route Content Signals values to editorial/legal before encoding public policy. |
| Web Bot Auth | Cloudflare documents Web Bot Auth as cryptographic verification for automated bot requests and signed agents as user-controlled bots verified through Web Bot Auth. This is an edge/provider verification concern, not a web-app well-known artifact. | Treat as first-class discovery/security bridge: record enable/decline/defer state per official web app and cross-link enabled claims to security evidence. |
| Markdown representation | No standard re-check changes the ticket's shape; this is an Oak representation decision for human content pages. | Track in current plan as human-site content accessibility, not service metadata. |
| Open API auth metadata | `open-api.thenational.academy/.well-known/oauth-protected-resource` returns 404 and `Auth.md` returns 404. The Open API uses static-key auth, so OAuth/OpenID placeholders would be fabricated metadata. | Publish `Auth.md`; do not publish OAuth or OpenID metadata for Open API unless its auth model changes. |
| MCP GA host | `mcp.thenational.academy` does not currently resolve. Alpha protected-resource metadata exists at `curriculum-mcp-alpha.oaknational.dev` and returns JSON pointing to the alpha MCP resource and authorization server. | Keep MCP GA work gated; catalog MCP entry remains off until GA host exists. |
| MCP Server Cards | The MCP Server Card Working Group charter names SEP-2127 as the active draft work item. SEP-1649 is historical and contains the older `/.well-known/mcp/server-card.json` shape with primitive/capability listings. The current SEP-2127 draft branch says cards are stored at `.well-known/mcp-server-card` and focuses remote server connection details. | Correct the Oak ticket before execution: do not implement SEP-1649 path/schema from the ticket without re-verifying the live SEP. Keep MCP Server Cards in future/GA tracking. |
| OAuth metadata | RFC 9728 defines protected-resource metadata discovery, including `WWW-Authenticate` `resource_metadata`; RFC 8414 defines authorization-server metadata at `/.well-known/oauth-authorization-server`. | Valid for MCP alpha/GA OAuth surfaces; not applicable to static-key Open API. |
| DNS-AID | Latest checked DNS-AID draft is `-02`, published 2026-05-27, and remains an Internet-Draft. It uses SVCB/DNS-SD and may use organization-level indexes; live `_agents.thenational.academy` SVCB checks returned no records. | Add future strategic plan; recommended default is hub-only `_index` if Oak adopts it. |
| A2A Agent Card | A2A latest documentation says Agent Cards describe identity/capabilities/skills/service endpoint/auth, and public well-known discovery uses `/.well-known/agent-card.json`. | Add future strategic plan for Aila only if it becomes a real A2A server. |
| WebMCP | WebMCP/Web Model Context API material describes page-exposed browser tools via `navigator.modelContext`; it is separate from headless MCP and useful only if Oak wants in-page agent operability. | Add future strategic plan; do not include in Phase 1. |
| Commerce standards | Oak ticket's out-of-scope verdict remains right for Oak's free public curriculum surfaces. | Record as non-goal, no plan needed. |

## Corrections To Carry Forward

1. The Oak ticket typo `/.well-known/mcp/server-card.json` / SEP-1649 shape is
   not implementation-ready. Use the live MCP Server Card Working Group and
   SEP-2127 as the authority at promotion time.
2. The API catalog origin-anchor fix appears already shipped: the live catalog
   anchors `open-api.thenational.academy` with absolute URLs.
3. The skills edge is not shipped: no skills relation appears in the live catalog
   and the skills index returns 404.
4. The apex robots file is live but carries no Content Signals policy today;
   robots and sitemap coverage should be treated as a general official-web-app
   baseline.
5. Web Bot Auth was missing as a first-class repo plan item; it now needs a
   discovery lane plus security evidence before any enabled claim.
6. `mcp.thenational.academy` is not live in DNS yet; alpha OAuth protected
   resource metadata exists on `curriculum-mcp-alpha.oaknational.dev`.
