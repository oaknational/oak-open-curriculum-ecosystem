# Oak Repository Professionalism and Engineering Quality Report - 2026-06-03

**Status:** Stable assessment report  
**Author:** Airy Whirling Wing (codex / GPT-5 / `019e8e`)  
**Branch observed:** `feat/graph-tooling-tidyup`  
**Assessment date:** 2026-06-03  
**Scope:** Live repository state, local quality controls, documentation substrate,
agentic engineering practice, and observed operational behaviour during the
assessment session.

---

## 1. Executive Verdict

This repository is **high-skill, high-discipline, high-friction**.

It is not amateur work. It has a strong TypeScript foundation, serious
schema-first architecture, a large test estate, custom linting, secrets
scanning, SonarCloud integration, extensive ADR/PDR documentation, generated
SDK boundaries, and repo-native collaboration tooling. In raw engineering
seriousness, it sits well above the average TypeScript monorepo.

The principal weakness is not lack of professionalism. The weakness is
**operational mass**: the combination of process surfaces, agent coordination
state, long-lived plans, extensive doctrine, and verbose verification output
creates a high cognitive entry cost. The repo is powerful, but it is not calm.
It asks a lot from every contributor before they can safely change anything.

### Summary rating

| Dimension | Rating | Blunt verdict |
|---|---:|---|
| Engineering seriousness | 8.0 / 10 | Strong, unusually deliberate, real quality controls. |
| Code quality | 8.0 / 10 | Strong type discipline and test culture; some complexity pressure. |
| Architecture quality | 8.0 / 10 | Coherent schema-first and modular boundaries; heavy doctrine load. |
| Product effectiveness | 7.0 / 10 | Real capabilities; delivery likely slowed by operational ceremony. |
| Operational professionalism | 6.5 / 10 | Strong controls, but noisy and hard to read under live activity. |
| Contributor approachability | 5.5 / 10 | A capable newcomer will struggle without guided onboarding. |
| Documentation quality | 7.0 / 10 | Deep and valuable, but excessive active surface area. |
| Agentic collaboration maturity | 8.5 / 10 | Advanced and instrumented; also a major complexity source. |
| Verification posture | 8.0 / 10 | Broad gates; some signal-to-noise and environment-sensitivity issues. |
| Maintainability risk | 6.5 / 10 | Good local discipline; global system weight is the largest risk. |

### Overall score

**7.3 / 10 overall.**

That number is intentionally not higher. The code and engineering controls are
strong enough to justify an 8+ in isolation, but a repository's quality is not
only about whether the code is good. It is also about whether humans and agents
can reliably understand, change, verify, and ship it without being swallowed by
the system around it. On that broader measure, the repo is strong but heavy.

---

## 2. Method

This assessment combined:

1. **Live repository sampling**: file counts, workspace topology, report
   surfaces, TypeScript/test/doc density, tracked artefact hygiene, and git
   state.
2. **Tooling inspection**: root scripts, Turbo configuration, TypeScript
   settings, ESLint standards, workspace structure, and generated-code
   boundaries.
3. **Code sampling**: representative core package code, server bootstrap,
   generated SDK entry points, and custom lint rules.
4. **Verification attempt**: `pnpm agent-tools:repo-check profile`, which
   expands to the full `pnpm check` aggregate.
5. **Operational observation**: dirty-tree movement and branch advancement
   during the assessment.
6. **Metacognition pass**: the assessment was reframed from "score the repo"
   into "produce an actionable improvement report that preserves the useful
   harshness while linking each criticism to impact."

### Metacognitive adjustment

The surface request was a professionalism rating. The deeper impact requested
was improvement. A report that only says "this is good but heavy" would be
insufficient. The actionable bridge is:

> Accurate diagnosis -> named failure modes -> ordered recommendations ->
> lower operational drag without weakening quality gates.

That bridge shapes this document. It does not argue for making the repo less
rigorous. It argues for making the rigour easier to consume, trust, and operate.

---

## 3. Evidence Snapshot

The following figures were gathered from the live checkout during the
assessment. Counts may drift as the repo changes.

