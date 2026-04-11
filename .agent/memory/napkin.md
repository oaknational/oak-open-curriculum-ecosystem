## Napkin rotation — 2026-04-10b

Rotated at 570 lines after 12 sessions (10a–10l) covering
widget crash fix, rules consolidation, ADR-154/155, KGs and
pedagogy analysis, open-education knowledge surfaces plan
family, ChatGPT report normalisation, EEF comparison, and
curriculum NLP processing workspace plan.
Archived to `archive/napkin-2026-04-10b.md`. Merged 2 new
entries into `distilled.md`: DI contract sweep rule (Testing),
lead-with-narrative process rule (Process). Graduated/pruned
13 entries now covered by permanent docs: Vercel Lambda facts
(ADR-156), four-tier model (principles.md), lifecycle
corrections (distilled terminology entry), rule consolidation
(ADR-125 update), ChatGPT PUA patterns (dedicated pattern
file), framework/consumer separation (ADR-154),
decompose-at-tension (ADR-155). Extracted 0 new patterns
(codegen-constant-via-DI is a candidate but borderline with
ADR-156; new-ecosystem-new-workspace is single instance).
Previous rotation: 2026-04-10 at 508 lines.

---

### Session 2026-04-10m: Open Education Knowledge Surfaces WS-0/1/2

**Surprise: git stash as diagnostic is dangerous**
Used `git stash` to check if lint errors were pre-existing. The stash
reverted all tracked changes. `stash pop` then failed on a conflict
(another agent had modified `.agent/memory/distilled.md` concurrently).
Recovery required: backup current tree, restore conflicting files to HEAD,
pop stash, re-apply backed-up versions. Lesson: never use `git stash` as
a quick diagnostic without understanding the full tree state and potential
concurrent modifications.

**Correction: prerequisite guidance scope**
Only `get-curriculum-model` is a prerequisite tool. Graph tools
(prerequisite, thread progressions, misconception) are supplementary
resources loaded as needed — they should NOT include "You MUST call
get-curriculum-model first" guidance. The factory was updated to not
inject prerequisite guidance. Tests updated to assert the negative.

**Correction: `object` is forbidden as generic constraint**
ESLint rule `@typescript-eslint/no-restricted-types` forbids `object`.
Used `{ readonly version: string }` as the structural constraint
instead — all graph data types share this field.

**Pattern: pre-implementation specialist review**
Running 4 specialist reviewers (betty, barney, mcp, code) against plan
files BEFORE implementation caught 7 blocking findings and 9 design
changes. This saved significant rework. The pattern is: review plans,
not just code.

**Correction: fragile idempotency test pattern**
The `is idempotent — returns identical data on repeated calls` test
comparing `structuredContent` on graph tools proves nothing meaningful —
it tests that a pure function returns the same value twice, which is
guaranteed by the type system and the fact that the source data is a
module-level constant. Delete these tests. Also, `includes summary text
mentioning misconceptions in content` tests a string constant, not
behaviour. Tests must prove product behaviour through the interface,
not assert constants. See testing-strategy.md §Universal Testing Rules.

**Correction: prerequisite graph name is ambiguous**
"Prerequisite graph" is ambiguous — it can be read as "prerequisite for
using this tool" (which caused the prerequisite guidance confusion) or
"student prior-knowledge prerequisites for curriculum sequencing" (which
is the actual meaning). The resource and tool should be renamed to make
the student/curriculum context clear. E.g. `prior-knowledge-graph` or
`student-prerequisites-graph`. This is a rename-everywhere task:
resource URI, tool name, file names, ADR-123, all references.
Track as a next-session task.

**Overlooked from archived napkins — surfaced during handoff review**

The following items were in rotated napkins but not graduated or tracked:

1. ~~**Server Implementation branding is empty**~~ — RESOLVED. Was
   done in `server-branding.ts` (title, description, websiteUrl, themed
   icons). Wired into `application.ts:238`. The napkin entry (S5) lacked
   a resolution annotation, causing a false alarm during review.

2. **Generated tools have no human-friendly title** (S3, napkin-2026-04-10):
   Generated tools fall back to kebab-case `tool.name`. Deferred to
   codegen template change but no plan tracks it.

3. **Pre-implementation plan review as a pattern**: Running specialist
   reviewers against PLANS (not code) caught a fundamental premise error
   (S14, napkin-2026-04-10) and 7 blocking findings (this session).
   This pattern should be graduated to testing-strategy.md or a
   governance doc as a recommended practice.

4. **Synonym builders should become codegen-time** (napkin-2026-04-10b):
   `buildElasticsearchSynonyms()`, `buildPhraseVocabulary()`,
   `buildSynonymLookup()` run at runtime over static data. Should be
   codegen-time generators. No plan tracks the migration.

5. **`static-content.ts` `process.cwd()` bug** (napkin-2026-04-10b):
   Non-crash, Vercel ignores `express.static()`. Still wrong. Tracked
   nowhere permanently.

