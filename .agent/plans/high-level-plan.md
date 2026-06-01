---
plan_id: high-level-plan
title: "High-Level Plan"
type: strategic-index
status: active
last_updated: 2026-06-01
related_indices:
  - "README.md"
  - "curriculum-mcp-path-to-ga/roadmap.md"
  - "discovery/README.md"
  - "observability/high-level-observability-plan.md"
---

# High-Level Plan

**Status**: 🔄 Active strategic index
**Scope**: Cross-collection orientation for the Oak Open Curriculum Ecosystem.

This file explains the strategic shape of the work. It does not own execution
detail. For the operational plan index, lifecycle rules, and collection table,
start at [README.md](README.md). For the Curriculum MCP release arc, use
[curriculum-mcp-path-to-ga/roadmap.md](curriculum-mcp-path-to-ga/roadmap.md).

---

## Strategic Goal

Oak's open curriculum should become a set of world-class primitives and modular
building blocks for education applications. The repo pursues that through:

- public SDK, OpenAPI, MCP, search, and graph surfaces for curriculum access;
- MCP Apps and remote MCP server work for AI assistant hosts;
- knowledge-graph and evidence-corpus work that composes Oak curriculum,
  ontology, misconceptions, and sector evidence;
- agent-readiness discovery so external agents, crawlers, registries, and IDEs
  can find the right public machine surfaces;
- practice, tooling, security, observability, compliance, and documentation
  infrastructure that keeps the work reusable and trustworthy.

The high-level plan is deliberately short-lived as a source of execution truth.
If a collection README or active/current plan disagrees with this file, update
the collection-owned plan first, then reconcile this index.

---

## Primary Entry Points

| Need | Start Here | Why |
|---|---|---|
| Whole plan portfolio | [README.md](README.md) | Root operational index, collection table, lifecycle/reachability contract |
| MCP server release arc | [curriculum-mcp-path-to-ga/roadmap.md](curriculum-mcp-path-to-ga/roadmap.md) | Thin strategic index for M1 → M2 → M3 → GA across observability, security, compliance, SDK/MCP, and architecture |
| Graph & evidence work | [connecting-oak-resources/knowledge-graph-integration/README.md](connecting-oak-resources/knowledge-graph-integration/README.md) | Knowledge-graph integration hub; the live EEF evidence tool is under [sector-engagement/eef/](sector-engagement/eef/README.md) |
| Agent-readiness discovery | [discovery/README.md](discovery/README.md) | API catalog, Agent Skills, MCP Server Cards, A2A, DNS-AID, WebMCP, Web Bot Auth, robots/sitemaps, and `.well-known` metadata |
| Observability strategy | [observability/high-level-observability-plan.md](observability/high-level-observability-plan.md) | Five-axis observability plan under ADR-162 |
| Completed history | [completed-plans.md](completed-plans.md) | Human-readable completed-plan index; archives remain read-only provenance |
| New teammate onramp | [good-first-issues.md](good-first-issues.md) | Curated starter-task index |

---

## Milestone State

Milestones are the release-level story for the Curriculum MCP server. The
authoritative cross-collection release index is
[curriculum-mcp-path-to-ga/roadmap.md](curriculum-mcp-path-to-ga/roadmap.md).

