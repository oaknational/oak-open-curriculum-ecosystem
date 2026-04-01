## Session 2026-04-01 — Principles Reformatting & Graduation

### What Was Done

- Reformatted principles.md prose to 100-char line width (70
  violations → 0)
- Raised fitness limits to reflect reformatted file: line target
  450, line limit 575, char limit 23000 (was 200/275/16500 — the
  old char limit used a 60-char/line formula on unwrapped prose
  averaging 126 chars/line)
- Graduated 4 principle-level insights from napkin to principles.md:
  - "Semantic naming over mechanism naming" → Code Design section
  - "Don't extract single-consumer abstractions" → Refactoring
  - "Dead tests are worse than no tests" → Universal Testing Rules
  - "Assert effects, not constants" → Universal Testing Rules
- Fixed typo: "critically thinking" → "critical thinking"

### Patterns to Remember

- **Reformatting increases line count ~2.6x**: 170 unwrapped lines
  → 447 wrapped lines for the same content. Fitness line limits
  must be recalculated after reformatting, not just scaled from
  the pre-wrap count.
- **Char limit is the honest volume constraint**: After wrapping,
  line count inflates from short lines, headers, blank lines, and
  list continuation. The char limit tracks actual content volume
  regardless of formatting choices.
- **Reference-style links solve prose width violations**: Long
  inline links push lines past 100 chars. Moving the URL to a
  reference definition at section end keeps prose lines short.

---

## Session 2026-04-01 — Post-ADR-144 Consolidation

### What Was Done

- Archived fitness-two-threshold-model.plan.md to archive/completed/
- Updated current/README.md with completed status and archive path
- Deleted stale .cursor/plans/ for completed consolidation and learning
  loop plans
- Compressed practice-lineage.md fitness section (32668→31567 chars,
  under 32000 limit)
- Fixed stale napkin entries: old field names, old capacity percentages
- Fixed distilled.md prose-width violation (line 59)

### Patterns to Remember

- **Char limit formula is wrong for unwrapped files**: ADR-144 migration
  used `fitness_line_limit * 60` for char limits, but files with
  unwrapped prose average 100-126 chars/line. principles.md is 21486
  chars vs 16500 limit — 30% over, a pre-existing structural problem.
  The user must decide: raise the char limit, or reformat the file.
- **Prose line-width violations are widespread and pre-existing**: 10+
  files have prose lines exceeding 100 chars. These files were never
  wrapped to 100 chars. Addressing this requires a dedicated
  reformatting pass across the repository, not a per-file fix during
  consolidation.

---

## Session 2026-04-01 — Consolidation Round

### What Was Done

- Archived consolidation-workflow-evolution.plan.md to archive/completed/
- Deleted stale duplicate learning-loop-refinement.plan.md from current/
- Updated current/README.md references
- Graduated 7 entries from distilled.md to permanent docs:
  troubleshooting.md (4 agent workflow entries + Codex reviewer),
  development-practice.md (file-move test checks, response augmentation),
  testing-strategy.md (E2E assertion placement)

### Patterns to Remember

- **Capacity is never a blocker for graduation**: The "frozen" or
  "effectively frozen" framing is wrong. The appropriate response is always
  to add useful understanding. Fitness management (compress, refine, split,
  extend) handles the consequences in the next session. Treating capacity
  as a graduation blocker causes useful knowledge to accumulate in the
  wrong tier indefinitely.
