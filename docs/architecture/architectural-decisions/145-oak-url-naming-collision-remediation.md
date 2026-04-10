# ADR-145: Oak URL Naming Collision Remediation

**Status**: Accepted
**Date**: 2026-04-01
**Supersedes**: [ADR-047](047-canonical-url-generation-at-codegen-time.md) (partially — naming and conditional injection; generation mechanism unchanged)
**Related**: [ADR-047](047-canonical-url-generation-at-codegen-time.md), [ADR-132](132-sitemap-scanner-for-canonical-url-validation.md), [ADR-030](030-sdk-single-source-truth.md), [ADR-108](108-sdk-workspace-decomposition.md)

## Context

The upstream Oak Curriculum API introduced two URL fields on
`LessonSummaryResponseSchema`:

- **`canonicalUrl`**: Context-rich curriculum URL encoding the full path
  (e.g. `https://www.thenational.academy/teachers/key-stages/ks2/subjects/maths/units/fractions-year-5/lessons/adding-fractions`)
- **`oakUrl`**: Direct slug-based URL
  (e.g. `https://www.thenational.academy/teachers/lessons/adding-fractions`)

The SDK already had its own concept of "canonical URL" — a simpler,
slug-based URL generated at codegen time (ADR-047). This SDK concept was
semantically identical to the upstream's `oakUrl`, not its `canonicalUrl`.
Three names for two concepts created a collision.

Five violations existed:

1. **Schema decorator overwrote upstream definitions** — the decorator
   unconditionally injected `canonicalUrl` fields, silently replacing
   upstream-provided definitions with different semantics.
2. **`format: "uri"` lost** — decorator-injected fields omitted the
   format annotation, producing `z.string()` instead of `z.url()` in
   generated Zod schemas.
3. **Naming collision** — the SDK's `canonicalUrl` and the upstream's
   `canonicalUrl` referred to different URL concepts.
4. **Stale ADR-047** — documented pre-collision assumptions about the
   `canonicalUrl` name without acknowledging the upstream conflict.
5. **Domain logic in search-CLI** — convenience URL functions lived in
   the app layer rather than the SDK, violating layer topology.

## Decision

1. **Rename**: Change the SDK concept from `canonicalUrl` to `oakUrl`,
   aligning with the upstream's naming for the same semantic concept
   (direct slug-based URL).

2. **Conditional injection**: Make the schema decorator skip injection
   when the upstream API already provides `oakUrl`, eliminating
   duplication and silent overwrites.

3. **Preserve `format: "uri"`**: Add `format: "uri"` to
   decorator-injected `oakUrl` fields so Zod codegen produces `z.url()`
   instead of `z.string()`.

4. **Relocate convenience URL functions**: Move from `oak-search-cli`
   to `oak-curriculum-sdk`, respecting the SDK-as-domain-logic boundary.

5. **Document the semantic distinction**: `oakUrl` = direct slug-based
   teacher URL; `canonicalUrl` = context-rich curriculum-path URL
   encoding programme, unit, key stage, and exam board.

## Rationale

- **Cardinal rule compliance** (ADR-029): types derive from the upstream
  schema, not from SDK-invented overrides.
- **Type preservation**: `format: "uri"` flows through to `z.url()`,
  maintaining strong URL typing in generated Zod schemas.
- **Naming consistency**: same semantic concept uses the same field name
  across upstream API and SDK.
- **Layer topology** (ADR-030, ADR-108): domain logic belongs in the
  SDK, not in consuming applications.

## Consequences

### Positive

- Type safety restored — `z.url()` instead of `z.string()` for URL
  fields injected by the decorator.
- Naming aligned — `oakUrl` means the same thing in both the upstream
  API and the SDK.
- No duplication — on schemas where the upstream provides `oakUrl`, the
  decorator no longer injects a redundant field.
- Domain logic correctly layered — convenience URL functions in the SDK,
  not scattered across apps.

### Negative

- **Breaking change** to SDK public API — function and field renames
  from `canonicalUrl` to `oakUrl` affect all consumers.
- **ES index field names may diverge** until a full re-index aligns
  existing documents with the new naming.

## Related ADRs

- [ADR-047: Canonical URL Generation at Code-Gen Time](047-canonical-url-generation-at-codegen-time.md) — partially superseded (naming and conditional injection updated; generation mechanism unchanged)
- [ADR-132: Sitemap Scanner for Canonical URL Validation](132-sitemap-scanner-for-canonical-url-validation.md) — validates slug-based teacher URLs regardless of field name
- [ADR-030: SDK as Single Source of Truth](030-sdk-single-source-truth.md) — establishes SDK as authoritative source
- [ADR-108: SDK Workspace Decomposition](108-sdk-workspace-decomposition.md) — workspace boundary that URL functions now respect
