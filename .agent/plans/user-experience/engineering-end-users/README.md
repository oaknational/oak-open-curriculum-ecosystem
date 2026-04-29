# Engineering and Ed-Tech End Users

## Engineering End Users

Internal and external engineers integrating with Oak SDKs, MCP servers, and
supporting tooling.

**Current Executable Plans**: [current/README.md](current/README.md)

## Ed-Tech Product End Users

Product teams using the curriculum SDK and MCP interfaces to explore Oak
curriculum data and build user-facing experiences on top of it.

---

## Public-Alpha Scope

Engineering and Ed-Tech experience is in-scope for Milestone 2 open public
alpha.

Primary focus:

1. Stable and understandable SDK/MCP contracts
2. Diagnosable runtime behaviour and predictable errors
3. Reproducible integration and smoke-test paths

---

## Supported-Client Compatibility Contract Inputs

Engineering and Ed-Tech users rely on a clear host-compatibility contract:

1. Core tool behaviour is MCP-first and host-neutral.
2. Host-specific metadata and UI affordances are additive, not required for
   baseline usability.
3. Where rich rendering differs by host, fallback behaviour is explicit and
   testable.
4. Failure semantics and diagnostics remain predictable across transports and
   clients.

---

## Key Dependencies

| Dependency | Why It Matters To Engineering Users |
|------------|-------------------------------------|
| [../../semantic-search/archive/completed/sdk-workspace-separation.md](../../semantic-search/archive/completed/sdk-workspace-separation.md) | SDK decomposition and ownership boundaries (archived) |
| [../../semantic-search/roadmap.md](../../semantic-search/roadmap.md) | Establishes search capability sequencing and contract changes |
| [../../sdk-and-mcp-enhancements/roadmap.md](../../sdk-and-mcp-enhancements/roadmap.md) | Host compatibility and metadata portability research |
| [../../semantic-search/future/08-experience-surfaces-and-extensions/widget-renderer-reactivation.md](../../semantic-search/future/08-experience-surfaces-and-extensions/widget-renderer-reactivation.md) | Renderer/fallback sequencing for user-facing behaviour |
| [../../architecture-and-infrastructure/README.md](../../architecture-and-infrastructure/README.md) | Reliability and infrastructure consistency across servers |
| [../../developer-experience/future/sdk-publishing-and-versioning-plan.md](../../developer-experience/future/sdk-publishing-and-versioning-plan.md) | Versioning and adoption ergonomics for consumers |
| [../../sector-engagement/ooc-api-wishlist/index.md](../../sector-engagement/ooc-api-wishlist/index.md) | Upstream schema/API assumptions that affect integration UX |
| [../public-alpha-experience-contract.md](../public-alpha-experience-contract.md) | Shared alpha promise and no-go criteria |

---

## Milestone 2 UI-Surface Gate Responsibilities

For Option X vs Option Y decisioning, engineering-facing evidence should include:

1. Host compatibility matrix confidence and known gaps.
2. Implementation risk and rollback posture for each option.
3. Minimum acceptance checks for compatibility and fallback semantics.

---

## Success Signals

1. Engineers can understand contract behaviour without reading implementation internals
2. Common failures are diagnosable from logs/explain metadata
3. Upgrade paths between alpha versions are clear and low-risk
4. Supported-client compatibility expectations are documented and verifiable

---

## Current Execution Focus

| Priority | Plan | Why It Matters |
|------------|------|----------------|
| P0 | [current/search-sdk-github-release-asset-distribution.execution.plan.md](current/search-sdk-github-release-asset-distribution.execution.plan.md) | Enables external API consumers to use a self-contained Search SDK bundle via semantic-release GitHub assets |

---

## Upstream Dependency Risks (Engineering/Ed-Tech Impact)

| Risk | Engineering/Ed-Tech Impact | Source |
|------|----------------------------|--------|
| Canonical URL pattern drift | Integrations emit broken links and degrade trust in generated outputs | [../../sector-engagement/ooc-api-wishlist/06-response-metadata-and-caching.md](../../sector-engagement/ooc-api-wishlist/06-response-metadata-and-caching.md) |
| Missing programme/tier metadata | Product workflows cannot reliably disambiguate GCSE pathways | [../../sector-engagement/ooc-api-wishlist/18-programmes-and-identifiers-examples.md](../../sector-engagement/ooc-api-wishlist/18-programmes-and-identifiers-examples.md) |
| Incomplete error/transcript signalling | Consumers cannot implement reliable fallback/error UX | [../../sector-engagement/ooc-api-wishlist/11-assets-and-transcripts-examples.md](../../sector-engagement/ooc-api-wishlist/11-assets-and-transcripts-examples.md) |
