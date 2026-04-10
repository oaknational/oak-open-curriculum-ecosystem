## Napkin rotation — 2026-04-10

Rotated at 508 lines after the PR #76 merge-handoff sync,
Vercel/bootstrap remediation, and HTTP dev-contract closeout.
Archived to `archive/napkin-2026-04-10.md`. Merged 0 new
entries into `distilled.md`. Graduated/pruned 9 entries now
covered by permanent docs or source TSDoc: barrel-export
reminder, `pnpm vocab-gen` reminder, MCP tool-count pointer,
canonical logger rule, `Awaited<TResult>` wrapper note,
singlefile MCP Apps build note, content-item CSP placement,
tool `name` vs `title`, and contrast usage context.
Extracted 0 new patterns (the new dev-orchestration learning
is documented in permanent docs and plans for now). Previous
rotation: 2026-04-07 at 562 lines.

---

### Session 2026-04-10a — post-rotation continuity seed

#### Current state

- Phase 6 merge-handoff and the Vercel/bootstrap plan are locally green after
  `pnpm check`, the built-artifact proof, and the dev-orchestration acceptance
  check.
- Remaining external step: commit/push `feat/mcp_app_ui`, then recheck the
  deployed preview/build logs before PR #76 merges.

### Session 2026-04-10b — Cursor plugins strategic plan

- Added `developer-experience/future/cursor-plugins-practice-and-oak-developer.plan.md`:
  marketplace-track Practice plugin vs local-first Oak developer plugin (MCP HTTP,
  codegen, SDK, search). Promotion gated on marketplace spike + A↔B layering decision.
  No scaffold yet — exploration only.

### Session 2026-04-10c — Vercel widget crash investigation + plan

- **Root cause confirmed**: `process.cwd()` on Vercel Lambda = `/var/task`,
  not app dir. `dist/oak-banner.html` resolved to wrong path. NFT also
  doesn't trace non-imported HTML files.
- Added debug instrumentation, confirmed root cause from Vercel runtime logs,
  then **removed all debug instrumentation** (clean baseline restored).
- Created investigation notes:
  `.agent/plans/sdk-and-mcp-enhancements/active/vercel-widget-crash-deep-investigation.notes.md`
- Created quality-fix plan:
  `.agent/plans/sdk-and-mcp-enhancements/active/embed-widget-html-at-build-time.plan.md`
- Plan went through **2 rounds of architecture review** (8 reviewers total):
  4 architecture (Fred, Betty, Barney, Wilma) + test, config, docs-adr, code.

#### Key corrections from user (session 2026-04-10d)

- **DI is always used**: I wrongly suggested removing the
  `getWidgetHtml` DI seam because the HTML becomes a constant.
  DI is always used because it enables testing with trivial fakes
  (ADR-078). The constant provides the VALUE; DI provides
  TESTABILITY. Tests inject `() => '<html>test</html>'`.
- **Widget HTML is generated metadata**: User pointed out that the
  repo is "a machine for building codegen-time SDKs consumed by
  thin runtime apps". The widget HTML is just another form of
  generated metadata associated with an MCP tool — same pattern
  as `WIDGET_URI`, tool descriptions, documentation content. It
  should follow the established pattern: generate at codegen
  time → produce a committed TypeScript constant → import and
  consume via DI.
- **AGENTS.md is ephemeral**: learnings I placed in AGENTS.md
  belong in napkin/distilled/docs/ADRs depending on maturity.
  AGENTS.md was reverted.
- **New architectural principle**: Whenever we build something,
  clearly separate (a) a purpose-specific, consumer-general
  framework from (b) the Oak-specific consumer instance. This
  needs to be codified in principles.md with an always-on rule.

#### Vercel Lambda facts (for distilled.md)

- `process.cwd()` on Vercel Lambda = `/var/task` (task root),
  not the app package directory
- Vercel NFT only bundles files reachable via static `import` /
  `require` — dynamic `readFile()` targets may be missing
- Build artefact content served by the app should be a committed
  TypeScript constant (same pattern as codegen output), consumed
  via DI, not runtime filesystem reads

#### Four-tier layered architecture model

Derived from dependency analysis of all package.json files:
- **Tier 0 — Primitives**: zero deps, pure, stateless
  (result, type-helpers). Importing cannot pull in anything.
- **Tier 1 — Infrastructure**: depends on T0, cross-cutting,
  operational character (config, state, env, side effects).
  (logger, observability, env, possibly design tokens).
  Importing carries weight.
- **Tier 2a — Codegen-time**: depends on T0+T1, produces
  committed artifacts. (sdk-codegen, openapi adapter).
- **Tier 2b — Runtime**: depends on T0+T1+committed artifacts
  from T2a. (apps, runtime sdks, runtime libs).
- Import direction: lower tiers MUST NOT import higher.
  T2a and T2b are peers (T2b imports committed output only).
- Key insight: core != shared. `result` (zero deps, always
  safe) is qualitatively different from `logger` (has deps,
  config, side effects). They should not be in the same tier.
- Direction: analyse to function level, define optimal
  principles, then move code. Not document-and-wait.
