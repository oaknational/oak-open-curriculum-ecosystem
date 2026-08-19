# Repo-Local Pattern Instances

Specific, ecosystem-grounded instances of engineering patterns
proven by real implementation in this repository. Each entry
captures a concrete pattern proven in a specific TypeScript/Zod/
Vitest/MCP context (or other specific ecosystem context present
here).

## Relationship to Practice Core

This directory holds **specific repo-grounded instances** of
engineering patterns and is the **primary pattern home** for the
repo. General, ecosystem-agnostic abstract patterns and
Practice-governance patterns (review, planning, consolidation,
reviewer authority, etc.) live as **PDRs** in
`.agent/practice-core/decision-records/` — patterns may use
`pdr_kind: pattern` frontmatter to mark themselves as the general
form of a recurring engineering or governance problem.

The previous `.agent/practice-core/patterns/` directory was retired
2026-04-29 (PDR-007 amendment): no general patterns had been
authored there, and Practice-governance abstractions matured as
PDRs instead. There is no Core-pattern destination.

## Sibling memory classes

Cross-agent collaboration patterns (multi-agent coordination
substance, distinct from single-agent engineering substance) live
in [`.agent/memory/collaboration/`](../../collaboration/README.md).
Same lifecycle and graduation bar; different substance. Founding
entry: `parallel-track-pre-commit-gate-coupling`.

An instance here may have a `related_pdr: PDR-NNN` or
`related_pattern: <name>` frontmatter pointer linking it to the
general form. The instance stays in place regardless: instance-
level proof continues to live at the repo level after general
abstraction is authored.

## Polarity (required, every pattern)

Every pattern entry MUST be explicit about its polarity. Three
distinct shapes appear in this directory and the difference
matters at the moment of reading — a reader skimming a pattern to
decide whether to apply it or recognise it as a failure mode needs
the polarity at a glance, not after parsing the body:

| Polarity | Meaning | Header marker |
| --- | --- | --- |
| `pattern` | A shape to **repeat**: the body describes a positive solution shape proven to work, with the structural elements a reader should reproduce when applying it | `> **POLARITY: PATTERN.** This is a shape to repeat...` |
| `anti-pattern` | A failure mode to **avoid**: the body names a recurring failure shape (often with a diagnostic for catching it in the moment) and the corrective discipline; recognising the anti-pattern shape is the first move in not repeating it | `> **POLARITY: ANTI-PATTERN.** This is a failure mode to avoid...` |
| *(none — does not belong here)* | A recurring observation that lacks an actionable shape (no clear repeat-shape, no clear failure-mode-and-cure pair) | Belongs in [`distilled.md`](../distilled.md) (cross-session refinement) or [`pending-graduations.md`](../../operational/pending-graduations.md) (queued candidates), NOT in this directory |

Patterns are doctrine ready to apply; observations awaiting shape
are not yet patterns. Categories (`code` / `architecture` /
`process` / `testing` / `agent`) are orthogonal to polarity — every
(category, polarity) pair is admissible.

The polarity is recorded in two places per pattern file:

1. **Frontmatter field** `polarity: pattern | anti-pattern` —
   machine-readable for the index and for tooling.
2. **Blockquote header** in the body, immediately after the
   frontmatter — human-visible at a glance during reading.

Pre-2026-05-05 pattern files predate this discipline and are being
backfilled across the next consolidation passes; new entries from
2026-05-05 onward MUST carry both markers. Until backfill catches
up, use
[`eager-rounding-off-on-partial-structures.md`](eager-rounding-off-on-partial-structures.md)
as the shape-of-the-art template for new pattern files — copying
an existing pre-2026-05-05 file as template would silently produce
a non-conformant entry.

## Categories

Patterns span five categories:
**code** (implementation techniques), **architecture** (system
structure and boundaries), **process** (engineering workflows and
decision-making), **testing** (verification strategies), and
**agent** (agentic infrastructure design). (Categories are
orthogonal to polarity per the Polarity section above.)

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
| **Prevents a recurring mistake** | Addresses a problem likely to recur. "Occurred more than once" is the default heuristic, **not a gate**: per [PDR-100](../../../practice-core/decision-records/PDR-100-decision-debt-as-a-first-class-pillar.md) a single-instance lesson graduates when the lenses (long-term architectural excellence / strict-everywhere / improve-DX) give a clear answer — provenance and adaptation are the safety net, not a second instance. |
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
polarity: pattern | anti-pattern   # REQUIRED for entries authored 2026-05-05 onwards
use_this_when: "One sentence: the situation where this pattern applies (positive shape) OR the situation where this failure mode is at risk of firing (anti-pattern)"
category: code | architecture | process | testing | agent
proven_in: "file path where pattern was first applied or proven"
proven_date: YYYY-MM-DD
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "What mistake this prevents (anti-patterns name the mistake itself; positive patterns name the mistake their absence permits)"
  stable: true
