# Adjacent enablers: ecosystem direction of travel

> Slice D reconnaissance note. Sister to
> [`governance-plane-direction-of-travel.md`](../governance-planes-and-supervision/governance-plane-direction-of-travel.md)
> and [`agents-md-skills-and-plugins-direction-of-travel.md`](./agents-md-skills-and-plugins-direction-of-travel.md).
> Lives in `operating-model-and-platforms/` because the material is
> deliberately **cross-lane** (touches continuity, safety-evidence,
> reviewer-systems, governance, operating-model). A single home with
> explicit per-lane cross-references avoids premature lane creation per
> the assumptions-reviewer fence.

## Why this note exists

Five **adjacent enabler** ecosystems are evolving in parallel to the
governance and skills primitives this repo already tracks. Each of the
five maps onto a stated Practice intention. This note reads each one
**only as far as the primary-source direction signal is strong enough**
to be useful for routing, then maps it back to the corresponding repo
lane.

Strict filter applied per the assumptions-reviewer amendments: each
sub-area gets at most one trajectory paragraph + 1–3 primary-source
bullets + one repo-local implication. Where evidence is weak or
trajectory diffuse, that is named explicitly rather than padded.

Scope is **direction-of-travel reconnaissance**, not adoption
recommendation, not deep dive. Followups are flagged at the end.

## A. Evals and scorers (Practice intention: evidence discipline)

### Trajectory

The evals ecosystem is **converging on solver-scorer-task as the unit of
composition** with the **UK AI Security Institute's Inspect** framework
as the most-cited open implementation. Inspect ships **200+ pre-built
evaluations**, supports running arbitrary external agents (Claude Code,
Codex CLI, Gemini CLI), provides MCP tool integration, and bundles a
sandboxing system across Docker / Kubernetes / Modal. OpenAI's open
`openai/evals` registry remains the most-starred reference but is
trajectory-static (18.2k stars, generic registry shape). [^inspect]
[^openai-evals]

- Inspect's documented architecture is the three-component shape
  (datasets + solvers + scorers → tasks) and explicitly supports
  **sandboxing of model code** plus **fine-grained tool approval policies**
  — i.e. the eval substrate has absorbed both supervision-before-side-effects
  and policy-engine concerns. [^inspect]
- Inspect's Agents documentation lists **Agent Bridge** for OpenAI Agents
  SDK, LangChain, and Pydantic AI — evidencing convergence around
  cross-framework agent eval portability. [^inspect]
- The OpenAI evals registry is at 18,236 stars but is structurally
  stable (no recent design pivot in the README); trajectory is
  **maintenance-mode**. [^openai-evals]

**Repo-local implication.** Inspect's solver/scorer/task model is the
strongest external prior art for the repo's `safety-evidence-and-enforcement`
lane. The most directly transferable concepts are: (i) **scorer as a
named, composable artefact** (currently this repo's evidence checks live
inline in workflows / sub-agent prompts); (ii) **sandboxing as a
first-class eval primitive** (currently absent from the repo's evidence
discipline). Worth a Slice C entry under safety-evidence and a candidate
follow-up note on "scorer-as-artefact" portability.

## B. Context engineering (Practice intention: continuity / patterns)

### Trajectory

Anthropic's **September 2025 "Effective context engineering for AI
agents" essay** is the most-cited primary statement of the term and
defines the direction. Three named long-horizon techniques are now
treated as canonical: **compaction**, **structured note-taking**, and
**multi-agent architectures**. Tool-result clearing was launched as a
Claude Developer Platform feature alongside the essay. Anthropic frames
context engineering as "the natural progression of prompt engineering"
— from one-shot instruction crafting to **iterative curation of the
entire context state** (system prompt, tools, MCP, message history,
external data). [^anthropic-context]

- The essay names "context rot" (citing Chroma research) as the
  underlying constraint: as token count grows, recall accuracy degrades
  — characteristic of all transformer architectures. The framing
  inverts: context is a "finite resource with diminishing marginal
  returns." [^anthropic-context]
- The essay names a **just-in-time retrieval** pattern (lightweight
  identifiers + tool-mediated load) as the dominant agent context
  pattern, contrasting it with embedding-based pre-inference retrieval.
  Claude Code's `glob`/`grep`/`head`/`tail` flow is given as the worked
  example. [^anthropic-context]
