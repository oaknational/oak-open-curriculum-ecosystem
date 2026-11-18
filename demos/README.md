# Demos

Demonstration applications that prove this repository's capabilities end to end —
real SDKs, real data planes, real design fidelity — packaged as runnable web apps.

`demos/` is a **first-class workspace tier** (owner-ratified 2026-07-01): demo code
is held to the same engineering standards as `apps/` and `packages/` — strict
TypeScript, the full shared ESLint ruleset, TDD, and WCAG 2.2 AA. The root gate
configs (`knip.config.ts`, `.prettierignore`, `.markdownlint-cli2.jsonc`, the
depcruise scripts) are authoritative for the current gate footprint over this
tier; the productionisation roadmap is owned by
[`productionisation-and-reuse.plan.md`](../.agent/plans-backlog-2026-07/curriculum-hub-demo/current/productionisation-and-reuse.plan.md).

## Dependency boundary

The dependency arrow points one way: demos consume workspace packages
(`workspace:*`) like any app, and **nothing in `apps/` or `packages/` may ever
depend on anything in `demos/`**. A demo is a consumer at the edge of the
dependency graph, never a library.

## Projects

- [`oak-curriculum-hub/`](oak-curriculum-hub/README.md) — **Oak Curriculum Hub**:
  an Oak-styled web UI over the live curriculum search stack (Elasticsearch
  Serverless via `oak-search-sdk`) and content stack (Open Curriculum REST API
  via `oak-curriculum-sdk`), built as a full-fidelity reproduction of a Claude
  Design export. Demo by Heather W. The workspace folder is the demo: app code,
  evidence tooling (`tools/`), and untracked vendor reference material (the
  canonical export and token sources — see its `.gitignore` for the rationale
  and its README for how to re-obtain them via the claude-design MCP).
- [`oak-design-showcase/`](oak-design-showcase/README.md) — **Oak Design
  Showcase**: the design system's public face — a front page plus demo
  routes (the identity/theme switching demo with its framed specimen, the
  side-by-side white-labelling view, the composition demonstration, and the
  generated token reference at `/tokens` with its `/tokens/colours`
  matrix) —
  consuming the kit the plain-CSS way: the aggregate stylesheet and the
  kit's own classes, tokens, and self-hosted fonts, with no Tailwind and no
  mapping layer. The plain-path counterpart to the hub's Tailwind-mapped
  consumption; every visible difference between identities and themes is
  the token contract at work.

## Licences

No demo carries a separate licence; the repository's root terms are
authoritative:

- **Code** — [`LICENCE`](../LICENCE) (MIT).
- **Oak curriculum content** (live search and lesson data, quality-standards
  data) — [`LICENCE-DATA.md`](../LICENCE-DATA.md) (Open Government Licence
  v3.0, attribution required).
- **Oak brand assets** (fonts, logos, design kit) — MIT covers source code
  only and grants no trademark or brand rights; this is Oak's own repository,
  so no separate grant is made or needed.