- **Graduation and fitness are separate concerns**: Step 7 (graduate) asks
  "is this stable and does it have a natural home?" Step 8 (fitness) asks
  "is this file too full?" They run in sequence because graduation may
  create fitness pressure, and fitness management resolves it. Running them
  as a single gate (only graduate if there's room) defeats the purpose of
  having both steps.

---

## Session 2026-04-01 — Consolidation Command Corrections

### What Was Done

- Broadened step 5 from "Extract code patterns" to "Extract reusable patterns"
  covering all types of learning (process, architecture, structural, behavioural,
  agent operational, domain-specific)
- Added outgoing Practice Context pathway to step 9 — content useful for the
  wider Practice network but not Core-ready goes to `.agent/practice-context/outgoing/`
- Fixed Practice Core governance in step 7: structural changes are rare but valid,
  gated by user approval, not categorically excluded
- Corrected napkin entry that preserved an incorrect framing from the plan's
  Non-Goals

### Patterns to Remember

- **Consolidation captures all learning, not just code**: the napkin records
  everything, distilled.md filters for high-signal, and the code-patterns
  directory has the highest barrier. But the entire pipeline processes all
  types of learning — process, meta, structural, behavioural, domain-specific.
  Step names and descriptions must reflect this breadth or agents will
  self-censor observations that don't look like "code."
- **Outgoing Practice Context is a distinct pathway**: not everything belongs
  in Practice Core. Domain-specific observations, structural notes, and
  patterns that are useful but not universal go to outgoing context for
  broadcast. Core gets Learned Principles and structural proposals (with
  user approval).
- **Incorrect assumptions persist through napkin entries**: the plan's
  Non-Goal ("Changing the practice-core portable files") was wrong, but
  the napkin entry in the previous session refined rather than corrected it,
  preserving the incorrect assumption in a slightly different form. User
  feedback is the correction signal — apply it fully, don't negotiate a
  compromise with the original incorrect framing.

---

## Session 2026-04-01 — Learning Loop Refinement

### What Was Done

- Absorbed the distillation SKILL into the consolidation command as an inline
  protocol (step 6). Distillation had exactly one consumer.
- Added explicit graduation criteria (stable? natural home? capacity?) in step 7.
- Made fitness management active (analyse, refine, split, extend) in step 8.
- Deleted canonical distillation skill and all platform adapters.
- Updated practice-core files, practice-index, ADR-131 (broken path fix).
- Created future strategic plan for full agent infrastructure coherence audit.

### Patterns to Remember

- **Single-consumer skill anti-pattern**: Graduated to principles.md
  Refactoring section as "Don't extract single-consumer abstractions."
- **ADR-125 "thin wrapper" scope**: the thin wrapper contract applies to
  platform adapters wrapping canonical content, NOT to the canonical
  command-to-skill relationship. Commands and skills are sibling Layer 1
  artifacts. A "thick" orchestrating command is architecturally sound per
  ADR-135's process_executor example.
- **Practice-index skill count was stale**: practice-index.md said 19 skills
  but the actual count was 23 (22 after deletion). Always verify counts against
  the filesystem, not just decrement from the last recorded number.
- **Empty directories persist after file deletion**: deleting a file doesn't
  remove its parent directory. The portability validator checks for SKILL.md
  presence inside skill directories, so empty directories with no SKILL.md
  cause false positives. Always rmdir after deleting the last file.
- **Broader infrastructure debt**: the single-consumer pattern likely exists
  elsewhere across commands, skills, rules, agents, and adapters. A future
  audit plan has been created at
  `.agent/plans/agentic-engineering-enhancements/future/agent-infrastructure-coherence-audit.plan.md`.
- **Practice-core is not a separate concern**: the plan's Non-Goals said
  "Changing the practice-core portable files (governed by the plasmid exchange
  model)" -- but the work required modifying three practice-core files
  (practice.md, practice-lineage.md, practice-bootstrap.md) plus the
  CHANGELOG. The Practice describes the system it lives inside. When the
  system evolves, the Practice must evolve too. Reference updates are routine.
  Structural changes (new sections, reorganisation, new artefact types) are
  rare but valid — they require user approval, not categorical exclusion.
  Plans should never treat practice-core as out of scope; the correct gate
  is user approval for structural changes, not a blanket prohibition.
- **Fitness pressure on practice-core** (post ADR-144 migration):
  practice-lineage.md is **over** char limit (32668/32000) — blocking,
  needs compression. practice.md chars at 99.6% (21914/22000) — tight
  but under limit. testing-strategy.md lines 404/target 410 — healthy.
  troubleshooting.md lines 308/target 315 — healthy.

