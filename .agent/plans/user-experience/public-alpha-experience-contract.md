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

## Experience Promises

### Educator Promise

Teachers can ask for curriculum help in supported AI clients and receive useful,
auditable, and context-appropriate responses without wrestling with tooling
internals.

### Engineering and Ed-Tech Promise

Developers can integrate with stable SDK/MCP contracts, understand failure
modes, and debug behaviour without reverse-engineering the system.

---

## Public-Alpha No-Go Conditions

Do not represent alpha as ready if any of the following are true:

1. Core educator journeys fail unpredictably in supported clients.
2. Error states are opaque or unactionable for users.
3. Search behaviour cannot be explained at a policy level.
4. Security/safety claims are not supported by evidence.
5. SDK/MCP integration contracts drift across transports or surfaces.

---

## Success Signals (Initial)

### Educator Signals

1. Search/browse/explore journeys complete with understandable outcomes.
2. User-visible errors are recoverable and written for non-technical users.
3. Relevance quality reaches baseline targets defined by semantic-search plans.

### Engineering and Ed-Tech Signals

1. API and tool contracts are documented and versioned.
2. Explainability and logging support practical debugging.
3. Integration examples and smoke-test paths are reproducible.

---

## Evidence Expectations

All non-trivial claims in alpha readiness updates should reference:

1. Supporting plan or ADR
2. Deterministic validation command or benchmark
3. Latest measured result (with date)

Primary evidence sources:

- [../semantic-search/roadmap.md](../semantic-search/roadmap.md)
- [../security-and-privacy/roadmap.md](../security-and-privacy/roadmap.md)
- [../architecture-and-infrastructure/README.md](../architecture-and-infrastructure/README.md)

---

## Dependency Trace

| User Promise Area | Primary Plan Dependencies |
|-------------------|---------------------------|
| Relevance and retrieval quality | [../semantic-search/roadmap.md](../semantic-search/roadmap.md) |
| UI host/surface behaviour | [../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md](../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md) |
| Safety and trust boundaries | [../security-and-privacy/roadmap.md](../security-and-privacy/roadmap.md) |
| Runtime reliability | [../architecture-and-infrastructure/README.md](../architecture-and-infrastructure/README.md) |
| Integration ergonomics | [../developer-experience/sdk-publishing-and-versioning-plan.md](../developer-experience/sdk-publishing-and-versioning-plan.md) |
