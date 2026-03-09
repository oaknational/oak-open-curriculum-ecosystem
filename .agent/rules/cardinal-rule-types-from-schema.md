# Cardinal Rule: Types Flow From The Schema

ALL types, type guards, Zod schemas, and validators MUST flow from the Open Curriculum OpenAPI schema via `pnpm sdk-codegen`. No ad-hoc types. No broad `Record<string, unknown>`. If a type is missing, it is a generator bug — fix the generator, not the consumer.

Running `pnpm sdk-codegen` followed by `pnpm build` MUST be sufficient to bring all workspaces into alignment with any upstream schema change.

See `.agent/directives/principles.md` §Cardinal Rule and `.agent/directives/schema-first-execution.md` for the full policy.