6. **E2E test flakiness** (napkin-2026-04-10, S session 2026-04-08e/09):
   `get-curriculum-model.e2e.test.ts` intermittent failure. No plan or
   issue tracks investigation.

7. **Lead with narrative, not infrastructure**: Process insight worth
   graduating to governance or distilled: "Documentation that declares
   what we're doing and why frames all subsequent technical work."

**Pattern: graph sub-setting as future feature**
User identified the need for sub-graph extraction — either at runtime
(tool parameters) or codegen-time (per-subject sub-graphs). Tracked in
memory. The factory is the natural extension point.

---

### Session 2026-04-11: Pre-commit fixes + EEF plan resolution

**Correction: blanket `replace_all` on partial words corrupts code templates**
Used `replace_all` with `prerequisite` (lowercase) in
`write-json-graph-file.ts`, which is a code-template file generating
TypeScript source. This corrupted `prerequisiteFor` → `prior-knowledgeFor`
and `prerequisiteGraph` → `prior-knowledgeGraph` (invalid JS identifiers).
Had to restore from git and rewrite the entire file. Lesson: in files
that generate code with mixed-case identifiers, never use blanket
substring replacement. Rewrite the file completely or use exact-match
replacements for each distinct identifier.

**Pattern: background agents for mechanical rename-everywhere**
Two background agents handled ~30 files of test/guidance/app-layer renames
while I worked on the generator layer and documentation. The agents
completed without conflicts because file scopes didn't overlap. The
rename-everywhere task (~260 references, ~40 files) was completed in a
single session by parallelising across 3 workers (me + 2 agents).

**Surprise: flaky auth E2E test under turbo concurrency**
`returns HTTP 401 for tools/list with fake Bearer token` in
`application-routing.e2e.test.ts` failed during full `pnpm check` (87/88
passed) but passed on isolated `pnpm test:e2e` re-run. This is a
different test from the previously noted `get-curriculum-model.e2e.test.ts`
flakiness. Now two distinct flaky E2E tests observed. Created dedicated
memory note `project_flaky-test-tracker.md` per user request.

**Validation: live MCP server graph surfaces verified post-rename**
All 3 graph tools (`get-prior-knowledge-graph`, `get-misconception-graph`,
`get-thread-progressions`) and all 4 graph resources (`curriculum://model`,
`curriculum://prior-knowledge-graph`, `curriculum://misconception-graph`,
`curriculum://thread-progressions`) verified working via `oak-local` MCP
server. Tool calls returned correct stats (1,607 units/3,452 edges,
12,858 misconceptions, 164 threads). Resource reads returned valid JSON
(1.9 MB, 6.4 MB, 241 KB). No trace of old `prerequisite-graph` name in
the running server. This confirms the rename cascaded correctly through
generators → generated data → SDK → app → running server.

---

### Session 2026-04-11b: Search CLI Observability Planning

**Session scope**: Planning only — no code changes. Thorough start-right
workflow, 3 Explore agents, 3 Plan agents, synthesised into a 10-step
implementation plan for Search CLI observability adoption.

**Key design decisions recorded in session plan**:
- `CliObservability` interface is lighter than `HttpObservability` — no
  MCP wrapping, no live OTel tracer, no logger factory. Exposes
  `sentrySink` as a property for the module-level logger pattern.
- `registerAdditionalSink()` extends the existing module-level logger
  pattern rather than redesigning to a factory model.
- Observability threaded to commands via optional parameter on
  `withLoadedCliEnv`, not embedded in the env loader.
- `captureHandledError` only in `withEsClient` catch (unexpected
  throws), not on domain `Result.err` paths (expected failures).
- Eager env load in entry point for observability init, non-fatal on
  failure.

**Observation: plan agent disagreement on file location**
Plan agent 2 placed `CliObservability` in `src/lib/cli-observability.ts`;
Plan agent 1 used `src/observability/`. The HTTP server uses
`src/observability/`, which is the better pattern (separate concern
directory). Resolved in favour of `src/observability/`.

**Observation: plan agent disagreement on factory signature**
Plan agent 2 suggested `createCliObservability(env, version)` while
Plan agent 1 used `createCliObservability(runtimeConfig, options?)`.
Using `SearchCliRuntimeConfig` is consistent with the HTTP server
pattern and carries both `env` and `version` in one object. Resolved
in favour of `runtimeConfig`.

**Pattern: EEF data structure is more varied than plan assumed**
Detailed JSON analysis revealed: (a) strand fields have high optionality
(6 optional top-level fields, 3 rare `implementation_requirements` fields),
(b) `school_context_schema` is a JSON Schema meta-definition (schema of a
schema) — typing it fully would be excessive, (c) `pp_relevance` has only
3 values (`moderate`, `high`, `very_high`), (d) `closing_disadvantage_gap`
in priorities matches the plan (no "the"), but `closing_the_disadvantage_gap`
IS a separate strand field (2/30 strands). These are distinct concepts.
