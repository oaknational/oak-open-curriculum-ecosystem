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
| [telemetry-and-understanding/roadmap.md](telemetry-and-understanding/roadmap.md) | TAU: the next-priority outcome-led path from telemetry through analysis to product and operational understanding |
| [vision-strategy-and-plan-estate.plan.md](product-development-governance/vision-strategy-and-plan-estate.plan.md) | Controlling plan for the experiment→product arc: three co-equal bodies (vision · strategy · plan-estate) on a four-layer informational model (homed in the product-development-governance collection; imported analysis suggestions sit subordinate under that collection's `suggestions/`) |
| [curriculum-mcp-path-to-ga/roadmap.md](curriculum-mcp-path-to-ga/roadmap.md) | MCP HTTP server M1 → M2 → M3 → GA coordination |
| [curriculum-mcp-path-to-ga/launch-readiness-framework.md](curriculum-mcp-path-to-ga/launch-readiness-framework.md) | What "live product" means for the MCP app: readiness dimensions, keystone owner decisions, candidate M4/GA gates |
| [curriculum-mcp-path-to-ga/future/launch-readiness-and-milestone-redefinition.plan.md](curriculum-mcp-path-to-ga/future/launch-readiness-and-milestone-redefinition.plan.md) | Future stub: redraft the milestone ladder impact-first and drive launch-readiness to GA (owner-promotion gated) |
| [discovery/README.md](discovery/README.md) | Agent/web discoverability of Oak machine surfaces |
| [milestones/](../milestones/) | Per-milestone summaries: audience, value, gates |
| [.agent/directives/](../directives/) | Foundation documents and canonical directives |
| [../plans/templates/README.md](../plans/templates/README.md) | Current plan templates and reusable components |

---

## Planning Assessment Inputs

These artefacts are not executable plans. They are routed assessment inputs
that deserve explicit triage before any practical plan is cut from them.

| Assessment | Planning question | Likely owning surfaces |
|---|---|---|
| [Oak Repository Professionalism and Engineering Quality Report — 2026-06-03](../reports/oak-repo-professionalism-engineering-quality-report-2026-06-03.md) | Can its improvement roadmap become one or more practical plans without weakening the repo's existing engineering discipline? | [architecture-and-infrastructure/current](architecture-and-infrastructure/current/README.md), [developer-experience/current](developer-experience/current/README.md), [agentic-engineering-enhancements/current](agentic-engineering-enhancements/current/README.md), [agent-tooling](agent-tooling/README.md) |
| [MCP App Live-Product Readiness — 2026-06-15](../reports/mcp-app-live-product-readiness-assessment-2026-06-15.md) | What must be true (product, safety, compliance, experience, operations, whole-estate) before the MCP app is a live product, and does the milestone ladder still stand? | [curriculum-mcp-path-to-ga/](curriculum-mcp-path-to-ga/roadmap.md), [milestones/](../milestones/), [security-and-privacy/](security-and-privacy/README.md), [telemetry-and-understanding/](telemetry-and-understanding/README.md), [observability/](observability/README.md) |

---

## Proposal Records

Imported analysis (suggestions, explorations, conversation-starters) from a parallel
project context now lives in the
[`product-development-governance/`](product-development-governance/README.md) collection,
under [`suggestions/`](product-development-governance/suggestions/) — subordinate to that
collection's agreed, active controlling plan, not authority in their own right. They are
held until accepted, rejected, merged into existing models, promoted into
directives/templates/ADRs, or decomposed into practical plans. See the
[collection README](product-development-governance/README.md) for the full set and its
disposition.

---

## Plan Collections

| Collection | Purpose | Status |
|---|---|---|
| [curriculum-mcp-path-to-ga/](curriculum-mcp-path-to-ga/roadmap.md) | Thin strategic index for the Curriculum MCP HTTP server release arc; coordinates M2/M3/GA gates across collections and owns no execution | 🔄 Active strategic index |
| [semantic-search/](semantic-search/) | Hybrid semantic search, ingestion, retrieval quality, search/graph adjacency, and search-facing SDK/MCP support | 🔄 Current queue |
| [school-data-search/](school-data-search/) | Oak School Data Search service POC MVP: UK school-register ingestion, canonical dataset, authenticated search API, typed client — built in-repo until a post-POC go/no-go | 📋 Queued (owner gates first) |
| [sdk-and-mcp-enhancements/](sdk-and-mcp-enhancements/) | MCP Apps, MCP protocol adoption, generated SDK/tool surfaces, and OpenAPI-to-MCP pipeline evolution | 🔄 Active + queued execution |
| [telemetry-and-understanding/](telemetry-and-understanding/README.md) | TAU planning corpus is accepted and queued; controlling authority awaits Stage 0 disposition and recorded owner ratification; implementation has not started | 🟢 Next priority / current plan; implementation not started |
| [observability/](observability/) | Inherited five-axis observability estate awaiting TAU Stage 0 disposition before any owner-ratified authority transfer: engineering, product, usability, accessibility, and security signal plans and evidence | 🔄 Active transition proposal |
| [architecture-and-infrastructure/](architecture-and-infrastructure/) | Cross-cutting architecture, workspace boundaries, quality gates, infrastructure, and system quality | 🔄 Active backlog |
| [security-and-privacy/](security-and-privacy/) | Security controls, privacy posture, security claim evidence, Cloudflare MCP gate, and Web Bot Auth enforcement evidence | 🔄 Active execution |
| [compliance/](compliance/) | External policy compliance, platform submission, directory listing requirements, and regulatory/documentation alignment | 📋 Planned / queued |
| [developer-experience/](developer-experience/) | SDK publishing, generated docs, tooling ergonomics, strictness, and developer-facing quality | 🔄 Active + queued execution |
| [connecting-oak-resources/](connecting-oak-resources/) | Oak-owned resource integration: ontology, graph surfaces, Aila/reference repos, and internal Oak KG work | 🔄 Active |
| [exploring-open-education-resources/](exploring-open-education-resources/) | Third-party and non-Oak knowledge sources that Oak applications may consume | 📋 Planned |
| [sector-engagement/](sector-engagement/) | External data sources, partner review, upstream coordination, EEF, and KG adoption support | 📋 Reference + active subthreads |
| [upstream-feature-requests/](upstream-feature-requests/) | Feature requests this repo raises for other Oak teams' repositories (Oak Open Curriculum API, Oak Skills) — one folder per team, one file per request; recorded here and handed over | 📋 Reference + coordination |
| [discovery/](discovery/) | Public discoverability of Oak machine surfaces: API catalog, Agent Skills, MCP Server Cards, A2A, DNS-AID, WebMCP, Web Bot Auth, robots/sitemaps, and `.well-known` metadata | 🔄 Active + queued execution |
| [effectiveness-and-impact/](effectiveness-and-impact/) | How Oak knows its agent-facing surfaces work and deliver value: assessment/eval methodology for the MCP content corpus, review + eval protocols, and the internal-assurance→real-world-impact evidence chain | 📋 Queued (research plan landed; execution owner-gated) |
| [agentic-engineering-enhancements/](agentic-engineering-enhancements/) | Practice/governance layer: how agents collaborate, plan, communicate, review, learn, and improve the repo | 🔄 Active + queued execution |
| [agent-tooling/](agent-tooling/) | Implementation layer for the `agent-tools/` workspace, collaboration-state substrate, hooks, CLIs, schemas, and adapter generation | 🔄 Active + queued execution |
| [user-experience/](user-experience/) | Persona-level outcome contracts and UX reference material | 📋 Legacy/reference |
| `icebox/` | Deferred/low-priority ideas with promotion triggers | ⏸ Deferred |
| `archive/` | Historical completed/superseded plans | ✅ Reference |
| [../plans/templates/](../plans/templates/) | Plan templates and reusable components | 📚 Reference |

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
Historical citations may link to `archive/completed/`; live navigation
should point to the current owner, not make an archived plan load-bearing
again. (There is no manually-maintained completed-plans index — ADR-200 retired
it; completed work is discovered via the relocated archive and the intent
idea-graph.)

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
index. One **temporary** second root exception is sanctioned:
`vision-strategy-and-plan-estate.plan.md`, the controlling plan for the
experiment→product arc, linked directly from root until its estate-restructure body
decides its permanent home (it governs the restructure that places it). No other
root-level plan exception is permitted without amending this invariant. Graph
work is reached through its collections —
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
- **TAU is proposed to own the evidence-to-understanding loop after Stage 0.**
  [telemetry-and-understanding/](telemetry-and-understanding/README.md) is
  proposed to own question registration, event semantics, PostHog delivery,
  Sentry reconciliation, analysis surfaces, and cross-layer sequencing after
  its authority gate. The
  [observability/](observability/README.md) collection remains the detailed
  inherited implementation/evidence estate until each lane is dispositioned.
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
   [consolidate-docs](../skills/knowledge/consolidate-docs/SKILL-CANONICAL.md).

---

## Status Indicators

| Status | Meaning |
|---|---|
| 📋 Planned | Not started or queued but not executing |
| 📝 Proposal | Recorded proposal awaiting triage, acceptance, rejection, merge, or decomposition |
| 🔬 In Progress | Actively being worked on |
| 🔄 Active | Active collection or mixed active surface |
| ⏸ Blocked/Deferred | Waiting on dependency or deprioritised |
| ✅ Complete | Done |
| ❌ Abandoned | Will not implement |
| 📚 Reference | Reference-only material or navigation surface |
| ⛔ Superseded | Replaced by a newer canonical artefact |

---

## Creating Or Restructuring Collections

Use [../plans/templates/README.md](../plans/templates/README.md) as the source of truth for plan
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
