# OpenAPI-Driven MCP Framework Plan

**Last Updated**: 2026-02-12  
**ADR**: [ADR-108: SDK Workspace Decomposition][adr-108]

## Workspace Architecture Context

This plan describes the extraction of a reusable
OpenAPI-driven framework. In the 4-workspace decomposition
defined by [ADR-108][adr-108], this plan covers:

- **Workspace 1** (Generic Pipeline): the type-gen
  framework that transforms any OpenAPI spec into SDK
  artifacts and MCP tool descriptors.
- **Workspace 3** (Generic Runtime): the "shared runtime
  package" described below maps to the generic runtime
  SDK framework.

This plan is a superset of the
[openapi-to-tooling integration plan](openapi-to-tooling-integration-plan.md),
which focuses specifically on Workspace 1. This plan
additionally covers MCP server scaffolding, shared runtime
extraction, and multi-spec validation.

[adr-108]: ../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md

## Core References

- [ADR-108: SDK Workspace Decomposition][adr-108]
- [.agent/directives/rules.md](../directives/rules.md)
- [.agent/directives/testing-strategy.md](../../.agent/directives/testing-strategy.md)

## Prerequisites

**BLOCKED**: This plan requires [SDK Workspace Separation](./sdk-workspace-separation-plan.md) (Step 1 of the 4-workspace decomposition per [ADR-108][adr-108]) to complete first.

### Why SDK Separation Must Come First

The framework extraction depends on first separating Oak's SDK into generation and runtime workspaces:

1. **Clear extraction boundary** — SDK separation identifies exactly what to extract: the `oak-curriculum-sdk-generation` workspace contains all type-gen logic that will become the framework
2. **Validated architecture** — Separation proves generation logic can operate independently, which is essential for a reusable framework
3. **Working reference** — The separated generation workspace provides a concrete, tested example of what the framework should produce
4. **Clean separation** — Distinguishes Oak-specific code (stays in runtime) from general-purpose generation logic (becomes framework)
5. **Risk reduction** — Attempting both simultaneously would mix "move and expose" with "generalize and extract," making validation much harder

### Current State (Before Separation)

```
oak-curriculum-sdk/
├── type-gen/              ← Mixed: general + Oak-specific, unclear boundaries
├── src/
│   ├── types/generated/   ← Generated artifacts
│   ├── client/            ← Oak-specific runtime
│   └── mcp/               ← Oak-specific MCP wiring
```

**Problem**: Cannot tell what's reusable vs Oak-specific. Extraction would require simultaneous refactoring.

### After SDK Separation (Prerequisite Complete)

```
oak-curriculum-sdk-generation/
├── type-gen/              ← CLEAR extraction target!
│   ├── typegen.ts         ← OpenAPI → TypeScript (general)
│   ├── zodgen.ts          ← OpenAPI → Zod (general)
│   └── typegen/mcp-tools/ ← OpenAPI → MCP tools (general)
└── src/types/             ← Generated artifacts

oak-curriculum-sdk-runtime/
├── src/client/            ← Oak-specific (not extracted)
└── src/mcp/               ← Oak-specific (not extracted)
```

**Solution**: Clean extraction boundary. The `type-gen/` directory is the framework.

### Extraction Strategy (Post-Separation)

Once SDK separation completes:

1. **Extract** `oak-curriculum-sdk-generation/type-gen/` → `openapi-mcp-framework/generators/`
2. **Add** configuration layer to make it work with any OpenAPI spec
3. **Convert** `oak-curriculum-sdk-generation` to consume the framework
4. **Validate** against Oak spec + two reference specs

**Status**: Do not begin implementation until SDK separation is complete and all its validation gates pass.

## Intent

Deliver an extensible framework that transforms any OpenAPI specification, plus a declarative configuration, into a type-safe SDK, MCP servers (STDIO and streamable HTTP), a deterministic search service, and companion MCP tooling. The framework must embody Oak’s quality standards—type generation, validation, logging, and documentation—while remaining adaptable for non-Oak ecosystems.

## Success Criteria

- **Config-driven generation**: A single configuration file produces a working SDK, MCP servers, and search service scaffolding without manual code edits beyond documented extension hooks.
- **Quality alignment**: Generated artefacts pass format, lint, type-check, unit/integration tests, build, and documentation gates with zero overrides.
- **Runtime reuse**: Shared runtime kit exposes logging, transport, auth, and tool registration factories reused across multiple generated servers.
- **Documentation completeness**: Published guides explain onboarding, extension points, CLI usage, and testing expectations for new specs.
- **Cross-spec robustness**: Framework validated against Oak’s schema and at least two non-Oak reference schemas with consistent outcomes.