| Evidence point | Observed value |
|---|---:|
| Tracked files | 8,913 |
| TypeScript-family files (`*.ts`, `*.tsx`, `*.mts`, `*.cts`) | 2,390 |
| Test/spec files | 573 |
| Markdown files | 3,044 |
| Package manifests in workspaces/apps/agent-tools | 24 |
| Plan Markdown files under `.agent/plans` | 1,045 |
| ADR Markdown files | 182 |
| PDR Markdown files | 90 |
| Always-on rule files under `.agent/rules` | 86 |
| Tracked paths containing spaces | 10 |
| Generated SDK/source files matched by generated glob | 129 |
| Full Markdown line count | about 824,349 lines |
| Full TypeScript-family line count | about 280,966 lines |

### Current branch and working tree signals

The branch was observed as ahead of origin and actively changing during the
assessment. It moved from **ahead 24** to **ahead 29** across the session, and
the dirty set changed while analysis was underway.

That does not by itself prove poor discipline. In this repo, concurrent agent
work is expected and supported by collaboration-state tooling. But it is a
material operating condition: the repo's professionalism depends not only on
code quality, but on whether the collaboration substrate remains clear,
trusted, and cheap enough to use.

### Full check attempt

`pnpm agent-tools:repo-check profile` expanded to the full `pnpm check`
aggregate. The run produced a timing profile and exited non-zero:

| Result | Value |
|---|---|
| Exit code | 1 |
| Duration | about 124 seconds |
| Turbo tasks successful | 104 |
| Turbo tasks total | 108 |
| Failing tasks | 4 |

The visible failures were:

- `@oaknational/oak-curriculum-mcp-streamable-http#test:ui`
- `@oaknational/oak-curriculum-mcp-streamable-http#test:widget:ui`
- `@oaknational/oak-curriculum-mcp-streamable-http#test:widget:a11y`
- `@oaknational/oak-curriculum-mcp-streamable-http#test:a11y`

The proximate failure was Playwright/Chromium launch under a restricted macOS
sandbox, with Mach-port permission errors. This should be classified as
**environment-sensitive verification failure**, not immediately as product
failure. The important professionalism point is that the repo's aggregate gate
contains browser/a11y checks that are meaningful but not always runnable inside
restricted agent environments.

### Positive verification evidence from the run

Before the Playwright failures, the run showed:

- Secrets scan over 1,597 commits with no leaks found.
- Collaboration-state validation over 2,851 JSON files.
- Boundary validators passing.
- Many package builds, type-checks, lint tasks, and tests passing.
- Agent-tools test suite passing 95 files and 855 tests in the visible output.
- Multiple package-level unit/integration suites passing across core,
  observability, design tokens, SDK support, MCP server, and search CLI.

This is strong evidence of a serious verification posture.

### Negative verification evidence from the run

The check output was noisy:

- Some passing tests intentionally exercise invalid CLI options and emit full
  `error: unknown option` usage dumps.
- Search ingestion tests emit many structured log lines during the aggregate.
- Playwright environment failures generate long browser launch traces.

This lowers operator trust. A high-quality gate should make the true failure
signal obvious. Here, the signal is present, but the operator has to work too
hard to separate expected negative-path output from real failure.

---

## 4. What the Repo Does Well

### 4.1 It has a real architectural spine

The repo is not just a pile of packages. It has an explicit architecture:

- OpenAPI-driven SDK generation.
- Schema-first type and validator flow.
- MCP server surfaces.
- Search CLI and search SDK.
- Generated tool descriptors.
- Graph and ontology-oriented packages.
- Design token packages.
- Observability packages.
- Agent tooling and practice substrate.

The root `README.md` gives a coherent account of the mission: SDK, MCP server,
semantic search, reusable sector components, and agentic-first engineering.
The workspace list in `pnpm-workspace.yaml` supports that shape rather than
contradicting it.

### 4.2 The TypeScript posture is strong

The root TypeScript configuration uses:

- `strict: true`
- `noUnusedLocals`
- `noUnusedParameters`
- `noImplicitReturns`
- `noFallthroughCasesInSwitch`
- `erasableSyntaxOnly`
- ESM/bundler resolution
- declaration output

The custom ESLint strict config goes significantly further:

