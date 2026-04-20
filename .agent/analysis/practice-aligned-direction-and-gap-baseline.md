# Practice-Aligned Direction and Gap Baseline

**Captured**: 2026-04-20
**Purpose**: Convert the four reconnaissance / synthesis notes that
came out of the practice-aligned project-directions research into an
**analysis-grade comparison matrix** that maps each external direction
signal to a repo-local Practice intention, the current mechanism, the
gap, and the recommended routing target. Companion to
[`governance-concepts-and-mechanism-gap-baseline.md`](./governance-concepts-and-mechanism-gap-baseline.md);
shares its analytical shape (mechanism-gap inventory + non-import
discipline + next-step candidates) and re-uses its vocabulary where
possible.

## Source notes

This baseline derives every claim from one of four already-cited
notes. Citations stay in the source notes; this baseline links to the
source-note section that carries the underlying primary-source bullet.

- **Slice A.** [`governance-plane-direction-of-travel.md`](../research/agentic-engineering/governance-planes-and-supervision/governance-plane-direction-of-travel.md)
  — trajectory analysis for 15 governance-plane projects, with five
  cross-project trajectory patterns.
- **Slice B.** [`agents-md-skills-and-plugins-direction-of-travel.md`](../research/agentic-engineering/operating-model-and-platforms/agents-md-skills-and-plugins-direction-of-travel.md)
  — practice-methodology ecosystem read (AGENTS.md, Agent Skills,
  plugin marketplaces, AAIF stewardship), with three cross-cutting
  patterns.
- **Slice D.** [`adjacent-enablers-direction-of-travel.md`](../research/agentic-engineering/operating-model-and-platforms/adjacent-enablers-direction-of-travel.md)
  — five-area read (evals, context engineering, observability, code
  review, VCS) with three cross-cutting patterns.
- **Slice C.** [`cross-lane-direction-survey.md`](../research/agentic-engineering/cross-lane-direction-survey.md)
  — re-read of A/B/D evidence routed by lane, with per-lane routing
  recommendations.

## Metacognitive framing

- **Thought**: At first read, four parallel slices look like four
  parallel research projects with little overlap.
- **Reflection**: They are actually **the same trajectory observed
  from four cuts**: governance projects, methodology primitives,
  adjacent enablers, and per-lane synthesis all point at one
  direction-of-travel, with five recurring patterns crossing all four
  cuts.
- **Insight**: The repo's intention surface (lanes, ADRs, deep dives,
  Practice Core) is **directionally well-aligned** with where the
  ecosystem went. The interesting work is therefore **mechanism
  uplift**, not direction change.
- **What changed**: The question changes from "which projects should
  we pay attention to?" to "which mechanism-uplift candidates are
  evidence-strong enough to enter the planning surface?".
- **Bridge from action to impact**: This baseline names those
  candidates, separates principles-without-dependency from
  patterns-needing-implementation, and routes each to a target
  surface. **No doctrine edits in this session.**

## What this baseline is

This baseline is the analysis-grade bridge between Slice A/B/C/D
research notes and the planning / ADR / deep-dive surfaces that own
mechanism uplift. It answers four questions in one matrix per
question:

1. **Where is the ecosystem going?** Five direction-of-travel patterns.
2. **What does each pattern map onto in this repo?** Practice
   intention surface mapping.
3. **Where is the mechanism gap, if any?** Mechanism-state column
   (present / partial / unnamed / missing / convergent).
4. **What is the routing target?** Concrete document / plan / ADR
   that owns the next move, **without** committing to it in this
   session.

## How the directions cluster

The 13 distinct trajectory signals across Slice A (5 cross-project),
Slice B (3 cross-cutting), and Slice D (3 cross-cutting) cluster into
**five durable direction families**. The clustering is repeated below
so each family is a stable analytical unit.

