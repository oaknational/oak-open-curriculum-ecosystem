# Plans

Strategic and tactical planning documents for the Oak Open Curriculum
Ecosystem.

This is the root operational index for `.agent/plans/`. It answers:

- where to start;
- which collection owns a topic;
- how lifecycle directories work;
- how every plan stays reachable from the root.

For the strategic overview, use [high-level-plan.md](high-level-plan.md).

---

## Start Here

| Entry | Purpose |
|---|---|
| [high-level-plan.md](high-level-plan.md) | Strategic cross-collection overview |
| [curriculum-mcp-path-to-ga/roadmap.md](curriculum-mcp-path-to-ga/roadmap.md) | MCP HTTP server M1 → M2 → M3 → GA coordination |
| [discovery/README.md](discovery/README.md) | Agent/web discoverability of Oak machine surfaces |
| [milestones/](../milestones/) | Per-milestone summaries: audience, value, gates |
| [completed-plans.md](completed-plans.md) | Completed plan index |
| [.agent/directives/](../directives/) | Foundation documents and canonical directives |
| [templates/README.md](templates/README.md) | Current plan templates and reusable components |

---

## Plan Collections

| Collection | Purpose | Status |
|---|---|---|
| [curriculum-mcp-path-to-ga/](curriculum-mcp-path-to-ga/roadmap.md) | Thin strategic index for the Curriculum MCP HTTP server release arc; coordinates M2/M3/GA gates across collections and owns no execution | 🔄 Active strategic index |
| [semantic-search/](semantic-search/) | Hybrid semantic search, ingestion, retrieval quality, search/graph adjacency, and search-facing SDK/MCP support | 🔄 Current queue |
| [sdk-and-mcp-enhancements/](sdk-and-mcp-enhancements/) | MCP Apps, MCP protocol adoption, generated SDK/tool surfaces, and OpenAPI-to-MCP pipeline evolution | 🔄 Active + queued execution |
| [observability/](observability/) | Five-axis observability under ADR-162: engineering, product, usability, accessibility, and security signals | 🔄 Active |
| [architecture-and-infrastructure/](architecture-and-infrastructure/) | Cross-cutting architecture, workspace boundaries, quality gates, infrastructure, and system quality | 🔄 Active backlog |
| [security-and-privacy/](security-and-privacy/) | Security controls, privacy posture, security claim evidence, Cloudflare MCP gate, and Web Bot Auth enforcement evidence | 🔄 Active execution |
| [compliance/](compliance/) | External policy compliance, platform submission, directory listing requirements, and regulatory/documentation alignment | 📋 Planned / queued |
| [developer-experience/](developer-experience/) | SDK publishing, generated docs, tooling ergonomics, strictness, and developer-facing quality | 🔄 Active + queued execution |
| [connecting-oak-resources/](connecting-oak-resources/) | Oak-owned resource integration: ontology, graph surfaces, Aila/reference repos, and internal Oak KG work | 🔄 Active |
| [exploring-open-education-resources/](exploring-open-education-resources/) | Third-party and non-Oak knowledge sources that Oak applications may consume | 📋 Planned |
| [sector-engagement/](sector-engagement/) | External data sources, partner review, upstream coordination, EEF, and KG adoption support | 📋 Reference + active subthreads |
| [discovery/](discovery/) | Public discoverability of Oak machine surfaces: API catalog, Agent Skills, MCP Server Cards, A2A, DNS-AID, WebMCP, Web Bot Auth, robots/sitemaps, and `.well-known` metadata | 🔄 Active + queued execution |
| [agentic-engineering-enhancements/](agentic-engineering-enhancements/) | Practice/governance layer: how agents collaborate, plan, communicate, review, learn, and improve the repo | 🔄 Active + queued execution |
| [agent-tooling/](agent-tooling/) | Implementation layer for the `agent-tools/` workspace, collaboration-state substrate, hooks, CLIs, schemas, and adapter generation | 🔄 Active + queued execution |
| [user-experience/](user-experience/) | Persona-level outcome contracts and UX reference material | 📋 Legacy/reference |
| [icebox/](icebox/) | Deferred/low-priority ideas with promotion triggers | ⏸ Deferred |
| [archive/](archive/) | Historical completed/superseded plans | ✅ Reference |
| [templates/](templates/) | Plan templates and reusable components | 📚 Reference |

---

## Lifecycle Taxonomy

Use the lifecycle directory as a status contract before reading a plan body.

| Directory | Meaning | Plan Form | Rule |
|---|---|---|---|
| `active/` | **NOW** - in-progress execution | Executable | Only work being executed now belongs here. Update `active/README.md` as the execution index. |
| `current/` | **NEXT** - queued and ready, not started | Executable | Move to `active/` before execution starts. Update both indexes. |
| `future/` | **LATER** - deferred strategic intent | Strategic | Promote to `current/` before writing executable tasks or claiming readiness. |
| `archive/completed/` | **DONE** - completed, read-only history | Archived | Extract durable outcomes before archiving. Do not keep editing historical plans. |