- The essay names **compaction** with explicit guidance: "maximize
  recall first, then iterate to improve precision"; tool-result clearing
  is the "lightest touch form." Multi-agent architectures are the
  third long-horizon technique (alongside compaction and note-taking).
  [^anthropic-context]

**Repo-local implication.** This material sits squarely in
`continuity-memory-and-knowledge-flow`. The repo's `napkin.md` skill,
`distilled.md` patterns, and continuity-loop ADRs already implement
structured note-taking. The two open deltas: (i) the repo does **not yet
name "compaction" or "tool-result clearing" as first-class continuity
mechanisms** — naming alignment with Anthropic's vocabulary would aid
both internal discoverability and external discussion; (ii) the repo's
sub-agent dispatch pattern is conceptually a "multi-agent architecture
for context" but is not framed that way in the continuity lane. **Routing
recommendation only.**

## C. Agent-native observability (Practice intention: durable transcripts / supervision)

### Trajectory

The **OpenTelemetry GenAI semantic conventions** are the de-facto
direction. As of the current spec page, four signal categories are
defined: **events** (inputs/outputs), **metrics**, **model spans**, and
**agent spans**, plus **MCP-specific semantic conventions** and
vendor-specific conventions for Anthropic, OpenAI, AWS Bedrock, and
Azure AI Inference. Spec status is **Development** with an
`OTEL_SEMCONV_STABILITY_OPT_IN` flag for instrumentation-side migration
without breaking existing emitters. [^otel-genai] [^otel-blog-2025]

- The spec page formally names: GenAI events, GenAI metrics, GenAI
  spans (model + agent), MCP semconv, plus four vendor-specific
  conventions. [^otel-genai]
- The OpenTelemetry blog's "AI Agent Observability" post records two
  semconv layers being defined in parallel: an **AI agent application
  semantic convention** (already finalised, based on Google's AI agent
  white paper) and an **AI agent framework semantic convention** (in
  progress; aims to standardise across CrewAI, AutoGen, LangGraph, IBM
  Bee, etc. while leaving room for vendor-specific extensions).
  [^otel-blog-2025]
- The blog explicitly frames telemetry as "also used as a feedback loop
  to continuously learn from and improve the quality of the agent by
  using it as input for evaluation tools" — i.e. the
  observability-and-evals stack is being treated as one. [^otel-blog-2025]

**Repo-local implication.** This sits across `governance-planes-and-supervision`
and `continuity-memory-and-knowledge-flow`. The repo's MCP server
(`apps/oak-curriculum-mcp-streamable-http`) already runs on Sentry
plus OpenTelemetry per the existing Sentry-OTel integration; the ecosystem
direction signal is **convergent**. The single transferable principle is
the explicit **agent-application vs agent-framework convention split** —
worth referencing as a model for the repo's own internal taxonomy of
agent-level vs framework-level observability surfaces. **No adoption
work.**

## D. Agent-native code review (Practice intention: reviewer-systems-as-gateway)

### Trajectory

The dominant external pattern is the **codebase-graph plus PR-comment
plus Fix-in-X integration**. **Greptile** is the canonical implementation:
builds a complete graph of every function/class/dependency, posts
findings as PR comments in ~3 minutes, includes a "Fix in X" button per
comment that hands off the issue (with file paths and line numbers) to
**Claude Code, Codex, Cursor, or Devin**. The pattern is offered as
both Cloud (SOC2 Type II) and self-hosted (Docker / Kubernetes /
air-gapped). [^greptile]

- Greptile records a learning loop on top of the review pattern: 👍/👎
  reactions and replies "teach Greptile what matters" with explicit
  2–3 week stabilisation period — i.e. **per-team noise calibration as
  a first-class behaviour**. [^greptile]
- The Fix-in-X integration is explicitly cross-tool (Claude Code, Codex,
  Cursor, Devin) — evidencing that PR-comment-as-the-handoff-point is
  the convergent integration boundary, not any one IDE. [^greptile]

