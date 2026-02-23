# Multi-Audience Onboarding Review Report

> **Date**: 23 February 2026
>
> **Methodology**: 8 independent onboarding reviews via the `onboarding-reviewer`
> sub-agent, each through the lens of a specific audience persona
>
> **Merge-blocking plan**: [active/onboarding.plan.md](../semantic-search/active/onboarding.plan.md)
>
> **Strategic follow-on plan**: [onboarding-strategic-follow-on.plan.md](./onboarding-strategic-follow-on.plan.md)

## Executive Summary

The documentation is genuinely excellent for its current target audience —
developers and AI agents. The 115 ADRs, self-teaching agentic practice,
zero-setup contribution path, and schema-first architecture are real strengths.

However, the documentation has a structural blind spot: **it assumes all readers
are technical**. As the audience widens from "developers contributing code" to
"people who need to understand or champion this work", the documentation
progressively fails.

This report captures all findings from eight audience-specific onboarding
reviews.

## Why the Rules Exist

The quality gates, type safety rules, TDD discipline, and architectural
constraints are not bureaucratic overhead. They are the **structural immune
system** of the codebase.

Without guardrails, human and AI developers will diffuse the coding structure
and standards, and the repository will slowly degrade and eventually die. The
guardrails are vital: like all the checks and balances, they exist to
**communicate intended structure, detect variance early, and reduce and remove
entropy**. They are both a statement of a goal and the means to achieve it.

This framing — guardrails as entropy reduction, not friction — must be
communicated clearly to every audience. The onboarding documentation currently
states the rules but does not explain this rationale.

## Audience Status Summary

| Audience | Status | Time to First Success |
|---|---|---|
| Junior devs (0-2 years) | CRITICAL GAPS | Blocked at first command (missing prerequisites) |
| Mid-level devs (2-5 years) | GAPS FOUND | ~1-2 days (friction from agent-facing framing) |
| Lead devs (5-10 years, team responsible) | GAPS FOUND | ~1 day (missing workflow/review process docs) |
| Principal engineers (10+ years, architectural authority) | GAPS FOUND | ~2-4 hours (strong architecture, weak risk docs) |
| Engineering managers (team delivery responsible) | GAPS FOUND | Cannot answer "what's our process?" from docs alone |
| Product owners (vision, roadmap, stakeholders) | CRITICAL GAPS | No path exists; VISION.md is buried |
| CTOs (non-profit, impact) | GAPS FOUND | Strong strategic content, but not discoverable |
| CEOs (non-profit, impact, education) | CRITICAL GAPS | Mission impact invisible from primary entry points |

## Findings That Appeared Across ALL or MOST Reviews

These issues were independently flagged by 4+ reviewers, indicating systemic
rather than audience-specific problems.

### 1. Broken link: `docs/architecture/institutional-memory.md` (8/8 reviewers)

Every single reviewer found this. `README.md` line 22 links to a file that does
not exist. Quick fix, high trust impact.

### 2. Missing prerequisites in onboarding path (6/8 reviewers)

Node.js 24.x and pnpm are not stated at the point of first contact. Junior,
mid-level, lead, engineering manager, principal engineer, and CTO reviewers all
flagged this. No `.nvmrc` or `.node-version` file exists.

### 3. `pnpm make` description missing `subagents:check` (5/8 reviewers)

`docs/development/onboarding.md` and `docs/development/build-system.md` omit
this step from the pipeline description. Script-documentation drift.

### 4. VISION.md is excellent but buried (5/8 reviewers)

The single best document for non-developer audiences appears at line 229 of the
README and is absent from `docs/README.md`. Product owners, CTOs, and CEOs all
flagged this as critical.

### 5. No human-facing explanation of the agentic engineering practice (5/8 reviewers)

The practice is well-documented for AI agents but no human-facing document
explains: what AI reviewers do, how they interact with human review, and what is
expected of human developers. Lead devs, mid-level devs, engineering managers,
CTOs, and principal engineers all flagged this.

