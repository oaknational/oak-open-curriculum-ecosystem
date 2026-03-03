# Milestone 2: Open Public Alpha

## Why this milestone matters

The invite-only alpha proved the tools work with real users in a controlled
setting. Now it is time to open the doors. The MCP server transitions from
the development Clerk instance to a production Clerk instance with public
sign-up, giving any educator or developer access to Oak's curriculum
through their AI assistant of choice.

## Who it is for

- **Teachers and educators** across the UK who want AI-assisted access to
  Oak's curriculum resources
- **Edtech developers** building curriculum tools on Oak's open data
- **AI tool builders** integrating Oak's curriculum as a data source
- **Oak's product team** expanding reach and gathering usage data at scale

## What value it delivers

- Anyone can sign up and use Oak's curriculum tools through ChatGPT,
  Claude, Gemini, or other MCP-capable AI assistants.
- Production Clerk with social providers (Google, Microsoft, GitHub)
  provides a professional, frictionless sign-up experience.
- Edge rate limiting on OAuth proxy endpoints protects against abuse
  before the service is open to the public.
- The production auth infrastructure established here carries forward
  into public beta and beyond.

## Progression gates

All must be true before M2 exit:

- [ ] Production Clerk instance deployed and configured
- [ ] Social providers Phase 1 (Google, Microsoft, GitHub) configured
  with custom production credentials
- [ ] `CLERK_AUTHORIZED_PARTIES` environment variable implemented
- [ ] Public sign-up enabled (with disposable email blocking)
- [ ] Edge rate limiting on OAuth proxy endpoints
  (`/oauth/register`, `/oauth/authorize`, `/oauth/token`)
- [ ] HTTP MCP server deployed with production auth
- [ ] Quality gates green (`pnpm qg`)
- [ ] No severity-1 or severity-2 snagging items open

## Implementation notes: edge rate limiting

Rate limiting is handled at the traffic control layer via **Cloudflare**
(not in application code). No code changes or redeployment required --
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

**Next.** Clerk production migration research is complete
([auth/clerk-production-migration.md](../research/auth/clerk-production-migration.md)).
Blocking decision: shared vs independent Clerk instance.

Dependencies: M1 complete.