## Success Metrics

- **Generation reliability**: `openapi-mcp gen-sdk` and companion commands succeed for Oak + two reference specs in ≤ 60 seconds locally and ≤ 5 minutes in CI.
- **Test coverage**: Generated SDKs achieve ≥ 85 % line coverage on unit tests; framework packages maintain ≥ 90 % TypeScript project coverage using `vitest --coverage`.
- **CI health**: Framework CI pipeline runs format → type-check → lint → test → build → docs within 12 minutes and publishes artefact checksums.
- **Doc quality**: AI+human targeted walkthrough receives zero broken links (`pnpm docs:verify` clean) and ≥ 95 % Lighthouse documentation accessibility score.
- **Adoption readiness**: Example consumers integrate the generated SDK and MCP server with < 4 hours of setup (validated via onboarding dry-run checklist).

## Milestones

| Milestone                 | Description                                                                                     | Exit Criteria                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **M1 – Foundations**      | Audit current scripts, define abstractions, and establish configuration schema plus validation. | Audit + architecture docs merged; config schema with Zod guards published alongside examples.  |
| **M2 – Runtime Kit**      | Extract shared runtime package and implement SDK generator CLI with Oak + non-Oak samples.      | Shared package exported, CLI emits compilable projects, tests green across samples.            |
| **M3 – Search & Tooling** | Scaffold search service template, MCP servers, and ensure success metrics instrumentation.      | Search scaffolding passes smoke tests, tool composition examples documented, metrics recorded. |
| **M4 – Rollout**          | Finalise documentation, CI automation, and release checklist for framework adoption.            | Usage guides published, CI templates live, rollout checklist approved.                         |

## Governance & Reporting

- **Weekly self-review**: Summarise progress against milestones, update risks, and log quality-gate outcomes per GO cadence.
- **Cross-spec council**: Before advancing past M2, host a review comparing Oak vs non-Oak outputs, capturing deltas and remediation owners.
- **Quality dashboards**: Maintain CI status board showing last successful run per sample config and surface coverage metrics.
- **Change control**: Any extension to generated artefacts must flow through configuration schema updates with accompanying documentation and tests.

## Todo List

