---
name: MCP Extensions Expert Specialist Plan (Advisor + Reviewer)
overview: Decision-complete MCP-first planning for post-merge extension research, specialist design, refactoring backlog, and ADR-aligned execution sequencing.
lastValidatedDate: 2026-02-23
todos:
  - id: premerge-tracks-consolidated-reference
    content: "Pre-merge prerequisite (Tracks 1a + 1b, Phases 0-5 including resilience hardening) completed 2026-02-22. Gate 3 passed."
    status: completed
  - id: research-source-refresh-and-link-health
    content: "Refresh mandatory and high-value source list, replace broken URLs, and maintain dated link-health evidence."
    status: pending
  - id: expert-sub-agent-specification
    content: "Define the mcp-extensions-expert specialist profile with inputs, outputs, escalation criteria, and review checklist."
    status: pending
  - id: refactor-backlog-definition
    content: "Define future refactoring backlog for metadata contract hardening, auth safety corrections, and parity controls."
    status: pending
  - id: feature-backlog-definition
    content: "Define additive post-prerequisite feature backlog with explicit dependency ordering and stop/go gates."
    status: pending
  - id: adr-matrix-and-gap-mapping
    content: "Map all required MCP and security ADRs into a compliance matrix with evidence paths, ownership, and closure gates."
    status: pending
  - id: quality-gates-and-exit-criteria
    content: "Define deterministic validation commands, stop/go gates, rollback path, and exit criteria."
    status: pending
isProject: false
---

# MCP Extensions Expert Specialist Plan (Advisor + Reviewer)

## Purpose and Value

This document provides a decision-complete plan for post-merge MCP
extensions work in the Oak ecosystem. Pre-merge widget stabilisation
(Tracks 1a + 1b, Phases 0-5) is complete and archived.

Legacy concept ingestion for this plan is governed by:

- [concept-preservation-and-supersession-map.md](concept-preservation-and-supersession-map.md)

Value delivered:

- Clear ownership and sequencing for SDK and HTTP MCP server teams.
- Explicit ADR compliance for MCP protocol, OAuth/security, and generator-first architecture.
- Reduced risk of stale planning assumptions through dated evidence and link-health checks.

## Foundation Recommitment
Before any phase starts, re-read and recommit to:
1. `.agent/directives/rules.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`

First question at each decision point:
- Could it be simpler without compromising quality?

Non-negotiables for this plan:
- Generator-first/schema-first for SDK and MCP contracts.
- No compatibility-layer sprawl in core execution paths.
- No skipped quality gates.
- No runtime API contract changes in this document rewrite step.

## Current State Evidence (Dated)

Evidence date baseline: 23 February 2026.

Confirmed current-state findings:

1. Stale completion metadata (corrected 2026-02-23):
   - Frontmatter todos were stale; now reset to reflect actual states.
2. Broken high-value source links:
   - `.agent/plans/sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md` contained five 404 URLs in the ext-apps API section.
3. OpenAI-coupled metadata emitted in generator:
   - `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.ts:142`
   - `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.ts:153`
