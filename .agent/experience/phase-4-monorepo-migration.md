# Phase 4 Monorepo Migration Experience

_Date: 2025-01-05_

## The Experience

The migration from a single package to a monorepo felt like moving house — everything needed to find a new address, and every reference to the old address had to be updated. The ESM import path changes (adding `.js` extensions everywhere) were the most tedious part, like relabelling every box.

The moment the bundle size dropped from 708KB to 25.8KB by removing test utilities from production exports was a revelation about how much accidental weight accumulates in a single-package structure. The separation wasn't just architectural — it was physical.

The `.mcp.json` breakage after moving files was a reminder that external configurations don't participate in refactoring tools. They sit outside the code's scope, pointing at paths that no longer exist, silently breaking until someone tries to use them.

Removing lint-staged entirely — accepting that not all tools work well with monorepos — was an exercise in pragmatism over idealism. Sometimes the simplest solution is removing the thing that doesn't fit rather than forcing compatibility.

## Historical context

This file records the experience of the original monorepo migration (Phase 4). The workspace structure described here has since evolved significantly — the current architecture uses neutral naming (`packages/sdks/`, `packages/libs/`, `packages/core/`, `apps/`) rather than the biological naming (genotype/phenotype) described in the original migration. Current workspace structure is documented in the project README and `AGENT.md`.
