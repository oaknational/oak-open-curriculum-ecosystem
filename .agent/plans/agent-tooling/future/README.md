# Future Plans — Agent Tooling

Deferred strategic backlog for later milestones and exploratory capability
work in the agent tooling substrate.

Promote an item to [`../current/`](../current/) when prerequisites,
ownership, and the next execution slice are clear.

## Plans

| Horizon | Plan | Scope | Prerequisites |
| --- | --- | --- | --- |
| Later | [agent-coordination-cli-ergonomics-and-request-correlation.plan.md](agent-coordination-cli-ergonomics-and-request-correlation.plan.md) | Reduce first-touch friction on the collaboration-state CLI; correlate cross-thread requests with responses so coordination signals do not rot silently; emit session-open liveness as a baseline. Complementary to the domain-model brief; this brief covers agent-facing ergonomics and the request/response correlation gap | Second instance of a silently-rotted cross-thread request, OR a claims-overlap collision in a parallel session, OR a second session reporting CLI first-touch friction, OR owner-direct promotion |
| Later | [collaboration-state-domain-model-and-comms-reliability.plan.md](collaboration-state-domain-model-and-comms-reliability.plan.md) | Broader collaboration-state domain model after the write-safety slice; attention routing, rolling archive policy, and hook polish remain here | First slice promoted to [`../current/collaboration-state-write-safety.plan.md`](../current/collaboration-state-write-safety.plan.md) on 2026-04-28 |
| Later | [cross-vendor-session-sidecars.plan.md](cross-vendor-session-sidecars.plan.md) | Local-first canonical session sidecars for arbitrary structured metadata across hook, wrapper, and importer adapters; not the baseline portability substrate, which already must remain cross-vendor | Confirm a concrete sidecar use-case, schema, and owning workflow |
| Later | [hooks-portability.plan.md](hooks-portability.plan.md) | Bring hooks into the three-layer model: canonical scripts in `.agent/hooks/`, platform config in `.cursor/`, `.claude/`, and `.gemini/` | ADR-125 portability hardening complete |
| Later | [intent-to-commit-and-session-counter.plan.md](intent-to-commit-and-session-counter.plan.md) | Residual `session_counter` primitive only. The queue-backed intent bundle slice is complete and archived; do not make session-count TTL load-bearing unless a real primitive is deliberately implemented later. | Queue execution completed 2026-04-27 and archived as [`intent-to-commit-queue.execution.plan.md`](../../agentic-engineering-enhancements/archive/completed/intent-to-commit-queue.execution.plan.md); promote only on explicit owner direction for the session-counter slice |
| Later | [codex-session-identity-plumbing.plan.md](codex-session-identity-plumbing.plan.md) | Residual Codex identity plumbing follow-ups (the high-impact slice was promoted and completed 2026-04-28; this brief retains the longer-tail work) | Owner-direct promotion when residual scope becomes execution-ready |
| Later | [joint-agent-decision-protocol.plan.md](joint-agent-decision-protocol.plan.md) | Add a discuss, decide, record, act protocol with explicit recorder/actor assignment for multi-agent decisions | Implemented 2026-04-26 with WS3B sidebars/escalation; brief retained as reference for any further protocol expansion |
| Later | [agent-classification-taxonomy.plan.md](agent-classification-taxonomy.plan.md) | Comprehensive agent reclassification, rename, and mode composition work | Downstream consumers ready for rename and mode-composition changes |
| Later | [agent-infrastructure-coherence-audit.plan.md](agent-infrastructure-coherence-audit.plan.md) | Audit command/skill/rule/adapter coherence and identify single-consumer abstractions or drift | Visible coherence debt or adapter drift justifies a dedicated audit pass |
| Superseded pending archive | [canonical-first-skill-pack-ingestion-tooling.plan.md](canonical-first-skill-pack-ingestion-tooling.plan.md) | Narrow vendor-agnostic external skill-pack ingestion plan. Its substance is folded into [`../current/agent-artefact-lifecycle-cli.plan.md`](../current/agent-artefact-lifecycle-cli.plan.md) Phase 3.1, but the file remains here until that successor's archive phase moves it. | Do not promote directly. Use the current lifecycle CLI plan for execution; archive this predecessor when that plan reaches Phase 8.2. |
| Later | [agent-graphs-workspace-organisation.plan.md](agent-graphs-workspace-organisation.plan.md) | Create the top-level `agent-graphs/` organisation so practice-facing graph tooling can live adjacent to `agent-tools/` without being misclassified as substrate or curriculum SDK code | Promote with the Practice graph pilot when `agent-graphs/practice-graph/` is ready to scaffold |
| Later | [adapter-generation.plan.md](adapter-generation.plan.md) | Manifest-driven platform adapter generation to replace many manual wrapper files | Adapter structure stable enough to encode in a single manifest |
| Later | [comms-watch-liveness-floor.plan.md](comms-watch-liveness-floor.plan.md) | Watcher-liveness substrate primitive + `/loop`-driven `check` companion validation + poll-vs-watch honesty reconciliation. Substrate-completing follow-on to the portable [`comms-watch-mechanism`](../../../reference/comms-watch-mechanism.md) reference. **Scope reduced 2026-05-19**: identity-filter widening absorbed into singleton-lane WS3 | Graph-tooling work surfaces concrete watcher/liveness pain (silent watcher death, missing cadence on long-running sessions), OR a separate driver for the liveness-record primitive, OR owner-direct promotion |
| ✅ Landed 2026-05-29 | [routing-legacy-fallback-sunset.plan.md](routing-legacy-fallback-sunset.plan.md) | **Executed (`d9225d5b`)**: strict single-path id-keyed routing — `legacy` arm + fallback writer + `[routing-legacy-fallback]` diagnostic deleted; fail-fast on an id-less identity. Doctrine removal finished (PDR-076a sunset note; `register-identity-on-thread-join` reconciled to `(name, id)`; coordinator-name strip; `claim-reports` comment). | Complete. Retained in-place as a cross-link hub; final archival deferred to the rightsizing brief's M4 — see [§Comms / coordination cluster](#comms--coordination-cluster) |
| Later | [coordination-watcher-canonicalisation.plan.md](coordination-watcher-canonicalisation.plan.md) | Move the canonical watcher definition out of `.agent/reference/` into code-adjacent docs; add a `coord how-to-start` CLI that emits the canonical invocation parameterised by identity (so the SKILL stops carrying a fragile example); extend the watcher from comms-only to multi-surface (comms, claims, conversations, escalations, handoffs); rehome the Practice-doctrine content. Sibling to liveness-floor + CLI-ergonomics. | Third watcher-misconfiguration instance in a team, OR owner-direct promotion. (M4 supersession candidate.) |
| Later | [claim-liveness-crash-reconciliation-and-session-forensics.plan.md](claim-liveness-crash-reconciliation-and-session-forensics.plan.md) | Make a crashed agent's claim reclaimable promptly without owner intervention (bind claim liveness to a real signal; reconcile orphaned claims on a dead-owner trigger) and add a session-forensics CLI (name/prefix → transcript, sub-agent enumeration, last-error extraction). Coordinates the liveness-floor, domain-model, and CLI-ergonomics plans that each own a slice but none own the thread. Surfaced by the 2026-05-28 peer-agent compaction crash. | A second crashed-agent / orphaned-claim incident, OR a team session blocked by a phantom claim, OR the comms-watch-liveness-floor primitive landing, OR owner-direct promotion |
| Later | [collaboration-substrate-coordination-rightsizing.plan.md](collaboration-substrate-coordination-rightsizing.plan.md) | First-principles **exploration** brief (not a build plan): re-derive the minimal coordination substrate the real 1-3-agent, owner-present context needs, and produce the supersession/deletion list for the accreted layers that exceed it. The home for the wider re-ground that `routing-legacy-fallback-sunset` §Open-problems surfaced and parked; resolves the parked "one new plan vs cluster refactor" question. | Owner prioritises the substrate re-ground, OR a third accretion incident, OR routing-legacy-fallback-sunset reaching promotion (shared gate) |

