---
name: "Oak Preview MCP Snagging"
overview: "Active deploy-safe snagging pass for the live oak-preview MCP surface. Separates true product issues from preview-environment noise, keeps the legacy widget/OpenAI-app replacement work in its existing active migration plan, and stages index-dependent fixes behind an explicit reindex boundary, including the post-deploy bulk re-download, reprocessing, and re-index run needed to clear stale search data."
source_research:
  - "../roadmap.md"
  - "replace-openai-app-with-mcp-app-infrastructure.execution.plan.md"
todos:
  - id: phase-0-classify-findings
    content: "Phase 0: Classify the preview smoke-test findings into non-issues, deploy-safe code fixes, and reindex-dependent validation items."
    status: completed
  - id: phase-1-canonical-url-fix
    content: "Phase 1: Fix lesson-detail canonicalUrl generation for summary, transcript, quiz, and assets responses so lesson sub-resource endpoints resolve to the lesson slug rather than the trailing path segment."
    status: completed
  - id: phase-2-reindex-boundary
    content: "Phase 2: Verify current indexing code emits the correct lesson, unit, sequence, and thread URL behaviour; define the exact post-deploy bulk re-download, reprocessing, and re-index steps needed to clear stale search/index data without blocking merge readiness."
    status: completed
  - id: phase-3-guidance-tightening
    content: "Phase 3: Remove contradictory 'you MUST call this first' wording from non-orientation tools, tighten MCP tool schemas/docs, and align tool/prerequisite guidance with the intended workflow."
    status: completed
  - id: phase-4-review-and-validate
    content: "Phase 4: Run the relevant reviewer set, perform focused MCP smoke checks that prove deploy-ready behaviour, and then carry out or explicitly stage the post-deploy bulk re-download, reprocessing, and re-index execution owned by this plan."
    status: completed
---

# Oak Preview MCP Snagging

**Last Updated**: 2026-03-07
**Status**: All phases complete — deploy-safe code is ready; post-deploy reindex checklist documented in `docs/operations/troubleshooting.md`
**Priority**: Post-deploy reindex execution is the only remaining operational step
**Branch**: `feat/search_qol_fixes`

---

## Why This Is Active Now

This plan has been promoted into `active/` by direct user priority.

Important sequencing context:

- Phase 1 is already complete and validated
- the next implementation slice is Phase 2, not a restart from scratch
- the plan now owns both the deploy-safe snagging fixes and the explicit
  post-deploy re-download/reprocess/re-index step
- this plan remains separate from the broader MCP Apps migration stream in the
  sibling active plan

---

## Current State Snapshot

All four phases are complete. The branch is deploy-ready.

What was done:

1. **Phase 0 complete**: preview smoke-pass findings classified into non-issues,
   real code defects, and reindex-boundary items.
2. **Phase 1 complete**: lesson-detail canonical URL defect fixed in SDK runtime
   augmentation path. Lesson `summary`, `transcript`, `quiz`, and `assets`
   routes now resolve to the lesson slug, not the trailing path segment.
3. **Phase 2 complete**: deploy-vs-reindex boundary documented in
   `docs/operations/troubleshooting.md` under `## Search Reindex Boundary`.
   Includes deploy-safe code correctness table, stale index evidence
   explanation, and complete post-deploy reindex command checklist.
4. **Phase 3 complete**: contradictory prerequisite guidance fixed.
   `get-thread-progressions` and `get-prerequisite-graph` now use
   `AGGREGATED_PREREQUISITE_GUIDANCE` (which names `get-curriculum-model`
   explicitly) instead of `ONTOLOGY_RECOMMENDED_FIRST_STEP` (which used
   ambiguous "this tool" phrasing). Regression tests added.
5. **Phase 4 complete**: code-reviewer, docs-adr-reviewer, and mcp-reviewer
   all passed. Quality gates green. File name corrections applied to the
   troubleshooting table per docs-adr-reviewer findings.

What remains:

