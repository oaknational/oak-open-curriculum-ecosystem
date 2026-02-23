# Onboarding: Merge-Blocking Remediation

> **Status**: MERGE BLOCKER — not started
>
> **Date**: 23 February 2026
>
> **Source**: [onboarding-review-report.md](../../developer-experience/onboarding-review-report.md)
> — 8 independent onboarding reviews across junior devs, mid-level devs, lead
> devs, principal engineers, engineering managers, product owners, CTOs, and CEOs
>
> **Strategic follow-on**: [onboarding-strategic-follow-on.plan.md](../../developer-experience/onboarding-strategic-follow-on.plan.md)
> (B1-B10, schedule post-merge)
>
> **Reviewed by**: `architecture-reviewer-barney` — restructured per
> simplification recommendations (track separation, duplicate collapse,
> dependency ordering, dropped-finding restoration)
>
> **Principle**: The quality gates, type safety rules, TDD discipline, and
> architectural constraints are the structural immune system of the codebase.
> Without guardrails, human and AI developers will diffuse the coding structure
> and standards, and the repository will slowly degrade and eventually die. The
> guardrails communicate intended structure, detect variance early, and reduce
> and remove entropy. They are both a statement of a goal and the means to
> achieve it. This rationale must be communicated to every audience.

## Scope

Onboarding correctness, discoverability, and audience-path remediation. Items
are ordered by dependency, not just effort. Foundation items (correctness,
single source of truth) come first; audience paths build on them.

Status key: `[ ]` not started, `[~]` in progress, `[x]` complete.

---

### A1. Onboarding Correctness Sweep

Foundation work — fixes factual errors, stale content, and contradictions that
undermine trust in the documentation. Everything else depends on this being
clean.

- [ ] **A1.1. Fix broken link to `institutional-memory.md` in README**
  - Files: `README.md`
  - Action: Update or remove the link at line 22. Either create the file as a
    pointer to `.agent/memory/` or link directly to `.agent/memory/distilled.md`.

- [ ] **A1.2. Add prerequisites section (Node 24, pnpm, gitleaks)**
  - Files: `docs/development/onboarding.md`, `README.md`
  - Action: Add a "Prerequisites" section before the clone step covering
    Node.js 24.x (with `nvm`/`fnm` link), pnpm (with `corepack enable`), and
    gitleaks (with install link). Mention that `corepack enable` auto-installs
    the pinned pnpm version.

- [ ] **A1.3. Add `.nvmrc` file**
  - Files: `.nvmrc` (new)
  - Action: Create `.nvmrc` in repo root containing `24`.

- [ ] **A1.4. Fix `.env.example` misleading comments**
  - Files: `.env.example`
  - Action: Change line 40 from "required — MCP servers fail at startup without
    these" to "required only for search features and some MCP server modes". Fix
    line 42 path from `docs/ES_SERVERLESS_SETUP.md` to
    `apps/oak-search-cli/docs/ES_SERVERLESS_SETUP.md`.

- [ ] **A1.5. Fix script-documentation drift**
  - Files: `docs/development/onboarding.md`, `docs/development/build-system.md`,
    `docs/quick-start.md`, `docs/development/troubleshooting.md`
  - Action: Add `subagents:check` to `pnpm make` and `pnpm qg` descriptions.
    Fix `quick-start.md` truncated `pnpm make` description. Fix
    `troubleshooting.md` pnpm version (9.x+ → 10.x). Fix `pnpm qg` "smoke" →
    `smoke:dev:stub`. Make `build-system.md` the single source of truth;
    `CONTRIBUTING.md` and `onboarding.md` defer to it.

- [ ] **A1.6. Fix additional link and content errors**
  - Files: `README.md`, ADR-029, ADR index
  - Action: Fix `README.md` line 3 double-dash typo
    ("Elasticsearch-serverless--backed"). Fix ADR-029 stale references (moved
    plan file, incorrect workspace path). Remove or relabel deprecated "Quick
    Navigation" links in ADR index. Resolve `CONTRIBUTING.md` E2E test
    credential guidance contradiction with `onboarding.md`.

### A2. Human-First Onboarding Structure

Depends on A1. Restructures the human onboarding path to be audience-aware,
jargon-free, and progressive. Currently the human path is weaker than the AI
path — this closes that gap.