1. ACTION: Catalogue current OpenAPI generation scripts and emitted modules, tagging each as Oak-specific or general-purpose, and summarise findings in `research/openapi-framework/audit.md`.
2. REVIEW: Self-review the audit summary to confirm every SDK script, generated artefact, and helper has a documented classification.
3. ACTION: Define target abstraction layers for SDK generation, MCP runtime, and search service, capturing interfaces, dependency boundaries, and DI requirements in `docs/architecture/openapi-framework-layers.md`.
4. REVIEW: Self-review the abstraction draft ensuring it reflects the Prime Directive and enforces single sources of truth.
5. QUALITY-GATE: Cross-check that audit and abstraction documents reference the latest code paths (`packages/sdks/oak-curriculum-sdk/`, `apps/oak-curriculum-mcp-stdio/`, `apps/oak-curriculum-mcp-streamable-http/`, `apps/oak-search-cli/`).
6. GROUNDING: Read GO.md and follow all instructions; update approach if plan or context has shifted.
7. ACTION: Design the framework configuration schema (fields for schema source, transport targets, auth strategies, search entity descriptors, optional modules) and validate it with Zod guards plus illustrative examples under `packages/openapi-mcp-framework/config/`.
8. REVIEW: Self-review the configuration schema and examples to ensure alignment with `.agent/directives/rules.md` type-safety mandates.
9. QUALITY-GATE: Execute `pnpm type-check` and `pnpm lint` focused on the new config package to guarantee rule compliance before proceeding.
10. ACTION: Document the onboarding dry-run procedure and acceptance checklist in `docs/openapi-mcp-framework/onboarding-checklist.md` to measure adoption readiness.
11. REVIEW: Self-review the onboarding checklist, verifying it covers SDK, MCP server, and search scaffolding expectations.
12. GROUNDING: Read GO.md and follow all instructions; reassess remaining tasks against updated understanding.
13. ACTION: Extract reusable runtime utilities (logging, transport wiring, auth middleware, tool registration) into a new shared package `packages/libs/mcp-server-framework/`, exposing factory functions for STDIO and streamable HTTP servers.
14. REVIEW: Self-review the shared runtime package to confirm behaviours remain covered by tests and no Oak-only assumptions leak into general abstractions.
15. QUALITY-GATE: Run targeted unit/integration tests for the shared runtime package plus lint/type-check/build to validate stability.
16. ACTION: Implement SDK generator CLI (`pnpm exec openapi-mcp gen-sdk`) that consumes the config schema, reuses existing scripts, emits namespaced outputs under `packages/generated/${target}`, and ships example configs for the Oak spec and at least two non-Oak reference specs in `packages/openapi-mcp-framework/examples/`.
17. REVIEW: Self-review the CLI ensuring generated code mirrors the current curriculum SDK structure and honours the testing strategy (tests first, unit scope).
18. GROUNDING: Read GO.md and follow all instructions; adjust subsequent tasks if new insights arise.
19. QUALITY-GATE: Run targeted unit/integration tests for generated SDK samples plus lint/type-check/build, exercising the CLI against all example configs to validate production readiness.
20. ACTION: Scaffold MCP server templates (STDIO and HTTP) using the shared runtime package, driven entirely by the config, and include baseline tests under `apps/generated-example-mcp/`.
21. REVIEW: Self-review the generated MCP servers to guarantee environment handling, tool registration, and validation match repository standards.
22. QUALITY-GATE: Execute end-to-end transport tests for the generated MCP servers (STDIO + HTTP) and capture logs for audit.
23. ACTION: Create search service scaffolding that maps config-defined entities—via descriptor definitions in the config—to ingestion scripts, index definitions, and API routes, with optional strategy hooks (e.g., lexical-only vs hybrid).
24. GROUNDING: Read GO.md and follow all instructions; capture reflections and plan adjustments before continuing.
25. REVIEW: Self-review the search scaffolding to confirm deterministic outputs, canonical URL handling, and adherence to the testing taxonomy (unit vs integration vs e2e).
26. QUALITY-GATE: Execute end-to-end smoke tests against the generated search service and its MCP wrapper to ensure contract fidelity across sample configs.
27. ACTION: Instrument success metrics (latency, coverage, CI duration, onboarding dry-run) and populate the quality dashboard in `docs/openapi-mcp-framework/metrics.md`.
28. REVIEW: Self-review metric instrumentation ensuring each success metric is observable and documented.
29. QUALITY-GATE: Validate telemetry pipelines by running the CLI and verifying metrics ingestion for Oak + non-Oak samples.
30. GROUNDING: Read GO.md and follow all instructions; confirm governance checkpoints remain relevant.
31. ACTION: Document framework usage, extension points, and testing expectations in `docs/openapi-mcp-framework/usage-guide.md`, including walkthroughs for generating higher-level tools.
32. REVIEW: Self-review documentation for clarity, British spelling, and strict alignment with rules and testing strategy references.
33. QUALITY-GATE: Run `pnpm docs:verify` and Lighthouse checks for documentation accessibility, recording results.
34. ACTION: Compile final rollout checklist covering release versioning, CI integration (including automated quality-gate runs), and migration guidance for existing Oak curriculum servers in `docs/openapi-mcp-framework/rollout.md`.
35. REVIEW: Self-review the rollout checklist to ensure every required quality gate, documentation update, and migration step is tracked.
36. GROUNDING: Read GO.md and follow all instructions; prepare for final validation and governance sign-off.
37. ACTION: Conduct governance sign-off meeting (self-review log) summarising milestone completion, success metrics, and outstanding risks, storing minutes in `docs/openapi-mcp-framework/governance-log.md`.
38. REVIEW: Publish the sign-off summary and update plan status to reflect completion and next-phase recommendations.
39. QUALITY-GATE: Perform full quality gate sequence (format, type-check, lint, test, build, docs) on framework packages and generated artefacts, and verify the CI pipeline executes the same gates, recording outcomes in project logs.

## Risks & Mitigations

- **Scope creep**: Strictly anchor tasks to config-driven generation; defer optional enhancements to follow-up plans.
- **Schema divergence**: Maintain cross-spec contract tests and nightly schema fetch checks to catch upstream changes early.
- **Testing debt**: Embed generated test suites and enforce coverage thresholds before accepting CLI outputs.
- **Adoption friction**: Use onboarding dry-run results to iterate on docs and defaults before public release.

## Reporting Cadence

- Update this plan after each grounding step with progress notes and scope adjustments.
- Record quality-gate outcomes and reflections in collaboration logs and `docs/openapi-mcp-framework/metrics.md`.
- Maintain a running changelog of framework artefacts and sample configs to ease downstream upgrades.
