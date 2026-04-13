# Future Plans — Agentic Engineering Enhancements

Deferred strategic backlog for later milestones and exploratory capability work
in this collection.

Promote an item to `../current/` when prerequisites, ownership, and the next
execution slice are clear.

| Horizon | Plan | Scope | Prerequisites |
| --- | --- | --- | --- |
| Later | [graphify-and-graph-memory-exploration.plan.md](graphify-and-graph-memory-exploration.plan.md) | Explore external-tool, code-adoption, concept-adoption, hybrid, or no-action paths for Graphify-inspired graph memory over canonical Practice artefacts | Agree a first pilot question/corpus and the boundary between canonical memory and derived graph memory |
| Later | [hooks-portability.plan.md](hooks-portability.plan.md) | Bring hooks into the three-layer model: canonical scripts in `.agent/hooks/`, platform config in `.cursor/`, `.claude/`, and `.gemini/` | ADR-125 portability hardening complete |
| Later | [cross-vendor-session-sidecars.plan.md](cross-vendor-session-sidecars.plan.md) | Local-first canonical session sidecars for arbitrary structured metadata across hook, wrapper, and importer adapters | Confirm a concrete sidecar use-case, schema, and owning workflow |
| Later | [express-specialist-capability.plan.md](express-specialist-capability.plan.md) | Express 5.x reviewer, skill, and situational rule following ADR-129 | Priority after the current reviewer/capability queue |
| Later | [cyber-security-specialist-capability.plan.md](cyber-security-specialist-capability.plan.md) | Broad-remit cyber security capability for posture, threat models, and defence in depth | Decide when broad security posture work outranks narrower security lanes |
| Later | [web-api-security-specialist-capability.plan.md](web-api-security-specialist-capability.plan.md) | Narrow-remit web/API security capability for trust boundaries, sessions, callbacks, and API attack surfaces | Resolve sequencing with the broader cyber-security and privacy lanes |
| Later | [privacy-specialist-capability.plan.md](privacy-specialist-capability.plan.md) | Broad-remit privacy capability for minimisation, retention, redaction, and privacy-by-design review | Priority after the adjacent security/privacy queue is clearer |
| Later | [web-api-gdpr-specialist-capability.plan.md](web-api-gdpr-specialist-capability.plan.md) | Narrow-remit web/API GDPR capability for deletion/export, consent, and retention semantics at API boundaries | Resolve boundary and sequencing with the broader privacy capability |
| Later | [ooce-specialist-capability.plan.md](ooce-specialist-capability.plan.md) | Oak Open Curriculum Ecosystem specialist for internal contracts, composition patterns, and workspace usage | Stable internal library boundaries and room in the capability queue |
| Later | [planning-specialist-capability.plan.md](planning-specialist-capability.plan.md) | Planning reviewer, skill, and rule triplet for plan architecture, lifecycle, and discoverability quality | Recurring plan-quality issues plus a stable planning architecture |
| Later | [tdd-specialist-capability.plan.md](tdd-specialist-capability.plan.md) | TDD specialist for multi-level TDD guidance scaled to task size | Consensus on the refined repo test taxonomy and priority in the capability queue |
| Later | [devx-specialist-capability.plan.md](devx-specialist-capability.plan.md) | Developer experience specialist for code, repo, SDK, and CLI ergonomics | Clear scope split versus the existing developer-experience plan collection |
| Later | [repair-workflow-wording-hazard-detection.plan.md](repair-workflow-wording-hazard-detection.plan.md) | Detect ambiguous wording and missing output contracts in multi-artefact repair workflows | More evidence from wording-driven repair failures or explicit owner prioritisation |
| Later | [adapter-generation.plan.md](adapter-generation.plan.md) | Manifest-driven platform adapter generation to replace many manual wrapper files | Adapter structure stable enough to encode in a single manifest |
| Later | [agent-classification-taxonomy.plan.md](agent-classification-taxonomy.plan.md) | Comprehensive agent reclassification, rename, and mode composition work | Downstream consumers ready for rename and mode-composition changes |
| Later | [agent-infrastructure-coherence-audit.plan.md](agent-infrastructure-coherence-audit.plan.md) | Audit command/skill/rule/adapter coherence and identify single-consumer abstractions or drift | Visible coherence debt or adapter drift justifies a dedicated audit pass |

Strategic context: [roadmap.md](../roadmap.md)

In-progress execution: [active/README.md](../active/README.md)  
Next-up queue: [current/README.md](../current/README.md)

Documentation tracking for all phases:
[documentation-sync-log.md](../documentation-sync-log.md)
