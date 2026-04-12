---
name: "eslint-disable Comment Remediation"
overview: "Remove all remaining actionable eslint-disable, @ts-ignore, @ts-expect-error, and @ts-nocheck inline comments by fixing root causes. Extracted from Phase 3 of the CI consolidation plan."
todos:
  - id: generators
    content: "Remediate generator file directives (synonym-miner, analysis-report-generator): split files/functions."
    status: pending
  - id: generated-data
    content: "Remediate remaining generated data file directives (thread-progression, definition-synonyms, property-graph, ontology-data): JSON loader or split."
    status: pending
  - id: codegen-scripts
    content: "Remediate code-generation script directives (zodgen-core, generate-ai-doc): split by responsibility."
    status: pending
  - id: logger
    content: "Remediate logger directives (json-sanitisation, error-normalisation): off-the-shelf stringify replacement."
    status: pending
  - id: test-fakes
    content: "Remediate test fake directives (logger, curriculum-sdk, stdio, streamable-http): narrow DI interfaces."
    status: pending
  - id: authored-code
    content: "Remediate oak-search-cli authored code directives: split files/functions, fix generators that emit suppressions."
    status: pending
  - id: miscellaneous
    content: "Remediate miscellaneous directives: typeSafeEntries, async wrappers, restricted types, Node stream gap."
    status: pending
  - id: promote-to-error
    content: "Promote @oaknational/no-eslint-disable from warn to error when actionable count reaches zero."
    status: pending
---

# eslint-disable Comment Remediation

**Created**: 2026-03-29
**Last Updated**: 2026-03-29
**Status**: IN PROGRESS
**Extracted from**: Phase 3 of
[`../archive/completed/ci-consolidation-and-gate-parity.plan.md`](../archive/completed/ci-consolidation-and-gate-parity.plan.md)
**Feeds into**: Quality Gate Hardening plan item 3 (no-eslint-disable promotion)

## Problem

~64 actionable `eslint-disable` inline comments remain across the
repository. Each masks a root-cause issue (oversized files, type
assertions, restricted API usage). The project bans `eslint-disable`
comments — the `@oaknational/no-eslint-disable` rule is at `warn` and
must be promoted to `error` once all comments are removed.

## What Was Already Done (in CI Plan)

- Phases 0-2: Foundation, ESLint rule creation, widget deletion
- Phases 4-5: CI reporter, CI consolidation
- Phase 3 partial: Generic JSON dataset writer extracted;
  vocabulary-graph, misconception-graph, and nc-coverage-graph migrated
  to JSON loader pattern (9 directives removed)

## Remaining Inventory (~64 directives)

### 1. Generator Files — 7 directives

| File | Directives | Rules |
|------|-----------|-------|
| `sdk-codegen/src/bulk/generators/synonym-miner.ts` | 4 | max-lines, max-lines-per-function, max-statements, complexity |
| `sdk-codegen/src/bulk/generators/analysis-report-generator.ts` | 3 | max-lines, max-lines-per-function, complexity |

**Strategy**: Split by responsibility. Extract serialisation into JSON
writer pattern or separate helper modules.

### 2. Generated Data Files — 4 directives

| File | Lines | Rules |
|------|-------|-------|
| `sdk-codegen/src/generated/vocab/thread-progression-data.ts` | 1,529 | max-lines |
| `sdk-codegen/src/generated/vocab/synonyms/definition-synonyms.ts` | 454 | max-lines |
| `sdk-codegen/src/mcp/property-graph-data.ts` | 324 | max-lines |
| `oak-curriculum-sdk/src/mcp/ontology-data.ts` | 582 | max-lines |

**Strategy**: Thread-progression and definition-synonyms may migrate to
JSON loader. Property-graph and ontology-data are authored — split by
section.

### 3. Code-generation Scripts — 2 directives

| File | Rules |
|------|-------|
| `sdk-codegen/code-generation/zodgen-core.ts` | max-lines |
| `sdk-codegen/code-generation/generate-ai-doc.ts` | max-lines |

**Strategy**: Split by responsibility.

### 4. Logger — 16 directives

