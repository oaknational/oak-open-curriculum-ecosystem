---
title: "pnpm Strict Hoisting Blocks Transitive Type Resolution"
category: build-system
barrier_met: true
source_sessions: ["2026-04-14d"]
---

# pnpm Strict Hoisting Blocks Transitive Type Resolution

## Pattern

In a pnpm monorepo with strict hoisting, a file at repo root
that imports types from a package (e.g. `import type { Plugin }
from 'esbuild'`) will fail type-check if that package is only
a transitive dependency (e.g. esbuild is a dep of tsup, but
not listed in root `package.json`).

## Anti-pattern

Assuming that because a package is installed (as a transitive
dep) its types are available everywhere. In pnpm, only direct
dependencies of a workspace are accessible from that
workspace's module resolution scope.

## Application

When creating shared config files at repo root that import
from tooling packages:

1. Either add the package as a direct root devDependency
2. Or avoid the import and use inline typing / callback-based
   approaches where the parent package provides the types

The second option is preferable when the type surface is small
(e.g. an esbuild plugin shape) — it avoids adding a
dependency just for types.

## Evidence

`tsup.config.base.ts` at repo root imported
`type { Plugin } from 'esbuild'`. Type-check failed across
all 17 workspaces. Fix: inlined the plugin definition in the
`esbuildOptions` callback (typed by tsup itself), and added
`tsup` as a root devDependency for `defineConfig`/`Options`.