### 6. No PR/review workflow documentation (4/8 reviewers)

How does a PR get from "opened" to "merged"? What runs in CI? Do AI reviews
supplement or replace human review? Lead devs, engineering managers, mid-level
devs, and CTOs all asked this question and found no answer.

### 7. `.env.example` contradicts onboarding docs on Elasticsearch requirement (4/8 reviewers)

Line 40 says Elasticsearch is "required" for MCP servers; onboarding and
environment-variables docs say only `OAK_API_KEY` is needed for MCP work.

---

## Audience-Specific Findings

### Junior Developers (0-2 years)

**Review status**: CRITICAL GAPS — blocked at first command

#### P0 (Blocking)

- **No prerequisite installation instructions**: Every onboarding path opens
  with `pnpm install` but none explains how to install pnpm itself, or that
  Node.js 24.x is required. `README.md` goes from `git clone` to
  `pnpm install` with zero prerequisite mention.

#### P1 (High friction)

- **`pnpm make` suggested before env vars configured**: Onboarding step 4
  includes `pnpm make` before environment variable configuration. `pnpm make`
  runs `type-gen` which may require network access and API keys.
- **No gitleaks installation instruction**: The `husky` pre-push hook runs
  `gitleaks` (a binary secret scanner). First `git push` fails with a confusing
  error about a missing binary.
- **"Choose Your Path" not actionable without a task**: Step 0 says "Pick the
  path that matches your first task" using domain jargon (MCP, stdio/HTTP,
  Elasticsearch) without explanation.
- **No jargon definitions or glossary**: MCP, OpenAPI, ADR, SDK, TDD, Zod,
  Turborepo, ELSER, RRF, BM25, stdio used without definition.
- **`.env.example` misleading "required" comment**: Says Elasticsearch is
  "required" but SDK path needs no env vars.

#### P2 (Medium friction)

- **No "what does success look like?" examples**: Commands listed without
  expected output.
- **Redundancy between `quick-start.md` and `onboarding.md`**: Overlapping but
  not identical instructions.
- **11 steps with 15+ document references is overwhelming**: No day-1 vs
  reference separation.
- **No gentle TDD introduction**: Rules stated with intensity but no
  walkthrough for newcomers.
- **pnpm version discrepancy**: `troubleshooting.md` says "9.x+" but
  `package.json` pins `10.29.2`.
- **`.env.example` incorrect path for ES_SERVERLESS_SETUP.md**: Says
  `docs/ES_SERVERLESS_SETUP.md` but actual path is
  `apps/oak-search-cli/docs/ES_SERVERLESS_SETUP.md`.
- **"Zero-Setup Quick Start (0 minutes)" is misleading**: Assumes
  prerequisites are installed.

#### P3 (Polish)

- Add "You're ready when..." checklist at end of onboarding guide.
- Define "workspace" in monorepo context.
- Consistently define "ADR" on first use in each document.
- `cat ... | head -100` is Unix-specific (Windows not supported).
- Mention `pnpm fix` shortcut in onboarding.

### Mid-Level Developers (2-5 years)

**Review status**: GAPS FOUND — functional but friction-heavy

#### P1 (High friction)

- **Human onboarding sends devs to agent-facing documents too early**: Step 2
  directs to `.agent/directives/AGENT.md`, `rules.md`, and `practice.md`
  without human framing. Uses meta-language ("metacognition", "napkin",
  "self-teaching property") without context.
- **`pnpm make` and `pnpm qg` definitions stale in `build-system.md`**: Both
  now include `subagents:check` but docs omit it.
- **No prerequisites section in canonical onboarding path**: Node.js 24.x and
  pnpm not listed.

#### P2 (Medium friction)

- **`quick-start.md` `pnpm make` description severely truncated**: Lists only
  3 of ~8 steps.
- **No "what makes this repo different?" section**: Quality expectations
  discovered reactively rather than upfront.
