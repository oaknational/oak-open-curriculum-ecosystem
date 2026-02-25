# Remediation Backlog and Execution Packets

## Severity Model

| Severity | Definition | SLA lane |
| --- | --- | --- |
| `S0` | materially unsafe or broken canonical path | immediate |
| `S1` | high-impact drift or active guidance conflict | next sprint |
| `S2` | medium inconsistency, discoverability, or stale metadata | planned |
| `S3` | editorial or optimisation follow-up | backlog |

## S1 (Next Sprint)

### RB-001 (DF-001, DF-002) — Repair broken SDK truth-source links

- Exact file(s):
  - `docs/README.md`
  - `docs/domain/DATA-VARIANCES.md`
  - `docs/domain/README.md`
- Problem statement: links target removed paths under `packages/sdks/oak-curriculum-sdk/src/...`.
- Evidence: `output/missing-link-summary.tsv` and findings DF-001/DF-002.
- Target change:
  - Repoint links to valid current sources (prefer stable package README anchors where possible).
  - Avoid linking volatile generated file locations unless necessary.
- Validation command(s):
  - `rg -n 'property-graph-data\.ts|api-schema-sdk\.json' docs/data docs/README.md`
  - `awk -F '\t' '$4=="missing"' .agent/plans/developer-experience/governance/docs-deep-review-2026-02-25/evidence/related-links.tsv`
- Dependency notes: coordinate with SDK workspace-separation changes before final path lock.

### RB-002 (DF-005) — Resolve stale provider architecture surface

- Exact file(s):
  - `docs/architecture/provider-system.md`
  - `docs/architecture/provider-contracts.md`
  - `docs/architecture/README.md`
  - `docs/README.md`
- Problem statement: stale provider docs are still indexed as active architecture guidance.
- Evidence: provider docs `Status: STALE` and index links in architecture/root docs.
- Target change:
  - Option A: rewrite provider docs to current model.
  - Option B: mark as historical and replace index links with current composition docs.
- Validation command(s):
  - `rg -n 'Provider System|provider-contracts|STALE' docs/architecture docs/README.md`
- Dependency notes: confirm architecture owner for provider narrative.

### RB-003 (DF-006) — Update programmatic tool generation implementation details

- Exact file(s): `docs/architecture/programmatic-tool-generation.md`
- Problem statement: "current" file-structure section references non-existent files.
- Evidence: lines 202-217 and existence checks in review notes.
- Target change:
  - Replace with real current paths.
  - Label historical examples explicitly as historical.
- Validation command(s):
  - `rg -n 'File Structure \(current\)|generate-tools\.ts|tools\.generated\.ts|tool-handler\.ts' docs/architecture/programmatic-tool-generation.md`
- Dependency notes: align with current MCP generation ownership.

### RB-004 (DF-008) — Standardise KS4 terminology (`ks4Options` vs pathway)

- Exact file(s):
  - `docs/foundation/quick-start.md`
  - `docs/domain/README.md`
  - `docs/domain/DATA-VARIANCES.md`
- Problem statement: conflicting representation of pathway metadata.
- Evidence: quick-start/data README use pathway language; DATA-VARIANCES states pathway never existed in API.
- Target change:
  - Use API-accurate term (`ks4Options`) as primary term.
  - Optionally retain pathway as historical alias with explicit caveat.
- Validation command(s):
  - `rg -n 'pathway|ks4Options' docs/foundation/quick-start.md docs/domain/README.md docs/domain/DATA-VARIANCES.md`
- Dependency notes: verify against SDK ontology source before merge.

## S2 (Planned)

### RB-005 (DF-003) — Repoint or remove dead provenance links

- Exact file(s):
  - `docs/architecture/openai-connector-deprecation.md`
  - `docs/architecture/programmatic-tool-generation.md`
  - `docs/domain/DATA-VARIANCES.md`
  - `docs/domain/README.md`
- Problem statement: active docs link to non-resolving plan leaf files.
- Evidence: `output/missing-link-triage.tsv` classifications `provenance-exception` and `deprecate-link`.
- Target change:
  - Replace with stable indexes (`completed-plans`, roadmap, or archive index) where provenance remains useful.
  - Remove dead links where provenance adds no current value.
