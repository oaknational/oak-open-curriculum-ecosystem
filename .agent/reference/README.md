# Reference

Supporting reference material for AI agents and developers.

## Where this fits

| Need | Location |
| ---- | -------- |
| **Shared, long-lived reference** (not a natural fit for ADRs or `docs/`) | This directory — `.agent/reference/` |
| **Local-only** (imports, scraps, not for checkout) | [`.agent/reference-local/`](../reference-local/README.md) |
| **Generated SDK validation data** (sitemap-derived maps) | [`packages/sdks/oak-sdk-codegen/reference/`](../../packages/sdks/oak-sdk-codegen/reference/README.md) — JSON outputs are git-ignored; see that README |
| **Durable findings and investigations** | [`.agent/research/`](../research/README.md) |
| **DX external report recovery until promoted** | [`.agent/research/developer-experience/novel/`](../research/developer-experience/novel/README.md) |

## Architecture

| File | Purpose |
| ---- | ------- |
| `architecture/boundary-enforcement-with-eslint.md` | ESLint-based boundary enforcement patterns |

## Complex Systems Dynamics

| File | Purpose |
| ---- | ------- |
| `complex-systems-dynamics/emergent_stability_summary.md` | Emergent stability summary |
| `complex-systems-dynamics/dynamic-stability-in-complex-systems.md` | Dynamic stability research |
| `complex-systems-dynamics/complex-system-dynamics-multi-field-review.md` | Multi-field review |

## UI

| File | Purpose |
| ---- | ------- |
| `ui/styled-components-in-nextjs.md` | Styled-components patterns for Next.js |
| `ui/sprite.svg` | SVG sprite asset |
| `ui/inline-sprite.svg` | Inline SVG sprite asset |

## Internal

| File | Purpose |
| ---- | ------- |
| `internal/agent-support-tools-specification.md` | Agent support tools specification |

## Agentic Engineering

| File | Purpose |
| ---- | ------- |
| `prog-frame/agentic-engineering-practice.md` | Agentic engineering practice framework |
| `cross-platform-agent-surface-matrix.md` | Local contract for supported and unsupported adapter and hook surfaces |
| `history-of-the-practice.md` | Living record of how the Practice emerged, grew, and evolved |

The `scratch/` subdirectory may contain a mix of tracked notes from earlier
workflows; **new** material that must stay out of git belongs in
[`.agent/reference-local/`](../reference-local/README.md).