## Comms / coordination cluster

These plans all act on **one** substrate — agent identity, claims, comms,
watcher, liveness, and coordination roles — and were each spawned by a separate
incident, so they overlap. They are grouped here for discoverability and to
record that overlap. The **authoritative overlap + supersession analysis is not
duplicated here** — it lives in the keystone brief's M1 inventory
([`collaboration-substrate-coordination-rightsizing.m1-inventory.md`](collaboration-substrate-coordination-rightsizing.m1-inventory.md)
§4.3 fold-set, §4.5 item 4), whose **M4 produces the concrete cull/fold/supersede
list**. Do not re-litigate disposition per-plan; route it through M4.

**Keystone (owns the cluster's lifecycle):**

- [`collaboration-substrate-coordination-rightsizing`](collaboration-substrate-coordination-rightsizing.plan.md)
  — ACTIVE, M1 complete. Re-derives the minimal substrate; M4 supersedes/folds
  the rest. Its M1 verdict: the cluster is mostly *keep but re-polarise* (gate
  heavy machinery ON by `n` + topology + work-shape, OFF by default), not delete.

**Members and their overlaps:**

| Plan | Lane | Slice it owns | Overlaps / redundancy |
| --- | --- | --- | --- |
| [routing-legacy-fallback-sunset](routing-legacy-fallback-sunset.plan.md) | ✅ landed | id-keyed routing strictness | Done. Open-problems folded into the keystone; a worked instance for the keystone's M3 replace-vs-migrate discipline. |
| [comms-watch-storage-redesign](../current/comms-watch-storage-redesign.plan.md) | current | watcher storage (mtime watermark + XDG) | "comms-watch trilogy" with liveness-floor + canonicalisation — three plans on one watcher. |
| [comms-watch-liveness-floor](comms-watch-liveness-floor.plan.md) | future | watcher-liveness primitive | Overlaps claim-liveness (both = dead-agent detection) and domain-model (claim-heartbeat). |
| [coordination-watcher-canonicalisation](coordination-watcher-canonicalisation.plan.md) | future | canonical watcher home + multi-surface watch | Trilogy sibling; M1 names it an M4 supersession candidate. |
| [claim-liveness-crash-reconciliation](claim-liveness-crash-reconciliation-and-session-forensics.plan.md) | future | crash/orphaned-claim reconciliation + forensics CLI | Explicitly "coordinates the liveness-floor, domain-model, and CLI-ergonomics plans that each own a slice but none own the thread" — the liveness overlap nexus. |
| [collaboration-state-domain-model-and-comms-reliability](collaboration-state-domain-model-and-comms-reliability.plan.md) | future | broader state domain model (attention, archive, hook polish) | Overlaps CLI-ergonomics (complementary, noted in its row) and liveness. Write-safety slice already split to `current/`. |
| [agent-coordination-cli-ergonomics-and-request-correlation](agent-coordination-cli-ergonomics-and-request-correlation.plan.md) | future | CLI first-touch friction + request/response correlation | Complementary to domain-model; the missing `comms watch`/`reply`/`pending` + `list --tail`/`show` affordances M1 §4.4 flags as live friction. |
| [cost-of-collaboration](../current/cost-of-collaboration.plan.md) + [n2-and-coordination-efficiency-program](../current/n2-and-coordination-efficiency-program-2026-05-25.plan.md) | current | the controlling collaboration arc + n=2 mode | n2 subordinates to cost-of-collaboration; both are core inputs to the keystone's re-polarisation model (PDR-082 is its prototype). |
| [multi-agent-collaboration-protocol](../current/multi-agent-collaboration-protocol.plan.md) + [sidebar-and-escalation](../current/multi-agent-collaboration-sidebar-and-escalation.plan.md) | current | parallel-agent infra, sidebars, escalation | M1 names sidebar/escalation + joint-decision as fold candidates (gate to n≥3 / on-active-decision). |

## Related

- Collection root: [../README.md](../README.md)
- Frictions register: [../frictions-register.md](../frictions-register.md)
- Current execution: [../current/README.md](../current/README.md)