## Session 2026-04-01 — Frontend Practice Plan: Reviewer Findings Resolution

### What Was Done

- Resolved all 14 reviewer-surfaced decisions (R1-R14) from the seven-reviewer pass
- Updated the plan to DECISION-COMPLETE — ALL REVIEWER FINDINGS RESOLVED

### Key Architectural Decisions Worth Remembering

- **MCP App HTML resources are directly testable**: For a11y testing, serve the
  HTML resource content directly to a Playwright page — no iframe embedding needed.
  The host's sandbox/CSP is the host's responsibility, not ours (R10)
- **Testing reviewer cluster pattern**: The user wants test-reviewer to evolve into
  a cluster entry point (like code-reviewer), split by test type with shared
  principles at the entry. Not implemented in this plan but documented in ADR-146
  as a future-facing recommendation (R5)
- **Provenance is storytelling, not credit**: "Think less boardroom, more Dreamtime."
  Both repos appear in the chain because both are part of the knowledge journey.
  This reframes how we write provenance entries (R6)
- **Four-field fitness frontmatter is the standard** (ADR-144): All governed docs
  carry `fitness_line_target`, `fitness_line_limit`, `fitness_char_limit`,
  `fitness_line_length` (supersedes R9 — old three-field model replaced)
- **Old provenance indices are not uniquely identifying**: They can be deleted
  without information loss because positional order is retained in the array.
  This is metadata, not code — principles.md's "no compatibility layers" applies
  to runtime code, not evolving metadata schemas (R14)
- **Phase 1F hard-blocks Phase 2**: Agents reference ADRs in reading requirements.
  Temporal coupling between documentation and agent creation is real and must be
  sequenced, not parallelised
- **ADR-135 naming deviation is acknowledged tech debt**: New agents use `-reviewer`
  suffix despite ADR-135 deciding to drop it. Committed to batch rename
- **packages/design/ requires ADR-041 amendment**: Fifth workspace category with
  its own dependency direction rules. Produces CSS, not TS APIs

---

## Session 2026-04-01 — Frontend Practice Integration Research

### What Was Done

- Thorough `start-right-thorough` grounding for cross-workspace analysis
- Full survey of 5 repos for design token patterns, a11y approaches, and
  frontend architecture: oak-components, Oak-Web-Application,
  oak-ai-lesson-assistant, opal-connection-site, starter-app-spike
- Line-by-line reading of all 7 incoming Practice Core files
- Analysis of 6 new frontend/UI practice-context files from opal-connection-site
- Search across all plan directories for existing React/frontend/UI specialist plans
- Created comprehensive report-plan on disk

### Patterns to Remember

- **oak-components tokens are TS-first, not CSS-first**: TypeScript objects +
  styled-components theme. No framework-agnostic consumption path. This is the
  key gap the new workspaces need to fill.
- **Three competing styling stacks in oak-ai-lesson-assistant**: Tailwind +
  styled-components + Radix Themes. No centralised token governance. No jsx-a11y
  ESLint. No axe suite. A cautionary example.
- **opal-connection-site has the cleanest token architecture**: Pure CSS custom
  properties, three tiers, framework-agnostic, Playwright + axe-core WCAG 2.2 AA
  as blocking gate.
- **starter-app-spike has the most sophisticated system**: 12-mode matrix
  (light/dark × standard/high/low/CVD/monochrome), generated CSS from TS build
  scripts, 17 custom semantic tokens. But tightly coupled to oak-components
  internals.
- **Incoming Practice Core (provenance index 17) matches local copy**: No new
  Core changes to integrate. All value is in the practice-context layer.
- **Provenance index linearity creates false equivalence**: Index 17 in one
  history != index 17 in another. Propose switching to UUIDs.
- **Zero frontend specialist agents exist**: The entire reviewer roster is
  backend-focused. This is a clear gap given WS3 Phases 4-5 build React UI.
