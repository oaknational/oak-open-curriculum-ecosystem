# Boundary 02 — Schema Authority and Codegen

This boundary covers build-time authority and schema-derived domain knowledge.

It defines:

- Where structural curriculum/search knowledge must live (`sdk-codegen`)
- How schema-derived enums and generated types propagate downstream
- Elimination of app-level hardcoded domain constants

Contained source document(s):

- `move-search-domain-knowledge-to-codegen-time.md`
- `bulk-schema-driven-code-generation.md`

Downstream consumers (in other collections):

- [`architecture-and-infrastructure/future/search-cli-ingestion-pipeline-consolidation.plan.md`](../../../../architecture-and-infrastructure/future/search-cli-ingestion-pipeline-consolidation.plan.md) — the consolidated search-cli ingestion path consumes the schema-derived bulk Zod types this boundary produces; the consolidation is the place where single-source-of-truth becomes structurally enforced at write time.