- bans explicit `any`
- bans non-null assertions
- bans unsafe assignment and unsafe return
- bans casual type assertions
- bans bare or weak `@ts-expect-error`
- bans `@ts-ignore` and `@ts-nocheck`
- bans per-file `eslint-disable` except owner-approved forms
- bans skipped/focused Vitest tests
- restricts type-destroying patterns such as `object`, `Object`, `{}`,
  `Record<string, unknown>`, `Record<string, any>`, and `unknown[]`
- restricts unsafe `Object.keys` / `Object.values` / `Object.entries` and
  `Reflect.*` patterns

This is not cosmetic. It materially reduces classes of TypeScript failure that
most repositories tolerate.

### 4.3 The repo owns its local engineering standards

The `@oaknational/eslint-plugin-standards` workspace is a serious asset. It
does not only consume off-the-shelf lint presets; it encodes project-specific
rules:

- boundary enforcement
- no dynamic import
- no eslint-disable
- no real IO in tests
- max files per directory
- observability emission
- export-shape rules

Having local standards as executable tooling is much stronger than having them
only as prose.

### 4.4 Tests are broad and meaningful

The repo has 573 test/spec files across 2,390 TypeScript-family files. The
sampled test output covered:

- unit tests
- integration tests
- e2e tests
- UI tests
- accessibility tests
- widget tests
- schema/codegen tests
- collaboration-state tests
- lint-rule tests
- observability tests
- security-header tests

This is not a token test suite. It reflects a culture of testing system
behaviour, not just leaf functions.

### 4.5 Security and observability are taken seriously

Positive signals:

- gitleaks is in the aggregate check.
- security headers are integration-tested.
- Sentry and OpenTelemetry concerns are represented in code and ADRs.
- redaction and JSON sanitisation tests exist.
- there is explicit doctrine around PII, logs, and output boundaries.
- SonarCloud is wired into repository quality work.

The repo treats security/observability as architecture, not as afterthoughts.

### 4.6 Generated-code discipline is a major strength

The repository's cardinal rule says types, validators, schemas, and related
static structures flow from the upstream OpenAPI schema and codegen. The code
surface reflects this:

- generated API schema files are tracked and visible
- SDK codegen has its own workspace
- generated tool descriptors carry schema data
- codegen is part of build/check flows
- plans and ADRs explicitly discuss schema-first boundaries

This is exactly the right instinct for a repo whose public value depends on
faithful API/MCP/search contracts.

### 4.7 It preserves institutional memory unusually well

The repo captures decisions, plans, thread state, active claims, closed claims,
napkin notes, reports, ADRs, PDRs, and operational continuity. That is valuable
in a multi-agent environment where context loss is a real failure mode.

Most repositories lose why-decisions. This one overcorrects in the direction of
preserving why-decisions. That overcorrection has costs, but the underlying
instinct is good.

---

## 5. Principal Weaknesses

### 5.1 The operational surface is too large

The biggest issue is not poor code. It is the scale of the meta-system:

- 3,044 Markdown files.
- 1,045 plan files.
- 182 ADRs.
- 90 PDRs.
- 86 rule files.
- a 63,475-line generated/shared comms log.
- many active/archived/operational memory surfaces.

This is an enormous amount of process material. Some of it is essential. Some
of it is probably now historical weight. The problem is not that documentation
exists; the problem is that contributors must understand which documentation
is live, authoritative, stale, historical, or merely evidence.

The repo has authority-order doctrine, but the volume still creates practical
friction.

### 5.2 Contributor onboarding is likely hard

A capable TypeScript engineer entering this repo cold must learn:

- the product domain
- Oak curriculum data
- OpenAPI codegen
- SDK and MCP architecture
- search architecture
- graph/ontology concepts
- Turbo/pnpm workspace flow
- custom lint rules
- quality gates
- ADR/PDR practice
- agent collaboration state
- active claims
- thread records
- commit queue discipline
- napkin/distilled memory surfaces
- current/future/archive plan topology

This is too much for an ordinary first contribution.

The repo may be excellent for agents that follow the start-right ritual. It is
less obviously excellent for a human contributor who wants to fix one bug.

### 5.3 The quality gate is broad but not calm

The aggregate check is ambitious, which is good. But the output is noisy:

- expected negative-path tests emit failure-like CLI text
- structured logs appear in bulk
- browser sandbox failures dominate output
- the final failure summary requires interpretation

