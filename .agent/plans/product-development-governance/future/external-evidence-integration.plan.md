---
id: external-evidence-integration
node_type: plan
kind: executable
serves_strategic_choice: FRAME
derives_from:
  - ../../../../docs/architecture/architectural-decisions/201-external-systems-evidence-integration.md
  - ../../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md
status: future
last_updated: 2026-06-22
todos:
  - id: ws1-evidence-edge-schema
    content: "GATED (substrate + ADR-201): extend the idea-node / plan-layer schema with the evidence-edge contract (evidence / validated_by / realized_by to external nodes; capability mode; supervision requirement; source). Acceptance: an external node + evidence edge validates against the schema; the deterministic frontmatter->store validator covers evidence edges."
    status: pending
  - id: ws2-connectors-read-first
    content: "GATED: build read/summarise connectors for the first systems (GitHub change-readiness; Linear execution via projects_to; Sentry+OTEL runtime). No mutate in this pass (supervision contract precedes mutate). Acceptance: each connector emits typed evidence edges to external nodes; no PII enters version control (external IDs in gitignored local config)."
    status: pending
    depends_on: [ws1-evidence-edge-schema]
  - id: ws3-triggers-and-write-back
    content: "GATED: event-driven + scheduled triggers drive agentic analysis; validated write-back lands evidence edges in the graph. Acceptance: a trigger fires, analysis runs, the write-back is validated before it lands, and a left-invalid edge is rejected."
    status: pending
    depends_on: [ws2-connectors-read-first]
  - id: ws4-projections-dora-and-user-value
    content: "GATED: project the DORA delivery metrics and the user-value loop (PostHog signal closing link->loop) from the graph + evidence edges. Acceptance: the DORA five and the per-choice user-value loop are computable from the graph as a property of the structure, no separate instrumentation stack."
    status: pending
    depends_on: [ws3-triggers-and-write-back]
---

# External-evidence integration — the idea knowledge-graph ↔ external systems

**Architecture: [ADR-201](../../../../docs/architecture/architectural-decisions/201-external-systems-evidence-integration.md)
(Proposed) over [ADR-200](../../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md).**

> **Status: `future` — gated on TWO things: the idea knowledge-graph substrate (ADR-200 §Value, the interim
> completion milestone) AND ratification of ADR-201 (the integration contract). Do not start until both
> land. Workstreams below are sketched, not decision-complete — they cannot be before ADR-201 ratifies the
> contract.**

## The relationship this plan spells out

The **idea knowledge-graph** (ADR-200) is the **canonical** record of repo intent. External systems —
GitHub, Linear, Sentry/OpenTelemetry, Vercel, Sonar, PostHog — hold the **state** that evidences whether
intent was realised and delivered value. The relationship is **directional** (ADR-201): repo intent
projects _outward_ (what the work is for); external systems report _back_ as evidence (what happened). This
plan builds the integration that extracts that external state into the graph as **typed evidence edges** —
closing the loop from intent → work → output → user value, so the system can _prove_ it delivers value, not
just claim it. External systems evidence; they never define intent.

This is the bridge from the **substrate value** (the rewrite's deliverable — recoverable, drift-free,
traceable intent) to the **full value** (self-measuring delivery; the FRAME stream's core value). Per
ADR-200 §Value: the substrate value stands without this plan; the full value requires it.

## End goal · mechanism · means

- **End goal.** The idea knowledge-graph carries validated evidence edges from external systems, so the DORA
  delivery metrics, the user-value loop, and per-choice effectiveness are computable as properties of the
  structure rather than a separate instrumentation project.
- **Mechanism** (per ADR-201). Connectors per system → typed evidence edges (`evidence` / `validated_by` /
  `realized_by`) → triggers (event-driven + scheduled) → validated write-back; under the direction
  invariant, the capability modes, and the no-PII-in-VCS constraint.
- **Means.** The four gated workstreams in the frontmatter `todos`.

## Acceptance (outcome-level)

Each integrated system attaches evidence via a typed edge with a declared capability mode and supervision
requirement; no PII in version control; write-back is validated; the DORA delivery metrics and the
per-choice user-value loop are computable from the graph.

## Prerequisites (blocking)

- **The idea knowledge-graph substrate** (ADR-200 §Value interim milestone) — the graph and the rewritten
  corpus must exist; evidence edges attach to real idea/plan nodes.
- **ADR-201 ratified** — the integration contract (direction invariant, evidence edges, capability modes,
  supervision, no-PII, connectors/triggers/write-back).
- **The observability estate** (Sentry/OpenTelemetry, Vercel) — reused as the first connectors, not rebuilt.

## Non-goals

- NOT storing external state the graph can compute — evidence edges, not data duplication.
- NOT an authority edge into intent — external systems evidence; they never define intent.
- NOT PII in version control — external IDs and credentials stay in gitignored local config.

## Foundation alignment

ADR-201 (the contract); ADR-200 (the substrate + §Value substrate/full-value split);
[`stream-agentic-framework.md`](../../../../docs/strategy/stream-agentic-framework.md) (the FRAME core value
this serves — "the system measures its own delivery, natively"); the observability estate.