| Direction family | Source patterns drawn from |
| --- | --- |
| **Hardened persistence and untrusted state** | Slice A pattern 4 (untrusted-checkpoint-by-default in MS Agent Framework, LangGraph, Dapr) |
| **Schema-first declarative surfaces** | Slice A pattern 3 (Backstage catalog model, ADK Agent Registry, OpenAI Manifest, MCP JSON Schema 2020-12, MS Agent Framework reflection) |
| **Identity and OAuth modernisation** | Slice A pattern 5 (A2A device-code/PKCE, MCP RFC 9728, Backstage MCP PRM fix, Zuul OIDC URLs) |
| **Convergence on shared primitives + neutral steward** | Slice A pattern 2 (governance formalisation), Slice B patterns 1+3 (skills convergence, AAIF stewardship), Slice B §C/§E |
| **Telemetry + evals + supervision merging into one stack** | Slice D pattern 2 (OTel feedback-loop framing, Inspect sandbox + tool approval, Greptile per-team learning), Slice A pattern 1 (durable execution entering protocols), Slice D §A and §C |

The two left-over Slice patterns sit one tier below as
**vocabulary-and-distribution** signals rather than direction-of-travel
signals proper:

| Vocabulary / distribution signal | Source patterns |
| --- | --- |
| **Plugin marketplaces as the new artefact-distribution layer** | Slice B pattern 2 (Claude / Cursor plugin marketplaces) |
| **Context engineering as the named ecosystem discipline** | Slice D pattern 3 (Anthropic essay, vocabulary alignment) |

## Direction-of-travel × practice-intention × mechanism-gap matrix

This is the central matrix of the baseline. Every row is anchored to a
Slice A/B/C/D source-note section. The **status** column re-uses
[`governance-concepts-and-mechanism-gap-baseline.md`](./governance-concepts-and-mechanism-gap-baseline.md)'s
vocabulary (`present` / `partial` / `unnamed` / `missing` /
`convergent`) so the two baselines compose.

