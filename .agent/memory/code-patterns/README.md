# Code and Process Patterns

Abstract, reusable patterns proven by real implementation. Each pattern captures a principle that is too concrete for a rule but too abstract for source code. This includes both **code patterns** (how to structure implementations) and **process patterns** (how to approach engineering decisions).

## Barrier to Entry

A pattern is admitted only when **all four criteria** are met:

| Criterion | Meaning |
|---|---|
| **Broadly applicable** | Not domain-specific; applies across codebases |
| **Proven by implementation** | Backed by real shipped code, not theoretical |
| **Prevents a recurring mistake** | Addresses a problem that has occurred more than once |
| **Stable** | Not expected to change soon |

## Frontmatter Schema

Every pattern file has YAML frontmatter:

```yaml
---
name: "Human-readable pattern name"
use_this_when: "One sentence: the situation where this pattern applies"
category: type-safety | validation | architecture | testing | error-handling | process
proven_in: "file path where pattern was first applied or proven"
proven_date: YYYY-MM-DD
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "What mistake this prevents"
  stable: true
---
```

The `use_this_when` field is the primary discovery mechanism. It describes the moment an engineer should think "I have seen this before."

## How Patterns Differ from Rules

**Rules** (in [`principles.md`](../../directives/principles.md)) are principles: "never use type-erasing `as`". **Patterns** are "how to implement the principle": replace the `as` cast with a const map lookup. Rules say what; patterns say how.

## How Patterns Differ from Source Code

**Source code** is concrete: a specific const map for specific HTTP status codes. **Patterns** are abstract: the principle of using const maps to replace runtime conversions that mirror compile-time type transformations. Patterns describe the shape of the solution, not the domain-specific implementation.

## Pattern Index

