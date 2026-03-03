# Milestone 3: Public Beta

## Why this milestone matters

The open public alpha proved the service works at scale with real users.
Public beta raises the quality bar: operational hardening, observability,
extension surfaces, and accumulated tech debt are addressed so the service
is reliable enough for sustained daily use. These improvements compound —
architectural enforcement prevents regression, observability enables rapid
diagnosis, and mutation testing ensures the test suite catches real bugs.

## Who it is for

- **Teachers** who depend on AI curriculum tools daily — reliability
  improvements mean fewer disruptions
- **Oak's engineering team** maintaining and extending the codebase
- **Edtech developers** building on a more stable, better-documented
  platform
- **Oak's operations team** managing a live service with proper
  observability

## What value it delivers

- Full operational security controls: monitoring, alerting, incident
  response procedures, and canonical host enforcement.
- Sentry observability gives clear visibility into production behaviour.
- Extension surfaces (MCP-app extension for Claude and other MCP-native
  hosts, OpenAPI app extension alongside) broaden platform reach.
- Architectural enforcement (ESLint boundary rules, dependency-cruiser,
  knip) prevents regression as the codebase grows.
- Mutation testing validates that the test suite catches real bugs.
- Security hardening progression (hallucination guards, evidence-based
  claims) raises the trust floor.
- Developer experience improvements (TSDoc overhaul, SDK publishing,
  ESLint override removal) reduce friction for contributors.

## Progression gates

All must be true before M3 exit:

- [ ] Monitoring and alerting configured (sign-up velocity, abuse patterns,
  Clerk API quota usage)
- [ ] Canonical host enforcement verified on Vercel
- [ ] Incident response procedures documented
- [ ] Sentry observability configured and verified
- [ ] MCP-app extension implemented and working in MCP-native hosts
- [ ] OpenAPI app extension maintained alongside MCP-app extension
- [ ] Architectural enforcement strengthened (boundary checks, dead code
  detection)
- [ ] Mutation testing integrated and passing
- [ ] Vercel log drain configured and verified
- [ ] Quality gates green (`pnpm qg`)
- [ ] No severity-1 snagging items open

## Current status

**Planned.** Detailed plans exist across multiple collections:

- Extension surfaces:
  [mcp-extensions-research-and-planning.md](../plans/sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md)
- Agentic engineering:
  [agentic-engineering-enhancements/](../plans/agentic-engineering-enhancements/)
- Architecture and infrastructure:
  [architecture-and-infrastructure/](../plans/architecture-and-infrastructure/)
- Security and privacy:
  [security-and-privacy/](../plans/security-and-privacy/)
- Developer experience:
  [developer-experience/](../plans/developer-experience/)

Dependencies: M2 complete.
