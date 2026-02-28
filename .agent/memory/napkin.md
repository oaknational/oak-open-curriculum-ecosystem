# Napkin

## Session: 2026-02-28 — HTTP MCP env/CORS tidy-up

### What was done

Implemented the HTTP MCP env CORS tidy-up plan (3 phases):
- Phase 1: Removed CORS_MODE, ALLOWED_ORIGINS, BASE_URL, MCP_CANONICAL_URI
  from env schema. Removed dead readEnv/deriveBaseUrl/deriveMcpCanonicalUri
  functions. Simplified createCorsMiddleware to always allow all origins
  (origin: true). Removed CorsMode type, resolveCorsMode,
  resolveAllowedOrigins and all helper functions from security-config.ts.
  Updated bootstrap-security.ts call. Updated 3 harness env files, server
  harness, .env.example, 3 docs files, README.
- Phase 2: Fixed buildEnvResolutionError in resolve-env.ts to distinguish
  failing keys (shown prominently) from absent-but-optional keys (shown as
  lower-priority diagnostic line). No test changes needed — existing tests
  check for key names in the message, not the exact prefix.
- Phase 3: Wrote ADR-122 documenting permissive CORS rationale.

### Patterns

- When simplifying CORS, the key insight is: CORS adds no security for
  Bearer-token auth because browsers don't auto-send Authorization headers
  cross-origin. The entire three-mode system was configuration surface with
  zero security benefit.
- readEnv() was dead code in production — loadRuntimeConfig → resolveEnv
  was the actual path. readEnv was only called in tests. Watch for test-only
  code paths that masquerade as production code.
- The stale CORS_MODE value was the original bug, but the misleading error
  message was the real operational problem. Error messages that conflate
  optional-absent with actually-failing keys waste operator time.

## Session: 2026-02-28 — KS4 Maths Exploration and MCP Guidance

### What happened

Used oak-local MCP tools to explore KS4 maths resources. Found 36
unique units across Years 10-11, 646 lessons, with foundation/higher
tiers. User asked two follow-up questions about MCP server improvements.

### Decisions made

- Added future plan item (Domain D, item 2) for combining `get-help`
  and `get-ontology` into a single `get-started` tool
- `get-started` should include: "how to use search" section, a
  general-to-pedagogy terms mapping table, and migrated tips content
- Added immediate tip to `tool-guidance-data.ts` about assessment
  terms (GCSE, SATs) vs curriculum content terms for search
- Tip includes forward reference to future `get-started` migration

### Corrections from user

- EYFS is a real official designation (Early Years Foundation Stage),
  not a colloquial term. I initially listed it alongside GCSE and SATs
  as an example of a non-curriculum assessment term. Wrong — EYFS is
  an official stage designation just like KS1-KS4.
- The user (a teacher) said "KS4 maths" — precise, correct. I then
  searched for "maths GCSE" in the threads scope. The user pointed
  out that it was ME (the agent) who introduced "GCSE", not them.
  Professional teachers use the correct curriculum terms. The guidance
  is for consuming agents, not for users. Initial tip wording was
  generic ("search text should use..."); corrected to explicitly
  address agent behaviour ("Agent guidance: do not rewrite the user's
  curriculum terms...").

### Patterns

- The distinction between filter terms and search terms is a general
  MCP design pattern: some user vocabulary maps to API parameters
  (filters), not to content (search text). The MCP server needs to
  communicate this to agents explicitly.
- When writing MCP tool guidance, identify WHO the guidance is for.
  Users (teachers) already know the domain. Agents are the ones who
  make mistakes by "helpfully" translating precise terms into
  imprecise ones. Frame guidance accordingly.
- Extracted pedagogical context work from Domain D of mcp-extensions
  plan into its own plan: improve-pedagogical-context.plan.md. Three
  workstreams: get-started tool (WS1), canonical vocabulary from Oak
  glossary (WS2), MCP agent vocabulary overhaul (WS3). WS1+WS2 can
  ship together; WS3 decouples agent vocabulary from search synonyms.
- User corrected: the MCP "synonyms" (vocabulary hints for agents) and
  the search synonyms (genuine curated/mined aliases for ES query
  expansion) are fundamentally different things. I was conflating them
  by talking about "synonym architecture overhaul" as one thing. The
  plan is about the agent-facing vocabulary only — the search synonym
  infrastructure is a separate, mature system and is out of scope.
- Found significant prior work: the ontology API proposal
  (22-ontology-and-graphs-api-proposal.md) already proposes exactly
  the glossary structure we need. The "handling existing synonymish
  things" research doc has the four-bucket model (alias, pedagogical
  paraphrase, sense-bound, related concept). The "data and domain
  vocabulary" research doc distinguishes structural/control vocabulary
  (GCSE, KS4) from domain vocabulary (trigonometry). All three are
  now referenced in the plan's Prior Work section.
