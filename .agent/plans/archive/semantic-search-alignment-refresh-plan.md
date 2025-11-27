# Semantic Search Alignment Refresh Plan

## Intent

Create a consolidated execution plan to align every semantic search plan and authored document with the canonical design captured in `.agent/plans/semantic-search/semantic-search-target-alignment-plan.md`. The refreshed materials must remove stale guidance, adopt the definitive architecture (server-side RRF over enriched indices, resilient ingestion, expanded APIs, observability), and direct contributors to follow the repository rules and testing strategy rigorously.

## Impact

- Contributors receive a single, accurate roadmap for finishing semantic search back-end, documentation, and UI workstreams.
- Plans and docs describe processes that honour `.agent/directives-and-memory/rules.md` and `.agent/directives-and-memory/testing-strategy.md`, including TDD expectations, quality gates, and documentation standards.
- Semantic search onboarding material reflects the enriched SDK data, index mappings, suggestion endpoints, zero-hit logging, and regression coverage.

## References

- `.agent/plans/semantic-search/semantic-search-target-alignment-plan.md`
- `.agent/directives-and-memory/rules.md`
- `.agent/directives-and-memory/testing-strategy.md`
- `GO.md`
- Existing semantic search plans and docs listed in the High-Level Plan (#4)

## Deliverables

1. Updated semantic search plan documents (API, UI, docs, caching, context, prompts, audits) that mirror the target alignment outcomes, include accurate status, and instruct future work to apply GO.md cadence with self-reviews.
2. Updated semantic search authored documentation (`apps/oak-open-curriculum-semantic-search/docs/*.md`, excluding generated `docs/api`) and `apps/oak-open-curriculum-semantic-search/README.md` that teach the definitive architecture, enriched payloads, and operational guardrails.
3. Documented verification steps (quality gates, doc generation, linting) to run after edits.

## Assumptions

- No code changes occur as part of this planning pass; however, the plan must prepare contributors to execute code/documentation updates using TDD where applicable.
- All future actions will honour the Cardinal Rule (types derived from OpenAPI via `pnpm type-gen`) and documented quality gates.

## Todo List (GO cadence)

- REMINDER: Use british spelling

1. ACTION: Capture delta notes between the target alignment plan and each existing semantic search plan/document.
2. REVIEW: Self-review delta notes to confirm every plan/doc is covered.
3. GROUNDING: read GO.md and follow all instructions.
4. ACTION: Update `.agent/plans/semantic-search/semantic-search-api-context.md` with refreshed status, scope, and next steps driven by the target alignment plan.
5. REVIEW: Self-review the API context update for completeness and alignment with repository rules.
6. GROUNDING: read GO.md and follow all instructions.
7. ACTION: Update `.agent/plans/semantic-search/semantic-search-api-plan.md` to embed the definitive workstreams (mappings, env expansion, ingestion, RRF queries, API surface, observability) and TDD expectations.
8. REVIEW: Self-review API plan changes, checking for explicit references to rules, testing strategy, and GO cadence.
9. GROUNDING: read GO.md and follow all instructions.
10. ACTION: Refresh the remaining semantic search plan docs (`semantic-search-documentation-plan.md`, `semantic-search-caching-plan.md`, `semantic-search-ui-plan.md`, `semantic-search-ui-style-audit.md`) so they reference the target architecture, sequences scope, suggestion endpoints, and logging requirements.
11. REVIEW: Self-review each refreshed plan to ensure scopes, tasks, and acceptance criteria are accurate and rule-compliant.
12. GROUNDING: read GO.md and follow all instructions.
13. ACTION: Update `semantic-search-startup-prompt.md` and `semantic-search-ui-continuation-prompt.md` to reflect the new milestone sequence, calling for self-reviews instead of sub-agents.
14. REVIEW: Self-review prompt language for clarity and adherence to GO.md instructions.
15. GROUNDING: read GO.md and follow all instructions.
16. ACTION: Rewrite authored docs (`ARCHITECTURE.md`, `SETUP.md`, `INDEXING.md`, `QUERYING.md`, `ROLLUP.md`, `SDK-ENDPOINTS.md`, `docs/README.md`, `oak-curriculum-hybrid-search-definitive-guide.md`) to cover enriched indices, canonical URLs, suggestion/type-ahead endpoints, zero-hit logging, and quality gate expectations.
17. REVIEW: Self-review each document update for accuracy, British spelling, and consistency with the target plan.
18. GROUNDING: read GO.md and follow all instructions.
19. ACTION: Update `apps/oak-open-curriculum-semantic-search/README.md` to list the expanded endpoints, enriched payloads, and operational steps (index versioning, logging, suggestion APIs).
20. REVIEW: Self-review README changes for completeness and coherence with other docs.
21. GROUNDING: read GO.md and follow all instructions.
22. QUALITY-GATE: pnpm lint
23. REVIEW: Capture lint results; note follow-up actions if failures occur.
24. GROUNDING: read GO.md and follow all instructions.
25. QUALITY-GATE: pnpm test
26. REVIEW: Summarise test outcomes; record remediation steps if red.
27. GROUNDING: read GO.md and follow all instructions.
28. QUALITY-GATE: pnpm build
29. REVIEW: Confirm build status; log next steps on failure.
30. GROUNDING: read GO.md and follow all instructions.
31. QUALITY-GATE: pnpm -C apps/oak-open-curriculum-semantic-search doc-gen
32. REVIEW: Document doc-gen results and address discrepancies.
33. GROUNDING: read GO.md and follow all instructions.
34. ACTION: Final self-review of all updated plans/docs, ensuring cross-links and instructions remain consistent.
35. REVIEW: Self-review the final pass and prepare change summary for PR.

## Delta Notes (Target vs Current Materials)

- **semantic-search-api-context.md**: Still reports chunked indexing as the active milestone and lists only three indices; must describe the enriched four-index architecture, expanded environment contract, resilient ingestion stages, and new observability tasks.
- **semantic-search-api-plan.md**: Scope/objectives stop at legacy indexing and lack definitive workstreams (mapping rebuild, environment validation upgrades, resilient indexing, RRF queries for all scopes, suggestion endpoints, logging, regression coverage); GO cadence and explicit ties to rules/testing strategy are missing.
- **semantic-search-documentation-plan.md**: Deliverables do not mention enriched payloads, suggestion/type-ahead docs, zero-hit observability, or the need to regenerate OpenAPI/TypeDoc alongside backend alignment.
- **semantic-search-caching-plan.md**: Caching classes omit the new suggestion endpoints, revised admin/status routes, and cache invalidation triggered by rollup/index-version rotation or zero-hit logging thresholds.
- **semantic-search-ui-plan.md**: Focuses on theming/Oak Components only; lacks sequences scope, facet toggles, suggestion UX, admin feedback, and observability surfacing tied to backend work.
- **semantic-search-ui-style-audit.md**: Current audit targets existing components only; must extend to forthcoming UI surfaces (facet chips, suggestion lists, sequence cards, logging banners) so tokenisation covers alignment features.
- **semantic-search-startup-prompt.md**: Highlights chunked indexing milestone and sub-agent reviews; needs self-review cadence, definitive milestone ordering, and emphasis on enriched mappings, ingestion, RRF queries, suggestions, and logging.
- **semantic-search-ui-continuation-prompt.md**: TL;DR and next steps stop at theming; must highlight sequence/facet/suggestion responsibilities and reinforce self-review cadence.
- **ARCHITECTURE.md**: Lacks enriched mappings (completion contexts, canonical URLs, teacher metadata arrays), new endpoints (suggestions, status), and observability expectations.
- **SETUP.md**: Environment instructions omit `OAK_API_BEARER`, index version tags, logging destinations, and new admin endpoints; should include post-alignment quality gate reminders.
- **INDEXING.md**: Bulk strategy needs resilient batching/backoff guidance, semantic_text payload notes, suggestion payload generation, and logging for retries/zero hits.
- **QUERYING.md**: Requires finalised RRF bodies for all scopes, facet toggles, suggestion/type-ahead queries, and zero-hit instrumentation guidance.
- **ROLLUP.md**: Must document enriched snippet assembly (teacher metadata, canonical URLs), semantic copy behaviour, and cache/tag invalidation after rebuilds.
- **SDK-ENDPOINTS.md**: Should mention updated SDK adapter exposure (sequences, canonical URLs) and explain parity routes’ role in regression testing.
- **docs/README.md**: Needs to reference refreshed architecture/setup/querying/observability docs and describe the expanded API surface plus quality gates.
- **apps/oak-open-curriculum-semantic-search/README.md**: Endpoint list omits suggestions/status, quick start lacks resilient ingestion and observability steps, and operational checklist misses zero-hit logging and index versioning.
- **oak-curriculum-hybrid-search-definitive-guide.md**: Must confirm every requirement from the target alignment plan (indices, mappings, API payloads, observability) is present and authoritative.

## Acceptance Criteria

- Every semantic search plan and prompt reflects the definitive architecture, references GO.md cadence with self-reviews, and cites relevant rules/testing sections where expectations are set.
- Authored semantic search docs and README describe enriched data flows, server-side RRF queries, suggestion endpoints, zero-hit logging, and post-update quality gates.
- Quality gate tasks are executed (or explicitly justified if skipped) when the implementation work occurs, with outcomes recorded in the review steps.
- The plan remains self-contained, enabling contributors to start from the todo list and deliver the updates without ambiguity.

## Review Log

- REVIEW (Todo item 2): Confirmed every semantic search plan, prompt, and authored doc is represented in the Delta Notes list. No gaps identified.
- GROUNDING (Todo item 3): Re-read GO.md and reaffirmed sequencing of `ACTION`/`REVIEW` pairs with self-review cadence.
- GROUNDING (Todo item 6): Re-read GO.md prior to editing `semantic-search-api-plan.md`; confirmed cadence expectations and quality gate reminders.
- REVIEW (Todo item 5): Validated updates to `semantic-search-api-context.md`; confirmed they align with the target alignment plan, reference rules/testing strategy, and reflect the four-index architecture plus observability requirements.
- REVIEW (Todo item 7): Checked revisions to `semantic-search-api-plan.md` for adherence to the definitive guide, explicit GO cadence, TDD expectations, and coverage of all target workstreams. All objectives, workstreams, and acceptance criteria now reference rules/testing strategy.
- GROUNDING (Todo item 9): Re-read GO.md before refreshing remaining plans to maintain cadence and quality gate expectations.
- REVIEW (Todo item 11): Verified updates to documentation, caching, UI, and style-audit plans; ensured each references the target alignment outcomes, new endpoints (suggestions, status), observability requirements, and GO cadence instructions.
- GROUNDING (Todo item 12): Re-read GO.md ahead of prompt updates to reinforce ACTION/REVIEW structure and grounding rhythm.
- REVIEW (Todo item 14): Updated `semantic-search-startup-prompt.md` and `semantic-search-ui-continuation-prompt.md` to reflect alignment milestones, GO cadence with self-reviews, expanded scopes (sequences, suggestions, observability), and the four-index architecture.
- REVIEW (Todo item 17): Rewrote authored docs (ARCHITECTURE, SETUP, INDEXING, QUERYING, ROLLUP, SDK-ENDPOINTS, docs/README, definitive guide) to match the target architecture—four indices, enriched ingestion, server-side RRF, suggestion/status endpoints, and observability. Ensured British spelling and cross-references to rules/testing strategy.
- GROUNDING (Todo item 18): Re-read GO.md before updating workspace README to maintain cadence discipline.
- REVIEW (Todo item 20): Updated `apps/oak-open-curriculum-semantic-search/README.md` with four-index architecture, expanded endpoints (suggest, status), environment matrix, quality gates, and observability reminders aligned with the definitive guide.
- GROUNDING (Todo item 21): Re-read GO.md prior to running quality gates to maintain cadence discipline.
- REVIEW (Todo item 23): `pnpm lint` completed successfully across all packages (10/10), no violations.
- REVIEW (Todo item 26): `pnpm test` passed (10/10 packages), Vitest suites green including semantic search workspace.
- REVIEW (Todo item 29): `pnpm build` succeeded for all packages; Next.js production build for semantic search completed without warnings.
- REVIEW (Todo item 32): `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen` regenerated TypeDoc/OpenAPI artefacts (Docs OK).
- GROUNDING (Todo item 33): Re-read GO.md before the final self-review to ensure compliance with cadence.
- ACTION (Todo item 34): Performed comprehensive self-review of all updated plans, prompts, docs, and README to confirm cross-references, GO cadence instructions, and alignment with the target plan.
- REVIEW (Todo item 35): Final review complete; prepared change summary and verified readiness for handover.
