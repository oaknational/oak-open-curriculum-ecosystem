# Reference

Supporting reference material for AI agents and developers.

## Where this fits

| Need | Location |
| ---- | -------- |
| **Shared, long-lived reference** (not a natural fit for ADRs or `docs/`) | This directory — `.agent/reference/` |
| **Investigations and evidence** | [`.agent/analysis/`](../analysis/README.md) — authoritative investigation/evidence lane |
| **Promoted audits and syntheses** | [`.agent/reports/`](../reports/README.md) — stable formal reports once promoted |
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
| `agentic-engineering/README.md` | Agentic-engineering concept hub and deep-dive launch point |
| `agentic-engineering/workbench-agent-operating-topology.md` | Operating-model note for editor-resident agent collaboration |
| `prog-frame/agentic-engineering-practice.md` | Agentic engineering practice framework |
| `cross-platform-agent-surface-matrix.md` | Local contract for supported and unsupported adapter and hook surfaces |
| `platform-adapter-formats.md` | Detailed platform adapter format reference |
| `history-of-the-practice.md` | Living record of how the Practice emerged, grew, and evolved |

Material that must never be committed belongs outside tracked paths (for
example outside the clone, or an ignored directory you create locally — see
root [`.gitignore`](../../.gitignore) for the conventional ignored path).
