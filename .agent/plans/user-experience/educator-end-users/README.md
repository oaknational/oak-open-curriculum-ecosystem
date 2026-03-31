# Educator End Users

Teachers and curriculum practitioners using Oak through AI clients (for example:
ChatGPT, Claude, Gemini).

---

## Public-Alpha Scope

Educator experience is in-scope for Milestone 2 open public alpha.

This includes:

1. Search, browse, and explore journeys that produce useful curriculum results
2. Clear user-facing error handling and recovery guidance
3. Experience consistency across supported host clients

---

## Core User Jobs

1. Find relevant lessons/resources quickly
2. Explore unfamiliar topics and adjacent curriculum pathways
3. Adapt material for planning without digging through low-level metadata

---

## Future Journey Candidates (Post-Alpha, Concept-Preserved)

These concepts are preserved from technical research/plans and belong to this
persona as user outcomes:

1. Misconception-aware guidance journeys ("what mistakes should I watch for?")
2. Vocabulary and concept-relationship exploration journeys
3. Progression and prerequisite pathway journeys across years/key stages
4. Coverage journeys ("does this cover the relevant curriculum expectations?")

Implementation sequencing remains in semantic-search and SDK/MCP plans.

---

## Supported-Client Expectations (Alpha)

1. Educator outcomes remain usable across supported host clients.
2. Rich rendering is preferred but not required where clear text-first fallback
   is available.
3. Error recovery and explainability remain understandable to non-technical
   users regardless of host.

---

## Key Dependencies

| Dependency | Why It Matters To Educators |
|------------|-----------------------------|
| [../../semantic-search/roadmap.md](../../semantic-search/roadmap.md) | Relevance quality and explainability of results |
| [../../semantic-search/future/08-experience-surfaces-and-extensions/advanced-features.md](../../semantic-search/future/08-experience-surfaces-and-extensions/advanced-features.md) | Defines extension-capability journeys that map to educator outcomes |
| [../../sdk-and-mcp-enhancements/roadmap.md](../../sdk-and-mcp-enhancements/roadmap.md) | App surface/host compatibility for user-facing UI |
| [../../security-and-privacy/roadmap.md](../../security-and-privacy/roadmap.md) | Safety and trust signals in educational usage contexts |
| [../../external/ooc-api-wishlist/index.md](../../external/ooc-api-wishlist/index.md) | Upstream API constraints that can block or degrade educator journeys |
| [../public-alpha-experience-contract.md](../public-alpha-experience-contract.md) | Shared alpha promise and no-go criteria |

---

## Success Signals

1. Educator-facing journeys are stable and understandable
2. Top-priority search tasks complete without expert intervention
3. User-visible failure modes are actionable and non-technical
4. Behaviour-level journey consistency is preserved across supported clients

---

## Upstream Dependency Risks (Educator Impact)

| Risk | Educator Impact | Source |
|------|-----------------|--------|
| Broken canonical URL patterns | Teachers lose trust when generated lesson links fail | [../../external/ooc-api-wishlist/06-response-metadata-and-caching.md](../../external/ooc-api-wishlist/06-response-metadata-and-caching.md) |
| Missing programme/tier context | GCSE-level discovery and comparison journeys are ambiguous | [../../external/ooc-api-wishlist/18-programmes-and-identifiers-examples.md](../../external/ooc-api-wishlist/18-programmes-and-identifiers-examples.md) |
| Incomplete transcript signalling | Accessibility and explanation journeys become inconsistent | [../../external/ooc-api-wishlist/11-assets-and-transcripts-examples.md](../../external/ooc-api-wishlist/11-assets-and-transcripts-examples.md) |

---

## Out of Scope (Alpha)

1. Learner-direct product flows
2. Full pedagogical personalisation and moderation-heavy experiences
