# Cross-lane direction survey

> **Slice C umbrella note.** Re-reads the trajectory evidence already
> assembled by Slice A
> ([governance-plane-direction-of-travel.md](./governance-planes-and-supervision/governance-plane-direction-of-travel.md)),
> Slice B
> ([agents-md-skills-and-plugins-direction-of-travel.md](./operating-model-and-platforms/agents-md-skills-and-plugins-direction-of-travel.md)),
> and Slice D
> ([adjacent-enablers-direction-of-travel.md](./operating-model-and-platforms/adjacent-enablers-direction-of-travel.md))
> through the lens of each existing research lane. One section per lane.
>
> Lives at the lane root rather than in any single lane because it is
> deliberately cross-cutting and exists to **route** Slice A/B/D
> evidence into per-lane work. Per the assumptions-reviewer fence, **no
> new lane is created** in this session.

## Why this note exists

Slices A, B, and D each looked at a vertical slab of the ecosystem
(governance-plane projects, practice-methodology primitives, adjacent
enablers). This note inverts the cut: for each existing research lane,
it surfaces the strongest external direction signals from the three
source notes that bear on that lane's intentions, and records what each
signal implies for the lane's near-term routing.

Every claim in this note is **derivative of an already-cited
primary-source bullet in Slice A, B, or D** — citations stay in those
source notes; this note links to them rather than re-listing them.
Where a lane has thin or absent direction signal, that is named
explicitly. Inferences and routing recommendations are kept distinct
from evidence in every paragraph.

Scope is **routing-grade synthesis**, not doctrine recommendation. No
ADR amendments are produced here. Every recommendation is a "this is a
candidate for further work" pointer. Decision authority remains with
the lane README owner and the relevant ADR/plan owner.

## Method and lane order

Lanes are surveyed in the order they appear in
[`README.md`](./README.md), then `derived-memory-and-graph-navigation`
(which has the thinnest external signal) last. Each section follows a
fixed shape:

1. **Strongest direction signal(s)** for this lane — terse, one to
   three named patterns drawn from Slice A/B/D, each linked to its
   source-note section.
2. **What the signals say.** A single paragraph that names what the
   ecosystem is moving toward for this lane's intention surface.
3. **Repo-local implications and routing.** One to three concrete
   "what this means for this lane's existing work" pointers, with
   target documents named.
4. **Trajectory weakness or omissions.** What this lane's direction
   read **does not** cover yet, called out so future passes know what
   to widen.

## A. Operating Model and Platforms

### Strongest direction signals

- **Skills-as-unit-of-capability convergence is real and fast.** Cursor
  merged dynamic rules and commands into skills; Claude Code merged
  custom commands into skills; both expose `/skill-name` as the
  universal invocation; 30+ products co-exist on the Agent Skills spec
  with overlapping but compatible extensions
  ([Slice B §B and §C](./operating-model-and-platforms/agents-md-skills-and-plugins-direction-of-travel.md)).