- **ADRs never explained for newcomers**: Used throughout but never defined.
- **`CONTRIBUTING.md` and `onboarding.md` have inconsistent setup flows**:
  Quality gate ordering differs between documents.
- **Type safety guidance contains inaccuracy**: `quick-start.md` says "use
  `unknown` at boundaries" without clarifying that validation must use
  generated Zod schemas.
- **No data flow diagram in canonical onboarding path**: Architecture TL;DR
  diagram in `quick-start.md` not linked from `onboarding.md`.
- **Agentic practice not framed for human newcomers**: Systems-thinking
  language without practical "what does this mean for me?" framing.

#### P3 (Polish)

- File path link labels used instead of descriptive text.
- README opening is a single 47-word sentence.
- `CONTRIBUTING.md` E2E test credential guidance contradicts `onboarding.md`.

### Lead Developers (5-10 years, team responsible)

**Review status**: GAPS FOUND — architecture clear, process invisible

#### P1 (High friction)

- **No PR review workflow or AI reviewer interaction documentation**: Cannot
  answer "what does our review process look like?" for their team. The
  `invoke-code-reviewers` rule is in `.cursor/rules/` and is not referenced
  from any human-facing document.
- **Agentic practice not mentioned in human onboarding path**: Referenced as
  "agent entry point" — a lead would reasonably skip it.
- **ADR index "Quick Navigation" links point to archived/deprecated
  documents**: First navigation options lead to superseded content.

#### P2 (Medium friction)

- **No CI/CD pipeline documentation**: Cannot answer "what runs in CI?" without
  reading the workflow file directly.
- **Audience stated as "junior-to-mid-level" excludes lead perspective**: No
  documentation path optimised for a lead developer.
- **Extension points undocumented**: No guide for adding MCP tools, search
  indices, SDK helpers, or core packages.
- **`practice.md` is excellent but has no "entry for humans" framing**: Lives
  in `.agent/directives/` and is not linked from human-facing docs.
- **No `.nvmrc` or `.node-version` validation documented**.
- **"Known Gate Caveats" with hard date may become stale**: No mechanism for
  keeping the section current.

#### P3 (Polish)

- README has two partially overlapping commands sections.
- ADR index could benefit from "Start Here: 5 ADRs in 15 minutes" callout.
- `quick-start.md` is 370 lines for a "quick start".
- `CONTRIBUTING.md` release process section is very brief.
- `tooling.md` "Validation" section feels vestigial.

### Principal Engineers (10+ years, architectural authority)

**Review status**: GAPS FOUND — strong foundations, sustainability concerns

#### P1 (High friction)

- **ADR-029 has stale references**: Foundational ADR with broken links to moved
  plan files and incorrect workspace paths.
- **No architectural risk register or technical debt inventory**: No
  consolidated view of architectural risks, known limitations, or active
  technical debt.

#### P2 (Medium friction)

- **Excessive repetition of Cardinal Rule across 8+ documents**: Creates
  documentation scaling risk; formulations differ slightly.
- **Foundational ADR set repeated identically in 7+ documents**: Same DRY
  concern.
- **Bus factor not acknowledged in onboarding materials**: Single author, not
  documented as a risk with mitigation strategy.
- **No documentation of type-generation pipeline failure modes**: Happy path
  documented but constraints, unsupported patterns, and breaking-change
  experience not covered.
- **`pnpm qg` says "smoke" but actual command is `smoke:dev:stub`**: Precision
  gap.
- **Agentic practice sustainability not evaluated**: How does the documentation
  volume (500+ agent-related files) scale as the team grows?

#### P3 (Polish)

- `as const` exception to "no type assertions" rule should be explicit in
  `rules.md`.
- Mutation testing (Stryker) listed as tooling but not documented.
- `CONTRIBUTING.md` references `OPENAI_API_KEY` without explaining its role.
- Several Cursor-specific paths in supposedly platform-agnostic documents.

### Engineering Managers (team delivery responsible)

**Review status**: GAPS FOUND — quality clear, process unclear

#### P1 (High friction)

