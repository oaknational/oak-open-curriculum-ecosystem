# Code Patterns

Abstract, reusable patterns proven by real implementation. Each pattern captures a principle that is too concrete for a rule but too abstract for source code.

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
category: type-safety | validation | architecture | testing | error-handling
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

**Rules** (in `.agent/directives/rules.md`) are principles: "never use `as`". **Patterns** are "how to implement the principle": replace the `as` cast with a const map lookup. Rules say what; patterns say how.

## How Patterns Differ from Source Code

**Source code** is concrete: a specific const map for specific HTTP status codes. **Patterns** are abstract: the principle of using const maps to replace runtime conversions that mirror compile-time type transformations. Patterns describe the shape of the solution, not the domain-specific implementation.

## Pattern Index

- **Const Map as Type Guard** -- Use this when: a runtime conversion mirrors a compile-time type transformation and all possible values are known at generation or build time. → [const-map-as-type-guard.md](const-map-as-type-guard.md)
- **Unknown Until Validated** -- Use this when: a function produces data whose type cannot be statically verified and a validation boundary exists downstream. → [unknown-until-validated.md](unknown-until-validated.md)
- **Validation Error Severity Separation** -- Use this when: a schema validation error message lists all absent fields alongside actually failing fields, making operators debug the wrong variables. → [validation-error-severity-separation.md](validation-error-severity-separation.md)
- **Multi-Layer Schema Synchronisation** -- Use this when: a code generator produces multiple schema representations (JSON schema, Zod, transforms) from a single source and a change to input handling must be reflected across all layers. → [multi-layer-schema-sync.md](multi-layer-schema-sync.md)
- **Interface Segregation for Test Fakes** -- Use this when: test fakes cannot satisfy a complex generated type without type assertions. → [interface-segregation-for-test-fakes.md](interface-segregation-for-test-fakes.md)