| Direction signal (external) | Practice intention (repo-local) | Current mechanism | Gap | Status | Routing target |
| --- | --- | --- | --- | --- | --- |
| Hardened persistence: untrusted state by default | safety-evidence + continuity boundary | repo persists JSONL transcripts, plain-markdown napkin and distilled — no binary or pickle surfaces yet | applicability surface absent today; principle worth adopting **when** binary / pickle / cross-trust persistence emerges | `defer` (with watch) | Note on [governance planes deep dive](../reference/agentic-engineering/deep-dives/governance-planes-trust-boundaries-and-runtime-supervision.md) watchlist; [continuity deep dive](../reference/agentic-engineering/deep-dives/continuity-and-knowledge-flow.md) flag |
| Hardened persistence: policy engine performs no normalisation; normalise once at perimeter | safety-evidence: enforcement posture | repo has no formal policy-engine surface; quality gates and reviewer routing serve a similar role inline | repo lacks an explicit policy-engine vs perimeter distinction | `unnamed` | Slice C → governance deep dive watchlist; potential `architectural-enforcement-adoption.plan.md` follow-on |
| Schema-first declarative surfaces (Backstage catalog model layer, ADK Agent Registry, OpenAI Manifest, MCP JSON Schema 2020-12, MS Agent Framework class-based skill reflection) | operating-model: schema-first execution cardinal rule | repo has OpenAPI-driven type generation in `apps/oak-curriculum-mcp-streamable-http`; Practice Core artefact shapes are folder-conventional, not JSON-Schema validated | Practice Core artefact shapes (skills, sub-agents, rules) are not yet JSON-Schema validated; Backstage's catalog model layer is the closest external analogue | `partial` | Backstage catalog model layer comparison note as a future research target; potential ADR amendment scope check on whether Layer 1 artefacts grow JSON Schemas |
| Identity / OAuth modernisation (RFC 9728 PRM, OIDC Discovery, device-code+PKCE) | governance-planes: identity perimeter | repo's MCP server is on Clerk + MCP Apps; Backstage `v1.50` PRM fix is direct prior art for the same surface | repo has no recorded RFC 9728 audit on its MCP PRM endpoint | `unnamed` | Reviewer-systems lane → schedule a Clerk-reviewer / MCP-reviewer pass against the MCP server's PRM endpoint; not blocking |
| Convergence on AGENTS.md + Agent Skills + plugin marketplaces under AAIF | operating-model: portability + cross-platform surface story | repo runs `CLAUDE.md` → `AGENT.md` → directives chain; `.agent/skills/` canonical with platform mirrors per ADR-125; Practice five-file package per ADR-124 | three convergent primitives are aligned with the repo's choices; **delta** is whether plugin-format wrappers (`.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`) should ship with the Practice package; whether plugin-manifest implementation extensions belong on Layer 1 | `convergent` | [`cross-platform-agent-surface-matrix.md`](../reference/cross-platform-agent-surface-matrix.md) refresh; ADR-124 amendment scope check; ADR-125 amendment scope check |
| Telemetry + evals + supervision merging (OTel GenAI, Inspect, Greptile per-team learning) | safety-evidence: evidence discipline; reviewer-systems: reviewer gateway | repo has Sentry + OpenTelemetry on the MCP server; evidence checks live inline in subagent prompts; reviewers do not learn from accept/reject signals | repo lacks **named, composable scorers**; lacks **per-team learning loops** in reviewer flow; lacks an explicit agent-application vs agent-framework convention split in observability | `partial` | Slice C reviewer-systems entry → `reviewer-gateway-upgrade.plan.md` scope expansion; Slice C safety-evidence entry → comparison note against Inspect scorer artefact shape |
| Durable execution entering interop protocols (MCP `tasks`, A2A `tasks/list`) | continuity / governance / operating-model | repo's MCP server does not yet expose long-running tools that need durable polling | applicability surface absent today; principle worth tracking **when** long-running MCP tools materialise | `defer` (with watch) | [continuity deep dive](../reference/agentic-engineering/deep-dives/continuity-and-knowledge-flow.md) watchlist; potential MCP-governance deep dive scope |
| Plugin marketplaces as artefact-distribution layer | operating-model: portability | Practice five-file package propagates via bootstrap script (ADR-124) | repo distribution surface does **not** ship plugin-format manifests | `partial` | ADR-124 amendment scope check on optional plugin-format wrappers |
| Context engineering as named discipline (Anthropic Sept 2025 essay) | continuity-memory-and-knowledge-flow | repo runs napkin, distilled, sub-agent dispatch — i.e. the three primitives the essay names | vocabulary divergence: repo names them by mechanism, ecosystem names them by function ("compaction", "structured note-taking", "multi-agent architectures") | `convergent` (vocabulary-only delta) | Vocabulary-alignment pass on continuity lane README, napkin SKILL.md, distilled surfaces — no behaviour change |
| Per-team learning loops on agent-native code review (Greptile) | reviewer-systems: reviewer gateway | reviewers do not currently learn from accept/reject signals on their suggestions | repo has no named feedback loop turning reviewer-suggestion outcomes into reviewer-prompt updates | `missing` | `reviewer-gateway-upgrade.plan.md` scope expansion |
| Machine-readable handoff between reviewer and main agent (Greptile "Fix in X") | reviewer-systems: reviewer gateway | reviewer subagents return prose; main agent implements informally | repo has no machine-readable file-path + line-number reviewer-suggestion artefact | `missing` | `reviewer-gateway-upgrade.plan.md` scope expansion |
| Commit attribution as a first-class agent-VCS concern (Aider `(aider)` author/committer; opt-in `Co-authored-by`) | safety-evidence + continuity | repo has no formal commit-attribution convention for agent-authored commits | repo lacks a documented agent-attribution convention | `missing` | ADR amendment scope check on agent-authored commit attribution |
| Dirty-file separation before agent edits (Aider auto-commit pre-edit) | safety-evidence | repo has no formal dirty-file pre-commit convention | repo lacks a transferable safety primitive present in adopter tooling | `missing` | `hallucination-and-evidence-guard-adoption.plan.md` scope expansion candidate |
| Worktree-isolated parallel agents (Mux, Emdash) | safety-evidence + operating-model | repo has [`worktrees` skill](../skills/worktrees/SKILL.md) | direction is **convergent**; no action indicated | `convergent` | None |
| Inspect solver/scorer/task as eval composition unit | safety-evidence: evidence discipline | repo has inline evidence checks in subagent prompts; no named, composable scorer artefact | repo has the function but not the **named, composable artefact shape**; sandboxing-as-eval-primitive absent | `partial` | Comparison note against Inspect scorer artefact shape; potential `architectural-enforcement-adoption.plan.md` neighbour |

