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