**Repo-local implication.** This sits directly in
`reviewer-systems-and-discoverability`. The repo's reviewer-system
pattern (`code-reviewer`, `architecture-reviewer-*`, etc. specialist
subagents invoked via `.agent/sub-agents/templates/`) is the **same
pattern from the inside**: specialist reviewers reading code with
context. The two principles transferable from the external direction:
(i) **per-team / per-repo learning loops** (the repo's reviewers do not
yet learn from accept/reject signals); (ii) **handoff-as-integration-boundary**
— Greptile's "Fix in X" is structurally the same idea as the repo's
reviewer-suggestion → main-agent-implementation flow, but made
machine-readable with explicit file paths and line numbers. **Routing
recommendation: Slice C reviewer-systems entry.**

## E. Agent-native VCS (Practice intention: safety-evidence / parallel-agents)

### Trajectory

Two patterns are converging in parallel:

1. **Tight git integration in single-agent flows.** Aider is the most-cited
   open implementation: every edit becomes a commit with a generated
   message; **dirty files get a separate pre-commit before edits** to keep
   user/agent changes apart; `(aider)` appended to git author/committer
   metadata; **Conventional Commits format by default**; opt-in
   `Co-authored-by` trailer; pre-commit hooks **skipped by default
   (`--no-verify`)** with `--git-commit-verify` opt-in. [^aider-git]
2. **Worktree-isolated parallel agents.** The agentskills.io adopter list
   names two purpose-built tools — **Mux** ("run parallel coding agents,
   each with its own isolated workspace, right from your browser or
   desktop") and **Emdash** ("provider-agnostic desktop app that lets you
   run multiple coding agents in parallel, each isolated in its own git
   worktree, either locally or over SSH on a remote machine"). [^skills-overview]

- Aider's documentation calls **commit-attribution** (author and
  committer metadata) out as a deliberate design decision, with explicit
  opt-out flags — i.e. the question of "who made this commit" is
  treated as a first-class agent-VCS concern, not an afterthought.
  [^aider-git]
- Mux and Emdash both build on **git worktrees** as the primary
  isolation mechanism for parallel-agent execution — convergent direction
  even though the agentskills.io listings are the only primary-source
  citation available without deeper fetch. [^skills-overview]

**Repo-local implication.** This sits across `safety-evidence-and-enforcement`
and `operating-model-and-platforms`. The repo already has a `worktrees`
skill (`.agent/skills/worktrees/SKILL.md`), evidencing that the
parallel-agent pattern is recognised. Two transferable principles: (i)
**explicit commit attribution as a first-class agent-VCS concern**
(Aider's `(aider)` and `Co-authored-by` patterns are directly applicable
to any agent-authored commit in this repo); (ii) **dirty-file separation
before agent edits** as a safety primitive (Aider's automatic pre-edit
commit of user dirty files is a transferable safety pattern this repo
could adopt for agent-driven changes that touch user-modified files).
**Routing recommendation: Slice C safety-evidence entry plus a possible
ADR amendment around commit attribution.**

## Cross-cutting trajectory patterns

Three patterns hold across A–E with strong-enough evidence to be worth
naming:

1. **Open standards beat vendor frameworks for the substrate, but vendors
   stay where they add value.** Inspect (UK AISI), OpenTelemetry GenAI
   semconv, Aider, and the agentskills.io standard are all open
   substrates. Greptile, Cursor Bugbot, and the OpenAI evals registry
   are vendor implementations of patterns the substrate enables. The
   pattern repeats across all five enabler categories. [^inspect]
   [^otel-genai] [^aider-git] [^greptile] [^skills-overview]

2. **Telemetry, evals, and supervision are merging into one stack.** The
   OpenTelemetry blog's framing — "telemetry is also used as a feedback
   loop to continuously learn from and improve the quality of the agent
   by using it as input for evaluation tools" — is reflected in
   Inspect's bundled sandboxing + tool-approval policies, and in
   Greptile's per-team learning loop. The stack that was three separate
   ecosystems (metrics, evals, code review) in 2024 is recognisably
   one in 2026. [^otel-blog-2025] [^inspect] [^greptile]