- **Two Core Proposals ready for adoption**: Browser testing taxonomy (4 proof
  surfaces + 9th quality gate) and UI reviewer roster (accessibility-reviewer +
  design-system-reviewer).
- **User decisions needed**: Two new workspaces (token harness + Oak token set),
  full specialist suite (6 agents), Practice evolution (provenance UUIDs).

### User Directives

- Design tokens: two new workspaces, framework-agnostic, consumed by React and
  static/Astro apps
- Full suite of UI/UX/a11y/React specialists needed
- Incoming Practice from opal-connection-site is fully applicable
- All workspace repos are useful perspectives, NOT canonical or best practice
- A11y is a primary concern at ALL stages
- Design token system will be based on idiomatic design best practice
- Next session does the implementation; this session records findings and plans
- **Sequencing**: Practice integration → create agents → agents review Practice
  integration → token infrastructure → widget work
- **Blocking relationship**: Token infrastructure blocks widget, but token
  feature-completeness does NOT block widget. Basic alpha-quality foundation
  clears the gate. Token system and widget improve in tandem after that.
- **First step of next session**: Render the plan decision-complete by resolving
  all open questions in Part 5 before any implementation begins.

---

## Session 2026-04-01 — URL Naming Collision Remediation Plan

### What Was Done

- Created `url-naming-collision-remediation.plan.md` in `current/` lane
  covering: decorator fix, type widening, rename, search-CLI boundary
  relocation, ADR succession.
- Invoked Fred (architecture) and docs-adr reviewer on the plan draft.
- Incorporated critical reviewer findings: Phase 1→2 conditional guard
  transition gap, `isolatedUrl` vs `oakUrl` semantic duplication question,
  ADR-132 documentation gap, missing template sections.
- **Naming decision resolved**: `oakUrl` (align with upstream). Rationale:
  SDK concept 1 and upstream concept 3 are semantically identical — same
  concept deserves same name. `isolatedUrl` rejected as it would create new
  duplication.
- Added full semantic documentation: `oakUrl` = slug-based direct URL,
  `canonicalUrl` = context-rich curriculum-path URL.
- Added decorator behaviour decision matrix (4 cases).

### Patterns to Remember

- **Two URL concepts, two names**: `oakUrl` (direct, slug-based) and
  `canonicalUrl` (context-rich, curriculum-path). Same concept = same name.
- **Decorator skips injection when upstream provides `oakUrl`**: Eliminates
  duplication on `LessonSummaryResponseSchema` and `LessonAssetsResponseSchema`.
- **Phase 1→2 transition**: After rename, the guard checks for `oakUrl` in
  properties (to prevent double injection), not `canonicalUrl`. Critical to
  update the guard in Task 2.3.
- **SDK-injected `oakUrl` should include `format: "uri"`**: Matches upstream
  definition, prevents type widening, generates `z.url()`.
- **ADR-132 must be updated alongside ADR-047**: Both use old terminology.
- **`generateSubjectProgrammesUrl` duplicates `urlForSubject`**: The generated
  function already exists; the search-CLI wrapper should delegate, not
  duplicate.

## Session 2026-04-01 — URL Naming Clash Review (Read-Only)

Superseded by the remediation plan session above. Findings captured in
`url-naming-collision-remediation.plan.md` (see `current/` lane).

## Session 2026-03-31 — WS3 Phase 3 Truth Repair Closure

### What Was Done

- Closed the widget resource test failure by injecting widget HTML through
  `ResourceRegistrationOptions.getWidgetHtml` and wiring production
  `readBuiltWidgetHtml()` through the HTTP app composition path.
- Closed the lesson-summary schema fallout in both `curriculum-sdk` and
  `oak-search-cli`, including shared-builder validation and fixture alignment
  for required `canonicalUrl` / `oakUrl`.
- Addressed reviewer findings from `type-reviewer`, `test-reviewer`, and
  `code-reviewer`; `security-reviewer` and `architecture-reviewer-fred`
  returned clean; `mcp-reviewer` hung twice and produced no findings.