- The Oak official glossary
  (https://open-api.thenational.academy/docs/about-oaks-data/glossary)
  is the definitive list of canonical pedagogical terms. The model for
  agent search guidance is: glossary terms are authoritative (trust
  them), synonyms map colloquial terms to canonical ones. The rule:
  never rewrite a glossary term into a non-glossary term. The
  `get-started` tool should embed the glossary terms as a structured
  canonical vocabulary section so agents can check user terms against
  it. The ontology already has a FUTURE comment about replacing
  synonyms with a proper glossary structure (ontology-data.ts:551).

## Session: 2026-02-27 — Rename to Oak Open Curriculum Ecosystem

### What happened

User decided the project name is "Oak Open Curriculum Ecosystem" (not
"Oak MCP Ecosystem"). GitHub repo is now `oaknational/oak-open-curriculum-ecosystem`.
Executed a comprehensive rename:
- Git remote updated
- README title, clone URL, all GitHub links
- 14 package.json files (repository/bugs/homepage URLs)
- Root package name: `@oaknational/mcp-ecosystem` → `@oaknational/open-curriculum-ecosystem`
- Display name "Oak MCP Ecosystem" → "Oak Open Curriculum Ecosystem" in 13+ active docs
- Repo slug "oak-open-data-ecosystem" → "oak-open-curriculum-ecosystem" in 10+ active docs
- Agent practice files (practice.md, lineage, bootstrap — `repo:` YAML fields)
- .gitleaks.toml title
- 10 research files (selective: project name refs only, not technical component refs)
- ADR-055 (project name ref)

### Boundary decisions

- "Oak MCP servers" left unchanged — they ARE MCP servers, that's descriptive
- Historical ADRs (008, 009, 022) left unchanged — `oak-mcp-core` was the package name at time of writing
- Archive files, experience files, generated api-md docs all left as historical records
- Vercel project name `oak-mcp-http` in runbook left unchanged (Vercel config is separate)

### Quality gates

All 24 tasks pass. Type-check, lint, markdownlint all green. Initial
`pnpm test` failure was turbo cache issue, not rename-related (cleared
on second run).

## Session: 2026-02-27 — V1-V10 fixes and post-V-fix onboarding review

### What happened

Fixed 9 genuine V-items (V1-V10, V9 was product decision). All stale
paths in extending.md, CONTRIBUTING.md, openapi-pipeline.md, and
curriculum-sdk/docs/architecture.md corrected. ADR-029 implementation
section updated to past tense. workspace:^ → workspace:* in extending.md.
LessonSummary → real components['schemas']['KeyStageData'] pattern in
quick-start and openapi-pipeline. Quality gates all green.

Ran 4-persona non-prescriptive onboarding review (junior dev, lead dev,
CTO, CEO). V-fixes verified effective. 13 new items (W1-W13) identified.
User dispositioned all — no genuine P1 blockers.

### Key decisions from user

- Bus factor is NOT a risk for a self-sufficient, self-documenting repo
  with 117 ADRs
- Known quality gate failure (widget-rendering.spec.ts) is deliberate
  and documented, not an issue
- .agent/ directory is not for humans, needs README and HUMANS.md
- docs/README.md YAML frontmatter is fine (short)
- Version is 0.8.0, fix inconsistency in release-and-publishing.md
- API keys: public form at
  https://open-api.thenational.academy/docs/about-oaks-api/api-keys

### Patterns

- Reviewer false positive on repo name recurred 4th time. Pattern is now
  well-documented in distilled.md but keeps coming back.
- CEO persona found the audience routing (added in N2) visually
  subordinate (blockquote). Content was right but format was wrong.
  Lesson: for non-technical audiences, use headings and prominent
  sections, not blockquotes.
- CTO rated the repo as "one of the most thoroughly documented TypeScript
  monorepos" — strong signal that the documentation work is landing.

### W-fixes learnings

- W11 (CORS rename) was the only code change among 13 items. Touched
  env.ts, security-config.ts, unit tests, E2E tests, and .env.example.
  The local .env file also had `CORS_MODE=allow_all` which broke 46 tests
  when the enum values changed. Remember: Zod enum renames break any
  consumer that reads from environment, including local .env files.
- README heading levels: went h1→h3, markdownlint caught it. h2 was
  the correct level.

### What I should have done differently

- Could have started the plan update and the V-fixes in parallel rather
  than sequencing them — no dependency between them.

## Session: 2026-02-27 — Post-remediation onboarding rerun

Ran discovery-based onboarding simulation with 4 personas (junior dev,
lead dev, engineering manager, product owner). Key design decision:
no prescribed reading list, start at README.md only, reviewers must NOT
read the onboarding planning documents. This was much more effective than
the previous prescriptive approach — it tested whether the documentation
actually guides people rather than checking pre-selected files.

### Key findings

- SDK README contains fabricated code examples (`OakCurriculumClient` class
  that does not exist in source code). This was missed by the previous
  rerun because R35 addressed ordering, not content accuracy. The lesson:
  reordering a README and verifying its content are different tasks.
- Non-technical audience path is fragile — depends on noticing the
  VISION.md blockquote in README. Curriculum Guide (the best document for
  product people) is not linked from README at all.
- Repo name false positive recurred for the third time. Three of four
  personas flagged `oak-open-curriculum-ecosystem` vs `oak-open-curriculum-ecosystem`.
  The rename has been executed on GitHub; local git remote is stale.
  Pattern: sub-agent reviewers consistently misread this situation.

### What worked

- Discovery-based simulation (no reading list) found issues that the
  prescriptive approach missed. The SDK README fabricated examples are
  a much more serious trust issue than anything in the previous rerun's
  17 items. The prescriptive approach would never have caught this because
  the SDK README was not on the reading list for most personas.
- Persona descriptions as motivations ("anxious about looking foolish",
  "sceptical by default", "will bounce if jargon") produced more authentic
  and actionable feedback than focus-area instructions.

### Mistakes and corrections

- Initial plan was prescriptive (10 input files, focus areas per persona).
  User corrected: "onboarding is a journey of discovery." The correction
  produced a materially better simulation.
- Must add to distilled.md: sub-agent reviewers consistently produce
  false positives on the repo name — this is now a three-time pattern.

## Session: 2026-02-27 — Post-remediation consolidation

Ran consolidation workflow after M0 docs remediation commit.

### Plan documentation extraction status

- `release-plan-m1.plan.md`: Contains extractable process docs (release control model, snagging protocol, go/no-go structure). Defer extraction to M0/M1 milestone completion — plans are still active.
- `onboarding-simulations-public-alpha-readiness.md`: Contains "why guardrails exist" philosophy and review methodology. Same deferral — plan is still active.
- `high-level-plan.md`: Appropriate as strategic index. No extraction needed.
- M0 docs remediation plan (`.cursor/plans/`): Pure execution document, no trapped documentation.

### Other consolidation checks

- Napkin: 68 lines, well under 800 limit. No rotation needed.
- Practice box: Empty.
- distilled.md: No new entries needed from this session — patterns are already covered.
- Experience: Wrote `documentation-as-product.md`.

## Session: 2026-02-27 — M0 Documentation Remediation (17 items)

Executed the full M0 docs remediation plan in 6 phases. All 17 R-items complete.

### Key decisions

- README restructured from ~267 to ~145 lines by consolidating 3 overlapping "what's in the repo" sections, 2 architecture sections, and 2 quick start sections into single unified versions.
- "Agentic Engineering Practice" section reframed as "Engineering Practice" for external audience. Removed references to "single engineer" and internal practice mechanics.
- `LICENSE` renamed to `LICENCE` (British spelling). Required updating package.json `files` array and `prepublishOnly` script as well as all markdown references.
- ADR exact counts (114/116) replaced with "over 100" everywhere including the VISION baselines table.
- MCP README splits delegated to subagents successfully — content moved to `docs/` directories.
- SDK README reordered: install/usage now leads; architecture moved to `docs/architecture.md`.

### Reviewer findings addressed

- VISION.md baselines table had a stale "114" count — caught by docs-adr-reviewer and code-reviewer, fixed.
- SDK README logging example had `as Error` type assertion — caught by code-reviewer, fixed with `instanceof` guard.
- sdk-publishing-and-versioning-plan.md still referenced `LICENSE` — caught by docs-adr-reviewer, fixed.
- `.agent/experience/HUMAN.md` had oddly formatted self-reference link — caught by onboarding-reviewer and code-reviewer, fixed.

### What worked

- Batching related items into phases prevented drift between edits.
- Running markdownlint + format gates after each phase caught issues early.
- Delegating the MCP README splits to subagents was efficient and freed up time for the SDK README.

## Session: 2026-02-27 — HTTP MCP server README split

Split `apps/oak-curriculum-mcp-streamable-http/README.md` (was 1,330 lines) into:
- Product-facing README (~218 lines): title, quick start, Vercel deployment, Cursor config, auth, troubleshooting, search tools, how it works, testing, deployment preconditions
- `docs/operational-debugging.md`: request tracing, timing, runtime bootstrap diagnostics, error debugging, production logging, production diagnostics, historical context (OAuth metadata workarounds)
- `docs/widget-rendering.md`: widget cache-busting, branding, rendering architecture (dispatch pattern, four-way sync, helpers, data shapes, sandbox deps, edge cases, contract tests, resilience hardening)

Added "Detailed Documentation" section with links to both new docs. Updated distilled.md Widget Rendering pointer to new location. British spelling throughout; emoji removed from moved content.

## Session: 2026-02-27 — STDIO README split

Split `apps/oak-curriculum-mcp-stdio/README.md` into product-facing README (~122 lines) and `docs/operational-debugging.md` for operational content (request tracing, timing, error debugging, log management, workflows). British spelling throughout; emoji removed from moved content.

## Session: 2026-02-26 — Consolidation and Distillation

### What happened

Ran `/jc-consolidate-docs` across three plans: release-plan-m1,
onboarding-simulations, and Cursor snagging execution plan.

Created GDS-style milestone files (m0–m3) in `.agent/milestones/`.
Linked from root README, VISION.md, high-level-plan.md, and
plans/README.md.

Distilled napkin (871 lines, 20 sessions from 2026-02-24 to 2026-02-26).
Archived to `archive/napkin-2026-02-26.md`. Added 7 new entries to
distilled.md. Graduated 1 entry (search-sdk boundary) from full
description to ADR pointer. Deleted superseded Cursor plan.

### Consolidation findings

- No documentation trapped in any of the three plans. All are properly
  structured as execution documents.
- Experience files are reflective, not technical. No extraction needed.
- Practice box empty (only .gitkeep).
- The release plan (993 lines) and onboarding plan (886 lines) are both
  large but their size is justified — they track many items with full
  evidence chains. They will naturally shrink when archived after
  milestone completion.

## Session: 2026-02-27 — N1-N21 Fix Plan Integration

### What happened

Evaluated all 21 post-remediation onboarding findings (N1-N21) against the
filesystem. 15 genuine fixes, 6 non-issues. Organised fixes into three
execution groups (C, B, A) by complexity. Integrated the full fix plan and
a final onboarding validation plan into `release-plan-m1.plan.md`. Deleted
all three Cursor plans. Rewrote `onboarding-rerun.prompt.md` as the session
entry point for the next session.

### Key decisions

- N12 (bus factor), N13 (zero-setup heading), N15 (clone repetition),
  N18 (milestones in .agent/), N20 (known test failure), N21 (GitHub links)
  all evaluated as non-issues with rationale recorded in the release plan
- Personas for final validation changed: junior dev, senior dev, principal
  engineer, product owner (senior dev replaces lead dev; principal engineer
  replaces engineering manager — broader coverage)
- Entry point is now two files only: `release-plan-m1.plan.md` (the plan)
  and `onboarding-rerun.prompt.md` (the prompt that references it)

### What worked

- Cursor plan as a temporary scratch space for the evaluation, then
  integrate into the release plan and delete. Clean handoff pattern.
- Verifying every finding against the filesystem before classifying — caught
  N13 and N21 as non-issues that would have wasted time if taken at face
  value

## Session: N1-N21 Remediation and Final Validation (2026-02-27)

### Mistakes I made

- **N10: Treated generated `as` casts as a documentation exception rather than
  a generator bug.** User corrected: "this is not a deliberate tolerance,
  this is a problem with the generated code." The rule stands — no type
  assertions in executed code, period. Generated code is executed within
  the system and must comply. I added a "generated code exception" to
  `rules.md` and `no-type-shortcuts.mdc` which I had to revert. The
  correct action is to investigate and fix the generator (`emit-index.ts`
  line 76, `toStatusDiscriminant` function emits `as StatusDiscriminant<T>`).
  Tracked as generator engineering task for M1.

### Key learnings

- `createOakClient` is the real API, returning an `openapi-fetch` client.
  Usage: `client.GET('/api/v0/path', { params: { path: {...} } })`. There
  is no `OakCurriculumClient` class — that was entirely fabricated.
- `createOakPathBasedClient` and `createOakBaseClient` also exist as
  alternative client factories.
- The logging guide had 15+ fabricated method calls (`searchLessons`,
  `getLessonSummary`, `getLessonPlan`) — all replaced with real `.GET()`
  calls.
- Final validation discovered 10 new findings (V1-V10). V1 (extending.md
  stale paths) was flagged by 3 of 4 personas — strong signal.
- `docs/engineering/extending.md` references `oak-curriculum-sdk` paths
  that should be `oak-sdk-codegen`. This is the package that contains the
  code generators.
- `workspace:*` is the monorepo convention, not `workspace:^`. All 44
  workspace dependencies use `workspace:*`.

### What worked

- Parallel persona simulations caught real issues the N1-N21 review missed.
  V1-V2 (stale paths) are genuine P1 blockers that would have shipped.
- Senior dev persona verified SDK README examples against source code —
  confirmed `createOakClient` examples are real. Trust signal validated.

## Session: N10 Generator Cast Fixes and Code Patterns (2026-02-27)

### Key learnings

- `emit-index.ts` is a generator template that emits TypeScript code as
  string concatenation (`lines.push()`). Changes to the template propagate
  to all 24 generated tool files via `pnpm sdk-codegen`.
- Cast 1 (`toStatusDiscriminant`): the generator knew all possible status
  codes at generation time but emitted a generic runtime conversion with
  `as`. The fix was a per-tool `STATUS_DISCRIMINANTS` const map. Pattern:
  if all values are known at build time, use a const data structure.
- Cast 2 (`payload as z.infer<...>`): `invoke` claimed to return `TResult`
  but actually returned unvalidated API data. Every consumer immediately
  passed it to `validateOutput`. The fix: return `unknown`, let
  `validateOutput` be the type-narrowing boundary.
- `StatusDiscriminant<T>` conditional type stays in the contract as the
  default type parameter -- it is a legitimate type-level computation, not
  an assertion. Generated tools no longer import or reference it directly.
- `execute.ts` (the runtime consumer) needed no changes -- it already
  treats `invoke` output as input to `validateOutput`.
- The `generate-tool-file.ts` `buildImports()` function controls what each
  generated tool file imports from the contract. Removing `StatusDiscriminant`
  from there was sufficient to eliminate the unused import.

### What worked

- Writing failing tests first (RED phase) proved all 4 new assertions fail
  before the fix and pass after. Clean TDD cycle.
- Both fixes were localised to the generator template. No manual edits to
  any of the 24 generated tool files -- `pnpm sdk-codegen` propagated.

## Session: Practice Core Migration (2026-02-27)

### What was done

- Integrated incoming Practice plasmid from cloudinary-icon-ingest-poc
  (second round-trip). Adopted structural changes:
  - Created `.agent/practice-core/` as dedicated home for the plasmid trinity
  - Moved practice.md and practice-lineage.md from `.agent/directives/`
  - Installed practice-bootstrap.md (new -- the "how" completing the trinity)
  - Installed index.md as local landing page
  - Relocated practice box from `.agent/incoming/` to `.agent/practice-core/incoming/`
  - Removed `.agent/incoming/` entirely
- Added YAML frontmatter to 7 active prompts (prompt_id, title, type,
  status, last_updated)
- Created `follow-the-practice.mdc` always-applied rule
- Updated references across 10+ files (AGENT.md, start-right, consolidate-docs,
  distillation skill, VISION.md, docs/README.md, ADR-119)
- Added learned principle: "Documentation is concurrent, not retrospective"
- Updated provenance chains (index 2) on practice.md, practice-lineage.md,
  practice-bootstrap.md

### What was taken from the incoming material

- Trinity concept (practice + lineage + bootstrap as a unit)
- `.agent/practice-core/` directory structure with nested `incoming/`
- `index.md` local landing page pattern
- `practice-bootstrap.md` annotated templates
- `follow-the-practice.mdc` rule concept
- Prompt frontmatter convention
- "Documentation is concurrent, not retrospective" learned principle

### What was NOT taken

- Compressed 67-line practice.md (kept rich 235-line production version)
- Two-layer model (kept three-layer model with mermaid diagrams)
- POC-specific simplifications (kept full specialist roster, ADR infrastructure)

### Patterns to Remember

- When integrating incoming Practice material, always check cohesion across
  ALL trinity files, not just the new one. The bootstrap was entirely new
  but the lineage had four drift points against it: frontmatter scope
  (said "both" not "all three"), fitness thresholds table (missing
  bootstrap), always-applied rules list (missing follow-the-practice),
  workflow commands list (missing plan and go). These were found because
  the user explicitly asked to verify cohesion -- I would not have caught
  them otherwise.
- Reference sweeps after file moves must extend beyond the plan's explicit
  list. The initial plan listed ~10 files. Grep found 22 more in plans
  and templates. Plus 5 more found by reviewers in README, reference-docs,
  experience. Total: ~37 files updated. Always grep the full repo.
- distilled.md is at 374 lines (target: <200). Pre-existing overweight.
  Needs a dedicated pruning pass in a future session.

## Session: 2026-02-28 — Harness engineering vs Practice

### What was done

- Ran `/jc-start-right` grounding flow (AGENT, rules, testing strategy,
  schema-first directive, practice index, distilled, napkin).
- Read OpenAI article "Harness engineering: leveraging Codex in an
  agent-first world" and compared it to this repository's Practice.

### Patterns to remember

- Strong overlap: both systems treat repository-local, versioned artefacts
  as the system of record and enforce standards mechanically via linters/CI.
- Key difference: this repository's Practice is stricter on quality gates
  and TDD discipline; the OpenAI harness explicitly allows lighter blocking
  merge gates in exchange for very high throughput and cheap follow-up fixes.
- When adding repo-specific strategy derived from external practice, place it
  under `.agent/plans/` and avoid linking from `.agent/practice-core/*` so
  transferability of the Practice remains intact.

### Mistake corrected

- I initially added repo-specific harness-comparison content to
  `.agent/practice-core/README.md`. That conflicts with transferability.
  Correction: moved the comparison context into
  `.agent/plans/the-practice/harness-concepts-adoption.plan.md` and restored
  `practice-core/README.md` to portable guidance only.

### Consolidation (2026-02-27)

- No documentation trapped in plans or ephemeral locations
- No new code patterns (structural/docs change only)
- Napkin: 264 lines, no rotation needed
- distilled.md: 374 lines, overweight but pre-existing, no new entries
  from this session settled into permanent docs
- Practice box: empty (integration completed)
- Prompts: all 7 frontmatters up to date
- Experience: wrote `2026-02-27-the-return-trip.md`

## Session: 2026-02-28 — Practice adoption plan + narrative updates

### What was done

- Drafted Phase 0 execution plan:
  `.agent/plans/the-practice/active/phase-0-baseline-metrics.plan.md`
- Updated root `README.md` Engineering Practice section with the requested
  agent-first evolution narrative and explicit self-assessment loop statement.
- Updated internal progression frame doc with one-human context and a current
  repository scale figure (~957,000 lines, rounded to nearest thousand).
- Added `.agent/plans/the-practice/evidence/.gitkeep` and created the evidence
  directory for Phase 0 artefacts.

### Patterns to remember

- Claims like "every line is agent-authored" should be time-bounded ("as of
  <date>, for at least the previous six months") to stay truthful as the repo
  evolves.
- For repo-scale line counts, capture method context with the number so future
  updates can recalculate consistently.

### Mistakes made

- I first attempted line counting with `python` and hit `command not found`.
  Use `python3` in this environment.
