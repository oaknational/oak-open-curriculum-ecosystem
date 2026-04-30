---
name: "External Knowledge Graph Data-Source Integration"
overview: "Define the intake model for third-party knowledge graphs and structured education knowledge sources that Oak may consume as application data."
status: future
related_plans:
  - "evidence-integration-strategy.md"
specialist_reviewer: "architecture-reviewer-betty, security-reviewer, docs-adr-reviewer"
---

# External Knowledge Graph Data-Source Integration

**Status**: Strategic brief — not yet executable
**Lane**: `future/`
**Collection**: `sector-engagement/external-knowledge-sources/`
**Last updated**: 2026-04-29

## Problem and Intent

Oak already has external-source candidates: EEF evidence, education skills,
and partner/sector datasets such as OEAI's MAT analytics schema. Future
candidates may be formal knowledge graphs rather than plain JSON or API
surfaces.

The intent is to define a common intake model before each source invents its
own provenance, validation, licensing, update, and application-boundary rules.

## Domain Boundaries and Non-Goals

In scope:

- third-party knowledge graphs and structured education knowledge sources used
  as Oak application data;
- source provenance, validation, update cadence, licensing, application fit,
  and fallback/removal rules;
- deciding which implementation collection should own a promoted source.

Explicit non-goals:

- deciding how external organisations use Oak's own KG assets;
- replacing the internal Oak KG integration collection;
- committing to production ingestion for any source named in this brief;
- treating all structured data as a graph just because it has relationships.

## Dependencies and Sequencing Assumptions

1. Each candidate source needs a named application before implementation:
   teacher-facing MCP surface, search enrichment, analytics comparison,
   curriculum mapping, QA, or partner support.
2. External source intake must not bypass schema-first validation or provenance
   clarity.

## Success Signals

Promotion is justified when a candidate source has:

1. a pinned source version or reproducible retrieval method;
2. a clear licence and attribution model;
3. a named Oak application or partner-support outcome;
4. validation rules and failure behaviour;
5. an implementation owner outside this strategic sector thread.

## Risks and Unknowns

| Risk | Severity | Mitigation |
|---|---|---|
| External graph semantics are treated as Oak-endorsed truth | High | Preserve source attribution and make synthesis boundaries explicit |
| Validation is weaker than Oak's generated schema contracts | High | Require source-specific validation before any runtime surface |
| Application need is vague, causing data accumulation | Medium | Do not promote without a named application and consumer |
| Licensing or safeguarding constraints appear late | High | Make licence/governance triage a preflight gate |

## Promotion Trigger Into `current/`

Promote when Oak selects a specific external knowledge source and can name the
application it will serve, the owning implementation collection, and the
minimum validation/provenance gates.

## Reference-Context Rule

This strategic brief defines an intake model. Source-specific implementation
decisions are made only in a promoted executable plan.
