---
paths:
  - '**/*.{ts,tsx,mts}'
---

# Generator-First Mindset

Every byte of runtime behaviour for MCP tool execution must be driven by generated artefacts from the OpenAPI schema.
Update generator templates and rerun `pnpm sdk-codegen`. Missing data is a generator bug — fail fast.

See `.agent/directives/schema-first-execution.md` for the full policy.
