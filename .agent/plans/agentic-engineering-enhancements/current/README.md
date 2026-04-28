# Current Plans — Agentic Engineering Enhancements

Strategic source plans and adjacent capability plans (queued or in progress).

These files are not the atomic execution plans in `active/`, but they do
represent strategic/capability work to promote into explicit active execution
plans when scheduled.

## Source Plans

| Source Plan | Serves | Status |
| --- | --- | --- |
| [hallucination-and-evidence-guard-adoption.plan.md](hallucination-and-evidence-guard-adoption.plan.md) | Phases 1 & 2 (hallucination guarding + evidence-based claims) | REFERENCE |
| [architectural-enforcement-adoption.plan.md](architectural-enforcement-adoption.plan.md) | Phase 3 (architectural enforcement) | REFERENCE |
| [mutation-testing-implementation.plan.md](mutation-testing-implementation.plan.md) | Phase 5 (mutation testing) | REFERENCE |
| [elasticsearch-specialist-capability.plan.md](elasticsearch-specialist-capability.plan.md) | Adjacent: ES specialist (✅ complete) | REFERENCE |
| [sentry-specialist-capability.plan.md](sentry-specialist-capability.plan.md) | Adjacent: Sentry specialist (foundation active) | REFERENCE |
| [harness-concepts-adoption.plan.md](harness-concepts-adoption.plan.md) | Adjacent: HC-0 baseline metrics | REFERENCE |
| [reviewer-gateway-upgrade.plan.md](reviewer-gateway-upgrade.plan.md) | Adjacent: layered gateway triage, review depth selection, and coverage tracking | QUEUED |
| [agentic-corpus-discoverability-and-deep-dive-hub.plan.md](agentic-corpus-discoverability-and-deep-dive-hub.plan.md) | Adjacent: index-only hub, named research/report lanes, selected docs cross-links, and seed deep dives | REFERENCE |
| [governance-concepts-and-agentic-mechanism-integration.plan.md](governance-concepts-and-agentic-mechanism-integration.plan.md) | Adjacent: abstract governance-plane concept extraction, local mechanism-gap mapping, and routing into plans, deep dives, reports, and doctrine-adjacent surfaces | REFERENCE |
| [planning-specialist-capability.plan.md](planning-specialist-capability.plan.md) | Adjacent: planning reviewer, skill, and rule triplet for plan architecture, lifecycle, discoverability, and integration routing | QUEUED |
| [practice-and-process-structural-improvements.plan.md](practice-and-process-structural-improvements.plan.md) | Adjacent: structural Practice/process gap closure that feeds Planning discipline into the Planning expert plan and creates permanent homes for collaboration and portability doctrine | QUEUED |
| [collaboration-doc-fitness-remediation.plan.md](collaboration-doc-fitness-remediation.plan.md) | Adjacent: remediate hard practice-fitness pressure in collaboration directive/state-conventions surfaces after coordination and identity expansion | COMPLETE |
| [agent-infrastructure-portability-remediation.plan.md](agent-infrastructure-portability-remediation.plan.md) | Adjacent: portability remediation for the expanding expert/skill/rule collection; Phase 5 is the documentation dependency for portability PDR/ADR work | QUEUED |
| [learning-loop-negative-feedback-tightening.plan.md](learning-loop-negative-feedback-tightening.plan.md) | Adjacent: narrow balancing-loop tightening for executive-memory drift detection and consolidation-time memory-quality dispositions | QUEUED |
| [agent-entrypoint-content-homing.plan.md](agent-entrypoint-content-homing.plan.md) | Adjacent: lossless homing of non-entrypoint AGENT.md content into durable homes while preserving discovery parity | QUEUED |
| [practice-graph-payoff-peak-pilot.plan.md](practice-graph-payoff-peak-pilot.plan.md) | Adjacent: payoff-peak pilot for a derived Practice graph with bounded workspaces, explicit-edge extraction, local graph/report outputs, and CLI build/query/path surfaces | QUEUED |
| [knowledge-role-documentation-restructure.plan.md](knowledge-role-documentation-restructure.plan.md) | Adjacent: restructure testing, TypeScript, development, and troubleshooting docs around PDR-014 knowledge artefact roles | QUEUED |
| [multi-agent-collaboration-protocol.plan.md](multi-agent-collaboration-protocol.plan.md) | Adjacent: structural infrastructure for parallel agents (advisory, not enforcing; platform independent by design). WS0+WS1+WS2 landed; WS3A landed; WS4A lifecycle integration implemented; WS3B sidebar/escalation and joint-decision integration implemented; WS5 remains observation-gated | WS3B-IMPLEMENTED |
| [multi-agent-collaboration-sidebar-and-escalation.plan.md](multi-agent-collaboration-sidebar-and-escalation.plan.md) | Split from WS3B: sidebar, timeout, and owner-escalation design implemented with conversation-schema and escalation-state support | IMPLEMENTED |
| [collaboration-state-write-safety.plan.md](collaboration-state-write-safety.plan.md) | Promoted first slice from the collaboration-state domain-model brief: deterministic identity preflight, immutable comms events, transaction-safe shared JSON writes, TTL cleanup baseline, and hook deferral | IN PROGRESS |
| [codex-session-identity-plumbing.plan.md](codex-session-identity-plumbing.plan.md) | Promoted high-impact slice from the Codex identity follow-up: SessionStart context, full preflight guidance for thread rows, and report-only anonymous-record audit | IMPLEMENTED |

Recently completed:
[multi-agent-collaboration-decision-thread-and-claim-history.plan.md](../archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md)
closed WS3A on 2026-04-26. A narrow WS4A lifecycle integration pass then
made start-right, session-handoff, plan templates, and Practice/ADR surfaces
recognise WS0-WS3A collaboration state. Additional three-agent phase-transition
evidence then satisfied the WS3B promotion gate; the owner-approved
implementation pass installed sidebars, owner escalation, and
joint-decision integration on 2026-04-26.

[intent-to-commit-queue.execution.plan.md](../archive/completed/intent-to-commit-queue.execution.plan.md)
closed on 2026-04-27. The queue implementation landed in `5c39d1d4`, then the
owner-directed governance pass graduated the shared git transaction /
authorial-bundle tripwire to PDR-029 Family A Class A.3 and archived the
execution plan.

Strategic context: [roadmap.md](../roadmap.md)
Archived context: [../archive/completed/](../archive/completed/)

In-progress execution: [active/README.md](../active/README.md)
Later backlog: [future/README.md](../future/README.md)

Documentation tracking for all phases:
[documentation-sync-log.md](../documentation-sync-log.md)