1. **Post-deploy reindex execution** — the only remaining operational step.
   Run the command sequence in `docs/operations/troubleshooting.md` §
   "Post-deploy reindex validation" after deploying the branch.
   The authoritative ingestion reference is
   `apps/oak-search-cli/operations/ingestion/README.md`.

## Why This Plan Exists

A live smoke pass against `oak-preview` surfaced a mixture of:

1. one preview-environment false alarm
2. one real SDK/runtime canonical URL bug
3. some likely stale search/index data that should clear only after reindex
4. several MCP guidance/schema issues that affect agent usability

This plan exists to separate those categories cleanly so the branch can be made
deploy-ready first, and then the required bulk re-download, reprocessing, and
re-index run can happen after deploy under the same plan.

## Confirmed Findings

### Non-Issue

`download-asset` works correctly end to end. The apparent failure on preview was
caused by Vercel preview protection:

1. the generated URL used the commit deployment hostname
2. only the branch deployment hostname had been added to the Vercel auth bypass
   list

This is a preview-environment configuration detail, not a product defect, and
must not consume implementation time under this plan.

### Real Product Issues

1. **Lesson detail canonical URLs are wrong on some MCP surfaces.**
   `summary`, `transcript`, `quiz`, and `assets` responses can end up with
   generic URLs such as `/teachers/lessons/summary` because the response
   augmentation fallback currently uses the trailing path segment when the body
   does not include `lessonSlug`.
2. **Some search/index URLs are likely stale data, not current code.**
   Search results still surface values such as `thread_url`, even though current
   indexing code intentionally omits thread URLs because threads have no Oak web
   page. This strongly suggests an index refresh boundary rather than a fresh
   generator/runtime bug.
3. **MCP prerequisite guidance is contradictory.**
   `get-curriculum-model` correctly positions itself as the primary orientation
   call, but `get-thread-progressions` and `get-prerequisite-graph` also claim
   they must be called before other tools. That creates conflicting hard rules
   for agents.
4. **Tool schemas and docs leave some real workflow rules implicit.**
   Examples:
   - `search` describes conditional requirements in prose that are not fully
     encoded in the descriptor shape
   - some fetch/tool docs drift from the currently supported ID/workflow surface

## Scope

In scope:

1. fixing the lesson-detail canonical URL bug in the SDK/runtime MCP surface
2. validating what is code-path behaviour versus what is stale search/index data
3. documenting the exact post-deploy bulk re-download, reprocessing, and
   re-index dependency needed to refresh stale search URLs
4. tightening MCP tool guidance so only one orientation tool is mandatory
5. tightening descriptor/schema/docs drift that affects agent calls on the
   current MCP-standard surface
6. focused reviewer and smoke-test validation
7. carrying out the bulk re-download, reprocessing, and re-index run after
   deploy, or leaving an explicit deploy-blocked handoff if deployment has not
   yet happened

Out of scope:

1. the legacy widget/resource replacement from OpenAI App surfaces to MCP Apps
   surfaces
2. preview-auth/Vercel bypass configuration work
3. broad search-quality changes unrelated to the surfaced URL/guidance snags
4. introducing compatibility layers or dual metadata paths

## Relationship to Existing MCP Apps Migration Work

The current widget/resources surface is intentionally still the old one. That is
already owned by:

1. `replace-openai-app-with-mcp-app-infrastructure.execution.plan.md`

Do not duplicate that migration here. This snagging plan should only fix the
issues needed to make the current PR safely deployable and then complete the
bulk-data reindex cutover that refreshes stale search data.

## Standalone Session Entry

Use this section to start a fresh session from this plan alone.

### If All Phases Are Complete

If the frontmatter todos all show `status: completed`, the only remaining work
is the **post-deploy reindex execution**. Follow the command sequence in
`docs/operations/troubleshooting.md` § "Post-deploy reindex validation". The
authoritative ingestion reference is
`apps/oak-search-cli/operations/ingestion/README.md`.