Professional CI should reduce interpretive work. A maintainer should be able
to tell quickly:

1. What failed?
2. Is it product failure, environment failure, or known external instability?
3. What is the next action?

This repo has the data, but not always the calm presentation.

### 5.4 Live branch churn creates cognitive risk

During assessment, branch and working-tree state changed underfoot. That is
expected in a multi-agent workflow, but it has consequences:

- stale reads become likely
- command evidence can age quickly
- status summaries can be invalidated mid-turn
- staging and commit operations become risky
- "what is mine?" becomes a real question

The repo has tooling to manage this, but the tooling is itself additional
surface area. The collaboration substrate is impressive; it is also something
that can fail or drift.

### 5.5 Some process language is probably too doctrinal

The repo uses strong vocabulary: cardinal rules, doctrine, practice, authority,
tripwires, cure shapes, and so on. In moderation, this helps create shared
language. At current scale, it risks becoming an internal dialect.

That matters because professionalism is partly about legibility. A new senior
engineer should be able to distinguish:

- "this is a hard safety invariant"
- "this is a local convention"
- "this is historical context"
- "this is an experiment"
- "this is one agent's previous mistake"

The repo contains those distinctions, but the language density makes them
harder to recover quickly.

### 5.6 Documentation may be outpacing distillation

The repo has excellent capture. The open question is whether it has enough
deletion, graduation, consolidation, and summarisation pressure.

The active memory system explicitly says fitness is a routing signal rather
than the goal. That is right. But from an external professionalism standpoint,
there is still a visible risk:

> The repo may be better at recording knowledge than at retiring knowledge.

If not controlled, the documentation substrate will become a tax on every
future change.

### 5.7 Path hygiene has small avoidable sharp edges

There are 10 tracked paths with spaces. That is not disastrous, and most are
research or screenshot artefacts. But in a repo with heavy shell automation,
spaces in tracked paths are unnecessary risk. They already broke a naive
`xargs` command during this assessment.

This is a minor issue in isolation. It is more important as a symptom: an
automation-heavy repo should minimise path forms that make automation fragile.

---

## 6. Professionalism Assessment by Area

### 6.1 Codebase structure

**Rating: 8 / 10**

Strengths:

- clear monorepo package topology
- core/libs/sdks/apps/design separation
- generated SDK workspace separated from runtime consumers
- root scripts expose major workflows
- no tracked `node_modules`, `dist`, `.turbo`, or coverage artefacts found

Risks:

- many packages and generated surfaces require strong navigation aids
- the agent-tools/practice substrate is large enough to be its own product
- some workspaces are likely easier to understand through plans than code,
  which is useful for agents but less ideal for human readers

Verdict:

The structure is professional and deliberate. The risk is scale and cognitive
load, not lack of organisation.

### 6.2 Type safety and runtime validation

**Rating: 8.5 / 10**

Strengths:

- strict TypeScript
- schema-first doctrine
- Zod validation architecture
- custom no-shortcut lint rules
- generated OpenAPI-derived surfaces
- explicit Result pattern package

Risks:

- strictness can become ceremony if contributors cargo-cult around it
- generated and hand-authored schema boundaries need continuous clarity
- the repo's type doctrine is strong enough that any exception can become
  expensive to justify

Verdict:

This is one of the repo's best areas.

### 6.3 Testing

**Rating: 8 / 10**

Strengths:

- broad test suite
- custom lint-rule tests
- integration tests for server/security/search behaviour
- Playwright UI/a11y coverage
- generated-output tests
- collaboration-state and agent-tools tests

Risks:

- aggregate test output is too noisy
- UI/a11y tests are environment-sensitive in restricted agent contexts
- some tests produce failure-looking output when passing
- full-check cost is high enough that agents may avoid it unless explicitly
  required

Verdict:

The test culture is strong. The operator experience needs cleanup.

### 6.4 Security

**Rating: 8 / 10**

Strengths:

- secret scanning in aggregate gate
- no leaks found in sampled full-history-ish scan over 1,597 commits
- security headers tested
- redaction and sanitisation represented in code/tests
- PII/logging concerns explicitly governed

Risks:

- security posture depends on keeping many doctrine surfaces aligned
- generated and logged content boundaries require continuous regression tests
- if the gates are too noisy, security failures may become harder to see