cross_plane: true   # optional; see Cross-Plane Span Tag below
---
```

The `use_this_when` field is the primary discovery mechanism. It describes the moment an engineer should think "I have seen this before." For anti-patterns, the trigger is the moment the failure mode is about to fire — the diagnostic moment.

### Cross-Plane Span Tag (optional)

`cross_plane: true` is an optional frontmatter field naming patterns whose substance genuinely spans multiple memory planes (`active/`, `operational/`, `executive/`). Added when a pattern's behaviour-change reaches beyond learning-loop (active) into continuity state (operational) or stable catalogues (executive). Defined by [PDR-030 Plane-Tag Vocabulary](../../../practice-core/decision-records/PDR-030-plane-tag-vocabulary.md); routes through the graduation channel defined in [PDR-028 Executive-Memory Feedback Loop](../../../practice-core/decision-records/PDR-028-executive-memory-feedback-loop.md). Accumulation of `cross_plane: true` patterns in a rolling window is the Family-B Layer-2 seam-review signal per [PDR-029](../../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md). Omit the field entirely when the pattern is single-plane — do not set `cross_plane: false`.

## How Patterns Differ from Rules

**Rules** (in [`principles.md`](../../../directives/principles.md)) are principles: "never use type-erasing `as`". **Patterns** are "how to implement the principle": replace the `as` cast with a const map lookup. Rules say what; patterns say how.

## Empirical-to-Normative Flow

Patterns are observations from real practice before they are
prescriptions. A pattern records that a behaviour shape or solution
move has appeared often enough, and concretely enough, to name.

Knowledge can then move in either direction:

- doctrine, rules, and principles can shed examples into recipe books;
- recipe books can reveal repeated moves that become patterns;
- mature patterns can feed recipe books, rules, principles, scanners,
  quality gates, ADRs, PDRs, or PDR amendments;
- enforcement failures and owner corrections feed back into capture as
  new evidence.

PDR-014 owns the routing discipline for these moves. The pattern file
is not necessarily the final home; it is often the empirical proof
surface that makes later governance or enforcement honest.

## How Patterns Differ from Source Code

**Source code** is concrete: a specific const map for specific HTTP status codes. **Patterns** are abstract: the principle of using const maps to replace runtime conversions that mirror compile-time type transformations. Patterns describe the shape of the solution, not the domain-specific implementation.

## Index Maintenance

The entire Pattern Index section below — headings, per-category lists,
and counts — is **GENERATED from pattern frontmatter**. Never hand-edit
it: the pre-commit `validate-patterns-index` gate refuses hand-edited
drift. After adding or changing a pattern file, regenerate with
`pnpm --filter @oaknational/agent-tools validate-patterns-index:fix`.

## Pattern Index

### Code (32)

- **\"Widen\" Is a Type Smell — Discriminate Model-Wrong From Correct-and-Violated** *(anti-pattern)* -- Use this when: About to widen a list, type, union, or allowlist to make a case pass (or an owner/reviewer flags a 'widen') — the reach for a wider shape is usually hiding a type problem. → [widen-is-a-type-smell.md](widen-is-a-type-smell.md)
- **A Lint-Rule Pincer Is a Design Signal, Not an Obstacle** -- Use this when: Two (or more) lint rules jointly ban every shape you can think of for an in-component or in-function implementation, and the reflex is to disable one rule or contort past them. → [lint-rule-pincer-is-a-design-signal.md](lint-rule-pincer-is-a-design-signal.md)
- **A Server Component Reads Its Data Layer Directly — Never HTTP-Fetches Its Own Route Handler** -- Use this when: A Next.js (or equivalent RSC) server component fetches data — and any shape involving fetch('/api/…'), NEXT_PUBLIC_BASE_URL, or localhost self-calls appears. → [server-component-reads-data-layer-directly.md](server-component-reads-data-layer-directly.md)
- **A Throw That Only Narrows a Too-Wide Return Type → Strengthen the Type, Not Route to Result** -- Use this when: Migrating a throw to a Result type (or auditing error handling) and the throw exists only to narrow a too-wide upstream return type — its error arm would be permanently unreachable. → [throw-as-narrowing-artifact-strengthen-the-type.md](throw-as-narrowing-artifact-strengthen-the-type.md)
- **Additive-Only Schema Decoration** -- Use this when: a decorator or enrichment pass modifies a third-party schema and must not overwrite properties that the upstream source already defines. → [additive-only-schema-decoration.md](additive-only-schema-decoration.md)
- **Boundary Narrowing for Schema Types** -- Use this when: a schema type is optional but at a specific call site the value is known to exist, and a non-null assertion or runtime throw is tempting. → [boundary-narrowing-for-schema-types.md](boundary-narrowing-for-schema-types.md)
- **CLI Flag Over Env Precedence** -- Use this when: A CLI command accepts both explicit flags and environment defaults for the same setting, and hidden defaults previously caused ambiguous behaviour. → [cli-flag-env-precedence.md](cli-flag-env-precedence.md)
- **Closed Union + No-Throw Forces an Exhaustive Total-Function Renderer** -- Use this when: Rendering (or otherwise dispatching over) a closed discriminated union — content blocks, event kinds, state variants — under the repo's no-throw and no-silent-skip disciplines. → [exhaustive-total-function-renderer.md](exhaustive-total-function-renderer.md)
- **Const Map as Type Guard** -- Use this when: a runtime conversion mirrors a compile-time type transformation and all possible values are known at generation or build time. → [const-map-as-type-guard.md](const-map-as-type-guard.md)
- **destructive-path-preconditions** -- Use this when: >-. → [destructive-path-preconditions.md](destructive-path-preconditions.md)
- **Drift Detection Test** -- Use this when: A manually maintained list should match a canonical source but cannot be derived due to structural constraints, or repo-state drift needs detecting between maintained copies and canonical sources. → [drift-detection-test.md](drift-detection-test.md)
- **Explicit DI Over Ambient State** -- Use this when: You are tempted to use AsyncLocalStorage, module-level singletons, or thread-local context to propagate request-scoped data through a call chain. → [explicit-di-over-ambient-state.md](explicit-di-over-ambient-state.md)
- **File-Backed Stdio for Spawned Gate-Running Children** -- Use this when: Spawning git commit or any hook/gate-running child from Node and its output truncates or the chain dies silently mid-hook. → [file-backed-stdio-for-spawned-gate-children.md](file-backed-stdio-for-spawned-gate-children.md)
- **Generator-First for Vendored Static Data** -- Use this when: A vendored/static JSON asset needs validation or narrowing (widened literals, closed unions) and the reflex fix is a runtime guard, a module-init throw, or Result-threading at the import boundary. → [generator-first-for-vendored-static-data.md](generator-first-for-vendored-static-data.md)
- **Generic Factory for DI Composition** -- Use this when: A DI interface exposes multiple factory functions that callers always compose in the same order. → [generic-factory-for-di-composition.md](generic-factory-for-di-composition.md)
- **Guard the Parse Before a Threshold Classification** -- Use this when: Classifying external or parsed data by a numeric threshold (age buckets, liveness states, severity bands) — gate the value's validity before any comparison, because a NaN or missing value makes every < and > false and silently selects the last/worst branch. → [guard-the-parse-before-threshold-classification.md](guard-the-parse-before-threshold-classification.md)
- **Guarded Fire-and-Forget Cleanup** -- Use this when: You have async cleanup (close, flush, disconnect) that runs after the response is sent and cannot be awaited by the caller. → [guarded-fire-and-forget-cleanup.md](guarded-fire-and-forget-cleanup.md)
- **Indexed-access sub-type derivation from generated unions** -- Use this when: You need to process elements of a generated union type and the existing code uses hand-rolled local types that approximate the schema. → [indexed-access-subtype-derivation.md](indexed-access-subtype-derivation.md)
- **Infrastructure operations never mask business logic** -- Use this when: Recording telemetry, flushing buffers, or ending spans in a catch/finally block. → [infrastructure-never-masks-business.md](infrastructure-never-masks-business.md)
- **JSON loader for large generated datasets** -- Use this when: A generated dataset exceeds TypeScript's max-lines threshold or literal-type serialisation limits. → [json-loader-for-large-datasets.md](json-loader-for-large-datasets.md)
- **Library Types Before Local Shapes** -- Use this when: An integration parses third-party SDK responses or errors and custom local `*Like` shapes are being considered. → [library-types-before-local-shapes.md](library-types-before-local-shapes.md)
- **Narrow re-exports at package boundaries** -- Use this when: A wrapper library re-exports types from an underlying SDK. → [narrow-re-exports-at-boundaries.md](narrow-re-exports-at-boundaries.md)
- **Omit unknown-carrying fields from library types** -- Use this when: Extending a library type that carries Record<string, unknown> or any on one or more fields, while the rest of the type is valuable. → [omit-unknown-from-library-types.md](omit-unknown-from-library-types.md)
- **Parse-Time Narrowing Is Destructive in Read-Modify-Write Transactions** *(anti-pattern)* -- Use this when: adding validation to a parse layer that feeds a read → transform → write-back transaction over a shared file, and rejecting, omitting, or normalising rows at parse looks like the clean cure. → [parse-time-narrowing-destructive-in-rmw-transactions.md](parse-time-narrowing-destructive-in-rmw-transactions.md)
- **Preprocess for Type-Preserving Coercion** -- Use this when: A Zod schema needs to accept multiple input types but preserve a narrow output type, and z.union with .transform() would widen the output. → [preprocess-for-type-preserving-coercion.md](preprocess-for-type-preserving-coercion.md)
- **Pure Leaf Module Extraction** -- Use this when: Pure functions and I/O functions coexist in a module, and other modules need only the pure functions. → [pure-leaf-extraction.md](pure-leaf-extraction.md)
- **String-Based Codegen Type-Safety Gap** *(anti-pattern)* -- Use this when: A code generator emits code as string templates rather than AST nodes, and the output includes API calls with specific argument names or shapes. → [string-codegen-type-safety-gap.md](string-codegen-type-safety-gap.md)
- **Template Literal Derived Union with Builder** -- Use this when: A string union type is the cross-product of two smaller unions joined by a separator, and code constructs members at runtime via template literals. → [template-literal-derived-union.md](template-literal-derived-union.md)
- **Unknown Until Validated** -- Use this when: a function produces data whose type cannot be statically verified and a validation boundary exists downstream. → [unknown-until-validated.md](unknown-until-validated.md)
- **Validate a Sampled Schema Against the Complete Corpus** -- Use this when: A type, union, schema, or universal claim was derived from a SAMPLE of the data it describes — and you are about to trust it for the whole corpus (build on it, verify with it, or assert it). → [validate-sampled-schema-against-complete-corpus.md](validate-sampled-schema-against-complete-corpus.md)
- **Validation Error Severity Separation** -- Use this when: A schema validation error message lists all absent fields alongside actually failing fields, making operators debug the wrong variables. → [validation-error-severity-separation.md](validation-error-severity-separation.md)
- **Zod Boundaries in Sandbox-Harness Modules** -- Use this when: Authoring or reviewing a module whose files are esbuild-bundled into a sandboxed harness artefact (Workflow scripts, agent prompts), or whose zod refinements guard stage-boundary invariants. → [zod-boundaries-in-sandbox-harness-modules.md](zod-boundaries-in-sandbox-harness-modules.md)

### Architecture (15)

- **A Sandbox Constraint Is a Build Instruction, Not a Hand-Authoring Licence** -- Use this when: A runtime surface cannot import or reuse repo code (a sandbox, an embedded script, a config DSL, a remote executor) and the impulse is to hand-write a parallel copy of logic, schemas, or prompts for it. → [sandbox-constraint-is-a-build-instruction.md](sandbox-constraint-is-a-build-instruction.md)
- **check-code-invariants-before-designing-a-field** -- Use this when: Adding a new field, enum, taxonomy, or discriminator to existing code — enumerate the invariants the surrounding code already maintains first, then choose the new shape's axis to preserve them (the invariant-safe axis is often non-obvious). → [check-code-invariants-before-designing-a-field.md](check-code-invariants-before-designing-a-field.md)
- **Derive a Controlled Surface From the Authoritative Data** -- Use this when: A surface you control (an enum, a parameter value space, a type, a listing page) mismatches an authoritative data source and the tempting move is a crosswalk or mapping layer between them. → [derive-controlled-surface-from-authoritative-data.md](derive-controlled-surface-from-authoritative-data.md)
- **Derive the View; Never Store the Copy** -- Use this when: About to STORE a value that is computable from values already stored (a display token, a disambiguator, a denormalised label) — or reviewing a surface whose findings keep clustering on one stored field. → [derived-view-vs-stored-copy.md](derived-view-vs-stored-copy.md)
- **Explicit Missing Resource State** -- Use this when: A numeric or boolean result can be confused with a missing upstream resource, causing fail-open behaviour. → [explicit-missing-resource-state.md](explicit-missing-resource-state.md)
- **Multi-Layer Schema Synchronisation** -- Use this when: a code generator produces multiple schema representations (JSON schema, Zod, transforms) from a single source and a change to input handling must be reflected across all layers. → [multi-layer-schema-sync.md](multi-layer-schema-sync.md)
- **Prefer Native SDK Over Custom Plumbing** → [prefer-native-sdk-over-custom-plumbing.md](prefer-native-sdk-over-custom-plumbing.md)
- **Principled ESLint Zoning for Build Tooling and Generated Artefacts** -- Use this when: A workspace's build tooling (generators, extractors) or generated artefacts collide with app-strict lint rules and the reflex is to disable rules or contort the tooling into app-runtime idioms. → [principled-eslint-zoning.md](principled-eslint-zoning.md)
- **provider-neutral-types-at-boundaries** → [provider-neutral-types-at-boundaries.md](provider-neutral-types-at-boundaries.md)
- **SDK-Owned Retriever Delegation** -- Use this when: An app-layer module builds an Elasticsearch retriever shape that the SDK already owns as a shared capability. → [sdk-owned-retriever-delegation.md](sdk-owned-retriever-delegation.md)
- **To Author a Host-Free Portable Artefact, Choose a Host-Naive Author** -- Use this when: Authoring an artefact whose value depends on containing NO host/repo-specific concepts — a portable primer, a Practice-Core doc, a vendor-neutral spec. → [host-naive-author-for-portable-artefact.md](host-naive-author-for-portable-artefact.md)
- **TSDoc Extension Point for Future Consumers** → [tsdoc-extension-point-for-future-consumers.md](tsdoc-extension-point-for-future-consumers.md)
- **warm-masks-cold** *(anti-pattern)* -- Use this when: >-. → [warm-masks-cold.md](warm-masks-cold.md)
- **Wire-Format-Aware Redaction** -- Use this when: Telemetry redaction protects structured objects or URLs, but secrets can also travel through raw encoded strings such as application/x-www-form-urlencoded request bodies. → [wire-format-aware-redaction.md](wire-format-aware-redaction.md)
- **Workaround Debt Compounds Through Rationalisation** *(anti-pattern)* -- Use this when: A workaround exists in the codebase and someone is explaining why it's justified, necessary, or acceptable — especially when the explanation invokes 'different purposes' or 'separate concerns'. → [workaround-debt-compounds-through-rationalisation.md](workaround-debt-compounds-through-rationalisation.md)

### Process (117)

- **A Description Is Not a Check** *(anti-pattern)* -- Use this when: About to act on, transmit, or review a DESCRIPTION of an artefact — a commit message, a code comment, a handoff summary, a self-report, a probe's green output — instead of reading the artefact itself; and at review-routing time, deciding where to point external scrutiny. → [description-is-not-a-check.md](description-is-not-a-check.md)
- **A Fidelity Audit Is Not a Currency Audit** *(anti-pattern)* -- Use this when: Verifying a claim that rests on an inherited surface (a record, a thread note, a prior session's framing) before relying on it. → [fidelity-audit-is-not-currency-audit.md](fidelity-audit-is-not-currency-audit.md)
- **A Freshly-Landed Enforcement Gate's First Burndown Is Doctrine Co-Design, Not Mechanical Data-Entry** -- Use this when: Burning down the violations a newly-landed enforcement gate (validator, lint rule, scanner) reports for the first time — the impulse is to 'watch the count fall to zero', but the first burndown is where the gate's doctrine meets reality. → [report-first-gate-burndown-is-doctrine-application.md](report-first-gate-burndown-is-doctrine-application.md)
- **A Legitimate Principle Invoked as Cover for Not Doing the Work** *(anti-pattern)* -- Use this when: You are about to NOT do something — not investigate, not graduate, not act — and the justification is a real principle (conservation, owner-authority, restraint, proportionality). → [legitimate-principle-as-avoidance-cover.md](legitimate-principle-as-avoidance-cover.md)
- **A Live Peer's agent_name Assigned to Your Fresh Session Is a Collision to Surface, Not Adopt** *(anti-pattern)* -- Use this when: Registering a session identity when the owner-assigned or derived agent_name matches a name already live in the claims registry or comms stream. → [surface-dont-adopt-a-live-peers-name.md](surface-dont-adopt-a-live-peers-name.md)
- **A North-Star Doc Conserves Sprawl Instead of Delegating** *(anti-pattern)* -- Use this when: Authoring or raising the standard of a vision, charter, strategy, or other north-star document whose job is to orient, not to explain everything. → [north-star-doc-conserves-sprawl.md](north-star-doc-conserves-sprawl.md)
- **A Policy/Content Hook Firing While You Author Names a Concept, Not a Token** -- Use this when: A content/policy hook or commit gate fires while you author a schema, contract, doctrine, or other artefact, and you are tempted to read it as an over-match to patch away. → [hook-firing-while-authoring-names-a-concept.md](hook-firing-while-authoring-names-a-concept.md)
- **A Sweep Filter Is Part of the Claim — Audit It Against the Live Referent** -- Use this when: Arming any filter that decides what a sweep sees — a grep/rg pattern, a watcher branch-name match, an exclusion glob, a monitor alternation — and you will act on its result (especially a quiet or green one). → [audit-sweep-filters-against-live-referent.md](audit-sweep-filters-against-live-referent.md)
- **A Whole-Tree Gate Red on Files You Didn't Touch (and Your Commits Just Passed) Is Not Your Bug** -- Use this when: A whole-tree gate (type-check, lint, full pnpm check) fails on a surface you never changed, in a shared checkout or multi-agent window. → [whole-tree-gate-red-on-untouched-files.md](whole-tree-gate-red-on-untouched-files.md)
- **Actuate a Large Reference With a Thin Firing Skill, Not by Making the Doc a Skill** -- Use this when: Making a large valuable reference (a long doctrine doc, a grammar, a deep guide) actually fire for agents at the moment of work. → [thin-firing-skill-over-doc-as-skill.md](thin-firing-skill-over-doc-as-skill.md)
- **Actuate a Mechanism in the Same Breath You Commit to It** -- Use this when: About to say 'I'll watch X' / 'I'll run the gate' / 'the loop will close' / 'I'll monitor the PR' — any committed intent to run a mechanism. → [actuate-mechanism-in-the-same-breath.md](actuate-mechanism-in-the-same-breath.md)
- **ADR by Reusability, Not Diff Size** -- Use this when: closing a small implementation lane and deciding whether the decision it encoded deserves to be promoted to an ADR. → [adr-by-reusability-not-diff-size.md](adr-by-reusability-not-diff-size.md)
- **Adversarial Pre-Spend Verification of One-Way Actions** -- Use this when: About to take a one-way, costly, or unrecoverable action — launching a large fleet/workflow run, an irreversible migration, a bulk send — whose artefacts you authored yourself. → [adversarial-pre-spend-verification-of-one-way-actions.md](adversarial-pre-spend-verification-of-one-way-actions.md)
- **Adversarially Verify Your Own Synthesis in Long Analytical Work** -- Use this when: Deep, multi-turn analytical / research / survey work where you are building a synthesis over many sources and about to present conclusions as settled. → [adversarially-verify-own-synthesis.md](adversarially-verify-own-synthesis.md)
- **An Indiscriminate-Rule Warning Count Is Cause-Classes, Not N Problems** -- Use this when: A broad or indiscriminate lint/analysis rule reports a large count (hundreds/thousands of warnings) and you are deciding how to remediate. → [indiscriminate-rule-count-is-cause-classes.md](indiscriminate-rule-count-is-cause-classes.md)
- **Atomic Relocation of Shared Substrate** -- Use this when: Moving a directory, workspace, or state surface that other agents' tooling reads live (comms dirs, registries, built CLIs) — plan the move, the repoint of every reader, and the rebuild as one atomic change. → [atomic-relocation-of-shared-substrate.md](atomic-relocation-of-shared-substrate.md)
- **Awaited Verdicts Need Two Signals** *(anti-pattern)* -- Use this when: Arming any wait on an external verdict — a merge, a check settling, a ratification, a deploy going live — especially when the wait's wake condition is a single push notification. → [awaited-verdicts-need-two-signals.md](awaited-verdicts-need-two-signals.md)
- **Bounded Metaloss Recursion** -- Use this when: Running a loss scan at compaction or session close and a recursive pass over the scan itself risks becoming an unbounded attempt to prove that nothing was omitted. → [bounded-metaloss-recursion.md](bounded-metaloss-recursion.md)
- **Breadth as Evasion** *(anti-pattern)* → [breadth-as-evasion.md](breadth-as-evasion.md)
- **ChatGPT report normalisation** -- Use this when: Recovering an LLM-exported report from markdown, DOCX, and PDF copies into durable repo-quality markdown. → [chatgpt-report-normalisation.md](chatgpt-report-normalisation.md)
- **Check Driven Development** -- Use this when: Writing TDD RED-phase assertions in a codebase with multiple quality gates. → [check-driven-development.md](check-driven-development.md)
- **Citation as Reasoning at the Moment of Verdict** *(anti-pattern)* → [citation-as-reasoning-at-moment-of-verdict.md](citation-as-reasoning-at-moment-of-verdict.md)
- **Collapse Authoritative Frames When the Decision Is Settled** -- Use this when: a document or plan carries multiple authoritative descriptions of the same concept (headings + tables + inline notes), especially after a reorganisation. Each frame becomes a drift trap; 'transitional dual-frame with sunset note' is unstable. → [collapse-authoritative-frames-when-settled.md](collapse-authoritative-frames-when-settled.md)
- **Comments About External Behaviour Degrade** *(anti-pattern)* -- Use this when: Code comments describe the behaviour of an external library, SDK, or service, especially when they assert what the library does NOT support. → [comments-about-externals-degrade.md](comments-about-externals-degrade.md)
- **commit-window-discipline-under-parallel-agents** -- Use this when: Committing on a shared on-disk checkout where other agents may stage or commit concurrently — re-derive the staged set per chunk from a fresh git status, stage by explicit pathspec, and verify the staged set immediately before each commit; 'solo window' is a point-in-time read, not a session property. → [commit-window-discipline-under-parallel-agents.md](commit-window-discipline-under-parallel-agents.md)
- **Comprehensive-Cataloguing Drift** *(anti-pattern)* -- Use this when: Authoring a spine plan, dispatching a reviewer pass, extending a rule, or otherwise scoping any artefact whose substance crosses a "what's in vs what's adjacent" boundary. → [comprehensive-cataloguing-drift.md](comprehensive-cataloguing-drift.md)
- **Consolidation Output Shape — Contract for One Pattern, Report for N Independents** -- Use this when: A consolidation, audit, or deep-exploration pass has produced N findings and you are choosing the shape of the output artefact — a single contract, a per-finding remediation list, an ADR, a PDR, or a free-form report. → [consolidation-output-shape-pattern-vs-report.md](consolidation-output-shape-pattern-vs-report.md)
- **Contamination Scan Method** -- Use this when: A plan, report, or memory estate may contain contaminated current-truth claims and needs a repeatable scan that separates live residue from historical mention. → [contamination-scan-method.md](contamination-scan-method.md)
- **cross-branch-consolidation-re-derive-full-workstream** -- Use this when: Consolidating a lane or workstream from one branch onto another — drive completeness from the workstream's full definition (code plus the activating skills, rules, tests, and lessons), not just the source files you copied across. → [cross-branch-consolidation-re-derive-full-workstream.md](cross-branch-consolidation-re-derive-full-workstream.md)
- **Cross-Session Pattern Emergence** -- Use this when: Running consolidation after multiple sessions on the same workstream, or when a user observes that insights from separate sessions form a larger picture. → [cross-session-pattern-emergence.md](cross-session-pattern-emergence.md)
- **Crosswalk Before Reconciling Drifted Docs** -- Use this when: Two documents appear to conflict (an older brief vs a ratified plan, two doctrine surfaces describing one mechanism) and the tempting move is a bulk rewrite of one to match the other. → [crosswalk-before-reconciling-drifted-docs.md](crosswalk-before-reconciling-drifted-docs.md)
- **Current Plan Promotion** -- Use this when: A review or planning pass has resolved 'what comes next' and the repo needs a concrete next-session entry point rather than a mere intended future direction. → [current-plan-promotion.md](current-plan-promotion.md)
- **Deferred-at-Write-Time Is an Unmade Load-Bearing Decision** *(anti-pattern)* -- Use this when: A plan or design defers a substantive decision to implementation time ("decide at write time", "the cycle author chooses", "TBD in the implementation slice") — check whether the deferral is real flexibility or a load-bearing decision the plan owner has declined to make. → [deferred-at-write-time-is-unmade-load-bearing-decision.md](deferred-at-write-time-is-unmade-load-bearing-decision.md)
- **Delivering a Reframing Is a Consumer-Walk, Not a Phrase-Sweep** -- Use this when: Delivering a reframing, supersession, rename, or any conceptual change across a documentation / plan estate — especially after a foundational doc moves or a controlling decision changes. → [delivering-a-reframing-is-a-consumer-walk.md](delivering-a-reframing-is-a-consumer-walk.md)
- **Derived-Output Conservation** -- Use this when: Deciding what to commit from a pipeline run that produced bulk generated outputs alongside unique source material. → [derived-output-conservation.md](derived-output-conservation.md)
- **Diff-Context Review Misses the Frame Above the Hunk** *(anti-pattern)* -- Use this when: Repeatedly editing one long entry, record, or section across a session (status lines, continuity entries, batch records) — before each commit, and when reviewing a diff whose hunks sit inside a larger semantic unit. → [diff-context-review-misses-the-frame-above-the-hunk.md](diff-context-review-misses-the-frame-above-the-hunk.md)
- **Disambiguate an Overloaded Term Before Canonicalising or Sweeping** -- Use this when: Defining a canonical list for a term, running a find-and-replace sweep, or collapsing a classification axis — any time one label is about to be treated as one thing. → [disambiguate-overloaded-term-before-canonicalising.md](disambiguate-overloaded-term-before-canonicalising.md)
- **Dissolve the Need Before Exempting a Safety Rule** -- Use this when: A fix appears to require an exemption from a hard safety rule (never-use-git-to-remove-work, the verify-skip flag, a destructive-op guard) — before self-ratifying or escalating the exemption, seek a redesign that dissolves the need for the dangerous operation entirely. → [dissolve-the-need-before-exempting-a-safety-rule.md](dissolve-the-need-before-exempting-a-safety-rule.md)
- **Dogma Vocabulary Closes Inquiry** *(anti-pattern)* → [dogma-vocabulary-closes-inquiry.md](dogma-vocabulary-closes-inquiry.md)
- **Domain Specialist Has Final Say on SDK Semantics** -- Use this when: Architecture reviewers make assumptions about SDK-specific behaviour (scope models, handler ordering, API semantics) that have not been verified against official documentation. → [domain-specialist-final-say.md](domain-specialist-final-say.md)
- **end-goals-over-means-goals** → [end-goals-over-means-goals.md](end-goals-over-means-goals.md)
- **evidence-before-classification** → [evidence-before-classification.md](evidence-before-classification.md)
- **Findings Route to a Lane or a Rejection** → [findings-route-to-lane-or-rejection.md](findings-route-to-lane-or-rejection.md)
- **Fix at source, not consumer** -- Use this when: Multiple workaround attempts fail at the consumer because the producer's type/function/interface is wrong. → [fix-at-source-not-consumer.md](fix-at-source-not-consumer.md)
- **fix-the-class-through-the-revealing-lens** -- Use this when: A fix addresses a class of defect, not one incident — before declaring it done, enumerate the other members of the class and run the lens (fresh checkout, CI, cold start) that reveals them; the instance you saw is visible in the lens you already have, the others often are not. → [fix-the-class-through-the-revealing-lens.md](fix-the-class-through-the-revealing-lens.md)
- **Fluency Is a Failure Vector** *(anti-pattern)* -- Use this when: A move, justification, or framing arrives smoothly — a local convention obvious to match, an owner statement that seems to license a shortcut, an 'of course X' framing, or a claim that simply feels true. → [fluency-is-a-failure-vector.md](fluency-is-a-failure-vector.md)
- **Foundations Before Consumers in Multi-Emitter Plans** -- Use this when: sequencing a plan with N parallel consumer lanes that share a foundation (a schema contract, an ESLint rule, an extracted core). The foundation must land in an earlier wave than any consumer that depends on it, or every consumer retrofits. → [foundations-before-consumers.md](foundations-before-consumers.md)
- **Frame-Free Absolutes Are Unhandled Cases** *(anti-pattern)* -- Use this when: Authoring or citing any categorical statement in doctrine, tickets, TSDoc, or review dispositions — 'all', 'never', 'without exception', 'the only sound shape' — and whenever a review loop keeps generating findings against categorical estate text. → [frame-free-absolutes-are-unhandled-cases.md](frame-free-absolutes-are-unhandled-cases.md)
- **Glanceable Surfaces: Show a Token Only When It Diverges** -- Use this when: Designing or editing a status surface (statusline, dashboard, badge row) that shows two related facts side by side. → [glanceable-surface-divergence-only-display.md](glanceable-surface-divergence-only-display.md)
- **Green Parts, Red Composition** *(anti-pattern)* -- Use this when: Changing any mechanism whose OUTPUT another mechanism consumes (rulesets, release automation, build caches, ignore scripts, codegen), or diagnosing a silent production/pipeline failure where every individual component reports healthy. → [green-parts-red-composition.md](green-parts-red-composition.md)
- **Ground Before Framing** → [ground-before-framing.md](ground-before-framing.md)
- **Harness Shell and Commitlint Edge Cases** -- Use this when: Driving the Bash/harness shell or composing a merge/commit message and hitting a surprising failure. → [harness-shell-and-commit-edge-cases.md](harness-shell-and-commit-edge-cases.md)
- **Hook as Question Not Obstacle** → [hook-as-question-not-obstacle.md](hook-as-question-not-obstacle.md)
- **In-Session Contract Authoring Conditions** -- Use this when: A plan has just landed that proposes a new contract / directive / governance doc and the question is whether to author the contract in the same session or sequence it to a fresh session. → [in-session-contract-authoring-conditions.md](in-session-contract-authoring-conditions.md)
- **Inherited Framing Without First-Principles Check** *(anti-pattern)* -- Use this when: About to execute a plan body, rewrite an existing artefact, or translate an "old X to new X" — before writing code, tests, or doctrine, check whether the inherited shape is the right shape for the behaviour being proven. → [inherited-framing-without-first-principles-check.md](inherited-framing-without-first-principles-check.md)
- **Install-Session Blind to Cold-Start Gaps** *(anti-pattern)* → [install-session-blind-to-cold-start-gaps.md](install-session-blind-to-cold-start-gaps.md)
- **Judge a Capability by Its KIND's Criterion; Your Own Position Is a Possession Too** -- Use this when: Evaluating whether a capability, tool, rule, or guard 'works' — especially one you built or one you are the loudest critic of. → [judge-capability-by-its-kind.md](judge-capability-by-its-kind.md)
- **Judge Usefulness From the Current Process, Never From Existence, Usage History, or Provenance** *(anti-pattern)* -- Use this when: Asked whether a surface, rule, process, or artefact is useful — and reaching for usage history ('never instantiated', 'was retired'), the past decision that created it ('PDR-X defines it'), or mere existence, instead of present need. → [judge-usefulness-from-current-process.md](judge-usefulness-from-current-process.md)
- **Learning Before Fitness** -- Use this when: >-. → [substance-before-fitness.md](substance-before-fitness.md)
- **Long-Arc Finish-Line, Not Tail** -- Use this when: A multi-session arc (Practice/tooling, observability, large refactor, multi-phase plan) is mid-flight and the next-session record is being authored or refreshed. → [long-arc-finish-line-not-tail.md](long-arc-finish-line-not-tail.md)
- **Many Pairwise Links Mean One Unnamed Lever** -- Use this when: You notice yourself drawing a third (or later) pairwise cross-link between insights, artefacts, or plans in the same analysis. → [many-pairwise-links-mean-one-unnamed-lever.md](many-pairwise-links-mean-one-unnamed-lever.md)
- **Mechanical Sequence Is the Activity-Bias Diagnostic, Not Its Justification** *(anti-pattern)* -- Use this when: A sequence of tool calls, edits, dispositions, or commits has become procedurally identical and the impulse is to continue because each step is "easy. → [mechanical-sequence-is-activity-bias-diagnostic.md](mechanical-sequence-is-activity-bias-diagnostic.md)
- **migrate-dont-drop-on-deletion** -- Use this when: About to delete a directory or collection (a staging/holding pen, a 'to-supersede' area, a cleanup) — verify per-file whether each item is live forward-intent (migrate to its value-home) or genuinely spent (drop); on any judgment call, migrate, because deletion is the only irreversible move. → [migrate-dont-drop-on-deletion.md](migrate-dont-drop-on-deletion.md)
- **Monotonic Counter Is Not a Quality Indicator** *(anti-pattern)* -- Use this when: Comparing two versions of a document or artefact that each carry a sequence counter. → [monotonic-counter-is-not-quality-indicator.md](monotonic-counter-is-not-quality-indicator.md)
- **Multi-Writer Landing Order: Deletion-Bearing Bundles Commit First** -- Use this when: Multiple lanes share one checkout (or one estate gate) and any lane's work-in-progress DELETES a tracked file — and commits are queuing. → [multi-writer-landing-order.md](multi-writer-landing-order.md)
- **Nothing Unplanned Without a Promotion Trigger** → [nothing-unplanned-without-a-promotion-trigger.md](nothing-unplanned-without-a-promotion-trigger.md)
- **Over-Caution's Root Is Perfectionism; the Cure Is the Frame, Not Willpower** *(anti-pattern)* -- Use this when: Noticing hesitation, deferral dressed as prudence, repeated re-litigation of a decision, or 'I'll surface this rather than decide it' — especially when the work is yours to decide and the lenses give an answer. → [over-caution-root-is-perfectionism.md](over-caution-root-is-perfectionism.md)
- **Parsing Parallel/Interleaved Tool Output: Key by a Stable Prefix, Cross-Check Sums** -- Use this when: Parsing stateful logs from a concurrent/interleaved runner — turbo, a parallel test runner, multi-workspace gate output — to attribute lines to a source. → [parsing-parallel-tool-output-key-by-prefix.md](parsing-parallel-tool-output-key-by-prefix.md)
- **Plan-as-Artefact Gravity; Archive and Replace When the Plan Body Becomes a Self-Referential Document** *(anti-pattern)* -- Use this when: A remediation plan has accumulated multiple session-history sections, re-grounding tables, and re-classification amendments while the gates it targets remain red. → [plan-as-artefact-gravity.md](plan-as-artefact-gravity.md)
- **PR Delivery: Monitor to Merge, Flat Stacks, Pure Diffs** -- Use this when: Opening a pull request, choosing the base for a dependent change, or resolving merge conflicts that touch shared registry state. → [pr-monitor-to-merge.md](pr-monitor-to-merge.md)
- **Pre-implementation plan review** → [pre-implementation-plan-review.md](pre-implementation-plan-review.md)
- **Preserve the Value-Rationale (Why-It-Matters) at Handoff, Not Only the What and How** -- Use this when: Completing a plan, writing a handoff record, or graduating work to a permanent home — any point where served user-stories or design intent are about to be summarised. → [preserve-value-rationale-at-handoff.md](preserve-value-rationale-at-handoff.md)
- **Process With No Committed Assets** *(anti-pattern)* -- Use this when: A stretch of work is producing deliberation, coordination, plans-about-plans, or doctrine-about-doctrine — and no committed product, test, or homed-knowledge asset has landed. → [process-with-no-committed-assets.md](process-with-no-committed-assets.md)
- **Prove the Checker With an In-Repo Deliberate-RED Negative Control** -- Use this when: Trusting any targeted checker run — a lint over specific paths, an advisory commit-message check, a one-off validator invocation — especially when the result is green. → [prove-the-checker-with-a-negative-control.md](prove-the-checker-with-a-negative-control.md)
- **Quote Authoritative Language Exactly** *(anti-pattern)* -- Use this when: Restating mission, vision, licence, owner-stated, or other protected / authoritative source language in a doc, summary, or prose passage. → [quote-authoritative-language-exactly.md](quote-authoritative-language-exactly.md)
- **Re-evaluate removal conditions on workarounds** → [re-evaluate-removal-conditions.md](re-evaluate-removal-conditions.md)
- **Read, Not Grep/Bash, for a Faithful Read of Source** -- Use this when: Reading load-bearing source content through a Bash/grep pipeline and the output looks mangled, masked, or suspiciously collapsed. → [read-not-grep-for-faithful-source.md](read-not-grep-for-faithful-source.md)
- **README as Index** -- Use this when: A plan-directory README is growing to contain session instructions, outcome narratives, or design rationale that duplicates or replaces .plan.md content. → [readme-as-index.md](readme-as-index.md)
- **Recital Loses to Recipe Momentum** *(anti-pattern)* → [recital-loses-to-recipe-momentum.md](recital-loses-to-recipe-momentum.md)
- **Referent Narrowing** *(anti-pattern)* -- Use this when: Constructing ANY filter, gate, predicate, monitor, or verdict that keys on an instrument's signal (an exit code, an API status, a state field, a green check); and at any decision moment resting on a SINGLE source — before acting, name what the signal actually reports on and add one independent witness. → [referent-narrowing.md](referent-narrowing.md)
- **Reframing Before Hardening** → [reframing-before-hardening.md](reframing-before-hardening.md)
- **Relayed Findings Carry the Inference, Not the Observation** *(anti-pattern)* -- Use this when: Recording a measurement for another seat, or acting on a finding you did not measure yourself — especially one that has already passed through two or more seats and reads as settled. → [relayed-findings-carry-the-inference-not-the-observation.md](relayed-findings-carry-the-inference-not-the-observation.md)
- **Removing a Constraint Surfaces What It Was Also Bounding** -- Use this when: About to delete or relax a constraint (a count cap, a size limit, a timeout, a gate) because it causes one visible problem. → [removing-a-constraint-surfaces-what-it-also-bounded.md](removing-a-constraint-surfaces-what-it-also-bounded.md)
- **Repair workflow contract clarity** -- Use this when: A workflow repairs or transforms the same content across multiple artefacts or locations, and ambiguous verbs could trigger rewrite or promotion drift. → [repair-workflow-contract-clarity.md](repair-workflow-contract-clarity.md)
- **Research That Contradicts Another Thread's Decision Needs an Explicit Cross-Thread Surfacing Step** -- Use this when: A piece of research, a report, or a finding in one thread reaches a conclusion that contradicts or bears on a pending/ratified decision living in a DIFFERENT thread. → [cross-thread-surfacing-for-contradicting-findings.md](cross-thread-surfacing-for-contradicting-findings.md)
- **Respect Live Claims; Self-Start Once the Baton Is Yours** -- Use this when: Deciding whether to begin work under a goal/Stop-hook pressure when another agent holds a claim, or whether to wait for an explicit 'go' once a goal has been handed to you. → [live-claim-respect-and-self-start.md](live-claim-respect-and-self-start.md)
- **Reversing a Decision Recorded in Several Places Needs a Whole-Document Sweep** -- Use this when: Dropping, reversing, or superseding a decision that a document (ADR, plan, README, spec) records or references in more than one place. → [whole-document-sweep-on-decision-reversal.md](whole-document-sweep-on-decision-reversal.md)
- **Review Artefacts Must Render the Assembled Whole, Machine-Rendered** -- Use this when: Authoring a review artefact (an audit, a registry snapshot, a "here is what the system produces" report) over content that is delivered as a cohesive assembled whole (composed server instructions, rendered UI, a built document) rather than as independent fragments. → [review-artefacts-must-render-the-assembled-whole.md](review-artefacts-must-render-the-assembled-whole.md)
- **Review Intentions, Not Just Code** → [review-intentions-not-just-code.md](review-intentions-not-just-code.md)
- **Scope as Goal** *(anti-pattern)* → [scope-as-goal.md](scope-as-goal.md)
- **Scope-Bound Negative-Existence Claims** *(anti-pattern)* -- Use this when: About to accept a "does not exist" / "nothing to update" / "no matches" verdict — from your own search, a peer's search, or a reviewer's clearance — before treating the absence as settled, check what scope the verdict actually swept. → [scope-bound-negative-existence-claims.md](scope-bound-negative-existence-claims.md)
- **Scoped Gitignore for Colliding Directory Names** -- Use this when: Adding or tightening `.gitignore` rules for a generically named directory (`reference`, `data`, `output`, `tmp`) and more than one subtree uses that name for different purposes. → [scoped-gitignore-for-colliding-directory-names.md](scoped-gitignore-for-colliding-directory-names.md)
- **Shared Strictness Requires Workspace Adoption** -- Use this when: A repo has landed a root strictness or gate foundation and it is tempting to treat the shared config itself as completion before every claimed participant actually composes it and passes under it. → [shared-strictness-requires-workspace-adoption.md](shared-strictness-requires-workspace-adoption.md)
- **Shared-State Topology Is a Coordinator Question, Not a Solo-Archaeology One** *(anti-pattern)* -- Use this when: You need to know who owns a shared artefact, which branch carries the canonical buffer/coordination state, or where live shared state lives — and you are not the coordinator/Director. → [shared-state-topology-is-a-coordinator-question.md](shared-state-topology-is-a-coordinator-question.md)
- **Source-first adopt-or-explain evaluation** -- Use this when: Evaluating whether an existing dependency's utilities should replace hand-rolled code. → [source-first-adopt-or-explain.md](source-first-adopt-or-explain.md)
- **Stage What You Commit, Commit What You Staged** -- Use this when: about to run `git commit` with unrelated changes visible in `git status` — the index may carry work the commit message does not describe. → [stage-what-you-commit.md](stage-what-you-commit.md)
- **State the Positive Understanding the Reader Needs, Not Your Own Correction Path** -- Use this when: Authoring or revising any artefact (doc, comment, copy, message) after you were corrected or changed your mind about it. → [state-positive-understanding-not-correction-path.md](state-positive-understanding-not-correction-path.md)
- **Static Analysers Want Shape Changes and Can Report Stale Results** -- Use this when: Fixing a finding from CodeQL, SonarCloud, dependency-cruiser, markdownlint, or knip — or diagnosing why one of them reports nothing / something that no longer exists. → [static-analyser-shape-vs-runtime-and-staleness.md](static-analyser-shape-vs-runtime-and-staleness.md)
- **Static Analysis Registration With Scaffold** -- Use this when: >-. → [static-analysis-registration-with-scaffold.md](static-analysis-registration-with-scaffold.md)
- **Templates Can Institutionalise Failure Modes; Doctrine and Template Update Together** *(anti-pattern)* -- Use this when: Sharpening a doctrine, principle, or rule that flows through templates, scaffolds, or generators that produce future plans or artefacts. → [templates-encode-failure-modes.md](templates-encode-failure-modes.md)
- **The Frame Was the Fix** *(anti-pattern)* -- Use this when: Reaching for the obvious / mechanical / enforcement-shaped tool to address a failure mode (locks, refusals, mechanical gates, hardening against review findings); or absorbing reviewer findings as binding work-items by default; or feeling that fixing the visible surface will close the issue. → [the-frame-was-the-fix.md](the-frame-was-the-fix.md)
- **The One-Clause-of-Many Truing Trap** *(anti-pattern)* -- Use this when: About to true a stale fact that lives inside a large record (a table cell, a multi-sentence paragraph, an identity column) — before declaring the truing done, check whether the old state is asserted anywhere else in the same record. → [one-clause-of-many-truing-trap.md](one-clause-of-many-truing-trap.md)
- **The Surface You Read Is Not the Surface That Decides** *(anti-pattern)* -- Use this when: About to act on a proxy reading — a client tool's verdict, a parsed/derived view, a validation environment, a liveness signal, a downstream approval — in place of the surface that actually decides the outcome. → [read-surface-is-not-decide-surface.md](read-surface-is-not-decide-surface.md)
- **Three Levels of Reference Quality** -- Use this when: Documentation, portable content, or cross-repo material references concepts from another context — choose the right level of self-containment. → [three-levels-of-reference-quality.md](three-levels-of-reference-quality.md)
- **Tool Error as Question** → [tool-error-as-question.md](tool-error-as-question.md)
- **Tool Output Framing Bias** *(anti-pattern)* -- Use this when: building a plan from a single tool run and the tool's groupings, counts, or categories are being adopted as plan structure without independent verification. → [tool-output-framing-bias.md](tool-output-framing-bias.md)
- **Tool-Default Scan-Set Drift** *(anti-pattern)* -- Use this when: Citing any sweep, search, or lint result — including a healthy non-empty one — without stating the file-selection semantics that defined the set the tool actually visited (dot-directories, .gitignore handling, hidden files). → [tool-default-scan-set-drift.md](tool-default-scan-set-drift.md)
- **Under Context Pressure, Offload the Breadth; Keep the Design Verdict and the Loss-Scan Yourself** -- Use this when: A deep-context session is running low on budget but still has high-value work to land — reviewing, drafting, mechanical edits, gate runs. → [offload-breadth-keep-verdict-and-loss-scan.md](offload-breadth-keep-verdict-and-loss-scan.md)
- **UX predates visual design** → [ux-predates-visual-design.md](ux-predates-visual-design.md)
- **Vendor-Doc Review for Unknown Unknowns** -- Use this when: >-. → [vendor-doc-review-for-unknown-unknowns.md](vendor-doc-review-for-unknown-unknowns.md)
- **Verification Method Must Answer the Question** *(anti-pattern)* -- Use this when: About to declare content conserved/absent/landed, a capture branch safe to merge, or a review surface fully read, on the strength of a diff, grep, or bounded API read. → [verification-method-must-answer-the-question.md](verification-method-must-answer-the-question.md)
- **verify-before-propagating** → [verify-before-propagating.md](verify-before-propagating.md)
- **Visibility Before Validation** -- Use this when: About to build a validator, guard, or scanner over a surface whose current shape accumulated organically rather than by deliberate design. → [visibility-before-validation.md](visibility-before-validation.md)
- **Warning Severity Is Off Severity** *(anti-pattern)* -- Use this when: Setting or reviewing lint rule severity, especially when considering 'warn' as a transitional step toward 'error'. → [warning-severity-is-off-severity.md](warning-severity-is-off-severity.md)
- **When \"Don't Fragment\" Meets New-in-Kind Work, the New Vessel Is the Non-Fragmenting Shape** -- Use this when: The \"consolidate the estate / don't fragment the plan estate\" reflex points at folding new work into an existing plan, doc, or artefact — check first whether the work differs in KIND before folding. → [new-vessel-for-new-kind.md](new-vessel-for-new-kind.md)
- **When External Research Flatters the Repo, the Value Is in the Divergence** -- Use this when: Comparing the repo/Practice against authoritative external research, a benchmark, or a best-practice source. → [spend-effort-on-the-divergence.md](spend-effort-on-the-divergence.md)
- **Wrapped Exit Codes False-Green** *(anti-pattern)* -- Use this when: Reading success from any piped, redirected, background-wrapped, or hook-bannered invocation — especially git push, aggregate gate runs, and collaboration-CLI writes. → [wrapped-exit-codes-false-green.md](wrapped-exit-codes-false-green.md)

### Testing (15)

- **A Compile-Time-Only Helper Has No Standalone Runtime Test — Co-Land It With Its First Consumer** -- Use this when: Authoring a helper whose entire value is a compile-time guarantee (exhaustiveness, type narrowing) and TDD pressure wants a standalone unit test for it before any consumer exists. → [compile-time-helper-lands-with-consumer.md](compile-time-helper-lands-with-consumer.md)
- **Accessibility as a Blocking Gate** -- Use this when: A project ships user-facing HTML and needs to prove WCAG compliance automatically. → [accessibility-as-blocking-gate.md](accessibility-as-blocking-gate.md)
- **circular-test-justification** *(anti-pattern)* → [circular-test-justification.md](circular-test-justification.md)
- **Conformance tests for library adoption** -- Use this when: Replacing hand-rolled code with a library import and keeping existing unit tests. → [conformance-tests-for-library-adoption.md](conformance-tests-for-library-adoption.md)
- **Dont Test Sdk Internals** → [dont-test-sdk-internals.md](dont-test-sdk-internals.md)
- **Hydration State Pinning: Any Check Against a Progressively-Enhanced Page Must Pin Which Enhancement State It Measures** -- Use this when: Writing or trusting any capture, measurement, interaction proof, accessibility scan, or fidelity check against a page that hydrates (SSR + client JS) — a fast run otherwise races the hydration boundary and measures an arbitrary state. → [hydration-state-pinning.md](hydration-state-pinning.md)
- **Interface Segregation for Test Fakes** -- Use this when: Test fakes cannot satisfy a complex generated type without type assertions. → [interface-segregation-for-test-fakes.md](interface-segregation-for-test-fakes.md)
- **Plain-Node Built-Artefact Proof** -- Use this when: A service runs source through tsx, Vite, or another dev loader locally but ships built JavaScript under plain Node, and dev success may mask production-startup defects. → [plain-node-built-artifact-proof.md](plain-node-built-artifact-proof.md)
- **Red-First Test With a Wrong Oracle** *(anti-pattern)* -- Use this when: Writing a red-first test for a cure, reviewing one, or trusting a green cure-test as evidence the cure works — especially when the test's input model came from the same belief that produced the defect. → [red-first-test-with-a-wrong-oracle.md](red-first-test-with-a-wrong-oracle.md)
- **Result-Seam So Test Fakes Need Not Throw** -- Use this when: Testing an error path that wraps a throwing dependency (execFileSync, a path resolver, a vendor call), and a throwing test-fake would trip the no-throw warn rule — lift the seam to return Result and translate the throw at the single real boundary, so the fake returns err() and never throws. → [result-seam-so-test-fakes-need-not-throw.md](result-seam-so-test-fakes-need-not-throw.md)
- **satisfies for Mock Completeness** -- Use this when: A test mock implements an interface and you need compile-time proof that all methods are present. → [satisfies-for-mock-completeness.md](satisfies-for-mock-completeness.md)
- **Test Complexity Signals Wrong Level** *(anti-pattern)* -- Use this when: A test requires elaborate scaffolding (type predicate hacks, mock capture arrays, wrapper functions, eslint-disable) to reach the code under test. → [test-complexity-signals-wrong-level.md](test-complexity-signals-wrong-level.md)
- **Test Coverage Review Lens** -- Use this when: Reviewing the test surface around a product feature — auditing an `.e2e.test.ts` or `.integration.test.ts` file, triaging a flaky test suite, or deciding what coverage to keep when collapsing a feature's tests after refactor. → [test-coverage-review-lens.md](test-coverage-review-lens.md)
- **test-claim-assertion-parity** → [test-claim-assertion-parity.md](test-claim-assertion-parity.md)
- **Views Take State as Props; a Two-Line Binder Owns the Hook** -- Use this when: A React component both fetches/derives async state (via a hook) and renders it — and its tests are reaching for vi.mock, module mocking, or fetch stubbing to control what renders. → [view-binder-di-seam.md](view-binder-di-seam.md)

### Agent (44)

- **A Real Observation That Does Not Bear on the Claim** *(anti-pattern)* -- Use this when: About to cite a first-hand observation as evidence for a config, mechanism, or state claim — especially when the surface you read reports a DERIVED value, or when the observation was made some time before the action it licenses. → [observation-that-does-not-bear-on-the-claim.md](observation-that-does-not-bear-on-the-claim.md)
- **Adversarial-Verify Plus a Self-Pass Over the Verifier's Own Downgrades** -- Use this when: Running a multi-agent verification or triage round (fleet review, adversarial-verify, open-question triage) and about to accept the verifier's/triage-agent's confirmed set as the complete result. → [adversarial-verify-plus-self-pass-on-refutations.md](adversarial-verify-plus-self-pass-on-refutations.md)
- **Agentic Surface Separation** -- Use this when: Designing or refactoring agent infrastructure that spans skills, rules, commands, subagents, or platform adapters. → [agentic-surface-separation.md](agentic-surface-separation.md)
- **Amending Doctrine Binds the Editor** *(anti-pattern)* -- Use this when: Editing any skill, rule, directive, or governance doc while running live work the same document governs. → [amending-doctrine-binds-the-editor.md](amending-doctrine-binds-the-editor.md)
- **Audit Rule Body When Extending With a New Prohibition** -- Use this when: Adding a new "X is forbidden" / "X must not appear" / "do not Y" clause to an existing rule, ADR, governance doc, or directive. → [audit-rule-body-on-prohibition-extension.md](audit-rule-body-on-prohibition-extension.md)
- **Bounded Structured Output for Workflow Fan-Outs** -- Use this when: Authoring a Workflow script that uses agent({schema}) fan-out, passing args into it, or consuming its verify-stage results. → [bounded-structured-output-for-workflows.md](bounded-structured-output-for-workflows.md)
- **Collaboration-CLI Interface Drift** *(anti-pattern)* -- Use this when: Composing any collaboration-CLI invocation from help text or skill prose alone, or reading a non-zero exit after a CLI write as proof the write failed. → [collaboration-cli-interface-drift.md](collaboration-cli-interface-drift.md)
- **Cure-Edge Residue** *(anti-pattern)* -- Use this when: Curing any finding on an invariant the estate states in more than one place, or executing a deletion cure whose disposition claims the content was re-homed. → [cure-edge-residue.md](cure-edge-residue.md)
- **Deleting an Operational Memory/State Surface → Reconcile the Substrate-Contracts Manifest in the Same Commit** -- Use this when: Retiring or deleting an operational memory or state surface (a directory, register, or convention) that may have a contract entry in the PDR-049/050 substrate manifest. → [reconcile-substrate-manifest-on-surface-deletion.md](reconcile-substrate-manifest-on-surface-deletion.md)
- **Different-Lens Reviewer Divergence** → [different-lens-reviewer-divergence.md](different-lens-reviewer-divergence.md)
- **Eager Rounding-Off on Partial Structures Under Failure Pressure** *(anti-pattern)* -- Use this when: An enforcer fires (gate, hook, scanner, validator, lint, type-check) and the proposed response involves bypass, "doctrinal collision", or any framing that lets work proceed past the signal — check whether the agent has rounded a partial structure into a whole structure and constructed a problem that does not exist. → [eager-rounding-off-on-partial-structures.md](eager-rounding-off-on-partial-structures.md)
- **Enforce via Schema, Don't Enumerate in Prose, for Vendor Surfaces** -- Use this when: A document re-lists the fields, enums, or values of a fast-moving external/vendor specification (platform frontmatter, an API's accepted parameters, a config surface) so an agent can author against it — and the spec keeps changing underneath the prose. → [enforce-via-schema-not-prose-for-vendor-surfaces.md](enforce-via-schema-not-prose-for-vendor-surfaces.md)
- **Event Awareness Is Not Convergence Ownership** *(anti-pattern)* -- Use this when: You are waiting on an external convergence loop (PR review rounds, CI, a deploy pipeline, a bot's async passes) with monitors or scheduled probes armed, and you are about to treat that awareness as owning the loop. Check whether your watch terminates only on the loop's genuine terminal states and whether anything can arrive while you sleep. → [event-awareness-is-not-convergence-ownership.md](event-awareness-is-not-convergence-ownership.md)
- **Fabricated Gate as Avoidance** *(anti-pattern)* -- Use this when: A pending-graduation entry, plan slice, or queued artefact is classified as deferred under gate-shaped vocabulary (`size: XL`, `vaporware-gated`, `sequenced-deferral pointer`, `N>=3-validation`, `dedicated-session-required`) — check whether the gate is a real epistemic / dependency / capacity constraint or a fabricated escape hatch the substance does not require. → [fabricated-gate-as-avoidance.md](fabricated-gate-as-avoidance.md)
- **Falsification Cost Determines Claim Quality** -- Use this when: Designing a quality mechanism, triaging why an estate keeps shipping wrong claims, or deciding between adding a check and making an existing check cheaper to run — and at the personal moment of wanting to assert something. → [falsification-cost-determines-claim-quality.md](falsification-cost-determines-claim-quality.md)
- **Fan Out the Verify, Gatekeep the Execute** -- Use this when: Structuring a multi-agent or workflow session that mixes verification work with irreversible or coordination-dependent moves (delete, commit, merge, reshaping shared indexes). → [fan-out-verify-gatekeeper-execute.md](fan-out-verify-gatekeeper-execute.md)
- **Feel-State of Completion Preceding Evidence of Completion** *(anti-pattern)* -- Use this when: About to mark a to-do completed, defer an item at session-handoff, raise a limit, install a tripwire, or report what landed — before the report, ask whether the evidence loop the doctrine requires has actually fired, or whether the agent's own sense of "done" is standing in for it. → [feel-state-of-completion-preceding-evidence-of-completion.md](feel-state-of-completion-preceding-evidence-of-completion.md)
- **Frozen Text Acts With False Authority** *(anti-pattern)* -- Use this when: A frozen artefact — a captured copy, an inherited record or memory, a succession snapshot, an external wrapper's framing — is about to ACT on a live surface: be committed over it, steer a seat's identity, gate a lane, or be read as overruling ratified direction. → [frozen-text-false-authority.md](frozen-text-false-authority.md)
- **Gate Sitting as Matrix-Filtered Questions** -- Use this when: An owner gate, ratification sitting, or decision packet carries many questions and the owner's live time is the scarce resource — filter the packet through the Decision Lenses and prior rulings first, then surface only the genuine survivors with recommended verdicts. → [gate-sitting-as-matrix-filtered-questions.md](gate-sitting-as-matrix-filtered-questions.md)
- **Governance Claim Needs a Scanner** -- Use this when: An ADR or governance document asserts that some property holds 'everywhere' across a set of live surfaces (one vocabulary, a required citation, a mandatory field, a platform-adapter parity), and prose alone is the only enforcement. → [governance-claim-needs-a-scanner.md](governance-claim-needs-a-scanner.md)
- **Honest Restructure Over Band-aid** -- Use this when: A quality gate fires mid-authoring and the first tempting fix is to bypass, guard, compress, or assert around the gate. → [honest-restructure-over-band-aid.md](honest-restructure-over-band-aid.md)
- **Inter-Agent Sidebar with Default Action** → [inter-agent-sidebar-with-default-action.md](inter-agent-sidebar-with-default-action.md)
- **Live Dogfooding as Directional Confirmation** -- Use this when: While building a capability, the team hits — in real time — exactly the gap or friction that capability exists to cure, and the impulse is to read the friction as a setback. → [live-dogfooding-as-directional-confirmation.md](live-dogfooding-as-directional-confirmation.md)
- **LLM Fleet Task Design — Workers Point, Dispatcher Copies; Pilot Before Dispatch** -- Use this when: Designing a fleet/workflow task whose workers must produce verbatim-anchored output verified against pinned bytes, or whose judgment procedure sits behind an existing canary/ground-truth key. → [llm-fleet-task-design-point-and-pilot.md](llm-fleet-task-design-point-and-pilot.md)
- **Mechanism Without Legible Intent** *(anti-pattern)* -- Use this when: Landing or auditing an enforcement surface (rule, hook, gate, review lens) — ask where its system-level intent is legible; when agents comply with the letter, misattribute the why to a person, or cannot derive the next rule themselves, the mechanism has outrun its intent. → [mechanism-without-legible-intent.md](mechanism-without-legible-intent.md)
- **Non-Leading Reviewer Prompts** → [non-leading-reviewer-prompts.md](non-leading-reviewer-prompts.md)
- **Owner Course-Correct Vocabulary** -- Use this when: Receiving an owner message that contains a course-correct token, or noticing a self-trigger phrase in your own draft prose; both signal a re-grounding moment that maps to a specific canonical doctrine surface. → [owner-course-correct-vocabulary.md](owner-course-correct-vocabulary.md)
- **Parallel `isolation:\"worktree\"` Dispatch Is Unreliable; Prefer Sequential** *(anti-pattern)* -- Use this when: Considering a parallel `Agent` batch with `isolation:\"worktree\"` for non-trivial work that depends on a specific branch HEAD or specific repo state. → [parallel-worktree-dispatch-unreliable.md](parallel-worktree-dispatch-unreliable.md)
- **Passive Guidance Loses to Artefact Gravity** *(anti-pattern)* -- Use this when: Designing a guardrail against an agent failure mode — choose between documented-but-not-enforced guidance (passive) and an environmentally-triggered rule, hook, or read-on-entry surface (active); passive guidance alone is a watchlist item, not a guardrail. → [passive-guidance-loses-to-artefact-gravity.md](passive-guidance-loses-to-artefact-gravity.md)
- **Peer-Commit Absorption — Third Direction Failure Mode** → [peer-commit-absorption-third-direction.md](peer-commit-absorption-third-direction.md)
- **Platform configuration is infrastructure** → [platform-config-is-infrastructure.md](platform-config-is-infrastructure.md)
- **Precedent Compounding Is the Mechanism of Entropy** *(anti-pattern)* -- Use this when: You (or a reviewer) are about to justify a shape because a landed artefact already uses it — a precedent test, a prior disposition, an allowlist entry, an established exception. Check the precedent's recorded rationale and the governing principle before reusing the shape. → [precedent-compounding-is-the-mechanism-of-entropy.md](precedent-compounding-is-the-mechanism-of-entropy.md)
- **Query the Value, Never the Lookalike** *(anti-pattern)* -- Use this when: About to use an identifier, timestamp, ref, config value, or state reading that you constructed, inherited, defaulted into, or read from a copy — rather than derived from the thing that owns it, at the moment of use. → [query-the-value-never-the-lookalike.md](query-the-value-never-the-lookalike.md)
- **Re-Derive Session-Persistent State Before Acting** -- Use this when: Any resumed turn, shared-checkout git operation, or compose moment that relies on shell cwd, checked-out branch, the staged set, the clock, or a remembered in-flight action. → [re-derive-session-persistent-state.md](re-derive-session-persistent-state.md)
- **Reciprocal Cross-Agent Reviewer Dispatch** -- Use this when: Two or more agents are landing substantive cycles in parallel on the same branch and can cheaply review each other's commits through directed comms. → [reciprocal-cross-agent-reviewer-dispatch.md](reciprocal-cross-agent-reviewer-dispatch.md)
- **Recursion-of-Doctrine Under Team-Cadence Speed** *(anti-pattern)* -- Use this when: Multi-agent team operating at high comms-event cadence (events arriving every ~30-60s); doctrine corrections firing in close temporal proximity; agents authoring under live coordination pressure. → [recursion-of-doctrine-under-team-cadence-speed.md](recursion-of-doctrine-under-team-cadence-speed.md)
- **Reviewer Widening Is Always Wrong** *(anti-pattern)* → [reviewer-widening-is-always-wrong.md](reviewer-widening-is-always-wrong.md)
- **Route Reviewers by Abstraction Layer, Not File Scope** -- Use this when: dispatching specialist reviewers on a finishing pass over a mixed code + docs + ADR lane and choosing which reviewers to invoke. → [route-reviewers-by-abstraction-layer.md](route-reviewers-by-abstraction-layer.md)
- **Scope Parsimony Is Not Discipline** *(anti-pattern)* -- Use this when: You are about to justify deferring, narrowing, or working around something by citing a scoping rule (YAGNI, consolidate-at-second-consumer, don't-extract-single-consumer, plan-scope hygiene, an external constraint) — check the rule's actual warrant before applying it, and ask the corrective question: does this thing have an independent identity worth defining, describing, and testing in isolation?. → [scope-parsimony-is-not-discipline.md](scope-parsimony-is-not-discipline.md)
- **Structural Enforcer Recursive Exclusion** *(anti-pattern)* -- Use this when: Designing a structural enforcer (hook, scanner, lint rule, regex matcher) that scans for a pathogen — vocabulary, file shape, prohibited construct, code smell — across a path scope; the cataloguing documents and tests inside that scope will trip the enforcer on themselves unless explicitly excluded. → [structural-enforcer-recursive-exclusion.md](structural-enforcer-recursive-exclusion.md)
- **Substrate-Pointer Read as Current State** *(anti-pattern)* -- Use this when: Multi-agent team with rotating roles, multiple substrate surfaces (durable files + comms-event lifecycle fields + identity-tuple fields + roster snapshots) recording state. An agent acts on a value read from one of those surfaces. Check whether the value was current at the moment of the read, or was a pointer whose freshness was last guaranteed at some earlier moment. → [substrate-pointer-read-as-current-state.md](substrate-pointer-read-as-current-state.md)
- **timing-artefact-read-as-state** *(anti-pattern)* -- Use this when: >-. → [timing-artefact-read-as-state.md](timing-artefact-read-as-state.md)
- **Untracked WIP Whole-Tree Lint Blocker** *(anti-pattern)* -- Use this when: A multi-agent workspace has untracked work-in-progress and another agent's commit or push is blocked by whole-tree quality gates. → [untracked-wip-whole-tree-lint-blocker.md](untracked-wip-whole-tree-lint-blocker.md)
- **values-enter-by-first-hand-right-frame-read** -- Use this when: >-. → [values-enter-by-first-hand-right-frame-read.md](values-enter-by-first-hand-right-frame-read.md)

### Planning (4)

- **Conditional-Trigger Framing Stalls Plans** *(anti-pattern)* -- Use this when: Authoring or reviewing plan todos, sequencing, or scope — and a step is framed as 'when X ships', 'depends on future Y', or an unscheduled 'next phase'. → [conditional-trigger-framing-stalls-plans.md](conditional-trigger-framing-stalls-plans.md)
- **Probe Deployed Surfaces Before Planning** *(anti-pattern)* -- Use this when: Authoring or reviewing any plan, owner card, or adjudication about a DEPLOYED surface (a live service, domain, auth realm, vendor integration) — before decisions or questions are drafted. → [probe-deployed-surfaces-before-planning.md](probe-deployed-surfaces-before-planning.md)
- **Structurally-Identical New Function Drops at Pre-Authoring** → [structurally-identical-new-function-pre-authoring-drop.md](structurally-identical-new-function-pre-authoring-drop.md)
- **Where the System State Is Observable at Plan-Author Time** → [where-system-state-is-observable-at-plan-author-time.md](where-system-state-is-observable-at-plan-author-time.md)

### Coordination (2)

- **Coordinator as Slice Runner When Team Capacity Is Short by One** → [coordinator-as-slice-runner-short-by-one.md](coordinator-as-slice-runner-short-by-one.md)
- **Routing Broadcast Needs Paired Claim Action** → [routing-broadcast-needs-paired-claim-action.md](routing-broadcast-needs-paired-claim-action.md)

### Coordination Architecture (1)

- **Behaviour-Nudge Pressure Design Constraints** → [behaviour-nudge-pressure-design-constraints.md](behaviour-nudge-pressure-design-constraints.md)

### Test Architecture (1)

- **Production Factories In Tests Are Ceremony Unless They ARE The Subject** *(anti-pattern)* -- Use this when: Writing or reviewing a test that imports a production factory (config loader, observability factory, SDK initialiser) to satisfy a downstream call's signature. → [production-factories-in-tests-are-ceremony.md](production-factories-in-tests-are-ceremony.md)

### Build System (3)

- **pnpm Strict Hoisting Blocks Transitive Type Resolution** *(anti-pattern)* → [pnpm-strict-hoisting-type-resolution.md](pnpm-strict-hoisting-type-resolution.md)
- **Turbo / Pre-Commit Cache False-Green** *(anti-pattern)* -- Use this when: A gate result disagrees with observed behaviour, a hook finds drift a task reported clean, or you are about to cite a cached gate run as evidence. → [turbo-cache-false-green.md](turbo-cache-false-green.md)
- **Zero-Match False-Green** *(anti-pattern)* -- Use this when: Reading success from any filtered or glob-scoped tool run — a targeted test filter, a path-scoped linter, a sweep over a file set — without confirming the filter actually matched the intended targets. → [zero-match-false-green.md](zero-match-false-green.md)

### Agent Operations (1)

- **An Observer Must See the Terminal State of What It Observes** -- Use this when: Designing or arming any watcher, monitor, poll loop, or wait — a PR watch, a CI waiter, a job poller, a peer-liveness probe — especially one that reports progress by emitting on change. → [observer-must-see-the-terminal-state.md](observer-must-see-the-terminal-state.md)
