# Repo-Local Pattern Instances

Specific, ecosystem-grounded instances of engineering patterns
proven by real implementation in this repository. Each entry
captures a concrete pattern proven in a specific TypeScript/Zod/
Vitest/MCP context (or other specific ecosystem context present
here).

## Relationship to Practice Core

This directory holds **specific instances**. General, ecosystem-
agnostic abstractions live in `.agent/practice-core/patterns/` and
are authored through synthesis from multiple instances. Patterns
describing Practice-governance (review, planning, consolidation,
etc.) live as PDRs in `.agent/practice-core/decision-records/`.

An instance here may have a `related_pdr: PDR-NNN` or
`related_pattern: <name>` frontmatter pointer linking it to the
general form. The instance stays in place regardless: instance-
level proof continues to live at the repo level after general
abstraction is authored.

## Categories

Patterns span five categories:
**code** (implementation techniques), **architecture** (system
structure and boundaries), **process** (engineering workflows and
decision-making), **testing** (verification strategies), and
**agent** (agentic infrastructure design).

Note: Practice-governance patterns that were in this directory
before 2026-04-18 have been **absorbed as PDRs** (PDR-012 through
PDR-023) under the Core contract established by PDR-007. The
instance files remain here with `related_pdr` frontmatter pointing
at the general PDR form.

## Taxonomy

| Category | Scope | Examples |
|---|---|---|
| `code` | Implementation techniques: type-safety, validation, error handling, module structure | Const maps, boundary narrowing, DI patterns |
| `architecture` | System structure, boundaries, cross-cutting concerns | Schema sync, retriever delegation, rate limiting |
| `process` | Engineering workflows, decision-making, documentation practices | Check-driven development, plan promotion |
| `testing` | Verification strategies, test design, mock patterns | Interface segregation for fakes, conformance tests |
| `agent` | Agentic infrastructure: skills, rules, subagents, platform adapters | Surface separation, agent workflow design |

## Barrier to Entry

A pattern is admitted only when **all four criteria** are met:

| Criterion | Meaning |
|---|---|
| **Broadly applicable** | Not domain-specific; applies across codebases |
| **Proven by implementation** | Backed by real shipped code, not theoretical |
| **Prevents a recurring mistake** | Addresses a problem that has occurred more than once |
| **Stable** | Not expected to change soon |

## Promotion and Retirement

Patterns follow a lifecycle:

1. **Candidate** -- Observed once, captured in the napkin.
2. **Admitted** -- Meets all four barrier criteria; added here with full frontmatter.
3. **Retired** -- Superseded by a library, language feature, or better pattern; moved to an archive section with rationale.

## Frontmatter Schema

Every pattern file has YAML frontmatter:

