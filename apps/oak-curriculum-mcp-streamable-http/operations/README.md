# Operations

This directory contains workspace-owned operational tooling for
`@oaknational/oak-curriculum-mcp-streamable-http`. Code here follows the same
quality standards as `src/`.

## Purpose

Operations code exists for development and operational workflows that are too
substantial for ad hoc shell scripts. It is the right home for orchestration,
validation, and environment-specific execution paths that belong to this
workspace but are not part of the HTTP runtime itself.

## Current Areas

```text
operations/
└── development/   # HTTP dev-server orchestration and supporting helpers
```

## Standards

- TypeScript only
- Same lint, type-checking, and architectural standards as `src/`
- Unit tests for non-trivial logic
- No second source of truth for runtime contracts
- Keep operational orchestration here, not in `scripts/`