Verdict:

Strong. The main improvement is not more security doctrine; it is cleaner
failure presentation.

### 6.5 Architecture and decision records

**Rating: 7.5 / 10**

Strengths:

- substantial ADR estate
- architecture decisions are traceable
- schema-first, SDK-first, and MCP layering decisions are explicit
- historical decisions are preserved

Risks:

- 182 ADRs is a lot
- not all consumers will know which ADRs are live decision sources versus
  history
- stale plan/ADR references can mislead execution if not continuously audited

Verdict:

The architecture is unusually well-documented. The weakness is discoverability
and currentness pressure.

### 6.6 Documentation and reports

**Rating: 7 / 10**

Strengths:

- clear root README
- formal reports exist
- research/analysis/reports authority split is documented
- domain, engineering, governance, operations, and architecture docs exist
- reports can be impressively self-contained

Risks:

- too many Markdown files
- too many plans
- active and archive states are hard to mentally model
- very long files increase search cost and review fatigue

Verdict:

Documentation quality is high in depth and intent. Its weakness is volume.

### 6.7 Agentic collaboration practice

**Rating: 8.5 / 10 for maturity, 6 / 10 for friction**

Strengths:

- identity discipline
- active claims
- comms validation
- commit queue
- thread records
- start-right workflows
- memory surfaces
- closed-claims archive
- validation of thousands of collaboration JSON files

Risks:

- the collaboration system is large enough to create its own bugs
- contributors must understand process state before acting
- branch movement during assessment showed how live and mutable the system is
- stale collaboration surfaces can misroute work if not kept current

Verdict:

Very advanced. Also high-maintenance.

### 6.8 Delivery effectiveness

**Rating: 7 / 10**

Strengths:

- serious gates
- active planning
- current/future/archive lanes
- reports and plans map decisions to execution
- dependency work, Sonar work, and schema realignment appear actively managed

Risks:

- planning load may slow direct delivery
- too much process can make small changes feel expensive
- repeated quality gates and handoff rituals can crowd out product work

Verdict:

Effective for complex, high-risk work. Potentially inefficient for simple work.

---

## 7. High-Confidence Strengths Worth Preserving

The improvement path should not weaken these.

### 7.1 Schema-first contract discipline

This is a durable advantage. Keep it.

Do not trade generated source-of-truth flow for hand-authored convenience. The
repo's whole product value depends on contract fidelity across OpenAPI, SDK,
MCP, and search surfaces.

### 7.2 Custom executable standards

The local ESLint package is a good investment. It turns doctrine into code and
prevents repeated debate.

Keep the rule system, but make rule discovery and exception policy easier to
consume.

### 7.3 Broad test coverage

The test surface is a strength. The fix is not fewer tests. The fix is quieter
and better-classified test output.

### 7.4 Explicit memory and continuity

Context preservation is a real advantage for agentic workflows. The repo should
not regress to chat-transcript memory. The fix is better distillation and
surface hierarchy.

### 7.5 Security and redaction posture

The repo treats public sector/education data seriousness appropriately. Preserve
that.

---

## 8. Highest-Risk Failure Modes

### 8.1 Process substrate becomes the product bottleneck

The agentic practice layer is powerful, but if every change requires reading a
large body of doctrine and live state, throughput suffers.

Risk pattern:

1. A simple bug fix enters the repo.
2. The agent/human must ground in rules, claims, plans, memory, ADRs, and
   active thread state.
3. The fix itself is small.
4. The process around the fix dominates the work.
5. Contributors start avoiding changes or relying on shortcuts.

The cure is not removing discipline. The cure is **tiering discipline by risk**.

### 8.2 Documentation capture outpaces documentation retirement

The repo captures lessons very well. If retirement/graduation/consolidation is
weaker than capture, the substrate grows without bound.

Risk pattern:

1. Every session records high-fidelity state.
2. Useful observations become plans, reports, napkin notes, active memory,
   thread updates, and comms events.
3. Archive surfaces accumulate.
4. Future agents search more, read more, and trust less.
5. The repo becomes technically correct but operationally exhausting.

The cure is stronger pruning of active surfaces and clearer archive boundaries,
not lower-quality capture.

### 8.3 Gate noise trains people to skim

