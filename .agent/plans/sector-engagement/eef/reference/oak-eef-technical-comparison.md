# Oak vs EEF: Technical Stack Comparison

> **Status**: reference (artefact supporting [`../future/evidence-integration-strategy.md`](../future/evidence-integration-strategy.md))
> **Date**: 10 April 2026
> **Scope**: Technical comparison of the EEF Toolkit MCP server snapshot
> against Oak's HTTP MCP stack
>
> **Credits**: EEF Toolkit data from the Education Endowment Foundation.
> EEF MCP server prototype by John Roberts (JR)
> `<john.roberts@thenational.academy>`. See
> [`../future/evidence-integration-strategy.md`](../future/evidence-integration-strategy.md)
> for full attribution and author-addition requirements.

This document is a **technical reference** supporting the strategic plan
in [`../future/evidence-integration-strategy.md`](../future/evidence-integration-strategy.md).
It compares the two systems at the implementation level. For impact
requirements, integration levels, and strategic direction, see the
strategy document.

---

## Inspection Boundary

- **EEF**: the snapshot in `eef-data/` (server.py, data.py,
  eef-toolkit.json, pyproject.toml, README.md)
- **Oak**: `apps/oak-curriculum-mcp-streamable-http/` plus the shared
  SDK surface at `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts`
- **Exclusion**: the legacy stdio workspace (ADR-128 positions the HTTP
  workspace as the maintained product surface)

Three labels used throughout:

- **Snapshot truth**: what the checked-in EEF files actually show
- **README/package claim**: what EEF's README and pyproject.toml describe
- **Current Oak implementation**: what the Oak HTTP workspace implements

## Source Integrity

The EEF snapshot is a local capture, not a verified package root:

- `pyproject.toml` declares `src/eef_toolkit_mcp/` but that directory
  does not exist in the snapshot
- `data.py` looks for `data/eef-toolkit.json` (packaged path) but the
  file sits flat alongside `server.py`
- `__pycache__/` is present (local artefact)

Oak has no comparable integrity mismatch. The HTTP app, SDK, README, and
ADRs all align on the same maintained architecture.

## Primitive Surface

| Dimension | EEF | Oak |
|---|---|---|
| Tools | 7 (handwritten Python) | 34 (24 generated + 10 aggregated) |
| Resources | 4 (methodology, caveats, UK context, schema) | 7 (3 docs + 3 curriculum + 1 widget) |
| Prompts | 2 (lesson plan, PP review) | 4 |
| Contract | `json.dumps(...)` strings, prose-carried | Generated types, Zod validators, SDK-owned |
| Registration | Direct FastMCP decorators | SDK registry iteration via `listUniversalTools` |

## Architecture

| Dimension | EEF | Oak |
|---|---|---|
| Philosophy | Domain-first (evidence product) | Platform-first (thin app over shared SDK) |
| Codebase | 2 files (server.py + data.py) | Separated: SDK owns contracts, app owns transport |
| Data | In-memory singleton from JSON | Schema-derived, API-backed + ES search |
| Boundaries | Product logic and server wiring co-located | ADR-123 primitive split, ADR-128 HTTP consolidation |

## Runtime and Deployment

| Dimension | EEF | Oak |
|---|---|---|
| Transport | stdio (local desktop client) | Streamable HTTP (Vercel-deployed) |
| Lifecycle | Module-level singleton, process lifetime | Fresh McpServer + transport per request (stateless) |
| Data model | Single JSON, filesystem lookup | API calls + Elasticsearch Serverless |
| Auth | None | Clerk OAuth (PKCE), host validation, method-aware routing |
| Observability | None | Sentry, request-scoped logging, observability spans |
| MCP Apps | None | Widget resource as `text/html;profile=mcp-app` |

## Testing

| Dimension | EEF | Oak |
|---|---|---|
| Test suite | None visible | Unit, integration, E2E, smoke, a11y, widget |
| Auth testing | N/A | Two-tier: manual Clerk + automated mocks |
| Deployment verification | None | Smoke tests documented |
| Operational practice | README only | TESTING.md + README + operational discipline |

## Recommendation Engine (EEF-Specific)

The `recommend_for_context` tool implements a composite scoring engine:

