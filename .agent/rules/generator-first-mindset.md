# Generator-First Mindset

Every byte of runtime behaviour for MCP tool execution must be driven by generated artefacts from the OpenAPI schema. When behaviour needs to change, update the generator templates and rerun `pnpm sdk-codegen`. The generator is the single source of truth. Missing data is a generator bug — fail fast.

See `.agent/directives/schema-first-execution.md` for the full policy.