`current/` is not "currently active". It means next-up executable work.
`active/` is the only lifecycle lane for work in progress.

---

## Reachability Invariant

Every plan file must be reachable from this root README through an index chain:

```text
.agent/plans/README.md
  -> {collection}/README.md
    -> {collection}/{active|current|future}/README.md
      -> {plan-file}.md
```

The strategic cross-collection index `high-level-plan.md` is linked directly
from this root; every other plan is reached through its owning collection's
index. Graph work is reached through its collections —
`connecting-oak-resources/knowledge-graph-integration/` for graph substrate and
Oak graph surfaces, and `sector-engagement/eef/` for the EEF evidence tool — not
through standalone root-level spine files.

The invariant is structural, not cosmetic: unindexed plans are invisible to
handoff, review, consolidation, and priority-setting.

---

## Cross-Collection Boundaries

- **Execution detail belongs to collection plans.** `high-level-plan.md` and
  `curriculum-mcp-path-to-ga/roadmap.md` coordinate, but do not replace owning
  active/current plans.
- **Discovery is about being found.** Runtime MCP tools, SDK generation, and
  tool schemas belong in [sdk-and-mcp-enhancements/](sdk-and-mcp-enhancements/);
  public web/agent discoverability belongs in [discovery/](discovery/).
- **Security evidence has an owner.** Discovery may name Web Bot Auth as an
  agent-readiness surface, but [security-and-privacy/](security-and-privacy/)
  owns edge enforcement evidence and security-control claims.
- **Agent practice and agent tooling are separate.**
  [agentic-engineering-enhancements/](agentic-engineering-enhancements/) owns
  doctrine and practice; [agent-tooling/](agent-tooling/) owns the
  implementation substrate.
- **Oak-owned and third-party knowledge sources are separate.**
  [connecting-oak-resources/](connecting-oak-resources/) handles Oak resources;
  [exploring-open-education-resources/](exploring-open-education-resources/)
  handles third-party/non-Oak sources; EEF lives under
  [sector-engagement/](sector-engagement/).

---

## Related Directories

| Directory | Purpose | Relationship |
|---|---|---|
| [.agent/research/](../research/) | Research proposals, reports, source analysis | Informs plans; not executable by itself |
| [.agent/evaluations/](../evaluations/) | Experiment results and evaluation guidance | Validates or motivates plans |
| [.agent/prompts/](../prompts/) | AI-session entry points | May implement or resume plans |
| [.agent/directives/](../directives/) | Canonical agent directives | Foundation rules for all work |
| [docs/architecture/architectural-decisions/](../../docs/architecture/architectural-decisions/) | ADRs | Durable architecture decisions |

---

## Maintenance Checklist

When adding, promoting, or retiring plan work:

1. Add or update the collection README.
2. Add or update the relevant lifecycle index: `active/README.md`,
   `current/README.md`, or `future/README.md`.
3. Update this root README if a collection, top-level spine, or strategic
   routing rule changes.
4. Update [high-level-plan.md](high-level-plan.md) only if the strategic
   cross-collection picture changes.
5. Keep the plan body and lifecycle lane aligned. A `future/` plan cannot be
   treated as executable until promoted.
6. Before archiving, extract settled durable documentation to ADRs, `/docs/`,
   collection READMEs, or other permanent homes, then apply
   [consolidate-docs](../skills/consolidate-docs/SKILL-CANONICAL.md).

---

## Status Indicators

| Status | Meaning |
|---|---|
| 📋 Planned | Not started or queued but not executing |
| 🔬 In Progress | Actively being worked on |
| 🔄 Active | Active collection or mixed active surface |
| ⏸ Blocked/Deferred | Waiting on dependency or deprioritised |
| ✅ Complete | Done |
| ❌ Abandoned | Will not implement |
| 📚 Reference | Reference-only material or navigation surface |
| ⛔ Superseded | Replaced by a newer canonical artefact |

---

## Creating Or Restructuring Collections

Use [templates/README.md](templates/README.md) as the source of truth for plan
templates and reusable components.

Minimum collection shape:

```text
.agent/plans/{collection-name}/
├── README.md
├── active/README.md      # if active execution exists
├── current/README.md     # if queued executable work exists
├── future/README.md      # if strategic backlog exists
└── archive/completed/    # once completed plans exist
```

When creating a collection, update both this file and
[high-level-plan.md](high-level-plan.md) if the collection is strategically
important enough to affect cross-collection orientation.
