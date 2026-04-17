# Generator-First Mindset

Operationalises [ADR-029 (No Manual API Data Structures)](../../docs/architecture/architectural-decisions/029-no-manual-api-data.md), [ADR-030 (SDK as Single Source of Truth)](../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md), [ADR-031 (Generation-Time Extraction)](../../docs/architecture/architectural-decisions/031-generation-time-extraction.md), and [ADR-038 (Compilation Time Revolution)](../../docs/architecture/architectural-decisions/038-compilation-time-revolution.md).

Every byte of runtime behaviour for MCP tool execution must be driven by generated artefacts from the OpenAPI schema. When behaviour needs to change, update the generator templates and rerun `pnpm sdk-codegen`. The generator is the single source of truth. Missing data is a generator bug — fail fast.

See `.agent/directives/schema-first-execution.md` for the full policy.