## Lane × signal coverage matrix

A second matrix recasts the same signals **per lane**, so each lane
sees the relevant gaps without scrolling. Cells are blank where the
signal does not bear on the lane.

| Direction signal | operating-model | governance-planes | reviewer-systems | safety-evidence | continuity | derived-memory |
| --- | --- | --- | --- | --- | --- | --- |
| Hardened persistence: untrusted state | | watch | | watch | watch | |
| Policy-engine perimeter purity | | watch | | candidate | | |
| Schema-first declarative surfaces | refresh matrix | watch | | | | candidate (Backstage analogue) |
| Identity / OAuth modernisation | | candidate | candidate | | | |
| Three-primitive convergence + AAIF | refresh + ADR-124/125 deltas | | | | | |
| Telemetry + evals + supervision merging | watch | watch (OTel agent-app/framework split) | candidate (per-team learning) | candidate (Inspect scorers) | | |
| Durable execution in interop protocols | | watch (MCP) | | | watch | |
| Plugin marketplaces as distribution | candidate (ADR-124 wrappers) | | | | | |
| Context engineering vocabulary | | | | | candidate (vocabulary-only) | |
| Per-team reviewer learning loops | | | candidate | | | |
| Machine-readable reviewer handoff | | | candidate | | | |
| Commit attribution | | | | candidate (ADR scope) | | |
| Dirty-file pre-commit | | | | candidate | | |
| Worktree-isolated parallel agents | convergent | | | convergent | | |
| Inspect scorer artefact shape | | | | candidate | | |

Three observations from the lane × signal matrix:

1. **safety-evidence collects the most candidates** (5 candidates +
   1 watch). The lane's existing
   [augmented-engineering-safety.research.md](../plans/agentic-engineering-enhancements/augmented-engineering-safety.research.md)
   and
   [hallucination-and-evidence-guard-adoption.plan.md](../plans/agentic-engineering-enhancements/current/hallucination-and-evidence-guard-adoption.plan.md)
   are the natural homes for most of them.
2. **reviewer-systems collects the most coherent cluster** (3
   candidates, all from the same external source family — agent-native
   code review). The
   [reviewer-gateway-upgrade.plan.md](../plans/agentic-engineering-enhancements/current/reviewer-gateway-upgrade.plan.md)
   is the natural home and could absorb all three in a single scope
   expansion.
3. **derived-memory collects the fewest candidates** (1, candidate
   only). Confirms Slice C's read that this lane has the thinnest
   external direction signal in this survey and would benefit from a
   scoped future research pass.

## Status legend reuse

| Status | Meaning (re-used from governance baseline) |
| --- | --- |
| `present` | Mechanism exists and is named |
| `convergent` | Repo direction matches ecosystem direction; no action indicated |
| `partial` | Mechanism exists but is incomplete or unnamed |
| `unnamed` | Mechanism present but lacks a stable name / surface |
| `missing` | Mechanism does not exist locally |
| `defer` (with watch) | Mechanism is principled but applicability surface absent today |

## What not to import (discipline)

Repeating the discipline from
[`governance-concepts-and-mechanism-gap-baseline.md`](./governance-concepts-and-mechanism-gap-baseline.md)
in this baseline's terms; several signals are **principled but not
yet applicable**, and importing them prematurely would create
mechanisms without a problem.

- **Untrusted-state-by-default before binary surfaces exist.** The
  principle is right; the applicability surface is not yet present in
  this repo. Importing the mechanism now would be ceremony without
  evidence.
- **Inspect-style sandboxing primitives before scorer artefacts
  exist.** Sandboxing is a property of the substrate; the repo's
  evidence checks need to **first** be named composable artefacts,
  **then** the substrate question can be asked.
- **Plugin marketplace install paths before the bootstrap-script
  flow proves insufficient.** ADR-124's bootstrap-script
  distribution is working; plugin-format wrappers are only worth
  shipping if they unlock a propagation surface the script cannot
  reach.
