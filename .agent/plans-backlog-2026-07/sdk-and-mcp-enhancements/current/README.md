# Current Plans — SDK and MCP Enhancements

Executable plans queued or ready to resume.

| Plan | Scope | Status / Blocked By |
|---|---|---|
| [mcp-tool-taxonomy-and-orientation.plan.md](mcp-tool-taxonomy-and-orientation.plan.md) | Architectural review of the MCP stack (full SDK→MCP lifecycle) + make orientation a first-class **constructed** tool under the owner's two-type model (API-passthrough vs constructed), dissolving registry/discoverability separation while keeping the content firewall; resolve the tool-listing SSOT/drift across the three hand-authored surfaces | DECISION-INCOMPLETE — owner-directed 2026-06-28 (Clover); WS0 (deep architectural review) is read-only and **not started** (owner deferred the deep exploration); implementation gated on the owner design decision after WS0. Successor to the DONE [oak-under-the-hood.plan.md](../active/oak-under-the-hood.plan.md) discoverability follow-on |
| [under-the-hood-mcp-discovery-pointer.plan.md](under-the-hood-mcp-discovery-pointer.plan.md) | One pointer sentence on the MCP discovery surface (the server instructions) directing non-curriculum / mechanism / MCP-app / repo questions to `oak-under-the-hood` — the curriculum↔orientation over-separation hid it | CURRENT — owner-directed 2026-06-28 (sticking-plaster); precursor to [mcp-tool-taxonomy-and-orientation.plan.md](mcp-tool-taxonomy-and-orientation.plan.md); part of the upcoming team session |
| [mcp-prompt-grouping-taxonomy.plan.md](mcp-prompt-grouping-taxonomy.plan.md) | Group the seven MCP prompts by teacher job-to-be-done (curriculum planning / lesson planning / resource adaptation seed groups; planning-moment axis explicit) via a spec-legal, client-rendering-verified vehicle; align ADR-123 and outward-facing claims to the same vocabulary; surface empty-cell roadmap candidates | QUEUED — owner-directed 2026-06-12; WS2 taxonomy ratification is the owner gate |
| [schema-change-minimal-adaptation.plan.md](schema-change-minimal-adaptation.plan.md) | Drive hand-adaptation cost of upstream schema changes (OpenAPI AND bulk schema) to the irreducible minimum: two-tier Cardinal Rule ADR, generated tool-mapping doc, inventory-iterating fixtures, codegen path classification, schema-derived sandbox fixtures, API-boundary lint, typed sequence-units rethreading | Owner-directed 2026-06-03 from the sequences-realignment evidence; bulk half gated on promoting [bulk-schema-driven-code-generation](../../semantic-search/future/02-schema-authority-and-codegen/bulk-schema-driven-code-generation.md) |
| [canonical-url-enforcement.plan.md](canonical-url-enforcement.plan.md) | Promote URL validation from warn-only to configurable gate; validate URLs in ingestion pipeline before ES storage | Queued; dependency on naming collision remediation satisfied (archived (`../../../plans-old-archive/sdk-and-mcp-enhancements/archive/completed/url-naming-collision-remediation.plan.md`), ADR-145) |
| `../archive/superseded/output-schemas-for-mcp-tools.plan.md` | June design record — single-envelope doctrine falsified against the served wire 2026-08-19 (three envelope shapes exist) | ⛔ SUPERSEDED + ARCHIVED — owning plans: [mcp-output-contracts](../../../plans/strategic/mcp-output-contracts.plan.md) (strategic) + `mcp-served-surface-truth` / `mcp-output-contracts-implementation` (delivery, `.agent/plans/delivery/`) |
| [download-asset-user-only-url.plan.md](download-asset-user-only-url.plan.md) | Move `download-asset` signed URLs out of model-visible MCP result fields and into MCP App `_meta` for user-only downloads | Queued; should run before output-schema work finalises the `download-asset` contract |
| [oak-preview-mcp-snagging-2026-04-23.plan.md](oak-preview-mcp-snagging-2026-04-23.plan.md) | In-repo findings from black-box preview MCP validation: `explore-topic` relevance tuning, KS3-science questions empty-response investigation, consistent MCP-side response surface for empty / no-match / unsupported / failure, and suggest-scope URL population in oak-search-sdk (WS5; reconfirmed 2026-05-25) | Queued; complements the upstream issue reports under [`../../sector-engagement/ooc-issues/`](../../sector-engagement/ooc-issues/) |
| [oak-prod-mcp-snagging-2026-06-11.plan.md](oak-prod-mcp-snagging-2026-06-11.plan.md) | Findings from the 2026-06-11 live oak-prod MCP exercise: `get-eef-evidence` structuredContent-only client-visibility (S0 client probe → owner decision), keyword description leakage, corpus typo routing, keyword-limit schema bounds, prompt-UX observation | OPEN; write-up-first per owner; self-contained evidence in [`oak-prod-mcp-cursor-visibility-writeup-2026-06-11.md`](../../../reports/oak-prod-mcp-cursor-visibility-writeup-2026-06-11.md) |
| [user-search-not-exposed-until-built.plan.md](user-search-not-exposed-until-built.plan.md) | The unbuilt user-search MCP App tools (`user-search` + `user-search-query`) are registered unconditionally, so they appear in `tools/list` for an app experience not built yet. Gate both behind an opt-in feature flag (default OFF, EEF pattern) until the feature ships | QUEUED — owner-flagged 2026-06-23 during the self-description-fidelity session; independent; not started |