- Re-ran the wider gates: `pnpm check` was already green, and `pnpm qg`
  finished green after the closure batch.

### Patterns to Remember

- **Do not patch the turbo graph until the failure reproduces under `--force`**:
  the earlier qg-only red did not reproduce under forced same-package
  `test:e2e` + `test:ui`, nor under a fresh full `pnpm qg`. Re-run the narrow
  turbo shape and the full gate before inventing orchestration fixes.
- **Parse shared fixture builders with the generated schema**: when a generated
  contract adds required fields, centralising fixture construction through a
  schema-backed helper catches drift once instead of across many ad hoc object
  literals.
- **Keep closure truth separate from parent-plan leftovers**: the two-stage
  closure batch can be complete and gate-green even when the broader parent plan
  still carries a deliberately deferred item such as non-UI fallback evidence.

## Session 2026-03-31 — Deep Merge Review & Remediation

### What Was Done

- Invoked 6 specialist reviewers (code, architecture×2, test, MCP, security)
  on the merged codebase. All confirmed merge is architecturally sound.
- Read all 52 auto-merged files line-by-line across 3 parallel agents.
- Fixed 6 findings: eslint-disable + type assertions, stale TSDoc, duplicate
  file, weak assertions, missing OAuth redaction keys, optional observability.
- Discovered 3 characterisation tests were dead — naming excluded them from
  vitest include pattern. Renamed and activated (8 new tests running).
- Updated integration test fake to handle async observability-wrapped handlers.

### Key Observations

- **Dead tests are worse than no tests**: Graduated to principles.md
  Universal Testing Rules. The domain-specific context (characterisation
  test naming vs vitest include pattern) stays here as reference.
- **`vi.fn()` (bare) satisfies any function type**: The `Mock<(...args: any) => any>`
  type from vitest is assignable to any function signature, avoiding the need
  for type assertions in test fakes. This is the cleanest pattern for recording
  servers in characterisation/integration tests.
- **`void` return trick for narrow interfaces**: A function returning
  `RegisteredResource` is assignable to a function returning `void` in
  TypeScript. Defining `ResourceRegistrar` with `void` return lets both
  `McpServer` and `vi.fn()` satisfy it without assertions.
- **Complementary branches merge cleanly**: The two branches (observability
  addition vs widget deletion) don't intersect at the behaviour level — only
  at the type/parameter level. This is why zero "semantically correct but
  behaviourally wrong" issues were found across 52 auto-merged files.

## Session 2026-03-31 — Merge Execution & OpenAI Remnant Cleanup

### What Was Done
- Executed `git merge --no-ff origin/main` bringing 3 commits: Sentry/OTel
  observability foundation, release 1.2.0, and release 1.3.0.
- Resolved 6 conflicts: 4 trivial doc conflicts, 1 semantic keystone
  (`register-resources.ts`), 1 mechanical (`pnpm-lock.yaml`).
- Removed all OpenAI-era remnants: `WIDGET_URI` from public resources,
  `deriveWidgetDomain`, `widgetDomain` field, renamed `WidgetResourceOptions`
  to `ResourceRegistrationOptions`.
- Updated 4 test files to reflect widget URI no longer being public.
- Invoked code-reviewer and test-reviewer; fixed stale TSDoc comment.
- All gates pass (559 unit/integration tests, 152/155 E2E tests — 3 expected
  RED specs for WS3 Phase 2-3).

### Key Observations
- **Pre-commit formatting catch**: `pnpm format:root` was needed for
  `handlers-mcp-span.characterisation.test.ts` — auto-merged content from
  main had inconsistent formatting. Always run `pnpm format:root` after merge.
- **Cascading test updates**: Removing `WIDGET_URI` from `PUBLIC_RESOURCE_URIS`
  required updating 4 test files (1 unit, 2 integration, 1 E2E) to flip
  expectations from "auth bypassed" to "auth required." Test changes outnumber
  production changes ~3:1 for this type of behavioural shift.
