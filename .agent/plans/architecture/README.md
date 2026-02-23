# Architecture

Cross-cutting architecture, system quality, and observability plans.

**Status**: 📋 Planned
**Last Updated**: 2026-02-23

---

## Documents

| File | Milestone | Description |
|------|-----------|-------------|
| `stdio-http-server-alignment.md` | M1 | Align STDIO and HTTP server configuration and behaviour |
| `config-architecture-standardisation-plan.md` | M1 | Unified config DI pattern via `@oaknational/mcp-config` |
| `no-console-enforcement.plan.md` | M1 | Replace ~110 `console.*` calls with structured logger |
| `observability-and-quality-metrics.plan.md` | M3 | Structured logging, monitoring, alerting, quality dashboards |

## Milestone Alignment

- **Milestone 1** (post-merge, pre-alpha): server alignment,
  config standardisation, no-console enforcement
- **Milestone 3** (pre-beta): observability and quality metrics

See [high-level-plan.md](../high-level-plan.md) for the strategic
overview.

## History

This collection was formed on 2026-02-23 by merging the former
`architecture/` and `quality-and-maintainability/` directories.
Completed plans were archived to `archive/completed/`, speculative
plans were moved to `icebox/`, and ESLint plans were consolidated
into `agentic-engineering-enhancements/`.