After reindex, verify:

1. `pnpm ingest:verify` — all subjects report expected counts
2. `pnpm es:status` — all indices green
3. Spot-check search results: `thread_url` absent from thread docs,
   `lesson_url`/`unit_url`/`sequence_url` use current canonical format

Then archive this plan to `../archive/`.

### If Reopening for Regression

If a new regression is discovered after deploy:

1. Read `.agent/directives/AGENT.md` and `.agent/directives/principles.md`
2. Check `docs/operations/troubleshooting.md` § "Search Reindex Boundary"
3. Determine whether the regression is stale index data (reindex fixes it) or
   a code defect (new phase needed)
4. If code defect: add a new phase to this plan before fixing

## Execution Phases

### Phase 0 — Classify Findings

Status: complete.

1. Keep the `download-asset` preview-auth behaviour recorded as a non-issue.
2. Capture the real product issues in a single place:
   - lesson-detail canonical URL bug
   - stale search/index URL boundary
   - contradictory prerequisite wording
   - descriptor/schema/docs drift
3. Preserve a strict line between:
   - deploy-safe fixes that should land before rollout
   - index-dependent validation that will only be provable after reindex

### Phase 1 — Canonical URL Fix in the MCP Runtime Surface

Status: complete.

Goal: ensure lesson-oriented MCP tools resolve to the actual lesson URL, not the
trailing sub-resource path segment.

Likely code path:

1. `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`
2. `packages/sdks/oak-curriculum-sdk/src/response-augmentation-helpers.ts`
3. `packages/sdks/oak-curriculum-sdk/src/validation/curriculum-response-validators.ts`
4. associated unit/integration tests

Required outcome:

1. lesson summary/transcript/quiz/assets surfaces all produce
   `https://www.thenational.academy/teachers/lessons/{lessonSlug}`
2. tests prove the bug with RED first, then verify the correct fix
3. no compatibility shim or fallback aliasing is introduced
4. validation and augmentation boundaries stay separate:
   - `validateCurriculumResponse()` validates decorated schemas only
   - runtime `canonicalUrl` derivation happens at the middleware boundary where
     a concrete request URL exists

Completed implementation slice:

1. `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`
2. `packages/sdks/oak-curriculum-sdk/src/response-augmentation-helpers.ts`
3. `packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.integration.test.ts`
4. `packages/sdks/oak-curriculum-sdk/src/response-augmentation.unit.test.ts`
5. `packages/sdks/oak-curriculum-sdk/src/validation/response-validators.unit.test.ts`
6. `packages/sdks/oak-curriculum-sdk/docs/architecture.md`
7. `docs/architecture/architectural-decisions/047-canonical-url-generation-at-codegen-time.md`

Do not redo this phase unless a new failing test or smoke-check shows regression.

### Phase 2 — Reindex Boundary and Search URL Validation

Goal: separate what is already correct in code from what will only improve after
the search indices are rebuilt, then define the exact post-deploy operational
run needed to refresh them.

Tasks:

1. Confirm current indexing/runtime code paths for:
   - `lesson_url`
   - `unit_url` / `unit_urls`
   - `sequence_url`
   - `thread_url`
2. Start with these files:
   - `apps/oak-search-cli/src/lib/indexing/thread-document-builder.ts`
   - `packages/sdks/oak-sdk-codegen/code-generation/typegen/search/field-definitions/curriculum.ts`
   - any search mapping/schema files that still expose `thread_url` for backwards
     compatibility
   - any rollup or indexing code that emits `lesson_url`, `unit_url`, or
     `sequence_url`
3. Confirm whether any stale URL fields are present only because existing
   indexed documents predate the current canonical URL logic.
   Current expectation from repo inspection: stale `thread_url` values are
   legacy index data, not a fresh document-builder bug.
4. Write down the exact post-deploy reindex expectation:
   - what should improve immediately on deploy
   - what should improve only after reindex