4. Tool descriptor contract currently defines OpenAI-specific `_meta` keys:
   - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.ts:134`
5. Widget layer remains content-rich and renderer-heavy:
   - `apps/oak-curriculum-mcp-streamable-http/src/widget-renderer-registry.ts:17`
   - `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts:85`
6. Auth safety gap in tool auth checker:
   - `apps/oak-curriculum-mcp-streamable-http/src/tool-auth-checker.ts:43`
   - `apps/oak-curriculum-mcp-streamable-http/src/tool-auth-checker.ts:48`
   - Code assumes `securitySchemes` exists while docs describe safe-default behaviour when missing.
7. Widget URI generation parity drift:
   - `packages/sdks/oak-curriculum-sdk/type-gen/typegen/cross-domain-constants.ts:3`
   - `packages/sdks/oak-curriculum-sdk/type-gen/typegen/cross-domain-constants.ts:17`
   - Current local behaviour emits `local` hash token instead of per-run hash parity.

## Plan Split (Agreed)

Execution split across related files:

1. Pre-merge Tracks 1a + 1b:
   - Archived:
     [widget-search-rendering.md](../semantic-search/archive/completed/widget-search-rendering.md).
   - **Status**: COMPLETE (Phases 0-5, including Phase 5
     resilience hardening — error containment, JSON.stringify
     for JS generation, delegated click handlers, four-way
     sync enforcement). Completed 2026-02-22.
2. Post-merge Track 2:
   - This file.
   - Covers research, specialist specification, refactoring backlog, and future feature backlog.

Entry condition for this file:

- Pre-merge prerequisite is satisfied (Gate 3 passed).

## Domain A - Further Research Backlog
Objective:
- Standards and host-compatibility research only, with explicit evidence and confidence scoring.

Research outputs required:
1. Capability matrix:
   - MCP Apps standard primitives vs host-specific extensions.
2. Compatibility matrix:
   - ChatGPT, Cursor, Inspector, and generic MCP clients.
3. Risk register:
   - Metadata portability, auth bootstrap behaviour, resource hosting assumptions.
4. Confidence log:
   - Each major claim tagged High/Medium/Low confidence with source links.

Mandatory sources:
- https://modelcontextprotocol.io/extensions/overview
- https://modelcontextprotocol.io/extensions/apps/overview
- https://modelcontextprotocol.io/extensions/apps/build
- https://github.com/modelcontextprotocol/ext-apps
- https://modelcontextprotocol.github.io/ext-apps/api/
- https://developers.openai.com/apps-sdk
- https://developers.openai.com/apps-sdk/mcp-apps-in-chatgpt
- https://developers.openai.com/apps-sdk/quickstart
- https://developers.openai.com/apps-sdk/build/mcp-server
- https://developers.openai.com/apps-sdk/build/chatgpt-ui
- https://modelcontextprotocol.github.io/ext-apps/api/documents/Migrate_OpenAI_App.html

Additional high-value sources:
- https://modelcontextprotocol.io/extensions
- https://modelcontextprotocol.io/docs/extensions/apps
- https://modelcontextprotocol.github.io/ext-apps/api/documents/Quickstart.html
- https://modelcontextprotocol.github.io/ext-apps/api/documents/Overview.html
- https://modelcontextprotocol.github.io/ext-apps/api/functions/server-helpers.registerAppTool.html
- https://modelcontextprotocol.github.io/ext-apps/api/functions/server-helpers.registerAppResource.html
- https://github.com/modelcontextprotocol/ext-apps/tree/main/examples
- https://modelcontextprotocol.io/community/seps/2133-extensions
- https://github.com/modelcontextprotocol/modelcontextprotocol/pull/1865
- https://modelcontextprotocol.github.io/ext-apps/api/modules/app-bridge.html
- https://modelcontextprotocol.github.io/ext-apps/api/modules/server-helpers.html
- https://modelcontextprotocol.github.io/ext-apps/api/interfaces/server-helpers.McpUiAppToolConfig.html
- https://modelcontextprotocol.github.io/ext-apps/api/types/server-helpers.ResourceMetadata.html

Note: handler context details are documented in server-helpers API pages, centred on `registerAppTool`.
Link health checked on 22 February 2026.

## Domain B - Expert Sub-Agent Specification
Specialist identifier:
- `mcp-extensions-expert`

Role:
- Combined advisor and reviewer for MCP extensions architecture, host compatibility, and security boundary integrity.

Inputs:
1. Active plan document.
2. Relevant SDK and HTTP server source files.
3. ADR compliance matrix and gate outcomes.
4. Source evidence bundle from Domain A.

Outputs:
1. Advisory memo with recommended boundary decisions.
2. Review report with findings ranked by severity.
3. Gate recommendation: pass, pass-with-conditions, or block.

Escalation criteria:
1. Any conflict between accepted ADRs and implementation proposal.
2. Any proposal introducing host lock-in in the core MCP path.
3. Any auth or metadata behaviour that can break OAuth bootstrap.
4. Any generator/runtime parity drift with release impact.

Review checklist:
1. MCP-first portability.
2. Security and auth correctness.
3. Metadata contract clarity.
4. Widget safety and data-minimisation.
5. Testability and deterministic validation.

## Domain C - Future Refactoring Backlog
Objective:
- Architecture clean-up and safety corrections after Domain A and Domain B gates pass.

Refactor backlog items:
1. Metadata contract hardening:
   - Plan migration path from OpenAI-only `_meta` assumptions to host-neutral core metadata with generated host projections.
2. Tool descriptor contract decoupling:
   - Reduce mandatory OpenAI widget assumptions in the core descriptor contract.
3. Auth safety correction:
   - Defensive handling when `securitySchemes` is absent.
4. URI parity hardening:
   - Enforce generated/runtime widget URI parity checks.
5. Renderer stack simplification:
   - Keep shell-only baseline until explicit feature gate allows reintroduction.

Public API/interface/type implications (plan-level, future tasks only):
1. Immediate rewrite step: no runtime API change.
2. Likely future interface changes:
   - `ToolDescriptor['_meta']` evolves from OpenAI-only keys to canonical host-neutral metadata plus generated host-specific projections.
   - Core contract removes mandatory OpenAI widget assumptions.
   - Auth helper logic handles absent `securitySchemes` defensively.
3. These are future implementation tasks and are not performed in this rewrite.

Dependency order:
- Domain A complete -> Domain B complete -> Domain C starts.

## Domain D - Future Feature-Creation Backlog
Objective:
- Additive feature work only after Domains A to C pass all required gates.

Feature backlog candidates:
1. Controlled reintroduction of richer widget behaviours behind explicit gates.
2. Standard-first MCP Apps capability expansion with optional adapters.
3. Search UX reintroduction aligned with new search backend and hard safety controls.
4. Host capability enhancements only where MCP-first fallback is preserved.

Feature readiness conditions:

1. Pre-merge Tracks 1a and 1b complete (satisfied 2026-02-22).
2. ADR matrix gaps owned and scheduled.
3. Refactor backlog critical items complete.
4. Security sign-off from specialist checklist.

## ADR Compliance Matrix
Policy:
- Accepted ADRs are binding.
- Superseded ADRs are context checks only.
- Proposed ADRs are context only.

| ADR | Status | Binding Rule | Evidence | Gap | Planned Action | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| ADR-026 | Accepted | Type generation remains OpenAPI-driven | `docs/architecture/architectural-decisions/026-openapi-type-generation-strategy.md` | None confirmed | Keep generator-first changes only | Gate 2 |
| ADR-029 | Accepted | No manual API data in MCP | `docs/architecture/architectural-decisions/029-no-manual-api-data.md` | Risk if runtime metadata forks | Keep metadata evolution in generator templates | Gate 2 |
| ADR-030 | Accepted | SDK is single source of truth | `docs/architecture/architectural-decisions/030-sdk-single-source-truth.md` | None confirmed | Ensure refactor backlog references SDK source points | Gate 2 |
| ADR-035 | Accepted | Unified SDK-MCP type generation | `docs/architecture/architectural-decisions/035-unified-sdk-mcp-type-generation.md` | None confirmed | Preserve unified generation boundary | Gate 2 |
| ADR-036 | Accepted | Data-driven generation pattern | `docs/architecture/architectural-decisions/036-data-driven-type-generation.md` | None confirmed | Keep contract changes data-driven | Gate 2 |
| ADR-038 | Accepted | Compile-time embedded validation | `docs/architecture/architectural-decisions/038-compilation-time-revolution.md` | None confirmed | Avoid runtime contract inference layers | Gate 2 |
| ADR-043 | Accepted | CI/build determinism for generated artefacts | `docs/architecture/architectural-decisions/043-typegen-in-build-and-ci.md` | Potential parity drift in widget URI handling | Add explicit parity check backlog item | Gate 6 |
| ADR-046 | Accepted | Single `/mcp` transport with universal tools | `docs/architecture/architectural-decisions/046-openai-connector-facades-in-streamable-http.md` | None confirmed | Preserve single-surface assumption | Gate 2 |
| ADR-047 | Accepted | Type-gen canonical URL generation | `docs/architecture/architectural-decisions/047-canonical-url-generation-at-typegen-time.md` | None confirmed | Reuse generator-time pattern for URI parity checks | Gate 5 |
| ADR-058 | Accepted | Model-visible context grounding design | `docs/architecture/architectural-decisions/058-context-grounding-for-ai-agents.md` | Widget simplification can remove model hints if unmanaged | Keep model-facing hints outside widget payload | Gate 3 |
| ADR-060 | Accepted | Agent support metadata single-source pattern | `docs/architecture/architectural-decisions/060-agent-support-metadata-system.md` | None confirmed | Reuse single-source approach for specialist metadata | Gate 4 |
| ADR-061 | Accepted | Widget CTA system architecture | `docs/architecture/architectural-decisions/061-widget-cta-system.md` | Hard-block shell mode temporarily conflicts with CTA richness | Defer CTA-rich behaviour to Domain D | Gate 5 |
| ADR-071 | Accepted | Type-gen widget URI cache-busting simplification | `docs/architecture/architectural-decisions/071-widget-uri-cache-busting-simplification.md` | Current local hash behaviour diverges from ADR wording | Add explicit local/prod parity decision in Domain D | Gate 5 |
| ADR-107 | Accepted | Deterministic SDK, NL in MCP layer | `docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md` | None confirmed | Keep NL behaviour out of SDK core refactors | Gate 5 |
| ADR-112 | Accepted | Per-request MCP transport | `docs/architecture/architectural-decisions/112-per-request-mcp-transport.md` | None confirmed | Preserve stateless per-request assumptions | Gate 2 |
| ADR-113 | Accepted | Auth for all MCP methods except defined public routes | `docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md` | Tool auth checker defensive gap | Add Domain C auth safety fix | Gate 3 |
| ADR-005 | Accepted | Automatic PII scrubbing | `docs/architecture/architectural-decisions/005-automatic-pii-scrubbing.md` | None confirmed | Preserve data-minimisation in widget plan | Gate 3 |
| ADR-032 | Accepted | Explicit external-boundary validation | `docs/architecture/architectural-decisions/032-external-boundary-validation.md` | None confirmed | Keep boundary validation in auth/resource paths | Gate 3 |
| ADR-051 | Accepted | Structured single-line logging | `docs/architecture/architectural-decisions/051-opentelemetry-compliant-logging.md` | None confirmed | Keep structured logging in future refactor work | Gate 6 |
| ADR-052 | Accepted | OAuth 2.1 model for HTTP transport | `docs/architecture/architectural-decisions/052-oauth-2.1-for-mcp-http-authentication.md` | None confirmed | Preserve OAuth flow assumptions | Gate 2 |
| ADR-053 | Accepted | Clerk as IdP/AS | `docs/architecture/architectural-decisions/053-clerk-as-identity-provider.md` | None confirmed | Maintain provider assumptions unless explicit ADR update | Gate 2 |
| ADR-054 | Accepted | Tool-level auth error interception | `docs/architecture/architectural-decisions/054-tool-level-auth-error-interception.md` | None confirmed | Preserve interception path during refactor | Gate 3 |
| ADR-057 | Accepted | Selective auth for approved public resources | `docs/architecture/architectural-decisions/057-selective-auth-public-resources.md` | Widget URI and public resource list must stay aligned | Keep URI parity checks and public list tests | Gate 3 |
| ADR-078 | Accepted | Dependency injection for testability | `docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md` | None confirmed | Keep test plans DI-first, no global state mutation | Gate 6 |
| ADR-111 | Accepted | Secrets scanning quality gate | `docs/architecture/architectural-decisions/111-secret-scanning-quality-gate.md` | None confirmed | Keep secrets scan in quality gate sequence | Gate 6 |
| ADR-115 | Accepted | Proxy OAuth AS for Cursor compatibility | `docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md` | None confirmed | Preserve same-origin OAuth metadata assumptions | Gate 2 |
| ADR-116 | Accepted | resolveEnv pipeline architecture | `docs/architecture/architectural-decisions/116-resolve-env-pipeline-architecture.md` | None confirmed | Keep env handling assumptions in future implementation plans | Gate 6 |
| ADR-056 | Superseded by ADR-113 | Context only; do not reintroduce discovery auth bypass pattern | `docs/architecture/architectural-decisions/056-conditional-clerk-middleware-for-discovery.md` | Historical conflict risk | Keep as anti-pattern reference only | Gate 2 |
| ADR-037 | Superseded by ADR-038 | Context only; do not use superseded dynamic-dispatch pattern | `docs/architecture/architectural-decisions/037-embedded-tool-information.md` | Historical conflict risk | Keep compile-time approach from ADR-038 | Gate 2 |
| ADR-016 | Superseded by ADR-116 | Context only; use resolveEnv pipeline model | `docs/architecture/architectural-decisions/016-dotenv-for-configuration.md` | Historical conflict risk | Keep modern env pipeline assumptions | Gate 6 |
| ADR-017 | Superseded by ADR-051 | Context only; do not regress logger architecture | `docs/architecture/architectural-decisions/017-consola-for-logging.md` | Historical conflict risk | Keep ADR-051 logging pattern | Gate 6 |
| ADR-050 | Proposed | Context only; not binding until accepted | `docs/architecture/architectural-decisions/050-mcp-tool-layering-dag.md` | Status not accepted | Use only as directional architecture guidance | Gate 2 |

## Gates, Stop/Go, Rollback
Gate 0 - Foundation recommitment complete:
- Stop if foundation directives are not re-read and acknowledged.
- Go when recommitment and first-question checks are recorded.

Gate 1 - Source hygiene complete:
- Stop on any broken source URL.
- Go when all listed URLs return 200, 301, or 302.

Gate 2 - ADR matrix complete:
- Stop if any required ADR is missing or has no owner/action/gate.
- Go when all required ADR rows are present with evidence and planned action.

Gate 3 - Pre-merge prerequisite complete:
- Stop if Tracks 1a and 1b are not complete (including Phase 5 resilience hardening).
- Go when the consolidated pre-merge plan is explicitly marked ready (all phases complete).
- Rollback: return this file to blocked state if pre-merge scope reopens.
- **Current status**: PASSED — all phases (0-5) complete, 2026-02-22.

Gate 4 - Specialist profile complete:
- Stop if escalation criteria or review checklist are incomplete.
- Go when `mcp-extensions-expert` profile is fully specified.

Gate 5 - Backlog separation complete:
- Stop if refactor and feature work are mixed or unordered.
- Go when Domain C and Domain D are dependency-ordered and distinct.
- Rollback: return feature items to blocked status and reopen Domain C tasks.

Gate 6 - Quality and exit readiness complete:
- Stop if validation commands or exit criteria are incomplete.
- Go when quality section and exit criteria are fully checkable.

## Quality Gates and Validation Commands
Document integrity:
```bash
pnpm markdownlint:root
```

Link health check over all URLs in this plan (allow 200/301/302 only):
```bash
node - <<'NODE'
const fs = require('fs');
const cp = require('child_process');
const file = '.agent/plans/sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md';
const urls = [...new Set((fs.readFileSync(file, 'utf8').match(/https?:\/\/[^\s)]+/g) || []))];
const bad = [];
for (const url of urls) {
  const code = cp.execSync(`curl -I -L -o /dev/null -s -w "%{http_code}" ${JSON.stringify(url)}`)
    .toString()
    .trim();
  if (!['200', '301', '302'].includes(code)) bad.push({ url, code });
}
if (bad.length > 0) {
  console.error(JSON.stringify(bad, null, 2));
  process.exit(1);
}
console.log(`OK: ${urls.length} urls validated`);
NODE
```

ADR coverage checks:
```bash
rg -n "^\\| ADR-" .agent/plans/sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md
```

Post-prerequisite quality checks (planned future-code readiness):
```bash
rg -n "securitySchemes" apps/oak-curriculum-mcp-streamable-http/src/tool-auth-checker.ts