3. **Context engineering is the discipline this repo's continuity lane
   has been doing without naming.** Anthropic's September 2025 essay
   names the same three primitives (compaction, structured note-taking,
   multi-agent architectures) the repo has implemented as napkin,
   distilled, and sub-agent dispatch. The vocabulary is now
   ecosystem-shared — adopting it would aid both internal and external
   discussion. [^anthropic-context]

## Repo-local implications and routing

These are recommendations for follow-up routing **only**; no doctrine
edits are made in this session.

- **Inspect's scorer/solver/task model** is the strongest single piece of
  prior art for the repo's safety-evidence lane. Worth a follow-on note
  comparing the repo's evidence-check artefact shape (currently inline
  in sub-agent prompts) against named, composable scorers.
- **Anthropic's context-engineering vocabulary** ("compaction",
  "structured note-taking", "just-in-time retrieval") should be the
  vocabulary the repo's continuity lane uses externally. Worth a
  vocabulary-alignment pass (no behaviour change) on
  `continuity-memory-and-knowledge-flow/README.md` and the napkin/distilled
  skills.
- **Greptile's per-team learning loop and machine-readable handoff** are
  the two transferable principles for the repo's reviewer-systems
  lane. Worth a Slice C reviewer-systems entry.
- **Aider's commit-attribution and dirty-file-separation patterns** are
  directly applicable to any agent-authored commit in this repo. Worth
  a Slice C safety-evidence entry and a possible ADR amendment.
- **OpenTelemetry GenAI semconv** is convergent with the repo's existing
  Sentry+OTel integration. The principle worth naming: the
  agent-application vs agent-framework convention split. Slice C
  governance entry.
- **No new lane needed.** Five sub-areas, each mapping onto an existing
  lane, with a single cross-lane reconnaissance note as the bridge. The
  evidence does not justify a stable new `adjacent-enablers/` lane (per
  the assumptions reviewer's "no new lane until evidence proves it
  stable, non-overlapping, and beneficial for discovery" fence).
- **Slice D's deliberate omissions.** This note **did not** survey
  individual eval product roadmaps (Braintrust, Langfuse, Helicone,
  PostHog AI, Arize Phoenix, AgentOps, Weights & Biases Weave) beyond
  noting that they exist. It also did not survey OpenAI's Bugbot, Sentry
  AI Code Review, or CodeRabbit beyond Greptile as the canonical
  example. These would be reasonable Slice C entries if the synthesis
  pass needs more breadth.

Promotion of any of the above into doctrine (ADRs, Practice Core, deep
dives) is **out of scope for this session** and is recorded here as a
routing recommendation only.

[^inspect]: UK AI Security Institute, Inspect documentation home, <https://inspect.aisi.org.uk/> (fetched 2026-04-20). Cites BibTeX entry "Inspect AI: Framework for Large Language Model Evaluations", AI Security Institute UK, 2024.
[^openai-evals]: GitHub, `openai/evals` repository home, <https://github.com/openai/evals> (fetched 2026-04-20; 18,236 stars).
[^anthropic-context]: Anthropic, "Effective context engineering for AI agents" (2025-09-29), <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents>.
[^otel-genai]: OpenTelemetry, "Semantic conventions for generative AI systems", <https://opentelemetry.io/docs/specs/semconv/gen-ai/> (fetched 2026-04-20; spec status: Development; covers events / metrics / model spans / agent spans / MCP / Anthropic / OpenAI / AWS Bedrock / Azure).
[^otel-blog-2025]: OpenTelemetry, "AI Agent Observability — Evolving Standards and Best Practices" (2025), <https://opentelemetry.io/blog/2025/ai-agent-observability/>.
[^greptile]: Greptile, official documentation home, <https://greptile.com/docs> (fetched 2026-04-20). Records "Fix in X" integration with Claude Code, Codex, Cursor, Devin; per-team learning loop with 2–3 week stabilisation; SOC2 Type II + self-hosted (Docker / Kubernetes / air-gapped) deployment options.
[^aider-git]: Aider, "Git integration" documentation, <https://aider.chat/docs/git.html> (fetched 2026-04-20).
[^skills-overview]: Agent Skills overview, <https://agentskills.io/> (fetched 2026-04-20). Adopter listings include Mux ("run parallel coding agents, each with its own isolated workspace") and Emdash ("multiple coding agents in parallel, each isolated in its own git worktree").
