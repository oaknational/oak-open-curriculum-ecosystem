---
name: WS1 Review and Validation
overview: Validate the WS1 get-curriculum-model implementation from the previous session, fix broken E2E tests, rule violations, and string-checking tests, run the full quality gate chain, and invoke specialist reviewers at each phase.
todos:
  - id: triage-failures
    content: Run E2E and unit/integration tests to establish actual failure state before fixing anything
    status: completed
  - id: code-review-triage
    content: Invoke code-reviewer to validate failure analysis
    status: completed
  - id: fix-broken-e2e
    content: "Fix Priority 1: broken E2E tests (documentation-resources, get-curriculum-model as assertion, widget-metadata)"
    status: completed
  - id: fix-string-tests
    content: "Fix Priority 2: ~15 string-checking tests across 8 files to assert behaviour not implementation"
    status: completed
  - id: fix-structural
    content: "Fix structural issues: derive AGGREGATED_TOOL_NAMES from AGGREGATED_TOOL_DEFS, add TSDoc, update comments"
    status: completed
  - id: code-review-fixes
    content: Invoke code-reviewer + test-reviewer after test and structural fixes
    status: completed
  - id: quality-gates
    content: Run full quality gate chain (sdk-codegen through smoke:dev:stub)
    status: completed
  - id: code-review-gates
    content: Invoke code-reviewer after gates pass to confirm clean state
    status: completed
  - id: adversarial-reviews
    content: Invoke architecture-reviewer-barney, test-reviewer, docs-adr-reviewer, type-reviewer in parallel
    status: completed
  - id: doc-propagation
    content: Update plan, strategic brief, collection README, agent-support-tools-specification
    status: completed
  - id: final-commit
    content: Re-run pnpm qg, commit all changes
    status: in_progress
isProject: false
---

# WS1 get-curriculum-model: Review and Validation Plan

## Assumptions Validated

The previous agent claimed all RED/GREEN/REFACTOR phases were complete. Exploration reveals this is **mostly true with notable exceptions**:

- **Claim: widget renderer created** -- FALSE. `curriculum-model-renderer.ts` does not exist. Confirmed not needed: `get-curriculum-model` is agent-facing (domain model + guidance), not visual content. The plan's GREEN phase table entry is a phantom claim -- correct during documentation propagation.
- **Claim: all tests pass** -- UNVERIFIED. `documentation-resources.e2e.test.ts:236-237` will fail (still checks old tool names in workflows). `widget-metadata.e2e.test.ts:115` has coverage gap.
- **Claim: E2E tests confirmed failing before implementation** -- TRUST BUT VERIFY via quality gate run.
- **Core implementation files** -- VERIFIED. All 8 files exist, no `as` assertions, clean imports, correct patterns.
- **Guidance surface alignment** -- VERIFIED. All 16 surfaces reference `get-curriculum-model`. `PRIMARY_ORIENTATION_TOOL_NAME` used consistently.
- **Dual exposure** -- VERIFIED. Tool in `AGGREGATED_TOOL_DEFS` + resource at `curriculum://model` with correct annotations.

## Phase 1: Triage -- Confirm Actual Failures (read-only)

All changes from the previous session are staged.

Run E2E tests first (highest risk), then unit/integration. This establishes the real state before making any fixes.

```bash
pnpm test:e2e 2>&1 | head -100   # Expect failures in documentation-resources, widget-metadata
pnpm test --force 2>&1 | head -100  # Verify unit/integration state
```

**Expected failures:**

- `documentation-resources.e2e.test.ts:236-237` -- checks `get-help`/`get-ontology` in workflows that now reference `get-curriculum-model`
- `widget-metadata.e2e.test.ts:115` -- missing `get-curriculum-model` from `aggregatedToolNames`

**Possible failures:**

- Any test that checks server instructions for specific tool names
- Tests in workspaces touched by the codegen changes

**Code reviewer checkpoint**: Invoke `code-reviewer` after triage to validate the failure analysis before proceeding to fixes.

## Phase 2: Fix Blocking Issues

### 2a: Fix factually broken E2E tests (Priority 1 from plan)

