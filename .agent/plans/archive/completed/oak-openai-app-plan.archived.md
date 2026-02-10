# Oak OpenAI App Implementation Plan

> **⚠️ ARCHIVED**: This plan has been superseded by [Plan 08: OpenAI Apps SDK Feature Adoption](../sdk-and-mcp-enhancements/08-openai-apps-sdk-feature-adoption-plan.md).
>
> **Archive date**: 2025-11-30  
> **Reason**: Content consolidated into Plan 08 which provides comprehensive coverage of:
>
> - All original phases (POC, Requirements, Architecture, Privacy, Developer Mode, Rollout)
> - OpenAI Apps SDK feature adoption (CSP, widgets, token optimization)
> - Two-camp architecture (type-gen vs runtime tools)
> - Universal coverage requirements
>
> **Do not use this plan for new work.** Refer to Plan 08 instead.

---

## Context and References

- Aligns with the [OpenAI App Developer Guidelines](https://developers.openai.com/apps-sdk/app-developer-guidelines) requirements across purpose, safety, privacy, and verification.
- Must comply with `.agent/directives/rules.md` (Cardinal type rule, no type shortcuts, British spelling) and `.agent/directives/testing-strategy.md` (TDD-first, behaviour-focused proofs).
- Builds on existing MCP infrastructure (`apps/oak-curriculum-mcp-stdio`, `apps/oak-curriculum-mcp-streamable-http`, `apps/oak-notion-mcp`) and the compile-time generated SDK at `packages/sdks/oak-curriculum-sdk`.
- The OpenAI Apps SDK is currently in preview (Developer Mode required; publishing not yet open to the public). See the [OpenAI Apps SDK developer docs](https://developers.openai.com/docs/apps) for current guidance.

## Current State Assessment

1. **Tooling foundation**: MCP servers already expose curriculum tools generated from the Open Curriculum OpenAPI schema via `pnpm type-gen`, satisfying deterministic type flow and validation.
2. **Transport coverage**: STDIO and streaming HTTP transports exist, offering compatibility with connector hosts that the Apps SDK can reach.
3. **Testing posture**: Behaviour-focused unit, integration, and E2E suites exist per the testing strategy but require extension for Apps SDK UX flows.
4. **Documentation**: Internal guidance exists (`.agent/reference-docs/openai-apps-sdk-guidance.md`, `docs/architecture/README.md`), yet there is no end-to-end app submission playbook.
5. Confirmed HTTPS accessibility and spec compatibility of the MCP endpoint, suggesting use of the MCP Inspector for verification.

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

- **Goal:** Prove end‑to‑end invocation from ChatGPT (Developer Mode) to the existing MCP server over HTTPS, returning structured, summarizable results. No custom UI, **read‑only only**.

1. **Deploy streamable HTTP MCP server to a public HTTPS endpoint** (completed: <https://curriculum-mcp-alpha.oaknational.dev/mcp>)
   - **Intent:** Make the MCP endpoint reachable by ChatGPT's connector (no localhost).
   - **What you do:** Deploy `apps/oak-curriculum-mcp-streamable-http` (e.g., Vercel/Fly/Render) and expose `/mcp` over TLS. Verify cold‑start and latency are acceptable.
   - **Docs alignment:** See [Connect from ChatGPT](https://developers.openai.com/docs/apps/get-started/connect-from-chatgpt) (Developer Mode connector requires a publicly reachable MCP URL). _Help Center → Custom MCP connectors_ (HTTP(S) only).
   - **Pass/Fail:** `GET/POST` reachability to `/mcp` (handshake succeeds when ChatGPT connects); logs show `initialize`, `listTools`.

2. **Spec conformance + endpoint verification** (complete)
   - **Intent:** Catch protocol/schema issues before testing in ChatGPT.
   - **What you do:** Run **MCP Inspector** against the deployed URL; exercise `listTools` and a minimal `invoke` with sample params.
   - **Docs alignment:** See [MCP Inspector](https://developers.openai.com/docs/mcp/get-started/inspector) testing guidance.
   - **Pass/Fail:** All tools list with correct names/descriptions/schemas; `invoke` returns valid `structuredContent` and optional `content` without transport errors.

3. **Create Developer Mode connector and wire the chat**
   - **Intent:** Enable non‑engineers to try the app inside ChatGPT.
   - **What you do:** In ChatGPT → **Settings → Apps & Connectors → Create**, set **Name**, **Description** (include "when to use"), and **Connector URL** pointing to `https://…/mcp`. Open a new chat, click **+ → More…**, activate the connector, and run discovery prompts.
   - **Docs alignment:** See [Connect from ChatGPT](https://developers.openai.com/docs/apps/get-started/connect-from-chatgpt) (Developer Mode flow) and [Developer Mode Setup](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk).
   - **Pass/Fail:** Tools appear under the connector; invoking "search curriculum …" triggers your tool; response shows in chat; no admin/RBAC blockers for the chosen account.

4. **Minimal tool invocation tests (discovery & determinism)**
   - **Intent:** Validate that descriptions/schemas are sufficient for the model to choose the right tools, and results are stable.
   - **What you do:** Prepare 6–8 prompts (e.g., "Find KS3 science lessons on photosynthesis…") covering happy‑path, empty results, and invalid input. Confirm the model selects the correct tool, parameters align with schema, and outputs cite Oak resource IDs.
   - **Docs alignment:** See [Tool Discovery & Descriptions](https://developers.openai.com/docs/apps/guides/metadata).
   - **Pass/Fail:** ≥90% correct tool selection; no schema validation errors; responses include traceable IDs; assistant summaries match `structuredContent`.

5. **Fix STDIO tool description bug** ⚡ _5 minutes_
   - **Intent:** STDIO server currently overrides rich OpenAPI descriptions with "GET /path" strings, breaking ChatGPT tool discovery.
   - **What you do:** Update `apps/oak-curriculum-mcp-stdio/src/app/server.ts:170` to use `descriptor.description` instead of constructing generic path strings.
   - **File:** `apps/oak-curriculum-mcp-stdio/src/app/server.ts`
   - **Change:** Replace `const description = descriptor.method.toUpperCase() + ' ' + descriptor.path;` with `const description = descriptor.description ?? \`${descriptor.method.toUpperCase()} ${descriptor.path}\`;`
   - **Validation:** `pnpm --filter @oaknational/oak-curriculum-mcp-stdio test`
   - **Pass/Fail:** STDIO tools list shows descriptions matching OpenAPI schema (e.g., "This tool returns an array of all available subjects…" not "GET /subjects").

6. **Add MCP annotations to tool descriptors** ✅ _COMPLETE_
   - **Status:** See `.agent/plans/sdk-and-mcp-enhancements/01-mcp-tool-metadata-enhancement-plan.md` Phase 0
   - **Summary:** All 26 generated tools now have `annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }` and human-readable `title` fields.

7. **Expose outputSchema in tool registration** ➡️ _Consolidated_
   - **Status:** See `.agent/plans/sdk-and-mcp-enhancements/01-mcp-tool-metadata-enhancement-plan.md` Phase 5
   - **Summary:** Evaluation phase to determine if exposing `outputSchema` is beneficial given existing Zod validation.

8. **Create curriculum ontology resource** ➡️ _Consolidated_
   - **Status:** See `.agent/plans/sdk-and-mcp-enhancements/02-curriculum-ontology-resource-plan.md`
   - **Summary:** Two-layer architecture: schema-derived facts (auto-generated) + educational guidance (hand-authored).

9. **Add tool title field** ✅ _COMPLETE_
   - **Status:** See `.agent/plans/sdk-and-mcp-enhancements/01-mcp-tool-metadata-enhancement-plan.md` Phase 0
   - **Summary:** All tools now have `title` in annotations derived from tool name via `kebabToTitleCase`.

10. **Create golden prompt test suite** 📝 _2 hours_
    - **Intent:** Systematic evaluation of tool discovery following OpenAI metadata optimization guidance.
    - **What you do:** Create test dataset with direct prompts ("Find KS3 science lessons"), indirect prompts ("Help me teach photosynthesis to year 8"), and negative prompts ("Create a new lesson").
    - **File:** New `docs/development/openai-app-golden-prompts.md`
    - **Content:** Categorized prompts with expected tool selections and success criteria (≥90% accuracy).
    - **Validation:** Manual testing in ChatGPT Developer Mode; document results alongside prompts.
    - **Pass/Fail:** Tool selection accuracy meets threshold; negative prompts correctly avoid our tools.

11. **Logging + walkthrough capture**
    - **Intent:** Produce a shareable artifact proving viability and aiding support.
    - **What you do:** Capture connector creation screenshots, a short loom of a successful chat run, and server logs (sanitize IDs as needed). Store under `docs/development/`.
    - **Docs alignment:** General guidance for preview‑phase apps (no public store yet).
    - **Pass/Fail:** Reviewable bundle exists; others can reproduce the chat with the connector enabled.

### Phase 1 — Requirements Alignment

- Extract formal app metadata (name, description, categories) and ensure originality messaging respects guideline prohibitions on impersonation.
- Draft privacy policy addendum and support contact channel updates; ensure data sharing statements match actual telemetry practices.
- Map guideline clauses to internal controls (e.g. usage policies, fair play) and record ownership in an auditable checklist.
- **Docs alignment:** See [Apps SDK Overview](https://developers.openai.com/docs/apps).

**Acceptance**: Traceability matrix completed; privacy policy draft reviewed; checklist stored alongside this plan.

### Phase 2 — Apps SDK Integration Architecture

- Document hosting pathway using `apps/oak-curriculum-mcp-streamable-http` deployed at `https://curriculum-mcp-alpha.oaknational.dev/mcp`.
- Create architectural diagrams showing MCP tool exposure flow: OpenAPI schema → type-gen → SDK → MCP servers → ChatGPT.
- Design user interaction flows that respect intent and provide predictable behaviour; document expected tool composition patterns (e.g., search → get-lesson-summary → get-lesson-quiz for lesson planning).
- Model tool exposure patterns ensuring all types flow from SDK-generated validators; document any aggregated tools (search, fetch, ontology) and their composition strategy.
- Create tool interaction examples showing how ChatGPT should compose multiple tool calls to achieve common pedagogical workflows.
- **Docs alignment:** See [Tool Discovery & Descriptions](https://developers.openai.com/docs/apps/guides/metadata).

**Acceptance**: Architectural diagram created in `docs/architecture/openai-app-architecture.md` showing schema-first flow; tool composition patterns documented with examples; type-safety contracts verified via existing SDK exports.

### Phase 3 — Privacy and Data Governance

- Audit all inputs requested from users; minimise to exact parameters required by curriculum tools, avoiding location fields and sensitive categories.
- Validate that no code path reconstructs broader chat history; update tooling to enforce least-privilege resource access.
- Ensure logging/telemetry complies with disclosed practices; strip metadata collection not justified by the privacy policy.
- **Docs alignment:** See [Apps SDK Overview](https://developers.openai.com/docs/apps).

**Acceptance**: Data flow diagrams updated; automated checks preventing sensitive field introduction land in `packages/libs/env` or relevant adapters; privacy review sign-off recorded.

### Phase 4 — Developer Mode & Workspace Enablement

- Enable Developer Mode in ChatGPT settings.
- Use Settings → Apps & Connectors → Create to add the connector URL (the `/mcp` endpoint).
- Test via "+ More…" in chat to activate the app.
- Refresh metadata after MCP tool changes.
- Record workspace admin responsibilities (RBAC, developer access, connector management).
- **Docs alignment:** See [Developer Mode Setup](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk) for workspace configuration and connector creation.

### Phase 5 — Workspace Rollout Readiness

- Produce user-facing documentation (app listing copy, screenshots sourced from working features) and review for accuracy.
- Confirm developer verification steps (legal entity, support mailbox) and maintain update process for contact details.
- Package change log and operational runbook for ongoing maintenance, including triggers for resubmission when tools change.
- **Docs alignment:** See [Apps SDK Overview](https://developers.openai.com/docs/apps).

**Acceptance**: Submission bundle prepared and peer-reviewed; operational runbook stored under `docs/development/` with escalation paths; re-submission protocol documented.

## Risk and Mitigation Summary

- **Type drift**: Mitigate by grounding all interfaces in `pnpm type-gen` outputs and failing build on manual schema changes.
- **Privacy non-compliance**: Embed automated schema linting to reject sensitive fields; schedule periodic reviews.pnpm
- **App review rejection**: Conduct pre-flight checklist reviews against guideline clauses and maintain evidence of each control.
- **Distribution risk**: Apps SDK still in preview; restrict rollout to internal Developer Mode testers until submission opens.
- **Admin dependency**: Workspace admins must enable Developer Mode and approve connectors before testing.

## Next Steps

1. Appoint owners for each phase and create detailed task tickets referencing this plan.
2. Begin Phase 1 discovery sessions with legal/compliance stakeholders.
3. Create Developer Mode workspace in ChatGPT, connect the MCP endpoint, and validate discovery flows using internal testers.
