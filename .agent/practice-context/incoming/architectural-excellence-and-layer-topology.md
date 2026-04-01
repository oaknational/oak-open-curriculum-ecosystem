# Architectural Excellence and Layer Role Topology

**Origin**: oak-open-curriculum-ecosystem, 2026-03-23
**Status**: Proven — validated by the CLI-SDK retriever drift incident,
endorsed independently by 4 architecture reviewers

## Two Principles, One Incident

These principles were discovered through the same incident but address
different failure modes. Both are now in the portable Practice Core
(practice-lineage.md §Principles and §Learned Principles, Active tier).

### Architectural Excellence Over Expediency

> Always choose long-term architectural clarity over short-term
> convenience. If a shortcut creates duplication across architectural
> layers, it is not a shortcut — it is debt that compounds silently
> through drift.

**The incident**: The search CLI duplicated retriever-building logic from
the SDK. Over time, the SDK was tuned (fuzziness `AUTO` → `AUTO:6,9`)
but the CLI copy was not. The same query produced different search results
depending on which code path was used. The drift was invisible until
four architecture reviewers independently flagged the boundary violation
during a routine pre-reingest review.

**The fix**: ~500 lines of duplicated CLI code deleted. All retriever
shapes delegated to the SDK across 4 scopes. 12 files removed.

### Apps Are Thin; Libraries Own Domain Logic

> In a multi-package architecture, apps are user interfaces that compose
> library/SDK capabilities. Apps never reimplement domain logic that a
> library already provides. The test: "could another consumer need this?"
> If yes, it belongs in a shared package.

**Why it's separate**: "Architectural excellence" is about not taking
shortcuts. "Apps are thin" is the specific structural rule that prevents
the most common form of the shortcut: copying domain logic into an app
because it's faster than extending the library's API surface.

## Always-Applied Rule Form

Both principles should appear in §Always-Applied Rules in
practice-lineage.md:

- Apps are thin interfaces; never duplicate domain logic from libraries/SDKs
- Architectural excellence over expediency — no cross-layer shortcuts

## Why Active Tier, Not Axiom

As of 2026-03-23, these have been validated in 1 repo only
(oak-mcp-ecosystem). Promotion to axiom tier requires validation across
3+ repos. The teaching narrative (the incident description) is still
valuable for receiving repos to understand *why* these matter.

## Applicability

- **Multi-package repos** (monorepos, SDK + app architectures): directly
  applicable. The "could another consumer need this?" test is the
  diagnostic.
- **Single-package repos**: the "architectural excellence" principle still
  applies (don't take shortcuts that create hidden duplication), but the
  "apps are thin" rule is less relevant without a package boundary.
- **Research repos**: the principle applies when shared capability work
  (data processing, validation, diagnostics) is duplicated across
  experiment lanes rather than centralised.