5. Define the post-deploy operational run explicitly:
   - re-download bulk data
   - reprocess the bulk payloads with the deployed code
   - run the re-index against the target indices
   Start from the existing command surfaces already documented in:
   - `apps/oak-search-cli/package.json`
   - `apps/oak-search-cli/operations/ingestion/README.md`
6. Keep the branch deploy-ready even if the stale data cannot be fully proven
   clean until the reindex completes.
7. Promote the resulting deploy-vs-reindex boundary note into a durable
   operational home before the plan is archived.

Required deliverable before leaving Phase 2:

1. one short written boundary note that explicitly separates:
   - deploy-safe code correctness
   - stale index evidence
   - post-deploy reindex validation
2. place that note in `docs/operations/troubleshooting.md` before archiving this
   plan
3. use the heading `## Search Reindex Boundary` with these three subsections:
   - `### Deploy-safe code correctness`
   - `### Stale index evidence`
   - `### Post-deploy reindex validation`
4. include the concrete post-deploy command sequence or operational checklist for:
   - bulk data re-download
   - bulk reprocessing
   - index rebuild / refresh

Stop line:

1. do not modify search indexing code just to "fix" stale indexed data
2. do not start descriptor/guidance edits before the deploy-vs-reindex boundary
   is written down
3. do not treat stale `thread_url` evidence as proof that current runtime code is
   still wrong

### Phase 3 — MCP Guidance and Schema Tightening

Goal: make the tool surface easier for real agents to use correctly.

Required direction:

1. `get-curriculum-model` remains the only mandatory first-call orientation tool
2. `get-thread-progressions` and `get-prerequisite-graph` should be described as
   specialised complementary tools, not competing mandatory prerequisites
3. tighten descriptor/schema drift where it materially affects agent calls

Boundary note: this phase is limited to current-surface guidance/schema quality
fixes. It does not include the OpenAI-specific metadata-key migration owned by
Domain C item C5 within the `domain-c-executable-plans` roadmap todo in
`../roadmap.md`.

Concrete targets:

1. `search` conditional requirements and error guidance
2. `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts`
3. `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts`
4. `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prerequisite-graph.ts`
5. `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts`
6. generated descriptor files that still claim hard prerequisite status too
   broadly
7. verify and tighten any remaining descriptor-schema offenders that materially
   affect agent calls
8. fetch/tool docs that have drifted from the supported ID/workflow surface
9. small guidance quality issues such as typos or misleading fallback wording

Stop line:

1. do not pull the OpenAI-App-to-MCP-App migration work into this phase
2. do not broaden this into a full descriptor redesign
3. only fix what materially improves the current preview MCP surface

### Phase 4 — Review, Validation, and Post-Deploy Reindex Execution

Minimum reviewers:

1. `code-reviewer`
2. `docs-adr-reviewer`
3. `mcp-reviewer`

Add `test-reviewer` if test files change materially.

Validation should prove:

1. lesson-detail canonical URLs are now correct in the MCP/runtime surface
2. the only remaining URL anomalies are clearly documented as reindex-boundary
   items
3. the tool prerequisite story is coherent and non-contradictory
4. preview-auth false alarms are not being treated as product defects
5. the post-deploy re-download/reprocess/re-index run is either:
   - ready to execute immediately after deploy, or
   - already completed and verified

Recommended execution order from a fresh session:

1. Phase 2
2. Phase 3
3. Phase 4

Do not re-open completed phases unless new evidence forces it.

Stop line:

1. do not fix newly discovered follow-on issues in Phase 4
2. record extra findings as follow-up items unless they block the acceptance
   criteria in this plan
3. keep Phase 4 focused on proving readiness and completing the explicit
   reindex execution step, not expanding scope

## Acceptance Criteria

1. A fresh smoke pass shows correct lesson canonical URLs on fetch and lesson
   detail tools.
2. The plan/doc set clearly states that `download-asset` preview failures were a
   commit-deployment auth-bypass issue, not a product issue.