- **Plugin marketplaces are the new distribution layer for artefact
  bundles.** Claude Code and Cursor independently arrived at the same
  shape: manifest at root, namespaced skills, bundled `(skills +
  agents + commands + hooks + MCP servers)`, marketplace with manual
  review, team-controlled subset
  ([Slice B §C](./operating-model-and-platforms/agents-md-skills-and-plugins-direction-of-travel.md#c-plugin-marketplaces)).
- **AAIF is the new neutral steward** for AGENTS.md, MCP, and goose —
  three of the primitives this lane's surface matrix already maps
  ([Slice B §E](./operating-model-and-platforms/agents-md-skills-and-plugins-direction-of-travel.md#e-aaif-as-the-new-neutral-steward)).
- **Cross-tool path normalisation has stabilised at the consumer
  side.** Cursor loads skills from `.agents/`, `.cursor/`, `.claude/`,
  `.codex/` interchangeably; the singular-vs-plural divergence is
  treated as solved by tools rather than by adopters
  ([Slice B §D](./operating-model-and-platforms/agents-md-skills-and-plugins-direction-of-travel.md#d-cross-tool-path-normalisation)).

### What the signals say

The platforms layer this lane was first written against has done two
things in parallel during 2026: (i) **converged on a shared primitive
set** (AGENTS.md + Agent Skills + plugin marketplaces), and (ii)
**moved governance of those primitives under a single neutral
steward** (AAIF). The repo's three-layer model (canonical `.agent/`,
thin per-platform wrappers, root entry-point) was designed against
fragmentation that has measurably eased.

### Repo-local implications and routing

- The
  [`cross-platform-agent-surface-matrix.md`](../../reference/cross-platform-agent-surface-matrix.md)
  is now slightly **out-of-date in shape**: it pre-dates the skills
  convergence and the plugin-marketplace direction. A refresh that
  collapses the surface columns into the current convergent primitives
  is a worthwhile near-term update; not blocking.
- ADR-125's three-layer artefact-portability model is **convergent
  with where the ecosystem went** — no structural change indicated;
  the open delta is whether plugin-manifest implementation extensions
  (`paths`, `context: fork`, `disable-model-invocation`,
  `allowed-tools`, `hooks`) belong on canonical Layer 1 or stay in
  Layer 2 wrappers
  ([Slice B routing recommendations](./operating-model-and-platforms/agents-md-skills-and-plugins-direction-of-travel.md#repo-local-implications-and-routing)).
- ADR-124's Practice five-file package is **conceptually a plugin**;
  worth scoping whether the package should also ship with
  `.claude-plugin/plugin.json` and `.cursor-plugin/plugin.json` so it
  can propagate via plugin install, not only via the bootstrap script.
- AAIF blog and event recordings (MCP-NA April 2026, MCP-Europe
  September 2026) are now a **higher-signal source for direction-of-
  travel reads** for the three primitives this lane tracks than
  individual project release notes; worth adding to the lane's
  watchlist surfaces.

### Trajectory weakness or omissions

This lane's external read does not yet cover **agent-marketplace
quality / review processes** (manual-review SLAs, deprecation policy,
malicious-skill detection). Adopter side is well-cited; producer-side
governance is not.

## B. Governance Planes and Supervision

### Strongest direction signals

- **Governance is being formalised inside the projects themselves.**
  MCP `2025-11-25` formalised governance, Working Groups, Interest
  Groups, and SDK tiering in the same revision that added durable
  tasks; AGT v3.x consolidates onto a single CLI with plugin entry
  points and a governance dashboard
  ([Slice A §Cross-project pattern 2](./governance-planes-and-supervision/governance-plane-direction-of-travel.md#cross-project-trajectory-patterns)).
- **Persisted state is being treated as untrusted by default.** MS
  Agent Framework `1.0.1` restricts checkpoint deserialisation through
  an explicit allow-list; LangGraph `4.0.2` documents
  `LANGGRAPH_STRICT_MSGPACK` for checkpoint security; Dapr's April
  2026 fix moves all path normalisation to the perimeter
  ([Slice A §Cross-project pattern 4](./governance-planes-and-supervision/governance-plane-direction-of-travel.md#cross-project-trajectory-patterns)).
- **Identity and OAuth are being modernised in lockstep.** A2A `1.0.0`
  removes implicit/password OAuth, adds device code + PKCE; MCP
  `2025-11-25` adds OIDC Discovery 1.0, OAuth Client ID Metadata
  Documents, RFC 9728 alignment; Backstage `v1.50` fixes its MCP OAuth
  2.0 PRM endpoint; Zuul standardises OIDC URLs
  ([Slice A §Cross-project pattern 5](./governance-planes-and-supervision/governance-plane-direction-of-travel.md#cross-project-trajectory-patterns)).
- **Schema-first declarative surfaces are spreading.** Backstage
  catalog model layer (JSON Schema), ADK Agent Registry, OpenAI
  Manifest, MCP `JSON Schema 2020-12` default dialect (SEP-1613), MS
  Agent Framework class-based skill reflection
  ([Slice A §Cross-project pattern 3](./governance-planes-and-supervision/governance-plane-direction-of-travel.md#cross-project-trajectory-patterns)).
- **OpenTelemetry GenAI semconv splits agent-application vs
  agent-framework conventions** — i.e. the observability substrate
  has explicitly named the layer boundary that supervision systems
  need to respect
  ([Slice D §C](./operating-model-and-platforms/adjacent-enablers-direction-of-travel.md#c-agent-native-observability-practice-intention-supervision-before-side-effects)).

### What the signals say

The 2026 direction across governance-plane projects is **uniformly
toward harder boundaries** at three layers: (i) the persistence
boundary (untrusted-checkpoint posture); (ii) the identity boundary
(strict OIDC / OAuth alignment, RFC 9728); (iii) the policy boundary
(policy engines kept pure, normalisation pushed to the perimeter).
This is the same shape this lane's existing
[mechanism-gap baseline](../../analysis/governance-concepts-and-mechanism-gap-baseline.md)
already names — the ecosystem is moving in the direction this lane has
been arguing for.

### Repo-local implications and routing

- **MCP is the single highest-signal project for this lane.** The
  `2025-11-25` revision changes the substrate the
  `apps/oak-curriculum-mcp-streamable-http` server stands on (durable
  `tasks`, OAuth modernisation, formalised governance). Strong
  candidate for a **dedicated MCP-governance deep dive** as a
  follow-up plan; not blocking, but the trajectory window is open.
- **"Treat persisted state as untrusted by default"** is a
  transferable principle from MS Agent Framework `1.0.1`. Concrete
  applicability surface: any persisted agent transcript or checkpoint
  this repo grows. Worth flagging on the
  [governance planes deep dive](../../reference/agentic-engineering/deep-dives/governance-planes-trust-boundaries-and-runtime-supervision.md)
  as a principle to adopt when the surface materialises.
- **Dapr's "policy engine performs no normalisation; normalise once at
  the perimeter"** is directly applicable to any policy/gating
  surface this repo grows. Worth flagging in the same deep dive.
- **Zuul's `role-mappings` model and `Depends-On` cross-repo DAG**
  remain the strongest external prior art for multi-repo
  dependency-aware contribution governance; worth recording on the
  governance-concepts-and-integration-report watchlist.
- **OpenTelemetry GenAI's agent-application vs agent-framework
  convention split** is a model for the repo's own internal taxonomy
  of agent-level vs framework-level observability surfaces; worth a
  vocabulary-alignment note on the governance deep dive.

### Trajectory weakness or omissions

The Slice A read **flagged Prow as trajectory-static** (announcements
page deprecated; gke-internal usage decline) and Bee/Beeai as
**enterprise-pivot-with-narrow-public-signal**. Both should be
re-checked in the next pass; absence of signal is itself a directional
read for this lane (the original-prior-art repos are not all healthy).

## C. Reviewer Systems and Discoverability

### Strongest direction signals

- **Per-team learning loops on top of agent-native code review.**
  Greptile records 👍/👎 reactions and replies "teach Greptile what
  matters" with an explicit 2–3 week stabilisation period — i.e.
  per-team noise calibration is now a first-class agent-reviewer
  behaviour
  ([Slice D §D](./operating-model-and-platforms/adjacent-enablers-direction-of-travel.md#d-agent-native-code-review-practice-intention-reviewer-systems-as-gateway)).
- **Handoff-as-integration-boundary.** Greptile's "Fix in X"
  (Claude Code, Codex, Cursor, Devin) is structurally the same
  reviewer-suggestion → main-agent-implementation flow this repo's
  reviewer system runs internally — but made machine-readable with
  explicit file paths and line numbers
  ([Slice D §D](./operating-model-and-platforms/adjacent-enablers-direction-of-travel.md#d-agent-native-code-review-practice-intention-reviewer-systems-as-gateway)).
- **Skills as the reviewer-discovery surface in adopter products.**
  Cursor and Claude Code both expose `/skill-name` as the universal
  invocation syntax; skill discoverability is now a first-class
  product surface, not a reviewer-system internal
  ([Slice B §B](./operating-model-and-platforms/agents-md-skills-and-plugins-direction-of-travel.md#b-agent-skills-the-open-standard-and-its-implementation-extensions)).
- **AGENTS.md is the discoverability entry point.** Adopter count
  crossed 60,000 open-source projects by AAIF launch; nearest-file-
  wins for nested AGENTS.md is settled
  ([Slice B §A](./operating-model-and-platforms/agents-md-skills-and-plugins-direction-of-travel.md#a-agentsmd)).

### What the signals say

The reviewer-system pattern this repo invented internally
(specialist-reviewer subagents reading code with context) has
materialised in the ecosystem in **three places at once**: as a
product surface (Greptile, Cursor Bugbot, Sentry AI Code Review,
CodeRabbit); as a discoverability primitive (Agent Skills slash
commands); as an entry-point format (AGENTS.md). The interesting
delta is that the external implementations have **two patterns the
repo's reviewer system does not yet have**: per-team learning loops
and machine-readable handoff to a downstream-implementation agent.

### Repo-local implications and routing

- **Per-team learning loop** is a candidate enhancement for the
  [reviewer-gateway-upgrade.plan.md](../../plans/agentic-engineering-enhancements/current/reviewer-gateway-upgrade.plan.md).
  The repo's reviewers do not currently learn from accept/reject
  signals on their suggestions; Greptile's pattern is direct prior
  art.
- **Machine-readable handoff** between reviewer subagents and
  main-agent implementation is currently informal in this repo (the
  reviewer returns prose, the main agent implements). Worth scoping
  whether the reviewer-suggestion artefact should grow a
  file-path + line-number schema, modelled on Greptile's "Fix in X"
  payload.
- **AGENTS.md as the discoverability entry point** is already aligned
  with this repo's choice
  ([CLAUDE.md → AGENT.md → directives](../../../CLAUDE.md));
  worth re-checking the
  [documentation-audit-report](../documentation-audit-report.md)
  routing to confirm the AGENTS.md entry chain is the **single
  documented entry path** with no parallel discovery surfaces drifting.
- **Skills as discoverability surface.** The repo's
  `.agent/skills/` and platform mirrors (`.claude/skills/`,
  `.cursor/skills/`, `.agents/skills/`) are aligned with the
  ecosystem's `/skill-name` convention; worth confirming on the
  [reviewer-system deep dive](../../reference/agentic-engineering/deep-dives/reviewer-system-and-review-operations.md)
  that skill names are the discoverability surface, not just the
  invocation surface.

### Trajectory weakness or omissions

Slice D explicitly **omitted** OpenAI Bugbot, Sentry AI Code Review,
and CodeRabbit beyond Greptile as the canonical example. A breadth
pass on agent-native code review tools would strengthen this lane's
direction read; not blocking.

## D. Safety, Evidence, and Enforcement

### Strongest direction signals

- **Evals are converging on solver-scorer-task as the unit of
  composition**, with UK AISI's **Inspect** as the most-cited open
  implementation: 200+ pre-built evaluations, sandboxing across
  Docker / Kubernetes / Modal, fine-grained tool approval policies,
  Agent Bridge for OpenAI Agents SDK / LangChain / Pydantic AI
  ([Slice D §A](./operating-model-and-platforms/adjacent-enablers-direction-of-travel.md#a-evals-and-scorers-practice-intention-evidence-discipline)).
- **The eval substrate has absorbed both supervision-before-side-
  effects and policy-engine concerns.** Inspect ships sandboxing of
  model code as a first-class eval primitive, alongside fine-grained
  tool approval — i.e. the boundary between "eval" and "supervised
  execution" is being deliberately collapsed
  ([Slice D §A](./operating-model-and-platforms/adjacent-enablers-direction-of-travel.md#a-evals-and-scorers-practice-intention-evidence-discipline)).
- **Aider's commit-attribution and dirty-file separation.** Every
  agent edit becomes a commit with `(aider)` in author/committer
  metadata; dirty user files get a separate pre-edit commit to keep
  user/agent changes apart; opt-in `Co-authored-by` trailer
  ([Slice D §E](./operating-model-and-platforms/adjacent-enablers-direction-of-travel.md#e-agent-native-vcs-practice-intention-safety-evidence--parallel-agents)).
- **Worktree-isolated parallel agents.** Mux and Emdash both build on
  git worktrees as the primary isolation mechanism for parallel agent
  execution — convergent direction
  ([Slice D §E](./operating-model-and-platforms/adjacent-enablers-direction-of-travel.md#e-agent-native-vcs-practice-intention-safety-evidence--parallel-agents)).

### What the signals say

The 2026 direction for the safety-evidence stack is **named,
composable, sandboxed evidence checks** plus **explicit attribution
and isolation at the VCS layer**. The ecosystem has converged on
calling these "scorers" and "worktrees" respectively. Both are
patterns this repo has informal analogues for (evidence checks live
inline in subagent prompts; the `worktrees` skill exists) — the
direction signal is that they are becoming **named, first-class
artefacts** elsewhere.

### Repo-local implications and routing

- **Inspect's solver/scorer/task model** is the strongest external
  prior art for the
  [safety-evidence lane](./safety-evidence-and-enforcement/README.md).
  Most directly transferable: **scorer as a named, composable
  artefact** (currently inline in subagent prompts in this repo);
  **sandboxing as a first-class eval primitive** (currently absent).
  Worth a follow-on note comparing this repo's evidence-check shape
  against Inspect's named scorer surface; not blocking.
- **Aider's commit-attribution pattern** (`(aider)` in
  author/committer metadata, opt-in `Co-authored-by`) is directly
  applicable to any agent-authored commit in this repo. Worth a
  Slice C → ADR amendment scope check on whether agent-authored
  commits should grow explicit attribution; this is a small change
  with clear evidence value.
- **Aider's dirty-file separation pattern** (auto-commit user dirty
  files before agent edits) is a transferable safety primitive worth
  considering for any agent-driven flow that touches user-modified
  files. Routing target: the
  [hallucination-and-evidence-guard-adoption.plan.md](../../plans/agentic-engineering-enhancements/current/hallucination-and-evidence-guard-adoption.plan.md)
  scope.
- **Worktree-isolated parallel agents** is convergent with the
  existing
  [`worktrees` skill](../../../.agent/skills/worktrees/SKILL.md);
  no action indicated, the repo's direction is already aligned.

### Trajectory weakness or omissions

Slice D **did not** survey individual eval product roadmaps
(Braintrust, Langfuse, Helicone, PostHog AI, Arize Phoenix, AgentOps,
W&B Weave) beyond noting that they exist. The OpenAI evals registry
is trajectory-static at 18.2k stars. Direction read for the
**production-eval product layer** is therefore thin in this survey.

## E. Continuity, Memory, and Knowledge Flow

### Strongest direction signals

- **Context engineering is now a named ecosystem discipline.**
  Anthropic's September 2025 essay names the same three primitives
  (compaction, structured note-taking, multi-agent architectures)
  this repo's continuity lane has implemented as napkin, distilled,
  and sub-agent dispatch
  ([Slice D §B](./operating-model-and-platforms/adjacent-enablers-direction-of-travel.md#b-context-engineering-practice-intention-continuity-and-knowledge-flow)).
- **Durable execution is becoming table-stakes for protocols too.**
  MCP `2025-11-25` adds an experimental `tasks` utility for durable
  polling; A2A `1.0.0` adds `tasks/list` with filtering and
  pagination — durable execution is no longer the property of
  execution engines (LangGraph, Temporal, Dapr) alone
  ([Slice A §Cross-project pattern 1](./governance-planes-and-supervision/governance-plane-direction-of-travel.md#cross-project-trajectory-patterns)).
- **Persisted-state-as-untrusted by default** is the cross-project
  hardening direction for any continuity surface that round-trips
  through disk
  ([Slice A §Cross-project pattern 4](./governance-planes-and-supervision/governance-plane-direction-of-travel.md#cross-project-trajectory-patterns)).

### What the signals say

The continuity lane's intention surface (split-loop continuity,
session handoff, surprise pipeline) is **convergent with the
ecosystem direction** and the lane is, on the evidence, **the
furthest along of any lane in this survey**. Anthropic's vocabulary
gives the same patterns ecosystem-shared names. The interesting
delta is that the direction is now spreading **into the protocol
layer** (MCP and A2A `tasks`) — i.e. continuity is leaving the
runtime layer where the repo's continuity lane has been doing it,
and entering the interop layer.

### Repo-local implications and routing

- **Vocabulary alignment.** Adopting Anthropic's terms — "compaction",
  "structured note-taking", "just-in-time retrieval" — externally
  would aid both internal and external discussion. Routing target:
  vocabulary-alignment pass (no behaviour change) on
  [continuity-memory-and-knowledge-flow/README.md](./continuity-memory-and-knowledge-flow/README.md)
  and the
  [napkin SKILL.md](../../skills/napkin/SKILL.md) /
  distilled surfaces. Not blocking.
- **Protocol-layer durability is a watchlist item, not a near-term
  adoption target.** The continuity lane's existing surfaces are
  runtime-layer (transcripts, napkin, distilled, session handoff);
  MCP/A2A `tasks` is interop-layer. Worth tracking on the
  [continuity deep dive](../../reference/agentic-engineering/deep-dives/continuity-and-knowledge-flow.md)
  as the next-up substrate the lane will need to reckon with when
  this repo's MCP server grows long-running tools.
- **Persisted-state-as-untrusted** applies to any continuity surface
  that crosses the disk boundary. Currently the repo's transcript
  format is plain JSONL and napkin is plain markdown; the
  hardening posture is **not yet relevant** but should be flagged on
  the deep dive as a principle to honour when binary or pickle-shaped
  surfaces emerge.

### Trajectory weakness or omissions

This survey does not cover **continuity / memory product roadmaps**
(Mem0, Letta, MemGPT, Zep, etc.) — only the protocol-layer and
context-engineering signals. Producer-side roadmaps for the memory
products would strengthen the read.

## F. Derived Memory and Graph Navigation

### Strongest direction signals

- **Schema-first declarative surfaces are spreading.** Backstage
  catalog model layer (JSON Schema), ADK Agent Registry, OpenAI
  Manifest, MCP JSON Schema 2020-12 default dialect (SEP-1613)
  ([Slice A §Cross-project pattern 3](./governance-planes-and-supervision/governance-plane-direction-of-travel.md#cross-project-trajectory-patterns)).
- **Backstage's catalog model layer (alpha, opt-in)** is the closest
  external analogue this survey found for the repo's "schema-first
  execution" rule and the catalog/curriculum domain model
  ([Slice A §Backstage](./governance-planes-and-supervision/governance-plane-direction-of-travel.md#backstage)).

### What the signals say

This lane has the **thinnest external direction read of any lane in
the survey**. Slice A's Backstage entry is the strongest analogue
(JSON-Schema-driven catalog model layer with `ModelProcessor`
validation), but no Slice A/B/D source covers graph-shaped derived
memory directly. The agent-skills.io / plugin-marketplace ecosystem is
implicit-graph-shaped (skills referencing other skills, plugins
bundling skills) but no producer surfaces this as a graph
explicitly.

### Repo-local implications and routing

- **Backstage as the comparison target.** Worth a small note on the
  [graphify-and-graph-memory-exploration.plan.md](../../plans/agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md)
  scope flagging Backstage's catalog model layer as a comparable
  external prior art for the catalog half of the lane's intention
  surface.
- **No new direction-of-travel evidence** justifies any change to
  ADR-059 or ADR-157 in this session.
- This lane's external read is **the most underdeveloped** of the
  six; a future research pass scoped specifically to graph-memory
  ecosystem (LlamaIndex graph memory, Cognee, Letta graph features,
  Memgraph + LLM patterns, Neo4j GraphRAG) would close this gap.
  Recorded as a routing recommendation only.

### Trajectory weakness or omissions

Trajectory is **weakest** for this lane in the entire survey. The
omission is **not** a sign that the lane is undirected — it is a
sign that this survey's source slices (governance-plane projects,
practice-methodology primitives, adjacent enablers) under-sample the
graph-memory ecosystem. A targeted future pass would close the gap.

## Cross-lane synthesis

Three observations cross multiple lanes and are worth naming
explicitly. Each is a re-read of evidence already in Slice A/B/D, not
new evidence.

1. **The repo's lane structure is well-aligned with where the
   ecosystem went.** Five of six lanes have direction signals
   convergent with the lane's intention surface (only derived-memory
   has thin external evidence). The mechanism-gap baseline's existing
   thesis — that the repo's direction is right but its mechanisms
   under-implement that direction — is **strengthened** by the cross-
   lane read: the direction is right because the ecosystem also went
   there.
2. **Two cross-cutting principles are transferable as principles
   without external dependency.** "Treat persisted state as untrusted
   by default" (MS Agent Framework `1.0.1`, LangGraph `4.0.2`, Dapr
   April 2026) and "policy engine performs no normalisation;
   normalise once at the perimeter" (Dapr) are both **principles**
   the repo can adopt for its own surfaces without adopting any
   external dependency. Both are flagged in the governance-planes
   lane section above.
3. **The discoverability surface is now ecosystem-standardised.**
   AGENTS.md as entry point, Agent Skills as `/skill-name`
   discoverability, plugin marketplaces as bundled distribution. The
   repo is **already aligned** on all three (CLAUDE.md → AGENT.md
   chain, `.agent/skills/`, the Practice five-file package). The
   remaining open question is whether the Practice package should
   ship as plugin-format-installable, addressed in §A above.

## Repo-local implications and routing (umbrella)

These collect the per-lane recommendations above. **No doctrine edits
are made in this session.** Each pointer is a candidate for follow-up
work, owned by the relevant lane README / plan / deep dive owner.

| Lane | Highest-priority routing | Lower-priority routing |
| --- | --- | --- |
| operating-model-and-platforms | Refresh `cross-platform-agent-surface-matrix.md` shape against the convergent primitives | Scope plugin-manifest implementation extensions for ADR-125 Layer 1 vs Layer 2; scope plugin-format wrappers for the Practice five-file package |
| governance-planes-and-supervision | MCP-governance deep dive as a downstream plan candidate | Record "treat persisted state as untrusted", "policy engine purity", and "OTel agent-app vs agent-framework split" as principles on the governance deep dive watchlist |
| reviewer-systems-and-discoverability | Per-team learning loop and machine-readable handoff schema scoping for `reviewer-gateway-upgrade.plan.md` | Confirm AGENTS.md as single discoverability entry path on the documentation-audit-report routing |
| safety-evidence-and-enforcement | ADR amendment scope check for agent-authored commit attribution | Scope Inspect-style named scorer artefact shape; scope dirty-file separation on `hallucination-and-evidence-guard-adoption.plan.md` |
| continuity-memory-and-knowledge-flow | Vocabulary-alignment pass (compaction / structured note-taking / just-in-time retrieval) on lane README, napkin, distilled | Watchlist: protocol-layer durability (MCP / A2A `tasks`), persisted-state-as-untrusted when binary surfaces emerge |
| derived-memory-and-graph-navigation | Targeted future research pass on the graph-memory product ecosystem | Note Backstage catalog model layer as comparison target on `graphify-and-graph-memory-exploration.plan.md` |

Promotion of any of the above into doctrine (ADRs, Practice Core,
deep dives) is **out of scope for this session** and is recorded here
as a routing recommendation only.

## Closeout for Slice C

- **No new lane was created.** Per the assumptions-reviewer fence,
  every Slice A/B/D signal mapped onto an existing lane.
- **No section needed promotion to a stand-alone lane note.** The
  longest sections (operating-model, governance-planes, safety-
  evidence) are within the umbrella's normal proportionality. None
  exceeded the threshold the plan set for promotion.
- **Trajectory-weak lane named.** `derived-memory-and-graph-
  navigation` has the thinnest external read; flagged as a future
  research-pass target.
- **Evidence vs inference is preserved per-section.** Direction
  signals carry explicit links back to the source-note section that
  cites the primary source; inferences and recommendations are kept
  in their own paragraphs.
