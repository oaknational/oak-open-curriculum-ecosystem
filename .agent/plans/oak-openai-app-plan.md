# Oak OpenAI App Implementation Plan

## Context and References

- Aligns with the [OpenAI App Developer Guidelines](https://developers.openai.com/apps-sdk/app-developer-guidelines) requirements across purpose, safety, privacy, and verification.
- Must comply with `.agent/directives-and-memory/rules.md` (Cardinal type rule, no type shortcuts, British spelling) and `docs/agent-guidance/testing-strategy.md` (TDD-first, behaviour-focused proofs).
- Builds on existing MCP infrastructure (`apps/oak-curriculum-mcp-stdio`, `apps/oak-curriculum-mcp-streamable-http`, `apps/oak-notion-mcp`) and the compile-time generated SDK at `packages/sdks/oak-curriculum-sdk`.

## Current State Assessment

1. **Tooling foundation**: MCP servers already expose curriculum tools generated from the Open Curriculum OpenAPI schema via `pnpm type-gen`, satisfying deterministic type flow and validation.
2. **Transport coverage**: STDIO and streaming HTTP transports exist, offering compatibility with connector hosts that the Apps SDK can reach.
3. **Testing posture**: Behaviour-focused unit, integration, and E2E suites exist per the testing strategy but require extension for Apps SDK UX flows.
4. **Documentation**: Internal guidance exists (`.agent/reference-docs/openai-apps-sdk-guidance.md`, `docs/architecture/README.md`), yet there is no end-to-end app submission playbook.

## Implementation Phases

### Broad Architecture Outline

- **Primary endpoint**: Adapt `apps/oak-curriculum-mcp-streamable-http` as the sole upstream service, exposing HTTPS-accessible MCP transport without creating new compatibility layers, keeping all tool metadata sourced from `pnpm type-gen` outputs.
- **Apps SDK surface**: App manifest presents Oak curriculum exploration and lesson-planning workflows only; each action composes existing curriculum tools so outputs cite resource IDs, curriculum stages, and evidence statements.
- **Pedagogical rigor**: Lesson planning flow sequenced as curriculum alignment → objectives → activities → assessment; every step cites specific Oak resources, guaranteeing traceability.
- **Authentication stance**: Development mode operates unauthenticated (read-only). Architecture leaves an optional Oak OAuth gateway hook for production, wired as a transport-level middleware issuing scoped tokens.
- **State model**: Requests remain stateless, recomputing artifact drafts on demand. Architecture notes a future extension point for persistence if justified by user benefit, keeping the initial build free from storage concerns.
- **Observability**: Reuse existing MCP logging pipeline, extending with Apps SDK telemetry that records resource references but excludes sensitive learner data, respecting privacy guidance.
- **Type generation**: Apps SDK manifests, tool definitions, type guards, constants, and Zod validators are emitted during `pnpm type-gen`, extending the existing SDK generator so no runtime or hand-written schemas are introduced.

### Phase 0 — POC Spike (Technical Only)

- Deploy `apps/oak-curriculum-mcp-streamable-http` to a public HTTPS endpoint (e.g. Vercel) and verify `/mcp` is reachable in unauthenticated mode.
- Extend the compile-time type generation pipeline so the POC Apps SDK manifest and bindings are produced alongside existing `@oaknational/oak-curriculum-sdk` outputs, ensuring strict adherence to the Cardinal Rule.
- Register the generated manifest within an Apps SDK playground project to invoke a minimal curriculum tool and a lightweight lesson-plan composition, demonstrating end-to-end calls with Oak resource IDs for traceability.
- Capture logs plus a brief walkthrough documenting the spike outcome; no legal, design, or OAuth work included.

### Phase 1 — Requirements Alignment

- Extract formal app metadata (name, description, categories) and ensure originality messaging respects guideline prohibitions on impersonation.
- Draft privacy policy addendum and support contact channel updates; ensure data sharing statements match actual telemetry practices.
- Map guideline clauses to internal controls (e.g. usage policies, fair play) and record ownership in an auditable checklist.

**Acceptance**: Traceability matrix completed; privacy policy draft reviewed; checklist stored alongside this plan.

### Phase 2 — Apps SDK Integration Architecture

- Choose hosting pathway (likely adapt `apps/oak-curriculum-mcp-streamable-http` for HTTPS reachability) and define Apps SDK manifest binding to existing MCP endpoints.
- Model tool exposure in Apps SDK components without widening types; rely on SDK-generated validators and avoid runtime schema duplication.
- Design user interaction flows that respect intent, provide predictable behaviour, and clearly label write actions per guidelines.

**Acceptance**: Architectural diagram updated in `docs/architecture/` (behavioural focus); interface contracts captured with type-safe wrappers derived from generated SDK exports.

### Phase 3 — Privacy and Data Governance

- Audit all inputs requested from users; minimise to exact parameters required by curriculum tools, avoiding location fields and sensitive categories.
- Validate that no code path reconstructs broader chat history; update tooling to enforce least-privilege resource access.
- Ensure logging/telemetry complies with disclosed practices; strip metadata collection not justified by the privacy policy.

**Acceptance**: Data flow diagrams updated; automated checks preventing sensitive field introduction land in `packages/libs/env` or relevant adapters; privacy review sign-off recorded.

### Phase 4 — Quality Gates and Testing

- Extend unit/integration suites to cover Apps SDK adapter logic using TDD; introduce deterministic fakes rather than live IO.
- Add E2E smoke tests exercising the Apps SDK flow via the MCP transport using the existing MCP client harness, keeping side effects isolated.
- Run full quality gates (`pnpm type-gen`, `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`) and document artefacts.

**Acceptance**: New tests live beside product code with clear behaviour proofs; continuous integration pipeline updated to cover Apps SDK scenarios without disabling any gates.

### Phase 5 — Submission Readiness

- Produce user-facing documentation (app listing copy, screenshots sourced from working features) and review for accuracy.
- Confirm developer verification steps (legal entity, support mailbox) and maintain update process for contact details.
- Package change log and operational runbook for ongoing maintenance, including triggers for resubmission when tools change.

**Acceptance**: Submission bundle prepared and peer-reviewed; operational runbook stored under `docs/development/` with escalation paths; re-submission protocol documented.

## Risk and Mitigation Summary

- **Type drift**: Mitigate by grounding all interfaces in `pnpm type-gen` outputs and failing build on manual schema changes.
- **Privacy non-compliance**: Embed automated schema linting to reject sensitive fields; schedule periodic reviews.pnpm
- **App review rejection**: Conduct pre-flight checklist reviews against guideline clauses and maintain evidence of each control.

## Next Steps

1. Appoint owners for each phase and create detailed task tickets referencing this plan.
2. Begin Phase 1 discovery sessions with legal/compliance stakeholders.
3. Schedule design review covering Apps SDK UX prior to implementation start.