| Milestone | State | Summary | Current Authority |
|---|---|---|---|
| M0 - Open Private Alpha | ✅ Complete | Repo made public after secrets/PII and docs remediation; HTTP server remained private alpha. | Archives and [completed-plans.md](completed-plans.md) |
| M1 - Invite-Only Alpha | ✅ Complete | Dev Clerk allowlist, Oak/invited users, server live at `curriculum-mcp-alpha.oaknational.dev`. | [curriculum-mcp-path-to-ga/roadmap.md](curriculum-mcp-path-to-ga/roadmap.md) |
| M2 - Open Public Alpha | 🔄 In progress | Public-alpha readiness across search/index health, MCP Apps migration, graph alignment, observability evidence, and user-facing MCP App experience. | [curriculum-mcp-path-to-ga/roadmap.md](curriculum-mcp-path-to-ga/roadmap.md) plus collection active/current plans |
| M3 - Public Beta | 📋 Planned / gated | Production Clerk, Cloudflare MCP security gate, operational hardening, alerting, compliance/privacy paperwork, and exemplar UI readiness. | [security-and-privacy/roadmap.md](security-and-privacy/roadmap.md), [compliance/roadmap.md](compliance/roadmap.md), and [curriculum-mcp-path-to-ga/roadmap.md](curriculum-mcp-path-to-ga/roadmap.md) |
| M4 / GA | ⏳ Undefined | Sustained production GA needs owner-defined gates after M3 evidence accumulates. | Backlog in [curriculum-mcp-path-to-ga/roadmap.md](curriculum-mcp-path-to-ga/roadmap.md) |

---

## Cross-Cutting Programmes

### 1. Curriculum MCP Path To GA

The MCP release arc crosses SDK/MCP work, observability, security, compliance,
architecture, and user experience. It is coordinated by
[curriculum-mcp-path-to-ga/roadmap.md](curriculum-mcp-path-to-ga/roadmap.md),
which indexes sub-plans without owning their execution.

Key linked collections:

- [sdk-and-mcp-enhancements/](sdk-and-mcp-enhancements/README.md) - MCP Apps,
  MCP protocol adoption, generated SDK/tool surfaces.
- [observability/](observability/README.md) - five-axis observability and
  runtime emission.
- [security-and-privacy/](security-and-privacy/README.md) - Cloudflare MCP
  public-beta security gate, evidence-backed security claims, Web Bot Auth
  enforcement evidence.
- [compliance/](compliance/README.md) - host submission, policy, and external
  regulatory/documentation alignment.

### 2. Graph And Evidence Surfaces

Graph work connects Oak curriculum structure, Oak ontology resources,
misconceptions, and sector evidence. It is owned by its collections:

- [connecting-oak-resources/knowledge-graph-integration/](connecting-oak-resources/knowledge-graph-integration/README.md) -
  graph substrate (`graph-core`/`graph-ingest`/`graph-project`,
  `graph-corpus-sdk`) and Oak graph MCP surfaces.
- [sector-engagement/eef/](sector-engagement/eef/README.md) - the EEF evidence
  tool ([eef-graph-tool-completion.plan.md](sector-engagement/eef/current/eef-graph-tool-completion.plan.md)),
  the live first proper graph tool.

Wider graph coordination is deliberately undefined until that first tool ships;
the estate clean-up is owned by
[graph-estate-consolidation.plan.md](connecting-oak-resources/knowledge-graph-integration/current/graph-estate-consolidation.plan.md).

### 3. Agent-Readiness Discovery

Discovery is now an active and queued workstream, not a reference-only note.
Start at [discovery/README.md](discovery/README.md).

Current promoted slice:
[discovery/current/agent-readiness-discovery-hub.plan.md](discovery/current/agent-readiness-discovery-hub.plan.md).

It covers the Phase 1 estate shape: apex API catalog hub, Agent Skills index,
Open API `Auth.md`, markdown representation, robots/sitemap baseline for every
official Oak web app, Content Signals routing, and the Web Bot Auth
decision/evidence bridge. Future discovery lanes cover MCP Server Cards,
DNS-AID, Aila A2A, WebMCP, and enabled-control Web Bot Auth rollout if Oak
ratifies signed-agent verification.

### 4. Practice, Tooling, And Review Infrastructure

Agentic practice and the implementation tooling are separate but coordinated:

- [agentic-engineering-enhancements/](agentic-engineering-enhancements/README.md)
  owns doctrine, planning, review, evidence guards, learning loops, and broad
  agent practice.
- [agent-tooling/](agent-tooling/README.md) owns the `agent-tools/` workspace,
  collaboration-state substrate, hooks, CLI behaviour, schemas, and
  implementation-level tooling.

### 5. Runtime Quality, Architecture, And Developer Experience

