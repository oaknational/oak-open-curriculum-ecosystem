---
name: practice-aligned project directions research
overview: Run a broad-then-deep research sweep into directions of travel for projects aligned with the Practice's intentions and high-quality agentic engineering more generally — covering governance-plane roadmaps, the practice-methodology ecosystem, cross-lane direction signals, and adjacent enablers — then route findings into analysis baselines and promoted reports proportional to what is discovered.
todos:
  - id: p0-assumptions
    content: Run an assumptions-reviewer pass on this plan to validate the four-slice scope, the proposed parallel-agent fan-out, and the working doctrine before launching Phase 1.
    status: completed
  - id: p1-slice-a
    content: "Slice A: write `governance-plane-direction-of-travel.md` covering trajectory (roadmaps, RFCs, design pivots, recent release-notes signals) for the 12 already-surveyed projects, with primary-source citations and per-project repo-local implications."
    status: completed
  - id: p1-slice-b
    content: "Slice B: create the `practice-methodology-ecosystem/` lane (README + first note `agents-md-skills-rules-and-agent-artefacts-landscape.md`) covering AGENTS.md, skills, rules, plugins, public `.agent/` patterns, and agent-prompt registries; compare against ADR-119/124/125."
    status: completed
  - id: p1-slice-c
    content: "Slice C: write `cross-lane-direction-survey.md` umbrella with one section per existing lane (governance, reviewer-systems, continuity, safety-evidence, derived-memory, operating-model). Promote any oversized section into its own lane note before phase end."
    status: completed
  - id: p1-slice-d
    content: "Slice D: create the `adjacent-enablers/` lane (README + initial note(s)) covering evals/scorers, context engineering, agent-native observability, agent-native code review, agent-native VCS patterns. Filter strictly to primary-sourced items linked to a Practice intention."
    status: completed
  - id: p2-analysis
    content: "Phase 2: produce `practice-aligned-direction-and-gap-baseline.md` analysis with the comparison matrix; spawn a slice-scoped analysis note only if a single slice produces stand-alone comparative material."
    status: completed
  - id: p3-report-decision
    content: "Phase 3: decide and justify whether to produce one umbrella promoted report, multiple per-slice reports, or no new report this session. If reports are produced, route them under `.agent/reports/agentic-engineering/deep-dive-syntheses/`."
    status: completed
  - id: p4-routing
    content: "Phase 4: update lane README routing surfaces (research lane map, governance-planes README, reference hub topic map if a deep dive is touched, cross-links from the existing analysis baseline and integration report)."
    status: completed
  - id: closeout
    content: "Closeout: state what landed, list artefacts grouped by lane, separate evidence from inference, name the top unresolved question, declare scope (research/reporting only vs doctrine-implication routing), and update napkin with surprises and watchlist candidates."
    status: completed
isProject: false
---

# Practice-Aligned Project Directions Research

## Intent

Turn the existing seed note ([repos-as-governance-planes.md](.agent/research/agentic-engineering/governance-planes-and-supervision/repos-as-governance-planes.md)) — a landscape snapshot of governance-plane infrastructure repos — into a broader, direction-of-travel-oriented body of research that covers four slices the user authorised together. Then route findings into analysis and report lanes only where the evidence supports it.

Read-and-write scope is **research, analysis, reporting, and discovery routing only**. Do **not** edit ADRs, Practice Core, directives, `/docs/**`, or product code.

## Working Doctrine (binding for this session)

- Distinguish at every paragraph between **external concept**, **repo-local mechanism**, **inference**, **recommendation**.
- Prefer primary and official sources (project docs, RFCs, release notes, public roadmaps, ADR-style decision records, spec commits) over secondary commentary.
- Use **WebFetch directly** for documentation citation; use **subagents only when synthesis or comparative judgement is the load-bearing work** (per the napkin pattern `prefer-webfetch-for-doc-citation-prefer-agent-for-judgement`).
- Always apply the first question: **could this synthesis or route be simpler without losing quality?**
- Do not let any slice collapse into framework tourism or vendor catalogue. Always close each section with **local implications for this repo**.
- Where findings imply doctrine change, record as a **recommendation routed to a plan or report**, not as an in-place edit to canon.