- [ ] **A2.1. Add "What's Different About This Repo" section**
  - Files: `docs/development/onboarding.md`
  - Action: Add after "Choose Your Path", before "Understand the Core
    Architecture". 5-6 bullet points: schema-first generation, strict TDD, no
    type shortcuts, no disabled quality gates, Result pattern, agentic practice.
    Each with a one-sentence "why". Include the guardrails-as-entropy-reduction
    rationale. Include a brief TDD introduction for newcomers: explain the
    Red-Green-Refactor cycle with a concrete example from the repo, not just the
    rule statement.

- [ ] **A2.2. Define jargon inline on first use**
  - Files: `docs/development/onboarding.md`, `README.md`
  - Action: Define MCP, OpenAPI, ADR, SDK, TDD, Zod on first use with brief
    parenthetical. E.g. "MCP (Model Context Protocol — a standard for
    connecting AI tools to data sources)". Define "workspace" in the monorepo
    context. Consistently define "ADR" on first use in each document.

- [ ] **A2.3. Add default path and plain-English path descriptions**
  - Files: `docs/development/onboarding.md`
  - Action: Add to "Choose Your Path": "If you are not sure, start with the
    SDK/docs path — it requires no credentials and lets you explore the codebase
    safely." Add one-sentence plain-English descriptions of what each path
    involves. Reorder onboarding step 4 to separate "verify (no keys)" from
    "full pipeline (may need keys)".

