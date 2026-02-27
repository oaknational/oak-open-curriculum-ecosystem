# Milestone 1: Open Public Alpha

## Why this milestone matters

This is when teachers and edtech developers can actually use the tools,
not just read the code. The HTTP MCP server moves from private alpha
(invitation-only) to public alpha, meaning anyone can connect an AI
assistant to Oak's curriculum data. A teacher using Cursor, Claude, or any
MCP-capable tool can search lessons, browse units, and get structured
curriculum information through natural language.

## Who it is for

- **Teachers** using AI assistants in their daily work
- **Edtech developers** building curriculum-aware applications
- **AI tool builders** creating MCP clients that connect to education data
- **Oak's product team** validating the curriculum-access model

## What value it delivers

- Teachers can access Oak's curriculum through any MCP-capable AI tool
  without needing an invitation.
- The HTTP MCP server is secured with authentication (Clerk), monitored
  (Sentry), and rate-limited — ready for real-world use.
- External developers have a live, stable API to build against.
- Oak learns from real usage patterns to inform future development.

## Progression gates

All must be true before M1 exit:

- [ ] Clerk authentication integrated and tested
- [ ] Sentry error monitoring live
- [ ] Rate limiting configured and enforced
- [ ] HTTP MCP server deployed as public alpha (no invitation required)
- [ ] Quality gates green (`pnpm qg`)
- [ ] No severity-1 or severity-2 snagging items open
- [ ] Release go/no-go review passed

## Current status

**Not started.** Blocked by M0 (repo must be public first). Planning
exists in [release-plan-m1.plan.md](../plans/release-plan-m1.plan.md).

Dependencies: M0 complete.