If full checks emit a lot of expected error-looking text, contributors learn to
skim. That is dangerous.

Risk pattern:

1. Negative-path tests print errors as part of passing behaviour.
2. Logs flood the terminal.
3. Real failures look similar to expected failure text.
4. Operators search for the final summary only.
5. Important warnings or regressions are missed.

The cure is log capture, test output suppression, and clear failure
classification.

### 8.4 Multi-agent state drift causes false confidence

Branch movement during assessment showed live state can change quickly.

Risk pattern:

1. An agent reads git status.
2. Another actor changes files or commits.
3. The first agent continues from stale assumptions.
4. It stages, reports, or edits against outdated state.
5. Work is accidentally widened, overwritten, or misreported.

The repo already recognises this risk. The improvement is making freshness
checks cheaper and more automatic at action moments.

### 8.5 Internal vocabulary reduces external legibility

Internal terms can be powerful. But if they become required before someone can
understand the repo, they reduce professionalism for external audiences.

Risk pattern:

1. A contributor reads "doctrine", "fitness", "substrate", "tripwire",
   "practice", "plane", "handoff", "claim", "marshal".
2. Some terms are critical; some are local shorthand.
3. The contributor cannot tell which is which.
4. They either over-follow ceremony or ignore important constraints.

The cure is a plain-English contributor path that maps internal vocabulary to
ordinary engineering concepts.

---

## 9. Recommendations

### Recommendation 1: Create a "normal contributor path"

**Priority:** Highest  
**Impact:** High  
**Effort:** Medium  
**Risk reduced:** onboarding friction, process overload

Create a short path for ordinary bug fixes and small changes. It should answer:

- What do I read first if I am not an agent?
- What commands do I run for a small code change?
- Which docs are mandatory versus background?
- How do I know whether I need the full agentic workflow?
- How do I avoid touching collaboration state?
- What is the minimal safe local verification loop?

Suggested artefact:

- `docs/engineering/contributor-fast-path.md`

Suggested structure:

1. **Small code change path**: read package README, run focused tests,
   type-check affected workspace, lint affected workspace.
2. **Generated SDK/codegen change path**: schema/codegen-specific route.
3. **MCP/server change path**: server-specific route and auth/security checks.
4. **Docs/report change path**: formatting and authority-surface rules.
5. **Agentic collaboration path**: when to use start-right, claims, comms,
   handoff, and commit queue.

Acceptance signal:

- A new contributor can make a one-file change without reading the entire
  Practice substrate.

### Recommendation 2: Produce a "current authority map" that is generated or checked

**Priority:** Highest  
**Impact:** High  
**Effort:** Medium to High  
**Risk reduced:** stale-doc execution, wrong authority source

The repo already has many authority surfaces. The issue is discoverability and
currentness.

Create a generated or validator-backed map of:

- current active plans
- current future plans
- archived/completed plans
- authoritative thread records
- live reports
- ADRs superseded by later ADRs
- PDRs that are active versus historical
- rule files and their classification

This should not be hand-maintained prose only. The metacognitive cure shape
applies: if the problem is doc drift, prefer generated or checked surfaces.

Suggested artefact:

- `.agent/reports/authority-surface-inventory.generated.md`, or
- `.agent/memory/executive/current-authority-map.md` generated/validated by
  `agent-tools`

Acceptance signal:

- A stale plan can be mechanically identified as stale, archived, current, or
  blocked.

### Recommendation 3: Make full-check output quieter and more classified

**Priority:** High  
**Impact:** High  
**Effort:** Medium  
**Risk reduced:** skim culture, false alarms, slow diagnosis

The aggregate check should produce a concise final classification:

- Product failure
- Environment failure
- Dependency/network failure
- Known expected negative-path output
- Formatting/lint failure
- Test failure
- Gate infrastructure failure

Specific actions:

1. Suppress or capture expected CLI usage output in tests that intentionally
   pass bad flags.
2. Route structured logs from tests to files unless a test fails.
3. Add a post-run classifier for Playwright browser-launch permission errors.
4. Summarise failed tasks with likely cause and next action.
5. Preserve full logs as artefacts for debugging.

Acceptance signal:

- A failed `pnpm check` produces a short human-readable diagnosis without
  needing to scan thousands of lines.

