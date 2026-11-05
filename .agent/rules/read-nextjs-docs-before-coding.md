---
classification: situational
description: "Any Next.js work in a workspace depending on next — routes, layouts, server/client components, proxy.ts, next.config.*, rendering/caching, or debugging Next behaviour: before coding, read the relevant vendored doc under the consuming workspace's own node_modules/next/dist/docs/ (never the repo root's — pnpm resolves per workspace), and cite it when a Next design choice is load-bearing. The vendored docs match the installed version; recall is stale. Not for workspaces without next. Failure shape: Next 16 renamed middleware.ts to proxy.ts — a plan wired from recall targets the wrong file."
trigger: surface:nextjs — Next.js work (routes, layouts, proxy, config, rendering/caching)
globs:
  - "**/next.config.*"
  - "**/proxy.ts"
---

# Read Next.js Docs Before Coding

Owner-directed (2026-07-02). Training-data knowledge of Next.js is stale by
construction — the framework moves faster than any model cutoff, and the
installed package ships its own documentation. The vendored docs are the
source of truth for the version actually running; where recall and the
vendored docs disagree, the docs win.

## Trigger

Any Next.js work in any workspace that depends on `next`: authoring or
modifying routes, layouts, server/client components, `proxy.ts` (the Next 16
successor to `middleware.ts`), `next.config.*`, rendering/caching behaviour,
or debugging Next-specific behaviour.

## Action

Before coding, find and read the relevant doc under the **consuming
workspace's** `node_modules/next/dist/docs/` — pnpm resolves per workspace,
so the path is the workspace's own `node_modules`, never the repo root's
(for example `<workspace>/node_modules/next/dist/docs/`).
Layout: `01-app/` is the App Router (the default in both Practice estates), `02-pages/` the
legacy Pages Router, `03-architecture/` the internals; start from `index.md`
when unsure.

Worked instance (OCE): Next 16 renamed `middleware.ts` to
`proxy.ts`; earlier in-tree research predated the rename, so a plan built on
training-data recall would have wired the wrong file — caught only because the
live docs were checked. jimcresswell.net's content-negotiation proxy (its
ADR-009) is exactly such a file.

## Related Surfaces

- [`verify-vendor-call-shapes-at-plan-author-time`](verify-vendor-call-shapes-at-plan-author-time.md)
  — the plan-time sibling for all vendors; this rule is the coding-time
  discipline for Next.js specifically, with the vendored docs as the named
  source.
- Platform Next.js helpers (the `vercel:nextjs` skill, the `next-devtools`
  MCP `nextjs_docs` tool) are supplements where available — the vendored
  docs remain authoritative because they match the installed version
  exactly.

## Enforcement

Behavioural at the coding moment: the discipline is reading the vendored doc
before the first Next-touching edit, and citing it (path or section) when a
Next.js design choice is load-bearing in a review or plan.