```yaml
---
name: "Human-readable pattern name"
use_this_when: "One sentence: the situation where this pattern applies"
category: code | architecture | process | testing | agent
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

### Code (20)

- **Additive-Only Schema Decoration** -- Use this when: a decorator or enrichment pass modifies a third-party schema and must not overwrite properties that the upstream source already defines. → [additive-only-schema-decoration.md](additive-only-schema-decoration.md)
- **Boundary Narrowing for Schema Types** -- Use this when: a schema type is optional but at a specific call site the value is known to exist, and a non-null assertion or runtime throw is tempting. → [boundary-narrowing-for-schema-types.md](boundary-narrowing-for-schema-types.md)
- **CLI Flag Over Env Precedence** -- Use this when: CLI commands support both flags and env defaults for the same value, and hidden defaults or command drift have caused ambiguity. → [cli-flag-env-precedence.md](cli-flag-env-precedence.md)
- **Const Map as Type Guard** -- Use this when: a runtime conversion mirrors a compile-time type transformation and all possible values are known at generation or build time. → [const-map-as-type-guard.md](const-map-as-type-guard.md)
- **Drift Detection Test** -- Use this when: a manually maintained list should match a canonical source but cannot be derived, or repo-state drift needs detecting between maintained copies and canonical sources. → [drift-detection-test.md](drift-detection-test.md)
- **Explicit DI Over Ambient State** -- Use this when: you are tempted to use AsyncLocalStorage, module-level singletons, or thread-local context to propagate request-scoped data through a call chain. → [explicit-di-over-ambient-state.md](explicit-di-over-ambient-state.md)
- **Generic Factory for DI Composition** -- Use this when: a DI interface exposes multiple factory functions that callers always compose in the same order. → [generic-factory-for-di-composition.md](generic-factory-for-di-composition.md)
- **Guarded Fire-and-Forget Cleanup** -- Use this when: you have async cleanup (close, flush, disconnect) that runs after the response is sent and cannot be awaited by the caller. → [guarded-fire-and-forget-cleanup.md](guarded-fire-and-forget-cleanup.md)
- **Indexed-Access Sub-Type Derivation** -- Use this when: you need to process elements of a generated union type and the existing code uses hand-rolled local types that approximate the schema. → [indexed-access-subtype-derivation.md](indexed-access-subtype-derivation.md)
- **Infrastructure Never Masks Business** -- Use this when: recording telemetry, flushing buffers, or ending spans in a catch/finally block. → [infrastructure-never-masks-business.md](infrastructure-never-masks-business.md)
- **JSON Loader for Large Datasets** -- Use this when: a generated dataset exceeds TypeScript's max-lines threshold or literal-type serialisation limits. → [json-loader-for-large-datasets.md](json-loader-for-large-datasets.md)
- **Library Types Before Local Shapes** -- Use this when: An integration parses third-party SDK responses or errors and custom local `*Like` shapes are being considered. → [library-types-before-local-shapes.md](library-types-before-local-shapes.md)
- **Narrow Re-Exports at Boundaries** -- Use this when: a wrapper library re-exports types from an underlying SDK. → [narrow-re-exports-at-boundaries.md](narrow-re-exports-at-boundaries.md)
- **Omit Unknown-Carrying Fields from Library Types** -- Use this when: extending a library type that carries `Record<string, unknown>` or `any` on one or more fields, while the rest of the type is valuable. → [omit-unknown-from-library-types.md](omit-unknown-from-library-types.md)
- **Preprocess for Type-Preserving Coercion** -- Use this when: a Zod schema needs to accept multiple input types but preserve a narrow output type, and z.union with .transform() would widen the output. → [preprocess-for-type-preserving-coercion.md](preprocess-for-type-preserving-coercion.md)
- **String-Based Codegen Type-Safety Gap** -- Use this when: a code generator emits code as string templates and the output includes API calls with specific argument names. → [string-codegen-type-safety-gap.md](string-codegen-type-safety-gap.md)
- **Pure Leaf Module Extraction** -- Use this when: pure functions and I/O functions coexist in a module, and other modules need only the pure functions. → [pure-leaf-extraction.md](pure-leaf-extraction.md)
- **Template Literal Derived Union with Builder** -- Use this when: a string union type is the cross-product of two smaller unions joined by a separator, and code constructs members at runtime via template literals. → [template-literal-derived-union.md](template-literal-derived-union.md)
- **Unknown Until Validated** -- Use this when: a function produces data whose type cannot be statically verified and a validation boundary exists downstream. → [unknown-until-validated.md](unknown-until-validated.md)
- **Validation Error Severity Separation** -- Use this when: a schema validation error message lists all absent fields alongside actually failing fields, making operators debug the wrong variables. → [validation-error-severity-separation.md](validation-error-severity-separation.md)

### Architecture (6)

- **Explicit Missing Resource State** -- Use this when: a numeric or boolean value can mask a missing upstream resource and create fail-open behaviour. → [explicit-missing-resource-state.md](explicit-missing-resource-state.md)
- **Multi-Layer Schema Synchronisation** -- Use this when: a code generator produces multiple schema representations (JSON schema, Zod, transforms) from a single source and a change to input handling must be reflected across all layers. → [multi-layer-schema-sync.md](multi-layer-schema-sync.md)
- **Rate-Limit Upstream Amplification Vectors** -- Use this when: a route produces an upstream request (API call, redirect, proxy fetch) as a side effect of handling an inbound request. → [rate-limit-upstream-amplification-vectors.md](rate-limit-upstream-amplification-vectors.md)
- **SDK-Owned Retriever Delegation** -- Use this when: an app-layer module builds an Elasticsearch retriever shape that the SDK already owns as a shared capability. → [sdk-owned-retriever-delegation.md](sdk-owned-retriever-delegation.md)
- **Wire-Format-Aware Redaction** -- Use this when: telemetry redaction protects structured objects or URLs, but secrets can also travel through raw encoded strings such as `application/x-www-form-urlencoded` request bodies. → [wire-format-aware-redaction.md](wire-format-aware-redaction.md)
- **Workaround Debt Compounds Through Rationalisation** -- Use this when: a workaround exists and someone is explaining why it's justified, especially when invoking "different purposes" or "separate concerns". → [workaround-debt-compounds-through-rationalisation.md](workaround-debt-compounds-through-rationalisation.md)

### Process (27)

- **ADR by Reusability, Not Diff Size** -- Use this when: closing a small implementation lane and deciding whether the decision it encoded deserves to be promoted to an ADR. → [adr-by-reusability-not-diff-size.md](adr-by-reusability-not-diff-size.md)

- **Check Driven Development** -- Use this when: writing TDD RED-phase assertions in a codebase with multiple quality gates. → [check-driven-development.md](check-driven-development.md)
- **ChatGPT Report Normalisation** -- Use this when: recovering an LLM-exported report from markdown, DOCX, and PDF copies into durable repo-quality markdown. → [chatgpt-report-normalisation.md](chatgpt-report-normalisation.md)
- **Collapse Authoritative Frames When Settled** -- Use this when: a document or plan carries multiple authoritative descriptions of the same concept after a reorganisation, and "transitional dual-frame with sunset note" is being considered. → [collapse-authoritative-frames-when-settled.md](collapse-authoritative-frames-when-settled.md)
- **Current Plan Promotion** -- Use this when: a review or planning pass has resolved "what comes next" and the repo needs a concrete next-session entry point rather than a mere intended future direction. → [current-plan-promotion.md](current-plan-promotion.md)
- **Monotonic Counter Is Not a Quality Indicator** -- Use this when: comparing two versions of a document or artefact that each carry a sequence counter. → [monotonic-counter-is-not-quality-indicator.md](monotonic-counter-is-not-quality-indicator.md)
- **README as Index** -- Use this when: a plan-directory README is growing to contain session instructions, outcome narratives, or design rationale that duplicates or replaces .plan.md content. → [readme-as-index.md](readme-as-index.md)
- **Repair Workflow Contract Clarity** -- Use this when: a workflow repairs or transforms the same content across multiple artefacts or locations and ambiguous verbs could trigger rewrite or promotion drift. → [repair-workflow-contract-clarity.md](repair-workflow-contract-clarity.md)
- **Source-First Adopt-or-Explain Evaluation** -- Use this when: evaluating whether an existing dependency's utilities should replace hand-rolled code. → [source-first-adopt-or-explain.md](source-first-adopt-or-explain.md)
- **Shared Strictness Requires Workspace Adoption** -- Use this when: a repo has landed a root strictness or gate foundation and it is tempting to treat the shared config itself as completion before every claimed participant actually composes it and passes under it. → [shared-strictness-requires-workspace-adoption.md](shared-strictness-requires-workspace-adoption.md)
- **Stage What You Commit, Commit What You Staged** -- Use this when: about to run `git commit` with unrelated changes visible in `git status`; the index may carry work the commit message does not describe. → [stage-what-you-commit.md](stage-what-you-commit.md)
- **Substance Before Fitness** -- Use this when: writing concepts to files that have size/fitness limits. → [substance-before-fitness.md](substance-before-fitness.md)
- **Three Levels of Reference Quality** -- Use this when: documentation or portable content references concepts from another context — choose between opaque pointer, descriptive name, or exported concept. → [three-levels-of-reference-quality.md](three-levels-of-reference-quality.md)
- **Comments About External Behaviour Degrade** -- Use this when: code comments describe the behaviour of an external library, especially when asserting what it does NOT support. → [comments-about-externals-degrade.md](comments-about-externals-degrade.md)
- **Cross-Session Pattern Emergence** -- Use this when: running consolidation after multiple sessions on the same workstream, or when insights from separate sessions form a larger picture. → [cross-session-pattern-emergence.md](cross-session-pattern-emergence.md)
- **Scoped Gitignore for Colliding Directory Names** -- Use this when: a generically named directory (`reference`, `data`, `output`) appears in multiple subtrees with different ignore intent and a broad `**/dirname/*` rule causes surprise ignores or negation sprawl. → [scoped-gitignore-for-colliding-directory-names.md](scoped-gitignore-for-colliding-directory-names.md)
- **Tool Output Framing Bias** -- Use this when: building a plan from a single tool run and the tool's groupings, counts, or categories are being adopted as plan structure without independent verification. → [tool-output-framing-bias.md](tool-output-framing-bias.md)
- **Domain Specialist Has Final Say on SDK Semantics** -- Use this when: architecture reviewers make assumptions about SDK-specific behaviour that have not been verified against official documentation. → [domain-specialist-final-say.md](domain-specialist-final-say.md)
- **Evidence Before Classification** -- Use this when: a static analysis tool reports findings and you need to treat every finding as unclassified until evidence proves otherwise. → [evidence-before-classification.md](evidence-before-classification.md)
- **Fix at Source, Not Consumer** -- Use this when: multiple workaround attempts fail at the consumer because the producer's type/function/interface is wrong. → [fix-at-source-not-consumer.md](fix-at-source-not-consumer.md)
- **Foundations Before Consumers in Multi-Emitter Plans** -- Use this when: sequencing a plan with N parallel consumer lanes that share a foundation (schema, ESLint rule, extracted core); the foundation must land in an earlier wave or every consumer retrofits. → [foundations-before-consumers.md](foundations-before-consumers.md)
- **Inherited Framing Without First-Principles Check** -- Use this when: about to execute a plan body, rewrite an existing artefact, or translate an "old X to new X" — before writing code, tests, or doctrine, check whether the inherited shape is the right shape for the behaviour being proven. → [inherited-framing-without-first-principles-check.md](inherited-framing-without-first-principles-check.md)
- **Pre-implementation Plan Review** -- Use this when: complex implementation work needs specialist review at the plan stage, not just at the code stage. → [pre-implementation-plan-review.md](pre-implementation-plan-review.md)
- **Re-evaluate Removal Conditions on Workarounds** -- Use this when: a workaround documents its own removal conditions and conditions may be met long before anyone checks. → [re-evaluate-removal-conditions.md](re-evaluate-removal-conditions.md)
- **Review Intentions, Not Just Code** -- Use this when: you want specialist reviewers to assess design intent before implementation. → [review-intentions-not-just-code.md](review-intentions-not-just-code.md)
- **UX Predates Visual Design** -- Use this when: user experience decisions accumulate in CLIs, SDKs, APIs, documentation, and error messages long before any visual UI exists. → [ux-predates-visual-design.md](ux-predates-visual-design.md)
- **Verify Claims Against Primary Sources Before Propagating** -- Use this when: writing technical claims into plans, TSDoc, or governance documents. → [verify-before-propagating.md](verify-before-propagating.md)

### Testing (6)

- **Accessibility as a Blocking Gate** -- Use this when: a project ships user-facing HTML and needs to prove WCAG compliance automatically. → [accessibility-as-blocking-gate.md](accessibility-as-blocking-gate.md)
- **Conformance Tests for Library Adoption** -- Use this when: replacing hand-rolled code with a library import and keeping existing unit tests as library contract guards. → [conformance-tests-for-library-adoption.md](conformance-tests-for-library-adoption.md)
- **Interface Segregation for Test Fakes** -- Use this when: test fakes cannot satisfy a complex generated type without type assertions. → [interface-segregation-for-test-fakes.md](interface-segregation-for-test-fakes.md)
- **Plain-Node Built-Artefact Proof** -- Use this when: a workspace runs source with a dev loader locally but ships built JavaScript under plain Node, and dev success may mask production-startup defects. → [plain-node-built-artifact-proof.md](plain-node-built-artifact-proof.md)
- **satisfies for Mock Completeness** -- Use this when: a test mock implements an interface and you need compile-time proof that all methods are present. → [satisfies-for-mock-completeness.md](satisfies-for-mock-completeness.md)
- **Don't Test SDK Internals** -- Use this when: tests must prove product behaviour, not third-party SDK internal normalisation or compatibility logic. → [dont-test-sdk-internals.md](dont-test-sdk-internals.md)

### Agent (6)

- **Agentic Surface Separation** -- Use this when: designing or refactoring agent infrastructure that spans skills, rules, commands, subagents, or platform adapters. → [agentic-surface-separation.md](agentic-surface-separation.md)
- **Governance Claim Needs a Scanner** -- Use this when: an ADR or governance document asserts a universal property across a set of live surfaces (one vocabulary, a required citation, a mandatory field, platform-adapter parity) and prose alone is the only enforcement. → [governance-claim-needs-a-scanner.md](governance-claim-needs-a-scanner.md)
- **Passive Guidance Loses to Artefact Gravity** -- Use this when: designing a guardrail against an agent failure mode — choose between documented-but-not-enforced guidance (passive) and an environmentally-triggered rule, hook, or read-on-entry surface (active); passive guidance alone is a watchlist item, not a guardrail. → [passive-guidance-loses-to-artefact-gravity.md](passive-guidance-loses-to-artefact-gravity.md)
- **Reviewer Widening Is Always Wrong** -- Use this when: a sub-agent reviewer recommends replacing one type construct with a wider one; the fix widens the type, which is never the answer. → [reviewer-widening-is-always-wrong.md](reviewer-widening-is-always-wrong.md)
- **Platform Configuration Is Infrastructure** -- Use this when: AI platform settings (permissions, hooks, plugin state) that define the agentic system contract must be tracked in version control, not gitignored. → [platform-config-is-infrastructure.md](platform-config-is-infrastructure.md)
- **Route Reviewers by Abstraction Layer, Not File Scope** -- Use this when: dispatching specialist reviewers on a finishing pass over a mixed code + docs + ADR lane and choosing which reviewers to invoke. → [route-reviewers-by-abstraction-layer.md](route-reviewers-by-abstraction-layer.md)