### Recommendation 4: Split browser/a11y checks by environment capability

**Priority:** High  
**Impact:** Medium to High  
**Effort:** Medium  
**Risk reduced:** false red checks in restricted agent environments

UI and a11y checks are valuable and should remain gates where they can run.
But restricted macOS sandboxes can make Playwright fail before product code is
tested.

Suggested shape:

- Keep browser/a11y checks in canonical CI.
- Add a local environment preflight for Playwright capability.
- When preflight fails locally, report "browser environment unavailable" rather
  than a product failure.
- Provide a targeted rerun command for unsandboxed/local browser validation.

Acceptance signal:

- Restricted agent environments do not confuse browser-launch failures with
  accessibility regressions.

### Recommendation 5: Reduce active documentation surface area

**Priority:** High  
**Impact:** High  
**Effort:** High  
**Risk reduced:** cognitive load, stale guidance, search cost

This is not a call to delete knowledge. It is a call to move knowledge to the
right temperature.

Suggested actions:

1. Define active-doc budgets by surface type:
   - active plans
   - current thread records
   - reports
   - napkin/distilled
   - ADR/PDR indexes
2. Move completed, superseded, or historical content to clearly marked archive
   locations.
3. Add "current authority" banners to active files.
4. Add "historical evidence only" banners to archives.
5. Prefer indexes that point to durable summaries over huge live logs.

Acceptance signal:

- A search for a topic returns a small number of obviously-current surfaces
  before archive material.

### Recommendation 6: Treat the agentic practice layer as a product with UX

**Priority:** High  
**Impact:** High  
**Effort:** Medium to High  
**Risk reduced:** practice friction, process bugs, inconsistent adoption

The practice substrate is now a real product inside the repo. It needs product
thinking:

- user journeys
- error messages
- onboarding
- commands with consistent flags
- discoverability
- state visualisation
- health checks
- migration paths

One small example from this assessment: `claims list --json` failed because
the CLI does not expose that flag, while many other tools commonly do. That is
not a severe defect, but it is exactly the kind of friction that compounds in a
process-heavy repo.

Suggested actions:

1. Standardise `--json` across read/list/show commands where feasible.
2. Add `help` examples for the most common claim/comms workflows.
3. Provide "what should I do next?" output for common failure modes.
4. Add command-output examples to docs.
5. Add a top-level "collaboration CLI cheat sheet".

Acceptance signal:

- Agents and humans can use collaboration tooling without prior memory of CLI
  quirks.

### Recommendation 7: Enforce path hygiene for new tracked files

**Priority:** Medium  
**Impact:** Medium  
**Effort:** Low  
**Risk reduced:** shell fragility

Add or extend a validator that blocks new tracked paths containing spaces
outside explicitly grandfathered historical paths.

Suggested policy:

- Existing 10 paths are grandfathered or renamed deliberately.
- New tracked paths with spaces fail validation.
- Screenshot names should be normalised on import.

Acceptance signal:

- Shell automation can assume tracked paths are safe unless deliberately
  handling historical exceptions.

### Recommendation 8: Separate "engineering rules" from "agent operating rules"

**Priority:** Medium  
**Impact:** High  
**Effort:** Medium  
**Risk reduced:** contributor confusion

A human contributor and an autonomous agent do not need the same always-on
instruction set.

Suggested split:

- Engineering invariants:
  - type safety
  - schema-first
  - test discipline
  - security
  - architecture boundaries
  - no skipped tests
  - no disabled checks
- Agent operating protocols:
  - identity
  - active claims
  - comms
  - handoff
  - thread records
  - commit queue

The repo can keep both, but should make the distinction obvious.

Acceptance signal:

- A human can tell which rules apply to their code contribution and which apply
  only to agent operation.

### Recommendation 9: Add "small change" verification recipes per workspace

**Priority:** Medium  
**Impact:** High  
**Effort:** Medium  
**Risk reduced:** excessive full-check reliance, under-verification

The full aggregate check is too broad to be the default loop for every edit.
Workspace READMEs should include:

- focused unit test command
- workspace type-check command
- workspace lint command
- relevant integration/e2e command
- when full `pnpm check` is required

Acceptance signal:

- A contributor can select a proportionate gate set without guessing.