## Phase 1 — Broad survey (four research notes, parallelisable)

Produce one research note per slice. Each note is narrower in remit than the existing seed: it picks a single angle (direction of travel, methodology ecosystem, cross-lane signals, or adjacent enablers) and stays inside it.

### Slice A — Direction of travel for governance-plane repos

- **Output**: [.agent/research/agentic-engineering/governance-planes-and-supervision/governance-plane-direction-of-travel.md](.agent/research/agentic-engineering/governance-planes-and-supervision/governance-plane-direction-of-travel.md)
- **Scope**: For each of the 12 already-surveyed projects (LangGraph, MS Agent Framework, OpenAI Agents SDK, Google ADK, A2A, MCP, Agent Governance Toolkit, BeeAI, Temporal, Dapr, OPA, Prow, Zuul, Backstage, OpenRewrite), capture **trajectory** rather than current state: published roadmaps, accepted RFCs/SEPs/ADRs, recent design pivots, deprecation notices, governance-related issue threads.
- **Source quality bar**: roadmap/RFC docs, release notes, official blog/announcement posts, design-doc PRs. No third-party rumour.
- **Output shape**: per-project section (1 trajectory paragraph + 1–3 cited evidence bullets + repo-local implication).

### Slice B — Practice-methodology ecosystem (new lane)

- **New lane**: `.agent/research/agentic-engineering/practice-methodology-ecosystem/`
  - `README.md` (lane charter + best-starting-points table)
  - First note: `agents-md-skills-rules-and-agent-artefacts-landscape.md`
- **Scope**: Projects whose intent **mirrors the Practice itself** rather than runtime infrastructure. Candidate corpus: AGENTS.md spec/ecosystem, Claude Code skills + plugins, Cursor rules + skills + plugin marketplace, Codex agents, GEMINI.md adoption, public `.agent/` directory patterns, open agent-rule libraries, prompt-as-code projects, agent-prompt registries. Note any convergence or fragmentation between platforms.
- **Repo-local hook**: compare against ADR-119 / ADR-124 / ADR-125 (three-layer artefact model and propagation), the cross-platform agent surface matrix, and the existing practice-core/practice-context structure.

### Slice C — Cross-lane direction survey (umbrella note)

- **Output**: [.agent/research/agentic-engineering/cross-lane-direction-survey.md](.agent/research/agentic-engineering/cross-lane-direction-survey.md)
- **Scope**: One umbrella note with a section for each of the six existing research lanes (governance, reviewer-systems, continuity, safety-evidence, derived-memory, operating-model). Per lane, 2–3 direction signals from the open ecosystem and one named local gap or convergence.
- **Promotion rule**: if any single lane's section grows beyond ~30 lines or carries an independent argument, **promote it to its own lane note** during this phase rather than swelling the umbrella.

### Slice D — Adjacent enablers (new lane)

- **New lane**: `.agent/research/agentic-engineering/adjacent-enablers/`
  - `README.md`
  - Initial coverage spread across one or more notes depending on findings:
    - evaluations and scorers (Inspect AI, OpenAI evals, Anthropic evals, ragas, promptfoo, lm-evaluation-harness)
    - context engineering tools and patterns
    - agent-native observability (LangSmith, Helicone, Phoenix/Arize, Langfuse, Braintrust)
    - agent-native code review and merge tooling (Cursor BugBot, Codex review, GitHub Copilot review, Greptile)
    - agent-native version control / change orchestration patterns (Graphite-style, sapling-adjacent agentic flows)
- **Filter**: include only items with primary-source documentation and a defensible link back to a Practice intention (bounded autonomy, contribution contracts, supervision, evidence, durable state, multi-agent conflict management).

### Parallelisation note

The four slices are independent and can be researched in parallel. Because this proposes ≥4 concurrent agent dispatches, **before launching agents**, run a quick `assumptions-reviewer` pass on this plan per the workspace `invoke-assumptions-reviewer` rule, and decide between parallel agents and sequential WebFetch-led research based on its finding. Default fallback: sequential WebFetch by the parent agent for citation work, with a single `generalPurpose` subagent per slice only if comparative synthesis is the load-bearing task.