| File | Directives | Rules |
|------|-----------|-------|
| `logger/src/json-sanitisation.ts` | 10 | max-lines (1), no-restricted-types (7), no-restricted-properties (2) |
| `logger/src/error-normalisation.ts` | 4 | no-restricted-types (4) |
| `logger/src/node.ts` | 1 | no-restricted-globals |
| `logger/src/log-levels.unit.test.ts` | 1 | no-restricted-properties |

**Strategy**: Replace custom sanitisation with off-the-shelf
`safe-stable-stringify` or similar. The `WeakSet<object>` and
thrown-value `object` types are inherent to the JavaScript type system —
the off-the-shelf library absorbs them.

### 5. Test Fakes — 8 directives

| File | Directives | Rules |
|------|-----------|-------|
| `logger/src/test-helpers/fakes.ts` | 3 | consistent-type-assertions |
| `oak-curriculum-sdk/src/test-helpers/fakes.ts` | 1 | consistent-type-assertions |
| `oak-curriculum-mcp-stdio/src/test-helpers/fakes.ts` | 3 | consistent-type-assertions |
| `streamable-http/src/register-prompts.integration.test.ts` | 1 | consistent-type-assertions |

**Strategy**: Define narrow DI interfaces and inject them. The fake
satisfies the narrow interface without assertions.

**Note**: Stdio fakes are de-scoped unless replacement/retirement work
requires touching the app.

### 6. Authored Code (oak-search-cli) — ~14 directives

Spread across ~16 files. Dominant rules: max-lines,
max-lines-per-function, max-statements, complexity,
no-restricted-properties.

**Strategy**: Split files and extract functions. Fix
`schema-emitter.ts` and `type-emitter.ts` generators that **emit**
eslint-disable into their output.

### 7. Miscellaneous — ~13 directives

Spread across 12 files in curriculum-sdk, streamable-http, and
oak-eslint. Rules: no-restricted-types, no-restricted-properties,
no-misused-promises, no-explicit-any, no-restricted-syntax, max-lines.

**Strategy**: `typeSafeEntries`/`typeSafeKeys`/`typeSafeValues` for
`Object.*` cases; async wrappers for `no-misused-promises`; narrow
interfaces for type assertions; split files for max-lines.

## Execution Order

1. Generators (remove serialisation that emits suppressions)
2. Generated data (remaining JSON loader rollout or splits)
3. Logger (off-the-shelf stringify replacement)
4. Test fakes (narrow DI interfaces)
5. Authored code (split files/functions)
6. Miscellaneous (typeSafeEntries, async wrappers, restricted types)
7. Promote `warn` to `error`

## Established Patterns to Reuse

- **JSON loader**: `data.json` + `types.ts` + `index.ts` via
  `writeJsonDataset` (proved by prerequisite-graph, extended to 3 more)
- **File splitting**: extract by responsibility, maintain barrel exports
- **DI fakes**: narrow interface with only the members the code needs

## Deterministic Validation

```bash
# Count remaining (exclude user-approved jc: and type-helpers)
grep -r "eslint-disable" --include="*.ts" --include="*.mjs" \
  --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.turbo . \
  | grep -v "node_modules" | grep -v "jc:" \
  | grep -v "type-helpers/src/index.ts" | wc -l
pnpm check
```

## Acceptance Criteria

1. No actionable `eslint-disable` comments remain
2. No actionable `@ts-ignore`, `@ts-expect-error`, or `@ts-nocheck`
   comments remain
3. `@oaknational/no-eslint-disable` is promoted from `warn` to `error`
4. `pnpm check` passes
5. All changes reviewed by appropriate sub-agents

## Non-Goals

- Moving suppressions from inline comments into config overrides
- Touching `type-helpers` user-approved exceptions
- Investing in standalone stdio maintenance
- Reopening completed CI or widget work

## References

- `packages/core/oak-eslint/src/rules/no-eslint-disable.ts`
- `packages/core/oak-eslint/src/configs/recommended.ts`
- `.agent/plans/architecture-and-infrastructure/current/quality-gate-hardening.plan.md` (item 3 depends on this)
- `.agent/plans/developer-experience/active/devx-strictness-convergence.plan.md` (overlapping test-fakes scope)
