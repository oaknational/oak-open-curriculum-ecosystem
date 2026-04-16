---
name: "Teacher Memory Store Architecture Comparison (Solid vs User-Keyed Private Store)"
overview: "Strategic plan to evaluate whether Oak should use Solid Pods or a more typical user-keyed private data store for long-term teacher preferences and memory."
todos:
  - id: define-memory-domain-and-data-classes
    content: "Define the exact memory domain (preferences, interaction history, generated artefacts) and classify data sensitivity and retention classes."
    status: pending
  - id: produce-option-comparison-pack
    content: "Produce a side-by-side comparison pack for Solid and user-keyed private store options, including threat model, consent model, portability, and operational cost."
    status: pending
  - id: run-spike-and-decision-pre-read
    content: "Run implementation spikes for the top candidate options and capture evidence in a decision pre-read."
    status: pending
  - id: prepare-promotion-to-current
    content: "Define executable tranche scope, acceptance checks, and deterministic promotion criteria for a current-lane implementation plan."
    status: pending
---

# Teacher Memory Store Architecture Comparison (Solid vs User-Keyed Private Store)

**Last Updated**: 2026-04-16
**Status**: Strategic brief — not yet executable
**Lane**: `future/`

## Problem and Intent

Oak needs a durable store for long-term teacher preferences and memory-like
state (for example interaction records, preference profiles, and reusable
artefacts). A cleaned research artefact is now available at:

- `.agent/research/solid-distributed-filesystem/Solid as a Teacher-Controlled Data Layer for Oak MCP Interaction Records-clean.md`

That report indicates Solid is promising for teacher-controlled data but also
surfaces known constraints (for example copied-data irreversibility,
provider-dependent at-rest controls, and current ecosystem maturity concerns).
The strategic intent of this plan is to determine whether Solid is the right
primary architecture, or whether Oak should prefer a more typical user-keyed
private store pattern.

This plan is a decision-shaping brief. It does not commit implementation.

The core product context is lesson-planning support via MCP. The memory layer
is valuable only if it helps teachers across different planning horizons:

- **Short-term memory**: immediate lesson/session intent and next actions.
- **Medium-term memory**: current unit priorities, upcoming activities, and
  near-term adaptation patterns.
- **Long-term memory**: stable preferences, recurring constraints, and
  longitudinal planning patterns.

Across all horizons, the primary safety requirement is unchanged: the teacher
must retain effective control of memory data at all times (who can access it,
for what purpose, and how access is revoked).

## Domain Boundaries and Non-Goals

### In scope

1. Storage architecture for teacher preference and memory data.
2. Memory-horizon model for teacher support (short/medium/long) and how each
   horizon maps to data classes and retention expectations.
3. Comparative analysis of:
   - Solid-based pod model (teacher-controlled external store)
   - User-keyed private store model (Oak-managed or Oak-selected datastore,
     user-scoped by cryptographic key and policy controls)
4. Security/privacy model, consent/revocation semantics, and data portability.
5. Operational and product implications for MCP-hosted interaction workflows.

### Explicit non-goals

1. No production implementation in this future plan.
2. No final ADR acceptance in this future plan.
3. No expansion into learner-facing data strategy.
4. No broad personalisation programme design beyond memory-store architecture.

## Candidate Architecture Comparison Surface

The comparison must evaluate both options against the same criteria:

1. **Control semantics**
   - What “teacher control” means at write time, read time, and revocation time.
   - How that control remains effective over short-, medium-, and long-term
     memory use cases.
2. **Security and privacy**
   - AuthN/AuthZ model, token/key replay posture, data minimisation support,
     at-rest guarantees, and auditability.
3. **Portability and lock-in**
   - Ability for teachers to migrate, export, and reuse memory data across tools.
4. **Reliability and latency**
   - Write availability, offline behaviour, conflict handling, and retry safety.
5. **Operational complexity**
   - Runtime dependencies, provider compatibility burden, support overhead, and
     incident surface.
6. **Developer and integration ergonomics**
   - Complexity of integrating with Oak MCP surfaces and host applications.
   - Ability to persist/use teacher priorities and activities across planning
     horizons without coupling business logic to one storage vendor.
7. **Compliance posture**
   - Fit with privacy-by-design and evidence-bearing data governance.
8. **Cost and scalability**
   - Expected unit economics, growth constraints, and long-term maintenance cost.
9. **Teacher value unlock**
   - Evidence that stored memory materially improves lesson planning outcomes
     and reduces repeated setup friction for teachers.

## Dependencies and Sequencing Assumptions

1. Product owner alignment on what counts as “memory” vs “operational logs”.
2. Product owner alignment on memory horizons (short/medium/long) and the
   minimum viable data needed per horizon.
3. Data-classification agreement (sensitivity tiers, retention classes,
   redaction defaults).
4. Security/privacy review participation from the security-and-privacy
   collection before promotion.
5. Decision traceability via a dedicated ADR when promotion criteria are met.
6. Final implementation details are confirmed only after promotion into
   `current/` and decomposition into executable phases.

## Success Signals (Promotion Readiness)

Promotion from `future/` to `current/` is justified only when:

1. The comparison pack provides evidence-backed scoring for both options across
   all comparison dimensions.
2. Unknowns have explicit closure paths (prototype, measurement, or accepted
   deferral with owner/date).
3. A preferred architecture is stated with rationale and bounded trade-offs.
4. The recommendation explicitly demonstrates how teacher control is maintained
   across short/medium/long horizons, including revocation and portability.
5. A draft ADR exists with unresolved questions clearly enumerated.
6. A first executable `current/` implementation plan is derivable with
   deterministic validation commands and acceptance criteria.

These success signals define the evidence bar; the promotion trigger below is
the explicit governance gate for creating the executable plan.

## Risks and Unknowns

| Risk / Unknown | Impact | Mitigation direction |
|---|---|---|
| Overstating “teacher control” semantics for either option | High trust/regulatory risk | Define explicit control guarantees and non-guarantees in product language before implementation |
| Solid provider variability and ecosystem maturity | Delivery and support risk | Include provider compatibility matrix and minimum provider capability contract |
| User-keyed store may centralise trust in Oak operations | Governance and liability risk | Require key management, access logging, and least-privilege controls as hard constraints |
| Ambiguous memory domain boundaries | Architecture churn and scope drift | Lock memory taxonomy and retention policy before scoring options |
| Integration complexity with MCP host patterns | Delayed adoption | Validate top-path integrations via focused spike before promotion |

## Promotion Trigger Into `current/`

Create a `current/` executable plan when all are true:

1. Decision pre-read completed with side-by-side evidence table and explicit
   recommendation.
2. Draft ADR opened and reviewed by architecture and security stakeholders.
3. Implementation entry point is scoped to one thin vertical slice (for
   example preference profile write+read path) to keep first delivery simple.
4. Deterministic validation checklist is ready (functional checks, security
   checks, and migration/rollback checks).

## Foundation Alignment

This strategic plan and any promoted child plans must align with:

- `@.agent/directives/principles.md`
- `@.agent/directives/testing-strategy.md`
- `@.agent/directives/schema-first-execution.md`

## Reference-Context Rule

Any implementation notes in this strategic brief are reference context only.
Execution commitments become binding only after promotion into `current/` or
`active/`.
