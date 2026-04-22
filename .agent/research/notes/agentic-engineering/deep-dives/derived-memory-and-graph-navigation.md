# Derived Memory and Graph Navigation

This deep dive covers the idea of adding a graph-shaped, derived navigation
plane over the existing practice and documentation estate.

## Canonical Anchors

- [ADR-059](../../../../docs/architecture/architectural-decisions/059-knowledge-graph-for-agent-context.md)
- [ADR-062](../../../../docs/architecture/architectural-decisions/062-knowledge-graph-svg-visualization.md)
- [ADR-157](../../../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md)
- [docs/explorations/README.md](../../../../docs/explorations/README.md)

## Primary Source Material

- [graphify-oak-practice-analysis.md](../../../research/graphify-oak-practice-analysis.md)
- [graphify-and-graph-memory-exploration.plan.md](../../../plans/agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md)
- [mcp_agent_guidance_provision.md](../../../research/mcp_agent_guidance_provision.md)
- [2026-03-02-the-travelling-practice.md](../../../experience/2026-03-02-the-travelling-practice.md)
- [2026-04-01-the-workflow-that-travels.md](../../../experience/2026-04-01-the-workflow-that-travels.md)

## Current Synthesis

- The graph-memory idea is explicitly **derived** and **orthogonal**. It must
  not compete with canonical memory surfaces such as plans, ADRs, `napkin.md`,
  or `distilled.md`.
- The Graphify analysis is valuable because it sharpens both the opportunity
  and the boundary: better corpus navigation, path/query/explain behaviour, and
  evidence-labelled relationships, but no installer-style takeover and no new
  source of truth.
- The future plan keeps the work exploratory, which is the right posture. The
  strong immediate value is in discoverability and synthesis over large mixed
  corpora such as ADRs, plans, research notes, and memory layers.
- This deep dive therefore acts as a bridge between present-day source
  material and future exploratory work, not as an adoption decision.

## Good Follow-Up Questions

- Which pilot corpora are large enough to justify graph navigation but small
  enough to stay coherent?
- Which graph outputs should remain local engineering aids versus promoted
  reports?
- How should derived graph surfaces integrate with existing help and
  discoverability patterns?

## Related Lanes

- [research graph lane](../../../research/agentic-engineering/derived-memory-and-graph-navigation/README.md)
- [formal synthesis lane](../../../reports/agentic-engineering/deep-dive-syntheses/README.md)
- [future graph-memory plan](../../../plans/agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md)
- [deep-dives index](./README.md)
- [hub README](../README.md)