- **WS3 RED specs are E2E-only**: Confirmed the red specs only fail in the
  `test:e2e` suite, not during `pnpm check`'s in-process tests. This is by
  design — `*.e2e.test.ts` files don't block commits.
- **`register-json-resources.ts` remains inert**: Zero call sites, confirmed.
  Consolidation deferred to post-merge follow-up.
- **`displayHostname` is NOT widget-specific**: Used for static content routes
  and asset download URLs. Correctly retained when removing `deriveWidgetDomain`.

## Session 2026-03-31 — Second-Round Plan Review (7 reviewers, observability focus)

### What Was Done
- Invoked 7 specialist sub-agents on the merge plan with explicit observability
  completeness remit: MCP reviewer, security reviewer, 4 architecture reviewers
  (Barney, Betty, Fred, Wilma), and code reviewer.
- Addressed ~30 findings (including minor) across all reviewers.
- Consolidated post-merge follow-ups into structured categories.

### Key Observations
- **5/7 reviewer convergence on `register-json-resources.ts`**: Barney, Betty,
  Fred, Wilma, and Code reviewer independently flagged the same duplicate file.
  Cross-reviewer volume at this level is a strong signal — promoted from "assess
  whether" to "consolidate — confirmed duplicate."
- **Security reviewer found pre-existing gaps in main**: OAuth form-encoded
  redaction and auth data in logs are pre-existing in main's observability code,
  not introduced by the merge. The merge plan correctly scopes them as post-merge
  follow-ups rather than merge blockers.
- **Fred's ADR-057 deviation framing**: Instead of "consider removing WIDGET_URI,"
  frame it as a conscious, documented deviation with a restoration deadline. This
  is more actionable than a vague "consider" and creates accountability.
- **Barney on Phase 8b**: Creating a new multi-platform complex-merge skill is
  overbuilt. The genuinely new learning is a small extension to existing guidance.
  Prefer updating existing docs over creating new abstractions.
- **"No low-risk files"**: User explicitly corrected the assumption that some
  auto-merged files are low-risk. All auto-merges need deep evaluation. Caution
  over speed, architectural excellence over expediency.

### User Directives (overriding reviewer recommendations)

- **Complex merge skill must be created**: User overrode Barney's recommendation
  to simplify Phase 8b. The skill wraps the full 7-phase merge workflow and is
  worth the investment even if merges don't recur frequently.
- **No OpenAI remnants survive the merge**: WIDGET_URI, deriveWidgetDomain,
  widgetDomain, WidgetResourceOptions name — all removed during the merge, not
  deferred. "No exceptions." This overrides the previous ADR-057 interim retention
  and the scope-creep deferral.
- **Secrets in logs are blocking**: OAuth form-encoded redaction gap and auth
  success handler PII are pre-existing in main but must be fixed before
  deployment. Promoted from follow-up to blocking pre-deployment gate.

## Session 2026-03-31 — Napkin rotation (distillation)

Archived `napkin-2026-03-31.md` covering sessions 2026-03-24 to 2026-03-31.

Key new insight not yet in distilled.md (distilled at ceiling):

- **RED specs belong in E2E, not unit tests**: The pre-commit hook runs
  `pnpm turbo run type-check lint test` (in-process only). E2E tests run
  separately via `pnpm test:e2e`. RED specs that specify future behaviour
  should be `*.e2e.test.ts` so they don't block commits during the RED phase.
- **Assert effects, not constants**: Graduated to principles.md
  Universal Testing Rules.

## Session 2026-03-31 — WS3 Phase 1: Delete Legacy Widget Framework

**Completed**: Deleted 22 legacy files (14 source + 7 tests + 1 E2E), updated
3 files, fixed 4 reviewer findings. Renamed B3 Hybrid to
`preserve-schema-examples.ts` for semantic clarity.

Key observations:

- **Single coupling point deletion**: The entire legacy widget subgraph
  connected to the live system through one import in `register-resources.ts`.
  Severing that single import made 14 files instantly dead code. This is the
  payoff of narrow dependency chains.