## Phase 2 — Cross-cutting analysis (one or more)

After Phase 1 lands, produce **at least one** analysis artefact comparing external direction signals to repo-local mechanisms.

- **Default output**: [.agent/analysis/practice-aligned-direction-and-gap-baseline.md](.agent/analysis/practice-aligned-direction-and-gap-baseline.md)
- **Shape**: comparison matrix with columns (external direction signal, source, repo-local mechanism if any, status [present / partial / missing / defer], target surface for routing, evidence-vs-inference label).
- **Companion baseline**: extend [governance-concepts-and-mechanism-gap-baseline.md](.agent/analysis/governance-concepts-and-mechanism-gap-baseline.md) only if a finding directly sharpens its mechanism-gap inventory; otherwise leave it untouched and cross-link.
- **Promotion rule**: if any single slice produces enough comparative material to stand alone (e.g. methodology-ecosystem vs ADR-125 portability model), spawn a slice-scoped analysis note rather than overstuffing the baseline.

## Phase 3 — Promoted report(s)

Decide based on what Phase 1 + Phase 2 actually surface. Possible shapes:

- One umbrella synthesis: `.agent/reports/agentic-engineering/deep-dive-syntheses/practice-aligned-direction-survey.md`.
- OR per-slice promoted reports if findings genuinely diverge in audience or argument shape (e.g. a separate report on "agent-artefact-portability vs the AGENTS.md ecosystem").
- OR no new report this session, with explicit rationale for why the research-plus-analysis output is the right closure point.

The closing decision must be justified in the closeout, not assumed up front.

## Phase 4 — Discovery routing updates

- Update [.agent/research/agentic-engineering/README.md](.agent/research/agentic-engineering/README.md) lane map for any new lanes (Slice B, Slice D).
- Update [.agent/research/agentic-engineering/governance-planes-and-supervision/README.md](.agent/research/agentic-engineering/governance-planes-and-supervision/README.md) to surface the direction-of-travel note (Slice A).
- Update [.agent/reference/agentic-engineering/README.md](.agent/reference/agentic-engineering/README.md) topic map only if a deep dive is created or extended.
- Cross-link from [.agent/analysis/governance-concepts-and-mechanism-gap-baseline.md](.agent/analysis/governance-concepts-and-mechanism-gap-baseline.md) and [.agent/reports/agentic-engineering/deep-dive-syntheses/governance-concepts-and-integration-report.md](.agent/reports/agentic-engineering/deep-dive-syntheses/governance-concepts-and-integration-report.md) where they reference the new material.

## Closeout (mandatory per the prompt)

- State what landed.
- List artefacts created or updated, grouped by lane.
- Separate evidence from inference explicitly.
- Name the most important unresolved question.
- Declare whether the work changed only research/reporting/discovery surfaces, or whether findings imply future doctrine/planning follow-up (and if so, where the recommendation is filed — never edited into doctrine in this session).
- Update [.agent/memory/napkin.md](.agent/memory/napkin.md) with surprises and watchlist candidates.

## Out of Scope (explicit fences)

- No edits to ADRs, `/docs/**`, Practice Core, directives, principles, or any platform-adapter canonical content.
- No new plans created during this session; routing recommendations to existing or future plans is the closeout mechanism.
- No code changes; no quality-gate runs beyond what discovery-routing changes require (markdownlint at most, gated by the practice fitness rules).
- No promotion of speculative findings into doctrine; promotion happens through future planning, not in this session.

## Risk Watch

- **Framework tourism risk**: high. Mitigation — every section closes with a repo-local implication; vendor names without local implication get cut.
- **Scope creep across four slices**: high. Mitigation — Phase 2/3/4 are contingent on Phase 1 evidence, not pre-committed.
- **Source-quality drift**: medium. Mitigation — primary-source rule is binding; WebFetch over agent dispatch for citation work.
- **Doctrine drift via the back door**: medium. Mitigation — recommendations route to plans/reports; the session does not edit canon.