3. Only `get-curriculum-model` claims mandatory first-call status.
4. Any remaining stale search/index URL issues are explicitly documented as
   requiring reindex rather than further pre-deploy code churn.
5. The post-deploy bulk re-download, reprocessing, and re-index run is either
   completed or left as an explicit deploy-blocked final step under this plan.
6. Reviewer findings are either resolved or converted into explicit follow-up
   items with rationale.

## Validation

Targeted tests and checks:

```bash
pnpm markdownlint:root
pnpm vitest run \
  packages/sdks/oak-curriculum-sdk/src/response-augmentation-helpers.unit.test.ts \
  packages/sdks/oak-curriculum-sdk/src/response-augmentation.unit.test.ts \
  packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.integration.test.ts \
  packages/sdks/oak-curriculum-sdk/src/validation/response-validators.unit.test.ts
```

Focused repo sweeps:

```bash
rg -n "You MUST call this tool before using other curriculum tools" \
  packages apps
```

```bash
rg -n "PREREQUISITE: You MUST call the `get-curriculum-model` tool first" \
  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools
```

```bash
rg -n "ONTOLOGY_RECOMMENDED_FIRST_STEP" \
  packages/sdks/oak-curriculum-sdk/src/mcp
```

```bash
rg -n "teachers/lessons/(summary|transcript|quiz|assets)" \
  packages/sdks/oak-curriculum-sdk
```

Live smoke checks after fixes:

1. `get-curriculum-model`
2. `fetch` with a `lesson:` id
3. `get-lessons-summary`
4. `get-lessons-transcript`
5. `get-lessons-quiz`
6. `get-lessons-assets`
7. representative `search` calls before and after reindex

Post-deploy operational step owned by this plan:

1. `pnpm redis:status` then `pnpm redis:up` — check if Redis is running, start if not
2. `pnpm bulk:download` — re-download bulk data from upstream API
3. `pnpm bulk:codegen` — regenerate codegen artefacts from fresh bulk data
4. `pnpm es:setup reset` — reset indices and re-create mappings
5. `pnpm es:ingest -- --api --all --verbose` — full re-ingest
6. `pnpm ingest:verify` — verify document counts
7. `pnpm es:status` — check index health
8. repeat the representative `search` checks after the reindex completes

See `apps/oak-search-cli/operations/ingestion/README.md` for the full reference.

## Lessons Learned

1. **Always source operational commands from `package.json` and the ingestion
   README directly.** The Phase 2 post-deploy checklist was initially written
   from exploration agent summaries rather than from the authoritative source
   (`apps/oak-search-cli/operations/ingestion/README.md` and
   `apps/oak-search-cli/package.json`). This caused missing commands
   (`bulk:codegen`, `redis:up`, `es:status`). The fix was to add an explicit
   "Authoritative source" callout in the troubleshooting section and to
   transcribe the complete command sequence from the primary source.

2. **Cross-reference file names against the actual filesystem.** The deploy-safe
   code correctness table initially listed `unit-document-builder.ts` and
   `lesson-document-builder.ts` for fields that are actually set in
   `unit-document-core.ts` and `lesson-document-core.ts`. The docs-adr-reviewer
   caught this, but it should have been verified by reading the actual files
   before writing the table.

3. **Regression tests anchor guidance changes.** The Phase 3 guidance fix
   (switching from `ONTOLOGY_RECOMMENDED_FIRST_STEP` to
   `AGGREGATED_PREREQUISITE_GUIDANCE`) was initially shipped without regression
   tests. The code-reviewer flagged this. Tests now assert both the positive
   case ("contains `get-curriculum-model` first") and the negative case
   ("does not contain `this tool before`").

## Related Documents

1. [../README.md](../README.md)
2. [../roadmap.md](../roadmap.md)
3. [README.md](README.md)
4. [replace-openai-app-with-mcp-app-infrastructure.execution.plan.md](replace-openai-app-with-mcp-app-infrastructure.execution.plan.md)
