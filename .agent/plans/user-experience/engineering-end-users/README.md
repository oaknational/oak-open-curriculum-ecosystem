# Engineering and Ed-Tech End Users

## Engineering End Users

Internal and external engineers integrating with Oak SDKs, MCP servers, and
supporting tooling.

## Ed-Tech Product End Users

Product teams using the curriculum SDK and MCP interfaces to explore Oak
curriculum data and build user-facing experiences on top of it.

---

## Public-Alpha Scope

Engineering and Ed-Tech experience is in-scope for Milestone 1 public alpha.

Primary focus:

1. Stable and understandable SDK/MCP contracts
2. Diagnosable runtime behaviour and predictable errors
3. Reproducible integration and smoke-test paths

---

## Key Dependencies

| Dependency | Why It Matters To Engineering Users |
|------------|-------------------------------------|
| [../../semantic-search/active/sdk-workspace-separation.md](../../semantic-search/active/sdk-workspace-separation.md) | Defines SDK decomposition and ownership boundaries |
| [../../semantic-search/roadmap.md](../../semantic-search/roadmap.md) | Establishes search capability sequencing and contract changes |
| [../../architecture-and-infrastructure/README.md](../../architecture-and-infrastructure/README.md) | Reliability and infrastructure consistency across servers |
| [../../developer-experience/sdk-publishing-and-versioning-plan.md](../../developer-experience/sdk-publishing-and-versioning-plan.md) | Versioning and adoption ergonomics for consumers |
| [../public-alpha-experience-contract.md](../public-alpha-experience-contract.md) | Shared alpha promise and no-go criteria |

---

## Success Signals

1. Engineers can understand contract behaviour without reading implementation internals
2. Common failures are diagnosable from logs/explain metadata
3. Upgrade paths between alpha versions are clear and low-risk
