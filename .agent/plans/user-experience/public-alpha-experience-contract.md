# Public Alpha Experience Contract

**Status**: Draft for immediate adoption  
**Applies To**: Milestone 1 public-alpha readiness

---

## Scope

### In Scope for Public Alpha

1. Educator end users
2. Engineering and Ed-Tech end users

### Explicitly Deferred in Public Alpha

1. Learner-facing direct experience, pending safeguarding and moderation work

---

## Public-Alpha UX Baseline (Current Expectation)

Public alpha UX is intentionally minimal. The expected baseline is:

1. The SDK works.
2. Search works.
3. The MCP server works.
4. In ChatGPT, key commands show very basic branding.

For alpha readiness, these four baseline conditions should all be true.

---

## Experience Promises

### Educator Promise

Teachers can ask for curriculum help in supported AI clients and receive useful,
auditable, and context-appropriate responses without wrestling with tooling
internals.

### Engineering and Ed-Tech Promise

Developers can integrate with stable SDK/MCP contracts, understand failure
modes, and debug behaviour without reverse-engineering the system.

---

## Supported-Client Contract (Authoritative UX Outcome)

Public alpha may have different UI affordances per host client, but the
experience outcome contract must hold across supported clients.

1. Core journeys (search, browse, explore, fetch) are available in each
   supported client.
2. Where rich widget rendering is unavailable, a usable text-first fallback
   still provides clear and auditable outcomes.
3. Query interpretation and result policy are behaviourally consistent across
   hosts.
4. Error language remains recoverable and non-technical for end users.
5. Core behaviour remains MCP-first and host-neutral; host-specific enhancements
   are additive.

---

## Milestone 1 UI-Surface Decision Gate (Option X / Option Y)

This collection owns the user-outcome decision criteria; technical collections
own implementation detail.

Decision options:

1. **Option X**: support MCP Apps extension sufficiently to show basic branding
   in Claude before public alpha.
2. **Option Y**: launch public alpha with ChatGPT basic branding only, then add
   Claude branding support post-alpha.

Required evidence for decision:

1. Host compatibility, metadata portability, and security boundary analysis
   from
   [../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md](../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md)
2. Widget reactivation prerequisites and sequencing from
   [../semantic-search/future/08-experience-surfaces-and-extensions/widget-renderer-reactivation.md](../semantic-search/future/08-experience-surfaces-and-extensions/widget-renderer-reactivation.md)
3. Milestone sequencing and risk trade-offs from
   [../high-level-plan.md](../high-level-plan.md)

Decision output requirement:

- One explicit selected option with rationale, expected user impact, and
  rollback posture captured before Milestone 1 execution starts.

---

## Remaining Non-UX Blockers

The remaining non-UX blockers for public alpha are:

1. Switch Clerk to a production instance.
2. Verify that basic logging is working in Sentry.

Primary tracking references:

- [../../research/auth/clerk-production-migration.md](../../research/auth/clerk-production-migration.md)
- [../architecture-and-infrastructure/observability-and-quality-metrics.plan.md](../architecture-and-infrastructure/observability-and-quality-metrics.plan.md)

---

## Public-Alpha No-Go Conditions

Do not represent alpha as ready if any of the following are true:

1. Core educator journeys fail unpredictably in supported clients.
2. Error states are opaque or unactionable for users.
3. Search behaviour cannot be explained at a policy level.
4. Security/safety claims are not supported by evidence.
5. SDK/MCP integration contracts drift across transports or surfaces.
6. Supported clients cannot provide either rich rendering or a documented usable
   fallback for core journeys.
7. Clerk production migration is incomplete.
8. Basic Sentry logging is not working.

---

## Success Signals (Initial)

### Educator Signals

1. Search/browse/explore journeys complete with understandable outcomes.
2. User-visible errors are recoverable and written for non-technical users.
3. Relevance quality reaches baseline targets defined by semantic-search plans.
4. Cross-client experience is consistent at the behaviour level, even where UI
   affordances differ.

### Engineering and Ed-Tech Signals

1. API and tool contracts are documented and versioned.
2. Explainability and logging support practical debugging.
3. Integration examples and smoke-test paths are reproducible.
4. Compatibility expectations across supported host clients are explicit and
   testable.

---

## Evidence Expectations

All non-trivial claims in alpha readiness updates should reference:

1. Supporting plan or ADR
2. Deterministic validation command or benchmark
3. Latest measured result (with date)

Primary evidence sources:

- [../semantic-search/roadmap.md](../semantic-search/roadmap.md)
- [../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md](../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md)
- [../semantic-search/future/08-experience-surfaces-and-extensions/README.md](../semantic-search/future/08-experience-surfaces-and-extensions/README.md)
- [../security-and-privacy/roadmap.md](../security-and-privacy/roadmap.md)
- [../architecture-and-infrastructure/README.md](../architecture-and-infrastructure/README.md)
- [../external/ooc-api-wishlist/index.md](../external/ooc-api-wishlist/index.md)

---

## Upstream Dependency Risks (UX Impact)

These remain owned in `external/`, but are UX-significant constraints.

| Upstream Dependency Risk | UX Impact | Source |
|--------------------------|-----------|--------|
| Canonical URL pattern mismatch | Teacher-facing links break in AI outputs, reducing trust | [../external/ooc-api-wishlist/06-response-metadata-and-caching.md](../external/ooc-api-wishlist/06-response-metadata-and-caching.md) |
| Missing programme/tier metadata | GCSE pathway and exam-board journeys are hard to disambiguate | [../external/ooc-api-wishlist/18-programmes-and-identifiers-examples.md](../external/ooc-api-wishlist/18-programmes-and-identifiers-examples.md) |
| Transcript availability inconsistency | Accessibility and search result expectations become unreliable | [../external/ooc-api-wishlist/11-assets-and-transcripts-examples.md](../external/ooc-api-wishlist/11-assets-and-transcripts-examples.md) |

---

## Dependency Trace

| User Promise Area | Primary Plan Dependencies |
|-------------------|---------------------------|
| Relevance and retrieval quality | [../semantic-search/roadmap.md](../semantic-search/roadmap.md) |
| UI host/surface behaviour | [../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md](../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md) |
| Safety and trust boundaries | [../security-and-privacy/roadmap.md](../security-and-privacy/roadmap.md) |
| Runtime reliability | [../architecture-and-infrastructure/README.md](../architecture-and-infrastructure/README.md) |
| Integration ergonomics | [../developer-experience/sdk-publishing-and-versioning-plan.md](../developer-experience/sdk-publishing-and-versioning-plan.md) |