- [ ] **A2.4. Add "Day 1 essentials" vs "reference" separation**
  - Files: `docs/development/onboarding.md`
  - Action: Visually separate steps 1-4 as "Day 1 essentials" and steps 5-11
    as "Reference — read when you need them". Add a "You're ready when..."
    checklist after the essentials section. Add expected-output annotations
    after key verification commands (e.g. "You should see all tests passing —
    no failures"). Add time-to-productivity estimates by contribution level.

- [ ] **A2.5. Link architecture diagram from canonical onboarding path**
  - Files: `docs/development/onboarding.md`
  - Action: Add a prominent link to the architecture TL;DR diagram from
    `quick-start.md` or `docs/architecture/openapi-pipeline.md`. The canonical
    onboarding path should not require reading `quick-start.md` to see the data
    flow.

- [ ] **A2.6. Fix type safety guidance inaccuracy**
  - Files: `docs/quick-start.md`
  - Action: Refine "use `unknown` at boundaries" to: "Data entering the system
    is `unknown` — immediately validate it using the generated Zod schemas from
    the SDK. After validation, you have exact types; never widen them back."
    Add `as const` exception explicitly to `rules.md` type assertions rule.

### A3. Workflow and Review Contract

Depends on A1. The single biggest gap for team-scale adoption. Merges the
PR/review lifecycle, AI reviewer role, and CI-vs-local gate relationship into
one deliverable.

- [ ] **A3.1. Create workflow and review documentation**
  - Files: `CONTRIBUTING.md` (new section) and/or
    `docs/development/workflow.md` (new)
  - Action: One document covering the complete lifecycle:
    - Branch creation (conventional naming)
    - TDD cycle (red/green/refactor)
    - Local quality gates (`pnpm fix` for quick fixes, `pnpm make` for full
      pipeline)
    - Commit (conventional commits)
    - Push (pre-push secret scan via husky/gitleaks)
    - PR creation
    - CI checks (list exactly what CI runs)
    - AI sub-agent review: what they do, when they run (during development),
      which reviewers exist, whether findings are advisory or blocking
    - Human review: requirements, what to look for that AI reviewers may miss
    - Merge strategy
    - Automated release via semantic-release
    - Include a diagram showing the flow
    - Document CI-vs-local gap: list what CI runs vs what remains local-only
    - Add quality metrics / "what does good look like?" for individual
      contributors

### A4. Strategic Entry Path

Depends on A1. Makes VISION.md and strategic content discoverable for
non-developer audiences (POs, CTOs, CEOs, board members, funders).

- [ ] **A4.1. Restructure README opening and add strategic entry points**
  - Files: `README.md`, `docs/README.md`, `docs/development/onboarding.md`
  - Action:
    - Add plain-language first sentence to README before the current technical
      description: "This repository is how Oak makes its curriculum available
      to AI tools and the wider education technology community. It powers the
      infrastructure that lets AI assistants help teachers find, adapt, and use
      Oak's openly-licensed curriculum."
    - Add "For strategic overview, start with [Vision](docs/VISION.md)" near
      the top of README (after opening paragraph).
    - Add a "Vision and Strategy" section to `docs/README.md` Getting Started.
    - Add a "Strategic / Leadership" path to `onboarding.md` "Choose Your
      Path": VISION.md → ADR index → practice.md.
    - Add a lead/senior developer path option to "Choose Your Path".
    - Add a brief mission-framing paragraph to the opening of
      `docs/development/onboarding.md` connecting engineering work to teacher
      outcomes and pupil learning.
    - Standardise "sub-agents" vs "subagents" terminology.

### A5. Vision Capability Translation and Evidence

Depends on A4. Makes VISION.md useful for non-technical audiences by adding
user-value descriptions and baseline evidence data.

- [ ] **A5.1. Add user-value capability descriptions and evidence baseline**
  - Files: `docs/VISION.md`
  - Action:
    - For each capability in "What We Deliver Today" and the status table, add
      a user-facing description. E.g. "Semantic search — when a teacher searches
      for a lesson, the system finds the right one 98% of the time, across 7
      different curriculum structures."
    - Add plain-language explanations to each row of the capability status
      table.
    - Add current baseline values where available to the impact measurement
      section (search MRR scores, test suite metrics, package readiness status).
      Note which metrics are pre-public-release aspirational.
    - Translate ground-truth quality scores into teacher-facing language and
      surface as evidence.
    - Add a "Last Updated" date.
    - Expand the Aila relationship section with 2-3 concrete examples of mutual
      reinforcement.

### A6. Human-Facing Agentic Practice Explanation

Depends on A2, A3. Explains the agentic engineering practice for human
developers and managers, linking it into the workflow documentation.

- [ ] **A6.1. Add human-facing practice explanation**
  - Files: `docs/development/onboarding.md` (new section), link from
    `docs/README.md` and/or `docs/architecture/README.md`
  - Action: Explain in plain language:
    - What the sub-agents do (review code, architecture, types, tests)
    - When they run (during development, invoked by the working AI agent)
    - What the napkin/distilled memory is (AI institutional memory — humans can
      ignore these files unless curious)
    - What is expected of human developers (follow the same rules the agents
      follow: TDD, type safety, quality gates)
    - How AI review fits into the PR lifecycle (cross-reference A3.1)
    - For managers: what the practice means for team velocity and quality, what
      to monitor, how it affects management approaches
    - Surface the "single engineer + AI" staffing-model evidence from ADR-119
      in the README's "Agentic Engineering Practice" section, with link to
      ADR-119
    - Make the 115 ADR count prominent as a maturity signal

### A7. ADR and Link Hygiene

Can run in parallel with A2-A6. Addresses foundational ADR stale content and
navigation issues.

- [ ] **A7.1. ADR and link hygiene pass**
  - Files: ADR-029, ADR index, various
  - Action: Fix ADR-029 stale references (moved plan file path, incorrect
    workspace path `packages/oak-curriculum-sdk/` →
    `packages/sdks/oak-curriculum-sdk/`). Remove or relabel deprecated "Quick
    Navigation" links in ADR index that point to archived documents. Consider
    adding a "Start Here: 5 ADRs in 15 minutes" callout to the ADR index.

### A8. Extension Points Guide

Lower dependency, can be done later. Addresses the "how do I add things?" gap
for leads and principals.

- [ ] **A8.1. Create extension points guide**
  - Files: `docs/development/extending.md` (new) or section in
    `CONTRIBUTING.md`
  - Action: Practical guidance for: adding new MCP tools, adding new search
    indices, extending the SDK with new helpers, adding new core packages.

---

## Specialist Delegations

Invoke these specialists during or after remediation to validate changes.

| Specialist | Items |
|---|---|
| `docs-adr-reviewer` | A7.1 (ADR link hygiene), A5.1 (VISION.md structural improvements) |
| `config-reviewer` | A1.4, A1.5 (command drift, `.env.example` contradictions, CI pipeline gap) |
| `test-reviewer` | A3.1 (E2E credential requirements clarification) |

## Dependency Graph

```text
A1 (correctness) ──┬──► A2 (human-first structure)
                    │
                    ├──► A3 (workflow + review)
                    │
                    ├──► A4 (strategic entry path)
                    │         │
                    │         └──► A5 (vision translation + evidence)
                    │
                    └──► A7 (ADR hygiene) [parallel]

A2 + A3 ──► A6 (human-facing practice explanation)

A8 (extension points) [low dependency, can start any time after A1]
```
