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
| [cost-of-collaboration.plan.md](cost-of-collaboration.plan.md) | Current controlling plan for agent communication and agent-tooling improvement work. Owns P0 pre-commit broken-code guard tuning, staged content scanners, quality-gate profiling, P-Foundation unified CLI, directed comms, commit-queue enforcement, identity routing, unified comms format, coordination artefact isolation, and residual work re-homed from the old primary plan. | ACTIVE / SINGLE SOURCE OF TRUTH |
| [primary-agent-tooling-enhancements.plan.md](primary-agent-tooling-enhancements.plan.md) | Superseded pre-2026-05-11 workstream split. Retained as a back-pointer only; remaining workstreams are re-homed into `cost-of-collaboration.plan.md` under its P-order. | SUPERSEDED |
| [multi-agent-collaboration-protocol.plan.md](multi-agent-collaboration-protocol.plan.md) | Structural infrastructure for parallel agents (advisory, not enforcing; platform independent by design). WS0+WS1+WS2 landed; WS3A landed; WS4A lifecycle integration implemented; WS3B sidebar/escalation and joint-decision integration implemented; WS5 remains observation-gated | WS3B-IMPLEMENTED |
| [multi-agent-collaboration-sidebar-and-escalation.plan.md](multi-agent-collaboration-sidebar-and-escalation.plan.md) | Split from WS3B: sidebar, timeout, and owner-escalation design implemented with conversation-schema and escalation-state support | IMPLEMENTED |
| [multi-agent-collaboration-protocol-concept-home-refinement.plan.md](multi-agent-collaboration-protocol-concept-home-refinement.plan.md) | Concept home refinement for the multi-agent collaboration protocol | QUEUED |
| [collaboration-state-write-safety.plan.md](collaboration-state-write-safety.plan.md) | Promoted first slice from the collaboration-state domain-model brief: deterministic identity preflight, immutable comms events, transaction-safe shared JSON writes, TTL cleanup baseline, and hook deferral | IN PROGRESS |
| [collaboration-identity-doctrine-enforcement-remediation.plan.md](collaboration-identity-doctrine-enforcement-remediation.plan.md) | Technical-debt remediation for accepted collaboration identity/body-file doctrine that tooling cannot yet enforce: PDR-076a UUID agent ids, routing by `(agent_name, id)`, `--to-id`, body-file frontmatter verification, and doctrine/help alignment. Subordinate to the improving-collaboration / cost-of-collaboration arc. | QUEUED |
| [collaboration-doc-fitness-remediation.plan.md](collaboration-doc-fitness-remediation.plan.md) | Remediate hard practice-fitness pressure in collaboration directive/state-conventions surfaces after coordination and identity expansion | COMPLETE |
| [multi-checkout-merge-handling-for-fitness-files.plan.md](multi-checkout-merge-handling-for-fitness-files.plan.md) | Handle multi-checkout merge interactions with fitness files | QUEUED |
| [n-agent-collaboration-experiments.plan.md](n-agent-collaboration-experiments.plan.md) | Decision-complete plan to validate or refute the N-agent collaboration hypothesis primitives in parallel with real work on active threads. E1 active; E2-E5 queued. Hypothesis at `.agent/prompts/agentic-engineering/collaboration/hypothesis.md`. | DECISION-COMPLETE / E1 ACTIVE |
| [start-right-team-singleton-lane-remediation.plan.md](start-right-team-singleton-lane-remediation.plan.md) | Multi-vendor remediation from the 2026-05-14 N-agent WS1 experiment, lean-scoped 2026-05-19: presence-before-source-claim (WS1), claim-overlap routing signals (WS2), canonical comms path + full-tuple identity filter (WS3). WS4–WS7 deferred to parallel with graph multi-agent work. | DECISION-COMPLETE — LEAN MULTI-VENDOR SCOPE |
| [agent-infrastructure-portability-remediation.plan.md](agent-infrastructure-portability-remediation.plan.md) | Portability remediation for the expanding expert/skill/rule collection; Phase 5 is the documentation dependency for portability PDR/ADR work | QUEUED |
| [pr-102-snagging.plan.md](pr-102-snagging.plan.md) | Queued next-session plan to clear PR #102 review threads and Sonar quality-gate blockers | QUEUED |
| [context-cost-cli.plan.md](context-cost-cli.plan.md) | New `agent-tools context-cost` subcommand: token-cost estimate over arbitrary file globs (chars/4 baseline, swap seam for real tokenizer). Delivers §1 of the strategic source plan's Scope Expansion Register; §2/§3/§4 now route through `fitness-token-measurements-and-frontmatter-mandation.plan.md`. | IMPLEMENTED |
| [agent-artefact-lifecycle-cli.plan.md](agent-artefact-lifecycle-cli.plan.md) | Single `agent-tools artefacts` lifecycle surface for skills, rules, commands, hooks, sub-agents, and plugins: list/inventory, verify, add/update/remove, external skill-pack wrapping, spec checks, skill-load budget, plugin audit, and ADR-125 inventory cleanup. Supersedes `future/canonical-first-skill-pack-ingestion-tooling.plan.md`, which remains in place until this plan's archive phase executes. | DECISION-COMPLETE / NOT STARTED |
| [comms-watch-storage-redesign.plan.md](comms-watch-storage-redesign.plan.md) | WS2 + WS3 of the comms-watch trilogy: storage redesign (mtime-watermark + per-session XDG cache) + cleanup. Promoted 2026-05-25 from archived `practice-infrastructure-hardening-program.plan.md §P5.W1`. WS1 (auto-seed) landed at `75e47923`. WS3 BLOCKED on comms-research-plan completion per owner standing direction 2026-05-25. | QUEUED / WS3 BLOCKED |
| [human-composer-tui.plan.md](human-composer-tui.plan.md) | Mini-Slack write surface: owner-facing composer pane for the collaboration TUI. Broadcasts, group messages, directed messages, replies (recipient + `in_response_to` inheritance), and sync-kind events (ADR-184). Closes gaps G1–G10 from the 2026-05-25 review-and-consistency fan-out. WS0 decision gate names Path A (schema extension with `author_kind`) as the architectural-excellence verdict; PDR-083 proposed. Write-side companion to `cost-of-collaboration.plan.md §P8`; storage sibling to `comms-watch-storage-redesign.plan.md`. | QUEUED / WS0 OWNER-RATIFICATION REQUIRED |
| [n2-and-coordination-efficiency-program-2026-05-25.plan.md](n2-and-coordination-efficiency-program-2026-05-25.plan.md) | Sibling plan to `cost-of-collaboration.plan.md`. Lands the n=2 mode (PDR-082), decomposition discipline, heartbeat/owner-attention cures, Director-class autonomy bundle, and the doctrine-topology refinement (P9) that gates most of the rest. Subordinates to the cost-of-collaboration arc; amends its P-sequence by making P9 the first move. Carries the design-evaluation track (obligation-tier taxonomy, continuous-scale-sensitive verdict, comms-substrate-shape evaluation) as parallel research lanes. Spine is the dependency graph, not the linear ranking. | DECISION-COMPLETE FIRST DRAFT / OWNER RATIFICATION REQUIRED |

## Related

- Collection root: [../README.md](../README.md)
- Frictions register: [../frictions-register.md](../frictions-register.md)
- Future backlog: [../future/README.md](../future/README.md)
- **Comms / coordination cluster map** (overlap + supersession analysis across
  current + future): [../future/README.md#comms--coordination-cluster](../future/README.md#comms--coordination-cluster)
- Companion governance/doctrine collection: [../../agentic-engineering-enhancements/current/README.md](../../agentic-engineering-enhancements/current/README.md)
