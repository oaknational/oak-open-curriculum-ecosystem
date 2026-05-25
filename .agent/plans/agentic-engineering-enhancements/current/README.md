# Current Plans — Agentic Engineering Enhancements

Strategic source plans and adjacent capability plans (queued or in progress).

These files are not the atomic execution plans in `active/`, but they do
represent strategic/capability work to promote into explicit active execution
plans when scheduled.

## Cross-Collection Boundary

Agent communication and collaboration-tooling implementation now routes through
[`../../agent-tooling/current/cost-of-collaboration.plan.md`](../../agent-tooling/current/cost-of-collaboration.plan.md).
That plan is the current single source of truth for the `agent-tools/`
workspace, collaboration-state substrate, hooks, commit queue, comms, and
identity-plumbing work. The old
[`../../agent-tooling/current/primary-agent-tooling-enhancements.plan.md`](../../agent-tooling/current/primary-agent-tooling-enhancements.plan.md)
is superseded and retained only as a back-pointer.

Keep this collection focused on Practice/governance questions: how agents
collaborate, plan, communicate, learn, review, and shape doctrine. If the work
would still exist without `agent-tools/`, it belongs here; if it changes the
tooling substrate, it belongs under `agent-tooling/`.

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
| ↪️ MOVED | `collaboration-doc-fitness-remediation.plan.md` → [`../../agent-tooling/current/`](../../agent-tooling/current/collaboration-doc-fitness-remediation.plan.md) | (relocated 2026-05-05) |
| ↪️ MOVED | `agent-infrastructure-portability-remediation.plan.md` → [`../../agent-tooling/current/`](../../agent-tooling/current/agent-infrastructure-portability-remediation.plan.md) | (relocated 2026-05-05) |
| [learning-loop-negative-feedback-tightening.plan.md](learning-loop-negative-feedback-tightening.plan.md) | Adjacent: narrow balancing-loop tightening for executive-memory drift detection and consolidation-time memory-quality dispositions | QUEUED |
| [completion-claim-proof-pipeline.plan.md](completion-claim-proof-pipeline.plan.md) | Adjacent: completion claims as computed verdicts, plan proof contracts, source-anchored multi-level test-first TDD, and deterministic enforcement routing | QUEUED |
| [fitness-token-measurements-and-frontmatter-mandation.plan.md](fitness-token-measurements-and-frontmatter-mandation.plan.md) | Follow-on to `agent-tools context-cost`: add chars/4 token measurements to Practice fitness, introduce token target/limit frontmatter, and absorb the old frontmatter manifest sweep into one sequenced lane. | DECISION-COMPLETE / READY FOR EXECUTION |
| [agent-entrypoint-content-homing.plan.md](agent-entrypoint-content-homing.plan.md) | Adjacent: lossless homing of non-entrypoint AGENT.md content into durable homes while preserving discovery parity | QUEUED |
| [practice-graph-payoff-peak-pilot.plan.md](practice-graph-payoff-peak-pilot.plan.md) | Adjacent: payoff-peak pilot for a derived Practice graph with bounded workspaces, explicit-edge extraction, local graph/report outputs, and CLI build/query/path surfaces | QUEUED |
| [knowledge-role-documentation-restructure.plan.md](knowledge-role-documentation-restructure.plan.md) | Adjacent: restructure testing, TypeScript, development, and troubleshooting docs around PDR-014 knowledge artefact roles | QUEUED |
| [memory-state-substrate-portable-contracts.plan.md](memory-state-substrate-portable-contracts.plan.md) | Adjacent: host adoption of PDR-050 portable state/memory substrate contracts and immune-layer routing | IN PROGRESS — strict local manifest and legacy event migration landed; review/closure pending |
| [open-questions-memory-system.plan.md](open-questions-memory-system.plan.md) | Adjacent: first-class operational-memory surface for unresolved non-urgent decision-shapes, with workflow capture/drain and practice-substrate validation | IN PROGRESS |
| ↪️ MOVED | `multi-agent-collaboration-protocol.plan.md` → [`../../agent-tooling/current/`](../../agent-tooling/current/multi-agent-collaboration-protocol.plan.md) | (relocated 2026-05-05) |
| ↪️ MOVED | `multi-agent-collaboration-sidebar-and-escalation.plan.md` → [`../../agent-tooling/current/`](../../agent-tooling/current/multi-agent-collaboration-sidebar-and-escalation.plan.md) | (relocated 2026-05-05) |
| ↪️ MOVED | `collaboration-state-write-safety.plan.md` → [`../../agent-tooling/current/`](../../agent-tooling/current/collaboration-state-write-safety.plan.md) | (relocated 2026-05-05) |
| ↪️ MOVED | `n-agent-collaboration-experiments.plan.md` → [`../../agent-tooling/current/`](../../agent-tooling/current/n-agent-collaboration-experiments.plan.md) | (relocated 2026-05-05) |
| [doctrine-enforcement-quick-wins.plan.md](doctrine-enforcement-quick-wins.plan.md) | Six structural enforcement workstreams against the highest-frequency doctrine-violation patterns named in the post-/insights reflection round; PDR-044 innate-immunity layer host adoption | NOT STARTED |
| ~~[practice-core-surface-retirement.plan.md](../archive/completed/practice-core-surface-retirement.plan.md)~~ | Retire `.agent/practice-core/patterns/` and `.agent/practice-context/`; update doctrine, navigation, validators, count-prose | **COMPLETE** — all four phases landed 2026-04-29; PDR-007/PDR-024/PDR-014 amendments; trinity navigation updated; directories deleted; validators green |
| ~~[codex-session-identity-plumbing.plan.md](../archive/completed/codex-session-identity-plumbing.plan.md)~~ | Promoted high-impact slice from the Codex identity follow-up: SessionStart context, full preflight guidance for thread rows, and report-only anonymous-record audit | COMPLETE |
| [plan-index-reachability-remediation.plan.md](plan-index-reachability-remediation.plan.md) | Restore the leaf-to-root reachability invariant for `.agent/plans/`: add 3 missing collections to root README, add lifecycle READMEs to observability + security-and-privacy/future, thread 5 orphan plans into their lifecycle indexes, and add a repo-validator that fails CI on new orphans | DECISION-INCOMPLETE |

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

[codex-session-identity-plumbing.plan.md](../archive/completed/codex-session-identity-plumbing.plan.md)
closed and archived on 2026-04-28. The Codex `SessionStart` identity hook,
canonical preflight guidance, report-only anonymous identity audit, and ADR/PDR
propagation are implemented and validated.

Strategic context: [roadmap.md](../roadmap.md)
Archived context: [../archive/completed/](../archive/completed/)

In-progress execution: [active/README.md](../active/README.md)
Later backlog: [future/README.md](../future/README.md)

Documentation tracking for all phases:
[documentation-sync-log.md](../documentation-sync-log.md)
