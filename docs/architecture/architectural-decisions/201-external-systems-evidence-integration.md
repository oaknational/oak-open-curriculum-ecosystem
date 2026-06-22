# ADR-201: External systems as evidence edges — integrating external state into the idea knowledge-graph

- **Status:** Proposed (2026-06-22). This ADR **names** the decision and its considerations; it is **not yet
  accepted**. Ratification is gated on the idea knowledge-graph substrate landing (ADR-200 §Value, the
  interim completion milestone) and an owner decision.
- **Thread:** `strategy-and-plan-estate-holistic-review`.
- **Builds on:** [ADR-200](200-intent-as-a-living-idea-graph.md) (the idea knowledge-graph and §Value's
  substrate-vs-full-value split); `packages/core/graph-core` + `packages/libs/graph-ingest` (the substrate
  and ingestion); the observability estate (Sentry/OpenTelemetry, Vercel);
  [ADR-179](179-transport-agnostic-graph-substrate.md) (transport-agnostic substrate).

## Context

ADR-200 §Value distinguishes the **substrate value** — the idea knowledge-graph plus the rewritten corpus:
recoverable, drift-free, traceable intent, complete and assessable on its own — from the **full value**: a
system that **proves it delivers value, not just claims it** (self-measuring delivery with the DORA metrics
as a property of the structure, the user-value loop closed, the FRAME stream's core value). **The full value
rests on extracting evidence from the state of external systems** into the graph. This ADR decides how that
integration is shaped, kept as a **distinct** decision so the substrate work can complete and be assessed
without it.

The repo already touches the relevant external systems piecemeal (Sentry/OpenTelemetry and Vercel in the
observability estate; GitHub for change; Linear for execution). What is undecided is the **contract** by
which their state becomes evidence in the graph without compromising the graph's canonical authority. The
external-systems pillar was set out, owner-ratified, as a principle in the intent-graph design (the
"external systems are typed edges; the repo stays canonical" pillar); this ADR formalises that principle for
the idea knowledge-graph of ADR-200.

## Decision (proposed)

External systems are **typed edges to external nodes**; the idea knowledge-graph stays **canonical**. The
shape:

1. **Direction invariant — repo intent projects outward; services report evidence back.** The graph never
   derives its intent from an external system. Every external integration is a directional edge: intent →
   outward (what the work is for); service → back (evidence of what happened). External state is **never** an
   authority edge into intent.
2. **Evidence edges.** External state attaches via returning edges in the plan-layer schema — `evidence` (a
   node is evidenced by external state), `validated_by` (a strategic choice or increment is validated by
   user-value evidence), `realized_by` (the intent → realization join, for cost and throughput attribution).
3. **Capability modes per integration:** `read` / `summarise` / `annotate` / `mutate`. Each integration
   declares its mode; `mutate` carries a **supervision requirement** (human-in-the-loop).
4. **No PII in version control, ever.** External IDs and credentials live only in gitignored local config;
   the graph stores edges to external nodes, never personal data. (Organization constraint.)
5. **Connectors + triggers + validated write-back (the actuation layer).** Connectors draw from each system;
   triggers (event-driven and scheduled) drive agentic analysis; write-back into the graph is validated (the
   deterministic frontmatter↔store validator extends to cover evidence edges).
6. **Per-system map (first cut):** GitHub (change-readiness), Linear (execution / `projects_to`),
   Sentry + OpenTelemetry (runtime / incident), Vercel (deploy), Sonar (code quality), PostHog (the
   user-value signal that closes the link→loop). Each is a directional edge with a capability mode, an
   evidence-only authority effect, and a supervision requirement.

## Consequences

- Unlocks the **full value** — self-measuring delivery, the closed user-value loop, the FRAME stream's core
  value — on top of the substrate.
- **Gated on the substrate** (ADR-200 §Value interim milestone): this integration does not begin until the
  idea knowledge-graph is real. The substrate value stands without it.
- A separate **executable plan** sequences the build —
  `external-evidence-integration.plan.md` in `.agent/plans/product-development-governance/future/`.
- Extends to the future knowledge-graph family (ADR-200 §Future state): the operations and code
  knowledge-graphs evidence from the same external estate through the same contract.

## Open (to settle at ratification)

- The per-system capability + supervision matrix (which mode, what human-in-loop, what evidence effect).
- The write-back validation contract (how an evidence edge is validated before it lands).
- Reuse vs new connectors against the existing observability estate.
- What is a typed evidence edge vs a derived projection (do not store what can be computed).
- The no-PII enforcement mechanism (a validator and/or a gitignored-config boundary check).