- **Tensions reveal foundational solutions**:
  1. Barrel re-exports in codegen = false neutrality. Root cause:
     codegen workspace serves as distribution hub. Solution:
     separate codegen engine from output distribution.
  2. Logger conflates framework + instance. Root cause: organic
     growth. Solution: decompose along Framework/Consumer lines.
     `buildResourceAttributes` (Vercel-specific), Express
     middleware → consumer instance in runtime. Generic
     `UnifiedLogger`, error normalisation → framework in infra.
  3. Design is shared infrastructure (Tier 1), not a separate
     category. `design-tokens-core` + `oak-design-tokens`
     already follows Framework/Consumer correctly.
  4. Tooling is orthogonal to the product tier model. Don't
     classify alongside product code.
- **"Decompose at the Tension"** added as a principle in
  principles.md. When code resists clean classification,
  decompose at the fault line rather than classify around the
  compromise. Each tension resolved this way produces cleaner
  boundaries.
- **Cursor rules consolidated**: 12 always-on architecture rules
  reduced to 1 (`apply-architectural-principles.mdc` → 
  `principles.md`). 3 kept for unique detail (type-shortcuts,
  unknown, tsdoc syntax). Process rules unchanged.

#### Lifecycle classification corrections

- **Bulk data processing is codegen-time**: bulk data is
  downloaded as a prerequisite for the codegen pipeline. The
  `src/bulk/` readers/extractors in `oak-sdk-codegen` are
  codegen-time utilities, not runtime code. The search CLI's
  ingestion commands are also codegen-time/operational.
- **Synonym builders should become codegen-time generators**:
  `buildElasticsearchSynonyms()`, `buildPhraseVocabulary()`,
  `buildSynonymLookup()` process static data. They should run
  at codegen time and produce committed TypeScript constants,
  not be called at runtime. Same pattern as widget constants,
  thread progressions, concept graphs.
- **Logger use in codegen is legitimate**: at GA codegen runs
  remotely — structured logs are essential for operational
  visibility. Logger → `packages/core/logger`.
- **Terminology**: "build time" is ambiguous — both codegen-time
  and runtime have build steps. Use "codegen time" and "runtime
  build" consistently.
- **knip and dependency-cruiser** are available for thorough
  import/export analysis during the lifecycle classification
  work.

#### Key corrections from user (session 2026-04-10e)

- **principles.md is the source of truth**: I moved
  fundamental definitions INTO `.agent/rules/*.md` files,
  which broke every mechanism that reads principles directly.
  Rules are ONE operationalisation mechanism among several.
  The correction: inline all detailed guidance into
  `principles.md`, then rewrite rule files as thin pointers.
- **Fitness constraints serve excellence, not the reverse**:
  user said "the GOAL is excellence, not rule following. Where
  a discussion is needed let's have that discussion." Fitness
  targets are tools, not laws.
- **Rule consolidation completed**: 12 `.cursor/rules/*.mdc`
  architecture files deleted, replaced by 1
  `apply-architectural-principles.mdc` pointing to
  `principles.md`. 3 kept for unique content (type-shortcuts,
  unknown-is-type-destruction, tsdoc-hygiene) but updated to
  point to `principles.md` for definitions.

### Session 2026-04-10f — rules tidy-up + ADR gap analysis

#### Completed

- **Rules consolidation tidy-up**: fixed 16 portability failures.
  Created `.agent/rules/apply-architectural-principles.md` as the
  consolidated canonical rule. Updated 4 cursor rules to reference
  canonical rules. Deleted 12 orphan canonical rules + 11 Claude
  adapters. Created consolidated Claude adapter. `pnpm check`
  green. Commit `54907d8e`.
- **ADR-154**: Separate Framework from Consumer — new core
  principle, with the test "Could a non-Oak consumer use this
  unchanged?" and structural expectation.
- **ADR-155**: Decompose at the Tension — classification
  resistance signals hidden coupling, decompose at the fault line.
- **ADR-125 update**: documented the many-to-one consolidation
  pattern for rules, updated trigger examples, replaced hard
  agent count. Commit `99011393`.
- **ADR README index**: updated with ADR-154 and ADR-155 entries
  in both sequential index and key decisions section.

#### Observations

- The portability validator's `CANONICAL_RULE_OR_SKILL_PATTERN`
  only accepts `.agent/rules/` and `.agent/skills/` references.
  If cursor rules ever need to reference `.agent/directives/`
  directly, the pattern will need extending. Currently the
  indirection layer (rule → directive) satisfies the validator.
- Docs-adr-reviewer feedback was high quality: caught em-dash
  format deviation, missing plan links, "consumer-general"
  phrasing opacity, and the un-graduated tier model issue.

#### Next session pickup

1. Execute `embed-widget-html-at-build-time.plan.md` — widget
   HTML as committed TypeScript constant, DI preserved, ~3 files
   deleted, ~18 test files cleaned up
2. After green gates + Vercel verification, archive
   `vercel-widget-crash-deep-investigation.notes.md`
3. Separately track `static-content.ts` `process.cwd()` pattern
   (non-blocking, Vercel ignores `express.static()`)
4. Workspace topology exploration (plan B) — lifecycle
   classification doc, logger reclassification, synonym-to-
   codegen conversion, ESLint cross-category enforcement