- **No end-to-end development workflow document**: The workflow is distributed
  across 5+ documents; a manager cannot describe the dev cycle without reading
  all of them.
- **No description of the PR review process in `CONTRIBUTING.md`**: Nothing
  about what happens after a PR is opened.
- **No documentation on AI reviewer vs human review relationship**: AI review
  system written for AI agents, not managers.
- **CI pipeline does not run full quality gates**: CI is a subset of `pnpm qg`
  but this gap is not documented; E2E, UI, smoke, markdownlint, and
  subagents:check are local-only.

#### P2 (Medium friction)

- **No estimated time-to-productivity**: Setup times given but not time to
  first merged PR.
- **No quality metrics or success criteria for developers**: No "what does good
  look like?" for individual contributors.
- **"Known Gate Caveats" acknowledges a failing test**: Tension with "all
  quality gates are always blocking" rule.
- **Bus factor not documented**: Single author, no documentation about team
  size or knowledge distribution.
- **Scaling characteristics not addressed**: No documentation on remote
  caching, CI queue time, or generated-file merge conflicts.
- **Agentic practice lacks management-facing summary**: Outcome-focused summary
  for managers does not exist.

#### P3 (Polish)

- README has significant content duplication.
- Inconsistent command notation across onboarding documents.
- `quick-start.md` contains code examples that add length without value for
  managers.
- Contribution levels could cross-reference onboarding docs more explicitly.

### Product Owners (vision, roadmap, stakeholders)

**Review status**: CRITICAL GAPS — no path exists for this audience

#### P1 (High friction)

- **No product owner entry point exists**: Every onboarding path targets
  developers or AI agents.
- **VISION.md is buried and hard to discover**: Best PO document appears at
  line 229 of README, absent from `docs/README.md`.
- **All capabilities described technically, not in user value terms**: "4-way
  Reciprocal Rank Fusion hybrid search" — what does this mean for a teacher?
- **`docs/README.md` has no product vision or strategy section**: Documentation
  hub omits vision entirely.

#### P2 (Medium friction)

- **No user personas or journey documentation**: Three audiences named but not
  defined with needs or journeys.
- **Roadmap milestones in engineering language**: "SDK workspace separation"
  rather than user outcomes.
- **Impact measurement has no baselines, actuals, or targets**: Categories
  defined but empty.
- **Domain model only accessible in TypeScript code files**: Key stages,
  subjects, lessons, threads only defined in `ontology-data.ts`.
- **Aila relationship vague**: "Mutual reinforcement" without concrete
  integration examples.

#### P3 (Polish)

- README opening should have a plain-English first sentence.
- Capability status table could add a "User-Facing Impact" column.
- VISION.md should have a "Last Updated" date.
- Ground-truth quality metrics (MRR 0.983) should be surfaced as evidence.

### CTOs (non-profit, impact-focused)

**Review status**: GAPS FOUND — strong strategic content with discoverability
problems

#### P1 (High friction)

- **No executive summary for strategic decision-makers**: README structure
  starts with developer content; a CTO cannot assess strategic value in 5
  minutes.
- **Agentic practice's strategic significance not visible in public-facing
  docs**: The "single engineer + AI" evidence from ADR-119 is buried.
- **VISION.md lacks cost model or sustainability framing**: Answers "why
  invest?" but not "what does investment require?".

#### P2 (Medium friction)

- **Impact measurement has no baselines or targets**: Framework is conceptually
  sound but operationally empty.
- **Contributing section is ambiguous**: "Not accepting external contributions"
  but MIT-licensed — is this "source-available" or "community open source"?
- **No technology risk register or dependency summary**: Key external
  dependencies not consolidated with lock-in assessment.
- **Onboarding has no strategic reader path**: No "Choose Your Path" option for
  leadership.
- **ADR count and maturity signal not visible at first glance**: 115 ADRs is an
  extraordinary signal of engineering maturity but it is mentioned only in
  passing.
- **SECURITY.md minimal for CTO risk assessment**: Does not address data
  governance, PII handling, or MCP security posture at an organisational level.