- **Multi-reviewer convergence**: MCP, code, test, and architecture reviewers
  all found different facets of the same interim state. MCP reviewer confirmed
  protocol compliance; architecture reviewer wanted YAGNI cleanup of auth
  bypass; test reviewer found vacuous passes and process.env violation. Each
  perspective was valuable — no single reviewer caught everything.
- **Semantic naming > mechanism naming**: Graduated to principles.md
  Code Design section as "Semantic naming over mechanism naming."
- **Interim state requires explicit documentation**: When a resource is
  temporarily unregistered but its auth bypass entry persists, every affected
  file needs a comment explaining the gap and the restoration plan.
- **`preserve-schema-examples.ts` root cause and Zod 4 opportunity**: The
  pipeline is OpenAPI → Zod → JSON Schema. In Zod 3, `examples` had no
  representation and was lost. **Zod 4 fixes this**: `.meta({ examples })`
  attaches arbitrary metadata that `z.toJSONSchema()` preserves. The override
  could be eliminated if: (a) sdk-codegen attaches examples via `.meta()`, and
  (b) the MCP SDK's internal converter honours `.meta()`. Investigate both
  before Phase 3 `registerAppTool` adaptation.

## Session 2026-03-31 — Merge Planning (main → feat/mcp_app_ui)

### What Was Done
- Thorough pre-merge analysis following `docs/engineering/pre-merge-analysis.md`
  7-phase process. Produced a comprehensive merge plan with observability gap
  analysis, call-chain contract verification, and sub-agent plan review.
- Invoked 4 sub-agent reviewers (architecture-barney, architecture-wilma,
  mcp-reviewer, code-reviewer) on the plan before execution.
- Aborted a stale in-progress merge from earlier research to restore clean state.
- Plan moved from `.cursor/plans/` to canonical repo location.

### Patterns to Remember
- **"Take main as base, remove only" beats "take branch, add back"**: For the
  keystone conflict, starting from main's version and removing widget code
  preserves observability wrapping by default. The reverse (starting from branch
  and adding wrapping) risks accidentally omitting wrappers.
- **Characterisation tests are necessary but not sufficient**: `toHaveBeenCalled()`
  proves a spy was invoked at least once, not that every call site was wrapped.
  Always pair with the "preserve by default" approach above.
- **Async wrappers break sync test fakes**: `wrapResourceHandler` returns
  `async (...args) => Promise<T>`, but `register-resources.integration.test.ts`
  fake throws on Promise-returning callbacks. Do NOT add observability to that
  test without also upgrading the fake to async-aware.
- **`WIDGET_URI` was removed from auth/public-resources.ts**: Per user directive,
  no OpenAI-era remnants survive the merge. Tests updated to expect auth required
  for widget URIs. Phase 2-3 will re-add when fresh React MCP App is scaffolded.
- **`git merge --abort` wipes staged changes**: Any uncommitted staged files
  (the merge plan and session prompt were staged but not committed) are lost
  when aborting. Always commit planning artefacts before attempting a merge.
- **Sub-agent plan review before merge execution**: Having 4 specialist reviewers
  validate the merge plan caught 3 blocking issues (application.ts seam
  promotion, merge-state hygiene, async wrapper incompatibility) that would
  have caused problems during execution.
- **`register-json-resources.ts` exists on main**: New file that partially
  duplicates `register-resources.ts`. Do not wire it into keystone resolution —
  flag for post-merge tidy-up.
- **Distilled.md graduation round**: The characterisation "agent-operational,
  domain-specific" was a false reason to keep entries out of permanent docs —
  the Practice and Directives ARE permanent homes for agent-operational content.
  Graduated 14+ entries: TypeScript gotchas → typescript-practice.md,
  documentation workflow → development-practice.md, troubleshooting → troubleshooting.md,
  architecture patterns → development-practice.md. Freed ~50 lines in distilled.md.
