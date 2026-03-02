# User Experience

Strategic planning for who the repository serves, what those users need from
public alpha, and how UX outcomes map to execution work in other collections.

**Collection Roadmap**: [roadmap.md](roadmap.md)  
**Public-Alpha Contract**: [public-alpha-experience-contract.md](public-alpha-experience-contract.md)

---

## Why This Collection Exists

Technical plans are increasingly mature, but user outcomes can still drift if
we do not maintain an explicit experience contract.

This collection closes that gap by defining:

1. Persona-specific outcomes
2. Public-alpha readiness signals
3. Cross-collection dependencies for delivery

---

## Documents

| File | Type | Description |
|------|------|-------------|
| `roadmap.md` | Roadmap | Strategic UX phase sequence and milestone alignment |
| `public-alpha-experience-contract.md` | Contract | Must-have user outcomes and no-go conditions for alpha |
| `educator-end-users/README.md` | Boundary brief | Teacher-focused goals, dependencies, and success signals |
| `engineering-end-users/README.md` | Boundary brief | SDK/MCP consumer goals for developers and Ed-Tech teams |
| `learner-end-users/README.md` | Boundary brief | Deferred learner scope, safeguards, and promotion triggers |

---

## Collection Boundary

This collection is authoritative for:

- User-segment intent and outcomes
- Experience-level readiness criteria
- Cross-segment prioritisation and trade-offs

This collection is not authoritative for:

- Search algorithm internals
- Security control implementation details
- Runtime infrastructure mechanics

Those remain in their technical collections and are referenced here.

---

## UX-Owned Concepts (Implemented Elsewhere)

This collection owns the user-outcome contract for concepts that are
implemented in technical collections:

1. Supported-client experience contract (host compatibility and graceful
   fallbacks)
2. Milestone 1 UI-surface decision gate (Claude basic branding before alpha vs
   post-alpha)
3. Educator journey outcomes for extension capabilities
   (misconceptions, vocabulary, progression, coverage)
4. Upstream API dependency risks that materially affect end-user experience

Technical plans keep implementation detail and sequencing.

---

## Milestone Alignment

- **Milestone 1 (Public Alpha)**: educator and engineering/Ed-Tech outcomes
  must be credible and measurable.
- **Milestone 2 (Post-Alpha)**: learner-facing scope discovery can promote from
  deferred status when safeguarding and moderation prerequisites are in place.

See [high-level-plan.md](../high-level-plan.md) for cross-collection context.

---

## Cross-Collection Dependencies

| Dependency | Why It Matters To UX |
|------------|----------------------|
| [semantic-search/roadmap.md](../semantic-search/roadmap.md) | Search quality and retrieval behaviour directly shape user trust |
| [sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md](../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md) | UI surface and host compatibility determine app usability |
| [semantic-search/future/08-experience-surfaces-and-extensions/README.md](../semantic-search/future/08-experience-surfaces-and-extensions/README.md) | Post-alpha experience capabilities and renderer sequencing |
| [security-and-privacy/roadmap.md](../security-and-privacy/roadmap.md) | Safety, evidence quality, and trust boundaries for end users |
| [architecture-and-infrastructure/README.md](../architecture-and-infrastructure/README.md) | Reliability, observability, and operational quality surface as UX |
| [developer-experience/sdk-publishing-and-versioning-plan.md](../developer-experience/sdk-publishing-and-versioning-plan.md) | Developer-facing clarity and upgrade safety affect adoption |
| [external/ooc-api-wishlist/index.md](../external/ooc-api-wishlist/index.md) | Upstream API/schema constraints that shape UX feasibility |

---

## Read Order

1. [public-alpha-experience-contract.md](public-alpha-experience-contract.md)
2. [roadmap.md](roadmap.md)
3. Persona boundary briefs in this order:
   - [educator-end-users/README.md](educator-end-users/README.md)
   - [engineering-end-users/README.md](engineering-end-users/README.md)
   - [learner-end-users/README.md](learner-end-users/README.md)