- **Const Map as Type Guard** -- Use this when: a runtime conversion mirrors a compile-time type transformation and all possible values are known at generation or build time. → [const-map-as-type-guard.md](const-map-as-type-guard.md)
- **Unknown Until Validated** -- Use this when: a function produces data whose type cannot be statically verified and a validation boundary exists downstream. → [unknown-until-validated.md](unknown-until-validated.md)
- **Validation Error Severity Separation** -- Use this when: a schema validation error message lists all absent fields alongside actually failing fields, making operators debug the wrong variables. → [validation-error-severity-separation.md](validation-error-severity-separation.md)
- **Multi-Layer Schema Synchronisation** -- Use this when: a code generator produces multiple schema representations (JSON schema, Zod, transforms) from a single source and a change to input handling must be reflected across all layers. → [multi-layer-schema-sync.md](multi-layer-schema-sync.md)
- **Interface Segregation for Test Fakes** -- Use this when: test fakes cannot satisfy a complex generated type without type assertions. → [interface-segregation-for-test-fakes.md](interface-segregation-for-test-fakes.md)
- **Drift Detection Test** -- Use this when: a manually maintained list should match a canonical source but cannot be derived, or repo-state drift needs detecting between maintained copies and canonical sources. → [drift-detection-test.md](drift-detection-test.md)
- **Template Literal Derived Union with Builder** -- Use this when: a string union type is the cross-product of two smaller unions joined by a separator, and code constructs members at runtime via template literals. → [template-literal-derived-union.md](template-literal-derived-union.md)
- **Preprocess for Type-Preserving Coercion** -- Use this when: a Zod schema needs to accept multiple input types but preserve a narrow output type, and z.union with .transform() would widen the output. → [preprocess-for-type-preserving-coercion.md](preprocess-for-type-preserving-coercion.md)
- **satisfies for Mock Completeness** -- Use this when: a test mock implements an interface and you need compile-time proof that all methods are present. → [satisfies-for-mock-completeness.md](satisfies-for-mock-completeness.md)
- **Explicit Missing Resource State** -- Use this when: a numeric or boolean value can mask a missing upstream resource and create fail-open behaviour. → [explicit-missing-resource-state.md](explicit-missing-resource-state.md)
- **CLI Flag Over Env Precedence** -- Use this when: CLI commands support both flags and env defaults for the same value, and hidden defaults or command drift have caused ambiguity. → [cli-flag-env-precedence.md](cli-flag-env-precedence.md)
- **Library Types Before Local Shapes** -- Use this when: An integration parses third-party SDK responses or errors and custom local `*Like` shapes are being considered. → [library-types-before-local-shapes.md](library-types-before-local-shapes.md)
- **SDK-Owned Retriever Delegation** -- Use this when: an app-layer module builds an Elasticsearch retriever shape that the SDK already owns as a shared capability. → [sdk-owned-retriever-delegation.md](sdk-owned-retriever-delegation.md)
- **Agentic Surface Separation** -- Use this when: designing or refactoring agent infrastructure that spans skills, rules, commands, subagents, or platform adapters. → [agentic-surface-separation.md](agentic-surface-separation.md)
- **README as Index** -- Use this when: a plan-directory README is growing to contain session instructions, outcome narratives, or design rationale that duplicates or replaces .plan.md content. → [readme-as-index.md](readme-as-index.md)
- **Current Plan Promotion** -- Use this when: a review or planning pass has resolved "what comes next" and the repo needs a concrete next-session entry point rather than a mere intended future direction. → [current-plan-promotion.md](current-plan-promotion.md)
- **Conformance Tests for Library Adoption** -- Use this when: replacing hand-rolled code with a library import and keeping existing unit tests as library contract guards. → [conformance-tests-for-library-adoption.md](conformance-tests-for-library-adoption.md)
- **Source-First Adopt-or-Explain Evaluation** -- Use this when: evaluating whether an existing dependency's utilities should replace hand-rolled code. → [source-first-adopt-or-explain.md](source-first-adopt-or-explain.md)
- **Additive-Only Schema Decoration** -- Use this when: a decorator or enrichment pass modifies a third-party schema and must not overwrite properties that the upstream source already defines. → [additive-only-schema-decoration.md](additive-only-schema-decoration.md)
- **Check Driven Development** -- Use this when: writing TDD RED-phase assertions in a codebase with multiple quality gates. → [check-driven-development.md](check-driven-development.md)
- **Explicit DI Over Ambient State** -- Use this when: you are tempted to use AsyncLocalStorage, module-level singletons, or thread-local context to propagate request-scoped data through a call chain. → [explicit-di-over-ambient-state.md](explicit-di-over-ambient-state.md)
- **Generic Factory for DI Composition** -- Use this when: a DI interface exposes multiple factory functions that callers always compose in the same order. → [generic-factory-for-di-composition.md](generic-factory-for-di-composition.md)
- **Guarded Fire-and-Forget Cleanup** -- Use this when: you have async cleanup (close, flush, disconnect) that runs after the response is sent and cannot be awaited by the caller. → [guarded-fire-and-forget-cleanup.md](guarded-fire-and-forget-cleanup.md)
- **Indexed-Access Sub-Type Derivation** -- Use this when: you need to process elements of a generated union type and the existing code uses hand-rolled local types that approximate the schema. → [indexed-access-subtype-derivation.md](indexed-access-subtype-derivation.md)
- **Infrastructure Never Masks Business** -- Use this when: recording telemetry, flushing buffers, or ending spans in a catch/finally block. → [infrastructure-never-masks-business.md](infrastructure-never-masks-business.md)
- **JSON Loader for Large Datasets** -- Use this when: a generated dataset exceeds TypeScript's max-lines threshold or literal-type serialisation limits. → [json-loader-for-large-datasets.md](json-loader-for-large-datasets.md)
- **Narrow Re-Exports at Boundaries** -- Use this when: a wrapper library re-exports types from an underlying SDK. → [narrow-re-exports-at-boundaries.md](narrow-re-exports-at-boundaries.md)
- **Pure Leaf Module Extraction** -- Use this when: pure functions and I/O functions coexist in a module, and other modules need only the pure functions. → [pure-leaf-extraction.md](pure-leaf-extraction.md)
- **Rate-Limit Upstream Amplification Vectors** -- Use this when: a route produces an upstream request (API call, redirect, proxy fetch) as a side effect of handling an inbound request. → [rate-limit-upstream-amplification-vectors.md](rate-limit-upstream-amplification-vectors.md)
