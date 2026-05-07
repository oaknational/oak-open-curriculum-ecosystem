# Current Plans — Agent Tooling

Strategic source plans and adjacent capability plans for the agent tooling
substrate (queued or in progress).

These are not the atomic execution plans; they are the strategic work to be
promoted into explicit execution plans when scheduled. The collection can also
hold tightly scoped tactical snagging plans when a branch needs a queued,
next-session cleanup pass before merge.

## Plans

| Plan | Scope | Status |
| --- | --- | --- |
| [multi-agent-collaboration-protocol.plan.md](multi-agent-collaboration-protocol.plan.md) | Structural infrastructure for parallel agents (advisory, not enforcing; platform independent by design). WS0+WS1+WS2 landed; WS3A landed; WS4A lifecycle integration implemented; WS3B sidebar/escalation and joint-decision integration implemented; WS5 remains observation-gated | WS3B-IMPLEMENTED |
| [multi-agent-collaboration-sidebar-and-escalation.plan.md](multi-agent-collaboration-sidebar-and-escalation.plan.md) | Split from WS3B: sidebar, timeout, and owner-escalation design implemented with conversation-schema and escalation-state support | IMPLEMENTED |
| [multi-agent-collaboration-protocol-concept-home-refinement.plan.md](multi-agent-collaboration-protocol-concept-home-refinement.plan.md) | Concept home refinement for the multi-agent collaboration protocol | QUEUED |
| [collaboration-state-write-safety.plan.md](collaboration-state-write-safety.plan.md) | Promoted first slice from the collaboration-state domain-model brief: deterministic identity preflight, immutable comms events, transaction-safe shared JSON writes, TTL cleanup baseline, and hook deferral | IN PROGRESS |
| [collaboration-doc-fitness-remediation.plan.md](collaboration-doc-fitness-remediation.plan.md) | Remediate hard practice-fitness pressure in collaboration directive/state-conventions surfaces after coordination and identity expansion | COMPLETE |
| [multi-checkout-merge-handling-for-fitness-files.plan.md](multi-checkout-merge-handling-for-fitness-files.plan.md) | Handle multi-checkout merge interactions with fitness files | QUEUED |
| [n-agent-collaboration-experiments.plan.md](n-agent-collaboration-experiments.plan.md) | Decision-complete plan to validate or refute the N-agent collaboration hypothesis primitives in parallel with real work on active threads. E1 active; E2-E5 queued. Hypothesis at `.agent/prompts/agentic-engineering/collaboration/hypothesis.md`. | DECISION-COMPLETE / E1 ACTIVE |
| [agent-infrastructure-portability-remediation.plan.md](agent-infrastructure-portability-remediation.plan.md) | Portability remediation for the expanding expert/skill/rule collection; Phase 5 is the documentation dependency for portability PDR/ADR work | QUEUED |
| [pr-102-snagging.plan.md](pr-102-snagging.plan.md) | Queued next-session plan to clear PR #102 review threads and Sonar quality-gate blockers | QUEUED |

## Related

- Collection root: [../README.md](../README.md)
- Frictions register: [../frictions-register.md](../frictions-register.md)
- Future backlog: [../future/README.md](../future/README.md)
- Companion governance/doctrine collection: [../../agentic-engineering-enhancements/current/README.md](../../agentic-engineering-enhancements/current/README.md)