- Validation command(s):
  - `cat .agent/plans/developer-experience/governance/docs-deep-review-2026-02-25/output/missing-link-triage.tsv`

### RB-006 (DF-004) — Remove hard-coded ADR count from docs root index

- Exact file(s): `docs/README.md`
- Problem statement: fixed ADR count drifts over time.
- Evidence: docs claims 114 while directory count is 116.
- Target change:
  - Replace numeric claim with dynamic wording (“ADR index”).
- Validation command(s):
  - `find docs/architecture/architectural-decisions -maxdepth 1 -type f -name '*.md' | wc -l`
  - `rg -n 'ADR.*define how the system should work' docs/README.md`

### RB-007 (DF-007) — Align structural pattern counts across summaries

- Exact file(s): `docs/foundation/quick-start.md`, `docs/domain/DATA-VARIANCES.md`
- Problem statement: quick-start summary and domain reference disagree on pattern count.
- Evidence: quick-start line 117 vs DATA-VARIANCES line 150.
- Target change:
  - Set one authoritative count in domain doc and reference it from quick-start.
- Validation command(s):
  - `rg -n 'structural patterns|Pattern Types' docs/foundation/quick-start.md docs/domain/DATA-VARIANCES.md`

### RB-008 (DF-009) — Clarify command-precedence model for quality gates

- Exact file(s): `docs/foundation/onboarding.md`, `docs/engineering/workflow.md`, `docs/governance/development-practice.md`
- Problem statement: local convenience command flow can conflict with directive-level gate ordering for agent work.
- Evidence: onboarding/workflow aggregate commands vs start-right-thorough one-gate sequence.
- Target change:
  - Add explicit note: directives are normative for agent execution; local docs may provide convenience wrappers for humans.
- Validation command(s):
  - `rg -n 'pnpm qg|pnpm make|one at a time|quality gate' docs/development docs/agent-guidance .agent/prompts/start-right-thorough.prompt.md`

### RB-009 (DF-011) — Add freshness metadata to central docs

- Exact file(s): top-centrality docs from `output/doc-centrality-by-refs-in.tsv` (priority first 10).
- Problem statement: central docs lack consistent `Last Updated` / `Status` markers.
- Evidence: doc inventory status/freshness columns and centrality table.
- Target change:
  - Add consistent metadata header fields to high-centrality docs.
- Validation command(s):
  - `head -n 12 .agent/plans/developer-experience/governance/docs-deep-review-2026-02-25/output/doc-centrality-by-refs-in.tsv`
  - `rg -n 'Last Updated|Last updated|Status' docs/**/*.md`

### RB-010 (DF-012) — Reduce direct coupling to volatile provenance docs

- Exact file(s): architecture and data docs linking into `.agent/plans/*` leaf files.
- Problem statement: active docs depend on volatile plan/historical artefacts.
- Evidence: related-boundary summary and findings DF-012.
- Target change:
  - Route references through stable, maintained index pages.
  - Mark provenance references explicitly as historical context.
- Validation command(s):
  - `cat .agent/plans/developer-experience/governance/docs-deep-review-2026-02-25/output/related-boundary-summary.tsv`

## S3 (Backlog)

### RB-011 (DF-010) — Add explicit boundary ownership metadata

- Exact file(s): boundary entry docs (`docs/README.md` and boundary READMEs after reorganisation).
- Problem statement: boundary ownership is inferred, not explicit.
- Evidence: split orientation across root/data docs and absence of boundary metadata.
- Target change:
  - Add `BoundaryMetadata` frontmatter standard.
- Validation command(s):
  - `rg -n '^---$|boundary:|doc_role:|authority:' docs/**/*.md`

## Move-Plan Execution Packet

- Apply `output/move-proposals.tsv` in one cohesive change-set.
- Run automated path rewrites by old-prefix groups (`agent-guidance`, `data`, `development`, root foundation files).
- Rebuild root `docs/README.md` navigation after moves.
- Re-run link graph extraction and ensure missing-link count is reduced from baseline.