| File                                                                                                                                   | Issue                                                     | Fix                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `[documentation-resources.e2e.test.ts:236-237](apps/oak-curriculum-mcp-streamable-http/e2e-tests/documentation-resources.e2e.test.ts)` | Checks `get-help`/`get-ontology` in workflows             | Assert behavioural property: workflow markdown references an agent support tool |
| `[get-curriculum-model.e2e.test.ts:164](apps/oak-curriculum-mcp-streamable-http/e2e-tests/get-curriculum-model.e2e.test.ts)`           | `as { ... }` type assertion                               | Replace with Zod schema validation                                              |
| `[widget-metadata.e2e.test.ts:115](apps/oak-curriculum-mcp-streamable-http/e2e-tests/widget-metadata.e2e.test.ts)`                     | Missing `get-curriculum-model` from `aggregatedToolNames` | Add to array                                                                    |

### 2b: Fix string-checking tests (Priority 2 from plan)

~15 instances across 8 test files assert specific tool name strings. Replace with behavioural assertions per the testing strategy. Key files:

- `[server.e2e.test.ts:260-261](apps/oak-curriculum-mcp-streamable-http/e2e-tests/server.e2e.test.ts)` -- instructions contain agent guidance (not specific names)
- `[register-resources.integration.test.ts:183](apps/oak-curriculum-mcp-streamable-http/src/register-resources.integration.test.ts)` -- widget description includes orientation guidance
- `[widget-cta.unit.test.ts:178-179](apps/oak-curriculum-mcp-streamable-http/src/widget-cta.unit.test.ts)` -- CTA prompt includes orientation guidance
- `[mcp-prompts.unit.test.ts:88,112,136](packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.unit.test.ts)` -- prompts include prerequisite guidance
- `[tool-guidance-data.unit.test.ts:12-14](packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.unit.test.ts)` -- agent support category has tools (membership, not strings)
- `[documentation-resources.unit.test.ts:100-101](packages/sdks/oak-curriculum-sdk/src/mcp/documentation-resources.unit.test.ts)` -- tools reference includes agent support tools
- `[universal-tools.unit.test.ts](packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.unit.test.ts)` -- add `get-curriculum-model` to `isUniversalToolName` and `_meta` test arrays

**Code reviewer checkpoint**: Invoke `code-reviewer` + `test-reviewer` after fixing tests.

### 2c: Fix structural issues from code review

- `[help-content.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/help-content.ts)` -- derive `AGGREGATED_TOOL_NAMES` from `AGGREGATED_TOOL_DEFS` keys
- `[curriculum-model-data.ts](packages/sdks/oak-curriculum-sdk/src/mcp/curriculum-model-data.ts)` -- add TSDoc note to `composeDomainModel()` about explicit field inclusion
- `[definitions.ts](packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts)` -- update comment block to include `get-curriculum-model`

## Phase 3: Full Quality Gate Chain

Run gates sequentially, one at a time:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

Fix any failures before proceeding. This is the hard gate.

**Code reviewer checkpoint**: Invoke `code-reviewer` after all gates pass to confirm clean state.

## Phase 4: Adversarial Specialist Reviews

Invoke in parallel:

- `architecture-reviewer-barney` -- new module boundaries, `curriculum-model-data.ts` to `aggregated-curriculum-model/` to `universal-tools/` dependency chain
- `test-reviewer` -- string-checking pattern fixes, TDD compliance, test quality
- `docs-adr-reviewer` -- documentation drift from guidance surface changes
- `type-reviewer` -- schema-first compliance of new types

Address any blocking findings before proceeding.

## Phase 5: Documentation Propagation

- Update plan status (mark completed todos, update Outstanding Work)
- Update [agent-support-tools-specification.md](reference-docs/internal/agent-support-tools-specification.md) with `get-curriculum-model`
- Update strategic brief status
- Update collection README status
- Correct the WS1 plan's phantom claim about `curriculum-model-renderer.ts` (agent-facing tool, no renderer needed)

## Phase 6: Final Quality Gate + Commit

Re-run `pnpm qg` to confirm everything is clean, then commit.

## Pre-existing `as` Assertions (out of scope)

These pre-date WS1 and are not blocking for this review:

- `server.e2e.test.ts` -- 8 instances
- `register-resources.integration.test.ts` -- 12 instances

Note their existence but do not fix in this workstream unless they cause failures.