Architecture, observability, developer experience, and semantic-search follow-up
form the reliability substrate for the public app and public repo:

- [architecture-and-infrastructure/](architecture-and-infrastructure/README.md)
  owns cross-cutting architecture, quality gates, workspace boundaries, and
  system quality.
- [observability/](observability/README.md) owns five-axis observability after
  the 2026-04-18 restructure.
- [developer-experience/](developer-experience/README.md) owns SDK publishing,
  generated docs, tooling strictness, and developer-facing quality.
- [semantic-search/](semantic-search/README.md) owns search quality, ingestion,
  retrieval surfaces, and search/graph adjacency.

---

## Collection Status

This table is a strategic snapshot. Collection READMEs and active/current plans
remain authoritative for execution.

| Collection | Strategic Role | Status | Entry |
|---|---|---|---|
| `curriculum-mcp-path-to-ga/` | Cross-collection release arc for Curriculum MCP HTTP server | 🔄 Active strategic index | [roadmap.md](curriculum-mcp-path-to-ga/roadmap.md) |
| `semantic-search/` | Hybrid search, ingestion, retrieval quality, search/graph adjacency | 🔄 Current queue; no active plan in collection README | [README.md](semantic-search/README.md) |
| `sdk-and-mcp-enhancements/` | MCP Apps, MCP protocol adoption, generated SDK/tool surfaces | 🔄 Active + queued execution | [README.md](sdk-and-mcp-enhancements/README.md) |
| `observability/` | Five-axis observability under ADR-162 | 🔄 Active | [README.md](observability/README.md) |
| `architecture-and-infrastructure/` | Architecture, quality gates, workspace boundaries, system quality | 🔄 Active backlog | [README.md](architecture-and-infrastructure/README.md) |
| `security-and-privacy/` | Security controls, privacy posture, evidence-backed claims, Web Bot Auth enforcement evidence | 🔄 Active execution | [README.md](security-and-privacy/README.md) |
| `compliance/` | External policy compliance, app submission, regulatory alignment | 📋 Planned / queued | [README.md](compliance/README.md) |
| `developer-experience/` | SDK publishing, generated docs, tooling, strictness | 🔄 Active + queued execution | [README.md](developer-experience/README.md) |
| `connecting-oak-resources/` | Oak-owned resource integration and external Oak repo references | 🔄 Active | [README.md](connecting-oak-resources/README.md) |
| `exploring-open-education-resources/` | Third-party/non-Oak knowledge sources | 📋 Planned | [README.md](exploring-open-education-resources/README.md) |
| `sector-engagement/` | External data sources, partner review, EEF and KG adoption | 📋 Reference + active subthreads | [README.md](sector-engagement/README.md) |
| `discovery/` | Public agent/web discoverability of Oak machine surfaces | 🔄 Active + queued execution | [README.md](discovery/README.md) |
| `agentic-engineering-enhancements/` | Practice, governance, review, learning, evidence guards | 🔄 Active + queued execution | [README.md](agentic-engineering-enhancements/README.md) |
| `agent-tooling/` | `agent-tools/` workspace and collaboration-state substrate | 🔄 Active + queued execution | [README.md](agent-tooling/README.md) |
| `user-experience/` | Persona-level outcome contracts | 📋 Legacy/reference | [README.md](user-experience/README.md) |
| `icebox/` | Deferred/low-priority ideas | ⏸ Deferred | [icebox/](icebox/) |
| `archive/` | Historical completed/superseded plans | ✅ Reference | [archive/](archive/) |

---

## Update Rules

Update this file when:

- a new plan collection is created or retired;
- a cross-collection strategic index becomes authoritative;
- milestone state changes at M2/M3/M4 level;
- discovery, graph, MCP release, security, or observability posture changes in a
  way future sessions must see from the root.

Do not use this file for:

- task-level TODOs;
- branch-specific handoff detail;
- historical completion logs already captured in archives;
- duplicating the body of collection roadmaps.

When in doubt: link to the owning collection and make this file a map, not a
second source of truth.