```text
Score = (impact/8 × 4.0)           # 40% impact, normalised 0-10
      + (evidence/5 × 3.0)         # 30% evidence strength
      + ((6-cost)/5 × 2.0)         # 20% cost-effectiveness (inverted)
      + context_relevance           # 10% accumulated:
                                    #   phase match: +0.4
                                    #   focus match: +0.4
                                    #   PP: very_high=+0.2, high=+0.15, moderate=+0.1
```

Exclusion rules:

- Strands with null or zero impact are excluded
- Strands exceeding `max_cost_rating` are excluded
- Strands below `min_evidence_strength` are excluded

Each recommendation includes: score, rationale (human-readable),
implementation pointers, CPD intensity, staffing needs, time to embed,
and a per-recommendation caveat.

## EEF Data Model

```text
Toolkit
├── meta                  # Provenance, versioning, licence, 9 caveats
├── methodology           # Effect size → months conversion, scales
├── uk_context            # PP rates, national averages, KS mapping
├── school_context_schema # Input schema for recommendations
└── strands[30]           # Evidence strands
    ├── headline          # impact_months, cost_rating (1-5),
    │                     # evidence_strength_rating (0-5)
    ├── definition        # short + full
    ├── key_findings[]
    ├── effectiveness     # summary + mechanisms
    ├── behind_the_average # by_phase, by_subject, moderating_factors
    ├── closing_the_disadvantage_gap
    ├── implementation    # considerations, pitfalls, digital tech
    ├── school_context_relevance  # 17/30 strands:
    │   ├── most_relevant_phases/key_stages/priorities
    │   ├── pp_relevance + note
    │   └── implementation_requirements
    │       ├── cpd_intensity, additional_staff_needed
    │       ├── resource_cost, time_to_embed
    │       └── key_staff[]
    ├── related_strands[]
    ├── related_guidance_reports[]
    └── tags[]
```

### Data coverage

| Aspect | Coverage |
|---|---|
| Strand summaries | 30/30 |
| School context relevance | 17/30 |
| Behind-the-average detail | 6/30 |
| Implementation blocks | 4/30 |
| Related guidance reports | 7/30 |
| Study-level EPPI data | 0/30 |

## EEF Prompts (Pedagogical Workflows)

### evidence_grounded_lesson_plan(subject, key_stage, topic)

Orchestrates: recommend_for_context → select top 2-3 → get
implementation_guidance for each → design lesson plan integrating
approaches → include evidence summary + caveat per approach →
structure as starter / main / practice / plenary (metacognitive
reflection).

Phase mapping: EYFS→early_years, KS1/KS2→primary, KS3/KS4/KS5→secondary.

### pupil_premium_strategy_review(current_approaches, phase)

Orchestrates: get_strand for each current approach → recommend_for_context
with disadvantage gap focus → compare_strands current vs recommended →
assess implementation quality fit.

## What EEF Does That Oak Could Adopt

1. **Caveat-first output**: every metric travels with evidence strength
   and population-average caveat
2. **Transparent scoring**: exposed methodology, not a black box
3. **Domain-opinionated aggregated tools**: `recommend_for_context`
   encodes product judgement transparently
4. **Methodology as product surface**: methodology and caveats as
   first-class resources, not footnotes
5. **Workflow prompts**: pedagogical workflow orchestration, not just
   raw tool access
6. **Implementation framework**: Explore → Prepare → Deliver → Sustain
   as a structured reference

## What EEF Would Need for Oak-Stack Maturity

1. Type safety (generated from schema, not `json.dumps` strings)
2. Testing surface (unit tests for scoring, integration for pipelines)
3. HTTP transport, stateless per-request lifecycle
4. Auth and observability (Clerk, Sentry, request logging)
5. Data pipeline (automated refresh, validation, versioning)
6. Self-consistent packaging (align layout with pyproject.toml)

## Evidence Map

| Section | Sources |
|---|---|
| Source integrity | pyproject.toml, data.py, README.md, directory contents |
| Primitive surface | server.py, handlers.ts, register-resources.ts, register-prompts.ts, mcp-tools.ts, ADR-123 |
| Architecture | server.py, data.py, application.ts, handlers.ts, mcp-tools.ts, ADR-128 |
| Runtime | server.py, data.py, README.md, index.ts, runtime-config.ts, application.ts, register-widget-resource.ts |
| Auth/observability | auth-routes.ts, mcp-router.ts, mcp-handler.ts, Oak README |
| Testing | EEF README, TESTING.md, Oak README |
| Scoring engine | data.py lines 142-220 |