- **Per-team reviewer learning loops before the reviewer-suggestion
  artefact is machine-readable.** The two reviewer-systems candidates
  have a dependency order — the artefact-shape change should come
  first, the learning loop second.
- **Vocabulary changes that change naming without changing
  clarity.** The "context engineering" vocabulary alignment passes
  this test; any further vocabulary import must too.
- **Source-specific names, branded labels, or product taxonomies.**
  Same discipline as the governance baseline.

## High-impact next-step candidates

Ordered by **evidence strength × repo readiness**, not by importance.

1. **Reviewer-systems cluster** (3 candidates, single owner): expand
   `reviewer-gateway-upgrade.plan.md` scope to cover (i)
   machine-readable reviewer-suggestion artefact, (ii) per-team
   learning loop, (iii) RFC 9728 PRM audit. Single coherent uplift,
   high signal density.
2. **Inspect scorer comparison note**: short comparison note (not
   adoption) of repo's inline evidence-check shape against Inspect's
   named, composable scorer surface. Routes to safety-evidence lane.
3. **Vocabulary-alignment pass on continuity lane**: rename
   mechanism surfaces (napkin, distilled) externally with the
   ecosystem-shared "compaction", "structured note-taking",
   "just-in-time retrieval" terms. No behaviour change.
4. **Cross-platform surface matrix refresh**: collapse the surface
   matrix's columns onto the convergent primitives (AGENTS.md, Agent
   Skills, plugin marketplaces). Routes to operating-model lane.
5. **ADR-124 / ADR-125 amendment scope check**: scope-only check on
   (i) optional plugin-format wrappers for the Practice five-file
   package, (ii) plugin-manifest implementation extensions on Layer 1
   vs Layer 2.
6. **MCP-governance deep dive (downstream plan candidate)**: MCP
   `2025-11-25` is the highest-signal substrate change for this repo;
   a dedicated deep dive would absorb the durable-tasks, OAuth-
   modernisation, and SDK-tiering signals together.
7. **Backstage catalog model layer comparison note (low priority,
   high specificity)**: short comparison against the repo's
   schema-first execution rule and OpenAPI-driven type generation.
   Routes to derived-memory + operating-model.
8. **Agent-VCS commit-attribution ADR scope check**: scope-only
   check on whether agent-authored commits should grow explicit
   attribution metadata. Small change with clear evidence value.

## Non-adoption and defer signals

- **Defer untrusted-checkpoint mechanisms** until the repo grows a
  binary or pickle persistence surface to harden.
- **Defer durable-task interop** until the MCP server grows
  long-running tools.
- **Defer policy-engine-perimeter mechanism** until an explicit
  policy surface materialises (current quality-gate + reviewer-routing
  flow does not yet warrant a separate engine).
- **Defer dirty-file pre-commit** until the repo grows agent-driven
  flows that routinely touch user-modified files in flight.
- **Reject any ADR that adds a marketplace dependency** without
  evidence the bootstrap-script propagation surface is insufficient.

## Top unresolved question

The single most consequential question this baseline does not answer:

> **Is the repo's existing planning surface
> (`agentic-engineering-enhancements/`) sized to absorb this many
> uplift candidates without churning into low-signal work?**

Eight high-impact candidates is a lot. The reviewer-systems cluster
alone is a coherent expansion; the others are individually small but
collectively meaningful. A scope-and-sequencing pass on the existing
plans surface should precede picking up any of these candidates.
**Out of scope for this session.**

## Scope declaration

- This baseline is **research/reporting only**. No doctrine edits, no
  ADR amendments, no plan content changes were made in this session.
- Every routing target named is a **candidate**, not a commitment.
- Decision authority remains with the relevant lane README owner,
  ADR owner, and plan owner.
- This baseline pairs with
  [`governance-concepts-and-mechanism-gap-baseline.md`](./governance-concepts-and-mechanism-gap-baseline.md);
  the two together cover (a) abstract governance vocabulary and (b)
  ecosystem direction-of-travel respectively.