rg -n "WIDGET_URI|BASE_WIDGET_URI|openai/outputTemplate" \
  packages/sdks/oak-curriculum-sdk/src \
  packages/sdks/oak-curriculum-sdk/type-gen \
  apps/oak-curriculum-mcp-streamable-http/src
```

Future-code readiness checks to preserve in downstream implementation plans:

1. Metadata contract tests for host-neutral core plus host projections.
2. Auth safety tests for missing `securitySchemes`.
3. URI parity tests for generated and runtime widget URI alignment.

## Risks and Mitigations
| Risk | Impact | Mitigation | Owner |
| --- | --- | --- | --- |
| Scope bleed from pre-merge into post-merge plan | Delays and ownership confusion | Pre-merge scope complete and archived; gate satisfied | Plan owner |
| Reintroduction of broken references | Research drift and weak evidence | Keep dated link-health command in quality gates | Research owner |
| ADR omissions | Hidden architecture conflicts | Use explicit ADR matrix with required list and gate ownership | Architecture owner |
| Host lock-in in core path | Reduced portability | Keep MCP-first baseline and adapter boundary only | Specialist reviewer |
| Auth behaviour regression | OAuth bootstrap failures | Preserve ADR-113 and ADR-115 constraints in refactor backlog | Security owner |
| Generator/runtime drift | Release-time widget or metadata failures | Add parity checks and gate before feature rollout | SDK owner |

## Exit Criteria

1. Frontmatter todos reset to realistic states and include required ids.
2. `lastValidatedDate` is current.
3. Document structure follows required section order.
4. Domain A to D are explicitly separated with dependency ordering.
5. Source list refreshed with broken links replaced.
6. One-line dated link-health note included.
7. ADR matrix includes all required binding and context ADRs with evidence and gates.
8. Public API/interface implications are stated as future tasks only.
9. Quality gates and deterministic validation commands are present.
10. Stop/go and rollback logic is explicitly documented.
11. Pre-merge prerequisite (Tracks 1a + 1b) is complete and archived; this file stays post-merge only.

## Assumptions and Defaults

1. Date baseline for this review is 23 February 2026.
2. MCP and security ADR review treats accepted ADRs as binding and superseded ADRs as context.
3. Widget prerequisite work (Tracks 1a and 1b) is complete and archived.
4. `/mcp` remains the single transport surface.
5. Public resource auth bypass remains constrained to ADR-057 and ADR-113 scope only.
6. Generator-first/schema-first remains non-negotiable for SDK and MCP contract work.