### Recommendation 10: Introduce report-level "actionability" sections

**Priority:** Medium  
**Impact:** Medium  
**Effort:** Low  
**Risk reduced:** reports becoming passive knowledge

Formal reports should end with:

- what should change now
- what should be planned
- what should be monitored
- what should be archived
- what should not change

This report follows that shape. It should become standard for similar
assessment reports.

---

## 10. Suggested Improvement Roadmap

### Phase 1: Make signals cleaner

Goal: reduce false alarms and operator fatigue without changing architecture.

Actions:

1. Add failure classification to repo-check output.
2. Suppress expected negative-path CLI noise in tests.
3. Capture test logs to files unless failures need them.
4. Add Playwright capability preflight and environment classification.
5. Add path-space validator for new files.

Expected impact:

- Faster diagnosis.
- More trust in gates.
- Less temptation to skim.

### Phase 2: Make entry paths clearer

Goal: reduce contributor onboarding cost.

Actions:

1. Add `docs/engineering/contributor-fast-path.md`.
2. Add per-workspace verification recipes.
3. Create a plain-English map of agentic-practice terms.
4. Separate human engineering rules from agent operating protocols.

Expected impact:

- New contributors can start with less ceremony.
- Agents can still follow full practice when needed.

### Phase 3: Make authority surfaces mechanically current

Goal: reduce stale-plan and stale-doc risk.

Actions:

1. Generate or validate a current authority map.
2. Add stale/superseded detection for plans and ADR references.
3. Add current/archive banners where missing.
4. Retire or summarise large active surfaces.

Expected impact:

- Less time spent proving which document to trust.
- Fewer stale execution paths.

### Phase 4: Productise the collaboration substrate

Goal: make agentic collaboration powerful without being brittle.

Actions:

1. Standardise CLI flags.
2. Add JSON output consistently to list/show commands.
3. Improve error messages and examples.
4. Add collaboration tooling docs aimed at first-time users.
5. Add dashboards or summaries that avoid reading raw state files.

Expected impact:

- Lower process friction.
- Fewer coordination mistakes.
- More reliable multi-agent work.

---

## 11. What Not To Do

### Do not weaken type discipline

The strict TypeScript and lint posture is a competitive advantage. Do not make
the repo easier by allowing `any`, broad `unknown`, casual assertions, skipped
tests, or disabled checks.

### Do not remove generated-code discipline

The OpenAPI/schema-first flow is central to the repo's correctness. Keep it.

### Do not replace institutional memory with chat memory

The repo is right to preserve decisions in durable artefacts. The problem is
not preservation. The problem is active-surface management.

### Do not make full check optional in CI

The full gate should remain canonical in CI. The improvement is local
classification and focused loops, not lower CI standards.

### Do not turn every critique into another rule

The repo already has many rules. Some improvements should be UX, generated
indexes, better command output, and quieter gates rather than more doctrine.

---

## 12. Concrete Next Actions

If choosing only five actions, choose these:

1. **Add repo-check failure classification**, especially environment-sensitive
   Playwright failures.
2. **Quiet expected negative-path test output** so passing tests do not print
   failure-looking CLI usage dumps.
3. **Create a contributor fast path** for small human changes.
4. **Generate or validate a current authority map** for plans/reports/ADRs/PDRs.
5. **Standardise collaboration CLI read commands**, including JSON output and
   examples.

These five preserve the repo's strengths while directly attacking the largest
friction sources.

---

## 13. Final Assessment

This repository is professionally engineered, but not professionally
lightweight.

Its best qualities are:

- strong contract discipline
- serious TypeScript practice
- broad verification
- security awareness
- architectural documentation
- advanced agentic collaboration support

Its worst qualities are:

- too much active process surface
- noisy gates
- difficult onboarding
- live-state churn
- high internal vocabulary load
- risk that documentation growth outpaces retirement

The repo should not become less rigorous. It should become more legible.

The path forward is to keep the engineering spine and reduce operational drag:
clearer entry paths, quieter checks, generated authority maps, better
classification of failures, and a product-quality UX around the collaboration
substrate.

The accurate shorthand remains:

> **High-skill, high-discipline, high-friction.**

That is a good place to be if the next improvement cycle attacks the friction
without dulling the discipline.
