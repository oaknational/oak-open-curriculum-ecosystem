---
name: update-upstream-api-spec
classification: active
description: >-
  Align the estate to a changed upstream Oak Open Curriculum API
  (OpenAPI) spec — summon on "upstream spec changed", "schema drift
  check fired", "refresh the schema cache", "sdk-codegen refresh", a
  failing correction-layer removal-condition test after an upstream
  deploy, or an upstream changelog entry. Drives the owning runbooks:
  characterise the drift first-hand (doc-only vs structural, additive
  vs consumer-breaking), refresh deliberately, treat correction-layer
  test failures as lifecycle signals, re-attest the MCP content audit,
  verify the served descriptions, and route upstream falsehoods as bug
  reports. Do NOT use for the bulk-download surface (that is
  update-bulk-download-schema) or for building new tools against an
  unchanged spec. Failure shapes it exists to prevent: hand-editing
  generated files, blind expectation edits on red sentinel tests,
  loosening validation to make upstream drift pass, and skipping the
  content-audit re-attestation so the served surface silently diverges
  from its reviewed record.
---

# Update the upstream Oak API spec alignment

The Cardinal Rule promises that `pnpm sdk-codegen` + `pnpm build`
realign every workspace when the upstream OpenAPI spec changes. This
skill is the summonable routing for that moment. The substance lives in
two owned homes — follow them, do not re-derive from memory:

1. [`docs/engineering/upstream-api-alignment-runbook.md`](../../../docs/engineering/upstream-api-alignment-runbook.md)
   — the end-to-end operational flow (worktree, gates, PR, merge).
2. [`packages/sdks/oak-sdk-codegen/README.md`](../../../packages/sdks/oak-sdk-codegen/README.md)
   §Responding to Upstream Spec Changes — the workspace-level detail:
   drift characterisation, the deliberate refresh path
   (`pnpm sdk-codegen:refresh`), the compile-time-enforced
   spec→input-parameter flow, and the correction-layer tripwires.

## The discipline layer this skill adds

Worked instance calibrating each step: the 2026-08-03 spec 0.7.x
alignment (MCP-462, PR #735).

1. **Characterise before regenerating.** Normalised diff of live spec
   vs committed cache; separate documentation drift from structural
   drift; classify structural drift additive vs consumer-breaking
   (README §Responding has the jq recipes). Never start from the
   generator output.
2. **Expect designed red.** Correction-layer guard tests
   (`param-description-overrides` and kin) FAIL on the first
   post-refresh run when upstream rewords a corrected claim — that is
   the lifecycle signal, not a regression. The cure is re-grounding or
   retiring the correction entry, NEVER a blind expectation re-pin: a
   literal content pin in a test is admissible only as a designed
   sentinel where a named decision attaches to the value changing
   (`test-immediate-fails` items 4 and 14). Prefer source-anchored
   differential tests that derive expectations from the schema cache
   (worked exemplar: the meta-examples round-trip test, rewritten
   2026-08-03).
3. **Upstream falsehoods route out, not in.** A wrong upstream
   description or behaviour is corrected locally through the override
   layers AND reported upstream as a plainly-worded, agent-marked
   ticket (MCP-464 is the precedent). Local validation is never
   loosened to make drift pass (`strict-validation-at-boundary`).
4. **Re-attest the agent-facing content audit.** Regeneration moves
   served text, so the MCP content-audit record must be re-trued in the
   same PR: anchor re-pins and delta-review re-attestations in
   `agent-tools/src/mcp-content-current-source/`, green under
   `validate-mcp-content-current-source`. The 2026-08-03 instance
   re-pinned 21 anchors and re-attested 15 semantic hashes — budget for
   this; it is part of the alignment, not an afterthought.
5. **Verify the served surface, not just the gates.** Regenerate the
   served tool table
   (`pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http generate:tool-table`),
   read at least one changed descriptor end-to-end, and run the UAT smoke subset
   (`apps/oak-curriculum-mcp-streamable-http/docs/manual-uat-guide.md`)
   against a running instance of the changed head, checking the
   specific changed behaviours live (the 2026-08-03 instance verified
   the keywords server-side pagination default first-hand before
   shipping the description that documents it).
6. **Record consumer-breaking changes** in the PR description with a
   one-line migration note even when the in-repo blast radius is zero
   (the MCP transport self-heals; pinned SDK consumers do not).

## Related

- [`schema-first-execution`](../../directives/schema-first-execution.md)
  — the non-negotiable generator contract this skill operates under.
- [`update-bulk-download-schema`](../update-bulk-download-schema/SKILL-CANONICAL.md)
  — the sibling skill for the bulk-download surface (ADR-222 governs).
- [`generator-first-mindset`](../../rules/generator-first-mindset.md)
  — fires on the same surfaces; behaviour changes go in templates.
