# Milestone 2: Open Public Alpha

## Why this milestone matters

The invite-only alpha proved the tools work with real users in a controlled
setting. Now the focus shifts to search reliability, a unified MCP Apps
infrastructure, initial knowledge graph alignment, and a real Sentry +
OpenTelemetry observability foundation for the canonical runtimes. Production
authentication is deferred to M3; the dev Clerk instance remains in place.

## Who it is for

- **Oak staff and invited users** who get accurate, up-to-date search results
  and a single MCP server serving all platforms
- **Edtech developers** building curriculum tools on Oak's open data
- **AI tool builders** integrating Oak's curriculum as a data source

## What value it delivers

- Reliable search: Elasticsearch re-indexed with fresh bulk data, stale
  index issues cleared, search quality validated against ground truths.
- Unified MCP Apps infrastructure with basic branding (logo, colours,
  metadata visible in Claude Desktop / ChatGPT tool listings), replacing
  the current OpenAI-specific app.
- Supportable public-alpha operations: the HTTP MCP server and Search CLI have
  shared Sentry + OTel foundations, structured log forwarding, handled-error
  capture, release/source-map evidence, and deny-by-default MCP telemetry
  capture.
- Initial knowledge graph alignment: the first graph-enablement slice
  determines whether the next step is Neo4j provisioning, Elasticsearch
  projection, or explanation-first graph augmentation.
- Graph-augmented curriculum navigation begins to surface.

## Progression gates

All must be true before M2 exit:

- [ ] Elasticsearch re-indexed with current bulk data
- [ ] `strict_dynamic_mapping_exception` on `previous_version` resolved
- [ ] Search quality validated (MRR regression checks against ground truths)
- [ ] OpenAI app replaced with MCP Apps infrastructure
- [ ] Basic branding applied to MCP App (logo, colours, metadata)
- [ ] Knowledge graph alignment audit complete
- [ ] Sentry + OTel foundation deployed and verified for the HTTP MCP server
  and Search CLI
- [ ] Release/source-map evidence captured for the deployed observability
  foundation
- [ ] Quality gates green (`pnpm qg`)
- [ ] No severity-1 or severity-2 snagging items open

## Current status

**Next.** Elasticsearch re-indexing is in progress (recovery-and-guardrails is
the primary incident lane, with cli-robustness retained as supporting evidence).
MCP Apps migration execution plan exists. KG alignment audit is active. The
Sentry + OTel foundation is now also an explicit M2 gate via the architecture
and infrastructure plan set.

Dependencies: M1 complete.
