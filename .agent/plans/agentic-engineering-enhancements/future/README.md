# Future Plans — Agentic Engineering Enhancements

Deferred strategic backlog for later milestones and exploratory capability work
in this collection.

Promote an item to `../current/` when prerequisites, ownership, and the next
execution slice are clear.

## Expert Capability Queue Notes

The expanding expert collection is coordinated through current plans before
more future specialists are promoted:

- [planning-specialist-capability.plan.md](../current/planning-specialist-capability.plan.md)
  is the canonical owner for the Planning reviewer / skill / rule triplet.
- [practice-and-process-structural-improvements.plan.md](../current/practice-and-process-structural-improvements.plan.md)
  supplies process-discipline doctrine to the Planning specialist and creates
  permanent homes for collaboration and portability guidance.
- [agent-infrastructure-portability-remediation.plan.md](../current/agent-infrastructure-portability-remediation.plan.md)
  must keep the platform adapter and validator model healthy as the roster
  grows.
- Future expert plans below should not create bespoke adapter or taxonomy
  patterns that conflict with those current coordination plans.

| Horizon | Plan | Scope | Prerequisites |
| --- | --- | --- | --- |
| Later | [graphify-and-graph-memory-exploration.plan.md](graphify-and-graph-memory-exploration.plan.md) | Explore external-tool, code-adoption, concept-adoption, hybrid, or no-action paths for Graphify-inspired graph memory over canonical Practice artefacts | Agree a first pilot question/corpus and the boundary between canonical memory and derived graph memory |
| Later | [hooks-portability.plan.md](hooks-portability.plan.md) | Bring hooks into the three-layer model: canonical scripts in `.agent/hooks/`, platform config in `.cursor/`, `.claude/`, and `.gemini/` | ADR-125 portability hardening complete |
| Later | [cross-vendor-session-sidecars.plan.md](cross-vendor-session-sidecars.plan.md) | Local-first canonical session sidecars for arbitrary structured metadata across hook, wrapper, and importer adapters; not the baseline portability substrate, which already must remain cross-vendor | Confirm a concrete sidecar use-case, schema, and owning workflow |
| Later | [collaboration-state-domain-model-and-comms-reliability.plan.md](collaboration-state-domain-model-and-comms-reliability.plan.md) | Broader collaboration-state domain model after the write-safety slice; attention routing, rolling archive policy, and hook polish remain here | First slice promoted to [`../current/collaboration-state-write-safety.plan.md`](../current/collaboration-state-write-safety.plan.md) on 2026-04-28 |
| Later | [express-specialist-capability.plan.md](express-specialist-capability.plan.md) | Express 5.x reviewer, skill, and situational rule following ADR-129 | Priority after the current reviewer/capability queue |
| Later | [cyber-security-specialist-capability.plan.md](cyber-security-specialist-capability.plan.md) | Broad-remit cyber security capability for posture, threat models, and defence in depth | Decide when broad security posture work outranks narrower security lanes |
| Later | [web-api-security-specialist-capability.plan.md](web-api-security-specialist-capability.plan.md) | Narrow-remit web/API security capability for trust boundaries, sessions, callbacks, and API attack surfaces | Resolve sequencing with the broader cyber-security and privacy lanes |
| Later | [privacy-specialist-capability.plan.md](privacy-specialist-capability.plan.md) | Broad-remit privacy capability for minimisation, retention, redaction, and privacy-by-design review | Priority after the adjacent security/privacy queue is clearer |
| Later | [web-api-gdpr-specialist-capability.plan.md](web-api-gdpr-specialist-capability.plan.md) | Narrow-remit web/API GDPR capability for deletion/export, consent, and retention semantics at API boundaries | Resolve boundary and sequencing with the broader privacy capability |
| Later | [ooce-specialist-capability.plan.md](ooce-specialist-capability.plan.md) | Oak Open Curriculum Ecosystem specialist for internal contracts, composition patterns, and workspace usage | Stable internal library boundaries and room in the capability queue |
| ~~Later~~ | ~~planning-specialist-capability.plan.md~~ | ~~Planning reviewer, skill, and rule triplet~~ | **Promoted to `current/` 2026-04-20** |
| Later | [tdd-specialist-capability.plan.md](tdd-specialist-capability.plan.md) | TDD specialist for multi-level TDD guidance scaled to task size | Consensus on the refined repo test taxonomy and priority in the capability queue |
| Later | [devx-specialist-capability.plan.md](devx-specialist-capability.plan.md) | Developer experience specialist for code, repo, SDK, and CLI ergonomics | Clear scope split versus the existing developer-experience plan collection |
| Later | [repair-workflow-wording-hazard-detection.plan.md](repair-workflow-wording-hazard-detection.plan.md) | Detect ambiguous wording and missing output contracts in multi-artefact repair workflows | More evidence from wording-driven repair failures or explicit owner prioritisation |
| Later | [adapter-generation.plan.md](adapter-generation.plan.md) | Manifest-driven platform adapter generation to replace many manual wrapper files | Adapter structure stable enough to encode in a single manifest |
| Later | [agent-classification-taxonomy.plan.md](agent-classification-taxonomy.plan.md) | Comprehensive agent reclassification, rename, and mode composition work | Downstream consumers ready for rename and mode-composition changes |
| Later | [agent-infrastructure-coherence-audit.plan.md](agent-infrastructure-coherence-audit.plan.md) | Audit command/skill/rule/adapter coherence and identify single-consumer abstractions or drift | Visible coherence debt or adapter drift justifies a dedicated audit pass |
| Later | [operating-model-mechanism-taxonomy.plan.md](operating-model-mechanism-taxonomy.plan.md) | Define abstract mechanism families for governance-plane vocabulary, boundary models, signal ecology, residual-risk surfaces, planes, loops, precedence, artefact economy, and renewal triggers across the agentic operating model | Bounded first slice chosen and adjacent evidence available from operational-awareness or reviewer-gateway work |
| Later | [mcp-governance-deep-dive.plan.md](mcp-governance-deep-dive.plan.md) | Deep dive into MCP `2025-11-25` governance, identity (RFC 9728), durable-tasks, SDK tiering, and JSON Schema 2020-12 implications for the repo's MCP server | MCP server upgrade to `2025-11-25` enters planning surface, OR second MCP governance signal requires architectural response |
| Later | [memory-feedback-and-emergent-learning-mechanisms.plan.md](memory-feedback-and-emergent-learning-mechanisms.plan.md) | Wire the three memory planes (active / operational / executive) into complete feedback loops; design cross-plane paths (esp. executive → anywhere and active → executive); install at least one emergent-whole observation mechanism; graduate already-captured patterns + perturbation-mechanism bundle; Practice-level doctrine updates (three-mode taxonomy portability decision + executive-memory loop PDR + practice.md Artefact Map refresh) | Second concrete instance of cross-plane drift, OR owner-direct promotion, OR alpha-gate Sentry work lands and execution capacity shifts |
| Later | [external-pointer-surface-integration.plan.md](external-pointer-surface-integration.plan.md) | Linear (and possibly GitHub Projects) as peer pointer-surface for thread visibility — thread → Linear label, landing → Linear issue, navigation map → Linear Document — with firing surface in `session-handoff.md` step 7c and read-side health probe in `pnpm session-handoff:check`; PII stays out of version control via gitignored `.agent/local/linear.local.json` | Phase 0 owner ratifications complete (mapping, cadence, GH Projects defer/add, sequencing, PDR strategy) + `observability-thread-legacy-singular-path` Due item resolved + Session 4 of the Staged Doctrine Consolidation plan closed |
| Later | [intent-to-commit-and-session-counter.plan.md](intent-to-commit-and-session-counter.plan.md) | Residual `session_counter` primitive only. The queue-backed intent bundle slice is complete and archived; do not make session-count TTL load-bearing unless a real primitive is deliberately implemented later. | Queue execution completed 2026-04-27 and archived as [`intent-to-commit-queue.execution.plan.md`](../archive/completed/intent-to-commit-queue.execution.plan.md); promote only on explicit owner direction for the session-counter slice |
| ~~Later~~ | ~~[joint-agent-decision-protocol.plan.md](joint-agent-decision-protocol.plan.md)~~ | ~~Add a discuss, decide, record, act protocol with explicit recorder/actor assignment for multi-agent decisions~~ | **Implemented 2026-04-26** with WS3B sidebars/escalation |

Strategic context: [roadmap.md](../roadmap.md)

In-progress execution: [active/README.md](../active/README.md)  
Next-up queue: [current/README.md](../current/README.md)

Documentation tracking for all phases:
[documentation-sync-log.md](../documentation-sync-log.md)
