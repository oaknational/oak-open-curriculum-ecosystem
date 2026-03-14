# Milestone 3: Public Beta

## Why this milestone matters

The open public alpha delivered reliable search, unified MCP Apps
infrastructure, and initial knowledge graph alignment. Public beta raises
the bar to production-grade: production authentication with public sign-up,
full observability, an exemplar interactive UI, and operational hardening
so the service is reliable enough for sustained daily use.

## Who it is for

- **Teachers and educators** across the UK who want AI-assisted access to
  Oak's curriculum resources — production auth means anyone can sign up
- **Oak's engineering team** maintaining and extending the codebase
- **Edtech developers** building on a more stable, better-documented
  platform
- **Oak's product and design team** shaping the interactive curriculum
  experience

## What value it delivers

- Production Clerk with social providers (Google, Microsoft, GitHub)
  provides a professional, frictionless public sign-up experience.
- Edge rate limiting on OAuth proxy endpoints protects against abuse.
- Full Sentry + OTel observability gives clear visibility into production
  behaviour: structured logging, error tracking, performance monitoring.
- Exemplar MCP App UI (`user_search` tool with React components) —
  a polished, interactive curriculum search experience inside Claude
  Desktop, ChatGPT, and other MCP App hosts.
- Knowledge graph alignment completed (if not done in M2).
- Operational hardening: monitoring, alerting, canonical host enforcement.
- Architectural enforcement (ESLint boundary rules, dependency-cruiser,
  knip) prevents regression as the codebase grows.

## Progression gates

All must be true before M3 exit:

- [ ] Production Clerk instance deployed and configured
- [ ] Social providers Phase 1 (Google, Microsoft, GitHub) configured
- [ ] `CLERK_AUTHORIZED_PARTIES` environment variable implemented
- [ ] Public sign-up enabled (with disposable email blocking)
- [ ] Edge rate limiting on OAuth proxy endpoints
  (`/oauth/register`, `/oauth/authorize`, `/oauth/token`)
- [ ] Sentry + OTel integration deployed and verified
- [ ] Structured logging operational in production
- [ ] Exemplar `user_search` MCP App UI implemented (React components,
  design input applied)
- [ ] Knowledge graph alignment complete (if deferred from M2)
- [ ] Monitoring and alerting configured (sign-up velocity, abuse patterns,
  Clerk API quota usage)
- [ ] Canonical host enforcement verified on Vercel
- [ ] Architectural enforcement strengthened (boundary checks, dead code
  detection)
- [ ] Quality gates green (`pnpm qg`)
- [ ] No severity-1 snagging items open

## Implementation notes: edge rate limiting

Rate limiting is handled at the traffic control layer via **Cloudflare**
(not in application code). No code changes or redeployment required —
rules are configured in the Cloudflare Dashboard and take effect
immediately.

**Setup** (Cloudflare Dashboard > Security > WAF > Rate limiting rules):

1. Create a rate limiting rule per endpoint group with URI path conditions
2. Use IP as the counting characteristic
3. Set the threshold and period per the table below
4. Action: Block (returns 429)

| Endpoint | Limit | Period | Rationale |
|---|---|---|---|
| `POST /oauth/register` | 10 req | 60s per IP | DCR is infrequent; legitimate clients register once |
| `GET /oauth/authorize` | 30 req | 60s per IP | Users may retry failed auth |
| `POST /oauth/token` | 30 req | 60s per IP | Token exchange + refresh |
| `GET /.well-known/*` | 60 req | 60s per IP | Discovery endpoints, cacheable |

Cloudflare's free plan includes 1 rate limiting rule; Pro includes 5.
Multiple path conditions can be combined with OR expressions within a
single rule if needed.

## Current status

**Planned.** Detailed plans exist across multiple collections:

- Production Clerk:
  [auth/clerk-production-migration.md](../research/auth/clerk-production-migration.md)
- Sentry + OTel:
  [sentry-otel-integration.execution.plan.md](../plans/architecture-and-infrastructure/current/sentry-otel-integration.execution.plan.md)
- Extension surfaces (MCP Apps standard migration):
  [roadmap.md](../plans/sdk-and-mcp-enhancements/roadmap.md)
- Agentic engineering:
  [agentic-engineering-enhancements/](../plans/agentic-engineering-enhancements/)
- Architecture and infrastructure:
  [architecture-and-infrastructure/](../plans/architecture-and-infrastructure/)
- Security and privacy:
  [security-and-privacy/](../plans/security-and-privacy/)
- Developer experience:
  [developer-experience/](../plans/developer-experience/)

Dependencies: M2 complete.