- **Practice transferability claimed but not evidenced**: ADR-119 says the
  practice is transferable but does not describe what is general vs
  Oak-specific.

#### P3 (Polish)

- `README.md` line 3 has double-dash typo ("Elasticsearch-serverless--backed").
- Terminology inconsistency: "sub-agents" vs "subagents".

### CEOs (non-profit, impact-focused, education)

**Review status**: CRITICAL GAPS — mission impact invisible from primary entry
points

#### P0 (Blocking)

- **README opening sentence impenetrable for non-technical readers**: Single
  sentence with 8+ technical terms. A CEO visiting the now-public repository
  forms their impression in 30 seconds; this tells them nothing about mission
  impact.

#### P1 (High friction)

- **"Repo Contents" uses insider/developer framing exclusively**: All
  descriptions written for developers.
- **No executive summary or "start here" for non-technical stakeholders
  anywhere**: Every path is technical; zero mention of mission or impact in
  `docs/README.md`.
- **VISION.md has strong strategic thinking but zero evidence data**: Compelling
  narrative but no numbers for board reporting.
- **Capability status table uses unexplained jargon**: "MCP Apps extension
  interaction model" means nothing to a non-technical reader.

#### P2 (Medium friction)

- **Aila relationship well-framed but too vague**: A CEO cannot articulate the
  concrete boundary and complementarity.
- **Roadmap has no mission framing**: Milestones described as engineering tasks,
  not user or mission outcomes.
- **Human onboarding has zero mission context**: New engineers get no sense of
  why their work matters.
- **Ecosystem/open-source strategy not articulated for non-technical
  audiences**: Why openness is a strategic advantage for a non-profit is never
  explained.
- **Risk communication entirely absent or purely technical**: No reputational,
  operational, or financial risk framing.
- **Mission language concentrated in VISION.md**: 19 mission-term mentions in
  VISION.md vs near-zero in README, onboarding, docs/README, practice,
  CONTRIBUTING.

#### P3 (Polish)

- CONTRIBUTING.md says "not accepting contributions" then provides extensive
  guidelines — contradictory signal.
- Ground-truth quality scores (MRR 0.983) would be powerful in a board report
  if translated ("finds the right lesson 98% of the time").
- `quick-start.md` closes with "Ready? Let's build type-safe, schema-driven
  APIs" — developer-culture language.
- LICENCE-DATA.md and BRANDING.md are clear and well-drafted governance
  documents — a genuine strength.

---

## Cross-Cutting Observations

### 1. AI-agent onboarding is consistently better than human onboarding

Every reviewer noted that the AI path (`start-right` → `AGENT.md` → directives)
is more comprehensive, better structured, and better maintained than the human
path. This is architecturally interesting but creates a gap where human
contributors get a less thorough onboarding than AI agents.

### 2. VISION.md is the most strategically valuable document and the least discoverable

It appears at line 229 of the README and is absent from `docs/README.md`.
Surfacing it would address findings from 5 of 8 audiences simultaneously.

### 3. Documentation repetition is both a strength and a risk

The Cardinal Rule appears in 8+ documents, the foundational ADR list in 7+.
This aids discoverability (you can start anywhere and find the rule) but creates
a maintenance scaling risk. A principal engineer and CTO both flagged this
independently.

### 4. The quality bar is clear but never explained to newcomers

Every developer-audience reviewer noted that the rules are stated but the
rationale is absent. The rules are experienced as demands rather than
invitations. The guardrails-as-entropy-reduction framing — that without them the
repo will slowly degrade and die — must be communicated upfront. The rules are
not friction; they are the mechanism by which the codebase maintains structural
integrity over time, across contributors, across the human-AI boundary.

### 5. Process documentation is the biggest gap for team-scale adoption

Workflow, review process, CI/CD relationship, and AI reviewer interaction are
all undocumented for human consumption. This blocks engineering managers and lead
developers from adopting the repo for their teams.