Completed, awaiting archive:

- [upstream-sequences-api-realignment.plan.md](upstream-sequences-api-realignment.plan.md) —
  COMPLETE (2026-06-03, commit `c924d4b3`). All three todos executed: full-diff
  evidence, owner-approved verdict (bulk-only NOT yet possible), API surface
  shrunk 2 → 1 endpoints, all gates green incl. online `pnpm check`. Its
  follow-up items are owned by
  [schema-change-minimal-adaptation.plan.md](schema-change-minimal-adaptation.plan.md).
- [clerk-mcp-tools-and-ext-apps-bumps.plan.md](clerk-mcp-tools-and-ext-apps-bumps.plan.md) —
  COMPLETE. Clerk/MCP dependency targets are landed; 2026-06-02 refresh leaves
  `pnpm -r outdated` clean.
- [ws3-oak-url-augmentable-codegen-fix.plan.md](ws3-oak-url-augmentable-codegen-fix.plan.md) —
  COMPLETE. Schema-derived GET response union, ADR-153, quality gates passed.
- [ws3-contrast-validation-prerequisite.plan.md](ws3-contrast-validation-prerequisite.plan.md) —
  COMPLETE. WCAG contrast validation and blocking token fixes landed.

Recently completed and archived:

- ws3-design-token-prerequisite.plan.md (`../../../plans-old-archive/sdk-and-mcp-enhancements/archive/completed/ws3-design-token-prerequisite.plan.md`) —
  canonical token foundation and shared shell complete on 2 April 2026
- url-generation-cleanup.plan.md (`../../../plans-old-archive/sdk-and-mcp-enhancements/archive/completed/url-generation-cleanup.plan.md`) —
  retired `generateOakUrl`, made `sequenceSlug`/`unitUrl` type-safe (2026-04-01)
- auth-boundary-type-safety.plan.md (`../../../plans-old-archive/sdk-and-mcp-enhancements/archive/completed/auth-boundary-type-safety.plan.md`) —
  complete (2026-03-31)
- auth-safety-correction.plan.md (`../../../plans-old-archive/sdk-and-mcp-enhancements/archive/completed/auth-safety-correction.plan.md`) —
  complete (commit `e6574b5a`, 2026-03-31)
- mcp-runtime-boundary-simplification.plan.md (`../../../plans-old-archive/sdk-and-mcp-enhancements/archive/completed/mcp-runtime-boundary-simplification.plan.md`) —
  complete and archived
- graph-data-integrity-snagging.execution.plan.md (`../../../plans-old-archive/sdk-and-mcp-enhancements/archive/completed/graph-data-integrity-snagging.execution.plan.md`) —
  graph integrity defects classified and resolved
- search-tool-text-to-query-rename.plan.md (`../../../plans-old-archive/sdk-and-mcp-enhancements/archive/completed/search-tool-text-to-query-rename.plan.md`) —
  full-stack `text` → `query` rename complete

Active work: [active/README.md](../active/README.md)
Later backlog: [future/README.md](../future/README.md)
Collection roadmap: [roadmap.md](../roadmap.md)
